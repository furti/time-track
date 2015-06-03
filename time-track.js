#! /usr/bin/env node

var prompt = require('prompt'),
  tm = require('./task-manager'),
  chalk = require('chalk'),
  commands = require('./commands');

var promptProps = {
  properties: {
    command: {
      message: 'Command (? for help)'
    }
  }
};

var taskManager = new tm();

prompt.start();

function doPrompt() {
  prompt.get(promptProps, function(err, result) {
    if (result && result.command) {
      if (!execute(result.command)) {
        return;
      }
    }

    doPrompt();
  });
}

/**
 * @returns true if we should prompt for another task. fals otherwise
 */
function execute(commandString) {
  var command = findCommand(commandString);

  if (!command) {
    console.log(chalk.red('Command not found!!'));
    return findCommand('?').f();
  } else {
    if (typeof command.f === 'function') {
      return command.f();
    } else {
      return runOnTaskManager(command, commandString);
    }
  }
}

function runOnTaskManager(command, commandString) {
  var toCall = taskManager[command.f];

  if (!toCall) {
    console.log(chalk.red('Function ' + commandString + ' does not exist on TaskManager!'));

    return true;
  }

  var params;

  if (command.paramRegex) {
    var parsed = command.paramRegex.exec(commandString);
    params = parsed ? parsed[1] : null;
  }

  return toCall.call(taskManager, params);
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

doPrompt();
