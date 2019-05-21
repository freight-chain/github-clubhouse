'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var apiFetchRawRetry = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(urlData, opts) {
    var _this2 = this;

    var n = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : MAX_RETRY;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            return _context3.abrupt('return', apiFetchRaw(urlData, opts).then(function () {
              var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(resp) {
                return _regenerator2.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        if (!(!resp.ok && n > 0)) {
                          _context.next = 12;
                          break;
                        }

                        if (!(resp.status === 429 || resp.status === 403 && resp.headers.has('X-RateLimit-Reset'))) {
                          _context.next = 10;
                          break;
                        }

                        (0, _logging.log)('    API rate limit exceeded, retrying');
                        _context.next = 5;
                        return (0, _awaitSleep2.default)(2000);

                      case 5:
                        _context.next = 7;
                        return apiFetchRawRetry(urlData, opts, n);

                      case 7:
                        return _context.abrupt('return', _context.sent);

                      case 10:
                        if (resp.ok) {
                          _context.next = 12;
                          break;
                        }

                        throw new APIError(resp.status, resp.statusText, resp.url);

                      case 12:
                        return _context.abrupt('return', resp);

                      case 13:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, _this2);
              }));

              return function (_x4) {
                return _ref2.apply(this, arguments);
              };
            }()).catch(function () {
              var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(err) {
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        if (!(err.name === 'FetchError')) {
                          _context2.next = 11;
                          break;
                        }

                        (0, _logging.log)('    Network error ' + err.errno + ':' + err.url + ', retrying');
                        _context2.next = 4;
                        return (0, _awaitSleep2.default)(1000);

                      case 4:
                        if (!(n > 0)) {
                          _context2.next = 8;
                          break;
                        }

                        _context2.next = 7;
                        return apiFetchRawRetry(urlData, opts, n - 1);

                      case 7:
                        return _context2.abrupt('return', _context2.sent);

                      case 8:
                        throw new APIError(err.errno, err.message, err.url);

                      case 11:
                        throw err;

                      case 12:
                      case 'end':
                        return _context2.stop();
                    }
                  }
                }, _callee2, _this2);
              }));

              return function (_x5) {
                return _ref3.apply(this, arguments);
              };
            }()));

          case 1:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function apiFetchRawRetry(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.apiFetch = apiFetch;
exports.apiFetchAllPages = apiFetchAllPages;

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _buildUrl = require('build-url');

var _buildUrl2 = _interopRequireDefault(_buildUrl);

var _parseLinkHeader = require('parse-link-header');

var _parseLinkHeader2 = _interopRequireDefault(_parseLinkHeader);

var _awaitSleep = require('await-sleep');

var _awaitSleep2 = _interopRequireDefault(_awaitSleep);

var _logging = require('./logging');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT_HEADERS = {
  Accept: 'application/json'
};

var APIError = function (_Error) {
  (0, _inherits3.default)(APIError, _Error);

  function APIError(status, statusText, url) {
    (0, _classCallCheck3.default)(this, APIError);

    var message = 'API Error ' + status + ' (' + statusText + ') trying to invoke API (url = \'' + url + '\')';

    var _this = (0, _possibleConstructorReturn3.default)(this, (APIError.__proto__ || (0, _getPrototypeOf2.default)(APIError)).call(this, message));

    _this.name = 'APIError';
    _this.status = status;
    _this.statusText = statusText;
    _this.url = url;
    return _this;
  }

  return APIError;
}(Error);

function apiBuildUrl(urlData) {
  var url = (0, _buildUrl2.default)(urlData.base, urlData);

  // if no params, buildUrl leaves extra '?' at the end of the url. remove it.
  if (url.substr(url.length - 1) === '?') {
    url = url.substring(0, url.length - 1);
  }
  return url;
}

function apiFetchRaw(urlData, opts) {
  opts.headers = (0, _assign2.default)({}, DEFAULT_HEADERS, opts.headers);

  var url = (typeof urlData === 'undefined' ? 'undefined' : (0, _typeof3.default)(urlData)) === 'object' ? apiBuildUrl(urlData) : urlData;

  // log("apiFetchRaw", url, opts)
  return (0, _nodeFetch2.default)(url, opts);
}

var MAX_RETRY = 3;

function apiFetch(urlData) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return apiFetchRawRetry(urlData, opts).then(function (resp) {
    if (!resp.ok) {
      throw new APIError(resp.status, resp.statusText, resp.url);
    }
    return resp.json();
  });
}

function apiFetchAllPages(urlData) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var prevResults = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  return apiFetchRawRetry(urlData, opts).then(function (resp) {
    if (!resp.ok) {
      throw new APIError(resp.status, resp.statusText, resp.url);
    }
    var link = (0, _parseLinkHeader2.default)(resp.headers.get('Link'));
    var next = null;
    if (link && link.next) {
      next = link.next.results && !eval(link.next.results) ? null : link.next.url; // eslint-disable-line no-eval
    }
    return resp.json().then(function (results) {
      if (next) {
        return apiFetchAllPages(next, opts, prevResults.concat(results));
      }
      return prevResults.concat(results);
    });
  });
}