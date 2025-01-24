//using JbShapeGenerator.AppData;

using System.Drawing;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace JbShapeGenerator.AppCode
{



    //========================================================================================
    public enum enum_work_mode
    {
        test,
        production
    }

    ////******************************************************************************************
    //public struct LangStr
    //{
    //    public const string en = "en";
    //    public const string ru = "ru";

    //};

    ////******************************************************************************************
    //public enum LangNumber
    //{
    //    RusLang,
    //    EngLang
    //};


    ////******************************************************************************************
    //public enum lang_list
    //{
    //    en,
    //    ru

    //};

    //******************************************************************************************
    public enum ListLang
    {
        ru, // русский
        en, // английский
        de, // немецкий
        sp  // испаский
    };

    //******************************************************************************************
    public struct server_commands
    {
        public const string read_screenshot = "read_screenshot";
    }
    //******************************************************************************************
    public struct CommonConstants
    {
        public const string cv_pattern_sentences = @"((?:(?-i)[А-ЯA-Z]).*(?<=(?:[а-яa-z]){2,})\.)";
        public const string cv_pattern_delimiter_sentences = @"(\. |\.\r\n|! |!\r\n|\? |\?\r\n|; |;\r\n|:\r\n)"; //26072023  @"(\. )";
        public const string cv_pattern_phrases = @"([^;|,|.]+)";
        public const string cv_pattern_words = @"(\S+)";
        public const string SeparatorNameSet_from_data = "_@&@_";
        public const string Separator_between_items = "_&&_";
        public const string Separator_from_value = "_@@_";
        public const string Separator_after_hash = "_$$_";
        public const string payment_code_secret = "eLZb3LM4JPxkWM5RpWzL48ue";
        public const string Separator_in_payment_label = "_@_";
        public const string Separator_between_dir = @"\";
        public const string current_theme = "current_theme";
        public const string current_lang = "current_lang";
        public const string Membership_page_Login = "LoginUser";
        public const string Membership_page_Register = "RegisterUser";
        public const string Membership_page_Recovery = "PasswRecovery";
        public const string Separator_from_global_filenumber = "_";
        public const string delim_datetime_label = "@";
        public const string Separator_between_excel_columns_when_read_file = "@##@";
        public const string Separator_lines_crlf = "\r\n";
        public const string session_username = "session_username";
        public const string word_taskId = "taskId";
    }
    //******************************************************************************************
    public struct UsingFileExtensions
    {

        public const string stl = ".stl";       // Файлы stl
        public const string dat = ".dat";       // Файлы с данными фигуры и кривых
        public const string prev = ".prev";     // stl Файл модели до разрезания
        public const string png = ".png";       // графический файл копии экрана с изображением модели
        public const string scr = ".scr";       // копия экрана с изображением модели
        public const string zip = ".zip";       // zip файл
        public const string up  = ".up";        // screenshot upsite файл
        public const string lat  = ".lat";      // screenshot lateral файл
        public const string end  = ".end";      // screenshot end файл

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

    //******************************************************************************************
    public struct AdminSets
    {

        public const string wwwroot_datafiles = "wwwroot/datafiles";

        public const enum_work_mode work_mode = enum_work_mode.test;


        public const string DirDataFiles = "DataFiles"; // Файлы с данными пользователей
        public const string DirSystemFiles = "system_files"; // Постоянные системные файлы

        //public const string DirOutputAudio = "OutputAudios"; // Папка с выходными аудио файлами пользователя
        public const string DirUserLogs = "UserLogs"; // Папка с журналами событий
                                                      //public const int SizeTextBuffer = 524288; //1048576; //8192; // 2^13
                                                      //                                          //public const int Paragraphs_per_page = 5; // Количество параграфов на странице

        //public const string common_files = "common_files";
        //public const string common_sourcetexts = "SourceTexts";
        //public const string common_playblacksets = "PlayBackSets";
        //public const string common_outputaudios = "OutputAudios";

        //public const string DirIdTasks = "IdTasks"; // Файлы с номерами задач
        //public const string task_status_percent = "task_status_percent"; // Имя элемента в Session со значением статуса в процентах текущей долгой задачи
        //public const string UserLogName = "User_Log.txt"; // файл событий пользователя
        //public const string id_task = "id_task"; // Имя элемента в Session со значением идентификатора задачи
        //public const int StackPiece = 500;
        //public const bool is_test = true;
        //public const int UserName_input_lenght = 30;
        //public const int Password_input_lenght = 25;
        //public const int EMail_input_lenght = 50;
        //public const string CommonPlayBackSets_Directory = "CommonPlayBackSets";
        //public const string CommonSourceFilesDirectory = "CommonSourceFiles";



        //public const string PlayBackSets_FileName = "PlayBackSets_ListFiles.txt";
        //public const string path_common_list_SourceTexts = "wwwroot/datafiles/list_common_source_texts.txt";//06032023
        //public const string path_feedback_messages_file = "wwwroot/datafiles/feedback_messages.txt";//06032023
        //public const string path_common_list_PlayBackSets = "wwwroot/datafiles/list_common_playbacksets.txt";//03032023
        //public const string path_common_list_OutputAudios = "wwwroot/datafiles/list_common_audios.txt";//06032023
        //public const string path_paymentlinks = "wwwroot/datafiles/paymentlinks.txt";//11062023
        //public const string watcher_directory = "wwwroot/datafiles/";//03032023

        public const string models_directory = "models";
        public const string models_list_filename = "models_list.txt";

        //public const string path_global_max_file_number = "wwwroot/datafiles/global_max_file_number.txt";//06032023

        //public const int background_fill_list_files_task_interval_in_sec = 30;
        //public const int background_delete_temp_folders_task_interval_in_sec = 900; // 15 мин
        //public const int max_size_input_text_file_mb = 3; //50;// Максимальный размер загружаемого текстового файла
        //public const string wwwroot = "wwwroot";//09032023
        //public const string eval_warning = "Evaluation Warning: The document was created with Spire.Doc for .NET.";

        //public const string yandex_get_link_work = "https://pay.yandex.ru/api/merchant/v1/orders";
        //public const string yandex_get_link_test = "https://sandbox.pay.yandex.ru/api/merchant/v1/orders";

        //public const bool is_just_test_audioMaker = false; //true;
        //public const int ExpirationIntervalRelativeNowInHours = 48; // Интервал устаревания для временных папок в часах 
        //public const decimal max_price_audiofile = 0.5M; // Ограничение на максимальную стоимость выходного аудиофайла 
        public const string path_unic_user_list_files = "wwwroot/datafiles\\initial_model\\models\\models_list.txt";

    }

    // //******************************************************************************************
    public static class UserSets
    {
        public const string postfix_temp = "_tmp"; //25032022 "_temp";
        public const string postfix_user = "_usr"; //25032022 "_user";

        //public const bool IsTestPlay = true;
        //public const bool IsTestPayment = true; // тестирование оплаты
        //public const bool IsPlayCyclic = true;
        //public const int CountPlayRepititions = 2;
        //public const string ResultAudioFilesDirectory = @"ResultAudioFiles";
        //public const int MaxStreamLenght = 30; // Максимальный размер выходного аудиофайла в мегабайтах 10000000;
        //public const ListLang SystemSetRusLang = ListLang.ru;
        //public const ListLang SystemSetEngLang = ListLang.en;
        //public const int Sentences_in_paragraph = 5;
        //public const int Paragraphs_in_page = 5;

        public const string user_datafiles_prefix = "";
        public const string path_user_directory_name = "path_user_directory";
        public const string temp_user_name = "temp_user_name";
        //public const string source_texts = "SourceTexts";//27022023
        //public const string playback_sets = "PlayBackSets";//27022023
        //public const string output_audios = "OutputAudios";//27022023
        public const string temp_files = "temp_files";

        public static bool is_clear_log_at_start = true;

        //public const string delim_datetime_label = "@";
        //public const string list_source_texts = "list_source_texts.txt";
        //public const string initial_playbackset = "initial_playback_set.pbs";
        //public const string list_playbacksets = "list_playbacksets.txt";
        //public const string list_audios = "list_audios.txt";
        //public const string initial_playbacksettings_filename = "Initial playback settings";
        //public const string initial_playbacksettings_descript = "Initial settings - Russian-English phrases 2 times";

        ///public static string path_user_directory; <summary>
        /// public static string path_user_directory;
        /// </summary>
        //public const string filename_list_source_texts = "list_source_texts.txt";
        //public const string filename_list_playbacksets = "list_playbacksets.txt";
        //public const string filename_list_audios = "list_audios.txt";
        //public const string filename_source_data = "source_data.txt";
        //public const string filename_audio_data = "audio_data.txt";
        //public const string filename_description = "description.txt";
        //public const string filename_all_texts = "all_texts.txt";
        //public const string filename_text_snippet = "snippet.txt";
        //public const string filename_audio_snippet = "audio_snippet.mp3";
        //public const string filename_basket = "basket.txt";
        //public const string filename_paid_files = "paid_files.txt";

        //public const decimal koef_translate = 1.0M;  // весовой коэффициент переведённых слов
        //public const decimal koef_tts = 1.0M;  // весовой коэффициент преобразованных в звук слов
        //public const decimal price_playbackset = 0.1M;  // цена набора настроек
        //public const decimal price_divider = 50.0M;    // делитель количества слов при расчёте цены звукового файла

        //public const decimal audio_snippet_duration_sec = 60; // длительность в секундах начального образцового фрагмента аудио файла

        //public const string zip_filename = "EngRusFiles.zip"; // Имя выходного zip-файла
        //public const string filename_user_bonus = "user_bonus.txt";
        //public const string session_username = "session_username";

        //public const decimal bonus_source_divider = 10.0M;    // делитель при определении бонуса за текст
        //public const decimal bonus_playbackset_divider = 1.0M;    // делитель при определении бонуса за настройки
        //public const decimal bonus_audio_divider = 10.0M;    // делитель при определении бонуса за аудио

    }

    //******************************************************************************************
    //public struct gs_PaidFiles
    //{
    //    public string file_name;
    //    public string gnumber;
    //};

    //******************************************************************************************
    public struct EngRusText
    {
        public string TextEng;
        public string TextRus;
    }


    //******************************************************************************************


    public class typ_sides_data
    {
        public typ_color_data ColorParts { set; get; }
        public typ_side_data data1 { set; get; }
        public typ_side_data data2 { set; get; }

    };


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
        //07112024 public int color { get; set; }
        public string color { get; set; } //07112024 
        public decimal rectangle_scale_y { get; set; }
    }



    public class typ_color_data
    {
        public string[][] ColorParts { set; get; }
    }


    public class typ_side_data
    {
        public typ_parameters parameters { get; set; }
        public int numCurves { get; set; }
        public int idMaterial { get; set; }
        public int idSize { get; set; }


        ////public decimal[][][] PointsCurves { get; set; }
        ////public string[] CurveColors { get; set; }

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

    public class typ_united_model_data
    {
        //public typ_sides_data sides_data { set; get; }
        public string model_name { set; get; }
        public string sides_data { set; get; }
        public string prev_model { set; get; }
        public string screenshot { set; get; }

        public string up_side_screenshot { set; get; }
        public string lat_side_screenshot { set; get; }
        public string end_side_screenshot { set; get; }

    };
    //========================================================================================

    //public enum content_types
    //{
    //    only_one_language,
    //    sentence_with_different_language,
    //    paragraph_with_different_language,
    //    one_of_language_is_surrounded_delimiters,
    //    different_languages_in_two_columns,
    //    one_languages_in_one_column,
    //    none
    //};


    //============================================================================

    public enum wide_model_types
    {
        common,
        user,
    };


    //============================================================================

    ////public static class GlobalData
    ////{
    ////    public static string av_path_datafiles { get; set; } = "~/" + AdminSets.wwwroot_datafiles + Path.PathSeparator; // Относительный путь до файлов с данными пользователей

    ////    public static string? av_username_wo_postfix{ get; set; }
    ////    public static string? av_username_postfix { get; set; }
    ////    public static string? av_username_hashed_wo_postfix{ get; set; }
    ////    public static string? av_username_hashed_with_postfix{ get; set; }

    ////    public static string? av_path_unic_user_directory { get; set; }
    ////    public static string? av_unic_user_models_dir { get; set; } // путь до папки model unic user


    ////    //---------------------------------------------------------------------------------------------
    ////    static public void clear_data()
    ////    {

    ////        av_username_wo_postfix = "";
    ////        av_username_postfix = "";
    ////        av_username_hashed_wo_postfix = "";
    ////        av_username_hashed_with_postfix = "";
    ////        av_path_unic_user_directory = "";

    ////    }


    //===================================================================
    ////}



    public struct JQGridResults
    {
        public int page;
        public int total;
        public int records;
        public JQGridRow[] rows;
    }

    public struct JQGridRow
    {
        public int id;
        public string[] cell;
    }





    //=== class Commons ====================================================={
    public class Commons
    {
    }

    //=== class Commons =====================================================}


    public struct gs_ListFiles
    {
        public string path_file_wo_ext { get; set; }
        public string filename { get; set; }
        //public string descr { get; set; }
        public byte[] picture { get; set; }
        ////public string path_file_sides_data { get; set; }
        ////public string path_file_prev_model { get; set; }
        ////public string path_file_final_model { get; set; }
        public wide_model_types wide_model_type { get; set; }
        public string price { get; set; }
        public string change_datetime { get; set; }


        //public string change_time { get; set; }
        //        public string size { get; set; }
        //public string nfiles;
        //public string pathFile;
        //public string gnumber;
        //public string text_theme;
        //public string name;
        //public string descr;
        //public string duration;
        //public int count_loads;
        //public string size;
        //public string sample;
        //public string price;
        //public string change_date;
        //public string change_time;
        //public string username_hash_with_postfix;
        //public string last_folder_name;
        //public bool is_paid_by_user;
        //public string pathTextSourceFile;
        //public string pathPlayBackFile;
        //public string username_hash_with_postfix_SourceFile;
        //public string username_hash_with_postfix_PlayBackFile;
        //public bool is_shared_source_file;
        //public bool is_shared_playback_file;
        //public bool is_shared_audio_file;
        //public decimal price_translate;
        //public decimal price_playbackset;
        //public decimal price_tts;

    };



    public static class CommonMethods
    {

        //-----------------------------------------------------------------------------------------------
        // Создание директории, если не существует
        public static void create_directory_if_no_exist(string? pv_path_dir/*, GlobalSessionData po_GlobalSessionData*/)
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
                    //// Формирование аварийного статуса задачи -1
                    //ProgressMonitor.SetStatus(-1);

                    //// Занесение в журнал событий
                    //po_GlobalSessionData.ao_indexModel.LogMessage(ex);
                }

            }
        }
        //-----------------------------------------------------------------------------------------------
        // Чтение данных из сессии
        public static string get_str_from_session(ISession po_session, string pv_name_parameter)
        {
            string? lv_result = "";

            try
            {

                if (po_session != null)
                {
                    if (pv_name_parameter != null && pv_name_parameter != "")
                    {
                        lv_result = po_session.GetString(pv_name_parameter);
                    }
                }

            }
            catch (Exception ex)
            {

            }

            return lv_result;
        }

        //-----------------------------------------------------------------------------------------------
        // Запись данных в сессию
        internal static void set_str_from_session(ISession po_session, string pv_name_parameter, string pv_value)
        {
            try
            {

                if (po_session != null)
                {
                    if (pv_name_parameter != null && pv_name_parameter != "")
                    {
                        po_session.SetString(pv_name_parameter, pv_value);
                    }
                }

            }
            catch (Exception ex)
            {

            }
        }




        //----------------------------------------------------------------------------------------------------------
        internal static async Task<string> CheckFileExist(string pv_file_path)
        {
            string lv_result = "false";

            if (File.Exists(pv_file_path))
            {
                lv_result = "true";
            }

            return lv_result;
        }



        ////----------------------------------------------------------------------------------------------------------
        //internal static async Task<string> CheckFilesExistByMask(string pv_path_dir, string pv_file_mask)
        //{
        //    string lv_result = "false";

        //    if (File.Exists(lv_path_filename))
        //    {
        //        lv_result = "true";
        //    }

        //    return lv_result;
        //}






        //============================================================================================
        public enum GridFieldsSet
        {
            ListModelFiles //,
            //user_list_files
        };

        public static int Get_num_by_name_column(GridFieldsSet pv_grid_fields_set, string pv_column_name)
        {

            //--------------------------------------------------------------------------------------------
            System.Collections.Generic.Dictionary<string, int>

                lv_ListModelFiles_dictionary = new System.Collections.Generic.Dictionary<string, int>()
                  {


        //public string path_file_wo_ext { get; set; }
        //public string filename { get; set; }
        ////public string descr { get; set; }
        //public byte[] picture { get; set; }
        //////public string path_file_sides_data { get; set; }
        //////public string path_file_prev_model { get; set; }
        //////public string path_file_final_model { get; set; }
        //public wide_model_types wide_model_type { get; set; }
        //public string price { get; set; }
        //public string change_datetime { get; set; }




                    { "wide_model_types"        ,0 },
                    { "path_file_wo_ext"        ,1 },
                    { "filename"                ,2 },
                    //{ "descr"                  ,3 },
                    { "picture"                 ,3 },
                    //{ "path_file_sides_data"    ,2 },
                    //{ "path_file_prev_model"    ,3 },
                    //{ "path_file_final_model"   ,4 },
                    { "price"                   ,4 },
                    { "change_datetime"         ,5 }


                    //{ "nfiles",0 },
                    //{ "pathFile",1 },
                    //{ "gnumber",2 },
                    //{ "text_theme",3 },
                    //{ "name",4 },
                    //{ "descr",5 },
                    //{ "basket",6 },
                    //{ "is_paid",7 },
                    //{ "audio_snippet",8 },
                    //{ "text_snippet",9 },
                    //{ "price",10 },
                    //{ "duration",11 },
                    //{ "numloads",12},
                    //{ "size",13 },
                    //{ "chanhge_date",14 },
                    //{ "change_time",15 },
                    //{ "path_for_audio_snippet",16 },
                    //{ "is_paid_by_user",17 }
                  };

            //System.Collections.Generic.Dictionary<string, int>
            //    lv_user_list_files_dictionary = new System.Collections.Generic.Dictionary<string, int>()
            //      {
            //        { "nfiles",0 },
            //        { "pathFile",1 },
            //        { "gnumber",2 },
            //        { "text_theme",3 },
            //        { "name",4 },
            //        { "descr",5 },
            //        { "basket",6 },
            //        { "is_paid",7 },
            //        { "audio_snippet",8 },
            //        { "text_snippet",9 },
            //        { "price",10 },
            //        { "duration",11 },
            //        { "numloads",12 },
            //        { "size",13 },
            //        { "chanhge_date",14 },
            //        { "change_time",15 },
            //        { "path_for_audio_snippet",16 },
            //        { "is_paid_by_user",17 }
            //      };



            //-----------------------------------------------------------------------------
            int lv_answer = -1;

            switch (pv_grid_fields_set)
            {
                case GridFieldsSet.ListModelFiles:

                    lv_answer = lv_ListModelFiles_dictionary[pv_column_name];
                    break;

                    //case GridFieldsSet.user_list_files:

                    //    lv_answer = lv_user_list_files_dictionary[pv_column_name];
                    //    break;

            }

            return lv_answer;
        }

        //---------------------------------------------------------------------------------------------------

    } //==  end class CommonMethods =============================================================================

}
