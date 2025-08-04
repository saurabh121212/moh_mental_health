const notifyUpcomingAppointments = require('./appointmentNotifireCron');

const startCronJobs = () => {
    notifyUpcomingAppointments();
};

module.exports = startCronJobs;  