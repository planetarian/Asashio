const fetch = require("node-fetch")

exports.run = async (message, args) => {
    if(!args || args.length != 1) return message.reply(`Usage: \`${this.usage}\``)
    const { data } = global

    let map = args[0].toUpperCase()
    if(map.startsWith("E-")) map = map.replace("E", data.eventID())
    else if(map.startsWith("E")) map = map.replace("E", data.eventID() + "-")
    if(map.split("-").length != 2) return message.author.send("Invalid map!")

    const isEventMap = map.split("-")[0].length > 1

    let table = (await (await fetch(`http://kc.piro.moe/api/routing/droptable/${map}`)).text())
        .replace(/^\| /gm, "")
        .replace(/\|$/gm, "")
        .replace(/\| ([A-Z0-9]) +/g, isEventMap ? "|  $1  " : "| $1 ")
        .replace(/\| ([A-Z0-9]{2}) +/g, isEventMap ? "|  $1  " : "| $1")
        .replace(/Casual/g, "C")
        .replace(/Normal/g, "N")
        .replace(/Easy/g, "E")
        .replace(/Hard/g, "H")
        .replace(/(C|N|E|H) *(S|A)/g, "$1 $2")
        .replace(/\| {5} +/g, "|     ")

    if(!isEventMap)
        table = table.replace(/\| {2}/g, "| ")

    const rows = table.split("\n")
    rows[1] = undefined
    table = rows.filter(k => k).map(k => k.trim()).join("\n")

    if(table.length > 1800)
        return message.author.send("Table too long!")
    else if(table.length < 5)
        return message.author.send("No notable drops found!")

    return message.author.send(`Drop table of ${map}\`\`\`\n${table}\n\`\`\`\nData provided by TsunDB.`)
}

exports.category = "Tools"
exports.help = "Gets drop table of a map. Replies only in DM. Uses <http://kc.piro.moe> API"
exports.usage = "droptable <map>"
exports.prefix = global.config.prefix
exports.aliases = ["drops"]
