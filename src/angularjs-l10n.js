angular
  .module('l10n', [])

  .provider('l10n', function() {
    var messages = {},
        pathToFile,
        currentLocale,
        setLocale = function(loc) {
          if (!loc || !angular.isString(loc)) {
            throw new Error('locale must be defined as a string');
          }

          currentLocale = loc;
        },
        add = function(locale, m) {
          if (!messages[locale]) {
            messages[locale] = {};
          }

          return angular.extend(messages[locale], m);
        }
      ;

    this.setLocale = setLocale;

    this.pathToFile = function(path) {
    	pathToFile = path;
    };

    this.add = add,

    this.$get = ['$http', function($http) {
    	if (!currentLocale) {
    		throw new Error('You have to to set "locale"');
    	}

      var init = function() {
        if (pathToFile) {
          var that = this;

          if (!/\/$/.test(pathToFile)) {
            pathToFile += '/';
          }

          $http
            .get(pathToFile + currentLocale + '.json')
            .success(
              function(response) {
                add(currentLocale, response);
              }
            )
          ;
        }
      };

      init.call(this);

      return {
        trans: function(str) {
          return messages[currentLocale] && messages[currentLocale][str] || str;
        },
        getLocale: function() {
          return currentLocale;
        },
        setLocale: function() {
          setLocale.apply(this, arguments);
          init.call(this);
        },
        add: add,
      };
    }];
  })

  .filter('trans', ['l10n', function(l10n) {
    return function(str) {
      return l10n.trans(str);
    };
  }])
;