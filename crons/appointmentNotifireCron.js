const cron = require('node-cron');

// Schedule the job to run every 10 minutes
const notifyUpcomingAppointments = () => {
  cron.schedule('*/1 * * * *', async () => {
    console.log(`[${new Date().toISOString()}] Running job: notifyUpcomingAppointments`);

    // Logic goes here (e.g., fetch from DB, process records)


    // For demo purposes:
    console.log("→ This would notify users with appointments in 2 hours");
  });
};

module.exports = notifyUpcomingAppointments;