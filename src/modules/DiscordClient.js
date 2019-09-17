const Commando = require('discord.js-commando')
const path = require('path')
const fs = require('fs')

class DiscordClient {

    constructor() {
        const config = require('../config.json')
        const client = new Commando.Client({
            owner: config.admins,
            commandPrefix: config.prefix,
            // commandEditableDuration: 30,
            nonCommandEditable: false,
            unknownCommandResponse: false
        })

        client.config = config

        client.registry
            .registerDefaultTypes()
            .registerGroups([
                ['util', 'Utility'],
                ['admin', 'Administrator'],
                ['info', 'Information'],
                ['tool', 'Tool'],
                ['link', 'Link']
            ])
            .registerCommandsIn(path.join(__dirname, '../commands'))

        fs.readdirSync(path.join(__dirname, '../events')).forEach(file => {
            const event = require(`../events/${file}`)
            const eventName = file.replace('.js', '')
            if (['ready'].includes(eventName)) {
                client.once(eventName, event.bind(null, client))
                return
            }
            client.on(eventName, event.bind(null, client))
        })

        this.client = client
    }

    async start() {
        const token = this.client.config.token
        // console.log(token)
        try {
            await this.client.login(token)
        }
        catch (err) {
            console.trace(err)
        }
    }

}

module.exports = new DiscordClient()
