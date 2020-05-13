const Telegraf = require('telegraf')
const puppeteer = require('puppeteer');
const Extra = require('telegraf/extra')
const bot = new Telegraf('1188741836:AAGTr7kB7MBJ_TBMCzE3qaSxbkqyoVqUqS8')
const delay = (time) => new Promise((resolve) => setInterval(() => resolve(), time))
var http = require('http'),
    Stream = require('stream').Transform,
    fs = require('fs');

var sw;
var lot;
let img;
var id = 0;
let uri;
let url;
var filter = []
let movieUrl;
bot.start((ctx) => {
    return ctx.reply("Добро пожаловать. Вы авторизованы как: " + ctx.from.first_name + " " + ctx.from.last_name + " " + ctx.chat.id);
    console.log(ctx.from.id)

})
bot.command("/result",async (ctx) =>{
        sw = true;
        while (true){
            let browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
            let page = await browser.newPage();
            try{
            await page.goto(movieUrl,{waitUntil:'networkidle2'},{timeout: 3000000});
                let data = await page.evaluate(() => {
                    let lots = document.querySelector('div[class=table-row]').innerText;
                    return lots;
                })
                let getUrl =await page.evaluate(() => {
                    uri = document.querySelector("body > section > main > section.section.pt-0 > section > div > div.table.table-advanced.table--image-view > div > div:nth-child(1) > div.table-cell.table-cell--data > h3")
                        .querySelector("a").getAttribute("href")
                    return uri;
                });
                url = getUrl;
                var array = data.split("\n");
                lot = array;
                var today = new Date();
                var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                if(id!=lot[2]){
                    id = lot[2];
                    console.log("[" + time + "]" + "New lot: " + lot[2] + " for user: " + ctx.from.username)
                    ctx.reply("Название: "+lot[0] + "\nЛот№: " +lot[2] + "\nLoss: " + lot[6] + "\nDamage: " + lot[8] + "\nURL: " + url + "\nPrice: " + lot[lot.length-3]);
                    /*ctx.replyWithPhoto(
                        "./image.png",
                        Extra.caption("Название: "+lot[0] + "\nЛот№: " +lot[2] + "\nLoss: " + lot[6] + "\nDamage: " + lot[8] + "\nURL: " + uri).markdown())
*/
                }else {
                    console.log("[" + time + "]" + "Failed: " + lot[2] + " for user: " + ctx.from.username)
                }
                debugger;
                await browser.close()
                await delay(25000)
                if(sw === false){
                    break;
                }
            }catch (e) {
                console.log(e);
            }
        }
})
bot.command("/search",(ctx)=>{
    ctx.reply("Введите через пробел: Марка Модель Год")
    bot.on('text', (ctx) => {
        if(ctx.message != 0){
            filter = ctx.message.text.split(" ")
            movieUrl = "https://www.iaai.com/VehicleSearch/SearchDetails?Keyword=" + filter[0] + '+' + filter [1] + '+'+ filter[2] + "&url=pd6JWbJ9kRzcBdFK3vKeyjpx+85A4wDWncLLWXG+ICNJ+99sqMaoisYKWs6Cr9ehpola9jPx2sprv+s4ZMVn8J+vttUQCJ7HakXxBWckbi4gq4biPS4fV+7KDc+EVjPZ0LdSgRbczR6d/pkew5YbEQ==&quickfilters=&selectedRefiners=";
            return ctx.reply("Ваш текущий поисковой фильтр: " + filter.toString())
        }

    })
})
bot.command("/stop",(ctx) => {
    sw = false;
    return ctx.reply("Работа остановлена.")
})
bot.startPolling()
bot.launch()
