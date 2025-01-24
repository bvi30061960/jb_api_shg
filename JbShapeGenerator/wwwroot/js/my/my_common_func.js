import * as THREE from 'three';
//import * as THREE from "https://unpkg.com/three@v0.149.0/build/three.module.js"
//import { THREE } from "https://unpkg.com/three@v0.149.0/build/three.module.js"

import { Line2 } from 'three/addons/lines/Line2.js';
//import { Line2 } from 'https://unpkg.com/three@v0.149.0/examples/jsm/lines/Line2.js';

import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
//import { LineMaterial } from 'https://unpkg.com/three@v0.149.0/examples/jsm/lines/LineMaterial.js';


import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
//import { LineGeometry } from 'https://unpkg.com/three@v0.149.0/examples/jsm/lines/LineGeometry.js';


//import { OBJExporter } from 'three/addons/exporters/OBJExporter.js';

import { STLExporter } from 'three/addons/exporters/STLExporter.js';
//import { STLExporter } from 'https://unpkg.com/three@v0.149.0/examples/jsm/exporters/STLExporter.js';




import { Constants } from './my_common_const.js';

import {
    get_active_side_shape_generator,
    get_passive_side_shape_generator,

    gc_id_prefix_up,
    gc_id_prefix_lateral,
    gc_id_prefix_end,

    go_up_side_shape_generator,
    go_lateral_side_shape_generator,
    go_end_side_shape_generator,

    //Shape_generator
} from './my_shape_generator.js';//27072024


import { Shapes } from './my_shapes.js';//27072024

import {
    typ_united_model_data,
    type_rotate_mode
} from './my_common_types.js';//2409202



var go_this = null;



// Class CommonFunc
export function CommonFunc() {

    // Свойства
    //	this.container = po_container;


    go_this = this;

    this.$dialog_question = $("#id_div_dialog_question");

    this.$dialog_message = $("#id_div_dialog_message");

    this.message_timeout = 1500;

    this.downloaded_filename = "";


    //const lo_link = document.createElement('a');
    //lo_link.style.display = 'none';
    //document.body.appendChild(lo_link);

    //=====================================================================

    if (typeof this.create_commonFunc != "function") {

        //----------------------------------------------------------
        // Методы
        //----------------------------------------------------------



        ////CommonFunc.prototype.create_commonFunc = function () {


        ////	try {


        ////	}

        ////	catch (e) {

        ////		alert('error create_commonFunc: ' + e);

        ////	}


        ////}
        //-----------------------------------------------------------------------------
        CommonFunc.prototype.init = function () {

            //-----------------------------------------------------------------------------

            this.$dialog_message.dialog({
                title: "Attention!",
                autoOpen: false,
                height: "auto", //100,
                open: this.on_open_dialog_message,
                buttons: {
                    "Close": function () {
                        $(this).dialog("close");
                    }
                },
                modal: true,
                resizable: false,
            });




            this.$dialog_question.dialog({
                title: "Attention!",
                autoOpen: false,
                height: "auto",

                ////buttons:
                ////	[
                ////		{
                ////			text: "Yes",
                ////			click: function () {
                ////				do_cancel_editing_row();
                ////				$(this).dialog("close");
                ////			}
                ////		},

                ////		{
                ////			text: "No",
                ////			click: function () { $(this).dialog("close"); }
                ////		}
                ////	],

                modal: true,
                resizable: false

            });
            //-------------------------------------------------------------------------------------------

        }

        //-----------------------------------------------------------------------------
        CommonFunc.prototype.recalc_coord_event2world = function (po_camera, po_container, pv_event_clientX, pv_event_clientY) {

            let lo_pos = null;

            let lv_moveMouse = new THREE.Vector2();

            try {

                const { top, left, width, height } = po_container.getBoundingClientRect();


                // пересчёт координат с учётом положения контейнера three.js
                lv_moveMouse.x = ((pv_event_clientX - left) / width) * 2 - 1;
                lv_moveMouse.y = - ((pv_event_clientY - top) / height) * 2 + 1;

                lo_pos = this.screenToWorld(

                    lv_moveMouse.x,
                    lv_moveMouse.y,

                    //20122024 {
                    //po_container.clientWidth,
                    //po_container.clientHeight,
                    //20122024 }

                    po_camera
                )




                return lo_pos;

            }

            catch (e) {

                alert('error screenToWorld: ' + e.stack);

            }


        }
        //---------------------------------------------------------------------------
        CommonFunc.prototype.screenToWorld = function (pv_x, pv_y, /* 20122024 pv_canvasWidth, pv_canvasHeight,*/ po_camera) {

            try {
                let lv_coords = new THREE.Vector3(pv_x, pv_y, 0);
                let lo_worldPosition = new THREE.Vector3();
                let lo_plane = new THREE.Plane(new THREE.Vector3());
                let lo_raycaster = new THREE.Raycaster();
                lo_raycaster.setFromCamera(lv_coords, po_camera);

                return lo_raycaster.ray.intersectPlane(lo_plane, lo_worldPosition);

            }

            catch (e) {

                alert('error screenToWorld: ' + e.stack);

            }


        }


        //----------------------------------------------------------------------------------
        // Remove all objects

        CommonFunc.prototype.removeObjectsWithChildren = function (po_obj, pv_is_removeFromParent) {

            if (po_obj.children.length > 0) {
                for (var x = po_obj.children.length - 1; x >= 0; x--) {
                    this.removeObjectsWithChildren(po_obj.children[x], true);
                }
            }

            if (po_obj.geometry) {
                po_obj.geometry.dispose();
            }

            if (po_obj.material) {

                if (po_obj.material.length) {
                    for (let i = 0; i < po_obj.material.length; ++i) {

                        if (po_obj.material[i].map) po_obj.material[i].map.dispose();
                        if (po_obj.material[i].lightMap) po_obj.material[i].lightMap.dispose();
                        if (po_obj.material[i].bumpMap) po_obj.material[i].bumpMap.dispose();
                        if (po_obj.material[i].normalMap) po_obj.material[i].normalMap.dispose();
                        if (po_obj.material[i].specularMap) po_obj.material[i].specularMap.dispose();
                        if (po_obj.material[i].envMap) po_obj.material[i].envMap.dispose();

                        po_obj.material[i].dispose()
                    }
                }
                else {
                    if (po_obj.material.map) po_obj.material.map.dispose();
                    if (po_obj.material.lightMap) po_obj.material.lightMap.dispose();
                    if (po_obj.material.bumpMap) po_obj.material.bumpMap.dispose();
                    if (po_obj.material.normalMap) po_obj.material.normalMap.dispose();
                    if (po_obj.material.specularMap) po_obj.material.specularMap.dispose();
                    if (po_obj.material.envMap) po_obj.material.envMap.dispose();

                    po_obj.material.dispose();
                }
            }

            if (pv_is_removeFromParent) {
                po_obj.removeFromParent();
            }

            po_obj = null;

            return true;
        }



        //------------------------------------------------------------------------
        CommonFunc.prototype.get_object_name = function (pv_prefix, po_group) {


            let lv_result = "";

            if (po_group) {

                if (po_group.id) {
                    lv_result = pv_prefix + "_" + po_group.id;
                }
                else {
                    if (po_group.mesh.id) {

                        lv_result = pv_prefix + "_" + po_group.mesh.id;

                    }

                }
            }

            return lv_result;
        }

        //------------------------------------------------------------------------
        CommonFunc.prototype.get_guid = function () {

            // from https://stackoverflow.com/questions/105034/how-do-i-create-a-guid-uuid

            //return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            return 'xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }



        //---------------------------------------------------------------------------------------------
        CommonFunc.prototype.show_question = function (pv_message, pv_callbackOk, pv_callbackNo, pv_callbackCancel) {

            var lv_dialog = this.$dialog_question;

            lv_dialog[0].innerText = pv_message;

            if (pv_callbackCancel == null) {

                lv_dialog.dialog("option", "buttons",
                    [
                        {
                            text: "Yes",
                            //icon: "ui-icon-check",
                            click: pv_callbackOk
                            //click: function () {
                            //    pv_callback_ok();
                            //    $(this).dialog("close");
                            //}
                        },
                        {
                            text: "No",
                            click: pv_callbackNo
                        }
                    ]
                );
            }
            else {

                lv_dialog.dialog("option", "buttons",
                    [
                        {
                            text: "Да",
                            //icon: "ui-icon-check",
                            click: pv_callbackOk
                            //click: function () {
                            //    pv_callback_ok();
                            //    $(this).dialog("close");
                            //}
                        },
                        {
                            text: "Нет",
                            click: pv_callbackNo
                        }
                        ,
                        {
                            text: "Отмена",
                            click: pv_callbackCancel
                        }
                    ]
                );
            }

            lv_dialog.dialog("open");

            return;
        }

        //------------------------------------------------------------------------
        CommonFunc.prototype.save_model = async function (po_sides_data, po_scene_mod) {


            try {
                this.showLoadingIndicator('Saving model..');

                let lo_active_side = get_active_side_shape_generator();

                ///////////////////23102024 let lv_url = "/Index?handler=SaveModel";

                let lo_exporter = new STLExporter();
                let lv_str_scene_mod_data = lo_exporter.parse(po_scene_mod);


                ////lv_str_scene_mod_data = lv_str_scene_mod_data.replace(/\n/g, '')  // удаление переноса строк
                ////lv_str_scene_mod_data = lv_str_scene_mod_data.replace(/\t/g, '')  // удаление переноса строк

                ////////////this.saveString(lv_str_scene_mod_data, 'my_model.stl');

                let lv_str_sides_data = JSON.stringify(po_sides_data);
                //this.send(lv_url, lv_str_sides_data);


                let lo_united_model_data = new typ_united_model_data();

                lo_united_model_data.model_name = $("#id_model_name")[0].value;
                lo_united_model_data.sides_data = lv_str_sides_data;
                lo_united_model_data.prev_model = lv_str_scene_mod_data;

                let lo_element1 = document.querySelector(lo_active_side.id_prefix + "id_div_visual_model");
                let lo_element2 = lo_element1.children[2];




                //22012025 {

                //this.get_screenshot(lo_element2, lo_united_model_data);

                let lv_url = "/Index?handler=SaveModel" + "&chdata=" + Math.random().toString();
                await this.get_screenshots(lv_url, lo_united_model_data);
                //22012025 }


            }

            catch (e) {

                alert('error save_model: ' + e.stack);

            }
        }



        //------------------------------------------------------------------------
        CommonFunc.prototype.get_screenshots = async function (pv_url, po_united_model_data) {

            try {

                // Заполнение массива экранными элементами
                let lar_screenshot_elements = [];

                //lar_screenshot_elements.push($("#id_div_visual_model")[2]);
                //lar_screenshot_elements.push($("#id_shape")[2]);

                let lo_active_side = get_active_side_shape_generator();

                //23012025 {
                //////let lo_element1 = document.querySelector(lo_active_side.id_prefix + "id_div_visual_model");
                //////let lo_element2 = lo_element1.children[2];
                //////lar_screenshot_elements.push(lo_element2);

                //////let lo_element3 = document.querySelector(lo_active_side.id_prefix + "id_shape");
                //////let lo_element4 = lo_element3.children[2];
                //////lar_screenshot_elements.push(lo_element4);

                //lar_screenshot_elements.push(lo_active_side.id_prefix_wo_sharp + "id_div_visual_model");
                //lar_screenshot_elements.push("#up_id_div_visual_model canvas");
                //lar_screenshot_elements.push(lo_active_side.id_prefix_wo_sharp + "id_shape");
                //lar_screenshot_elements.push("#up_id_shg_common canvas");
                lar_screenshot_elements.push("#up_id_shape canvas");
                lar_screenshot_elements.push("#up_id_div_visual_model canvas");

                //23012025 }





                // массив данных screenshots
                let lar_sreenshot_data = [/*lar_screenshot_elements.length*/];



                let lv_nstep = 0;

                //while (par_elements.length > 0) {

                /////////////////////////////await this.get_one_screenshot(pv_url, po_united_model_data, lv_nstep, lar_screenshot_elements, lar_sreenshot_data);

                //}

                ////po_united_model_data.screenshot = lar_sreenshot_data[0];
                ////po_united_model_data.up_side_screenshot = lar_sreenshot_data[1];



                ////let lv_str_united_model_data = JSON.stringify(po_united_model_data);

                ////this.send(pv_url, lv_str_united_model_data);








                let lv_dataURL = null;
                go_up_side_shape_generator.renderer.render(go_up_side_shape_generator.scene, go_up_side_shape_generator.camera);
                lv_dataURL = go_up_side_shape_generator.renderer.domElement.toDataURL('image/png');
                po_united_model_data.screenshot = lv_dataURL;

                go_up_side_shape_generator.renderer_mod.render(go_up_side_shape_generator.scene_mod, go_up_side_shape_generator.camera_mod);
                lv_dataURL = go_up_side_shape_generator.renderer_mod.domElement.toDataURL('image/png');
                po_united_model_data.up_side_screenshot = lv_dataURL;

                go_lateral_side_shape_generator.renderer.render(go_lateral_side_shape_generator.scene, go_lateral_side_shape_generator.camera);
                lv_dataURL = go_lateral_side_shape_generator.renderer.domElement.toDataURL('image/png');
                po_united_model_data.lat_side_screenshot = lv_dataURL;

                go_end_side_shape_generator.renderer.render(go_end_side_shape_generator.scene, go_end_side_shape_generator.camera);
                lv_dataURL = go_end_side_shape_generator.renderer.domElement.toDataURL('image/png');
                po_united_model_data.end_side_screenshot = lv_dataURL;



                //po_united_model_data.screenshot = par_sreenshot_data[1];
                //po_united_model_data.up_side_screenshot = par_sreenshot_data[0];



                let lv_str_united_model_data = JSON.stringify(po_united_model_data);
                this.send(pv_url, lv_str_united_model_data);











            }

            catch (e) {
                this.hideLoadingIndicator();
                alert('error get_screenshots: ' + e.stack);

            }

        }

        //////------------------------------------------------------------------------
        ////CommonFunc.prototype.get_one_screenshot = async function (pv_url, po_united_model_data, pv_nstep, par_screenshot_elements, par_sreenshot_data) {

        ////    try {

        ////        //23012025 {


        ////        ////if (par_screenshot_elements.length > 0) {



        ////        ////let lv_element = par_screenshot_elements.pop();

        ////        ////html2canvas(lv_element).then((po_canvas) => {

        ////        ////    par_sreenshot_data[pv_nstep++] = po_canvas.toDataURL('image/png');

        ////        ////    this.on_fillsreenshot(
        ////        ////        this.get_one_screenshot(pv_url, po_united_model_data, pv_nstep, par_screenshot_elements, par_sreenshot_data));

        ////        ////});



        ////        ////////requestAnimationFrame(() => {
        ////        //////for (let id of par_screenshot_elements) {


        ////        //////    //let element = document.getElementById(id /*par_screenshot_elements.pop()*/);
        ////        //////    //let element = $("#up_id_shg_common canvas")[0];
        ////        //////    //let element = $("#up_id_shape canvas")[0];

        ////        //////    var element = $(id)[0];

        ////        //////    //let canvas = null;
        ////        //////    //await requestAnimationFrame(() => {
        ////        //////    //    canvas = /*await*/ html2canvas(element);
        ////        //////    //    par_sreenshot_data.push(canvas.toDataURL('image/png'));
        ////        //////    //});




        ////        //////    ////let canvas = null;
        ////        //////    //await new Promise(resolve => {
        ////        //////    //    requestAnimationFrame(async () => {
        ////        //////    //        let canvas = await html2canvas(element);
        ////        //////    //        par_sreenshot_data.push(canvas.toDataURL('image/png'));
        ////        //////    //        resolve();
        ////        //////    //    });
        ////        //////    //});


        ////        //////    //await new Promise(resolve => {
        ////        //////    //    //requestAnimationFrame(async () => {
        ////        //////    //    let canvas = await html2canvas(element);

        ////        //////    //    renderer.render(scene, camera);
        ////        //////    //    const dataURL = renderer.domElement.toDataURL('image/png');

        ////        //////    //        par_sreenshot_data.push(canvas.toDataURL('image/png'));
        ////        //////    //        resolve();
        ////        //////    //    //});
        ////        //////    //});


        ////        //////}

        ////        //});

        ////        ////}
        ////        ////else {

        ////        //23012025 }


        ////        // Конец чтения screenshots


        ////        let dataURL = null;
        ////        //requestAnimationFrame(/*async*/() => {
        ////            go_up_side_shape_generator.renderer.render(go_up_side_shape_generator.scene, go_up_side_shape_generator.camera);
        ////            dataURL = go_up_side_shape_generator.renderer.domElement.toDataURL('image/png');
        ////        //});
        ////        par_sreenshot_data.push(dataURL);

        ////        //requestAnimationFrame(/*async*/() => {
        ////            go_up_side_shape_generator.renderer_mod.render(go_up_side_shape_generator.scene_mod, go_up_side_shape_generator.camera_mod);
        ////            dataURL = go_up_side_shape_generator.renderer_mod.domElement.toDataURL('image/png');
        ////        //});
        ////        par_sreenshot_data.push(dataURL);



        ////        po_united_model_data.screenshot = par_sreenshot_data[1];
        ////        po_united_model_data.up_side_screenshot = par_sreenshot_data[0];



        ////        let lv_str_united_model_data = JSON.stringify(po_united_model_data);
        ////        this.send(pv_url, lv_str_united_model_data);



        ////        ////}
        ////    }
        ////    catch (e) {

        ////        alert('error get_one_screenshot: ' + e.stack);

        ////    }
        ////}



        //22012025 }







        //------------------------------------------------------------------------
        CommonFunc.prototype.send = async function (pv_url, po_data_to_send/*, po_this*/) {

            try {

                let response = await fetch(pv_url, {
                    method: "POST",
                    headers: {
                        //"Accept": "application/json"
                        "Content-Type": "application/json"
                    },

                    body: po_data_to_send

                });

                //const message = await response.json();
                const message = await response.text();


                this.hideLoadingIndicator();

                let lo_active_side = get_active_side_shape_generator();

                let lv_modelname = $("#id_model_name").val();
                let lv_message_text = 'Model "' + lv_modelname + '" saved';
                lo_active_side.common_func.Show_message(lv_message_text, 2000);


            }

            catch (e) {

                this.hideLoadingIndicator();

                alert('error send: ' + e.stack);
            }
        }








        ////////////------------------------------------------------------------------------
        //////////CommonFunc.prototype.get_screenshot = function ($pv_element, po_united_model_data) {

        //////////    // Select the element that you want to capture
        //////////    //let captureElement = $pv_element;


        //////////    try {

        //////////        //21012025 {
        //////////        let lv_url = null; //21012025
        //////////        let lv_str_united_model_data = null;//21012025
        //////////        //21012025 }



        //////////        html2canvas($pv_element).then((po_canvas) => {

        //////////            po_united_model_data.screenshot = po_canvas.toDataURL(/*"image/png"*/)

        //////////            //21012025 {
        //////////            //let lv_url = "/Index?handler=SaveModel"; //21012025
        //////////            //let lv_str_united_model_data = JSON.stringify(po_united_model_data);//21012025
        //////////            lv_url = "/Index?handler=SaveModel" + "&chdata=" + Math.random().toString();
        //////////            lv_str_united_model_data = JSON.stringify(po_united_model_data);//21012025
        //////////            this.on_fillsreenshot(lv_url, lv_str_united_model_data /*po_united_model_data*/);
        //////////            //21012025 }

        //////////        });


        //////////        ////////html2canvas(captureElement/*.children()*/,
        //////////        ////////    {
        //////////        ////////        onrendered: function (canvas) {

        //////////        ////////            var lv_image = canvas.toDataURL();
        //////////        ////////            //if (lv_image.length > cv_ModelImage_length)
        //////////        ////////            po_united_model_data.screenshot = lv_image;
        //////////        ////////            this.on_fillsreenshot(po_united_model_data);

        //////////        ////////        }

        //////////        ////////    }
        //////////        ////////);

        //////////    }

        //////////    catch (e) {

        //////////        alert('error screenshot: ' + e.stack);

        //////////    }

        //////////}
        ////////////------------------------------------------------------------------------
        //////////CommonFunc.prototype.on_fillsreenshot = function (pv_url, pv_str_data /*po_united_model_data*/) {

        //////////    //let lv_url = "/Index?handler=SaveModel";
        //////////    //21012025 let lv_str_united_model_data = JSON.stringify(po_united_model_data);
        //////////    //21012025 this.send(lv_url, lv_str_united_model_data);

        //////////    this.send(pv_url, pv_str_data);

        //////////}





        //22012025 {



        //------------------------------------------------------------------------
        CommonFunc.prototype.make_model = function (po_sides_data, po_scene_mod) {


            let lv_url = "/Index?handler=SaveModel";

            let lo_exporter = new STLExporter();
            let lv_str_scene_mod_data = lo_exporter.parse(po_scene_mod);


            ////lv_str_scene_mod_data = lv_str_scene_mod_data.replace(/\n/g, '')  // удаление переноса строк
            ////lv_str_scene_mod_data = lv_str_scene_mod_data.replace(/\t/g, '')  // удаление переноса строк

            ////////////this.saveString(lv_str_scene_mod_data, 'my_model.stl');

            let lv_str_sides_data = JSON.stringify(po_sides_data);
            //this.send(lv_url, lv_str_sides_data);


            let lo_united_model_data = new typ_united_model_data();

            lo_united_model_data.model_name = $("#id_model_name")[0].value;
            lo_united_model_data.sides_data = lv_str_sides_data;
            lo_united_model_data.prev_model = lv_str_scene_mod_data;

            let lv_str_united_model_data = JSON.stringify(lo_united_model_data);


            //let lo_str_united_model_data = '{"sides_data":' + lv_str_sides_data + ',"prev_model":{"' + lv_str_scene_mod_data + '"}}';
            //let lo_str_united_model_data = lv_str_sides_data + "__@@@@__" + lv_str_scene_mod_data;



            this.send(lv_url, lv_str_united_model_data);


        }


        //////------------------------------------------------------------------------
        ////    CommonFunc.prototype.OnComple_save_model = function (po_data) {

        ////    let lo_active_side = get_active_side_shape_generator();


        ////    }

        //------------------------------------------------------------------------
        CommonFunc.prototype.onSuccessSaveModel = function (text, filename) {

            //alert("onSuccessSaveModel");

        }
        //------------------------------------------------------------------------
        CommonFunc.prototype.onErrorSaveModel = function (text, filename) {

            //alert("onErrorSaveModel");

        }

        //------------------------------------------------------------------------
        CommonFunc.prototype.saveString = function (text, filename) {

            this.save(new Blob([text], { type: 'text/plain' }), filename);

        }

        //------------------------------------------------------------------------
        CommonFunc.prototype.getLinePoints = function (po_line) {

            let lar_points = po_line.geometry.attributes.position.array;

            let lar_out_points = [];


            let lv_rest;

            let lv_point_x;
            let lv_point_y;
            let lo_point;

            for (let lv_i = 0; lv_i < lar_points.length; lv_i++) {

                lv_rest = lv_i % 3;

                switch (lv_rest) {
                    case 0:
                        lv_point_x = lar_points[lv_i];
                        break;
                    case 1:
                        lv_point_y = lar_points[lv_i];
                        break;

                    case 2:
                        let lo_point = new THREE.Vector2(lv_point_x, lv_point_y);
                        lar_out_points.push(lo_point);
                        break;
                }

            }

            return lar_out_points;
        }


        //------------------------------------------------------------------------

        CommonFunc.prototype.save = function (blob, filename) {

            //let lo_link = $("#id_anch_for_save_model");

            lo_link.href = URL.createObjectURL(blob);
            lo_link.download = filename;
            lo_link.click();




        }

        //	this.init();

        //------------------------------------------------------------------------
        CommonFunc.prototype.guiUpdateDisplay = function (po_gui) {

            for (var i in po_gui.controllers) {

                po_gui.controllers[i].updateDisplay();
            }

        }

        //-----------------------------------------------------------------------------------

        // Функция для получения габаритных координат прямоугольника
        CommonFunc.prototype.getBoundingBox = function (mesh) {

            const boundingBox = new THREE.Box3().setFromObject(mesh);

            const min = boundingBox.min;
            const max = boundingBox.max;

            return {
                min: {
                    x: min.x,
                    y: min.y,
                    z: min.z
                },
                max: {
                    x: max.x,
                    y: max.y,
                    z: max.z
                }
            };
        }


        //-----------------------------------------------------------------------------------
        // Проверка нахождения точки от мыши внутри прямоугольника
        CommonFunc.prototype.IsInsideRectangle = function (po_event, po_rectangle) {

            let lv_result = false;


            let lo_line_to_right;
            let lo_line_to_left;
            let lo_line_to_up;
            let lo_line_to_down;

            try {

                let lo_active_side = get_active_side_shape_generator();

                let lo_container = lo_active_side.container;

                let lo_pos = this.recalc_coord_event2world(lo_active_side.camera, lo_container, po_event.clientX, po_event.clientY);

                const lc_endline_right_x = 1000;
                const lc_endline_left_x = -1000;
                const lc_endline_up_y = 1000;
                const lc_endline_down_y = -1000;


                let lo_pos_plane = new THREE.Vector2(lo_pos.x, lo_pos.y);

                const lo_material = new THREE.LineBasicMaterial();

                let lar_points = [];

                // Line from mouse point to right
                lar_points.push(new THREE.Vector2(lo_pos_plane.x, lo_pos_plane.y));
                lar_points.push(new THREE.Vector2(lc_endline_right_x, lo_pos.y));
                let lo_geometry = new THREE.BufferGeometry().setFromPoints(lar_points);
                lo_line_to_right = new THREE.Line(lo_geometry, lo_material);
                //lo_active_side.scene.add(lo_line_to_right);

                // Line from mouse point to left
                lar_points = [];
                lar_points.push(new THREE.Vector2(lo_pos_plane.x, lo_pos_plane.y));
                lar_points.push(new THREE.Vector2(lc_endline_left_x, lo_pos.y));
                lo_geometry = new THREE.BufferGeometry().setFromPoints(lar_points);
                lo_line_to_left = new THREE.Line(lo_geometry, lo_material);
                //lo_active_side.scene.add(lo_line_to_left);

                // Line from mouse point to up
                lar_points = [];
                lar_points.push(new THREE.Vector2(lo_pos_plane.x, lo_pos_plane.y));
                lar_points.push(new THREE.Vector2(lo_pos_plane.x, lc_endline_up_y));
                lo_geometry = new THREE.BufferGeometry().setFromPoints(lar_points);
                lo_line_to_up = new THREE.Line(lo_geometry, lo_material);
                //lo_active_side.scene.add(lo_line_to_up);

                // Line from mouse point to down
                lar_points = [];
                lar_points.push(new THREE.Vector2(lo_pos_plane.x, lo_pos_plane.y));
                lar_points.push(new THREE.Vector2(lo_pos_plane.x, lc_endline_down_y));
                lo_geometry = new THREE.BufferGeometry().setFromPoints(lar_points);
                lo_line_to_down = new THREE.Line(lo_geometry, lo_material);
                //lo_active_side.scene.add(lo_line_to_down);

                //13122024 {
                ////let lo_intersect_to_right_object = lo_active_side.shapes.GetTwoShapeIntersect(lo_line_to_right, po_rectangle.shape);
                ////let lo_intersect_to_left_object = lo_active_side.shapes.GetTwoShapeIntersect(lo_line_to_left, po_rectangle.shape);
                ////let lo_intersect_to_up_object = lo_active_side.shapes.GetTwoShapeIntersect(lo_line_to_up, po_rectangle.shape);
                ////let lo_intersect_to_down_object = lo_active_side.shapes.GetTwoShapeIntersect(lo_line_to_down, po_rectangle.shape);


                let lo_intersect_to_right_object = lo_active_side.common_func.GetTwoShapeIntersect(lo_line_to_right, po_rectangle);
                let lo_intersect_to_left_object = lo_active_side.common_func.GetTwoShapeIntersect(lo_line_to_left, po_rectangle);
                let lo_intersect_to_up_object = lo_active_side.common_func.GetTwoShapeIntersect(lo_line_to_up, po_rectangle);
                let lo_intersect_to_down_object = lo_active_side.common_func.GetTwoShapeIntersect(lo_line_to_down, po_rectangle);


                //13122024 }


                if (lo_intersect_to_right_object
                    && lo_intersect_to_left_object
                    && lo_intersect_to_up_object
                    && lo_intersect_to_down_object
                ) {

                    lv_result = true;
                }

            }

            catch (e) {
                alert('error IsInsideRectangle: ' + e.stack);
            }

            //alert(lv_result);

            return lv_result;
        }



        //-----------------------------------------------------------------------------------
        // Сортировка массива по указанному свойству
        CommonFunc.prototype.sortByProperty = function (par_array, pv_property) {

            return par_array.sort((a, b) => {
                if (a[pv_property] < b[pv_property]) {
                    return -1;
                }
                else {
                    if (a[pv_property] > b[pv_property]) {
                        return 1;
                    }
                    else {
                        return 0;
                    }
                }
            }
            );
        }


        //-----------------------------------------------------------------------------------
        // Чтение сплайна по номеру в массиве
        CommonFunc.prototype.getSplineByNumber = function (par_array, pv_elem_number) {

            let pv_return = null;

            while (true) {
                if (par_array == null || pv_elem_number == null) {
                    break;
                }
                if (pv_elem_number < 0 || pv_elem_number >= par_array.length) {
                    break;
                }

                pv_return = par_array[pv_elem_number].spline;

                break;
            }

            return pv_return;
        }

        //-----------------------------------------------------------------------------------
        // Функция для преобразования RGB в число
        CommonFunc.prototype.rgbToNumber = function (pv_rgb) {

            let lo_rgb = this.extractRGBComponents(pv_rgb);

            // Преобразование каждого значения в шестнадцатеричный формат и объединение в строку
            let lv_result = ((1 << 24) + (lo_rgb.r << 16) + (lo_rgb.g << 8) + lo_rgb.b).toString(16).slice(1).toUpperCase();

            // Перевод в десятичную систему
            lv_result = parseInt(lv_result, 16);

            return lv_result;
        }

        //-----------------------------------------------------------------------------------
        // Извлечение трёх чисел из строки "rgb(a,b,c)"
        CommonFunc.prototype.extractRGBComponents = function (rgbString) {


            try {
                // Используем регулярное выражение для извлечения чисел
                const regex = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/;
                const result = rgbString.match(regex);

                if (result) {
                    // Преобразуем извлеченные строки в числа и возвращаем их
                    const r = parseInt(result[1], 10);
                    const g = parseInt(result[2], 10);
                    const b = parseInt(result[3], 10);
                    return { r, g, b };
                } else {

                    throw new Error("Invalid RGB string format");
                }


            }

            catch (e) {

                alert('error extractRGBComponents: ' + e.stack);

            }

        }


        //-----------------------------------------------------------------------------------
        // Чтение номера сплайна в массиве 
        CommonFunc.prototype.getNumberBySpline = function (par_array, po_spline) {

            let pv_return = null;

            while (true) {
                if (!par_array || !po_spline) {
                    break;
                }


                for (let lv_i = 0; lv_i < par_array.length; ++lv_i) {

                    if (par_array[lv_i].spline == po_spline) {

                        pv_return = lv_i;
                        break;
                    }
                }


                break;
            }

            return pv_return;
        }



        //-----------------------------------------------------------------------------------
        // Функция для обработки изменений
        CommonFunc.prototype.handleColorChange = function (par_mutationsList, po_observer/*, pf_callback*/) {

            //let a = 2;

            for (let mutation of par_mutationsList) {

                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const lo_targetElement = mutation.target;
                    const lv_newColor = window.getComputedStyle(lo_targetElement).backgroundColor;

                    //pf_callback(lv_newColor);
                    ///////alert('Color= ' + lv_newColor);

                    //if (pf_callback) {
                    //	pf_callback(lo_targetElement, lv_newColor);
                    //}

                    //console.log(`Цвет элемента изменен на: ${newColor}`);

                    let lo_active_side = get_active_side_shape_generator();
                    lo_active_side.onColorChange(lv_newColor);
                    break;

                }
            }
        }

        ////// Целевой элемент, за которым нужно следить
        ////const targetElement = document.getElementById('myElement');

        ////// Создание экземпляра MutationObserver
        ////const observer = new MutationObserver(this.handleColorChange);

        ////// Параметры наблюдения
        ////const config = { attributes: true, attributeFilter: ['style'] };

        ////// Начало наблюдения за целевым элементом
        ////observer.observe(targetElement, config);

        //// Пример изменения цвета элемента
        //targetElement.style.backgroundColor = 'red';
        //}


        //------------------------------------------------------------------------
        CommonFunc.prototype.clearScene = function (po_scene, pv_nodelete_type) {

            // Очистка сцены

            let lv_beg = po_scene.children.length - 1;
            let lv_end = 0;

            for (let lv_i = lv_beg; lv_i >= 0; lv_i--) {

                if (pv_nodelete_type) {
                    //if (po_scene.children[lv_i].type !== pv_nodelete_type) {
                    if (!pv_nodelete_type.includes(po_scene.children[lv_i].type)) {
                        this.removeObjectsWithChildren(po_scene.children[lv_i], true);
                    }
                }
                else {
                    this.removeObjectsWithChildren(po_scene.children[lv_i], true);
                }
            }

        }
        //------------------------------------------------------------------------

        //======================================================================================
        CommonFunc.prototype.set_group_to_center = function (po_group) {

            // from http://stackoverflow.com/questions/28848863/threejs-how-to-rotate-around-objects-own-center-instead-of-world-center

            let objBbox = new THREE.Box3().setFromObject(po_group);

            // Geometry vertices centering to world axis
            ///////var bboxCenter = objBbox.getCenter().clone();


            let lo_center = new THREE.Vector3(0, 0, 0);

            objBbox.getCenter(lo_center);//
            var bboxCenter = lo_center.clone();//

            bboxCenter.multiplyScalar(-1);

            po_group.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.geometry.translate(bboxCenter.x, bboxCenter.y, bboxCenter.z);
                }
            });

            ///////////////////////objBbox.setFromObject(po_group); // Update the bounding box


        }

        //------------------------------------------------------------------------
        CommonFunc.prototype.move_details_from_to_center = function (po_group, pv_slider_value) {

            let lv_koef = 1;

            var Obj = null;
            //if (!po_group || pv_delta_slider_value == 0) {
            if (!po_group) {
                return;
            }


            try {

                let lo_active_side = get_active_side_shape_generator();


                for (var lv_i = 0; lv_i < po_group.children.length; lv_i++) {

                    Obj = po_group.children[lv_i];

                    if (Obj instanceof THREE.Mesh) {

                        let lo_part_box = new THREE.Box3().setFromObject(Obj);


                        let lo_gabarits_obj = lo_active_side.model_parts_positions[lv_i];


                        let posx = 0;
                        let posz = 0;

                        let lv_minx = lo_gabarits_obj.min.x;
                        let lv_center_x = (lo_gabarits_obj.max.x + lo_gabarits_obj.min.x) / 2;


                        let lv_minz = lo_gabarits_obj.min.z;
                        let lv_center_z = (lo_gabarits_obj.max.z + lo_gabarits_obj.min.z) / 2;


                        posx = (lv_center_x / 5) * pv_slider_value * lv_koef;
                        posz = (lv_center_z / 5) * pv_slider_value * lv_koef;


                        Obj.position.set(
                            posx,
                            0,
                            posz
                        );
                    }
                }


                ////this.set_group_to_center(po_group);

            }

            catch (e) {

                //alert('error extractRGBComponents: ' + e.stack);

            }


        }


        //------------------------------------------------------------------------
        CommonFunc.prototype.clear_group_childrens = function (po_group) {

            if (!po_group) {
                return;
            }

            //29102024 let lo_active_side = get_active_side_shape_generator();


            try {

                //for (var lv_i = 0; lv_i < po_group.children.length; lv_i++) {
                for (var lv_i = po_group.children.length - 1; lv_i >= 0; lv_i--) {

                    this.removeObjectsWithChildren(po_group.children[lv_i], true);

                }

            }
            catch (e) {

                alert('error clear_group_childrens: ' + e.stack);

            }


        }

        //------------------------------------------------------------------------
        CommonFunc.prototype.model_rotation = function (po_group) {

            let lo_active_side = get_active_side_shape_generator();

            if (lo_active_side.my_prefix != gc_id_prefix_end) { // 06122024


                if (lo_active_side.rotate_status == type_rotate_mode.None) {
                    return;
                }

                var lv_delta_rotation = this.get_delta_rotation(lo_active_side.rotate_status);

                po_group.rotation.y += lv_delta_rotation;

            }

        }
        //------------------------------------------------------------------------
        CommonFunc.prototype.check_file_exist_on_server = function (pv_filename, pf_callback) {

            let lv_url = "/Index?handler=" + Constants.method_check_file_exist_on_server + "&filename=" + pv_filename;


            get_check_file_exist_on_server(lv_url, pf_callback);
            //--------------------------------------------------
            async function get_check_file_exist_on_server(pv_url, pf_callback) {

                try {

                    //await $.get(pv_url, "", go_this.oncomplete_check_file_exist_on_server);
                    await $.get(pv_url, "", pf_callback);

                }

                catch (e) {

                    alert('error get_read_model_from_server: ' + e.stack);

                }

            }

        }


        //////------------------------------------------------------------------------------------------
        ////GridSelectModels.prototype.oncomplete_check_file_exist_on_server = function (po_data) {

        ////    try {

        ////        let lo_active_side = get_active_side_shape_generator();


        ////    }

        ////    catch (e) {

        ////        alert('error oncomplete_check_file_exist_on_server: ' + e.stack);

        ////    }


        ////}





















        //------------------------------------------------------------------------
        CommonFunc.prototype.get_delta_rotation = function (pv_rotate_status) {

            let lv_delta_rotation = 0;

            switch (pv_rotate_status) {
                //case type_rotate_mode.None:
                case type_rotate_mode.stop:
                case type_rotate_mode.stop2:
                    lv_delta_rotation = 0.0;
                    break;

                case type_rotate_mode.clockwise:
                    lv_delta_rotation = -0.01;
                    break;
                case type_rotate_mode.counterclockwise:
                    lv_delta_rotation = +0.01;
                    break;

            }

            return lv_delta_rotation;

        }



        //============================================================================================

        ////CommonFunc.prototype.fitCameraToObject = function (scene, camera, object, offset, controls) {

        ////	offset = offset || 1.25;

        ////	const boundingBox = new THREE.Box3();

        ////	// get bounding box of object - this will be used to setup controls and camera
        ////	boundingBox.setFromObject(object);

        ////	let center = new THREE.Vector3(/*0, 1, 0*/);

        ////	//const center = boundingBox.getCenter();
        ////	boundingBox.getCenter(center);

        ////	let size = new THREE.Vector3();
        ////	//const size = boundingBox.getSize();
        ////	boundingBox.getSize(size);

        ////	// get the max side of the bounding box (fits to width OR height as needed )
        ////	const maxDim = Math.max(size.x, size.y, size.z);
        ////	const fov = camera.fov * (Math.PI / 180);
        ////	let cameraZ = Math.abs(maxDim / 2 * Math.tan(fov * 2)); //Applied fifonik correction

        ////	cameraZ *= offset; // zoom out a little so that objects don't fill the screen

        ////	// <--- NEW CODE
        ////	//Method 1 to get object's world position
        ////	scene.updateMatrixWorld(); //Update world positions
        ////	var objectWorldPosition = new THREE.Vector3();
        ////	objectWorldPosition.setFromMatrixPosition(object.matrixWorld);

        ////	//Method 2 to get object's world position
        ////	//objectWorldPosition = object.getWorldPosition();

        ////	const directionVector = camera.position.sub(objectWorldPosition); 	//Get vector from camera to object
        ////	const unitDirectionVector = directionVector.normalize(); // Convert to unit vector

        ////	// bvi {
        ////	var lv_pos = new THREE.Vector3();

        ////	lv_pos = unitDirectionVector.multiplyScalar(cameraZ); //Multiply unit vector times cameraZ distance
        ////	//camera.position = unitDirectionVector.multiplyScalar(cameraZ); //Multiply unit vector times cameraZ distance
        ////	camera.position.x = lv_pos.x;
        ////	camera.position.y = lv_pos.y;
        ////	camera.position.z = lv_pos.z;
        ////	// bvi }


        ////	camera.lookAt(objectWorldPosition); //Look at object
        ////	// --->

        ////	const minZ = boundingBox.min.z;
        ////	const cameraToFarEdge = (minZ < 0) ? -minZ + cameraZ : cameraZ - minZ;

        ////	camera.far = cameraToFarEdge * 3;
        ////	camera.updateProjectionMatrix();

        ////	if (controls) {

        ////		// set camera to rotate around center of loaded object
        ////		controls.target = center;

        ////		// prevent camera from zooming out far enough to create far plane cutoff
        ////		controls.maxDistance = cameraToFarEdge * 2;

        ////		controls.saveState();

        ////	} else {

        ////		camera.lookAt(center)

        ////	}
        ////}


        //--------------------------------------------------------------------------------------

        ////CommonFunc.prototype.fitCameraToCenteredObject = function (camera, object, offset, orbitControls) {
        ////	const boundingBox = new THREE.Box3();
        ////	boundingBox.setFromObject(object);

        ////	var middle = new THREE.Vector3();
        ////	var size = new THREE.Vector3();
        ////	boundingBox.getSize(size);

        ////	// figure out how to fit the box in the view:
        ////	// 1. figure out horizontal FOV (on non-1.0 aspects)
        ////	// 2. figure out distance from the object in X and Y planes
        ////	// 3. select the max distance (to fit both sides in)
        ////	//
        ////	// The reason is as follows:
        ////	//
        ////	// Imagine a bounding box (BB) is centered at (0,0,0).
        ////	// Camera has vertical FOV (camera.fov) and horizontal FOV
        ////	// (camera.fov scaled by aspect, see fovh below)
        ////	//
        ////	// Therefore if you want to put the entire object into the field of view,
        ////	// you have to compute the distance as: z/2 (half of Z size of the BB
        ////	// protruding towards us) plus for both X and Y size of BB you have to
        ////	// figure out the distance created by the appropriate FOV.
        ////	//
        ////	// The FOV is always a triangle:
        ////	//
        ////	//  (size/2)
        ////	// +--------+
        ////	// |       /
        ////	// |      /
        ////	// |     /
        ////	// | F° /
        ////	// |   /
        ////	// |  /
        ////	// | /
        ////	// |/
        ////	//
        ////	// F° is half of respective FOV, so to compute the distance (the length
        ////	// of the straight line) one has to: `size/2 / Math.tan(F)`.
        ////	//
        ////	// FTR, from https://threejs.org/docs/#api/en/cameras/PerspectiveCamera
        ////	// the camera.fov is the vertical FOV.

        ////	const fov = camera.fov * (Math.PI / 180);
        ////	const fovh = 2 * Math.atan(Math.tan(fov / 2) * camera.aspect);
        ////	let dx = size.z / 2 + Math.abs(size.x / 2 / Math.tan(fovh / 2));
        ////	let dy = size.z / 2 + Math.abs(size.y / 2 / Math.tan(fov / 2));
        ////	let cameraZ = Math.max(dx, dy);

        ////	// offset the camera, if desired (to avoid filling the whole canvas)
        ////	if (offset !== undefined && offset !== 0) cameraZ *= offset;

        ////	camera.position.set(0, 0, cameraZ);

        ////	// set the far plane of the camera so that it easily encompasses the whole object
        ////	const minZ = boundingBox.min.z;
        ////	const cameraToFarEdge = (minZ < 0) ? -minZ + cameraZ : cameraZ - minZ;

        ////	camera.far = cameraToFarEdge * 3;
        ////	camera.updateProjectionMatrix();

        ////	////if (orbitControls !== undefined) {
        ////	////	// set camera to rotate around the center
        ////	////	orbitControls.target = new THREE.Vector3(0, 0, 0);

        ////	////	// prevent camera from zooming out far enough to create far plane cutoff
        ////	////	orbitControls.maxDistance = cameraToFarEdge * 2;
        ////	////}
        ////};


        //////CommonFunc.prototype.fitCameraToObject = function (camera, object, offset, controls) {

        //////	offset = offset || 1.25;

        //////	const boundingBox = new THREE.Box3();

        //////	// get bounding box of object - this will be used to setup controls and camera
        //////	boundingBox.setFromObject(object);

        //////	//const center = boundingBox.getCenter();
        //////	let center = new THREE.Vector3();
        //////	boundingBox.getCenter(center);

        //////	//const size = boundingBox.getSize();
        //////	let size = new THREE.Vector3();
        //////	//const size = boundingBox.getSize();
        //////	boundingBox.getSize(size);

        //////	// get the max side of the bounding box (fits to width OR height as needed )
        //////	const maxDim = Math.max(size.x, size.y, size.z);
        //////	const fov = camera.fov * (Math.PI / 180);
        //////	let cameraZ = Math.abs(maxDim / 4 * Math.tan(fov * 2));


        //////	cameraZ = 100;// bvi



        //////	////////////////cameraZ *= offset; // zoom out a little so that objects don't fill the screen

        //////	////////////////camera.position.z = cameraZ;

        //////	const minZ = boundingBox.min.z;
        //////	const cameraToFarEdge = (minZ < 0) ? -minZ + cameraZ : cameraZ - minZ;

        //////	//bvi camera.far = cameraToFarEdge * 3;

        //////	camera.far = cameraToFarEdge * 10;// bvi


        //////	camera.updateProjectionMatrix();

        //////	if (controls) {

        //////		// set camera to rotate around center of loaded object
        //////		controls.target = center;

        //////		// prevent camera from zooming out far enough to create far plane cutoff
        //////		controls.maxDistance = cameraToFarEdge * 2;

        //////		controls.saveState();

        //////	} else {

        //////		camera.lookAt(center)

        //////	}
        //////}



        //------------------------------------------------------------------------
        CommonFunc.prototype.build_scenes_by_sides_data = function (po_sides_data) {

            //---------------------------------------------------------------------------
            // test data {
            //let lo_active_side_shape_generator = get_active_side_shape_generator();
            //let lo_passive_side_shape_generator = get_passive_side_shape_generator();

            //let lo_sides_data = lo_active_side_shape_generator.read_model_sides_data();
            // test data }
            //---------------------------------------------------------------------------


            ////this.clearScene(lo_active_side_shape_generator.scene);
            ////this.clearScene(lo_passive_side_shape_generator.scene);


        }




        //---------------------------------------------------------------------------------------------
        CommonFunc.prototype.Show_message = function (pv_message, pv_timeout) {

            var lv_message_timeout;

            if (typeof (pv_timeout) == "undefined") {

                lv_message_timeout = Constants.timeout_dialog_message_ms;
            }
            else {
                lv_message_timeout = pv_timeout;

            }

            this.set_message_timeout(lv_message_timeout);

            Constants.div_dialog_message[0].innerText = pv_message;
            Constants.div_dialog_message.dialog("open");

        }
        //---------------------------------------------------------------------------------------------
        CommonFunc.prototype.set_message_timeout = function (pv_timeout) {
            //14012025 this.message_timeout = pv_timeout;
            go_this.message_timeout = pv_timeout;//14012025 
        }

        //---------------------------------------------------------------------------------------------
        CommonFunc.prototype.get_message_timeout = function () {
            //14012025 return this.message_timeout;
            return go_this.message_timeout; //14012025
        }

        //========================================================================================================

        CommonFunc.prototype.on_open_dialog_message = function () {

            //let lo_active_side = get_active_side_shape_generator();

            //var lv_timeout = lo_active_side.common_func.get_message_timeout();///
            var lv_timeout = go_this.get_message_timeout();///

            setTimeout(
                function () {
                    ///setTimeout(function () {
                    /// //lc_div_dialog_feedback.dialog("close");
                    Constants.div_dialog_message.dialog("close");
                    ///}, 1500)

                }, lv_timeout)

        }


        //---------------------------------------------------------------------------------------------
        CommonFunc.prototype.get_random_number_int = function (pv_min, pv_max) {

            let lv_number_dec = (pv_max - pv_min + 1) * Math.random() + pv_min;
            let lv_number_int = Math.floor(lv_number_dec);

            return lv_number_int;
        }


        //---------------------------------------------------------------------------------------------
        CommonFunc.prototype.get_drawing_rectangle = function (pv_width, pv_height, pv_color, po_material) {

            let lo_result = null;
            let lo_renderer = null;
            let lo_material = null;
            let lv_color = null;

            try {
                if (pv_color) {
                    lv_color = pv_color;
                }
                else {
                    lv_color = Constants.shape_countour_color;
                }


                if (po_material) {
                    lo_material = po_material;
                }
                else {

                    lo_renderer = new THREE.WebGLRenderer({});
                    let lo_resolution = new THREE.Vector2();
                    lo_renderer.getSize(lo_resolution);

                    lo_material = new LineMaterial({
                        resolution: lo_resolution,
                        linewidth: 0.7,
                        color: lv_color
                    });
                }

                let lo_geometry = new LineGeometry();
                lo_geometry.setPositions([
                    //11012025 {
                    ////0, 0, 0,
                    ////0, pv_width, 0,
                    ////pv_height, pv_width, 0,
                    ////pv_height, 0, 0,
                    ////0, 0, 0

                    0, 0, 0,
                    0, pv_height, 0,
                    pv_width, pv_height, 0,
                    pv_width, 0, 0,
                    0, 0, 0
                    //11012025 }
                ]);

                lo_result = new Line2(lo_geometry, lo_material);

                return lo_result;

            }

            catch (e) {

                alert('error get_drawing_rectangle: ' + e.stack);

            }
        }



        //---------------------------------------------------------------------------------------------
        CommonFunc.prototype.get_drawing_rectangle_by_points = function (po_left_bottom, po_right_top, pv_color, po_material,
            pv_delta
            //pv_delta_y

        ) {

            let lo_result = null;
            let lo_renderer = null;
            let lo_material = null;
            let lv_color = null;

            try {
                if (pv_color) {
                    lv_color = pv_color;
                }
                else {
                    lv_color = Constants.shape_countour_color;
                }


                if (po_material) {
                    lo_material = po_material;
                }
                else {

                    lo_renderer = new THREE.WebGLRenderer({});
                    let lo_resolution = new THREE.Vector2();
                    lo_renderer.getSize(lo_resolution);

                    lo_material = new LineMaterial({
                        resolution: lo_resolution,
                        linewidth: 0.7,
                        color: lv_color
                    });
                }






                //////let lo_geometry = new LineGeometry();
                //////lo_geometry.setPositions([
                //////    //16122024 {
                ////////    po_left_bottom.y, po_left_bottom.x,  0,                                           //y0, x0, 0,
                ////////    po_left_bottom.y, po_right_top.x - po_left_bottom.x, 0,                        //y0, pv_width, 0,
                ////////    po_right_top.y - po_left_bottom.y, po_right_top.x - po_left_bottom.x, 0,   //pv_height, pv_width, 0,
                ////////    po_right_top.y - po_left_bottom.y, po_left_bottom.x, 0,                       //pv_height, x0, 0,
                //////    //    po_left_bottom.y, po_left_bottom.x, 0                                            //y0, x0, 0

                //////    po_left_bottom.x, po_left_bottom.y, 0,                                           //y0, x0, 0,
                //////    po_left_bottom.x, po_right_top.y - po_left_bottom.y, 0,                        //y0, pv_width, 0,
                //////    po_right_top.x - po_left_bottom.x, po_right_top.y - po_left_bottom.y, 0,   //pv_height, pv_width, 0,
                //////    po_right_top.x - po_left_bottom.x, po_left_bottom.y, 0                       //pv_height, x0, 0,
                //////    ///////////////////po_left_bottom.x, po_left_bottom.y, 0                                            //y0, x0, 0

                //////    // 16122024 }

                //////]);


                //po_left_bottom, po_right_top

                const squareVertices = new Float32Array([
                    //-2, 2, 0,  // Левая верхняя точка
                    //2, 2, 0,   // Правая верхняя точка
                    //2, 2, 0,   // Правая верхняя точка
                    //2, -2, 0,   // Правая нижняя точка
                    //2, -2, 0,   // Правая нижняя точка
                    //-2, -2, 0,  // Левая нижняя точка
                    //-2, -2, 0,  // Левая нижняя точка
                    //-2, 2, 0   // Левая верхняя точка (замкнем квадрат)


                    po_left_bottom.x + pv_delta, po_right_top.y - pv_delta, 0,    // Левая верхняя точка
                    po_right_top.x - pv_delta, po_right_top.y - pv_delta, 0,      // Правая верхняя точка
                    po_right_top.x - pv_delta, po_right_top.y - pv_delta, 0,      // Правая верхняя точка
                    po_right_top.x - pv_delta, po_left_bottom.y + pv_delta, 0,    // Правая нижняя точка
                    po_right_top.x - pv_delta, po_left_bottom.y + pv_delta, 0,    // Правая нижняя точка
                    po_left_bottom.x + pv_delta, po_left_bottom.y + pv_delta, 0,  // Левая нижняя точка
                    po_left_bottom.x + pv_delta, po_left_bottom.y + pv_delta, 0,  // Левая нижняя точка
                    po_left_bottom.x + pv_delta, po_right_top.y - pv_delta, 0     // Левая верхняя точка (замкнем квадрат)

                ]);

                let squareGeometry = new LineGeometry();

                squareGeometry.setPositions(squareVertices);

                let squareLine = new Line2(squareGeometry, lo_material);
                lo_result = new Line2(squareGeometry, lo_material);

                //lo_result = new Line2(lo_geometry, lo_material);

                return lo_result;

            }

            catch (e) {

                alert('error get_drawing_rectangle_by_points: ' + e.stack);

            }
        }
        //---------------------------------------------------------------------------------------------
        CommonFunc.prototype.Create2DArray = function (pv_rows, pv_cols, pv_init_value) {

            let lar_array;

            try {

                lar_array = new Array(pv_rows);
                for (let i = 0; i < pv_rows; i++) {
                    lar_array[i] = new Array(pv_cols).fill(pv_init_value); // Заполняем начальным значением
                }
            }

            catch (e) {

                alert('error Create2DArray: ' + e.stack);

            }

            return lar_array;
        }


        //---------------------------------------------------------------------------------------------
        CommonFunc.prototype.get_numspline_from_left_to_right = function (po_spline) {

            let lv_numspline = -1;

            try {

                let lo_active_side = get_active_side_shape_generator();

                let lar_sorted = lo_active_side.shapes.SortSplinesOrderFromLeftToRight();

                for (let lv_i = 0; lv_i < lar_sorted.length; lv_i++) {

                    if (lar_sorted[lv_i].spline == po_spline) {
                        lv_numspline = lv_i;
                        break;
                    }
                }

            }

            catch (e) {

                alert('error get_numspline_from_left_to_right: ' + e.stack);

            }

            return lv_numspline;
        }






        //-----------------------------------------------------------------

        CommonFunc.prototype.get_name_by_numrow_numcol = function (lv_cell_num_row, lv_cell_num_column) {


            let lv_result = null;

            try {
                if (lv_cell_num_row == null || lv_cell_num_row < 0
                    || lv_cell_num_column == null || lv_cell_num_column < 0) {

                    return lv_result;
                }

                return lv_cell_num_row.toString() + "_" + lv_cell_num_column.toString();
            }

            catch (e) {

                alert('error get_name_by_numrow_numcol: ' + e.stack);

            }

        }

        //-----------------------------------------------------------------

        CommonFunc.prototype.GetTwoShapeIntersect = function (object1, object2) {
            // (example from https://stackoverflow.com/questions/49417007/how-to-find-intersection-of-objects-in-three-js)
            /**
             * This function check if two object3d intersect or not
             * @param {THREE.Object3D} object1
             * @param {THREE.Object3D} object2
             * @returns {Boolean} 
            */

            let lv_result = null;


            try {

                // Check for intersection using bounding box intersection test
                let bBox1 = new THREE.Box3().setFromObject(object1);
                bBox1.max.z = 0;
                bBox1.min.z = 0;

                object2.geometry.computeBoundingBox();

                let bBox2 = new THREE.Box3().setFromObject(object2);
                bBox2.max.z = 0;
                bBox2.min.z = 0;

                const intersection = bBox1.intersectsBox(bBox2);
                // const intersection = mesh1.geometry.boundingBox.intersectsBox(mesh2.geometry.boundingBox);

                if (intersection) { // The shape geometries intersect.

                    //let lv_nspline = this.get_nspline_by_name(object2.name);

                    lv_result = {
                        min_x: bBox2.min.x,
                        min_y: bBox2.min.y,
                        max_x: bBox2.max.x,
                        max_y: bBox2.max.y,
                        object: object2
                        //nspline: lv_nspline
                    };
                }
                //else
                //{ // The shape geometries do not intersect.
                //	return false
                //}



            }

            catch (e) {

                alert('error GetTwoShapeIntersect: ' + e.stack);

            }
            return lv_result;

        }


        //-----------------------------------------------------------------
        CommonFunc.prototype.read_file_from_server = async function (pv_url, pv_is_download_to_downloads_folder, pv_filename,
            pv_is_save_to_server, po_callback) {

            try {

                go_this.downloaded_filename = pv_filename;


                let response = await fetch(pv_url);


                if (!response.ok) {

                    $("#id_order_loading_indicator").hide(); // скрывакм индикатор загрузки

                    //throw new Error(`HTTP error! Status: ${response.status}`);
                    go_this.Show_message("Error reading file!", 2000);
                    return;

                }
                let lar_data = await response.blob();

                //------------------------------------------------------------------


                if (pv_is_download_to_downloads_folder) {

                    let lv_url = URL.createObjectURL(lar_data);
                    let a = document.createElement('a');
                    a.href = lv_url;
                    a.download = pv_filename; // имя файла, под которым сохраняем 
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);

                    URL.revokeObjectURL(lv_url);

                    $("#id_order_loading_indicator").hide(); // скрывакм индикатор загрузки

                    go_this.Show_message("Model file downloaded", 2000);
                }

                if (pv_is_save_to_server) {
                    // Сохраняем файл на сервере генератора

                    //let lv_filename_zip = lo_active_side.model_prefix_filename + Constants.file_model_zip;
                    let lv_filename_zip = pv_filename;// + Constants.file_model_zip;

                    let lv_url = "/Index?handler="
                        + Constants.method_save_model_parts_zip_file
                        + "&filename=" + $("#id_model_name").val() //  lv_filename_zip
                        + "&chdata=" + Math.random().toString();


                    const formData = new FormData();

                    formData.append('file', lar_data);


                    try {

                        let response = await fetch(lv_url,
                            {
                                method: 'POST',
                                body: formData //lar_data,
                            });

                        if (response.ok) {
                            //const result = await response.json();
                            //alert(`File uploaded successfully: ${result.filePath}`);
                        } else {
                            $("#id_order_loading_indicator").hide(); // скрывакм индикатор загрузки

                            //alert("File upload failed!");
                            go_this.Show_message("Error reading file!", 2000);

                        }
                    } catch (error) {
                        //console.error("Error uploading file:", error);
                        alert("An error occurred!");
                        go_this.Show_message("Error reading file!", 2000);
                    }


                    po_callback();  // Удаление временных файлов с api-сервера


                }



            } catch (e) {

                $("#id_order_loading_indicator").hide(); // скрывакм индикатор загрузки

                //alert('error read_file_from_server: ' + e.stack);

                go_this.Show_message("Error reading file!", 2000);
            }




        }





        //////////    try {


        //////////        go_this.downloaded_filename = pv_downloaded_filename;
        //////////        //get_read_result_refresh_premodel(lv_url);


        //////////        ////--------------------------------------------------
        //////////        //async function get_read_result_refresh_premodel(pv_url) {
        //////////        //--------------------------------------------------
        //////////        ///*await*/ $.get(pv_url, "", this.oncomplete_read_file_from_server);
        //////////        /*await*/ $.get(pv_url, "", go_this.oncomplete_read_file_from_server);
        //////////        //}


        //////////    }

        //////////    catch (e) {


        //////////        //lo_active_side.model_params_changed = false; //04102024
        //////////        //lo_passive_side.model_params_changed = false; //04102024

        //////////        //let lv_is_before = false;
        //////////        //lo_active_side.do_before_after_model_request(lv_is_before, false);
        //////////        //lo_passive_side.do_before_after_model_request(lv_is_before, false);

        //////////        alert('error read_file_from_server: ' + e.stack);

        //////////    }

        //////////}



        //////-------------------------------------------------------------------
        ////CommonFunc.prototype.oncomplete_read_file_from_server = function (po_data) {

        ////    try {

        ////        //let lv_data = new Blob([po_data], { type: "application/octet-stream" }); //{ type: "text/plain" });
        ////        let lv_data = new Blob([po_data], { type: "application/zip" }); //{ type: "text/plain" });
        ////        // let lv_data = new Blob([po_data], { type: "text/plain" });

        ////        let lv_url = URL.createObjectURL(lv_data);
        ////        //let lv_url = URL.createObjectURL(po_data);

        ////        const a = document.createElement("a");
        ////        a.href = lv_url;
        ////        a.download = go_this.downloaded_filename; // "downloaded_file.bin";
        ////        document.body.appendChild(a);
        ////        a.click();
        ////        document.body.removeChild(a);
        ////        URL.revokeObjectURL(lv_url);


        ////        document.body.removeChild(a); // Удаляем ссылку из DOM

        ////        // Освобождаем память, удаляя объект URL
        ////        URL.revokeObjectURL(lv_url);


        ////    }

        ////    catch (e) {

        ////        alert('error oncomplete_read_file_from_server: ' + e.stack);

        ////    }

        ////}

        //---------------------------------------------------------------------------------------------
        CommonFunc.prototype.showLoadingIndicator = function (pv_message) {
            //function showLoadingIndicator() {
            const loadingIndicator = document.createElement('div');
            loadingIndicator.id = 'id_loading-indicator';

            const spinner = document.createElement('div');
            spinner.className = 'spinner';

            const text = document.createElement('span');
            //text.textContent = 'Loading...';
            text.textContent = pv_message;

            loadingIndicator.appendChild(spinner);
            loadingIndicator.appendChild(text);

            document.body.appendChild(loadingIndicator);
        }

        //---------------------------------------------------------------------------------------------
        // Функция для удаления индикатора ожидания
        //function hideLoadingIndicator() {

        CommonFunc.prototype.hideLoadingIndicator = function () {
            const loadingIndicator = document.getElementById('id_loading-indicator');
            if (loadingIndicator) {
                loadingIndicator.remove();
            }
        }

        //// Пример использования
        //document.getElementById('start-operation').addEventListener('click', () => {
        //    // Показать индикатор ожидания
        //    showLoadingIndicator();

        //    // Имитация асинхронной операции
        //    setTimeout(() => {
        //        // Убрать индикатор ожидания
        //        hideLoadingIndicator();
        //        alert('Operation completed!');
        //    }, 3000); // 3 секунды ожидания
        //});
        //======================================================================================
        //======================================================================================
        //======================================================================================

    }  // if (typeof this.create_rectangle !== "function")

    //====================================================================


    this.init();

    //this.create_commonFunc();


}

// end Class CommonFunc
//=====================================================================
