const dotenv = require('dotenv')
dotenv.config()

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

// Middleware to parse JSON and URL-encoded data
// This is necessary for handling incoming requests with JSON payloads or form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
// This allows us to serve static assets like images, CSS, and JavaScript files
app.use(express.static('public'));


// Event emitter for database connection
// This allows us to listen for events related to the database connection
const events = require('events');
const eventEmitter = new events.EventEmitter();

// Load configuration
global._config = require('./config/config.js');

// Testing request
app.get('/', (req, res) => {
    res.send('Node Server Running! Mental Health App');
});


const FAQsRouter = require('./routers/faqs.js');
const ProblemFocusedRouter = require('./routers/problemFocused.js');
const HealthyLifestyleRouter = require('./routers/healthyLifestyle.js');
const EducationResourcesRouter = require('./routers/educationResources.js');
const MindfulnessVideosRouter = require('./routers/mindfulnessVideos.js');
const CategoryRouter = require('./routers/category.js');
const EmergencyResourcesRouter = require('./routers/emergencyResources.js');
const SupportResourcesRouter = require('./routers/supportResources.js');
const UserRouter = require('./routers/user.js');
const AdminRouter = require('./routers/admin.js');
const MoodRouter = require('./routers/mood.js');
const HospitalRouter = require('./routers/hospital.js');


app.use('/api/faq', FAQsRouter);
app.use('/api/problem-focused', ProblemFocusedRouter);
app.use('/api/healthy-lifestyle', HealthyLifestyleRouter);
app.use('/api/education-resources', EducationResourcesRouter);
app.use('/api/mindfulness-videos', MindfulnessVideosRouter);
app.use('/api/category', CategoryRouter);
app.use('/api/emergency-resources', EmergencyResourcesRouter);
app.use('/api/support-resources', SupportResourcesRouter);
app.use('/api/user', UserRouter);
app.use('/api/admin', AdminRouter);
app.use('/api/mood', MoodRouter);
app.use('/api/hospital', HospitalRouter);

// Database connection
const db = require('./db/database.js')(eventEmitter);
eventEmitter.once('db-connection-established', () => {
    console.log('Database connection established.')
});

module.exports= app;
