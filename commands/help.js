/**
 * this is the only command you ~need to include for the bot to work
 * it doesn't even need to do anything, but it acts as a fallback if the bot is addressed and
 * has no idea what the user wants or the user asks for a list of commands
 * you could use it for cleverbot or fill it with responses tailored to your discord buds
*/
var help = {
    
    keywords: [
        'help',
        'commands',
        'commands'
    ],
    
    description: 'What I\'m doing now - listing __commands__ - and also responding ' +
                  'to people when I have no idea what they want.',
    
    list: function (msg, bot) {
        var commandList = '';
        
        Object.keys(bot.commands).forEach(function (x) {
            commandList += '**' + x.charAt(0).toUpperCase() + x.slice(1) + '**: ' +
                (bot.commands[x].description || 'I\'m not sure what this does.') + '\n\n';
        });
        
        return bot.respond(msg.channelId, commandList);
    },
    
    greeting: function (msg, bot) {
        return bot.respond(msg.channelId, [
            'Hello!',
            'Hi there.',
            'Oh, hello, ' + msg.user + '.',
            'Hey, ' + msg.user + '.',
            'Did you need something, ' + msg.user + '?'
        ]);
    },
            
    unknown: function (msg, bot) {
        
        // check if user probably forgot bot was listening
        var active = bot.listening.indexOf(msg.user);
        if (active > -1) {
            
            bot.listening.splice(active, 1);
            
            return bot.respond(msg.channelId, [
                'I think I\'m going to stop listening for now.',
                'It seems like you weren\'t really addressing me there.',
                'Maybe I should stop listening to you now.',
                'It\'s probably best if I stop listening to you for now.'
            ]);
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
        
        if (matches('help', 'commands')) {
            return this.list(msg, bot);
        } else if (matches('what') && matches('do')) {
            return this.list(msg, bot);
        } else if (matches('hey', 'hello', 'hi', 'oi', 'welcome')) {
            return this.greeting(msg, bot);
        } else {
            return this.unknown(msg, bot);
        }
    }
    
};

module.exports = help;