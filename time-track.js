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
function execute(command) {
  if (command.indexOf('start') === 0) {
    return taskManager.startNewTask(command.substring(5).trim());
  } else if (command == 'stopall') {
    return taskManager.stopAllTasks();
  } else if (command.indexOf('stop') === 0) {
    return taskManager.stopCurrentTask(command.substring(4).trim());
  } else if (command.indexOf('print') === 0) {
    return taskManager.print(command.substring(5).trim());
  } else if (command.indexOf('export') === 0) {
    return taskManager.export(command.substring(7).trim());
  } else if (command === 'pause') {
    return taskManager.pause();
  } else if (command === 'resume') {
    return taskManager.resume();
  } else if (command === '?') {
    printHelp();
  } else if (command === 'q') {
    return false;
  } else if (command === '?') {
    printHelp();
  } else {
    console.log(chalk.red('Command not found!!'));
    printHelp();
  }

  return true;
}

function printHelp() {
  console.log(chalk.blue('Available Commands:'));

  commands.forEach(function(command) {
    console.log(chalk.green(command.schema) + ' ' + command.description);
  });
}

doPrompt();
