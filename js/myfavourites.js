﻿$(document).one("pagecontainerbeforeshow", function () {
    $.ajaxSetup({
        error: function (jqXHR, exception) {
            if (jqXHR.status === 0) {
                error = "Unable to connect to server. Are you connected to the internet?";
            } else if (jqXHR.status == 404) {
                error = "Requested page not found. [404]";
            } else if (jqXHR.status == 401) {
                error = "401 Unauthorized";
            } else if (jqXHR.status == 500) {
                error = "Internal Server Error [500].";
            } else if (exception === 'parsererror') {
                error = "Requested JSON parse failed.";
            } else if (exception === 'timeout') {
                error = "Time out error.";
            } else if (exception === 'abort') {
                error = "Ajax request aborted.";
            } else {
                error = jqXHR.responseText;
            }

            $("#reusableDialog p.ui-title").text(error);
            $("#reusableDialog").popup("reposition", "positionTo: window").popup("open");
        }
    });
    myFavouritesFunctions.generateListView();
    myFavouritesFunctions.addFlipSwitch();
    myFavouritesFunctions.flipSwitch();

});

var myFavouritesFunctions =
    {
        flipSwitch: function () {
            if ($("#flipswitch").val() == "favourite") {
                myFavouritesFunctions.generateListView(); // the list of favourites
            } else {
                myFavouritesFunctions.generateAddListView(); // the list of account codes
            }
        },
        addFlipSwitch: function () {
            $("form.ui-filterable div.ui-input-search").addClass("floatleft listviewfilter");
            $("form.ui-filterable").append(
                "<div class='floatright'>" +
                    "<div class='fieldcontain'>" +
                        "<label for='flipswitch'></label>" +
                        "<select data-role='flipswitch' id='flipswitch' onchange='myFavouritesFunctions.flipSwitch()'>" +
                            "<option value='favourite'>Fav</option>" +
                            "<option value='all'>All</option>" +
                        "</select>" +
                    "</div>" +
                "</div>"
                );
            $("ul.ui-listview").addClass("clearboth");
            $("select#flipswitch").flipswitch();
        },
        onClick: function (event) {
            var id = event.target.id;
            // workaround in case people click on another element deeper within the DOM
            // just make sure that there are no IDs within the <a> tag
            if (!id) {
                id = $(event.target).closest("a").attr("id");
                //alert(id);
            }
            if ($.mobile.pagecontainer("getActivePage") == "myFavourites") {
                // toggle the yellow star
                if ($("#" + id).hasClass("ui-icon-favstar-hl")) {
                    $("#" + id).removeClass("ui-icon-favstar-hl");
                } else { // if it doesn't have the class, add it
                    $("#" + id).addClass("ui-icon-favstar-hl");
                }
                //$("#" + id).toggleClass("ui-btn-active");

                if ($("#" + id).hasClass("ui-icon-favstar-hl")) {
                    // do API to add to favourites
                    var addFavAPI = SERVER_URL + "/api/accountcode/addmyfavouritecode"; // needs to be changed after Carso allows for DELETE on the server
                    var userID = localStorage.getItem("UserID");

                    $.ajax({
                        url: addFavAPI,
                        type: "POST", // needs to be changed after Carso allows for DELETE on the server
                        crossDomain: true,
                        async: false,
                        contentType: "application/json",
                        dataType: "json",
                        data: JSON.stringify({
                            "AccountCode": id,
                            "UserDetailID": userID
                        }),
                        success: function () {
                        },
                        error: function (jqXHR, status, error) {
                            //alert(status + " " + error);
                            $(this).removeClass("ui-icon-favstar-hl");
                        }
                    });
                } else {
                    // do API to remove from favourites
                    var delFavAPI = SERVER_URL + "/api/accountcode/deletemyfavouritecode/"; // needs to be changed after Carso allows for DELETE on the server
                    var userID = localStorage.getItem("UserID");

                    $.ajax({
                        url: delFavAPI,
                        type: "POST", // needs to be changed after Carso allows for DELETE on the server
                        crossDomain: true,
                        async: false,
                        contentType: "application/json",
                        data: JSON.stringify({
                            "AccountCode": id,
                            "UserDetailID": userID
                        }),
                        success: function () {
                            //$("#li_" + id).remove();
                            $("#myFavouritesList").listview("refresh");
                            //if ($("ul li").length < 1) {
                            //    $("ul").append("<li class='nofavourites'>You have no favourites.</li>");
                            //    $("ul").listview("refresh");
                            //}
                        },
                        error: function (jqXHR, status, error) {
                            //alert(status + " " + error);
                            $(this).addClass("ui-icon-favstar-hl");
                        }
                    });
                }
            } else if ($.mobile.pagecontainer("getActivePage") == "myActivity-add" || "myActivity-edit") {
                $("#hrefAccountCode").text(id);
                $("#accCodePopup").popup("close");
            }
        },
        generateAddListView: function () {
            $(".nofavourites").remove();
            var getAccountCodeAPI = SERVER_URL + "/api/accountcode";

            $.ajax({
                url: getAccountCodeAPI,
                type: "GET",
                crossDomain: true,
                async: true,
                success: function (data) {
                    var appendHTML = "";
                    for (var i = 0; i < data.length; i++) {
                        var activeOrInactive = function () {
                            var string = "";
                            if (data[i].ActiveFlag == 0) {
                                string = "Inactive";
                            }
                            return string;
                        }();
                        var li =
                            "<li data-icon='favstar'>" +
                                "<a id='" + data[i].AccountCode + "' onclick='myFavouritesFunctions.onClick(event)'>" +
                                    "<div class='floatleft'>" +
                                        "<h5>" + data[i].AccountCode + "</h5>" +
                                        "<p>" + data[i].Description + "</p>" +
                                    "</div>" +
                                    "<div class='floatright'>" +
                                        //"<a class='ui-btn ui-shadow ui-corner-all ui-icon ui-icon-star ui-btn-icon-notext' onclick='myFavouritesFunctions.onClick(event)'></a>" +
                                    "</div>" +
                                    //"<div style='clear:both;'></div>" +
                                "</a>" +
                            "</li>";
                        appendHTML += li;
                    };

                    if ($("#flipswitch").val() == "all") {
                        // Check to see if the flipswitch is in the right position when the async is done. People might be flipping the switch really fast.
                        // If the flipswitch is in the right place, append the HTML, otherwise, don't do anything.
                        $("#myFavouritesList").empty();
                        $("#myFavouritesList").append(appendHTML).listview("refresh");
                        mainFunctions.toggleShowAllInactive(); // Hide all inactive accounts
                        // Do another AJAX call to get the favourite codes to highlight those that are already favourited
                        var getFavAPI = SERVER_URL + "/api/accountcode/myfavouritecode";
                        var userID = localStorage.getItem("UserID");

                        $.ajax({
                            url: getFavAPI,
                            type: "POST",
                            crossDomain: true,
                            async: true,
                            contentType: "application/json",
                            dataType: "json",
                            data: JSON.stringify({
                                "UserDetailID": userID
                            }),
                            success: function (data) {
                                for (var i = 0; i < data.length; i++) {
                                    $("#" + data[i].AccountCode).addClass("ui-icon-favstar-hl");
                                }
                                $("#myFavouritesList").show();
                            }
                        });
                    }
                }
            });
        },
        generateListView: function () {
            var getFavAPI = SERVER_URL + "/api/accountcode/myfavouritecode";
            var userID = localStorage.getItem("UserID");

            $.ajax({
                url: getFavAPI,
                type: "POST",
                crossDomain: true,
                async: true,
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify({
                    "UserDetailID": userID
                }),
                success: function (data) {
                    var appendHTML = "";
                    for (var i = 0; i < data.length; i++) {
                        var activeOrInactive = function () {
                            var string = "";
                            if (data[i].ActiveFlag == 0) {
                                string = "Inactive";
                            }
                            return string;
                        }();
                        var li =
                            "<li id='li_" + data[i].AccountCode + "' data-icon='favstar'>" +
                                "<a id='" + data[i].AccountCode + "' onclick='myFavouritesFunctions.onClick(event)'>" +
                                    "<div class='floatleft'>" +
                                        "<h5>" + data[i].AccountCode + "</h5>" +
                                        "<p>" + data[i].Description + "</p>" +
                                    "</div>" +
                                    "<div class='floatright'>" +
                                        //"<a class='ui-btn ui-shadow ui-corner-all ui-icon ui-icon-star ui-btn-icon-notext' onclick='myFavouritesFunctions.onClick(event)'></a>" +
                                    "</div>" +
                                "</a>" +
                            "</li>";
                        appendHTML += li;
                    };
                    if ($("#flipswitch").val() == "favourite") {
                        $("#myFavouritesList").empty();
                        $("#myFavouritesList").append(appendHTML).listview("refresh");
                        mainFunctions.toggleShowAllInactive();
                        $("#myFavouritesList li a").addClass("ui-icon-favstar-hl");
                        if ($("ul li").length < 1) {
                            $("ul").append("<li class='nofavourites'>You have no favourites.</li>");
                            $("ul").listview("refresh");
                        }
                    }
                    //$("ul").listview("refresh");
                    //$("#myFavouritesAddList").listview("refresh");
                    //$("#myFavouritesAddList input[type='checkbox']").checkboxradio();
                    //$("#myFavouritesAddList label:not(:empty)").addClass("notopbottompadding");
                }
            });
        }
    };


// REUSABLE CODE
//$("#popupAddFav").popup({
//    afteropen: function () {
//        myFavouritesFunctions.generateAddListView();
//        // $("#popupAddFav a").on("click", myFavouritesFunctions.onClick(event));
//    }
//});
//$("#popupAddFav").popup({ afterclose: function () { myFavouritesFunctions.generateListView(); } });

