/*
 Name:  Kirstine Nielsen
 Date:  13.09.2016
 App: 	MoreFitMoreFun
*/

/////////////////////////////////////////Variable Declaration

// 10.0.2.2 is the same as Localhost of WService running in Emulator.
// var rootURL = "http://10.0.2.2/sites/Health/index.php/";
//var rootURL = "http://kirstine.byethost14.com/sites/Health/index.php/";
var rootURL = "http://kirstine.comli.com/sites/Health/index.php/";
// var rootURL = "http://localhost/sites/Health/index.php/";  // for the browser tester

var pageinited = false;

// reuse panel on multiple pages
var panel = '<div data-role="panel" id="mypanel" data-position="left" data-display="overlay" data-theme="a"><ul data-role="listview">' + 
			'<li><a href="#addRunPage" data-rel="close">Add Run</a></li>' +
			'<li><a href="#addRoutePage" data-rel="close">Add Route</a></li>' +
			'<li><a id="linkMyRuns" href="#myRunsPage" data-rel="close">My Runs</a></li>' +
			'<li><a id="linkMyRoutes" href="#myRoutesPage" data-rel="close">My Routes</a></li>' +
			'<li><a href="#myProfilePage" data-rel="close">My Profile</a></li>' +
			'</ul></div>';

var standardDurationToast = 500;
var standardDelayToast = 2000;

var mainBrandsArrayGlobal;


$(document).ready(function () {
    // alert("ready");
	loadFirstPage();	
});


$(document).one('pagebeforecreate', function () {
    $.mobile.pageContainer.prepend(panel);
    $("#mypanel").panel().enhanceWithin();
    initPanel();
});


function loadFirstPage()
{
	// get from local storage id, name, and oaut
    var idFromLocalStorage 		= window.localStorage.getItem("Id");
    var akeyFromLocalStorage 	= window.localStorage.getItem("OAuth");
    var nameFromLocalStorage 	= window.localStorage.getItem("Name");

	// alert("from storage id: " + idFromLocalStorage
		   // + "\nfrom storage name: " + nameFromLocalStorage
		   // + "\nfrom storage key: " + akeyFromLocalStorage);		   

    // make sure that name and OAuth exist in the local storage
    if (nameFromLocalStorage != null && akeyFromLocalStorage != null && idFromLocalStorage != null)
    {
		// alert("local storage has id, name, and authKey");

        // check if both matches both in database
        $.ajax({
            type: 'GET',
            url: rootURL + 'authenticate/' + nameFromLocalStorage + '/' + akeyFromLocalStorage,
            dataType: "json",
        })
        .done(function(data) {
//            alert("in done");

            // Execute when ajax successfully completes

			var nameOfFirstPage = "";			
			
            // check value of VALID in the returned json object {"VALID":"true/false"}
//            alert("data.VALID: " + data.VALID);
            if (data.VALID == "true")
            {
//                alert("in if valid == true");
				nameOfFirstPage = "addRunPage";	
            }

            else  //{"VALID":"false"}
            {
                //alert user
//                alert ("invalid");
				nameOfFirstPage = "firstTimePage";	
            }
			
			//redirect to either firstTimePage	or addRunPage
			window.location.hash = nameOfFirstPage;
			$.mobile.initializePage();
        })
        .always(function() { /* always execute this code */ })
        .fail(function(data){
            /* Execute when ajax falls over */
//            alert("Error Connecting to Webservice.\nTry again.");
            toast("Error Connecting to Webservice - authenticate.<br/>Try again", standardDurationToast, standardDelayToast);
        });
    }
    else  // not existing; go to firstTimePage
    {
//        alert("local storage empty");

        //redirect to firstTimePage page
		var nameOfFirstPage = "firstTimePage";	
		
		window.location.hash = nameOfFirstPage;
		$.mobile.initializePage();
    }
	
}

/////////////////////////////////////////jquery On Document Ready

$(document).on("pageinit", function(){

    if(pageinited)
    {
//        alert("pageinited true");
        return;
    }
    else
    {
//        alert("pageinited false");
        pageinited= true;
    }  // end added code

	
	// btn click
    $("#btnGoToRegister").on("click", function(){
        
		// alert ("button clicked");

		//redirect to registrationPage
		$("#moreFitMoreFunBody").pagecontainer("change", '#registrationPage', {changeHash: false});
    });


    // btn click
    $("#btnGoToLogin").on("click", function(){
		// alert("button clicked");
        
		// redirect
		$("#moreFitMoreFunBody").pagecontainer("change", '#loginPage', {changeHash: false});	
    });
             
});  // end document on pageinit



///////////////////////////////////////// END jquery On Document Ready





// red background added to element if not valid
// param:  boolean, string for example "#someId"
function doRedBackground(isOk, elementId)
{
    if (!isOk)
    {
        $(elementId).addClass('errorRedBackground');
    }
    else
    {
        $(elementId).removeClass('errorRedBackground');
    }
}


// toast to display information to user
function toast(message, duration, delayAmount) {
    var $toast = $('<div class="ui-loader ui-overlay-shadow ui-body-e ui-corner-all"><h3>' + message + '</h3></div>');

    $toast.css({
        display: 'block',
        background: '#fff',
        opacity: 0.90,
        position: 'fixed',
        padding: '7px',
        'text-align': 'center',
        width: '270px',
        left: ($(window).width() - 284) / 2,
        top: $(window).height() / 2 - 20
    });

    var removeToast = function(){
        $(this).remove();
    };

    $toast.click(removeToast);

    $toast.appendTo($.mobile.pageContainer).delay(delayAmount);  //2000
    $toast.fadeOut(duration, removeToast);
}
