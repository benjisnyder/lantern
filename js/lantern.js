window.Lantern = {};

Lantern.profiles = {};

Lantern.fields = {
	URL : {
		name : 'url',
		// Must have http://
		reg : /(http|HTTP|https|HTTPS)\:\/\/{1}[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi
	},
	TITLE : {
		name : 'title',
		// first 20 chars of a sentence
		reg : /^(.*?)[.?!]/gi
	},
	NAME : {
		name : 'name',
		// Recognizes the names of people (formatted like: First Last)
		// Very very simple only simple two word names
		reg : /([A-Z][a-z]{2,})+\s[A-Z][a-z]+/g
	},
	COMPANY_NAME : {
		name : 'company_name',
		// Recognizes simple proper names with legal entities at the end
		reg : /(([A-Z][a-z]+)\s)+((llc|co|corp|inc|LLC|CO|CORP|INC|Llc|Co|Corp|Inc)\.?)/g
	},
	EMAIL : {
		name : 'email',
		reg : /[\w-\.]+@([\w-]+\.)+[\w-]{2,4}/gi
	},
	PHONE : {
		// with extension
		// reg : /1?\W[^\s?!.,]*([2-9][0-8][0-9])\W*([2-9][0-9]{2})\W*([0-9]{4})(\se?x?t?(\d*))?/gi
		name : 'phone',
		reg : /1?\W[^\s?!.,]*([2-9][0-8][0-9])\W*([2-9][0-9]{2})\W*([0-9]{4})?/gi
	},
	DATE : {
		// Matches U.S. dates with leading zeros and without and with 2 or four digit years
		name : 'date',
		reg : /(([1-9]|[0][1-9])|1[012])[- /.](([1-9]|[0][1-9])|[12][0-9]|3[01])[- /.](19|20)\d\d/gi
	},
	QUESTION : {
		name : 'question',
		reg : /([^\.\?\!]*)[\?]/gi
	},
	PLEA : {
		// A question or instruction followed by a line break
		name : 'plea',
		reg : /([^\.\?\!]*)[\?||\:][\n|\r]+/gi
	},
	OPTION : {
		name : 'option',
		// matches a line of text that looks like "- some option"
		reg : /[\n|\r]+-(.*)/gi
	},
	ADDRESS : {
		name : 'address',
		// Terrible regex, assumes address begins with numeric street addy and ends with 5 or 9 numbers for zip
		reg : /([0-9]{1,} [\s\S]*? [0-9]{5}(?:-[0-9]{4})?)/gi
	},
	DOLLAR : {
		name : 'dollar',
		reg : /\$\d{1,3}(,?\d{3})*(\.\d{1,2})?/gi
	}
};

Lantern.Field = function() {
	this.echo = function() {
		// echo('<span>', 0, '</span>');
		// echo('<span>', '</span>');
		// echo(0);
		var argB = arguments[1];
		var idx,
			val,
			pre,
			post;

		if (this.matches.length > 0) {
			if (parseInt(argB, 10) || argB === 0) {
				// #single+html: Specific value wrapped in pre and post html ('<>', #, '</>') 
				idx = argB;
				pre = arguments[0];
				post = arguments[2];
			} else if (typeof argB === 'string') {
				// #all+html: All values, wrapped in pre and post html  ('<>', '</>') 
				idx = null;
				pre = arguments[0];
				post = argB;
			} else {
				// #single: Specific value via single index. no html (#)
				idx = arguments[0];
				pre = '';
				post = '';
			}

			if (idx !== null) {
				// #single, #single+html
				val = this.matches[idx];

				if (val) {
					return pre + val + post;
				} else {
					return '';
				}
			} else {
				// #all+html
				val = '';

				for (var i = 0; i < this.matches.length; i ++) {
					var match = this.matches[i];
					val += pre + this.matches[i] + post;
				}

				return val;
			}
		} else {
			return '';
		}
	};

	this.duplicates = function(open, pre, post, close) {
		return this.parent.duplicates(open, pre, post, close, {field : this});
	};
};

Lantern.Profile = function() {
	this.fields = {};
	this.fieldCount = 0;

	this.addField = function(name, type, required) {
		this.fields[name] = new Lantern.Field();
		this.fields[name].type = type;
		this.fields[name].matches = [];
		this.fields[name].parent = this;

		if (required === false) {
			this.fields[name].required = false;
		} else {
			this.fields[name].required = true;
			this.fieldCount ++;
		}
	};

	this.activate = function() {
		// only executed if Profile is an exact match
		console.log(this);
	};

	this.suspend = function() {
		// called when there are no matches
		console.log(this);
	};

	this.check = function(input) {
		// Cycle through this Profile's field types
		// then parse the matches accordingly
		var matches = 0;

		for (var fieldIdx in this.fields) {
			var field = this.fields[fieldIdx];
			var reg = field.type.reg;
			var regMatch = input.match(reg);

			// Clear previously stored matches
			field.matches = [];

			if (regMatch) {
				for (var rm = 0; rm < regMatch.length; rm ++) {
					field.matches[field.matches.length] = regMatch[rm];
				}
				if (field.required) {
					matches ++;
				}
			}
		}

		if (matches === this.fieldCount) {
			// if all the requisite fields are found
			this.activate();
		} else {
			this.suspend();
		}
	};

	this.duplicates = function(open, pre, post, close, fields) {
		// duplicates('<>', '<>', '</>', '</>', {optional});
		var dupes = false;
		var val = '';

		open = open ? open : '';
		pre = pre ? pre : '';
		post = post ? post : '';
		close = close ? close : '';
		fields = fields ? fields : this.fields;

		for (var f in fields) {
			if (fields[f].matches.length > 1) {
				dupes = true;

				for (var idx = 1; idx < fields[f].matches.length; idx ++) {
					val += pre + fields[f].matches[idx] + post;
				}
			}
		}

		if (dupes) {
			return open + val + close;
		} else {
			return '';
		}
	};
};

Lantern.addProfile = function(newProfile) {
	Lantern.profiles[newProfile] = new Lantern.Profile();
};

Lantern.check = function(input) {
	for (var profile in Lantern.profiles) {
		Lantern.profiles[profile].check(input);
	}
};