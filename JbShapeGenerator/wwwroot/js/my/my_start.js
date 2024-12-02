import {
    gv_active_id_prefix,
    start_side_shape_generator,
    Shape_generator
    //reset_event_handlers
} from "./my_shape_generator.js";


export const gc_id_prefix_up = "up";
export const gc_id_prefix_lateral = "lateral";


var gv_tab1_actived;// = null;
var gv_tab2_actived;// = null;

//var gv_active_id_prefix = "";


var go_up_side_shape_generator = null;
var go_lateral_side_shape_generator = null;
var go_end_side_shape_generator = null;


var go_active_side_shape_generator = 1;
var go_passive_side_shape_generator = 2;


start();


function start() {

    //clear_events_handlers();

    $("#id_tab_sides").tabs(
        {
            //active: 1,
            activate: on_tab_side_activate

            //create: function (event, ui) { alert('create tab'); }
            //beforeActivate: on_activate,

            //load: function (event, ui) { alert('load tab');  }
        }
    );

    //$("#id_tab_sides").on("tabsload", function (event, ui) { alert('tabsload tab'); });


    //////////////////////////////go_lateral_side_shape_generator = start_side_shape_generator(gc_id_prefix_lateral,gc_id_prefix_up );//11062024
    //////////////////////////////go_up_side_shape_generator = start_side_shape_generator(gc_id_prefix_up, gc_id_prefix_lateral);

    //////////////////////////////gv_tab1_actived = true;
    //////////////////////////////go_active_side_shape_generator = go_up_side_shape_generator;




    ////go_active_side_shape_generator.reset_event_handlers();


    //alert('before on_tab_activated');
    //on_tab_side_activate();//10062024


    //$("#id_tab_sides").tabs("option", "active", 2);

    //$("#id_tab_sides").tabs("option", "active", 1);

}



//--------------------------------------------------------------------------
/*export */function on_tab_side_activate(event, ui) {

    //clear_events_handlers();

    //alert('into on_tab_activated');

    let lv_name_tab;
    //if (typeof ui == "undefined") {
    //    lv_name_tab = "tab-1";
    //}
    //else {
        lv_name_tab = ui.newPanel[0].id;
    //}



    //09062024 
    //switch (ui.newPanel[0].id) {
    switch (lv_name_tab) { //09062024
        case "tab-1":
            if (!gv_tab1_actived) {
                //start_side_shape_generator(gc_id_prefix_up);
                //go_up_side_shape_generator = new Shape_generator(pv_id_prefix);
                //go_up_side_shape_generator = new Shape_generator(gc_id_prefix_up, gc_id_prefix_lateral);



                if (typeof go_lateral_side_shape_generator === "undefined") {
                    go_lateral_side_shape_generator = start_side_shape_generator(gc_id_prefix_lateral, gc_id_prefix_up);//12062024
                }
                go_up_side_shape_generator = start_side_shape_generator(gc_id_prefix_up, gc_id_prefix_lateral);
                gv_tab1_actived = true;

               //gc_id_prefix_lateral.start_side_shape_generator(gc_id_prefix_up, gc_id_prefix_lateral);

            }
            //gv_tab1_actived = true;
            //gv_active_id_prefix = gc_id_prefix_up;
            go_active_side_shape_generator = go_up_side_shape_generator;
            go_passive_side_shape_generator = go_lateral_side_shape_generator;

            //alert('into tab1 on_tab_activated at end');

            break;

        case "tab-2":
            if (!gv_tab2_actived) {
                //start_side_shape_generator(gc_id_prefix_lateral);
                ///go_lateral_side_shape_generator = new Shape_generator(gc_id_prefix_lateral);


                //go_lateral_side_shape_generator = new Shape_generator(gc_id_prefix_lateral, gc_id_prefix_up);

                if (typeof go_up_side_shape_generator === "undefined") {
                    go_up_side_shape_generator = start_side_shape_generator(gc_id_prefix_up, gc_id_prefix_lateral);
                }
                go_lateral_side_shape_generator = start_side_shape_generator(gc_id_prefix_lateral, gc_id_prefix_up);

                gv_tab2_actived = true;



                //go_up_side_shape_generator = start_side_shape_generator(gc_id_prefix_up, gc_id_prefix_lateral);//11062024

            }
            //gv_tab2_actived = true;
            //gv_active_id_prefix = gc_id_prefix_lateral;
            go_active_side_shape_generator = go_lateral_side_shape_generator;
            go_passive_side_shape_generator = go_up_side_shape_generator;


            //alert('into tab2 on_tab_activated at end');

            break;
    }

    //go_active_side_shape_generator.reset_event_handlers();

    //go_active_side_shape_generator.init_event_handlers(go_passive_side_shape_generator);

    //go_active_side_shape_generator.render();

    //go_passive_side_shape_generator.reset_event_handlers();
    //if (go_passive_side_shape_generator) {
    //    go_active_sgo_passive_side_shape_generator.reset_event_handlers();
    //}

}


//--------------------------------------------------------------------------
export function get_active_side_shape_generator() {
    return go_active_side_shape_generator;
}

//--------------------------------------------------------------------------
export function get_passive_side_shape_generator() {
    return go_passive_side_shape_generator;
}

//--------------------------------------------------------------------------
export function get_side_shape_generator_by_prefix(pv_prefix) {

    let lo_object;

    switch (pv_prefix) {

        case gc_id_prefix_up:
            lo_object = go_up_side_shape_generator;
            break;

        case gc_id_prefix_lateral:
            lo_object = go_lateral_side_shape_generator;
            break;

        case gc_id_prefix_end:
            lo_object = go_end_side_shape_generator;
          break;
    }


    return lo_object;
}


