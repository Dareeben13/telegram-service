require("dotenv").config();
const express = require('express')
const axios = require('axios')
const cors = require('cors')
const app = express()
const TelegramBot = require('node-telegram-bot-api');

const { get_forecast } = require('./controllers')

app.use(cors)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const COMMANDS = ['/start', '/newMeme', '/help']


const token = process.env.TELEGRAM_API_TOKEN;

let bot;

if (process.env.NODE_ENV === 'production') {
    bot = new TelegramBot(token);
    bot.setWebHook(process.env.HEROKU_URL + bot.token);
} else {
    bot = new TelegramBot(token, { polling: true });
}

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Welcome to Kelly's weather bot! \n Type /\help for list of commands available");
});

bot.onText(/\/newMeme/, (msg) => {
    memeGenerator(msg)
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text

    console.log(msg)

    if (text === "/help") bot.sendMessage(chatId, "🙂Here are the list of commands available \n /newMeme - To generate meme image \n")
    if (text.toLowerCase().includes('bye')) bot.sendMessage(chatId, `👋👋Bye for now👋👋. Have a lovely day ${msg.chat.first_name}`)
    if (COMMANDS.includes(text) === false && text.toLowerCase().includes('bye') === false) bot.sendMessage(chatId, `🥲 🥲 🥲Sorry ${msg.chat.first_name}, I don't understand , ensure you input the right commands or type "/\help" for more information `);
});


const memeGenerator = (msg) => {
    const options = {
        method: 'GET',
        url: 'https://api.imgflip.com/get_memes',
    };

    axios.request(options).then(function (response) {
        let res = response.data.data.memes[Math.round(Math.random() * (99 - 0) + 0)]
        bot.sendPhoto(msg.chat.id, String(res.url), { caption: `${res.name}! \n 🙂 🙂 ` });
    }).catch(function (error) {
        console.error(error);
    });

}

const PORT = process.env.PORT || 5000

app.post('/' + bot.token, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`Kelly's server is running on port ${PORT}`)
})


// app.post("/start_bot", function (req, res) {
//     console.log(req.body)
//     const { message } = req.body.message;
//     let reply = "Welcome to Kelly weather bot";
//     let city_check = message.text.toLowerCase().indexOf('/');
//     if (message.text.toLowerCase().indexOf("hi") !== -1) {
//         sendMessage(telegram_url, message, reply, res);
//     } else if ((message.text.toLowerCase().indexOf("check") !== -1) && (city_check !== -1)) {
//         city = message.text.split('/')[1];
//         get_forecast(city).then(response => {
//             post_forecast(telegram_url, response, message, res)
//         });
//     } else {
//         reply = "request not understood, please review and try again.";
//         sendMessage(telegram_url, message, reply, res);
//         return res.end();
//     }
// });
