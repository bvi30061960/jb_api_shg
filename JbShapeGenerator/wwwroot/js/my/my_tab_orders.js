
//import * as THREE from 'three';
//import { Line2 } from 'three/addons/lines/Line2.js';
//import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
//import { LineGeometry } from 'three/addons/lines/LineGeometry.js';



import { Constants } from './my_common_const.js';
//import {
//    struc_gabarits,
//    struc_segment_transform_data,
//    cv_spline_name_prefix,
//    cv_segment_name_prefix,

//    typ_color_data,
//    typ_side_data,
//    typ_mesh_colors,
//    type_rotate_mode,
//    typ_sides_data,
//    typ_parameters

//} from "./my_common_types.js";

import { CommonFunc } from './my_common_func.js';

import {
    //get_active_side_shape_generator,
    //get_passive_side_shape_generator,

    //gc_id_prefix_up,
    //gc_id_prefix_lateral,
    //gc_id_prefix_end,

    //go_up_side_shape_generator,
    //go_lateral_side_shape_generator,
    //go_end_side_shape_generator,

    go_tab_orders

} from './my_shape_generator.js';

//==========================================================================================
// Class Tab_orders
export function Tab_orders(/*po_container, po_camera,po_scene,*/
    /*po_params*/ /*pv_shape_width, pv_shape_height*/
) {

    // Свойства
    ////0511204 this.container = po_container;
    ////0511204 this.camera = po_camera;
    //this.scene = po_scene;

    //////this.shape_width = po_params.shape_width;
    //////this.shape_height = po_params.shape_height;
    //this.shape_width = pv_shape_width;
    //this.shape_height = pv_shape_height;

    //this.shape;

    //this.group_rect = null;

    //this.cv_rectangle_name = "my_rectangle";


    this.model_prefix_filename = null; // префикс имени файла модели
    //=====================================================================

    if (typeof this.init_tab_orders != "function") {

        //----------------------------------------------------------
        // Методы
        //----------------------------------------------------------



        //////Rectangle.prototype.create_rectangle = function () {


        //////	try {


        //////	}

        //////	catch (e) {

        //////		alert('error create_rectangle: ' + e.stack);

        //////	}


        //////}


        //------------------------------------------------------------------------
        Tab_orders.prototype.init_tab_orders = function (/*pv_distance_bt_curves*//*pv_shape_width, pv_shape_height*/) {


            try {


                $("#id_but_model_download").on("click", this.onclick_but_model_download);
                $("#id_but_go_to_amazon").on("click", this.onclick_but_go_to_amazon);



            }

            catch (e) {

                alert('error init_tab_orders: ' + e.stack);

            }

        }

        //-----------------------------------------------------------------

        Tab_orders.prototype.onclick_but_model_download = function (po_event) {


            try {

                $("#id_order_loading_indicator").show(); // показываем индикатор загрузки

                let lv_filename_zip = go_tab_orders.model_prefix_filename + Constants.file_model_zip;//   "test_file.zip"; // это имя файла надо считывать или hash-имя файла

                let lv_url = "/Index?handler=" + Constants.method_read_model_parts_zip_file
                    + "&"
                    + "filename" + "=" + lv_filename_zip
                    + "&chdata=" + Math.random().toString(); 

                let lv_is_download_to_downloads_folder = true;// сохранение в папку "Загрузки"
                let lv_downloaded_filename = "jb_puzzle_parts.zip";
                let lv_is_save_to_server = false;// сохранение файла на сервер
                CommonFunc.prototype.read_file_from_server(lv_url, lv_is_download_to_downloads_folder, lv_downloaded_filename, lv_is_save_to_server);

            }

            catch (e) {


                $("#id_order_loading_indicator").hide(); // скрывакм индикатор загрузки

                alert('error onclick_but_model_download: ' + e.stack);

            }
        }


        //-----------------------------------------------------------------

        Tab_orders.prototype.onclick_but_go_to_amazon = function (po_event) {


            try {

                let lv_url = "https://www.amazon.com/s?k=loose+leaf+tea%2C+not+bagged&i=grocery&crid=1YUTWIU5EM8LJ&sprefix=loose+leaf+tea%2C+not+bagged%2Cgrocery%2C144&ref=nb_sb_noss";
                let lo_new_window = window.open(lv_url, "_blank");

                //window.open();

            }

            catch (e) {

                alert('error onclick_but_go_to_amazon: ' + e.stack);

            }
        }

        //====================================================================
    }  // if (typeof this.create_rectangle !== "function")

    //====================================================================



    this.init_tab_orders();


}

// end Class Tab_orders
//=====================================================================