

var go_this = null;

//================================================================================
// Class ProgressDialog

export function ProgressDialog() {

    this.progressTimer = null;
    this.progressbar = $("#id_progressbar");
    this.progressLabel = $(".progress-label");

    this.dialogButtons = null;
    this.dialog = null;
    this.downloadButton = null;
    //this.progressbar = null;


    //=====================================================================

    if (typeof this.init_progress_dialog != "function") {


        //-----------------------------------------------------------------------------------

        ProgressDialog.prototype.init_progress_dialog = function () {

            try {

                go_this = this;


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
                        go_this.progressTimer = setTimeout(go_this.do_progress, 500);
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
                        go_this.progressLabel.text("Current Progress: " + go_this.progressbar.progressbar("value") + "%");
                    },
                    complete: function () {
                        go_this.progressLabel.text("Complete!");
                        go_this.dialog.dialog("option", "buttons", [{
                            text: "Close",
                            click: go_this.closeDownload
                        }]);
                        $(".ui-dialog button").last().trigger("focus");
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
                //function progress() {
                var val = go_this.progressbar.progressbar("value") || 0;

                go_this.progressbar.progressbar("value", val + Math.floor(Math.random() * 3));

                if (val <= 99) {
                    go_this.progressTimer = setTimeout(go_this.do_progress, 50);
                }

            }

            catch (e) {

                alert('error progress: ' + e.stack);

            }
        }

        //-----------------------------------------------------------------------------------
        ProgressDialog.prototype.closeDownload = function () {


            try {
                //function closeDownload() {
                clearTimeout(go_this.progressTimer);
                go_this.dialog
                    .dialog("option", "buttons", go_this.dialogButtons)
                    .dialog("close");
                go_this.progressbar.progressbar("value", false);
                go_this.progressLabel
                    .text("Starting download...");
                go_this.downloadButton.trigger("focus");
            }



            catch (e) {

                alert('error closeDownload: ' + e.stack);

            }

            //====================================================================
        }  // if (typeof this.redraw_shapes !== "function")


        this.init_progress_dialog();
        //====================================================================
    }

    // end Class Shapes
    //=====================================================================

}
