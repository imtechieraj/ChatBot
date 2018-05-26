//Chat bot for Website Interface
const RiveScript = require('rivescript');
const express = require('express');
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

server.listen(5000);
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
        socket.emit('Reply', { replay_msg: replay });
    });
});