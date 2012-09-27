var webservice_url = "http://www.jumahe.com/lab/nannytime/webservice.php";

var deviceId = "device";

var currentTimeStr = "00:00:00";

var message_label;

var manual_date;
var manual_time;

var btn_checkin;
var btn_checkout;

var btn_checkin_custom;
var btn_checkout_custom;

var processing = false;


/* 	
------------------------------------------------------------------------
INIT
------------------------------------------------------------------------
*/
function init()
{
	// -- set date
	$(".date font").html( moment().format("YYYY-MM-DD") );
	
	// -- device id
	if( typeof device !== 'undefined' ) deviceId = device.uuid;
	//deviceId = device.uuid;
	
	// -- messages
	message_label = $(".message font");
	message_label.html("<i><b>ready</b> (" + deviceId + ")</i>");
	
	// -- manual date and time labels
	manual_date = $("#input_date");
	manual_time = $("#input_time");
	
	// -- check IN btn
	btn_checkin = $("#check_in");
	btn_checkin.click( function(){ onCheckIn(); } );
	
	// -- check OUT btn
	btn_checkout = $("#check_out");
	btn_checkout.click( function(){ onCheckOut(); } );
	
	// -- custom check IN btn
	btn_checkin_custom = $("#check_in_custom");
	btn_checkin_custom.click( function(){ onCheckInCustom(); } );
	
	// -- custom check OUT btn
	btn_checkout_custom = $("#check_out_custom");
	btn_checkout_custom.click( function(){ onCheckOutCustom(); } );
	
	// -- launch time update
	updateTime();
}


/* 	
------------------------------------------------------------------------
CURRENT TIME
------------------------------------------------------------------------
*/
function updateTime()
{
	currentTimeStr = moment().format("H:mm:ss");
	$(".hour span b").html(currentTimeStr);
	setTimeout(updateTime, 1e3);
}


/* 	
------------------------------------------------------------------------
GET FULL TIME
------------------------------------------------------------------------
*/
function getDatetime()
{
	return moment().format("YYYY-MM-DD H:mm:ss");
}


/* 	
------------------------------------------------------------------------
CHECK IN Event Handler
------------------------------------------------------------------------
*/
function onCheckIn()
{
	onCheck("IN", getDatetime());
}


/* 	
------------------------------------------------------------------------
CHECK OUT Event Handler
------------------------------------------------------------------------
*/
function onCheckOut()
{
	onCheck("OUT", getDatetime());
}


/* 	
------------------------------------------------------------------------
CHECK IN CUSTOM Event Handler
------------------------------------------------------------------------
*/
function onCheckInCustom()
{
	if( validateCustom() )
	{
		onCheck("IN", manual_date.val() + " " + manual_time.val());
	}
	else
	{
		message_label.html("<i>Error: bad values</i><br>" + manual_date.val());
		setTimeout(ok_timeout, 5000);
	}
}


/* 	
------------------------------------------------------------------------
CHECK OUT CUSTOM Event Handler
------------------------------------------------------------------------
*/
function onCheckOutCustom()
{
	if( validateCustom() )
	{
		onCheck("OUT", manual_date.val() + " " + manual_time.val());
	}
	else
	{
		message_label.html("<i>Error: bad values</i>");
		setTimeout(ok_timeout, 5000);
	}
}


/* 	
------------------------------------------------------------------------
VALIDATE CUSTOM
------------------------------------------------------------------------
*/
function validateCustom()
{
	var date_val = manual_date.val();
	var time_val = manual_time.val();
	
	if( date_val == "" || time_val == "" ) return false;
	
	var regexp_date = new RegExp("^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$");
	if( regexp_date.test( date_val ) == false ) return false;
	
	var regexp_time = new RegExp("^[0-9]{2}:[0-9]{2}$");
	if( regexp_time.test( time_val ) == false ) return false;
	
	return true;
}


/* 	
------------------------------------------------------------------------
CHECK PROCESS
------------------------------------------------------------------------
*/
function onCheck( type, time )
{
	if( processing == false )
	{
		processing = true;
		
		// -- AJAX CALL
		var request = $.ajax(
		{
			url: webservice_url,
			type: "POST",
			data: {
				type: type,
				time: time,
				uuid: deviceId
				},
			dataType: "html"
		});
		
		// -- AJAX CALL OK
		request.done( function( msg )
		{
			if( msg == "ok" )
			{
				message_label.html("<i>Check " + type + " OK</i>");
				processing = false;
				
				setTimeout(ok_timeout, 5000);
			}
			else
			{
				message_label.html("<i>Check " + type + " FAILED<br>msg : " + msg + "</i>");
				processing = false;
			}
		});
		
		// -- AJAX CALL KO
		request.fail( function( jqXHR, textStatus ) 
		{
			message_label.html("<i>Check " + type + " FAILED</i>");
			processing = false;
			
			alert( "Request failed: " + textStatus );
		});
	}
	else
	{
		message_label.html("<i>Currently processing...</i>");
		
		setTimeout(ajax_timeout, 10000);
	}
}


/* 	
------------------------------------------------------------------------
TIMEOUT
------------------------------------------------------------------------
*/
function ajax_timeout()
{
	message_label.html("<i>Timeout - please retry</i>");
	processing = false;
}


/* 	
------------------------------------------------------------------------
OK TIMEOUT
------------------------------------------------------------------------
*/
function ok_timeout()
{
	message_label.html("<i><b>ready</b></i>");
	processing = false;
}