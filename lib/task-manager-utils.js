"use strict";

var fs = require('fs'),
  q = require('q'),
  timeTrackUtils = require('./time-track-utils'),
  chalk = require('chalk');

var utils = {
  /**
   * Loads all tasks from the file for the given day and calls the callback with this data
   */
  doWithDay: function(day, currentTask, callback) {
    var deferred = q.defer();

    if (!day) {
      console.log(chalk.red('please specify a day (yyyy-mm-dd) or "today"'));

      timeTrackUtils.printTask(currentTask);

      deferred.resolve();
      return deferred.promise;
    }

    var data = utils.parseFile(utils.createFileName(day));

    if (!data) {
      console.log(chalk.red('Data for day ' + day + ' not found!'));

      timeTrackUtils.printTask(currentTask);

      deferred.resolve();
      return deferred.promise;
    }

    callback(data, deferred);

    return deferred.promise;
  },

  persistTasks: function(file, tasks, currentTask) {
    var toSave = {
      tasks: tasks
    };

    if (currentTask) {
      toSave.currentId = currentTask.id;
    }

    try {
      fs.writeFileSync(file, JSON.stringify(toSave));
    } catch (err) {
      console.log(chalk.red(err));
    }
  },

  endLastSlot: function(task) {
    //Set the end date for the last time slot in the task
    var lastTimeSlot = task.times[task.times.length - 1];
    lastTimeSlot.end = new Date();
  },

  toDay: function(date) {
    return date.getFullYear() + '-' + utils.pad((date.getMonth() + 1)) + '-' + utils.pad(date.getDate());
  },

  createFileName: function(day) {
    var dir = process.cwd();

    if (day === 'today') {
      day = utils.toDay(new Date());
    }

    return dir + '/' + day + '.json';
  },

  parseFile: function(file) {
    if (fs.existsSync(file)) {
      var content = fs.readFileSync(file, {
        encoding: 'utf8'
      });

      return JSON.parse(content, function(key, v) {
        if (key === 'start' || key === 'end') {
          return new Date(v);
        }

        return v;
      });
    }
  },

  setupCurrentDay: function(taskManager, file) {
    var data = utils.parseFile(file);

    if (!data) {
      return;
    }

    taskManager.tasks = data.tasks;

    if (data.currentId) {
      taskManager.currentTask = taskManager.tasks[data.currentId - 1];

      timeTrackUtils.printTask(taskManager.currentTask);
    }
  },

  pad: function(number) {
    if (number < 10) {
      return '0' + number;
    }
    return number;
  },

  stopCurrentTask: function(taskManager, comment) {
    if (!taskManager.currentTask) {
      return;
    }

    if (taskManager.currentTask.paused) {
      taskManager.currentTask.paused = false;
    } else {
      utils.endLastSlot(taskManager.currentTask);
    }

    //add the comment to the task description if specified
    if (comment) {
      taskManager.currentTask.description += ' ' + comment;
    }

    if (taskManager.currentTask.prev) {
      //If we have a previous task we have to add another time slot
      var prevTask = taskManager.tasks[taskManager.currentTask.prev - 1];
      prevTask.times.push({
        start: new Date()
      });

      taskManager.currentTask = prevTask;

      timeTrackUtils.printTask(taskManager.currentTask);
    } else {
      taskManager.currentTask = null;
      console.log(chalk.red('No task is running!'));
    }

    utils.persistTasks(taskManager.file, taskManager.tasks, taskManager.currentTask);
  }
};

module.exports = utils;
