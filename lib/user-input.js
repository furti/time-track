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
var chalk = require('chalk'),
  keypress = require('keypress'),
  q = require('q');

function clearCharacters(out, length) {
  for (var i = 0; i < length; i++) {
    out.write('\b\0\b');
  }
}

function UserInput() {
  this.history = [];
  this.out = process.stdout;
  this.in = process.stdin;

  this.in.setEncoding('utf8');
  this.in.setRawMode(true);
  keypress(this.in);
}

UserInput.prototype.nextLine = function(question) {
  var line = '',
    output = this.out,
    input = this.in,
    history = this.history,
    historyIndex = this.history.length,
    deferred = q.defer();

  input.resume();
  output.write(chalk.grey(question) + ' ');

  var keypressHandler = function(ch, key) {
    if (key && key.name === 'return') {
      //Pause the input as we do not need it right now
      input.removeListener('keypress', keypressHandler);
      input.pause();

      output.write('\n');
      history.push(line);
      deferred.resolve(line);
    } else if (key && key.name === 'backspace') {
      if (line.length > 0) {
        clearCharacters(output, 1);
        line = line.slice(0, -1);
      }
    } else if (key && key.name === 'up') {
      clearCharacters(output, line.length);

      if (historyIndex > 0) {
        historyIndex--;
      }

      line = history[historyIndex];
      output.write(line);
    } else if (key && key.name === 'down') {
      clearCharacters(output, line.length);

      if (historyIndex < history.length) {
        historyIndex++;
      }

      if (historyIndex === history.length) {
        line = '';
      } else {
        line = history[historyIndex];
      }

      output.write(line);
    } else if (ch) {
      line += ch;
      output.write(ch);
    }
  };

  input.on('keypress', keypressHandler);

  return deferred.promise;
};

module.exports = UserInput;
