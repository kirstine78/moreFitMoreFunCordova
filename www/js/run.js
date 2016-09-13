/*
 Name:  Kirstine Nielsen
 Date:  13.09.2016
*/

/////////////////////////////////////////Variable Declaration

var addRunPageInited = false;

/////////////////////////////////////////jquery On pageinit


// only apply to specific page(s)
$("#addRunPage").on("pageinit", function(){
	alert ("addRunPage init");
    if(addRunPageInited)
    {
//        alert("addRunPageInited true");
        return;
    }
    else
    {
//        alert("addRunPageInited false");
        addRunPageInited= true;
    }  // end added code


    // addRunPage Event Handlers
    $("#addRunPage").on("pagebeforeshow", function(){
//         alert("Before show addRunPage");

        // populate select menu for Suburbs
        //populateDropDownMenuSuburbs();
    }); // end addRunPage live beforepageshow


    $("#addRunPage").on("pagebeforehide", function(){
//         alert("Before hide addRunPage");
    }); // end addRunPage live pagebeforehide
    // END addRunPage Event Handlers


    // btn click
    $("#btnAddRun").on("click", function(){
        
		alert ("button clicked");
		// add run
		$.ajax({
			type: "POST",
			url: rootURL + 'run/',
			data: stringifyRunDetails(),
			dataType: 'json',
		})
		.done(function(data) {
	//        alert("this is data: " + data);

			if (data)  // insert run succeeded
			{
				// run creation successful; display msg to user
				toast("Run was successful saved", standardDurationToast, standardDelayToast);
			}
			else  // insert run failed
			{
				// insert run did not go through; display msg to user
				toast("Sorry run was not saved<br/>Please try again", standardDurationToast, standardDelayToast);
			}
		})
		.always(function() { /* always execute this code */ })
		.fail(function(data){
			toast("Error Connecting to Webservice.<br/>Try again.", standardDurationToast, standardDelayToast);
		});
    });
             
});  // end on pageinit


///////////////////////////////////////// END jquery On pageinit



// check if date
function checkDateCollisionWithCurrentBookings(pickupDate, returnDate)
{
//    alert("inside checkDateCollisionWithCurrentBookings");

    var id = window.localStorage.getItem("Id");

    // check if dates collide
    $.ajax({
        type: 'GET',
        url: rootURL + '/collision/' + id + "/" + pickupDate + "/" + returnDate,
        dataType: "json",
    })
    .done(function(data) {
//        alert("in done checkDateCollisionWithCurrentBookings");

        // Execute when ajax successfully completes
//        alert("this is data: " + data);

        // check if data == true which means date collision
        if (data)
        {
            // dates collides with booking already in system for customer
//            alert("in the true - dates colliding");

            // booking did not go through; display msg to user
            toast("Date(s) overlaps existing booking<br/><br/>Please change date(s)", standardDurationToast, standardDelayToast);
        }
        else  // no date collision ALL ok
        {
//            alert("NO dates colliding - ALL ok");

            // search for available cars
            doSearchAvailableCars(pickupDate, returnDate, $('select[name=selSuburb]').val());
        }
    })
    .always(function() { /* always execute this code */ })
    .fail(function(data){
        /* Execute when ajax falls over */
//        alert("Error Connecting to Webservice.\nTry again.");
        toast("Error Connecting to Webservice - checkDateCollisionWithCurrentBookings.<br/>Try again.", standardDurationToast, standardDelayToast);
    });
}


// populate drop down menu for Suburbs
function populateDropDownMenuSuburbs()
{
    // get suburbs
    $.ajax({
        type: 'GET',
        url: rootURL + '/suburbs',
        dataType: "json",
    })
    .done(function(data) {
//        alert("in done populateDropDownMenuSuburbs");

        // Execute when ajax successfully completes

        // check that data holding array is longer than zero
        if (data.length > 0)  // at least one row
        {
//            alert("at least one row returned");
//            alert("data.length: " + data.length);

            var str = "";

            // build string to populate the drop down
            for (var i = 0; i < data.length; i++)
            {
                // add to string
                str += "<option value='" + data[i].fldSuburbId + "'>" + data[i].fldSuburb + "</option>";
            }

            // add str to element
            $("#selSuburb").html(str);

            // set first option to be selected
            $("#selSuburb option:first").attr('selected', 'selected');

            //refresh and force rebuild
            $("#selSuburb").selectmenu('refresh', true);
        }
        else  // zero rows were returned
        {
            // no suburbs returned which means company has no Suburbs which is not realistic
//            alert("zero rows returned");
//            alert("data.length: " + data.length);
        }
    })
    .always(function() { /* always execute this code */ })
    .fail(function(data){
        /* Execute when ajax falls over */
//        alert("Error Connecting to Webservice.\nTry again.");
        toast("Error Connecting to Webservice - populateDropDownMenuSuburbs.<br/>Try again.", standardDurationToast, standardDelayToast);
    });
}


// check if dates are ok
function areDatesValid(pickupDate, returnDate)
{
    // clear red background
    doRedBackground(true, "#datePickUp");
    doRedBackground(true, "#dateReturn");

    // get todays date as a string
    var today = getTodaysDate();
//    alert("returned: " + today);

    // flags
    var datesOk = false;

    var isPickupDateOk = false;
    var isReturnDateOk = false;

    // check if pickupDate field is filled out
    if (pickupDate.length == 0)
    {
        // empty field
//        alert("pick up date empty");

        // color error
        doRedBackground(false, "#datePickUp");
    }
    else
    {
        // check that pickup date is equal to todays date or later
        if (pickupDate >= today)
        {
            // update flag
            isPickupDateOk = true;
        }
        else
        {
            // color error
            doRedBackground(false, "#datePickUp");
        }
    }

    // check if returnDate field is filled out
    if (returnDate.length == 0)
    {
        // empty field
//        alert("return date empty");

        // color error
        doRedBackground(false, "#dateReturn");
    }
    else
    {
        // check that (returnDate date is equal to todays date) OR (returnDate date is bigger than todays date)
        if (returnDate >= today)
        {
            // update flag
            isReturnDateOk = true;
        }
        else
        {
            // color error
            doRedBackground(false, "#dateReturn");
        }
    }

    // if both dates exist AND they are equal to today or later
    if (isPickupDateOk && isReturnDateOk)
    {
        // make sure that returnDate is equal or later in time compared to pickupDate
        if (pickupDate <= returnDate)  // date relation ok
        {
//            alert ("date relation ok");
            datesOk = true;
        }
        else  // returnDate is too early
        {
            // update flag
            isReturnDateOk = false;

            // color error
            doRedBackground(isReturnDateOk, "#dateReturn");
        }
    }

    return datesOk;
}


// return todays date as string format yyyy-mm-dd
function getTodaysDate()
{
    var todayAsString = "";

    // prepare todays date; build date as string yyyy-mm-dd
    var aDateObj = new Date();

    var yyyy = aDateObj.getFullYear();
    var mm = aDateObj.getMonth();  // returns the month (from 0 to 11)
    var dd = aDateObj.getDate();  // returns the day of the month (from 1 to 31)

    // add 1 to mm
    mm += 1;

//    alert (yyyy + "-" + mm + "-" + dd);

    // build todayAsString
    todayAsString += yyyy + "-";

    // check if a zero needs to be added to mm
    if (mm < 10)
    {
        todayAsString += "0" + mm + "-";
    }
    else
    {
        todayAsString += mm + "-";
    }

    // check if a zero needs to be added to dd
    if (dd < 10)
    {
        todayAsString += "0" + dd;
    }
    else
    {
        todayAsString += dd;
    }

//    alert("finish build date: " + todayAsString);

    return todayAsString;
}


function doSearchAvailableCars(pickupDate, returnDate, suburbId)
{
    // get available cars
    $.ajax({
        type: 'GET',
        url: rootURL + '/cars/available/' + suburbId + "/" + pickupDate + "/" + returnDate,
        dataType: "json",
    })
    .done(function(data) {

        // Execute when ajax successfully completes

        // check that data holding array is longer than zero
        if (data.length > 0)  // at least one row
        {
//            alert("at least one row returned - data.length: " + data.length);

            // set global variables
            availableCarsPickupDateGlobal = pickupDate;
            availableCarsReturnDateGlobal = returnDate;
            availableCarsSuburbIdGlobal = suburbId;
            availableCarsDataArrayGlobal = data;

            // redirect to availableCarsPage
            $(location).attr('href', '#availableCarsPage');
        }
        else  // zero rows were returned
        {
//            alert("zero rows returned - data.length: " + data.length);

            // msg user about no available car
            toast("Sorry no available cars<br/>Change period or Suburb", standardDurationToast, standardDelayToast);
        }
    })
    .always(function() { /* always execute this code */ })
    .fail(function(data){
        /* Execute when ajax falls over */
//        alert("Error Connecting to Webservice.\nTry again.");
        toast("Error Connecting to Webservice - doSearchAvailableCars.<br/>Try again.", standardDurationToast, standardDelayToast);
    });
}




