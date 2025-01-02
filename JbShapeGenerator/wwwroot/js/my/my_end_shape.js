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

                let lv_up_splines_amount = go_up_side_shape_generator.shapes.shape_amount_curves;
                let lv_lateral_splines_amount = go_lateral_side_shape_generator.shapes.shape_amount_curves;


                // переопределение размерности массива цветов

                this.redefine_arr_color_parts(
                    po_main,
                    lv_up_splines_amount, lv_lateral_splines_amount,
                    pv_added_spline_num, pv_deleted_spline_num
                );


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


                let lv_line_position = 0;
                let lv_prev_line_position = 0;
                let lv_cell_position = 0;
                let lv_spline_position = 0;

                for (let lv_i = 0; lv_i < lv_rows; lv_i++) {

                    lo_line_curr = lo_line_hor.clone();

                    if (lv_i == 0) {

                        //координаты начальной точки текущей кривой
                        lv_spline_position = this.get_spline_position_by_side_and_num_spline(go_lateral_side_shape_generator, lv_i);
                        lv_line_position = go_lateral_side_shape_generator.params.shape_width - lv_spline_position;

                        lv_cell_position = go_lateral_side_shape_generator.params.shape_width;

                        //25122024 for (let lv_j = 0; lv_j < this.ColorParts.length; lv_j++) {
                        for (let lv_j = 0; lv_j < this.ColorParts[0].length; lv_j++) { //25122024
                            this.ColorParts[lv_i][lv_j].right_top.y = lv_cell_position;
                        }

                        lo_line_curr.position.y = lv_line_position;
                        lv_prev_line_position = lv_line_position;

                        this.main.group_end_shape.add(lo_line_curr);

                    }
                    else {

                        if (lv_i == lv_rows - 1) {

                            lv_cell_position = 0; // go_lateral_side_shape_generator.params.shape_width;;

                            //25122024 for (let lv_j = 0; lv_j < this.ColorParts.length; lv_j++) {
                            for (let lv_j = 0; lv_j < this.ColorParts[0].length; lv_j++) { //25122024

                                this.ColorParts[lv_i - 1][lv_j].left_bottom.y = lv_prev_line_position; // 29122024


                                this.ColorParts[lv_i][lv_j].left_bottom.y = lv_cell_position;
                                this.ColorParts[lv_i][lv_j].right_top.y = lv_prev_line_position; // go_lateral_side_shape_generator.params.shape_width;

                            }
                        }

                        else {

                            lo_line_curr = lo_line_hor.clone();

                            //координаты начальной точки текущей кривой
                            lv_spline_position = this.get_spline_position_by_side_and_num_spline(go_lateral_side_shape_generator, lv_i);
                            lv_line_position = go_lateral_side_shape_generator.params.shape_width - lv_spline_position;


                            lo_line_curr.position.y = lv_line_position; // lv_curve_distance_hor * (lv_i + 1);

                            // присвоение координат в массиве ячеек ColorParts

                            // присвоение координаты y

                            for (let lv_j = 0; lv_j < this.ColorParts[0].length; lv_j++) {

                                this.ColorParts[lv_i - 1][lv_j].left_bottom.y = lv_prev_line_position; // lv_line_position;
                                this.ColorParts[lv_i][lv_j].right_top.y = lv_prev_line_position; //lv_line_position;
                                this.ColorParts[lv_i][lv_j].left_bottom.y = lv_line_position; //lv_line_position;

                            }

                            lv_prev_line_position = lv_line_position; // lv_spline_position; // lv_cell_position; // lv_line_position;

                            this.main.group_end_shape.add(lo_line_curr);

                        }

                    }
                }


                //------------------------------------------------------------------------------------

                for (let lv_i = 0; lv_i < lv_cols; lv_i++) {

                    lo_line_curr = lo_line_vert.clone();

                    //lo_line_curr.name = lo_line_curr.name + "_" + lv_i.toString();



                    if (lv_i == 0) {
                        //координаты начальной точки текущей кривой

                        //21122024 {
                        ////if (go_up_side_shape_generator.shapes
                        ////    && go_up_side_shape_generator.shapes.ar_splines[lv_i]
                        ////    && go_up_side_shape_generator.shapes.ar_splines[lv_i].children[0]
                        ////    && go_up_side_shape_generator.shapes.ar_splines[lv_i].children[0].children[0]
                        ////    && go_up_side_shape_generator.shapes.ar_splines[lv_i].children[0].children[0].position.x
                        ////) {

                        ////    lv_spline_position = go_up_side_shape_generator.shapes.ar_splines[lv_i].children[0].children[0].position.x;
                        ////    lv_line_position = /*go_up_side_shape_generator.params.shape_width -*/ lv_spline_position;
                        ////}

                        lv_spline_position = this.get_spline_position_by_side_and_num_spline(go_up_side_shape_generator, lv_i);
                        lv_line_position = /*go_up_side_shape_generator.params.shape_width -*/ lv_spline_position;

                        //21122024 }



                        lv_cell_position = 0;// go_up_side_shape_generator.params.shape_width;


                        //attension!! 29122024
                        //30122024 for (let lv_j = 0; lv_j < this.ColorParts.length; lv_j++) {
                        for (let lv_j = 0; lv_j < this.ColorParts[0].length; lv_j++) {  //30122024
                            this.ColorParts[lv_i][lv_j].left_bottom.x = lv_cell_position;
                        }

                        lo_line_curr.position.x = lv_line_position;
                        lv_prev_line_position = lv_line_position; // lv_spline_position;

                        this.main.group_end_shape.add(lo_line_curr);

                    }
                    else {

                        if (lv_i == lv_cols - 1) {

                            //25122024  lv_cell_position = lv_line_position; // 0; //go_up_side_shape_generator.params.shape_width;;

                            for (let lv_j = 0; lv_j < this.ColorParts.length; lv_j++) {


                                this.ColorParts[lv_j][lv_i - 1].right_top.x = lv_prev_line_position; // 29122024

                                this.ColorParts[lv_j][lv_i].right_top.x = go_up_side_shape_generator.params.shape_width;
                                //25122024 this.ColorParts[lv_j][lv_i].left_bottom.x = lv_cell_position;



                                this.ColorParts[lv_j][lv_i].left_bottom.x = lv_prev_line_position; //25122024

                            }

                        }

                        else {

                            lo_line_curr = lo_line_vert.clone();

                            //21122024 {
                            //if (go_up_side_shape_generator.shapes
                            //    && go_up_side_shape_generator.shapes.ar_splines[lv_i]
                            //    && go_up_side_shape_generator.shapes.ar_splines[lv_i].children[0]
                            //    && go_up_side_shape_generator.shapes.ar_splines[lv_i].children[0].children[0]
                            //    && go_up_side_shape_generator.shapes.ar_splines[lv_i].children[0].children[0].position.x
                            //) {

                            //    lv_spline_position = go_up_side_shape_generator.shapes.ar_splines[lv_i].children[0].children[0].position.x;
                            //    lv_line_position = lv_spline_position;
                            //}

                            lv_spline_position = this.get_spline_position_by_side_and_num_spline(go_up_side_shape_generator, lv_i);
                            lv_line_position = lv_spline_position;

                            //21122024 }

                            lo_line_curr.position.x = lv_line_position;

                            // присвоение координат в массиве ячеек ColorParts

                            // присвоение координаты x 

                            for (let lv_j = 0; lv_j < this.ColorParts.length; lv_j++) {

                                this.ColorParts[lv_j][lv_i - 1].right_top.x = lv_prev_line_position; // lv_line_position;

                                this.ColorParts[lv_j][lv_i].right_top.x = lv_line_position;
                                this.ColorParts[lv_j][lv_i].left_bottom.x = lv_prev_line_position;


                            }

                            lv_prev_line_position = lv_line_position; //lv_spline_position; // lv_line_position;
                            this.main.group_end_shape.add(lo_line_curr);

                            //}

                        }

                    }
                }





                this.draw_cells_contours();


                this.refresh_end_shapes(); //23122024


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


                //24122024 {
                //////const geometry = new THREE.SphereGeometry(3);
                //////const material = new THREE.MeshBasicMaterial({ mcolor: 0xff000f, side: THREE.BackSide });
                //////let sphere = new THREE.Mesh(geometry, material);
                //////let lo_sphere_curr = null;
                //24122024 }


                let lv_delta = 0.5;
                //let lv_delta_y = 0;


                for (let lv_i = 0; lv_i < this.ColorParts.length; lv_i++) {
                    for (let lv_j = 0; lv_j < this.ColorParts[0].length; lv_j++) {

                        //if (lv_i !== lv_j) {
                        //    continue;
                        //}

                        //lv_delta_y = 0;
                        //if (lv_i % 2) {
                        //    lv_delta_y = -1;
                        //}

                        //lv_delta_x = 0;
                        //if (lv_j % 2) {
                        //    lv_delta_x = -1;
                        //}



                        let lo_rectangle = CommonFunc.prototype.get_drawing_rectangle_by_points(
                            this.ColorParts[lv_i][lv_j].left_bottom,
                            this.ColorParts[lv_i][lv_j].right_top,
                            lv_color, //null,
                            lo_material,
                            lv_delta
                            //lv_delta_y
                        );

                        //if (lv_i % 2) {
                        //    lo_rectangle.visible = false;
                        //}

                        //if (lv_j % 2) {
                        //    lo_rectangle.visible = false;
                        //}

                        lo_rectangle.visible = this.ColorParts[lv_i][lv_j].is_contour_visible;


                        lo_rectangle.name = lv_i.toString() + "_" + lv_j.toString();


                        this.main.group_end_cells_contours.add(lo_rectangle);




                        ////lo_sphere_curr = sphere.clone();
                        ////lo_sphere_curr.position.x = this.ColorParts[lv_i][lv_j].left_bottom.x;
                        ////lo_sphere_curr.position.y = this.ColorParts[lv_i][lv_j].left_bottom.y;
                        ////lo_sphere_curr.position.z = 0;
                        ////this.main.group_end_cells_contours.add(lo_sphere_curr);


                        ////lo_sphere_curr = sphere.clone();
                        ////lo_sphere_curr.position.x = this.ColorParts[lv_i][lv_j].right_top.x;
                        ////lo_sphere_curr.position.y = this.ColorParts[lv_i][lv_j].right_top.y;
                        ////lo_sphere_curr.position.z = 0;
                        ////this.main.group_end_cells_contours.add(lo_sphere_curr);

                    }
                }

            }

            catch (e) {

                alert('error draw_cells_contours: ' + e.stack);

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

                    //25122024 {
                    ////let lar_array;

                    ////let lv_cols = pv_up_splines_amount + 1;
                    ////let lv_rows = pv_lateral_splines_amount + 1;

                    ////lar_array = new Array(lv_cols);
                    ////for (let lv_i = 0; lv_i < lv_cols; lv_i++) {

                    ////    lar_array[lv_i] = new Array(lv_rows);

                    ////    for (let lv_j = 0; lv_j < lv_rows; lv_j++) {
                    ////        lar_array[lv_i][lv_j] = new typ_color_part();
                    ////        lar_array[lv_i][lv_j].left_bottom = new THREE.Vector2(0, 0);
                    ////        lar_array[lv_i][lv_j].right_top = new THREE.Vector2(0, 0);
                    ////    }

                    ////}

                    ////this.ColorParts = lar_array;
                    //25122024 }

                    this.init_color_parts(pv_up_splines_amount, pv_lateral_splines_amount);

                    return;

                }


                //return; //15122024




                let lv_shape_up_parts_amount = pv_up_splines_amount + 1;
                let lv_shape_lateral_parts_amount = pv_lateral_splines_amount + 1;

                let lv_color_up_parts_amount = this.ColorParts[0].length;
                let lv_color_lateral_parts_amount = this.ColorParts.length;

                let lar_newRow = null;



                //29122024 let lar_cop_color_parts = Array.from(this.ColorParts, row => [...row]);//@@@ need correct

                let lar_cop_color_parts = JSON.parse(JSON.stringify(this.ColorParts));//29122024




                let lv_is_changed = false;

                // добавление строки
                if (lv_lateral_added_spline_num) {

                    if (lv_lateral_added_spline_num >= 0) {

                        // 30122024 {
                        //lar_newRow = lar_cop_color_parts[lv_lateral_added_spline_num];
                        //lar_cop_color_parts.splice(lv_lateral_added_spline_num, 0, lar_newRow);

                        //lar_newRow = lar_cop_color_parts[lv_lateral_added_spline_num].slice();
                        ////lar_cop_color_parts[lv_lateral_added_spline_num + 1] = lar_newRow;
                        //lar_cop_color_parts[lar_cop_color_parts.length] = lar_newRow;




                        //lar_newRow = lar_cop_color_parts[lv_lateral_added_spline_num].map(item => item);
                        //lar_cop_color_parts[lar_cop_color_parts.length] = lar_newRow;


                        lar_newRow = JSON.parse(JSON.stringify(lar_cop_color_parts[lv_lateral_added_spline_num]));
                        lar_cop_color_parts[lar_cop_color_parts.length] = lar_newRow;



                        //3012024 }






                        lv_is_changed = true;
                    }
                }


                // удаление строки
                if (lv_lateral_deleted_spline_num) {

                    if (lv_lateral_deleted_spline_num >= 0) {
                        lar_cop_color_parts.splice(lv_lateral_deleted_spline_num, 1); // Удаляем строку с индексом pv_deleted_up_spline_num
                        lv_is_changed = true;

                    }
                }




                // добавление столбца
                if (lv_up_added_spline_num) {
                    if (lv_up_added_spline_num >= 0) {


                        // копирование столбца
                        //29122024 let lar_column = lar_cop_color_parts.map(row => row[lv_up_added_spline_num]);

                        let lar_column = lar_cop_color_parts.map(row => JSON.parse(JSON.stringify(row[lv_up_added_spline_num]))); //29122024

                        // добавление
                        for (let lv_i = 0; lv_i < lar_cop_color_parts.length; lv_i++) {
                            lar_cop_color_parts[lv_i].splice(lv_up_added_spline_num, 0, lar_column[lv_i]);

                        }
                        lv_is_changed = true;

                    }
                }


                // удаление столбца
                if (lv_up_deleted_spline_num) {
                    if (lv_up_deleted_spline_num >= 0) {

                        for (let lar_row of lar_cop_color_parts) {
                            lar_row.splice(lv_up_deleted_spline_num, 1); // Удаляем элемент из каждой строки
                        }
                        lv_is_changed = true;

                    }
                }

                if (lv_is_changed) {
                    this.ColorParts = lar_cop_color_parts;
                }
            }

            catch (e) {

                alert('error redefine_arr_color_parts: ' + e.stack);

            }

        }

        //------------------------------------------------------------------------
        EndShape.prototype.init_color_parts = function (pv_up_splines_amount, pv_lateral_splines_amount) {


            try {


                let lar_array;

                let lv_cols = pv_up_splines_amount + 1;
                let lv_rows = pv_lateral_splines_amount + 1;

                lar_array = new Array(lv_cols);
                for (let lv_i = 0; lv_i < lv_cols; lv_i++) {

                    lar_array[lv_i] = new Array(lv_rows);

                    for (let lv_j = 0; lv_j < lv_rows; lv_j++) {
                        lar_array[lv_i][lv_j] = new typ_color_part();
                        lar_array[lv_i][lv_j].left_bottom = new THREE.Vector2(0, 0);
                        lar_array[lv_i][lv_j].right_top = new THREE.Vector2(0, 0);
                        lar_array[lv_i][lv_j].cell_color = Constants.background_color;
                    }

                }

                this.ColorParts = lar_array;

            }

            catch (e) {

                alert('error init_color_parts: ' + e.stack);

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

                        //// Сброс выделенности всех контуров
                        //this.set_visible_all_contours(false);


                        let lo_rectangle_color_cell = this.get_rectangle_color_cell(po_event);

                        if (lo_rectangle_color_cell) {

                            lo_rectangle_color_cell.rectangle.visible = !lo_rectangle_color_cell.rectangle.visible;

                            let lv_cell_row = lo_rectangle_color_cell.row;
                            let lv_cell_col = lo_rectangle_color_cell.col;

                            // Запоминание состояния видимости контура в массиве ячеек
                            this.ColorParts[lv_cell_row][lv_cell_col].is_contour_visible = lo_rectangle_color_cell.rectangle.visible;


                            // Сброс выделенности всех предыдущих контуров
                            this.set_visible_all_contours(lo_rectangle_color_cell.rectangle, lv_cell_row, lv_cell_col, false);///////


                        }



                    }


                    //lo_active_side.render();

                    break;
                }// while


                lo_active_side.render();


            }

            catch (e) {

                alert('error handle_click_on_end_side: ' + e.stack);

            }
        }
        //------------------------------------------------------------------------
        EndShape.prototype.set_visible_all_contours = function (po_rectangle, pv_cell_row, pv_cell_col, pv_is_visible) {

            try {


                this.main.group_end_cells_contours

                for (let lo_mesh of this.main.group_end_cells_contours.children) {


                    if (lo_mesh.type == "Line2") {

                        if (lo_mesh !== po_rectangle) {

                            lo_mesh.visible = pv_is_visible;
                        }
                    }

                }

                this.set_visible_all_color_cells(pv_cell_row, pv_cell_col, pv_is_visible, pv_is_visible);

            }

            catch (e) {

                alert('error reset_all_contours: ' + e.stack);

            }
        }


        //------------------------------------------------------------------------
        EndShape.prototype.set_visible_all_color_cells = function (pv_cell_row, pv_cell_col, pv_is_visible) {

            try {

                let lv_nrows = this.ColorParts.length;
                let lv_ncols = this.ColorParts[0].length;

                for (let lv_i = 0; lv_i < lv_nrows; lv_i++) {

                    for (let lv_j = 0; lv_j < lv_ncols; lv_j++) {

                        if (lv_i !== pv_cell_row || lv_j !== pv_cell_col) {

                            this.ColorParts[lv_i][lv_j].is_contour_visible = pv_is_visible;
                        }
                    }
                }
            }

            catch (e) {

                alert('error set_visible_all_color_cells: ' + e.stack);

            }
        }

        //------------------------------------------------------------------------
        EndShape.prototype.get_rectangle_color_cell = function (po_event) {

            //let lo_result = null;
            let lo_result_rectangle = null;

            let lo_pos = null;
            try {

                let lo_active_side = get_active_side_shape_generator();

                let lo_container = lo_active_side.container;

                let lo_click_pos = this.main.common_func.recalc_coord_event2world(this.main.camera, lo_container, po_event.clientX, po_event.clientY); //06052024

                let lv_rows = go_lateral_side_shape_generator.shapes.ar_splines.length + 1;
                let lv_cols = go_up_side_shape_generator.shapes.ar_splines.length + 1;


                let lv_spline_position;

                let lv_prev_spline_position = 0;

                let lv_cell_num_column = null;
                let lv_cell_num_row = null;



                for (let lv_i = 0; lv_i < lv_rows; lv_i++) {

                    //координата начальной точки текущей кривой
                    if (lv_i == lv_rows - 1) {
                        lv_spline_position = 0;
                    }
                    else {
                        lv_spline_position = go_lateral_side_shape_generator.params.shape_width
                            - this.get_spline_position_by_side_and_num_spline(go_lateral_side_shape_generator, lv_i);
                    }

                    if (lo_click_pos.y >= lv_spline_position) {

                        lv_cell_num_row = lv_i;

                        break;
                    }
                }

                if (lv_cell_num_row == null) {
                    return null;
                }

                //----------

                for (let lv_i = 0; lv_i < lv_cols; lv_i++) {

                    //координата начальной точки текущей кривой

                    if (lv_i == lv_cols - 1) {
                        //25122024 lv_spline_position = go_lateral_side_shape_generator.params.shape_width;
                        lv_spline_position = go_up_side_shape_generator.params.shape_width; //25122024 
                    }
                    else {
                        lv_spline_position = this.get_spline_position_by_side_and_num_spline(go_up_side_shape_generator, lv_i);
                    }


                    if (lo_click_pos.x <= lv_spline_position) {

                        lv_cell_num_column = lv_i;
                        break;
                    }
                }

                if (lv_cell_num_column == null) {
                    return null;
                }

                // Формирование имени контура по номеру строки и столбца

                let lv_rectangle_name = this.main.common_func.get_name_by_numrow_numcol(lv_cell_num_row, lv_cell_num_column);

                // Чтение объекта контура по имени
                if (lv_rectangle_name) {

                    lo_result_rectangle = this.main.group_end_cells_contours.getObjectByName(lv_rectangle_name);
                }

                return { rectangle: lo_result_rectangle, row: lv_cell_num_row, col: lv_cell_num_column }
            }

            catch (e) {

                alert('error get_rectangle_color_cell: ' + e.stack);

            }
        }

        //------------------------------------------------------------------------
        EndShape.prototype.refresh_end_shapes = function () {

            try {

                let lv_nrows = this.ColorParts.length;
                let lv_ncols = this.ColorParts[0].length;
                let lv_color = null;


                CommonFunc.prototype.clear_group_childrens(this.main.end_group_cells_mesh);


                for (let lv_i = 0; lv_i < lv_nrows; lv_i++) {

                    for (let lv_j = 0; lv_j < lv_ncols; lv_j++) {

                        //if (this.ColorParts[lv_i][lv_j].is_contour_visible) {

                        lv_color = this.ColorParts[lv_i][lv_j].cell_color;
                        this.set_color_to_rectangle_cell(lv_color, lv_i, lv_j);
                        //}

                    }

                }
            }

            catch (e) {

                alert('error refresh_end_shapes: ' + e.stack);

            }
        }


        //------------------------------------------------------------------------
        EndShape.prototype.set_color_to_selected_rectangle_cells = function (pv_color_value) {

            let lv_i_result = null;
            let lv_j_result = null;

            try {



                let lv_nrows = this.ColorParts.length;
                let lv_ncols = this.ColorParts[0].length;


                for (let lv_i = 0; lv_i < lv_nrows; lv_i++) {
                    for (let lv_j = 0; lv_j < lv_ncols; lv_j++) {

                        if (this.ColorParts[lv_i][lv_j].is_contour_visible) {
                            this.set_color_to_rectangle_cell(pv_color_value, lv_i, lv_j);
                            lv_i_result = lv_i;
                            lv_j_result = lv_j;
                        }

                    }

                }



            }

            catch (e) {

                alert('error set_color_to_selected_rectangle_cells: ' + e.stack);

            }

            return {
                cell_num_row: lv_i_result,
                cell_num_col: lv_j_result
            }

        }


        //------------------------------------------------------------------------
        EndShape.prototype.set_color_to_rectangle_cell = function (pv_color_value, pv_cell_num_row, pv_cell_num_col) {

            try {

                let lo_rectangle = null;

                let lv_cell_contour_name = CommonFunc.prototype.get_name_by_numrow_numcol(pv_cell_num_row, pv_cell_num_col)

                // Чтение объекта контура по имени
                if (lv_cell_contour_name) {
                    lo_rectangle = this.main.group_end_cells_contours.getObjectByName(lv_cell_contour_name);
                }

                if (!lo_rectangle) {
                    return;
                }


                //lo_rectangle.visible = false;
                //this.ColorParts[pv_cell_num_row][pv_cell_num_col].is_contour_visible = false;



                let lar_shape_points = [];
                lar_shape_points.push(
                    new THREE.Vector2(this.ColorParts[pv_cell_num_row][pv_cell_num_col].left_bottom.x, this.ColorParts[pv_cell_num_row][pv_cell_num_col].left_bottom.y/*, 0*/),
                    new THREE.Vector2(this.ColorParts[pv_cell_num_row][pv_cell_num_col].left_bottom.x, this.ColorParts[pv_cell_num_row][pv_cell_num_col].right_top.y/*, 0*/),
                    new THREE.Vector2(this.ColorParts[pv_cell_num_row][pv_cell_num_col].right_top.x, this.ColorParts[pv_cell_num_row][pv_cell_num_col].right_top.y/*, 0*/),
                    new THREE.Vector2(this.ColorParts[pv_cell_num_row][pv_cell_num_col].right_top.x, this.ColorParts[pv_cell_num_row][pv_cell_num_col].left_bottom.y/*, 0*/),
                    new THREE.Vector2(this.ColorParts[pv_cell_num_row][pv_cell_num_col].left_bottom.x, this.ColorParts[pv_cell_num_row][pv_cell_num_col].left_bottom.y/*, 0*/)
                );

                this.ColorParts[pv_cell_num_row][pv_cell_num_col].cell_color = pv_color_value; //25122024

                let lo_shape = new THREE.Shape(lar_shape_points);
                let lo_geometry = new THREE.ShapeGeometry(lo_shape);
                let lo_mesh = new THREE.Mesh(lo_geometry, new THREE.MeshBasicMaterial({ color: pv_color_value/*, side: THREE.DoubleSide*/ }));



                //this.main.group_end_cells_contours.add(lo_mesh);
                this.main.end_group_cells_mesh.add(lo_mesh);



            }

            catch (e) {

                alert('error set_color_to_rectangle_cell: ' + e.stack);

            }

        }
        //------------------------------------------------------------------------
        EndShape.prototype.get_spline_position_by_side_and_num_spline = function (po_side, pv_num_spline) {

            let lv_result = null;


            try {

                if (!po_side) {

                    return lv_result;
                }

                if (pv_num_spline == null || pv_num_spline < 0) {

                    return lv_result;
                }

                if (po_side.shapes
                    && po_side.shapes.ar_splines[pv_num_spline]
                    && po_side.shapes.ar_splines[pv_num_spline].children[0]
                    && po_side.shapes.ar_splines[pv_num_spline].children[0].children[0]
                    && po_side.shapes.ar_splines[pv_num_spline].children[0].children[0].position.x
                ) {
                    lv_result = po_side.shapes.ar_splines[pv_num_spline].children[0].children[0].position.x;
                }
                else {

                    return lv_result;
                }

            }


            catch (e) {

                alert('error get_spline_position: ' + e.stack);

            }

            return lv_result;

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
