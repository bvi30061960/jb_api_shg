
import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

//////import { Line2 } from 'three/addons/lines/Line2.js';
//import { CubeGeometry } from 'three/addons/CubeGeometry.js';

import { Constants } from './my_common_const.js';

import { CommonFunc } from './my_common_func.js';

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

import { GridSelectModels } from './my_grid_select_models.js';


import { STLLoader } from 'three/addons/loaders/STLLoader.js';//20082024

//============================================================================================

const gc_id_prefix_up = "up";
const gc_id_prefix_lateral = "lateral";

//30102024 {
const cv_name_group_contours = "group_contours";
const cv_name_group_color_mesh = "group_color_mesh";
//30102024 }

var go_up_side_shape_generator = null;
var go_lateral_side_shape_generator = null;


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

        //05092024 {
        $("#id_tab_sides").tabs("option", "active", 1);// активация второй закладки (для срабатывания события activate
        // и формирования на второй закладке фигуры и данных)
        $("#id_tab_sides").tabs("option", "active", 0);// активация первой закладки


        go_up_side_shape_generator.model_params_changed = true;

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
    }


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

//================================================================================

// Class Shape_generator
export function Shape_generator(pv_active_id_prefix, pv_passive_id_prefix) {

    this.id_common_shg_container = "id_shape";// "id_tab_sides";// "id_center";// "id_shg_common";// "id_shape"; //"id_shape_generator_container";//  "id_shape_generator_container";// ;
    //this.id_side_shape_container = "id_shape_generator_container";// "id_shape"; //"id_shape_generator_container";//  "id_shape_generator_container";// ;
    this.id_side_shape = "id_shape"; //"id_shape_generator_container";//  "id_shape_generator_container";// ;
    this.id_side_shape_mod = "id_div_visual_model"; //25082024


    this.id_gui = "id_shg_right_top"; //25082024 "id_shg_right";


    // Свойства
    this.id_prefix = "#" + pv_active_id_prefix + "_";
    this.id_prefix_wo_sharp = pv_active_id_prefix + "_";

    this.passive_id_prefix = "#" + pv_passive_id_prefix + "_";
    this.passive_id_prefix_wo_sharp = pv_passive_id_prefix + "_";


    this.container = document.getElementById(this.id_prefix_wo_sharp + this.id_side_shape);//20062024
    //21062024 this.container = document.getElementById(this.id_side_shape);//20062024


    this.camera;//  = go_camera;
    this.scene;//  = go_scene;


    this.aspect;
    this.rectangle;


    let lv_id_side_shape = this.id_prefix + this.id_side_shape;
    let lv_id_side_shape_mod = this.id_prefix + this.id_side_shape_mod;

    //03092024 {
    ////let lv_id_up_side_shape = "#" + gc_id_prefix_up + "_" +  this.id_side_shape;
    ////let lv_id_up_side_shape_mod = "#" + gc_id_prefix_up + "_" + this.id_side_shape_mod;


    this.common_prev_width = $(lv_id_side_shape).width();
    this.common_prev_height = $(lv_id_side_shape).height();

    this.prev_width_mod = $(lv_id_side_shape_mod).width();
    this.prev_height_mod = $(lv_id_side_shape_mod).height();


    ////this.common_prev_width = $(lv_id_up_side_shape).width();
    ////this.common_prev_height = $(lv_id_up_side_shape).height();

    ////this.prev_width_mod = $(lv_id_up_side_shape_mod).width();//25082024
    ////this.prev_height_mod = $(lv_id_up_side_shape_mod).height();//25082024


    //03092024 }


    ////this.prev_height_mod = $(this.id_prefix + this.id_side_shape_mod)[0].innerHeight();
    ////this.prev_height_mod = $(this.id_prefix + this.id_side_shape_mod)[0].outerHeight();
    //19062024 this.common_prev_height = $(this.id_prefix + "id_shg_common").height();
    //20062024 this.common_prev_height = $().height();
    //22062024this.common_prev_height = $("#" +this.id_common_shg_container).height();
    //19062024 this.offset = $(this.id_prefix + "id_shg_common").offset();
    //20062024 this.offset = $(this.id_prefix + this.id_container).offset();
    //22062024 this.offset = $("#" +this.id_common_shg_container).offset();

    this.offset = $(lv_id_side_shape).offset();
    //this.offset = $(lv_id_up_side_shape).offset();

    this.prev_top = this.offset.top;
    this.prev_left = this.offset.left;

    let lv_$shape_mod = $(lv_id_side_shape_mod);
    //let lv_$shape_mod = $(lv_id_up_side_shape_mod);//03092024 


    //this.offset_mod = $(lv_id_shape_mod).offset();//25082024
    this.offset_mod = $(lv_$shape_mod).offset();//25082024
    this.prev_top_mod = this.offset_mod.top;//25082024
    this.prev_left_mod = this.offset_mod.left;//25082024


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

    this.segment_gabarits = null;
    this.segment_transform_data = null;
    //18072024 this.was_draggable = false;

    this.controls = null;
    this.gui = null;

    this.group_contours = null;
    this.group_color_mesh = null;

    this.is_gragging = false;

    this.params = {

        container_width: this.container.clientWidth, //0, // ;//, //go_container.clientWidth, //; 600,
        container_height: this.container.clientHeight, //; 0, // ;//, //go_container.clientHeight, //600,
        shape_width_beg: 50, // ;//,
        shape_width: 50, // ;//,
        shape_height_beg: 100, // ;//,
        shape_height: 100, // ;//,
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

    ////this.initGui_top = null;
    ////this.initGui_left = null;

    //30072024 {
    ////////////this.prev_selected_splines = {
    ////////////    spline_left: null,
    ////////////    spline_right: null,
    ////////////    num_spline_left: null,
    ////////////    num_spline_right: null
    ////////////};
    //30072024 }

    this.resolution = null; //30072024


    //2208204 {
    //this.id_side_shape_mod = "id_div_visual_model"; 

    this.container_mod; //= document.getElementById(this.id_prefix_wo_sharp + this.id_side_shape_mod);//20062024
    this.camera_mod;
    this.scene_mod;

    //14102024 {
    //////this.material_mod = new THREE.MeshLambertMaterial({
    //////    //color: 0xffffff,
    //////    color: 0xfff0f0,
    //////    opacity: 0.5,
    //////    //side: THREE.DoubleSide,
    //////    ////////////////transparent: true
    //////});


    this.material_mod = new THREE.MeshPhongMaterial({ color: 0xff5533, specular: 0x111111, shininess: 200 });

    this.group_parts_mod;

    //14102024 }



    ////this.offset_mod = $(this.id_prefix + this.id_side_shape_mod).offset();
    ////this.prev_top_mod = this.offset_mod.top;
    ////this.prev_left_mod = this.offset_mod.left;


    this.refreshModelInterval = 1000; // 1 //2 sec
    this.model_params_changed = false;
    this.is_building_model = false;

    this.model_prefix_filename = ""; // префикс имени файлов загружаемых деталей 
    this.model_numparts = 0; // всего загружаемых деталей модели
    this.num_loaded_model_parts = 0; //число загруженных деталей модели
    this.model_parts_positions = []; // new Array();
    this.rotate_status = 0; // режим вращения модели
    //this.slider_value_prev = 0; // предыдущее значение слайдера расстояния между деталями

    //this.is_load_both_model_sides = false;

    //////this.current_spline_max_y = 0; // текущая максимальная координата сплайнов

    ////this.current_splines_height = 0;
    //--------------------------------------------------------------------------------


    if (typeof this.create_shape_generator != "function") {
        //	return;
        //}

        //----------------------------------------------------------
        // Методы
        //----------------------------------------------------------



        //----------------------------------------------------------

        Shape_generator.prototype.create_shape_generator = function () {

            this.init_containers_and_controls();
            this.init_three_elements();
            /////////////////////this.animate_mod();

            setInterval(this.onPassInterval, this.refreshModelInterval, this);


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
        Shape_generator.prototype.init_containers_and_controls = function () {

            try {
                //02112024 {
                ////$(this.id_prefix + "id_sp_numcurves").spinner();
                ////$(this.id_prefix + "id_sp_numcurves").spinner("value", this.shape_amount_curves);
                //02112024 }


                $.fn.colorPicker.defaults.colors = ['fa0d00', 'fa6e00', 'faf100', '3dfa00', '00a7fa', '3b00fa', 'ffffff'];

                $("#up_id_pos_color_picker").colorPicker({ showHexField: false/*, onColorChange: function (id, newValue) { alert("id=" + id + " value= " + newValue) }*/ });
                $("#lateral_id_pos_color_picker").colorPicker({ showHexField: false/*, onColorChange: function (id, newValue) { alert("id=" + id + " value= " + newValue) }*/ });


                $(this.id_prefix + "id_shg_right_top").draggable();//22062024
                $(this.id_prefix + "id_shg_right_top").draggable("disable");//22062024

                $(this.id_prefix + this.id_side_shape_mod).draggable(); //26082024
                $(this.id_prefix + this.id_side_shape_mod).draggable("disable");//26082024



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
        Shape_generator.prototype.init_three_elements = function () {

            try {
                // 30102024 {
                ////const cv_name_group_contours = "group_contours";
                ////const cv_name_group_color_mesh = "group_color_mesh";
                //30102024 }



                this.container = document.getElementById(this.id_prefix_wo_sharp + this.id_side_shape);//20062024);
                this.scene = new THREE.Scene();
                this.scene.background = new THREE.Color(0xf0f0f0);

                let lo_cameraPersp, lo_cameraOrtho;

                this.aspect = this.container.clientWidth / this.container.clientHeight;//04022023

                lo_cameraPersp = new THREE.PerspectiveCamera(50, this.aspect, 0.01, 30000);
                //lo_cameraOrtho = new THREE.OrthographicCamera(-30 * this.aspect, 100 * this.aspect, 90 * this.aspect, -15.0 * this.aspect);//, 0,10);
                lo_cameraOrtho = new THREE.OrthographicCamera(-45 * this.aspect, 65 * this.aspect, 50 * this.aspect, -8 * this.aspect);


                //02112024 const frustumSize = 500;

                this.camera = lo_cameraOrtho;

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



                this.renderer = new THREE.WebGLRenderer({ antialias: true });

                this.renderer.setSize(this.id_side_shape.clientWidth, this.id_side_shape.clientHeight);// 06052024

                this.container.appendChild(this.renderer.domElement);


                // Controls
                this.controls = new OrbitControls(this.camera, this.renderer.domElement);
                this.controls.damping = 0.2;
                this.controls.enableRotate = false;// bvi

                this.camera.position.set(0, 0, 1);//04082024

                //-------------------------------------------------------------------



                // 02112024 {
                ////////////////////let lv_ncurves = $(this.id_prefix + "id_sp_numcurves")[0].value;


                ////////////////////const cv_width = this.params.container_width;
                ////////////////////const cv_height = this.params.container_height;
                //////////////////// const cv_shape_width = this.params.shape_width;
                //////////////////// const cv_shape_height = this.params.shape_height;
                /*//const cv_curves_fit_to_figure = true;*/
                ////////////////this.nsegments = this.params.spline_amount_segments;
                //02112024 }





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

                ////////////////////////////////////////const pointLight1 = new THREE.PointLight(0xffffff, 3, 0, 0);
                ///////////////////////////////////////////pointLight1.position.set(500, 500, 500);
                ////////////////////////////////////////this.scene_mod.add(pointLight1);

                ////////////////////////////////////////const pointLight2 = new THREE.PointLight(0xffffff, 1, 0, 0);
                ////////////////////////////////////////pointLight2.position.set(- 500, - 500, - 500);
                ////////////////////////////////////////this.scene_mod.add(pointLight2);












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
                this.renderer_mod.setClearColor(0xf0f0f0);//, 1);// цвет фона



                ////////////this.renderer_mod.setPixelRatio(window.devicePixelRatio);
                /////////////////////////this.renderer_mod.setAnimationLoop(this.animate_mod);









                // Controls
                this.controls_mod = new OrbitControls(this.camera_mod, this.renderer_mod.domElement);
                ////this.controls_mod.damping = 0.2;
                ////this.controls_mod.enableRotate = false;// bvi
                //this.controls_mod.autoRotate = true;




                //////////////////////////var light_mod_mod = new THREE.PointLight(0xff00ff);
                ////////////////////////////light_mod.position.set(0, 250, 0);
                //////////////////////////this.scene_mod.add(light_mod_mod);

                //////var geometry_mod = new THREE.SphereGeometry(100, 4, 3);
                //////var material_mod = new THREE.MeshNormalMaterial();
                //////var mesh_mod = new THREE.Mesh(geometry_mod, material_mod);
                //////mesh_mod.position.set(0, 0, 0);
                //////this.scene_mod.add(mesh_mod);




                //////var gv_spotLight1 = new THREE.PointLight(0xf0f0f0); //\\//
                //////gv_spotLight1.position.set(30, 30, 30); //\\//
                //////gv_spotLight1.name = 'spotLight2';
                //////this.scene_mod.add(gv_spotLight1); //\\//

                //////var gv_spotLight2 = new THREE.PointLight(0xf0f0f0); //\\//
                //////gv_spotLight2.position.set(30, 30, -30); //\\//
                //////gv_spotLight2.name = 'spotLight2';
                //////this.scene_mod.add(gv_spotLight2); //\\//


                //////var gv_spotLight3 = new THREE.PointLight(0xf0f0f0); //\\//
                //////gv_spotLight3.position.set(30, -30, 30); //\\//
                //////gv_spotLight3.name = 'spotLight3';
                //////this.scene_mod.add(gv_spotLight3); //\\//


                //////var gv_spotLight4 = new THREE.PointLight(0xf0f0f0); //\\//
                //////gv_spotLight4.position.set(-30, -30, -30); //\\//
                //////gv_spotLight4.name = 'spotLight4';
                //////this.scene_mod.add(gv_spotLight4); //\\//












                //var light5 = new THREE.PointLight(0x00ffff);
                //light5.position.set(-30, 30, 30);
                //light5.name = 'Light5';
                //this.scene_mod.add(light5);

                //////    var light6 = new THREE.PointLight(0xffffff);
                //////    light6.position.set(-30, 30, -30);
                //////    gv_scene.add(light6);

                //var light7 = new THREE.PointLight(0xff00ff);
                //light7.position.set(-30, -30, 30);
                //light7.name = 'Light7';
                //this.scene_mod.add(light7);

                //////var light8 = new THREE.PointLight(0xffffff);
                //////light8.position.set(-30, -30, -30);
                //////light8.name = 'Light8';
                //////this.scene_mod.add(light8);







                var gv_spotLight1 = new THREE.PointLight(0xf0f0f0); //\\//
                gv_spotLight1.position.set(50, 50, 0); //\\//
                //gv_spotLight1.name = 'spotLight1';
                this.scene_mod.add(gv_spotLight1); //\\//


                var gv_spotLight2 = new THREE.PointLight(0xf0f0f0); //\\//
                gv_spotLight2.position.set(-50, -50, 0); //\\//
                //gv_spotLight1.name = 'spotLight2';
                this.scene_mod.add(gv_spotLight2); //\\//


                var gv_spotLight3 = new THREE.PointLight(0xf0f0f0);
                gv_spotLight3.position.set(50, 50, 50);
                //gv_spotLight1.name = 'spotLight3';
                this.scene_mod.add(gv_spotLight3);


                //var gv_spotLight1 = new THREE.PointLight(0xf0f0f0); //\\//
                //gv_spotLight1.position.set(50, 0, 0); //\\//
                ////gv_spotLight1.name = 'spotLight4';
                //this.scene_mod.add(gv_spotLight1); //\\//





                this.model_parts_positions = []; // new Array();



                //======================================================================



                //=================================================================================================

                // обработчики событий gui
                if (!this.gui) {

                    this.gui = new GUI({ container: document.getElementById(this.id_prefix_wo_sharp + 'id_gui') });

                    this.gui.add(this.params, 'distance_bt_curves', 0, 40).step(0.5).name('Distance  between curves').onChange(this.onChange_distance_bt_curves);
                    this.gui.add(this.params, 'shape_height', 20, 300).step(0.5).name('Shape length').onChange(this.onChange_shape_height).onFinishChange(this.onFinishChange_param);
                    //this.gui.add(this.params, 'shape_width', 10, 200).step(0.5).name('Shape width').onChange(this.onChange_shape_width).onFinishChange(this.onFinishChange_param);
                    this.gui.add(this.params, 'shape_width', 10, 100).step(0.5).name('Shape width').onChange(this.onChange_shape_width).onFinishChange(this.onFinishChange_param);

                    //this.gui.addColor(this.params, 'color').name('Color');

                    this.gui.open();


                }


                //=================================================================================================


                this.common_func = new CommonFunc();



                //30102024 {

                this.make_shape(false, null);

                //////////this.shapes = new Shapes(
                //////////    this,
                //////////    this.scene,
                //////////    this.params
                //////////);

                //////////this.splines = new Splines(
                //////////    this
                //////////);

                //////////this.segments = new Segments(
                //////////    this
                //////////);


                //////////this.segment_gabarits = this.segments.get_segment_size();
                //////////this.segment_transform_data = this.segments.get_segment_transform_data(this.segment_gabarits, this.params.ajust_curves_by_shape);


                //////////this.shapes.create_shapes();


                //////////this.rectangle = new Rectangle(this.container, this.camera, this.scene, this.params);//16062024


                //////////this.group_contours = new THREE.Group();
                //////////this.group_contours.name = cv_name_group_contours;
                //////////this.scene.add(this.group_contours);

                //////////this.group_color_mesh = new THREE.Group();//01082024
                //////////this.group_color_mesh.name = cv_name_group_color_mesh;
                //////////this.scene.add(this.group_color_mesh);



                //////////this.shapes.adjust_splines_by_external_shape();//07092024


                //////////this.grid_select_models = new GridSelectModels(this.id_prefix);
                // 30102024 }




                //==============================================================================
                //==============================================================================
                // Загрузка STL модели

                //////let lv_container_id = gc_id_prefix_lateral + "_" + this.id_side_shape;

                // при активации боковой стороны загружаем модель в сцены обеих вкладок
                /////if (this.container.id === lv_container_id) {

                //this.is_load_both_model_sides = true;

                //02092024 this.is_building_model = true;





                ////////////////////////////////////////////const loader = new STLLoader();
                ////////////////////////////////////////////loader.load('/test_data/testResult.stl',
                ////////////////////////////////////////////    this.on_load_model,
                ////////////////////////////////////////////    null, //function (geometry_mod) { /*alert('OnProgress')*/ },
                ////////////////////////////////////////////    function (err) { alert('OnError ' + err) }
                ////////////////////////////////////////////);




                //this.is_load_both_model_sides = false;

                /////}
                //==============================================================================


            }

            catch (e) {

                alert('error init_three_elements: ' + e.stack);

            }

        }

        //------------------------------------------------------------------------
        Shape_generator.prototype.get_parameters_from_side_data = async function (po_side_data) {


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
        Shape_generator.prototype.make_shape = async function (pv_is_use_data, po_side_data) {

            try {

                if (pv_is_use_data) {

                    this.gui.reset();
                    this.parameters = this.get_parameters_from_side_data(po_side_data);
                    this.common_func.guiUpdateDisplay(this.gui);

                }

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


                //04112024 {

                this.rectangle = new Rectangle(this.container, this.camera, this.scene, this.params);

                //if (pv_is_use_data) {
                //    ///this.rectangle.shape.scale.y = po_side_data.rectangle_scale_y;
                //}
                //04112024 }





                this.group_contours = new THREE.Group();
                this.group_contours.name = cv_name_group_contours;
                this.scene.add(this.group_contours);

                this.group_color_mesh = new THREE.Group();
                this.group_color_mesh.name = cv_name_group_color_mesh;
                this.scene.add(this.group_color_mesh);



                this.shapes.adjust_splines_by_external_shape();


                this.grid_select_models = new GridSelectModels(this.id_prefix);


            }

            catch (e) {

                this.model_params_changed = false;

                alert('error make_shape: ' + e.stack);

            }

        }
        //------------------------------------------------------------------------
        Shape_generator.prototype.refreshModel = async function () {

            try {


                //let lv_url = "https://localhost:7093/CalcJBModel";
                //07102024 let lv_url = "https://localhost:7095/CalcJBModel";

                //let lv_method = "refresh";
                let lv_url = "https://localhost:7095/CalcJBModel?method=" + Constants.method_refresh_premodel;//07102024


                let lo_sides_data = this.read_model_sides_data();


                //////++++++++++++++++++++++++++++++
                ////// Очистка сцены
                ////let lo_active_side = get_active_side_shape_generator();
                ////lo_active_side.common_func.clearScene(lo_active_side.scene_mod);
                ////lo_active_side.render_mod();
                //////++++++++++++++++++++++++++++++




                this.send_side_data(lv_url, lo_sides_data);


            }

            catch (e) {

                this.model_params_changed = false; //29082024

                alert('error refreshModel: ' + e.stack);

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



                //let lv_url = "https://localhost:7093/MakeJBModel";


                let lv_url = "https://localhost:7095/CalcJBModel?method=" + Constants.method_make_model;//07102024


                let lo_sides_data = this.read_model_sides_data();


                //////++++++++++++++++++++++++++++++
                ////// Очистка сцены
                ////let lo_active_side = get_active_side_shape_generator();
                ////lo_active_side.common_func.clearScene(lo_active_side.scene_mod);
                ////lo_active_side.render_mod();
                //////++++++++++++++++++++++++++++++




                this.send_side_data_make_model(lv_url, lo_sides_data);


            }

            catch (e) {

                this.model_params_changed = false; //29082024

                alert('error make_model: ' + e.stack);

            }


        }

        //------------------------------------------------------------------------
        Shape_generator.prototype.send_side_data = function (pv_url, po_json_data) {

            ////$('#up_id_div_visual_model').css('opacity', 0.3);// прозрачность контента
            ////$('#lateral_id_div_visual_model').css('opacity', 0.3);// прозрачность контента


            ////$('#up_id_loading_indicator').show();// индикация ожидани
            ////$('#lateral_id_loading_indicator').show();// индикация ожидания
            ////$('#up_id_loading_indicator').css('opacity', 1);// индикация ожидани
            ////$('#lateral_id_loading_indicator').css('opacity', 1);// индикация ожидания

            ////this.set_visible_rotate_controls(false); // сделать невидимым контрол  - слайд расстояния между деталями
            ////this.rotate_status = type_rotate_mode.stop; // None; // выключить вращение модели

            let lv_is_before = true;
            this.do_before_after_model_request(lv_is_before, true);

            send(pv_url, po_json_data);

            async function send(pv_url, po_json_data) {


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

                    lo_active_side.model_params_changed = false; //04102024


                    ////// 04102024 {
                    ////$('#up_id_loading_indicator').hide();// прекращение индикации ожидания
                    ////$('#lateral_id_loading_indicator').hide();// прекращение индикации ожидания
                    ////$('#up_id_div_visual_model').css('opacity', 1);// прозрачность контента
                    ////$('#lateral_id_div_visual_model').css('opacity', 1);// прозрачность контента

                    ////lo_active_side.model_params_changed = false;
                    ////lo_active_side.is_building_model = false;
                    ////lo_passive_side.is_building_model = false;
                    ////// 04102024 }

                    let lv_is_before = false;
                    lo_active_side.do_before_after_model_request(lv_is_before, false);


                    /////alert('error send: ' + e.stack);

                }


            }

        }


        //------------------------------------------------------------------------
        Shape_generator.prototype.send_side_data_make_model = function (pv_url, po_json_data) {

            ////$('#up_id_div_visual_model').css('opacity', 0.3);// прозрачность контента
            ////$('#lateral_id_div_visual_model').css('opacity', 0.3);// прозрачность контента

            ////$('#up_id_loading_indicator').show();// индикация ожидания
            ////$('#lateral_id_loading_indicator').show();// индикация ожидания

            ////$('#up_id_loading_indicator').css('opacity', 1);// индикация ожидания
            ////$('#lateral_id_loading_indicator').css('opacity', 1);// индикация ожидания

            ////this.rotate_status = type_rotate_mode.stop; // None; // выключить вращение модели

            let lv_is_before = true;
            this.do_before_after_model_request(lv_is_before, true);



            send(pv_url, po_json_data);

            async function send(pv_url, po_json_data) {


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

                    lo_active_side.OnCompleteMakeModel(message);

                }

                catch (e) {

                    lo_active_side.model_params_changed = false; //04102024


                    // 04102024 {
                    ////$('#up_id_loading_indicator').hide();// прекращение индикации ожидания
                    ////$('#lateral_id_loading_indicator').hide();// прекращение индикации ожидания
                    ////$('#up_id_div_visual_model').css('opacity', 1);// прозрачность контента
                    ////$('#lateral_id_div_visual_model').css('opacity', 1);// прозрачность контента

                    ////lo_active_side.model_params_changed = false;
                    ////lo_active_side.is_building_model = false;
                    ////lo_passive_side.is_building_model = false;
                    // 04102024 }
                    let lv_is_before = false;
                    lo_active_side.do_before_after_model_request(lv_is_before, false);


                    /////alert('error send: ' + e.stack);

                }


            }

        }

        //------------------------------------------------------------------------
        Shape_generator.prototype.OnCompleteMakeModel = function (po_data) {

            let lo_active_side = get_active_side_shape_generator();
            let lo_passive_side = get_passive_side_shape_generator();

            if (po_data == null || po_data == "") {

                ////$('#up_id_loading_indicator').hide();// прекращение индикации ожидания
                ////$('#lateral_id_loading_indicator').hide();// прекращение индикации ожидания
                ////$('#up_id_div_visual_model').css('opacity', 1);// прозрачность контента
                ////$('#lateral_id_div_visual_model').css('opacity', 1);// прозрачность контента

                ////lo_active_side.model_params_changed = false;
                ////lo_active_side.is_building_model = false;
                ////lo_passive_side.is_building_model = false;

                let lv_is_before = false;
                lo_active_side.do_before_after_model_request(lv_is_before, true);

                return;
            }


            ////lo_active_side.common_func.clear_group_childrens(lo_active_side.group_parts_mod);//19102024


            this.load_model_parts(po_data);



            ////const loader = new STLLoader();
            ////const lo_object = loader.parse(po_data);

            ////// Очистка сцены
            ////let lar_no_delete = ["PointLight", "PerspectiveCamera"];// "Mesh", 
            ////lo_active_side.common_func.clearScene(lo_active_side.scene_mod, lar_no_delete);

            ////lo_active_side.on_load_model(lo_object);

        }

        //------------------------------------------------------------------------
        Shape_generator.prototype.load_model_parts = function (po_data) {


            if (po_data == null || po_data.number_outfiles == null || po_data.number_outfiles <= 0) {
                return;
            }

            // Очистка сцены new THREE.Group();
            //14102024 let lar_no_delete = ["PointLight", "PerspectiveCamera"];// "Mesh", 
            let lar_no_delete = ["PointLight", "PerspectiveCamera", "Group"];// 14102024
            this.common_func.clearScene(this.scene_mod, lar_no_delete);


            let lv_filename = "";

            this.num_loaded_model_parts = 0;//16102024

            // Очистка группы деталей
            this.group_parts_mod.clear();


            this.model_prefix_filename = po_data.common_outfilename_part; // префикс - общая часть имён файлов деталей
            // Загрузка деталей модели
            for (let lv_i = 1; lv_i <= po_data.number_outfiles; lv_i++) {

                lv_filename = po_data.common_outfilename_part + "_" + lv_i.toString() + Constants.file_model_ext;

                this.model_numparts = po_data.number_outfiles;
                //this.model_curr_numpart = lv_i;

                this.load_model_part(lv_filename);

            }

        }



        //------------------------------------------------------------------------
        Shape_generator.prototype.load_model_part = function (pv_filename) {

            let lo_active_side = get_active_side_shape_generator();
            let lo_passive_side = get_passive_side_shape_generator();

            try {

                let lv_url = "https://localhost:7095/CalcJBModel?method=" + Constants.method_read_model_parts +
                    "&filename=" + pv_filename;


                let lv_is_before = true;



                ////$('#up_id_div_visual_model').css('opacity', 0.3);// прозрачность контента
                ////$('#lateral_id_div_visual_model').css('opacity', 0.3);// прозрачность контента

                ////$('#up_id_loading_indicator').show();// индикация ожидани
                ////$('#lateral_id_loading_indicator').show();// индикация ожидания
                ////$('#up_id_loading_indicator').css('opacity', 1);// индикация ожидания
                ////$('#lateral_id_loading_indicator').css('opacity', 1);// индикация ожидания

                get_model_part(lv_url);


                //--------------------------------------------------
                async function get_model_part(pv_url) {
                    //--------------------------------------------------
                    await $.get(pv_url, "", lo_active_side.oncomplete_read_model_part);
                }
                //--------------------------------------------------

            }
            catch (e) {

                ////lo_active_side.model_params_changed = false; //04102024

                ////$('#up_id_loading_indicator').hide();// прекращение индикации ожидания
                ////$('#lateral_id_loading_indicator').hide();// прекращение индикации ожидания
                ////$('#up_id_div_visual_model').css('opacity', 1);// прозрачность контента
                ////$('#lateral_id_div_visual_model').css('opacity', 1);// прозрачность контента

                ////lo_active_side.model_params_changed = false;
                ////lo_active_side.is_building_model = false;
                ////lo_passive_side.is_building_model = false;

                let lv_is_before = false;
                lo_active_side.do_before_after_model_request(lv_is_before, false);

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

                }
            }

            catch (e) {

                alert('error do_before_after_model_request: ' + e.stack);

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
                        "&filename=" + lo_active_side.model_prefix_filename;

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
        Shape_generator.prototype.OnCompleteRefreshModel = function (po_data) {

            let lo_active_side = get_active_side_shape_generator();
            let lo_passive_side = get_passive_side_shape_generator();

            if (po_data == null || po_data == "") {

                ////$('#up_id_loading_indicator').hide();// прекращение индикации ожидания
                ////$('#lateral_id_loading_indicator').hide();// прекращение индикации ожидания
                ////$('#up_id_div_visual_model').css('opacity', 1);// прозрачность контента
                ////$('#lateral_id_div_visual_model').css('opacity', 1);// прозрачность контента

                ////lo_active_side.model_params_changed = false;
                ////lo_active_side.is_building_model = false;
                ////lo_passive_side.is_building_model = false;

                let lv_is_before = false;
                lo_active_side.do_before_after_model_request(lv_is_before, false);

                return;
            }

            const loader = new STLLoader();
            const lo_geometry = loader.parse(po_data);

            // Очистка сцены
            let lar_no_delete = ["PointLight", "PerspectiveCamera", "Group"];// "Mesh", 
            lo_active_side.common_func.clearScene(lo_active_side.scene_mod, lar_no_delete);

            lo_active_side.on_load_model(lo_geometry);

        }
        //------------------------------------------------------------------------
        Shape_generator.prototype.OnErrorRefreshModel = function () {


            ////$('#up_id_loading_indicator').hide();// прекращение индикации ожидания
            ////$('#lateral_id_loading_indicator').hide();// прекращение индикации ожидания
            ////$('#up_id_div_visual_model').css('opacity', 1);// прозрачность контента
            ////$('#lateral_id_div_visual_model').css('opacity', 1);// прозрачность контента

            let lo_active_side = get_active_side_shape_generator();
            let lv_is_before = false;

            lo_active_side.do_before_after_model_request(lv_is_before, false);


            /////alert("OnErrorRefreshModel");

            //02092024 lo_active_side.is_building_model = false;

        }


        //-------------------------------------------------------------------
        Shape_generator.prototype.on_load_model = function (geometry_mod) {



            let lo_active_side = get_active_side_shape_generator();
            let lo_passive_side = get_passive_side_shape_generator();

            geometry_mod.center();// Объект - в центре вращения



            //////////////////////const dirLight2 = new THREE.DirectionalLight(0xccccff, 3);
            //////////////////////dirLight2.position.set(- 1, 0.75, - 0.5);
            //////////////////////lo_active_side.scene_mod.add(dirLight2);


            //const material_mod = new THREE.MeshPhongMaterial(/*{ color: 0x555555 }*/);


            //const material_mod = new THREE.MeshPhongMaterial({
            //    specular: 0x444444,
            //    //map: decalDiffuse,
            //    //normalMap: decalNormal,
            //    normalScale: new THREE.Vector2(1, 1),
            //    shininess: 30,
            //    transparent: false, //true,
            //    depthTest: true,
            //    depthWrite: false,
            //    polygonOffset: true,
            //    polygonOffsetFactor: - 4,
            //    wireframe: false //true // false
            //});


            ////const material_mod = new THREE.MeshLambertMaterial({
            ////    //color: 0xffffff,
            ////    color: 0xfff0f0,
            ////    opacity: 0.5,
            ////    //side: THREE.DoubleSide,
            ////    transparent: true
            ////});


            //const material_mod = new THREE.MeshBasicMaterial({
            //    color: 0x00ff00, // черный цвет номера
            //    side: THREE.DoubleSide,
            //    shading: THREE.FlatShading
            //});



            ////camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100);
            ////camera.position.set(1, 2, - 3);
            ////camera.lookAt(0, 1, 0);
            //var material_mod = new THREE.MeshBasicMaterial({ vertexColors: THREE.FaceColors });
            ///const material_mod = new THREE.MeshPhongMaterial({ color: 0xcbcbcb, depthWrite: false }) 

            //////let materialFront = new THREE.MeshBasicMaterial({ color: new THREE.Color(Math.random() * 0xffffff) });
            //////let materialSide = new THREE.MeshBasicMaterial({ color: new THREE.Color(Math.random() * 0x00ffff) });

            //////let materialArray = [materialFront, materialSide];
            //////let material_mod = new THREE.MeshLambertMaterial(materialArray);


            //const dirLight = new THREE.DirectionalLight(0xffffff, 3);
            //dirLight.position.set(- 3, 10, - 10);
            //dirLight.castShadow = true;
            //dirLight.shadow.camera.top = 2;
            //dirLight.shadow.camera.bottom = - 2;
            //dirLight.shadow.camera.left = - 2;
            //dirLight.shadow.camera.right = 2;
            //dirLight.shadow.camera.near = 0.1;
            //dirLight.shadow.camera.far = 40;
            //lo_active_side.scene_mod.add(dirLight);



            //-------------------------------------------------------------------
            const mesh_mod = new THREE.Mesh(geometry_mod, lo_active_side.material_mod);


            lo_active_side.group_parts_mod.add(mesh_mod);





            ////$('#up_id_loading_indicator').hide();// прекращение индикации ожидания
            ////$('#lateral_id_loading_indicator').hide();// прекращение индикации ожидания
            ////$('#up_id_div_visual_model').css('opacity', 1);// прозрачность контента
            ////$('#lateral_id_div_visual_model').css('opacity', 1);// прозрачность контента


            let lv_is_before = false;
            lo_active_side.do_before_after_model_request(lv_is_before, false);


            lo_active_side.animate_mod();

            lo_active_side.is_building_model = false;
            lo_passive_side.is_building_model = false;



        }



        //------------------------------------------------------------------------
        Shape_generator.prototype.animate_mod = function () {

            let lo_active_side = get_active_side_shape_generator();

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

                setTimeout(function () {
                    requestAnimationFrame(lo_active_side.animate_mod);
                    lo_active_side.render_mod();

                }, 100);

            }
            else {

                lv_slider_value = $(this.id_prefix + "id_dist_part_slider").slider('value');
                //lv_delta_slider_value = lv_slider_value - this.slider_value_prev;

                //this.common_func.move_details_from_to_center(this.group_parts_mod, lv_delta_slider_value);
                this.common_func.move_details_from_to_center(this.group_parts_mod, lv_slider_value);


                setTimeout(function () {
                    requestAnimationFrame(this.animate_mod);
                    this.render_mod();

                }, 100);




            }


        }


        //------------------------------------------------------------------------
        Shape_generator.prototype.render_mod = function () {

            try {

                let lo_active_side = get_active_side_shape_generator();

                if (lo_active_side) {

                    lo_active_side.common_func.model_rotation(lo_active_side.group_parts_mod);

                    lo_active_side.renderer_mod.render(lo_active_side.scene_mod, lo_active_side.camera_mod);



                }

            }

            catch (e) {

                alert('error render_mod: ' + e.stack);

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




                this.render_mod();//23082024





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
        Shape_generator.prototype.onColorChange = function (/*pv_id,*/ pv_value) {

            let lo_active_side = get_active_side_shape_generator();


            if (lo_active_side.group_contours.userData) {

                //if (lo_active_side_shape_generator.group_contours.userData.num_spline_left != null || this.main.group_contours.userData.num_spline_right != null) {
                if (lo_active_side.group_contours.userData.num_spline_left != null || lo_active_side.group_contours.userData.num_spline_right != null) {

                    let lar_splines_order = [];
                    lar_splines_order = lo_active_side.shapes.SortSplinesOrderFromLeftToRight();

                    let lv_num_spline_left = lo_active_side.group_contours.userData.num_spline_left;
                    let lv_num_spline_right = lo_active_side.group_contours.userData.num_spline_right;


                    let lo_spline_left = lo_active_side.common_func.getSplineByNumber(lar_splines_order, lv_num_spline_left);
                    let lo_spline_right = lo_active_side.common_func.getSplineByNumber(lar_splines_order, lv_num_spline_right);


                    let lv_hexColor = lo_active_side.common_func.rgbToNumber(pv_value);

                    //lo_active_side_shape_generator.shapes.draw_contour_and_shape(0x0f0, lo_spline_left, lo_spline_right, false, true/*, true*/);
                    lo_active_side.shapes.draw_contour_and_shape(lv_hexColor, lo_spline_left, lo_spline_right, false, true, false, true/*, true*/);

                }
            }



            //lo_active_side_shape_generator.camera.updateProjectionMatrix();
            lo_active_side.render();

            lo_active_side.model_params_changed = true; // признак изменения параметров модели

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
            lo_active_side.render();

            lo_active_side.model_params_changed = true; // признак изменения параметров модели

        }



        //------------------------------------------------------------------------
        Shape_generator.prototype.adjust_splines_by_shape_in_side = function (po_side, pv_value) {


            //po_side.params.shape_height = pv_value;

            let lv_scale = pv_value / po_side.params.shape_height_beg;
            po_side.rectangle.shape.scale.y = lv_scale;

            po_side.render();


            po_side.segment_transform_data = po_side.segments.get_segment_transform_data(
                /* po_side.segment_gabarits, 02112024 */
                po_side.params.ajust_curves_by_shape);


            if (po_side.params.is_space_adjust) {
                po_side.shapes.adjust_splines_by_external_shape(pv_value);
            }

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

            lo_active_side.model_params_changed = true; // признак изменения параметров модели

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

            let lv_scale = pv_value / lo_active_side.params.shape_width_beg;

            if (lo_passive_side) {
                if (typeof lo_passive_side.gui !== "undefined" && lo_passive_side.gui) {
                    lo_passive_side.params.shape_width = pv_value;
                    CommonFunc.prototype.guiUpdateDisplay(lo_passive_side.gui);

                    lo_passive_side.rectangle.shape.scale.x = lv_scale;
                    lo_passive_side.render();
                    if (lo_active_side.params.is_space_adjust) {
                        lo_passive_side.shapes.adjust_splines_by_external_shape();
                    }


                }

            }



            if (lo_active_side.is_big_window) {
                $(lo_active_side.id_prefix + "id_shg_right_top").draggable("disable");//22062024
                $(lo_active_side.id_prefix + lo_active_side.id_side_shape_mod).draggable("disable");//26082024

            }

            lo_active_side.params.shape_width = pv_value;
            CommonFunc.prototype.guiUpdateDisplay(lo_active_side.gui);

            lo_active_side.rectangle.shape.scale.x = lv_scale;
            lo_active_side.render();


            if (lo_active_side.params.is_space_adjust) {
                lo_active_side.shapes.adjust_splines_by_external_shape();
                /////////lo_active_side.adjust_splines_by_shape_in_side(lo_active_side, pv_value);

            }


            lo_active_side.model_params_changed = true; // признак изменения данных модели

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

            lo_active_side.aspect = lo_active_side.container.clientWidth / lo_active_side.container.clientHeight;
            lo_active_side.renderer.setSize(lo_active_side.container.clientWidth, lo_active_side.container.clientHeight);
            lo_active_side.camera.aspect = lo_active_side.container.clientWidth / lo_active_side.container.clientHeight;
            lo_active_side.camera.updateProjectionMatrix();
            lo_active_side.render();


            lo_active_side.aspect_mod = lo_active_side.container_mod.clientWidth / lo_active_side.container_mod.clientHeight;
            lo_active_side.renderer_mod.setSize(lo_active_side.container_mod.clientWidth, lo_active_side.container_mod.clientHeight);
            lo_active_side.camera_mod.aspect = lo_active_side.container_mod.clientWidth / lo_active_side.container_mod.clientHeight;
            lo_active_side.camera_mod.updateProjectionMatrix();
            lo_active_side.render_mod();



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

            lo_active_side.model_params_changed = true; // признак изменения параметров модели

        }
        //------------------------------------------------------------------------
        Shape_generator.prototype.onclick_chb_curve_width_adjust = function (po_event, pv_value) {

            let lo_active_side = get_active_side_shape_generator();
            lo_active_side.params.is_curve_width_adjust = $(lo_active_side.id_prefix + "id_chb_curve_width_adjust")[0].checked;
            lo_active_side.model_params_changed = true; // признак изменения параметров модели

        }

        //------------------------------------------------------------------------
        Shape_generator.prototype.onclick_add_spline = function () {

            let lo_active_side = get_active_side_shape_generator();
            lo_active_side.shapes.add_spline();

            lo_active_side.model_params_changed = true; // признак изменения параметров модели

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

                let lo_active_side_shape_generator = get_active_side_shape_generator();

                let lo_sides_data = lo_active_side_shape_generator.read_model_sides_data();
                let lo_scene_mod = lo_active_side_shape_generator.scene_mod;

                lo_active_side_shape_generator.common_func.save_model(lo_sides_data, lo_scene_mod);
            }

            catch (e) {

                alert('error onclick_save_model: ' + e.stack);

            }
        }

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

            let lo_active_side_shape_generator;



            try {

                lo_active_side_shape_generator = get_active_side_shape_generator();


                if (lo_active_side_shape_generator.shapes == null) {
                    return;
                }
                if (lo_active_side_shape_generator.shapes.ar_splines_nodes == null) {
                    return;
                }



                //25072024 {
                //if (po_event.button != 0) {
                lo_active_side_shape_generator.is_gragging = true;
                //}
                //25072024 }



                let lar_findresult;

                lo_active_side_shape_generator.container.style.cursor = "default";

                if (lo_active_side_shape_generator.button_down) {

                    //@@if (lo_active_side_shape_generator.draggableObject) {


                    //1807202 lo_active_side_shape_generator.was_draggable = true;


                    //go_container.style.cursor = "pointer";
                    lo_active_side_shape_generator.container.style.cursor = "pointer";

                    let lo_pos = lo_active_side_shape_generator.common_func.recalc_coord_event2world(lo_active_side_shape_generator.camera, lo_active_side_shape_generator.container, event.clientX, event.clientY);

                    if (lo_pos == null) //03092024 
                    {
                        return;
                    }




                    while (true) {

                        //28072004
                        if (typeof lo_active_side_shape_generator.draggableObject == "undefined"
                            || lo_active_side_shape_generator.draggableObject == null) {
                            break;
                        }



                        if (lo_active_side_shape_generator.draggableObject.geometry.type == "LineGeometry") {

                            // rectangle

                            lo_active_side_shape_generator.container.style.cursor = "pointer";

                            lo_active_side_shape_generator.draggableObject.position.x = lo_pos.x + lo_active_side_shape_generator.delta_rect_drag_x;
                            lo_active_side_shape_generator.draggableObject.position.y = lo_pos.y + lo_active_side_shape_generator.delta_rect_drag_y;

                            lo_active_side_shape_generator.render();

                            break;
                        }



                        let lar_spline_points = lo_active_side_shape_generator.shapes.get_spline_points(lo_active_side_shape_generator.draggableObject.parent.parent);

                        if (lo_active_side_shape_generator.draggableObject.geometry.type == "BoxGeometry") {
                            // BoxGeometry

                            // Выделен один из крайних узлов, двигаем всю кривую (сплайн)
                            let lv_delta_x = lo_pos.x - lo_active_side_shape_generator.draggableObject.position.x;

                            for (let lv_i = 0; lv_i < lar_spline_points.length; lv_i++) {
                                lar_spline_points[lv_i].x = lar_spline_points[lv_i].x + lv_delta_x;
                            }

                            //go_container.style.cursor = "ew-resize";
                            lo_active_side_shape_generator.container.style.cursor = "ew-resize";

                        }

                        if (lo_active_side_shape_generator.draggableObject.geometry.type == "CircleGeometry") {

                            // Выделен один из остальных узлов, двигаем один узел
                            lo_active_side_shape_generator.draggableObject.position.x = lo_pos.x;
                            lo_active_side_shape_generator.draggableObject.position.y = lo_pos.y;

                        } // CircleGeometry


                        // Удаление предыдущих линий
                        let lar_lines = lo_active_side_shape_generator.shapes.get_lines_in_group(lo_active_side_shape_generator.draggableObject.parent.parent);
                        for (let lv_i = 0; lv_i < lar_lines.length; lv_i++) {
                            lo_active_side_shape_generator.common_func.removeObjectsWithChildren(lar_lines[lv_i], true);
                        }

                        // Перерисовка сегментов
                        lo_active_side_shape_generator.shapes.redraw_segments(lo_active_side_shape_generator.draggableObject.parent.parent);


                        lo_active_side_shape_generator.splines.draw_curve(lo_active_side_shape_generator.draggableObject.parent.parent, lar_spline_points, lo_active_side_shape_generator.splines.name_prefix, true);
                        lo_active_side_shape_generator.render();

                        break;

                    }// while

                    //@@}// draggableObject

                } //button down

                else {
                    // no button down

                    lo_active_side_shape_generator.container.style.cursor = "default";

                    // Формирование курсора мыши
                    while (true) {

                        let { top, left, width, height } = lo_active_side_shape_generator.container.getBoundingClientRect();
                        let lv_clickMouse = new THREE.Vector2();
                        lv_clickMouse.x = ((event.clientX - left) / width) * 2 - 1;
                        lv_clickMouse.y = - ((event.clientY - top) / height) * 2 + 1;

                        let lo_raycaster = new THREE.Raycaster();
                        lo_raycaster.setFromCamera(lv_clickMouse, lo_active_side_shape_generator.camera);

                        let lo_found;

                        lo_found = lo_raycaster.intersectObjects(lo_active_side_shape_generator.shapes.ar_splines_nodes, true);

                        if (lo_found.length) {

                            // Сплайн

                            let lo_object = lo_found[0].object;

                            if (lo_object.visible) {

                                if (lo_object.geometry.type == "BoxGeometry") {
                                    // Выделен один из крайних узлов, двигаем всю кривую (сплайн)
                                    //go_container.style.cursor = "ew-resize";
                                    lo_active_side_shape_generator.container.style.cursor = "ew-resize";
                                }

                                if (lo_object.geometry.type == "CircleGeometry") {
                                    // Выделен не крайний узел, двигаем один узел
                                    //go_container.style.cursor = "pointer";
                                    lo_active_side_shape_generator.container.style.cursor = "pointer";
                                }

                            }

                        }

                        if (lo_active_side_shape_generator.rectangle) {

                            lo_found = lo_raycaster.intersectObjects([lo_active_side_shape_generator.rectangle.shape]);
                            if (lo_found.length) {
                                lo_active_side_shape_generator.container.style.cursor = "pointer";
                                break;
                            }
                        }


                        break;

                    }// while

                } //lo_active_side_shape_generator.button_down


            }// try

            catch (e) {

                lo_active_side_shape_generator.container.style.cursor = "default";
                alert('error onmousemove: ' + e.stack);

            }

            //po_event.preventDefault();
            //po_event.stopPropagation();
            //return false;

        }

        //------------------------------------------------------------------------
        Shape_generator.prototype.onPointerUp = function (po_event) {

            po_event.stopPropagation();

            let lo_active_side = get_active_side_shape_generator();
            lo_active_side.button_down = false;
            lo_active_side.draggableObject = undefined;

            if (lo_active_side.shapes == null) {
                return;
            }


            let lar_splines_order = lo_active_side.shapes.SortSplinesOrderFromLeftToRight();//03082024
            lo_active_side.shapes.redraw_meshes_color(lar_splines_order);//03082024

            lo_active_side.render();





            //lo_active_side_shape_generator.is_gragging = false; //25072024



            //////27072024 {
            ////if (lo_active_side.prev_selected_splines.spline_left !== null
            ////    || lo_active_side.prev_selected_splines.spline_right !== null
            ////)
            ////{

            ////    lo_active_side_shape.shapes.select_shape_contour(lo_active_side.prev_selected_splines);

            ////}
            //////27072024 }











            //po_event.cancelBubble = true;
            //po_event.bubbles = false;

            //////    po_event.preventDefault();
            //////    po_event.stopPropagation();
            //////    return false;
        }


        //------------------------------------------------------------------------
        Shape_generator.prototype.onPointerDown = function (po_event) {

            let lo_active_side_shape_generator = get_active_side_shape_generator();

            try {

                if (lo_active_side_shape_generator.shapes == null) {
                    return;
                }


                let lo_clicked_spline_and_segment = lo_active_side_shape_generator.shapes.get_splines_and_segment_of_clicked_figure(po_event);


                if (po_event.button == 2 && po_event.buttons == 2) {

                    // Правая кнопка

                    // Выделение сегмента

                    let lo_clicked_spline = lo_clicked_spline_and_segment.spline_right;//13072024
                    let lo_clicked_segment = lo_clicked_spline_and_segment.segment;

                    if (lo_clicked_segment) {
                        lo_active_side_shape_generator.shapes.switch_visible_nodes_by_segment(lo_clicked_segment);
                        lo_active_side_shape_generator.render();
                    }

                    return;
                }



                if (po_event.button == 0 && po_event.buttons == 1) {

                    // Левая кнопка

                    let lo_active_side = get_active_side_shape_generator();

                    lo_active_side.button_down = true;


                    let lv_is_gragging = false;

                    while (true) {

                        let { top, left, width, height } = lo_active_side.container.getBoundingClientRect();//07052024


                        let lv_clickMouse = new THREE.Vector2();
                        lv_clickMouse.x = ((po_event.clientX - left) / width) * 2 - 1;
                        lv_clickMouse.y = - ((po_event.clientY - top) / height) * 2 + 1;

                        // {
                        // Определение - щелчок внутри фигуры, или нет
                        if (lo_active_side.rectangle) {

                            let lv_isInside = lo_active_side.common_func.IsInsideRectangle(po_event, lo_active_side.rectangle)

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
                        return;
                    }

                    //------------------------------------------------------------------------------------


                    // click

                    // Выделение границ фигуры между кривыми

                    let lo_active_side_shape = get_active_side_shape_generator();

                    let lo_clicked_splines_and_segment = lo_active_side_shape.shapes.get_splines_and_segment_of_clicked_figure(po_event);

                    let lo_clicked_splines = {
                        spline_left: lo_clicked_splines_and_segment.spline_left,
                        spline_right: lo_clicked_splines_and_segment.spline_right
                    };

                    let lo_prev_clicked_splines = lo_active_side_shape.group_contours.userData;

                    lo_active_side_shape.shapes.clear_group_contours();




                    if (lo_active_side_shape.group_contours.userData == null) {

                        lo_active_side_shape.shapes.select_shape_contour(lo_clicked_splines_and_segment);


                        //lo_active_side_shape.prev_selected_splines = {
                        //    spline_left: null,
                        //    spline_right: null
                        //};

                        ////////    //30072024 {
                        ////////    //28072024 {
                        ////////    lo_active_side_shape.prev_selected_splines.spline_left = lo_active_side_shape.group_contours.userData.spline_left;//27072024
                        ////////    lo_active_side_shape.prev_selected_splines.spline_right = lo_active_side_shape.group_contours.userData.spline_right;//27072024

                        ////////    //28072024 }
                        ////////    //30072024 }
                    }
                    else {

                        if (lo_clicked_splines.spline_left == lo_prev_clicked_splines.spline_left
                            && lo_clicked_splines.spline_right == lo_prev_clicked_splines.spline_right) {

                            lo_active_side_shape.group_contours.userData = null;
                        }
                        else {
                            lo_active_side_shape.shapes.select_shape_contour(lo_clicked_splines_and_segment);
                        }

                    }

                    lo_active_side_shape.render();

                }

            }

            catch (e) {

                alert('error onPointerDown: ' + e.stack);

            }


        }


        //////------------------------------------------------------------------------
        Shape_generator.prototype.onclick_shape = function (po_event) {

            ////    //14072024 {
            ////    //////////let lo_active_side_shape_generator = get_active_side_shape_generator();

            ////    //////////if (lo_active_side_shape_generator.was_draggable) {
            ////    //////////    lo_active_side_shape_generator.was_draggable = false;
            ////    //////////    return;
            ////    //////////}






            ////////25072024 {

            //////    let lo_active_side_shape_generator = get_active_side_shape_generator();


            //////    if (lo_active_side_shape_generator.is_gragging) {
            //////        // dragging
            //////        return;
            //////    }

            //////    // click

            //////    let lo_clicked_splines_and_segment = lo_active_side_shape_generator.shapes.get_splines_and_segment_of_clicked_figure(po_event);

            //////    let lo_clicked_splines = {
            //////        spline_left: lo_clicked_splines_and_segment.spline_left,
            //////        spline_right: lo_clicked_splines_and_segment.spline_right
            //////    };

            //////    let lo_prev_clicked_splines = lo_active_side_shape_generator.group_contours.userData;

            //////    lo_active_side_shape_generator.shapes.clear_group_contours();

            //////    if (lo_active_side_shape_generator.group_contours.userData == null)
            //////    {
            //////        lo_active_side_shape_generator.shapes.select_shape_contour(lo_clicked_splines_and_segment);

            //////    }
            //////    else
            //////    {

            //////        if (lo_clicked_splines.spline_left == lo_prev_clicked_splines.spline_left
            //////            && lo_clicked_splines.spline_right == lo_prev_clicked_splines.spline_right)
            //////        {
            //////            lo_active_side_shape_generator.group_contours.userData = null;
            //////        }
            //////        else {
            //////            lo_active_side_shape_generator.shapes.select_shape_contour(lo_clicked_splines_and_segment);
            //////        }

            //////    }

            //////


            //////    lo_active_side_shape_generator.render();

            //25072024 }



        }




        //------------------------------------------------------------------------
        Shape_generator.prototype.read_model_sides_data = function () {

            let lo_sides_data = new typ_sides_data();

            try {
                let lo_model_data = new typ_sides_data();

                let lo_up_side_shape_generator = get_side_shape_generator_by_prefix(gc_id_prefix_up);
                let lo_lateral_side_shape_generator = get_side_shape_generator_by_prefix(gc_id_prefix_lateral);

                ////lo_model_data.colorParts = this.read_color_parts();
                ////lo_model_data.data1 = lo_up_side_shape_generator.read_side_model_data();
                ////lo_model_data.data2 = lo_lateral_side_shape_generator.read_side_model_data();

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
                lo_gabarits = this.shapes.GetTwoShapeIntersect(lo_rect, lo_rect);
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

                this.clear_shape_objects(go_up_side_shape_generator);
                this.draw_side_shape_by_data(/*go_up_side_shape_generator,*/ sides_data.data1);


                go_up_side_shape_generator.render();


                //////////////////////this.clear_shape_objects(go_lateral_side_shape_generator);
                //////////////////////this.draw_side_shape_by_data(/*go_lateral_side_shape_generator,*/ sides_data.data2);

                //////////////////////go_lateral_side_shape_generator.render();
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











                po_side.segment_transform_data = null;
                po_side.segment_gabarits = null;
                po_side.segments = null;
                po_side.splines = null;
                po_side.shapes = null;


                let lar_no_delete = ["AmbientLight", "SpotLight", "Mesh"];// /*, "Group"*/14102024
                this.common_func.clearScene(po_side.scene, lar_no_delete);


                this.rectangle.shape.scale.y = 1;
            }

            catch (e) {

                alert('error clear_shape_objects: ' + e.stack);

            }
        }


        //------------------------------------------------------------------------
        Shape_generator.prototype.draw_side_shape_by_data = function (/*po_side,*/ po_side_data) {

            //for (let lv_i = 0; lv_i < po_side_data.numCurves; lv_i++) {


            //}

            /*po_side*/this.make_shape(true, po_side_data);

        }

        //=====================================================================

    } // (typeof this.create_shape_generator !== "function")


    //---------------------------------------------------------------------

    this.create_shape_generator();
    //06052024 this.render();//05052024
}

// end Class Shape_generator
//=====================================================================