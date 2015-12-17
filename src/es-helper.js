'use strict';

var es = require('elasticsearch'),
  queryBuilder = require('./query-builder');

function ESHelper(host) {
  var esClient = new es.Client({
    host: host,
    log: 'trace'
  });

  function search(jsonData, cb) {
    var data = { body: {} },
      handlers = {
        success: cb,
        error: function(err) {
          console.error(err);
          cb(null);
        }
      };

    data.body = jsonData;
    esClient.search(data).then(handlers.success, handlers.error);
  }

  this.autoComplete = function(queries, callback) {
    var autoCompleteJson = require('./autocomplete.json');
    autoCompleteJson.query.filtered.query = queryBuilder.parse(queries);
    search(autoCompleteJson, callback);
  };

  this.pieChart = function(queries, callback) {
    var pacmanJson = require('./pacman.json');
    pacmanJson.query.filtered.query = queryBuilder.parse(queries);
    search(pacmanJson, callback);
  };
}

if (window) {
  window.ESHelper = ESHelper;
}