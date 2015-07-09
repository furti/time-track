"use strict";

var chalk = require('chalk'),
  cP = require('./command-parser'),
  UserInput = require('./user-input'),
  taskManagerUtils = require('./task-manager-utils'),
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

function TaskMerger(taskData, deferred, file) {
  this.tasks = taskData.tasks;
  this.currentId = taskData.currentId;
  this.deferred = deferred;
  this.file = file;
  this.commandParser = new cP(this, commands);
}

TaskMerger.prototype.doMerge = function(fromId, toId) {
  var fromTask = this.tasks[parseInt(fromId) - 1],
    toTask = this.tasks[parseInt(toId) - 1];

  this.mergeTimes(fromTask, toTask);
  this.removeTask(fromId);
  this.changeIds(fromId, toId);

  return utils.defer(true);
};

TaskMerger.prototype.removeTask = function(id) {
  this.tasks.splice(id - 1, 1);
};

TaskMerger.prototype.changeIds = function(fromId, toId) {
  var changed = {
      fromId: toId
    },
    index;

  for (index = 0; index < this.tasks.length; index++) {
    var task = this.tasks[index];

    var idBefore = task.id;

    if (idBefore !== index + 1) {
      changed[idBefore - 1] = index + 1;
      task.id = index + 1;
    }

    if (idBefore === toId) {
      changed[fromId] = task.id;
    }
  }

  this.tasks.forEach(function(task) {
    if (changed[task.prev]) {
      task.prev = changed[task.prev];
    }
  });
};

TaskMerger.prototype.mergeTimes = function(fromTask, toTask) {
  if (!fromTask.times) {
    return;
  }

  if (!toTask.times) {
    toTask.times = [];
  }

  fromTask.times.forEach(function(time) {
    toTask.times.push(time);
  });
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
        taskManagerUtils.persistTasks(merger.file, merger.tasks, merger.tasks[merger.currentId]);
        merger.deferred.resolve();
      });
    } else {
      merger.run();
    }
  });
};
module.exports = TaskMerger;
