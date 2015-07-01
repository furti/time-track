var cP = require('../lib/command-parser'),
  q = require('q');

function compareArrays(arr1, arr2) {
  if (!arr1) {
    arr1 = [];
  }

  if (!arr2) {
    arr2 = [];
  }

  var ret = true;

  if (arr1.length === arr2.length) {
    for (var index in arr1) {
      if (arr1[index] !== arr2[index]) {
        ret = false;
        break;
      }
    }
  } else {
    ret = false;
  }

  if (!ret) {
    console.log('expected params ');
    console.log(arr1);
    console.log('but were');
    console.log(arr2);
  }

  return ret;
}

function TaskManagerMock() {
  this.calledFunctions = [];
}

TaskManagerMock.prototype.startNewTask = function(description) {
  return this.functionCalled('startNewTask', [description]);
};

TaskManagerMock.prototype.stopCurrentTask = function(comment) {
  if (comment) {
    return this.functionCalled('stopCurrentTask', [comment]);
  } else {
    return this.functionCalled('stopCurrentTask', []);
  }
};

TaskManagerMock.prototype.pause = function() {
  return this.functionCalled('pause', []);
};

TaskManagerMock.prototype.resume = function() {
  return this.functionCalled('resume', []);
};

TaskManagerMock.prototype.stopAllTasks = function() {
  return this.functionCalled('stopAllTasks', []);
};

TaskManagerMock.prototype.print = function(day) {
  return this.functionCalled('print', [day]);
};

TaskManagerMock.prototype.exportTasks = function(day, exporterName) {
  return this.functionCalled('exportTasks', [day, exporterName]);
};

TaskManagerMock.prototype.mergeTasks = function(day) {
  return this.functionCalled('mergeTasks', [day]);
};

TaskManagerMock.prototype.reset = function() {
  this.calledFunctions = [];
};

TaskManagerMock.prototype.functionCalled = function(functionName, params) {
  this.calledFunctions.push({
    functionName: functionName,
    params: params
  });

  return q.defer().promise;
};

TaskManagerMock.prototype.noMoreCalls = function() {
  return this.calledFunctions.length === 0;
};

TaskManagerMock.prototype.wasCalled = function(functionName, params) {
  if (this.noMoreCalls()) {
    return false;
  }

  var first = this.calledFunctions[0];
  this.calledFunctions.splice(0, 1);

  if (first.functionName !== functionName) {
    console.log('Expected functionName to be ' + first.functionName + ' but was ' + functionName);

    return false;
  }

  return compareArrays(params, first.params);
};

describe('test command-parser', function() {
  var taskManager = new TaskManagerMock();
  var commandParser = new cP(taskManager, require('../commands'));

  afterEach(function() {
    taskManager.reset();
  });

  it('should call the start command with a comment', function() {
    commandParser.execute('start A first test');

    expect(taskManager.wasCalled('startNewTask', ['A first test'])).toBeTruthy();
    expect(taskManager.noMoreCalls()).toBeTruthy();
  });

  it('should call the stop command without a comment', function() {
    commandParser.execute('stop');

    expect(taskManager.wasCalled('stopCurrentTask', [])).toBeTruthy();
    expect(taskManager.noMoreCalls()).toBeTruthy();
  });

  it('should call the stop command with a comment', function() {
    commandParser.execute('stop a custom description');

    expect(taskManager.wasCalled('stopCurrentTask', ['a custom description'])).toBeTruthy();
    expect(taskManager.noMoreCalls()).toBeTruthy();
  });

  it('should call the pause command', function() {
    commandParser.execute('pause');

    expect(taskManager.wasCalled('pause', [])).toBeTruthy();
    expect(taskManager.noMoreCalls()).toBeTruthy();
  });

  it('should call the resume command', function() {
    commandParser.execute('resume');

    expect(taskManager.wasCalled('resume', [])).toBeTruthy();
    expect(taskManager.noMoreCalls()).toBeTruthy();
  });

  it('should call the stopall command', function() {
    commandParser.execute('stopall');

    expect(taskManager.wasCalled('stopAllTasks', [])).toBeTruthy();
    expect(taskManager.noMoreCalls()).toBeTruthy();
  });

  it('should call the print and export command', function() {
    commandParser.execute('print 2015-01-01');

    expect(taskManager.wasCalled('print', ['2015-01-01'])).toBeTruthy();
    expect(taskManager.noMoreCalls()).toBeTruthy();
  });

  it('should call export command', function() {
    commandParser.execute('export 2015-01-01 someexporter');

    expect(taskManager.wasCalled('exportTasks', ['2015-01-01', 'someexporter'])).toBeTruthy();
    expect(taskManager.noMoreCalls()).toBeTruthy();
  });

  it('should call merge command', function() {
    commandParser.execute('merge 2015-01-01');

    expect(taskManager.wasCalled('mergeTasks', ['2015-01-01'])).toBeTruthy();
    expect(taskManager.noMoreCalls()).toBeTruthy();
  });
});
