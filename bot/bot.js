const yaml = require('node-yaml');
const fs = require('fs');
const Telegraf = require('telegraf');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const { leave } = Stage;
const { getDeepArt } = require('./upload');
const streamifier = require('streamifier');

const FILENAME = "../app/examples/cat.jpeg";

const config = yaml.readSync('./config.yaml', {
  encoding: 'utf8'
});

const { BOT_TOKEN, API_URL, STYLES, IMAGES } = config;

if(!config) {
  console.log("Conf does not exist");
  process.exit(-1);
}

if(!BOT_TOKEN) {
  console.log('You must provide a Telegram Bot token');
  process.exit(-1);
}

if(!API_URL) {
  console.log('You must provide a API url');
  process.exit(-1);
}

if(!STYLES && STYLES.length && STYLES.length > 0) {
  console.log('You must provide a valid array of styles');
  process.exit(-1);
}

if(!IMAGES) {
  console.log('You must a folder to store images');
  process.exit(-1);
}

console.log(config);

const Composer = require('telegraf/composer')
const Markup = require('telegraf/markup')
const WizardScene = require('telegraf/scenes/wizard')

let style;

// const stepHandler = new Composer()
//
// STYLES.forEach(s => {
//   stepHandler.action(s, (ctx) => {
//     style = s;
//     ctx.reply(`You have been selected ${style}. Please update an image`);
//
//     getDeepArt(API_URL, s, FILENAME).then(data => {
//       fs.writeFile(`${IMAGES}/image.jpeg`, data, "binary" ,function(err) {
//         if(err) console.log(err);
//         else ctx.replyWithPhoto({ source: fs.createReadStream(`${IMAGES}/image.jpeg`) });
//       })
//     });
//     return ctx.wizard.next()
//   })
// })
//
// stepHandler.use((ctx) => ctx.replyWithMarkdown('Press above `buttons`'))
//
// const superWizard = new WizardScene('super-wizard',
//   (ctx) => {
//     ctx.reply('Please select a style', Markup.inlineKeyboard(STYLES.map(x => Markup.callbackButton(x.toUpperCase(), x))).extra())
//     return ctx.wizard.next()
//   },
//   stepHandler,
//   (ctx) => {
//     ctx.reply('Done')
//     return ctx.scene.leave()
//   }
// )

const bot = new Telegraf(BOT_TOKEN)
// const stage = new Stage([superWizard], { default: 'super-wizard' })
// bot.use(session())
// bot.use(stage.middleware())
bot.on('photo', (ctx) => {
  console.log(ctx.message.photo);
  console.log(ctx.message.photo[0].file_id);
  const file_id = ctx.message.photo[0].file_id;
  ctx.telegram.getFileLink(file_id).then(r => console.log(r)).catch(e => console.log(e));
  return ctx.replyWithPhoto(file_id);
})
bot.startPolling()
