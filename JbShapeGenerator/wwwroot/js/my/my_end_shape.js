import * as THREE from 'three';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';


import { Constants } from './my_common_const.js';
import { CommonFunc } from './my_common_func.js';

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

    if (typeof this.create_end_shape != "function") {

        //----------------------------------------------------------
        // Методы
        //----------------------------------------------------------



        //------------------------------------------------------------------------
        EndShape.prototype.create_end_shape = function (po_is_use_data, po_sides_data) {

            try {

                let lo_rectangle = CommonFunc.prototype.get_drawing_rectangle(
                    this.main.params.shape_width,
                    this.main.params.shape_width);


                this.main.group_end_shape.add(lo_rectangle);




                let lo_line_curr = null;
                let lo_geom_hor = null;
                let lo_geom_vert = null;
                let lo_line_hor = null;
                let lo_line_vert = null;

                let lv_curve_distance_hor = this.main.params.shape_width / (this.main.params.shape_amount_curves + 1);
                let lv_curve_distance_vert = this.main.params.shape_width / (this.main.params.shape_amount_curves + 1);

                var lo_material = new THREE.LineBasicMaterial({
                    color: Constants.shape_line_color
                });

                lo_geom_hor = new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector2(0, 0),
                    new THREE.Vector2(this.main.params.shape_width, 0)
                ]);
                lo_line_hor = new THREE.LineSegments(lo_geom_hor, lo_material);

                lo_geom_vert = new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector2(0, 0),
                    new THREE.Vector2(0, this.main.params.shape_width)
                ]);
                lo_line_vert = new THREE.LineSegments(lo_geom_vert, lo_material);

                for (let lv_i = 0; lv_i < this.main.params.shape_amount_curves; lv_i++) {

                    lo_line_curr = lo_line_hor.clone();
                    lo_line_curr.position.y = lv_curve_distance_hor * (lv_i + 1);
                    this.main.group_end_shape.add(lo_line_curr);


                    lo_line_curr = lo_line_vert.clone();
                    lo_line_curr.position.x = lv_curve_distance_hor * (lv_i + 1);
                    this.main.group_end_shape.add(lo_line_curr);

                }

            }

            catch (e) {

                alert('error create_end_shape: ' + e.stack);

            }

        }

        //-----------------------------------------------------------------


        //====================================================================
    }  // if (typeof this.create_rectangle !== "function")

    //====================================================================



    this.create_end_shape(false, null);


}

// end Class Rectangle
//=====================================================================
