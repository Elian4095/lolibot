let { MessageType } = require('@adiwajshing/baileys')
const cooldown = 604800000
let handler = async (m, { conn }) => {
    let user = global.DATABASE._data.users[m.sender]
    let _timers = (cooldown - (new Date - user.lastweekly))
    let timers = clockString(_timers)
    if (new Date - user.lastweekly > cooldown) {
        conn.reply(m.chat, `Has reclamado 20000 de dinero y 3 cajas legendarias`, m)
        user.money += 20000
        user.legendary += 3
        user.lastweekly = new Date * 1
    } else {
        let buttons = button(`Espere *${timers}* minutos para volver a reclamar`, user)
        conn.sendMessage(m.chat, buttons, MessageType.buttonsMessage, { quoted: m })
    }
}
handler.help = ['weekly']
handler.tags = ['rpg']
handler.command = /^(weekly)$/i

handler.cooldown = cooldown

module.exports = handler

function pickRandom(list) {
    return list[Math.floor(list.length * Math.random())]
}
function clockString(ms) {
    let h = Math.floor(ms / 3600000)
    let m = Math.floor(ms / 60000) % 60
    let s = Math.floor(ms / 1000) % 60
    console.log({ ms, h, m, s })
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

function button(teks, user) {
    const buttons = []

    let claim = new Date - user.lastclaim > 86400000
    let monthly = new Date - user.lastmonthly > 2592000000
    let weekly = new Date - user.lastweekly > 604800000
    console.log({ claim, monthly, weekly })

    if (monthly) buttons.push({ buttonId: `id${buttons.length + 1}`, buttonText: { displayText: '/monthly' }, type: 1 })
    if (weekly) buttons.push({ buttonId: `id${buttons.length + 1}`, buttonText: { displayText: '/weekly' }, type: 1 })
    if (claim) buttons.push({ buttonId: `id${buttons.length + 1}`, buttonText: { displayText: '/daily' }, type: 1 })
    if (buttons.length == 0) throw teks

    const buttonMessage = {
        contentText: teks,
        footerText: 'Lolibot - OFC',
        buttons: buttons,
        headerType: 1
    }

    return buttonMessage
}