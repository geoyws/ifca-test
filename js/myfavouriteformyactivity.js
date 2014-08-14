$(document).one("pagecontainerbeforeshow", function () {
    $("#hrefAccountCode").text(localStorage.accountCode);
    myFavouritesFunctions.generateListView();
    myFavouritesFunctions.addFlipSwitch();
    myFavouritesFunctions.flipSwitch();
});


var myFavouritesFunctions =
    {
        flipSwitch: function () {
            if ($("#flipswitch1").val() == "favourite") {
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
                        "<select data-role='flipswitch' id='flipswitch1' onchange='myFavouritesFunctions.flipSwitch()'>" +
                            "<option value='favourite'>Favourite</option>" +
                            "<option value='all'>All</option>" +
                        "</select>" +
                    "</div>" +
                "</div>"
                );
            $("ul.ui-listview").addClass("clearboth");
            $("select#flipswitch1").flipswitch();
        },
        selectFavourites: function (id) {
            $("#hrefAccountCode").text(id);
            $("#accCodePopup").popup("close");
        },
        addOrRemoveFavourites: function (event) {
            //alert(event.target.id);
            var id = event.target.id;
            $("#" + id).toggleClass("ui-btn-active");
            //alert(id);
            //alert($("#" + id).hasClass("ui-btn-active"));

            
               
           

            if ($("#" + id).hasClass("ui-btn-active")) {
                // do API to add to favourites
                var addFavAPI = "http://175.139.183.94:76/TimeReportingApi/api/accountcode/addmyfavouritecode"; // needs to be changed after Carso allows for DELETE on the server
                var userID = localStorage.getItem("UserID");

                $.ajax({
                    url: addFavAPI,
                    type: "POST", // needs to be changed after Carso allows for DELETE on the server
                    crossDomain: true,
                    async: false,
                    statusCode: {
                        404: function () {
                            alert("Server not found.");
                        }
                    },
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
                        $(this).removeClass("ui-btn-active");
                    }
                });
            } else {
                // do API to remove from favourites
                var delFavAPI = "http://175.139.183.94:76/TimeReportingApi/api/accountcode/deletemyfavouritecode/"; // needs to be changed after Carso allows for DELETE on the server
                var userID = localStorage.getItem("UserID");

                $.ajax({
                    url: delFavAPI,
                    type: "POST", // needs to be changed after Carso allows for DELETE on the server
                    crossDomain: true,
                    async: false,
                    statusCode: {
                        404: function () {
                            alert("Server not found.");
                        }
                    },
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
                        $(this).addClass("ui-btn-active");
                    }
                });
            }
            
        },
        generateAddListView: function () {
            var getAccountCodeAPI = "http://175.139.183.94:76/TimeReportingApi/api/accountcode";

            $.ajax({
                url: getAccountCodeAPI,
                type: "GET",
                crossDomain: true,
                async: true,
                statusCode: {
                    404: function () {
                        alert("Server not found.");
                    }
                },
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
                            "<li data-icon='star'>" +
                                "<a id='" + data[i].AccountCode + "' onclick='myFavouritesFunctions.addOrRemoveFavourites(event)'>" +
                                    "<div class='floatleft'>" +
                                        "<span>" + data[i].AccountCode + "</span><br />" +
                                        "<span>" + data[i].Description + "</span>" +
                                    "</div>" +
                                    "<div class='floatright'>" +
                                        //"<a class='ui-btn ui-shadow ui-corner-all ui-icon ui-icon-star ui-btn-icon-notext' onclick='myFavouritesFunctions.addOrRemoveFavourites(event)'></a>" +
                                    "</div>" +
                                    //"<div style='clear:both;'></div>" +
                                "</a>" +
                            "</li>";
                        appendHTML += li;
                    };

                    // Check to see if the flipswitch is in the right position when the async is done
                    if ($("#flipswitch1").val() == "all") {
                        $("#myFavouritesList").empty(); // hide it first, we will wait until the 2nd async is done before .show()-ing it again. This way, users will not feel like the app is jittery.
                        $("#myFavouritesList").append(appendHTML).listview("refresh");
                        $("#myFavouritesList").css("height", "20em");
                        $("#myFavouritesList").css("overflow", "scroll");
                        $("#myFavouritesList").css("overflow-x", "hidden");
                        mainFunctions.toggleShowAllInactive();
                        // Do another AJAX call to get the favourite codes to highlight those that are already favourited
                        var getFavAPI = "http://175.139.183.94:76/TimeReportingApi/api/accountcode/myfavouritecode";
                        var userID = localStorage.getItem("UserID");

                        $.ajax({
                            url: getFavAPI,
                            type: "POST",
                            crossDomain: true,
                            async: true,
                            statusCode: {
                                404: function () {
                                    alert("Server not found.");
                                }
                            },
                            contentType: "application/json",
                            dataType: "json",
                            data: JSON.stringify({
                                "UserDetailID": userID
                            }),
                            success: function (data) {
                                for (var i = 0; i < data.length; i++) {
                                    $("#" + data[i].AccountCode).addClass("ui-btn-active");
                                   

                                  
                                }
                                $("#myFavouritesList").show();
                            }
                        });
                    }
                }
            });
        },
        generateListView: function () {
            var getFavAPI = "http://175.139.183.94:76/TimeReportingApi/api/accountcode/myfavouritecode";
            var userID = localStorage.getItem("UserID");

            $.ajax({
                url: getFavAPI,
                type: "POST",
                crossDomain: true,
                async: true,
                statusCode: {
                    404: function () {
                        alert("Server not found.");
                    }
                },
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify({
                    "UserDetailID": userID
                }),
                success: function (data) {
                    if (data.length == 0) {
                        var appendHTML = "";
                        var li =
                           "</br><li data-icon='false'>" +
                               "<a id='" + 'noAccountCode' + "'  style='border: none; background: none;'>" +
                                   "<div class='floatleft'>" +
                                       "<span>" + "You have no favourite account codes." + "</span></br>" +
                                   "</div>" +
                                   "<div class='floatright'>" +

                                   "</div>" +
                               "</a>" +
                           "</li></br>";
                        appendHTML += li;
                    }
                    else {
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
                                "<li data-icon='star'>" +
                                    "<a id='" + data[i].AccountCode + "' onclick='myFavouritesFunctions.selectFavourites(this.id)'>" +
                                        "<div class='floatleft'>" +
                                            "<span>" + data[i].AccountCode + "</span><br />" +
                                            "<span>" + data[i].Description + "</span>" +
                                        "</div>" +
                                        "<div class='floatright'>" +
                                            //"<a class='ui-btn ui-shadow ui-corner-all ui-icon ui-icon-star ui-btn-icon-notext' onclick='myFavouritesFunctions.addOrRemoveFavourites(event)'></a>" +
                                        "</div>" +
                                    "</a>" +
                                "</li>";
                            appendHTML += li;
                        };
                    }
                    if ($("#flipswitch1").val() == "favourite") {
                        $("#myFavouritesList").empty();
                        $("#myFavouritesList").append(appendHTML).listview("refresh");
                        mainFunctions.toggleShowAllInactive();
                        if (data.length != 0) {
                            $("#myFavouritesList").css("height", "20em");
                            $("#myFavouritesList").css("overflow", "scroll");
                            $("#myFavouritesList").css("overflow-x", "hidden");
                            $("#myFavouritesList li a").addClass("ui-btn-active");
                            
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
//        // $("#popupAddFav a").on("click", myFavouritesFunctions.addOrRemoveFavourites(event));
//    }
//});
//$("#popupAddFav").popup({ afterclose: function () { myFavouritesFunctions.generateListView(); } });

