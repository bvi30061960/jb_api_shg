using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace jb_api_shg.AppCode
{
    public interface IProgressMonitor
    {
        void SetStatus(/*int pv_taskId,*/ object pv_message);
        string GetStatus(/*int pv_taskId*/);
    }


    public class ProgressMonitor : IProgressMonitor
    {

        //public PageContext ao_pageContext { set; get; }
        public ISession ao_session { set; get; }


        public int av_taskId { set; get; }

        public ProgressMonitor(/*PageContext po_PageContext,*/ISession po_session, int pv_taskId)
        {
            //ao_pageContext = po_PageContext;

            ao_session = po_session;
            av_taskId = pv_taskId;
        }

        // Установка текущего статуса задачи
        public void SetStatus(/*int pv_taskId, */object pv_message)
        {

            //ao_pageContext.HttpContext.Session.SetString(av_taskId.ToString(), pv_message.ToString());
            ao_session.SetString(av_taskId.ToString(), pv_message.ToString());

        }

        // Чтение текущего статуса задачи

        public string GetStatus(/*int pv_taskId*/)
        {
            //object lo_obj = ao_pageContext.HttpContext.Session.GetString(av_taskId.ToString());
            object lo_obj = ao_session.GetString(av_taskId.ToString());
            if (lo_obj == null)
            {
                return String.Empty;
            }

            return (string)lo_obj;

        }
    }
