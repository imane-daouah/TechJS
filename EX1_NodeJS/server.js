const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
  console.log(`Requête reçue : ${req.url}`);

  let filePath = path.join(__dirname, 'public', req.url === '/' ? 'home.html' : req.url + '.html');

 
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      
      fs.readFile(path.join(__dirname, 'public', '404.html'), (err, content) => {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(content);
      });
    } else {
      
      fs.readFile(filePath, (err, content) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('Erreur interne du serveur');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(content);
        }
      });
    }
  });
});

server.listen(PORT, () => {
  console.log(` Serveur démarré sur http://localhost:${PORT}`);
});
