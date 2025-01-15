
import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

import { LineMaterial } from 'three/addons/lines/LineMaterial.js';//04122024

//////import { Line2 } from 'three/addons/lines/Line2.js';
//import { CubeGeometry } from 'three/addons/CubeGeometry.js';

import { Constants } from './my_common_const.js';

import { CommonFunc } from './my_common_func.js';

//import {
//    gc_id_prefix_up,
//    gc_id_prefix_lateral,
//    gc_id_prefix_end
// } from './my_start.js';




//import { ProgressDialog } from './my_progress_dialog.js';
import { ProgressBar } from './my_progress_bar.js';

import {
    struc_gabarits,
    struc_segment_transform_data,
    cv_spline_name_prefix,
    cv_segment_name_prefix,

    typ_color_data,
    typ_side_data,
    typ_mesh_colors,
    type_rotate_mode,
    typ_sides_data,
    typ_parameters

} from "./my_common_types.js";

import { Shapes } from "./my_shapes.js";
import { Splines } from "./my_splines.js";
import { Segments } from "./my_segments.js";
import { Rectangle } from './my_rectangle.js';
import { EndShape } from './my_end_shape.js';
import { Tab_orders } from './my_tab_orders.js';

import { GridSelectModels } from './my_grid_select_models.js';

import { STLLoader } from 'three/addons/loaders/STLLoader.js';//20082024

//============================================================================================

export const gc_id_prefix_up = "up";
export const gc_id_prefix_lateral = "lateral";
export const gc_id_prefix_end = "end";
export const gc_id_prefix_orders = "orders";


//30102024 {
const cv_name_group_contours = "group_contours";
const cv_name_group_color_mesh = "group_color_mesh";
const cv_name_group_end_shape = "group_end_shape";
const cv_name_group_end_cells_contours = "group_end_cells_contours";
const cv_name_end_group_cells_mesh = "end_group_cells_mesh";
//30102024 }

export var go_up_side_shape_generator = null;
export var go_lateral_side_shape_generator = null;
export var go_end_side_shape_generator = null;
export var go_tab_orders = null;


var go_active_side_shape_generator = null;
var go_passive_side_shape_generator = null;


start();


function start() {

    try {

        $("#id_tab_sides").tabs(
            {
                activate: on_tab_side_activate,
                heightStyle: "auto" //"fill"
            }
        );

        go_up_side_shape_generator = start_side_shape_generator(gc_id_prefix_up, gc_id_prefix_lateral);
        go_active_side_shape_generator = go_up_side_shape_generator;
        go_active_side_shape_generator.init_event_handlers();

        //////////01092024 {
        //go_lateral_side_shape_generator = start_side_shape_generator(gc_id_prefix_lateral, gc_id_prefix_up);
        //go_passive_side_shape_generator = go_lateral_side_shape_generator;
        //go_passive_side_shape_generator.init_event_handlers();
        //////////01092024 }



        ////$("#id_tab_sides").tabs(
        ////    {
        ////        activate: on_tab_side_activate,
        ////        heightStyle: "auto" //"fill"
        ////    }
        ////);


        //06122024 $("#id_tab_sides").tabs("option", "active", 2);//30112024  активация третьей закладки

        $("#id_tab_sides").tabs("option", "active", 1);// активация второй закладки (для срабатывания события activate
        // и формирования на второй закладке фигуры и данных)

        $("#id_tab_sides").tabs("option", "active", 2);////06122024   активация третьей закладки


        $("#id_tab_sides").tabs("option", "active", 0);// активация первой закладки


        //26112024 начальное обновление модели (сейчас работает загрузка начальной модели) go_up_side_shape_generator.model_params_changed = true;

        //05092024 }
    }

    catch (e) {

        alert('error start: ' + e.stack);

    }
}



//--------------------------------------------------------------------------
function on_tab_side_activate(event, ui) {

    let lv_name_tab = ui.newPanel[0].id;

    switch (lv_name_tab) {

        case "tab-1":

            go_active_side_shape_generator = go_up_side_shape_generator;
            go_passive_side_shape_generator = go_lateral_side_shape_generator;

            break;

        case "tab-2":
            if (!go_lateral_side_shape_generator) //12062024
            {
                go_lateral_side_shape_generator = start_side_shape_generator(gc_id_prefix_lateral, gc_id_prefix_up);//12062024
            }

            go_active_side_shape_generator = go_lateral_side_shape_generator;
            go_passive_side_shape_generator = go_up_side_shape_generator;
            break;

        case "tab-3":
            if (!go_end_side_shape_generator) //12062024
            {
                go_end_side_shape_generator = start_side_shape_generator(gc_id_prefix_end, gc_id_prefix_up);//12062024
            }

            go_active_side_shape_generator = go_end_side_shape_generator;
            go_passive_side_shape_generator = go_up_side_shape_generator;

            //05012025 {

            go_end_side_shape_generator.end_shape.redraw_end_shape(
                null,         //   po_main,
                null, null,   //   pv_added_spline_num, pv_deleted_spline_num,       
                null, null    //   po_is_use_data, po_sides_data       
            );

            go_end_side_shape_generator.end_shape.draw_cells_contours();
            go_end_side_shape_generator.end_shape.refresh_end_shapes(); //23122024
            //05012025 }

            break;

        case "tab-4":

            go_active_side_shape_generator = null;
            go_passive_side_shape_generator = null;

            go_up_side_shape_generator.reset_event_handlers(go_up_side_shape_generator);
            go_lateral_side_shape_generator.reset_event_handlers(go_lateral_side_shape_generator);;
            go_end_side_shape_generator.reset_event_handlers(go_end_side_shape_generator);

            if (!go_tab_orders) //12062024
            {
                go_tab_orders = new Tab_orders();
            }


            return;



            break;
    }


    go_active_side_shape_generator.init_event_handlers();

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
function get_side_shape_generator_by_prefix(pv_prefix) {

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

        case gc_id_prefix_end:
            lo_object = go_end_side_shape_generator;
            break;

    }
    go_end_side_shape_generator

    return lo_object;
}



//============================================================================================

//29102023 {
//function typ_sides_data() {
//    this.colorParts = new typ_color_data();
//    this.data1 = new typ_side_data();
//    this.data2 = new typ_side_data();
//};
//29102023 }


var go_sides_data = new typ_sides_data();


//--------------------------------------------------------------------------------

function start_side_shape_generator(pv_active_id_prefix, pv_passive_id_prefix) {

    return new Shape_generator(pv_active_id_prefix, pv_passive_id_prefix);
};




//==============================================================================================================

//==============================================================================================================

// Class Shape_generator
export function Shape_generator(pv_active_id_prefix, pv_passive_id_prefix) {


    this.client_id = null;


    this.id_common_shg_container = "id_shape";// "id_tab_sides";// "id_center";// "id_shg_common";// "id_shape"; //"id_shape_generator_container";//  "id_shape_generator_container";// ;
    this.id_side_shape = "id_shape"; //"id_shape_generator_container";//  "id_shape_generator_container";// ;
    this.id_side_shape_mod = "id_div_visual_model"; //25082024


    this.id_gui = "id_shg_right_top";

    // Свойства
    this.my_prefix = pv_active_id_prefix;
    this.id_prefix = "#" + pv_active_id_prefix + "_";
    this.id_prefix_wo_sharp = pv_active_id_prefix + "_";

    this.passive_id_prefix = "#" + pv_passive_id_prefix + "_";
    this.passive_id_prefix_wo_sharp = pv_passive_id_prefix + "_";

    this.container = document.getElementById(this.id_prefix_wo_sharp + this.id_side_shape);

    this.is_ask_about_save_file = false;
    this.is_model_changed = false;





    this.camera;//  = go_camera;
    this.scene;//  = go_scene;


    this.aspect;
    this.rectangle;


    let lv_id_side_shape = this.id_prefix + this.id_side_shape;
    let lv_id_side_shape_mod = this.id_prefix + this.id_side_shape_mod;

    this.common_prev_width = $(lv_id_side_shape).width();
    this.common_prev_height = $(lv_id_side_shape).height();

    this.prev_width_mod = $(lv_id_side_shape_mod).width();
    this.prev_height_mod = $(lv_id_side_shape_mod).height();


    this.offset = $(lv_id_side_shape).offset();

    this.prev_top = this.offset.top;
    this.prev_left = this.offset.left;

    let lv_$shape_mod = $(lv_id_side_shape_mod);

    this.offset_mod = $(lv_$shape_mod).offset();
    this.prev_top_mod = this.offset_mod.top;
    this.prev_left_mod = this.offset_mod.left;


    let offsetHeight = lv_$shape_mod[0].offsetHeight;
    let offsetLeft = lv_$shape_mod[0].offsetLeft;
    this.prev_offsetTop_mod = lv_$shape_mod[0].offsetTop;
    let offsetWidth = lv_$shape_mod[0].offsetWidth;

    this.button_down = false;
    this.draggableObject = undefined;
    this.delta_rect_drag_x = null;
    this.delta_rect_drag_y = null;
    this.common_func = null;



    this.shapes = null;
    this.splines = null;
    this.segments = null;
    this.end_shape = null; // торцевая фигура

    this.segment_gabarits = null;
    this.segment_transform_data = null;
    //18072024 this.was_draggable = false;

    this.controls = null;
    this.gui = null;

    this.group_contours = null;
    this.group_color_mesh = null;

    this.is_gragging = false;

    this.params = {

        container_width: this.container.clientWidth,
        container_height: this.container.clientHeight,
        shape_width_beg: 70, //50,
        shape_width: 70, //50,
        shape_height_beg: 100,
        shape_height: 100,
        shape_amount_curves: 3, // ;//, //5
        spline_amount_segments: 3, // ;//,
        ajust_curves_by_shape: true, // ;//,
        ajust_shape_by_curves: false, // ;//,
        distance_between_curves_in_percent_of_width: 10, // ;//,
        distance_bt_curves: 30, // ;//,
        is_space_adjust: $(this.id_prefix + "id_chb_space_adjust")[0].checked, //false, // ;//,// $("id_chb_space_adjust")[0].checked,
        is_curve_width_adjust: $(this.id_prefix + "id_chb_curve_width_adjust")[0].checked, // ;// // $("id_chb_curve_width_adjust")[0].checked
        color: '#0000ff'

    };

    this.is_big_window = false;

    this.resolution = null; //30072024

    this.container_mod; //= document.getElementById(this.id_prefix_wo_sharp + this.id_side_shape_mod);//20062024
    this.camera_mod;
    this.scene_mod;


    this.material_mod = new THREE.MeshPhongMaterial({ color: 0xff5533, specular: 0x111111, shininess: 200 });

    this.group_parts_mod;

    this.refreshModelInterval = 1000; // 1 //2 sec
    this.model_params_changed = false;
    this.is_building_model = false;

    this.model_prefix_filename = ""; // префикс имени файлов загружаемых деталей 
    this.model_numparts = 0; // всего загружаемых деталей модели
    this.num_loaded_model_parts = 0; //число загруженных деталей модели
    this.model_parts_positions = []; // new Array();
    this.rotate_status = 0; // режим вращения модели

    this.progress_bar = null;
    this.is_shape_gragging = false;
    //--------------------------------------------------------------------------------


    if (typeof this.create_shape_generator != "function") {

        //----------------------------------------------------------
        // Методы
        //----------------------------------------------------------



        //----------------------------------------------------------

        Shape_generator.prototype.create_shape_generator = function (/*pv_prefix*/ /*30112024*/) {

            this.init_containers_and_controls(/*pv_prefix *//*30112024*/);
            this.init_three_elements(/*pv_prefix *//*30112024*/);
            ////////////////this.animate_mod();//04122024


            // Загрузка данных начальной премодели
            this.load_initial_model(/*pv_prefix*/ /*30112024*/);//04012025



            /////// 30112024 setInterval(this.onPassInterval, this.refreshModelInterval, this);


        }

        //------------------------------------------------------------------------
        Shape_generator.prototype.load_initial_model = function () {

            try {

                let lv_end_watching_progress_value = 50;
                this.progress_bar = new ProgressBar(this, this.client_id, "https://localhost:7095/CalcJBModel", Constants.method_start_refresh_premodel, this.read_result_refresh_premodel, lv_end_watching_progress_value);
                this.progress_bar.task_id = this.common_func.get_random_number_int(1, 9999999999).toString(); //22112024


                let lv_path_file_initial_premodel = Constants.path_file_initial_premodel;
                this.grid_select_models.read_model_from_server(lv_path_file_initial_premodel, true);

            }

            catch (e) {

                alert('error load_initial_model: ' + e.stack);

            }
        }

        //------------------------------------------------------------------------
        Shape_generator.prototype.onPassInterval = function (po_this) {

            try {

                let lo_passive_side = get_passive_side_shape_generator();

                if (po_this.model_params_changed) {

                    if (!po_this.is_building_model && !lo_passive_side.is_building_model) {

                        po_this.model_params_changed = false;
                        ////19102024 po_this.is_building_model = true;
                        ////19102024 lo_passive_side.is_building_model = true;


                        po_this.refreshModel();

                    }
                }

            }

            catch (e) {

                alert('error onPassInterval: ' + e.stack);

            }
        }

        //------------------------------------------------------------------------
        Shape_generator.prototype.init_containers_and_controls = function (/*pv_prefix*/) {

            try {

                $.fn.colorPicker.defaults.colors = [
                    //'ffffff',
                    'f0f0f0', //Constants.background_color
                    'fa0d00',
                    'fa6e00',
                    'faf100',
                    '3dfa00',
                    '00a7fa',
                    '3b00fa'
                    //'f0f0f0' //Constants.background_color
                ];


                switch (this.my_prefix) {

                    case gc_id_prefix_up:
                        $("#up_id_pos_color_picker").colorPicker({ showHexField: false/*, onColorChange: function (id, newValue) { alert("id=" + id + " value= " + newValue) }*/ });
                        break;

                    case gc_id_prefix_lateral:
                        $("#lateral_id_pos_color_picker").colorPicker({ showHexField: false/*, onColorChange: function (id, newValue) { alert("id=" + id + " value= " + newValue) }*/ });
                        break;

                    case gc_id_prefix_end:
                        break;

                }

                $(this.id_prefix + "id_shg_right_top").draggable();
                $(this.id_prefix + "id_shg_right_top").draggable("disable");

                $(this.id_prefix + this.id_side_shape_mod).draggable();
                $(this.id_prefix + this.id_side_shape_mod).draggable("disable");



                $(this.id_prefix + "id_CurvesCount").spinner(
                    {
                        min: 1,
                        max: 20
                    }

                );


                $(this.id_prefix + "id_dist_part_slider").slider(
                    {
                        orientation: "vertical",
                        value: 0,
                        max: 20,
                        ///stop: set_model_to_center,
                        ///slide:  move_details_from_to_center
                    }
                );

                $(this.id_prefix + 'id_dist_part_slider').slider('value', 0);

            }

            catch (e) {

                alert('error init_containers_and_controls: ' + e.stack);

            }

        }



        //------------------------------------------------------------------------
        Shape_generator.prototype.init_three_elements = function (/*pv_prefix*/) {

            try {

                if (
                    this.my_prefix == gc_id_prefix_up
                    || this.my_prefix == gc_id_prefix_lateral
                    || this.my_prefix == gc_id_prefix_end
                ) {

                    this.container = document.getElementById(this.id_prefix_wo_sharp + this.id_side_shape);//20062024);
                    this.scene = new THREE.Scene();
                    //this.scene.background = new THREE.Color(0xf0f0f0);
                    this.scene.background = new THREE.Color(Constants.background_color);
                    //this.scene.background = new THREE.Color(0xfff000);

                    let lo_cameraPersp, lo_cameraOrtho;

                    this.aspect = this.container.clientWidth / this.container.clientHeight;//04022023

                    lo_cameraPersp = new THREE.PerspectiveCamera(50, this.aspect, 0.01, 30000);
                    //lo_cameraOrtho = new THREE.OrthographicCamera(-30 * this.aspect, 100 * this.aspect, 90 * this.aspect, -15.0 * this.aspect);//, 0,10);
                    ///lo_cameraOrtho = new THREE.OrthographicCamera(-45 * this.aspect, 65 * this.aspect, 50 * this.aspect, -8 * this.aspect);
                    lo_cameraOrtho = new THREE.OrthographicCamera(-15 * this.aspect, 65 * this.aspect, 50 * this.aspect, -8 * this.aspect);//, -0.100 * this.aspect, 20 * this.aspect);


                    //02112024 const frustumSize = 500;

                    this.camera = lo_cameraOrtho;

                    //11012025 {
                    ////if (this.my_prefix == gc_id_prefix_end) {

                    ////    //this.camera = new THREE.OrthographicCamera(-45 * this.aspect, 65 * this.aspect, 30 * this.aspect, -8 * this.aspect);
                    ////    //11012025 this.camera = new THREE.OrthographicCamera(-15 * this.aspect, 65 * this.aspect, 30 * this.aspect, -8 * this.aspect);
                    ////    this.camera = new THREE.OrthographicCamera(-15 * this.aspect, 65 * this.aspect, 50 * this.aspect, -8 * this.aspect);
                    ////    //this.camera.position.x = 10;
                    ////    //this.camera.position.y = -20;
                    ////    //this.camera.position.z = 2;
                    ////}
                    //11012025 }



                    //04082024 this.camera.position.set(0, 0, 1);


                    this.scene.add(new THREE.AmbientLight(0xf0f0f0, 3));
                    //this.scene.add(new THREE.DirectionalLight(0xf0f0f0, 3));
                    const light = new THREE.SpotLight(0xffffff, 4.5);
                    light.position.set(0, 1500, 200);
                    light.angle = Math.PI * 0.2;
                    light.decay = 0;
                    light.castShadow = true;
                    light.shadow.camera.near = 200;
                    light.shadow.camera.far = 2000;
                    light.shadow.bias = - 0.000222;
                    light.shadow.mapSize.width = 1024;
                    light.shadow.mapSize.height = 1024;
                    this.scene.add(light);

                    let lo_planeGeometry;
                    lo_planeGeometry = new THREE.PlaneGeometry(2000, 2000);
                    lo_planeGeometry.rotateX(- Math.PI / 2);

                    let lo_planeMaterial;
                    lo_planeMaterial = new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.2 });

                    this.plane = new THREE.Mesh(lo_planeGeometry, lo_planeMaterial);
                    this.plane.receiveShadow = true;
                    this.scene.add(this.plane);



                    this.renderer = new THREE.WebGLRenderer(/*{ antialias: true }*/);

                    //11012025 this.renderer.setSize(this.id_side_shape.clientWidth, this.id_side_shape.clientHeight);// 06052024

                    ///////////////////////////11012025 this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);// 06052024



                    this.container.appendChild(this.renderer.domElement);


                    // Controls
                    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
                    this.controls.damping = 0.2;
                    this.controls.enableRotate = false;// bvi

                    this.camera.position.set(0, 0, 1);//04082024


                }

                //-------------------------------------------------------------------


                //11012025 {
                //if (this.my_prefix != gc_id_prefix_end
                //    // && this.my_prefix != gc_id_prefix_lateral //25122024
                //) {

                if (
                    this.my_prefix == gc_id_prefix_up
                    || this.my_prefix == gc_id_prefix_lateral
                ) {

                    //11012025 }

                    // установки для модели
                    //======================================================================

                    this.lo_renderer_mod = null;
                    this.container_mod = document.getElementById(this.id_prefix_wo_sharp + this.id_side_shape_mod);//20062024
                    this.scene_mod = new THREE.Scene();
                    ///this.group_parts_mod = new THREE.Object3D(); //14102024 
                    //this.group_parts_mod.position.set(0, 0, 0);
                    this.group_parts_mod = new THREE.Group(); //14102024 
                    this.scene_mod.add(this.group_parts_mod); //14102024 

                    //this.scene_mod.background = new THREE.Color(0xf0f0f0);


                    // CAMERA
                    var SCREEN_WIDTH = this.container_mod.clientWidth, SCREEN_HEIGHT = this.container_mod.clientHeight;
                    var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
                    this.camera_mod = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
                    this.scene_mod.add(this.camera_mod);

                    //this.camera_mod.position.set(0, 150, 400);
                    this.camera_mod.position.set(50, 150, 250);
                    this.camera_mod.lookAt(this.scene_mod.position);




                    ////this.scene_mod.add(new THREE.AmbientLight(0xf0f0f0, 3));
                    ////const light_mod = new THREE.SpotLight(0xffffff, 4.5);
                    ////light_mod.position.set(0, 1500, 200);
                    ////light_mod.angle = Math.PI * 0.2;
                    ////light_mod.decay = 0;
                    ////light_mod.castShadow = true;
                    ////light_mod.shadow.camera.near = 200;
                    ////light_mod.shadow.camera.far = 2000;
                    ////light_mod.shadow.bias = - 0.000222;
                    ////light_mod.shadow.mapSize.width = 1024;
                    ////light_mod.shadow.mapSize.height = 1024;
                    ////this.scene_mod.add(light_mod);


                    ////let ambientLight = new THREE.AmbientLight(0x7c7c7c, 3.0);

                    ////let light1 = new THREE.DirectionalLight(0xFFFFFF, 3.0);
                    ////light1.position.set(0.32, 0.39, 0.7);

                    ////this.scene_mod.add(ambientLight);
                    ////this.scene_mod.add(light1);



                    //////let lo_planeGeometry_mod;
                    //////lo_planeGeometry_mod = new THREE.PlaneGeometry(2000, 2000);
                    //////lo_planeGeometry_mod.rotateX(- Math.PI / 2);

                    //////let lo_planeMaterial_mod;
                    ////////lo_planeMaterial_mod = new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.2 });
                    //////lo_planeMaterial_mod = new THREE.ShadowMaterial({ color: 0xFF0000, opacity: 1 });

                    //////this.plane_mod = new THREE.Mesh(lo_planeGeometry, lo_planeMaterial);
                    //////this.plane_mod.receiveShadow = true;
                    //////this.scene_mod.add(this.plane_mod);



                    this.renderer_mod = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
                    //////////////his.renderer_mod.setSize(this.id_side_shape_mod.clientWidth, this.id_side_shape_mod.clientHeight);// 06052024
                    this.container_mod.appendChild(this.renderer_mod.domElement);




                    //this.renderer_mod.setClearColor(0x000fff);//, 1);// цвет фона
                    //08112024 this.renderer_mod.setClearColor(0xf0f0f0);//, 1);// цвет фона
                    this.renderer_mod.setClearColor(0xffffff);//, 1);// цвет фона //08112024 



                    ////////////this.renderer_mod.setPixelRatio(window.devicePixelRatio);
                    /////////////////////////this.renderer_mod.setAnimationLoop(this.animate_mod);









                    // Controls
                    this.controls_mod = new OrbitControls(this.camera_mod, this.renderer_mod.domElement);
                    ////this.controls_mod.damping = 0.2;
                    ////this.controls_mod.enableRotate = false;// bvi
                    //this.controls_mod.autoRotate = true;




                    this.add_lights_for_model(this.scene_mod);

                    this.model_parts_positions = []; // new Array();



                } // 06122024 this.my_prefix != gc_id_prefix_end


                if (this.my_prefix == gc_id_prefix_end) { //11012025

                    //else {

                    this.group_end_shape = new THREE.Group();
                    this.group_end_shape.name = cv_name_group_end_shape;
                    this.group_end_shape.renderOrder = 5;

                    this.group_end_cells_contours = new THREE.Group();
                    this.group_end_cells_contours.name = cv_name_group_end_cells_contours;
                    this.group_end_cells_contours.renderOrder = 3;

                    this.end_group_cells_mesh = new THREE.Group();
                    this.end_group_cells_mesh.name = cv_name_end_group_cells_mesh;
                    this.end_group_cells_mesh.renderOrder = 2;

                    this.end_shape = new EndShape(this);
                    //this.group_end_shape.add(this.end_shape);

                    this.scene.add(this.group_end_shape);
                    this.scene.add(this.group_end_cells_contours);
                    this.scene.add(this.end_group_cells_mesh);

                }


                //=================================================================================================

                // обработчики событий gui
                if (!this.gui) {
                    this.reset_gui_parameters();
                }


                //=================================================================================================


                this.common_func = new CommonFunc();

                this.client_id = this.common_func.get_random_number_int(1, 9999999999).toString();


                ////if (this.my_prefix == gc_id_prefix_end) {


                ////12122024 {
                //this.group_end_shape = new THREE.Group();
                //this.group_end_shape.name = cv_name_group_end_shape;

                //this.end_shape = new EndShape(this);
                ////this.group_end_shape.add(this.end_shape);

                //this.scene.add(this.group_end_shape);
                ////12122024 }





                ////this.render();

                ////////}
                ////////else {

                this.make_shape(false, null);

                //this.render();
                ////}



                this.grid_select_models = new GridSelectModels(this.id_prefix);


                this.render();

                //==============================================================================
                //==============================================================================

            }

            catch (e) {

                alert('error init_three_elements: ' + e.stack);

            }

        }

        //------------------------------------------------------------------------
        Shape_generator.prototype.add_lights_for_model = function (po_scene) {

            try {

                let lo_spotLight;

                let lv_intensity = 0.7;


                lo_spotLight = new THREE.SpotLight(0xffffff);
                lo_spotLight.position.set(0, 100, 100);
                lo_spotLight.intensity = lv_intensity;
                po_scene.add(lo_spotLight);

                //lo_spotLight = new THREE.SpotLight(0xffffff);
                //lo_spotLight.position.set(100, 100, 0);
                //po_scene.add(lo_spotLight);

                //lo_spotLight = new THREE.SpotLight(0xffffff);
                //lo_spotLight.position.set(0, 100, -100);
                //po_scene.add(lo_spotLight);

                lo_spotLight = new THREE.PointLight(0xffffff);
                lo_spotLight.position.set(-100, 100, 0);
                lo_spotLight.intensity = lv_intensity;
                po_scene.add(lo_spotLight);



                //lo_spotLight = new THREE.SpotLight(0xffffff);
                //lo_spotLight.position.set(0, -100, 100);
                //po_scene.add(lo_spotLight);

                lo_spotLight = new THREE.SpotLight(0xffffff);
                lo_spotLight.position.set(100, -100, 0);
                lo_spotLight.intensity = lv_intensity;
                po_scene.add(lo_spotLight);

                lo_spotLight = new THREE.PointLight(0xffffff);
                lo_spotLight.position.set(0, -100, -100);
                lo_spotLight.intensity = lv_intensity;
                po_scene.add(lo_spotLight);

                //lo_spotLight = new THREE.SpotLight(0xffffff);
                //lo_spotLight.position.set(-100, -100, 0);
                //po_scene.add(lo_spotLight);



                //const geometry = new THREE.SphereGeometry(15);
                //const material = new THREE.MeshBasicMaterial({ color: 0xff000f });

                //let sphere = null;

                //sphere = new THREE.Mesh(geometry, material);
                //sphere.position.x = 0;
                //sphere.position.y = 100;
                //sphere.position.z = 100;
                //po_scene.add(sphere);

                //sphere = new THREE.Mesh(geometry, material);
                //sphere.position.x = 100;
                //sphere.position.y = 100;
                //sphere.position.z = 0;
                //po_scene.add(sphere);

                //sphere = new THREE.Mesh(geometry, material);
                //sphere.position.x = 0;
                //sphere.position.y = 100;
                //sphere.position.z = -100;
                //po_scene.add(sphere);

                //sphere = new THREE.Mesh(geometry, material);
                //sphere.position.x = -100;
                //sphere.position.y = 100;
                //sphere.position.z = 0;
                //po_scene.add(sphere);



                //sphere = new THREE.Mesh(geometry, material);
                //sphere.position.x = 0;
                //sphere.position.y = -80;
                //sphere.position.z = 100;
                //po_scene.add(sphere);

                //sphere = new THREE.Mesh(geometry, material);
                //sphere.position.x = 100;
                //sphere.position.y = -80;
                //sphere.position.z = 0;
                //po_scene.add(sphere);

                //sphere = new THREE.Mesh(geometry, material);
                //sphere.position.x = 0;
                //sphere.position.y = -80;
                //sphere.position.z = -100;
                //po_scene.add(sphere);

                //sphere = new THREE.Mesh(geometry, material);
                //sphere.position.x = -100;
                //sphere.position.y = -80;
                //sphere.position.z = 0;
                //po_scene.add(sphere);

            }

            catch (e) {

                alert('error add_lights_for_model: ' + e.stack);

            }
        }




        //------------------------------------------------------------------------
        Shape_generator.prototype.get_parameters_from_side_data = function (po_side_data) {


            let ls_parameters = new typ_parameters();

            try {
                ls_parameters.container_width = po_side_data.parameters.container_width;
                ls_parameters.container_height = po_side_data.parameters.container_height;
                ls_parameters.shape_width_beg = po_side_data.parameters.shape_width_beg;
                ls_parameters.shape_width = po_side_data.parameters.shape_width;
                ls_parameters.shape_height_beg = po_side_data.parameters.shape_height_beg;
                ls_parameters.shape_height = po_side_data.parameters.shape_height;
                ls_parameters.shape_amount_curves = po_side_data.parameters.shape_amount_curves;
                ls_parameters.spline_amount_segments = po_side_data.parameters.spline_amount_segments;
                ls_parameters.ajust_curves_by_shape = po_side_data.parameters.ajust_curves_by_shape;
                ls_parameters.ajust_shape_by_curves = po_side_data.parameters.ajust_shape_by_curves;
                ls_parameters.distance_between_curves_in_percent_of_width = po_side_data.parameters.distance_between_curves_in_percent_of_width;
                ls_parameters.distance_bt_curves = po_side_data.parameters.distance_bt_curves;
                ls_parameters.is_space_adjust = po_side_data.parameters.is_space_adjust;
                ls_parameters.is_curve_width_adjust = po_side_data.parameters.is_curve_width_adjust;
                ls_parameters.color = po_side_data.parameters.color;
            }

            catch (e) {

                this.model_params_changed = false;

                alert('error get_parameters_from_side_data: ' + e.stack);

            }

            return ls_parameters;
        }


        //------------------------------------------------------------------------
        Shape_generator.prototype.make_shape = function (pv_is_use_data, po_side_data) {

            try {

                if (pv_is_use_data) {
                    this.gui.reset();
                    this.params = this.get_parameters_from_side_data(po_side_data); //05112024
                    this.common_func.guiUpdateDisplay(this.gui);

                    this.reset_gui_parameters();
                }


                if (this.my_prefix != gc_id_prefix_end) {

                    this.shapes = new Shapes(
                        this,
                        this.scene,
                        this.params,
                        pv_is_use_data,
                        po_side_data
                    );

                    this.splines = new Splines(
                        this,
                        pv_is_use_data
                    );

                    this.segments = new Segments(
                        this,
                        pv_is_use_data
                    );

                    //02112024 if (!pv_is_use_data) {
                    this.segment_gabarits = this.segments.get_segment_size();
                    this.segment_transform_data = this.segments.get_segment_transform_data(/*this.segment_gabarits,*/ this.params.ajust_curves_by_shape);
                    //02112024 }

                    this.shapes.create_shapes(pv_is_use_data, po_side_data);

                    this.rectangle = new Rectangle(this.scene,
                        this.params.shape_width, this.params.shape_height); //05112024




                    this.group_contours = new THREE.Group();
                    this.group_contours.name = cv_name_group_contours;
                    this.scene.add(this.group_contours);

                    this.group_color_mesh = new THREE.Group();
                    this.group_color_mesh.name = cv_name_group_color_mesh;
                    this.scene.add(this.group_color_mesh);


                    this.shapes.adjust_splines_by_external_shape();//04122024

                }

                else {
                    //12122024 {
                    //////if (!this.group_end_shape) {
                    //////    this.group_end_shape = new THREE.Group();
                    //////    this.group_end_shape.name = cv_name_group_end_shape;
                    //////}

                    ////////if (!this.end_shape) {
                    ////////if (this.my_prefix == gc_id_prefix_end) {

                    //////this.end_shape = new EndShape(/*this*/);//12122024
                    //////this.scene.add(this.group_end_shape);
                    ////////}
                    //12122024 }
                }



            }

            catch (e) {

                this.model_params_changed = false;

                alert('error make_shape: ' + e.stack);

            }

        }
        //------------------------------------------------------------------------
        Shape_generator.prototype.reset_gui_parameters = function () {


            try {

                if (this.gui) {
                    this.gui.close();
                    this.gui.destroy();
                }

                this.gui = null;

                this.gui = new GUI({ container: document.getElementById(this.id_prefix_wo_sharp + 'id_gui') });

                this.gui.add(this.params, 'distance_bt_curves', 0, 40).step(0.5).name('Distance  between curves').onChange(this.onChange_distance_bt_curves).listen();//05112024
                this.gui.add(this.params, 'shape_height', 20, 200).step(0.5).name('Shape length').onChange(this.onChange_shape_height).onFinishChange(this.onFinishChange_param).listen();//05112024
                this.gui.add(this.params, 'shape_width', 10, 100).step(0.5).name('Shape width').onChange(this.onChange_shape_width).onFinishChange(this.onFinishChange_param).listen();//05112024

                //this.gui.addColor(this.params, 'color').name('Color');

                this.gui.open();

            }

            catch (e) {

                alert('error reset_gui_parameters: ' + e.stack);

            }

        }


        //------------------------------------------------------------------------
        Shape_generator.prototype.refreshModel = async function () {

            try {

                let lv_end_watching_progress_value = 50;
                this.progress_bar = new ProgressBar(this, this.client_id, "https://localhost:7095/CalcJBModel", Constants.method_start_refresh_premodel, this.read_result_refresh_premodel, lv_end_watching_progress_value);
                this.progress_bar.task_id = this.common_func.get_random_number_int(1, 9999999999).toString(); //22112024


                this.progress_bar.set_display_value(3);


                let lv_url = "https://localhost:7095/CalcJBModel?method="
                    + Constants.method_start_refresh_premodel
                    + "&"
                    + Constants.word_client_id + "=" + this.client_id
                    + "&"
                    + Constants.word_task_id + "=" + this.progress_bar.task_id
                    + "&chdata=" + Math.random().toString(); // 23112024


                let lo_sides_data = this.read_model_sides_data();
                lo_sides_data.task_id = this.progress_bar.task_id;

                this.send_side_data_for_refresh_model(lv_url, lo_sides_data);


            }

            catch (e) {

                this.model_params_changed = false; //29082024

                alert('error refreshModel: ' + e.stack);

            }
        }



        //------------------------------------------------------------------------
        Shape_generator.prototype.send_side_data_for_refresh_model = function (pv_url, po_json_data) {


            try {
                let lv_is_before = true;
                this.do_before_after_model_request(lv_is_before, true);

                send_for_refresh_model(pv_url, po_json_data);

                //-------------------------------------------------------------------
                async function send_for_refresh_model(pv_url, po_json_data) {


                    let lo_active_side = get_active_side_shape_generator(); //04102024
                    let lo_passive_side = get_passive_side_shape_generator(); //04102024

                    try {

                        var lv_for_body = JSON.stringify(po_json_data);
                        const response = await fetch(pv_url, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: lv_for_body
                        });

                        ////const message = await response.json();
                        const message = await response.text();

                        lo_active_side.OnCompleteRefreshModel(message);

                    }

                    catch (e) {


                        lo_active_side.model_params_changed = false;

                        let lv_is_before = false;
                        lo_active_side.do_before_after_model_request(lv_is_before, false);

                        alert('error send_for_refresh_model: ' + e.stack);

                    }

                }


            }

            catch (e) {

                this.model_params_changed = false; //29082024

                alert('error send_side_data: ' + e.stack);

            }
        }

        //------------------------------------------------------------------------
        Shape_generator.prototype.OnCompleteRefreshModel = function (po_data) {
            try {


                let lo_active_side = get_active_side_shape_generator();
                let lo_passive_side = get_passive_side_shape_generator();

                if (po_data == null || po_data == "") {

                    let lv_is_before = false;
                    lo_active_side.do_before_after_model_request(lv_is_before, false);

                    return;
                }

                let ls_progress_data = JSON.parse(po_data);

                ////if (po_data.indexOf(Constants.word_task_id) < 0) {
                ////    return;
                ////}


                if (ls_progress_data == null || typeof ls_progress_data == "undefined") {
                    return;
                }

                if (ls_progress_data.client_id != lo_active_side.client_id
                    || ls_progress_data.task_id != lo_active_side.progress_bar.task_id
                ) {
                    return;
                }





                /////////////////////////////21112024 lo_active_side.progress_bar.set_display_value(5);

                this.progress_bar.start_progress();



                /////////////this.refresh_model_data = 

                //16112025 { in the load_refresh_model

                //////const loader = new STLLoader();
                //////const lo_geometry = loader.parse(po_data);

                //////// Очистка сцены
                //////let lar_no_delete = ["PointLight", "PerspectiveCamera", "Group"];// "Mesh", 
                //////lo_active_side.common_func.clearScene(lo_active_side.scene_mod, lar_no_delete);
                //////lo_active_side.on_load_model(lo_geometry);
                //16112025 }


            }

            catch (e) {

                this.model_params_changed = false; //29082024

                alert('error OnCompleteRefreshModel: ' + e.stack);

            }
        }

        //------------------------------------------------------------------------
        Shape_generator.prototype.OnErrorRefreshModel = function () {

            let lo_active_side = get_active_side_shape_generator();
            let lv_is_before = false;

            lo_active_side.do_before_after_model_request(lv_is_before, false);


            /////alert("OnErrorRefreshModel");

            //02092024 lo_active_side.is_building_model = false;

        }



        //-------------------------------------------------------------------
        /*async*/ Shape_generator.prototype.read_result_refresh_premodel = function (po_data) {


            let lo_active_side = get_active_side_shape_generator(); //04102024
            let lo_passive_side = get_passive_side_shape_generator(); //04102024

            try {

                lo_active_side.progress_bar.set_display_value(51);


                let lv_url = "https://localhost:7095/CalcJBModel?method="
                    + Constants.method_read_result_refresh_premodel
                    + "&"
                    + Constants.word_client_id + "=" + this.client_id
                    + "&"
                    + Constants.word_task_id + "=" + po_data.task_id
                    + "&"
                    + Constants.path_result_file + "=" + po_data.path_result_file
                    + "&chdata=" + Math.random().toString(); // 23112024



                get_read_result_refresh_premodel(lv_url);


                //--------------------------------------------------
                async function get_read_result_refresh_premodel(pv_url) {
                    //--------------------------------------------------
                    await $.get(pv_url, "", lo_active_side.oncomplete_read_result_refresh_premodel);
                }


            }

            catch (e) {


                lo_active_side.model_params_changed = false; //04102024
                lo_passive_side.model_params_changed = false; //04102024

                let lv_is_before = false;
                lo_active_side.do_before_after_model_request(lv_is_before, false);
                lo_passive_side.do_before_after_model_request(lv_is_before, false);

                alert('error read_result_refresh_premodel: ' + e.stack);

            }

        }

        //}


        //-------------------------------------------------------------------
        //22112024 Shape_generator.prototype.load_refresh_model = function (po_data) {
        Shape_generator.prototype.oncomplete_read_result_refresh_premodel = function (po_data) {

            let lo_active_side = get_active_side_shape_generator();
            let lo_passive_side = get_passive_side_shape_generator(); //04102024

            const loader = new STLLoader();
            const lo_geometry = loader.parse(po_data);

            // Очистка сцены
            let lar_no_delete = ["AmbientLight", "PointLight", "SpotLight", "PerspectiveCamera", "Group"];// "Mesh", 
            lo_active_side.common_func.clearScene(lo_active_side.scene_mod, lar_no_delete);
            lo_passive_side.common_func.clearScene(lo_passive_side.scene_mod, lar_no_delete); //24112024

            lo_active_side.on_load_model(lo_geometry);
            lo_passive_side.on_load_model(lo_geometry);

        }


        //-------------------------------------------------------------------
        Shape_generator.prototype.on_load_model = function (geometry_mod) {


            try {

                let lo_active_side = get_active_side_shape_generator();
                let lo_passive_side = get_passive_side_shape_generator();

                geometry_mod.center();// Объект - в центре вращения

                lo_active_side.progress_bar.set_display_value(70);




                //-------------------------------------------------------------------
                const mesh_mod1 = new THREE.Mesh(geometry_mod, lo_active_side.material_mod);
                const mesh_mod2 = new THREE.Mesh(geometry_mod, lo_active_side.material_mod);


                lo_active_side.group_parts_mod.add(mesh_mod1);
                lo_passive_side.group_parts_mod.add(mesh_mod2);//24112024

                lo_active_side.progress_bar.set_display_value(90);

                let lv_is_before = false;
                lo_active_side.do_before_after_model_request(lv_is_before, false);

                lo_active_side.progress_bar.set_display_value(100);
                lo_active_side.progress_bar.stop_progress();

                lo_active_side.animate_mod();

                lo_active_side.is_building_model = false;
                lo_passive_side.is_building_model = false;

            }

            catch (e) {

                this.model_params_changed = false; //29082024

                alert('error on_load_model: ' + e.stack);

            }

        }


        //------------------------------------------------------------------------
        Shape_generator.prototype.make_model = function () {

            try {


                // закомментировано сохранение данных модели в папке "загрузки" {
                //////////go_sides_data = this.read_model_sides_data();

                //////////let stringify_model_data = JSON.stringify(go_sides_data);

                ////////////var zip = new JSZip();
                ////////////zip.file("DrawModelData.txt", drawdata);
                ////////////var content = zip.generate({ type: "blob", compression: "DEFLATE" });
                ////////////saveAs(stringify_model_data, "E:\test\ForSgModel.txt");


                //////////let lv_blob = new Blob([stringify_model_data], { type: "text/plain;charset=utf-8;" });
                ////////////saveAs(lv_blob, "E:\\test\\ForSgModel.txt");
                //////////saveAs(lv_blob, "ForSgModel.txt");
                // }

                let lv_end_watching_progress_value = 50;
                this.progress_bar = new ProgressBar(this, this.client_id, "https://localhost:7095/CalcJBModel", Constants.method_start_make_model, this.load_model_parts, lv_end_watching_progress_value);

                this.progress_bar.task_id = this.common_func.get_random_number_int(1, 9999999999).toString(); //22112024


                this.progress_bar.set_display_value(3);

                let lv_url = "https://localhost:7095/CalcJBModel?method="
                    + Constants.method_start_make_model
                    + "&"
                    + Constants.word_client_id + "=" + this.client_id
                    + "&"
                    + Constants.word_task_id + "=" + this.progress_bar.task_id
                    + "&chdata=" + Math.random().toString(); // 23112024

                //let lv_url = "https://localhost:7095/CalcJBModel?method="
                //    + Constants.method_make_model
                //    + "&chdata=" + Math.random().toString(); // 23112024


                let lo_sides_data = this.read_model_sides_data(); lo_sides_data.task_id = this.progress_bar.task_id;
                lo_sides_data.task_id = this.progress_bar.task_id;


                this.send_side_data_for_start_make_model(lv_url, lo_sides_data);


            }

            catch (e) {

                this.model_params_changed = false; //29082024

                alert('error make_model: ' + e.stack);

            }


        }

        //------------------------------------------------------------------------
        Shape_generator.prototype.send_side_data_for_start_make_model = function (pv_url, po_json_data) {


            try {

                let lv_is_before = true;
                this.do_before_after_model_request(lv_is_before, true);

                send_for_start_make_model(pv_url, po_json_data);

                //-------------------------------------------------------------------
                async function send_for_start_make_model(pv_url, po_json_data) {


                    let lo_active_side = get_active_side_shape_generator(); //04102024
                    let lo_passive_side = get_passive_side_shape_generator(); //04102024

                    try {

                        var lv_for_body = JSON.stringify(po_json_data);
                        const response = await fetch(pv_url, {
                            method: "POST",
                            headers: {
                                //"Accept": "application/json",
                                "Content-Type": "application/json"
                            },
                            body: lv_for_body
                        });

                        const message = await response.json();
                        //const message = await response.text();

                        lo_active_side.OnCompleteStartMakeModel(message);

                    }

                    catch (e) {

                        lo_active_side.model_params_changed = false;

                        let lv_is_before = false;
                        lo_active_side.do_before_after_model_request(lv_is_before, false);


                        alert('error send_for_start_make_model: ' + e.stack);

                    }


                }
            }

            catch (e) {

                alert('error send_side_data_make_model: ' + e.stack);

            }
        }

        //------------------------------------------------------------------------
        Shape_generator.prototype.OnCompleteStartMakeModel = function (po_data) {

            try {
                let lo_active_side = get_active_side_shape_generator();
                let lo_passive_side = get_passive_side_shape_generator();

                if (po_data == null || po_data == "" || typeof po_data == "undefined") {

                    let lv_is_before = false;
                    lo_active_side.do_before_after_model_request(lv_is_before, false);

                    return;
                }

                if (po_data.client_id != lo_active_side.client_id
                    || po_data.task_id != lo_active_side.progress_bar.task_id
                ) {
                    return;
                }


                this.progress_bar.start_progress();


            }

            catch (e) {

                alert('error OnCompleteStartMakeModel: ' + e.stack);

            }
        }

        //------------------------------------------------------------------------
        Shape_generator.prototype.load_model_parts = function (po_data) {

            try {


                let lo_active_side = get_active_side_shape_generator();

                if (po_data == null || po_data.number_outfiles == null || po_data.number_outfiles <= 0) {

                    let lv_is_before = false;
                    lo_active_side.do_before_after_model_request(lv_is_before, false);

                    return;
                }

                // Очистка сцены new THREE.Group();
                let lar_no_delete = ["AmbientLight", "PointLight", "SpotLight", "PerspectiveCamera", "Group"];// 14102024
                lo_active_side.common_func.clearScene(lo_active_side.scene_mod, lar_no_delete);


                let lv_filename = "";

                lo_active_side.num_loaded_model_parts = 0;//16102024

                // Очистка группы деталей
                lo_active_side.group_parts_mod.clear();


                lo_active_side.model_prefix_filename = po_data.common_outfilename_part; // префикс - общая часть имён файлов деталей
                // Загрузка деталей модели
                for (let lv_i = 1; lv_i <= po_data.number_outfiles; lv_i++) {

                    lv_filename = po_data.common_outfilename_part + "_" + lv_i.toString() + Constants.file_model_ext;

                    lo_active_side.model_numparts = po_data.number_outfiles;
                    //this.model_curr_numpart = lv_i;

                    lo_active_side.load_model_part(lv_filename);

                }


            }

            catch (e) {

                alert('error load_model_parts: ' + e.stack);

            }

        }



        //------------------------------------------------------------------------
        Shape_generator.prototype.load_model_part = function (pv_filename) {

            let lo_active_side = get_active_side_shape_generator();
            let lo_passive_side = get_passive_side_shape_generator();

            try {

                let lv_url = "https://localhost:7095/CalcJBModel?method=" + Constants.method_read_model_parts +
                    "&filename=" + pv_filename
                    + "&chdata=" + Math.random().toString(); // 23112024
                ;


                let lv_is_before = true;


                get_model_part(lv_url);


                //--------------------------------------------------
                async function get_model_part(pv_url) {
                    //--------------------------------------------------
                    await $.get(pv_url, "", lo_active_side.oncomplete_read_model_part);
                }
                //--------------------------------------------------

            }
            catch (e) {

                let lv_is_before = false;
                lo_active_side.do_before_after_model_request(lv_is_before, false);

            }

        }



        //------------------------------------------------------------------------
        Shape_generator.prototype.oncomplete_read_model_part = function (po_data) {


            try {

                const loader = new STLLoader();
                const geometry_mod = loader.parse(po_data);

                let lo_active_side = get_active_side_shape_generator();
                let lo_passive_side = get_passive_side_shape_generator();

                /////////////geometry_mod.center();// Объект - в центре вращения


                lo_active_side.num_loaded_model_parts++; // подсчёт числа загруженных деталей




                //14012025 {
                //-------------------------------------------------------------------
                // сохранение детали на сервере


                try {

                    let response = await fetch(pv_url, {
                        method: "POST",
                        headers: {
                            //"Accept": "application/json"
                            "Content-Type": "application/json"
                        },

                        body: po_data_to_send

                    });

                    //const message = await response.json();
                    const message = await response.text();
                    let lo_active_side = get_active_side_shape_generator();


                    let lv_modelname = $("#id_model_name").val();
                    let lv_message_text = 'Model "' + lv_modelname + '" saved';
                    lo_active_side.common_func.Show_message(lv_message_text, 2000);


                }

                catch (e) {
                    alert('error send: ' + e.stack);
                }




                //-------------------------------------------------------------------
                //14012025 }


                //=========================================================================
                const mesh_mod = new THREE.Mesh(geometry_mod, lo_active_side.material_mod);

                lo_active_side.group_parts_mod.add(mesh_mod);//14102024


                //=========================================================================
                if (lo_active_side.num_loaded_model_parts == lo_active_side.model_numparts)
                // конец загрузки
                {
                    ////// Задержка для загрузки всех деталей
                    ////var delayInMilliseconds = 1000; // 1 second

                    ////setTimeout(function () {

                    lo_active_side.common_func.set_group_to_center(lo_active_side.group_parts_mod);

                    // Запоминание в массиве начальных координат деталей

                    lo_active_side.model_parts_positions.length = 0;
                    for (let lv_i = 0; lv_i < lo_active_side.group_parts_mod.children.length; lv_i++) {


                        //lo_active_side.group_parts_mod.children[lv_i].updateMatrix();
                        //lo_active_side.group_parts_mod.children[lv_i].updateMatrixWorld();

                        ////lo_active_side.model_parts_positions.
                        ////    push(lo_active_side.group_parts_mod.children[lv_i].geometry.boundingBox);
                        lo_active_side.model_parts_positions[lv_i] =
                            lo_active_side.group_parts_mod.children[lv_i].geometry.boundingBox;


                    }



                    ////lo_active_side.is_building_model = false;
                    ////lo_passive_side.is_building_model = false;

                    ////$('#up_id_loading_indicator').hide();// прекращение индикации ожидания
                    ////$('#lateral_id_loading_indicator').hide();// прекращение индикации ожидания
                    ////lo_active_side.set_visible_rotate_controls(true); // сделать видимым контрол  - слайд расстояния между деталями
                    ////lo_active_side.rotate_status = type_rotate_mode.clockwise; // включить вращение модели
                    ////$('#up_id_div_visual_model').css('opacity', 1);// прозрачность контента
                    ////$('#lateral_id_div_visual_model').css('opacity', 1);// прозрачность контента


                    let lv_is_before = false;
                    lo_active_side.do_before_after_model_request(lv_is_before, true);

                    // Посылка команды на удаление промежуточных файлов на сервере

                    let lv_url = "https://localhost:7095/CalcJBModel?method=" + Constants.method_delete_model_parts +
                        "&filename=" + lo_active_side.model_prefix_filename
                        + "&chdata=" + Math.random().toString(); // 23112024
                    ;

                    get_delete_on_server_model_parts(lv_url)
                    async function get_delete_on_server_model_parts(pv_url) {
                        //--------------------------------------------------
                        await $.get(pv_url);
                    }


                    lo_active_side.animate_mod();

                    ////}, delayInMilliseconds);

                }

            }


            catch (e) {

                alert('error oncomplete_read_model_part: ' + e.stack);

            }


        }



        //------------------------------------------------------------------------
        Shape_generator.prototype.do_before_after_model_request = function (pv_is_before, pv_is_build_model) {

            try {

                let lo_active_side = get_active_side_shape_generator();
                let lo_passive_side = get_passive_side_shape_generator();

                if (pv_is_before) {

                    $('#up_id_div_visual_model').css('opacity', 0.3);// прозрачность контента
                    $('#lateral_id_div_visual_model').css('opacity', 0.3);// прозрачность контента

                    $('#up_id_loading_indicator').show();// индикация ожидани
                    $('#lateral_id_loading_indicator').show();// индикация ожидания
                    $('#up_id_loading_indicator').css('opacity', 1);// индикация ожидания
                    $('#lateral_id_loading_indicator').css('opacity', 1);// индикация ожидания


                    lo_active_side.is_building_model = true;
                    lo_passive_side.is_building_model = true;

                    lo_active_side.rotate_status = type_rotate_mode.stop; // None; // выключить вращение модели
                    lo_active_side.set_visible_rotate_controls(false); // сделать невидимым контрол  - слайд расстояния между деталями
                    $(lo_active_side.id_prefix + 'id_dist_part_slider').slider('value', 0);

                    lo_active_side.common_func.clear_group_childrens(lo_active_side.group_parts_mod);
                    lo_active_side.controls_mod.reset();


                    lo_active_side.progress_bar.div_progressbar.fadeIn();//26112024



                    //24112024 {
                    lo_passive_side.rotate_status = type_rotate_mode.stop; // None; // выключить вращение модели
                    lo_passive_side.set_visible_rotate_controls(false); // сделать невидимым контрол  - слайд расстояния между деталями
                    $(lo_passive_side.id_prefix + 'id_dist_part_slider').slider('value', 0);

                    lo_passive_side.common_func.clear_group_childrens(lo_passive_side.group_parts_mod);
                    lo_passive_side.controls_mod.reset();
                    //24112024 }
                }

                else {

                    // after

                    /////lo_active_side.common_func.clear_group_childrens(lo_active_side.group_parts_mod);

                    $('#up_id_div_visual_model').css('opacity', 1);// прозрачность контента
                    $('#lateral_id_div_visual_model').css('opacity', 1);// прозрачность контента

                    $('#up_id_loading_indicator').hide();// прекращение индикации ожидания
                    $('#lateral_id_loading_indicator').hide();// прекращение индикации ожидания


                    lo_active_side.model_params_changed = false;
                    lo_passive_side.model_params_changed = false;
                    lo_active_side.is_building_model = false;
                    lo_passive_side.is_building_model = false;


                    if (pv_is_build_model) {
                        lo_active_side.set_visible_rotate_controls(true); // сделать видимым контрол  - слайд расстояния между деталями
                        lo_active_side.rotate_status = type_rotate_mode.clockwise; // включить вращение модели
                    }
                    else {
                        lo_active_side.set_visible_rotate_controls(false); // сделать невидимым контрол  - слайд расстояния между деталями
                        lo_active_side.rotate_status = type_rotate_mode.stop; // выключить вращение модели
                    }

                    lo_active_side.common_func.set_group_to_center(lo_active_side.group_parts_mod);

                    if (lo_active_side.progress_bar.div_progressbar) {
                        lo_active_side.progress_bar.div_progressbar.fadeOut();//26112024
                    }

                    //24112024 {

                    if (pv_is_build_model) {
                        lo_passive_side.set_visible_rotate_controls(true); // сделать видимым контрол  - слайд расстояния между деталями
                        lo_passive_side.rotate_status = type_rotate_mode.clockwise; // включить вращение модели
                    }
                    else {
                        lo_passive_side.set_visible_rotate_controls(false); // сделать невидимым контрол  - слайд расстояния между деталями
                        lo_passive_side.rotate_status = type_rotate_mode.stop; // выключить вращение модели
                    }

                    lo_passive_side.common_func.set_group_to_center(lo_passive_side.group_parts_mod);
                    //24112024 }



                }
            }

            catch (e) {

                alert('error do_before_after_model_request: ' + e.stack);

            }


        }


        ////////-------------------------------------------------------------------
        //////Shape_generator.prototype.on_load_read_model_part = function (geometry_mod) {



        //////    let lo_active_side = get_active_side_shape_generator();
        //////    let lo_passive_side = get_passive_side_shape_generator();

        //////    geometry_mod.center();// Объект - в центре вращения



        //////    //////////////////////const dirLight2 = new THREE.DirectionalLight(0xccccff, 3);
        //////    //////////////////////dirLight2.position.set(- 1, 0.75, - 0.5);
        //////    //////////////////////lo_active_side.scene_mod.add(dirLight2);


        //////    //const material_mod = new THREE.MeshPhongMaterial(/*{ color: 0x555555 }*/);


        //////    //const material_mod = new THREE.MeshPhongMaterial({
        //////    //    specular: 0x444444,
        //////    //    //map: decalDiffuse,
        //////    //    //normalMap: decalNormal,
        //////    //    normalScale: new THREE.Vector2(1, 1),
        //////    //    shininess: 30,
        //////    //    transparent: false, //true,
        //////    //    depthTest: true,
        //////    //    depthWrite: false,
        //////    //    polygonOffset: true,
        //////    //    polygonOffsetFactor: - 4,
        //////    //    wireframe: false //true // false
        //////    //});


        //////    ////const material_mod = new THREE.MeshLambertMaterial({
        //////    ////    //color: 0xffffff,
        //////    ////    color: 0xfff0f0,
        //////    ////    opacity: 0.5,
        //////    ////    //side: THREE.DoubleSide,
        //////    ////    transparent: true
        //////    ////});


        //////    //const material_mod = new THREE.MeshBasicMaterial({
        //////    //    color: 0x00ff00, // черный цвет номера
        //////    //    side: THREE.DoubleSide,
        //////    //    shading: THREE.FlatShading
        //////    //});



        //////    ////camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100);
        //////    ////camera.position.set(1, 2, - 3);
        //////    ////camera.lookAt(0, 1, 0);
        //////    //var material_mod = new THREE.MeshBasicMaterial({ vertexColors: THREE.FaceColors });
        //////    ///const material_mod = new THREE.MeshPhongMaterial({ color: 0xcbcbcb, depthWrite: false }) 

        //////    //////let materialFront = new THREE.MeshBasicMaterial({ color: new THREE.Color(Math.random() * 0xffffff) });
        //////    //////let materialSide = new THREE.MeshBasicMaterial({ color: new THREE.Color(Math.random() * 0x00ffff) });

        //////    //////let materialArray = [materialFront, materialSide];
        //////    //////let material_mod = new THREE.MeshLambertMaterial(materialArray);


        //////    //const dirLight = new THREE.DirectionalLight(0xffffff, 3);
        //////    //dirLight.position.set(- 3, 10, - 10);
        //////    //dirLight.castShadow = true;
        //////    //dirLight.shadow.camera.top = 2;
        //////    //dirLight.shadow.camera.bottom = - 2;
        //////    //dirLight.shadow.camera.left = - 2;
        //////    //dirLight.shadow.camera.right = 2;
        //////    //dirLight.shadow.camera.near = 0.1;
        //////    //dirLight.shadow.camera.far = 40;
        //////    //lo_active_side.scene_mod.add(dirLight);



        //////    //=========================================================================
        //////    const mesh_mod = new THREE.Mesh(geometry_mod, lo_active_side.material_mod);

        //////    lo_active_side.scene_mod.add(mesh_mod);


        //////    $('#up_id_loading_indicator').hide();// прекращение индикации ожидания
        //////    $('#lateral_id_loading_indicator').hide();// прекращение индикации ожидания


        //////    lo_active_side.animate_mod();

        //////    lo_active_side.is_building_model = false;
        //////    lo_passive_side.is_building_model = false;


        //////}




        //------------------------------------------------------------------------
        Shape_generator.prototype.animate_mod = function () {

            //return;//15122024

            let lo_active_side = get_active_side_shape_generator();

            ////07012025 {
            //if (!lo_active_side) {
            //    return;
            //}
            ////07012025 }


            let lv_slider_value = 0;
            //let lv_delta_slider_value = 0;

            if (lo_active_side) {

                lv_slider_value = $(lo_active_side.id_prefix + "id_dist_part_slider").slider('value');

                //lv_delta_slider_value = lv_slider_value - lo_active_side.slider_value_prev;
                //lo_active_side.common_func.move_details_from_to_center(lo_active_side.group_parts_mod, lv_delta_slider_value);

                //lv_delta_slider_value = lv_slider_value - lo_active_side.slider_value_prev;
                lo_active_side.common_func.move_details_from_to_center(lo_active_side.group_parts_mod, lv_slider_value);


                //lo_active_side.slider_value_prev = lv_slider_value;

                //requestAnimationFrame(lo_active_side.animate_mod);




                //07012025 {
                if (!lo_active_side) {
                    return;
                }
                //07012025 }

                setTimeout(function () {
                    //07012025 {
                    if (!lo_active_side) {
                        return;
                    }
                    //07012025 }

                    requestAnimationFrame(lo_active_side.animate_mod);
                    lo_active_side.render_mod();

                }, 200); // 100);

            }
            else {

                if (this) { //08012025

                    lv_slider_value = $(this.id_prefix + "id_dist_part_slider").slider('value');
                    //lv_delta_slider_value = lv_slider_value - this.slider_value_prev;

                    //this.common_func.move_details_from_to_center(this.group_parts_mod, lv_delta_slider_value);
                    this.common_func.move_details_from_to_center(this.group_parts_mod, lv_slider_value);


                    setTimeout(function () {
                        requestAnimationFrame(this.animate_mod);
                        this.render_mod();

                    }, 200); // 100);

                }
            }


        }


        //------------------------------------------------------------------------
        Shape_generator.prototype.render_mod = function () {

            try {

                let lo_active_side = get_active_side_shape_generator();

                //07012025 {
                if (!lo_active_side) {
                    return;
                }
                //07012025 }

                if (lo_active_side.my_prefix != gc_id_prefix_end) { // 06122024


                    if (lo_active_side) {

                        lo_active_side.common_func.model_rotation(lo_active_side.group_parts_mod);

                        lo_active_side.renderer_mod.render(lo_active_side.scene_mod, lo_active_side.camera_mod);



                    }
                }
            }

            catch (e) {

                alert('error render_mod: ' + e.stack);

            }
        }


        //------------------------------------------------------------------------
        Shape_generator.prototype.reset_event_handlers = function (po_side) {

            try {

                //let lo_active_side_shape_generator = get_active_side_shape_generator();
                //let lo_passive_side_shape_generator = get_passive_side_shape_generator();

                $(document).off('click  change pointerdown pointerup pointermove');//17062024
                $(window).off('resize dblclick doubleclick mousemove');
                $(window).off('resize dblclick doubleclick mousemove');
                $(window).off('resize dblclick doubleclick mousemove');

                $(document).unbind('click change pointerdown pointerup pointermove');//17062024
                $(window).unbind('resize dblclick mousemove');

                if (po_side) {

                    if (po_side.controls) {

                        if (po_side.render) {
                            po_side.controls.removeEventListener('change', po_side.render);// очистка обработчика событий
                        }
                    }

                    //if (this.render) {
                    //    po_side.controls.removeEventListener('change', this.render);// очистка обработчика событий
                    //}

                }

                //if (po_side.controls) {
                //    po_side.controls.addEventListener('change', po_side.render);
                //}


                // очистка обработчиков событий
                $(this.passive_id_prefix + "id_but_read_model").off("click");
                $(this.passive_id_prefix + "id_but_refresh").off("click");
                $(this.passive_id_prefix + "id_chb_space_adjust").off("click");
                $(this.passive_id_prefix + "id_chb_curve_width_adjust").off("click");
                $(this.passive_id_prefix + "id_but_del_spline").off("click");
                $(this.passive_id_prefix + "id_but_add_spline").off("click");
                $(this.passive_id_prefix + "id_but_save_model").off("click");
                $(this.passive_id_prefix + "id_but_make_model").off("click");
                $(this.passive_id_prefix + "id_but_set_color").off("click");
                $(this.passive_id_prefix + "id_but_rotate_mode").off("click");



                //$(this.id_prefix + "id_chb_space_adjust").off("click").click(this.onclick_chb_space_adjust);
                //$(this.id_prefix + "id_chb_curve_width_adjust").off("click").click(this.onclick_chb_curve_width_adjust);

                //$(this.id_prefix + "id_but_read_model").off("click").click(this.onclick_read_model);

                //$(this.id_prefix + "id_but_del_spline").off("click").click(this.onclick_del_spline);
                //$(this.id_prefix + "id_but_add_spline").off("click").click(this.onclick_add_spline);
                //$(this.id_prefix + "id_but_save_model").off("click").click(this.onclick_save_model);
                //$(this.id_prefix + "id_but_make_model").off("click").click(this.onclick_make_model);
                //$(this.id_prefix + "id_but_set_color").off("click").click(this.onclick_id_but_set_color);
                //$(this.id_prefix + "id_but_rotate_mode").off("click").click(this.onclick_id_but_rotate_mode);

                //$(this.id_prefix + "id_but_refresh").off("click").click(this.onclick_refresh_model);

                //$(this.id_prefix + this.id_side_shape).off("dblclick").dblclick(this.ondblclick_id_shape);//17062024
                //$(this.id_prefix + this.id_side_shape_mod).off("dblclick").dblclick(this.ondblclick_id_shape);//25082024
                //$(this.id_prefix + this.id_side_shape).dblclick(null);
                //$(this.id_prefix + this.id_side_shape_mod).dblclick(null);//25082024

                //--------------------------------------------------------------------------------------------

                ////// обработчики событий gui


                //}
                //--------------------------------------------------------------------------------------------


                // очистка обработчиков событий
                document.removeEventListener('pointerdown', this.onPointerDown);
                document.removeEventListener('pointerup', this.onPointerUp);
                //document.addEventListener('pointermove', null);
                window.removeEventListener('resize', this.onWindowResize);
                window.removeEventListener('mousemove', this.onmousemove);

                $(this.id_prefix + this.id_side_shape).dblclick(null);//17062024 

                //if (lo_passive_side_shape_generator) {
                //    document.removeEventListener('pointerdown', lo_passive_side_shape_generator.onPointerDown);

                //    document.removeEventListener('pointerup', lo_passive_side_shape_generator.onPointerUp);
                //    //document.addEventListener('pointermove', null);
                //    window.removeEventListener('resize', lo_passive_side_shape_generator.onWindowResize);
                //    window.removeEventListener('mousemove', lo_passive_side_shape_generator.onmousemove);

                //    $(this.id_prefix + this.id_side_shape).off("dblclick").dblclick(lo_passive_side_shape_generator.ondblclick_id_shape);//17062024
                //    $(this.id_prefix + this.id_side_shape).dblclick(null);//17062024 

                //}


                if (po_side) {
                    document.removeEventListener('pointerdown', po_side.onPointerDown);
                    document.removeEventListener('pointerup', po_side.onPointerUp);
                    //document.addEventListener('pointermove', null);
                    window.removeEventListener('resize', po_side.onWindowResize);
                    window.removeEventListener('mousemove', po_side.onmousemove);

                }


                //17062024 {




                //document.addEventListener('pointerdown', this.onPointerDown);
                //document.addEventListener('pointerup', this.onPointerUp);
                ////document.addEventListener('pointermove', onPointerMove);
                //window.addEventListener('resize', this.onWindowResize);
                //window.addEventListener('mousemove', this.onmousemove);
                ////////////////////window.addEventListener('dblclick', this.ondblclick_id_shape);//17062024

                ////window.addEventListener('click', window_onclick	);
                //$(this.passive_id_prefix + this.id_side_shape).off("click");
                //$(this.passive_id_prefix + "id_but_mirror").off("click");

                //$(this.id_prefix + this.id_side_shape).off("click").on("click", this.onclick_shape);//17072024 

                //$(this.id_prefix + "id_but_mirror").off("click").on("click", this.but_mirror_onclick);


                ////this.render();//05052024
                //lo_active_side_shape_generator.onWindowResize();//21062024




                // 05012025 this.render_mod();





                ////--------------------------------------------------------------------
                //// наблюдатель за изменением цвета элемента

                //// Создание экземпляра MutationObserver
                //const observer = new MutationObserver(this.common_func.handleColorChange);

                //// Целевой элемент, за которым нужно следить
                //const targetElement = document.getElementById(this.id_prefix_wo_sharp + "id_for_colorpicker");

                //// Параметры наблюдения
                //const config = { attributes: true, attributeFilter: ['style'] };

                //// Начало наблюдения за целевым элементом
                //observer.observe(targetElement, config); //, lf_callback);

                ////--------------------------------------------------------------------


            }
            catch (e) {

                alert('error reset_event_handlers: ' + e.stack);

            }

        }



        //------------------------------------------------------------------------
        Shape_generator.prototype.init_event_handlers = function () {

            try {

                let lo_active_side_shape_generator = get_active_side_shape_generator();
                let lo_passive_side_shape_generator = get_passive_side_shape_generator();

                //17062024 $(document).off('click doubleclick change pointerdown pointerup pointermove');
                $(document).off('click  change pointerdown pointerup pointermove');//17062024
                $(window).off('resize dblclick doubleclick mousemove');
                $(window).off('resize dblclick doubleclick mousemove');
                $(window).off('resize dblclick doubleclick mousemove');

                //17062024 $(document).unbind('click doubleclick change pointerdown pointerup pointermove');
                $(document).unbind('click change pointerdown pointerup pointermove');//17062024
                $(window).unbind('resize dblclick mousemove');

                if (lo_passive_side_shape_generator) {

                    if (lo_passive_side_shape_generator.controls) {
                        lo_passive_side_shape_generator.controls.removeEventListener('change', this.render);// очистка обработчика событий
                        lo_passive_side_shape_generator.controls.removeEventListener('change', lo_passive_side_shape_generator.render);// очистка обработчика событий
                    }

                }

                if (this.controls) {
                    this.controls.addEventListener('change', this.render);
                }


                // очистка обработчиков событий
                $(this.passive_id_prefix + "id_but_read_model").off("click");


                $(this.passive_id_prefix + "id_but_refresh").off("click");

                $(this.passive_id_prefix + "id_chb_space_adjust").off("click");
                $(this.passive_id_prefix + "id_chb_curve_width_adjust").off("click");
                $(this.passive_id_prefix + "id_but_del_spline").off("click");
                $(this.passive_id_prefix + "id_but_add_spline").off("click");
                $(this.passive_id_prefix + "id_but_save_model").off("click");
                $(this.passive_id_prefix + "id_but_make_model").off("click");
                $(this.passive_id_prefix + "id_but_set_color").off("click");

                $(this.passive_id_prefix + "id_but_rotate_mode").off("click");



                $(this.id_prefix + "id_chb_space_adjust").off("click").click(this.onclick_chb_space_adjust);
                $(this.id_prefix + "id_chb_curve_width_adjust").off("click").click(this.onclick_chb_curve_width_adjust);

                $(this.id_prefix + "id_but_read_model").off("click").click(this.onclick_read_model);

                $(this.id_prefix + "id_but_del_spline").off("click").click(this.onclick_del_spline);
                $(this.id_prefix + "id_but_add_spline").off("click").click(this.onclick_add_spline);
                $(this.id_prefix + "id_but_save_model").off("click").click(this.onclick_save_model);
                $(this.id_prefix + "id_but_make_model").off("click").click(this.onclick_make_model);
                $(this.id_prefix + "id_but_set_color").off("click").click(this.onclick_id_but_set_color);
                $(this.id_prefix + "id_but_rotate_mode").off("click").click(this.onclick_id_but_rotate_mode);

                $(this.id_prefix + "id_but_refresh").off("click").click(this.onclick_refresh_model);

                $(this.id_prefix + this.id_side_shape).off("dblclick").dblclick(this.ondblclick_id_shape);//17062024
                $(this.id_prefix + this.id_side_shape_mod).off("dblclick").dblclick(this.ondblclick_id_shape);//25082024
                $(this.id_prefix + this.id_side_shape).dblclick(null);
                $(this.id_prefix + this.id_side_shape_mod).dblclick(null);//25082024

                //--------------------------------------------------------------------------------------------

                ////// обработчики событий gui


                //}
                //--------------------------------------------------------------------------------------------


                // очистка обработчиков событий
                document.removeEventListener('pointerdown', this.onPointerDown);



                document.removeEventListener('pointerup', this.onPointerUp);
                //document.addEventListener('pointermove', null);
                window.removeEventListener('resize', this.onWindowResize);
                window.removeEventListener('mousemove', this.onmousemove);

                $(this.id_prefix + this.id_side_shape).dblclick(null);//17062024 

                if (lo_passive_side_shape_generator) {
                    document.removeEventListener('pointerdown', lo_passive_side_shape_generator.onPointerDown);

                    document.removeEventListener('pointerup', lo_passive_side_shape_generator.onPointerUp);
                    //document.addEventListener('pointermove', null);
                    window.removeEventListener('resize', lo_passive_side_shape_generator.onWindowResize);
                    window.removeEventListener('mousemove', lo_passive_side_shape_generator.onmousemove);

                    $(this.id_prefix + this.id_side_shape).off("dblclick").dblclick(lo_passive_side_shape_generator.ondblclick_id_shape);//17062024
                    $(this.id_prefix + this.id_side_shape).dblclick(null);//17062024 

                }

                //17062024 {

                if (lo_active_side_shape_generator) {
                    document.removeEventListener('pointerdown', lo_active_side_shape_generator.onPointerDown);
                    document.removeEventListener('pointerup', lo_active_side_shape_generator.onPointerUp);
                    //document.addEventListener('pointermove', null);
                    window.removeEventListener('resize', lo_active_side_shape_generator.onWindowResize);
                    window.removeEventListener('mousemove', lo_active_side_shape_generator.onmousemove);
                    ////    window.removeEventListener('dblclick', lo_active_side_shape_generator.ondblclick_id_shape);//17062024
                    ////    window.addEventListener('dblclick', null);//17062024

                }


                //17062024 {




                document.addEventListener('pointerdown', this.onPointerDown);

                document.addEventListener('pointerup', this.onPointerUp);
                //document.addEventListener('pointermove', onPointerMove);
                window.addEventListener('resize', this.onWindowResize);
                window.addEventListener('mousemove', this.onmousemove);
                //////////////////window.addEventListener('dblclick', this.ondblclick_id_shape);//17062024

                //window.addEventListener('click', window_onclick	);
                $(this.passive_id_prefix + this.id_side_shape).off("click");
                $(this.passive_id_prefix + "id_but_mirror").off("click");

                $(this.id_prefix + this.id_side_shape).off("click").on("click", this.onclick_shape);//17072024 

                $(this.id_prefix + "id_but_mirror").off("click").on("click", this.but_mirror_onclick);


                //this.render();//05052024
                lo_active_side_shape_generator.onWindowResize();//21062024




                // 05012025 this.render_mod();





                //--------------------------------------------------------------------
                // наблюдатель за изменением цвета элемента

                // Создание экземпляра MutationObserver
                const observer = new MutationObserver(this.common_func.handleColorChange);

                // Целевой элемент, за которым нужно следить
                const targetElement = document.getElementById(this.id_prefix_wo_sharp + "id_for_colorpicker");

                // Параметры наблюдения
                const config = { attributes: true, attributeFilter: ['style'] };

                // Начало наблюдения за целевым элементом
                observer.observe(targetElement, config); //, lf_callback);

                //--------------------------------------------------------------------


            }
            catch (e) {

                alert('error init_event_handlers: ' + e.stack);

            }

        }
        //------------------------------------------------------------------------
        Shape_generator.prototype.set_visible_rotate_controls = function (pv_is_visible) {

            try {

                if (pv_is_visible) {

                    $("#up_id_dist_part_slider").css("visibility", "visible");
                    $("#lateral_id_dist_part_slider").css("visibility", "visible");
                }
                else {

                    $("#up_id_dist_part_slider").css("visibility", "hidden");
                    $("#lateral_id_dist_part_slider").css("visibility", "hidden");
                }



            }

            catch (e) {

                alert('error switch_visible_rotate_controls: ' + e.stack);

            }

        }
        //------------------------------------------------------------------------
        Shape_generator.prototype.onclick_id_but_rotate_mode = function () {

            try {

                let lo_active_side = get_active_side_shape_generator();

                if (lo_active_side.rotate_status > 3) {
                    lo_active_side.rotate_status = 0;
                }
                lo_active_side.rotate_status++;

            }

            catch (e) {

                alert('error onclick_id_but_rotate_mode: ' + e.stack);

            }

        }
        //------------------------------------------------------------------------
        Shape_generator.prototype.onclick_id_but_set_color = function () {

            try {

                let lo_active_side = get_active_side_shape_generator();

                //for (let lv_i = 0; lv_i < this.ar_splines.length; lv_i++) {


                //lo_active_side_shape_generator.shapes.get_left_and_right_splines_of_clicked_figure();


                ////lo_active_side_shape_generator.shapes.set_shape_color(
                ////    lo_active_side_shape_generator.shapes.ar_splines[0].children[3],
                ////    lo_active_side_shape_generator.shapes.ar_splines[1].children[3],
                ////    0x00ff00);



                ////lo_active_side_shape_generator.shapes.draw_contour_and_shape(
                ////    lo_active_side_shape_generator.shapes.ar_splines[0].children[3],
                ////    lo_active_side_shape_generator.shapes.ar_splines[1].children[3]);






                ////lo_active_side_shape_generator.camera.updateProjectionMatrix();
                ////lo_active_side_shape_generator.render();



                ////for (let lv_i = 0; lv_i < lo_active_side_shape_generator.ar_selected_segments.length; lv_i++) {

                ////    let lo_selected_segment = lo_active_side_shape_generator.ar_selected_segments[lv_i];

                ////    if (lo_selected_segment.parent) {

                ////        let lo_colored_chape = this.get_shape_by_group();

                ////        let lo_colored_chape = lo_selected_segment.parent.parent;

                ////        lo_active_side_shape_generator.shapes.set_shape_color("00ff00");

                ////        //this.ar_selected_segments[lv_i] = this.make_mirror_segment(lo_selected_segment);//23042024
                ////        //lar_selected_spline_groups.push(lo_parent_parent);
                ////    }
                ////}









                ////////$("#id_empty_div_for_colorpick").click();



                ////////08072024 {


                //////let lo_active_side_shape_generator = get_active_side_shape_generator();
                ////////let lv_id_colored_shape = lo_active_side_shape_generator.id_prefix + "id_shape";
                //////let lv_id_colored_shape = lo_active_side_shape_generator.id_prefix + "id_shg_right";


                /////$("#up_id_my_gui_1").colorPicker({ showHexField: false, onColorChange: function (id, newValue) { alert("id=" + id + " value= " + newValue) } });
                ///$("#up_id_for_colorpicker").colorPicker({ showHexField: false, onColorChange: function (id, newValue) { alert("id=" + id + " value= " + newValue) } });


                let lv_id_for_colorpicker = lo_active_side.id_prefix + "id_for_colorpicker";
                ///$(lv_id_for_colorpicker).colorPicker({ showHexField: false, onColorChange: function (id, newValue) { alert("id=" + id + " value= " + newValue) } });
                let lv_colorPicker_palette = "#colorPicker_palette-0";


                //////////$(lv_id_colored_shape).change(function () {
                //////////    alert("color changed");
                //////////});



                ////////$.fn.colorPicker.togglePalette($(lv_colorPicker_palette), $(lv_id_colored_shape));

                ///$.fn.colorPicker.togglePalette($(lv_colorPicker_palette), $("#id_empty_div_for_colorpick"));
                //$.fn.colorPicker.togglePalette($(lv_colorPicker_palette), $("#up_id_my_gui_1"));
                //$.fn.colorPicker.togglePalette($(lv_colorPicker_palette), $("#up_id_shg_right"));


                //$.fn.colorPicker.togglePalette($(lv_colorPicker_palette), $("#up_id_for_colorpicker"));
                $.fn.colorPicker.togglePalette($(lv_colorPicker_palette), $(lv_id_for_colorpicker));



            }
            catch (e) {

                alert('error init_event_handlers: ' + e.stack);

            }

        }



        //------------------------------------------------------------------------
        Shape_generator.prototype.onColorChange = function (pv_value) {

            let lo_active_side = get_active_side_shape_generator();


            let lar_splines_order = [];

            let lv_num_spline_left = null;
            let lv_num_spline_right = null;

            let lo_spline_left = null;
            let lo_spline_right = null;

            let lv_hexColor = null;


            try {

                while (true) {

                    lv_hexColor = lo_active_side.common_func.rgbToNumber(pv_value);


                    if (lo_active_side.my_prefix == gc_id_prefix_end) { //"end_shape"

                        let lo_handled_cell = go_end_side_shape_generator.end_shape.set_color_to_selected_rectangle_cells(pv_value);

                        if (lo_handled_cell == null) {
                            return;
                        }

                        // Установка цвета фигуры на сторонах, если есть нулевая ячейка на конце

                        if (lo_handled_cell.cell_num_row == 0) {

                            // Установка цвета фигур верхней стороны
                            if (lo_handled_cell.cell_num_col == 0) {
                                lv_num_spline_left = null;
                                lv_num_spline_right = 0;
                            }
                            if (lo_handled_cell.cell_num_col > 0) {
                                lv_num_spline_left = lo_handled_cell.cell_num_col - 1;
                                lv_num_spline_right = lo_handled_cell.cell_num_col;
                            }

                            lar_splines_order = go_up_side_shape_generator.shapes.SortSplinesOrderFromLeftToRight();

                            lo_spline_left = go_up_side_shape_generator.common_func.getSplineByNumber(lar_splines_order, lv_num_spline_left);
                            lo_spline_right = go_up_side_shape_generator.common_func.getSplineByNumber(lar_splines_order, lv_num_spline_right);

                            go_up_side_shape_generator.shapes.draw_contour_and_shape(lv_hexColor, lo_spline_left, lo_spline_right, false, true, false, true);
                        }

                        //05012025 if (lo_handled_cell.cell_num_col == 0) {

                        let lv_ncol_max = go_end_side_shape_generator.end_shape.ColorParts[0].length - 1;
                        if (lo_handled_cell.cell_num_col == lv_ncol_max) {

                            // Установка цвета фигур боковой стороны

                            if (lo_handled_cell.cell_num_row == 0) {

                                lv_num_spline_left = null;
                                lv_num_spline_right = 0;
                                //lv_num_spline_left = lv_ncol_max;
                                //lv_num_spline_right = null;


                            }
                            if (lo_handled_cell.cell_num_row > 0) {
                                //if (lo_handled_cell.cell_num_row < lv_ncol_max) {
                                lv_num_spline_left = lo_handled_cell.cell_num_row - 1;
                                lv_num_spline_right = lo_handled_cell.cell_num_row;
                            }

                            lar_splines_order = go_lateral_side_shape_generator.shapes.SortSplinesOrderFromLeftToRight();

                            lo_spline_left = go_lateral_side_shape_generator.common_func.getSplineByNumber(lar_splines_order, lv_num_spline_left);
                            lo_spline_right = go_lateral_side_shape_generator.common_func.getSplineByNumber(lar_splines_order, lv_num_spline_right);
                            go_lateral_side_shape_generator.shapes.draw_contour_and_shape(lv_hexColor, lo_spline_left, lo_spline_right, false, true, false, true);
                        }

                        break;
                    }


                    if (lo_active_side.group_contours.userData) {

                        if (lo_active_side.group_contours.userData.num_spline_left != null || lo_active_side.group_contours.userData.num_spline_right != null) {

                            //let lar_splines_order = [];
                            lar_splines_order = lo_active_side.shapes.SortSplinesOrderFromLeftToRight();

                            lv_num_spline_left = lo_active_side.group_contours.userData.num_spline_left;
                            lv_num_spline_right = lo_active_side.group_contours.userData.num_spline_right;


                            lo_spline_left = lo_active_side.common_func.getSplineByNumber(lar_splines_order, lv_num_spline_left);
                            lo_spline_right = lo_active_side.common_func.getSplineByNumber(lar_splines_order, lv_num_spline_right);

                            ///lv_hexColor = lo_active_side.common_func.rgbToNumber(pv_value);

                            lo_active_side.shapes.draw_contour_and_shape(lv_hexColor, lo_spline_left, lo_spline_right, false, true, false, true);


                            // установка цвета ячейки на торце
                            let lv_cell_num_row = 0;
                            let lv_cell_num_col = 0;



                            let lv_num_cell = 0;

                            if (lv_num_spline_left == null) {

                                lv_num_cell = 0;
                            }
                            else {

                                lv_num_cell = lv_num_spline_left + 1;

                            }


                            switch (lo_active_side.my_prefix) {

                                case gc_id_prefix_up:
                                    lv_cell_num_row = 0;
                                    lv_cell_num_col = lv_num_cell;// + 1;
                                    break;

                                case gc_id_prefix_lateral:
                                    lv_cell_num_row = lv_num_cell;// + 1;
                                    //05012025 lv_cell_num_col = 0;
                                    lv_cell_num_col = go_end_side_shape_generator.end_shape.ColorParts[0].length - 1; //05012025

                                    break;
                            }

                            go_end_side_shape_generator.end_shape.set_color_to_rectangle_cell(lv_hexColor, lv_cell_num_row, lv_cell_num_col);


                        }
                    }

                    break;
                } // while true

                lo_active_side.render();

            }
            catch (e) { //21122024

                alert('error onColorChange: ' + e.stack);

            }
        }


        //------------------------------------------------------------------------
        Shape_generator.prototype.but_mirror_onclick = function () {

            // Сделать зеркальное отражение выделенных сегментов
            let lo_active_side = get_active_side_shape_generator();
            lo_active_side.shapes.make_mirror_selected_segments();


            //////////////////////////let lar_splines_order = [];
            //////////////////////////lar_splines_order = lo_active_side.shapes.SortSplinesOrderFromLeftToRight();
            //////////////////////////lo_active_side.shapes.redraw_meshes_color(lar_splines_order);


            ////05082024 {
            //lo_active_side.shapes.clear_group_contours();

            //if (lo_active_side.group_contours.userData !== null) {

            //    let lo_splines = {
            //        spline_left: lo_active_side.group_contours.userData.spline_left,
            //        spline_right: lo_active_side.group_contours.userData.spline_right
            //    };
            //    lo_active_side.shapes.select_shape_contour(lo_splines);
            //}
            ////05082024 }


            lo_active_side.shapes.adjust_splines_by_external_shape();

            //lo_active_side.camera.updateProjectionMatrix();

            //27112024 lo_active_side.model_params_changed = true; // признак изменения параметров модели

            lo_active_side.render();

        }



        //------------------------------------------------------------------------
        Shape_generator.prototype.adjust_splines_by_shape_in_side = function (po_side, pv_value) {


            //po_side.params.shape_height = pv_value;

            //05112024 let lv_scale = pv_value / po_side.params.shape_height_beg;
            //05112024 let lv_scale = pv_value / po_side.params.shape_height;//05112024

            let lv_scale = pv_value / po_side.rectangle.shape_height;//05112024


            po_side.rectangle.shape.scale.y = lv_scale;

            //13122024 po_side.render();


            po_side.segment_transform_data = po_side.segments.get_segment_transform_data(
                /* po_side.segment_gabarits, 02112024 */
                po_side.params.ajust_curves_by_shape);


            if (po_side.params.is_space_adjust) {
                po_side.shapes.adjust_splines_by_external_shape(pv_value);
            }

            po_side.render();//13122024 

        }


        //------------------------------------------------------------------------
        Shape_generator.prototype.onFinishChange_param = function (pv_value) {


            let lo_active_side = get_active_side_shape_generator();


            if (lo_active_side.is_big_window) {
                $(lo_active_side.id_prefix + "id_shg_right_top").draggable("enable");//22062024
                $(lo_active_side.id_prefix + lo_active_side.id_side_shape_mod).draggable("enable");//26082024

            }

        }



        //------------------------------------------------------------------------
        Shape_generator.prototype.onChange_shape_height = function (pv_value) {

            let lo_active_side = get_active_side_shape_generator();
            let lo_passive_side = get_passive_side_shape_generator();

            //30102024 {
            if (lo_active_side.shapes == null) {
                return;
            }

            if (lo_passive_side.shapes == null) {
                return;
            }
            //30102024 }

            //30102024 if (lo_passive_side) {
            if (typeof lo_passive_side.gui != "undefined" && lo_passive_side.gui) {
                lo_passive_side.params.shape_height = pv_value;
                CommonFunc.prototype.guiUpdateDisplay(lo_passive_side.gui);
                lo_passive_side.adjust_splines_by_shape_in_side(lo_passive_side, pv_value);
            }

            //}


            if (lo_active_side.is_big_window) {
                $(lo_active_side.id_prefix + "id_shg_right_top").draggable("disable");
                $(lo_active_side.id_prefix + lo_active_side.id_side_shape_mod).draggable("disable");

            }


            lo_active_side.params.shape_height = pv_value;
            CommonFunc.prototype.guiUpdateDisplay(lo_active_side.gui);

            //if (lo_active_side.params.is_space_adjust) {
            lo_active_side.adjust_splines_by_shape_in_side(lo_active_side, pv_value);
            //}

            //27112024 lo_active_side.model_params_changed = true; // признак изменения параметров модели

            //03012025 {
            ////go_end_side_shape_generator.end_shape.redraw_end_shape(
            ////    this,       //this.main,
            ////    null, null, //pv_added_spline_num, pv_deleted_spline_num,
            ////    null, null  //po_is_use_data, po_sides_data
            ////);
            //03012025 }
        }


        //------------------------------------------------------------------------
        Shape_generator.prototype.onChange_shape_width = function (pv_value) {

            let lo_active_side = get_active_side_shape_generator();
            let lo_passive_side = get_passive_side_shape_generator();

            if (lo_active_side.shapes == null) {
                return;
            }

            if (lo_passive_side.shapes == null) {
                return;
            }

            //05112024 let lv_scale = pv_value / lo_active_side.params.shape_width_beg;
            let lv_scale = pv_value / lo_active_side.rectangle.shape_width;

            //06122024 {
            ////// закомментировано - при изменении ширины одной стороны ширина другой не меняется
            ////if (lo_passive_side) {

            ////    if (typeof lo_passive_side.gui !== "undefined" && lo_passive_side.gui) {
            ////        lo_passive_side.params.shape_width = pv_value;
            ////        CommonFunc.prototype.guiUpdateDisplay(lo_passive_side.gui);

            ////        lo_passive_side.rectangle.shape.scale.x = lv_scale;
            ////        lo_passive_side.render();
            ////        if (lo_active_side.params.is_space_adjust) {
            ////            lo_passive_side.shapes.adjust_splines_by_external_shape();
            ////        }


            ////    }

            ////}
            //06122024 }


            if (lo_active_side.is_big_window) {
                $(lo_active_side.id_prefix + "id_shg_right_top").draggable("disable");//22062024
                $(lo_active_side.id_prefix + lo_active_side.id_side_shape_mod).draggable("disable");//26082024

            }

            lo_active_side.params.shape_width = pv_value;
            CommonFunc.prototype.guiUpdateDisplay(lo_active_side.gui);

            lo_active_side.rectangle.shape.scale.x = lv_scale;
            //13122024 lo_active_side.render();


            if (lo_active_side.params.is_space_adjust) {
                lo_active_side.shapes.adjust_splines_by_external_shape();
                /////////lo_active_side.adjust_splines_by_shape_in_side(lo_active_side, pv_value);

            }


            //27112024 lo_active_side.model_params_changed = true; // признак изменения данных модели

            //03012025 {
            ////go_end_side_shape_generator.end_shape.redraw_end_shape(
            ////    this,       //this.main,
            ////    null, null, //pv_added_spline_num, pv_deleted_spline_num,
            ////    null, null  //po_is_use_data, po_sides_data
            ////);
            //03012025 }


            lo_active_side.render(); //13122024

        }


        //------------------------------------------------------------------------
        Shape_generator.prototype.ondblclick_id_shape = function (po_event) {


            try {

                let lo_active_side = get_active_side_shape_generator();


                let lv_id_str; // = lo_active_side.id_prefix + lo_active_side.id_side_shape;
                let lv_id_gui = lo_active_side.id_prefix + lo_active_side.id_gui;

                let lv_id_shape_mod = lo_active_side.id_prefix + lo_active_side.id_side_shape_mod;


                //let lv_shg_common_width = $(lv_id_str).width();


                let lv_side_shape1 = /*"div#" + */ gc_id_prefix_up + "_" + lo_active_side.id_side_shape;
                let lv_side_shape2 = /*"div#" + */ gc_id_prefix_lateral + "_" + lo_active_side.id_side_shape;


                let lv_side_shape_mod1 = /*"div#" +*/ gc_id_prefix_up + "_" + lo_active_side.id_side_shape_mod;
                let lv_side_shape_mod2 = /*"div#" +*/ gc_id_prefix_lateral + "_" + lo_active_side.id_side_shape_mod;


                let lv_prev_width;
                let lv_prev_height;
                let lv_prev_top;
                let lv_prev_left;
                let lv_offset;
                let lv_delta_top;

                switch (po_event.currentTarget.id) {

                    case lv_side_shape1:
                    case lv_side_shape2:

                        lv_id_str = lo_active_side.id_prefix + lo_active_side.id_side_shape;
                        lv_prev_width = lo_active_side.common_prev_width;
                        lv_prev_height = lo_active_side.common_prev_height
                        lv_offset = lo_active_side.offset;
                        lv_prev_top = lo_active_side.prev_top;
                        lv_prev_left = lo_active_side.prev_left;
                        lv_delta_top = 0;



                        break;

                    case lv_side_shape_mod1:
                    case lv_side_shape_mod2:

                        lv_id_str = lo_active_side.id_prefix + lo_active_side.id_side_shape_mod;
                        lv_prev_width = lo_active_side.prev_width_mod;
                        lv_prev_height = lo_active_side.prev_height_mod;
                        lv_offset = lo_active_side.offset_mod;
                        lv_prev_top = lo_active_side.prev_top_mod;
                        lv_prev_left = lo_active_side.prev_left_mod;
                        lv_delta_top = lo_active_side.prev_offsetTop_mod;

                        break;


                    default:
                    // code block
                }


                let lv_shg_common_width = $(lv_id_str).width();




                //25082024 if ((lv_shg_common_width >= lo_active_side.common_prev_width - 10) && (lv_shg_common_width <= lo_active_side.common_prev_width + 10)) {
                if ((lv_shg_common_width >= lv_prev_width - 10) && (lv_shg_common_width <= lv_prev_width + 10)) {

                    lo_active_side.prev_height_mod = $(lv_id_shape_mod).height();




                    lo_active_side.is_big_window = true;

                    $(lv_id_str).width(window.innerWidth);
                    $(lv_id_str).height(window.innerHeight);
                    $(lv_id_str).offset({ top: 0, left: 0 });

                    //$(lo_active_side.id_prefix + "id_shg_right").draggable("enable");
                    $(lo_active_side.id_prefix + "id_shg_right_top").draggable("enable");
                    //$(lo_active_side.id_prefix + lo_active_side.id_side_shape_mod).draggable("enable");//26082024

                    if (lv_id_str !== lv_id_shape_mod) {
                        $(lv_id_shape_mod).draggable("enable");//26082024
                    }
                }
                else {

                    lo_active_side.is_big_window = false;

                    //25082024 {
                    ////$(lv_id_str).width(lo_active_side.common_prev_width);
                    ////$(lv_id_str).height(lo_active_side.common_prev_height + 3);
                    ////$(lv_id_str).offset({ top: lo_active_side.prev_top, left: lo_active_side.prev_left /*- 10*/ });




                    $(lv_id_str).width(lv_prev_width);
                    $(lv_id_str).height(lv_prev_height + 3);
                    $(lv_id_str).offset({ top: lv_prev_top + lv_delta_top, left: lv_prev_left });


                    // восстановление положения инструментальной панели gui
                    // запрещение перемещения инструментальной панели

                    //$(lo_active_side.id_prefix + "id_shg_right").draggable("disable");//22062024
                    $(lo_active_side.id_prefix + "id_shg_right_top").draggable("disable");//22062024

                    //$(lo_active_side.id_prefix + lo_active_side.id_side_shape_mod).draggable("disable");//26082024
                    $(lv_id_shape_mod).draggable("disable");//26082024


                    $(lv_id_gui).css("top", 0);
                    $(lv_id_gui).css("left", 0);


                    $(lv_id_shape_mod).css("top", 0);  //26082024
                    $(lv_id_shape_mod).css("left", 0); //26082024


                    //25082024 }

                    //////// восстановление положения инструментальной панели gui
                    ////////$(lo_active_side.id_prefix + "id_shg_right").draggable("disable");//22062024
                    //////$(lo_active_side.id_prefix + "id_shg_right_top").draggable("disable");//22062024
                    //////$(lv_id_gui).css("top", 0);
                    //////$(lv_id_gui).css("left", 0);


                }

                lo_active_side.onWindowResize();

            }

            catch (e) {

                alert('error ondblclick_id_shape: ' + e.stack);

            }

            return false;
        }

        //------------------------------------------------------------------------
        Shape_generator.prototype.onWindowResize = function () {

            let lo_active_side = get_active_side_shape_generator();

            //if (lo_active_side.my_prefix != gc_id_prefix_end) { // 06122024


            lo_active_side.aspect = lo_active_side.container.clientWidth / lo_active_side.container.clientHeight;
            lo_active_side.renderer.setSize(lo_active_side.container.clientWidth, lo_active_side.container.clientHeight);
            lo_active_side.camera.aspect = lo_active_side.container.clientWidth / lo_active_side.container.clientHeight;
            lo_active_side.camera.updateProjectionMatrix();
            lo_active_side.render();


            //11012025 { if (lo_active_side.my_prefix != gc_id_prefix_end) { // 06122024
            if (lo_active_side.my_prefix == gc_id_prefix_up || lo_active_side.my_prefix == gc_id_prefix_lateral) { // 11012025

                lo_active_side.aspect_mod = lo_active_side.container_mod.clientWidth / lo_active_side.container_mod.clientHeight;
                lo_active_side.renderer_mod.setSize(lo_active_side.container_mod.clientWidth, lo_active_side.container_mod.clientHeight);
                lo_active_side.camera_mod.aspect = lo_active_side.container_mod.clientWidth / lo_active_side.container_mod.clientHeight;
                lo_active_side.camera_mod.updateProjectionMatrix();
                lo_active_side.render_mod();

            }


        }
        //////------------------------------------------------------------------------
        ////Shape_generator.prototype.onChangeCurvesCount = function (po_event, pv_value) {

        ////	go_shape_generator.shapes.redraw_splines_by_count(pv_value);

        ////}
        //////------------------------------------------------------------------------
        ////Shape_generator.prototype.onChangeInputCurvesCount = function (po_event, pv_value) {

        ////	let lv_curves_count = $("#id_CurvesCount")[0].value;
        ////	go_shape_generator.shapes.redraw_splines_by_count(lv_curves_count);

        ////}


        //------------------------------------------------------------------------
        Shape_generator.prototype.onclick_del_spline = function () {

            let lo_active_side = get_active_side_shape_generator();
            lo_active_side.shapes.delete_splines();

        }

        //------------------------------------------------------------------------
        Shape_generator.prototype.onclick_chb_space_adjust = function (po_event, pv_value) {

            let lo_active_side = get_active_side_shape_generator();
            lo_active_side.params.is_space_adjust = $(lo_active_side.id_prefix + "id_chb_space_adjust")[0].checked;//08052024
            lo_active_side.shapes.adjust_splines_by_external_shape();

            //27112024 lo_active_side.model_params_changed = true; // признак изменения параметров модели
            lo_active_side.render(); //13122024 
        }
        //------------------------------------------------------------------------
        Shape_generator.prototype.onclick_chb_curve_width_adjust = function (po_event, pv_value) {

            let lo_active_side = get_active_side_shape_generator();
            lo_active_side.params.is_curve_width_adjust = $(lo_active_side.id_prefix + "id_chb_curve_width_adjust")[0].checked;
            //27112024 lo_active_side.model_params_changed = true; // признак изменения параметров модели

        }

        //------------------------------------------------------------------------
        Shape_generator.prototype.onclick_add_spline = function () {

            try {


                let lo_active_side = get_active_side_shape_generator();
                lo_active_side.shapes.add_spline();

                go_end_side_shape_generator.end_shape.redraw_end_shape(
                    lo_active_side,
                    lo_active_side.shapes.shape_amount_curves - 1, null,    //pv_added_spline_num, pv_deleted_spline_num,
                    null, null                                              //po_is_use_data, po_sides_data
                );

                //27112024 lo_active_side.model_params_changed = true; // признак изменения параметров модели

                lo_active_side.render(); //28122024

            }

            catch (e) {

                alert('error onclick_add_spline: ' + e.stack);

            }
        }
        //------------------------------------------------------------------------
        Shape_generator.prototype.onclick_read_model = function () {


            try {

                let lo_active_side = get_active_side_shape_generator();
                //////////////////////lo_active_side_shape_generator.common_func.save_model(lo_active_side_shape_generator.scene);



                //////////////////////// Перевод фокуса для убирания подсказки кнопки
                //////////////////////$("#id_name_block_settings")[0].focus();// 01082023



                //////////////////////my_main.Set_button_new_set_pressed(false);// Сброс режима создания нового набора настроек
                //////////////////////my_main.Set_button_choice_set_pressed(true);// Установка режима выбора существующих настроек


                //////////////////////$("#id_div_GridSelectBlockSettings").show();


                var lv_path = "/Index?handler=ReadListModels"; //11092022
                lo_active_side.grid_select_models.$grid.jqGrid('setGridParam', { url: lv_path, datatype: 'json' }).trigger("reloadGrid");
                /////////////////////////////////$("#id_div_GridSelectModels").slideToggle(300);

                lo_active_side.grid_select_models.$div_grid.dialog("open");

                return false;



                //// test !!

                //let lo_active_side = get_active_side_shape_generator();
                //lo_active_side.common_func.build_scenes_by_sides_data(null);


            }

            catch (e) {

                alert('error onclick_read_model: ' + e.stack);

            }
        }

        //------------------------------------------------------------------------
        Shape_generator.prototype.onclick_save_model = function () {


            try {

                let lo_active_side = get_active_side_shape_generator();

                let lv_filename = $("#id_model_name").val();
                lo_active_side.common_func.check_file_exist_on_server(lv_filename, lo_active_side.oncomplete_check_file_exist_on_server);


                ////////////////////////////let lo_sides_data = lo_active_side.read_model_sides_data();
                ////////////////////////////let lo_scene_mod = lo_active_side.scene_mod;
                ////////////////////////////lo_active_side.common_func.save_model(lo_sides_data, lo_scene_mod);


            }

            catch (e) {

                alert('error onclick_save_model: ' + e.stack);

            }
        }
        //------------------------------------------------------------------------
        Shape_generator.prototype.oncomplete_check_file_exist_on_server = function (pv_is_file_exist) {

            try {

                let lo_active_side = get_active_side_shape_generator();

                if (pv_is_file_exist == Constants.true) {

                    if (lo_active_side.is_ask_about_save_file) {

                        lo_active_side.do_save_model();

                    }

                    else {

                        let lv_question = "File \"" + $("#id_model_name").val() + "\" already exists. Replace it?";

                        lo_active_side.common_func.show_question(lv_question,
                            function () {

                                lo_active_side.do_save_model();
                                ////lo_active_side.is_ask_about_save_file = true;
                                ////lo_active_side.is_model_changed = false;

                                ////let lo_sides_data = lo_active_side.read_model_sides_data();
                                ////let lo_scene_mod = lo_active_side.scene_mod;
                                ////lo_active_side.common_func.save_model(lo_sides_data, lo_scene_mod);


                                $(this).dialog("close");
                            },
                            function () { $(this).dialog("close"); }, null);

                    }
                }
                else {

                    lo_active_side.do_save_model();

                }

            }


            catch (e) {

                alert('error oncomplete_check_file_exist_on_server: ' + e.stack);

            }
        }

        //------------------------------------------------------------------------
        Shape_generator.prototype.do_save_model = function () {


            this.is_ask_about_save_file = true;
            this.is_model_changed = false;

            let lo_sides_data = this.read_model_sides_data();
            let lo_scene_mod = this.scene_mod;
            this.common_func.save_model(lo_sides_data, lo_scene_mod);


        }


        //27112024 {
        //------------------------------------------------------------------------
        Shape_generator.prototype.onclick_refresh_model = function () {

            //30112024 {

            let lo_active_side = get_active_side_shape_generator();
            ////lo_active_side.model_params_changed = true;

            lo_active_side.refreshModel();

            //30112024 }


        }
        //27112024 }


        //------------------------------------------------------------------------
        Shape_generator.prototype.onclick_make_model = function () {

            let lo_active_side_shape_generator = get_active_side_shape_generator();
            lo_active_side_shape_generator.make_model();

        }


        //------------------------------------------------------------------------
        Shape_generator.prototype.onChange_distance_bt_curves = function () {

        }


        //------------------------------------------------------------------------
        Shape_generator.prototype.render = function () {

            try {

                let lo_active_side = get_active_side_shape_generator();

                if (lo_active_side) {

                    lo_active_side.renderer.render(
                        lo_active_side.scene,
                        lo_active_side.camera);

                }

            }

            catch (e) {

                alert('error render: ' + e.stack);

            }
        }



        //------------------------------------------------------------------------
        Shape_generator.prototype.onmousemove = function (po_event) {

            let lo_active_side;



            try {

                lo_active_side = get_active_side_shape_generator();

                if (!lo_active_side) {
                    return;
                }


                if (lo_active_side.shapes == null) {
                    return;
                }
                if (lo_active_side.shapes.ar_splines_nodes == null) {
                    return;
                }



                //25072024 {
                //if (po_event.button != 0) {
                lo_active_side.is_gragging = true;
                //}
                //25072024 }



                //let lar_findresult;

                lo_active_side.container.style.cursor = "default";

                if (lo_active_side.button_down) {

                    //@@if (lo_active_side_shape_generator.draggableObject) {


                    //1807202 lo_active_side_shape_generator.was_draggable = true;


                    lo_active_side.container.style.cursor = "pointer";

                    let lo_pos = lo_active_side.common_func.recalc_coord_event2world(lo_active_side.camera, lo_active_side.container, event.clientX, event.clientY);

                    if (lo_pos == null) //03092024 
                    {
                        return;
                    }




                    while (true) {

                        //28072004
                        if (typeof lo_active_side.draggableObject == "undefined"
                            || lo_active_side.draggableObject == null) {
                            break;
                        }



                        if (lo_active_side.draggableObject.geometry.type == "LineGeometry") {

                            //06012025 {
                            ////// двигаем параллелепипед 

                            ////lo_active_side_shape_generator.container.style.cursor = "pointer";
                            ////lo_active_side_shape_generator.draggableObject.position.x = lo_pos.x + lo_active_side_shape_generator.delta_rect_drag_x;
                            ////lo_active_side_shape_generator.draggableObject.position.y = lo_pos.y + lo_active_side_shape_generator.delta_rect_drag_y;

                            ////lo_active_side_shape_generator.render();
                            //06012025 }

                            break;
                        }



                        let lar_spline_points = lo_active_side.shapes.get_spline_points(lo_active_side.draggableObject.parent.parent);

                        if (lo_active_side.draggableObject.geometry.type == "BoxGeometry") {
                            // Выделен один из крайних (квадратных) узлов, двигаем всю кривую (сплайн)

                            let lv_delta_x = lo_pos.x - lo_active_side.draggableObject.position.x;

                            for (let lv_i = 0; lv_i < lar_spline_points.length; lv_i++) {
                                lar_spline_points[lv_i].x = lar_spline_points[lv_i].x + lv_delta_x;
                            }

                            lo_active_side.container.style.cursor = "ew-resize";

                            ////05012025 {
                            let lar_splines_order = lo_active_side.shapes.SortSplinesOrderFromLeftToRight();
                            lo_active_side.shapes.redraw_meshes_color(lar_splines_order);
                            ////05012025 }

                        }

                        if (lo_active_side.draggableObject.geometry.type == "CircleGeometry") {

                            // Выделен один из остальных узлов, двигаем один узел
                            lo_active_side.draggableObject.position.x = lo_pos.x;
                            lo_active_side.draggableObject.position.y = lo_pos.y;

                        } // CircleGeometry


                        // Удаление предыдущих линий
                        let lar_lines = lo_active_side.shapes.get_lines_in_group(lo_active_side.draggableObject.parent.parent);
                        for (let lv_i = 0; lv_i < lar_lines.length; lv_i++) {
                            lo_active_side.common_func.removeObjectsWithChildren(lar_lines[lv_i], true);
                        }

                        // Перерисовка сегментов
                        lo_active_side.shapes.redraw_segments(lo_active_side.draggableObject.parent.parent);


                        lo_active_side.splines.draw_curve(lo_active_side.draggableObject.parent.parent, lar_spline_points, lo_active_side.splines.name_prefix, true);
                        lo_active_side.render();

                        break;

                    }// while

                    //@@}// draggableObject

                } //button down

                else {
                    // no button down

                    lo_active_side.container.style.cursor = "default";

                    // Формирование курсора мыши
                    while (true) {

                        let { top, left, width, height } = lo_active_side.container.getBoundingClientRect();
                        let lv_clickMouse = new THREE.Vector2();
                        lv_clickMouse.x = ((event.clientX - left) / width) * 2 - 1;
                        lv_clickMouse.y = - ((event.clientY - top) / height) * 2 + 1;

                        let lo_raycaster = new THREE.Raycaster();
                        lo_raycaster.setFromCamera(lv_clickMouse, lo_active_side.camera);

                        let lo_found;

                        lo_found = lo_raycaster.intersectObjects(lo_active_side.shapes.ar_splines_nodes, true);

                        if (lo_found.length) {

                            // Сплайн

                            let lo_object = lo_found[0].object;

                            if (lo_object.visible) {

                                if (lo_object.geometry.type == "BoxGeometry") {
                                    // Выделен один из крайних узлов, двигаем всю кривую (сплайн)
                                    lo_active_side.container.style.cursor = "ew-resize";
                                }

                                if (lo_object.geometry.type == "CircleGeometry") {
                                    // Выделен не крайний узел, двигаем один узел
                                    lo_active_side.container.style.cursor = "pointer";
                                }

                            }

                        }

                        if (lo_active_side.rectangle) {

                            lo_found = lo_raycaster.intersectObjects([lo_active_side.rectangle.shape]);
                            if (lo_found.length) {
                                lo_active_side.container.style.cursor = 'default';// "pointer";
                                break;
                            }
                        }


                        break;

                    }// while

                } //lo_active_side_shape_generator.button_down


            }// try

            catch (e) {

                lo_active_side.container.style.cursor = "default";
                alert('error onmousemove: ' + e.stack);

            }

            //po_event.preventDefault();
            //po_event.stopPropagation();
            //return false;

        }

        //------------------------------------------------------------------------
        Shape_generator.prototype.onPointerUp = function (po_event) {

            try {
                po_event.stopPropagation();

                let lo_active_side = get_active_side_shape_generator();

                ////07012025 {
                //if (!lo_active_side) {
                //    return;
                //}
                ////07012025 }


                lo_active_side.button_down = false;
                lo_active_side.draggableObject = undefined;


                //16122024 {

                //if (lo_active_side.shapes == null) {
                //    return;
                //}

                //let lar_splines_order = lo_active_side.shapes.SortSplinesOrderFromLeftToRight();//03082024
                //lo_active_side.shapes.redraw_meshes_color(lar_splines_order);//03082024


                if (lo_active_side.my_prefix !== gc_id_prefix_end) {  //15122024



                    if (this.is_shape_gragging)//05012025
                    {

                        //06012025 {
                        if (lo_active_side.shapes == null) {
                            return;
                        }

                        let lar_splines_order = lo_active_side.shapes.SortSplinesOrderFromLeftToRight();//03082024
                        lo_active_side.shapes.redraw_meshes_color(lar_splines_order);//03082024

                        //06012025 }

                        //this.is_shape_gragging = false;//05012025

                        //05012025 {
                        go_end_side_shape_generator.end_shape.redraw_end_shape(
                            null,         //   po_main,
                            null, null,   //   pv_added_spline_num, pv_deleted_spline_num,       
                            null, null    //   po_is_use_data, po_sides_data       
                        );
                        //05012025 }

                        lo_active_side.select_contour_between_slides(po_event); //06012025

                    }
                    //////05012025 }
                }
                else {

                    if (lo_active_side.shapes == null) {
                        return;
                    }

                    let lar_splines_order = lo_active_side.shapes.SortSplinesOrderFromLeftToRight();//03082024
                    lo_active_side.shapes.redraw_meshes_color(lar_splines_order);//03082024
                    //16122024 }

                    //go_end_side_shape_generator.end_shape.refresh_end_shapes(); //22122024


                }

                this.is_shape_gragging = false;//05012025

                lo_active_side.render();

            }

            catch (e) {

                alert('error onPointerUp: ' + e.stack);

            }

        }


        //------------------------------------------------------------------------
        Shape_generator.prototype.onPointerDown = function (po_event) {

            let lo_active_side = get_active_side_shape_generator();

            ////07012025 {
            //if (!lo_active_side) {
            //    return;
            //}
            ////07012025 }

            let lv_is_gragging;

            try {

                if (lo_active_side.my_prefix == gc_id_prefix_end) {

                    if (po_event.button == 0 && po_event.buttons == 1) {

                        // Левая кнопка

                        //lo_active_side.button_down = true;
                        lv_is_gragging = false;

                        //alert("раз");
                        lo_active_side.end_shape.handle_click_on_end_side(po_event);

                        //po_event.stopPropagation()
                    }

                    return false;
                }




                if (lo_active_side.shapes == null) {
                    return;
                }


                let lo_clicked_spline_and_segment = lo_active_side.shapes.get_splines_and_segment_of_clicked_figure(po_event);


                if (po_event.button == 2 && po_event.buttons == 2) {

                    // Правая кнопка

                    // Выделение сегмента

                    let lo_clicked_spline = lo_clicked_spline_and_segment.spline_right;//13072024
                    let lo_clicked_segment = lo_clicked_spline_and_segment.segment;

                    if (lo_clicked_segment) {
                        lo_active_side.shapes.switch_visible_nodes_by_segment(lo_clicked_segment);
                        //13122024 lo_active_side_shape_generator.render();
                    }

                    return;
                }



                if (po_event.button == 0 && po_event.buttons == 1) {

                    // Левая кнопка

                    let lo_active_side = get_active_side_shape_generator();

                    lo_active_side.button_down = true;


                    lv_is_gragging = false;


                    while (true) {

                        let { top, left, width, height } = lo_active_side.container.getBoundingClientRect();//07052024

                        let lv_clickMouse = new THREE.Vector2();
                        lv_clickMouse.x = ((po_event.clientX - left) / width) * 2 - 1;
                        lv_clickMouse.y = - ((po_event.clientY - top) / height) * 2 + 1;

                        // Определение - щелчок внутри фигуры, или нет
                        if (lo_active_side.rectangle) {

                            let lv_isInside = lo_active_side.common_func.IsInsideRectangle(po_event, lo_active_side.rectangle.shape); //13122024

                            if (!lv_isInside) {
                                return;
                            }

                        }


                        let lo_raycaster = new THREE.Raycaster();
                        lo_raycaster.setFromCamera(lv_clickMouse, lo_active_side.camera);

                        let lo_found;

                        lo_found = lo_raycaster.intersectObjects(lo_active_side.shapes.ar_splines_nodes, true);
                        if (lo_found.length) {

                            // Узел
                            lv_is_gragging = true;

                            lo_active_side.draggableObject = lo_found[0].object;
                            break;
                        }


                        if (lo_active_side.rectangle) {

                            let lo_object = lo_active_side.scene.getObjectByName(lo_active_side.rectangle.shape.name);

                            if (lo_object) {

                                lo_found = lo_raycaster.intersectObjects([lo_active_side.rectangle.shape]); //, true);
                                if (lo_found.length) {

                                    // Прямоугольник
                                    lo_active_side.draggableObject = lo_found[0].object;

                                    let lo_pos = lo_active_side.common_func.recalc_coord_event2world(lo_active_side.camera, lo_active_side.container, po_event.clientX, po_event.clientY);
                                    lo_active_side.delta_rect_drag_x = lo_active_side.draggableObject.position.x - lo_pos.x;
                                    lo_active_side.delta_rect_drag_y = lo_active_side.draggableObject.position.y - lo_pos.y;

                                    lv_is_gragging = true;

                                    break;
                                }
                            }
                        }

                        break;
                    }

                    //------------------------------------------------------------------------------------

                    if (lv_is_gragging) {

                        this.is_shape_gragging = true;//05012025
                        return;
                    }

                    //------------------------------------------------------------------------------------


                    // click

                    //06012025 {
                    ////// Выделение границ фигуры между кривыми

                    ////let lo_clicked_splines_and_segment = lo_active_side.shapes.get_splines_and_segment_of_clicked_figure(po_event);

                    ////let lo_clicked_splines = {
                    ////    spline_left: lo_clicked_splines_and_segment.spline_left,
                    ////    spline_right: lo_clicked_splines_and_segment.spline_right
                    ////};


                    ////let lo_prev_clicked_splines = null; //04122024

                    ////if (lo_active_side.group_contours) { //04122024
                    ////    if (lo_active_side.group_contours.userData) { //04122024

                    ////        lo_prev_clicked_splines = lo_active_side.group_contours.userData;
                    ////    }

                    ////}


                    ////lo_active_side.shapes.clear_group_contours();


                    ////if (lo_active_side.group_contours) { //04122024

                    ////    if (lo_active_side.group_contours.userData == null) {

                    ////        lo_active_side.shapes.select_shape_contour(lo_clicked_splines_and_segment);

                    ////    }
                    ////    else {


                    ////        if (lo_prev_clicked_splines) { //04122024

                    ////            if (lo_clicked_splines.spline_left == lo_prev_clicked_splines.spline_left
                    ////                && lo_clicked_splines.spline_right == lo_prev_clicked_splines.spline_right) {

                    ////                lo_active_side.group_contours.userData = null;
                    ////            }
                    ////            else {
                    ////                lo_active_side.shapes.select_shape_contour(lo_clicked_splines_and_segment);
                    ////            }
                    ////        }
                    ////    }


                    ////}//04122024


                    lo_active_side.select_contour_between_slides(po_event);

                    // 06012025 }

                    lo_active_side.render();

                }

            }

            catch (e) {

                alert('error onPointerDown: ' + e.stack);

            }


        }



        //------------------------------------------------------------------------
        Shape_generator.prototype.select_contour_between_slides = function (po_event) {


            // Выделение границ фигуры между кривыми

            try {

                let lo_active_side = get_active_side_shape_generator();

                let lo_clicked_splines_and_segment = lo_active_side.shapes.get_splines_and_segment_of_clicked_figure(po_event);

                let lo_clicked_splines = {
                    spline_left: lo_clicked_splines_and_segment.spline_left,
                    spline_right: lo_clicked_splines_and_segment.spline_right
                };


                let lo_prev_clicked_splines = null;

                if (lo_active_side.group_contours) {
                    if (lo_active_side.group_contours.userData) {

                        lo_prev_clicked_splines = lo_active_side.group_contours.userData;
                    }

                }


                lo_active_side.shapes.clear_group_contours();


                if (lo_active_side.group_contours) { //04122024

                    if (lo_active_side.group_contours.userData == null) {

                        lo_active_side.shapes.select_shape_contour(lo_clicked_splines_and_segment);

                    }
                    else {


                        if (lo_prev_clicked_splines) { //04122024

                            if (lo_clicked_splines.spline_left == lo_prev_clicked_splines.spline_left
                                && lo_clicked_splines.spline_right == lo_prev_clicked_splines.spline_right) {

                                lo_active_side.group_contours.userData = null;
                            }
                            else {
                                lo_active_side.shapes.select_shape_contour(lo_clicked_splines_and_segment);
                            }
                        }
                    }


                }



            }

            catch (e) {

                alert('error select_contour_between_slides: ' + e.stack);

            }
        }




        //////////------------------------------------------------------------------------
        ////Shape_generator.prototype.onclick_shape = function (po_event) {

        ////    ////    //14072024 {
        ////    ////    //////////let lo_active_side_shape_generator = get_active_side_shape_generator();

        ////    ////    //////////if (lo_active_side_shape_generator.was_draggable) {
        ////    ////    //////////    lo_active_side_shape_generator.was_draggable = false;
        ////    ////    //////////    return;
        ////    ////    //////////}






        ////    ////////25072024 {

        ////    //////    let lo_active_side_shape_generator = get_active_side_shape_generator();


        ////    //////    if (lo_active_side_shape_generator.is_gragging) {
        ////    //////        // dragging
        ////    //////        return;
        ////    //////    }

        ////    //////    // click

        ////    //////    let lo_clicked_splines_and_segment = lo_active_side_shape_generator.shapes.get_splines_and_segment_of_clicked_figure(po_event);

        ////    //////    let lo_clicked_splines = {
        ////    //////        spline_left: lo_clicked_splines_and_segment.spline_left,
        ////    //////        spline_right: lo_clicked_splines_and_segment.spline_right
        ////    //////    };

        ////    //////    let lo_prev_clicked_splines = lo_active_side_shape_generator.group_contours.userData;

        ////    //////    lo_active_side_shape_generator.shapes.clear_group_contours();

        ////    //////    if (lo_active_side_shape_generator.group_contours.userData == null)
        ////    //////    {
        ////    //////        lo_active_side_shape_generator.shapes.select_shape_contour(lo_clicked_splines_and_segment);

        ////    //////    }
        ////    //////    else
        ////    //////    {

        ////    //////        if (lo_clicked_splines.spline_left == lo_prev_clicked_splines.spline_left
        ////    //////            && lo_clicked_splines.spline_right == lo_prev_clicked_splines.spline_right)
        ////    //////        {
        ////    //////            lo_active_side_shape_generator.group_contours.userData = null;
        ////    //////        }
        ////    //////        else {
        ////    //////            lo_active_side_shape_generator.shapes.select_shape_contour(lo_clicked_splines_and_segment);
        ////    //////        }

        ////    //////    }

        ////    //////


        ////    //////    lo_active_side_shape_generator.render();

        ////    //25072024 }



        ////}




        //------------------------------------------------------------------------
        Shape_generator.prototype.read_model_sides_data = function () {

            let lo_sides_data = new typ_sides_data();

            try {
                let lo_model_data = new typ_sides_data();

                let lo_up_side_shape_generator = get_side_shape_generator_by_prefix(gc_id_prefix_up);
                let lo_lateral_side_shape_generator = get_side_shape_generator_by_prefix(gc_id_prefix_lateral);

                let lo_active_side_shape = get_active_side_shape_generator();


                ////lo_model_data.colorParts = this.read_color_parts();
                ////lo_model_data.data1 = lo_up_side_shape_generator.read_side_model_data();
                ////lo_model_data.data2 = lo_lateral_side_shape_generator.read_side_model_data();


                lo_sides_data.client_id = lo_active_side_shape.client_id; //21112024 
                //lo_model_data.task_id = "0";


                let lar_colorParts = this.read_color_parts();
                let lar_data1 = lo_up_side_shape_generator.read_side_model_data();
                let lar_data2 = lo_lateral_side_shape_generator.read_side_model_data();




                lo_sides_data.ColorParts = lar_colorParts;
                lo_sides_data.data1 = lar_data1;
                lo_sides_data.data2 = lar_data2;



                ////return {
                ////    ColorParts: lar_colorParts,
                ////    data1: lar_data1,
                ////    data2: lar_data2
                ////}

            }

            catch (e) {

                alert('error read_model_sides_data: ' + e.stack);

            }
            return lo_sides_data;

        }

        //------------------------------------------------------------------------
        Shape_generator.prototype.read_color_parts = function () {

            let lar_ColorParts = [];
            return {
                ColorParts: lar_ColorParts
            }
            //};
        }
        //------------------------------------------------------------------------
        Shape_generator.prototype.get_rectangle_coordinates_by_name = function (pv_name) {

            let lo_gabarits = null;

            let lo_rect = this.scene.getObjectByName(pv_name);

            if (lo_rect) {
                //13122024 lo_gabarits = this.shapes.GetTwoShapeIntersect(lo_rect, lo_rect);
                lo_gabarits = this.common_func.GetTwoShapeIntersect(lo_rect, lo_rect); //13122024
            }

            return lo_gabarits;

        }


        //------------------------------------------------------------------------
        Shape_generator.prototype.read_side_model_data = function () {

            let lo_side_data = new typ_side_data();


            try {
                let ls_parameters = this.read_side_parameters();

                let lo_splines_points_data = this.shapes.get_splines_points_for_model();


                lo_side_data.parameters = ls_parameters;
                lo_side_data.numCurves = lo_splines_points_data.PointsCurves.length;
                lo_side_data.idMaterial = 0;
                lo_side_data.idSize = 0;
                lo_side_data.Lockedit = false;
                lo_side_data.Fl_manual_parameters = false;
                lo_side_data.M_Material = 0;
                lo_side_data.M_Width = this.params.shape_width;
                lo_side_data.M_Height = this.params.shape_width;
                lo_side_data.M_Length = this.params.shape_height;
                lo_side_data.M_Price_rub = 0.0;
                lo_side_data.Part_gap = 2;
                lo_side_data.CurveColors = [];
                lo_side_data.Segments_beg_points_numbers = lo_splines_points_data.Segments_beg_points_numbers;
                lo_side_data.PointsCurves = lo_splines_points_data.PointsCurves;
                lo_side_data.rectangle_scale_y = this.rectangle.shape.scale.y;







                //return {
                //    parameters: ls_parameters,
                //    numCurves: lar_splines_points.length,
                //    idMaterial: 0,
                //    idSize: 0,
                //    Lockedit: false,
                //    Fl_manual_parameters: false,
                //    M_Material: 0,
                //    M_Width: this.params.shape_width,
                //    M_Height: this.params.shape_width,
                //    M_Length: this.params.shape_height,
                //    M_Price_rub: 0.0,
                //    Part_gap: 2,
                //    CurveColors: [],
                //    Segments_beg_points_numbers: lo_splines_points_data.Segments_beg_points_numbers,
                //    PointsCurves: lo_splines_points_data.PointsCurves,

                //}

            }

            catch (e) {

                alert('error read_side_model_data: ' + e.stack);

            }
            //return lo_sides_data;


            return lo_side_data;
        }


        //------------------------------------------------------------------------
        Shape_generator.prototype.read_side_parameters = function () {

            let ls_parameters = new typ_parameters();

            //ls_parameters.is_space_adjust = $(this.id_prefix + "id_chb_space_adjust")[0].checked;
            //ls_parameters.is_curve_width_adjust = $(this.id_prefix + "id_chb_curve_width_adjust")[0].checked;

            //ls_parameters.distance_bt_curves = this.params.distance_bt_curves;
            //ls_parameters.distance_bt_curves_in_percent = this.params.distance_between_curves_in_percent_of_width;
            //ls_parameters.shape_height = this.params.shape_height;
            //ls_parameters.shape_width = this.params.shape_width;


            try {


                ls_parameters.container_width = this.params.container_width;
                ls_parameters.container_height = this.params.container_height;
                ls_parameters.shape_width_beg = this.params.shape_width_beg;
                ls_parameters.shape_width = this.params.shape_width;
                ls_parameters.shape_height_beg = this.params.shape_height_beg;
                ls_parameters.shape_height = this.params.shape_height;
                ls_parameters.shape_amount_curves = this.params.shape_amount_curves;
                ls_parameters.spline_amount_segments = this.params.spline_amount_segments;
                ls_parameters.ajust_curves_by_shape = $(this.id_prefix + "id_chb_space_adjust")[0].checked; //this.params.ajust_curves_by_shape;  
                ls_parameters.ajust_shape_by_curves = $(this.id_prefix + "id_chb_curve_width_adjust")[0].checked; //this.params.ajust_shape_by_curves;
                ls_parameters.distance_between_curves_in_percent_of_width = this.params.distance_between_curves_in_percent_of_width;
                ls_parameters.distance_bt_curves = this.params.distance_bt_curves;
                ls_parameters.is_space_adjust = $(this.id_prefix + "id_chb_space_adjust")[0].checked; //this.params.is_space_adjust;       
                ls_parameters.is_curve_width_adjust = $(this.id_prefix + "id_chb_curve_width_adjust")[0].checked; //this.params.is_curve_width_adjust; 
                ls_parameters.color = this.params.color;

            }

            catch (e) {

                alert('error read_side_parameters: ' + e.stack);

            }
            return ls_parameters;
        }
        //const cv_width = this.params.container_width;
        //const cv_height = this.params.container_height;
        //const cv_shape_width = this.params.shape_width;
        //const cv_shape_height = this.params.shape_height;



        //------------------------------------------------------------------------
        Shape_generator.prototype.draw_shape_by_sides_data = function (po_sides_data) {

            try {
                let sides_data = JSON.parse(po_sides_data);

                go_up_side_shape_generator.clear_shape_objects(go_up_side_shape_generator);
                go_up_side_shape_generator.make_shape(true, sides_data.data1);
                go_up_side_shape_generator.render();


                go_lateral_side_shape_generator.clear_shape_objects(go_lateral_side_shape_generator);
                go_lateral_side_shape_generator.make_shape(true, sides_data.data2);
                //131220244 go_lateral_side_shape_generator.render();


                //go_end_side_shape_generator.clear_shape_objects(go_end_side_shape_generator);
                //go_end_side_shape_generator.create_end_shape(true, po_sides_data);
                //go_end_side_shape_generator.render();

            }

            catch (e) {

                alert('error draw_shape_by_sides_data: ' + e.stack);

            }
        }

        //------------------------------------------------------------------------
        Shape_generator.prototype.clear_shape_objects = function (po_side) {

            try {

                //this.common_func.clear_group_childrens(po_side.main_curves_group);
                //this.common_func.clear_group_childrens(po_side.group_contours);
                //this.common_func.clear_group_childrens(po_side.group_color_mesh);
                //this.common_func.clear_group_childrens(po_side.group_rect);

                if (this.shapes) {

                    this.shapes.shape_amount_curves = 0;// po_params.shape_amount_curves;
                    //this.spline_amount_segments = po_params.spline_amount_segments;

                    this.shapes.shape_width = 0;// po_params.shape_width;
                    this.shapes.shape_height = 0; // po_params.shape_height;

                    this.shapes.ajust_shape_by_curves = false;// po_params.ajust_shape_by_curves;
                    this.shapes.ajust_curves_by_shape = false;// po_params.ajust_curves_by_shape;

                    this.shapes.distance_between_curves_in_percent_of_width = 0;// po_params.distance_between_curves_in_percent_of_width;
                    this.shapes.distance_between_curves = 0;// po_params.distance_bt_curves;

                    this.shapes.group_rect = null;
                    this.shapes.segment_gabarits = null; // new struc_gabarits();
                    this.shapes.segment_transform_data = null; // new struc_segment_transform_data();
                    this.shapes.ar_splines = [];// Список group - сплайнов кривых в сцене
                    this.shapes.ar_splines_nodes = [];// Список узлов всех сплайнов
                    this.shapes.ar_selected_segments = []; // список выбранных сегментов 
                    //11042024 this.shapes.height_koef_previous = 0; // 1;
                    this.shapes.ar_shapes_colors = []; // список объектов со сплайнами и цветами фигур, упорядоченных слева направо

                }





                if (po_side) {

                    po_side.segment_transform_data = null;
                    po_side.segment_gabarits = null;
                    po_side.segments = null;
                    po_side.splines = null;
                    po_side.shapes = null;
                }

                let lar_no_delete = ["AmbientLight", "PointLight", "SpotLight", "Mesh"];// /*, "Group"*/14102024
                this.common_func.clearScene(po_side.scene, lar_no_delete);

                if (this.rectangle) {
                    this.rectangle.shape.scale.y = 1;
                }
            }

            catch (e) {

                alert('error clear_shape_objects: ' + e.stack);

            }
        }


        ////////------------------------------------------------------------------------
        //////Shape_generator.prototype.draw_side_shape_by_data = function (/*po_side,*/ po_side_data) {

        //////    //for (let lv_i = 0; lv_i < po_side_data.numCurves; lv_i++) {


        //////    //}

        //////    /*po_side*/this.make_shape(true, po_side_data);

        //////}

        //=====================================================================

    } // (typeof this.create_shape_generator !== "function")


    //---------------------------------------------------------------------

    this.create_shape_generator(pv_active_id_prefix /*30112024*/);

    //06052024 this.render();//05052024
    //}

    // end Class Shape_generator
    //=====================================================================
}