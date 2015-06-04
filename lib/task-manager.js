var chalk = require('chalk'),
  fs = require('fs'),
  utils = require('./time-track-utils');

function TaskManager() {
  this.tasks = [];
  this.currentTask = null;
  this.file = createFileName(toDay(new Date()));

  setupCurrentDay(this, this.file);
}

TaskManager.prototype.startNewTask = function(taskName) {
  var newTask = {
    id: this.tasks.length + 1,
    name: taskName,
    times: [{
      start: new Date()
    }]
  };

  this.tasks.push(newTask);

  if (this.currentTask) {
    endLastSlot(this.currentTask);
    newTask.prev = this.currentTask.id;
  }

  this.currentTask = newTask;

  utils.printTask(this.currentTask);

  persistTasks(this.file, this.tasks, this.currentTask);

  return true;
};

TaskManager.prototype.stopCurrentTask = function(comment) {
  if (!this.currentTask) {
    return true;
  }

  if (this.currentTask.paused) {
    this.currentTask.paused = false;
  } else {
    endLastSlot(this.currentTask);
  }

  //add the comment to the taskname if specified
  if (comment) {
    this.currentTask.name += ' ' + comment;
  }

  if (this.currentTask.prev) {
    //If we have a previous task we have to add another time slot
    var prevTask = this.tasks[this.currentTask.prev - 1];
    prevTask.times.push({
      start: new Date()
    });

    this.currentTask = prevTask;

    utils.printTask(this.currentTask);
  } else {
    this.currentTask = null;
    console.log(chalk.red('No task is running!'));
  }

  persistTasks(this.file, this.tasks, this.currentTask);

  return true;
};

/**
 * End the current tasks last timeslot
 */
TaskManager.prototype.pause = function() {
  if (this.currentTask) {
    endLastSlot(this.currentTask);
    this.currentTask.paused = true;

    utils.printTask(this.currentTask);

    persistTasks(this.file, this.tasks, this.currentTask);
  }

  return true;
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

    persistTasks(this.file, this.tasks, this.currentTask);
  }

  utils.printTask(this.currentTask);

  return true;
};


TaskManager.prototype.stopAllTasks = function() {
  while (this.currentTask) {
    this.stopCurrentTask();
  }

  persistTasks(this.file, this.tasks, this.currentTask);

  return false;
};

TaskManager.prototype.print = function(day) {
  //Simply export the tasks to the command line
  return this.exportTasks(day, 'commandline');
};

TaskManager.prototype.exportTasks = function(day, exporterName) {
  if (!day) {
    console.log(chalk.red('please specify a day (yyyy-mm-dd) to use'));
    return true;
  }

  var data = parseFile(createFileName(day));

  if (!data) {
    console.log(chalk.red('Data for day ' + day + ' not found!'));

    return true;
  }

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

  return true;
};

function persistTasks(file, tasks, currentTask) {
  var toSave = {
    tasks: tasks
  };

  if (currentTask) {
    toSave.currentId = currentTask.id;
  }

  fs.writeFile(file, JSON.stringify(toSave), function(err) {
    if (err) console.log(chalk.red(err));
  });
}

function endLastSlot(task) {
  //Set the end date for the last time slot in the task
  var lastTimeSlot = task.times[task.times.length - 1];
  lastTimeSlot.end = new Date();
}

function toDay(date) {
  return date.getFullYear() + '-' + pad((date.getMonth() + 1)) + '-' + pad(date.getDate());
}

function createFileName(day) {
  var dir = process.cwd();

  return dir + '/' + day + '.json';
}

function parseFile(file) {
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
}

function setupCurrentDay(taskManager, file) {
  var data = parseFile(file);

  if (!data) {
    return;
  }

  taskManager.tasks = data.tasks;

  if (data.currentId) {
    taskManager.currentTask = taskManager.tasks[data.currentId - 1];

    printTaskName(taskManager.currentTask);
  }
}

function pad(number) {
  if (number < 10) {
    return '0' + number;
  }
  return number;
}


module.exports = TaskManager;
