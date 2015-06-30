var chalk = require('chalk'),
  cP = require('./command-parser');

var promptProps = {
  properties: {
    command: {
      message: 'Command (? for help)'
    }
  }
};


var commands = [{
  schema: 'q, exit, quit',
  description: 'Quit merging.',
  matcher: /^q$|^exit$|^quit$/,
  f: function() {
    return false;
  }
}, {
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
}];

function print(tasks) {
  tasks.forEach(function(task) {
    console.log(chalk.blue(task.id + '. ' + task.description));
  });
}

function TaskMerger(tasks) {
  this.tasks = tasks;
  this.commandParser = new cP(this, commands);
}

TaskMerger.prototype.start = function() {
  var doPrompt = true,
    commandParser = this.commandParser;

  function handlePrompt(err, result) {
    if (result && result.command) {
      doPrompt = commandParser.execute(result.command);
    }
  }

  print(this.tasks);
//  prompt.get(promptProps, handlePrompt);
  console.log('prompt over');
};

module.exports = TaskMerger;
