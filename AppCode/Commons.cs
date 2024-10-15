namespace jb_api_shg.AppCode
{

    //******************************************************************************************
    public struct CommonConstants
    {

        public const string method_refresh_premodel = "refresh_premodel";
        public const string method_make_model = "make_model";
        public const string method_read_model_parts = "read_model_parts";


        public const string path_AppData = "AppData";
        public const string path_temp_data = "temp_data";


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
    }



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
    }


}
