import * as THREE from 'three';
//import * as THREE from "https://unpkg.com/three@v0.149.0/build/three.module.js"
//import { THREE } from "https://unpkg.com/three@v0.149.0/build/three.module.js"


export function struc_gabarits() {
    this.min = new THREE.Vector2(0, 0);
    this.max = new THREE.Vector2(0, 0);
    this.width = 0;
    this.height = 0;
}

export function struc_segment_transform_data() {
    this.kx = 0;
    this.ky = 0;
    this.distance_bt_x = 0;
}

export const cv_rectangle_name = "rectangle";
export const cv_spline_group_name_prefix = "spline_group";
export const cv_spline_name_prefix = "spline";
export const cv_segment_group_name_prefix = "segment_group";
export const cv_segment_name_prefix = "segment";



//function typ_ob_data() {

//    this.numCurves = 1;
//    this.idMaterial = 7;
//    this.idSize = 1;

//    this.CurveColors = new Array();
//    this.PointsCurves = new Array();

//    this.Lockedit = false;
//    this.Fl_manual_parameters = false;
//    this.M_Material = '';
//    this.M_Width = 0.0;
//    this.M_Height = 0.0;
//    this.M_Length = 0.0;
//    this.M_Price_rub = 0.0;
//    this.Part_gap = gv_Part_gap;
//}


//export function typ_model_data() {
//    this.color_parts = new Array();
//    this.curves_points_upper_side = new Array();
//    this.curves_points_lateral_side = new Array();
//};






//29102024v {


//export function typ_sides_data() {

//    this.ColorParts = new typ_color_data();
//    this.data1 = new typ_side_data();
//    this.data2 = new typ_side_data();

//};

export function typ_color_data() {
    //27012025 this.ColorParts = new Array();
    //this.ColorParts = new typ_color_part(); //27012025
    this.ColorParts = [][new typ_color_part()]; //27012025
}


export function typ_mesh_colors() {
    this.num_spline_left = null;
    this.num_spline_right = null;
    this.color = null;
};

//export function type_rotate_status() {
//    this.None = 0;              // нет вращения
//    this.Stop = 1;              // остановка вращения
//    this.clockwise = 2;         // вращение по часовой стрелке
//    this.Stop2 = 3;              // остановка вращения
//    this.counterclockwise = 4;  // вращение по часовой стрелке
//};

export var type_rotate_mode = {
    //None: 0,                // нет вращения
    stop: 0,                // остановка вращения
    clockwise: 1,           // вращение по часовой стрелке
    stop2: 2,               // остановка вращения
    counterclockwise: 3     // вращение по часовой стрелке

};

export function typ_progress_data() {
    this.client_id = "";
    this.task_id = "";
    this.path_result_file = "";
    this.common_outfilename_part = "";
    this.number_outfiles = "";

    this.progress_indicator = "";
    this.date_time_changed = "";

    this.names_part_files = [];//26012025
};



//----------------------------------------------------
export function typ_sides_data() {
    this.client_id = "0";
    this.task_id = "0";
    this.ColorParts = [][new typ_color_part()];
    this.data1 = new typ_side_data();
    this.data2 = new typ_side_data();
};


export function typ_color_part() {

    this.cell_color = "";
    this.right_top = new typ_2dcoord(); // new THREE.Vector2(0, 0);
    this.left_bottom = new typ_2dcoord(); // new THREE.Vector2(0,0) ;
    this.is_contour_visible = false;
    this.text_mesh = null;

};

export function typ_2dcoord() {
    this.x = null;
    this.y = null;
};


export function typ_side_data() {
    this.parameters = new typ_parameters();
    this.numCurves = 0;
    this.idMaterial = 0;
    this.idSize = 0;
    this.Lockedit = false;
    this.Fl_manual_parameters = false;
    this.M_Material = 0;
    this.M_Width = 0.0;
    this.M_Height = 0.0;
    this.M_Length = 0.0;
    this.M_Price_rub = 0.0;
    this.Part_gap = 0;
    this.CurveColors = []; //01112024  new Array();
    this.Segments_beg_points_numbers = []; //01112024  new Array();
    this.PointsCurves = []; // new Array();
    this.rectangle_scale_y = 0;
}


export function typ_parameters() {
    //this.is_space_adjust = false;
    //this.is_curve_width_adjust = false;
    //this.distance_bt_curves = 0;
    //this.distance_bt_curves_in_percent = 0;
    //this.shape_height = 0;
    //this.shape_width = 0;

    this.container_width = 0;
    this.container_height = 0;
    this.shape_width_beg = 0;
    this.shape_width = 0;
    this.shape_height_beg = 0;
    this.shape_height = 0;
    this.shape_amount_curves = 0;
    this.spline_amount_segments = 0;
    this.ajust_curves_by_shape = false;
    this.ajust_shape_by_curves = false;
    this.distance_between_curves_in_percent_of_width = 0;
    this.distance_bt_curves = 0;
    this.is_space_adjust = false;
    this.is_curve_width_adjust = false;
    this.color = +'#0000ff';//02052025
    this.rectangle_scale_y = 0;
}




export function typ_united_model_data() {
    this.model_name = "";
    this.sides_data = "";
    this.prev_model = "";
    this.screenshot = null;
    this.up_side_screenshot = null;//22012025
    this.lat_side_screenshot = null;//22012025
    this.end_side_screenshot = null;//22012025

}
