import * as THREE from 'three';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';


import { OBJExporter } from 'three/addons/exporters/OBJExporter.js';
import { STLExporter } from 'three/addons/exporters/STLExporter.js';


import { Constants } from './my_common_const.js';

import {
    get_active_side_shape_generator,
    get_passive_side_shape_generator
    //Shape_generator
} from './my_shape_generator.js';//27072024

import { Shapes } from './my_shapes.js';//27072024
//import { GetTwoShapeIntersect } from './my_shapes.js';//27072024 

import {
    typ_united_model_data,
    type_rotate_mode
} from './my_common_types.js';//2409202 

// Class CommonFunc
export function CommonFunc() {

    // Свойства
    //	this.container = po_container;


    this.$dialog_question = $("#id_div_dialog_question");



    const lo_link = document.createElement('a');
    lo_link.style.display = 'none';
    document.body.appendChild(lo_link);

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

            const { top, left, width, height } = po_container.getBoundingClientRect();

            let lv_moveMouse = new THREE.Vector2();

            // пересчёт координат с учётом положения контейнера three.js
            lv_moveMouse.x = ((pv_event_clientX - left) / width) * 2 - 1;
            lv_moveMouse.y = - ((pv_event_clientY - top) / height) * 2 + 1;

            let lo_pos = this.screenToWorld(

                lv_moveMouse.x,
                lv_moveMouse.y,

                po_container.clientWidth,
                po_container.clientHeight,
                po_camera
            )

            return lo_pos;

        }
        //---------------------------------------------------------------------------
        CommonFunc.prototype.screenToWorld = function (pv_x, pv_y, pv_canvasWidth, pv_canvasHeight, po_camera) {

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
        CommonFunc.prototype.save_model = function (po_sides_data, po_scene_mod) {


            try {

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

                //let lo_element = $(lo_active_side.id_prefix + "id_div_visual_model")[0];

                let lo_element1 = document.querySelector(lo_active_side.id_prefix + "id_div_visual_model");
                //let lo_element = $(lo_active_side.id_prefix + "id_div_visual_model");//24102024

                let lo_element2 = lo_element1.children[2];
                //lo_united_model_data.screenshot = this.screenshot(lo_element);
                ////this.screenshot(lo_element, lo_united_model_data);
                this.screenshot(lo_element2, lo_united_model_data);


                //let lv_str_united_model_data = JSON.stringify(lo_united_model_data);
                //this.send(lv_url, lv_str_united_model_data);

            }

            catch (e) {

                alert('error save_model: ' + e.stack);

            }
        }


        //------------------------------------------------------------------------
        ///CommonFunc.prototype.screenshot = function ($pv_element) {
        CommonFunc.prototype.screenshot = function ($pv_element, po_united_model_data) {

            // Select the element that you want to capture
            //let captureElement = $pv_element;


            try {

                //let lv_imageData = null;

                //html2canvas(captureElement).then((po_canvas) => {
                html2canvas($pv_element).then((po_canvas) => {

                    ////let lv_imageData = po_canvas.toDataURL(/*"image/png"*/);
                    ////po_united_model_data.screenshot = lv_imageData;

                    po_united_model_data.screenshot = po_canvas.toDataURL(/*"image/png"*/);


                    ///window.open(po_united_model_data.screenshot);

                    // Do something with the image data, such as saving it as a file or sending it to a server
                    // For example, you can create an anchor element and trigger a download action
                    //////    const link = document.createElement("a");
                    //////    link.setAttribute("download", "screenshot.png");
                    //////    link.setAttribute("href", imageData);
                    //////    link.click();


                    this.on_fillsreenshot(po_united_model_data);

                });



                ////////html2canvas(captureElement/*.children()*/,
                ////////    {
                ////////        onrendered: function (canvas) {

                ////////            var lv_image = canvas.toDataURL();
                ////////            //if (lv_image.length > cv_ModelImage_length)
                ////////            po_united_model_data.screenshot = lv_image;
                ////////            this.on_fillsreenshot(po_united_model_data);

                ////////        }

                ////////    }
                ////////);

            }

            catch (e) {

                alert('error screenshot: ' + e.stack);

            }

        }
        //------------------------------------------------------------------------
        CommonFunc.prototype.on_fillsreenshot = function (po_united_model_data) {

            let lv_url = "/Index?handler=SaveModel";

            let lv_str_united_model_data = JSON.stringify(po_united_model_data);

            this.send(lv_url, lv_str_united_model_data);

        }

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



            //this.send(lv_url, lo_united_model_data);
            this.send(lv_url, lv_str_united_model_data);


        }


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
                alert(message);






                //fetch(url, {
                //    credentials: 'include'
                //}).then((response) => {
                //    return response.json()
                //}).then((data) => {
                //    if (!data.message) {
                //        //Обработка ответа
                //    } else {
                //        console.log(data.message);
                //    }
                //})



                //$.ajax({
                //    url: '...',
                //    method: 'get',
                //    success: (response): {
                //    let data = JSON.parse(response.responseText);
                //    console.log(data.message); //Omg, Not Found!!!
                //}
                //});



            }

            catch (e) {
                alert('error send: ' + e.stack);
            }
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

            lo_link.href = URL.createObjectURL(blob); // "E:\\Temp\\"; //
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


                let lo_intersect_to_right_object = lo_active_side.shapes.GetTwoShapeIntersect(lo_line_to_right, po_rectangle.shape);
                let lo_intersect_to_left_object = lo_active_side.shapes.GetTwoShapeIntersect(lo_line_to_left, po_rectangle.shape);
                let lo_intersect_to_up_object = lo_active_side.shapes.GetTwoShapeIntersect(lo_line_to_up, po_rectangle.shape);
                let lo_intersect_to_down_object = lo_active_side.shapes.GetTwoShapeIntersect(lo_line_to_down, po_rectangle.shape);


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

            ////while (po_scene.children.length > 0) {
            ////	//po_scene.remove(po_scene.children[0]);

            ////	if (pv_nodelete_type) {
            ////		if (po_scene.children[0].type !== pv_nodelete_type) {
            ////			this.removeObjectsWithChildren(po_scene.children[0], true);
            ////		}
            ////	}
            ////	else {
            ////		this.removeObjectsWithChildren(po_scene.children[0], true);
            ////	}
            ////}

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

                for (var lv_i = 0; lv_i < po_group.children.length; lv_i++) {

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

            if (lo_active_side.rotate_status == type_rotate_mode.None) {
                return;
            }

            var lv_delta_rotation = this.get_delta_rotation(lo_active_side.rotate_status);

            po_group.rotation.y += lv_delta_rotation;

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
