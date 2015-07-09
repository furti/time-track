var TaskMerger = require('../lib/task-merger');

describe('test task-merger', function() {
  var now = new Date();

  function checkTask(actual, expected) {
    expect(actual.id).toBe(expected.id);
    expect(actual.description).toBe(expected.description);

    expect(actual.times.length).toBe(expected.times.length);

    for (var index in actual.times) {
      var actualTime = actual.times[index];
      var expectedTime = expected.times[index];

      expect(actualTime.start.getTime()).toBe(expectedTime.start.getTime());
      expect(actualTime.end.getTime()).toBe(expectedTime.end.getTime());
    }
  }

  it('2 tasks. From has empty times.', function() {
    var tasks = [{
      id: 1,
      description: 'First',
      times: []
    }, {
      id: 2,
      description: 'Second',
      times: [{
        start: now,
        end: new Date(now.getTime() + 10)
      }]
    }];

    var taskMerger = new TaskMerger(tasks);
    taskMerger.doMerge(1, 2);

    expect(tasks.length).toBe(1);
    checkTask(tasks[0], {
      id: 1,
      description: 'Second',
      times: [{
        start: now,
        end: new Date(now.getTime() + 10)
      }]
    });
  });

  it('2 tasks. From has no times.', function() {
    var tasks = [{
      id: 1,
      description: 'First'
    }, {
      id: 2,
      description: 'Second',
      times: [{
        start: now,
        end: new Date(now.getTime() + 10)
      }]
    }];

    var taskMerger = new TaskMerger(tasks);
    taskMerger.doMerge(1, 2);

    expect(tasks.length).toBe(1);
    checkTask(tasks[0], {
      id: 1,
      description: 'Second',
      times: [{
        start: now,
        end: new Date(now.getTime() + 10)
      }]
    });
  });

  it('2 tasks. From has null times.', function() {
    var tasks = [{
      id: 1,
      description: 'First',
      times: null
    }, {
      id: 2,
      description: 'Second',
      times: [{
        start: now,
        end: new Date(now.getTime() + 10)
      }]
    }];

    var taskMerger = new TaskMerger(tasks);
    taskMerger.doMerge(1, 2);

    expect(tasks.length).toBe(1);
    checkTask(tasks[0], {
      id: 1,
      description: 'Second',
      times: [{
        start: now,
        end: new Date(now.getTime() + 10)
      }]
    });
  });

  it('2 tasks. With multiple times.', function() {
    var tasks = [{
      id: 1,
      description: 'First',
      times: [{
        start: new Date(now.getTime() + 20),
        end: new Date(now.getTime() + 30)
      }, {
        start: new Date(now.getTime() + 40),
        end: new Date(now.getTime() + 50)
      }]
    }, {
      id: 2,
      description: 'Second',
      times: [{
        start: now,
        end: new Date(now.getTime() + 10)
      }, {
        start: new Date(now.getTime() + 60),
        end: new Date(now.getTime() + 70)
      }]
    }];

    var taskMerger = new TaskMerger(tasks);
    taskMerger.doMerge(1, 2);

    expect(tasks.length).toBe(1);
    checkTask(tasks[0], {
      id: 1,
      description: 'Second',
      times: [{
        start: now,
        end: new Date(now.getTime() + 10)
      }, {
        start: new Date(now.getTime() + 60),
        end: new Date(now.getTime() + 70)
      }, {
        start: new Date(now.getTime() + 20),
        end: new Date(now.getTime() + 30)
      }, {
        start: new Date(now.getTime() + 40),
        end: new Date(now.getTime() + 50)
      }]
    });
  });

  it('4 tasks. Merge prev.', function() {
    var tasks = [{
      id: 1,
      description: 'First',
      times: []
    }, {
      id: 2,
      description: 'Second',
      times: []
    }, {
      id: 3,
      description: 'Third',
      prev: 1,
      times: []
    }, {
      id: 4,
      description: 'Fourth',
      prev: 2,
      times: []
    }];

    var taskMerger = new TaskMerger(tasks);
    taskMerger.doMerge(1, 2);

    expect(tasks.length).toBe(3);
    checkTask(tasks[0], {
      id: 1,
      description: 'Second',
      times: []
    });

    checkTask(tasks[1], {
      id: 2,
      description: 'Third',
      prev: 1,
      times: []
    });

    checkTask(tasks[2], {
      id: 3,
      description: 'Fourth',
      prev: 1,
      times: []
    });
  });

  it('4 tasks. Merge prev 2.', function() {
    var tasks = [{
      id: 1,
      description: 'First',
      times: []
    }, {
      id: 2,
      description: 'Second',
      times: []
    }, {
      id: 3,
      description: 'Third',
      prev: 1,
      times: []
    }, {
      id: 4,
      description: 'Fourth',
      prev: 2,
      times: []
    }];

    var taskMerger = new TaskMerger(tasks);
    taskMerger.doMerge(4, 2);

    expect(tasks.length).toBe(3);
    checkTask(tasks[0], {
      id: 1,
      description: 'First',
      times: []
    });

    checkTask(tasks[1], {
      id: 2,
      description: 'Second',
      times: []
    });

    checkTask(tasks[2], {
      id: 3,
      description: 'Third',
      prev: 1,
      times: []
    });
  });

});
