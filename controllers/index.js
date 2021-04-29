const axios = require('axios');

exports.sendMessage = (url, message, reply, res) => {
    axios.post(url, {
        chat_id: message.chat.id,
        text: reply
    }).then(response => {
        console.log("Message posted");
        res.end("ok");
    }).catch(error => {
        console.log(error);
    });
}

exports.get_forecast = () => {
    bot.on('message', (msg) => {
        bot.sendMessage(chatId, `${msg.chat.first_name}, Which city weather do you want to get`);
        const chatId = msg.chat.id;
        const text = msg.text
    })
    bot.sendMessage(chatId, "")
    let new_url = openWeatherUrl + text + "&appid=" + process.env.OPENWEATHER_API_KEY;
    return axios.get(new_url).then(response => {
        let temp = response.data.main.temp;
        //converts temperature from kelvin to celsuis
        temp = Math.round(temp - 273.15);
        let city_name = response.data.name;
        let resp = "It's " + temp + " degrees in " + city_name;
        return resp;
    }).catch(error => {
        console.log(error);
    });
}