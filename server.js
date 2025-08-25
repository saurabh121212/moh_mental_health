const http = require('http');
const app = require('./app');
const port = process.env.PORT || 3001;

const server = http.createServer(app);

const startCronJobs = require('./crons/index.js');
startCronJobs();

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});