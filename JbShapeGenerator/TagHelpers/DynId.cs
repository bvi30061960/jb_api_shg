using Microsoft.AspNetCore.Razor.TagHelpers;

namespace JbShapeGenerator.TagHelpers
{
    public class DynIdTagHelper : TagHelper
    {
        public string? SufId { get; set; }
        public override void Process(TagHelperContext context, TagHelperOutput output)
        {
            foreach (TagHelperAttribute lv_th in context.AllAttributes)
            {
                if (lv_th.Name == "tag")
                {
                    output.TagName = lv_th.Value.ToString();

                    //if (lv_th.Value.ToString() == "div")
                    //{
                    //    output.TagMode = TagMode.StartTagOnly;
                    //}
                    //else
                    //{
                    //    output.TagMode = TagMode.StartTagAndEndTag;

                    //}

                }
                else
                {
                    if (lv_th.Name == "id" || lv_th.Name == "for")
                    {
                        output.Attributes.SetAttribute(lv_th.Name, SufId + "_" + lv_th.Value);
                    }
                    else
                    {
                        output.Attributes.SetAttribute(lv_th.Name, lv_th.Value);
                    }

                }
            }
            output.Content.SetContent("");
        }
    }
}

