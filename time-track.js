#! /usr/bin/env node

var prompt = require('prompt'),
  tm = require('./task-manager'),
  chalk = require('chalk');

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
  console.log(chalk.green('start <task name>') + ' Start a new task with the given name.');
  console.log(chalk.green('stop <comment>') + ' Stop the current task. If a comment is specified it will be appended to the task name.');
  console.log(chalk.green('stopall') + ' Stop all running tasks.');
  console.log(chalk.green('print <yyy-mm-dd>') + ' Prints all tasks for the given day.');
  console.log(chalk.green('q') + ' Quit the application.');
}

doPrompt();
