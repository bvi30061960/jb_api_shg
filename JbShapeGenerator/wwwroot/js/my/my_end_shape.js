import * as THREE from 'three';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';


import { Constants } from './my_common_const.js';
import { CommonFunc } from './my_common_func.js';

import {
    gc_id_prefix_up,
    gc_id_prefix_lateral,
    gc_id_prefix_end,

    go_up_side_shape_generator,
    go_lateral_side_shape_generator,
    go_end_side_shape_generator,

    get_active_side_shape_generator

} from './my_shape_generator.js';


import {
    typ_color_part
} from "./my_common_types.js";

//========================================================================================
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
            po_main,
            pv_added_spline_num, pv_deleted_spline_num,
            po_is_use_data, po_sides_data
        ) {

            //return;


            try {

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


                let lv_up_splines_amount = go_up_side_shape_generator.shapes.shape_amount_curves;
                let lv_lateral_splines_amount = go_lateral_side_shape_generator.shapes.shape_amount_curves;



                //14122024 if (po_main) {

                // переопределение размерности массива цветов

                this.redefine_arr_color_parts(
                    po_main,
                    lv_up_splines_amount, lv_lateral_splines_amount,
                    pv_added_spline_num, pv_deleted_spline_num
                );

                //14122024 }



                CommonFunc.prototype.clear_group_childrens(this.main.group_end_shape);



                let lv_cols = lv_up_splines_amount + 1;
                let lv_rows = lv_lateral_splines_amount + 1;


                let lo_rectangle = CommonFunc.prototype.get_drawing_rectangle(
                    go_lateral_side_shape_generator.params.shape_width,
                    go_up_side_shape_generator.params.shape_width

                );
                lo_rectangle.name = cv_rectangle_name;

                this.main.group_end_shape.add(lo_rectangle);





                let lo_line_curr = null;
                let lo_geom_hor = null;
                let lo_geom_vert = null;
                let lo_line_hor = null;
                let lo_line_vert = null;

                let lv_position = null;
                //let lv_next_position = null;

                let lv_curve_distance_vert = go_up_side_shape_generator.params.shape_width / lv_rows;
                let lv_curve_distance_hor = go_lateral_side_shape_generator.params.shape_width / lv_cols;

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



                let lv_prev_y = null;

                for (let lv_i = 0; lv_i < lv_rows; lv_i++) {

                    lo_line_curr = lo_line_hor.clone();

                    //координаты начальной точки текущей кривой
                    if (go_lateral_side_shape_generator.shapes
                        && go_lateral_side_shape_generator.shapes.ar_splines[lv_i]
                        && go_lateral_side_shape_generator.shapes.ar_splines[lv_i].children[0]
                        && go_lateral_side_shape_generator.shapes.ar_splines[lv_i].children[0].children[0]
                        && go_lateral_side_shape_generator.shapes.ar_splines[lv_i].children[0].children[0].position.x
                    ) {

                        lv_position = go_lateral_side_shape_generator.shapes.ar_splines[lv_i].children[0].children[0].position.x;

                        lo_line_curr.position.y = go_lateral_side_shape_generator.params.shape_width - lv_position; // lv_curve_distance_hor * (lv_i + 1);



                        // присвоение координат в массиве ячеек ColorParts

                        // присвоение координаты y

                        for (let lv_j = 0; lv_j < this.ColorParts[0].length/* - 1*/; lv_j++) {

                            //if (lv_i == 0) {

                            //    this.ColorParts[lv_i][lv_j].left_top.y = 0;

                            //}
                            if (lv_i > 0) {
                                this.ColorParts[lv_i - 1][lv_j].left_top.y = lv_prev_y;
                                this.ColorParts[lv_i - 1][lv_j].right_bottom.y = lo_line_curr.position.y;
                                this.ColorParts[lv_i][lv_j].left_top.y = lo_line_curr.position.y;

                                if (lv_i == lv_rows - 1) {
                                    this.ColorParts[lv_i][lv_j].right_bottom.y = go_lateral_side_shape_generator.params.shape_width;
                                }
                            }


                            //this.ColorParts[lv_i][lv_j].right_bottom.y = lo_line_curr.position.y;


                        }

                        lv_prev_y = lo_line_curr.position.y;


                        this.main.group_end_shape.add(lo_line_curr);
                    }
                }


                let lv_prev_x = null;


                for (let lv_i = 0; lv_i < lv_cols; lv_i++) {

                    lo_line_curr = lo_line_vert.clone();

                    if (go_up_side_shape_generator.shapes
                        && go_up_side_shape_generator.shapes.ar_splines[lv_i]
                        && go_up_side_shape_generator.shapes.ar_splines[lv_i].children[0]
                        && go_up_side_shape_generator.shapes.ar_splines[lv_i].children[0].children[0]
                        && go_up_side_shape_generator.shapes.ar_splines[lv_i].children[0].children[0].position.x
                    ) {

                        lv_position = go_up_side_shape_generator.shapes.ar_splines[lv_i].children[0].children[0].position.x;
                        //}

                        lo_line_curr.position.x = lv_position;


                        // присвоение координат в массиве ячеек ColorParts

                        // присвоение координаты x 

                        for (let lv_j = 0; lv_j < this.ColorParts.length/* - 1*/; lv_j++) {

                            //if (lv_i == 0) {
                            //    this.ColorParts[lv_j][lv_i].left_top.x = 0;
                            //}

                            if (lv_i > 0) {
                                this.ColorParts[lv_j][lv_i - 1].left_top.x = lv_prev_x;
                                this.ColorParts[lv_j][lv_i - 1].right_bottom.x = lo_line_curr.position.x;
                                this.ColorParts[lv_j][lv_i].right_bottom.x = lo_line_curr.position.x;

                            }
                            if (lv_i == lv_cols - 1) {
                                this.ColorParts[lv_j][lv_i].right_bottom.x = go_up_side_shape_generator.params.shape_width;
                            }
                            //this.ColorParts[lv_j][lv_i].right_bottom.x = lo_line_curr.position.x;

                        }

                        //}

                        lv_prev_x = lo_line_curr.position.x;


                        this.main.group_end_shape.add(lo_line_curr);
                    }
                }




                this.draw_cells_contours();

            }

            catch (e) {

                alert('error redraw_end_shape: ' + e.stack);

            }

        }



        //------------------------------------------------------------------------
        EndShape.prototype.draw_cells_contours = function () {

            try {

                let lo_renderer = new THREE.WebGLRenderer({});
                let lo_resolution = new THREE.Vector2();
                lo_renderer.getSize(lo_resolution);

                let lv_color = Constants.shape_countour_color;
                let lo_material = new LineMaterial({
                    resolution: lo_resolution,
                    linewidth: 0.7,
                    color: lv_color
                });



                CommonFunc.prototype.clear_group_childrens(this.main.group_end_cells_contours);


                for (let lv_i = 0; lv_i <= 0; /*< this.ColorParts.length;*/ lv_i++) {

                    for (let lv_j = 0; lv_j <= 0; /*< this.ColorParts[0].length;*/ lv_j++) {


                        let lo_rectangle = CommonFunc.prototype.get_drawing_rectangle_by_points(
                            this.ColorParts[lv_i][lv_j].left_top,
                            this.ColorParts[lv_i][lv_j].right_bottom,
                            lv_color, //null,
                            lo_material
                        );



                        const geometry = new THREE.SphereGeometry(3);
                        const material = new THREE.MeshBasicMaterial({ color: 0xff000f });

 
                        let sphere = null;

                        sphere = new THREE.Mesh(geometry, material);
                        sphere.position.x = 0; // this.ColorParts[0][0].left_top.x;
                        sphere.position.y = 0; // this.ColorParts[0][0].left_top.y;
                        sphere.position.z = 0;
                        //po_scene.add(sphere);

                        this.main.group_end_cells_contours.add(sphere);





                        this.main.group_end_cells_contours.add(lo_rectangle);

                    }
                }

            }

            catch (e) {

                alert('error redraw_end_shape: ' + e.stack);

            }

        }

        //------------------------------------------------------------------------
        EndShape.prototype.redefine_arr_color_parts = function (
            po_main,
            pv_up_splines_amount, pv_lateral_splines_amount,
            pv_added_spline_num, pv_deleted_spline_num

        ) {


            let lv_up_added_spline_num = null;
            let lv_up_deleted_spline_num = null;
            let lv_lateral_added_spline_num = null;
            let lv_lateral_deleted_spline_num = null;



            try {

                switch (po_main) {

                    case go_up_side_shape_generator:
                        lv_up_added_spline_num = pv_added_spline_num;
                        lv_up_deleted_spline_num = pv_deleted_spline_num;
                        break;

                    case go_lateral_side_shape_generator:
                        lv_lateral_added_spline_num = pv_added_spline_num;
                        lv_lateral_deleted_spline_num = pv_deleted_spline_num;
                        break;
                }


                if (!this.ColorParts) {

                    //this.ColorParts = CommonFunc.prototype.Create2DArray(pv_up_splines_amount, pv_lateral_splines_amount, new typ_color_part()); // 0xfff);

                    let lar_array;

                    let lv_cols = pv_up_splines_amount + 1;
                    let lv_rows = pv_lateral_splines_amount + 1;

                    lar_array = new Array(lv_cols);
                    for (let lv_i = 0; lv_i < lv_cols; lv_i++) {

                        lar_array[lv_i] = new Array(lv_rows);

                        for (let lv_j = 0; lv_j < lv_rows; lv_j++) {
                            lar_array[lv_i][lv_j] = new typ_color_part();
                            lar_array[lv_i][lv_j].left_top = new THREE.Vector2(0, 0);
                            lar_array[lv_i][lv_j].right_bottom = new THREE.Vector2(0, 0);
                        }

                    }

                    this.ColorParts = lar_array;


                    return;

                }


                //return; //15122024




                let lv_shape_up_parts_amount = pv_up_splines_amount + 1;
                let lv_shape_lateral_parts_amount = pv_lateral_splines_amount + 1;

                let lv_color_up_parts_amount = this.ColorParts[0].length;
                let lv_color_lateral_parts_amount = this.ColorParts.length;

                let lar_newRow = null;



                let lar_cop_color_parts = Array.from(this.ColorParts, row => [...row]);



                // добавление строки
                if (lv_lateral_added_spline_num) {

                    if (lv_lateral_added_spline_num >= 0) {

                        lar_newRow = lar_cop_color_parts[pv_lateral_added_spline_num];
                        lar_cop_color_parts.splice(pv_lateral_added_spline_num, 0, lar_newRow);

                    }
                }


                // удаление строки
                if (lv_lateral_deleted_spline_num) {

                    if (lv_lateral_deleted_spline_num >= 0) {

                        lar_cop_color_parts.splice(lv_lateral_deleted_spline_num, 1); // Удаляем строку с индексом pv_deleted_up_spline_num
                    }
                }




                // добавление столбца
                if (lv_up_added_spline_num) {
                    if (lv_up_added_spline_num >= 0) {


                        // копирование столбца
                        let lar_column = lar_cop_color_parts.map(row => row[lv_up_added_spline_num]);

                        // добавление
                        for (let lv_i = 0; lv_i < lar_cop_color_parts.length; lv_i++) {
                            lar_cop_color_parts[lv_i].splice(lv_up_added_spline_num, 0, lar_column[lv_i]);
                        }

                    }
                }


                // удаление столбца
                if (lv_up_deleted_spline_num) {
                    if (lv_up_deleted_spline_num >= 0) {

                        for (let lar_row of lar_cop_color_parts) {
                            lar_row.splice(lv_up_deleted_spline_num, 1); // Удаляем элемент из каждой строки
                        }

                    }
                }

                this.ColorParts = lar_cop_color_parts;

            }

            catch (e) {

                alert('error redefine_arr_color_parts: ' + e.stack);

            }

        }


        //------------------------------------------------------------------------
        EndShape.prototype.handle_click_on_end_side = function (po_event) {


            try {

                let lo_active_side = get_active_side_shape_generator();

                while (true) {

                    let { top, left, width, height } = lo_active_side.container.getBoundingClientRect();//07052024

                    let lv_clickMouse = new THREE.Vector2();
                    lv_clickMouse.x = ((po_event.clientX - left) / width) * 2 - 1;
                    lv_clickMouse.y = - ((po_event.clientY - top) / height) * 2 + 1;

                    // Определение - щелчок внутри фигуры, или нет
                    let lo_rectangle = this.main.group_end_shape.children[0];

                    if (lo_rectangle && lo_rectangle.name == cv_rectangle_name) {
                        let lv_isInside = lo_active_side.common_func.IsInsideRectangle(po_event, lo_rectangle /*lo_active_side.rectangle*/)

                        if (!lv_isInside) {
                            return;
                        }
                    }

                    break;
                }// while

            }

            catch (e) {

                alert('error redefine_arr_color_parts: ' + e.stack);

            }
        }

        //====================================================================



    }  // if (typeof this.create_rectangle !== "function")

    //====================================================================



    this.redraw_end_shape(
        null,
        null, null,          //   po_main,
        null, null           //   pv_added_spline_num, pv_deleted_spline_num,
    );                       //   po_is_use_data, po_sides_data





}

// end Class Rectangle
//=====================================================================
