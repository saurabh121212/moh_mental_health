const cron = require('node-cron');
const { DateTime } = require('luxon');
const { AppointmentModel, UserModel } = require('../models');
const BaseRepo = require('../services/BaseRepository');
const sendNotification = require('../firebase/sendNotification');
const admin = require('firebase-admin');

// Schedule the job to run every 10 minutes
const notifyUpcomingAppointments = () => {
  cron.schedule('0 * * * *', async () => {
    console.log(`[${new Date().toISOString()}] Running job: notifyAppointments`);

    const nowSA = DateTime.now().setZone('Africa/Johannesburg');
    const twoHoursLater = nowSA.plus({ hours: 2 });
    const fortyEightHoursLater = nowSA.plus({ hours: 48 });

    // 1. Get appointments for the next 48 hours
    const appointments = await BaseRepo.baseAppointmentAfterTwoHors(
      AppointmentModel,
      nowSA.toISO(),
      fortyEightHoursLater.toISO()
    );

    console.log("Appointments to notify:", appointments[0].dataValues);

    for (const appt of appointments) {
      const [startRaw] = appt.appointment_time.split(' to ');
      if (!startRaw) continue;

      const startTime = DateTime.fromFormat(startRaw.trim(), 'hh:mm a', { zone: 'Africa/Johannesburg' });

      const appointmentDate = DateTime.fromJSDate(appt.appointment_date, { zone: 'Africa/Johannesburg' });
      const startDateTime = appointmentDate.set({ hour: startTime.hour, minute: startTime.minute });

      // --- 48h Reminder ---
      if (
        startDateTime > fortyEightHoursLater.minus({ minutes: 59 }) && // within the last hour window
        startDateTime <= fortyEightHoursLater &&
        !appt.notified48h
      ) 
      {
        const user = await UserModel.findByPk(appt.user_id)
        //console.log("User found:", user.dataValues);
        const token = user.dataValues.device_token;

        // Send a appointment confirmation Notification to the user
        const message = {
          notification: {
            title: "Upcoming Appointment",
            body: `Hi! Just a reminder that you have an appointment in 2 days at ${appt.hospital_name}. Please arrive on time.`,
          },
          data: {
            notificationType: "appointment",
          },
          token
        };
        try {
          const response = await admin.messaging().send(message);
          console.info('✅ Notification sent successfully:', response);
        } catch (error) {
          console.error('❌ Error sending notification:', error.message);
        }
        await appt.update({ notified48h: true });
        console.log(`Sent 48h reminder for appointment ${appt.id}`);
      }

      // --- 2h Reminder ---
      if (
        startDateTime > twoHoursLater.minus({ minutes: 59 }) &&
        startDateTime <= twoHoursLater &&
        !appt.notified2h
      ) {
        const user = await UserModel.findByPk(appt.user_id)
        //console.log("User found:", user.dataValues);
        const token = user.dataValues.device_token;

        // Send a appointment confirmation Notification to the user
        const message = {
          notification: {
            title: "Upcoming Appointment",
            body: `Hi! This is a reminder that your appointment at ${appt.hospital_name} is in 2 hours. Please be on time.`,
          },
          data: {
            notificationType: "appointment",
          },
          token
        };
        try {
          const response = await admin.messaging().send(message);
          console.info('✅ Notification sent successfully:', response);
        } catch (error) {
          console.error('❌ Error sending notification:', error.message);
        }
        await appt.update({ notified2h: true });
        console.log(`Sent 2h reminder for appointment ${appt.id}`);
      }
    }
  });
};

module.exports = notifyUpcomingAppointments;
