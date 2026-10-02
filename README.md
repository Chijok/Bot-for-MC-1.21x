# Telegram Minecraft Bot

A Telegram bot that connects to a Minecraft server and allows you to manage a Minecraft bot directly from Telegram. It can forward messages from Minecraft chat to Telegram, send text from Telegram to the server chat, and run server commands from the bot.

English version | [Українська версія](README.uk.md)

## Features

- Connect a Minecraft bot to a Java server
- Set server IP, port, username, and Minecraft version through Telegram commands
- Start and stop the Minecraft bot remotely
- Forward messages from Minecraft chat to Telegram
- Send messages from Telegram to the Minecraft server
- Execute `/command` commands inside the Minecraft world

## Tech Stack

- Node.js
- Telegraf
- minecraft-protocol
- mineflayer

## Requirements

- Node.js 18 or newer
- npm
- A valid Telegram bot token from BotFather
- Access to a Minecraft Java server
- Required modules:
  - `telegraf` — `npm install telegraf`
  - `minecraft-protocol` — `npm install minecraft-protocol`
  - `mineflayer` — `npm install mineflayer`
  - `@types/node` — `npm install -D @types/node`

You can also install all dependencies at once:

```bash
npm install telegraf minecraft-protocol mineflayer @types/node
```

## Installation

1. Clone the project:
   ```bash
   git clone https://github.com/Chijok/Bot-for-MC-1.21x
   cd McBot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure the bot in `config.js`:
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

## Running the Bot

Start the application with:

```bash
node index.js
```

Then open Telegram and start a chat with your bot.

## Available Commands

- `/start` — initialize the bot and save the current chat ID
- `/setip <ip>` — set the Minecraft server IP
- `/setport <port>` — set the Minecraft server port
- `/setusername <name>` — set the bot username
- `/setversion <version>` — set the Minecraft version
- `/startmc` — connect the Minecraft bot to the server
- `/stopmc` — disconnect the Minecraft bot
- `/mccommand <command>` — execute a command on the Minecraft server

Example:

```text
/setip askajian.aternos.host
/setport 63081
/setusername BoBeR
/setversion 1.21.1
/startmc
/mccommand say Hello from Telegram!
```

## How It Works

- Telegram commands are handled by Telegraf.
- When `/startmc` is executed, a Minecraft client is created using `minecraft-protocol`.
- Incoming Minecraft chat messages are forwarded to the Telegram user who started the bot.
- Text messages sent in Telegram are sent to the Minecraft chat if the bot is connected.

## Project Structure

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

## Notes

- This project is designed for a Minecraft Java Edition server.
- Make sure the server is online before starting the bot.
- Store Telegram tokens securely and avoid committing secrets to public repositories.

## License

This project is licensed under the Apache License 2.0.
See the full text in [LICENSE](LICENSE).
