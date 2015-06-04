var chalk = require('chalk');

var utils = {};

utils.printTask = function(task) {
  var message = 'Current task: "' + chalk.green(task.description) + '"';

  if (task.paused) {
    message += chalk.red(' paused');
  }

  console.log(message);
};

/**
 * Calculate the duration of the task.
 *
 * @return {hours: <hours>, minutes: <minutes>}
 */
utils.calculateDuration = function(task) {
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

  return {
    hours: hours,
    minutes: minutes,
    toString: function() {
      return this.hours + ' h ' + this.minutes + ' min';
    }
  };
};

module.exports = utils;
