
const mc = require('minecraft-protocol');

// Налаштування підключення до сервера
const options = {
  host: 'moonfish.aternos.host', // адреса вашого сервера Minecraft
  port: 64173,       // стандартний порт для Minecraft
  username: 'BoBeR',   // ім'я користувача для бота
  auth: 'offline',
  version: '1.21.1'  // версія гри
};

// Створення клієнта
const client = mc.createClient(options)

// Обробник події при успішному підключенні
client.on('connect', () => {
  console.log('Bot has connected to the server.');
})
