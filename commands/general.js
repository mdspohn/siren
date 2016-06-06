/**
 * a collection of commands that are really just flavor
 * includes rolling 1-100
*/
var general = {
    
    keywords: [
        'roll',
        'random'
    ],
    
    description: 'It looks like this lets me __roll__ a random number and that\'s it. Neat.',
    
    roll: function (msg, bot) {
        var number = 1 + Math.floor(Math.random() * 100),
            checkem = function (n) {
                n = n + '';
                return (n > 10 && n.charAt(0) === n.charAt(1)) ?
                        ':point_left::skin-tone-1: Whoa!' : '';
            };
        
        return bot.respond(msg.channelId, msg.user + ' rolled ' + number + '! ' + checkem(number));
    },

    execute: function (msg, bot) {
        
        msg.keywords = msg.spotlight || msg.words;
        
        function matches() {
            var i = arguments.length;
            while (i--) {
                if (msg.keywords.indexOf(arguments[i]) > -1) { return true; }
            }
        }

        if (matches('roll', 'random')) {
            return this.roll(msg, bot);
        }
        
    }
    
};

module.exports = general;