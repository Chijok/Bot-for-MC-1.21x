# Bot-for-MC-1.21x
## Appointment
- Eternal online on free hosting (Aternos)
- The possibility of adding different parts of the code for auto digging and so on
- Work on new versions of Minecraft
## Creation
### 1. Installing libraries
```bash
npm install minecraft-protocol
```
### 2. Writing code
```javascript
const mc = require('minecraft-protocol');

const client = mc.createClient({
    host: 'localhost', // Server ip
    port: 25565, // Port of your server
    username: 'bot', // Username of your bot
    version: '1.20.1' // Your server version 
});

client.on('login', () => {
    console.log('Bot has logged in.');
});
```
Or download finished project 
### 3. Launching 
```bash
node index.js
// or your file name
```
