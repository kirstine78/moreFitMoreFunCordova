/*
 Name:  Kirstine Nielsen
 Date:  13.09.2016
 App: 	MoreFitMoreFun
*/

/////////////////////////////////////////Variable Declaration

var addRoutePageInited = false;

/////////////////////////////////////////jquery On pageinit


// only apply to specific page(s)
$("#addRoutePage").on("pageinit", function(){
	
    if(addRoutePageInited)
    {
//        alert("addRoutePageInited true");
        return;
    }
    else
    {
//        alert("addRoutePageInited false");
        addRoutePageInited= true;
    }  // end added code


    // addRoutePage Event Handlers
    $("#addRoutePage").on("pagebeforeshow", function(){
//         alert("Before show addRoutePage");
    }); // end addRoutePage live beforepageshow


    $("#addRoutePage").on("pagebeforehide", function(){
//         alert("Before hide addRoutePage");
    }); // end addRoutePage live pagebeforehide
    // END addRoutePage Event Handlers


    // btn click
    $("#btnAddRoute").on("click", function(){
		alert ("button clicked");
		
        var routeName = $("#txtAddRouteName").val().trim();
       alert("routeName: " + routeName);
		
        var routeKm = $("#txtAddRouteKm").val().trim();
       alert("routeKm: " + routeKm);

        var routeNameOk = isRouteNameValid(routeName);
       alert("routeNameOk: " + routeNameOk);

        var routeKmOk = isRouteKmValid(routeKm);
       alert("routeKmOk: " + routeKmOk);

        // only if routeNameOk && routeKmOk continue with add route process
        if (routeNameOk && routeKmOk)
		{
			// add route
			$.ajax({
				type: "POST",
				url: rootURL + 'route/',
				data: stringifyRouteDetails(),
				dataType: 'json',
			})
			.done(function(data) {
		//        alert("this is data: " + data);

				if (data)  // insert route succeeded
				{
					// route creation successful; display msg to user
					toast("Route was successfully saved", standardDurationToast, standardDelayToast);
				}
				else  // insert route failed
				{
					// insert route did not go through; display msg to user
					toast("Sorry route was not saved<br/>Please try again", standardDurationToast, standardDelayToast);
				}
			})
			.always(function() { /* always execute this code */ })
			.fail(function(data){
				toast("Error Connecting to Webservice.<br/>Try again.", standardDurationToast, standardDelayToast);
			});
			
		}
		
    });
             
});  // end on pageinit


///////////////////////////////////////// END jquery On pageinit




// populate drop down menu for Suburbs
// function populateDropDownMenuSuburbs()
// {
    // // get suburbs
    // $.ajax({
        // type: 'GET',
        // url: rootURL + '/suburbs',
        // dataType: "json",
    // })
    // .done(function(data) {
// //        alert("in done populateDropDownMenuSuburbs");

        // // Execute when ajax successfully completes

        // // check that data holding array is longer than zero
        // if (data.length > 0)  // at least one row
        // {
// //            alert("at least one row returned");
// //            alert("data.length: " + data.length);

            // var str = "";

            // // build string to populate the drop down
            // for (var i = 0; i < data.length; i++)
            // {
                // // add to string
                // str += "<option value='" + data[i].fldSuburbId + "'>" + data[i].fldSuburb + "</option>";
            // }

            // // add str to element
            // $("#selSuburb").html(str);

            // // set first option to be selected
            // $("#selSuburb option:first").attr('selected', 'selected');

            // //refresh and force rebuild
            // $("#selSuburb").selectmenu('refresh', true);
        // }
        // else  // zero rows were returned
        // {
            // // no suburbs returned which means company has no Suburbs which is not realistic
// //            alert("zero rows returned");
// //            alert("data.length: " + data.length);
        // }
    // })
    // .always(function() { /* always execute this code */ })
    // .fail(function(data){
        // /* Execute when ajax falls over */
// //        alert("Error Connecting to Webservice.\nTry again.");
        // toast("Error Connecting to Webservice - populateDropDownMenuSuburbs.<br/>Try again.", standardDurationToast, standardDelayToast);
    // });
// }



// check if route name is ok
function isRouteNameValid(aRouteName)
{
    // clear red background
    doRedBackground(true, "#txtAddRouteName");

    // flag
    var routeNameOk = false;

    // check if aRouteName field is filled out
    if (aRouteName.length > 0 && aRouteName.length < 30)
    {
		// update flag
		var routeNameOk = true;
    }
    else
    {
		// not valid route name
        // color error
        doRedBackground(false, "#dateRun");
    }

    return routeNameOk;
}



// check if route km is ok
function isRouteKmValid(km)
{
    // clear red background
    doRedBackground(true, "#txtAddRouteKm");

    // flag
    var routeKmOk = false;
	
	// route name must be more than length zero
	// route name must be less than length 30

    // check if aRouteName field is filled out
    if (km.length > 0)
    {
		if (km > 0)  // positive number
		{
			// update flag
			var routeKmOk = true;
		}
    }
    else
    {
		alert("no km input");
		// not valid route name
        // color error
        doRedBackground(false, "#dateRun");
    }

    return routeKmOk;
}



// make json string
function stringifyRouteDetails()
{
   alert("stringify route details");
		
	var routeName 	= $("#txtAddRouteName").val().trim();
	var routeKm 	= $("#txtAddRouteKm").val().trim();	

    // create runDetails object
    var runDetails = new Object();

    // add properties to object
    runDetails.customerId = window.localStorage.getItem("Id");
	runDetails.name = window.localStorage.getItem("Name");
    runDetails.authenticationKey = window.localStorage.getItem("OAuth");
    runDetails.routeName = routeName;
    runDetails.routeKm = routeKm;

    // serialize it
    var jsonStringRunDetails = JSON.stringify(runDetails);

//    alert(jsonStringRunDetails);

    return jsonStringRunDetails;

}  // end stringifyRunDetails()


