#! /usr/bin/env node

var prompt = require('prompt'),
  tm = require('./task-manager'),
  chalk = require('chalk');

var promptProps = {
  properties: {
    command: {
      message: 'Command (start <message>, stop, stopAll, print)'
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
  } else if (command.indexOf('stopall') === 0) {
    return taskManager.stopAllTasks();
  } else if (command.indexOf('stop') === 0) {
    return taskManager.stopCurrentTask();
  } else if (command.indexOf('print') === 0) {
    return taskManager.print(command.substring(5).trim());
  } else {
    console.log(chalk.red('Command not found!!'));
  }

  return true;
}

doPrompt();
