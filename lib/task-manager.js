/**
 * Copyright 2015 Daniel Furtlehner
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use strict";

var chalk = require('chalk'),
  utils = require('./time-track-utils'),
  taskManagerUtils = require('./task-manager-utils');


function TaskManager() {
  this.tasks = [];
  this.currentTask = null;
  this.file = taskManagerUtils.createFileName(taskManagerUtils.toDay(new Date()));

  taskManagerUtils.setupCurrentDay(this, this.file);
}

TaskManager.prototype.startNewTask = function(description) {
  var newTask = {
    id: this.tasks.length + 1,
    description: description,
    times: [{
      start: new Date()
    }]
  };

  this.tasks.push(newTask);

  if (this.currentTask) {
    taskManagerUtils.endLastSlot(this.currentTask);
    newTask.prev = this.currentTask.id;
  }

  this.currentTask = newTask;

  utils.printTask(this.currentTask);

  taskManagerUtils.persistTasks(this.file, this.tasks, this.currentTask);

  return utils.defer(true);
};

TaskManager.prototype.stopCurrentTask = function(comment) {
  taskManagerUtils.stopCurrentTask(this, comment);

  return utils.defer(true);
};

/**
 * End the current tasks last timeslot
 */
TaskManager.prototype.pause = function() {
  if (this.currentTask) {
    taskManagerUtils.endLastSlot(this.currentTask);
    this.currentTask.paused = true;

    utils.printTask(this.currentTask);

    taskManagerUtils.persistTasks(this.file, this.tasks, this.currentTask);
  }

  return utils.defer(true);
};

/**
 * End the current tasks last timeslot
 */
TaskManager.prototype.resume = function() {
  if (this.currentTask && this.currentTask.paused) {
    this.currentTask.times.push({
      start: new Date()
    });

    this.currentTask.paused = false;

    taskManagerUtils.persistTasks(this.file, this.tasks, this.currentTask);
  }

  utils.printTask(this.currentTask);

  return utils.defer(true);
};


TaskManager.prototype.stopAllTasks = function() {
  while (this.currentTask) {
    taskManagerUtils.stopCurrentTask(this);
  }

  return utils.defer(false);
};

TaskManager.prototype.print = function(day) {
  //Simply export the tasks to the command line
  return this.exportTasks(day, 'commandline');
};

TaskManager.prototype.exportTasks = function(day, exporterName) {
  return taskManagerUtils.doWithDay(day, this.currentTask, function(data, deferred) {
    try {
      var fullExporterName = 'time-track-' + exporterName + '-exporter';

      var exporter = require(fullExporterName);
      exporter(data.tasks);
    } catch (exception) {
      console.log(chalk.red(exception));
      console.log(chalk.red('Maybe you have not installed the required exporter?'));
      console.log(chalk.red('Run "npm install -g time-track-' + exporterName + '-exporter" to install it'));
      console.log(chalk.red('If the module is already installed, check if the NODE_PATH environment variable is set.'));
    }

    utils.printTask(this.currentTask);

    deferred.resolve();
  });
};

module.exports = TaskManager;
