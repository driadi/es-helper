'use strict';

var es = require('elasticsearch'),
  queryBuilder = require('./query-builder'),
  pacman = require('./pacman.json');

function ESHelper(host) {
  this.host = host;

  this.esClient = new es.Client({
    host: host,
    log: 'trace'
  });
}

ESHelper.prototype.search = function(queries, callback) {
  var data = { body: {}},
    handlers = {
    success: callback,
    error: function(err) {
      console.error(err);
      callback(null);
    }
  };

  pacman.query.filtered.query = queryBuilder.parse(queries);
  data.body = pacman;

  this.esClient.search(data).then(handlers.success, handlers.error);
};

if (window) {
  window.ESHelper = ESHelper;
}