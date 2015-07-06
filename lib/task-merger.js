"use strict";

var chalk = require('chalk'),
  cP = require('./command-parser'),
  UserInput = require('./user-input'),
  utils = require('./time-track-utils');

var commands = [{
  schema: 'q, exit, quit',
  description: 'Quit merging.',
  matcher: /^q$|^exit$|^quit$/,
  f: function() {
    return false;
  }
}, {
  schema: '<from> -> <to>',
  description: 'Merge the times from <from> to the <to> task.',
  matcher: /^[^\s]*\s->\s.*$/,
  paramRegex: /^([^\s]*)\s->\s(.*)$/,
  f: 'doMerge'
}, {
  schema: '?',
  description: 'Print all available commands.',
  matcher: /^\?$/,
  f: function() {
    console.log(chalk.blue('Available Commands:'));

    commands.forEach(function(command) {
      console.log(chalk.green(command.schema) + ' ' + command.description);
    });

    return true;
  }
}];

var userInput = new UserInput();

function printTasks(tasks) {
  console.log(chalk.bold('Available tasks:'));

  tasks.forEach(function(task) {
    console.log(chalk.blue(task.id + '. ' + task.description));
  });
}

function TaskMerger(tasks, deferred) {
  this.tasks = tasks;
  this.deferred = deferred;
  this.commandParser = new cP(this, commands);
}

TaskMerger.prototype.doMerge = function(from, to) {
  console.log('From: ' + from);
  console.log('To: ' + to);

  return utils.defer(true);
};

TaskMerger.prototype.run = function() {
  var merger = this;
  printTasks(this.tasks);

  userInput.nextLine('Merge (? for help):').then(function(command) {
    if (command && command.length > 0) {
      /**
       * If the command is resolved can ask for another command.
       * If it is rejected we exit the application
       */
      merger.commandParser.execute(command).then(function() {
        merger.run();
      }, function() {
        merger.deferred.resolve();
      });
    } else {
      merger.run();
    }
  });
};
module.exports = TaskMerger;
