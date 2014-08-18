//var SERVER_END_POINT_API = "http://localhost:8080";
//var URL_API = "http://localhost:3998";
//var URL_API = "http://175.139.183.94:76/GolfAPI";
//var SERVER_URL = "http://175.139.183.94:76/TimeReportingApi"; // do not include a "/" at the end of this
var SERVER_URL = "http://times.ifcaapps.com";

var mainAjaxSetup = function () {
    $.ajaxSetup({
        async: true,
        error: function (jqXHR, exception, err) {
            if (jqXHR.status === 0) {
                error = 'Not connected.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                error = 'Requested page not found. [404]';
            } else if (jqXHR.status == 400) {
                error = err;
            }
            else if (jqXHR.status == 401) {
                error = '401 Unauthorized';
            } else if (jqXHR.status == 500) {
                error = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                error = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                error = 'Time out error.';
            } else if (exception === 'abort') {
                error = 'Ajax request aborted.';
            } else {
                error = err;
            };
            $("#reusableDialog p.ui-title").text(error);
            $("#reusableDialog").popup("reposition", "positionTo: window").popup("open");
        }
    });
};

// Initialize AJAX Setup
mainAjaxSetup();

//var defaultDate_Test = "";

function display_name_format(firstname, lastname) {
    var display_full_name = firstname + ' ' + lastname;
    display_full_name = display_full_name.trim();
    return display_full_name;
}

function showLoading() {
    setTimeout(function () {
        $.mobile.loading("show", {
            text: "Loading...",
            textVisible: true,
            textonly: true,
        });
    }, 1);
}

function hideLoading() {
    setTimeout(function () {
        $.mobile.loading("hide", {
            text: "Loading...",
            textVisible: true,
            textonly: true,
        });
    }, 500);
}

$(document).on({
    //ajaxStart: function () {
    //    showLoading();
    //},
    //ajaxStop: function () {
    //    if ($.active == 1) {
    //        hideLoading();
    //    }
    //},
    ajaxSend: function () {
        showLoading();
    },
    ajaxComplete: function () {
        if ($.active == 1) {
            hideLoading();
        }
    }
});

//$("input[data-type='search']").on("click", function () {
//    $.mobile.scrollTop(0);
//});

//$.ajaxSetup({
//    beforeSend: function () {
//        
//    },
//    complete: function () {
//        $("#ajaxloader").remove();
//    }
//});


//$(document).bind("ajaxSend", function () {
//    showLoading();
//}).bind("ajaxComplete", function () {
//    hideLoading();
//});

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    var hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

function convertJsonDateTime(data) {
    var dateString = data;
    var reggie = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/;
    var dateArray = reggie.exec(dateString);
    var dateObject = new Date(
        (+dateArray[1]),
        (+dateArray[2]) - 1, // Careful, month starts at 0!
        (+dateArray[3]),
        (+dateArray[4]),
        (+dateArray[5]),
        (+dateArray[6])
    );
    return dateObject;
}

if (localStorage.getItem("Token") != "") {
    $.ajaxSetup({
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("Token")
        }
    });
}

$(document).one('pagecreate', function () {
    //$("#btnBack").click(function () {
    //    //alert("back to previous page");
    //    navigator.app.backHistory();
    //});
    $("#btnPower").click(function () {
        if (confirm('Are you sure you want to exit the app?')) {
            //alert("Off the app");
            navigator.app.exitApp();
        } else {
            // Do nothing!
        }
    });
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        document.addEventListener("backbutton", function (e) {

            //alert("back button");

            if ($.mobile.activePage.is('#homepage')) {
                e.preventDefault();

                if (confirm('Are you sure you want to exit the app?')) {
                    navigator.app.exitApp();
                } else {
                    // Do nothing!
                }

            }
            else {
                //alert("back to history");
                navigator.app.backHistory();
            }
        }, false);
    }
});

var mainFunctions =
    {
        addShowAllCheckbox: function () {
            $("form.ui-filterable").append("<div class='sub-header-floatright' id='divShowAll'><label class='shCheckBoxLabel' data-iconpos='right'>Show All<input type='checkbox' class='shCheckBox' id='showAll' onchange='mainFunctions.toggleShowAllInactive()'/></label></div>");
            $("ul.ui-listview").addClass("clearboth");
            $("input[type='checkbox']").checkboxradio();
        },
        toggleShowAllInactive: function () {
            if ($("#showAll").is(":checked")) {
                $("label:contains('Inactive')").closest("li[data-icon='false']").show();
            } else {
                $("label:contains('Inactive')").closest("li[data-icon='false']").hide();
            }
        }
    };



