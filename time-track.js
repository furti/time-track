#! /usr/bin/env node

/**
 * Copyright 2014 Daniel Furtlehner
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

var prompt = require('prompt'),
  tm = require('./lib/task-manager'),
  chalk = require('chalk'),
  commands = require('./commands');

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
function execute(commandString) {
  var command = findCommand(commandString);

  if (!command) {
    console.log(chalk.red('Command not found!!'));
    return findCommand('?').f();
  } else {
    if (typeof command.f === 'function') {
      return command.f();
    } else {
      return runOnTaskManager(command, commandString);
    }
  }
}

function runOnTaskManager(command, commandString) {
  var toCall = taskManager[command.f];

  if (!toCall) {
    console.log(chalk.red('Function ' + commandString + ' does not exist on TaskManager!'));

    return true;
  }

  var params;

  if (command.paramRegex) {
    var parsed = command.paramRegex.exec(commandString);
    params = parsed ? parsed[1] : null;
  }

  return toCall.call(taskManager, params);
}

function findCommand(commandString) {
  if (!commandString) {
    return;
  }

  for (var index in commands) {
    if (commands[index].matcher.test(commandString)) {
      return commands[index];
    }
  }
}

doPrompt();
