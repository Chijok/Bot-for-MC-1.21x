const { initializeBot } = require('./telegramBot');
const config = require('./config');

initializeBot(config.telegramBotToken);