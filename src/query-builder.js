'use strict';

var attrMapping = {
  'name': 'Profile.PersonalDetail.Name',
  'email': 'Profile.PersonalDetail.Email',
  'job': 'Profile.ProfessionalDetail.WorkHistories.JobTitle',
  'location': 'Profile.PersonalDetail.Location.Address',
  'education': 'Profile.PersonalDetail.HighestEducationLevel',
  'interests': 'Profile.ProfessionalDetail.Interests.Title',
  'tags': 'OrganizationProfile.Tags',
  'campaigns': 'OrganizationProfile.Campaigns.Name',
  'notes': 'OrganizationProfile.Notes.Content'
};


function extractTerms(queries) {
  var key = null,
    value = null,
    tempTerm = null,
    result = [];

  for (var i = 0; i < queries.length; i++) {
    if (typeof queries[i] !== 'object' || !queries[i]) {
      continue;
    }

    key = Object.keys(queries[i])[0];
    value = queries[i][key];

    if (key === 'keyword') {
      result.push({
        match: { 'Keywords': value}
      });
    } else if (attrMapping.hasOwnProperty(key)) {
      tempTerm = { term: {} };
      tempTerm.term[attrMapping[key]] = { value: value };
      result.push(tempTerm);
    } else {
      console.error('Cant parse term attribute: ' + key);
    }
  }

  return result;
}

function extractOperators(queries) {
  var result = [];
  for (var i = 0; i < queries.length; i++) {
    if (typeof queries[i] === 'string' &&
      (queries[i].toLowerCase() === 'and' ||  queries[i].toLowerCase() === 'or')) {
      result.push(queries[i].toLowerCase());
    }
  }
  return result;
}

function parse(queries) {
  if (!queries || !queries.hasOwnProperty('length')) {
    throw new Error('Failed to parse query');
  }

  var terms = extractTerms(queries),
    operators = extractOperators(queries);

  if (operators.length <= 0 || terms.length !== operators.length + 1) {
    throw new Error('Failed to parse query');
  }

  function traverseQueries(index, result) {
    var arr = [ terms[index] ];
    arr.push(result ? result : terms[index + 1]);

    if (operators[index] === 'and') {
      result = {
        bool: {
          must: arr
        }
      };
    } else {
      result = {
        bool: {
          should: arr
        }
      };
    }

    if (index === 0) {
      console.log(JSON.stringify(result));
      return result;
    } else {
      return traverseQueries(index - 1, result);
    }
  }

  return traverseQueries(operators.length - 1);
}

module.exports = {
  parse: parse
};