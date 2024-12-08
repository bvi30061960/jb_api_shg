import * as THREE from 'three';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';


import { Constants } from './my_common_const.js';
import { CommonFunc } from './my_common_func.js';

import {
    go_up_side_shape_generator,
    go_lateral_side_shape_generator,
    go_end_side_shape_generator
} from './my_shape_generator.js';



const cv_rectangle_name = "my_end_shape";


// Class Rectangle
export function EndShape(po_main) { //, po_is_use_data, po_sides_data ) {

    // Свойства

    this.main = po_main;
    //this.is_use_data = po_is_use_data;
    //this.sides_data = po_sides_data;

    this.scene = null; // = po_scene;
    this.shape_width = null; // = pv_shape_width;
    this.shape_height = null; // = pv_shape_height;

    this.shape;

    //this.group_rect = null;

    //this.cv_rectangle_name = "my_end_shape";

    //=====================================================================

    if (typeof this.redraw_end_shape != "function") {

        //----------------------------------------------------------
        // Методы
        //----------------------------------------------------------



        //------------------------------------------------------------------------
        EndShape.prototype.redraw_end_shape = function (po_is_use_data, po_sides_data) {

            try {


                CommonFunc.prototype.clear_group_childrens(this.main.group_end_shape);

                let lo_rectangle = CommonFunc.prototype.get_drawing_rectangle(
                    //this.main.params.shape_width,
                    //this.main.params.shape_width);
                    go_lateral_side_shape_generator.params.shape_width,
                    go_up_side_shape_generator.params.shape_width

                );


                this.main.group_end_shape.add(lo_rectangle);










                ////let lo_line_curr = null;
                ////let lo_geom_hor = null;
                ////let lo_geom_vert = null;
                ////let lo_line_hor = null;
                ////let lo_line_vert = null;

                ////let lv_curve_distance_vert = go_up_side_shape_generator.params.shape_width / (go_up_side_shape_generator.shapes.shape_amount_curves + 1);
                ////let lv_curve_distance_hor = go_lateral_side_shape_generator.params.shape_width / (go_lateral_side_shape_generator.shapes.shape_amount_curves + 1);

                ////var lo_material = new THREE.LineBasicMaterial({
                ////    color: Constants.shape_line_color
                ////});

                ////lo_geom_hor = new THREE.BufferGeometry().setFromPoints([
                ////    new THREE.Vector2(0, 0),
                ////    new THREE.Vector2(go_up_side_shape_generator.params.shape_width, 0)
                ////]);
                ////lo_line_hor = new THREE.LineSegments(lo_geom_hor, lo_material);

                ////lo_geom_vert = new THREE.BufferGeometry().setFromPoints([
                ////    new THREE.Vector2(0, 0),
                ////    new THREE.Vector2(0, go_lateral_side_shape_generator.params.shape_width)
                ////]);
                ////lo_line_vert = new THREE.LineSegments(lo_geom_vert, lo_material);

                ////for (let lv_i = 0; lv_i < go_lateral_side_shape_generator.shapes.shape_amount_curves; lv_i++) {

                ////    lo_line_curr = lo_line_hor.clone();
                ////    lo_line_curr.position.y = lv_curve_distance_hor * (lv_i + 1);
                ////    this.main.group_end_shape.add(lo_line_curr);
                ////}

                ////for (let lv_i = 0; lv_i < go_up_side_shape_generator.shapes.shape_amount_curves; lv_i++) {
                ////    lo_line_curr = lo_line_vert.clone();
                ////    lo_line_curr.position.x = lv_curve_distance_vert * (lv_i + 1);
                ////    this.main.group_end_shape.add(lo_line_curr);

                ////}







                let lo_line_curr = null;
                let lo_geom_hor = null;
                let lo_geom_vert = null;
                let lo_line_hor = null;
                let lo_line_vert = null;

                let pv_position = null;

                let lv_curve_distance_vert = go_up_side_shape_generator.params.shape_width / (go_up_side_shape_generator.shapes.shape_amount_curves + 1);
                let lv_curve_distance_hor = go_lateral_side_shape_generator.params.shape_width / (go_lateral_side_shape_generator.shapes.shape_amount_curves + 1);

                var lo_material = new THREE.LineBasicMaterial({
                    color: Constants.shape_line_color
                });

                lo_geom_hor = new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector2(0, 0),
                    new THREE.Vector2(go_up_side_shape_generator.params.shape_width, 0)
                ]);
                lo_line_hor = new THREE.LineSegments(lo_geom_hor, lo_material);

                lo_geom_vert = new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector2(0, 0),
                    new THREE.Vector2(0, go_lateral_side_shape_generator.params.shape_width)
                ]);
                lo_line_vert = new THREE.LineSegments(lo_geom_vert, lo_material);




                for (let lv_i = 0; lv_i < go_lateral_side_shape_generator.shapes.shape_amount_curves; lv_i++) {

                    lo_line_curr = lo_line_hor.clone();

                    //lo_line_curr.position.y = lv_curve_distance_hor * (lv_i + 1);

                    //координаты начальной точки текущей кривой
                    if (go_lateral_side_shape_generator.shapes
                        || go_lateral_side_shape_generator.shapes.ar_splines[lv_i]
                        || go_lateral_side_shape_generator.shapes.ar_splines[lv_i].children[0]
                        || go_lateral_side_shape_generator.shapes.ar_splines[lv_i].children[0].children[0]
                        || go_lateral_side_shape_generator.shapes.ar_splines[lv_i].children[0].children[0].position.x
                    ) {
                        pv_position = go_lateral_side_shape_generator.shapes.ar_splines[lv_i].children[0].children[0].position.x;
                    }

                    lo_line_curr.position.y = go_lateral_side_shape_generator.params.shape_width - pv_position; // lv_curve_distance_hor * (lv_i + 1);

                    this.main.group_end_shape.add(lo_line_curr);
                }

                for (let lv_i = 0; lv_i < go_up_side_shape_generator.shapes.shape_amount_curves; lv_i++) {
                    lo_line_curr = lo_line_vert.clone();

                    //lo_line_curr.position.x = lv_curve_distance_vert * (lv_i + 1);

                    if (go_up_side_shape_generator.shapes
                        || go_up_side_shape_generator.shapes.ar_splines[lv_i]
                        || go_up_side_shape_generator.shapes.ar_splines[lv_i].children[0]
                        || go_up_side_shape_generator.shapes.ar_splines[lv_i].children[0].children[0]
                        || go_up_side_shape_generator.shapes.ar_splines[lv_i].children[0].children[0].position.x
                    ) {
                        pv_position = go_up_side_shape_generator.shapes.ar_splines[lv_i].children[0].children[0].position.x;
                    }

                    lo_line_curr.position.x = pv_position; // lv_curve_distance_hor * (lv_i + 1);

                    this.main.group_end_shape.add(lo_line_curr);

                }








            }

            catch (e) {

                alert('error redraw_end_shape: ' + e.stack);

            }

        }

        //-----------------------------------------------------------------


        //====================================================================
    }  // if (typeof this.create_rectangle !== "function")

    //====================================================================



    this.redraw_end_shape(false, null);


}

// end Class Rectangle
//=====================================================================
