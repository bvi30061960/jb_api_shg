using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.RazorPages;

using Newtonsoft.Json;

namespace jb_api_shg.AppCode
{


    public class typ_progress_status
    {
        public string client_id { set; get; }
        public string task_id { set; get; }
        public string path_result_file { set; get; }
        public int progress_indicator { set; get; }
        public DateTime date_time_changed { set; get; }

    };

    ////----------------------------------------------------------------------------------------------
    //public interface IProgressMonitor
    //{
    //    void SetStatus(typ_progress_status pv_message);
    //    string GetStatus(/*int pv_taskId*/);
    //}

    //----------------------------------------------------------------------------------------------
    public interface IProgressMonitor
    {
        void SetStatus(typ_progress_status ps_status);
        bool GetStatus(string pv_key, ref typ_progress_status ps_status);
    }
    ////public class ProgressMonitor : IProgressMonitor
    ////{

    ////    //public PageContext ao_pageContext { set; get; }
    ////    public ISession ao_session { set; get; }

    ////    //private ISession session => httpContext.Session;

    ////    public string av_taskId { set; get; }

    ////    //typ_monitor_refresh_answer

    ////    //public ISession ao_session { set; get; }
    ////    public ProgressMonitor(/*PageContext po_PageContext,*/ISession po_session, string pv_taskId)
    ////    {
    ////        //ao_pageContext = po_PageContext;

    ////        ao_session = po_session;
    ////        av_taskId = pv_taskId;
    ////    }

    ////    // Установка текущего статуса задачи
    ////    //public void SetStatus(/*int pv_taskId, */object pv_message)
    ////    public void SetStatus(typ_progress_status pv_message)
    ////    {
    ////        try
    ////        {
    ////            string lv_message_str = "123";// JsonConvert.SerializeObject(pv_message);
    ////            //ao_pageContext.HttpContext.Session.SetString(av_taskId.ToString(), pv_message.ToString());
    ////            //ao_session.SetString(av_taskId.ToString(), pv_message.ToString());


    ////            ao_session.SetString(av_taskId, lv_message_str);

    ////            //ao_session.SetString(av_taskId, lv_message_str);


    ////        }
    ////        catch (Exception ex)
    ////        {

    ////        }

    ////    }

    ////    // Чтение текущего статуса задачи

    ////    public string GetStatus(/*int pv_taskId*/)
    ////    {
    ////        //object lo_obj = ao_pageContext.HttpContext.Session.GetString(av_taskId.ToString());
    ////        //object lo_obj = ao_session.GetString(av_taskId.ToString());

    ////        string lv_message_str = ao_session.GetString(av_taskId);

    ////        //if (lo_obj == null)
    ////        if (lv_message_str == null)
    ////        {
    ////            return String.Empty;
    ////        }

    ////        //typ_monitor_refresh_status lo_message = JsonConvert.DeserializeObject<typ_monitor_refresh_status>(lv_message_str);



    ////        //return (string)lo_obj;
    ////        return lv_message_str;

    ////    }
    ////}

    //===================================================================================



    public class ProgressMonitor : IProgressMonitor
    {

        Dictionary<string, typ_progress_status> ao_status_list { set; get; }

        //--------------------------------------------------------------------------
        public ProgressMonitor()
        {
            ao_status_list = new Dictionary<string, typ_progress_status>();
        }

        //--------------------------------------------------------------------------
        static public string GetKey(typ_progress_status pv_message)
        {
            return pv_message.client_id + "_" + pv_message.task_id;
        }



        //--------------------------------------------------------------------------
        // Установка текущего статуса задачи
        public void SetStatus(typ_progress_status ps_status)
        {
            try
            {
                string lv_key = GetKey(ps_status);

                ao_status_list.Remove(lv_key);

                ao_status_list.Add(lv_key, ps_status);

            }
            catch (Exception ex)
            {

            }

        }


        //---------------------------------------------------------------------------------------
        // Чтение текущего статуса задачи
        public bool GetStatus(string pv_key, ref typ_progress_status ps_status)
        {

            bool lv_result = false;
            try
            {
                lv_result = ao_status_list.TryGetValue(pv_key, out ps_status);
            }
            catch (Exception ex)
            {

                return lv_result;
            }

            return lv_result;

        }
    }
















}
