import * as THREE from 'three';
//import * as THREE from "https://unpkg.com/three@v0.149.0/build/three.module.js"
//import { THREE } from "https://unpkg.com/three@v0.149.0/build/three.module.js"


import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';


//import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
//import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
//import { TransformControls } from 'three/addons/controls/TransformControls.js';

import { Constants } from './my_common_const.js';

import {
    struc_gabarits,
    struc_segment_transform_data,
    cv_spline_group_name_prefix,
    cv_spline_name_prefix,
    cv_segment_group_name_prefix,
    cv_segment_name_prefix
} from "./my_common_types.js";

import { CommonFunc } from './my_common_func.js';
//import { Segments } from "./my_segments.js";


// Class Segment

const gc_ARC_SEGMENTS = 400;//31102024 

//const parent.nsegments = 3;

export function Splines(po_main, /*, pv_count_allsplines, pv_nspline, pv_spline_offset_x, po_segment_transform_data, pv_is_move_mode*/) {

    //var ARC_SEGMENTS = 400;//11062024


    // Свойства
    this.main = po_main;

    //this.count_allsplines = pv_count_allsplines;
    //this.nspline = pv_nspline;
    this.spline_offset_x = null; // pv_spline_offset_x;
    this.segment_transform_data = null; // po_segment_transform_data;

    //this.beg_point = po_beg_point;
    //this.pv_kx = pv_kx;
    //this.pv_ky = pv_ky;
    //this.ar_segment_points = [{}];

    //this.nsegments = pv_nsegments;

    //this.all_segments_points = [];
    //this.segments = [];
    //this.ar_indices_spline_segment_points = [];

    //this.spline = {};
    //this.is_move_mode = pv_is_move_mode; // true - режим смещения кривой
    this.name_prefix = "spline";

    //this.renderer = new THREE.WebGLRenderer({});
    //=====================================================================

    if (typeof this.create_spline != "function") {
        //	return;
        //}

        //----------------------------------------------------------
        // Методы
        //----------------------------------------------------------

        ////Spline.prototype.redraw_spline = function () {

        ////	for (let i = 0; i < this.segments.length; i++) {
        ////		//////////this.segments[i].redraw_segment();
        ////	}

        ////}


        //----------------------------------------------------------
        //Spline.prototype.redraw_segment = function () {
        //	alert('redraw_segment');
        //}




        //----------------------------------------------------------

        Splines.prototype.create_spline = function (po_parent, pv_spline_offset_x, ps_segment_transform_data /*, pv_height_koef*/, pv_segments_in_spline) {

            //31102024 var ARC_SEGMENTS = 400;//11062024

            try {
                //16022025 {
                //////////const lo_spline_geometry = new THREE.BufferGeometry();
                //////////lo_spline_geometry.setAttribute('position',
                //////////    new THREE.BufferAttribute(new Float32Array(gc_ARC_SEGMENTS * 2), 2));
                //16022025 }


                let lo_segment_beg_point = new THREE.Vector2(pv_spline_offset_x, 0);

                let lo_spline_group = new THREE.Group();
                lo_spline_group.name = this.main.common_func.get_object_name(cv_spline_group_name_prefix, lo_spline_group);

                let lo_segment_data;
                let lar_spline_points = [];


                //12022025 for (let lv_i = 0; lv_i < this.main.params.spline_amount_segments; lv_i++) {
                for (let lv_i = 0; lv_i < pv_segments_in_spline; lv_i++) {


                    //17022025 {


                    let lo_segment_group = new THREE.Group();
                    lo_segment_group.name = this.main.common_func.get_object_name(cv_segment_group_name_prefix, lo_segment_group);

                    //26022025 let lv_segment_id = this.main.common_func.get_guid();

                    let lv_is_firs_segment;
                    if (lv_i == 0) {
                        lv_is_firs_segment = true;
                    }
                    else {
                        lv_is_firs_segment = false;
                    }

                    let lv_is_last_segment;
                    if (lv_i == this.main.params.spline_amount_segments - 1) {
                        lv_is_last_segment = true;
                    }
                    else {
                        lv_is_last_segment = false;
                    }


                    lo_segment_data = this.main.segments.create_segment(
                        lo_segment_group,
                        this.main.segment_transform_data,
                        //26022025 lv_segment_id,// номер сегмента
                        lo_segment_beg_point,
                        lv_is_firs_segment, // признак первого сегмента
                        lv_is_last_segment  // признак последнего сегмента
                        /*pv_height_koef*/
                    );

                    lo_segment_beg_point = lo_segment_data.segment_beg_point;
                    this.draw_curve(lo_segment_group, lo_segment_data.points, cv_segment_name_prefix, false);


                    lar_spline_points.push(...lo_segment_data.points);
                    lo_spline_group.add(lo_segment_group);



                    //this.create_segment_group_and_points_and_curve(lv_is_firs_segment, lv_is_last_segment, lo_segment_beg_point);//1022025

                    //17022025 }

                }


                this.draw_curve(lo_spline_group, lar_spline_points, cv_spline_name_prefix, true);



                po_parent.add(lo_spline_group);


            }

            catch (e) {

                alert('error create_spline: ' + e.stack);

            }


        }



        //2402202 {
        ////////----------------------------------------------------------

        ////////Splines.prototype.create_spline = function (po_parent, pv_spline_offset_x, ps_segment_transform_data /*, pv_height_koef*/, pv_segments_in_spline) {
        //////Splines.prototype.insert_segment_before_selected = function (/*po_parent,*/ po_selected_segment) {

        //////    try {

        //////        ////let lo_segment_beg_point = new THREE.Vector2(pv_spline_offset_x, 0);

        //////        ////let lo_spline_group = new THREE.Group();
        //////        ////lo_spline_group.name = this.main.common_func.get_object_name(cv_spline_group_name_prefix, lo_spline_group);

        //////        ////let lo_segment_data;
        //////        ////let lar_spline_points = [];


        //////        // группа групп сегментов сплайна с выделенным сегментом
        //////        let lo_segments_group = po_selected_segment.parent.parent;

        //////        let lv_index_of_selected_segment = this.main.shapes.get_spline_group_index_of_selected_segment(po_selected_segment);

        //////        let lo_new_segments_group = new THREE.Group();
        //////        lo_new_segments_group.name = lo_segments_group.name;
        //////        let lar_new_spline_points = [];

        //////        let lar_points = [];
        //////        let lv_is_after = false;
        //////        //for (let lv_i = 0; lv_i < pv_segments_in_spline; lv_i++) {
        //////        for (let lv_i = 0; lv_i < lo_segments_group.children.length - 1/*??*/; lv_i++) {



        //////            if (!lo_segments_group.children[lv_i] instanceof THREE.Group) {
        //////                continue;
        //////            }




        //////            //if (lo_segments_group.children[lv_i] !== po_selected_segment.parent) {

        //////            //    continue;
        //////            //}


        //////            ////lar_points = this.main.segments.get_segment_points(lo_segments_group.children[lv_i]);

        //////            if (lv_i == lv_index_of_selected_segment) {

        //////                // вставка нового сегмента






        //////                let lo_beg_point_position = po_selected_segment.parent.parent.children[lv_segment_index].children[0].position;
        //////                let lo_segment_beg_point = new THREE.Vector2(lo_beg_point_position.x, lo_beg_point_position.y);

        //////                let lv_is_first_segment;
        //////                let lv_is_last_segment;

        //////                if (lv_segment_index == 0) {
        //////                    lv_is_first_segment = true;
        //////                }
        //////                else {
        //////                    lv_is_first_segment = false;
        //////                }

        //////                if (lv_segment_index == lo_spline_group.length - 2) {
        //////                    lv_is_last_segment = true;
        //////                }
        //////                else {
        //////                    lv_is_last_segment = false;
        //////                }



        //////                let lo_new_segment_data = this.main.segments.create_segment_group_points_curve(lv_is_first_segment, lv_is_last_segment, lo_segment_beg_point);

        //////                lo_segment_beg_point = lo_new_segment_data.segment_beg_point;
        //////                this.draw_curve(lo_segment_group, lo_segment_data.points, cv_segment_name_prefix, false);


        //////                //lar_spline_points.push(...lo_segment_data.points);
        //////                //lo_spline_group.add(lo_segment_group);


        //////                // 22022025 {
        //////                lar_new_spline_points.push(...lo_new_segment_data.points);
        //////                lo_new_segments_group.add(lo_new_segment_data.segment_group);

        //////                // 22022025 }













        //////                lv_is_after = true;
        //////            }

        //////            else {

        //////                if (lv_is_after) {

        //////                    if (lo_new_segment_data.y_max > 0) {
        //////                        // коррекция смещения по y на величину y_max нового сегмента

        //////                        for (let lv_j = 0; lv_j < lar_points.lesngth; lv_J++) {
        //////                            lar_points.y = lar_points.y + lo_new_segment_data.y_max;
        //////                        }

        //////                    }
        //////                }
        //////                //else {

        //////                //}

        //////                // копирование существующих сегментов


        //////                //lar_new_spline_points.push(...lar_points);
        //////                lo_new_segments_group.add(lo_segments_group.children[lv_i]);


        //////            }









        //////            ////if (!lo_segments_group.children[lv_i] instanceof THREE.Group) {
        //////            ////    continue;
        //////            ////}



        //////            ////let lo_segment_group = new THREE.Group();
        //////            ////lo_segment_group.name = this.main.common_func.get_object_name(cv_segment_group_name_prefix, lo_segment_group);

        //////            ////let lv_segment_id = this.main.common_func.get_guid();

        //////            ////let lv_is_firs_segment;
        //////            ////if (lv_i == 0) {
        //////            ////    lv_is_firs_segment = true;
        //////            ////}
        //////            ////else {
        //////            ////    lv_is_firs_segment = false;
        //////            ////}

        //////            ////let lv_is_last_segment;
        //////            ////if (lv_i == this.main.params.spline_amount_segments - 1) {
        //////            ////    lv_is_last_segment = true;
        //////            ////}
        //////            ////else {
        //////            ////    lv_is_last_segment = false;
        //////            ////}


        //////            ////lo_segment_data = this.main.segments.create_segment(
        //////            ////    lo_segment_group,
        //////            ////    this.main.segment_transform_data,
        //////            ////    lv_segment_id,// номер сегмента
        //////            ////    lo_segment_beg_point,
        //////            ////    lv_is_firs_segment, // признак первого сегмента
        //////            ////    lv_is_last_segment  // признак последнего сегмента
        //////            ////    /*pv_height_koef*/
        //////            ////);

        //////            //////lo_segment_beg_point = lo_segment_data.segment_beg_point;
        //////            //////this.draw_curve(lo_segment_group, lo_segment_data.points, cv_segment_name_prefix, false);


        //////            //////lar_spline_points.push(...lo_segment_data.points);
        //////            //////lo_spline_group.add(lo_segment_group);

        //////        }





        //////        this.draw_curve(lo_spline_group, lar_spline_points, cv_spline_name_prefix, true);



        //////        po_parent.add(lo_spline_group);


        //////    }

        //////    catch (e) {

        //////        alert('error insert_segment_before_selected: ' + e.stack);

        //////    }


        //////}

        //2402202 }











        //////----------------------------------------------------------

        ////Splines.prototype.create_segment_group_and_points_and_curve = function (pv_is_firs_segment, pv_is_last_segment, po_segment_beg_point) {

        ////    try {

        ////        let lo_segment_group = new THREE.Group();
        ////        lo_segment_group.name = this.main.common_func.get_object_name(cv_segment_group_name_prefix, lo_segment_group);

        ////        let lv_segment_id = this.main.common_func.get_guid();

        ////        //let lv_is_firs_segment;
        ////        //if (lv_i == 0) {
        ////        //    lv_is_firs_segment = true;
        ////        //}
        ////        //else {
        ////        //    lv_is_firs_segment = false;
        ////        //}

        ////        //let lv_is_last_segment;
        ////        //if (lv_i == this.main.params.spline_amount_segments - 1) {
        ////        //    lv_is_last_segment = true;
        ////        //}
        ////        //else {
        ////        //    lv_is_last_segment = false;
        ////        //}


        ////        lo_segment_data = this.main.segments.create_segment(
        ////            lo_segment_group,
        ////            this.main.segment_transform_data,
        ////            lv_segment_id,// номер сегмента
        ////            po_segment_beg_point,
        ////            pv_is_firs_segment, // признак первого сегмента
        ////            pv_is_last_segment  // признак последнего сегмента
        ////        );

        ////        lo_segment_beg_point = lo_segment_data.segment_beg_point;


        ////        this.draw_curve(lo_segment_group, lo_segment_data.points, cv_segment_name_prefix, false);


        ////        lar_spline_points.push(...lo_segment_data.points);
        ////        lo_spline_group.add(lo_segment_group);
        ////    }

        ////    catch (e) {

        ////        alert('error create_segment_group_and_points_and_curve: ' + e.stack);

        ////    }

        ////    return
        ////    {
        ////        po_segment_group: lo_segment_group;
        ////        par_spline_points: lar_spline_points;
        ////        po_segment_beg_point: lo_segment_beg_point

        ////    }
        ////}


        //----------------------------------------------------------

        Splines.prototype.create_spline_by_data = function (po_parent, pv_curr_spline_number, /*, pv_spline_offset_x, ps_segment_transform_data */ /*pv_is_use_data,*/
            po_side_data) {

            //31102024 var ARC_SEGMENTS = 400;

            try {
                const lo_spline_geometry = new THREE.BufferGeometry();
                lo_spline_geometry.setAttribute('position',
                    new THREE.BufferAttribute(new Float32Array(gc_ARC_SEGMENTS * 2), 2));

                //let lo_segment_beg_point = new THREE.Vector2(pv_spline_offset_x, 0);
                let lo_segment_beg_point = new THREE.Vector2(po_side_data.PointsCurves[pv_curr_spline_number][0][0], 0);//01112024
                let lo_spline_group = new THREE.Group();
                lo_spline_group.name = this.main.common_func.get_object_name(cv_spline_group_name_prefix, lo_spline_group);

                let lo_segment_data;
                let lar_spline_points = [];

                let lv_beg_segment_node_numb = 0; // po_side_data.Segments_beg_points_numbers[pv_curr_spline_number]
                let lv_end_segment_node_numb = 0;


                //let lv_nsegments = po_side_data.PointsCurves.length;
                let lv_nsegments = po_side_data.Segments_beg_points_numbers[pv_curr_spline_number].length;



                //for (let lv_i = 0; lv_i < this.main.params.spline_amount_segments; lv_i++) {
                for (let lv_i = 0; lv_i < lv_nsegments; lv_i++) {

                    lv_beg_segment_node_numb = po_side_data.Segments_beg_points_numbers[pv_curr_spline_number][lv_i];
                    if (lv_i > 0) {
                        lv_beg_segment_node_numb = lv_beg_segment_node_numb - 1;
                    }


                    if (lv_i < lv_nsegments - 1) {
                        //014112024 lv_end_segment_node_numb = po_side_data.Segments_beg_points_numbers[pv_curr_spline_number][lv_i + 1];
                        lv_end_segment_node_numb = po_side_data.Segments_beg_points_numbers[pv_curr_spline_number][lv_i + 1] - 1;
                    }
                    else {
                        lv_end_segment_node_numb
                            = po_side_data.PointsCurves[pv_curr_spline_number].length - 1;
                    }



                    let lo_segment_group = new THREE.Group();
                    lo_segment_group.name = this.main.common_func.get_object_name(cv_segment_group_name_prefix, lo_segment_group);

                    let lv_segment_id = this.main.common_func.get_guid();

                    let lv_is_firs_segment;
                    if (lv_i == 0) {
                        lv_is_firs_segment = true;
                    }
                    else {
                        lv_is_firs_segment = false;
                    }

                    let lv_is_last_segment;
                    //01112024 if (lv_i == this.main.params.spline_amount_segments - 1) {
                    if (lv_i == lv_nsegments - 1) {
                        lv_is_last_segment = true;
                    }
                    else {
                        lv_is_last_segment = false;
                    }


                    lo_segment_data = this.main.segments.create_segment_by_data(
                        lo_segment_group,
                        po_side_data,
                        pv_curr_spline_number,
                        /*this.main.segment_transform_data,*/
                        lv_segment_id,// номер сегмента
                        lo_segment_beg_point,
                        lv_is_firs_segment, // признак первого сегмента
                        lv_is_last_segment,  // признак последнего сегмента
                        /*pv_height_koef*/
                        lv_beg_segment_node_numb,
                        lv_end_segment_node_numb

                    );

                    lo_segment_beg_point = lo_segment_data.segment_beg_point;



                    this.draw_curve(lo_segment_group, lo_segment_data.points, cv_segment_name_prefix, false);//25042022


                    lar_spline_points.push(...lo_segment_data.points);
                    lo_spline_group.add(lo_segment_group);
                    //po_parent.add(lo_segment_group);//30042024

                }

                this.draw_curve(lo_spline_group, lar_spline_points, cv_spline_name_prefix, true);

                po_parent.add(lo_spline_group);


            }

            catch (e) {

                alert('error create_spline_by_data: ' + e.stack);

            }


        }

        //------------------------------------------------------------------------
        Splines.prototype.draw_curve = function (po_parent_group, par_points, pv_curve_name_prefix, pv_visible) {

            let lo_curve;
            let lo_curve_points;
            let lo_geometry;
            let lo_material;
            let lo_result_curve;

            try {



                lo_curve = new THREE.CatmullRomCurve3(par_points, false);
                lo_curve_points = lo_curve.getPoints(400);//07112024



                //let lo_curve2 = new THREE.CatmullRomCurve3(lo_curve_points, false);//!



                ////// Преобразование из Vector3 в массив по 3 числа

                //let lo_curve_points2 = [];
                //let lv_j = 0;
                //for (let lv_i = 0; lv_i < lo_curve_points.length; lv_i++) {

                //    lo_curve_points2[lv_j++] = lo_curve_points[lv_i].x;
                //    lo_curve_points2[lv_j++] = lo_curve_points[lv_i].y;
                //    lo_curve_points2[lv_j++] = lo_curve_points[lv_i].z;
                //}




                //////////-----------!! {

                lo_geometry = new THREE.BufferGeometry().setFromPoints(lo_curve_points);
                lo_material = new THREE.LineBasicMaterial({ color: 0xff0000 });
                lo_result_curve = new THREE.Line(lo_geometry, lo_material);

                //////////-----------!! }



                //--!! {
                //let clrs = [];
                //lo_curve_points2.forEach(() => {
                //    //clrs.push(0, 0, 255);//!! цвет линии
                //    clrs.push(0, 255, 0);//!! цвет линии
                //});
                //lo_geometry = new LineGeometry();
                //lo_geometry.setPositions(lo_curve_points2 );
                //lo_geometry.setColors(clrs);
                //lo_material = new LineMaterial({
                //    vertexColors: true, //0x001, //0x0f0,//0x00f, //VertexColors,
                //    linewidth: 5,     // Толщина линии
                //    resolution: new THREE.Vector2(window.innerWidth, window.innerHeight) // Обязательно
                //});
                //lo_result_curve = new Line2(lo_geometry, lo_material);
                //--!! }






                ////////////////////////lo_geometry = new LineGeometry().setFromPoints(lo_curve_points);
                ////////////////////lo_geometry = new THREE.BufferGeometry().setFromPoints(lo_curve_points);
                ////////////////////lo_material = new THREE.LineBasicMaterial({ color: 0x0000ff }); // Синий цвет
                ////////////////////lo_result_curve = new THREE.Line(lo_geometry, lo_material);


                //////////lo_geometry = new THREE.TubeGeometry(lo_curve_points, 64, 0.2, 8, false); // 0.2 - толщина
                ////lo_geometry = new THREE.TubeGeometry(lo_curve2, 64, 0.2, 8, false); // 0.2 - толщина
                ////lo_material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
                ////lo_result_curve = new THREE.Mesh(lo_geometry, lo_material);



                //!! {
                //////////lo_material = new LineMaterial({
                //////////    //color: new THREE.Color("#f00").getHex(),
                //////////    vertexColors: 0x001, //0x0f0,//0x00f, //VertexColors,
                //////////    linewidth: 8, //2, //0.6,  // толщина линии
                //////////    //resolution: lo_resolution
                //////////    //resolution: this.main.resolution //30072024
                //////////    resolution: new THREE.Vector2(window.innerWidth, window.innerHeight)
                //////////});
                ////////////20012025 }

                //////////let clrs = [];
                ////////////lar_positions.forEach(() => {
                ////////////lo_curve_points.forEach(() => {
                ////////////    clrs.push(0, 0, 255);//!! цвет линии
                ////////////});

                ////////////par_points.forEach(() => {
                ////////////    clrs.push(0, 0, 255);//!! цвет линии
                ////////////});

                //////////lo_curve_points2.forEach(() => {
                //////////    //clrs.push(0, 0, 255);//!! цвет линии
                //////////    clrs.push(0, 255, 0);//!! цвет линии
                //////////});

                //////////lo_geometry = new LineGeometry();
                //////////lo_geometry.setPositions(lo_curve_points2 /*par_points *//*lo_curve_points*/);
                //////////lo_geometry.setColors(clrs);


                //////////lo_result_curve = new Line2(lo_geometry, lo_material);//20012025
                ////////////29012025 lo_countour_line = new Line2(lo_geometry, this.material_for_countours); //20012025
                /////////////lo_result_curve.renderOrder = 3;// 2;

                //!! }




                lo_result_curve.name = this.main.common_func.get_object_name(pv_curve_name_prefix, lo_result_curve);
                lo_result_curve.visible = pv_visible; //true;//29012025 

                //lo_result_curve.renderOrder = 3;

                po_parent_group.add(lo_result_curve);


            }

            catch (e) {

                alert('error draw_curve: ' + e.stack);

            }

            return lo_result_curve; //2304204
        }


        //////----------------------------------------------------------

        ////Splines.prototype.insert_spline = function (po_parent, pv_spline_offset_x, ps_segment_transform_data /*, pv_height_koef*/, pv_segments_in_spline) {

        ////    //31102024 var ARC_SEGMENTS = 400;//11062024

        ////    try {
        ////        //16022025 {
        ////        //////////const lo_spline_geometry = new THREE.BufferGeometry();
        ////        //////////lo_spline_geometry.setAttribute('position',
        ////        //////////    new THREE.BufferAttribute(new Float32Array(gc_ARC_SEGMENTS * 2), 2));
        ////        //16022025 }


        ////        let lo_segment_beg_point = new THREE.Vector2(pv_spline_offset_x, 0);

        ////        let lo_spline_group = new THREE.Group();
        ////        lo_spline_group.name = this.main.common_func.get_object_name(cv_spline_group_name_prefix, lo_spline_group);

        ////        let lo_segment_data;
        ////        let lar_spline_points = [];


        ////        //12022025 for (let lv_i = 0; lv_i < this.main.params.spline_amount_segments; lv_i++) {
        ////        for (let lv_i = 0; lv_i < pv_segments_in_spline; lv_i++) {

        ////            let lo_segment_group = new THREE.Group();
        ////            lo_segment_group.name = this.main.common_func.get_object_name(cv_segment_group_name_prefix, lo_segment_group);

        ////            let lv_segment_id = this.main.common_func.get_guid();

        ////            let lv_is_firs_segment;
        ////            if (lv_i == 0) {
        ////                lv_is_firs_segment = true;
        ////            }
        ////            else {
        ////                lv_is_firs_segment = false;
        ////            }

        ////            let lv_is_last_segment;
        ////            if (lv_i == this.main.params.spline_amount_segments - 1) {
        ////                lv_is_last_segment = true;
        ////            }
        ////            else {
        ////                lv_is_last_segment = false;
        ////            }


        ////            lo_segment_data = this.main.segments.create_segment(
        ////                lo_segment_group,
        ////                this.main.segment_transform_data,
        ////                lv_segment_id,// номер сегмента
        ////                lo_segment_beg_point,
        ////                lv_is_firs_segment, // признак первого сегмента
        ////                lv_is_last_segment  // признак последнего сегмента
        ////                /*pv_height_koef*/
        ////            );

        ////            lo_segment_beg_point = lo_segment_data.segment_beg_point;


        ////            this.draw_curve(lo_segment_group, lo_segment_data.points, cv_segment_name_prefix, false);


        ////            lar_spline_points.push(...lo_segment_data.points);
        ////            lo_spline_group.add(lo_segment_group);

        ////        }


        ////        this.draw_curve(lo_spline_group, lar_spline_points, cv_spline_name_prefix, true);

        ////        po_parent.add(lo_spline_group);


        ////    }

        ////    catch (e) {

        ////        alert('error create_spline: ' + e.stack);

        ////    }


        ////}



        //------------------------------------------------------------------------

        Splines.prototype.updateSplineOutline = function (po_spline) {

            //11062024 {
            //const ARC_SEGMENTS = 400;
            //const point = new THREE.Vector2();
            //31102024 var ARC_SEGMENTS = 400;
            var point = new THREE.Vector2();
            //11062024 }

            try {

                //for (const k in par_spline_poits) {

                ////const spline = par_spline_poits[k].spline;//@@@
                //////spline.closed = true;
                ////const splineMesh = spline.catmullrom.mesh;
                //const splineMesh = spline.QuadraticBezier.mesh;//08022024
                let position = po_spline.mesh.geometry.attributes.position;


                let lv_j = 0;

                for (let i = 0; i < gc_ARC_SEGMENTS; i++) {

                    const t = i / (gc_ARC_SEGMENTS - 1);
                    po_spline.getPoint(t, point);
                    //po_spline.catmullrom.getPoint(t, point);
                    //spline.QuadraticBezier.getPoint(t, point);//08022024
                    ////let lar_points = spline.QuadraticBezier.getPoints(ARC_SEGMENTS);

                    if (isNaN(point.x) || isNaN(point.y)) {
                        continue;
                    }

                    position.setXYZ(lv_j++, point.x, point.y, 0);

                }


                // Заполнеие последних элементов массива значением последней точки
                for (let i = lv_j; i < gc_ARC_SEGMENTS; i++) {
                    position.setXYZ(i, point.x, point.y, 0);
                }


                position.needsUpdate = true;

                //}
            }

            catch (e) {

                alert('error updateSplineOutline: ' + e.stack);

            }

        }


        //------------------------------------------------------------------------

        Splines.prototype.updateSplineOutline2 = function (po_object) {

            //11062024 {
            //const ARC_SEGMENTS = 400;
            //const point = new THREE.Vector2();
            //31102024 var ARC_SEGMENTS = 400;
            var point = new THREE.Vector2();
            //11062024 }

            try {



                //let position = po_object.mesh.geometry.attributes.position;
                let position = po_object.geometry.attributes.position;


                let lv_j = 0;

                for (let i = 0; i < gc_ARC_SEGMENTS; i++) {

                    const t = i / (gc_ARC_SEGMENTS - 1);
                    po_object.getPoint(t, point);
                    //po_spline.catmullrom.getPoint(t, point);
                    //spline.QuadraticBezier.getPoint(t, point);//08022024
                    ////let lar_points = spline.QuadraticBezier.getPoints(ARC_SEGMENTS);

                    if (isNaN(point.x) || isNaN(point.y)) {
                        continue;
                    }

                    position.setXYZ(lv_j++, point.x, point.y, 0);

                }


                // Заполнеие последних элементов массива значением последней точки
                for (let i = lv_j; i < gc_ARC_SEGMENTS; i++) {
                    position.setXYZ(i, point.x, point.y, 0);
                }


                position.needsUpdate = true;

                //}
            }

            catch (e) {

                alert('error updateSplineOutline: ' + e.stack);

            }

        }

        //-----------------------------------------------------------------

    } // (typeof this.create_spline !== "function")



    //---------------------------------------------------------------------

    ////////////////////////////////////this.create_spline();

}

// end Class Spline
//=====================================================================

