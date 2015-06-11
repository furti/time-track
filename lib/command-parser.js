var chalk = require('chalk');

function CommandParser(executor, commands) {
  this.executor = executor;
  this.commands = commands;
}

function findCommand(commands, commandString) {
  if (!commandString) {
    return;
  }

  for (var index in commands) {
    if (commands[index].matcher.test(commandString)) {
      return commands[index];
    }
  }
}

function runOnExecutor(executor, command, commandString) {
  var toCall = executor[command.f];

  if (!toCall) {
    console.log(chalk.red('Function ' + commandString + ' does not exist on TaskManager!'));

    return true;
  }

  var params;

  if (command.paramRegex) {
    var parsed = command.paramRegex.exec(commandString);

    params = parsed ? parsed.slice(1) : null;
  }

  return toCall.apply(executor, params);
}

/**
 * @returns true if we should prompt for another task. false otherwise
 */
CommandParser.prototype.execute = function(commandString) {
  var command = findCommand(this.commands, commandString);

  if (!command) {
    console.log(chalk.red('Command not found!!'));
    return findCommand(this.commands, '?').f();
  } else {
    if (typeof command.f === 'function') {
      return command.f();
    } else {
      return runOnExecutor(this.executor, command, commandString);
    }
  }
};

module.exports = CommandParser;
