$(document).one("pagecontainerbeforeshow", function () {
    mainFunctions.addShowAllCheckbox();
    masterActivityFunctions.generateListView();
});

var masterActivityFunctions =
    {
        deleteActivities: function () {
            var apiURL = SERVER_URL + "/api/activity/delete/"; // needs to be changed after Carso allows for DELETE on the server
            var checked = $("input:checkbox:checked");
            for (var i = 0; i < checked.length; i++) {
                var activityCode = checked[i].id.split("-")[1];
                $.ajax({
                    url: apiURL + activityCode,
                    type: "POST", // needs to be changed after Carso allows for DELETE on the server
                    crossDomain: true,
                    async: false,
                    success: function () {
                        setTimeout(function () { $("#popup_sucessfullyDeleteActivity").popup("open"); }, 1000);
                        masterActivityFunctions.generateListView();

                       // masterActivityFunctions.generateListView();
                    }
                    //complete: function () {

                    //    window.location.href = "master-activity.html";
                    //}
                });
            };
        },
        generateListView: function () {
            $("ul[data-role='listview']").empty(); // in case users click on something while the async ajax is still running, we remove everything from the listview upon initialization
            var apiURL = SERVER_URL + "/api/activity";

            $.ajax({
                url: apiURL,
                type: "GET",
                crossDomain: true,
                async: true,
                success: function (data) {
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
                                "<a class='ifca-data-list-anchor' href='master-activity-edit.html?activityid=" + data[i].ActivityCode + "' id='" + data[i].ActivityCode + "'>" +
                                    "<div class='floatleft'>" +
                                        "<h5>" + data[i].ActivityCode + "<div class='floatright'><label style='color: grey;'>" + activeOrInactive + "</label></div></h5>" +
                                        "<p>" + data[i].Description + "</p>" +
                                    "</div>" +
                                    "<div class='data-floatright'>" +
                                        "<label data-iconpos='right'><input type='checkbox' id='checkbox-" + data[i].ActivityCode + "' /></label>" +
                                    "</div>" +
                                "</a>" +
                            "</li>";
                        appendHTML += li;
                    };
                    $("ul[data-role='listview']").empty();
                    $("ul[data-role='listview']").append(appendHTML).listview("refresh");
                    $("input[type='checkbox']").checkboxradio();
                    mainFunctions.toggleShowAllInactive();
                    // data.empty(); // What is this?
                }
            });
        }
    };



$(document).one('pagecreate', '#master-activity', function () {
    $(document).off('click', '#closeErrMsg').on('click', '#closeErrMsg', function (e) {
        $("#popup_ErrMsg").popup("close");
    });
    $(document).off('click', '#ActivitySuccessOK').on('click', '#ActivitySuccessOK', function (e) {

        $.mobile.changePage("master-activity.html", {
            transition: "none",
            reverse: false,
            changeHash: true
        });
    });
});