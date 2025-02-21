const { initializeBot } = require('./telegramBot');
const config = require('./config');

// Ініціалізація Telegram бота
initializeBot(config.telegramBotToken);

console.log('Telegram bot is running. Use commands in Telegram to start/stop the Minecraft bot.');