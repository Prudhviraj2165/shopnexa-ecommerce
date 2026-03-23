const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/products/69c0c2e997c0ebf3f2fdacdd/reviews',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.setEncoding('utf8');
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => console.log(`BODY: ${data}`));
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.write(JSON.stringify({ rating: 5, comment: 'Test!' }));
req.end();
