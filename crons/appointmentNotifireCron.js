const cron = require('node-cron');
const { DateTime } = require('luxon');
const { AppointmentModel } = require('../models');
const BaseRepo = require('../services/BaseRepository');


// Schedule the job to run every 10 minutes
const notifyUpcomingAppointments = () => {
  cron.schedule('*/1 * * * *', async () => {
    console.log(`[${new Date().toISOString()}] Running job: notifyUpcomingAppointments`);

    // Call cron after 1 hours 
    // Get Appointment data from DB 
    // Check if there is an appointment in 2 hours
    // Find the user id 
    // Get user details from the user table 
    // Send Notification to the Users. 


    const nowSA = DateTime.now().setZone('Africa/Johannesburg');
    const twoHoursLaterSA = nowSA.plus({ hours: 2 });

    // 1. Get today's date range in SA timezone
    const startOfDay = nowSA.startOf('day').toISO();     // 2025-08-06T00:00:00+02:00
    const endOfDay = nowSA.endOf('day').toISO();         // 2025-08-06T23:59:59+02:00

    const appointments = await BaseRepo.baseAppointmentAfterTwoHors(AppointmentModel, startOfDay, endOfDay);

    console.log('Appointments:', appointments);

    // 2. Filter by appointments starting or ongoing within 2 hours
    const upcomingAppointments = appointments.filter(appt => {
      // Split the time string (e.g., "12:00 PM to 01:00 PM")
      const [startRaw, endRaw] = appt.appointment_time.split(' to ');

      if (!startRaw || !endRaw) return false; // skip invalid entries

      // Parse times
      const startTime = DateTime.fromFormat(startRaw.trim(), 'hh:mm a', {
        zone: 'Africa/Johannesburg',
      });
      const endTime = DateTime.fromFormat(endRaw.trim(), 'hh:mm a', {
        zone: 'Africa/Johannesburg',
      });

      // Combine with the appointment date
      const appointmentDate = DateTime.fromJSDate(appt.appointment_date, {
        zone: 'Africa/Johannesburg',
      });

      const startDateTime = appointmentDate.set({
        hour: startTime.hour,
        minute: startTime.minute,
      });

      const endDateTime = appointmentDate.set({
        hour: endTime.hour,
        minute: endTime.minute,
      });

      // Debug logs
      console.log(`Start: ${startDateTime.toISO()}, End: ${endDateTime.toISO()}, Now: ${nowSA.toISO()}, +2hrs: ${twoHoursLaterSA.toISO()}`);

      // Check if current time is between start and end (ongoing)
      // OR if the appointment is starting within the next 2 hours
      return (
        (nowSA >= startDateTime && nowSA <= endDateTime) || // ongoing
        (startDateTime > nowSA && startDateTime <= twoHoursLaterSA) // upcoming
      );
    });

    console.log('Appointments in next 2 hours:', upcomingAppointments);
  });
};

module.exports = notifyUpcomingAppointments;