import * as THREE from 'three';

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



export function typ_color_data() {
    this.ColorParts = new Array();
}

export function typ_side_data() {
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
    this.CurveColors = new Array();
    this.PointsCurves = new Array();
}


export function typ_united_model_data() {
    this.model_name = "";
    this.sides_data = "";
    this.prev_model = "";
    this.screenshot = null;

}

//export var gs_ColorParts; // = new typ_color_data();
//export var gs_ob_model_data1; // = new typ_ob_data();
//export var gs_ob_model_data2; // = new typ_ob_data();

//export var go_model_data; //= {
////    colorParts: gs_ColorParts,
////    data1: gs_ob_model_data1,
////    data2: gs_ob_model_data2
////};

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
