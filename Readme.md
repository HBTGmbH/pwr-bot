# The Bot 
This bot is a modular rocket.chat bot based on the rocket.chat SDK. It's goal is to provide a simple interface
to write custom scripts with which the bot can interact with the chat server. It is heavily inspired by the
red discord-bot. 

The bot is written in plain Javascript and runs with NodeJS as interpreter.

# Prequesites
* [Node JS, 8 or higher](https://nodejs.org/en/)
* [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com)

You can use any of those 2 package managers, though npm comes bundled with NodeJS.

# Getting Started
Setting up the bot is fairly easy, and it should work out of the box without any problems.

1. Clone this repository `git clone https://github.com/HBTGmbH/pwr-bot.git`
2. Install the necessary dependencies with `yarn install` or `npm install`
3. Copy the `sample-config.yaml` into a new `config.yaml`
4. Edit the `config.yaml` to match your custom configuration. You should at least set the following properties:
    1. `bot.user`, `bot.password` and `bot.host` so the bot knows where to connect to
    2. `commands.custom-location` and `commands.system-location` so the bot can find commands. 
4. Set the environment variable `pwr.bot.config-location` to the (preferrably full) path to your `config.yaml`. If
the environment variable is not set, the bot will try a few default locations with the name `config.yaml`. If it does not find
any, it won't start, and you will see an error message.
5. Run the bot
    1. Either use the provided `bot` script by calling `npm run bot`
    2. Or use node directly by calling `node bot.js`
6. That's it, you are done!

You can check if the bot works by running the `!help` command.

# Commands
The bot works with so-called **commands**. A command is an arbitrary string, starting with an "!". These commands
are handled by the modular command processors. 

Whenever the bot receives a message, it checks the messages structure. If the messages starts with an exclamation 
mark ("!"), it will assume that all following letters are directed at the bot. The bot then interprets that as
a command.

Every command-processor that is loaded now has the chance to decide if they are interested in that command. If they
choose to react to it, they return their reaction as string or promise, and the bot will forward that message to the 
channel it received the command from.

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
