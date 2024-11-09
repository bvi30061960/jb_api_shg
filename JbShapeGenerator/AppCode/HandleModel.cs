using Azure.Core;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc;
using NuGet.Protocol.Plugins;
using System.IO;
using Microsoft.CodeAnalysis.Elfie.Serialization;

using Newtonsoft.Json;

namespace JbShapeGenerator.AppCode
{
    public static class HandleModel
    {
        async public static Task<IActionResult> SaveModel(HttpRequest po_Request, PageContext po_PageContext)
        {

            try
            {

                HandlePathsAndNames.Clear_names_and_paths();
                HandlePathsAndNames.Create_names_and_directories(po_PageContext);

                var united_model_data = await po_Request.ReadFromJsonAsync<typ_united_model_data>();

                if (united_model_data == null || united_model_data.model_name == null || united_model_data.model_name == "")
                {
                    return new ObjectResult("No data accepted");
                }



                //----------------------------------------------------------------------------------------------------------
                string? lv_path_and_name_file_wo_extension = HandlePathsAndNames.Get_full_path_with_hashed_filename(united_model_data.model_name, "");

                string lv_filename_sides_data = lv_path_and_name_file_wo_extension + UsingFileExtensions.dat;
                string lv_filename_prev_model = lv_path_and_name_file_wo_extension + UsingFileExtensions.prev;
                string lv_filename_final_model = lv_path_and_name_file_wo_extension + UsingFileExtensions.stl;
                string lv_filename_screen_model = lv_path_and_name_file_wo_extension + UsingFileExtensions.scr; // png;
                string lv_filename_screen_model_graph = lv_path_and_name_file_wo_extension + UsingFileExtensions.png; // png;





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

                // сохранение файла копии экрана с изображением модели
                using (StreamWriter sw = new StreamWriter(lv_filename_screen_model))
                {
                    await sw.WriteAsync(united_model_data.screenshot);
                }


                // Преобразование screenshot в формат графического файла

                string lv_graph = united_model_data.screenshot.Replace("data:image/png;base64,", "");
                //lv_graph = united_model_data.screenshot.Replace(" ", "+");
                //lv_graph = united_model_data.screenshot.Replace(" ", "");

                var lv_base64EncodedBytes = System.Convert.FromBase64String(lv_graph);
                /////////var lv_format_graph = System.Text.Encoding.UTF8.GetString(base64EncodedBytes);





                // сохранение файла копии экрана в графическом формате с изображением модели

                using (BinaryWriter writer = new BinaryWriter(File.Open(lv_filename_screen_model_graph, FileMode.OpenOrCreate)))
                {
                    writer.Write(lv_base64EncodedBytes);
                }




                // сохранение фрагмента программы с описанием массива PointsCurves
                string lv_filename_PointsCurves_array = lv_path_and_name_file_wo_extension + ".txt"; // png;

                typ_sides_data lo_sides_data = JsonConvert.DeserializeObject<typ_sides_data>(united_model_data.sides_data);

                using (StreamWriter sw = new StreamWriter(lv_filename_PointsCurves_array))
                {

                    string lv_describe_array = "decimal[][] lar_TestPoints = new decimal["
                        + lo_sides_data.data1.PointsCurves[0].Length.ToString() + "][];";

                    await sw.WriteLineAsync(lv_describe_array);

                    int lv_num_item = 0;
                    string lv_to_write = "";
                    foreach (decimal[] lv_item in lo_sides_data.data1.PointsCurves[0])
                    {
                        lv_to_write = "lar_TestPoints[" + lv_num_item.ToString()
                                                    + "] = new decimal[2] {"
                                                    + Math.Round(lv_item[0], 2, MidpointRounding.AwayFromZero).ToString() + "M," 
                                                    + Math.Round(lv_item[1], 2, MidpointRounding.AwayFromZero).ToString() + "M};";

                        await sw.WriteLineAsync(lv_to_write);

                        lv_num_item++;
                    }


                }








                // Занесение информации в файл списка файлов

                gs_ListFiles ls_data_file = new gs_ListFiles();

                ls_data_file.path_file_wo_ext = lv_path_and_name_file_wo_extension;
                ls_data_file.filename = united_model_data.model_name;
                //ls_data_file.descr = "New file";
                ////ls_data_file.path_file_sides_data = lv_filename_sides_data;
                ////ls_data_file.path_file_prev_model = lv_filename_prev_model;
                ////ls_data_file.path_file_final_model = lv_filename_final_model;
                ls_data_file.wide_model_type = wide_model_types.user;
                ls_data_file.price = 0.ToString();
                ls_data_file.change_datetime = DateTime.Now.ToString(); // ToShortDateString();



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

        //////----------------------------------------------------------------------------------------------------------
        ////internal static async Task<string> CheckFileExist(string lv_path_filename)
        ////{
        ////    string lv_result = "false";

        ////    if (File.Exists(lv_path_filename))
        ////    {
        ////        lv_result = "true";
        ////    }

        ////    return lv_result;
        ////}

        //----------------------------------------------------------------------------------------------------------
        internal static async Task<string> ReadTextFile(string pv_path_filename)
        {
            //throw new NotImplementedException();

            string lv_result = "";

            try
            {
                //await using (StreamReader lo_sr = new StreamReader(pv_path_filename))
                using (StreamReader lo_sr = new StreamReader(pv_path_filename))
                {
                    lv_result = await lo_sr.ReadToEndAsync();
                }
            }
            catch (Exception ex)
            {

            }



            return lv_result;

        }
        //----------------------------------------------------------------------------------------------------------

        async internal static Task<typ_united_model_data> ReadUnitedModelData(string? lv_path_model)
        {

            typ_united_model_data lo_united_model_data = new typ_united_model_data();

            try
            {

                //HandlePathsAndNames.Clear_names_and_paths();
                //HandlePathsAndNames.Create_names_and_directories(po_PageContext/*lv_session_username*/);

                //var united_model_data = await po_Request.ReadFromJsonAsync<typ_united_model_data>();



                //if (united_model_data == null || united_model_data.model_name == null || united_model_data.model_name == "")
                //{
                //    return new ObjectResult("No data accepted");
                //}



                //----------------------------------------------------------------------------------------------------------
                //string? lv_path_and_name_file_wo_extension = HandlePathsAndNames.Get_full_path_with_hashed_filename(united_model_data.model_name, "");

                string lv_filename_sides_data = lv_path_model + UsingFileExtensions.dat;
                string lv_filename_prev_model = lv_path_model + UsingFileExtensions.prev;
                string lv_filename_final_model = lv_path_model + UsingFileExtensions.stl;
                string lv_filename_screen_model = lv_path_model + UsingFileExtensions.scr;
                string lv_filename_screen_model_graph = lv_path_model + UsingFileExtensions.png;





                //// сохранение файла данных модели
                //using (StreamWriter sw = new StreamWriter(lv_filename_sides_data))
                //{
                //    await sw.WriteAsync(united_model_data.sides_data);
                //}

                // чтение файла данных модели
                using (StreamReader lo_sr = new StreamReader(lv_filename_sides_data))
                {
                    lo_united_model_data.sides_data = await lo_sr.ReadToEndAsync();
                }


                //// сохранение файла предварительной модели
                //using (StreamWriter sw = new StreamWriter(lv_filename_prev_model))
                //{
                //    await sw.WriteAsync(united_model_data.prev_model);
                //}

                // Чтение файла предварительной модели
                using (StreamReader sr = new StreamReader(lv_filename_prev_model))
                {
                    lo_united_model_data.prev_model = await sr.ReadToEndAsync();
                }


                //// сохранение файла копии экрана с изображением модели
                //using (StreamWriter sw = new StreamWriter(lv_filename_screen_model))
                //{
                //    await sw.WriteAsync(united_model_data.screenshot);
                //}

                // Чтение файла копии экрана с изображением модели
                using (StreamReader sr = new StreamReader(lv_filename_screen_model))
                {
                    lo_united_model_data.screenshot = await sr.ReadToEndAsync();
                }




                ////// Преобразование screenshot в формат графического файла

                ////string lv_graph = united_model_data.screenshot.Replace("data:image/png;base64,", "");
                //////lv_graph = united_model_data.screenshot.Replace(" ", "+");
                //////lv_graph = united_model_data.screenshot.Replace(" ", "");

                ////var lv_base64EncodedBytes = System.Convert.FromBase64String(lv_graph);
                /////////////var lv_format_graph = System.Text.Encoding.UTF8.GetString(base64EncodedBytes);


                ////// сохранение файла копии экрана в графическом формате с изображением модели

                ////using (BinaryWriter writer = new BinaryWriter(File.Open(lv_filename_screen_model_graph, FileMode.OpenOrCreate)))
                ////{
                ////    writer.Write(lv_base64EncodedBytes);
                ////}




                //// Занесение информации в файл списка файлов

                //gs_ListFiles ls_data_file = new gs_ListFiles();

                //ls_data_file.path_file_wo_ext = lv_path_and_name_file_wo_extension;
                //ls_data_file.filename = united_model_data.model_name;
                ////ls_data_file.descr = "New file";
                //////ls_data_file.path_file_sides_data = lv_filename_sides_data;
                //////ls_data_file.path_file_prev_model = lv_filename_prev_model;
                //////ls_data_file.path_file_final_model = lv_filename_final_model;
                //ls_data_file.wide_model_type = wide_model_types.user;
                //ls_data_file.price = 0.ToString();
                //ls_data_file.change_datetime = DateTime.Now.ToString(); // ToShortDateString();



                // Чтение информации из файла списка файлов

                PersistentDictionary<gs_ListFiles> lo_list_model_files =
                            new PersistentDictionary<gs_ListFiles>(HandlePathsAndNames.av_path_unic_user_list_files);

                gs_ListFiles ls_data_file = new gs_ListFiles();
                if (lo_list_model_files.ReadItem(lv_path_model, ref ls_data_file))
                {
                    lo_united_model_data.model_name = ls_data_file.filename;
                }

            }
            catch (Exception ex)
            {
                return null;
            }


            //object lo_obj = new { name = "my username" };
            //string lv_res_str = JsonConvert.SerializeObject(lo_obj);
            //return new OkObjectResult(lv_res_str);

            return lo_united_model_data;
        }

        //-------------------- class  ----------------------------------------------
    }

    //====================  namespace  =========================================================
}
