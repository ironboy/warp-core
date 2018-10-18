/* 
  The express app is a global called app
  It can respond on all routes under /api
*/
let app = global.expressApp;


// Set up socket.io
const io = require('socket.io')(
  global.httpServer, 
  {
    path: global.production ? '/api' : '/',
    serveClient: false
  }
);

// Basic test of socket.io connectivity
io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});


// Some example data for the Todo app
app.get('/todo-list-example-data',(req, res) => {
  res.json([
    {
      "id": 0.14890674152580785,
      "todo": "Create a project with React Warp Core",
      "done": true
    },
    {
      "id": 0.7582486745257166,
      "todo": "Run npm start",
      "done": true
    },
    {
      "id": 0.4867703766375038,
      "todo": "Continue testing",
      "done": false
    },
    {
      "id": 0.6641145526555352,
      "todo": "Understand the code"
    },
    {
      "id": 0.3006365270288174,
      "todo": "Build something awesome"
    },
    {
      "id": 0.6973592500276979,
      "todo": "Start testing the Todo app",
      "done": true
    }
  ]);
});

// Answer hello world on all routes
app.all('*', (req, res) => {
  res.json({
    message: 'Hello world!',
    method: req.method,
    url: req.url
  });
});
