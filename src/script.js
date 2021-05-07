var today = new Date();
$(document).ready(function () {

    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }
    today = dd + '-' + mm + '-' + yyyy;
});

function toggleFilter() {
    var filterType = document.querySelector("#filterType").checked;
    if (filterType == true || filterType == "true") {
        $("#s2id_states").show()
        $("#pinCode").hide()
    } else {
        $("#pinCode").show()
        $("#s2id_states").hide()
    }
}

function toggleAge() {
    var ageFilterType = document.querySelector("#ageFilter").checked;

    if (ageFilterType == true || ageFilterType == "true") {
        $("#eighteenTableDiv").show()
        $("#fortyFiveTableDiv").hide()
    } else {
        $("#eighteenTableDiv").hide()
        $("#fortyFiveTableDiv").show()

    }
}

function getSlots() {
    var pinCode = $("#pinCode").val()
    var district = $("#states").val()
    var filterType = document.querySelector("#filterType").checked;
    var url = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=" + pinCode + "&date=" + today

    if (filterType == true || filterType == "true") {
        url = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=" + district + "&date=" + today
    }
    if (pinCode == null || pinCode == "" && district == null || district == "") {
        alert("Please select district or enter pin");
        return false
    }
    $.ajax({
        url: url,
        type: "GET",
        success: function (result) {
            var eighteenTable = $('#eighteenTable').DataTable();
            var fortyFiveTable = $('#fortyFiveTable').DataTable();
            eighteenTable.clear()
            eighteenTable.draw();
            fortyFiveTable.clear()
            fortyFiveTable.draw();

            if (result != null) {
                var data = result.centers
                if (data.length > 0) {
                    var eighteen = []
                    var fortyFive = []
                    for (var i = 0; i < data.length; i++) {
                        if (data[i] != null && (data[i].sessions != null || data[i].sessions.length == 0)) {
                            var ses = JSON.parse(JSON.stringify(data[i].sessions))
                            if (ses != null && ses.length > 0) {
                                for (var s = 0; s < ses.length; s++) {
                                    if (ses[s].available_capacity != 0) {
                                        if (ses[s].min_age_limit == "45" || ses[s].min_age_limit == 45) {
                                            console.log(ses[s].min_age_limit)
                                            fortyFive.push([
                                                data[i].center_id + " [" + data[i].fee_type + "]",
                                                data[i].name + " (" + data[i].block_name + ")",
                        data[i].pincode,
                                                ses[s].date,
                                                ses[s].slots,
                                                ses[s].min_age_limit,
                                                ses[s].available_capacity,
                                            ])
                                        } else {
                                            eighteen.push([
                                                data[i].center_id + " [" + data[i].fee_type + "]",
                                                data[i].name + " (" + data[i].block_name + ")",
                        data[i].pincode,
                                                ses[s].date,
                                                ses[s].slots,
                                                ses[s].min_age_limit,
                                                ses[s].available_capacity,
                                            ])
                                        }

                                    }
                                }
                            }
                        }
                    }
                    eighteenTable.rows.add(eighteen).draw(false);
                    eighteenTable.columns.adjust().draw();

                    fortyFiveTable.rows.add(fortyFive).draw(false);
                    fortyFiveTable.columns.adjust().draw();
                }

            }
        },
        error: function (error) {
            console.log(error);
        }
    });
}

$("#states").select2({
    placeholder: "Select a State",
    allowClear: true,
    closeOnSelect: false
});
$(document).ready(function () {
    $('#eighteenTable').DataTable({
        "autoWidth": true
    });

    $('#fortyFiveTable').DataTable({
        "autoWidth": true
    });
    getSlots()
});