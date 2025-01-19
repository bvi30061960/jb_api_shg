using Microsoft.CodeAnalysis.CSharp.Syntax;
using System.Net;
using System.Security.Cryptography;
using System.Text;


using System.IO;
using System.Security.AccessControl;
using Azure.Core;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace JbShapeGenerator.AppCode
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
        static public void Clear_names_and_paths()
        {

            av_username_wo_postfix = "";
            av_username_postfix = "";
            av_username_hashed_wo_postfix = "";
            av_username_hashed_with_postfix = "";
            av_path_unic_user_directory = "";

        }




        static public string Get_random_name()
        //---------------------------------------------------------------------------------------------
        {
            string lv_result = "";

            // lv_result = Guid.NewGuid().ToString(); //- слишком длинное получается название

            lv_result = Path.GetFileNameWithoutExtension(Path.GetRandomFileName()) + DateTime.Now.Ticks.ToString();

            return lv_result;
        }

        static public /*string*/void Get_session_username_by_PageContext(PageContext po_context)
        //---------------------------------------------------------------------------------------------
        {
            //string lv_result = "";

            ISession lo_session = po_context.HttpContext.Session;

            string lv_session_username = "";

            string lv_identity_name = po_context.HttpContext.User.Identity.Name;

            if (lv_identity_name != null && lv_identity_name != "")
            {
                lv_session_username = lv_identity_name;
                av_username_postfix = UserSets.postfix_user;

            }
            else
            {
                lv_session_username = CommonMethods.get_str_from_session(lo_session, CommonConstants.session_username);
                av_username_postfix = UserSets.postfix_temp;

            }


            av_username_wo_postfix = lv_session_username; // pv_username;

            if (av_username_wo_postfix == null || av_username_wo_postfix == "")
            {
                av_username_wo_postfix = Get_random_name();

                // Запоминание в сессии имени пользователя
                CommonMethods.set_str_from_session(lo_session, CommonConstants.session_username, av_username_wo_postfix);

            }
            //else
            //{
            //    GlobalData.av_username_postfix = UserSets.postfix_user;
            //}




            av_username_hashed_wo_postfix = Get_hash_code_wo_spec_symbols(av_username_wo_postfix);
            av_username_hashed_with_postfix = av_username_hashed_wo_postfix + av_username_postfix;

            //lv_result = av_username_wo_postfix;

            //return lv_result;
        }


        static public void Create_names_and_directories(PageContext po_PageContext/*string? pv_username*/ )
        //---------------------------------------------------------------------------------------------
        {
            Clear_names_and_paths();


            //string lv_session_username = HandlePathsAndNames.get_session_username_by_PageContext(po_PageContext);

            HandlePathsAndNames.Get_session_username_by_PageContext(po_PageContext);
            //    av_username_postfix
            //    av_username_wo_postfix
            //    av_username_hashed_wo_postfix
            //    av_username_hashed_with_postfix



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


            av_path_unic_user_directory = Get_unic_user_directory_by_hashed_username_postfix(av_username_hashed_with_postfix);
            CommonMethods.create_directory_if_no_exist(av_path_unic_user_directory);

            //GlobalData.av_unic_model_path_and_filename = get_unic_model_path_and_filename(av_path_unic_user_directory);


            av_unic_user_models_dir = Path.Combine(av_path_unic_user_directory, AdminSets.models_directory);
            CommonMethods.create_directory_if_no_exist(av_unic_user_models_dir);

            av_path_unic_user_list_files = Path.Combine(av_unic_user_models_dir, AdminSets.models_list_filename);
        }

        //----------------------------------------------------------------------------------------------------------------
        public static string? Get_unic_user_directory_by_hashed_username_postfix(string pv_user_name_hashed_with_postfix)
        {
            string lv_wwwroot_datafiles_directory = AdminSets.wwwroot_datafiles;
            return Path.Combine(lv_wwwroot_datafiles_directory, pv_user_name_hashed_with_postfix);
        }


        //----------------------------------------------------------------------------------------------------------------

        static public string Get_hash_code(string pv_value)
        //---------------------------------------------------------------------------------------------
        {
            string lv_answer = "";

            var md5 = MD5.Create();

            var lv_hash = md5.ComputeHash(Encoding.UTF8.GetBytes(pv_value));
            lv_answer = Convert.ToBase64String(lv_hash);

            return lv_answer;
        }
        //---------------------------------------------------------------------------------------------
        public static string Get_hash_code_wo_spec_symbols(string pv_input)
        {
            string lv_answer = Get_hash_code(pv_input);

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
        public static string? Get_full_path_with_unic_filename(string pv_extension_with_dot)
        {
            string lv_result = "";

            string lv_filename = Get_random_name() + pv_extension_with_dot;

            string lv_unic_user_unic_dir = Path.Combine(av_path_unic_user_directory, AdminSets.models_directory);

            CommonMethods.create_directory_if_no_exist(lv_unic_user_unic_dir);

            lv_result = Path.Combine(av_path_unic_user_directory, Path.Combine(AdminSets.models_directory, lv_filename));

            return lv_result;
        }

        //----------------------------------------------------------------------------------------------------------------
        public static string? Get_full_path_with_hashed_filename(string pv_filename, string pv_extension_with_dot, bool pv_is_get_hash)
        {
            string lv_result = "";


            string lv_filename = "";

            if (pv_is_get_hash)
            {
                //string lv_filename = get_random_name() + pv_extension_with_dot;
                lv_filename = Get_hash_code_wo_spec_symbols(pv_filename) + pv_extension_with_dot;
            }
            else
            {
                lv_filename = pv_filename + pv_extension_with_dot;
            }


            string lv_unic_user_unic_dir = Path.Combine(av_path_unic_user_directory, AdminSets.models_directory);

            CommonMethods.create_directory_if_no_exist(lv_unic_user_unic_dir);

            lv_result = Path.Combine(av_path_unic_user_directory, Path.Combine(AdminSets.models_directory, lv_filename));

            return lv_result;
        }


        //=============================================================================================
    }
}
