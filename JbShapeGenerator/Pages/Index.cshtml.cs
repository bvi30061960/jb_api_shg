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

        async public Task<IActionResult> OnPostSaveModel()
        {
            return await HandleModel.SaveModel(Request, PageContext);
        }


        //-----------------------------------------------------------------------------------------------------
         
        //public IActionResult OnGetReadListModels(/*string pv_taskid*/)
        public async Task<IActionResult> OnGetReadListModels(/*string pv_taskid*/)
        {

            HandlePathsAndNames.Create_names_and_directories(PageContext/*Request.HttpContext.User.Identity.Name*/);

            string lv_res_str = "";
            try
            {
                ////ao_GlobalSessionData = new GlobalSessionData(this); //25102023
                ////ao_GlobalSessionData.ao_indexModel = this;// Глобальная ссылка на класс
                ////ao_GlobalSessionData.CreateApplPathDirectories();
                ////ao_GlobalSessionData.ao_DataManager = ao_DataManager;//27072023
                ////ao_GlobalSessionData.ReadConfiguration(ao_Configuration);//31102023
                ////                                                         //28102023 }



                jqGridSelectListModelFiles lo_grid_list_models = new jqGridSelectListModelFiles(/*ao_GlobalSessionData*/);

                JQGridResults lv_ob_result = await lo_grid_list_models.ProcessRequest(PageContext.HttpContext);

                lv_res_str = JsonConvert.SerializeObject(lv_ob_result);

            }
            catch (Exception ex)
            {
                //// Формирование аварийного статуса задачи -1
                //ProgressMonitor.SetStatus(-1);

                //// Занесение в журнал событий
                //ao_GlobalSessionData.ao_indexModel.LogMessage(ex);

            }

            return new OkObjectResult(lv_res_str);


            //string lv_res_str = JsonConvert.SerializeObject(""/*lv_ob_result*/);

            //return new OkObjectResult(lv_res_str);

        }



    }
}
