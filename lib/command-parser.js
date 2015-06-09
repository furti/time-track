var chalk = require('chalk'),
  commands = require('../commands');

function CommandParser(taskManager) {
  this.taskManager = taskManager;
}

/**
 * @returns true if we should prompt for another task. false otherwise
 */
CommandParser.prototype.execute = function(commandString) {
  var command = findCommand(commandString);

  if (!command) {
    console.log(chalk.red('Command not found!!'));
    return findCommand('?').f();
  } else {
    if (typeof command.f === 'function') {
      return command.f();
    } else {
      return runOnTaskManager(this.taskManager, command, commandString);
    }
  }
};

function runOnTaskManager(taskManager, command, commandString) {
  var toCall = taskManager[command.f];

  if (!toCall) {
    console.log(chalk.red('Function ' + commandString + ' does not exist on TaskManager!'));

    return true;
  }

  var params;

  if (command.paramRegex) {
    var parsed = command.paramRegex.exec(commandString);

    params = parsed ? parsed.slice(1) : null;
  }

  return toCall.apply(taskManager, params);
}

function findCommand(commandString) {
  if (!commandString) {
    return;
  }

  for (var index in commands) {
    if (commands[index].matcher.test(commandString)) {
      return commands[index];
    }
  }
}

module.exports = CommandParser;
