$(document).one("pagecontainerbeforeshow", function () {
    //managerApprovalFunctions.generateListView();
});

var managerApprovalFunctions =
    {
        generateListView: function () {
            $("ul[data-role='listview']").empty(); // in case users click on something while the async ajax is still running, we remove everything from the listview upon initialization
            var serverURL = "";

            $.ajax({
                beforeSend: function () { $("#master-accountcode div.ui-content").append("<img id='loader' src='css/images/ajax-loader.gif' />") },
                complete: function () { $("#loader").remove() },
                url: serverURL,
                type: "GET",
                crossDomain: true,
                async: true,
                success: function (data) {
                    var result = data;
                    var appendHTML = "";
                    for (var i = 0; i < result.length; i++) {
                        var activeOrInactive = function () {
                            var string = "";
                            if (result[i].ActiveFlag == 0) {
                                string = "Inactive";
                            }
                            return string;
                        }();
                        var li =
                            "<li data-icon='false'><span class='ritecheck'><input type='checkbox' ></span>" +
                                "<a href='master-accountcode-edit.html?accountcode=" + result[i].AccountCode + "&description=" + encodeURIComponent(result[i].Description) + "&activeflag=" + result[i].ActiveFlag + "'>" +
                                    "<h5>" + result[i].AccountCode + "</h5>" +
                                      "<p>" + result[i].Description + "</p>" +

                                "</a>" +
                            "</li>";
                        appendHTML += li;
                    };
                    $("ul[data-role='listview']").empty();
                    $("ul[data-role='listview']").append(appendHTML).listview("refresh");
                    $("input[type='checkbox']").checkboxradio();
                    mainFunctions.toggleShowAllInactive();
                }
            });
        }
    };


