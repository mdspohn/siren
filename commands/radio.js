var radio = {
    
    keywords: [
        'add',
        'play',
        'playing',
        'clear',
        'playlist',
        'shuffle',
        'randomize',
        'next',
        'skip',
        'list',
        'download',
        'start'
    ],
        
    description: 'I can __play__ youtube audio and keep track of it in a __playlist__, ' +
                 '__shuffle__ the songs, __skip__ \'em, or go to the __next__ one, ' +
                 'as well as tell you what\'s currently __playing__ or __up next__.',
    
    youtube: require('ytdl-core'),
    util: require('util'),
    fs: require('fs'),
    spawn: require('child_process').spawn,
    
    playlist: [],
    
    playing: {},
    
    shuffle: function (msg, bot) {
        var i, j, x;
        
        if (radio.playlist[0]) {
            
            for (i = radio.playlist.length; i; i -= 1) {
                j = Math.floor(Math.random() * i);
                x = radio.playlist[i - 1];
                radio.playlist[i - 1] = radio.playlist[j];
                radio.playlist[j] = x;
            }
            
            return bot.respond(msg.channelId, [
                'Roger that! It\'s all mixed up now.',
                'Got it. Scrambled.',
                'Ok done, be careful opening it. It\'s still a little shaken up.',
                'Uh oh... **' + radio.playlist[0].title + '** is next now.',
                ((msg.user === radio.playlist[0].user) ? 'Your ' : radio.playlist[0].user + '\'s ') +
                    'song is up next now.'
            ]);
            
        } else {
            
            return bot.respond(msg.channelId, [
                'I\'m afraid there\'s not really much to shuffle.',
                'Might need some songs in there to shuffle.',
                'An empty playlist makes this job pretty easy.',
                'Ok, first up now is still nothing (since the playlist is empty).'
            ]);
        }
        
        
        
    },
    
    clear: function (msg, bot) {
        
        radio.playlist = [];
        
        return bot.respond(msg.channelId, [
            'All right, clean slate.',
            'Done. Poor playlist.',
            'Ah, nothing like an empty playlist.',
            'Very well. The deed is done.',
            'Goodnight, sweet playlist.'
        ]);
        
    },
    
    showPlaylist: function (msg, bot) {
        var readable = '', i, j;
        
        for (i = 0, j = radio.playlist.length; i < j; i += 1) {
            readable += (i + 1) + ': **' + radio.playlist[i].title + '** - ' +
                radio.playlist[i].user + '\n';
        }
        
        if (readable) {
            return bot.respond(msg.channelId, readable);
        } else {
            return bot.respond(msg.channelId, 'There is no playlist yet, ' + msg.user + '.');
        }
    },
    
    nowPlaying: function (msg, bot) {
        
        if (radio.playing.title) {
            
            return bot.respond(msg.channelId,
                'I\'m currently playing **' + radio.playing.title + '**, which was requested by ' +
                    ((radio.playing.user === msg.user) ? 'you' : radio.playing.user) + '.'
                );
            
        } else {
            
            return bot.respond(msg.channelId,
                'I\'m not playing anything right now, ' + msg.user + '.'
                );
            
        }
        
    },
    
    upNext: function (msg, bot) {
        
        if (radio.playlist[0]) {
            
            return bot.respond(msg.channelId,
                'Up next is **' + radio.playlist[0].title + '**, which was requested by ' +
                    radio.playlist[0].user + '.'
                );
            
        } else {
            
            return bot.respond(msg.channelId,
                'There\'s nothing left on the playlist, so not much. Why not __add__ a song?'
                );
            
        }
        
    },
    
    add: function (msg, bot) {
        
        var q = msg.original.split('?v=')[1],
            mq = msg.original.split('youtu.be/')[1],
            id = (q) ? q.substring(0, 11) : ((mq) ? mq.substring(0, 11) : false),
            url = 'https://www.youtube.com/watch?v=' + id;
        
        if (id.length === 11) {
            
            bot.respond(msg.channelId, [
                'Sure, let me look it up...',
                'All right, give me a second to check on it...',
                'Let\'s see...',
                'Give me a second to pull it up...',
                'Ok, please wait a moment...',
                'Let me see if I can find it...',
                'Very well. One moment...'
            ]);
            
            radio.youtube(url, { filter: 'audioonly' })
                .on('info', function (info) {
                
                    if (info.title) {
                        
                        if (info.length_seconds > 900) {
                            
                            return bot.respond(msg.channelId, [
                                'Er, that\'s kind of long, don\'t you think?',
                                'Found it, but uh... I\'d rather not download something that long.',
                                'Maybe listen to something that long alone...',
                                'Is there a shorter version you could link?',
                                'I\'d be dead before that video finished downloading...'
                            ]);
                            
                        } else {
                        
                            bot.respond(msg.channelId, [
                                'All set, ' + msg.user + '. It\'s on the playlist now.',
                                'Found and added.',
                                'Ok, I got it.',
                                'All set. I\'ve added it.',
                                'Done and done.',
                                'Thanks for waiting, I found it.',
                                'All right, I\'ll put it on the playlist now.'
                            ]);

                            radio.playlist.push({
                                title: info.title,
                                url: url,
                                user: msg.user
                            });
                            
                        }
                        
                    } else if (err) {
                        
                        return bot.respond(msg.channelId, [
                            'Hmm, I couldn\'t find it.',
                            'I\'m not seeing it, sorry.',
                            'Are you sure that\'s the right url? I don\'t see it.',
                            'I can\'t find it!',
                            'Spooky... I don\'t see it.'
                        ]);
                        
                    }
            
                });
        } else {
            
            return bot.respond(msg.channelId, [
                'That\'s not a valid video url, ' + msg.user + '.',
                'Did you mistype the url? I don\'t think that\'s right.'
            ]);
            
        }
        
        
    },
    
    skip: function (msg, bot) {
        
        if (radio.playing.title) {
            
            radio.ffmpeg.kill();

            if (radio.playlist[0]) {
                
                return bot.respond(msg.channelId, [
                    'Thank god it\'s over.',
                    'Always a critic.',
                    'Yeah, perhaps being deaf wouldn\'t be so bad.',
                    'Aw, I was starting to get in to it.',
                    'You didn\'t even wait for the drop though.',
                    'It gets better, I swear.',
                    'It wasn\'t *that* bad.',
                    'Who suggested that one again? Oh yeah... ' + radio.playing.user + '.'
                ]);
                
            }
            
        } else {
            
            return bot.respond(msg.channelId, [
                'I\'m not playing anything right now.',
                'There\'s nothing to skip!',
                'That ringing in your ears isn\'t a song.'
            ]);
            
        }
    },
    
    start: function (bot, cId, firstSong) {
        
        radio.youtube(radio.playlist[0].url, { filter: 'audioonly' })
                    .pipe(radio.fs.createWriteStream('song.mp3'))
                    .on('finish', function () {
                        
                if (firstSong) {
                    bot.respond(cId, [
                        'Up first, **' + radio.playlist[0].title + '**.',
                        'Requested by ' + radio.playlist[0].user + ', **' +
                            radio.playlist[0].title + '**.',
                        'One, **' + radio.playlist[0].title + '**, coming right up.',
                        'Courtesy of ' + radio.playlist[0].user + ', here\'s **' +
                            radio.playlist[0].title + '**.'
                    ]);
                }
            
                function handleStream(stream) {
                    radio.ffmpeg = radio.spawn('ffmpeg', [
                        '-i', 'song.mp3',
                        '-f', 's16le',
                        '-ar', '48000',
                        '-ac', '2',
                        'pipe:1'
                    ], {stdio: ['pipe', 'pipe', 'ignore']});

                    radio.ffmpeg.stdout.once('readable', function () {
                        stream.send(radio.ffmpeg.stdout);
                    });

                    radio.ffmpeg.stdout.once('end', function () {
                        radio.next(bot, cId);
                    });
                }
            
                if (radio.playlist[0]) {

                    radio.playing.user = radio.playlist[0].user;
                    radio.playing.title = radio.playlist[0].title;

                    radio.playlist.shift();
                    
                    
                    
                    bot.getAudioContext({channel: bot.currentVoiceChannel, stereo: true}, handleStream);

                    
                }
            
            });
    },
    
    next: function (bot, cId) {
        
        if (radio.playlist[0]) {
            
            bot.respond(cId, [
                'Up next is **' + radio.playlist[0].title + '**.',
                'Requested by ' + radio.playlist[0].user + ', **' + radio.playlist[0].title + '**.',
                'Courtesy of ' + radio.playlist[0].user + ', here\'s **' +
                    radio.playlist[0].title + '**.',
                'Now playing **' + radio.playlist[0].title + '**.',
                'This is a little number I like to call **' + radio.playlist[0].title + '**.',
                '**' + radio.playlist[0].title + '** is coming up next. Feel free to sing along.',
                'Thanks to ' + radio.playlist[0].user + ', **' + radio.playlist[0].title +
                    '** is next.',
                '**' + radio.playlist[0].title + '** is coming up. Feel free to __skip__ it.',
                'Hot off the press! I give you **' + radio.playlist[0].title + '**.',
                'Not my top choice, but **' + radio.playlist[0].title + '** is next.'
            ]);
            
            radio.start(bot, cId, false);
            
        } else {
            
            bot.respond(cId, [
                'We\'ve reached the end. Unless someone has another request that is.',
                'Show\'s over, friends. Anyone have another song to __play__?',
                'Well, that\'s everything. Anyone else want to __add__ a song?'
            ]);
            
            radio.playing = {};
            
        }
    },
    
    play: function (msg, bot) {
        
        var q = msg.original.split('?v=')[1],
            mq = msg.original.split('youtu.be/')[1],
            id = (q) ? q.substring(0, 11) : ((mq) ? mq.substring(0, 11) : false),
            url = 'https://www.youtube.com/watch?v=' + id;
        
        if (id) {
            
            return radio.add(msg, bot);
            
        } else if (radio.playlist[0] && !radio.playing.title) {
            
            if (bot.currentVoiceChannel) {
                
                bot.respond(msg.channelId, [
                    'Ok, give me a moment to prepare.',
                    'Sounds good! One second.',
                    'Sure, almost ready, just polishing the record.',
                    'All right, I just need to plug in my microphone.',
                    'Very well, let me collect myself.'
                ]);
                
                radio.start(bot, msg.channelId, true);
            
            } else {
                
                return bot.respond(msg.channelId, [
                    'Someone will need to direct me to a voice channel first.',
                    'With no stage to play on? I need to __join__ a voice channel.',
                    'Hold on, I\'ll type out the lyrics. Or someone could give me a ' +
                        'channel to __join__ instead.',
                    'Mind inviting me to a voice channel first?'
                ]);
                
            }
            
            
        } else {
            
            if (msg.words.length > 2) {
                
                return bot.respond(msg.channelId, [
                    'I need a valid youtube url to add something to the playlist.',
                    'I need you to give me a youtube video url to __play__ anything.',
                    'I need a youtube video url to __add__ something.'
                ]);
                
            } else {
            
                return bot.respond(msg.channelId, [
                    'There\'s nothing in the playlist right now.',
                    'Play what? Someone needs to __add__ some songs.',
                    'I\'m already playing the only song on the playlist (nothing).',
                    'There\'s nothing on the playlist. Oh... is this some sort of avant-garde thing?'
                ]);
                
            }
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

        if (matches('play', 'add', 'download', 'start')) {
            return this.play(msg, bot);
        } else if (matches('skip')) {
            return this.skip(msg, bot);
        } else if (matches('next')) {
            if (!matches('what', 'whats', 'up')) {
                return this.skip(msg, bot);
            } else {
                return this.upNext(msg, bot);
            }
        } else if (matches('playing')) {
            return this.nowPlaying(msg, bot);
        } else if (matches('clear', 'delete')) {
            return this.clear(msg, bot);
        } else if (matches('shuffle', 'scramble', 'randomize')) {
            return this.shuffle(msg, bot);
        } else if (matches('playlist', 'list')) {
            return this.showPlaylist(msg, bot);
        }
        
    }
    
};

module.exports = radio;