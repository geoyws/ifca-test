$(document).one("pagecontainerbeforeshow", function () {
    indexFunctions.populateModules();

    $('a.dwb.dwb1.dwb-e.mbsc-ic.mbsc-ic-close').css({ "color": "white" });
});

var indexFunctions = {
    logout: function () {
        var confirmation = "Are you sure you want to log out?";
        $("#reusableDialog p.ui-title").text(confirmation);
        $("#reusableDialog").popup("reposition", "positionTo: window").popup("open");
        $("#reusableDialog a:contains(OK)").on("click", function (event) {
            event.preventDefault();
            $("#reusableDialog a:contains(OK)").unbind(); // to remove all listeners
            localStorage.clear();
            $.mobile.pageContainer.pagecontainer('change', 'login.html');
        });

    },
    populateModules: function () {
        var role = localStorage.getItem("role");
        var appendHTML;
        appendHTML = "<ul class='menuholder'>";
        appendHTML += MenuItem("My Activity", "myactivity.html", "images/icon/my-act.png");

        if (role == "manager" || role == "admin")
            appendHTML += MenuItem("Activity Approval", "managerapproval.html", "images/icon/my-act-approval.png");

        appendHTML += MenuItem("My Profile", "myprofile.html", "images/icon/my-profile.png");
        appendHTML += MenuItem("My Favourite Account", "myfavourites.html", "images/icon/fav-code.png");

        if (role == "admin") {
            appendHTML += MenuItem("Account Master", "master-accountcode.html", "images/icon/acc-code.png");
            appendHTML += MenuItem("Activity Master", "master-activity.html", "images/icon/activity.png");
            appendHTML += MenuItem("Manage Users", "master-user.html", "images/icon/user.png");
        }

        appendHTML += "</ul>";

        $("#modulesContainer").empty();
        $("#modulesContainer").append(appendHTML);
    }
};

function MenuItem(caption, href_url, icon_url) {
    return "<li class='menuicon'><a href='" + href_url + "'><img src='" + icon_url + "' class='menuicon'></a><p class='center'>" + caption + "</p></li>";
}