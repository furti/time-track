# time-track
A nodejs cli that helps you track your time.

## Installation
After you have installed Node.js use npm on the command line to install time-trac.

```sh
$ npm install -g time-track
```

After you have installed time-track it is recommended to install the `time-track-commandline-exporter` too. This exporter is used internally for some commands. You will get more informations on exporters later.

```sh
$ npm install time-track-commandline-exporter
```

## Usage
To launch the application navigate to the directory where you want to store your tracked times and run:

```sh
$ time-track
```

A file that stores all you tasks will be created here for each day you use time-track.

After you started the application you will be prompted for a command to run. Type ? to see a list of available commands.

```sh
$ time-track
prompt: Command (? for help):  ?
Available Commands:
start <task name> Start a new task with the given name.
stop <comment> Stop the current task. If a comment is specified it will be appended to the task name.
stopall Stop all running tasks.
pause Pause the acutal command so that it could be resumed later on.
resume Resume the actual paused command.
print <yyyy-mm-dd> Prints all tasks for the given day.
export <yyyy-mm-dd> <exporter name> Export the given day with the specified exporter.
q Quit the application.
? Print all available commands.
prompt: Command (? for help):
```

Every time you enter a command it will be executed and you will be prompted for the next command.

## Available commands
### start <task description>
Starts a new task with the given description. You can call the command multiple times. Each time you call the command the previous task will be paused and a new one will be started. After you stop the actual running task the previous one is started again.

### stop <comment>
stops the actual running task. The comment is optional. If it is specified it will be appended to the tasks description. So if you get a phone call you don't really know what it is about before. So you can start you task with the description _phone call from John Doe_ and extend the description when you stop it.

### stopall
Stops all open tasks and quits the application.

### pause
Pauses the acutal running task. The task can be resumed later.

### resume
Resumes the actual paused task.

### print <yyyy-mm-dd>
Prints the task for the given day to the console. The `time-track-commandline-exporter` is required to use this command.

### export <yyyy-mm-dd> <exporter name>
Calls the given exporter with the tasks for the given day.

### q
Quits the application. In contrast with the stopall command the quit command does not alter any tasks.

### ?
Shows all available commands

###Exporters
A exporter is a module that is called with a list of tasks and does anything you can imagine with the tasks.

Exporters should be installed globally. If they are not found check if the `NODE_PATH` environment variable contains the path where npm installs your global modules.

It's easy to create a custom exporter. Create a node Module with the name `time-track-<exporter name>-exporter`. The exporter name is the name that is used in the export command. The module must export a functoin that takes a list of tasks as argument. See [Commandline Exporter](https://github.com/furti/time-track-commandline-exporter) for a example.
