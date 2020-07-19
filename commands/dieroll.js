const dieRoller = require('../functions/dieroller.js');

module.exports = {
    name: "dieroll",
    aliases: ["d", "die"],
	description: "Rolls a die of a specified size.",
	execute(message, args) {
        let dieSize; // Prepare variable in correct scope for value determined below

        if (!args.length) {
            // Default to maximum of 6 if no maximum is given
            dieSize = 6;
        } else {
            dieSize = parseInt(args[0]);

            if (isNaN(dieSize) || dieSize <= 1) {
                // Send error and cancel die roll if given die size is invalid
                message.reply("given die size is invalid.");
                return;
            }
        }

        message.reply(`your d${dieSize} roll: __**${dieRoller(dieSize)}**__`); // Roll die and reply the result
	},
};