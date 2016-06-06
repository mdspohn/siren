# Siren
"Fluid language" Youtube DJ Bot for Discord / Crafty Sea Witch

<p align="center"><img src="http://i.imgur.com/xdfFJSf.png"></p>

## About
Siren attempts to let you create chat commands that aren't as rigid as normal bots by breaking up user messages and parsing individual words. Check out [commands/skeleton.js](https://github.com/4waltz/siren/blob/master/commands/skeleton.js) to see a simple example of a command
or read below for a quick rundown.

Siren also manages a playlist that you can add songs to, clear, shuffle, skip and listen to in one of your voice channels.

## Dependencies:
The bot is built off of [discord.io](https://github.com/izy521/discord.io) so you'll need to grab that (and ytdl-core/ffmpeg if you plan on using the radio command).
```
npm install discord.io
npm install ytdl-core
```
If those install without error, hooray! 
* If you have a problem with node-opus installing through discord.io, make sure you have Python downloaded and on your path. 
* If you get an msbuild error, you probably need to grab [Visual Studio](https://www.microsoft.com/en-us/download/details.aspx?id=44914).

## "Fluid Language"
Siren works by turning things said in chat into an array of words, then checking those words against keywords for each command. The command with the most keyword matches is executed. 

Obviously once you know what's going on, you can say some silly things that don't make sense to humans or Siren and she'll just execute her best guess. But... if you don't do that it's a pretty fun way to talk to a chat bot.

## Creating Commands
To make a command, all you really need to do is add a javascript file in the 'commands' folder that looks like this:
```javascript
var exampleCommand = {

    keywords: [
        'example',
        'examples'
    ],
    
    description: 'This command is nearly useless.',
    
    execute: function (msg, bot) {
    
        bot.respond(msg.channelId, 'Here\'s an example for you, friend.');
    
    }
    
};

module.exports = exampleCommand;
```

And, boom! That's it. Feel free to use exampleCommand with your bot if you think your discord needs someone that responds "Here's an example for you, friend." to anyone that says "Show me an example, Siren." or "Siren, you better frickin toss out some examples." It'll even show up on the command list with your description.

That's honestly all you need to know to play around, but you can look through the other commands for ideas on how slightly more complicated ones work.

## Upkeep
There's a good chance I'm just going to make a "Siren-lite" without discord.io and probably less flavorful response variance (more practical for a radio bot), so I don't think I'll be changing anything to or cleaning up this project any time soon.
