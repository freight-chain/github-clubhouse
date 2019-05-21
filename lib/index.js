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
    var _this = this;

    var userMappings, clubhouseUsers, clubhouseUsersByName, clubhouseWorkflows, stateId, projects, project, projectId, stories, _options$githubRepo$s, _options$githubRepo$s2, owner, repo, issues, resp, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, slice, count, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _loop, _iterator2, _step2;

    return _regenerator2.default.wrap(function _callee2$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _assertOption('githubToken', options);
            _assertOption('clubhouseToken', options);
            _assertOption('clubhouseProject', options);
            _assertOption('githubRepo', options);

            userMappings = JSON.parse(options.userMap);


            (0, _logging.log)('Fetch Clubhouse users');
            _context3.next = 8;
            return (0, _clubhouse.listUsers)(options.clubhouseToken);

          case 8:
            clubhouseUsers = _context3.sent;

            // log("clubhouseUsers", clubhouseUsers)
            clubhouseUsersByName = clubhouseUsers.reduce(function (acc, user) {
              acc[user.profile.mention_name.toLowerCase()] = user;
              return acc;
            }, {});
            // log("clubhouseUsersByName", clubhouseUsersByName)

            (0, _logging.log)('Fetch Clubhouse workflows');
            // simply use the first 'unstarted' and 'done' states of the first workflow
            _context3.next = 13;
            return (0, _clubhouse.listWorkflows)(options.clubhouseToken);

          case 13:
            clubhouseWorkflows = _context3.sent;

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
            _context3.next = 18;
            return (0, _clubhouse.listProjects)(options.clubhouseToken);

          case 18:
            projects = _context3.sent;
            project = projects.find(function (project) {
              return project.name === options.clubhouseProject;
            });

            if (project) {
              _context3.next = 22;
              break;
            }

            throw new Error('The \'' + options.clubhouseProject + '\' project wasn\'t found in your Clubhouse');

          case 22:
            projectId = project.id;


            (0, _logging.log)('Fetch Clubhouse stories for project');
            _context3.next = 26;
            return (0, _clubhouse.listStories)(options.clubhouseToken, projectId);

          case 26:
            stories = _context3.sent;
            _options$githubRepo$s = options.githubRepo.split('/'), _options$githubRepo$s2 = (0, _slicedToArray3.default)(_options$githubRepo$s, 2), owner = _options$githubRepo$s2[0], repo = _options$githubRepo$s2[1];
            issues = [];

            if (!('issue' in options)) {
              _context3.next = 37;
              break;
            }

            (0, _logging.log)('Fetch GitHub issue');
            _context3.next = 33;
            return (0, _gitHub.getIssue)(options.githubToken, owner, repo, options.issue);

          case 33:
            _context3.t0 = _context3.sent;
            issues = [_context3.t0];
            _context3.next = 64;
            break;

          case 37:
            (0, _logging.log)('Fetch GitHub issues');
            _context3.next = 40;
            return (0, _gitHub.queryIssues)(options.githubToken, owner, repo, options.query);

          case 40:
            resp = _context3.sent;

            if (!Array.isArray(resp)) {
              _context3.next = 63;
              break;
            }

            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context3.prev = 45;

            for (_iterator = (0, _getIterator3.default)(resp); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              slice = _step.value;

              issues = issues.concat(slice.items);
            }
            // log("combined slices")
            _context3.next = 53;
            break;

          case 49:
            _context3.prev = 49;
            _context3.t1 = _context3['catch'](45);
            _didIteratorError = true;
            _iteratorError = _context3.t1;

          case 53:
            _context3.prev = 53;
            _context3.prev = 54;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 56:
            _context3.prev = 56;

            if (!_didIteratorError) {
              _context3.next = 59;
              break;
            }

            throw _iteratorError;

          case 59:
            return _context3.finish(56);

          case 60:
            return _context3.finish(53);

          case 61:
            _context3.next = 64;
            break;

          case 63:
            issues = resp.items;
            // log("one result set")

          case 64:
            (0, _logging.log)('GitHub issues to import: ', issues.length);

            count = 0;
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context3.prev = 69;
            _loop = /*#__PURE__*/_regenerator2.default.mark(function _loop() {
              var issue, existingStory, issueComments, issueLabels, unsavedStory, story;
              return _regenerator2.default.wrap(function _loop$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      issue = _step2.value;

                      // log("issue", issue)
                      (0, _logging.log)('GitHub #' + issue.number + ' --> ');

                      existingStory = stories.find(function (story) {
                        return story.external_id === issue.html_url || (0, _loadsh.includes)((0, _loadsh.map)(story.external_tickets, 'external_url'), issue.html_url);
                      });

                      if (!existingStory) {
                        _context2.next = 7;
                        break;
                      }

                      (0, _logging.logAppend)('Story already exists. Skipping.');
                      _context2.next = 24;
                      break;

                    case 7:
                      _context2.next = 9;
                      return (0, _gitHub.getCommentsForIssue)(options.githubToken, owner, repo, issue.number);

                    case 9:
                      issueComments = _context2.sent;
                      _context2.next = 12;
                      return (0, _gitHub.getLabelsForIssue)(options.githubToken, owner, repo, issue.number);

                    case 12:
                      issueLabels = _context2.sent;

                      // log("comments", issueComments)
                      // log("labels", issueLabels)
                      unsavedStory = _issueToStory(clubhouseUsersByName, projectId, stateId, issue, issueComments, issueLabels, userMappings);

                      (0, _logging.log)("story", unsavedStory);

                      if (options.dryRun) {
                        _context2.next = 23;
                        break;
                      }

                      _context2.next = 18;
                      return (0, _clubhouse.createStory)(options.clubhouseToken, unsavedStory);

                    case 18:
                      story = _context2.sent;

                      (0, _logging.logAppend)('Clubhouse #' + story.id + ' ' + story.name);
                      count += 1;
                      _context2.next = 24;
                      break;

                    case 23:
                      (0, _logging.logAppend)('Not creating story for: ', issue.title);

                    case 24:
                    case 'end':
                      return _context2.stop();
                  }
                }
              }, _loop, _this);
            });
            _iterator2 = (0, _getIterator3.default)(issues);

          case 72:
            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
              _context3.next = 77;
              break;
            }

            return _context3.delegateYield(_loop(), 't2', 74);

          case 74:
            _iteratorNormalCompletion2 = true;
            _context3.next = 72;
            break;

          case 77:
            _context3.next = 83;
            break;

          case 79:
            _context3.prev = 79;
            _context3.t3 = _context3['catch'](69);
            _didIteratorError2 = true;
            _iteratorError2 = _context3.t3;

          case 83:
            _context3.prev = 83;
            _context3.prev = 84;

            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }

          case 86:
            _context3.prev = 86;

            if (!_didIteratorError2) {
              _context3.next = 89;
              break;
            }

            throw _iteratorError2;

          case 89:
            return _context3.finish(86);

          case 90:
            return _context3.finish(83);

          case 91:
            return _context3.abrupt('return', count);

          case 92:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee2, this, [[45, 49, 53, 61], [54,, 56, 60], [69, 79, 83, 91], [84,, 86, 90]]);
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

var _loadsh = require('loadsh');

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
    external_tickets: [{
      external_id: issue.number.toString(),
      external_url: issue.html_url
    }],
    requested_by_id: _mapUser(clubhouseUsersByName, issue.user.login, userMappings)
  };

  if (issue.assignee !== null) {
    story.owner_ids = [_mapUser(clubhouseUsersByName, issue.assignee.login, userMappings)];
  }

  if (issue.state === 'closed') {
    story.workflow_state_id = stateId.done;
    story.completed_at_override = issue.closed_at;
  }

  var typeLabel = issueLabels.find(function (_ref3) {
    var name = _ref3.name;

    return name === 'bug' || name === 'chore' || name === 'feature';
  });

  if (typeLabel) {
    story.story_type = typeLabel.name;
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