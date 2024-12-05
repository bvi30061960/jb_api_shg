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

                const cv_line_color = 0x0040f0;

                const positions = [];
                positions.push(0, 0, 0);
                //positions.push(0, this.main.params.shape_height, 0);
                positions.push(0, this.main.params.shape_width, 0);
                //positions.push(this.main.params.shape_width, this.main.params.shape_height, 0);
                positions.push(this.main.params.shape_width, this.main.params.shape_width, 0);
                positions.push(this.main.params.shape_width, 0, 0);
                positions.push(0, 0, 0);


                let lv_color = cv_line_color; // 0x0040f0;
                let lv_x = 0; 
                let lv_y = 0;

                const clrs = [];

                positions.forEach(() => {
                    clrs.push(255, 0, 255);
                });


                let geometry = new LineGeometry();

                geometry.setPositions(positions);/////
                geometry.setColors(clrs);

                let resolution = new THREE.Vector2();
                let renderer = new THREE.WebGLRenderer({ });
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

                this.shape.name = this.cv_rectangle_name;

                this.shape.position.set(lv_x, lv_y);

                this.main.group_end_shape.add(this.shape);





                let lv_curve_distance_hor = this.main.params.shape_width / (this.main.params.shape_amount_curves + 1);

                let lv_curve_distance_vert = this.main.params.shape_width / (this.main.params.shape_amount_curves + 1);



                var mat = new THREE.LineBasicMaterial({
                    color: cv_line_color //"yellow"
                });


                let line = null;
                let lo_geom = null;

                for (let lv_i = 0; lv_i < this.main.params.shape_amount_curves; lv_i++) {

                    lo_geom = new THREE.BufferGeometry().setFromPoints([
                        new THREE.Vector2(lv_curve_distance_hor * (lv_i + 1), 0),
                        new THREE.Vector2(lv_curve_distance_hor * (lv_i + 1), this.main.params.shape_width)
                    ]);

                    line = new THREE.LineSegments(lo_geom, mat);
                    this.main.group_end_shape.add(line);

                    lo_geom = new THREE.BufferGeometry().setFromPoints([
                        new THREE.Vector2(0, lv_curve_distance_hor * (lv_i + 1)),
                        new THREE.Vector2(this.main.params.shape_width, lv_curve_distance_hor * (lv_i + 1))
                    ]);

                    line = new THREE.LineSegments(lo_geom, mat);
                    this.main.group_end_shape.add(line);

                    //scene.add(line);

                }









                //let geometry = new THREE.SphereGeometry(20);
                //let material = new THREE.MeshPhongMaterial({ color: 0xff00ff, side: THREE.DoubleSide });

                //let sphere = null;
                //sphere = new THREE.Mesh(geometry, material);
                //sphere.position.x = 50;
                //sphere.position.y = 50;

                //this.main.group_end_shape.add(sphere);
                //this.main.group_end_shape.add(this.shape);
                ////this.main.scene.add(this.main.group_end_shape);
                //this.shape = sphere;

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
