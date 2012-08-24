/*

	Author: Paden
	Purpose: Send Emails (for now only email confirmations)
*/

var email    =  require("emailjs/email")
,   server   =  email.server.connect({
    user     :  "wurdeconfirmation@gmail.com", 
    password :  "th3Wurd33mail", 
    host     :  "smtp.gmail.com", 
    ssl      :  true
});

function Email() { /*nothing here.... or is there? :O */ }
Email.prototype.emailConfirmation  =  function(email, code, callback)
{
	server.send({
	   text:    "Thank you for signing up with theWurde!" +
	            "\r\n\r\nPlease visit http://padenportillo.com:8088/emailConfirmationPage.html?code=" + code +
	            "\r\n\r\nor enter the code \"" + code + "\" in the app." +
	            "\r\n\r\nThis will complete your registration \r\n\r\nThanks!", 
	   from:    "theWurde <wurdeconfirmation@gmail.com>", 
	   to:      "<" + email + ">",
	   subject: "theWurde Email Confirmation"
	}, callback);
}
Email.prototype.emailValidated  =  function(email, callback)
{
	server.send({
	   text:    "Your email has been confirmed with theWurde! \r\n\r\n \
	            \r\n\r\nYour registration is complete!\r\n\r\nThanks! \
	            \r\n\r\nVisit http://padenportillo.com:8088 to login!", 
	   from:    "theWurde <wurdeconfirmation@gmail.com>", 
	   to:      "<" + email + ">",
	   subject: "theWurde Email Confirmation"
	}, callback);
}

//
//Exports this thang!
//
module.exports = exports = Email;