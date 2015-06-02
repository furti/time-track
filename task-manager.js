var chalk = require('chalk'),
  fs = require('fs');

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

  console.log(chalk.green('Current task is "' + chalk.bold(taskName)) + '"');

  persistTasks(this.file, this.tasks, this.currentTask);

  return true;
};

TaskManager.prototype.stopCurrentTask = function(comment) {
  if (!this.currentTask) {
    return true;
  }

  endLastSlot(this.currentTask);

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

    console.log(chalk.green('Current task is "' + chalk.bold(this.currentTask.name)) + '"');
  } else {
    this.currentTask = null;
    console.log(chalk.red('No task is running!'));
  }

  persistTasks(this.file, this.tasks, this.currentTask);

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
  if (!day) {
    console.log(chalk.red('please specify a day (yyyy-mm-dd) to use'));
    return;
  }

  var data = parseFile(createFileName(day));

  if (!data) {
    console.log(chalk.red('Data for day ' + day + ' not found!'));
  }

  data.tasks.forEach(function(task) {
    console.log(chalk.blue(task.name + ': ' + calculateDuration(task)));
  });

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
  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
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

    console.log(chalk.green('Current task is "' +
      chalk.bold(taskManager.currentTask.name)) + '"');
  }
}

function calculateDuration(task) {
  var milliseconds = 0;

  task.times.every(function(time) {
    if (!time.end) {
      milliseconds = -1;

      return false;
    }

    milliseconds += time.end.getTime() - time.start.getTime();

    return true;
  });

  if (milliseconds === -1) {
    return 'Still running...';
  }

  var overallMinutes = Math.round(milliseconds / 1000 / 60);
  var minutes = overallMinutes % 60;
  var hours = (overallMinutes - minutes) / 60;

  return hours + 'h ' + minutes + 'min';
}

module.exports = TaskManager;
