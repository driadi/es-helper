'use strict';

var ajax = require('findly-ajax');

function ESHelper(host) {
  this.host = host;
}

ESHelper.prototype.search = function(query, callback) {
  var handlers = {
    success: callback,
    error: function(err) {
      console.error(err);
      callback(null);
    }
  };

  var data = {
    'size': 0,
    'aggregations': {
      'EmployerRaw': {
        'terms': {
          'field': 'Keywords.word',
          'include': '.*uni.*'
        }
      }
    },
    'query': {
      'filtered': {
        'filter': {
          'and': {
            'filters': [
              {
                'term': {'Keywords': 'uni'}
              },
              {
                'term': {'Keywords': 'washington'}
              }
            ]
          }
        }
      }
    }
  };

  ajax.postJson(this.host + '/_search', data, handlers);
};

if (window) {
  window.ESHelper = ESHelper;
}