import * as THREE from 'three';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';



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

    this.group_rect = null;

    //this.cv_rectangle_name = "my_end_shape";

    //=====================================================================

    if (typeof this.create_end_shape != "function") {

        //----------------------------------------------------------
        // Методы
        //----------------------------------------------------------



        //------------------------------------------------------------------------
        EndShape.prototype.create_end_shape = function (po_is_use_data, po_sides_data) {

            ////const cv_rect_width = this.shape_width; 
            ////const cv_rect_height = this.shape_height; 

            try {

                //let lo_group = new THREE.Group();

                const lar_positions = [];
                lar_positions.push(0, 0, 0);
                lar_positions.push(0, this.main.shape_height, 0);
                lar_positions.push(this.main.shape_width, this.main.shape_height, 0);
                lar_positions.push(this.main.shape_width, 0, 0);
                lar_positions.push(0, 0, 0);


                let lv_color = 0x0040f0;
                let lv_x = 0; 
                let lv_y = 0;

                const clrs = [];

                lar_positions.forEach(() => {
                    clrs.push(255, 0, 255);
                });


                let geometry = new LineGeometry();

                geometry.setPositions(lar_positions);/////

                geometry.setColors(clrs);

                let resolution = new THREE.Vector2();

                let renderer = new THREE.WebGLRenderer({ /*antialias: true*/ });
                renderer.getSize(resolution);

                let material = new LineMaterial({
                    //color: new Color("#fff").getHex(),
                    vertexColors: 0xf0f, //VertexColors,
                    linewidth: 0.5, //1, //2,
                    resolution: resolution
                    //dashed: false, //true,
                    //gapSize: 0.75,
                    //dashScale: 1.5,
                    //dashSize: 1
                });

                material.needsUpdate = true;

                this.shape = new Line2(geometry, material);
                this.shape.computeLineDistances();
                ////lo_line.scale.set(1, 1, 1);

                this.shape.name = cv_rectangle_name;

                this.shape.position.set(lv_x, lv_y);//, 0 pv_z - 25);

                ////lo_group.add(this.shape);
                ////this.group_rect = lo_group;
                ////this.scene.add(lo_group);

                //////this.scene.add(this.shape);


                this.main.group_end_shape.add(this.shape);
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
