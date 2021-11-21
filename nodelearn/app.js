const http = require('http');
const fs = require('fs');
const { parse } = require('querystring');

const crud = require('../crudmongo.js');

const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        let body = '';
      req.on('data', chunk => {
          body += chunk.toString(); // convert Buffer to string
      });
      req.on('end', () => {
          let recipe = parse(body);
          console.log(recipe);
          crud.createRecipe(recipe);
          res.end('ok');
      });
    }
    else {
      fs.readFile('./nodelearn/demo.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
      });
    }
});

server.listen(3000, '127.0.0.1', () => {
  console.log(`Server running at http://127.0.0.1:3000/`);
});

