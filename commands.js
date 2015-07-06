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

var commands = [];

//start
commands.push({
  schema: 'start <task description>',
  description: 'Start a new task with the given description.',
  matcher: /^start .*$/,
  paramRegex: /^start (.*)$/,
  f: 'startNewTask'
});

//stop
commands.push({
  schema: 'stop <comment>',
  description: 'Stop the current task. If a comment is specified it will be appended to the task description.',
  matcher: /^stop$|^stop .*$/,
  paramRegex: /^stop (.*)$/,
  f: 'stopCurrentTask'
});

//stopall
commands.push({
  schema: 'stopall',
  description: 'Stop all running tasks.',
  matcher: /^stopall$/,
  f: 'stopAllTasks'
});

//pause
commands.push({
  schema: 'pause',
  description: 'Pause the acutal command so that it could be resumed later on.',
  matcher: /^pause$/,
  f: 'pause'
});

//resume
commands.push({
  schema: 'resume',
  description: 'Resume the actual paused command.',
  matcher: /^resume$/,
  f: 'resume'
});

//print
commands.push({
  schema: 'print <yyyy-mm-dd>',
  description: 'Prints all tasks for the given day.',
  matcher: /^print .{10}$/,
  paramRegex: /^print (.{10})$/,
  f: 'print'
});

//export
commands.push({
  schema: 'export <yyyy-mm-dd> <exporter name>',
  description: 'Export the given day with the specified exporter.',
  matcher: /^export .{10} .*$/,
  paramRegex: /^export (.{10}) (.*)$/,
  f: 'exportTasks'
});

//merge
commands.push({
  schema: 'merge <yyyy-mm-dd>',
  description: 'Merge tasks of a given day. If you started a task multiple time you can merge them together.',
  matcher: /^merge .{10}$/,
  paramRegex: /^merge (.{10})$/,
  f: 'mergeTasks'
});

//quit
commands.push({
  schema: 'q, exit, quit',
  description: 'Quit the application.',
  matcher: /^q$|^exit$|^quit$/,
  f: function() {
    return false;
  }
});

//help
commands.push({
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
});

module.exports = commands;
