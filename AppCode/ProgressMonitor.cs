using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.RazorPages;

using Newtonsoft.Json;

namespace jb_api_shg.AppCode
{
    public interface IProgressMonitor
    {
        //void SetStatus(/*int pv_taskId,*/ object pv_message);
        void SetStatus(typ_monitor_refresh_status pv_message);
        string GetStatus(/*int pv_taskId*/);
    }


    public class ProgressMonitor : IProgressMonitor
    {

        //public PageContext ao_pageContext { set; get; }
        public ISession ao_session { set; get; }


        public string av_taskId { set; get; }

        //typ_monitor_refresh_answer


        public ProgressMonitor(/*PageContext po_PageContext,*/ISession po_session, string pv_taskId)
        {
            //ao_pageContext = po_PageContext;

            ao_session = po_session;
            av_taskId = pv_taskId;
        }

        // Установка текущего статуса задачи
        //public void SetStatus(/*int pv_taskId, */object pv_message)
        public void SetStatus(typ_monitor_refresh_status pv_message)
        {
            string lv_message_str = JsonConvert.SerializeObject(pv_message);
            //ao_pageContext.HttpContext.Session.SetString(av_taskId.ToString(), pv_message.ToString());
            //ao_session.SetString(av_taskId.ToString(), pv_message.ToString());
            ao_session.SetString(av_taskId.ToString(), lv_message_str);

        }

        // Чтение текущего статуса задачи

        public string GetStatus(/*int pv_taskId*/)
        {
            //object lo_obj = ao_pageContext.HttpContext.Session.GetString(av_taskId.ToString());
            //object lo_obj = ao_session.GetString(av_taskId.ToString());

            string lv_message_str = ao_session.GetString(av_taskId);

            //if (lo_obj == null)
            if (lv_message_str == null)
            {
                return String.Empty;
            }

            //typ_monitor_refresh_status lo_message = JsonConvert.DeserializeObject<typ_monitor_refresh_status>(lv_message_str);



            //return (string)lo_obj;
            return lv_message_str;

        }
    }

}
