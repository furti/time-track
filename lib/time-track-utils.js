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
