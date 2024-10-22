namespace JbShapeGenerator.AppCode
{

    public class PersistentDictionary<T>
    {

        private readonly string av_pathfile;
        private Dictionary<string, T>? ao_dictionary;
        ///private GlobalSessionData ao_GlobalSessionData;

        public PersistentDictionary(string ip_pathfile/*, GlobalSessionData po_GlobalSessionData = null*/)
        {
            av_pathfile = ip_pathfile;
            ao_dictionary = null;
            //ao_GlobalSessionData = po_GlobalSessionData;
            try
            {
                if (!File.Exists(ip_pathfile))
                {
                    StreamWriter lo_sw = new StreamWriter(av_pathfile);
                    lo_sw.Close();
                }

            }
            catch (Exception ex)
            {

                // Формирование аварийного статуса задачи -1
                //ProgressMonitor.SetStatus(-1);


                //if (ao_GlobalSessionData != null)
                //{
                //    ao_GlobalSessionData.ao_indexModel.LogMessage(ex);
                //}
            }
        }


        //------------------------------------------------------------------
        public Dictionary<string, T> ReadDictionary()
        {
            try
            {
                using (StreamReader lo_sr = new StreamReader(av_pathfile))
                {
                    string lv_stringValue = lo_sr.ReadToEnd();
                    if (lv_stringValue != null && lv_stringValue != "")
                    {
                        ao_dictionary = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, T>>(lv_stringValue);
                    }
                }

                if (ao_dictionary == null)
                {
                    ao_dictionary = new Dictionary<string, T>();
                }

            }

            catch (Exception ex)
            {
                //// Формирование аварийного статуса задачи -1
                //ProgressMonitor.SetStatus(-1);

                //// Занесение в журнал событий
                //if (ao_GlobalSessionData != null)
                //{
                //    ao_GlobalSessionData.ao_indexModel.LogMessage(ex);
                //}
            }

            return ao_dictionary; // lv_result;

        }

        //----------------------------------------------------------------------

        public void AddItem(string ip_key, T is_row)
        {

            try
            {
                ao_dictionary = ReadDictionary();

                if (ao_dictionary != null)
                {
                    ao_dictionary.Add(ip_key, is_row);
                    SaveDictionary();
                }

            }
            catch (Exception ex)
            {

                //// Формирование аварийного статуса задачи -1
                //ProgressMonitor.SetStatus(-1);
                //if (ao_GlobalSessionData != null)
                //{

                //    // Занесение в журнал событий
                //    ao_GlobalSessionData.ao_indexModel.LogMessage(ex);
                //}
            }

        }

        //----------------------------------------------------------------------
        public void ModifyItem(string ip_key, T is_row)
        {

            try
            {
                ao_dictionary = ReadDictionary();

                if (ao_dictionary != null)
                {
                    ao_dictionary.Remove(ip_key);

                    ao_dictionary.Add(ip_key, is_row);

                    SaveDictionary();
                }

            }
            catch (Exception ex)
            {

                ////// Формирование аварийного статуса задачи -1
                //if (ao_GlobalSessionData != null)
                //{
                //    //// Занесение в журнал событий
                //}
            }

            //return lv_result;

        }

        //----------------------------------------------------------------------
        public bool ReadItem(string pv_key, ref T ps_row_data) //, out T ps_row)
        {
            bool lv_result = false;
            try
            {
                ao_dictionary = ReadDictionary();

                if (ao_dictionary != null)
                {
                    lv_result = ao_dictionary.TryGetValue(pv_key.ToString(), out ps_row_data);
                }

            }
            catch (Exception ex)
            {

                //// Формирование аварийного статуса задачи -1
                //ProgressMonitor.SetStatus(-1);
                //if (ao_GlobalSessionData != null)
                //{
                //    // Занесение в журнал событий
                //    ao_GlobalSessionData.ao_indexModel.LogMessage(ex);
                //}
            }


            return lv_result;

        }

        //------------------------------------------------------------------
        public bool DeleteItem(string ip_key) //, T is_row)
        {
            bool lv_result = false;

            try
            {
                ao_dictionary = ReadDictionary();

                if (ao_dictionary != null)
                {
                    lv_result = ao_dictionary.Remove(ip_key);
                }

                SaveDictionary();

            }

            catch (Exception ex)
            {
                //// Формирование аварийного статуса задачи -1
                //ProgressMonitor.SetStatus(-1);
                //if (ao_GlobalSessionData != null)
                //{
                //    // Занесение в журнал событий
                //    ao_GlobalSessionData.ao_indexModel.LogMessage(ex);
                //}
            }
            return lv_result;

        }


        //------------------------------------------------------------------
        public void ClearDict()
        {
            bool lv_result = false;

            try
            {
                ao_dictionary = ReadDictionary();

                if (ao_dictionary != null)
                {
                    ao_dictionary.Clear();
                }

                SaveDictionary();

            }

            catch (Exception ex)
            {
                //// Формирование аварийного статуса задачи -1
                //ProgressMonitor.SetStatus(-1);

                //if (ao_GlobalSessionData != null)
                //{
                //    // Занесение в журнал событий
                //    ao_GlobalSessionData.ao_indexModel.LogMessage(ex);
                //}
            }
            return;

        }



        //------------------------------------------------------------------
        void SaveDictionary()
        {

            string lv_serialize_str = "";

            try
            {
                if (ao_dictionary != null)
                {
                    lv_serialize_str = Newtonsoft.Json.JsonConvert.SerializeObject(ao_dictionary);

                    using (StreamWriter lo_sw = new StreamWriter(av_pathfile))
                    {
                        lo_sw.Write(lv_serialize_str);
                    }
                }
            }

            catch (Exception ex)
            {
                //// Формирование аварийного статуса задачи -1
                //ProgressMonitor.SetStatus(-1);

                //if (ao_GlobalSessionData != null)
                //{
                //    // Занесение в журнал событий
                //    ao_GlobalSessionData.ao_indexModel.LogMessage(ex);
                //}
            }

        }


    }//==========================================================




    //-------  namespace  ------------------
}
