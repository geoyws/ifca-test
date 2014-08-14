$(document).one("pagecontainerbeforeshow", function () {
    mainFunctions.addShowAllCheckbox();
    masterUserFunctions.generateListView();
});

var masterUserFunctions =
    {
        deleteUsers: function () {
            var checked = $("li input:checkbox:checked");
            for (var i = 0; i < checked.length; i++) {

                var userDetailID = checked[i].id.split("-")[1];

                $.ajax({

                    url: SERVER_URL + "/api/UserDetail/Delete/" + userDetailID,
                    type: "POST", // needs to be changed after Carso allows for DELETE on the server
                    //crossDomain: true,                
                    async: false,
                    // contentType: "application/json",
                    //dataType: "json",
                    //statusCode: {
                    //    404: function () {
                    //        alert("Server not found.");
                    //    }
                    //},
                    success: function (data) {
                        //var name = JSON.parse(data);
                        setTimeout(function () { $("#popup_sucessfullyDeleteUser").popup("open"); }, 1000);
                        masterUserFunctions.generateListView();
                        //$('#userListView').listview('refresh');

                    },
                    error: function (jqXHR, exception) {
                        if (jqXHR.status === 0) {
                            setTimeout(function () { $("#popup_ErrMsg").popup("open"); }, 1000); $("#ErroMessage").html('Not connect.\n Verify Network.');
                        } else if (jqXHR.status == 404) {
                            setTimeout(function () { $("#popup_ErrMsg").popup("open"); }, 1000); $("#ErroMessage").html('Requested page not found. [404]');
                        } else if (jqXHR.status == 401) {
                            setTimeout(function () { $("#popup_ErrMsg").popup("open"); }, 1000); $("#ErroMessage").html('401 Unauthorized');
                        } else if (jqXHR.status == 500) {
                            setTimeout(function () { $("#popup_ErrMsg").popup("open"); }, 1000); $("#ErroMessage").html('Internal Server Error [500].');
                        } else if (exception === 'parsererror') {
                            setTimeout(function () { $("#popup_ErrMsg").popup("open"); }, 1000); $("#ErroMessage").html('Requested JSON parse failed.');
                        } else if (exception === 'timeout') {
                            setTimeout(function () { $("#popup_ErrMsg").popup("open"); }, 1000); $("#ErroMessage").html('Time out error.');
                        } else if (exception === 'abort') {
                            setTimeout(function () { $("#popup_ErrMsg").popup("open"); }, 1000); $("#ErroMessage").html('Ajax request aborted.');
                        } else {
                            setTimeout(function () { $("#popup_ErrMsg").popup("open"); }, 1000); $("#ErroMessage").html(jqXHR.responseText);
                        }
                    }
                });
            };
        },
        generateListView: function () {
            $("ul[data-role='listview']").empty(); // in case users click on something while the async ajax is still running, we remove everything from the listview upon initialization
            //alert(SERVER_END_POINT_API + "/api/userdetail/AllStaffListing");
            $.ajax({
                url: SERVER_URL + "/api/userdetail/AllStaffListing",

                type: "GET",
                crossDomain: true,
                async: true,
                //statusCode: {
                //    404: function () {
                //        alert("Server not found.");
                //    }
                //},
                //contentType: "application/json",
                dataType: "json",
                success: function (data) {
                    //alert("yes");

                    var appendHTML = "";
                    for (var i = 0; i < data.length; i++) {
                        var activeOrInactive = function () {
                            var string = "";
                            if (data[i].ActiveFlag == 0) {
                                string = "&nbsp;&nbsp;- Inactive";
                            }
                            return string;
                        }();
                        var li =
                            "<li data-icon='false'>" +
                                "<a class='ifca-data-list-anchor' href='master-user-edit.html?userdetailid=" + data[i].UserDetailID + "' id='" + data[i].UserDetailID + "'>" +
                                    "<div class='floatleft'>" +
                                        "<h5>" +
                                            display_name_format(data[i].FirstName, data[i].LastName) +
                                            "<div class='floatright'>" +
                                                "<label style='color: grey;'>" + activeOrInactive + "</label>" +
                                            "</div>" +
                                         "</h5>" +
                                         "<p>" + data[i].Role + " - " + data[i].Email + "</p>" +
                                    "</div>" +
                                    "<div class='data-floatright'>" +
                                        "<label data-iconpos='right'><input type='checkbox' id='user-" + data[i].UserDetailID + "' /></label>" +
                                    "</div>" +
                                "</a>" +
                            "</li>";
                        appendHTML += li;
                    };
                    $("ul[data-role='listview']").empty();
                    $("ul[data-role='listview']").append(appendHTML).listview("refresh");
                    $("input[type='checkbox']").checkboxradio();
                    mainFunctions.toggleShowAllInactive();
                    //data.empty(); // What is this?
                },
                error: function (jqXHR, exception) {
                    if (jqXHR.status === 0) {
                        setTimeout(function () { $("#popup_ErrMsg").popup("open"); }, 1000); $("#ErroMessage").html('Not connect.\n Verify Network.');
                    } else if (jqXHR.status == 404) {
                        setTimeout(function () { $("#popup_ErrMsg").popup("open"); }, 1000); $("#ErroMessage").html('Requested page not found. [404]');
                    } else if (jqXHR.status == 401) {
                        setTimeout(function () { $("#popup_ErrMsg").popup("open"); }, 1000); $("#ErroMessage").html('401 Unauthorized');
                    } else if (jqXHR.status == 500) {
                        setTimeout(function () { $("#popup_ErrMsg").popup("open"); }, 1000); $("#ErroMessage").html('Internal Server Error [500].');
                    } else if (exception === 'parsererror') {
                        setTimeout(function () { $("#popup_ErrMsg").popup("open"); }, 1000); $("#ErroMessage").html('Requested JSON parse failed.');
                    } else if (exception === 'timeout') {
                        setTimeout(function () { $("#popup_ErrMsg").popup("open"); }, 1000); $("#ErroMessage").html('Time out error.');
                    } else if (exception === 'abort') {
                        setTimeout(function () { $("#popup_ErrMsg").popup("open"); }, 1000); $("#ErroMessage").html('Ajax request aborted.');
                    } else {
                        setTimeout(function () { $("#popup_ErrMsg").popup("open"); }, 1000); $("#ErroMessage").html(jqXHR.responseText);
                    }
                }
            });
        }
    };


$(document).one('pagecreate', '#master-user', function () {
    $(document).off('click', '#closeErrMsg').on('click', '#closeErrMsg', function (e) {
        $("#popup_ErrMsg").popup("close");
    });
    $(document).off('click', '#UserSuccessOK').on('click', '#UserSuccessOK', function (e) {

        $.mobile.changePage("master-user.html", {
            transition: "none",
            reverse: false,
            changeHash: true
        });
    });
});
