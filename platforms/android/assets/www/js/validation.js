/*
 Name:  Kirstine Nielsen
 Date:  13.09.2016
 App: 	MoreFitMoreFun
*/




////////////////////////// register customer //////////////////////////


// check if name is valid format
function isNameValidFormat(name)
{
   // alert("into isNameValidFormat");   
	
    var nameValid = false;
	
	// name length must be more than 2 characters
	if (name.length > 2)
	{
	
		// name must only contain letters or digits		
		// reg expr to make sure only letters and digits (case insensitive)
		var nameRegularExpression = /^[a-z0-9]+$/i;
		
		// test the name entered
		if (nameRegularExpression.test(name))
		{
			// alert("name matches reg expr");
			
			nameValid = true;
		}		
	}
   // alert("nameValid: " + nameValid);
    return nameValid;
}



// current password must be entered
function isStringLengthMoreThanZero(aPassword)
{
    var passwordFormatOK = false;
    var length = aPassword.length;
//    alert("Password length: " + length);

    if (length > 0)
    {
//        alert ("ok length");
        // check if space exists
        if (aPassword.indexOf(' ') >= 0)
        {
//            alert("whitespace exists");
            console.log("whitespace in password");
        }
        else
        {
//            alert("no whitespace");
            passwordFormatOK = true;
        }
    }
//    alert("passwordFormatOK: " + passwordFormatOK);
    return passwordFormatOK;
}


// New password must be at least 3 chars, no spaces
function isNewPasswordFormatOK(aPassword)
{
    var passwordFormatOK = false;
    var length = aPassword.length;
//    alert("Password length: " + length);

    if (length > 2)
    {
//        alert ("ok length");
        // check if space exists
        if (aPassword.indexOf(' ') >= 0)
        {
//            alert("whitespace exists");
            console.log("whitespace in password");
        }
        else
        {
//            alert("no whitespace");
            passwordFormatOK = true;
        }
    }
    else
    {
//         alert("< 3");
        console.log("password less than 3");
    }
//    alert("passwordFormatOK: " + passwordFormatOK);
    return passwordFormatOK;
}


// check if email is valid format
function isEmailValidFormat(email)
{
//    alert("into isEmailValidFormat");

    var emailValid = false;

    if (email.length < 3 || email.indexOf(' ') >= 0 || email.indexOf('@') < 0)
    {
//        alert("invalid email");
        emailValid = false;  // redundant
    }
    else
    {
        emailValid = true;
    }
//    alert("emailValid: " + emailValid);
    return emailValid;
}




////////////////////////// addRun //////////////////////////

// check if date is ok
function isDateValid(aDate)
{
    // clear red background
    doRedBackground(true, "#dateRun");

    // flag
    var dateOk = false;

    // check if aDate field is filled out
    if (aDate.length == 0)
    {
        // empty field
       // alert("date empty");

        // color error
        doRedBackground(false, "#dateRun");
    }
    else
    {
		// update flag
		var dateOk = true;
    }

    return dateOk;
}



function isFeelingValid(feeling, elementInHtml)
{
	var MAX_LENGTH = 50;
	
    // clear red background
    doRedBackground(true, elementInHtml);

    // flag
    var feelingOk = false;

    // check if note/feeling field is has less or equal charaters
    if (feeling.length <= MAX_LENGTH)
    {
		// update flag
		var feelingOk = true;
    }
    else
    {
		// not valid route name
        // color error
        doRedBackground(false, elementInHtml);
    }

    return feelingOk;	
}


////////////////////////// addRoute //////////////////////////

// check if route name is ok
function isRouteNameValid(aRouteName, elementInHtml)
{
	var MAX_LENGTH = 20;
	
    // clear red background
    doRedBackground(true, elementInHtml);

    // flag
    var routeNameOk = false;

    // check if aRouteName field is filled out
    if (aRouteName.length > 0 && aRouteName.length <= MAX_LENGTH)
    {
		// update flag
		var routeNameOk = true;
    }
    else
    {
		// not valid route name
        // color error
        doRedBackground(false, elementInHtml);
    }

    return routeNameOk;
}


function isDistanceValid(distance)
{
	var distanceOk = false;
	
	// check if distance > 0
	if (distance > 0)
	{
		distanceOk = true;		
	}
	else
	{
		toast("Distance can't be 0 km", standardDurationToast, standardDelayToast);
	}
	return distanceOk;	
}