namespace jb_api_shg.AppCode
{
    //public class CommonTypes
    //{
    //}

    //******************************************************************************************
    public struct CommonConstants
    {

        public const string method_refresh_premodel = "refresh_premodel";
        public const string method_start_refresh_premodel = "start_refresh_premodel";
        public const string method_make_model = "make_model";
        public const string method_start_make_model = "start_make_model";

        public const string method_read_model_parts = "read_model_parts";
        public const string method_delete_model_parts = "delete_model_parts";
        public const string method_read_progress_value = "read_progress_value";
        public const string method_read_result_refresh_premodel = "read_result_refresh_premodel";
        public const string method_read_model_parts_zip_file_from_api = "read_model_parts_zip_file_from_api";
        public const string parameter_folder_for_model_parts_zip = "folder_for_model_parts_zip";

        public const string path_AppData = "AppData";
        public const string path_temp_data = "temp_data";
        //public const string filename_dict_progress = "dict_progress.txt";


        //public const string cv_pattern_sentences = @"((?:(?-i)[А-ЯA-Z]).*(?<=(?:[а-яa-z]){2,})\.)";
        ////public const string cv_pattern_delimiter_sentences = @"(\. |\.\r\n|! |!\r\n|\? |\?\r\n|; |;\r\n)"; //26072023  @"(\. )";
        //public const string cv_pattern_delimiter_sentences = @"(\. |\.\r\n|! |!\r\n|\? |\?\r\n|; |;\r\n|:\r\n)"; //26072023  @"(\. )";
        //public const string cv_pattern_phrases = @"([^;|,|.]+)";
        //public const string cv_pattern_words = @"(\S+)";
        //public const string SeparatorNameSet_from_data = "_@&@_";
        //public const string Separator_between_items = "_&&_";
        //public const string Separator_from_value = "_@@_";
        //public const string Separator_after_hash = "_$$_";
        //public const string payment_code_secret = "eLZb3LM4JPxkWM5RpWzL48ue";
        //public const string Separator_in_payment_label = "_@_";
        //public const string Separator_between_dir = @"\";
        //public const string current_theme = "current_theme";
        //public const string current_lang = "current_lang";
        //public const string Membership_page_Login = "LoginUser";
        //public const string Membership_page_Register = "RegisterUser";
        //public const string Membership_page_Recovery = "PasswRecovery";
        //public const string Separator_from_global_filenumber = "_";
        //public const string delim_datetime_label = "@";
        //public const string Separator_between_excel_columns_when_read_file = "@##@";
        //public const string Separator_lines_crlf = "\r\n";
        ////02072023 public const decimal price_per_playbackset = 0.1M; // 0.1 $/playbackset
        public const string word_task_id = "task_id";
    }


    //******************************************************************************************
    public struct UsingFileExtensions
    {

        public const string stl = ".stl";   // Файлы stl
        public const string dat = ".dat";   // Файлы с данными фигуры и кривых
        public const string prev = ".prev";  // stl Файл модели до разрезания
        public const string png = ".png";   // графический файл копии экрана с изображением модели
        public const string scr = ".scr";   // копия экрана с изображением модели
        public const string zip = ".zip";   // zip файл

        //    public const string t1c = ".t1c"; // Выход - файл для перевода с двухколоночной таблицей с текстом в одной левой колонке  
        //                                      //public const string t2c = ".t2c"; // Выход - файл с двухколоночной таблицей с переведённым текстом в двух колонках  
        //    public const string t2c = ".t2c"; // Выход - файл с серилизованным объектом - набором таблиц c переводом - по словам, предложениям, абзацам, страницам
        //    /*** файл с двухколоночной таблицей с разбивкой в колонках по предложениям с текстом на двух языках в двух колонках */
        //    //public const string t3c = ".t3c"; // Выход - файл для озвучивания с разбивкой в колонках по словам, фразам, предложениям и т.д. с текстом на двух языках в двух колонках
        //    public const string mp3 = ".mp3"; // Выход - аудиофайл со сгенертрованным звуком на основании таблицы текста
        //    public const string map = ".map"; // Выход - файл мэппинга временных меток с блоками текста
        //    public const string txt = ".txt"; // Файлы словарей
        //    public const string pbs = ".pbs"; // Файлы playbackset настроек
        //    public const string zip = ".zip"; // Файлы zip
    };


    public enum enum_model_side
    {
        up_side,
        lateral_side
    }

    public class typ_sides_data
    {
        public string client_id { set; get; }
        public string task_id { set; get; }
        public typ_color_data ColorParts { set; get; }
        public typ_side_data data1 { set; get; }
        public typ_side_data data2 { set; get; }

    };


    public class typ_color_data
    {
        public string[][] ColorParts { set; get; }
    }


    public class typ_parameters
    {
        //public bool is_space_adjust { get; set; }
        //public bool is_curve_width_adjust { get; set; }
        //public decimal distance_bt_curves { get; set; }
        //public decimal distance_bt_curves_in_percent { get; set; }
        //public decimal shape_height { get; set; }
        //public decimal shape_width { get; set; }

        public decimal container_width { get; set; }
        public decimal container_height { get; set; }
        public decimal shape_width_beg { get; set; }
        public decimal shape_width { get; set; }
        public decimal shape_height_beg { get; set; }
        public decimal shape_height { get; set; }
        public int shape_amount_curves { get; set; }
        public int spline_amount_segments { get; set; }
        public bool ajust_curves_by_shape { get; set; }
        public bool ajust_shape_by_curves { get; set; }
        public decimal distance_between_curves_in_percent_of_width { get; set; }
        public decimal distance_bt_curves { get; set; }
        public bool is_space_adjust { get; set; }
        public bool is_curve_width_adjust { get; set; }
        public /*int*/string color { get; set; }
        public decimal rectangle_scale_y { get; set; }

    }

    public class typ_side_data
    {
        public typ_parameters parameters { get; set; }
        public int numCurves { get; set; }
        public int idMaterial { get; set; }
        public int idSize { get; set; }


        //public string[] CurveColors { get; set; }
        //public decimal[][][] PointsCurves { get; set; }
        //public int[][] Segments_beg_points_numbers { get; set; } //01112024

        public bool Lockedit { get; set; }
        public bool Fl_manual_parameters { get; set; }
        public decimal M_Material { get; set; }
        public decimal M_Width { get; set; }
        public decimal M_Height { get; set; }
        public decimal M_Length { get; set; }
        public decimal M_Price_rub { get; set; }
        public decimal Part_gap { get; set; } //01112024
        public string[] CurveColors { get; set; }
        public int[][] Segments_beg_points_numbers { get; set; } //01112024
        public decimal[][][] PointsCurves { get; set; }

    }


    public class typ_model_data
    {
        public string stl_model_data { set; get; }
    };




    public struct typ_parameters_for_model_handle
    {
        public IProgressMonitor ProgressMonitor { set; get; }
        public typ_sides_data sides_data { set; get; }
    }



    public class typ_make_model_result_data
    {
        public string common_outfilename_part { set; get; }
        public int number_outfiles { set; get; }

    };

    public class typ_progress_data
    {
        public string client_id { set; get; }
        public string task_id { set; get; }
        public string path_result_file { set; get; }

        public string common_outfilename_part { set; get; }
        public int number_outfiles { set; get; }



        public int progress_indicator { set; get; }
        public DateTime date_time_changed { set; get; }

    };

}
