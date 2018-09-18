/* 
  The express app is a global called app
  It can respond on all routes under /api
*/
app.all('*', (req, res) => {
  res.json({
    message: 'Hello world!',
    method: req.method,
    url: req.url
  });
});
