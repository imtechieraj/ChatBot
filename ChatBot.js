//Chat bot for Website Interface
const RiveScript = require('rivescript');
const express = require('express');
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path');
const request = require('request');

app.use(express.static(path.join(__dirname, 'public')));

server.listen(5000);
console.log("Chat Bot Application Running...!")
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

const bot = new RiveScript();
bot.loadFile('./Robot.rive', function () {
    bot.sortReplies();
}, function (error) {
    console.log("Error reading file" + error);
});

io.on('connection', function (socket) {
    socket.on('MyChatMsg', function (data) {
        var replay = bot.reply('local-user', data.msg);
        var Get_Keyword = replay.slice(0, 4);
        if (Get_Keyword === "wiki") {
            var WikiAPI = replay.substr(5);
            WikiCall(WikiAPI);
        } else {
            socket.emit('Reply', { replay_msg: replay });
        }
    });
    function WikiCall(url) {
        request(url, function (error, response, body) {
            var result=JSON.parse(response.body)
            socket.emit('Reply', { replay_msg: result.extract_html });
        });
    }
});

//Wiki Call Start

//Wiki Call End