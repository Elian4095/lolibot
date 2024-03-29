const {
  MessageType
} = require("@adiwajshing/baileys");
let fetch = require('node-fetch')
let speed = require('performance-now')
let fs = require('fs')
let path = require('path')
let levelling = require('../lib/levelling')
let ownernum = "51940617554@s.whatsapp.net"
let tags = {
  'main': 'Menu 🍟',
  'rpg': 'Juego - RPG ⚔️',
  'game': 'Juegos 🎮',
  'xp': 'Exp & limite ✨',
  'sticker': 'Stickers 🧩',
  'kerang': 'No se que es :v ❓',
  'quotes': 'Citas 💌',
  'admin': 'Admins 😎',
  'group': 'Grupos 👥',
  'premium': 'Premiun 👑',
  'internet': 'Internet 📶',
  'random': 'Random 🍥',
  'anonymous': 'Chat - anónimo 🕵️‍♂️',
  'nulis': 'Logo maker  🎨',
  'downloader': 'Descargas 📥',
  'tools': 'Ajustes ⚙️',
  'fun': 'Diverción 🎡',
  'database': 'Database 📂',
  'vote': 'Votación 🗳️',
  'quran': 'Tampoco se que es :v ❓',
  'jadibot': 'Jadi - bot 🤖',
  'owner': 'Creador 🐈',
  'host': 'Host 📡',
  'advanced': 'Abanzado 💠',
  'info': 'Info 📍',
  '': 'Sin - categoría 🏵️',
}
const defaultMenu = {
  before: `
Hola @%user, %greeting

Un simple *Bot de WhatsApp*
hecho por @%ownum

*INFO BOT  ⽜*
⌗ › Nombre: %me
⌗ › Prefix: < Multiprefix + >
⌗ › Velocidad: %speed Segundos
⌗ › Runtime: %uptime

⌗ › Navegador: %navega
⌗ › Servidor: %server
⌗ › Vercion: %version
⌗ › Sistema OP: Smg s21

%readmore`.trimStart(),
  header: '_*%category*_',
  body: '✾ %cmd %islimit %isPremium',
  footer: '╶',
  after: "*lolibot-ofc@^0.9.8*\n```Customizable WhatsApp Bot```",
}
let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    let package = JSON.parse(await fs.promises.readFile(path.join(__dirname, '../package.json')).catch(_ => '{}'))
    let name = conn.getName(m.sender)
    
    let timestamp = speed()
    let neww = performance.now()
    let latensi = speed() - timestamp
    
    let d = new Date(new Date + 3600000)
    let locale = 'id'
    // d.getTimeZoneOffset()
    // Offset -420 is 18.00
    // Offset    0 is  0.00
    // Offset  420 is  7.00
    let weton = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves','Viernes','Sábado'][Math.floor(d / 84600000) % 5]
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(d)
    let time = d.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })
    let _uptime = process.uptime() * 1000
    let _muptime
    if (process.send) {
      process.send('uptime')
      _muptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000
    }
    let muptime = clockString(_muptime)
    let uptime = clockString(_uptime)
    let totalreg = Object.keys(global.DATABASE._data.users).length
    let rtotalreg = Object.values(global.DATABASE._data.users).filter(user => user.registered == true).length
    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
      return {
        help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
        prefix: 'customPrefix' in plugin,
        limit: plugin.limit,
        premium: plugin.premium,
        enabled: !plugin.disabled,
      }
    })
    for (let plugin of help)
      if (plugin && 'tags' in plugin)
        for (let tag of plugin.tags)
          if (!(tag in tags) && tag) tags[tag] = tag
    conn.menu = conn.menu ? conn.menu : {}
    let before = conn.menu.before || defaultMenu.before
    let header = conn.menu.header || defaultMenu.header
    let body = conn.menu.body || defaultMenu.body
    let footer = conn.menu.footer || defaultMenu.footer
    let after = conn.menu.after || (conn.user.jid == global.conn.user.jid ? '' : `Powered by https://wa.me/${global.conn.user.jid.split`@`[0]}`) + defaultMenu.after
    let _text = [
      before,
      ...Object.keys(tags).map(tag => {
        return header.replace(/%category/g, tags[tag]) + '\n' + [
          ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
            return menu.help.map(help => {
              return body.replace(/%cmd/g, menu.prefix ? help : '%p' + help)
                .replace(/%islimit/g, menu.limit ? '(Limit)' : '')
                .replace(/%isPremium/g, menu.premium ? '(Premium)' : '')
                .trim()
            }).join('\n')
          }),
          footer
        ].join('\n')
      }),
      after
    ].join('\n')
    text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
    let replace = {
      '%': '%',
      p: _p, uptime, muptime,
      user: m.sender.split("@s.whatsapp.net")[0],
      ownum: ownernum.split("@s.whatsapp.net")[0],
      me: conn.user.name,
      server: conn.browserDescription[0],
      navega: conn.browserDescription[1],
      version: conn.browserDescription[2],
      speed: latensi.toFixed(4),
      greeting: saludo,
      npmname: package.name,
      npmdesc: package.description,
      version: package.version,
      github: package.homepage ? package.homepage.url || package.homepage : '[unknown github url]',
      name, weton, week, date, dateIslamic, time, totalreg, rtotalreg,
      readmore: readMore
    }
    text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
     let tumb = fs.readFileSync('./src/menu.jpg')
     let tumbb = fs.readFileSync('./src/menu2.jpg')
     conn.sendMessage(m.chat, { contentText: text.trim(), footerText: 'Lolibot - OFC', buttons: [{buttonId: '.ping', buttonText: {displayText: '🚀 SPEED'}, type: 1},{buttonId: '.owner' , buttonText: {displayText: '🍧 CREADOR'}, type: 1}], "headerType": "DOCUMENT", "documentMessage": { "url": "https://mmg.whatsapp.net/d/f/Ano5cGYOFQnC51uJaqGBWiCrSJH1aDCi8-YPQMMb1N1y.enc", "mimetype": "application/vnd.ms-excel", "title": "Dibuat Oleh: Arifi Razzaq", "fileSha256": "8Xfe3NQDhjwVjR54tkkShLDGrIFKR9QT5EsthPyxDCI=", "fileLength": 99999999999, "pageCount": 25791, "mediaKey": "XWv4hcnpGY51qEVSO9+e+q6LYqPR3DbtT4iqS9yKhkI=", "fileName": "𝕷𝖔𝖑𝖎𝖇𝖔𝖙 - 𝕺𝖋𝖎𝖈𝖎𝖆𝖑™.⁖⃟•᭄", "fileEncSha256": "NI9ykWUcXKquea4BmH7GgzhMb3pAeqqwE+MTFbH/Wk8=", "directPath": "/v/t62.7119-24/35160407_568282564396101_3119299043264875885_n.enc?ccb=11-4&oh=d43befa9a76b69d757877c3d430a0752&oe=61915CEC", "mediaKeyTimestamp": "1634472176", "jpegThumbnail": tumb 
            }}, MessageType.buttonsMessage, { quoted: m, thumbnail: tumbb, contextInfo: { mentionedJid: [m.sender, ownernum], forwardingScore: 750, isForwarded: true, externalAdReply: { title: `あなたは私のすべてです`, body: `Macielly ? D‵ Gatito`, thumbnail: tumbb, mediaType:"2", previewType: "VIDEO", mediaUrl: ""
            }
            }
            })
  } catch (e) {
    conn.reply(m.chat, 'Lo siento, ocurrió un error al mostrar el menú', m)
    throw e
  }
}
handler.help = ['menu', 'help', '?']
handler.tags = ['main']
handler.command = /^(menu|help|\?)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null
handler.exp = 3

module.exports = handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

var ase = new Date();
                        var waktoonyabro = ase.getHours();
                        switch(waktoonyabro){
                case 0: waktoonyabro = `espero que tengas una linda noche 🌙`; break;
                case 1: waktoonyabro = `espero que tengas una linda noche 💤`; break;
                case 2: waktoonyabro = `espero que tengas una linda noche 🦉`; break;
                case 3: waktoonyabro = `espero que tengas una linda mañana ✨`; break;
                case 4: waktoonyabro = `espero que tengas una linda mañana 💫`; break;
                case 5: waktoonyabro = `espero que tengas una linda mañana 🌅`; break;
                case 6: waktoonyabro = `espero que tengas una linda mañana 🌄`; break;
                case 7: waktoonyabro = `espero que tengas una linda mañana 🌅`; break;
                case 8: waktoonyabro = `espero que tengas una linda mañana 💫`; break;
                case 9: waktoonyabro = `espero que tengas una linda mañana ✨`; break;
                case 10: waktoonyabro = `espero que tengas un lindo dia 🌞`; break;
                case 11: waktoonyabro = `espero que tengas un lindo dia 🌨`; break;
                case 12: waktoonyabro = `espero que tengas un lindo dia ❄`; break;
                case 13: waktoonyabro = `espero que tengas un lindo dia 🌤`; break;
                case 14: waktoonyabro = `espero que tengas una linda tarde 🌇`; break;
                case 15: waktoonyabro = `espero que tengas una linda tarde 🥀`; break;
                case 16: waktoonyabro = `espero que tengas una linda tarde 🌹`; break;
                case 17: waktoonyabro = `espero que tengas una linda tarde 🌆`; break;
                case 18: waktoonyabro = `espero que tengas una linda noche 🌙`; break;
                case 19: waktoonyabro = `espero que tengas una linda noche 🌃`; break;
                case 20: waktoonyabro = `espero que tengas una linda noche 🌌`; break;
                case 21: waktoonyabro = `espero que tengas una linda noche 🌃`; break;
                case 22: waktoonyabro = `espero que tengas una linda noche 🌙`; break;
                case 23: waktoonyabro = `espero que tengas una linda noche 🌃`; break;
            }
            var saludo = "" + waktoonyabro;