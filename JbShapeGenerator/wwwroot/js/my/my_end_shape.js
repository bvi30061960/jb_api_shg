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


    this.ColorParts = null; // new Array(10);

    //=====================================================================

    if (typeof this.redraw_end_shape != "function") {

        //----------------------------------------------------------
        // Методы
        //----------------------------------------------------------


        //------------------------------------------------------------------------
        EndShape.prototype.redraw_end_shape = function (
            pv_added_spline_num, pv_deleted_spline_num,
            //pv_up_added_spline_num, pv_up_deleted_spline_num,
            //pv_lateral_added_spline_num, pv_lateral_deleted_spline_num,
            po_is_use_data, po_sides_data
        ) {


            ////let lv_up_added_spline_num = null;
            ////let lv_up_deleted_spline_num = null;
            ////let lv_lateral_added_spline_num = null;
            ////let lv_lateral_deleted_spline_num = null;



            ////try {

            ////    switch (this.main) {

            ////        case "go_up_side_shape_generator":
            ////            lv_up_added_spline_num = pv_added_spline_num;
            ////            lv_up_deleted_spline_num = pv_deleted_spline_num;
            ////            break;

            ////        case "go_lateral_side_shape_generator":
            ////            lv_lateral_added_spline_num = pv_added_spline_num;
            ////            lv_lateral_deleted_spline_num = pv_deleted_spline_num;
            ////            break;
            ////    }


                CommonFunc.prototype.clear_group_childrens(this.main.group_end_shape);


                // переопределение размерности массива цветов

                let lv_up_splines_amount = go_up_side_shape_generator.shapes.shape_amount_curves;
                let lv_lateral_splines_amount = go_lateral_side_shape_generator.shapes.shape_amount_curves;

                //this.ColorParts =
                this.redefine_arr_color_parts(lv_up_splines_amount, lv_lateral_splines_amount,
                    null, // pv_up_added_spline_num
                    null, // pv_up_deleted_spline_num
                    null, // pv_lateral_added_spline_num
                    null // pv_lateral_deleted_spline_num
                );


                //lv_up_splines_amount, lv_lateral_splines_amountm,
                //    pv_up_added_spline_num, pv_up_deleted_spline_num,
                //    pv_lateral_added_spline_num, pv_lateral_deleted_spline_num




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

                let lv_curve_distance_vert = go_up_side_shape_generator.params.shape_width / (lv_rows + 1);
                let lv_curve_distance_hor = go_lateral_side_shape_generator.params.shape_width / (lv_cols + 1);

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




                for (let lv_i = 0; lv_i < lv_cols; lv_i++) {

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

                for (let lv_i = 0; lv_i < lv_rows; lv_i++) {
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

        //------------------------------------------------------------------------
        EndShape.prototype.redefine_arr_color_parts = function (
            pv_up_splines_amount, pv_lateral_splines_amount,
            pv_added_spline_num, pv_deleted_spline_num,
            //pv_up_added_spline_num, pv_up_deleted_spline_num,
            //pv_lateral_added_spline_num, pv_lateral_deleted_spline_num

        ) {


            let lv_up_added_spline_num = null;
            let lv_up_deleted_spline_num = null;
            let lv_lateral_added_spline_num = null;
            let lv_lateral_deleted_spline_num = null;



            try {

                switch (this.main) {

                    case "go_up_side_shape_generator":
                        lv_up_added_spline_num = pv_added_spline_num;
                        lv_up_deleted_spline_num = pv_deleted_spline_num;
                        break;

                    case "go_lateral_side_shape_generator":
                        lv_lateral_added_spline_num = pv_added_spline_num;
                        lv_lateral_deleted_spline_num = pv_deleted_spline_num;
                        break;
                }



            let lar_result_color_parts = null;

            try {

                //if ( pv_up_splines_amount == null || pv_lateral_splines_amount == null
                //    || pv_up_splines_amount < 0 || pv_lateral_splines_amount < 0 ) {

                //    return lar_result_color_parts;
                //}



                if (!this.ColorParts) {

                    lar_result_color_parts = CommonFunc.prototype.Create2DArray(pv_lateral_splines_amount, pv_up_splines_amount, 0xfff);

                    return lar_result_color_parts;

                }


                let lv_shape_up_parts_amount = pv_up_splines_amount + 1;
                let lv_shape_lateral_parts_amount = pv_lateral_splines_amount + 1;

                let lv_color_up_parts_amount = this.ColorParts[0].length;
                let lv_color_lateral_parts_amount = this.ColorParts.length;

                let lar_newRow = null;



                let lar_cop_color_parts = Array.from(this.ColorParts);



                // Операции со строками

                // добавление
                if (pv_lateral_added_spline_num >= 0) {

                    lar_newRow = lar_cop_color_parts[pv_lateral_added_spline_num];
                    lar_cop_color_parts.splice(pv_lateral_added_spline_num, 0, lar_newRow);

                }

                // удаление
                if (pv_lateral_deleted_spline_num >= 0) {

                    lar_cop_color_parts.splice(pv_lateral_deleted_spline_num, 1); // Удаляем строку с индексом pv_deleted_up_spline_num
                }




                // Операции со столбцами

                // добавление
                if (pv_up_added_spline_num >= 0) {


                    // копирование столбца
                    let lar_column = lar_cop_color_parts.map(row => row[pv_up_added_spline_num]);

                    // добавление
                    for (let lv_i = 0; lv_i < lar_cop_color_parts.length; lv_i++) {
                        lar_cop_color_parts[lv_i].splice(pv_up_added_spline_num, 0, lar_column[lv_i]);
                    }

                }

                // удаление
                if (pv_up_deleted_spline_num >= 0) {

                    for (let lar_row of lar_cop_color_parts) {
                        lar_row.splice(pv_up_deleted_spline_num, 1); // Удаляем элемент из каждой строки
                    }

                }


                this.ColorParts = lar_result_color_parts;
















                //if ((pv_up_deleted_spline_num == null || pv_up_deleted_spline_num < 0)
                //    && (pv_lateral_deleted_spline_num == null || pv_lateral_deleted_spline_num < 0)
                //) {

                //    return this.ColorParts;

                //}



                ////let lar_cop_color_parts = Array.from(this.ColorParts);


                //if (pv_lateral_deleted_spline_num >= 0 && pv_lateral_deleted_spline_num < this.ColorParts.length) {
                //    // Удаляем строку с индексом pv_deleted_lateral_spline_num
                //    this.ColorParts.splice(pv_up_deleted_spline_num, 1);
                //}


                //if (pv_up_deleted_spline_num >= 0 && pv_up_deleted_spline_num < this.ColorParts[0].length) {
                //    // Удаляем столбец с индексом pv_deleted_up_spline_num

                //    for (let row of this.ColorParts) {
                //        row.splice(pv_up_deleted_spline_num, 1); // Удаляем элемент из каждой строки
                //    }
                //}



            }

            catch (e) {

                alert('error redefine_arr_color_parts: ' + e.stack);

            }

        }


        //====================================================================



    }  // if (typeof this.create_rectangle !== "function")

    //====================================================================



    this.redraw_end_shape(
        null, null,
        null, null,
        null, null
    );


}

// end Class Rectangle
//=====================================================================
