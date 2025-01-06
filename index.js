
const mc = require('minecraft-protocol');

// Connection 
const options = {
  host: 'localhost', // your ip
  port: 35565,       // your port
  username: 'Bot',   // bot nickname
  auth: 'offline',
  version: '1.21.1'  // game version of server
};

// creating client
const client = mc.createClient(options)

// connection massage 
client.on('connect', () => {
  console.log('Bot has connected to the server.');
})
