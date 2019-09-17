const { Command } = require('discord.js-commando')

module.exports = class ToolSaltCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'salt',
            group: 'tool',
            memberName: 'salt',
            description: 'What\'s the chance to not get a X% drop in Y runs',
            examples: ['salt <drop rate> <runs>'],
            args: [
                {
                    key: 'x',
                    prompt: 'X% drop',
                    type: 'float'
                },
                {
                    key: 'y',
                    prompt: 'Y runs',
                    type: 'integer'
                }
            ]
        })
    }

    async run(message, args) {
        const dropRate = args.x
        const runs = args.y
        const rate = 1 - ((1 - (dropRate / 100)) ** runs)

        return message.channel.send(`**~${(rate * 100).toLocaleString(undefined, {
            'minimumFractionDigits': 1,
            'maximumSignificantDigits': 4
        })}%** to get a ${dropRate.toLocaleString()}% drop in ${runs.toLocaleString()} runs`)
    }
}
