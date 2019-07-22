
/* ------- OBJECT ------- */
function typeOf(value) {
    var s = typeof value;
    if (s === 'object') {
        if (value) {
            if (typeof value.length === 'number' &&
                    !(value.propertyIsEnumerable('length')) &&
                    typeof value.splice === 'function') {
                s = 'array';
            }
        } else {
            s = 'null';
        }
    }
    return s;
}

function isEmpty(o) {
    var i, v;
    if (typeOf(o) === 'object') {
        for (i in o) {
            v = o[i];
            if (v !== undefined && typeOf(v) !== 'function') {
                return false;
            }
        }
    }
    return true;
}

//Returns a function for comparation using an attribute of the object
function compareUsing(attr) {
    return function (a, b) {
        var c = 0;
        if (a[attr] !== b[attr]) {
            if (a[attr] > b[attr])
                return 1;
            else
                return -1;
        }
        return c;
    };
}

function objectEquals(obj1, obj2) {
    if (obj1 == 'undefined' || obj2 == 'undefined') {
        return false;
    }
    for (p in obj1) {
        if (typeof (obj2[p]) == 'undefined') { return false; }
    }
    for (p in obj1) {
        if (obj1[p]) {
            switch (typeof (obj1[p])) {
                case 'object':
                    if (!obj1[p].equals(obj2[p])) { return false; }; break;
                case 'function':
                    if (typeof (obj2[p]) == 'undefined' || (p != 'equals' && obj1[p].toString() != obj2[p].toString())) { return false; }; break;
                default:
                    if (obj1[p] != obj2[p]) { return false; }
            }
        }
        else {
            if (obj2[p]) {
                return false;
            }
        }
    }
    for (p in obj2) {
        if (typeof (obj1[p]) == 'undefined') { return false; }
    }

    return true;
}


/* ------- STRING ------- */
//Produces a string in which '<', '>', and '&' are replaced with their HTML entity equivalents.
if (!String.prototype.entityify) {
    String.prototype.entityify = function () {
        return this.replace(/&/g, "&amp;").replace(/</g,
            "&lt;").replace(/>/g, "&gt;");
    };
}
if (!String.prototype.deentityify) {
    String.prototype.deentityify = function() {
        return this.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
    };
}

//Produces a quoted string. 
//This method returns a string that is like the original string except that it is wrapped in quotes and all quote and backslash characters are preceded with backslash.
if (!String.prototype.quote) {
    String.prototype.quote = function () {
        var c, i, l = this.length, o = '"';
        for (i = 0; i < l; i += 1) {
            c = this.charAt(i);
            if (c >= ' ') {
                if (c === '\\' || c === '"') {
                    o += '\\';
                }
                o += c;
            } else {
                switch (c) {
                    case '\b':
                        o += '\\b';
                        break;
                    case '\f':
                        o += '\\f';
                        break;
                    case '\n':
                        o += '\\n';
                        break;
                    case '\r':
                        o += '\\r';
                        break;
                    case '\t':
                        o += '\\t';
                        break;
                    default:
                        c = c.charCodeAt();
                        o += '\\u00' + Math.floor(c / 16).toString(16) +
                        (c % 16).toString(16);
                }
            }
        }
        return o + '"';
    };
}

//Replaces {property} with object properties
if (!String.prototype.supplant) {
    String.prototype.supplant = 
        function (o) {
            return this.replace(/{([^{}]*)}/g,
            function (a, b) {
                var r = o[b];
                return typeof r === 'string' || typeof r === 'number' ? r : a;
            }
        );
    };
}
    
//Replaces {n} with params
if (!String.prototype.format) {
    String.prototype.format = function () {
        var txt = this;
        for (var i = 0; i < arguments.length; i++) {
            var exp = new RegExp('\\{' + (i) + '\\}', 'gm');
            txt = txt.replace(exp, arguments[i]);
        }
        return txt;
    };
}

//Change string to Title Case
if (!String.prototype.toTitleCase) {
    String.prototype.toTitleCase = function () {
        return this.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
    };
}

////Returns true is string starts with 
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (str) {
	    return !!(this.match("^" + str) == str);
    };
}

////Returns true is string ends with 
if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (str) {
	    return !!(this.match(str + "$") == str);
    };
}

// Return a new string without leading and trailing whitespace
if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^\s*(\S*(?:\s+\S+)*)\s*$/, "$1");
    };
}

// Return a new string without leading whitespace
if (!String.prototype.trimLeft) {
    String.prototype.trimLeft =
      function () {
          return this.replace(/^\s+/, "");
      };
}

// Return a new string without trailing whitespace
if (!String.prototype.trimRight) {
    String.prototype.trimRight =
      function () {
          return this.replace(/\s+$/, "");
      };
}

// Return a new string without leading and trailing whitespace
// Double spaces whithin the string are removed as well
if (!String.prototype.trimAll) {
    String.prototype.trimAll =
      function () {
          return this.replace(/^\s+|(\s+(?!\S))/mg, "");
      };
}

// Count the number of times a substring is in a string.
if (!String.prototype.substrCount) {
    String.prototype.substrCount =
      function (s) {
          return this.length && s ? (this.split(s)).length - 1 : 0;
      };
}

// Convert HTML whitespace to normal whitespace
if (!String.prototype.nbsp2s) {
    String.prototype.nbsp2s =
      function () {
          return this.replace(/ ?/mg, " ");
      };
}

// Convert HTML breaks to newline
if (!String.prototype.br2nl) {
    String.prototype.br2nl =
        function () {
            return this.replace(/<br\s*\/?>/mg, "\n");
        };
}

//Returns the date object from date representation in asp.net ajax
if (!String.prototype.dateFromJson) {
    String.prototype.dateFromJson = function () {
        return new Date(parseInt(this.replace("/Date(", "").replace(")/", ""), 10));
    };
}

//Returns the input string padded (on the left) with the specified string, to complete "length" or more characters
if (!String.prototype.lpad) {
    String.prototype.lpad = function (padString, length) {
        var str = this;
        while (str.length < length)
            str = padString + str;
        return str;
    };
}

//Returns the input string padded (on the right) with the specified string, to complete "length" or more characters
if (!String.prototype.rpad) {
    String.prototype.rpad = function (padString, length) {
        var str = this;
        while (str.length < length)
            str = str + padString;
        return str;
    };
}
//Returns the input string padded (on the right) with the specified string, to complete "length" or more characters
if (!String.prototype.contains) {
    String.prototype.contains = function (str) {
        return this.indexOf(str) != -1;
    };
}

/* ------- NUMBER ------- */
// Return true if number is a float
if (!Number.prototype.isFloat) {
    Number.prototype.isFloat =
      function () {
          return /\./.test(this.toString());
      };
}
// Return true if number is an integer
if (!Number.prototype.isInteger) {
    Number.prototype.isInteger =
      function () {
          return Math.floor(this) == this ? true : false;
      };
}
// Return the hexidecimal string representation of an integer
if (!Number.prototype.toHex) {
    Number.prototype.toHex =
      function () {
          // Only convert integers
          if (!this.isInteger())
              throw new Error('Number is not an integer');
          // Can't assign to 'this' so we must copy
          var d = this, r;
          // Quotient and remainder
          var q = r = null;
          // Return value
          var s = '';
          do {
              q = Math.floor(d / 16);
              r = d % 16;
              // If r > 9 then get correct letter (A-F)
              s = r < 10 ? r + s : String.fromCharCode(r + 55) + s;
              d = q;
          }
          while (q)
          return s;
      };
}


//Add log functionality based on http://html5boilerplate.com/
/* ------- LOG ------- */
window.log = function () {
    log.history = log.history || [];
    log.history.push(arguments);
    if (this.console) {
        console.log(Array.prototype.slice.call(arguments));
    }
};
(function (doc) {
    var write = doc.write;
    doc.write = function (q) {
        log('document.write(): ', arguments);

        //Allow google maps' document.write()
        if (/maps\.gstatic./.test(q)) write.apply(doc, arguments);
        //Add more exceptions using regex white list (https://github.com/paulirish/html5-boilerplate/wiki/FAQs)
    };
})(document);