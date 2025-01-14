using Azure;
using Azure.Core;
using Humanizer;
using JbShapeGenerator.AppCode;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.DotNet.MSIdentity.Shared;
using Newtonsoft.Json;
using NuGet.Protocol.Plugins;
using System;

using System.IO;
using System.Text.Json;
using System.Text.Json.Serialization.Metadata;

namespace JbShapeGenerator.Pages
{

    [IgnoreAntiforgeryToken] //21092024

    public class IndexModel : PageModel
    {
        private readonly ILogger<IndexModel> _logger;

        public IndexModel(ILogger<IndexModel> logger)
        {
            _logger = logger;
        }


        ////private string? _tag_prefix;
        ////public string tag_prefix
        ////{
        ////    get { return _tag_prefix; }
        ////    set { _tag_prefix = value; }

        ////}


        public void OnGet()
        {

        }

        public void OnPost()
        ///public async Task<IActionResult> OnPost()
        {
            //return StatusCode(200);
        }

        //-----------------------------------------------------------------------------------------------------
        public async Task<IActionResult> OnGetProgressStatus()
        {
            return new OkObjectResult(ProgressStatus.ProgressValue);
        }


        //-----------------------------------------------------------------------------------------------------
        public async Task<IActionResult> OnGetCheckFileExistOnServer()
        {

            string lv_result = "false";
            string? lv_filename = "";


            try
            {
                lv_filename = Request.Query["filename"];
                if (lv_filename != null && lv_filename != "")
                {

                    HandlePathsAndNames.Create_names_and_directories(PageContext);


                    string lv_path_and_name_file = HandlePathsAndNames.Get_full_path_with_hashed_filename(lv_filename, UsingFileExtensions.dat);
                    lv_result = await CommonMethods.CheckFileExist(lv_path_and_name_file);
                }

            }
            catch (Exception ex)
            {
                return new OkObjectResult("false");
            }

            return new OkObjectResult(lv_result);

        }




        //-----------------------------------------------------------------------------------------------------

        async public Task<IActionResult> OnPostSaveModel()
        {
            return await HandleModel.SaveModel(Request, PageContext);
        }

        //-----------------------------------------------------------------------------------------------------
        public async Task<IActionResult> OnGetReadScreenshot()
        {

            string lv_result = "";

            string? lv_path_filename = "";


            try
            {


                lv_path_filename = Request.Query["pathfilename"];
                if (lv_path_filename != null && lv_path_filename != "")
                {
                    ////lv_path_model_part = Path.Combine(Environment.CurrentDirectory,
                    ////                        Path.Combine(CommonConstants.path_AppData,
                    ////                            Path.Combine(CommonConstants.path_temp_data), lv_filename));


                    //return ActionResult<File>
                    //return   (lv_path_filename); //13102024

                    //await Response.SendFileAsync(lv_path_filename);

                    lv_result = await HandleModel.ReadTextFile(lv_path_filename);
                }

            }
            catch (Exception ex)
            {
                //return Results.Empty;
                return new OkObjectResult("");
            }

            return new OkObjectResult(lv_result);

        }
        //-----------------------------------------------------------------------------------------------------
        public async Task<IActionResult> OnGetReadModelFromServer()
        {


            string lv_result = "";

            string? lv_path_filename = "";


            try
            {

                //28102024 {

                HandlePathsAndNames.Clear_names_and_paths();
                HandlePathsAndNames.Create_names_and_directories(PageContext);



                //if (lv_path_filename != null && lv_path_filename != "")
                //{
                //    lv_result = await HandleModel.ReadTextFile(lv_path_filename);
                //}


                string? lv_path_model = Request.Query["pathmodel"];

                bool lv_is_initial_load = false;
                //try
                //{
                lv_is_initial_load = bool.TryParse(Request.Query["initial_load"], out lv_is_initial_load);
                //}
                //catch (Exception ex)
                //{

                //}



                typ_united_model_data lo_united_model_data = await HandleModel.ReadUnitedModelData(lv_path_model, lv_is_initial_load);


                lv_result = JsonConvert.SerializeObject(lo_united_model_data);

                //28102024 }


            }
            catch (Exception ex)
            {
                //return Results.Empty;
                return new OkObjectResult("");
            }

            return new OkObjectResult(lv_result);
        }






        //-----------------------------------------------------------------------------------------------------
        public async Task<IActionResult> OnGetReadModelPartsZipFile()
        //public async Task<byte[]> OnGetReadModelPartsZipFile()
        {


            byte[] lv_result = null;

            string? lv_path_filename = "";


            try
            {

                HandlePathsAndNames.Clear_names_and_paths();
                HandlePathsAndNames.Create_names_and_directories(PageContext);



                string? lv_filename_zip = Request.Query["filename"];


                lv_path_filename = Path.Combine(HandlePathsAndNames.av_unic_user_models_dir, lv_filename_zip);

                lv_result = await HandleModel.ReadBinaryFile(lv_path_filename);


            }
            catch (Exception ex)
            {
                //return null;
                return new OkObjectResult("");
            }

            //return new OkObjectResult(lv_result);

            return File(lv_result, "application/zip" /*, "example.zip"*/ );
        }








        //-----------------------------------------------------------------------------------------------------
        public async Task<IActionResult> OnGetReadListModels()
        {

            string lv_res_str = "";
            try
            {

                HandlePathsAndNames.Create_names_and_directories(PageContext);


                jqGridSelectListModelFiles lo_grid_list_models = new jqGridSelectListModelFiles();

                JQGridResults lv_ob_result = await lo_grid_list_models.ProcessRequest(PageContext.HttpContext);

                lv_res_str = JsonConvert.SerializeObject(lv_ob_result);

            }
            catch (Exception ex)
            {
                //// ������������ ���������� ������� ������ -1
                //ProgressMonitor.SetStatus(-1);

                //// ��������� � ������ �������
                //ao_GlobalSessionData.ao_indexModel.LogMessage(ex);

            }

            return new OkObjectResult(lv_res_str);

        }



    }
}
