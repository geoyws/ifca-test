function addMore(page, pageIndex,pageSize) {
    masterAccountCodeFunctions.AppendListView(page, pageSize, pageIndex);
}



var masterAccountCodeFunctions =
    {
        deleteAccountCodes: function () {
            var apiURL = SERVER_URL + "/api/accountcode/delete/"; // needs to be changed after Carso allows for DELETE on the server
            var checked = $("li input:checkbox:checked");
            for (var i = 0; i < checked.length; i++) {
                var accountCode = checked[i].id.split("-")[1];
                $.ajax({
                    url: apiURL + accountCode,
                    type: "POST", // needs to be changed after Carso allows for DELETE on the server
                    crossDomain: true,
                    async: false,
                    success: function () {
                        setTimeout(function () { $("#popup_sucessfullyDeleteAccountCode").popup("open"); }, 1000);
                        masterAccountCodeFunctions.generateListView();
                    }
                });
            };
        },
        generateListView: function (pageSize, pageIndex) {
            $("#master-accountcode-listview").empty(); // in case users click on something while the async ajax is still running, we remove everything from the listview upon initialization
            var apiURL = SERVER_URL + "/api/accountcode/" + pageSize + "/" + pageIndex;

            $.get(apiURL).done(function (accountcodelist) {
                populateListViewPaginated(accountcodelist, pageSize, pageIndex);
            });
        },

        AppendListView: function (page, pageSize, pageIndex) {
            var apiURL = SERVER_URL + "/api/accountcode/"+ pageSize + "/" + pageIndex;

            $.get(apiURL).done(function (accountcodelist) {
                populateListViewPaginated(accountcodelist, pageSize, pageIndex,page);
            });
        }

    };

//accountcodelist.length
function populateListViewPaginated(accountcodelist,pageSize, pageIndex,page) {
    var appendHTML = "";
    for (var i = 0; i < pageSize; i++) {
        var activeOrInactive = function () {
            var string = "";
            if (accountcodelist[i].ActiveFlag == 0) {
                string = "&nbsp;&nbsp;- Inactive";
            }
            return string;
        }();
        var li =
            "<li data-icon='false'>" +
                "<a class='ifca-data-list-anchor' href='master-accountcode-edit.html?id=" + accountcodelist[i].AccountCode + "' id='" + accountcodelist[i].AccountCode + "'>" +
                    "<div class='floatleft'>" +
                         "<h5>" + accountcodelist[i].AccountCode + "<div class='floatright'><label style='color: grey;'>" + activeOrInactive + "</label></div></h5>" +
                          "<p>" + accountcodelist[i].Description + "</p>" +
                    "</div>" +
                    "<div class='data-floatright'>" +
                        "<label data-iconpos='right'><input type='checkbox' id='checkbox-" + accountcodelist[i].AccountCode + "' /></label>" +
                    "</div>" +
                "</a>" +
            "</li>";
        appendHTML += li;

    };
   

    if (page != null) {
        $("#master-accountcode-listview", page).append(appendHTML).listview("refresh");
    } else {
        $("#master-accountcode-listview").empty();
        $("#master-accountcode-listview").html(appendHTML).listview("refresh");
    }

    $("input[type='checkbox']").checkboxradio();
    mainFunctions.toggleShowAllInactive();
}




$(document).one('pagecreate', '#master-accountcode', function () {
    
    var pageSize = 20;
    var pageIndex = 1;

    $(document).on("scrollstop", function (e) {
       
        var activePage = $.mobile.pageContainer.pagecontainer("getActivePage"),
            screenHeight = $.mobile.getScreenHeight(),
            contentHeight = $(".contenttab", activePage).outerHeight(),
            header = $(".ui-header", activePage).outerHeight() - 1,
            scrolled = $(window).scrollTop(),
            footer = $(".ui-footer", activePage).outerHeight() - 1,
            scrollEnd = contentHeight - screenHeight + header + footer;

        if (activePage[0].id == "master-accountcode" && scrolled >= scrollEnd) {

            addMore(activePage, pageIndex++, pageSize);
        }
    });


    mainFunctions.addShowAllCheckbox();
    masterAccountCodeFunctions.generateListView(pageSize, 0);
    $(document).off('click', '#closeErrMsg').on('click', '#closeErrMsg', function (e) {
        $("#popup_ErrMsg").popup("close");
    });
    $(document).off('click', '#AccountCodeSuccessOK').on('click', '#AccountCodeSuccessOK', function (e) {

        $.mobile.changePage("master-accountcode.html", {
            transition: "none",
            reverse: false,
            changeHash: true
        });
    });
});
