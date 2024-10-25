//import * as THREE from 'three';
//import { Line2 } from 'three/addons/lines/Line2.js';
//import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
//import { LineGeometry } from 'three/addons/lines/LineGeometry.js';


import {
    get_active_side_shape_generator,
    get_passive_side_shape_generator
} from './my_shape_generator.js';

import { Constants } from './my_common_const.js';


var go_this = null;
var go_grid = null; //$("#id_GridSelectModels");



//==================================================================================================
// Class GridSelectModels
export function GridSelectModels(pv_prefix) {

    //// Свойства
    //this.container = po_container;
    //this.camera = po_camera;
    //this.scene = po_scene;

    //this.shape_width = po_params.shape_width;
    //this.shape_height = po_params.shape_height;

    //this.shape;

    //this.group_rect = null;

    this.prefix = pv_prefix;

    //this.cv_grid_select_models = "my_grid_select_models";

    this.$grid = null;

    //=====================================================================

    if (typeof this.create_grid_select_models != "function") {

        //----------------------------------------------------------
        // Методы
        //----------------------------------------------------------



        //Rectangle.prototype.create_GridSelectModels = function () {


        //	try {


        //	}

        //	catch (e) {

        //		alert('error create_shapes: ' + e.stack);

        //	}


        //}


        //------------------------------------------------------------------------
        GridSelectModels.prototype.create_grid_select_models = function (  /*pv_distance_bt_curves*/) {

            //const cv_rect_width = this.shape_width;
            //const cv_rect_height = this.shape_height;

            try {

                go_this = this;


                //const positions = [];
                //positions.push(0, 0, 0);
                //positions.push(0, cv_rect_height, 0);
                //positions.push(cv_rect_width, cv_rect_height, 0);
                //positions.push(cv_rect_width, 0, 0);
                //positions.push(0, 0, 0);


                //let lv_color = 0x0040f0;
                //let lv_x = 0; //13032024  pv_distance_bt_curves/2;// / 2; // 0;
                //let lv_y = 0;

                //const clrs = [];

                //positions.forEach(() => {
                //	clrs.push(255, 0, 255);
                //});


                //let geometry = new LineGeometry();

                //geometry.setPositions(positions);/////

                //geometry.setColors(clrs);

                //let resolution = new THREE.Vector2();

                //let renderer = new THREE.WebGLRenderer({ /*antialias: true*/ });
                //renderer.getSize(resolution);

                //let material = new LineMaterial({
                //	//color: new Color("#fff").getHex(),
                //	vertexColors: 0xf0f, //VertexColors,
                //	linewidth: 0.5, //1, //2,
                //	resolution: resolution
                //	//dashed: false, //true,
                //	//gapSize: 0.75,
                //	//dashScale: 1.5,
                //	//dashSize: 1
                //});

                //material.needsUpdate = true;

                //this.shape = new Line2(geometry, material);
                //this.shape.computeLineDistances();
                //////lo_line.scale.set(1, 1, 1);

                //this.shape.name = this.cv_rectangle_name;

                //this.shape.position.set(lv_x, lv_y);//, 0 pv_z - 25);

                //////lo_group.add(this.shape);
                //////this.group_rect = lo_group;
                //////this.scene.add(lo_group);

                //this.scene.add(this.shape);

                //this.prefix = pv_prefix;

                ////this.$div_grid = $(this.prefix + "id_div_GridSelectModels");
                ////this.$grid = $(this.prefix + "id_GridSelectModels");
                ////this.$gridPager = $(this.prefix + "id_div_GridSelectModelsPager");

                this.$div_grid = $("#id_div_GridSelectModels");
                this.$grid = $("#id_GridSelectModels");
                this.$gridPager = $("#id_div_GridSelectModelsPager");


                this.$div_grid.dialog({
                    title: "Read model",
                    autoOpen: false,
                    modal: true,
                    resizable: false,
                    height: "auto",
                    width: "auto", // 600,
                    buttons: {
                        "Close": function () {
                            $(this).dialog("close");
                        }
                    }
                });

                go_grid = this.$grid;


                //----------------  grid  -----------------------------------------------------------------

                this.$grid.jqGrid({
                    //go_Grid.jqGrid({
                    //url: 'jqGridSelectBlockSetingsHandler.ashx',
                    datatype: 'json',
                    height: 230,//120,//90, //250,
                    width: 1100, //800, //1000,

                    //23092021 autowidth: true,
                    hoverrows: false, // подсвечивание строк

                    //colNames: ['pathFile', 'Hash_name', '№ п/п', 'Имя настройки', 'Описание', 'Дата изм.', 'Время изм.', '<i class="bi-share"></i>', 'username_hash_with_postfix'],
                    //colModel: [
                    //	{ name: 'pathFile', index: 'pathFile', hidden: true },
                    //	{ name: 'Hash_name', index: 'Hash_name', hidden: true, width: 70, sortable: true, align: 'center' },
                    //	{ name: 'RowID', index: 'RowID', width: 50, sortable: true, align: 'center'/*, formatter: cellLinkFormater*/ },
                    //	{ name: 'NameSet', index: 'NameSet', align: 'center', width: 160, sortable: true/*, formatter: cellLinkFormater*/ },
                    //	{ name: 'Description', index: 'Description', width: 300, sortable: true, align: 'center'/*, formatter: cellLinkFormater*/ },
                    //	{ name: 'DateChange', index: 'DateChange', width: 70, sortable: true, align: 'center'/*, formatter: cellLinkFormater*/ },
                    //	{ name: 'changeTime', index: 'changeTime', width: 90, sortable: true, align: 'center'/*, formatter: cellLinkFormater*/ },
                    //	{ name: 'IsCommonNastr', index: 'IsCommonNastr', sortable: true, width: 35, align: 'center'/*, formatter: is_shared_file_formatter*/ },
                    //	{ name: 'username_hash_with_postfix', index: 'username_hash_with_postfix', hidden: true }

                    //],
                    //	  public string path_file_wo_ext { get; set; }
                    //      public string filename { get; set; }
                    //      //public string descr { get; set; }
                    //      public byte[] picture { get; set; }
                    //      ////public string path_file_sides_data { get; set; }
                    //      ////public string path_file_prev_model { get; set; }
                    //      ////public string path_file_final_model { get; set; }
                    //      public wide_model_types wide_model_type { get; set; }
                    //      public string price { get; set; }
                    //      public string change_datetime { get; set; }


                    //colNames: ['pathFile', '<i class="bi-share"></i>', 'Model name', /*'Description',*/ 'Picture', 'Change date', 'Change time', 'username_hash_with_postfix'],
                    colNames: ['path_file_wo_ext', 'filename', 'picture', '< i class= "bi-share" ></i >', 'price', 'Change time'],
                    colModel: [
                        { name: 'path_file_wo_ext', index: 'path_file_wo_ext', hidden: true },
                        { name: 'filename', index: 'filename', align: 'center', width: 80, sortable: true/*, formatter: cellLinkFormater*/ },
                        { name: 'picture', index: 'Picture', width: 80, sortable: true, align: 'center'/*, formatter: cellLinkFormater*/ },
                        //{ name: 'path_file_sides_data', index: 'path_file_sides_data', hidden: true },
                        //{ name: 'path_file_sides_data', index: 'path_file_sides_data', hidden: true },
                        //{ name: 'path_file_sides_data', index: 'path_file_sides_data', hidden: true },
                        { name: 'wide_model_type', index: 'wide_model_type', sortable: true, width: 35, align: 'center'/*, formatter: is_shared_file_formatter*/ },
                        //{ name: 'Description', index: 'Description', width: 300, sortable: true, align: 'center'/*, formatter: cellLinkFormater*/ },
                        { name: 'price', index: 'price', width: 100, sortable: true, align: 'center'/*, formatter: cellLinkFormater */ },
                        { name: 'change_datetime', index: 'change_datetime', width: 90, sortable: true, align: 'center'/*, formatter: cellLinkFormater*/ }

                    ],





                    //caption: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    //    'Список настроек',
                    caption: "", //"Выбор настройки",
                    rowNum: 100, //10,
                    //rowList: [10, 50, 100],
                    pager: this.$gridPager,
                    sortname: 'RowID',
                    ////////////////viewrecords: true,

                    /////////////////////////////////editurl: "/Index?handler=GridListBlockSetings?delete=yes", //10092022

                    sortorder: 'asc',
                    ondblClickRow: this.OndblClickRow,

                    datatype: 'local',

                    hiddengrid: 'true'


                    //        gridComplete: function () {
                    //            var ids = lv_GridSelectBlockSettings.jqGrid('getDataIDs');
                    //            for (var i = 0; i < ids.length; i++) {
                    //                var cl = ids[i];
                    ////                be = "<input style='height:22px;width:20px;' type='button' value='E' onclick=\"jQuery('#id_GridSelectBlockSettings').delRowData('" + cl + "');\"  />";
                    //                be = "<input style='height:22px;width:20px;' type='button' value='E' onclick=\"jQuery('#id_GridSelectBlockSettings').delGridRow('" + cl + "');\"  />";
                    //                lv_GridSelectBlockSettings.jqGrid('setRowData', ids[i], { act: be });
                    //            }
                    //        }


                    //onSelectRow: function (id) {
                    //    if (id && id !== lastsel2) {
                    //        $('#GridSelectBlockSettings').jqGrid('restoreRow', lastsel2);
                    //        $('#GridSelectBlockSettings').jqGrid('editRow', id, true);
                    //        lastsel2 = id;
                    //    }
                    //},


                    ////////////////loadComplete: function (id) { //03062022


                    ////////////////	//var lv_rows = lv_LoadedTextGrid.getGridParam("reccount");

                    ////////////////	//if (lv_rows > 0) {


                    ////////////////	//    $("#id_dialog_file_saved").dialog("open");

                    ////////////////	//}


                    ////////////////}

                });// Grid
                //------------------------------------------------------------------------------------------

            }

            catch (e) {

                alert('error create_grid_select_models: ' + e.stack);

            }

        }




        //------------------------------------------------------------------------------------------
        GridSelectModels.prototype.OndblClickRow = function (e) {

            //var grid = $("#id_GridSelectBlockSettings");

            let rowKey = go_grid.jqGrid('getGridParam', "selrow");

            if (rowKey) {

                go_this.do_row_choice(rowKey);

            }
            else {
                //alert("No rows are selected");
                return;
            }
        }

        //------------------------------------------------------------------------------------------
        GridSelectModels.prototype.do_row_choice = function (pv_rowid) {

            let lv_ar;
            lv_ar = this.$grid.getRowData(pv_rowid);


            let lv_pathFile = lv_ar["path_file_wo_ext"];

            if (typeof (lv_pathFile) == "undefined" || lv_pathFile == "" || lv_pathFile == null) {
                return;
            }


            lv_pathFile = lv_pathFile + Constants.file_model_screenshot;
            this.read_screenshot(lv_pathFile);

            this.$div_grid.dialog("close");

        }

        //------------------------------------------------------------------------------------------
        GridSelectModels.prototype.read_screenshot = function (pv_pathFile) {


            ////let lv_url = "https://localhost:7164/CalcJBModel?method=" + Constants.method_read_screenshot +
            ////    "&pathfilename=" + pv_pathFile;


            let lv_url = "/Index?handler=" + Constants.method_read_screenshot + "&pathfilename=" + pv_pathFile;


            get_read_screenshot(lv_url);


            //--------------------------------------------------
            async function get_read_screenshot(pv_url) {


                try {

                    await $.get(pv_url, "", go_this.oncomplete_read_screenshot);

                }

                catch (e) {

                    alert('error get_read_screenshot: ' + e.stack);

                }

            }

        }


        //------------------------------------------------------------------------------------------
        GridSelectModels.prototype.oncomplete_read_screenshot = function (po_data) {


            let lo_active_side = get_active_side_shape_generator();

            ///let $id_div_visual_model = $(lo_active_side.id_prefix + "id_div_visual_model");

            let $id_div_visual_model = $("#id_screenshot");

            //$("#divThreeJS").empty();
            //if (gv_ModelImage.length > cv_ModelImage_length) {
            //    var img = document.createElement("img");
            //    img.src = gv_ModelImage; //canvas.toDataURL();
            //    $("#divThreeJS").append(img);
            //    $('#divThreeJS').css('display', 'block');//0105
            //}


            $id_div_visual_model.empty();


            let lo_img = document.createElement("img");
            lo_img.src = po_data;
            $id_div_visual_model.append(lo_img);
            $id_div_visual_model.css('display', 'block');

           // let lo_img = document.createElement("canvas");
           // //lo_img.src = po_data;
           // $id_div_visual_model.append(lo_img);
           //  lo_img.src = po_data;
           //$id_div_visual_model.css('display', 'block');


        }



        //====================================================================

    }  // if (typeof this.create_rectangle !== "function")

    //====================================================================



    this.create_grid_select_models();


}

// end Class GridSelectModels
//=====================================================================