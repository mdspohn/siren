/**
 * Commands relating to the server / bot state
 * Includes listening to a user, ignoring, asking for your id, joining voice channels, and disconnecting
*/

var server = {
    
    keywords: [
        'listen',
        'listening',
        'ignore',
        'unignore',
        'ignoring',
        'exit',
        'id',
        'join',
        'voice',
        'leave',
        'disconnect',
        'quit',
        'shutdown'
    ],
    
    description: 'Lets me __join__ and __leave__ voice channels, __listen__ when you\'re tired of ' +                'saying my name, __ignore__ users, and __leave the server__.',
    
    join: function (msg, bot, onSelf) {
        
        bot.currentVoiceChannel = bot.currentVoiceChannel || '';
        
        var voiceChannels = {},
            channelList = [],
            response,
            target = (msg.original.replace(/siren/i, '').replace(/join/i, '')).trim(),
            rawChannels = bot.servers[bot.serverFromChannel(msg.channelId)].channels;
        
        if (onSelf) {
            target = bot.servers[bot.serverFromChannel(msg.channelId)]
                        .members[msg.userId]
                            .voice_channel_id;
            if (target) {
                bot.currentVoiceChannel = target;
                bot.joinVoiceChannel(target);
                
                return bot.respond(msg.channelId, [
                    'On my way!',
                    'Headed there now.',
                    'All right.',
                    'Understood.',
                    'Gladly.',
                    'M-me? Sure.',
                    'My pleasure.'
                ]);
            } else {
                
                return bot.respond(msg.channelId, [
                    'It doesn\'t look like you\'re in a channel, ' + msg.user + '.',
                    'I absolutely would if you were in one.'
                ]);
                
            }
        }
        
        target = target.toLowerCase();

        Object.keys(rawChannels).forEach(function (x) {
            if (rawChannels[x].type === 'voice') {
                voiceChannels[rawChannels[x].name.toLowerCase()] = x;
                channelList.push(rawChannels[x].name);
            }
        });

        if (voiceChannels[target]) {
            bot.spotlight[msg.userId] = false;
            bot.currentVoiceChannel = voiceChannels[target];
            bot.joinVoiceChannel(voiceChannels[target]);
            
            return bot.respond(msg.channelId, [
                'On my way!',
                'Headed there now.',
                'All right.',
                'Understood.',
                'Gladly.',
                'M-me? Sure.',
                'My pleasure.'
            ]);

        } else if (channelList) {
            
            if (!bot.spotlight[msg.userId]) {
                bot.spotlight[msg.userId] = ['join'];
                
                return bot.respond(msg.channelId, 'Which channel? I see ' + channelList.join(', ') +
                       '. (You can answer this directly.)');
            } else {
                bot.spotlight[msg.userId] = false;
                
                return bot.respond(msg.channelId, 'Er, I don\'t see a channel named \'' + target + '\'.');
            }

        } else {
            
            return bot.respond(msg.channelId, 'Hmm, I don\'t see any Voice Channels I can join.');

        }
    },
            
    getId: function (msg, bot) { return bot.respond(msg.channelId, msg.userId); },
    
    listen: function (msg, bot, keyword) {
        
        var active = bot.listening.indexOf(msg.user);
        
        if (keyword) {
            
            if (active > -1) {
                
                bot.listening.splice(active, 1);
                
                return bot.respond(msg.channelId,
                    [
                        'Ok, ' + msg.user + ', I understand.',
                        'All right, I\'ll talk to you later then.',
                        'If you\'re sure.',
                        'Until next time, then.',
                        'Ok, I\'ll just wait over here.'
                    ]);
                
            } else {
                
                return bot.respond(msg.channelId, 'I\'m not listening to you though.');
                
            }
            
        } else {
            
            if (active > -1) {
                
                return bot.respond(msg.channelId, 'I\'m already listening to you, ' + msg.user + '.');
                
            } else {
                
                bot.listening.push(msg.user);
                
                return bot.respond(msg.channelId,
                    [
                        'Sounds good, ' + msg.user + ', just let me know when to stop __listening__.',
                        'Ok, I\'ll assume you\'re talking to me for a while.',
                        'I\'m all ears until you think I shouldn\'t __listen__.',
                        'All ears, ' + msg.user + '.',
                        'I\'m glad we can be so casual with eachother.',
                        'Ok, just let me know when to stop.'
                    ]);
                
            }
        }
    },

    ignore: function (msg, bot, wording) {
        var target = '',
            targetId = '',
            responses = [],
            members = bot.servers[bot.serverFromChannel(msg.channelId)].members;

        if (bot.whiteList.indexOf(msg.userId) > -1) {
            
            target = (msg.original.split(wording)[1]).trim().toLowerCase();
            
            Object.keys(members).some(function (x) {
                if (members[x].username.toLowerCase() === target) {
                    target = members[x].username;
                    targetId = members[x].id;
                    
                    return true;
                }
            });
            
            if (targetId) {
                
                if (bot.ignoring.indexOf(targetId) > -1) {
                    
                    if (wording === 'ignore') {
                        return bot.respond(msg.channelId, 'I\'m already ignoring ' + target + '.');
                    }
                    
                    bot.ignoring.splice(bot.ignoring.indexOf(targetId), 1);
                    
                    return bot.respond(msg.channelId, [
                        'If I must.',
                        'If you think that\'s a good idea.',
                        'Ok, done.'
                    ]);
                    
                } else {
                    
                    if (wording === 'ignoring' || wording === 'unignore') {
                        return bot.respond(msg.channelId, 'I\'m not ignoring ' + target + ' though.');
                    }
                    
                    bot.ignoring.push(targetId);
                    
                    return bot.respond(msg.channelId, [
                        target + '? Dead to me.',
                        'It\'s for the best.',
                        'I was thinking about doing that already.'
                    ]);
                    
                }
                
            } else {
                
                return bot.respond(msg.channelId, [
                    'Sorry, I don\'t see anyone by that name.',
                    'Pretty awkward spelling their name wrong.',
                    'Oops. Hurry, type their name correctly this time.'
                ]);
            }
            
        } else {
            
            return bot.respond(msg.channelId, [
                'Maybe later.',
                'I don\'t really want to do that.',
                'I was told not to let you do that.',
                'You\'re not on the list of people that can do that.'
            ]);
        }
    },
    
    leave: function (msg, bot) {
        
        if (bot.commands.radio.playing) { bot.commands.radio.playing = {}; }
        
        if (bot.currentVoiceChannel) {
            bot.leaveVoiceChannel(bot.currentVoiceChannel);
            bot.currentVoiceChannel = '';
            
            return bot.respond(msg.channelId, [
                'Very well.',
                'Ok then.',
                'I\'m gone.'
            ]);
            
        } else {
            
            bot.spotlight[msg.userId] = ['shutdown'];
            
            return bot.respond(msg.channelId, 'I\'m not in a voice channel. Did you want me to ' +
                        '__leave the server__ completely? (You can answer this directly.)');
        }
    },

    exit: function (msg, bot) {
        
        function disconnect() {
            if (bot.commands.radio && bot.commands.radio.ffmpeg) { bot.commands.radio.ffmpeg.kill(); }
            if (bot.currentVoiceChannel) { bot.leaveVoiceChannel(bot.currentVoiceChannel); }
            bot.disconnect();
        }
        
        if (msg.spotlight) {
            if (msg.words.indexOf('yes') > -1
                    || msg.words.indexOf('y') > -1
                    || msg.words.indexOf('server') > -1
                    || msg.words.indexOf('yeah') > -1
                    || msg.words.indexOf('aye') > -1) {
                disconnect();
            } else {
                bot.spotlight[msg.userId] = false;
                
                return bot.respond(msg.channelId, 'I guess I\'ll stay here then.');
            }
        } else {
            disconnect();
        }
        
    },

    execute: function (msg, bot) {
        
        msg.keywords = msg.spotlight || msg.words;
        
        function matches() {
            var i = arguments.length;
            while (i--) {
                if (msg.keywords.indexOf(arguments[i]) > -1) { return true; }
            }
        }
        
        if (matches('ignore')) {
            // everything that points to the ignore/ing command can have weird contextual wording
            return (matches('dont')) ?
                    this.ignore(msg, bot, ' ignore') : this.ignore(msg, bot, 'ignore');
        } else if (matches('ignoring')) {
            return (matches('begin', 'start')) ?
                    this.ignore(msg, bot, ' ignoring') : this.ignore(msg, bot, 'ignoring');
        } else if (matches('leave', 'disconnect', 'quit')) {
            return (matches('server')) ? this.exit(msg, bot) : this.leave(msg, bot);
        } else if (matches('shutdown')) {
            return this.exit(msg, bot);
        } else if (matches('unignore')) {
            return this.ignore(msg, bot, 'unignore');
        } else if (matches('listen', 'listening')) {
            return (matches('stop', 'dont')) ? this.listen(msg, bot, true) : this.listen(msg, bot);
        } else if (matches('join')) {
            return (matches('me', 'my')) ? this.join(msg, bot, true) : this.join(msg, bot);
        } else if (matches('shutdown')) {
            return this.exit(msg, bot);
        } else if (matches('ignore')) {
            return this.ignore(msg, bot);
        } else if (matches('id')) {
            return this.getId(msg, bot);
        } else {
            
            return bot.respond(msg.channelId, 'Sorry, I don\'t understand.');
        
        }

    }
    
};

module.exports = server;