/*
 Name:  Kirstine Nielsen
 Id:    100527988
 Date:  08.08.2016
*/

function initPanel()
{
    // click link in panel
    $("#linkReturnCar").on("click", function(event){

        event.preventDefault();  // don't redirect to return car page

        searchCarForReturn();
    });

    // click link in panel
    $("#linkMyBookings").on("click", function(event){

        event.preventDefault();  // don't redirect to my bookings page

        searchBookingsForCustomer();
    });
}



function searchCarForReturn()
{
//    alert("in fct searchCarForReturn");

    // get from local storage id, email, and oaut
    var idFromLocalStorage = window.localStorage.getItem("Id");
    var akeyFromLocalStorage = window.localStorage.getItem("OAuth");
    var emailFromLocalStorage = window.localStorage.getItem("Email");

    // get all bookings for this customer ordered by date
    $.ajax({
        type: 'GET',
        url: rootURL + '/unreturnedbookings/' + idFromLocalStorage + "/" + emailFromLocalStorage + "/" + akeyFromLocalStorage,
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


// search bookings for specific customer
function searchBookingsForCustomer()
{
//    alert("inside searchBookingsForCustomer");

    // get from local storage id, email, and oaut
    var idFromLocalStorage = window.localStorage.getItem("Id");
    var akeyFromLocalStorage = window.localStorage.getItem("OAuth");
    var emailFromLocalStorage = window.localStorage.getItem("Email");

//    alert(idFromLocalStorage + "   " + akeyFromLocalStorage + "   " + emailFromLocalStorage);

    // get all bookings for this customer
    $.ajax({
        type: 'GET',
        url: rootURL + '/bookings/' + idFromLocalStorage + "/" + emailFromLocalStorage + "/" + akeyFromLocalStorage,
        dataType: "json",
    })
    .done(function(data) {
//        alert("in done searchBookingsForCustomer");

        // Execute when ajax successfully completes

        // check that data holding array is longer than zero
        if (data.length > 0)  // at least one row
        {
//            alert("at least one row returned");
//            alert("data.length: " + data.length);

            // set the array of bookings
            myBookings_BookingsArrayGlobal = data;

            // redirect
            $(location).attr('href', '#myBookingsPage');
        }
        else  // zero rows were returned
        {
            // display msg to user
            toast("You have no Bookings at the moment", standardDurationToast, standardDelayToast);
        }
    })
    .always(function() { /* always execute this code */ })
    .fail(function(data){
        /* Execute when ajax falls over */
//        alert("Error Connecting to Webservice.\nTry again.");
        toast("Error Connecting to Webservice.<br/>Try again.", standardDurationToast, standardDelayToast);
    });

}  // end buildMyBookingsTable()