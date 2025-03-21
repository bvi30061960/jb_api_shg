﻿var go_this = null;

//================================================================================
// Class ProgressDialog

export function ProgressDialog(pv_url, pv_read_method/*, pv_read_result_refresh_model*/) {

    this.url = pv_url;
    this.read_method = pv_read_method;
    //this.method_read_result_refresh_model = pv_read_result_refresh_model;


    this.progress_value = 0; // bvi

    this.progressTimer = null;
    this.progressbar = document.getElementById("id_progressbar"); // $("#id_progressbar");
    this.progressLabel = $(".progress-label");


    this.dialogButtons = null;
    this.dialog = null;
    this.downloadButton = null;
    //this.progressbar = null;

    this.monitoring_server_timer = null;


    //=====================================================================

    if (typeof this.init_progress_dialog != "function") {


        //-----------------------------------------------------------------------------------

        ProgressDialog.prototype.init_progress_dialog = function () {

            try {

                //14112024 go_this = this;


                this.dialogButtons = [{
                    text: "Cancel Download",
                    click: go_this.closeDownload
                }];

                this.dialog = $("#id_progress_dialog").dialog({
                    autoOpen: false,
                    closeOnEscape: false,
                    resizable: false,
                    buttons: go_this.dialogButtons,
                    open: function () {
                        //go_this.progressTimer = setTimeout(go_this.progress, 2000);
                        go_this.progressTimer = setTimeout(go_this.do_progress, 100);

                        go_this.monitoring_server_timer = setTimeout(go_this.monitoring_server_progress, 1);//bvi

                    },
                    beforeClose: function () {
                        go_this.downloadButton.button("option", {
                            disabled: false,
                            label: "Start Download"
                        });
                    }
                });

                this.downloadButton = $("#id_downloadButton")
                    .button()
                    .on("click", function () {

                        try {
                            $(this).button("option", {
                                disabled: true,
                                label: "Downloading..."
                            });
                            go_this.dialog.dialog("open");

                        }

                        catch (e) {

                            alert('error on_click_downloadButton: ' + e.stack);

                        }

                    });


                this.progressbar.progressbar({
                    value: false,
                    change: function () {
                        let lv_value_progressbar = go_this.get_progress_value(); // go_this.progressbar.progressbar("value");


                        //bvi go_this.progressLabel.text("Current Progress: " + go_this.progressbar.progressbar("value") + "%");
                        go_this.progressLabel.text("Current Progress: " + lv_value_progressbar + "%"); //bvi
                        //14112024 go_this.progressbar.progressbar("value", lv_value_progressbar);// bvi
                        go_this.progressbar.value = lv_value_progressbar;// 14112024 bvi

                    },
                    complete: function () {
                        go_this.progressLabel.text("Complete!");
                        go_this.dialog.dialog("option", "buttons", [{
                            text: "Close",
                            click: go_this.closeDownload
                        }]);
                        $(".ui-dialog button").last().trigger("focus");
                        setTimeout(go_this.dialog.dialog("close"), 2000);//bvi
                    }
                });


            }

            catch (e) {

                alert('error init_progress_dialog: ' + e.stack);

            }

        }
        //-----------------------------------------------------------------------------------
        ProgressDialog.prototype.do_progress = function () {

            try {
                //bvi var val = go_this.progressbar.progressbar("value") || 0;

                var lv_progress_value = go_this.get_progress_value();// bvi

                //go_this.progressbar.progressbar("value", val + Math.floor(Math.random() * 3));
                //14112024 go_this.progressbar.progressbar("value", lv_progress_value);
                go_this.progressbar.value = lv_progress_value;//14112024


                let lv_str1 = lv_progress_value.toString();
                let lv_str2 = (100 - lv_progress_value).toString();


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
                        go_this.progressTimer = setTimeout(go_this.monitoring_server_progress, 250); //bvi
                    }
                    else {

                        //go_this.progressTimer = setTimeout(go_this.do_progress, 250);
                        go_this.clear_timers();
                    }
                }

            }

            catch (e) {

                alert('error progress: ' + e.stack);

            }
        }

        //-----------------------------------------------------------------------------------
        ProgressDialog.prototype.monitoring_server_progress = function () {

            try {

                let lv_url = go_this.url + "?method=" + go_this.read_method;

                get_monitoring_server_progress(lv_url);
                //--------------------------------------------------
                async function get_monitoring_server_progress(pv_url) { //, pf_callback) {

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

        //////-----------------------------------------------------------------------------------
        ////ProgressDialog.prototype.oncomplete_monitoring_server_progress = function (pv_progress_value) {




        ////    go_this.set_progress_value(pv_progress_value);


        ////    go_this.progress_value = pv_progress_value;
        ////    //14112024 go_this.progressbar.progressbar("value", go_this.progress_value);
        ////    go_this.progressbar.value = pv_progress_value;//14112024

        ////    go_this.progressLabel.text("Current Progress: " + go_this.progress_value + "%");

        ////    if (pv_progress_value < 50) {

        ////        //go_this.progress_value = pv_progress_value;
        ////        //go_this.progressbar.progressbar("value", go_this.progress_value);
        ////        //go_this.progressLabel.text("Current Progress: " + go_this.progress_value + "%");


        ////        go_this.monitoring_server_timer = setTimeout(go_this.monitoring_server_progress, 250);
        ////    }
        ////    else {

        ////        clearTimeout(go_this.monitoring_server_timer);// bvi

        ////        //let ls_progress_data = JSON.parse(po_data);

        ////        go_this.read_method_result_refresh_model();



        ////        ////go_this.monitoring_server_timer = setTimeout(go_this.do_progress, 250);
        ////    }
        ////}

        //-----------------------------------------------------------------------------------
        ProgressDialog.prototype.set_display_value = function (pv_progress_value) {

            go_this.progress_value = pv_progress_value;
            //14112024 go_this.progressbar.progressbar("value", go_this.progress_value);
            go_this.progressbar.value = pv_progress_value;//14112024

            pv_progress_value


            go_this.progressLabel.text("Current Progress: " + go_this.progress_value + "%"); 
        }

        //-----------------------------------------------------------------------------------
        ProgressDialog.prototype.set_progress_value = function (pv_progress_value) {

            this.progress_value = pv_progress_value;
        }
        //-----------------------------------------------------------------------------------
        ProgressDialog.prototype.get_progress_value = function () {

            return this.progress_value;
        }
        //-----------------------------------------------------------------------------------
        ProgressDialog.prototype.clear_timers = function () {

            clearTimeout(go_this.progressTimer);
            clearTimeout(go_this.monitoring_server_timer);// bvi
        }

        //-----------------------------------------------------------------------------------
        ProgressDialog.prototype.closeDownload = function () {


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


        //14112024 ///////////////////////       this.init_progress_dialog();

        go_this = this; //14112024



        //====================================================================
    }

    // end Class Shapes
    //=====================================================================

}
