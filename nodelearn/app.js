const http = require('http');
const url = require('url');
const fs = require('fs');

const dt = require('./firstmodule');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  fs.readFile('demo.html', function(err, data) {
    if (req.method == 'POST' && req.url == '/createRecipe') {
      
    }
    res.writeHead(200, {'Content-Type': 'text/html'});
    // var q = url.parse(req.url, true).query;
    // var txt = q.recipe + " " + q.user;
    res.write(data);
    return res.end();
  });
});


server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});