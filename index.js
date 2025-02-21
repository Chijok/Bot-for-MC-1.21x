
const mc = require('minecraft-protocol');

// Налаштування підключення до сервера
const options = {
  host: 'ChFriends.aternos.me', 
  // адреса вашого сервера Minecraft
  port: 63081,
  // стандартний порт для Minecraft
  username: 'BoBeR',
  // ім'я користувача для бота
  auth: 'offline',
  // спосіб авторизації
  version: '1.21.1'
  // версія гри
};

// Створення клієнта
const client = mc.createClient(options)

// Обробник події при успішному підключенні
client.on('connect', () => {
  console.log('Bot has connected to the server.');
});
