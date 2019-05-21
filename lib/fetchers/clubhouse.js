'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

exports.getStory = getStory;
exports.listStories = listStories;
exports.listUsers = listUsers;
exports.listProjects = listProjects;
exports.listLabels = listLabels;
exports.listWorkflows = listWorkflows;
exports.createStory = createStory;
exports.createLabel = createLabel;

var _apiFetch = require('../util/apiFetch');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var clubhouseHeaders = {
  'Content-Type': 'application/json'
};

function apiURL(path, token) {
  return { base: 'https://api.clubhouse.io/', path: 'api/beta' + path, queryParams: { token: token } };
}

function getStory(token, storyId) {
  var storyUrl = apiURL('/stories/' + storyId, token);
  return (0, _apiFetch.apiFetch)(storyUrl, { headers: clubhouseHeaders });
}

function listStories(token, projectId) {
  var storiesUrl = apiURL('/projects/' + projectId + '/stories', token);
  return (0, _apiFetch.apiFetch)(storiesUrl, { headers: clubhouseHeaders });
}

function listUsers(token) {
  var projectsUrl = apiURL('/members', token);
  return (0, _apiFetch.apiFetch)(projectsUrl, { headers: clubhouseHeaders });
}

function listProjects(token) {
  var projectsUrl = apiURL('/projects', token);
  return (0, _apiFetch.apiFetch)(projectsUrl, { headers: clubhouseHeaders });
}

function listLabels(token) {
  var projectsUrl = apiURL('/labels', token);
  return (0, _apiFetch.apiFetch)(projectsUrl, { headers: clubhouseHeaders });
}

function listWorkflows(token) {
  var projectsUrl = apiURL('/workflows', token);
  return (0, _apiFetch.apiFetch)(projectsUrl, { headers: clubhouseHeaders });
}

function createStory(token, story) {
  var storyUrl = apiURL('/stories', token);
  return (0, _apiFetch.apiFetch)(storyUrl, { method: 'POST', headers: clubhouseHeaders, body: (0, _stringify2.default)(story) });
}

function createLabel(token, label) {
  var labelUrl = apiURL('/labels', token);
  return (0, _apiFetch.apiFetch)(labelUrl, { method: 'POST', headers: clubhouseHeaders, body: (0, _stringify2.default)(label) });
}