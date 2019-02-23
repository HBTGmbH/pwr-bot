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
The easiest way to implement your own command is by taking a look at the `system-commands/help.js` command 
interpreter. A few things to remember:
* If you want to interact with the messages in a more complex way (send to a different user, send later), you can
use the provided `driver`, which is the rocket.chat SDKs primary interaction point
* If you want to interact with the manager, you will need to write a system-command. Only system-commands get access
to the manager. Call it a 'security' feature.
* If you want to configure your command via `config.yaml`, read the commands in the sample config and make sure
to implement `getName()`

## System commands

# Tests
Tests? No, we don't do tests around here.

# To-Dos
A few system commands that are still missing:
* reload-command (--custom, --system, --all, --single)
* unload-command
* load-command
* restart
* join-room
* leave-room

Features that are planned:
* Centralized permission system
* Localization
* custom require() that installs dependencies
