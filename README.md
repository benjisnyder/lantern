Lantern
=======

Lantern is a JavaScript framework for detecting patterns and extracting values from text. This is particularly useful for record detection (contacts, accounts, opportunities etc.) within notes, emails, and chat transcripts.

For an example app, check out `index.html` and `js/root.js`. Demo: http://www.bsnyd.com/work/Lantern/demo/

**Lantern is still in development.** The regular expressions that define the default field types are still rather basic and are likely to be updated.

How to
------

Lantern recognizes data types that are declared as profiles in the global Lantern namespace:

```javascript
Lantern.addProfile(name String);

// Example
Lantern.addProfile('Contact');
```

And each profile needs at least one field. Now that we've added a Contact profile, we can access it and add a field:

```javascript
Lantern.profiles.Contact.addField(name String, type Object, required Boolean);

// Example
Lantern.profiles.Contact.addField('emails', Lantern.fields.EMAIL);
```

`addfield()` takes three parameters: a string for the field name, a field type (your own or one of Lanterns: `Lantern.fields.EMAIL` for example), and an optional boolean for whether or not it is a required field (fields are required by default). Only fields that are required trigger a match. If you mark a field as optional by providing `false` as the third parameter, that field will be accessible when the profile is matched but it is not taken into account when checking for matches. As a best practice field names should be plural since they are arrays of the matched strings.

Once you build a profile, you can check for matches in two ways:

```javascript
// Check all profiles
Lantern.check(input String);

// Check specific profile
Lantern.profiles.Contact.check(input String);
```

If there is an exact profile match in your input string, the profile that matches will fire its `activate()` method:

```javascript
Lantern.profiles.Contact.activate = function() {
	alert('Match!');
};
```

If there is no match for a profile, it will fire its `suspend()` method:

```javascript
Lantern.profiles.Contact.suspend = function() {
	alert('No Matches!');
};
```
Within the `activate()` method, you can process the matches using the following methods:

```javascript
Lantern.profiles.Contact.activate = function() {
	this.fields.emails.echo('<strong>', 0, '</strong>'); // returns the first email match wrapped in strong tags
	this.fields.emails.echo('<strong>', '</strong>'); // returns all email matches, each wrapped in strong tags
	this.fields.emails.echo(0); // returns the first email match as a string
	this.fields.emails.duplicates('<div><h2>Duplicate Emails</h2>', '<strong>', '</strong>', '</div>'); // returns all of the duplicate emails wrapped in strong tags and within the enclosing html in the first and last parameters

	this.duplicates('<div><h2>Do you want to use these fields instead?</h2>', '<strong>', '</strong>', '</div>');  // returns all of the duplicate profile fields wrapped in strong tags and within the enclosing html in the first and last parameters
};
```

*`echo()` and `duplicates()` return an empty string if there are no matches.* This is handy since the wrapping HTML is passed as parameters, if there are no matches you will not have to deal with empty HTML tags in your code.

You might then add the results of one of the above functions to a dom element (shown here with jQuery):

```javascript
$('#some_dom_id').append(this.duplicates()); // duplicates with no parameters returns a running string of matched results

// If you want to return the results as a string separated by a delimiter such as a pipe (or a space, or a break tag etc), simply pass that character as the 3rd parameter 
this.duplicates('', '', '|', '');
```

Miscellaneous
------

### Field Type Constants

Lantern has a set of default field types that define some common text patterns, take a look in lantern.js for all of them.

```javascript
// Lantern.fields.CONSTANT
Lantern.fields.URL;
Lantern.fields.EMAIL;
Lantern.fields.DATE;
```

You can add your own field types too. A Lantern field type has two attributes: `name String`, and `reg RegularExpression` There are plenty of resources online to build regular expressions.:

```javascript
Lantern.fields.My_CUSTOM_FIELD = {
	name : 'my_field',
	reg : /^[ABC]?[123]?/
}
```

### Attributes of a Profile Field

After you add a field to a profile via `Lantern.profiles.MyProfile.addField();` That field has a property called `matches Array` which you can use to process the matched results your self (instead of using the `echo()` methods):

```javascript
// Globally
var emails = Lantern.profiles.Contact.fields.emails.matches;

// Local to the active method of a profile
var emails = this.fields.emails.matches;

// Then:
for (var i = 0; i < emails.length; i++) {
	console.log(emails[i]);
}
```

