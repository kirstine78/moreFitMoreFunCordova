/*
 Name:  Kirstine Nielsen
 Date:  13.09.2016
 App: 	MoreFitMoreFun
*/

/////////////////////////////////////////Variable Declaration

var profilePagesInited = false;


/////////////////////////////////////////jquery On pageinit

// only apply to specific page(s)
$("#registrationPage, #myProfilePage, #editProfilePage").on("pageinit", function(){

    if(profilePagesInited)
    {
//        alert("profilePagesInited true");
        return;
    }
    else
    {
//        alert("profilePagesInited false");
        profilePagesInited= true;
    }  // end added code


    // myProfilePage Event Handlers
    $("#myProfilePage").on("pagebeforeshow", function(event){
//              alert("before myProfilePage show");   // from dreamweaver
        // get customer details
        populateCustomerDetails(window.localStorage.getItem("Name"), window.localStorage.getItem("OAuth"));
        console.log('before myProfilePage show'); // from Eclipse
    });


    // editProfilePage Event Handlers
    $("#editProfilePage").on("pagebeforeshow", function(event){
//              alert("before editProfilePage show");   // from dreamweaver

        // get the mobile and pre fill input field
        fillMobileTextFields(window.localStorage.getItem("Name"), window.localStorage.getItem("OAuth"));

        // wipe all password fields for value and background color
        $("#pwdPasswordProve").val("");
        $("#pwdPasswordNew1").val("");
        $("#pwdPasswordNew2").val("");
        $(".errorRedBackground").removeClass('errorRedBackground');

        console.log('before editProfilePage show'); // from Eclipse
    });


    // btn click
    $("#btnSubmitRegisterProfile").on("click", function(){
		// alert("button clicked");
        registerUser();
    });


    // btn click
    $("#btnEditProfile").on("click", function(){
        // redirect
        $(location).attr('href', '#editProfilePage');
    });


    // btn click
    $("#btnSubmitChangesProfile").on("click", function(){
        // hard coded test : mypass
        submitProfileChanges(window.localStorage.getItem("Name"), window.localStorage.getItem("OAuth"));
    });
             
});  // end on pageinit


function registerUser()
{
    // get user input
    var name = $("#txtRegisterName").val().trim();
    var email = $("#txtRegisterEmail").val().trim();
    var password = $("#txtRegisterPassword").val();
	
	alert("name: " + name);
	
    // validate
    var isNameOk = isNameValidFormat(name);
	var isEmailOk = true;
	
	// only check email if user has entered input data
	if (email != null)
	{
		isEmailOk = isEmailValidFormat(email);
	}
    var isPasswordOk = isNewPasswordFormatOK(password);

    //only try to register if ALL ok (format wise)
    if (isNameOk && isEmailOk && isPasswordOk)
    {
        // do registration
        register(name, email, password);
    }

    // make red background for relevant fields
    doRedBackground(isNameOk, "#txtRegisterName");
    doRedBackground(isEmailOk, "#txtRegisterEmail");
    doRedBackground(isPasswordOk, "#txtRegisterPassword");
}



// do the registration
function register(aName, anEmail, aPwd)
{
   // alert("register");
    $.ajax({
        type: "POST",
        url: rootURL + 'customer/',
        data: stringifyRegisterDetails(aName, anEmail, aPwd),
        dataType: 'json',
    })
    .done(function(data) {
           // alert("inside done");

        // check if data is null which means that name was not unique
        if (data == null)
        {
           alert("Sorry name must be unique - data is null");

            doRedBackground(false, "#txtRegisterName");
        }
        else  // data is not null, so name is unique
        {
               alert(data.fldName);

            // prepare local storage on mobile phone
            var storage = window.localStorage;

            // store customerId, authentication key and name locally on mobile phone
            storage.setItem("Id", data.fldCustomerId)  // Pass a key name and its value to add or update that key.
            storage.setItem("OAuth", data.fldAuthenticationKey)  // Pass a key name and its value to add or update that key.
            storage.setItem("Name", data.fldName)  // Pass a key name and its value to add or update that key.

            toast("Registered", standardDurationToast, standardDelayToast);

            // redirect to addRunPage
            $(location).attr('href', '#addRunPage');

            // changeHash false => don't save current page in navigation history (registration page)
//            $.mobile.changePage('#addRunPage', {reverse: false, changeHash: false});
        }
    })
    .always(function() { /* always execute this code */ })
    .fail(function(data){
//        alert("Inside Fail - Error: " + data);
        toast("Error Connecting to Webservice.<br/>Try again.", standardDurationToast, standardDelayToast);
    });
}


// make json string
function stringifyRegisterDetails(aName, anEmail, aPwd)
{
    //create registerDetails object
    var registerDetails = new Object();

    //add properties to object
    registerDetails.name = aName;
    registerDetails.email = anEmail;
    registerDetails.password = aPwd;

    //serialize it
    var jsonStringRegisterDetails = JSON.stringify(registerDetails);
//    alert(jsonStringRegisterDetails);

    return jsonStringRegisterDetails;
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


// check if email is valid format
function isNameValidFormat(name)
{
   alert("into isNameValidFormat");
   
	name.length > 0;
    var nameValid = false;

    if (name.length < 1 || name.indexOf(' ') >= 0)
    {
       alert("invalid name");
        nameValid = false;  // redundant
    }
    else
    {
        nameValid = true;
    }
   alert("nameValid: " + nameValid);
    return nameValid;
}


// when editing My Profile the system must check if password entered is correct password
function submitProfileChanges(nameFromLocalStorage, akeyFromLocalStorage)
{
   // alert ("in submitProfileChanges");
    // validate user input
    var email = $("#txtEditEmail").val().trim();
   alert ("email length: " + email.length);
	var emailFormatOK = true;
	
	// check if an email is entered
	if (email.length == 0)
	{
		email = null;
	}
	else  // only check for valid email format if email was entered
	{
		alert("email is not null");
		emailFormatOK = isEmailValidFormat(email);
		alert ("returned emailFormatOK: " + emailFormatOK);
	}

    var currentPassword = $("#pwdPasswordProve").val();

   alert(currentPassword);
   alert(nameFromLocalStorage);
   alert(akeyFromLocalStorage);

    var passwordFormatOK = isStringLengthMoreThanZero(currentPassword);
//    alert ("returned passwordFormatOK: " + passwordFormatOK);

    var newPassword1 = $("#pwdPasswordNew1").val();
    var newPassword2 = $("#pwdPasswordNew2").val();

    var newPassword1FormatOK = false;
    var newPasswordsMatchOK = false;

    if (newPassword1.length == 0 && newPassword2.length == 0)
    {
//        alert("both new pwd are zero length");
        newPasswordsMatchOK = true;
    }
    else  // at least one of the new pwd fields filled out
    {
        newPassword1FormatOK = isNewPasswordFormatOK(newPassword1);
//        alert ("returned newPassword1FormatOK: " + newPassword1FormatOK);

        // if newPassword1 format is ok check if it matches
        if (newPassword1FormatOK)
        {
            if (newPassword1 == newPassword2)
            {
//                alert("match");
                newPasswordsMatchOK = true;
            }
        }
        else
        {
            console.log("newPassword1FormatOK false");
        }
    }
//    alert ("newPasswordsMatchOK: " + newPasswordsMatchOK);

    //if all ok
    if (emailFormatOK && passwordFormatOK && newPasswordsMatchOK)
    {
//        alert("all ok");
        checkCredentials(email, currentPassword, newPassword1, nameFromLocalStorage, akeyFromLocalStorage);
    }

    // make red background for relevant fields
    doRedBackground(emailFormatOK, "#txtEditEmail");
    doRedBackground(passwordFormatOK, "#pwdPasswordProve");
    doRedBackground(newPasswordsMatchOK, "#pwdPasswordNew1");
    doRedBackground(newPasswordsMatchOK, "#pwdPasswordNew2");
}


// make sure password is matching the users password
function checkCredentials(anEmail, currentPasswordEntered, newPassword, nameFromLocalStorage, akeyFromLocalStorage)
{
    // verify that the password entered is correct
    $.ajax({
        type: 'GET',
        url: rootURL + 'passwordValidation/' + currentPasswordEntered + '/' + nameFromLocalStorage + '/' + akeyFromLocalStorage + '/',
        dataType: "json",
    })
    .done(function(data) {
//        alert("in done checkCredentials");

        // Execute when ajax successfully completes
        // check password verification
        if (data.VALID == "true")
        {
//            alert("in if valid == true");
            updateCustomerProfileDetails(anEmail, newPassword);
        }
        else  //{"VALID":"false"}
        {
//            alert ("invalid");
            doRedBackground(false, "#pwdPasswordProve");
        }
    })
    .always(function() { /* always execute this code */ })
    .fail(function(data){
        /* Execute when ajax falls over */
        toast("Error Connecting to Webservice.<br/>Try again.", standardDurationToast, standardDelayToast);
    });
}


// update details
function updateCustomerProfileDetails(anEmail, newPwd)
{
    var customerId = window.localStorage.getItem("Id");

    $.ajax({
        type: "PUT",
        url: rootURL + 'customer/' + customerId + '/',
        data: stringifyUpdateDetails(anEmail, newPwd),
        dataType: 'json',
    })
    .done(function(data) {

        // data is not null
        if (data != null)
        {
           alert("update done in db");

           alert("from returned row data.fldAuthenticationKey: " +  data.fldAuthenticationKey);

            // update authentication key local storage
            window.localStorage.setItem("OAuth", data.fldAuthenticationKey);  // Pass a key name and its value to add or update that key.
           alert("update local: " + window.localStorage.getItem("OAuth"));

            // toast message
            toast("Updated successfully", standardDurationToast, standardDelayToast);

            // redirect to addRunPage
            $(location).attr('href', '#addRunPage');
        }
        else  // data == null
        {
//            alert("data: " + data);
            // toast message
            toast("Update failed", standardDurationToast, standardDelayToast);
        }
    })
    .always(function() { /* always execute this code */ })
    .fail(function(data){
        toast("Error Connecting to Webservice.<br/>Try again.", standardDurationToast, standardDelayToast);
    });
}


// make json string
function stringifyUpdateDetails(anEmail, pwd)
{
    // create updateDetails object
    var updateDetails = new Object();

    // add properties to object
    updateDetails.name = window.localStorage.getItem("Name");
    updateDetails.authenticationKey = window.localStorage.getItem("OAuth");
    updateDetails.email = anEmail;
    updateDetails.password = pwd;

    // serialize it
    var jsonStringUpdateDetails = JSON.stringify(updateDetails);
    //alert(jsonStringUpdateDetails);

    return jsonStringUpdateDetails;
}


// check if number is correct length and digits only
function isNumberFormatOk(aNumber, aLength)
{
    var numberFormatOK = false;
    var numberLength = aNumber.length;
//    alert("number length: " + numberLength);

    if (numberLength == aLength)
    {
//        alert ("ok length");
        // check if all digits
        if (aNumber.match(/^[0-9]+$/) != null)
        {
//            alert("all digits");
            numberFormatOK = true;
        }
        else
        {
//            alert("NOT all digits");
            console.log("NOT all digits");
        }
    }
    else
    {
//         alert("NOT 10 in length");
            console.log("NOT 10 in length");
    }
//    alert("numberFormatOK: " + numberFormatOK);
    return numberFormatOK;
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


// populate page with customer details
function populateCustomerDetails(nameFromLocalStorage, akeyFromLocalStorage)
{
//    alert("in fct populateCustomerDetails");

    // get the customer details
    $.ajax({
        type: 'GET',
        url: rootURL + 'customer/' + nameFromLocalStorage + '/' + akeyFromLocalStorage + '/',
        dataType: "json",
    })
    .done(function(data) {
//        alert("in done populateCustomerDetails");

        // Execute when ajax successfully completes
		
        // build the html
        var str = "";
        str += "<p>" +  data.fldName + "</p>";
		
		// check if there is an email
		if (data.fldEmail == null)
		{
			str += "<p><em>no email</em></p>";
		}
		else
		{
			str += "<p>" + data.fldEmail + "</p>";
		}        

        $("#profileCustomerDetails").html(str);
    })
    .always(function() { /* always execute this code */ })
    .fail(function(data){
        /* Execute when ajax falls over */
//        alert("Error Connecting to Webservice.\nTry again.");
        toast("Error Connecting to Webservice.<br/>Try again.", standardDurationToast, standardDelayToast);
    });
}


function fillMobileTextFields(nameFromLocalStorage, akeyFromLocalStorage)
{
    // get the customer details
    $.ajax({
        type: 'GET',
        url: rootURL + 'customer/' + nameFromLocalStorage + '/' + akeyFromLocalStorage + '/',
        dataType: "json",
    })
    .done(function(data) {
//        alert("in done fillMobileTextFields");

        // Execute when ajax successfully completes
		alert("the email to fill: " + data.fldEmail);
        // fill field
        $("#txtEditEmail").val(data.fldEmail);
    })
    .always(function() { /* always execute this code */ })
    .fail(function(data){
        /* Execute when ajax falls over */
//        alert("Error Connecting to Webservice.\nTry again.");
        toast("Error Connecting to Webservice.<br/>Try again.", standardDurationToast, standardDelayToast);
    });
}