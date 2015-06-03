module.exports = [{
  schema: 'start <task name>',
  description: 'Start a new task with the given name.'
}, {
  schema: 'stop <comment>',
  description: 'Stop the current task. If a comment is specified it will be appended to the task name.'
}, {
  schema: 'stopall',
  description: 'Stop all running tasks.'
}, {
  schema: 'print <yyyy-mm-dd>',
  description: 'Prints all tasks for the given day.'
}, {
  schema: 'q',
  description: 'Quit the application.'
}];
