﻿//import { CommonFunc } from './my_common_func.js';

import { Constants } from './my_common_const.js';

var go_this = null;

//================================================================================
// Class ProgressBar

export function ProgressBar(po_side, pv_client_id, pv_url, pv_name_start_method, pv_read_result_method, pv_end_watching_progress_value) {

    go_this = this;//24112024


    this.client_id = pv_client_id;
    this.shg_side = po_side;
    this.url = pv_url;
    this.name_start_method = pv_name_start_method;
    this.read_result_method = pv_read_result_method;

    this.div_progressbar = $(po_side.id_prefix + "id_div_progressbar");
    this.progress_value = 0; // bvi

    this.task_id = 0;

    this.progressTimer = null;
    this.progressbar = document.getElementById(po_side.id_prefix_wo_sharp + "id_progressbar"); // $("#id_progressbar");
    this.progressLabel = $(po_side.id_prefix + "id_label_progress");


    //this.dialogButtons = null;
    //this.dialog = null;
    //this.downloadButton = null;
    //this.progressbar = null;

    this.monitoring_server_timer = null;

    this.end_watching_progress_value = pv_end_watching_progress_value

    //=====================================================================

    //if (typeof this.init_progress_bar != "function") {
    if (typeof this.init_progress_bar != "function") {


        //-----------------------------------------------------------------------------------

        ProgressBar.prototype.init_progress_bar = function () {

            try {

                //24112024 go_this = this; 

                //22112024 this.task_id = this.shg_side.common_func.get_random_number_int(1, 9999999999).toString();


            }

            catch (e) {

                alert('error init_progress_bar: ' + e.stack);

            }

        }


        //-----------------------------------------------------------------------------------
        ProgressBar.prototype.start_progress = function () {

            try {

                //go_this = this;

                //go_this.task_id = this.shg_side.common_func.get_random_number_int(1, 9999999999).toString(); //22112024

                //go_this.div_progressbar.show(1000);
                ///go_this.monitoring_server_timer = setTimeout(go_this.monitoring_server_progress, 1);//bvi
                //go_this.div_progressbar.slideDown();
                go_this.div_progressbar.fadeIn();
                ///go_this.div_progressbar.toggle("slide");
                //go_this.div_progressbar.toggle("clip");


                //go_this.taskId = get_random_number_int(1, 9999999999).toString();
                go_this.monitoring_server_timer = setTimeout(go_this.monitoring_server_progress, 500);
            }

            catch (e) {

                alert('error start_progress: ' + e.stack);

            }
        }



        //-----------------------------------------------------------------------------------
       ProgressBar.prototype.monitoring_server_progress = function () {

            try {

                let lv_url = go_this.url + "?method=" + Constants.method_read_progress_value
                    + "&client_id=" + go_this.client_id
                    + "&task_id=" + go_this.task_id;

                get_monitoring_server_progress(lv_url);

                //--------------------------------------------------
                async function get_monitoring_server_progress(pv_url) { 

                    try {
                        await $.get(pv_url, "", go_this.oncomplete_monitoring_server_progress);
                    }

                    catch (e) {

                        alert('error get_monitoring_server_progress: ' + e.stack);

                    }

                }

            }

            catch (e) {

                alert('error monitoring_server_progress: ' + e.stack);

            }
        }


        //-----------------------------------------------------------------------------------
        ProgressBar.prototype.oncomplete_monitoring_server_progress = function (po_data) {

            try {

                let ls_progress_data = JSON.parse(po_data);

                if (ls_progress_data == null) {

                    go_this.monitoring_server_timer = setTimeout(go_this.monitoring_server_progress, 500);
                    return;
                }

                go_this.set_progress_value(ls_progress_data.progress_indicator);
                go_this.set_display_value(ls_progress_data.progress_indicator);


                //go_this.progressLabel.text("Current Progress: " + go_this.progress_value + "%");

                let lv_progress_indicator = parseInt(ls_progress_data.progress_indicator);

                //if (lv_progress_indicator < 50) {
                if (lv_progress_indicator < go_this.end_watching_progress_value) {

                    //go_this.progress_value = pv_progress_value;
                    //go_this.progressbar.progressbar("value", go_this.progress_value);
                    //go_this.progressLabel.text("Current Progress: " + go_this.progress_value + "%"); 

                    go_this.monitoring_server_timer = setTimeout(go_this.monitoring_server_progress, 500);
                }
                else {

                    go_this.stop_monitoring();

                    go_this.read_result_method(ls_progress_data);
                }

            }

            catch (e) {

                alert('error oncomplete_monitoring_server_progress: ' + e.stack);

            }

        }
        //-----------------------------------------------------------------------------------
        ProgressBar.prototype.stop_progress = function () {
            try {

                go_this.clear_timers();
                //go_this.progressbar.visible = false;
                //go_this.div_progressbar.hide(1000);
                //go_this.div_progressbar.slideUp();
                go_this.div_progressbar.fadeOut();
                ///go_this.div_progressbar.toggle("slide");
                ///go_this.div_progressbar.toggle("clip");

            }

            catch (e) {

                alert('error stop_progress: ' + e.stack);

            }
        }

        //-----------------------------------------------------------------------------------
        ProgressBar.prototype.stop_monitoring = function () {
            try {

                go_this.progress_value = 0;

                go_this.clear_timers();
            }

            catch (e) {

                alert('error stop_monitoring: ' + e.stack);

            }
        }
        //-----------------------------------------------------------------------------------
        ProgressBar.prototype.do_progress = function () {

            try {
                //bvi var val = go_this.progressbar.progressbar("value") || 0;

                var lv_progress_value = go_this.get_progress_value();// bvi

                //go_this.progressbar.progressbar("value", val + Math.floor(Math.random() * 3));
                //14112024 go_this.progressbar.progressbar("value", lv_progress_value);

                go_this.progressbar.value = lv_progress_value;//14112024
                go_this.progressLabel.value = "Current Progress: " + lv_progress_value + "%";

                //let lv_str1 = lv_progress_value.toString();
                //let lv_str2 = (100 - lv_progress_value).toString();


                //let lo_table = "<table width=100%><tr><td>{2}%</td></tr>" +
                //    "<tr><td bgcolor=blue width='{0}%'>&nbsp;</td>" +
                //    "<td width='{1}%'></td></tr></table>";
                //let lo_table_str = "<table width=100%><tr><td>" + lv_str1 + "%</td></tr>" +
                //    "<tr><td bgcolor=blue width='" + lv_str1 + "%'>&nbsp;</td>" +
                //    "<td width='" + lv_str2 + "%'></td></tr></table>";




                //lo_table = String.format(lo_table, lv_progress_value, 100 - lv_progress_value, lv_progress_value);
                //$get("id_span_progress_").innerHTML = lo_table_str;
                /* $("#id_span_progress").innerHTML = lo_table_str;*/

                if (lv_progress_value >= 100) {

                    go_this.clear_timers();
                    //setTimeout(go_this.dialog.dialog("close"), 2000);//bvi

                }
                else {
                    //bvi if (lv_progress_value <= 99) {
                    //bvi go_this.progressTimer = setTimeout(go_this.do_progress, 50);

                    if (lv_progress_value < 50) {
                        this.monitoring_server_timer = setTimeout(go_this.monitoring_server_progress, 250); //bvi
                    }
                    else {

                        //go_this.progressTimer = setTimeout(go_this.do_progress, 250);
                        go_this.clear_timers();
                    }
                }

            }

            catch (e) {

                alert('error do_progress: ' + e.stack);

            }
        }

        //-----------------------------------------------------------------------------------
        ProgressBar.prototype.set_display_value = function (pv_progress_value) {

            //go_this.progress_value = pv_progress_value;

            //setTimeout(
            //    function () {

            go_this.progressbar.value = pv_progress_value;//14112024
            go_this.progressLabel.text("Current Progress: " + pv_progress_value + "%");

            //}, 50


            //);

            ////    go_this.progressbar.value = pv_progress_value;//14112024
            ////    go_this.progressLabel.text("Current Progress: " + go_this.progress_value + "%");
        }

        //-----------------------------------------------------------------------------------
        ProgressBar.prototype.set_progress_value = function (pv_progress_value) {

            this.progress_value = pv_progress_value;
        }
        //-----------------------------------------------------------------------------------
        ProgressBar.prototype.get_progress_value = function () {

            return this.progress_value;
        }
        //-----------------------------------------------------------------------------------
        ProgressBar.prototype.clear_timers = function () {

            clearTimeout(go_this.progressTimer);
            clearTimeout(go_this.monitoring_server_timer);// bvi
        }

        //-----------------------------------------------------------------------------------
        ProgressBar.prototype.closeDownload = function () {


            try {
                //function closeDownload() {
                ////clearTimeout(go_this.progressTimer);
                ////clearTimeout(go_this.monitoring_server_timer);// bvi
                go_this.clear_timers(); //bvi

                go_this.dialog
                    .dialog("option", "buttons", go_this.dialogButtons)
                    .dialog("close");
                //14112024 go_this.progressbar.progressbar("value", false);
                go_this.progressbar.value = false;//14112024


                go_this.progressLabel
                    .text("Starting download...");
                go_this.downloadButton.trigger("focus");
            }



            catch (e) {

                alert('error closeDownload: ' + e.stack);

            }

            //====================================================================
        }  // if (typeof this.redraw_shapes !== "function")


        //24112024 this.init_progress_bar();

        //go_this = this; //14112024



        //====================================================================
    }

    // end Class Shapes
    //=====================================================================

}
