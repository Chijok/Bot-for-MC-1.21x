# Telegram Minecraft Bot

Telegram-бот, який підключається до сервера Minecraft і дозволяє керувати Minecraft-ботом безпосередньо з Telegram. Він може пересилати повідомлення з чату Minecraft у Telegram, надсилати текст із Telegram у серверний чат і виконувати команди сервера через бота.

## Особливості

- Підключення Minecraft-бота до Java-сервера
- Налаштування IP сервера, порту, ніке й версії Minecraft через команди Telegram
- Запуск і зупинка Minecraft-бота дистанційно
- Пересилання повідомлень із чату Minecraft у Telegram
- Надсилання повідомлень із Telegram у чат Minecraft
- Виконання команд виду `/command` всередині світу Minecraft

## Технології

- Node.js
- Telegraf
- minecraft-protocol
- mineflayer

## Вимоги

- Node.js 18 або новіша версія
- npm
- Дійсний токен Telegram-бота від BotFather
- Доступ до сервера Minecraft Java Edition

## Встановлення

1. Клонуйте проєкт:
   ```bash
   git clone <repository-url>
   cd McBot
   ```

2. Встановіть залежності:
   ```bash
   npm install
   ```

3. Налаштуйте бота у файлі `config.js`:
   ```js
   module.exports = {
     telegramBotToken: 'YOUR_TELEGRAM_BOT_TOKEN',
     mcServerIP: 'your.server.ip',
     mcServerPort: 25565,
     mcBotUsername: 'BotName',
     mcBotActive: false,
     mcVersion: '1.21.1'
   };
   ```

## Запуск бота

Запустіть застосунок командою:

```bash
node index.js
```

Після цього відкрийте Telegram і почніть чат із своїм ботом.

## Доступні команди

- `/start` — ініціалізує бота та зберігає ID поточного чату
- `/setip <ip>` — встановлює IP Minecraft-сервера
- `/setport <port>` — встановлює порт Minecraft-сервера
- `/setusername <name>` — встановлює нікнейм бота
- `/setversion <version>` — встановлює версію Minecraft
- `/startmc` — підключає Minecraft-бота до сервера
- `/stopmc` — відключає Minecraft-бота
- `/mccommand <command>` — виконує команду на Minecraft-сервері

Приклад:

```text
/setip askajian.aternos.host
/setport 63081
/setusername BoBeR
/setversion 1.21.1
/startmc
/mccommand say Привіт з Telegram!
```

## Як це працює

- Команди Telegram обробляються через Telegraf.
- Після виконання `/startmc` створюється клієнт Minecraft через `minecraft-protocol`.
- Вхідні повідомлення з чату Minecraft пересилаються користувачу Telegram, який запустив бота.
- Текстові повідомлення з Telegram надсилаються в чат Minecraft, якщо бот підключений.

## Структура проєкту

```text
McBot/
├── config.js
├── index.js
├── telegramBot.js
├── package.json
├── LICENSE
├── README.md
└── README.uk.md
```

## Примітки

- Цей проєкт призначений для сервера Minecraft Java Edition.
- Переконайтеся, що сервер онлайн перед запуском бота.
- Зберігайте токени Telegram безпечно і не пуште секрети в публічні репозиторії.

## Ліцензія

Цей проєкт поширюється під ліцензією GNU Affero General Public License v3.0 (AGPL-3.0).
Повний текст ліцензії доступний у файлі [LICENSE](LICENSE).
