using System.Diagnostics;
using System.IO.Compression;


using System.IO.Compression;

namespace jb_api_shg.AppCode
{

    ////////******************************************************************************************
    //public struct CommonConstants
    //{
    //    public const string data_delimiter = "_@&@_";


    //////    public const string method_refresh_premodel = "refresh_premodel";
    //////    public const string method_start_refresh_premodel = "start_refresh_premodel";
    //////    public const string method_make_model = "make_model";
    //////    public const string method_start_make_model = "start_make_model";

    //////    public const string method_read_model_parts = "read_model_parts";
    //////    public const string method_delete_model_parts = "delete_model_parts";
    //////    public const string method_read_progress_value = "read_progress_value";
    //////    public const string method_read_result_refresh_premodel = "read_result_refresh_premodel";

    //////    public const string path_AppData = "AppData";
    //////    public const string path_temp_data = "temp_data";
    //////    public const string filename_dict_progress = "dict_progress.txt";


    //////    //public const string cv_pattern_sentences = @"((?:(?-i)[А-ЯA-Z]).*(?<=(?:[а-яa-z]){2,})\.)";
    //////    ////public const string cv_pattern_delimiter_sentences = @"(\. |\.\r\n|! |!\r\n|\? |\?\r\n|; |;\r\n)"; //26072023  @"(\. )";
    //////    //public const string cv_pattern_delimiter_sentences = @"(\. |\.\r\n|! |!\r\n|\? |\?\r\n|; |;\r\n|:\r\n)"; //26072023  @"(\. )";
    //////    //public const string cv_pattern_phrases = @"([^;|,|.]+)";
    //////    //public const string cv_pattern_words = @"(\S+)";
    //////    //public const string SeparatorNameSet_from_data = "_@&@_";
    //////    //public const string Separator_between_items = "_&&_";
    //////    //public const string Separator_from_value = "_@@_";
    //////    //public const string Separator_after_hash = "_$$_";
    //////    //public const string payment_code_secret = "eLZb3LM4JPxkWM5RpWzL48ue";
    //////    //public const string Separator_in_payment_label = "_@_";
    //////    //public const string Separator_between_dir = @"\";
    //////    //public const string current_theme = "current_theme";
    //////    //public const string current_lang = "current_lang";
    //////    //public const string Membership_page_Login = "LoginUser";
    //////    //public const string Membership_page_Register = "RegisterUser";
    //////    //public const string Membership_page_Recovery = "PasswRecovery";
    //////    //public const string Separator_from_global_filenumber = "_";
    //////    //public const string delim_datetime_label = "@";
    //////    //public const string Separator_between_excel_columns_when_read_file = "@##@";
    //////    //public const string Separator_lines_crlf = "\r\n";
    //////    ////02072023 public const decimal price_per_playbackset = 0.1M; // 0.1 $/playbackset
    //////    public const string word_task_id = "task_id";
    //////}




    //////public enum enum_model_side
    //////{
    //////    up_side,
    //////    lateral_side
    //////}

    //////public class typ_sides_data
    //////{
    //////    public string client_id { set; get; }
    //////    public string task_id { set; get; }
    //////    public typ_color_data ColorParts { set; get; }
    //////    public typ_side_data data1 { set; get; }
    //////    public typ_side_data data2 { set; get; }

    //////};


    //////public class typ_color_data
    //////{
    //////    public string[][] ColorParts { set; get; }
    //////}


    //////public class typ_parameters
    //////{
    //////    //public bool is_space_adjust { get; set; }
    //////    //public bool is_curve_width_adjust { get; set; }
    //////    //public decimal distance_bt_curves { get; set; }
    //////    //public decimal distance_bt_curves_in_percent { get; set; }
    //////    //public decimal shape_height { get; set; }
    //////    //public decimal shape_width { get; set; }

    //////    public decimal container_width { get; set; }
    //////    public decimal container_height { get; set; }
    //////    public decimal shape_width_beg { get; set; }
    //////    public decimal shape_width { get; set; }
    //////    public decimal shape_height_beg { get; set; }
    //////    public decimal shape_height { get; set; }
    //////    public int shape_amount_curves { get; set; }
    //////    public int spline_amount_segments { get; set; }
    //////    public bool ajust_curves_by_shape { get; set; }
    //////    public bool ajust_shape_by_curves { get; set; }
    //////    public decimal distance_between_curves_in_percent_of_width { get; set; }
    //////    public decimal distance_bt_curves { get; set; }
    //////    public bool is_space_adjust { get; set; }
    //////    public bool is_curve_width_adjust { get; set; }
    //////    public /*int*/string color { get; set; }
    //////    public decimal rectangle_scale_y { get; set; }

    //////}

    //////public class typ_side_data
    //////{
    //////    public typ_parameters parameters { get; set; }
    //////    public int numCurves { get; set; }
    //////    public int idMaterial { get; set; }
    //////    public int idSize { get; set; }


    //////    //public string[] CurveColors { get; set; }
    //////    //public decimal[][][] PointsCurves { get; set; }
    //////    //public int[][] Segments_beg_points_numbers { get; set; } //01112024

    //////    public bool Lockedit { get; set; }
    //////    public bool Fl_manual_parameters { get; set; }
    //////    public decimal M_Material { get; set; }
    //////    public decimal M_Width { get; set; }
    //////    public decimal M_Height { get; set; }
    //////    public decimal M_Length { get; set; }
    //////    public decimal M_Price_rub { get; set; }
    //////    public decimal Part_gap { get; set; } //01112024
    //////    public string[] CurveColors { get; set; }
    //////    public int[][] Segments_beg_points_numbers { get; set; } //01112024
    //////    public decimal[][][] PointsCurves { get; set; }

    /////}


    //////public class typ_model_data
    //////{
    //////    public string stl_model_data { set; get; }
    //////};


    //////public class typ_make_model_result_data
    //////{
    //////    public string common_outfilename_part { set; get; }
    //////    public int number_outfiles { set; get; }

    //////};



    //////public struct typ_parameters_for_model_handle
    //////{
    //////    public IProgressMonitor ProgressMonitor { set; get; }
    //////    public typ_sides_data sides_data { set; get; }
    //////}



    //=============================================================================================


    public class Commons
    {

        public static string GetPathTempDataFileName()
        {
            string lv_result = "";




            return lv_result;

        }

        //////---------------------------------------------------------------------------------------------
        ////static public string get_random_name()
        ////{
        ////    string lv_result = "";

        ////    // lv_result = Guid.NewGuid().ToString(); //- слишком длинное получается название

        ////    lv_result = Path.GetFileNameWithoutExtension(Path.GetRandomFileName()) + DateTime.Now.Ticks.ToString();

        ////    return lv_result;
        ////}


        //-----------------------------------------------------------------------------------------------
        // Создание директории, если не существует
        public static void create_directory_if_no_exist(string? pv_path_dir)
        {
            if (pv_path_dir == null || pv_path_dir == "")
            {
                return;
            }


            DirectoryInfo lv_di = new DirectoryInfo(pv_path_dir);
            if (!lv_di.Exists)
            {
                try
                {
                    lv_di.Create();
                }
                catch (Exception ex)
                {
                }

            }
        }
        //}


        //-----------------------------------------------------------------------------------------------

        public static bool MakeZipFile(string pv_folder_with_files_for_zip, string pv_result_zipfile_name)
        {
            // Создание zip-файла для заданной папки

            bool lv_result = false;

            try
            {

                string lv_path_result_file = Path.Combine(pv_folder_with_files_for_zip, pv_result_zipfile_name);

                if (Directory.Exists(pv_folder_with_files_for_zip))
                {
                    // Удаляем существующий ZIP-файл, если он есть
                    if (File.Exists(lv_path_result_file))
                    {
                        File.Delete(lv_path_result_file);
                    }

                    // Создаем ZIP-архив
                    ZipFile.CreateFromDirectory(pv_folder_with_files_for_zip, lv_path_result_file);
                    lv_result = true;
                }

            }
            catch (Exception ex)
            {
                lv_result = false;
            }

            return lv_result;

        }

        internal static string get_substr_until_last_substr(string? lv_input, string lv_targetSubstr)
        {
            string lv_result = "";

            // Находим индекс последнего вхождения символа
            int lv_lastIndex = lv_input.LastIndexOf(lv_targetSubstr);

            // Проверяем, найден ли символ
            if (lv_lastIndex >= 0)
            {
                // Извлекаем подстроку от начала до последнего вхождения символа
                lv_result = lv_input.Substring(0, lv_lastIndex);
            }

            return lv_result;
        }


        //----------------------------------------------------------------------------------
        internal static void Delete_model_parts(HttpRequest po_request)
        {

            try
            {
                string lv_common_filenames_prefix = po_request.Query["filename"];


                //17012025 {
                //lv_path_model_part = Path.Combine(Environment.CurrentDirectory,
                //                        Path.Combine(CommonConstants.path_AppData, CommonConstants.path_temp_data));

                string lv_path_temp_data = Path.Combine(Environment.CurrentDirectory,
                                        Path.Combine(CommonConstants.path_AppData, CommonConstants.path_temp_data));

                string lv_folder_to_delete = Path.Combine(lv_path_temp_data, lv_common_filenames_prefix);

                string lv_path_file_to_delete = Path.Combine(lv_path_temp_data, lv_common_filenames_prefix + UsingFileExtensions.zip);

                //HandlePathsAndNames.Delete_files_by_dir_and_mask(lv_path_model_part, lv_prefix_file + "_*.stl");

                HandlePathsAndNames.Delete_folder_with_files(lv_folder_to_delete); //17012025

                // Удаляем существующий ZIP-файл, если он есть
                if (System.IO.File.Exists(lv_path_file_to_delete))
                {
                    System.IO.File.Delete(lv_path_file_to_delete);
                }

            }
            catch (Exception ex)
            {
                // Debug.WriteLine("Error in Delete_model_parts: " + ex.Message);
            }
            //17012025 }        

        }

        //internal static async Task<byte[]?> ReadBinaryFile(string lv_path_zip_file)
        //{
        //----------------------------------------------------------------------------------------------------------
        internal static async Task<byte[]> ReadBinaryFile(string pv_path_filename)
        {
            byte[] lv_result = null;

            try
            {
                lv_result = await File.ReadAllBytesAsync(pv_path_filename);
            }
            catch (Exception ex)
            {

            }

            return lv_result;

        }




    } // end class Commons
      //=======================================================================================

}