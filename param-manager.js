
/**
 * ParamManager Class that lets you manage pseudo parameters using a fake path on the hash
 * @author Victor N. www.victorborges.com
 *
 * @see GitHub   https://github.com/victornpb/param-manager.js
 * @see UnitTest https://jsfiddle.net/Victornpb/mmkk92yq/
 */
function ParamManager() {

    var self = this;

    var KEY_VAL_SEPARATOR = ":";
    var ARRAY_SEPARATOR = ",";

    this.obj = {};

    /**
     * Check if a single parameter exist
     * NOTE: returns true even if does not have a value ("" or undefined)
     * @param  {String} key name of the parameter
     * @return {Boolean}    true if parameter exist
     */
    this.has = function(key) {
        return key in self.getAll();
    };

    /**
     * Get a single parameter
     * @param  {String/Number/Array/Boolean} key Parameter name
     * @return {String}     [description]
     */
    this.get = function(key) {
        var val = self.getAll()[key];
        return val;
    };

    /**
     * Set a single parameter
     * @param {String} key Parameter name
     * @param {String/Number/Array/Boolean} val Value of the parameter
     */
    this.set = function(key, val) {
        var obj = self.getAll();
        obj[key] = val;
        return self.setAll(obj);
    };

    /**
     * Get a single parameter that contains an array
     * @param  {String} key Parameter name
     * @return {Array}     [description]
     */
    this.getArray = function(key) {
        var val = self.getAll()[key];
        var array = val;
        if(val === "") array = [];
        if (typeof array === "string") array = [array];
        return array;
    };

    /**
     * Set a single parameter with an array
     * @param {String} key Parameter name
     * @param {Array} val Values of the parameter
     */
    this.setArray = function(key, val) {
        if (!Array.isArray(val)) throw Error("Parameter 'val' is not an array '" + val + "' (" + typeof array + ")");
        return self.set(key, val);
    };

    /**
     * Remove a single parameter
     * @param {String} key The key of the parameter to be removed
     * @param {String} val The value of the object removed or undefined
     */
    this.remove = function(key) {
        var obj = self.getAll();
        var val = obj[key];
        delete obj[key];
        self.setAll(obj);
        return val;
    };

    /**
     * Get all parameters specified on the URL
     * @return {Object} Object containing keys and values from the url parameters
     */
    this.getAll = function() {

        var obj = {};

        var paramsString = loadParamsString();
        var params = paramsString.split('/');

        params.forEach(function(item) {
            item = item.split(KEY_VAL_SEPARATOR);
            if (item.length === 2) {
                var key = decodeURIComponent(item[0]);
                var val = item[1];

                if (val && val.indexOf(ARRAY_SEPARATOR) > -1) {
                    val = val.split(ARRAY_SEPARATOR).map(function(item) {
                        item = decodeURIComponent(item);
                        return typeCast(item);
                    });
                } else {
                    val = decodeURIComponent(val);
                    val = typeCast(val);
                }

                obj[key] = val;
            }
        });
        return obj;
    };

    /**
     * Set all parameters on the url from a object
     * @param {Object} obj An object containing keys and values
     */
    this.setAll = function(obj) {
        self.obj = obj;
        self.paramString = self.createParamString(obj);
        saveParamString();
    };

    /**
     * Set multiple parameters on the url from a object and keep other values unaltered
     * @param {Object} obj An object containing keys and values to be updated
     */
    this.update = function(changesObj) {

        var obj = self.getAll();

        for (var key in changesObj) {
            if (changesObj.hasOwnProperty(key)) {
                obj[key] = changesObj[key];
            }
        }
        self.setAll(obj);
    };

    /**
     * Remove all parameters from the url
     */
    this.removeAll = function() {
        self.setAll();
    };

    /**
     * removeAll alias
     * @type {Function}
     */
    this.clear = this.removeAll;

    /**
     * Create a string containig all the parameters from a given object
     * @param {Object} obj An object containing keys and values
     * @return {String} The built string
     */
    this.createParamString = function(obj) {
        var params = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                var val = obj[key];

                if (Array.isArray(val)) {
                    val = val.map(encodeURIComponent).join(ARRAY_SEPARATOR); //encode each item of the array, then join it with a separator.
                } else {
                    val = encodeURIComponent(val);
                }

                params.push(encodeURIComponent(key) + KEY_VAL_SEPARATOR + val);
            }
        }
        return params.join('/');
    };

    /**
     * Create a hash url string containig parameters
     * @param {String} hash A hash url
     * @param {Object} paramsObj An object containing keys and values
     * @return {String} The built string
     */
    this.createLink = function(path, paramsObj) {
        //ensures that path starts with '#' and ends with '/'
        var hashtag = (path[0]==='#') ? '' : '#'
        var slash = (path.substr(-1)==='/') ? '' : '/';

        return [hashtag, path, slash, self.createParamString(paramsObj)].join('');
    };

    //**** private methods ****//

    function saveParamString() {

        var hash = location.hash;
        hash = hash.replace(/^#/, ""); //remove # from the start of the hash

        //get the first part that doesn't have parameters /key:val/
        var currView = hash.split("/");
        currView = currView.filter(function(item) {
            return item !== "" && item.indexOf(KEY_VAL_SEPARATOR) === -1;
        });
        currView = currView.join("/");

        var newHash = currView + "/" + self.paramString;

        var url = (location.pathname + location.search + "#" + newHash);
        var fullUrl = (location.protocol + "//" + location.hostname + location.pathname + location.port + location.search + newHash); //when using file:/// you need to reconstruct the entire url

        if (fullUrl.length > 2000) {
            console.warn("The URL is " + fullUrl.length + " characters long. It exceeds the 2K IE limit.");
        }

        try {
            //push state can throw an exception https://developer.mozilla.org/en-US/docs/Web/API/History_API#The_pushState()_method
            window.history.replaceState(self.obj, "", url);
        } catch (err) {
            console.error("history.pushState Failed! Changing hash using location.hash. Error: " + err);
            location.hash = newHash;
        }
    }

    function loadParamsString() {
        self.paramString = location.hash;
        return self.paramString;
    }

    function typeCast(value) {
        var isNumber = /^-?\d+\.?\d*$/;
        if (isNumber.test(value)) value = parseFloat(value);
        else if (value === "true") value = true;
        else if (value === "false") value = false;
        else if (value === "null") value = null;
        else if (value === "undefined") value = void 0;

        return value;
    }

}

//isArray Polyfill. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
if (!Array.isArray) {
    Array.isArray = function(arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };
}
