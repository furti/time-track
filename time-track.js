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

var cP = require('./lib/command-parser'),
  tm = require('./lib/task-manager'),
  uI = require('./lib/user-input');

var taskManager = new tm();
var commandParser = new cP(taskManager, require('./commands'));
var userInput = new uI();

//start listening for input
process.stdin.resume();

function doPrompt() {
  userInput.nextLine('Command (? for help):').then(function(command) {
    if (command && command.length > 0) {
      /**
       * If the command is resolved can ask for another command.
       * If it is rejected we exit the application
       */
      commandParser.execute(command).then(function() {
        doPrompt();
      }, function() {
        process.exit(0);
      });
    } else {
      doPrompt();
    }
  });
}

doPrompt();
