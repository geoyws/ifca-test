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
            //$.mobile.navigate("#login");
            //$.mobile.changePage("login.html");
        });
        
    },
    populateModules: function () {
        var role = localStorage.getItem("role");
        //alert(role);

        var modules = {
            accountCode: "<a href='master-accountcode.html' class='ui-btn ui-corner-all ui-shadow'> <img src='images/icon/acc-code.png'></a><p>Account Code</p> ",
            user: "<a href='master-user.html' class='ui-btn ui-corner-all ui-shadow'><img src='images/icon/user.png'></a><p>User</p>",
            activity: "<a href='master-activity.html' class='ui-btn ui-corner-all ui-shadow'><img src='images/icon/activity.png'></a><p>Activity</p>",
            managerApproval: "<a href='managerapproval.html' class='ui-btn ui-corner-all ui-shadow'> <img src='images/icon/my-act-approval.png'></a> <p>Activity Approval</p>",
            myActivity: "<a href='myactivity.html' class='ui-btn ui-corner-all ui-shadow'> <img src='images/icon/my-act.png'></a><p>My Activity</p>",
            myProfile: "<a href='myprofile.html' class='ui-btn ui-corner-all ui-shadow'><img src='images/icon/my-profile.png'></a><p>My Profile</p>",
            myFavorite: "<a href='myfavourites.html' class='ui-btn ui-corner-all ui-shadow'><img src='images/icon/fav-code.png'></a><p>My Favourite Code</p>",
        };

        var appendHTML;

        switch (role) {
            case "admin":
                appendHTML =
                "<div class='ui-grid-c'><div class='ui-block-a'>" +
                    modules.accountCode +
                "</div>" +
                "<div class='ui-block-b'>" +
                    modules.user +
                "</div>" +
                "<div class='ui-block-c'>" +
                    modules.activity +
                "</div>" +
                "<div class='ui-block-d'>" +
                    modules.managerApproval +
                "</div></div>" +
                "<div class='ui-grid-c'><div class='ui-block-a'>" +
                    modules.myActivity +
                "</div>" +
                "<div class='ui-block-b'>" +
                    modules.myProfile +
                "</div>" +
                "<div class='ui-block-c'>" +
                    modules.myFavorite +
                "</div></div>";
                break;
            case "manager":
                appendHTML =
                "<div class='ui-grid-c'><div class='ui-block-a'>" +
                     modules.myActivity +
                "</div>" +
                "<div class='ui-block-b'>" +
                     modules.managerApproval +
                "</div>" +
                "<div class='ui-block-c'>" +
                     modules.myProfile +
                "</div>" +
                "<div class='ui-block-d'>" +
                     modules.myFavorite +
                "</div></div>";
                break;
            case "staff":
                appendHTML =
                "<div class='ui-grid-c'><div class='ui-block-a'>" +
                      modules.myActivity +
                "</div>" +
                "<div class='ui-block-b'>" +
                      modules.myProfile +
                "</div>" +
                "<div class='ui-block-c'>" +
                      modules.myFavorite +
                "</div></div>";
                break;
        };

        $("#modulesContainer").empty();
        $("#modulesContainer").append(appendHTML);
        //alert(appendHTML);
    }
};