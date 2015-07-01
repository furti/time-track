"use strict";

var chalk = require('chalk'),
  cP = require('./command-parser');

var commands = [{
  schema: 'q, exit, quit',
  description: 'Quit merging.',
  matcher: /^q$|^exit$|^quit$/,
  f: function() {
    return false;
  }
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

function printTasks(tasks) {
  tasks.forEach(function(task) {
    console.log(chalk.blue(task.id + '. ' + task.description));
  });
}

function TaskMerger(tasks, deferred) {
  this.tasks = tasks;
  this.deferred = deferred;
  this.commandParser = new cP(this, commands);
}

TaskMerger.prototype.start = function() {
  printTasks(this.tasks);

<<<<<<< Updated upstream
<<<<<<< Updated upstream
  print(this.tasks);
  //  prompt.get(promptProps, handlePrompt);
  console.log('prompt over');
=======
  this.deferred.resolve();
>>>>>>> Stashed changes
=======
  this.deferred.resolve();
>>>>>>> Stashed changes
};

module.exports = TaskMerger;
