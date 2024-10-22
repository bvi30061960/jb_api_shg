
using static JbShapeGenerator.AppCode.CommonMethods;
//using static JbShapeGenerator.AppCode.Commons;

namespace JbShapeGenerator.AppCode
{
    public class jqGridSelectListModelFiles
    {

        public jqGridSelectListModelFiles()
        {
        }


        //=========================================================================================
        public async Task<JQGridResults> ProcessRequest(HttpContext context)
        {

            HttpRequest request = context.Request;
            HttpResponse response = context.Response;

            //string lv_search? = context.Request.Query["_search"];
            string? lv_numberOfRows = context.Request.Query["rows"];
            string? lv_pageIndex = context.Request.Query["page"];
            string? lv_sortColumnName = context.Request.Query["sidx"];
            string? lv_sortOrderBy = context.Request.Query["sord"];


            string lv_is_delete = context.Request.Query["delete"];

            if (lv_is_delete == "yes")
            {

                string lv_pathfile = context.Request.Query["pathfile"];

                if (lv_pathfile != "")
                {
                    File.Delete(lv_pathfile);
                }

            }


            int lv_totalRecords = 0;

            string lv_filepath = HandlePathsAndNames.av_unic_user_models_dir;

            JQGridResults output = new JQGridResults();

            output = await BuildJQGridResults(lv_filepath, Convert.ToInt32(lv_numberOfRows), Convert.ToInt32(lv_pageIndex), Convert.ToInt32(lv_totalRecords),
                                                  lv_sortColumnName, lv_sortOrderBy);

            return output;

        }



        //================================================================================================================================
        private async Task<JQGridResults> BuildJQGridResults(string pv_path, int pv_numberOfRows, int pv_pageIndex, int pv_totalRecords,
            string pv_sortColumnName, string pv_sortOrderBy)
        {

            JQGridResults result = new JQGridResults();

            if (pv_path == null)
            {
                return result;
            }

            List<JQGridRow> rows = new List<JQGridRow>();

            System.Collections.Generic.Dictionary<string, gs_ListFiles> lo_dict;


            try
            {
                //PersistentDictionary<gs_ListFiles> lo_hpt
                //      = new PersistentDictionary<gs_ListFiles>(AdminSets.path_common_list_OutputAudios);
                PersistentDictionary<gs_ListFiles> lo_list_model_files =
                            new PersistentDictionary<gs_ListFiles>(HandlePathsAndNames.av_path_unic_user_list_files);

                lo_dict = lo_list_model_files.ReadDictionary();

                var lo_sorted_dict = lo_dict.OrderBy(x => x.Key);

                //RowID


        //public string filename { get; set; }
        ////public string descr { get; set; }
        //public string path_file_sides_data { get; set; }
        //public string path_file_prev_model { get; set; }
        //public string path_file_final_model { get; set; }
        //public wide_model_types wide_model_type { get; set; }
        //public string price { get; set; }
        //public string change_datetime { get; set; }


                switch (pv_sortColumnName)
                {
                    //case "nfiles":
                    case "filename":
                        if (pv_sortOrderBy == "asc")
                        {
                            lo_sorted_dict = lo_dict.OrderBy(x => long.Parse(x.Value.filename)); //long.Parse(x.Value.gnumber));
                        }
                        else
                        {
                            lo_sorted_dict = lo_dict.OrderByDescending(x => long.Parse(x.Value.filename));
                        }

                        break;

                    case "change_datetime":
                        if (pv_sortOrderBy == "asc")
                        {
                            lo_sorted_dict = lo_dict.OrderBy(x => x.Value.change_datetime);
                        }
                        else
                        {
                            lo_sorted_dict = lo_dict.OrderByDescending(x => x.Value.change_datetime);
                        }

                        break;
                    //case "gnumber":
                    //    if (pv_sortOrderBy == "asc")
                    //    {
                    //        lo_sorted_dict = lo_dict.OrderBy(x => long.Parse(x.Value.gnumber));
                    //    }
                    //    else
                    //    {
                    //        lo_sorted_dict = lo_dict.OrderByDescending(x => long.Parse(x.Value.gnumber));
                    //    }

                    //    break;


                }




                //////02062023 {
                ////// чтение списка оплаченных файлов
                ////// Путь до списка оплаченных файлов текущего пользователя

                ////string lv_list_paid_file_path = ao_GlobalSessionData.av_path_unic_user_paid_files;
                ////PersistentDictionary<gs_PaidFiles> lo_list_paid_files
                ////        = new PersistentDictionary<gs_PaidFiles>(lv_list_paid_file_path, ao_GlobalSessionData);

                ////System.Collections.Generic.Dictionary<string, gs_PaidFiles> lo_dictlist_paid_files = lo_list_paid_files.ReadDictionary();
                ////gs_PaidFiles ls_PaidFiles = new gs_PaidFiles();
                //////02062023 }








                int lv_i = 0;

                gs_ListFiles gs_data;

                JQGridRow row = new JQGridRow();

                foreach (var lv_item in lo_sorted_dict)
                {
                    gs_data = lv_item.Value;




                    row.id = lv_i++;

                    row.cell = new string[7];//!!  Изменяемая размерность


                    //public string filename { get; set; }
                    ////public string descr { get; set; }
                    //public string path_file_sides_data { get; set; }
                    //public string path_file_prev_model { get; set; }
                    //public string path_file_final_model { get; set; }
                    //public wide_model_types wide_model_type { get; set; }
                    //public string price { get; set; }
                    //public string change_datetime { get; set; }






                    row.cell[Get_num_by_name_column(GridFieldsSet.ListModelFiles, "filename")] = gs_data.filename; 
                    //row.cell[Get_num_by_name_column(GridFieldsSet.ListModelFiles, "descr")] = gs_data.descr; 
                    row.cell[Get_num_by_name_column(GridFieldsSet.ListModelFiles, "path_file_sides_data")] = gs_data.path_file_sides_data; 
                    row.cell[Get_num_by_name_column(GridFieldsSet.ListModelFiles, "path_file_prev_model")] = gs_data.path_file_prev_model; 
                    row.cell[Get_num_by_name_column(GridFieldsSet.ListModelFiles, "path_file_final_model")] = gs_data.path_file_final_model; 
                    row.cell[Get_num_by_name_column(GridFieldsSet.ListModelFiles, "wide_model_types")]      = gs_data.wide_model_type.ToString();
                    row.cell[Get_num_by_name_column(GridFieldsSet.ListModelFiles, "price")]                 = gs_data.price; 
                    row.cell[Get_num_by_name_column(GridFieldsSet.ListModelFiles, "change_datetime")]       = gs_data.change_datetime;    

                    rows.Add(row);

                }



            }
            catch (Exception ex)
            {
            }


            result.rows = rows.ToArray();
            result.page = pv_pageIndex;
            result.total = (pv_totalRecords + pv_numberOfRows - 1) / pv_numberOfRows;
            result.records = pv_totalRecords;
            return result;

        }

        //========================================================================================================
    }
}
