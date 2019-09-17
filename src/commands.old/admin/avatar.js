const { Command } = require('discord.js-commando')

module.exports = class AdminAvatarCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'avatar',
            aliases: [],
            group: 'admin',
            memberName: 'avatar',
            description: 'Sets avatar. Admins only.',
            examples: ['avatar <URL>'],
            args: [
                {
                    key: 'url',
                    prompt: 'URL',
                    type: 'string'
                }
            ]
        })
    }

    async run(message, args) {
        if (!this.client.isOwner(message.author)) return

        const url = args[0]
        return this.client.user.setAvatar(url)
            .then(user => message.reply('Success!'))
            .catch(err => err ? message.reply('Failed') : 0)
    }
}
