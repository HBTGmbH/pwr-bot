# The Bot 
This bot is a modular rocket.chat bot based on the rocket.chat SDK. It's goal is to provide a simple interface
to write custom scripts with which the bot can interact with the chat server. It is heavily inspired by the
red discord-bot. 

# Quickstart
Todo?

* Clone this repository
* run `yarn install` or `npm install`
* change the `sample-config.yaml`
* set the environment variable `pwr.bot.config-location` to the path to your `config.yaml`
* run the bot with `node bot.js`

The bot should automatically connect to your server, log in, and join the specified rooms!

You can check if the bot works by running the `!help` command.

# Commands
The bot works with so-called **commands**. A command is an arbitrary string, starting with an "!". These commands
are handled by the modular command processors. 

Whenever the bot receives a message, it checks the messages structure. If the messages starts with an exclamation 
mark ("!"), it will assume that all following letters are directed at the bot. The bot then interpretes that as
a command.

Every command-processor that is loaded now has the chance to decide if they are interested in that command,
and then, how to react to it. The reaction is returned in a Promise, and the bot will send that reaction
to the room/channel/person it received the command from. 

## Custom commands
The easiest way to implement your own command is by taking a look at the `commands/sample-command.js` command 
class. A few things to remember:
* If you want to interact with the messages in a more complex way (send to a different user, send later), you can
use the provided `driver`, which is the rocket.chat SDKs primary interaction point
* If you want to interact with the manager, you will need to write a system-command. Only system-commands get access
to the manager. Call it a 'security' feature.
* If you want to configure your command via `config.yaml`, read the commands in the sample config and make sure
to implement `getName()`

### Providing dependencies to a command
As your command is a normal node-JS script, dependencies that you plan to use and that are NOT system-default 
(like axios) will need to be installed. You can either install these dependencies beforehand, or use the globally
available `pwrRequire()` function:

```javascript
async function doStuff() {
    const axios = await pwrRequire("axios");
    axios.get(...);
}
doStuff();
```
Note that pwrRequire needs to be wrapped in an async block with await, as pwrRequire itself is async. Otherwise, you will
have to deal with resolving the promise manually. 

You might not want to import your library every time you call a certain method. To avoid this, you can implement
the onInit() method in your command:

```javascript
async onInit() {
    this.axios = await pwrRequire("axios");
}
```
The bot will call this method (and wait for it to finish) if you choose to implement it. 

## System commands


# Tests
Tests? No, we don't do tests around here.

# To-Dos
A few system commands that are still missing:
* unload-command
* load-command
* restart
* join-room
* leave-room

Features that are planned:
* Centralized permission system
* Localization
