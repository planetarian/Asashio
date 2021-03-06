const Logger = require("log4js").getLogger("DataManager")

const fetch = require("node-fetch")
const fs = require("fs")

exports.ships = {}
exports.quests = {}
exports.misc = {}
exports.equips = {}
exports.expeds = []

exports.birthdays = []
exports.api_start2 = {}
exports.levels_exp = [0]

exports.store = {}
if(!fs.existsSync("./data/store.json")) {
    fs.writeFileSync("./data/store.json", JSON.stringify(this.store))
} else {
    this.store = require("../data/store.json")
}

exports.mapInfoCache = {}

exports.shipAliases = []
exports.equipAliases = []
exports.getMaxLevel = () => this.levels_exp.length
exports.getServerIP = () => "http://203.104.209.23"
exports.eventID = () => this.store.eventID || 46

exports.getShipByName = (name) => {
    name = name.toLowerCase()

    const findShip = (toSearch) => {
        toSearch = toSearch.toLowerCase().trim()
        return Object.values(this.ships).find(ship => {
            return (ship.full_name    ||"").toLowerCase() == toSearch
                || (ship.japanese_name||"").toLowerCase() == toSearch
                || (ship.nick         ||"").toLowerCase() == toSearch
                || (ship.reading      ||"").toLowerCase() == toSearch
        })
    }

    for(let alias of this.shipAliases)
        name = name.replace(new RegExp("^" + alias[0]), alias[1])

    let result = this.getShipById(name)
    if(result != undefined) return result

    result = findShip(name)
    if(result != undefined) return result

    if(name.includes(" k2")){
        result = findShip(name = name.replace(" k2", " kai ni "))
        if(result != undefined) return result
    }
    if(name.endsWith("k2")){
        result = findShip(name = (name.substring(0, name.length - 2) + " kai ni"))
        if(result != undefined) return result
    }

    if(name.includes(" k") && !name.includes(" kai ni")) {
        result = findShip(name = name.replace(/ k( |$)/, " kai "))
        if(result != undefined) return result
    }

    let shipList = Object.values(this.ships).filter(k => k.full_name.toLowerCase().includes(name))
    if(shipList.length == 0)
        shipList = Object.values(this.ships)

    const dists = shipList.map(ship => this.lenz(ship.full_name.toLowerCase(), name.trim()))
    const minDist = Math.min(...dists)
    return shipList[dists.indexOf(minDist)]
}

exports.getBirthdayByName = (name) => {
    name = name.toLowerCase()

    const findShip = (toSearch) => {
        toSearch = toSearch.toLowerCase().trim()
        return this.birthdays.find(ship => {
            return (ship.name ||"").toLowerCase() == toSearch
        })
    }

    for(let alias of this.shipAliases)
        name = name.replace(new RegExp("^" + alias[0]), alias[1])

    let result = this.birthdays.find(ship => ship.id == name)
    if(result != undefined) return result

    result = findShip(name)
    if(result != undefined) return result

    let shipList = this.birthdays.filter(k => k.name.toLowerCase().includes(name))
    if(shipList.length == 0)
        shipList = this.birthdays

    const dists = shipList.map(ship => this.lenz(ship.name.toLowerCase(), name.trim()))
    const minDist = Math.min(...dists)
    return shipList[dists.indexOf(minDist)]
}


exports.normalizeName = (name) => name.toLowerCase().replace(/\./g, " ").trim()
exports.getEquipByName = (name) => {
    name = this.normalizeName(name)

    let result = this.getEquipById(name)
    if(result != undefined) return result

    for(let alias of this.equipAliases)
        name = name.replace(alias[0], alias[1]).trim()

    const firstWord = name.split(" ")[0]
    let equipList = Object.values(this.equips).filter(k => {
        const equipName = this.normalizeName(k.name)
        return equipName.includes(" " + firstWord) || equipName.startsWith(firstWord)
    })

    if(equipList.length == 0) return

    const dists = equipList.map(equip => this.distance(this.normalizeName(equip.name), name))
    const minDist = Math.min(...dists)
    return equipList[dists.indexOf(minDist)]
}

exports.getMapInfo = async (map) => {
    if(!this.mapInfoCache[map]) {
        Logger.info(`Map data for ${map} not cached. Loading...`)
        this.mapInfoCache[map] = await (await fetch(`http://kc.piro.moe/api/routing/maps/${map}`)).json()
    }
    return this.mapInfoCache[map]
}

exports.getShipById = (id) => {
    return this.ships[id]
}

exports.getQuestByName = (id) => {
    id = id.toUpperCase()
    return this.quests[id]
}
exports.getQuestsByDescription = (desc) => {
    desc = desc.toLowerCase().trim()
    const filters = [
        q => q.title_en && q.title_en.toLowerCase().includes(desc),
        q => q.title && q.title.toLowerCase().includes(desc),
        q => q.detail_en && q.detail_en.toLowerCase().includes(desc),
        q => q.reward_other && q.reward_other.toLowerCase().includes(desc),
        q => q.note && q.note.toLowerCase().includes(desc)
    ]
    const quests = []
    for(const filter of filters)
        quests.push(...Object.values(this.quests).filter(filter))

    return quests.filter((obj, pos, self) => self.indexOf(obj) == pos)
}
exports.getEquipById = (id) => {
    return this.equips[id]
}
exports.getBGMLink = (id) => {
    return this.getServerIP() + this.getPath(id, "bgm", "battle", "mp3")
}
exports.getEquipLink = (id) => {
    return this.getServerIP() + this.getPath(id, "slot", "card", "png")
}
exports.getExpedByID = (id) => {
    return this.expeds.find(k => k.id == id)
}

exports.resource = [6657, 5699, 3371, 8909, 7719, 6229, 5449, 8561, 2987, 5501, 3127, 9319, 4365, 9811, 9927, 2423, 3439, 1865, 5925, 4409, 5509, 1517, 9695, 9255, 5325, 3691, 5519, 6949, 5607, 9539, 4133, 7795, 5465, 2659, 6381, 6875, 4019, 9195, 5645, 2887, 1213, 1815, 8671, 3015, 3147, 2991, 7977, 7045, 1619, 7909, 4451, 6573, 4545, 8251, 5983, 2849, 7249, 7449, 9477, 5963, 2711, 9019, 7375, 2201, 5631, 4893, 7653, 3719, 8819, 5839, 1853, 9843, 9119, 7023, 5681, 2345, 9873, 6349, 9315, 3795, 9737, 4633, 4173, 7549, 7171, 6147, 4723, 5039, 2723, 7815, 6201, 5999, 5339, 4431, 2911, 4435, 3611, 4423, 9517, 3243]
exports.key = s => s.split("").reduce((a, e) => a + e.charCodeAt(0), 0)
exports.create = (id, type) => (17 * (id + 7) * this.resource[(this.key(type) + id * type.length) % 100] % 8973 + 1000).toString()
exports.pad = (id, eors) => id.toString().padStart(eors == "ship" ? 4 : 3, "0")
exports.getPath = (id, eors, type, ext) => {
    let suffix = ""
    if(type.indexOf("_d") > 0 && type.indexOf("_dmg") < 0) {
        suffix = "_d"
        type = type.replace("_d", "")
    }
    return `/kcs2/resources/${eors}/${type}/${this.pad(id, eors)}${suffix}_${this.create(id, `${eors}_${type}`)}.${ext}`
}

exports.distance = (name, toSearch) => {
    const wordsName = name.split(" "), wordsSearch = toSearch.split(" ")

    let score = 0, wordsIndex = 0
    for(let word of wordsSearch) {
        let previous = wordsIndex
        for(let i = wordsIndex; i < wordsName.length; i++) {
            if(wordsName[i].startsWith(word)) {
                wordsIndex = i
                score -= 5
                score += this.lenz(wordsName[i], word)
                break
            }
        }

        if(previous != wordsIndex)
            score += this.lenz(wordsName[wordsIndex++], word)

        if(wordsIndex == wordsName.length - 1) break
    }
    return score
}

exports.lenz = (a,b) => {
    if(a.length == 0) return b.length
    if(b.length == 0) return a.length

    // swap to save some memory O(min(a,b)) instead of O(a)
    if(a.length > b.length) [a,b] = [b, a]

    const row = []
    // init the row
    for(let i = 0; i <= a.length; i++)
        row[i] = i


    // fill in the rest
    for(let i = 1; i <= b.length; i++) {
        var prev = i
        for(let j = 1; j <= a.length; j++) {
            let val = (b.charAt(i-1) == a.charAt(j-1)) ? row[j-1] : Math.min(row[j-1] + 1, prev + 1, row[j] + 1)
            row[j - 1] = prev
            prev = val
        }
        row[a.length] = prev
    }

    return row[a.length]
}

exports.saveStore = () => {
    fs.writeFile("./data/store.json", JSON.stringify(this.store, undefined, 4), (err) => {if(err) Logger.error(err)})
}

exports.reloadShipData = async () => {
    const shipData = await (await fetch("https://raw.githubusercontent.com/kcwiki/kancolle-data/master/wiki/ship.json")).json()

    this.ships = {}
    Object.keys(shipData).forEach(shipName => {
        const ship = shipData[shipName]
        const shipNew = {}
        Object.keys(ship).map(key => shipNew[key.replace("_", "")] = ship[key])
        this.ships[shipNew.api_id] = shipNew
    })
    Logger.info(`Loaded ship data! ${Object.keys(this.ships).length} ships loaded`)//, this.ships[95])

    const questData = await (await fetch("https://raw.githubusercontent.com/kcwiki/kancolle-data/master/wiki/quest.json")).json()

    this.quests = {}
    Object.keys(questData).forEach(questId => {
        this.quests[questId.toUpperCase()] = questData[questId]
    })
    Logger.info(`Loaded quest data! ${Object.keys(this.quests).length} quests loaded`)//, this.quests["B100"])

    const miscData = await (await fetch("https://raw.githubusercontent.com/kcwiki/kancolle-data/master/wiki/misc.json")).json()
    this.misc = miscData

    Logger.info(`Loaded misc ${Object.keys(miscData).join(", ")} data`)

    const equipmentData = await (await fetch("https://raw.githubusercontent.com/kcwiki/kancolle-data/master/wiki/equipment.json")).json()

    this.equips = {}
    Object.keys(equipmentData).forEach(equipName => {
        const equip = equipmentData[equipName]
        const equipNew = {}
        Object.keys(equip).map(key => equipNew[key.replace("_", "")] = equip[key])
        this.equips[equipNew.id] = equipNew
    })
    Logger.info(`Loaded equipment data! ${Object.keys(this.equips).length} equips loaded`)//, this.equips[1])

    this.api_start2 = await (await fetch("https://raw.githubusercontent.com/Tibowl/api_start2/master/start2.json")).json()
    if(this.api_start2 && this.api_start2.api_mst_maparea) {
        const eventID = Math.max(...this.api_start2.api_mst_maparea.map(area => area.api_id))
        if(eventID > 10 && this.store.eventID != eventID) {
            Logger.log("Updated event ID!")
            this.store.eventID = eventID
        }
    }
    Logger.info(`Loaded api_start2! Last event ID: ${this.eventID()}`)

    this.birthdays = require("../data/kcbirthday.json")
    Logger.info(`Loaded birthdays! ${Object.keys(this.birthdays).length} birthdays!`)
    global.timerManager.scheduleNextBirthday()

    this.expeds = require("../data/exped.json")
    Logger.info(`Loaded expeds! ${this.expeds.length} expeds!`)

    this.levels_exp = require("../data/levels.json")
    Logger.info(`Loaded level <-> xp! ${this.levels_exp.length} levels!`)

    const aliases = require("../data/aliases.json")
    this.shipAliases = Object.entries(aliases.shipAliases)
    this.equipAliases = Object.entries(aliases.equipAliases)
    Logger.info(`Loaded name aliases! ${this.shipAliases.length} ship and ${this.equipAliases.length} equipments!`)

    this.saveStore()
}
