//Chat bot for Website Interface
const RiveScript = require('rivescript');
const express = require('express');
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path');
const request = require('request');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const mv = require('mv');
const Clarifai = require('clarifai');
const clarifai = new Clarifai.App({
    apiKey: 'cb9e83b6965d40f5b7ea20acb86f1ca9'
});

app.use(express.static(path.join(__dirname, 'public')));

server.listen(5000);
console.log("Chat Bot Application Running...!")
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/imageupload', multipartMiddleware, function (req, res) {
    var f_name = req.files.image.name.replace(/\W+/g, '-').toLowerCase() + Date.now();
    var ext = req.files.image.type.substring(req.files.image.type.indexOf("/") + 1);
    var tmp_path = req.files.image.path;
    var directory = path.join(__dirname, '/public/images');
    var target_path = directory + "/" + f_name + "." + ext;
    mv(tmp_path, target_path, function (err) {
        if (err) {
            res.send(err)
        } else {
            res.send({ StatusMsg: "success" })
        }
    });
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

    clarifai.models.predict(Clarifai.GENERAL_MODEL, "https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg?auto=compress&cs=tinysrgb&h=350").then(
        function (response) {
            // do something with response
            console.log(response);
            // socket.emit('Reply', { replay_msg: response });


        },
        function (err) {
            // there was an error
        }
    );
    function WikiCall(url) {
        request(url, function (error, response, body) {
            var result = JSON.parse(response.body)
            socket.emit('Reply', { replay_msg: result.extract_html });
        });
    }
});

//Wiki Call Start

//Wiki Call End