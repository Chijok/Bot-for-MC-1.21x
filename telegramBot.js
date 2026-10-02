const { Telegraf } = require('telegraf');
const config = require('./config');
const mc = require('minecraft-protocol');
const fs = require('fs');

let bot;
let minecraftClient = null;
let isMinecraftBotConnected = false;

// Зберігання ID чату користувача, який взаємодіє з ботом
let userChatId = null;

// Функція для збереження конфігурації
function saveConfig() {
    fs.writeFile('./config.js', `module.exports = ${JSON.stringify(config, null, 2)}`, (err) => {
        if (err) {
            console.error('Помилка при збереженні конфігурації:', err);
        } else {
            console.log('Конфігурація успішно збережена.');
        }
    });
}

// Функція для затримки (асинхронний sleep)
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function initializeBot(token) {
    bot = new Telegraf(token);
    bot.start((ctx) => {
        userChatId = ctx.chat.id; // Зберігаємо ID чату
        ctx.reply('Вітаю! Я бот для управління Minecraft ботом. Використовуйте команди для налаштування, або просто пишіть повідомлення для надсилання в Minecraft чат.');
        console.log(`Користувач запустив бота. Chat ID: ${userChatId}, isMinecraftBotConnected: ${isMinecraftBotConnected}`);
    });

    // Команда для встановлення IP
    bot.command('setip', (ctx) => {
        console.log(`Спроба змінити IP. isMinecraftBotConnected: ${isMinecraftBotConnected}`);
        if (isMinecraftBotConnected) {
            ctx.reply('Неможливо змінити IP: Minecraft бот уже підключений до сервера. Спочатку зупиніть бота командою /stopmc.');
        } else {
            const ip = ctx.message.text.split(' ')[1];
            if (ip) {
                config.mcServerIP = ip;
                saveConfig();
                ctx.reply(`IP сервера встановлено: ${ip}`);
            } else {
                ctx.reply('Будь ласка, вкажіть IP після команди, наприклад: /setip askajian.aternos.host');
            }
        }
    });

    // Команда для встановлення порту
    bot.command('setport', (ctx) => {
        console.log(`Спроба змінити порт. isMinecraftBotConnected: ${isMinecraftBotConnected}`);
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
        console.log(`Спроба змінити нікнейм. isMinecraftBotConnected: ${isMinecraftBotConnected}`);
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
        console.log(`Спроба змінити версію. isMinecraftBotConnected: ${isMinecraftBotConnected}`);
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
    bot.command('startmc', async (ctx) => {
        console.log(`Спроба запустити Minecraft бота. isMinecraftBotConnected: ${isMinecraftBotConnected}`);
        if (minecraftClient !== null) {
            ctx.reply('Minecraft бот уже запущений.');
            return;
        }

        if (!config.mcServerIP || !config.mcServerPort || !config.mcBotUsername || !config.mcVersion) {
            ctx.reply('Будь ласка, спочатку встановіть IP, порт, нікнейм та версію.');
            return;
        }

        ctx.reply('Спроба підключення до сервера...');
        console.log('Конфігурація перед підключенням:', config);
        console.log(`Спроба підключення до сервера: ${config.mcServerIP}:${config.mcServerPort} з нікнеймом: ${config.mcBotUsername} і версією: ${config.mcVersion}`);

        const clientConfig = {
            host: config.mcServerIP,
            port: config.mcServerPort,
            username: config.mcBotUsername,
            version: config.mcVersion
        };

        try {
            minecraftClient = mc.createClient(clientConfig);
            isMinecraftBotConnected = false; // Спочатку встановлюємо false, чекаємо на подію connect

            minecraftClient.on('connect', () => {
                isMinecraftBotConnected = true;
                ctx.reply('Minecraft бот успішно підключився до сервера.');
                console.log('Minecraft bot has connected to the server.');
            });

            minecraftClient.on('error', (err) => {
                ctx.reply(`Помилка підключення: ${err.message} (Код: ${err.code})`);
                console.error('Помилка підключення Minecraft бота:', err);
                minecraftClient = null;
                isMinecraftBotConnected = false;
                console.log('Скинуто isMinecraftBotConnected після помилки.');
            });

            minecraftClient.on('end', () => {
                minecraftClient = null;
                isMinecraftBotConnected = false;
                ctx.reply('Minecraft бот відключився від сервера.');
                console.log('Minecraft bot has disconnected from the server. Скинуто isMinecraftBotConnected.');
            });

            // Обробка повідомлень з Minecraft чату
            minecraftClient.on('chat', (packet) => {
                console.log('Отримане повідомлення з Minecraft чату:', packet.message);
                const message = packet.message;
                if (message && userChatId && isMinecraftBotConnected) {
                    bot.telegram.sendMessage(userChatId, `📢 [Minecraft] ${config.mcBotUsername}: ${message}`)
                        .catch((err) => console.error('Помилка при надсиланні в Telegram:', err));
                }
            });

            // Чекаємо до 10 секунд на підключення
            for (let i = 0; i < 10; i++) {
                await sleep(1000); // Чекаємо 1 секунду
                if (isMinecraftBotConnected) break;
            }

            if (!isMinecraftBotConnected) {
                ctx.reply('Не вдалося підключитися до сервера. Перевірте, чи сервер онлайн, і чи правильні IP та порт.');
                if (minecraftClient) {
                    minecraftClient.end();
                    minecraftClient = null;
                }
            }
        } catch (err) {
            ctx.reply(`Помилка при створенні клієнта: ${err.message}`);
            console.error('Помилка при створенні Minecraft клієнта:', err);
            minecraftClient = null;
            isMinecraftBotConnected = false;
        }
    });

    // Команда для зупинки Minecraft бота
    bot.command('stopmc', (ctx) => {
        console.log(`Спроба зупинити Minecraft бота. isMinecraftBotConnected: ${isMinecraftBotConnected}`);
        if (minecraftClient !== null) {
            minecraftClient.end();
            minecraftClient = null;
            isMinecraftBotConnected = false;
            ctx.reply('Minecraft бот зупинено.');
            console.log('Скинуто isMinecraftBotConnected після зупинки.');
        } else {
            ctx.reply('Minecraft бот не запущений.');
        }
    });

    // Команда для виконання Minecraft команд
    bot.command('mccommand', (ctx) => {
        console.log(`Спроба виконати команду: ${ctx.message.text}`);
        if (isMinecraftBotConnected && minecraftClient) {
            const command = ctx.message.text.split(' ').slice(1).join(' ');
            if (command) {
                try {
                    minecraftClient.write('chat', { message: JSON.stringify({ text: `/${command}` }) });
                    ctx.reply(`Команда "${command}" виконана в Minecraft.`);
                    console.log(`Виконана команда в Minecraft: /${command}`);
                } catch (err) {
                    console.error('Помилка при надсиланні команди:', err);
                    ctx.reply('Помилка при виконанні команди. Перевірте підключення.');
                }
            } else {
                ctx.reply('Вкажіть команду, наприклад: /mccommand say Привіт');
            }
        } else {
            ctx.reply('Minecraft бот не підключений. Запустіть його командою /startmc.');
        }
    });

    // Обробка текстових повідомлень для надсилання в Minecraft
    bot.on('text', (ctx) => {
        console.log(`Отримане текстове повідомлення: "${ctx.message.text}"`);
        if (ctx.message.text.startsWith('/')) {
            ctx.reply('Невідома команда. Використовуйте: /start, /setip, /setport, /setusername, /setversion, /startmc, /stopmc, /mccommand.');
            return;
        }
        if (isMinecraftBotConnected && minecraftClient && userChatId === ctx.chat.id) {
            const message = ctx.message.text;
            try {
                minecraftClient.write('chat', { message: JSON.stringify({ text: message }) });
                ctx.reply(`Повідомлення "${message}" відправлено в Minecraft чат.`);
                console.log(`Надіслано повідомлення в Minecraft: ${message}`);
            } catch (err) {
                console.error('Помилка при надсиланні повідомлення:', err);
                ctx.reply('Помилка при надсиланні повідомлення. Перевірте підключення.');
            }
        } else {
            ctx.reply('Minecraft бот не підключений. Запустіть його командою /startmc.');
        }
    });

    bot.launch();
}

module.exports = { initializeBot };