//Chat bot for command promt Interface
const Readline = require('readline');
const Chalk = require('chalk');
const RiveScript = require('rivescript');

const bot = new RiveScript();

const rl = Readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

bot.loadFile('./Robot.rive', function () {
    bot.sortReplies();
    ask();
}, function (error) {
    console.log("Error reading file" + error);
});

function ask() {
    rl.question('You:', (message) => {
        var replay = bot.reply('local-user', message);
        console.log(Chalk.red('Bot:' + replay));
        ask();
    });
}