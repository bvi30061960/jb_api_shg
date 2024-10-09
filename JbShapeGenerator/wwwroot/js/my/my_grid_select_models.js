//import * as THREE from 'three';
//import { Line2 } from 'three/addons/lines/Line2.js';
//import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
//import { LineGeometry } from 'three/addons/lines/LineGeometry.js';


// Class Rectangle
export function GridSelectModels(pv_prefix /*po_container , po_camera, po_scene, po_params*/ )
{

	//// Свойства
	//this.container = po_container;
	//this.camera = po_camera;
	//this.scene = po_scene;

	//this.shape_width = po_params.shape_width;
	//this.shape_height = po_params.shape_height;

	//this.shape;

	//this.group_rect = null;

	this.prefix = pv_prefix;

	//this.cv_grid_select_models = "my_grid_select_models";

	this.$grid = null;

	//=====================================================================

	if (typeof this.create_grid_select_models != "function") {

		//----------------------------------------------------------
		// Методы
		//----------------------------------------------------------



		//Rectangle.prototype.create_GridSelectModels = function () {


		//	try {


		//	}

		//	catch (e) {

		//		alert('error create_shapes: ' + e.stack);

		//	}


		//}


		//------------------------------------------------------------------------
		GridSelectModels.prototype.create_grid_select_models = function (  /*pv_distance_bt_curves*/) {

			//const cv_rect_width = this.shape_width;
			//const cv_rect_height = this.shape_height;

			try {




				//const positions = [];
				//positions.push(0, 0, 0);
				//positions.push(0, cv_rect_height, 0);
				//positions.push(cv_rect_width, cv_rect_height, 0);
				//positions.push(cv_rect_width, 0, 0);
				//positions.push(0, 0, 0);


				//let lv_color = 0x0040f0;
				//let lv_x = 0; //13032024  pv_distance_bt_curves/2;// / 2; // 0;
				//let lv_y = 0;

				//const clrs = [];

				//positions.forEach(() => {
				//	clrs.push(255, 0, 255);
				//});


				//let geometry = new LineGeometry();

				//geometry.setPositions(positions);/////

				//geometry.setColors(clrs);

				//let resolution = new THREE.Vector2();

				//let renderer = new THREE.WebGLRenderer({ /*antialias: true*/ });
				//renderer.getSize(resolution);

				//let material = new LineMaterial({
				//	//color: new Color("#fff").getHex(),
				//	vertexColors: 0xf0f, //VertexColors,
				//	linewidth: 0.5, //1, //2,
				//	resolution: resolution
				//	//dashed: false, //true,
				//	//gapSize: 0.75,
				//	//dashScale: 1.5,
				//	//dashSize: 1
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

				//this.prefix = pv_prefix;

				this.$div_grid = $(this.prefix + "id_div_GridSelectModels");
				this.$grid = $(this.prefix + "id_GridSelectModels");
				this.$gridPager = $(this.prefix + "id_div_GridSelectModelsPager");



				this.$div_grid.dialog({
					title: "Read model",
					autoOpen: false,
					modal: true,
					resizable: false,
					height: "auto",
					width: "auto", // 600,
					buttons: {
						"Close": function () {
							$(this).dialog("close");
						}
					}
				});



				//----------------  grid  -----------------------------------------------------------------

				this.$grid.jqGrid({
					//url: 'jqGridSelectBlockSetingsHandler.ashx',
					datatype: 'json',
					height: 230,//120,//90, //250,
					width: 1100, //800, //1000,

					//23092021 autowidth: true,
					hoverrows: false, // подсвечивание строк

					//colNames: ['pathFile', 'Hash_name', '№ п/п', 'Имя настройки', 'Описание', 'Дата изм.', 'Время изм.', '<i class="bi-share"></i>', 'username_hash_with_postfix'],
					//colModel: [
					//	{ name: 'pathFile', index: 'pathFile', hidden: true },
					//	{ name: 'Hash_name', index: 'Hash_name', hidden: true, width: 70, sortable: true, align: 'center' },
					//	{ name: 'RowID', index: 'RowID', width: 50, sortable: true, align: 'center'/*, formatter: cellLinkFormater*/ },
					//	{ name: 'NameSet', index: 'NameSet', align: 'center', width: 160, sortable: true/*, formatter: cellLinkFormater*/ },
					//	{ name: 'Description', index: 'Description', width: 300, sortable: true, align: 'center'/*, formatter: cellLinkFormater*/ },
					//	{ name: 'DateChange', index: 'DateChange', width: 70, sortable: true, align: 'center'/*, formatter: cellLinkFormater*/ },
					//	{ name: 'changeTime', index: 'changeTime', width: 90, sortable: true, align: 'center'/*, formatter: cellLinkFormater*/ },
					//	{ name: 'IsCommonNastr', index: 'IsCommonNastr', sortable: true, width: 35, align: 'center'/*, formatter: is_shared_file_formatter*/ },
					//	{ name: 'username_hash_with_postfix', index: 'username_hash_with_postfix', hidden: true }

					//],


					colNames: ['pathFile', '<i class="bi-share"></i>', 'Model name', 'Description', 'Picture', 'Change date', 'Change time', 'username_hash_with_postfix'],
					colModel: [
						{ name: 'pathFile', index: 'pathFile', hidden: true },
						{ name: 'IsCommonModel', index: 'IsCommonModel', sortable: true, width: 35, align: 'center'/*, formatter: is_shared_file_formatter*/ },
						{ name: 'ModelName', index: 'ModelName', align: 'center', width: 160, sortable: true/*, formatter: cellLinkFormater*/ },
						{ name: 'Description', index: 'Description', width: 300, sortable: true, align: 'center'/*, formatter: cellLinkFormater*/ },
						{ name: 'Picture', index: 'Picture', width: 80, sortable: true, align: 'center'/*, formatter: cellLinkFormater*/ },
						{ name: 'DateChange', index: 'DateChange', width: 70, sortable: true, align: 'center'/*, formatter: cellLinkFormater*/ },
						{ name: 'ChangeTime', index: 'ChangeTime', width: 90, sortable: true, align: 'center'/*, formatter: cellLinkFormater*/ },
						{ name: 'username_hash_with_postfix', index: 'username_hash_with_postfix', hidden: true }

					],





					//caption: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
					//    'Список настроек',
					caption: "", //"Выбор настройки",
					rowNum: 100, //10,
					//rowList: [10, 50, 100],
					pager: this.$gridPager,
					sortname: 'RowID',
					////////////////viewrecords: true,

					/////////////////////////////////editurl: "/Index?handler=GridListBlockSetings?delete=yes", //10092022

					sortorder: 'asc',
					/////////////////////////////////ondblClickRow: OndblClickRow,

					datatype: 'local',

					hiddengrid: 'true'


					//        gridComplete: function () {
					//            var ids = lv_GridSelectBlockSettings.jqGrid('getDataIDs');
					//            for (var i = 0; i < ids.length; i++) {
					//                var cl = ids[i];
					////                be = "<input style='height:22px;width:20px;' type='button' value='E' onclick=\"jQuery('#id_GridSelectBlockSettings').delRowData('" + cl + "');\"  />";
					//                be = "<input style='height:22px;width:20px;' type='button' value='E' onclick=\"jQuery('#id_GridSelectBlockSettings').delGridRow('" + cl + "');\"  />";
					//                lv_GridSelectBlockSettings.jqGrid('setRowData', ids[i], { act: be });
					//            }
					//        }


					//onSelectRow: function (id) {
					//    if (id && id !== lastsel2) {
					//        $('#GridSelectBlockSettings').jqGrid('restoreRow', lastsel2);
					//        $('#GridSelectBlockSettings').jqGrid('editRow', id, true);
					//        lastsel2 = id;
					//    }
					//},


					////////////////loadComplete: function (id) { //03062022


					////////////////	//var lv_rows = lv_LoadedTextGrid.getGridParam("reccount");

					////////////////	//if (lv_rows > 0) {


					////////////////	//    $("#id_dialog_file_saved").dialog("open");

					////////////////	//}


					////////////////}

				});// Grid
				//------------------------------------------------------------------------------------------


			}

			catch (e) {

				alert('error create_grid_select_models: ' + e.stack);

			}

		}



		//-----------------------------------------------------------------


		//====================================================================
	}  // if (typeof this.create_rectangle !== "function")

	//====================================================================



	this.create_grid_select_models();


}

// end Class GridSelectModels
//=====================================================================