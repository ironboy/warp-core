const express = require('express');
const compression = require('compression');
const path = require('path');
const server = express();

// gzip files
server.use(compression());

// express backend
global.expressApp = express();
server.use('/api', expressApp);

// react frontend
server.use(express.static(path.join(__dirname, 'web-root-static')));
server.use((req, res) => {
  res.sendFile(path.join(__dirname, 'web-root-static', 'index.html'));
});

// start the server
global.httpServer = server.listen(5000, () => console.log('Server listening on port 5000'));

// a flag to tell us that we are runing in production mode
global.production = true;

// start the main app
require(path.join(__dirname, 'express', 'app.js'));