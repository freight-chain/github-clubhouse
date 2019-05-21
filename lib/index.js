'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.githubIssueToClubhouseStory = exports.clubhouseStoryToGithubIssue = exports.loadConfig = exports.saveConfig = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var clubhouseStoryToGithubIssue = exports.clubhouseStoryToGithubIssue = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(clubhouseStoryURL, githubRepoURL) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var _parseClubhouseStoryU, storyId, _parseGithubRepoURL, owner, repo, clubhouseUsers, clubhouseUsersById, story, unsavedIssue, unsavedIssueComments, issue;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _assertOption('githubToken', options);
            _assertOption('clubhouseToken', options);

            _parseClubhouseStoryU = (0, _urlParse.parseClubhouseStoryURL)(clubhouseStoryURL), storyId = _parseClubhouseStoryU.storyId;
            _parseGithubRepoURL = (0, _urlParse.parseGithubRepoURL)(githubRepoURL), owner = _parseGithubRepoURL.owner, repo = _parseGithubRepoURL.repo;
            _context.next = 6;
            return (0, _clubhouse.listUsers)(options.clubhouseToken);

          case 6:
            clubhouseUsers = _context.sent;
            clubhouseUsersById = clubhouseUsers.reduce(function (acc, user) {
              acc[user.id.toLowerCase()] = user;
              return acc;
            });
            _context.next = 10;
            return (0, _clubhouse.getStory)(options.clubhouseToken, storyId);

          case 10:
            story = _context.sent;
            unsavedIssue = _storyToIssue(clubhouseStoryURL, story);
            unsavedIssueComments = _presentClubhouseComments(story.comments, clubhouseUsersById);
            _context.next = 15;
            return (0, _gitHub.createIssue)(options.githubToken, owner, repo, unsavedIssue);

          case 15:
            issue = _context.sent;
            _context.next = 18;
            return _bluebird2.default.each(unsavedIssueComments, function (comment) {
              return (0, _gitHub.createIssueComment)(options.githubToken, owner, repo, issue.number, comment);
            });

          case 18:
            return _context.abrupt('return', issue);

          case 19:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function clubhouseStoryToGithubIssue(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var githubIssueToClubhouseStory = exports.githubIssueToClubhouseStory = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(options) {
    var userMappings, clubhouseUsers, clubhouseUsersByName, clubhouseWorkflows, stateId, projects, project, projectId, _options$githubRepo$s, _options$githubRepo$s2, owner, repo, issues, resp, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, slice, count, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, issue, issueComments, issueLabels, unsavedStory, story;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _assertOption('githubToken', options);
            _assertOption('clubhouseToken', options);
            _assertOption('clubhouseProject', options);
            _assertOption('githubRepo', options);

            userMappings = JSON.parse(options.userMap);


            (0, _logging.log)('Fetch Clubhouse users');
            _context2.next = 8;
            return (0, _clubhouse.listUsers)(options.clubhouseToken);

          case 8:
            clubhouseUsers = _context2.sent;

            // log("clubhouseUsers", clubhouseUsers)
            clubhouseUsersByName = clubhouseUsers.reduce(function (acc, user) {
              acc[user.profile.mention_name.toLowerCase()] = user;
              return acc;
            }, {});
            // log("clubhouseUsersByName", clubhouseUsersByName)

            (0, _logging.log)('Fetch Clubhouse workflows');
            // simply use the first 'unstarted' and 'done' states of the first workflow
            _context2.next = 13;
            return (0, _clubhouse.listWorkflows)(options.clubhouseToken);

          case 13:
            clubhouseWorkflows = _context2.sent;

            // log("clubhouseWorkflows", clubhouseWorkflows)
            stateId = { open: clubhouseWorkflows[0].states.find(function (state) {
                return state.type === 'unstarted';
              }).id,
              done: clubhouseWorkflows[0].states.find(function (state) {
                return state.type === 'done';
              }).id
              // log("stateId", stateId)

            };
            (0, _logging.log)('Fetch Clubhouse projects');
            _context2.next = 18;
            return (0, _clubhouse.listProjects)(options.clubhouseToken);

          case 18:
            projects = _context2.sent;
            project = projects.find(function (project) {
              return project.name === options.clubhouseProject;
            });

            if (project) {
              _context2.next = 22;
              break;
            }

            throw new Error('The \'' + options.clubhouseProject + '\' project wasn\'t found in your Clubhouse');

          case 22:
            projectId = project.id;
            _options$githubRepo$s = options.githubRepo.split('/'), _options$githubRepo$s2 = (0, _slicedToArray3.default)(_options$githubRepo$s, 2), owner = _options$githubRepo$s2[0], repo = _options$githubRepo$s2[1];
            issues = [];

            if (!('issue' in options)) {
              _context2.next = 33;
              break;
            }

            (0, _logging.log)('Fetch GitHub issue');
            _context2.next = 29;
            return (0, _gitHub.getIssue)(options.githubToken, owner, repo, options.issue);

          case 29:
            _context2.t0 = _context2.sent;
            issues = [_context2.t0];
            _context2.next = 60;
            break;

          case 33:
            (0, _logging.log)('Fetch GitHub issues');
            _context2.next = 36;
            return (0, _gitHub.queryIssues)(options.githubToken, owner, repo, options.query);

          case 36:
            resp = _context2.sent;

            if (!Array.isArray(resp)) {
              _context2.next = 59;
              break;
            }

            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context2.prev = 41;

            for (_iterator = (0, _getIterator3.default)(resp); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              slice = _step.value;

              issues = issues.concat(slice.items);
            }
            // log("combined slices")
            _context2.next = 49;
            break;

          case 45:
            _context2.prev = 45;
            _context2.t1 = _context2['catch'](41);
            _didIteratorError = true;
            _iteratorError = _context2.t1;

          case 49:
            _context2.prev = 49;
            _context2.prev = 50;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 52:
            _context2.prev = 52;

            if (!_didIteratorError) {
              _context2.next = 55;
              break;
            }

            throw _iteratorError;

          case 55:
            return _context2.finish(52);

          case 56:
            return _context2.finish(49);

          case 57:
            _context2.next = 60;
            break;

          case 59:
            issues = resp.items;
            // log("one result set")

          case 60:
            (0, _logging.log)('GitHub issues to import: ', issues.length);

            count = 0;
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context2.prev = 65;
            _iterator2 = (0, _getIterator3.default)(issues);

          case 67:
            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
              _context2.next = 89;
              break;
            }

            issue = _step2.value;

            // log("issue", issue)
            (0, _logging.log)('GitHub #' + issue.number + ' --> ');
            _context2.next = 72;
            return (0, _gitHub.getCommentsForIssue)(options.githubToken, owner, repo, issue.number);

          case 72:
            issueComments = _context2.sent;
            _context2.next = 75;
            return (0, _gitHub.getLabelsForIssue)(options.githubToken, owner, repo, issue.number);

          case 75:
            issueLabels = _context2.sent;

            // log("comments", issueComments)
            // log("labels", issueLabels)
            unsavedStory = _issueToStory(clubhouseUsersByName, projectId, stateId, issue, issueComments, issueLabels, userMappings);
            // log("story", unsavedStory)

            if (options.dryRun) {
              _context2.next = 85;
              break;
            }

            _context2.next = 80;
            return (0, _clubhouse.createStory)(options.clubhouseToken, unsavedStory);

          case 80:
            story = _context2.sent;

            (0, _logging.logAppend)('Clubhouse #' + story.id + ' ' + story.name);
            count += 1;
            _context2.next = 86;
            break;

          case 85:
            (0, _logging.logAppend)('Not creating story for: ', issue.title);

          case 86:
            _iteratorNormalCompletion2 = true;
            _context2.next = 67;
            break;

          case 89:
            _context2.next = 95;
            break;

          case 91:
            _context2.prev = 91;
            _context2.t2 = _context2['catch'](65);
            _didIteratorError2 = true;
            _iteratorError2 = _context2.t2;

          case 95:
            _context2.prev = 95;
            _context2.prev = 96;

            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }

          case 98:
            _context2.prev = 98;

            if (!_didIteratorError2) {
              _context2.next = 101;
              break;
            }

            throw _iteratorError2;

          case 101:
            return _context2.finish(98);

          case 102:
            return _context2.finish(95);

          case 103:
            return _context2.abrupt('return', count);

          case 104:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[41, 45, 49, 57], [50,, 52, 56], [65, 91, 95, 103], [96,, 98, 102]]);
  }));

  return function githubIssueToClubhouseStory(_x4) {
    return _ref2.apply(this, arguments);
  };
}();

var _config = require('./util/config');

Object.defineProperty(exports, 'saveConfig', {
  enumerable: true,
  get: function get() {
    return _config.saveConfig;
  }
});
Object.defineProperty(exports, 'loadConfig', {
  enumerable: true,
  get: function get() {
    return _config.loadConfig;
  }
});

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _gitHub = require('./fetchers/gitHub');

var _clubhouse = require('./fetchers/clubhouse');

var _urlParse = require('./util/urlParse');

var _logging = require('./util/logging');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _assertOption(name, options) {
  if (!options[name]) {
    throw new Error(name + ' option must be provided');
  }
}

function _mapUser(clubhouseUsersByName, githubUsername, userMappings) {
  // log("githubUsername", githubUsername)

  // make comparison lower case
  githubUsername = githubUsername.toLowerCase();

  var username = void 0;
  if (githubUsername in userMappings) {
    username = userMappings[githubUsername];
  } else {
    username = githubUsername;
  }

  // log("username-mapping:", githubUsername, "->", username)
  if (clubhouseUsersByName[username]) {
    return clubhouseUsersByName[username].id;
  }

  // username not found
  // log("Warning, user missing from Clubhouse:", username)
  // log("Object.keys(clubhouseUsersByName)", Object.keys(clubhouseUsersByName))

  // '*' can be used to define the default username
  if ('*' in userMappings && userMappings['*'] in clubhouseUsersByName) {
    username = userMappings['*'];
  } else {
    // othwerwise just pick the first one...
    username = (0, _keys2.default)(clubhouseUsersByName)[0];
  }

  return clubhouseUsersByName[username].id;
}

/* eslint-disable camelcase */

function _issueToStory(clubhouseUsersByName, projectId, stateId, issue, issueComments, issueLabels, userMappings) {
  var story = {
    project_id: projectId,
    name: issue.title,
    description: issue.body !== null ? issue.body : '',
    comments: _presentGithubComments(clubhouseUsersByName, issueComments, userMappings),
    labels: _presentGithubLabels(issueLabels),
    created_at: issue.created_at,
    updated_at: issue.updated_at,
    external_id: issue.html_url,
    requested_by_id: _mapUser(clubhouseUsersByName, issue.user.login, userMappings)
  };

  if (issue.assignee !== null) {
    story.owner_ids = [_mapUser(clubhouseUsersByName, issue.assignee.login, userMappings)];
  }

  if (issue.state === 'closed') {
    story.workflow_state_id = stateId.done;
    story.completed_at_override = issue.closed_at;
  }

  return story;
}

function _presentGithubComments(clubhouseUsersByName, issueComments, userMappings) {
  return issueComments.map(function (issueComment) {
    return {
      author_id: _mapUser(clubhouseUsersByName, issueComment.user.login, userMappings),
      text: issueComment.body,
      created_at: issueComment.created_at,
      updated_at: issueComment.updated_at,
      external_id: issueComment.url
    };
  });
}

function _presentGithubLabels(issueLabels) {
  return issueLabels.map(function (issueLabel) {
    return {
      name: issueLabel.name,
      color: '#' + issueLabel.color
    };
  });
}

function _storyToIssue(clubhouseStoryURL, story) {
  var renderedTasks = story.tasks.map(function (task) {
    return '- [' + (task.complete ? 'x' : ' ') + '] ' + task.description;
  }).join('\n');
  var renderedTasksSection = renderedTasks.length > 0 ? '\n### Tasks\n\n' + renderedTasks : '';
  var originalStory = 'From [ch' + story.id + '](' + clubhouseStoryURL + ')';

  return {
    title: story.name,
    body: originalStory + '\n\n' + story.description + renderedTasksSection
  };
}

function _presentClubhouseComments(comments, clubhouseUsersById) {
  return comments.map(function (comment) {
    var user = clubhouseUsersById[comment.author_id] || { username: comment.author_id };
    return {
      body: '**[Comment from Clubhouse user @' + user.username + ':]** ' + comment.text
    };
  });
}