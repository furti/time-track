var chalk = require('chalk');

module.exports = commands = [];

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

//quit
commands.push({
  schema: 'q',
  description: 'Quit the application.',
  matcher: /^q$/,
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
