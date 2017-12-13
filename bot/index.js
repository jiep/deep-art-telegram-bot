const Telegraf = require('telegraf')
const telegrafLogger = require('telegraf-logger')
const fs = require('fs')
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const CHAT_ID = process.env.CHAT_ID;

bot.use(telegrafLogger())


bot.command('/photos', async (ctx) => {
	for(const [i, photo] of photos.entries()){
		try {
			await ctx.replyWithPhoto({ source: photo.filePath }, {caption: `${photo.caption} ${photo.name}`})
			console.log(log(`${i}: ${photo.filePath}`));
		} catch (err) {
			console.log(error(`${i}: ${photo.filePath}`))
		}
	}
})


bot.startPolling()
