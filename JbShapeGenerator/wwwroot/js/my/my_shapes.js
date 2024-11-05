import * as THREE from 'three';

import { Line2 } from 'three/addons/lines/Line2.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';

import {
    struc_gabarits,
    struc_segment_transform_data,
    cv_spline_group_name_prefix,
    cv_spline_name_prefix,
    cv_segment_group_name_prefix,
    cv_segment_name_prefix,
    typ_mesh_colors

} from "./my_common_types.js";


import { CommonFunc } from './my_common_func.js';
import { get_active_side_shape_generator } from './my_shape_generator.js';



import * as GeometryUtils from 'three/addons/utils/GeometryUtils.js';

//--------------------------------------------------------------------------

var my_object;
// Class Shapes
export function Shapes(po_main, po_scene, po_params, pv_is_use_data, po_side_data) {

    my_object = this;

    this.main_curves_group_prefix = "main_curves_group";

    ////const cv_node_diameter = 0.7;
    ////const cv_node_size = 2;


    // Свойства
    this.main = po_main;
    ////this.container = po_container;
    ////this.camera = po_camera;
    this.scene = po_scene;

    this.params = po_params;


    ////export function typ_side_data() {
    ////    this.numCurves = 0;
    ////    this.idMaterial = 0;
    ////    this.idSize = 0;
    ////    this.Lockedit = false;
    ////    this.Fl_manual_parameters = false;
    ////    this.M_Material = 0;
    ////    this.M_Width = 0.0;
    ////    this.M_Height = 0.0;
    ////    this.M_Length = 0.0;
    ////    this.M_Price_rub = 0.0;
    ////    this.Part_gap = 0;
    ////    this.CurveColors = new Array();
    ////    this.PointsCurves = new Array();
    ////}

    //03112024 {
    //////if (pv_is_use_data) {

    //////    po_params.shape_amount_curves = po_side_data.numCurves;
    //////    //this.shape_amount_curves = po_params.shape_amount_curves;

    //////    po_params.shape_width = po_side_data.M_Width;
    //////    po_params.shape_width_beg = po_params.shape_width;//02112024
    //////   //this.shape_width = po_params.shape_width;

    //////    po_params.shape_height = po_side_data.M_Height;
    //////    po_params.shape_height_beg = po_params.shape_height_beg; // po_params.shape_height;//02112024
    //////    //this.shape_height = po_params.shape_height;

    //////    po_params.ajust_shape_by_curves = po_side_data.parameters.is_space_adjust;
    //////    po_params.distance_bt_curves = po_side_data.parameters.distance_bt_curves;
    //////    po_params.distance_between_curves_in_percent_of_width = po_side_data.parameters.distance_bt_curves_in_percent;
    //////}
    //////else {

    //////    //this.shape_amount_curves = po_params.shape_amount_curves;

    //////    this.spline_amount_segments = po_params.spline_amount_segments;

    //////    //this.shape_width = po_params.shape_width;
    //////    //this.shape_height = po_params.shape_height;

    //////    //this.ajust_shape_by_curves = po_params.ajust_shape_by_curves;
    //////    //this.ajust_curves_by_shape = po_params.ajust_curves_by_shape;

    //////    //this.distance_between_curves_in_percent_of_width = po_params.distance_between_curves_in_percent_of_width;
    //////    //this.distance_between_curves = po_params.distance_bt_curves;


    //////}
    //03112024 }



    this.shape_amount_curves = po_params.shape_amount_curves;
    //this.spline_amount_segments = po_params.spline_amount_segments;

    this.shape_width = po_params.shape_width;
    this.shape_height = po_params.shape_height;

    this.ajust_shape_by_curves = po_params.ajust_shape_by_curves;
    this.ajust_curves_by_shape = po_params.ajust_curves_by_shape;

    this.distance_between_curves_in_percent_of_width = po_params.distance_between_curves_in_percent_of_width;
    this.distance_between_curves = po_params.distance_bt_curves;


    ////this.splines = [];
    ////this.splines_nodes = [];

    ////this.ar_indices_shape_spline_segment_points = [];


    this.group_rect = null;

    this.segment_gabarits = new struc_gabarits();
    this.segment_transform_data = new struc_segment_transform_data();

    //this.is_move_mode = pv_is_move_mode; // true - режим смещения кривой


    //this.shape_name_group_prefix = "shape_group";
    this.ar_splines = [];// Список group - сплайнов кривых в сцене
    this.ar_splines_nodes = [];// Список узлов всех сплайнов

    this.ar_selected_segments = []; // список выбранных сегментов 

    //this.previous_splines_count = 0;


    ///this.height_koef_previous = 1;

    this.ar_shapes_colors = []; // список объектов со сплайнами и цветами фигур, упорядоченных слева направо


    //=====================================================================

    if (typeof this.redraw_shapes != "function") {

        //----------------------------------------------------------
        // Методы
        //----------------------------------------------------------



        Shapes.prototype.create_shapes = function (pv_is_use_data, po_side_data) {


            let lv_spline_distance = 0;

            try {

                let lo_shape_splines_group = new THREE.Group();
                lo_shape_splines_group.name = this.main_curves_group_prefix;

                //let lv_shape_amount_curves = 0;

                if (pv_is_use_data) {
                    //lv_shape_amount_curves = po_side_data.numCurves;
                    this.shape_amount_curves = po_side_data.numCurves;
                }
                //04112024 {
                ////else {
                ////    ////this.segment_gabarits = this.main.segment_gabarits;
                ////    ////this.segment_transform_data = this.main.segment_transform_data;
                ////    ////lv_spline_distance = this.segment_transform_data.distance_bt_x;
                ////    //lv_shape_amount_curves = this.shape_amount_curves;
                ////}
                // 04112024 }


                this.segment_gabarits = this.main.segment_gabarits; //!!!!!!!!!!!!1111
                this.segment_transform_data = this.main.segment_transform_data; //!!!!!!!!!!!!1111
                lv_spline_distance = this.segment_transform_data.distance_bt_x; //!!!!!!!!!!!!1111





                //let lo_shape_splines_group = new THREE.Group();
                //lo_shape_splines_group.name = this.main_curves_group_prefix;


                // Сброс максимальной текущей координаты сплайнов y (длина модели)
                //let lo_active_side = get_active_side_shape_generator();

                ////this.main.current_spline_max_y = 0;


                for (let lv_i = 0; lv_i < this.shape_amount_curves; lv_i++) {

                    if (pv_is_use_data) {

                        this.main.splines.create_spline_by_data(lo_shape_splines_group, lv_i, /*lv_spline_offset_x, this.segment_transform_data,*/ /*pv_is_use_data, */ po_side_data);

                    }
                    else {
                        let lv_spline_offset_x;

                        lv_spline_offset_x = (lv_spline_distance / 2) + Math.abs(this.segment_gabarits.min.x)
                            + lv_spline_distance * lv_i;

                        this.main.splines.create_spline(lo_shape_splines_group, lv_spline_offset_x, this.segment_transform_data);

                    }

                }

                this.main.scene.add(lo_shape_splines_group);

                this.ar_splines = this.get_splines();
                this.ar_splines_nodes = this.get_splines_points();

            }

            catch (e) {

                alert('error create_shapes: ' + e.stack);

            }


        }
        //------------------------------------------------------------------------
        Shapes.prototype.get_splines = function () {

            let lar_out = [];

            try {

                let lar = this.main.scene.getObjectsByProperty("type", "Group");

                //let lv_i_end = lar.length;
                //for (let lv_i = 0; lv_i < lv_i_end; lv_i++) {
                for (let lv_i = 0; lv_i < lar.length; lv_i++) {
                    //30042024 if (lar[lv_i].name.indexOf(cv_spline_name_prefix) >= 0) {
                    if (lar[lv_i].name.indexOf(cv_spline_group_name_prefix) >= 0) { //30042024
                        lar_out.push(lar[lv_i]);
                    }
                }


            }

            catch (e) {

                alert('error get_splines: ' + e.stack);

            }


            return lar_out;
        }

        //-----------------------------------------------------------------
        Shapes.prototype.clear_group_contours = function () {

            for (let lv_i = 0; lv_i < this.main.group_contours.children.length; lv_i++) {
                this.main.common_func.removeObjectsWithChildren(this.main.group_contours.children[lv_i], true);
            }
        }
        //-----------------------------------------------------------------
        Shapes.prototype.clear_group_color_mesh = function () {

            for (let lv_i = 0; lv_i < this.main.group_color_mesh.children.length; lv_i++) {
                this.main.common_func.removeObjectsWithChildren(this.main.group_color_mesh.children[lv_i], true);
            }
        }

        //-----------------------------------------------------------------
        Shapes.prototype.get_splines_and_segment_of_clicked_figure = function (po_event) {

            let lo_spline_result_right = null;
            let lo_segment_result_right = null;
            let lo_prev_spline_right;
            let lo_prev_segment_right;

            //12072024 {
            let lo_spline_result_left = null;
            let lo_segment_result_left = null;
            let lo_prev_spline_left;
            let lo_prev_segment_left;
            //12072024 }

            let lo_line_to_right;
            let lo_line_to_left; //12072024

            try {

                let lo_active_side_shape_generator = get_active_side_shape_generator();//14072024 

                //14072024 let lo_container = $('#' + po_event.currentTarget.id)[0];
                let lo_container = lo_active_side_shape_generator.container; //14072024




                let lo_pos = this.main.common_func.recalc_coord_event2world(this.main.camera, lo_container, po_event.clientX, po_event.clientY); //06052024

                const lc_endline_right_x = 500;
                const lc_endline_left_x = -500;// 12072024


                lo_pos = this.main.common_func.recalc_coord_event2world(this.main.camera, lo_container, po_event.clientX, po_event.clientY); //06052024
                let lo_pos_plane = new THREE.Vector2(lo_pos.x, lo_pos.y);

                const lo_material = new THREE.LineBasicMaterial({ /*color: 0x0000ff*/ });//12072024

                let lar_points = [];

                // Line from mouse point to right
                lar_points.push(new THREE.Vector2(lo_pos_plane.x, lo_pos_plane.y));
                lar_points.push(new THREE.Vector2(lc_endline_right_x, lo_pos.y));
                let lo_geometry = new THREE.BufferGeometry().setFromPoints(lar_points);
                lo_line_to_right = new THREE.Line(lo_geometry, lo_material);

                // Line from mouse point to left

                lar_points = [];
                lar_points.push(new THREE.Vector2(lo_pos_plane.x, lo_pos_plane.y));
                lar_points.push(new THREE.Vector2(lc_endline_left_x, lo_pos.y));
                lo_geometry = new THREE.BufferGeometry().setFromPoints(lar_points);
                lo_line_to_left = new THREE.Line(lo_geometry, lo_material);

                lo_active_side_shape_generator.scene.add(lo_line_to_left);/////15072024



                lo_prev_spline_right = null;
                lo_prev_spline_left = null;


                for (let lv_i = 0; lv_i < this.ar_splines.length; lv_i++) {

                    let lv_line_index = this.ar_splines[lv_i].children.length - 1; //последний член массива - line

                    let lo_spl = this.ar_splines[lv_i].children[lv_line_index];

                    let lo_intersect_to_right_object = this.GetTwoShapeIntersect(lo_line_to_right, lo_spl);
                    let lo_intersect_to_left_object = this.GetTwoShapeIntersect(lo_line_to_left, lo_spl);

                    //////if (lo_intersect_to_right_object) {

                    //////	if (lo_prev_intersect_spline_right) {
                    //////		if (lo_intersect_to_right_object.min_x < lo_prev_intersect_spline_right.min_x) {
                    //////			lo_spline_result_right = lo_intersect_to_right_object.object;
                    //////			lo_prev_intersect_spline_right = lo_intersect_to_right_object;
                    //////		}
                    //////	}
                    //////	else {
                    //////		lo_prev_intersect_spline_right = lo_intersect_to_right_object;
                    //////		lo_spline_result_right = lo_intersect_to_right_object.object;

                    //////	}
                    //////}


                    //////if (lo_intersect_to_left_object) {

                    //////	if (lo_prev_intersect_spline_left) {
                    //////		//if (lo_intersect_to_left_object.max_x > lo_prev_intersect_object_left.max_x) {
                    //////		if (lo_intersect_to_left_object.min_x > lo_prev_intersect_spline_left.min_x) {
                    //////			lo_spline_result_left = lo_intersect_to_left_object.object;
                    //////			lo_prev_intersect_spline_left = lo_intersect_to_left_object;
                    //////		}
                    //////	}
                    //////	else {
                    //////		lo_prev_intersect_spline_left = lo_intersect_to_left_object;
                    //////		lo_spline_result_left = lo_intersect_to_left_object.object;

                    //////	}
                    //////}


                    if (lo_intersect_to_right_object) {

                        if (lo_prev_spline_right) {
                            if (lo_intersect_to_right_object.min_x < lo_prev_spline_right.min_x) {
                                lo_prev_spline_right = lo_spline_result_right;
                                lo_spline_result_right = lo_intersect_to_right_object;
                            }
                        }
                        else {
                            lo_prev_spline_right = lo_intersect_to_right_object;
                            lo_spline_result_right = lo_intersect_to_right_object;

                        }
                    }


                    if (lo_intersect_to_left_object) {

                        if (lo_prev_spline_left) {
                            //if (lo_intersect_to_left_object.max_x > lo_prev_intersect_object_left.max_x) {
                            if (lo_intersect_to_left_object.min_x > lo_prev_spline_left.min_x) {
                                lo_prev_spline_left = lo_spline_result_left;
                                lo_spline_result_left = lo_intersect_to_left_object;
                            }
                        }
                        else {
                            lo_prev_spline_left = lo_intersect_to_left_object;
                            lo_spline_result_left = lo_intersect_to_left_object;

                        }
                    }

                }

                /*//}*/

                //////catch (e) {

                //////	alert('error get_splines_and_segment_of_clicked_figure: ' + e);

                //////}



                // Поиск выбранного сегмента сплайна

                lo_prev_segment_left = null;
                lo_prev_segment_right = null;

                if (lo_spline_result_right) {

                    ////for (let lv_i = 0; lv_i < lo_spline_result_right.parent.children.length - 1; lv_i++) {

                    ////	if (lo_spline_result_right.parent.children[lv_i].type == "Group") {

                    ////		let lv_line_index = lo_spline_result_right.parent.children[lv_i].children.length - 1;

                    ////		let lo_segment_line = lo_spline_result_right.parent.children[lv_i].children[lv_line_index];

                    ////		let lo_intersect_object = this.GetTwoShapeIntersect(lo_line_to_right, lo_segment_line)

                    ////		if (lo_intersect_object) {

                    ////			if (lo_prev_intersect_segment_right) {
                    ////				if (lo_intersect_object.min_y < lo_prev_intersect_segment_right.min_y) {
                    ////					//16082024 lo_segment_result_right = lo_intersect_object.nspline;
                    ////					lo_segment_result_right = lo_intersect_object.object; //16082024
                    ////					lo_prev_intersect_segment_right = lo_intersect_object;
                    ////				}
                    ////			}
                    ////			else {
                    ////				lo_prev_intersect_segment_right = lo_intersect_object;
                    ////				//lv_result = lo_intersect_object.nspline;
                    ////				lo_segment_result_right = lo_intersect_object.object;

                    ////			}
                    ////		}
                    ////	}
                    ////}


                    for (let lv_i = 0; lv_i < lo_spline_result_right.object.parent.children.length - 1; lv_i++) {

                        if (lo_spline_result_right.object.parent.children[lv_i].type == "Group") {

                            let lv_line_index = lo_spline_result_right.object.parent.children[lv_i].children.length - 1;

                            let lo_segment_line = lo_spline_result_right.object.parent.children[lv_i].children[lv_line_index];

                            let lo_intersect_object = this.GetTwoShapeIntersect(lo_line_to_right, lo_segment_line)

                            if (lo_intersect_object) {

                                if (lo_prev_segment_right) {
                                    if (lo_intersect_object.min_y < lo_prev_segment_right.min_y) {
                                        //16082024 lo_segment_result_right = lo_intersect_object.nspline;
                                        lo_segment_result_right = lo_intersect_object.object; //16082024
                                        lo_prev_segment_right = lo_intersect_object;
                                    }
                                }
                                else {
                                    lo_prev_segment_right = lo_intersect_object;
                                    //lv_result = lo_intersect_object.nspline;
                                    lo_segment_result_right = lo_intersect_object.object;

                                }
                            }
                        }
                    }


                }



                ////if (lo_spline_result_left == lo_spline_result_right) {

                ////	if (lo_prev_intersect_spline_right) {
                ////		lo_spline_result_right = lo_prev_intersect_spline_right.object;
                ////	}
                ////	else {

                ////		if (lo_prev_intersect_spline_left) {
                ////			lo_spline_result_left = lo_prev_intersect_spline_left.object;
                ////		}

                ////	}

                ////}




                while (true) {


                    if (lo_spline_result_left && lo_spline_result_right) {

                        if (lo_spline_result_left.object == lo_spline_result_right.object) {


                            if (lo_prev_spline_left && lo_prev_spline_right) {

                                if (lo_spline_result_left.object != lo_prev_spline_left.object) {

                                    lo_spline_result_left = lo_prev_spline_left;

                                    //lo_spline_result_right = null;//18072024
                                }
                                else {


                                    if (lo_spline_result_right.object != lo_prev_spline_right.object) {

                                        lo_spline_result_right = lo_prev_spline_right;

                                        //lo_spline_result_left = lo_prev_spline_left;
                                        //lo_spline_result_right = null;
                                    }
                                    else {
                                        lo_spline_result_left = null;
                                    }

                                }
                                break;


                            }
                            else {

                                if (lo_prev_spline_left && lo_prev_spline_right == null) {

                                    if (lo_spline_result_left.object != lo_prev_spline_left.object) {
                                        lo_spline_result_right = null;
                                    }
                                    else {

                                        lo_spline_result_left = lo_prev_spline_left;
                                    }

                                    break;

                                }

                                else {

                                    if (lo_prev_spline_left == null && lo_prev_spline_right) {

                                        lo_spline_result_left = null;

                                    }

                                    else {

                                        if (lo_prev_spline_left == null && lo_prev_spline_right == null) {

                                        }

                                    }


                                }

                            }

                        }

                    }


                    break;
                }







                //if (lo_spline_result_left.object == lo_spline_result_right.object) {

                //	if (lo_prev_intersect_spline_left) {

                //		if (lo_spline_result_left.object != lo_prev_intersect_spline_left.object) {
                //			lo_spline_result_left = lo_prev_intersect_spline_left;
                //		}
                //		else {

                //			lo_spline_result_left = null;
                //			//if (lo_prev_intersect_spline_left) {
                //			//	if (lo_spline_result_left.object != lo_prev_intersect_spline_left.object) {
                //			//		lo_spline_result_left = lo_prev_intersect_spline_left;
                //			//	}

                //			//	lo_spline_result_left = lo_prev_intersect_spline_left;
                //			//}

                //		}



                //	}
                //	////else {

                //	////	if (lo_prev_intersect_spline_left) {
                //	////		lo_spline_result_left = lo_prev_intersect_spline_left;
                //	////	}

                //	////}

                //}






                //	}

                //}



                this.main.common_func.removeObjectsWithChildren(lo_line_to_left, true);
                this.main.common_func.removeObjectsWithChildren(lo_line_to_right, true);



            }

            catch (e) {

                alert('error get_splines_and_segment_of_clicked_figure: ' + /*e.message + "\n" +*/ e.stack);

            }


            let lo_out_sline_left = null;
            let lo_out_sline_right = null;
            //let lo_out_segment_right = null;


            if (lo_spline_result_left) {
                lo_out_sline_left = lo_spline_result_left.object;
            }
            if (lo_spline_result_right) {
                lo_out_sline_right = lo_spline_result_right.object;
            }


            return {

                spline_left: lo_out_sline_left,
                spline_right: lo_out_sline_right,
                segment: lo_segment_result_right
            }
        }



        //------------------------------------------------------------------------
        Shapes.prototype.draw_contour_and_shape = function (pv_color, po_spline_left, po_spline_right, pv_remember_contour, pv_remember_color, pv_draw_contour, pv_draw_shape) {


            try {


                //this.clear_group_color_mesh();


                //document.removeEventListener('pointerdown', this.onPointerDown);
                //window.removeEventListener('mousemove', this.onmousemove);


                // 30072024 {
                ////if (pv_is_clear_group_before) {

                ////	// Очистка группы от предыдущих объектов
                ////	for (let lv_i = 0; lv_i < this.main.group_contours.children.length; lv_i++) {
                ////		this.main.common_func.removeObjectsWithChildren(this.main.group_contours.children[lv_i], true);
                ////	}
                // 30072024 }

                ////}


                if (!po_spline_left && !po_spline_right) {
                    return;
                }


                let lar_positions = [];

                let lar_shape_positions = [];

                let lar_left_points = null;
                let lar_right_points = null;




                let lo_geometry = new LineGeometry();
                let clrs = [];

                let lo_resolution = new THREE.Vector2();
                this.main.renderer.getSize(lo_resolution);


                let lo_material = new LineMaterial({
                    //color: new THREE.Color("#f00").getHex(),
                    vertexColors: 0x001, //0x0f0,//0x00f, //VertexColors,
                    linewidth: 2, //0.6,  // толщина линии
                    resolution: lo_resolution
                    //resolution: this.main.resolution //30072024
                });

                let lo_shape2 = null;
                let lo_geometry2 = null;
                let lo_mesh2 = null;




                let lo_rectangle_coordinates = this.main.get_rectangle_coordinates_by_name(this.main.rectangle.cv_rectangle_name);


                if (po_spline_left && po_spline_right) {

                    // Два сплайна
                    lar_left_points = this.main.common_func.getLinePoints(po_spline_left);
                    lar_right_points = this.main.common_func.getLinePoints(po_spline_right);


                    lar_positions.push(lar_right_points[0].x, lar_right_points[0].y, 0);
                    lar_shape_positions.push(new THREE.Vector2(lar_right_points[0].x, lar_right_points[0].y, 0));

                    for (let lv_i = 0; lv_i < lar_left_points.length; lv_i++) {
                        lar_positions.push(lar_left_points[lv_i].x, lar_left_points[lv_i].y, 0);
                        lar_shape_positions.push(new THREE.Vector2(lar_left_points[lv_i].x, lar_left_points[lv_i].y, 0));
                    }

                    for (let lv_i = lar_right_points.length - 1; lv_i >= 0; lv_i--) {
                        lar_positions.push(lar_right_points[lv_i].x, lar_right_points[lv_i].y, 0);
                        lar_shape_positions.push(new THREE.Vector2(lar_right_points[lv_i].x, lar_right_points[lv_i].y, 0));
                    }



                }
                if (po_spline_left && !po_spline_right) {

                    // Сплайн слева
                    lar_left_points = this.main.common_func.getLinePoints(po_spline_left);

                    for (let lv_i = 0; lv_i < lar_left_points.length; lv_i++) {
                        lar_positions.push(lar_left_points[lv_i].x, lar_left_points[lv_i].y, 0);
                        lar_shape_positions.push(new THREE.Vector2(lar_left_points[lv_i].x, lar_left_points[lv_i].y, 0));
                    }

                    lar_positions.push(lo_rectangle_coordinates.max_x, lo_rectangle_coordinates.max_y, 0);
                    lar_positions.push(lo_rectangle_coordinates.max_x, lo_rectangle_coordinates.min_y, 0);
                    lar_positions.push(lar_left_points[0].x, lo_rectangle_coordinates.min_y, 0);

                    lar_shape_positions.push(new THREE.Vector2(lo_rectangle_coordinates.max_x, lo_rectangle_coordinates.max_y, 0));
                    lar_shape_positions.push(new THREE.Vector2(lo_rectangle_coordinates.max_x, lo_rectangle_coordinates.min_y, 0));
                    lar_shape_positions.push(new THREE.Vector2(lar_left_points[0].x, lo_rectangle_coordinates.min_y, 0));

                }

                if (!po_spline_left && po_spline_right) {

                    // Сплайн справа
                    lar_right_points = this.main.common_func.getLinePoints(po_spline_right);

                    for (let lv_i = 0; lv_i < lar_right_points.length; lv_i++) {
                        lar_positions.push(lar_right_points[lv_i].x, lar_right_points[lv_i].y, 0);
                        lar_shape_positions.push(new THREE.Vector2(lar_right_points[lv_i].x, lar_right_points[lv_i].y, 0));
                    }

                    lar_positions.push(lo_rectangle_coordinates.min_x, lo_rectangle_coordinates.max_y, 0);
                    lar_positions.push(lo_rectangle_coordinates.min_x, lo_rectangle_coordinates.min_y, 0);
                    lar_positions.push(lar_right_points[0].x, lo_rectangle_coordinates.min_y, 0);

                    lar_shape_positions.push(new THREE.Vector2(lo_rectangle_coordinates.min_x, lo_rectangle_coordinates.max_y, 0));
                    lar_shape_positions.push(new THREE.Vector2(lo_rectangle_coordinates.min_x, lo_rectangle_coordinates.min_y, 0));
                    lar_shape_positions.push(new THREE.Vector2(lar_right_points[0].x, lo_rectangle_coordinates.min_y, 0));

                }


                //try {


                // Определение номеров выделенных сплайнов слева направо
                let lar_splines_order = [];
                lar_splines_order = this.SortSplinesOrderFromLeftToRight();//28072024

                let lv_num_spline_left = this.main.common_func.getNumberBySpline(lar_splines_order, po_spline_left);
                let lv_num_spline_right = this.main.common_func.getNumberBySpline(lar_splines_order, po_spline_right);


                let lo_userData = {
                    spline_left: po_spline_left,
                    spline_right: po_spline_right,
                    num_spline_left: lv_num_spline_left,
                    num_spline_right: lv_num_spline_right

                };

                if (pv_remember_contour) {

                    ////let lo_userData = {
                    ////	spline_left: po_spline_left,
                    ////	spline_right: po_spline_right,
                    ////	num_spline_left: lv_num_spline_left,
                    ////	num_spline_right: lv_num_spline_right

                    ////};


                    this.main.group_contours.userData = lo_userData;

                }



                let lo_countour_line = null;

                if (pv_draw_contour) {

                    lar_positions.forEach(() => {
                        clrs.push(0, 0, 255);//!! цвет линии
                    });

                    lo_geometry.setPositions(lar_positions);
                    lo_geometry.setColors(clrs);


                    lo_countour_line = new Line2(lo_geometry, lo_material);

                    lo_countour_line.renderOrder = 2;
                    this.main.group_contours.add(lo_countour_line);

                }



                if (pv_draw_shape) {


                    lo_shape2 = new THREE.Shape(lar_shape_positions);
                    lo_geometry2 = new THREE.ShapeGeometry(lo_shape2);
                    //lo_mesh2 = new THREE.Mesh(lo_geometry2, new THREE.MeshPhongMaterial({ color: 0xff00ff, side: THREE.DoubleSide }));
                    //lo_mesh2 = new THREE.Mesh(lo_geometry2, new THREE.MeshPhongMaterial({ color: pv_color, side: THREE.DoubleSide }));
                    lo_mesh2 = new THREE.Mesh(lo_geometry2, new THREE.MeshBasicMaterial({ color: pv_color/*, side: THREE.DoubleSide*/ }));


                    if (pv_remember_color) {

                        // Запоминание в массиве цвета фигуры
                        let lo_mesh_color_data = new typ_mesh_colors();

                        lo_mesh_color_data.num_spline_left = lv_num_spline_left;
                        lo_mesh_color_data.num_spline_right = lv_num_spline_right;
                        lo_mesh_color_data.color = pv_color;

                        // Определение индекса в массиве для сохранения
                        let lv_ar_shapes_colors_idx;

                        //if (lo_mesh_color_data.num_spline_left == null && lo_mesh_color_data.num_spline_right >= 0) {
                        if (lo_mesh_color_data.num_spline_left == null && lo_mesh_color_data.num_spline_right !== null) {
                            // крайняя левая фигура
                            lv_ar_shapes_colors_idx = 0;
                        }

                        //					if (lo_mesh_color_data.num_spline_left >= 0 && lo_mesh_color_data.num_spline_right >= 0) {
                        if (lo_mesh_color_data.num_spline_left !== null && lo_mesh_color_data.num_spline_right !== null) {
                            //средняя фигура
                            lv_ar_shapes_colors_idx = lo_mesh_color_data.num_spline_left + 1;
                        }

                        //if (lo_mesh_color_data.num_spline_left >= 0 && lo_mesh_color_data.num_spline_right == null) {
                        if (lo_mesh_color_data.num_spline_left !== null && lo_mesh_color_data.num_spline_right == null) {
                            // крайняя правая фигура
                            lv_ar_shapes_colors_idx = lo_mesh_color_data.num_spline_left + 2;
                        }


                        this.ar_shapes_colors[lv_ar_shapes_colors_idx] = lo_mesh_color_data;
                    }

                    lo_mesh2.renderOrder = 1;
                    this.main.group_color_mesh.add(lo_mesh2);

                }


                //document.removeEventListener('pointerdown', this.onPointerDown);






                //30072024 leaks {
                //==========================================

                lar_positions = null;
                lar_left_points = null;
                lar_right_points = null;
                lo_geometry = null;
                clrs = null;
                lo_material = null;
                lo_rectangle_coordinates = null;
                lo_userData = null;
                lo_countour_line = null;
                lar_splines_order = null;
                lar_splines_order = null;
                lv_num_spline_left = null;
                lv_num_spline_right = null;

                lar_shape_positions = null;
                lo_shape2 = null;
                lo_mesh2 = null;
                lo_geometry2 = null;

                //==========================================
                //30072024 leaks }

            }

            catch (e) {

                alert('error draw_contour_and_shape: ' + e.stack);

            }

        }

        //-----------------------------------------------------------------
        Shapes.prototype.get_left_and_right_splines_of_clicked_figure = function (po_event) {

            let lo_spline_result = null;
            let lo_segment_result = null;
            let lo_prev_intersect_object = null;

            let lo_line;

            try {

                let lo_container = $('#' + po_event.currentTarget.id)[0];

                //06052024 let lo_pos = this.main.common_func.recalc_coord_event2world(this.main.camera, this.main.container, po_event.clientX, po_event.clientY);
                let lo_pos = this.main.common_func.recalc_coord_event2world(this.main.camera, lo_container, po_event.clientX, po_event.clientY); //06052024

                const lc_endline_x = 500;


                let lo_active_side_shape_generator = get_active_side_shape_generator();

                lo_pos = this.main.common_func.recalc_coord_event2world(this.main.camera, lo_container, po_event.clientX, po_event.clientY); //06052024
                let lo_pos_plane = new THREE.Vector2(lo_pos.x, lo_pos.y);

                const lo_material = new THREE.LineBasicMaterial({ color: 0x0000ff });

                const lar_points = [];
                lar_points.push(new THREE.Vector2(lo_pos_plane.x, lo_pos_plane.y));
                lar_points.push(new THREE.Vector2(lc_endline_x, lo_pos.y));
                const lo_geometry = new THREE.BufferGeometry().setFromPoints(lar_points);
                lo_line = new THREE.Line(lo_geometry, lo_material);

                lo_prev_intersect_object = null;


                for (let lv_i = 0; lv_i < this.ar_splines.length; lv_i++) {
                    //let lv_spline_name = this.get_spline_name_by_number(lv_i);
                    //let lo_spl = po_scene.getObjectByName(lv_spline_name);

                    let lv_line_index = this.ar_splines[lv_i].children.length - 1; //последний член массива - line

                    let lo_spl = this.ar_splines[lv_i].children[lv_line_index];

                    let lo_intersect_object = this.GetTwoShapeIntersect(lo_line, lo_spl)
                    if (lo_intersect_object) {

                        if (lo_prev_intersect_object) {
                            if (lo_intersect_object.min_x < lo_prev_intersect_object.min_x) {
                                lo_spline_result = lo_intersect_object.object;
                                lo_prev_intersect_object = lo_intersect_object;
                            }
                        }
                        else {
                            lo_prev_intersect_object = lo_intersect_object;
                            lo_spline_result = lo_intersect_object.object;

                        }


                    }
                }

            }

            catch (e) {

                alert('error get_splines_and_segment_of_clicked_figure: ' + e.stack);

            }


            // Поиск выбранного сегмента сплайна
            lo_prev_intersect_object = null;

            if (lo_spline_result) {

                for (let lv_i = 0; lv_i < lo_spline_result.parent.children.length - 1; lv_i++) {

                    if (lo_spline_result.parent.children[lv_i].type == "Group") {

                        let lv_line_index = lo_spline_result.parent.children[lv_i].children.length - 1;

                        let lo_segment_line = lo_spline_result.parent.children[lv_i].children[lv_line_index];

                        let lo_intersect_object = this.GetTwoShapeIntersect(lo_line, lo_segment_line)

                        if (lo_intersect_object) {

                            if (lo_prev_intersect_object) {
                                if (lo_intersect_object.min_y < lo_prev_intersect_object.min_y) {
                                    lo_segment_result = lo_intersect_object.nspline;
                                    lo_prev_intersect_object = lo_intersect_object;
                                }
                            }
                            else {
                                lo_prev_intersect_object = lo_intersect_object;
                                //lv_result = lo_intersect_object.nspline;
                                lo_segment_result = lo_intersect_object.object;

                            }
                        }
                    }
                }

            }

            return {
                //spline: lo_spline_result,
                segment: lo_segment_result
            }
        }




        ////------------------------------------------------------------------------
        //Shapes.prototype.draw_spline_contour = function (po_spline_left, po_spline_right) {

        //}




        //------------------------------------------------------------------------
        Shapes.prototype.get_spline_name_by_number = function (pv_spline_number) {
            return "spline_" + pv_spline_number;
        }

        //------------------------------------------------------------------------
        Shapes.prototype.delete_splines = function () {

            if (this.ar_selected_segments.length == 0) {
                return;
            }


            let lv_question;
            if (this.ar_selected_segments.length == 1) {
                lv_question = "Delete curve?";
            }
            else {

                lv_question = "Delete curves?";

            }


            this.main.common_func.show_question(lv_question,
                function () {

                    let lo_active_side_shape_generator = get_active_side_shape_generator();

                    lo_active_side_shape_generator.shapes.do_delete_splines();

                    $(this).dialog("close");
                },
                function () { $(this).dialog("close"); }, null);

        }


        //------------------------------------------------------------------------
        Shapes.prototype.do_delete_splines = function () {

            let lo_parent;
            let lo_parent_parent;

            for (let lv_i = this.ar_selected_segments.length - 1; lv_i >= 0; lv_i--) {

                if (this.ar_selected_segments[lv_i].parent) {

                    if (this.ar_selected_segments[lv_i].parent.parent) {


                        let lo_parent = this.ar_selected_segments[lv_i].parent;
                        let lo_parent_parent = this.ar_selected_segments[lv_i].parent.parent;


                        this.do_delete_spline(lo_parent_parent);


                        // Удаление сплайна из списка
                        for (let lv_i = 0; lv_i < this.ar_splines.length; lv_i++) {

                            if (this.ar_splines[lv_i] == lo_parent_parent) {

                                this.ar_splines.splice(lv_i, 1);
                            }

                        }


                        // удаление удалённых узлов из списка
                        for (let lv_i = this.ar_splines_nodes.length - 1; lv_i >= 0; lv_i--) {

                            //////if (this.ar_splines_nodes[lv_i].parent == lo_parent) {
                            ////if (this.ar_splines_nodes[lv_i].parent.parent == lo_parent_parent) {
                            ////	this.ar_splines_nodes.splice(lv_i, 1);
                            ////}


                            if (this.ar_splines_nodes[lv_i].parent == null) {
                                this.ar_splines_nodes.splice(lv_i, 1);
                            }
                        }


                        lo_parent_parent.removeFromParent();


                    }
                }

            }


            // очистка списка выделенных сегментов
            this.ar_selected_segments = [];


            this.main.render();

            let lo_active_side = get_active_side_shape_generator();
            lo_active_side.model_params_changed = true; // признак изменения параметров модели

        }
        //------------------------------------------------------------------------
        Shapes.prototype.do_delete_spline = function (po_spline_group) {

            for (let lv_i = po_spline_group.children.length - 1; lv_i >= 0; lv_i--) {

                let lo_object = po_spline_group.children[lv_i];

                this.main.common_func.removeObjectsWithChildren(lo_object, true);

            }

        }

        //------------------------------------------------------------------------
        Shapes.prototype.add_spline = function () {

            let lv_spline_distance = this.segment_transform_data.distance_bt_x;
            let lv_spline_offset_x;
            lv_spline_offset_x = (lv_spline_distance / 2) + Math.abs(this.segment_gabarits.min.x)
                + lv_spline_distance * this.ar_splines.length;



            ////let lo_spline_group = new THREE.Group();
            //////lo_group_shape.name = this.main.common_func.get_object_name(this.shape_name_group_prefix, lo_group_shape);
            ////lo_spline_group.name = this.main.common_func.get_object_name(cv_spline_group_name_prefix, lo_spline_group);
            // группа всех кривых

            let lo_main_curves_group = this.main.scene.getObjectByName(this.main_curves_group_prefix);
            if (!lo_main_curves_group) {
                return;
            }

            ///04112024 this.height_koef_previous

            this.main.splines.create_spline(lo_main_curves_group, lv_spline_offset_x, /*this.height_koef_previous,*/ this.segment_transform_data);//30042024



            this.ar_splines = this.get_splines();
            this.ar_splines_nodes = this.get_splines_points();

            this.main.render();


            if (this.params.is_space_adjust) {

                //this.adjust_space_bt_splines_by_shape();
                this.adjust_splines_by_external_shape();
            }

        }

        //------------------------------------------------------------------------
        Shapes.prototype.adjust_splines_by_external_shape = function (pv_height_new) {

            //let lo_active_side = get_active_side_shape_generator();


            this.clear_group_contours();//27072024 
            this.clear_group_color_mesh();//27072024 


            let lv_height_koef_relative;
            let lv_height_koef;

            //03112024 {

            //////lv_height_koef = this.params.shape_height / (this.main.params.shape_height_beg);
            //////if (this.height_koef_previous !== 0) {
            //////    lv_height_koef_relative = lv_height_koef / this.height_koef_previous;
            //////}
            //////else {
            //////    lv_height_koef_relative = 1;
            //////}

            let lv_splines_height = this.get_current_splines_height();

            if (lv_splines_height !== 0) {
                lv_height_koef_relative = this.params.shape_height / lv_splines_height;
                //lv_height_koef_relative = this.params.shape_height / this.main.current_spline_max_y;
                //lv_height_koef_relative = this.main.current_spline_max_y / this.params.shape_height;

                    
;
            }
            else {
                lv_height_koef_relative = 1;

            }


            //03112024 }

            let lv_spline_distance = this.params.shape_width / this.ar_splines.length;



            for (let lv_i = 0; lv_i < this.ar_splines.length; lv_i++) {

                let lv_spline_offset_x;

                lv_spline_offset_x = lv_spline_distance * (0.5 + lv_i);

                this.adjust_segments_nodes_by_external_shape(this.ar_splines[lv_i], lv_spline_offset_x, lv_height_koef_relative);


                // чтение модифицированных позиций узлов
                let lar_spline_points = this.main.shapes.get_spline_points(this.ar_splines[lv_i]);

                // Удаление предыдущих линий
                let lar_lines = this.main.shapes.get_lines_in_group(this.ar_splines[lv_i]);
                for (let lv_k = 0; lv_k < lar_lines.length; lv_k++) {
                    this.main.common_func.removeObjectsWithChildren(lar_lines[lv_k], true);
                }

                // Перерисовка сегментов
                ///@@@@@ 08062024 this.main.shapes.redraw_segments(this.ar_splines[lv_i]);

                // создание новой линии
                this.main.splines.draw_curve(this.ar_splines[lv_i], lar_spline_points, this.main.splines.name_prefix, true);


                //	 Запоминание новой кривой
                //	this.set_spline_points(this.ar_splines[lv_i], lar_spline_points);//13062024
            }

            //04112024 this.height_koef_previous = lv_height_koef;





            //298072024 {
            //////27072024 {
            ////if (this.main.prev_selected_splines.spline_left !== null
            ////	|| this.main.prev_selected_splines.spline_left !== null
            ////) {
            ////	this.select_shape_contour(this.main.prev_selected_splines);
            ////}
            //////27072024 }


            // Восстановление выделенного контура
            let lar_splines_order = []; //03082024 

            if (this.main.group_contours.userData) {

                if (this.main.group_contours.userData.num_spline_left != null || this.main.group_contours.userData.num_spline_right != null) {

                    lar_splines_order = this.SortSplinesOrderFromLeftToRight();

                    let lv_num_spline_left = this.main.group_contours.userData.num_spline_left;
                    let lv_num_spline_right = this.main.group_contours.userData.num_spline_right;


                    let lo_spline_left = this.main.common_func.getSplineByNumber(lar_splines_order, lv_num_spline_left);
                    let lo_spline_right = this.main.common_func.getSplineByNumber(lar_splines_order, lv_num_spline_right);

                    this.draw_contour_and_shape(0x0f0, lo_spline_left, lo_spline_right, true, false, true, false/*, true*/);
                }
            }
            //298072024 }


            //03082024 {
            // Восстановление цвета фигур
            ////////////this.clear_group_color_mesh();//03082024
            ////////////this.main.render();

            //////////for (let lv_i = 0; lv_i < this.ar_shapes_colors.length; lv_i++) {

            //////////	if (this.ar_shapes_colors[lv_i] == null || !this.ar_shapes_colors[lv_i]) {
            //////////		continue;
            //////////	}
            //////////	let lo_spline_left = this.main.common_func.getSplineByNumber(lar_splines_order, this.ar_shapes_colors[lv_i].num_spline_left);
            //////////	let lo_spline_right = this.main.common_func.getSplineByNumber(lar_splines_order, this.ar_shapes_colors[lv_i].num_spline_right);
            //////////	this.draw_contour_and_shape(this.ar_shapes_colors[lv_i].color, lo_spline_left, lo_spline_right, false, true);
            //////////}

            this.redraw_meshes_color(lar_splines_order);

            //03082024 }


            this.main.render();

        }



        //-----------------------------------------------------------------
        // получение текущей высоты (длины) кривых
        Shapes.prototype.get_current_splines_height = function () {

            let lv_result = 1;

            try {

                if (this.ar_splines_nodes.length > 0) {

                    lv_result = this.ar_splines_nodes[this.ar_splines_nodes.length - 1].position.y;
                }
            }

            catch (e) {

                alert('error get_current_splines_height: ' + e.stack);

            }

            return lv_result;

        }


        //-----------------------------------------------------------------
        // Восстановление цвета фигур
        Shapes.prototype.redraw_meshes_color = function (par_splines_order) {

            try {

                this.clear_group_color_mesh();//03082024
                //this.main.render();

                for (let lv_i = 0; lv_i < this.ar_shapes_colors.length; lv_i++) {

                    if (this.ar_shapes_colors[lv_i] == null || !this.ar_shapes_colors[lv_i]) {
                        continue;
                    }
                    let lo_spline_left = this.main.common_func.getSplineByNumber(par_splines_order, this.ar_shapes_colors[lv_i].num_spline_left);
                    let lo_spline_right = this.main.common_func.getSplineByNumber(par_splines_order, this.ar_shapes_colors[lv_i].num_spline_right);
                    this.draw_contour_and_shape(this.ar_shapes_colors[lv_i].color, lo_spline_left, lo_spline_right, false, false, false, true);
                    //this.draw_contour_and_shape(this.ar_shapes_colors[lv_i].color, lo_spline_left, lo_spline_right, false, false, true, true);//05082024
                }


            }

            catch (e) {

                alert('error redraw_meshes_color: ' + e.stack);

            }
        }
        //-----------------------------------------------------------------
        Shapes.prototype.move_curve_along_x = function (po_moved_node, pv_delta_x) {

            try {


                let lo_spline_group = po_moved_node.parent.parent;

                let lar_spline_points = this.get_spline_points(lo_spline_group);

                // Сдвиг узлов по оси x
                for (let lv_i = 0; lv_i < lar_spline_points.length; lv_i++) {
                    lar_spline_points.x = lar_spline_points.x + pv_delta_x;
                }


                this.main.splines.draw_curve(lo_spline_group, lar_spline_points, cv_spline_name_prefix, true);


            }

            catch (e) {

                alert('error move_curve_along_x: ' + e.stack);

            }


        }

        //-----------------------------------------------------------------

        Shapes.prototype.set_shape_color = function (po_spline_left, po_spline_right, pv_color) {

            try {

                let lar_left_points = this.main.common_func.getLinePoints(po_spline_left);
                let lar_right_points = this.main.common_func.getLinePoints(po_spline_right);
                let lar_left_points_reversed = lar_left_points.reverse();



                let lo_shape = new THREE.Shape()
                    .splineThru(lar_right_points)
                    .splineThru(lar_left_points_reversed);

                ///////////////////////////////////////////////this.addShape(lo_shape, 0x0000ff);


                lo_shape = new THREE.Shape()
                    .moveTo(0, lar_left_points[0].y)
                    .splineThru(lar_left_points)
                    .lineTo(0, lar_left_points[lar_left_points.length - 1].y)
                    .lineTo(0, lar_left_points[0].y);

				//lo_shape.autoClose = true;


		        ///////////////////////////////////////////////////////////this.addShape(lo_shape, pv_color);

				//==================================================================================
				// Line2 ( LineGeometry, LineMaterial )


				////////const positions = [];
				////////const colors = [];

				////////const points = GeometryUtils.hilbert3D(new THREE.Vector3(0, 0, 0), 20.0, 1, 0, 1, 2, 3, 4, 5, 6, 7);

				////////const spline = new THREE.CatmullRomCurve3(points);
				////////const divisions = Math.round(12 * points.length);
				////////const point = new THREE.Vector3();
				////////const color = new THREE.Color();

				////////for (let i = 0, l = divisions; i < l; i++) {

				////////	const t = i / l;

				////////	spline.getPoint(t, point);
				////////	positions.push(point.x, point.y, point.z);

				////////	color.setHSL(t, 1.0, 0.5, THREE.SRGBColorSpace);
				////////	colors.push(color.r, color.g, color.b);


				////////}




				////////const geometry2 = new LineGeometry();
				////////geometry2.setPositions(lar_right_points);
				////////geometry2.setColors(colors);

				////////let matLine2 = new LineMaterial({

				////////	color: 0xffffff,
				////////	linewidth: 15, // in world units with size attenuation, pixels otherwise
				////////	vertexColors: true,

				////////	//resolution:  // to be set by renderer, eventually
				////////	dashed: false,
				////////	alphaToCoverage: false //true,


				////////});

				////////let line2 = new Line2(geometry2, matLine2);
				////////line2.computeLineDistances();
				////////line2.scale.set(1, 1, 1);
				////////line2.visible = true;
				////////this.scene.add(line2);

				////////matLine2.resolution.set(window.innerHeight, window.innerHeight); // resolution of the inset viewport





				//////let cv_rect_height = 100;
				//////let cv_rect_width = 100;











				////////////////////let positions = [];

				//////////////////////////positions.push(0, 0, 0);
				//////////////////////////positions.push(0, cv_rect_height, 0);
				//////////////////////////positions.push(cv_rect_width, cv_rect_height, 0);
				//////////////////////////positions.push(cv_rect_width, 0, 0);
				//////////////////////////positions.push(0, 0, 0);

				//////////////////////positions = lar_right_points;

				//////////////////////positions.push(0, 0);
				//////////////////////positions.push(0, cv_rect_height);
				//////////////////////positions.push(cv_rect_width, cv_rect_height);
				//////////////////////positions.push(cv_rect_width, 0);
				//////////////////////positions.push(0, 0);

				////////////////////for (let lv_ii = 0; lv_ii < lar_right_points.length; lv_ii++) {
				////////////////////	positions.push(lar_right_points[lv_ii].x, lar_right_points[lv_ii].y, 0);
				////////////////////}



				//////////////////////let lv_color = 0x0040f0;
				//////////////////////let lv_color = 0x00ff00;

				//////////////////////let lv_x = 0; 


				//////////////////////let lv_y = 0;

				////////////////////const clrs = [];

				////////////////////positions.forEach(() => {
				////////////////////	clrs.push(0, 0, 255);//!! цвет линии
				////////////////////});


				////////////////////let geometry = new LineGeometry();

				////////////////////geometry.setPositions(positions);/////

				////////////////////geometry.setColors(clrs);

				////////////////////let resolution = new THREE.Vector2();

				////////////////////let renderer = new THREE.WebGLRenderer({  });
				////////////////////renderer.getSize(resolution);

				////////////////////let material = new LineMaterial({
				////////////////////	//color: new Color("#fff").getHex(),
				////////////////////	vertexColors: 0x00f, //VertexColors,
				////////////////////	linewidth: 0.8, //0.5, //1, //2,
				////////////////////	resolution
				////////////////////});

				//////////////////////material.needsUpdate = true;

				////////////////////let lo_line = new Line2(geometry, material);
				//////////////////////lo_line.computeLineDistances();

				//////////////////////lo_line.position.set(lv_x, lv_y);

				////////////////////this.scene.add(lo_line);








				//==================================================================================


				////let triangleShape = new THREE.Shape()
				////	.moveTo(80, 20)
				////	.lineTo(40, 80)
				////	.lineTo(120, 80)
				////	.lineTo(80, 20); // close path


				////// flat shape

				////geometry = new THREE.ShapeGeometry(shape);

				////mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color, side: THREE.DoubleSide }));
				////mesh.position.set(x, y, z - 125);
				////mesh.rotation.set(rx, ry, rz);
				////mesh.scale.set(s, s, s);
				////group.add(mesh);


				////const x = 0, y = 0;

				////const heartShape = new THREE.Shape()
				////	.moveTo(x + 25, y + 25)
				////	.bezierCurveTo(x + 25, y + 25, x + 20, y, x, y)
				////	.bezierCurveTo(x - 30, y, x - 30, y + 35, x - 30, y + 35)
				////	.bezierCurveTo(x - 30, y + 55, x - 10, y + 77, x + 25, y + 95)
				////	.bezierCurveTo(x + 60, y + 77, x + 80, y + 55, x + 80, y + 35)
				////	.bezierCurveTo(x + 80, y + 35, x + 80, y, x + 50, y)
				////	.bezierCurveTo(x + 35, y, x + 25, y + 25, x + 25, y + 25);





				////const californiaPts = [];

				////californiaPts.push(new THREE.Vector2(610, 320));
				////californiaPts.push(new THREE.Vector2(450, 300));
				////californiaPts.push(new THREE.Vector2(392, 392));
				////californiaPts.push(new THREE.Vector2(266, 438));
				////californiaPts.push(new THREE.Vector2(190, 570));
				////californiaPts.push(new THREE.Vector2(190, 600));
				////californiaPts.push(new THREE.Vector2(160, 620));
				////californiaPts.push(new THREE.Vector2(160, 650));
				////californiaPts.push(new THREE.Vector2(180, 640));
				////californiaPts.push(new THREE.Vector2(165, 680));
				////californiaPts.push(new THREE.Vector2(150, 670));
				////californiaPts.push(new THREE.Vector2(90, 737));
				////californiaPts.push(new THREE.Vector2(80, 795));
				////californiaPts.push(new THREE.Vector2(50, 835));
				////californiaPts.push(new THREE.Vector2(64, 870));
				////californiaPts.push(new THREE.Vector2(60, 945));
				////californiaPts.push(new THREE.Vector2(300, 945));
				////californiaPts.push(new THREE.Vector2(300, 743));
				////californiaPts.push(new THREE.Vector2(600, 473));
				////californiaPts.push(new THREE.Vector2(626, 425));
				////californiaPts.push(new THREE.Vector2(600, 370));
				////californiaPts.push(new THREE.Vector2(610, 320));

				////for (let i = 0; i < californiaPts.length; i++) californiaPts[i].multiplyScalar(0.25);

				////const californiaShape = new THREE.Shape(californiaPts);




				////// Circle

				////const circleRadius = 40;
				////const circleShape = new THREE.Shape()
				////	.moveTo(0, circleRadius)
				////	.quadraticCurveTo(circleRadius, circleRadius, circleRadius, 0)
				////	.quadraticCurveTo(circleRadius, - circleRadius, 0, - circleRadius)
				////	.quadraticCurveTo(- circleRadius, - circleRadius, - circleRadius, 0)
				////	.quadraticCurveTo(- circleRadius, circleRadius, 0, circleRadius);



				////// Spline shape

				////const splinepts = [];
				////splinepts.push(new THREE.Vector2(70, 20));
				////splinepts.push(new THREE.Vector2(80, 90));
				////splinepts.push(new THREE.Vector2(- 30, 70));
				////splinepts.push(new THREE.Vector2(0, 0));

				////const splineShape = new THREE.Shape()
				////	.moveTo(0, 0)
				////	.splineThru(splinepts);





//===========================================================================================================
//===========================================================================================================


				/*let*/ lar_left_points = this.main.common_func.getLinePoints(po_spline_left);
				/*let*/ lar_right_points = this.main.common_func.getLinePoints(po_spline_right);
				/*let*/ lar_left_points_reversed = lar_left_points.reverse();
                let lar_right_points_reversed = lar_right_points.reverse();

                try {


                    let lo_resolution = new THREE.Vector2();
                    let lo_renderer = new THREE.WebGLRenderer({});
                    lo_renderer.getSize(lo_resolution);

                    let material = new LineMaterial({
                        //color: new Color("#fff").getHex(),
                        vertexColors: 0x00f, //VertexColors,
                        linewidth: 1, //0.5, //1, //2,
                        resolution: lo_resolutionm
                    });



                    let lar_positions = [];



                    for (let lv_i = 0; lv_i < lar_left_points.length; lv_i++) {
                        lar_positions.push(lar_left_points[lv_i].x, lar_left_points[lv_i].y, 0);
                    }

                    for (let lv_i = 0; lv_i < lar_right_points_reversed.length; lv_i++) {
                        lar_positions.push(lar_right_points_reversed[lv_i].x, lar_right_points_reversed[lv_i].y, 0);
                    }

                    const clrs = [];

                    lar_positions.forEach(() => {
                        clrs.push(255, 0, 255);//!! цвет линии
                    });


                    ////////let lo_geometry = new LineGeometry();

                    ////////lo_geometry.setPositions(lar_positions);/////

                    ////////lo_geometry.setColors(clrs);

                    ////////let lo_resolution = new THREE.Vector2();

                    ////////let lo_renderer = new THREE.WebGLRenderer({});
                    ////////lo_renderer.getSize(lo_resolution);

                    ////////let lo_material = new LineMaterial({
                    ////////	//color: new Color("#fff").getHex(),
                    ////////	vertexColors: 0x00f, //VertexColors,
                    ////////	linewidth: 0.1, //0.5, //1, //2,
                    ////////	lo_resolution
                    ////////});

                    //////////material.needsUpdate = true;

                    ////////let lo_line = new Line2(lo_geometry, lo_material);
                    //////////lo_line.computeLineDistances();

                    //////////lo_line.position.set(lv_x, lv_y);

                    ////////this.scene.add(lo_line);



                    let geometry = new LineGeometry();

                    //geometry.setPositions(positions);/////
                    geometry.setPositions(lar_positions);/////

                    geometry.setColors(clrs);

                    ////let resolution = new THREE.Vector2();
                    ////let lo_renderer = new THREE.WebGLRenderer({});
                    ////lo_renderer.getSize(resolution);

                    ////let material = new LineMaterial({
                    ////	//color: new Color("#fff").getHex(),
                    ////	vertexColors: 0x00f, //VertexColors,
                    ////	linewidth: 1, //0.5, //1, //2,
                    ////	resolution
                    ////});

                    //material.needsUpdate = true;

                    let lo_line = new Line2(geometry, material);
                    //lo_line.computeLineDistances();

                    //lo_line.position.set(lv_x, lv_y);

                    this.scene.add(lo_line);






                }

                catch (e) {

                    alert('error draw_contour_and_shape: ' + e.stack);

                }


            }

            catch (e) {

                alert('error set_shape_color: ' + e.stack);

            }
        }

        //-----------------------------------------------------------------

        Shapes.prototype.addShape = function (po_shape,/* extrudeSettings,*/ pv_color/*, x, y, z, rx, ry, rz, s*/) {

            // flat shape with texture
            // note: default UVs generated by THREE.ShapeGeometry are simply the x- and y-coordinates of the vertices

            let lo_geometry = new THREE.ShapeGeometry(po_shape);

            ////let mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, map: texture }));
            ////mesh.position.set(x, y, z - 175);
            ////mesh.rotation.set(rx, ry, rz);
            ////mesh.scale.set(s, s, s);
            ////group.add(mesh);

            // flat shape

            ////geometry = new THREE.ShapeGeometry(shape);

            let lo_mesh = new THREE.Mesh(lo_geometry, new THREE.MeshPhongMaterial({ color: pv_color/*, side: THREE.DoubleSide */ }));
            ////mesh.position.set(x, y, z - 125);
            ////mesh.rotation.set(rx, ry, rz);
            ////mesh.scale.set(s, s, s);
            ////group.add(mesh);
            this.scene.add(lo_mesh);


            // extruded shape

            ////geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

            ////mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color }));
            ////mesh.position.set(x, y, z - 75);
            ////mesh.rotation.set(rx, ry, rz);
            ////mesh.scale.set(s, s, s);
            ////group.add(mesh);

            //////addLineShape(shape, color, x, y, z, rx, ry, rz, s);

        }

        //-----------------------------------------------------------------

        Shapes.prototype.select_shape_contour = function (po_clicked_splines) {


            this.draw_contour_and_shape(0x0f0, po_clicked_splines.spline_left, po_clicked_splines.spline_right, true, true, true, false);

            ////this.main.camera.updateProjectionMatrix();
            ////this.main.render();

        }

        //------------------------------------------------------------------------

        Shapes.prototype.switch_visible_nodes_by_segment = function (po_segment) {

            try {

                let lo_segment_point;

                for (let lv_i = 0; lv_i < po_segment.parent.children.length - 1; lv_i++) {

                    lo_segment_point = po_segment.parent.children[lv_i];

                    //for (let lv_j = 0; lv_j < lo_segment.children.length - 1; lv_j++) {

                    //let lo_segment_point = lo_segment.children[lv_j];

                    if (lo_segment_point instanceof THREE.Mesh) {

                        ////if (lo_obj.userData) {

                        ////	if (lo_obj.userData.nspline == po_spline) {

                        lo_segment_point.visible = !lo_segment_point.visible;

                        // Занесение в или удаление из массива выделенных сегментов

                        if (lv_i == 0) // выполняем только один раз 
                        {

                            if (lo_segment_point.visible) {
                                this.ar_selected_segments.push(po_segment);
                            }
                            else {
                                //////// удаление элемента из массива
                                //////for (let lv_i = 0; lv_i < this.ar_selected_segments.length; lv_i++) {

                                //////	if (this.ar_selected_segments[lv_i] == po_spline) {

                                //////		this.ar_selected_segments.splice(lv_i, 1);
                                //////	}
                                //////}
                                this.delete_from_selected_segments(po_segment);

                            }

                        }


                        ////	}

                        ////}
                    }


                    //}

                }

            }

            catch (e) {

                alert('error switch_visible_nodes_by_segment: ' + e.stack);

            }

        }


        //------------------------------------------------------------------------
        Shapes.prototype.delete_from_selected_segments = function (po_segment) {

            // удаление элемента из массива выбранных сегментов
            for (let lv_i = this.ar_selected_segments.length - 1; lv_i >= 0; lv_i--) {

                if (this.ar_selected_segments[lv_i] == po_segment) {

                    this.ar_selected_segments.splice(lv_i, 1);
                }

            }

        }


        //-----------------------------------------------------------------
        // Сделать зеркальное отражение выделенных сегментов
        Shapes.prototype.make_mirror_selected_segments = function () {

            let lar_selected_spline_groups = [];


            let lo_segment;//23042024

            try {


                for (let lv_i = 0; lv_i < this.ar_selected_segments.length; lv_i++) {

                    let lo_selected_segment = this.ar_selected_segments[lv_i];

                    if (lo_selected_segment.parent) {

                        let lo_parent_parent = lo_selected_segment.parent.parent;

                        this.ar_selected_segments[lv_i] = this.make_mirror_segment(lo_selected_segment);//23042024

                        lar_selected_spline_groups.push(lo_parent_parent);
                    }
                }


                for (let lv_i = 0; lv_i < lar_selected_spline_groups.length; lv_i++) {

                    let lar_spline_points = [];

                    let lar_segments_groups = lar_selected_spline_groups[lv_i].children;

                    for (let lv_j = 0; lv_j < lar_segments_groups.length; lv_j++) {

                        let lar_segments_nodes = lar_segments_groups[lv_j];

                        if (lar_segments_nodes.type == "Group") {

                            for (let lv_k = 0; lv_k < lar_segments_nodes.children.length; lv_k++) {

                                if (lar_segments_nodes.children[lv_k].type == "Mesh") {
                                    lar_spline_points.push(lar_segments_nodes.children[lv_k].position);
                                }
                            }
                        }

                        if (lar_segments_nodes.type == "Line") {

                            this.main.common_func.removeObjectsWithChildren(lar_segments_nodes, true);//22042024

                        }


                    }

                    lo_segment = this.main.splines.draw_curve(lar_selected_spline_groups[lv_i], lar_spline_points, cv_segment_name_prefix, true);//25042024

                }

            }

            catch (e) {

                alert('error make_mirror_selected_segments: ' + e.stack);

            }

            return lo_segment;
        }


        //-----------------------------------------------------------------
        // Сделать зеркальное отражение выделенных сегментов
        Shapes.prototype.make_mirror_segment = function (po_segment) {


            let lar_new_segment_points = [];

            let lo_segment_point;

            let lv_base_x = 0;

            let lo_segment;//23042024

            try {

                for (let lv_i = 0; lv_i < po_segment.parent.children.length - 1; lv_i++) {

                    lo_segment_point = po_segment.parent.children[lv_i];

                    if (lv_i == 0) {
                        lv_base_x = lo_segment_point.position.x;
                    }

                    let lv_delta = lv_base_x - lo_segment_point.position.x;

                    lo_segment_point.position.x = lv_base_x + lv_delta;


                    lar_new_segment_points.push(lo_segment_point.position);

                    //lo_segment_point.matrixWorldNeedsUpdate = true;

                }


                // Удаление предыдущих линий
                let lo_parent = po_segment.parent;
                let lar_lines = this.main.shapes.get_lines_in_group(po_segment.parent);
                for (let lv_i = 0; lv_i < lar_lines.length; lv_i++) {
                    this.main.common_func.removeObjectsWithChildren(lar_lines[lv_i], true);
                }

                //05082024 lo_segment = this.main.splines.draw_curve(lo_parent, lar_new_segment_points, cv_spline_name_prefix, false);
                lo_segment = this.main.splines.draw_curve(lo_parent, lar_new_segment_points, cv_segment_name_prefix, false);//05082024


            }

            catch (e) {

                alert('error make_mirror_segment: ' + e.stack);

            }

            return lo_segment;

        }

        //-----------------------------------------------------------------

        Shapes.prototype.get_lines_in_group = function (po_group) {

            let lar_objects = [];

            for (let lv_i = 0; lv_i < po_group.children.length; lv_i++) {

                if (po_group.children[lv_i].type == "Line") {
                    lar_objects.push(po_group.children[lv_i]);
                }
            }


            return lar_objects;

        }

        //29062024 {
        //////////-----------------------------------------------------------------

        ////////Shapes.prototype.switch_visible_nodes_by_spline = function (po_spline) {

        ////////	//return;

        ////////	try {

        ////////		let lo_segment_group;

        ////////		for (let lv_i = 0; lv_i < po_spline.parent.children.length - 1; lv_i++) {
        ////////			lo_segment_group = po_spline.parent.children[lv_i];

        ////////			for (let lv_j = 0; lv_j < lo_segment_group.children.length - 1; lv_j++) {

        ////////				let lo_segment_point = lo_segment_group.children[lv_j];

        ////////				if (lo_segment_point instanceof THREE.Mesh) {

        ////////					////if (lo_obj.userData) {

        ////////					////	if (lo_obj.userData.nspline == po_spline) {

        ////////					lo_segment_point.visible = !lo_segment_point.visible;

        ////////					////	}

        ////////					////}
        ////////				}


        ////////			}

        ////////		}

        ////////	}

        ////////	catch (e) {

        ////////		alert('error switch_visible_nodes_by_spline: ' + e);

        ////////	}

        ////////}
        //29062024 }


        //-----------------------------------------------------------------

        Shapes.prototype.set_visible_nodes = function (pv_visible) {

            try {

                let lo_spline_group;

                for (let lv_i = 0; lv_i < this.ar_splines.length; lv_i++) {

                    lo_spline_group = this.ar_splines[lv_i];

                    for (let lv_j = 0; lv_j < lo_spline_group.children.length; lv_j++) {

                        let lo_segment_group = lo_spline_group.children[lv_j];

                        if (lo_segment_group instanceof THREE.Group) {

                            for (let lv_k = 0; lv_k < lo_segment_group.children.length; lv_k++) {

                                if (lo_segment_group.children[lv_k] instanceof THREE.Mesh) {

                                    lo_segment_group.children[lv_k].visible = pv_visible;

                                }

                            }
                        }

                    }

                }

            }

            catch (e) {

                alert('error set_visible_nodes: ' + e.stack);

            }

        }


        //------------------------------------------------------------------------
        Shapes.prototype.draw_rectangle = function (pv_distance_bt_curves) {


            const cv_rect_width = this.shape_width; // 100;// mm figure width
            const cv_rect_height = this.shape_height; // 200; // mm figure height

            try {

                let lo_group = new THREE.Group();


                const positions = [];
                positions.push(0, 0, 0);
                positions.push(0, cv_rect_height, 0);
                positions.push(cv_rect_width, cv_rect_height, 0);
                positions.push(cv_rect_width, 0, 0);
                positions.push(0, 0, 0);


                let lv_color = 0x0040f0;
                let lv_x = 0; //13032024  pv_distance_bt_curves/2;// / 2; // 0;
                let lv_y = 0;

                const clrs = [];

                positions.forEach(() => {
                    clrs.push(255, 0, 255);
                });


                let geometry = new LineGeometry();

                //let lo_points = rectangleShape.getPoints();

                geometry.setPositions(positions);/////
                geometry.setColors(clrs);

                let resolution = new THREE.Vector2();

                let renderer = new THREE.WebGLRenderer({ /*antialias: true*/ });
                renderer.getSize(resolution);

                let material = new LineMaterial({
                    //color: new Color("#fff").getHex(),
                    vertexColors: 0xf0f, //VertexColors,
                    linewidth: 0.5, //1, //2,
                    resolution,
                    //dashed: false, //true,
                    //gapSize: 0.75,
                    //dashScale: 1.5,
                    //dashSize: 1
                });

                material.needsUpdate = true;

                let lo_line = new Line2(geometry, material);
                lo_line.computeLineDistances();
                //lo_line.scale.set(1, 1, 1);

                //lo_line.name = cv_rectangle_name;

                lo_line.position.set(lv_x, lv_y);//, 0 pv_z - 25);

                //lo_group.add(lo_line);


                lo_group.renderOrder = 3;
                this.group_rect = lo_group;

                this.scene.add(lo_group);

            }

            catch (e) {

                alert('error draw_rectangle: ' + e.stack);

            }

        }



        //-----------------------------------------------------------------



        Shapes.prototype.GetTwoShapeIntersect = function (object1, object2) {
            // (example from https://stackoverflow.com/questions/49417007/how-to-find-intersection-of-objects-in-three-js)
            /**
             * This function check if two object3d intersect or not
             * @param {THREE.Object3D} object1
             * @param {THREE.Object3D} object2
             * @returns {Boolean} 
            */

            let lv_result = null;


            try {

                // Check for intersection using bounding box intersection test
                let bBox1 = new THREE.Box3().setFromObject(object1);
                bBox1.max.z = 0;
                bBox1.min.z = 0;

                object2.geometry.computeBoundingBox();

                let bBox2 = new THREE.Box3().setFromObject(object2);
                bBox2.max.z = 0;
                bBox2.min.z = 0;

                const intersection = bBox1.intersectsBox(bBox2);
                // const intersection = mesh1.geometry.boundingBox.intersectsBox(mesh2.geometry.boundingBox);

                if (intersection) { // The shape geometries intersect.

                    //let lv_nspline = this.get_nspline_by_name(object2.name);

                    lv_result = {
                        min_x: bBox2.min.x,
                        min_y: bBox2.min.y,
                        max_x: bBox2.max.x,
                        max_y: bBox2.max.y,
                        object: object2
                        //nspline: lv_nspline
                    };
                }
                //else
                //{ // The shape geometries do not intersect.
                //	return false
                //}



            }

            catch (e) {

                alert('error GetTwoShapeIntersect: ' + e.stack);

            }



            return lv_result;

        }

        //------------------------------------------------------------------------
        Shapes.prototype.get_distance_bt_curves = function () {

            ////let lv_distance = this.shape_width * this.distance_between_curves_in_percent_of_width / 100;
            ////return lv_distance;

            return this.distance_between_curves;
        }

        //------------------------------------------------------------------------
        Shapes.prototype.get_nspline_by_name = function (pv_name) {

            const lc_spline_name = "spline_";

            let lv_result = -1;

            try {

                let lv_index = pv_name.indexOf(lc_spline_name);

                if (lv_index < 0) {
                    return lv_result;
                }
                lv_index = lv_index + pv_name.length - 1;
                lv_result = pv_name.substr(lv_index);



            }

            catch (e) {

                alert('error get_nspline_by_name: ' + e.stack);

            }

            return lv_result;

        }

        //------------------------------------------------------------------------
        Shapes.prototype.get_splines_points = function () {

            let lar_points = [];

            try {

                let lo_spline_group;

                for (let lv_i = 0; lv_i < this.ar_splines.length; lv_i++) {

                    lo_spline_group = this.ar_splines[lv_i];

                    for (let lv_j = 0; lv_j < lo_spline_group.children.length; lv_j++) {

                        let lo_segment_group = lo_spline_group.children[lv_j];

                        if (lo_segment_group instanceof THREE.Group) {

                            for (let lv_k = 0; lv_k < lo_segment_group.children.length; lv_k++) {

                                if (lo_segment_group.children[lv_k] instanceof THREE.Mesh) {

                                    lar_points.push(lo_segment_group.children[lv_k]);

                                }

                            }
                        }

                    }

                }

            }

            catch (e) {

                alert('error get_splines_points: ' + e.stack);

            }



            return lar_points;

        }


        //------------------------------------------------------------------------
        Shapes.prototype.get_segments_points = function (po_spline_group) {

            let lar_segments_points = [];

            try {

                let lo_segment_group;

                for (let lv_i = 0; lv_i < po_spline_group.children.length; lv_i++) {

                    let lo_segment_points = po_spline_group.children[lv_i];

                    if (lo_segment_points instanceof THREE.Group) {

                        let lar_segment_points = [];

                        for (let lv_k = 0; lv_k < lo_segment_points.children.length; lv_k++) {

                            if (lo_segment_points.children[lv_k] instanceof THREE.Mesh) {

                                lar_segment_points.push(lo_segment_points.children[lv_k].position);
                            }
                        }

                        lar_segments_points.push({
                            points: lar_segment_points,
                            parent: lo_segment_points
                        });


                    }
                    else {

                        continue;
                    }

                }


            }

            catch (e) {

                alert('error get_segments_points: ' + e.stack);

            }

            return lar_segments_points;

        }


        //------------------------------------------------------------------------
        Shapes.prototype.adjust_segments_nodes_by_external_shape = function (po_spline_group, pv_spline_offset_x/*pv_delta_x*/, pv_height_koef_relative) {

            let lar_segments_points = [];//

            try {

                let lo_segment_group;
                let lv_delta_x;

                for (let lv_i = 0; lv_i < po_spline_group.children.length; lv_i++) {

                    if (po_spline_group.children[lv_i] instanceof THREE.Group) {

                        let lo_segment_points = po_spline_group.children[lv_i];

                        if (lo_segment_points instanceof THREE.Group) {

                            let lar_segment_points = [];//

                            for (let lv_k = 0; lv_k < lo_segment_points.children.length; lv_k++) {

                                if (lo_segment_points.children[lv_k] instanceof THREE.Mesh) {

                                    if (lv_k == 0) {
                                        lv_delta_x = pv_spline_offset_x - lo_segment_points.children[lv_k].position.x;
                                    }


                                    //lar_segment_points.push(lo_segment_points_group.children[lv_k].position);

                                    // двигаем всю кривую (сплайн)
                                    lo_segment_points.children[lv_k].position.x = lo_segment_points.children[lv_k].position.x + lv_delta_x;

                                    // растягиваем кривые по высоте
                                    lo_segment_points.children[lv_k].position.y = lo_segment_points.children[lv_k].position.y * pv_height_koef_relative;


                                    //03112024 {
                                    ////// Запись максимальной координаты y сплайнов (длина модели)
                                    ////if (lo_segment_points.children[lv_k].position.y > this.main.current_spline_max_y) {

                                    ////    this.main.current_spline_max_y = lo_segment_points.children[lv_k].position.y;
                                    ////}
                                    //////03112024 }



                                    lar_segment_points.push(lo_segment_points.children[lv_k].position);

                                }
                            }


                            // Удаление предыдущих линий сегментов
                            let lar_lines = this.main.shapes.get_lines_in_group(lo_segment_points);//16062024

                            for (let lv_k = 0; lv_k < lar_lines.length; lv_k++) {
                                this.main.common_func.removeObjectsWithChildren(lar_lines[lv_k], true);

                                // Создание нового сегмента
                                //06082024 this.main.splines.draw_curve(lo_segment_points, lar_segment_points, cv_segment_name_prefix, false);
                                let lo_segment = this.main.splines.draw_curve(lo_segment_points, lar_segment_points, cv_segment_name_prefix, false);

                                if (this.clear_selected_segments_with_null_parents()) {
                                    this.ar_selected_segments.push(lo_segment);
                                }
                            }

                            //lar_segments_points.push({
                            //	points: lar_segment_points,
                            //	parent: lo_segment_points
                            //});


                        }
                        else {

                            continue;
                        }
                    }
                }

            }

            catch (e) {

                alert('error get_segments_points: ' + e.stack);

            }

            //return lar_segments_points;

        }












        //15062024 }



        //------------------------------------------------------------------------
        Shapes.prototype.clear_selected_segments_with_null_parents = function () {

            let lv_result = false;
            try {

                for (let lv_i = this.ar_selected_segments.length - 1; lv_i >= 0; lv_i--) {

                    if (this.ar_selected_segments[lv_i].parent === null) {
                        this.ar_selected_segments.splice(lv_i, 1);
                        lv_result = true;
                    }
                }


            }

            catch (e) {

                alert('error clear_selected_segments_with_null_parents: ' + e.stack);

            }

            return lv_result;
        }


        //------------------------------------------------------------------------
        Shapes.prototype.redraw_segments = function (po_spline_group) {

            try {

                let lo_spline_group;

                for (let lv_i = 0; lv_i < this.ar_splines.length; lv_i++) {

                    lo_spline_group = this.ar_splines[lv_i];

                    // Если po_spline_group не задан, перерисовываем все сплайны
                    if (po_spline_group) {
                        if (lo_spline_group != po_spline_group) {
                            continue;
                        }
                    }


                    let lar_segment_parents = [];

                    for (let lv_i = this.ar_selected_segments.length - 1; lv_i >= 0; lv_i--) {

                        if (this.ar_selected_segments[lv_i].parent) {

                            if (this.ar_selected_segments[lv_i].parent.parent) {

                                if (this.ar_selected_segments[lv_i].parent.parent == lo_spline_group) {

                                    let lv_exist = false;
                                    // Запоминание родительских групп удаляемых сегментов
                                    for (let lv_j = 0; lv_j < lar_segment_parents.length; lv_j++) {
                                        if (lar_segment_parents[lv_j] == this.ar_selected_segments[lv_i].parent) {
                                            lv_exist = true;
                                            break;
                                        }
                                    }
                                    if (!lv_exist) {
                                        // если ещё нет в массиве - вставляем
                                        lar_segment_parents.push(this.ar_selected_segments[lv_i].parent);
                                    }

                                    this.ar_selected_segments.splice(lv_i, 1);
                                }

                            } //01072024
                            else // this.ar_selected_segments[lv_i].parent == null
                            {
                                this.main.common_func.removeObjectsWithChildren(this.ar_selected_segments[lv_i], true);
                                this.ar_selected_segments.splice(lv_i, 1);
                            }


                        } //01072024
                        else // this.ar_selected_segments[lv_i].parent == null
                        {
                            this.main.common_func.removeObjectsWithChildren(this.ar_selected_segments[lv_i], true);
                            this.ar_selected_segments.splice(lv_i, 1);
                        }

                    }


                    // список узлов сегментов сплайна
                    let lar_segment_points = this.get_segments_points(lo_spline_group);

                    for (let lv_j = 0; lv_j < lar_segment_points.length; lv_j++) {

                        // Удаление предыдущих линий
                        let lar_lines = this.main.shapes.get_lines_in_group(lar_segment_points[lv_j].parent);
                        for (let lv_k = 0; lv_k < lar_lines.length; lv_k++) {
                            this.main.common_func.removeObjectsWithChildren(lar_lines[lv_k], true);
                        }

                        // рисование новых линий
                        let lo_new_segment = this.main.splines.draw_curve(lar_segment_points[lv_j].parent, lar_segment_points[lv_j].points, cv_segment_name_prefix, false);//////////////

                        // Если родительская группа совпадает, вставка сегмента в список выделенных
                        for (let lv_k = 0; lv_k < lar_segment_parents.length; lv_k++) {
                            if (lar_segment_parents[lv_k] == lar_segment_points[lv_j].parent) {
                                this.ar_selected_segments.push(lo_new_segment);
                            }

                        }

                    }


                    lar_segment_points = null;//30072024 leaks
                    lar_segment_parents = null;//30072024 leaks
                }


                //30072024 {
                lo_spline_group = null; //leaks

                //30072024 }

            }

            catch (e) {

                alert('error redraw_segments: ' + e.stack);

            }

        }
        //------------------------------------------------------------------------
        Shapes.prototype.get_spline_points = function (po_spline_group) {

            let lar_points = [];

            try {

                let lo_spline_group;

                for (let lv_i = 0; lv_i < this.ar_splines.length; lv_i++) {

                    lo_spline_group = this.ar_splines[lv_i];

                    if (lo_spline_group != po_spline_group) {

                        continue;
                    }


                    for (let lv_j = 0; lv_j < lo_spline_group.children.length; lv_j++) {

                        let lo_segment_group = lo_spline_group.children[lv_j];

                        if (lo_segment_group instanceof THREE.Group) {

                            for (let lv_k = 0; lv_k < lo_segment_group.children.length; lv_k++) {

                                if (lo_segment_group.children[lv_k] instanceof THREE.Mesh) {

                                    //lo_segment_group.children[lv_k].visible = pv_visible;

                                    lar_points.push(lo_segment_group.children[lv_k].position);

                                }

                            }
                        }

                    }

                }

            }

            catch (e) {

                alert('error get_spline_points: ' + e.stack);

            }

            return lar_points;

        }


        //------------------------------------------------------------------------
        Shapes.prototype.set_spline_points = function (po_spline_group, par_points) {

            try {

                let lo_spline_group;
                let lv_ipoint = 0;

                for (let lv_i = 0; lv_i < this.ar_splines.length; lv_i++) {

                    lo_spline_group = this.ar_splines[lv_i];

                    if (lo_spline_group != po_spline_group) {

                        continue;
                    }


                    for (let lv_j = 0; lv_j < lo_spline_group.children.length; lv_j++) {

                        let lo_segment_group = lo_spline_group.children[lv_j];

                        if (lo_segment_group instanceof THREE.Group) {

                            for (let lv_k = 0; lv_k < lo_segment_group.children.length; lv_k++) {

                                if (lo_segment_group.children[lv_k] instanceof THREE.Mesh) {

                                    lo_segment_group.children[lv_k].position.x = par_points[lv_ipoint].x;
                                    lo_segment_group.children[lv_k].position.y = par_points[lv_ipoint].y;
                                    lv_ipoint++;
                                }

                            }
                        }

                    }

                }

            }

            catch (e) {

                alert('error get_spline_points: ' + e.stack);

            }

            return par_points;

        }

        //------------------------------------------------------------------------
        Shapes.prototype.get_splines_points_for_model = function () {

            let lar_splines_points = [];


            let lar_segments_beg_points_numbers;//01112024
            let lar_segment_beg_points_number;//01112024 


            try {

                let lo_spline_group;

                let lar_spline_points = [];

                lar_segments_beg_points_numbers = [];//01112024

                for (let lv_i = 0; lv_i < this.ar_splines.length; lv_i++) {

                    lo_spline_group = this.ar_splines[lv_i];

                    let lar_spline_points = [];
                    //lar_segments_beg_points_numbers = [];//01112024

                    lar_segment_beg_points_number = [];//01112024 

                    for (let lv_j = 0; lv_j < lo_spline_group.children.length; lv_j++) {

                        let lo_segment_group = lo_spline_group.children[lv_j];

                        if (lo_segment_group instanceof THREE.Group) {

                            //lar_segment_beg_points_number = [];//01112024 
                            for (let lv_k = 0; lv_k < lo_segment_group.children.length; lv_k++) {

                                if (lo_segment_group.children[lv_k] instanceof THREE.Mesh) {

                                    lar_spline_points.push(
                                        [lo_segment_group.children[lv_k].position.x, lo_segment_group.children[lv_k].position.y]);

                                    if (lv_k == 0) // первый узел сегмента
                                    {
                                        lar_segment_beg_points_number.push(lar_spline_points.length - 1);

                                    }

                                }

                            }

                            //lar_segments_beg_points_numbers.push(lar_segment_beg_points_number);
                        }

                    }

                    lar_segments_beg_points_numbers.push(lar_segment_beg_points_number);

                    lar_splines_points.push(lar_spline_points);

                }

            }

            catch (e) {

                alert('error get_spline_points: ' + e.stack);

            }



            //01112024 {

            //return lar_splines_points;

            return {
                Segments_beg_points_numbers: lar_segments_beg_points_numbers,
                PointsCurves: lar_splines_points

            }

            //01112024 }
        }


        //-----------------------------------------------------------------------------------
        // Упорядочивание сплайнов слева направо
        Shapes.prototype.SortSplinesOrderFromLeftToRight = function () {

            let lar_sorted = [];

            try {
                let boundingBox;
                let lar_for_sort = [];

                //let lo_sort_obj = {}

                for (let lv_i = 0; lv_i < this.ar_splines.length; lv_i++) {

                    boundingBox = new THREE.Box3().setFromObject(this.ar_splines[lv_i]);

                    // сплайн - последний дочерний член группы this.ar_splines[lv_i]
                    let lv_index = this.ar_splines[lv_i].children.length - 1;

                    let lo_spline = this.ar_splines[lv_i].children[lv_index];


                    lar_for_sort.push({ x: boundingBox.min.x, spline: lo_spline });

                }

                lar_sorted = this.main.common_func.sortByProperty(lar_for_sort, "x");
            }

            catch (e) {
                alert('error SortSplinesOrderFromLeftToRight: ' + e.stack);
            }

            return lar_sorted;
        }
        //-----------------------------------------------------------------------------------





        //====================================================================
    }  // if (typeof this.redraw_shapes !== "function")

    //====================================================================


}

// end Class Shapes
//=====================================================================

