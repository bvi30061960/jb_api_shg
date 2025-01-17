import * as THREE from 'three';
//import * as THREE from "https://unpkg.com/three@v0.149.0/build/three.module.js"
//import { THREE } from "https://unpkg.com/three@v0.149.0/build/three.module.js"


////import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
////import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
////import { TransformControls } from 'three/addons/controls/TransformControls.js';

import {
	get_active_side_shape_generator,
	get_passive_side_shape_generator
} from './my_shape_generator.js';

import {
	struc_gabarits,
	struc_segment_transform_data,
	cv_spline_name_prefix,
	cv_segment_name_prefix
} from "./my_common_types.js";

import { CommonFunc } from './my_common_func.js';

//11062024 {
//var cv_node_diameter = 0.7;
//var cv_node_size = 2;
//11062024 }

//=============================================================================================

// Class Segment
export function Segments(
	po_main
	//pv_count_allsplines,
	//pv_count_allsegments,
	//pv_nspline,
	//pv_nsegment,
	//po_beg_point,
	//po_segment_transform_data
	//pv_is_move_mode
	/*, pv_kx, pv_ky*/
	//po_params
	) {

	var cv_node_diameter = 0.7;// 1.2;//04082024  0.9; // 0.7; размер точки выделенного сегмента
	var cv_node_size = 2; // 3; // 04082024 3; // 2;


	// Свойства
	//--------------------------------------------------------------------------------------------------

	this.main = po_main;
	this.params = po_main.params;

	this.circle_geometry = new THREE.CircleGeometry(cv_node_diameter);
	//09092024 this.square_geometry = new THREE.BoxGeometry(cv_node_size, cv_node_size*2, 0);
	this.square_geometry = new THREE.BoxGeometry(cv_node_size, cv_node_size*1.5, 0);// 09092024
	this.material = new THREE.MeshLambertMaterial({ color: 0x0000ff	/*//visible: true //false*/	});




	////this.nspline = pv_nspline;
	////this.nsegment = pv_nsegment;
	this.count_allsplines = null;// pv_count_allsplines;
	this.count_allsegments = null;// pv_count_allsegments;

	this.beg_point = null;// po_beg_point;
	//this.pv_kx = pv_kx;
	//this.pv_ky = pv_ky;

	////this.ar_segment_points = [];
	////this.ar_indices_segment_points = [];//  {nspline, nsegment_in_spline, npoint_in_segment, point }

	this.segment_transform_data = null; // po_segment_transform_data;

	/*//this.pv_is_move_mode = pv_is_move_mode;*/

	this.ar_initial_segment_points = [
		new THREE.Vector3(0, 0, 0),				// 0
		new THREE.Vector3(-1.08, 3.11, 0),		// 1
		new THREE.Vector3(-2.97, 4.59, 0), 		// 2
		new THREE.Vector3(-5.68, 3.51, 0),		// 3
		new THREE.Vector3(-6.76, 6.76, 0),		// 4
		new THREE.Vector3(-5.27, 9.59, 0),		// 5
		new THREE.Vector3(-1.62, 9.86, 0),		// 6
		new THREE.Vector3(3.11, 5.27, 0),		// 7
		new THREE.Vector3(5.81, 4.59, 0),		// 8
		new THREE.Vector3(6.62, 7.16, 0),		// 9
		new THREE.Vector3(3.51, 14.05, 0),		// 10
		new THREE.Vector3(6.08, 21.22, 0),		// 11
		new THREE.Vector3(5.54, 25.68, 0),		// 12
		new THREE.Vector3(2.3, 25.14, 0),		// 13
		new THREE.Vector3(-0.27, 17.16, 0),		// 14
		new THREE.Vector3(-2.43, 16.22, 0),		// 15
		new THREE.Vector3(-4.19, 18.11, 0),		// 16
		new THREE.Vector3(-3.78, 22.7, 0),		// 17
		new THREE.Vector3(-6.76, 27.03, 0),		// 18
		new THREE.Vector3(-5.14, 29.46, 0),		// 19
		new THREE.Vector3(-0.81, 27.57, 0),		// 20
		new THREE.Vector3(0.81, 29.73, 0),		// 21
		new THREE.Vector3(-0.68, 31.76, 0),		// 22
		new THREE.Vector3(0, 33.78, 0)			// 23		

	];
	//this.name_prefix = "segment";

	//=====================================================================

	if (typeof this.redraw_segment != "function") {
		//	return;
		//}

		//----------------------------------------------------------
		// Методы
		//----------------------------------------------------------

		//////Segment.prototype.recalc_segment_points = function () {

		//////	this.ar_segment_points.splice(0, this.ar_segment_points.length)
		//////	for (let i = 0; i < this.ar_initial_segment_points.length; i++) {
		//////		this.ar_segment_points.push(new THREE.Vector2(
		//////			(this.ar_initial_segment_points[i].x + this.beg_point.x) /** this.pv_kx*/,
		//////			(this.ar_initial_segment_points[i].y + this.beg_point.y) /** this.pv_ky*/
		//////		)
		//////		)

		//////	}

		/*//}*/


		//----------------------------------------------------------
		Segments.prototype.create_segment = function (
			po_parent,
			po_transform_data,
			pv_segment_id,
			po_beg_point,
			pv_is_first_segment, // признак первого сегмента
			pv_is_last_segment // признак последнего сегмента
			//09062024 pv_height_koef

		) {

			let lo_segment_beg_point;
			let lar_points = [];

			try {

				// Пропускаем формирование первого узла у не первых сегментов для предотвращения
				// дублирования
				////let lv_k_beg = 0;
				////if (pv_segment_number > 0) {
				////	lv_k_beg = 1;
				////}

				let lv_k_beg;

				if (pv_is_first_segment) {
					lv_k_beg = 0;
				}
				else {
					lv_k_beg = 1;
				}

				let lv_k_end = this.ar_initial_segment_points.length;

				//let lo_point = new THREE.Vector2();

				//for (let lv_k = 0; lv_k < lv_k_end; lv_k++) {
				for (let lv_k = lv_k_beg; lv_k < lv_k_end; lv_k++) { //22042024

    				////lo_point.draggable = true;

					let lo_node; // = new THREE.Vector2();

					////if ((pv_segment_number == 0 && lv_k == 0) || (pv_segment_number == this.main.params.spline_amount_segments - 1 && lv_k == this.ar_initial_segment_points.length - 1)) {
					////	lo_node = new THREE.Mesh(this.square_geometry, this.material);
					////}
					////else {
					////	lo_node = new THREE.Mesh(this.circle_geometry, this.material);
					////}

					if ((pv_is_first_segment == true && lv_k == 0) || (pv_is_last_segment == true && lv_k == this.ar_initial_segment_points.length - 1)) {
						lo_node = new THREE.Mesh(this.square_geometry, this.material);
					}
					else {
						lo_node = new THREE.Mesh(this.circle_geometry, this.material);
					}

					lo_node.position.x = this.ar_initial_segment_points[lv_k].x * po_transform_data.kx + po_beg_point.x;
					lo_node.position.y = this.ar_initial_segment_points[lv_k].y * po_transform_data.ky + po_beg_point.y;
					//lo_node.position.y = (this.ar_initial_segment_points[lv_k].y * po_transform_data.ky + po_beg_point.y) * pv_height_koef; //09062024

					//////03112024 {
					////// Запись максимальной координаты y сплайнов (длина модели)
					////if (lo_node.position.y > this.main.current_spline_max_y) {

					////	this.main.current_spline_max_y = lo_node.position.y;
					////}
					//////03112024 }



					lo_node.castShadow = true;
					lo_node.receiveShadow = true;

					lo_node.visible = false; // true;

					lo_node.userData = {
						nspline: po_parent.id, //lv_i,
						nsegment: pv_segment_id, //lv_j,
						npoint: lv_k
					};



					////this.splines_nodes.push(lo_node);

					//this.scene.add(lo_node);


					lo_segment_beg_point = new THREE.Vector2();
					if (lv_k == lv_k_end - 1) {

						lo_segment_beg_point.x = lo_node.position.x;
						lo_segment_beg_point.y = lo_node.position.y;

					}

					lo_node.renderOrder = 3;//04082024

					po_parent.add(lo_node);
					//17042024 lar_points.push(new THREE.Vector2(lo_node.position.x, lo_node.position.y));
					lar_points.push(new THREE.Vector3(lo_node.position.x, lo_node.position.y, 0));
				}// nodes


			}

			catch (e) {

				alert('error create_segment: ' + e.stack);

			}

			return {
				segment_beg_point: lo_segment_beg_point,
				points: lar_points
			}
		}



		//----------------------------------------------------------
		Segments.prototype.create_segment_by_data = function (
			po_parent,
			po_side_data,
			pv_curr_spline_number,
			/*po_transform_data,*/
			pv_segment_id,
			po_beg_point,
			pv_is_first_segment, // признак первого сегмента
			pv_is_last_segment, // признак последнего сегмента
			pv_beg_segment_node_numb,
			pv_end_segment_node_numb

		) {

			let lo_segment_beg_point;
			let lar_points = [];

			//let lo_active_side = get_active_side_shape_generator();

			try {

				let lv_k_beg;

				if (pv_is_first_segment) {
					//lv_k_beg = 0;
					lv_k_beg = pv_beg_segment_node_numb;

				}
				else {
					//lv_k_beg = 1;
					lv_k_beg = pv_beg_segment_node_numb + 1;
				}

				//01112024 let lv_k_end = this.ar_initial_segment_points.length;
				let lv_k_end = pv_end_segment_node_numb;

				for (let lv_k = lv_k_beg; lv_k <= lv_k_end; lv_k++) { //22042024

					let lo_node; // = new THREE.Vector2();

					//04112024 if ((pv_is_first_segment == true && lv_k == 0) || (pv_is_last_segment == true && lv_k == lv_k_end - 1)) {
					if ((pv_is_first_segment == true && lv_k == 0) || (pv_is_last_segment == true && lv_k == lv_k_end)) {  //04112024
						lo_node = new THREE.Mesh(this.square_geometry, this.material);
					}
					else {
						lo_node = new THREE.Mesh(this.circle_geometry, this.material);
					}

					//lo_node.position.x = this.ar_initial_segment_points[lv_k].x * po_transform_data.kx + po_beg_point.x;
					//lo_node.position.y = this.ar_initial_segment_points[lv_k].y * po_transform_data.ky + po_beg_point.y;

					lo_node.position.x = po_side_data.PointsCurves[pv_curr_spline_number][lv_k][0] + po_beg_point.x;
					lo_node.position.y = po_side_data.PointsCurves[pv_curr_spline_number][lv_k][1] + po_beg_point.y;

					//////03112024 {
					////// Запись максимальной координаты y сплайнов (длина модели)
					////if (lo_node.position.y > this.main.current_spline_max_y) {

					////	this.main.current_spline_max_y = lo_node.position.y;
					////}
					//////03112024 }


					lo_node.castShadow = true;
					lo_node.receiveShadow = true;

					lo_node.visible = false; // true;

					lo_node.userData = {
						nspline: po_parent.id, 
						nsegment: pv_segment_id, 
						npoint: lv_k
					};



					lo_segment_beg_point = new THREE.Vector2();
					if (lv_k == lv_k_end - 1) {

						lo_segment_beg_point.x = lo_node.position.x;
						lo_segment_beg_point.y = lo_node.position.y;

					}

					lo_node.renderOrder = 3;

					po_parent.add(lo_node);
					lar_points.push(new THREE.Vector3(lo_node.position.x, lo_node.position.y, 0));
				}// nodes


			}

			catch (e) {

				alert('error create_segment: ' + e.stack);

			}

			return {
				segment_beg_point: lo_segment_beg_point,
				points: lar_points
			}
		}


		//-----------------------------------------------------------------

		//Segment.prototype.create_segment_nodes = function (po_spline) {
		Segments.prototype.create_segment_nodes = function (
			po_parent,
			po_beg_point,
			po_transform_data)
		{

			////const lo_circle_geometry = new THREE.CircleGeometry(cv_node_diameter);
			////const lo_square_geometry = new THREE.BoxGeometry(cv_node_size, cv_node_size, 0);
			////const lo_material = new THREE.MeshLambertMaterial({
			////	color: 0x0000ff
			////	//visible: true //false
			////});


			////for (let lv_i = 0; lv_i < this.splines.length; lv_i++) {

			////	let lo_spline = this.splines[lv_i];

			/*//for (let lv_j = 0; lv_j < lo_spline.segments.length; lv_j++) {*/

			//let lo_segment = lo_spline.segments[lv_j];

			//for (let lv_k = 0; lv_k < lo_segment.ar_segment_points.length; lv_k++) {





			// Пропускаем формирование первого узла у не первых сегментов для предотвращения
			// дублирования
			let lv_k_beg = 0;
			if (this.nsegment > 0) {
				lv_k_beg = 1;
			}

			let lv_k_end = this.ar_initial_segment_points.length;



			for (let lv_k = 0; lv_k < this.ar_initial_segment_points.length; lv_k++) {

				//let lo_point = lo_segment.ar_segment_points[lv_k];

				let lo_node;

				//if ((lv_j == 0 && lv_k == 0) || (lv_j == lo_spline.segments.length - 1 && lv_k == lo_segment.ar_segment_points.length - 1)) {
				if ((lv_j == 0 && lv_k == 0) || (lv_j == this.main.params.spline_amount_segments - 1 && lv_k == this.ar_initial_segment_points.length - 1)) {
					lo_node = new THREE.Mesh(this.square_geometry, this.material);
				}
				else {
					lo_node = new THREE.Mesh(this.circle_geometry, this.material);
				}


				////lo_node.position.x = lo_point.x;
				////lo_node.position.y = lo_point.y;
				lo_node.position.x = this.ar_initial_segment_points.x;
				lo_node.position.y = this.ar_initial_segment_points.y;

				lo_node.castShadow = true;
				lo_node.receiveShadow = true;

				lo_node.visible = false;

				lo_node.userData = {
					nspline: po_parent.id, //lv_i,
					nsegment: lv_j,
					npoint: lv_k,
					point: lo_point,
					count_all_splines: this.shape_amount_curves,
					count_allsegments: this.spline_amount_segments,
					count_allpoints: lo_segment.ar_segment_points.length
				};



				////this.splines_nodes.push(lo_node);

				//this.scene.add(lo_node);

				lo_node.renderOrder = 3; //04082024
				this.parent.add(lo_node);

			}// nodes








			/*//}// segments*/

			/*//} // splines*/


		}



		//----------------------------------------------------------
		Segments.prototype.get_segment_size = function () {


			let lo_segment_size = new struc_gabarits();

			try {
				for (let lv_i = 0; lv_i < this.ar_initial_segment_points.length; lv_i++) {

					if (this.ar_initial_segment_points[lv_i].x < lo_segment_size.min.x) {
						lo_segment_size.min.x = this.ar_initial_segment_points[lv_i].x;
					}
					if (this.ar_initial_segment_points[lv_i].x > lo_segment_size.max.x) {
						lo_segment_size.max.x = this.ar_initial_segment_points[lv_i].x;
					}

					if (this.ar_initial_segment_points[lv_i].y < lo_segment_size.min.y) {
						lo_segment_size.min.y = this.ar_initial_segment_points[lv_i].y;
					}
					if (this.ar_initial_segment_points[lv_i].y > lo_segment_size.max.y) {
						lo_segment_size.max.y = this.ar_initial_segment_points[lv_i].y;
					}

				}

				lo_segment_size.width = lo_segment_size.max.x - lo_segment_size.min.x;
				lo_segment_size.height = lo_segment_size.max.y - lo_segment_size.min.y;

			}

			catch (e) {

				alert('error get_segment_size: ' + e.stack);

				return null;
			}


			return lo_segment_size;

		}

		//------------------------------------------------------------------------
		Segments.prototype.get_segment_transform_data = function (/*po_segment_size,*/ pv_ajust_curves_by_shape) {

			let lo_segment_size;
			let lo_segment;
			let lo_segment_transform_data;

			try {
				//02112024 {
				//////if (typeof (po_segment_size) == "undefined") {
				//////	po_segment_size = new Segments(1, 1, 1, 0, [0, 0]);

				lo_segment_size = this.get_segment_size();
				//////}
				//////else {

				//////	lo_segment_size = po_segment_size;
				//////}
				// 02112024 }

				lo_segment_transform_data = new struc_segment_transform_data();

				if (pv_ajust_curves_by_shape) {

					// x
					lo_segment_transform_data.kx = this.params.shape_width / ((lo_segment_size.width + this.params.shape_width * this.params.distance_between_curves_in_percent_of_width / 100) * this.params.shape_amount_curves);

					// y
					lo_segment_transform_data.ky = this.params.shape_height / (lo_segment_size.height * this.params.spline_amount_segments);


					// distance
					let lv_total_curves_width = lo_segment_size.width * lo_segment_transform_data.kx * this.params.shape_amount_curves;
					lo_segment_transform_data.distance_bt_x = this.params.distance_bt_curves;//12082024

					if (lo_segment_transform_data.distance_bt_x < 0) {
						lo_segment_transform_data.distance_bt_x = 0;
					}

				}

			}

			catch (e) {

				alert('error get_segment_transform_data: ' + e.stack);

			}

			return lo_segment_transform_data;
		}





	} //if (typeof this.redraw_segment !== "function")

	//----------------------------------------------------------

	////////this.create_segment();

}
// end Class Segment
//=====================================================================

