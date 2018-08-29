const yaml = require('node-yaml');
const fs = require('fs');
const Telegraf = require('telegraf');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const { leave, enter } = Stage;
const { getDeepArt } = require('./upload');
const download = require('image-downloader');

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

const styleScene = new Scene('style')
styleScene.enter((ctx) => ctx.reply('Please select a style',
  Markup.inlineKeyboard(
    STYLES.map(x => Markup.callbackButton(x.toUpperCase(), x))).extra()
  )
)
styleScene.leave((ctx) => 'Enter /deepart')
STYLES.forEach(style => {
  styleScene.action(style, async (ctx) => {
    ctx.scene.session.style = style;
    await ctx.reply(`Selected as style: ${style}`);
    await ctx.reply(`Please update a photo!`);
  })
})
styleScene.on('photo', (ctx) => {
  if(!ctx.scene.session.style){
    ctx.scene.session.style = DEFAULT_STYLE;
  }
  const file_id = ctx.message.photo.find(x => x.file_size === Math.max(...ctx.message.photo.map(o => o.file_size))).file_id;
  ctx.telegram.getFileLink(file_id).then(url => {
    const options =
    download.image({
       url,
       dest: IMAGES
     })
      .then(({ filename, image }) => {
        ctx.reply('Please wait...');
        getDeepArt(API_URL, ctx.scene.session.style, filename).then(data => {
          fs.writeFile(filename, data, "binary" , (err) => {
            if(err) console.log(err);
            ctx.replyWithPhoto({ source: fs.createReadStream(filename) });
            fs.unlinkSync(filename, (err) => {
              if(err) console.log(err);
            });
          })
        });
    })
    .catch((err) => {
      console.error(err)
    })
  }).catch(e => console.log(e));
})


const bot = new Telegraf(BOT_TOKEN)
const stage = new Stage([styleScene], { ttl: 10 })
bot.use(session())
bot.use(stage.middleware())
bot.command('deepart', enter('style'))
bot.on('message', (ctx) => ctx.reply('Enter /deepart'))
bot.startPolling()
