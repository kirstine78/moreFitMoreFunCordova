/*
 Name:  Kirstine Nielsen
 Date:  13.09.2016
*/

/////////////////////////////////////////Variable Declaration

var addRunPageInited = false;

/////////////////////////////////////////jquery On pageinit


// only apply to specific page(s)
$("#addRunPage").on("pageinit", function(){
	
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


// make json string
function stringifyRunDetails()
{
   alert("stringify run details");
		
	var date 		= $("#dateRun").val();
	var routeName 	= $("#txtRouteName").val();
	var km 			= $("#txtKm").val();
	var seconds 	= $("#txtSeconds").val();
	var feeling 	= $("#txtFeeling").val();
	
	// alert("date: " + date + "\nrouteName: " + routeName + 
			// "\nkm: " + km + "\nseconds: " + seconds + "\nfeeling: " + feeling);

    // create runDetails object
    var runDetails = new Object();

    // add properties to object
    runDetails.customerId = window.localStorage.getItem("Id");
	runDetails.email = window.localStorage.getItem("Email");
    runDetails.authenticationKey = window.localStorage.getItem("OAuth");
    runDetails.date = date;
    runDetails.routeName = routeName;
    runDetails.km = km;
    runDetails.seconds = seconds;
    runDetails.feeling = feeling;

    // serialize it
    var jsonStringRunDetails = JSON.stringify(runDetails);

//    alert(jsonStringRunDetails);

    return jsonStringRunDetails;

}  // end stringifyRunDetails()


