let { MessageType } = require('@adiwajshing/baileys')
const cooldown = 86400000
let handler = async (m, { conn }) => {
    let user = global.DATABASE._data.users[m.sender]
    let __timers = (new Date - user.lastclaim)
    let _timers = (cooldown - __timers)
    let timers = clockString(_timers)
    if (new Date - user.lastclaim > cooldown) {
        conn.reply(m.chat, `Has reclamado 1000 de dinero y una pocion`, m)
        global.DATABASE._data.users[m.sender].money += 1000
        global.DATABASE._data.users[m.sender].potion += 1
        global.DATABASE._data.users[m.sender].lastclaim = new Date * 1
    } else {
        let buttons = button(`Espere *${timers}* para volver a reclamar`, user)
        conn.sendMessage(m.chat, buttons, MessageType.buttonsMessage, { quoted: m })
    }
}



handler.help = ['daily']
handler.tags = ['rpg']
handler.command = /^(claim|daily)$/i

handler.cooldown = cooldown

module.exports = handler

function clockString(seconds) {
  d = Math.floor(seconds / (1000 * 60 * 60 * 24));
  h = Math.floor((seconds / (1000 * 60 * 60)) % 24);
  m = Math.floor((seconds / (1000 * 60)) % 60);
  s = Math.floor((seconds / 1000) % 60);
  
  dDisplay = d > 0 ? d + (d == 1 ? " dia," : " Dias,") : "";
  hDisplay = h > 0 ? h + (h == 1 ? " hora, " : " Horas, ") : "";
  mDisplay = m > 0 ? m + (m == 1 ? " minuto, " : " Minutos, ") : "";
  sDisplay = s > 0 ? s + (s == 1 ? " segundo" : " Segundos") : "";
  return dDisplay + hDisplay + mDisplay + sDisplay;
};

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