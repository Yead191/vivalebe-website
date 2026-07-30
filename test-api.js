const http = require('http');

http.get('http://10.10.26.159:5000/api/v1/user/6a671eb0515e4e50f9269c9c', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('Response:', data);
  });
}).on('error', (err) => {
  console.log('Error:', err.message);
});
