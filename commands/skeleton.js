/**
 * change the name of @skeleton to something unique and descriptive of your command
 * make sure you save this file with the same name as the command + .js
*/

var skeleton = {
    
    /**
     * [array] is searched to figure out the most likely command to execute
     * if a word is really important, (like 'youtube' for a youtube command),
     * add it more than once to increase its weight
    */
    keywords: [
        'skeleton',
        'skeletons',
        'goblin',
        'goblins',
        'ghost',
        'ghosts',
        'spook',
        'spooks'
    ],
        
    /**
     * [string] short explanation of what this command does 
     * this is listed by the bot when asked for help or a command list
    */
    description: '',
    
    goblin: function (msg, bot) {
        
        return bot.respond(msg.channelId, ':muscle::japanese_goblin::point_right:');
        
    },
    
    ghost: function (msg, bot) {
        
        return bot.respond(msg.channelId, ':ghost:');
        
    },
    
    skeleton: function (msg, bot) {
        
        return bot.respond(msg.channelId, ':skull:');
        
    },
    
    /**
     * @execute [function] handles executing subcommands in this command module
    */
    execute: function (msg, bot) {
        
        msg.keywords = msg.spotlight || msg.words;

        // accepts [string](s) and returns true if included in user message
        function matches() {
            var i = arguments.length;
            while (i--) {
                if (msg.keywords.indexOf(arguments[i]) > -1) { return true; }
            }
        }
        
        if (matches('skeleton', 'skeletons')) {
            return this.skeleton(msg, bot);
        } else if (matches('ghost', 'spook', 'spooks', 'ghosts')) {
            return this.ghost(msg, bot);
        } else if (matches('goblin', 'goblins')) {
            return this.goblin(msg, bot);
        }
        
    }
    
};

// change @skeleton to whatever you named your command up top
module.exports = skeleton;