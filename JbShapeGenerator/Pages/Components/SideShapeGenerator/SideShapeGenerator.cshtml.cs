//04102024 using JbShapeGenerator.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace JbShapeGenerator.Pages.Components.SideShapeGenerator
{
    public class SideShapeGenerator : ViewComponent 
    {
        //public void OnGet()
        //{
        //}

        public IViewComponentResult Invoke(string id_prefix)

        //public async Task<IViewComponentResult> InvokeAsync( string tag_prefix )
        {

            //SideShapeGeneratorModel lo_model = new SideShapeGeneratorModel();
            //IndexModel lo_index_model = 

            ViewData["id_prefix"] = id_prefix;
            return View("SideShapeGenerator");
        }



        ////public async Task<IViewComponentResult> InvokeAsync(
        ////                    string contain_tab_name,
        ////                    bool is_use_block_settings,
        ////                    bool use_block_settings_visible
        ////                                                     )
        ////{
        ////    SideShapeGeneratorModel lo_model = new SideShapeGeneratorModel();

        ////    ////lo_model.contain_tab_name = contain_tab_name;
        ////    ////lo_model.is_use_block_settings = is_use_block_settings;
        ////    ////lo_model.use_block_settings_visible = use_block_settings_visible;


        ////    return View(lo_model);

        ////}





    }
}
