﻿using Azure.Core;
using JbShapeGenerator.AppData;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc;
using NuGet.Protocol.Plugins;

namespace JbShapeGenerator.AppData
{
    public static class HandleModel
    {
        async public static Task<IActionResult> SaveModel(HttpRequest po_Request, PageContext po_PageContext)
        {

            try
            {

                HandlePathsAndNames.clear_names_and_paths();

                string lv_session_username = HandlePathsAndNames.get_session_username_by_PageContext(po_PageContext);
                HandlePathsAndNames.create_names_and_directories(lv_session_username);

                //////string? lv_path_and_name_file_wo_extension = HandleNamesAndPaths.get_full_path_with_unic_filename("");
                ////string? lv_path_and_name_file_wo_extension = HandleNamesAndPaths.get_full_path_with_hashed_filename("");

                ////string lv_filename_sides_data = lv_path_and_name_file_wo_extension + UsingFileExtensions.dat;
                ////string lv_filename_prev_model = lv_path_and_name_file_wo_extension + UsingFileExtensions.prev;
                ////string lv_filename_final_model = lv_path_and_name_file_wo_extension + UsingFileExtensions.stl;



                var united_model_data = await po_Request.ReadFromJsonAsync<typ_united_model_data>();

                //string? lv_path_and_name_file_wo_extension = HandleNamesAndPaths.get_full_path_with_unic_filename("");

                if (united_model_data == null || united_model_data.model_name == null || united_model_data.model_name == "")
                {
                   return new ObjectResult("No data accepted");
                }



                //----------------------------------------------------------------------------------------------------------
                string? lv_path_and_name_file_wo_extension = HandlePathsAndNames.get_full_path_with_hashed_filename(united_model_data.model_name, "");

                string lv_filename_sides_data = lv_path_and_name_file_wo_extension + UsingFileExtensions.dat;
                string lv_filename_prev_model = lv_path_and_name_file_wo_extension + UsingFileExtensions.prev;
                string lv_filename_final_model = lv_path_and_name_file_wo_extension + UsingFileExtensions.stl;





                // сохранение файла данных модели
                using (StreamWriter sw = new StreamWriter(lv_filename_sides_data))
                {
                    await sw.WriteAsync(united_model_data.sides_data);
                }

                // сохранение файла предварительной модели
                using (StreamWriter sw = new StreamWriter(lv_filename_prev_model))
                {
                    await sw.WriteAsync(united_model_data.prev_model);
                }


                gs_ListFiles ls_data_file = new gs_ListFiles();

                ls_data_file.filename = Path.GetFileName(lv_path_and_name_file_wo_extension);
                ls_data_file.descr = "New file";
                ls_data_file.path_file_sides_data = lv_filename_sides_data;
                ls_data_file.path_file_prev_model = lv_filename_prev_model;
                ls_data_file.path_file_final_model = lv_filename_final_model;
                ls_data_file.wide_model_type = wide_model_types.user;
                ls_data_file.price = 0.ToString();
                ls_data_file.change_datetime = DateTime.Now.ToLongTimeString();






                // Добавление записи в список файлов
                PersistentDictionary<gs_ListFiles> lo_list_model_files =
                            new PersistentDictionary<gs_ListFiles>(HandlePathsAndNames.av_path_unic_user_list_files);

                lo_list_model_files.ModifyItem(lv_path_and_name_file_wo_extension, ls_data_file);


            }
            catch (Exception ex)
            {
                return new ObjectResult("No data accepted");
            }


            //object lo_obj = new { name = "my username" };
            //string lv_res_str = JsonConvert.SerializeObject(lo_obj);
            //return new OkObjectResult(lv_res_str);

            return new ObjectResult("my username");

        } // method 

    //-------------------- class  ----------------------------------------------
    }

    //====================  namespace  =========================================================
}