'use strict';

var discord = require('discord.io'),
    bot = new discord.Client({
        token: "",
        autorun: true
    });

// [array] trusted userIDs for permission checks (right click usernames in dev-mode discord client)
bot.whiteList = ['87248537510764544', '84400622861811712', '87171783161036800'];

// discord.io took this out
bot.serverFromChannel = function(channelId) {
    const sKeys  = Object.keys(bot.servers),
          sCount = sKeys.length;
    let   sId    = 0;
    for (let i = 0; i < sCount; i++) {
        const channels = bot.servers[sKeys[i]].channels,
              cKeys    = Object.keys(channels),
              cCount   = cKeys.length;
        for (let j = 0; j < sCount; i++) {
            if (cKeys[j] == channelId) {
                sId = sKeys[i];
                break;
            }
        }
        if (sId != 0) break;
    }
    return sId;
};

// takes current channelId and a string or array of messages and responds with one of them
bot.respond = function (channelId, messages) {
    var rList = messages || '',
        n = Math.floor(Math.random() * rList.length),
        response = (rList.constructor === Array) ? rList[n] : rList;
        
    if (response.length > 0) {
        bot.sendMessage({ to: channelId, message: response });
    }
};

// on ready, load all commands and set the regex the bot responds to
bot.on('ready', function (event) {
    
    var cmd,
        err,
        fs = require('fs');
    
    bot.commands = { help: require('./commands/help.js') };

    fs.readdir('commands/', function (err, data) {
        
        
        if (data) {
            
            data.forEach(function (x) {
                cmd = x.replace('.js', '');
                try {
                    bot.commands[cmd] = require('./commands/' + cmd + '.js');
                    console.log(x + ' loaded.');
                } catch (e) {
                    console.log('Couldn\'t load ' + x + '!');
                    console.log(e);
                }
            });
            
            console.log('All recognized commands loaded!');

            // regex that the bot responds to
            bot.identifier = new RegExp('(^|[^a-zA-Z])' + bot.username + '([^a-zA-Z]|$)', 'i');
            
            bot.listening = [];
            bot.ignoring = [];
            bot.spotlight = {}; // smoother question/answer flow - example: commands.server.join
            
            return true;
        }

        console.log('No commands were found! Please check the README for help.');
        bot.disconnect();
        
    });
    
});

// read messages sent through chat and determine command to execute
bot.on('message', function (user, userId, channelId, message, event) {

    var cmd         = 'help', // if bot is mentioned but no keywords match - defaults to this command
        cmdCounter  = {},
        msg         = {};
    
    if (userId === bot.id || bot.directMessages[channelId]) {
        return false;
    }
    
    msg.original = message;
    msg.trimmed = msg.original.replace(/[.,\/#!$%\^&\*;:'{}=\-_`~()\?]/g, '').toLowerCase();
    msg.words = msg.trimmed.split(' ');
    msg.user = user;
    msg.userId = userId;
    msg.channelId = channelId;
    msg.spotlight = bot.spotlight[userId] || false;
    
    function botMentioned() { return (bot.identifier.test(msg.original)); }
    function userSpotlighted() { return (bot.listening.indexOf(msg.user) > -1); }
    function userHasPermission() { return (bot.ignoring.indexOf(msg.userId) === -1); }
    
    function executeCmd(cmdKey) {
        return bot.commands[cmdKey].execute(msg, bot);
    }
    
    function chooseCmd(spotlight) {
        msg.keywords = msg.spotlight || msg.words;
        // count instances of keywords in user message
        Object.keys(bot.commands).forEach(function (x) {
            cmdCounter[x] = { name: x, amt: 0 };
            msg.keywords.forEach(function (y) {
                cmdCounter[x].amt += (bot.commands[x].keywords.indexOf(y) > -1) ? 1 : 0;
            });
        });

        // find command with most instances
        Object.keys(cmdCounter).forEach(function (k) {
            cmd = (cmdCounter[k].amt > cmdCounter[cmd].amt) ? k : cmd;
        });
        
        executeCmd(cmdCounter[cmd].name);
    }
    
    if (msg.spotlight) {
        chooseCmd(msg.spotlight);
    } else if ((botMentioned() || userSpotlighted()) && userHasPermission()) {
        chooseCmd();
    }

});
