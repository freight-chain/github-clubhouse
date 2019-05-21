'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

exports.getIssue = getIssue;
exports.queryIssues = queryIssues;
exports.getCommentsForIssue = getCommentsForIssue;
exports.getLabelsForIssue = getLabelsForIssue;
exports.createIssue = createIssue;
exports.createIssueComment = createIssueComment;

var _apiFetch = require('../util/apiFetch');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function headers(token) {
  return {
    Authorization: 'token ' + token,
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json'
  };
}

function apiURL(path) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return { base: 'https://api.github.com', path: path, queryParams: params };
}

function getIssue(token, owner, repoName, issueNumber) {
  var issueUrl = apiURL('/repos/' + owner + '/' + repoName + '/issues/' + issueNumber);
  return (0, _apiFetch.apiFetch)(issueUrl, { headers: headers(token) });
}

function queryIssues(token, owner, repoName, issueQuery) {
  var issueUrl = apiURL('/search/issues', { q: issueQuery + (' repo:' + owner + '/' + repoName + ' type:issue'), sort: 'created', order: 'asc' });
  return (0, _apiFetch.apiFetchAllPages)(issueUrl, { headers: headers(token) });
}

function getCommentsForIssue(token, owner, repoName, issueNumber) {
  var commentsUrl = apiURL('/repos/' + owner + '/' + repoName + '/issues/' + issueNumber + '/comments');
  return (0, _apiFetch.apiFetchAllPages)(commentsUrl, { headers: headers(token) });
}

function getLabelsForIssue(token, owner, repoName, issueNumber) {
  var labelsUrl = apiURL('/repos/' + owner + '/' + repoName + '/issues/' + issueNumber + '/labels');
  return (0, _apiFetch.apiFetchAllPages)(labelsUrl, { headers: headers(token) });
}

function createIssue(token, owner, repoName, issue) {
  var newIssueUrl = apiURL('/repos/' + owner + '/' + repoName + '/issues');
  return (0, _apiFetch.apiFetch)(newIssueUrl, {
    method: 'POST',
    headers: headers(token),
    body: (0, _stringify2.default)(issue)
  });
}

function createIssueComment(token, owner, repoName, issueNumber, comment) {
  var newCommentUrl = apiURL('/repos/' + owner + '/' + repoName + '/issues/' + issueNumber + '/comments');
  return (0, _apiFetch.apiFetch)(newCommentUrl, {
    method: 'POST',
    headers: headers(token),
    body: (0, _stringify2.default)(comment)
  });
}