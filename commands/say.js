module.exports = {
	name: "say",
	roles: "315863808016908308",
	description: "Repeats after you.",
	execute(message, args) {
		message.delete(); // Delete command message immediately
        message.channel.send(args.join(" ")); // Repeat the given message
	},
};