

//link to ajax functions from dashboards.



function convertHex(hex){
    hex = hex.replace('#','');
    r = parseInt(hex.substring(0,2), 16);
    g = parseInt(hex.substring(2,4), 16);
    b = parseInt(hex.substring(4,6), 16);
    //Look for spaces !!!!
    result = 'rgb('+r+', '+g+', '+b+')';
    return result;
}

var selection_color_data1='#9fd9ea';
var selection_color_data2='#e8e07d'
var selection_color_data1rbg=convertHex(selection_color_data1);
var selection_color_data2rbg=convertHex(selection_color_data2);



function submit_form(csrf_token, form, dataframe1, dataframe2) {
    var form_data = form.closest("form").serialize();


    for (var input in form.closest("form")[0]){

        try{
            input_name=form.closest("form")[0][input].name;
            if(input_name=='form_instance'){

                var form_instance=form.closest("form")[0][input].value
            }
                //Get child grid
                var hot_id=$('#form-child-container-'+form_instance).find("div[id^='hot']").attr('id');
                var grid_data= window[hot_id].getData();
                var grid_keys=window[hot_id].getRowHeader();
        }
        catch(err){
            console.log('No Grid ')
            var grid_data=[];
            var grid_keys=[];
        }

    }





//this function creates the ajax post  of the form addon


    $.ajax({
        type: "POST",
        url: "/en/dashboards/plugins/form-addon-client/",
        data: {
            csrfmiddlewaretoken: csrf_token,
            form: form_data,
            target: JSON.stringify(dataframe2), //new code
            regressors: JSON.stringify(dataframe1), //new code
            dashboard_name:JSON.stringify($("#dashboard_title_value").text()),
            dashboard_author:JSON.stringify($("#dashboard_author_value").text()),
            dashboard_id:JSON.stringify($("#dashboard_id_value").text()),
            grid_data:JSON.stringify(grid_data),
            grid_keys:JSON.stringify(grid_keys),

        },
        success: function (data) {

            try {
                var data_json = JSON.parse(data);

                // Return incase `exec_status` is ERROR
                if(!('exec_status' in data_json) || (data_json['exec_status'] == 'error')) {
                    console.log("exec_status ERROR!");
                    return;
                }

                var progress_bar_options={progressBarId:'progress-bar-'+data_json["form_instance"],
                                          progressBarMessageId:'progress-bar-message-'+ data_json["form_instance"] ,
                                          progressBarMessageIdAjax:'progress-bar-message-ajax-'+ data_json["form_instance"]
                };


                // Initialize celery progress bar
                var progressUrl = "/en/dashboards/plugins/celery-progress/" + data_json['exec_id'];

                $(function () {
                    CeleryProgressBar.initProgressBar(progressUrl,progress_bar_options)
                });



                // window[data_json['ajax_function']](data);
                // write_to_progressbar(data_json["form_instance"],"Function Executed succesfully")

            }
            catch(err){
                console.log("error")
                console.log(err.message)

            }


        },
        error: function (x, t, m) {
            console.log("error on AJAX");
            console.log(form_data);
            console.log(x);
            console.log(t)
            alert(m);





        }
    });
}



// Controlling functions for submit of the form Addon.

    $('.show_model').click(function () {

        $('#save_calculate').val(1);
    });
    $('#calculate').click(function () {
        $('#save_calculate').val(0);
    });


    $('.submit_form_addon').on('click', '.submit_form', function () {
        $('input[type="search"]').val('').keyup();
        var dataframe1 = {};
        var dataframe2 = {};



        // look for all Database tables and get what it is selected on each one


        var counter_db=0;
        $( "table[id^='db-data-table']" ).each(function(index) {

            // Get DataFrame 1 Values
            dataframe1[counter_db]=[];
            dataframe2[counter_db]=[];
            $(this).find("tr").each(function(index){
                if($(this).css('background-color') === selection_color_data1rbg){
                //dataframe1[counter_db].push($(this).attr('id'));
                dataframe1[counter_db].push($(this).children()[0].textContent);
                }
            });


            $(this).find("tr").each(function(index){
            if($(this).css('background-color') === selection_color_data2rbg){

            dataframe2[counter_db].push($(this).children()[0].textContent);
            }
            });







            counter_db=counter_db+1;
        });




        console.log(dataframe1);
        console.log(dataframe2);

        ;






        submit_form(token, $(this), dataframe1, dataframe2);
    });



