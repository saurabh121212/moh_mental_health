// sendNotification.js
const admin = require('./firebase'); // Import the initialized Firebase admin instance
// const admin = require('firebase-admin');

async function sendNotification(message) {
  try {
    const response = await admin.messaging().sendEachForMulticast(message);

    response.responses.forEach((resp, idx) => {
      if (resp.success) {
        console.info(`✅ Token ${idx} success`);
      } else {
        console.warn(`❌ Token ${idx} failed:`, resp.error.message);
      }
    });

    console.info(`📊 Success: ${response.successCount}, Failure: ${response.failureCount}`);
  } catch (error) {
    console.error('🔥 Error sending multicast notification:', error.message);
  }
}

module.exports = sendNotification;
