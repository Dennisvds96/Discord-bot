const dieRoller = require('../functions/dieroller.js');

module.exports = {
	name: "coinflip",
	aliases: ["flipcoin"],
	description: "Flips a coin.",
	execute(message, args) {
		message.reply(`your result: __**${dieRoller(2) === 1 ? "heads" : "tails"}**__!`); // Roll a "two-sided die" with dieRoller to mimic a coinflip
	},
};