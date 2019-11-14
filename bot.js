String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};
var Discord = require('discord.io');
var winston = require('winston');
var auth = require('./auth.json');
var colors = require('colors');
var x = 0;
var y = 0;
var dir = 0;
var grid = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];
// Configure logger settings
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple()
});
logger.remove(winston.transports.Console);
logger.add(new winston.transports.File({ filename: 'log_' + new Date().toLocaleDateString().replaceAll('/', '-') + '.log',  options: {flags: 'w+'}}));
logger.level = 'debug';
function logInfo(text) {
	console.log("[INFO]: ".green + text);
	logger.info(text);
}
function logError(text) {
	console.log("[ERROR]: ".red + text);
	logger.error(text);
}
function logRainbow(text) {
	console.log("[INFO!!!]: ".rainbow + text);
	logger.info(text);
}
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logRainbow('Connected');
    logInfo('Logged in as: ' + bot.username);
});
bot.on('message', function (user, userID, channelID, message, evt) {
	logInfo('Got message from ' + user  + ' in chanel ' + channelID + ': ' + message);
    if (message.substring(0, 1) == '*') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
			case 'help':
				bot.sendMessage({
                    to: channelID,
                    message: 'All commands start with a `*`\nkarel - display world info\nmove turnLeft putBall takeBall - karel commands\nreset - reset karel world\nmulti OR code - run multiple commands (Ex: `multi move;turnLeft`)\nKarel world info:\n' + world(channelID)
                });
				return;
			case 'reset':
				x = 0;
				y = 0;
				dir = 0;
				grid = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];
				bot.sendMessage({
                    to: channelID,
                    message: 'Reset Karel World!'
                });
				return;
            case 'move':
                bot.sendMessage({
                    to: channelID,
                    message: 'Karel moved!'
                });
				switch (dir) {
					case 0:
						x++;
						break;
					case 1:
						y++;
						break;
					case 2:
						x--;
						break;
					case 3:
						y--;
						break;
				}
				break;
				if (x < 0 || x > 4 || y < 0 || y > 4) {
					bot.sendMessage({
						to: channelID,
						message: 'Karel crashed into a wall! Resetting!'
					});
					return;
				}
			case 'turnLeft':
                bot.sendMessage({
                    to: channelID,
                    message: 'Karel turnedLeft!'
                });
				dir++;
				if (dir == 4) {
					dir = 0;
				}
				break;
			case 'putBall':
                bot.sendMessage({
                    to: channelID,
                    message: 'Karel put a ball!'
                });
				grid[y][x]++;
				break;
			case 'takeBall':
                bot.sendMessage({
                    to: channelID,
                    message: 'Karel took a ball!'
                });
				grid[y][x]--;
				if (grid[y][x] < 0) {
					bot.sendMessage({
						to: channelID,
						message: 'No balls to take! Resetting!'
					});
					x = 0;
					y = 0;
					dir = 0;
					grid = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];
					return;
				}
				break;
			case 'karel':
				bot.sendMessage({
					to: channelID,
					message: world(channelID)
				});
				break;
			case 'code':
			case 'multi':
				if (message.split(' ')[1] == undefined) {
					bot.sendMessage({
						to: channelID,
						message: 'Please specify more commands! Example: `!multi move;turnLeft;putBall;move`'
					});
					return;
				}
				var code = message.split(' ')[1].split(';');
				for (var i = 0; i < code.length; i++) {
					logInfo('Multi code: ' + code[i]);
					switch(code[i]) {
						case 'reset':
							x = 0;
							y = 0;
							dir = 0;
							grid = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];
							break;
						case 'move':
							switch (dir) {
								case 0:
									x++;
									break;
								case 1:
									y++;
									break;
								case 2:
									x--;
									break;
								case 3:
									y--;
									break;
							}
							break;
							if (x < 0 || x > 4 || y < 0 || y > 4) {
								bot.sendMessage({
									to: channelID,
									message: 'Karel crashed into a wall! Resetting!'
								});
								x = 0;
								y = 0;
								dir = 0;
								grid = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];
								return;
							}
						case 'turnLeft':
							dir++;
							if (dir == 4) {
								dir = 0;
							}
							break;
						case 'putBall':
							grid[y][x]++;
							break;
						case 'takeBall':
							grid[y][x]--;
							if (grid[y][x] < 0) {
								bot.sendMessage({
									to: channelID,
									message: 'No balls to take! Resetting!'
								});
								x = 0;
								y = 0;
								dir = 0;
								grid = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];
								return;
							}
							break;
					}
				}
				if (x < 0 || x > 4 || y < 0 || y > 4) {
					bot.sendMessage({
						to: channelID,
						message: 'Karel crashed into a wall! Resetting!'
					});
					x = 0;
					y = 0;
					dir = 0;
					grid = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];
					return;
				}
				bot.sendMessage({
					to: channelID,
					message: 'Done!'
				});
				break;
				default:
					bot.sendMessage({
						to: channelID,
						message: 'Invalid command! use *help to show commands'
					});
					break;
         }
     }
});
function world(cid) {
	if (x < 0 || x > 4 || y < 0 || y > 4) {
		bot.sendMessage({
			to: cid,
			message: 'Karel crashed into a wall! Resetting!'
		});
		x = 0;
		y = 0;
		dir = 0;
		grid = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];
		return '`Error getting world!`';
	}
	var o = '';
	for (var yi = 0; yi < 5; yi++) {
		var row = '';
		for (var xi = 0; xi < 5; xi++) {
			if (xi == x && yi == y) {
				row += 'K';
			} else if (grid[yi][xi] == 0) {
				row += '-';
			} else {
				row += grid[yi][xi];
			}
		}
		o = row + '\n' + o;
	}
	return '```\n' + o + '\n```\n' + direction() + '\n' + balls() + '\nx: ' + x + ' y: ' + y;
}
function direction() {
	switch (dir) {
		case 0:
			return 'Karel is facing East!';
		case 1:
			return 'Karel is facing North!';
		case 2:
			return 'Karel is facing West!';
		case 3:
			return 'Karel is facing south!';
	}
	return '`Error getting direction!`';
}
function balls() {
	return 'Karel is sitting on ' + grid[y][x] + ' balls!';
}
