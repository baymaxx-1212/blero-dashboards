//From base_dbplugin.html

$('[data-toggle=offcanvas]').click(function () {
    var x = document.getElementById("dash_sidebar").style.width;
    var side_open = 40;
    var side_close = 3.5;
    if (x == side_open + "%") {
        //If bar is closed expand and initialize
        $('#dash_sidebar').css("width", side_close + "%");
        $('#main_body').css("margin-left", side_close + "%");
        $('#db_sidebar_container').css("display", "none")
    } else {
        // if bar is not closed then close it
        $('#dash_sidebar').css("width", side_open + "%");
        $('#main_body').css("margin-left", side_open + "%");
        $('#db_sidebar_container').css("display", "block")
    }
});


function ShowTable(element) {
    //clear all Tables
    var databases = document.querySelectorAll('[id^="table-content-"]');
    [].forEach.call(databases, function (div) {
        div.style.height = "0px";
        div.style.width = "0px";
    });
    var databases = document.querySelectorAll('[id^="database-information-"]');
    [].forEach.call(databases, function (div) {
        div.style.display = "none";
    });
    var databases = document.querySelectorAll('[id^="table-holder-"]');
    [].forEach.call(databases, function (div) {
        console.log(div)
    });
    $("#"+element).css("width", "800px");
    $("#"+element).css("height", "800px");
    var plugin_id = element.replace('table-content-', '');
    $("#database-information-"+plugin_id).css("display", "block");
    $("#table-holder-"+plugin_id).css("display", "inline");
    $("#table-holder-" + plugin_id).closest(".individual_db").css("visibility", "inherit");
};


// Scripts linked to db_addon
function convertHex(hex) {
    hex = hex.replace('#', '');
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
    //Look for spaces !!!!
    result = 'rgb(' + r + ', ' + g + ', ' + b + ')';
    return result;
};

var selection_color_data1 = '#9fd9ea';
var selection_color_data2 = '#e8e07d';
var selection_color_data1rbg = convertHex(selection_color_data1);
var selection_color_data2rbg = convertHex(selection_color_data2);

var checked_dataframe2 = {}; //new code

$(document).ready(function () {
    $(document).ready(function () {
        $('#save_calculate').val(1)
        $('.display.compact.data-table-display.dataTable.no-footer').css('width', '735px');
        $('.dataTables_scrollHead .dataTables_scrollHeadInner').css('width', '735px');
    });


    //----------------------------------Database Add_on Initialize-----------------------------
    //Initialize Database Tables
    var databases_tables = document.querySelectorAll('[id^="database-pluginid"]');

    [].forEach.call(databases_tables, function (li) {
        // create data tables
        var plugin_id = li.textContent;
        var db_table_name = "db-data-table-" + plugin_id;
        var col_filter = document.getElementById("database-filtered-column-" + plugin_id).textContent;
        var total_columns = document.getElementById("database-total-columns-" + plugin_id).textContent;

        var replace_col = col_filter.replace("[", "");
        replace_col = replace_col.replace("]", "");
        console.log(replace_col);
        datatable_filter(db_table_name, replace_col, total_columns);


    });

    // Assign click functions to rows in data tables
    function ColorSelection(e) {
        //dont enter when the table is handsontable
        if ($(this).closest('table').hasClass('htCore')) {
            console.log('handsontable');
        } else {
            console.log("Asd")
            if ($(this).closest('tr').attr('class') != 'group') {
                if ($(this).css('background-color') != selection_color_data1rbg) {
                    if ($(this).css('background-color') == selection_color_data2rbg) {
                        var index = checked_dataframe2.map(function (o) {
                            return o.id;
                        }).indexOf($(this).attr('id'));
                        if (checked_dataframe2.hasOwnProperty(index)) checked_dataframe2[index].checked = false;
                    }
                    $(this).css('background-color', selection_color_data1);

                } else {
                    $(this).css('background-color', '#ffffff');
                }
            }
            var tableId = $(this).closest('table').attr('id');
            var tableHeader = tableId.replace('db-data-table', 'datatable-header');
            var leftSelection = $('#' + tableHeader).find('ul.left-selection')[0];
            $(leftSelection).html('');
            $('#' + tableId).find('tr').not('.group').each(function (index) {
                if ($(this).css('background-color') == selection_color_data1rbg) {
                    console.log($(this).find('td').eq(0).text());
                    $(leftSelection).append('<li>' + $(this).find('td').eq(0).text() + '</li>');
                }
            });

        }
    }
    function ContextmenuSelection(e) {
        $(this).siblings('.selection_color_data2rbg').removeClass('selection_color_data2rbg')
        $(this).not('.selection_color_data2rbg').addClass('selection_color_data2rbg');
    }

    // Add row to left column
    function AddToLeftColumn(e) {
        var plugin_id = $(this).closest('table').attr("id").replace('db-data-table-', '');
        if (!$(this).hasClass("active")) {
            var column = $("#datatable-header-"+plugin_id+" #leftColumn");
            var this_id = $(this).attr("id");
            var this_value = $(this).find(".sorting_1").html();
            var res = "<tr id='selected-"+this_id+"'> <td>" + this_value + "</td> <td style='text-align: center;'><span class='removeTr' data-id=" + this_id + ">X</span></td> </tr> ";
            column.append(res);
            $(this).css('background-color', selection_color_data1);
            $(this).addClass("active");
        }
        else {
            var this_id = $(this).attr("id");
            $("#db-data-table-"+plugin_id+" tbody #" + this_id + "").removeClass('active').removeAttr("style");
            $("#datatable-header-"+plugin_id+" tr#selected-"+this_id).remove();
        }
    }
    // Add row to right column
    function AddToRightColumn(e) {
        var plugin_id = $(this).closest('table').attr("id").replace('db-data-table-', '');
        if (!$(this).hasClass("active")) {
            var column = $("#datatable-header-"+plugin_id+" #rightColumn");
            var this_id = $(this).attr("id");
            var this_value = $(this).find(".sorting_1").html();
            var res = "<tr id='selected-"+this_id+"'> <td>" + this_value + "</td> <td style='text-align: center;'><span class='removeTr' data-id=" + this_id + ">X</span></td> </tr> ";
            column.append(res);
            $(this).css('background-color', selection_color_data2rbg);
            $(this).addClass("active");
        }
        else {
            var this_id = $(this).attr("id");
            $("#db-data-table-"+plugin_id+" tbody #" + this_id + "").removeClass('active').removeAttr("style");
            $("#datatable-header-"+plugin_id+" tr#selected-"+this_id).remove();
        }
        return false;
    }

    $(".ShowTable").on('click', function (e) {
        ShowTable($(this).data("id"));
        console.log();
    });
    //Check left/right click by table
    $("tbody tr").each(function (index) {
        $(this).on("click", AddToLeftColumn);
        $(this).on("contextmenu", AddToRightColumn)
    });

    //Add class `active` to selected rows
    $("body").on("click", '.removeTr', function () {
        var this_id = $(this).data('id');
        var plugin_id = $(this).closest('.mainTable').attr("id").replace('datatable-header-', '');
        $("#db-data-table-"+plugin_id+" tbody #" + this_id + "").removeClass('active').removeAttr("style");
        $(this).closest('tr').remove();
    });

    // Assing Classes to Rows for context menu and create checked_data
    var counter_db = 0;
    $("table[id^='db-data-table']").each(function (index) {
        $(this).find("tr").each(function (index) {
            $(this).addClass('context-frames ' + 'database_' + counter_db)
        });
        checked_dataframe2[counter_db] = [];
        counter_db = counter_db + 1;

    });
});

function selectAll(tableId) {
    var tableHeader = tableId.replace('db-data-table', 'datatable-header');
    var btnSelAll = $('#' + tableHeader).find('.btn-select-all');
    var leftSelection = $('#' + tableHeader).find('ul.left-selection')[0];
    var color;
    $(leftSelection).html('');
    if ($(btnSelAll).text() == 'Select All') {
        color = selection_color_data1rbg;
        $(btnSelAll).text('Deselect All');
    } else {
        $(btnSelAll).text('Select All')
        color = '#fff'
    }


    $('#' + tableId).find('tr').not('.group').each(function (index) {
        if ($(this).css('background-color') != selection_color_data2rbg) {
            $(this).css('background-color', color);
        }
        if (color == selection_color_data1rbg) {
            $(leftSelection).append('<li>' + $(this).find('td').eq(0).text() + '</li>');
        }
    });
}

//Initialize with filtering of Data Tables
function datatable_filter(db_table_name, filter_row, data_cols) {

    var table_name = '#' + db_table_name
    console.log(table_name)

    if (!filter_row) {
        console.log("no columen to filter")
        var table = $(table_name).DataTable(
            {

                "fixedHeader": true,
                "scrollY": "400px",
                "scrollX": true,
                "bInfo": false,
                "bLengthChange": false,
                "bPaginate": false,
                "sDom": 'l<"H"Rf>t<"F"ip>',
                "drawCallback": function (settings) {
                    var api = this.api();
                    var rows = api.rows({page: 'current'}).nodes();

                    var last = null;
                    var groupadmin = [];
                    console.log("ENTERED");


                    for (var k = 0; k < groupadmin.length; k++) {
                        // Code added for adding class to sibling elements as "group_<id>"
                        $("#" + groupadmin[k]).nextUntil("#" + groupadmin[k + 1]).addClass(' group_' + groupadmin[k]).addClass('td_row');
                        // Code added for adding Toggle functionality for each group
                        $("#" + groupadmin[k]).click(function () {
                            var gid = $(this).attr("id");
                            $(".group_" + gid).slideToggle(300);
                        });

                    }
                },
            }
        );


    } else {
        var table = $(table_name).DataTable(
            {

                "fixedHeader": true,
                "scrollY": "400px",
                "scrollX": true,

                "aaSorting": [[filter_row, 'asc']],

                "columnDefs": [
                    {"visible": false, "targets": filter_row}
                ],

                "bInfo": false,
                "bLengthChange": false,
                "bPaginate": false,
                "sDom": 'l<"H"Rf>t<"F"ip>',
                "drawCallback": function (settings) {
                    var api = this.api();
                    var rows = api.rows({page: 'current'}).nodes();

                    var last = null;
                    var groupadmin = [];
                    console.log("ENTERED")

                    api.column(filter_row, {page: 'current'}).data().each(function (group, i) {

                        if (last !== group) {

                            $(rows).eq(i).before(
                                '<tr class="group" id="' + i + '"><td colspan="' + data_cols + '">' + group + '</td></tr>'
                            );
                            groupadmin.push(i);
                            last = group;
                        }
                    });


                    for (var k = 0; k < groupadmin.length; k++) {
                        // Code added for adding class to sibling elements as "group_<id>"
                        $("#" + groupadmin[k]).nextUntil("#" + groupadmin[k + 1]).addClass(' group_' + groupadmin[k]).addClass('td_row');
                        // Code added for adding Toggle functionality for each group
                        $("#" + groupadmin[k]).click(function () {
                            var gid = $(this).attr("id");
                            $(".group_" + gid).slideToggle(300);
                        });

                    }
                },
            }
        );
    }


}




