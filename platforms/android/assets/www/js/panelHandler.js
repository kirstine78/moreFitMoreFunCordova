/*
 Name:  Kirstine Nielsen
 Date:  13.09.2016
*/

function initPanel()
{
    // click link in panel
    $("#linkMyRuns").on("click", function(event){

        event.preventDefault();  // don't redirect to my runs page

        getRunsForCustomer();  // get all runs for specific customer from db
    });
	
	
    // click link in panel
    // $("#linkReturnCar").on("click", function(event){

        // event.preventDefault();  // don't redirect to return car page

        // searchCarForReturn();
    // });
}


// get runs for specific customer
function getRunsForCustomer()
{
   alert("inside getRunsForCustomer");

    // get from local storage id, name, and oaut
    var idFromLocalStorage = window.localStorage.getItem("Id");
    var akeyFromLocalStorage = window.localStorage.getItem("OAuth");
    var nameFromLocalStorage = window.localStorage.getItem("Name");

//    alert(idFromLocalStorage + "   " + akeyFromLocalStorage + "   " + nameFromLocalStorage);

    // get all runs for this customer
    $.ajax({
        type: 'GET',
        url: rootURL + 'run/' + idFromLocalStorage + "/" + nameFromLocalStorage + "/" + akeyFromLocalStorage + "/",
        dataType: "json",
    })
    .done(function(data) {
//        alert("in done getRunsForCustomer");

        // Execute when ajax successfully completes

        // check that data array is longer than zero
        if (data.length > 0)  // at least one row
        {
//            alert("at least one row returned");
//            alert("data.length: " + data.length);

            // set the array of runs
            myRuns_RunsArrayGlobal = data;

            // redirect
            $(location).attr('href', '#myRunsPage');
        }
        else  // zero rows were returned
        {
            // display msg to user
            toast("You have no Runs", standardDurationToast, standardDelayToast);
        }
    })
    .always(function() { /* always execute this code */ })
    .fail(function(data){
        /* Execute when ajax falls over */
//        alert("Error Connecting to Webservice.\nTry again.");
        toast("Error Connecting to Webservice.<br/>Try again.", standardDurationToast, standardDelayToast);
    });

}  // end getRunsForCustomer()




function searchCarForReturn()
{
//    alert("in fct searchCarForReturn");

    // get from local storage id, name, and oaut
    var idFromLocalStorage = window.localStorage.getItem("Id");
    var akeyFromLocalStorage = window.localStorage.getItem("OAuth");
    var nameFromLocalStorage = window.localStorage.getItem("Name");

    // get all runs for this customer ordered by date
    $.ajax({
        type: 'GET',
        url: rootURL + '/unreturnedbookings/' + idFromLocalStorage + "/" + nameFromLocalStorage + "/" + akeyFromLocalStorage,
        dataType: "json",
    })
    .done(function(data) {
//        alert("in done searchCarForReturn");

        // Execute when ajax successfully completes

        // check that data holding array is longer than zero
        if (data.length > 0)  // at least one row
        {
//            alert("at least one row returned");
//            alert("data.length: " + data.length);

            checkDatesAndRedirectToReturnCar(data);
        }
        else  // zero rows were returned
        {
//            alert("zero rows returned - data.length: " + data.length);

            // no bookings; display msg to user
            toast("You have no active bookings", standardDurationToast, standardDelayToast);
        }
    })
    .always(function() { /* always execute this code */ })
    .fail(function(data){
        /* Execute when ajax falls over */
//        alert("Error Connecting to Webservice.\nTry again.");
        toast("Error Connecting to Webservice.<br/>Try again.", standardDurationToast, standardDelayToast);
    });
}


// takes array of records as param
function checkDatesAndRedirectToReturnCar(data)
{
    var lastIndex = data.length - 1;

    // fetch last index (this will be the oldest booking startdate for this customer)
    var oldestBookingRow = data[lastIndex];
//            alert(JSON.stringify(oldestBookingRow));

    var oldestBookingStartDate = oldestBookingRow.fldStartDate;
//            alert("oldestBookingStartDate: " + oldestBookingStartDate);

    var oldestBookingReturnDate = oldestBookingRow.fldReturnDate;
//            alert("oldestBookingReturnDate: " + oldestBookingReturnDate);

    // get todays date as string, fct in searchCar.js
    var todaysDate = getTodaysDate();
//            alert("todaysDate: " + todaysDate);

    // check if todays date is past to endDate
    if (todaysDate > oldestBookingReturnDate)
//            if (true)
    {
//                alert ("too late return");

        // set global Booking
        returnCarBookingGlobal = oldestBookingRow;
        returnCarBookingGlobal.isReturnedTooLate = true;

        // redirect
        $(location).attr('href', '#returnCarDetailsPage');
    }
    // check that (todays date is equal to startDate) OR (todays date is bigger than startDate)
    else if (todaysDate >= oldestBookingStartDate)
//            else if (false)
    {
        // ok there's a car ready to return
//                alert("car ready to return within the allowed date range");

        // set global Booking
        returnCarBookingGlobal = oldestBookingRow;
        returnCarBookingGlobal.isReturnedTooLate = false;

        // redirect
        $(location).attr('href', '#returnCarDetailsPage');
    }
    else
    {
        // no car ready to return yet, we haven't reached the date yet
//                alert("no car ready to return yet");

        // no car ready to return yet, we haven't reached the date yet; display msg to user
        toast("No car ready to return yet", standardDurationToast, standardDelayToast);
    }
}
