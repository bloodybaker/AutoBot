const Telegraf = require('telegraf')
const puppeteer = require('puppeteer');
const bot = new Telegraf('1033482254:AAHpulE02XSbwTtUQ-baKxYVrwfsAALnNEs')
const delay = (time) => new Promise((resolve) => setInterval(() => resolve(), time))
var sw;
var lot;
var id = 0;

bot.start((ctx) => {
    return ctx.reply("Добро пожаловать. Вы авторизованы как: " + ctx.from.first_name + " " + ctx.from.last_name);
    console.log(ctx.from.id)

})
bot.command("/result",async (ctx) =>{
        sw = true;
        while (true){
            let movieUrl = "https://www.copart.com/lotSearchResults/?free=true&query=";
            let browser = await puppeteer.launch();
            let page = await browser.newPage();
            await page.goto(movieUrl,{waitUntil:'networkidle2'});
            let data = await page.evaluate(() => {
                let lots = document.querySelector('tr[class=odd]').innerText;
                return lots;
            });
            var array = data.split("\n");
            lot = array[5];
            var today = new Date();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            if(id!=lot){
                id = lot;
                return ctx.reply(lot);
                console.log("[" + time + "]" + "New lot: " + lot)
            }else {
                console.log("[" + time + "]" + "Failed: " + lot)
            }
            debugger;
            await browser.close()
            await delay(25000)
            if(sw === false){
                break;
            }
        }
})
bot.command("/stop",(ctx) => {
sw = false;
return ctx.reply("Работа остановлена.")
})
bot.startPolling()

