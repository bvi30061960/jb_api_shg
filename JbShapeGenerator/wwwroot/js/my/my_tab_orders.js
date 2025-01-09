//import * as THREE from 'three';
//import { Line2 } from 'three/addons/lines/Line2.js';
//import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
//import { LineGeometry } from 'three/addons/lines/LineGeometry.js';



import { Constants } from './my_common_const.js';
import {
    struc_gabarits,
    struc_segment_transform_data,
    cv_spline_name_prefix,
    cv_segment_name_prefix,

    typ_color_data,
    typ_side_data,
    typ_mesh_colors,
    type_rotate_mode,
    typ_sides_data,
    typ_parameters

} from "./my_common_types.js";

import { CommonFunc } from './my_common_func.js';


//==========================================================================================
// Class Tab_orders
export function Tab_orders(/*po_container, po_camera,po_scene,*/
    /*po_params*/ /*pv_shape_width, pv_shape_height*/
) {

    // Свойства
    ////0511204 this.container = po_container;
    ////0511204 this.camera = po_camera;
    //this.scene = po_scene;

    //////this.shape_width = po_params.shape_width;
    //////this.shape_height = po_params.shape_height;
    //this.shape_width = pv_shape_width;
    //this.shape_height = pv_shape_height;

    //this.shape;

    //this.group_rect = null;

    //this.cv_rectangle_name = "my_rectangle";

    //=====================================================================

    if (typeof this.init_tab_orders != "function") {

        //----------------------------------------------------------
        // Методы
        //----------------------------------------------------------



        //////Rectangle.prototype.create_rectangle = function () {


        //////	try {


        //////	}

        //////	catch (e) {

        //////		alert('error create_rectangle: ' + e.stack);

        //////	}


        //////}


        //------------------------------------------------------------------------
        Tab_orders.prototype.init_tab_orders = function (/*pv_distance_bt_curves*//*pv_shape_width, pv_shape_height*/) {

            ////const cv_rect_width = this.shape_width; 
            ////const cv_rect_height = this.shape_height; 

            try {

                ////let lo_group = new THREE.Group();

                //const positions = [];
                //positions.push(0, 0, 0);
                //////positions.push(0, cv_rect_height, 0);
                //////positions.push(cv_rect_width, cv_rect_height, 0);
                //////positions.push(cv_rect_width, 0, 0);
                //////positions.push(pv_shape_width, pv_shape_height, 0);
                //////positions.push(pv_shape_width, 0, 0);

                //positions.push(0, this.shape_height, 0);
                //positions.push(this.shape_width, this.shape_height, 0);
                //positions.push(this.shape_width, 0, 0);

                //positions.push(0, 0, 0);


                //let lv_color = 0x0040f0;
                //let lv_x = 0; //13032024  pv_distance_bt_curves/2;// / 2; // 0;
                //let lv_y = 0;

                //const clrs = [];

                //positions.forEach(() => {
                //    clrs.push(255, 0, 255);
                //});


                //let geometry = new LineGeometry();

                //geometry.setPositions(positions);/////

                //geometry.setColors(clrs);

                //let lo_resolution = new THREE.Vector2();
                //let lo_renderer = new THREE.WebGLRenderer({ /*antialias: true*/ });
                //lo_renderer.getSize(lo_resolution);

                //let material = new LineMaterial({
                //    //color: new Color("#fff").getHex(),
                //    vertexColors: 0xf0f, //VertexColors,
                //    linewidth: 0.5, //1, //2,
                //    resolution: lo_resolution
                //    //dashed: false, //true,
                //    //gapSize: 0.75,
                //    //dashScale: 1.5,
                //    //dashSize: 1
                //});

                //material.needsUpdate = true;

                //this.shape = new Line2(geometry, material);
                //this.shape.computeLineDistances();
                //////lo_line.scale.set(1, 1, 1);

                //this.shape.name = this.cv_rectangle_name;

                //this.shape.position.set(lv_x, lv_y);//, 0 pv_z - 25);

                //////lo_group.add(this.shape);
                //////this.group_rect = lo_group;
                //////this.scene.add(lo_group);

                //this.scene.add(this.shape);



                $("#id_but_model_download").on("click", this.onclick_but_model_download);



            }

            catch (e) {

                alert('error init_tab_orders: ' + e.stack);

            }

        }

        //-----------------------------------------------------------------

        Tab_orders.prototype.onclick_but_model_download = function (po_event) {


            try {

                //alert(po_event);

            }

            catch (e) {

                alert('error onclick_but_model_download: ' + e.stack);

            }
        }
        //-----------------------------------------------------------------


        //====================================================================
    }  // if (typeof this.create_rectangle !== "function")

    //====================================================================



    this.init_tab_orders();


}

// end Class Tab_orders
//=====================================================================