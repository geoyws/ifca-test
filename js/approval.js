

$(document).one("pagecontainerbeforeshow", function () {

    var realurl = SERVER_URL + "/api/activity/SubordinateWithDetail";

    var cred = {
        "managerID": "5",
        "date": "2014-07-18 00:00:00.0000000"
    };
    
    $(".dwb dwb0 dwb-e").click(function(){

    }

    //callAjax(realurl, cred, "POST");
    //alert(realurl);


    /*
    var curr = new Date().getFullYear();
    var opt = {
        'date': {
            preset: 'date',
            //dateOrder: 'ddmmy',
            dateFormat: 'dd/mm/yy',
            invalid: { daysOfWeek: [0, 6], daysOfMonth: ['5/1', '12/24', '12/25'] }

        },
        'datetime': {
            preset: 'datetime',
            minDate: new Date(2012, 3, 10, 9, 22),
            maxDate: new Date(2014, 7, 30, 15, 44),
            stepMinute: 5
        },
        'time': {
            preset: 'time'
        },
        'credit': {
            preset: 'date',
            dateOrder: 'mmyy',
            dateFormat: 'mm/yy',
            startYear: curr,
            endYear: curr + 10,
            width: 100
        },
        'select': {
            preset: 'select'
        },
        'select-opt': {
            preset: 'select',
            group: true,
            width: 50
        }
    }

    $('.settings select').bind('change', function () {
        var demo = "date";

        if (!demo.match(/select/i)) {
            $('.demo-test-' + demo).val('');
        }

        $('.demo-test-' + demo).scroller('destroy').scroller($.extend(opt[demo], {
            theme: "wp light",
            mode: "scroller",
            lang: "",
            display: "modal",
            animate: "pop"
        }));
        $('.demo').hide();
        $('.demo-' + demo).show();
    });

    $('#demo').trigger('change');

    $("dwwc").append("Hello");
    */
});


function deleteMyActivity() {
    var apiURL = SERVER_URL + "/api/activity/deletemyactivitycode/";
    var checked = $("input:checkbox:checked");

    for (var i = 0; i < checked.length; i++) {
        var id = checked[i].name;
        alert(apiURL + id);
        $.ajax({
            beforeSend: function () {
            },
            complete: function () {
            },
            url: apiURL + id,
            type: "POST",
            async: false,
            statusCode: {
                404: function () {
                    alert("Server not found.");
                }
            },
            success: function () {
                var credurl = SERVER_URL + "/api/activity";
                callAjax(credurl, "", "GET");
            }
        });
    };
}

function callAjax(someurl, somedata, sometype) {
    var $Xhr = $.ajax({
        type: sometype,
        url: someurl,
        data: somedata,
        async: true,
        dataType: "json",
        success: function () { },
        error: function (xhr, ajaxOptions, thrownError) {

        },
        statusCode: {
            404: function () {
                alert("Server not found.");
            }
        },
        beforeSend: function () {
            $("#master-ActivityCode div.ui-content").append("<img id='loader' src='css/images/ajax-loader.gif' />")
        },
        complete: function () {
            $("#loader").remove()
        }
    });
    $Xhr.done(function renderData(data) {
        renderList(data);

    });
}


function renderList(data) {

    var lii = "";
    var lit = "";
    var changed = 0;
    

    lii +=
       "<div data-role='collapsible' data-collapsed='true'>" +
                   "<h3><span class='collaptitle'>" + display_name_format(data[0].FirstName, data[0].LastName) + "<br><i class='headcounts'>" + data[0].AccountCode + "</i></span><span class='collapfigure'>" + data[0].Hours + "</span></h3>" +
                       "<table  data-role='table' data-mode='columntoggle' class='ui-responsive ui-shadow collapstb'>" +
                        "<thead><tr>" +
                                "<th>Activity</th>" +
                                "<th class='toright'>Hour</th>" +
                                "<th class='toright'>Updated Hours</th>" +
                            "</tr></thead>" +
                            "<tbody>";
    alert("0");

    for (var i = 0; i < data.length; i++) {


        if (changed == 1) {
            lii += lit + "</tbody></table>" + "</div>" +
       "<div data-role='collapsible' data-collapsed='true'>" +
                   "<h3><span class='collaptitle'>" + display_name_format(data[i].FirstName, data[i].LastName) + "<br><i class='headcounts'>" + data[i].AccountCode + "</i></span><span class='collapfigure'>" + data[i].Hours + "</span></h3>" +
                       "<table  data-role='table' data-mode='columntoggle' class='ui-responsive ui-shadow collapstb'>" +
                        "<thead><tr>" +
                                "<th>Activity</th>" +
                                "<th class='toright'>Hour</th>" +
                                "<th class='toright'>Updated Hours</th>" +
                            "</tr></thead>" +
                            "<tbody>";
            //alert("1");
            changed = 0;
            lit = "";
        }

        //alert("2");
        var k = i + 1;
        if (k < data.length) {
            if (data[i].UserdetailID == data[k].UserdetailID)
                lit += "<tr><td>" + data[i].ActivityCode + "</td>" +
                           "<td class='toright'>" + data[i].Hours + "</td>" +
                           "<td class='toright'>" + data[i].ApprovedHours + "</td>" +
                       "</tr>";

            else {
                lit += "<tr><td>" + data[i].ActivityCode + "</td>" +
                           "<td class='toright'>" + data[i].Hours + "</td>" +
                           "<td class='toright'>" + data[i].ApprovedHours + "</td>" +
                       "</tr>";

                //alert("detect");
                changed = 1;
            }
        }
        else
            lit += "<tr><td>" + data[i].ActivityCode + "</td>" +
                           "<td class='toright'>" + data[i].Hours + "</td>" +
                           "<td class='toright'>" + data[i].ApprovedHours + "</td>" +
                       "</tr>";
    }
    lii += lit + "</tbody></table>" + "</div>";

    $("#contentDetail").append(lii).trigger("create");

}


function approveList() {

   
}








