
var grid_size = 10;

//-------------------------------------------Reshaping addons-----------------------------------------------------

function intialize_plugins(){


      $(document).tooltip();
      $(".resizable-draggable").draggable().resizable();


      $(".form-element-label").on('resize', function (event, ui) {
        $(this).css('width', ui.size.width + 'px');
        $(this).css('height', ui.size.height + 'px');
      });

      $(".form-element-container").draggable({
          start: function (event, ui) {
              $(this).data('preventBehaviour', true);
          }
      });

      $(".form-element-container input").on('mousedown', function (e) {
          var mdown = new MouseEvent("mousedown", {
              screenX: e.screenX,
              screenY: e.screenY,
              clientX: e.clientX,
              clientY: e.clientY,
              view: window
          });
          $(this).closest('.form-element-container')[0].dispatchEvent(mdown);
      }).on('click', function (e) {
          var $draggable = $(this).closest('.form-element-container');
          if ($draggable.data("preventBehaviour")) {
              e.preventDefault();
              $draggable.data("preventBehaviour", false)
          }
      });
      $(".form-element-container").resizable({
        create: function (event, ui) {
          var width = $(this).attr('data-width');
          if (width) {
            $(this).find('.ui-wrapper').css('width',width);
            $(this).find('.ui-wrapper input').css('width', width);
            $(this).find('.ui-wrapper input').css('height', $(this).css('height'));
          }
        },
        resize: function (event, ui) {
          $(this).find('.form-element').css('height', $(this).css('height'))
          $(this).css('flex-basis', 'auto');
        }
      });
      $(".form-element").each(function (index) {
        $(this).css('height', $(this).closest('.form-element-container').css('height'));
      })



    $('div[id^="blc-"]').resizable({
        handles: 'e, w'
    });


    $('.edit-mode-visible').hide();



}
$('#save_view').click(function () {



    classList= $('.resizable-draggable');
    $.each(classList, function(index, item) {
        var app_label=$(this).attr('app_label');
        var model_name=$(this).attr('model_name');

        var position_model=$(this).attr('position_model');



        SavePlugin($(this),model_name,app_label,position_model)

    });



})

function SavePlugin(plugin,plugin_type,app_label,position_model){

    var pk = plugin.attr('id');


    console.log(plugin);
    console.log('position_model of ' +plugin_type+ ' is ' +position_model);

    var top = plugin.css('top');
    var left = plugin.css('left');
    var width = plugin_type == 'FormInput' ? plugin.find('input').css('width') : plugin.css('width') ;
    var height = plugin_type == 'FormInput'? plugin.find('input').css('height') : plugin.css('height');
    var data = {
        'pk': pk,
        'top': top,
        'left': left,
        'width': width,
        'height': height,
        'app_label':app_label,
        'position_model':position_model
    };

    $.ajax({
        url: '/en/dashboards/plugins/plugin_position/'+plugin_type+'/',
        type: 'post',
        data: data,
        success: function (data) {
            console.log(data['status']);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('Couldnt Save Plugin '+ plugin_type);
                    console.log('jqXHR:');
                console.log(jqXHR);
                console.log('textStatus:');
                console.log(textStatus);
                console.log('errorThrown:');
                console.log(errorThrown);
        }
    });

}

function RestorePlugin(plugin,plugin_type,app_label,position_model){

    var pk = plugin.attr('id');


    var data = {
        'pk': pk,
        'app_label':app_label,
        'position_model':position_model
    };

    $.ajax({
        url: '/en/dashboards/plugins/plugin_position/'+plugin_type+'/',
        type: 'get',
        data: data,
        success: function (data) {
            console.log(data['status']);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('Couldnt restore plugins!');
            console.log('jqXHR:');
                console.log(jqXHR);
                console.log('textStatus:');
                console.log(textStatus);
                console.log('errorThrown:');
                console.log(errorThrown);
        }
    });

}





$('#restore_view').click(function () {


    classList= $('.resizable-draggable');
    $.each(classList, function(index, item) {
        var app_label=$(this).attr('app_label');
        var model_name=$(this).attr('model_name');

        var position_model=$(this).attr('position_model');

        RestorePlugin($(this),model_name,app_label,position_model)

    });



});


$('#btn_edit_mode').click(function () {
   $('.edit-mode.hide').removeClass('hide');
   $('.exit-mode').not('.hide').addClass('hide');

   $( ".resizable-draggable" ).draggable('enable').resizable('enable');

    $('.edit-mode-visible').show()

});

$('#btn_exit_mode').click(function () {
   $('.exit-mode.hide').removeClass('hide');
   $('.edit-mode').not('.hide').addClass('hide');

   $( ".resizable-draggable" ).draggable('disable').resizable('disable');
   $('#show_grid').prop( "checked", false );
   $("#main_body").removeClass('edit-mode-on');

   $('.edit-mode-visible').hide()
});



$(document).ready(function () {

    intialize_plugins();
    $('#btn_exit_mode').click();
    $('#show_grid').change(function () {
        if ($(this).prop("checked")) {
            $("#main_body").addClass('edit-mode-on');
        } else {
            $("#main_body").removeClass('edit-mode-on');
        }
    });

    $(" .resizable-draggable")
        .draggable({grid: [grid_size, grid_size]})

        .resizable({grid: grid_size * 2})

        .on("mouseover", function () {
            $(this).addClass("move-cursor")
        })

        .on("mousedown", function () {
            if (!$(this).hasClass('ui-draggable-disabled')) {
                $(this)
                    .removeClass("move-cursor")
                    .addClass("grab-cursor")
                    .addClass("opac");
            }
        })

        .on("mouseup", function () {
            if (!$(this).hasClass('ui-draggable-disabled')) {
                $(this)
                .removeClass("grab-cursor")
                .removeClass("opac")
                .addClass("move-cursor");
            }

        });




});




//---------Side Bar Control----------------//
$('#split-bar').mousedown(function (e) {
    var min = 30;
    var max = 3600;
    var mainmin = 200;
    e.preventDefault();
    $(document).mousemove(function (e) {
        e.preventDefault();
        var x = e.pageX - $('#dash_sidebar').offset().left;
        if (x > min && x < max && e.pageX < ($(window).width() - mainmin)) {
          $('#dash_sidebar').css("width", x);
          $('#main_body').css("margin-left", x);

          if (x>200){
          $('#db_sidebar_container').css("display","block")
          }
          else{
              $('#db_sidebar_container').css("display","none")
          }
        }
    })
});
$(document).mouseup(function (e) {
    $(document).unbind('mousemove');
});



