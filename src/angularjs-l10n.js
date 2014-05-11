angular
  .module('l10n', [])

  .provider('l10n', function() {
    var messages = {},
        pathToFile,
        currentLocale;

    this.setLocale = function(loc) {
      currentLocale = loc;
    };

    this.pathToFile = function(path) {
    	pathToFile = path;
    };

    this.add = function(locale, m) {
    	if (!messages[locale]) {
    		messages[locale] = {};
    	}

    	return angular.extend(messages[locale], m);
    },

    this.$get = ['$http', function($http) {
    	if (!currentLocale) {
    		throw new Error('You have to to set "locale"');
    	}

    	if (pathToFile) {
	      var that = this;

	      if (!/\/$/.test(pathToFile)) {
	        pathToFile += '/';
	      }

	      $http
	        .get(pathToFile + currentLocale + '.json')
	        .success(
	          function(response) {
	          	that.add(currentLocale, response);
	          }
	        )
	      ;
	    }

      return {
        trans: function(str) {
          return messages[currentLocale] && messages[currentLocale][str] || str;
        },
        getLocale: function() {
          return currentLocale;
        },
      };
    }];
  })

  .filter('trans', ['l10n', function(l10n) {
    return function(str) {
      return l10n.trans(str);
    };
  }])
;