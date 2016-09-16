/*
 Name:  Kirstine Nielsen
 Date:  13.09.2016
 App: 	MoreFitMoreFun
*/

function initPanel()
{
    // click link in panel
    $("#linkMyRuns").on("click", function(event){

        event.preventDefault();  // don't redirect to my runs page

        getRunsForCustomer();  // get all runs for specific customer from db
    });
	
	
    // click link in panel
    $("#linkMyRoutes").on("click", function(event){

        event.preventDefault();  // don't redirect to my routes page

        getRoutesForCustomer();  // get all routes for specific customer from db
    });
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
            toast("No runs to display", standardDurationToast, standardDelayToast);
        }
    })
    .always(function() { /* always execute this code */ })
    .fail(function(data){
        /* Execute when ajax falls over */
//        alert("Error Connecting to Webservice.\nTry again.");
        toast("Error Connecting to Webservice.<br/>Try again.", standardDurationToast, standardDelayToast);
    });

}  // end getRunsForCustomer()




// get routes for specific customer
function getRoutesForCustomer()
{
   alert("inside getRoutesForCustomer");

    // get from local storage id, name, and oaut
    var idFromLocalStorage = window.localStorage.getItem("Id");
    var akeyFromLocalStorage = window.localStorage.getItem("OAuth");
    var nameFromLocalStorage = window.localStorage.getItem("Name");

//    alert(idFromLocalStorage + "   " + akeyFromLocalStorage + "   " + nameFromLocalStorage);

    // get all routes for this customer
    $.ajax({
        type: 'GET',
        url: rootURL + 'route/' + idFromLocalStorage + "/" + nameFromLocalStorage + "/" + akeyFromLocalStorage + "/",
        dataType: "json",
    })
    .done(function(data) {
//        alert("in done getRoutesForCustomer");

        // Execute when ajax successfully completes

        // check that data array is longer than zero
        if (data.length > 0)  // at least one row
        {
//            alert("at least one row returned");
//            alert("data.length: " + data.length);

            // set the array of routes
            myRoutes_RoutesArrayGlobal = data;

            // redirect
            $(location).attr('href', '#myRoutesPage');
        }
        else  // zero rows were returned
        {
            // display msg to user
            toast("No routes to display", standardDurationToast, standardDelayToast);
        }
    })
    .always(function() { /* always execute this code */ })
    .fail(function(data){
        /* Execute when ajax falls over */
//        alert("Error Connecting to Webservice.\nTry again.");
        toast("Error Connecting to Webservice.<br/>Try again.", standardDurationToast, standardDelayToast);
    });

}  // end getRunsForCustomer()