var chalk = require('chalk'),
  q = require('q');

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

function runOnExecutor(executor, command, commandString, deferred) {
  var toCall = executor[command.f];

  if (!toCall) {
    console.log(chalk.red('Function ' + commandString + ' does not exist on TaskManager!'));

    deferred.resolve();
    return;
  }

  var params;

  if (command.paramRegex) {
    var parsed = command.paramRegex.exec(commandString);

    params = parsed ? parsed.slice(1) : null;
  }

  var promise = toCall.apply(executor, params);
  promise.then(deferred.resolve, deferred.reject);
}

/**
 * @returns a promise that gets resolved if we should prompt for another task and rejected if we are done.
 */
CommandParser.prototype.execute = function(commandString) {
  var deferred = q.defer();
  var command = findCommand(this.commands, commandString);

  if (!command) {
    console.log(chalk.red('Command not found!!'));
    if (findCommand(this.commands, '?').f()) {
      deferred.resolve();
    } else {
      deferred.reject();
    }
  } else {
    if (typeof command.f === 'function') {
      if (command.f()) {
        deferred.resolve();
      } else {
        deferred.reject();
      }
    } else {
      runOnExecutor(this.executor, command, commandString, deferred);
    }
  }

  return deferred.promise;
};

module.exports = CommandParser;
