module.exports = (message, reply) => {
    message.reply(reply) // Send reply
        .then((msg) => {
            message.delete(10000); // Delete command message after 10000 ms
            msg.delete(10000); // Delete response message after 10000 ms
        }).catch(console.error);
};