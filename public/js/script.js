const BotSpeech = new p5.Speech();
const socket = io.connect('http://localhost:5000');

//Bot and human DP
const me = {avatar:"https://i.pinimg.com/originals/7e/7a/26/7e7a26d446cc7c623a22c3ec97a170db.png"};
const you = {avatar:"https://pbs.twimg.com/profile_images/731022685942218752/oYq9YG3E_400x400.jpg"};

//Date Format Change function-- > Start
function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}
//Date Format Change function-- > End

//Reply message Template-- > Start
function insertChat(who, text, time) {
    if (time === undefined) {
        time = 0;
    }
    var control = "";
    var date = formatAMPM(new Date());
    if (who == "me") {
        control = '<li style="width:100%">' +
            '<div class="msj macro">' +
            '<div class="avatar"><img class="img-circle" style="width:100%;" src="' + me.avatar + '" /></div>' +
            '<div class="text text-l">' +
            '<p>' + text + '</p>' +
            '<p><small>' + date + '</small></p>' +
            '</div>' +
            '</div>' +
            '</li>';
    } else {
        control = '<li style="width:100%;">' +
            '<div class="msj-rta macro">' +
            '<div class="text text-r">' +
            '<p>' + text + '</p>' +
            '<p><small>' + date + '</small></p>' +
            '</div>' +
            '<div class="avatar" style="padding:0px 0px 0px 10px !important"><img class="img-circle" style="width:100%;" src="' + you.avatar + '" /></div>' +
            '</li>';
    }
    setTimeout(
        function () {
            if (who == "me") {
                BotSpeech.speak(text);
            }
            $("ul").append(control).scrollTop($("ul").prop('scrollHeight'));
        }, time);
}
//Reply message Template-- > End

//Template reload-- > Start
function resetChat() {
    $("ul").empty();
}
resetChat();
//Template reload-- > End

//Message sent Function Trigger - > start
$(document).ready(function () {
    $(".mytext").on("keyup", function (e) {
        if ((e.keyCode || e.which) == 13) {
            var text = $(this).val();
            if (text !== "") {
                socket.emit('MyChatMsg', { msg: text });
                insertChat("you", text);
                $(this).val('');
            }
        }
    });

});
//Message sent Function Trigger - > End

//Reply message Trigger function-- > Start
socket.on('Reply', function (data) {
    var Get_Keyword = data.replay_msg.slice(0, 4);
    if (Get_Keyword === "wiki") {
        var WikiAPI = data.replay_msg.substr(5);
        WikiCall(WikiAPI);
    } else {
        insertChat("me", data.replay_msg, 1500);
    }
});
//Reply message Trigger function-- > End

//Wiki API call-- > Start

function WikiCall(url) {
    $.get(url, function (data, status) {
        insertChat("me", data.extract_html, 1500);
    });
}
//Wiki API call-- > End
