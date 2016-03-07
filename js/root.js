var MyApp = {
	appendCard : function($card) {
		$('#results').append($card);
	}
};

// Link (a URL with a title and description)
Lantern.addProfile('LinkPub');
Lantern.profiles.LinkPub.addField('urls', Lantern.fields.URL);
Lantern.profiles.LinkPub.addField('titles', Lantern.fields.TITLE);
Lantern.profiles.LinkPub.activate = function() {
	var $card = $('<div id="link_pub_card" class="card"><em>LINK</em>' +
		this.fields.titles.echo('<strong>', 0, '</strong>') +
		'</div>');

	this.suspend();
	for (var url = 0; url < this.fields.urls.matches.length; url ++) {
		var src = this.fields.urls.matches[url];
		var $urlLink = $('<a href="'+src+'">'+src+'</a>');
		$card.append($urlLink);
	}
	MyApp.appendCard($card);
};
Lantern.profiles.LinkPub.suspend = function() {
	$('#link_pub_card').remove();
};

// Poll (a question followed by several potential answers)
Lantern.addProfile('PollPub');
Lantern.profiles.PollPub.addField('titles', Lantern.fields.PLEA);
Lantern.profiles.PollPub.addField('options', Lantern.fields.OPTION);
Lantern.profiles.PollPub.activate = function() {
	var $card = $('<div id="poll_pub_card" class="card"><em>POLL</em>' +
		this.fields.titles.echo('<strong>', 0, '</strong>') +
		'</p></div>');

	this.suspend();
	for (var opt = 0; opt < this.fields.options.matches.length; opt ++) {
		var src = this.fields.options.matches[opt].replace(/^(\n-)|(\r-)|(\r-\s)|(\n-\s)?/, '');
		var $rad = $('<span class="rad"><input type="radio" /><label>'+src+'</label></span>');
		$card.append($rad);
	}
	MyApp.appendCard($card);
};
Lantern.profiles.PollPub.suspend = function() {
	$('#poll_pub_card').remove();
};

// Contact
Lantern.addProfile('Contact');
Lantern.profiles.Contact.addField('names', Lantern.fields.NAME);
Lantern.profiles.Contact.addField('phones', Lantern.fields.PHONE);
Lantern.profiles.Contact.addField('emails', Lantern.fields.EMAIL, false);
Lantern.profiles.Contact.activate = function() {
	var $card = $('<div id="contact_pub_card" class="card">' +
						'<em>CONTACT</em>' +
						'<img src="images/noman.png" />' +
						this.fields.names.echo('<strong>', 0, '</strong>') +
						this.fields.phones.echo('<em>', 0, '</em>') +
						this.fields.emails.echo('<em>', 0, '</em>') +
					'</div>');

	this.suspend();
	$card.append(this.duplicates('<h4>Other matches:</h4>', '<em>', '</em>'));
	MyApp.appendCard($card);
};
Lantern.profiles.Contact.suspend = function() {
	$('#contact_pub_card').remove();
};

// Account
Lantern.addProfile('Account');
Lantern.profiles.Account.addField('names', Lantern.fields.NAME);
Lantern.profiles.Account.addField('phones', Lantern.fields.PHONE);
Lantern.profiles.Account.addField('emails', Lantern.fields.EMAIL, false);
Lantern.profiles.Account.activate = function() {
	var $card = $('<div id="account_pub_card" class="card">' +
						'<em>ACCOUNT</em>' +
						this.fields.names.echo('<strong>', 0, '</strong>') +
						this.fields.phones.echo('<em>', 0, '</em>') +
						this.fields.emails.echo('<em>', 0, '</em>') +
					'</div>');

	this.suspend();
	$card.append(this.duplicates('<h4>Other matches:</h4>', '<em>', '</em>'));
	MyApp.appendCard($card);
};
Lantern.profiles.Account.suspend = function() {
	$('#account_pub_card').remove();
};

// Oppty
Lantern.addProfile('Oppty');
Lantern.profiles.Oppty.addField('amounts', Lantern.fields.DOLLAR);
Lantern.profiles.Oppty.addField('names', Lantern.fields.COMPANY_NAME);
Lantern.profiles.Oppty.addField('dates', Lantern.fields.DATE, false);
Lantern.profiles.Oppty.activate = function() {
	var dups = false;
	var $card = $('<div id="oppty_pub_card" class="card">' +
						'<em>OPPORTUNITY</em>' +
						this.fields.names.echo('<strong>', 0, '</strong>') +
						this.fields.amounts.echo('<em>', 0, '</em>') +
						this.fields.dates.echo('<em>', 0, '</em>') +
					'</div>');

	this.suspend();
	$card.append(this.duplicates('<h4>Other matches:</h4>', '<em>', '</em>'));
	MyApp.appendCard($card);
};
Lantern.profiles.Oppty.suspend = function() {
	$('#oppty_pub_card').remove();
};

$(function() {
	$('#box').on('keyup', function() {
		var $this = $(this);
		var input = $this.val();

		if (window.Lantern_TO) {
			clearTimeout(window.Lantern_TO);
		}

		window.Lantern_TO = setTimeout(function() {
			Lantern.check(input);
		}, 500);
	});

	$('#show_help').click(function() {
		$('#help').show();
		return false;
	});
	$('#hide_help').click(function() {
		$('#help').hide();
		return false;
	});
});
