const handler = require('serve-handler');
const http = require('http');
const resolve = require('path').resolve

var givenPath = (process.argv.length > 2) ? process.argv[2] : "."
var publicFolder = resolve(givenPath)
console.log(`Using public folder: ${publicFolder}`)
const server = http.createServer((request, response) => {
  return handler(request, response, { public: publicFolder });
});

server.listen(3000, () => {
  console.log('Running static react server at http://localhost:3000');
});