const { Telegraf } = require('telegraf');
const config = require('./config');
const mc = require('minecraft-protocol');
const fs = require('fs');

let bot;
let minecraftClient = null;
let isMinecraftBotConnected = false;

function saveConfig() {
    fs.writeFile('./config.js', `module.exports = ${JSON.stringify(config, null, 2)}`, (err) => {
        if (err) {
            console.error('Помилка при збереженні конфігурації:', err);
        } else {
            console.log('Конфігурація успішно збережена.');
        }
    });
}

function initializeBot(token) {
    bot = new Telegraf(token);
    bot.start((ctx) => ctx.reply('Вітаю! Я бот для управління Minecraft ботом. Використовуйте команди для налаштування.'));

    // Команда для встановлення IP
    bot.command('setip', (ctx) => {
        if (isMinecraftBotConnected) {
            ctx.reply('Неможливо змінити IP: Minecraft бот уже підключений до сервера. Спочатку зупиніть бота командою /stopmc.');
        } else {
            const ip = ctx.message.text.split(' ')[1];
            if (ip) {
                config.mcServerIP = ip;
                saveConfig();
                ctx.reply(`IP сервера встановлено: ${ip}`);
            } else {
                ctx.reply('Будь ласка, вкажіть IP після команди, наприклад: /setip trumpetfish.aternos.host');
            }
        }
    });

    // Команда для встановлення порту
    bot.command('setport', (ctx) => {
        if (isMinecraftBotConnected) {
            ctx.reply('Неможливо змінити порт: Minecraft бот уже підключений до сервера. Спочатку зупиніть бота командою /stopmc.');
        } else {
            const port = ctx.message.text.split(' ')[1];
            if (port && !isNaN(port)) {
                config.mcServerPort = parseInt(port);
                saveConfig();
                ctx.reply(`Порт сервера встановлено: ${port}`);
            } else {
                ctx.reply('Будь ласка, вкажіть порт після команди, наприклад: /setport 63081');
            }
        }
    });

    // Команда для встановлення нікнейму
    bot.command('setusername', (ctx) => {
        if (isMinecraftBotConnected) {
            ctx.reply('Неможливо змінити нікнейм: Minecraft бот уже підключений до сервера. Спочатку зупиніть бота командою /stopmc.');
        } else {
            const username = ctx.message.text.split(' ').slice(1).join(' ');
            if (username) {
                config.mcBotUsername = username;
                saveConfig();
                ctx.reply(`Нікнейм встановлено: ${username}`);
            } else {
                ctx.reply('Будь ласка, вкажіть нікнейм після команди, наприклад: /setusername BoBeR');
            }
        }
    });

    // Команда для встановлення версії
    bot.command('setversion', (ctx) => {
        if (isMinecraftBotConnected) {
            ctx.reply('Неможливо змінити версію: Minecraft бот уже підключений до сервера. Спочатку зупиніть бота командою /stopmc.');
        } else {
            const version = ctx.message.text.split(' ')[1];
            if (version) {
                config.mcVersion = version;
                saveConfig();
                ctx.reply(`Версія Minecraft встановлена: ${version}`);
            } else {
                ctx.reply('Будь ласка, вкажіть версію після команди, наприклад: /setversion 1.21.1');
            }
        }
    });

    // Команда для запуску Minecraft бота
    bot.command('startmc', (ctx) => {
        if (minecraftClient === null) {
            if (config.mcServerIP && config.mcServerPort && config.mcBotUsername && config.mcVersion) {
                console.log('Конфігурація перед підключенням:', config);
                console.log(`Спроба підключення до сервера: ${config.mcServerIP}:${config.mcServerPort} з нікнеймом: ${config.mcBotUsername} і версією: ${config.mcVersion}`);
                const clientConfig = {
                    host: config.mcServerIP,
                    port: config.mcServerPort,
                    username: config.mcBotUsername,
                    version: config.mcVersion
                };
                minecraftClient = mc.createClient(clientConfig);
                isMinecraftBotConnected = true; // Встановлюємо прапор, що бот підключений
                minecraftClient.on('connect', () => {
                    ctx.reply('Minecraft бот успішно підключився до сервера.');
                    console.log('Minecraft bot has connected to the server.');
                });
                minecraftClient.on('error', (err) => {
                    ctx.reply(`Помилка підключення: ${err.message}`);
                    console.error('Помилка підключення Minecraft бота:', err);
                    minecraftClient = null;
                    isMinecraftBotConnected = false; // Скидаємо прапор у разі помилки
                });
                minecraftClient.on('end', () => {
                    minecraftClient = null;
                    isMinecraftBotConnected = false;
                    ctx.reply('Minecraft бот відключився від сервера.');
                    console.log('Minecraft bot has disconnected from the server.');
                });
            } else {
                ctx.reply('Будь ласка, спочатку встановіть IP, порт, нікнейм та версію.');
            }
        } else {
            ctx.reply('Minecraft бот уже запущений.');
        }
    });

    // Команда для зупинки Minecraft бота
    bot.command('stopmc', (ctx) => {
        if (minecraftClient !== null) {
            minecraftClient.end();
            minecraftClient = null;
            isMinecraftBotConnected = false; // Скидаємо прапор при зупинці бота
            ctx.reply('Minecraft бот зупинено.');
        } else {
            ctx.reply('Minecraft бот не запущений.');
        }
    });

    bot.launch();
}

module.exports = { initializeBot };