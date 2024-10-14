using Microsoft.CodeAnalysis.CSharp.Syntax;
using System.Net;
using System.Security.Cryptography;
using System.Text;


using System.IO;
using System.Security.AccessControl;
using Azure.Core;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace JbShapeGenerator.AppData
{
    public static class HandlePathsAndNames
    {

        public static string av_path_datafiles { get; set; } = "~/" + AdminSets.wwwroot_datafiles + Path.PathSeparator; // Относительный путь до файлов с данными пользователей

        public static string? av_username_wo_postfix { get; set; }
        public static string? av_username_postfix { get; set; }
        public static string? av_username_hashed_wo_postfix { get; set; }
        public static string? av_username_hashed_with_postfix { get; set; }

        public static string? av_path_unic_user_directory { get; set; }
        public static string? av_unic_user_models_dir { get; set; } // путь до папки model unic user

        public static string? av_path_unic_user_list_files { get; set; }

        //---------------------------------------------------------------------------------------------
        static public void clear_names_and_paths()
        {

            av_username_wo_postfix = "";
            av_username_postfix = "";
            av_username_hashed_wo_postfix = "";
            av_username_hashed_with_postfix = "";
            av_path_unic_user_directory = "";

        }




        static public string get_random_name()
        //---------------------------------------------------------------------------------------------
        {
            string lv_result = "";

            // lv_result = Guid.NewGuid().ToString(); //- слишком длинное получается название

            lv_result = Path.GetFileNameWithoutExtension(Path.GetRandomFileName()) + DateTime.Now.Ticks.ToString();

            return lv_result;
        }

        static public string get_session_username_by_PageContext(PageContext po_context )
        //---------------------------------------------------------------------------------------------
        {
            string lv_result = "";

            ISession lo_session = po_context.HttpContext.Session;

            string lv_session_username = "";

            //Request.HttpContext.User.Identity.Name

            //PageContext.HttpContext.Session

            string lv_identity_name = po_context.HttpContext.User.Identity.Name;

            if (lv_identity_name != null && lv_identity_name != "")
            {
                lv_session_username = lv_identity_name;
                HandlePathsAndNames.av_username_postfix = UserSets.postfix_user;

            }
            else
            {
                lv_session_username = CommonMethods.get_str_from_session(lo_session, CommonConstants.session_username);
                HandlePathsAndNames.av_username_postfix = UserSets.postfix_temp;

            }


            HandlePathsAndNames.av_username_wo_postfix = lv_session_username; // pv_username;

            if (HandlePathsAndNames.av_username_wo_postfix == null || HandlePathsAndNames.av_username_wo_postfix == "")
            {
                HandlePathsAndNames.av_username_wo_postfix = get_random_name();

                //GlobalData.av_username_postfix = UserSets.postfix_temp;

                // Запоминание в сессии имени пользователя
                CommonMethods.set_str_from_session(lo_session, CommonConstants.session_username, HandlePathsAndNames.av_username_wo_postfix);

            }
            //else
            //{
            //    GlobalData.av_username_postfix = UserSets.postfix_user;
            //}




            HandlePathsAndNames.av_username_hashed_wo_postfix = get_hash_code_wo_spec_symbols(HandlePathsAndNames.av_username_wo_postfix);
            HandlePathsAndNames.av_username_hashed_with_postfix = HandlePathsAndNames.av_username_hashed_wo_postfix + HandlePathsAndNames.av_username_postfix;

            lv_result = HandlePathsAndNames.av_username_wo_postfix;

            return lv_result;
        }


            static public void create_names_and_directories(string pv_username)
        //---------------------------------------------------------------------------------------------
        {

            //GlobalData.av_username_postfix = UserSets.postfix_temp;

            //string lv_username = pv_username;

            //GlobalData.av_path_datafiles = "~/" + AdminSets.wwwroot_datafiles + Path.PathSeparator;

            ////GlobalData.av_username_wo_postfix = pv_username;

            ////if (GlobalData.av_username_wo_postfix == null || GlobalData.av_username_wo_postfix == "")
            ////{
            ////    GlobalData.av_username_wo_postfix = get_random_name();

            ////    GlobalData.av_username_postfix = UserSets.postfix_temp;
            ////}
            ////else
            ////{
            ////    GlobalData.av_username_postfix = UserSets.postfix_user;
            ////}

            ////GlobalData.av_username_hashed_wo_postfix = get_hash_code_wo_spec_symbols(GlobalData.av_username_wo_postfix);
            ////GlobalData.av_username_hashed_with_postfix = GlobalData.av_username_hashed_wo_postfix + GlobalData.av_username_postfix;


            HandlePathsAndNames.av_path_unic_user_directory = get_unic_user_directory_by_hashed_username_postfix(HandlePathsAndNames.av_username_hashed_with_postfix);
            CommonMethods.create_directory_if_no_exist(HandlePathsAndNames.av_path_unic_user_directory);

            //GlobalData.av_unic_model_path_and_filename = get_unic_model_path_and_filename(av_path_unic_user_directory);


            HandlePathsAndNames.av_unic_user_models_dir = Path.Combine(HandlePathsAndNames.av_path_unic_user_directory, AdminSets.models_directory);
            CommonMethods.create_directory_if_no_exist(HandlePathsAndNames.av_unic_user_models_dir);

            HandlePathsAndNames.av_path_unic_user_list_files = Path.Combine(HandlePathsAndNames.av_unic_user_models_dir, AdminSets.models_list_filename);
        }

        //----------------------------------------------------------------------------------------------------------------
        public static string? get_unic_user_directory_by_hashed_username_postfix(string pv_user_name_hashed_with_postfix)
        {
            string lv_wwwroot_datafiles_directory = AdminSets.wwwroot_datafiles;
            return Path.Combine(lv_wwwroot_datafiles_directory, pv_user_name_hashed_with_postfix);
        }


        //----------------------------------------------------------------------------------------------------------------

        static public string get_hash_code(string pv_value)
        //---------------------------------------------------------------------------------------------
        {
            string lv_answer = "";

            var md5 = MD5.Create();

            var lv_hash = md5.ComputeHash(Encoding.UTF8.GetBytes(pv_value));
            lv_answer = Convert.ToBase64String(lv_hash);

            return lv_answer;
        }
        //---------------------------------------------------------------------------------------------
        public static string get_hash_code_wo_spec_symbols(string pv_input)
        {
            string lv_answer = get_hash_code(pv_input);

            lv_answer = WebUtility.HtmlEncode(lv_answer).ToUpper();

            lv_answer = lv_answer.Replace(@"!", string.Empty);
            lv_answer = lv_answer.Replace(@"@", string.Empty);
            lv_answer = lv_answer.Replace(@"#", string.Empty);
            lv_answer = lv_answer.Replace(@"$", string.Empty);
            lv_answer = lv_answer.Replace(@"%", string.Empty);
            lv_answer = lv_answer.Replace(@"^", string.Empty);
            lv_answer = lv_answer.Replace(@"&", string.Empty);
            lv_answer = lv_answer.Replace(@"*", string.Empty);
            lv_answer = lv_answer.Replace(@"(", string.Empty);
            lv_answer = lv_answer.Replace(@")", string.Empty);
            lv_answer = lv_answer.Replace(@"-", string.Empty);
            lv_answer = lv_answer.Replace(@"+", string.Empty);
            lv_answer = lv_answer.Replace(@"=", string.Empty);
            lv_answer = lv_answer.Replace(@"{", string.Empty);
            lv_answer = lv_answer.Replace(@"}", string.Empty);
            lv_answer = lv_answer.Replace(@"[", string.Empty);
            lv_answer = lv_answer.Replace(@"]", string.Empty);
            lv_answer = lv_answer.Replace(@"|", string.Empty);
            lv_answer = lv_answer.Replace(@" ", string.Empty);
            lv_answer = lv_answer.Replace(@".", string.Empty);
            lv_answer = lv_answer.Replace(@"/", string.Empty);
            lv_answer = lv_answer.Replace(@"\", string.Empty);
            lv_answer = lv_answer.Replace(@":", string.Empty);
            lv_answer = lv_answer.Replace(@",", string.Empty);

            return lv_answer;
        }

        //----------------------------------------------------------------------------------------------------------------
        public static string? get_full_path_with_unic_filename(string pv_extension_with_dot)
        {
            string lv_result = "";

            string lv_filename = get_random_name() + pv_extension_with_dot;

            string lv_unic_user_unic_dir = Path.Combine(HandlePathsAndNames.av_path_unic_user_directory, AdminSets.models_directory);

            CommonMethods.create_directory_if_no_exist(lv_unic_user_unic_dir);

            lv_result = Path.Combine(HandlePathsAndNames.av_path_unic_user_directory, Path.Combine(AdminSets.models_directory, lv_filename));

            return lv_result;
        }

        //----------------------------------------------------------------------------------------------------------------
        public static string? get_full_path_with_hashed_filename(string pv_filename, string pv_extension_with_dot)
        {
            string lv_result = "";

            //string lv_filename = get_random_name() + pv_extension_with_dot;
            string lv_filename = get_hash_code_wo_spec_symbols(pv_filename) + pv_extension_with_dot;

            string lv_unic_user_unic_dir = Path.Combine(HandlePathsAndNames.av_path_unic_user_directory, AdminSets.models_directory);

            CommonMethods.create_directory_if_no_exist(lv_unic_user_unic_dir);

            lv_result = Path.Combine(HandlePathsAndNames.av_path_unic_user_directory, Path.Combine(AdminSets.models_directory, lv_filename));

            return lv_result;
        }


        //=============================================================================================
    }
}
