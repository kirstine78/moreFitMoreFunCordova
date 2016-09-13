/*
 Name:  Kirstine Nielsen
 Id:    100527988
 Date:  08.08.2016
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
        populateCustomerDetails(window.localStorage.getItem("Email"), window.localStorage.getItem("OAuth"));
        console.log('before myProfilePage show'); // from Eclipse
    });


    // editProfilePage Event Handlers
    $("#editProfilePage").on("pagebeforeshow", function(event){
//              alert("before editProfilePage show");   // from dreamweaver

        // get the mobile and pre fill input field
        fillMobileTextFields(window.localStorage.getItem("Email"), window.localStorage.getItem("OAuth"));

        // wipe all password fields vor value and background color
        $("#pwdPasswordProve").val("");
        $("#pwdPasswordNew1").val("");
        $("#pwdPasswordNew2").val("");
        $(".errorRedBackground").removeClass('errorRedBackground');

        console.log('before editProfilePage show'); // from Eclipse
    });


    // btn click
    $("#btnSubmitRegisterProfile").on("click", function(){
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
        submitProfileChanges(window.localStorage.getItem("Email"), window.localStorage.getItem("OAuth"));
    });
             
});  // end on pageinit


function registerUser()
{
    // get user input
    var firstName = $("#txtRegisterFirstname").val().trim();
    var lastName = $("#txtRegisterLastname").val().trim();
    var licenceNo = $("#txtRegisterLicence").val().trim();
    var email = $("#txtRegisterEmail").val().trim();
    var mobile = $("#txtRegisterMobile").val().trim();
    var password = $("#txtRegisterPassword").val();

    // validate
    var isFirstNameOk = firstName.length > 0;
    var isLastNameOk = lastName.length > 0;
    var isLicenceNoOk = isNumberFormatOk(licenceNo, 9);
    var isEmailOk = isEmailValidFormat(email);
    var isMobileOk = isNumberFormatOk(mobile, 10);
    var isPasswordOk = isNewPasswordFormatOK(password);

    //only try to register if ALL ok (format wise)
    if (isFirstNameOk && isLastNameOk && isLicenceNoOk && isEmailOk && isMobileOk && isPasswordOk)
    {
        // do registration
        register(firstName, lastName, licenceNo, email, mobile, password);
    }

    // make red background for relevant fields
    doRedBackground(isFirstNameOk, "#txtRegisterFirstname");
    doRedBackground(isLastNameOk, "#txtRegisterLastname");
    doRedBackground(isLicenceNoOk, "#txtRegisterLicence");
    doRedBackground(isEmailOk, "#txtRegisterEmail");
    doRedBackground(isMobileOk, "#txtRegisterMobile");
    doRedBackground(isPasswordOk, "#txtRegisterPassword");
}


// do the registration
function register(aFname, aLname, aLicence, anEmail, aMob, aPwd)
{
//    alert("register");
    $.ajax({
        type: "POST",
        url: rootURL + '/customer',
        data: stringifyRegisterDetails(aFname, aLname, aLicence, anEmail, aMob, aPwd),
        dataType: 'json',
    })
    .done(function(data) {
    //        alert("inside done");

        // check if data is null which means that email was not unique
        if (data == null)
        {
//            alert("Sorry email must be unique - data is null");

            doRedBackground(false, "#txtRegisterEmail");
        }
        else  // data is not null, so email is unique
        {
    //            alert(data.fldFirstName);

            // prepare local storage on mobile phone
            var storage = window.localStorage;

            // store authentication key and email locally on mobile phone
            storage.setItem("Id", data.fldCustomerId)  // Pass a key name and its value to add or update that key.
            storage.setItem("OAuth", data.fldAuthenticationKey)  // Pass a key name and its value to add or update that key.
            storage.setItem("Email", data.fldEmail)  // Pass a key name and its value to add or update that key.

            toast("Registered", standardDurationToast, standardDelayToast);

            // redirect to searchCarPage (search car page)
            $(location).attr('href', '#searchCarPage');

            // changeHash false => don't save current page in navigation history (registration page)
//            $.mobile.changePage('#searchCarPage', {reverse: false, changeHash: false});
        }
    })
    .always(function() { /* always execute this code */ })
    .fail(function(data){
//        alert("Inside Fail - Error: " + data);
        toast("Error Connecting to Webservice.<br/>Try again.", standardDurationToast, standardDelayToast);
    });
}


// make json string
function stringifyRegisterDetails(aFname, aLname, aLicence, anEmail, aMob, aPwd)
{
    //create registerDetails object
    var registerDetails = new Object();

    //add properties to object
    registerDetails.firstName = aFname;
    registerDetails.lastName = aLname;
    registerDetails.licenceNo = aLicence;
    registerDetails.email = anEmail;
    registerDetails.mobile = aMob;
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


// when editing My Profile the system must check if password entered is correct password
function submitProfileChanges(emailFromLocalStorage, akeyFromLocalStorage)
{
    // validate user input
    var mobile = $("#txtEditMobile").val().trim();
    var mobileFormatOK = isNumberFormatOk(mobile, 10);
//    alert ("returned mobileFormatOK: " + mobileFormatOK);

    var currentPassword = $("#pwdPasswordProve").val();

//    alert(currentPassword);
//    alert(emailFromLocalStorage);
//    alert(akeyFromLocalStorage);

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
    if (mobileFormatOK && passwordFormatOK && newPasswordsMatchOK)
    {
//        alert("all ok");
        checkCredentials(mobile, currentPassword, newPassword1, emailFromLocalStorage, akeyFromLocalStorage);
    }

    // make red background for relevant fields
    doRedBackground(mobileFormatOK, "#txtEditMobile");
    doRedBackground(passwordFormatOK, "#pwdPasswordProve");
    doRedBackground(newPasswordsMatchOK, "#pwdPasswordNew1");
    doRedBackground(newPasswordsMatchOK, "#pwdPasswordNew2");
}


// make sure password is matching the users password
function checkCredentials(aMobileNo, currentPasswordEntered, newPassword, emailFromLocalStorage, akeyFromLocalStorage)
{
    // verify that the password entered is correct
    $.ajax({
        type: 'GET',
        url: rootURL + '/passwordValidation/' + currentPasswordEntered + '/' + emailFromLocalStorage + '/' + akeyFromLocalStorage,
        dataType: "json",
    })
    .done(function(data) {
//        alert("in done checkCredentials");

        // Execute when ajax successfully completes
        // check password verification
        if (data.VALID == "true")
        {
//            alert("in if valid == true");
            updateCustomerProfileDetails(aMobileNo, newPassword);
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
function updateCustomerProfileDetails(mobileNo, newPwd)
{
    var customerId = window.localStorage.getItem("Id");

    $.ajax({
        type: "PUT",
        url: rootURL + '/customer/' + customerId,
        data: stringifyUpdateDetails(mobileNo, newPwd),
        dataType: 'json',
    })
    .done(function(data) {

        // data is not null
        if (data != null)
        {
//            alert("update done in db");

//            alert("from returned row data.fldAuthenticationKey: " +  data.fldAuthenticationKey);

            // update authentication key local storage
            window.localStorage.setItem("OAuth", data.fldAuthenticationKey);  // Pass a key name and its value to add or update that key.
//            alert("update local: " + window.localStorage.getItem("OAuth"));

            // toast message
            toast("Updated successfully", standardDurationToast, standardDelayToast);

            // redirect to searchCarPage
            $(location).attr('href', '#searchCarPage');
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
function stringifyUpdateDetails(mobileNo, pwd)
{
    // create updateDetails object
    var updateDetails = new Object();

    // add properties to object
    updateDetails.email = window.localStorage.getItem("Email");
    updateDetails.authenticationKey = window.localStorage.getItem("OAuth");
    updateDetails.mobile = mobileNo;
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
function populateCustomerDetails(emailFromLocalStorage, akeyFromLocalStorage)
{
//    alert("in fct populateCustomerDetails");

    // get the customer details
    $.ajax({
        type: 'GET',
        url: rootURL + '/customer/' + emailFromLocalStorage + '/' + akeyFromLocalStorage,
        dataType: "json",
    })
    .done(function(data) {
//        alert("in done populateCustomerDetails");

        // Execute when ajax successfully completes
        // build the html
        var str = "";
        str += "<p>" +  data.fldFirstName + "</p>";
        str += "<p>" +  data.fldLastName + "</p>";
        str += "<p>" +  data.fldLicenceNo + "</p>";
        str += "<p>" +  data.fldEmail + "</p>";
        str += "<p>" +  data.fldMobile + "</p>";

        $("#profileCustomerDetails").html(str);

    })
    .always(function() { /* always execute this code */ })
    .fail(function(data){
        /* Execute when ajax falls over */
//        alert("Error Connecting to Webservice.\nTry again.");
        toast("Error Connecting to Webservice.<br/>Try again.", standardDurationToast, standardDelayToast);
    });
}


function fillMobileTextFields(emailFromLocalStorage, akeyFromLocalStorage)
{
    // get the customer details
    $.ajax({
        type: 'GET',
        url: rootURL + '/customer/' + emailFromLocalStorage + '/' + akeyFromLocalStorage,
        dataType: "json",
    })
    .done(function(data) {
//        alert("in done fillMobileTextFields");

        // Execute when ajax successfully completes
//        alert(data.fldMobile);

        // fill field with mobile
        $("#txtEditMobile").val(data.fldMobile);
    })
    .always(function() { /* always execute this code */ })
    .fail(function(data){
        /* Execute when ajax falls over */
//        alert("Error Connecting to Webservice.\nTry again.");
        toast("Error Connecting to Webservice.<br/>Try again.", standardDurationToast, standardDelayToast);
    });
}