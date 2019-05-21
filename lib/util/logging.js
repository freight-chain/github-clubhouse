'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

exports.log = log;
exports.logAppend = logAppend;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var prevMessage = '';
var dotCount = 0;

function log() {
  var message = '';
  for (var i = 0; i < arguments.length; i++) {
    message += _toString(arguments[i]);
  }
  _log(message);
}

function logAppend() {
  var message = '';
  for (var i = 0; i < arguments.length; i++) {
    message += _toString(arguments[i]);
  }
  _log(message, true);
}

function _log(message) {
  var append = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  // do not repeat the previous message, just output a dot
  if (message === prevMessage) {
    process.stdout.write('.');
    dotCount += 1;
  } else {
    prevMessage = message;
    if (dotCount > 0) {
      dotCount = 0;
    }
    if (!append) {
      message = '\n' + message;
    }
    process.stdout.write(message);
  }
}

function _toString(item) {
  if ((typeof item === 'undefined' ? 'undefined' : (0, _typeof3.default)(item)) === 'object') {
    return (0, _stringify2.default)(item);
  }
  return item;
}