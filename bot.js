const fs = require('fs');
const Discord = require('discord.js');
const { botId, prefix, token } = require('./config.json');
const reply = require('./functions/reply.js');

// All IDs in this code are publicly available and will not cause any risk if "leaked"
// TODO: move arrays to separate files
const overrideRoles = [
    // Bot Factory
    '590284449342554112', // @Override
];

const blacklistRoles = [
    // Bot Factory
    '591758202962575394', // @Blacklist
];

const botChannels = [
    // Bot Factory
    '589581052075573248', // #commands
];

const pingEmoji = {
    // Bot Factory
    '589216814874230786': 'pinged',
};

// Initialize Discord Bot
const bot = new Discord.Client();
bot.login(token);
bot.commands = new Discord.Collection();

// Load commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	bot.commands.set(command.name, command);
}

// Listen for messages
bot.on('message', async message => {
    // Ignore message if author is bot, or message is in DMs, or author is blacklisted
    if (message.author.bot || message.channel.type != "text" || message.member.roles.some(role => blacklistRoles.includes(role.id))) return;

    // React with ping emoji if pinged
    if (message.mentions.members.has(botId)) {
        // Check pingEmoji array at the top for entries for this guild
        for (const emojiID in pingEmoji) {
            if (message.guild.emojis.has(emojiID)) {
                message.react(`:${pingEmoji[emojiID]}:${emojiID}`/* Emoji's name and ID */).catch(console.error);
            }
        }
    }

    // Ignore message if it doesn't start with ']' (the prefix value in config.json)
    if (!message.content.startsWith(prefix)) return;

    // Take apart and interpret the message
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    // Check if valid command
    if (!command) return;

    // Role permissions check
    if (command.roles && !message.member.roles.some(role => command.roles.includes(role.id))) {
        reply(message, `you do not (yet) have access to this command.`);
        return;
    }

    // Refer to bot channel if guild has one, and user does not have override role
    if (!message.member.roles.some(role => overrideRoles.includes(role.id))) {
        // Check botChannels array at the top for entries for this guild
        for (const channelID of botChannels) {
            if (message.guild.channels.has(channelID) && message.channel.id !== channelID) {
                reply(message, `go to ${message.guild.channels.get(channelID).toString()} for bot commands.`);
                return;
            }
        }
    }

    // Execute command
    command.execute(message, args);
});