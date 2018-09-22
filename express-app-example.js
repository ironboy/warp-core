/* 
  The express app is a global called app
  It can respond on all routes under /api
*/
let app = global.expressApp;

// Some data for the  example app
app.get('/todo-list-data',(req, res) => {
  res.json([
    {todo: 'Buy milk', done: false},
    {todo: 'Pickup children', done: false},
    {todo: 'Make dinner', done: false}
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
