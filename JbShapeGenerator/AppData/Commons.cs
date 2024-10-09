namespace JbShapeGenerator.AppData
{
    public static class CommonMethods
    {

        //-----------------------------------------------------------------------------------------------
        // Создание директории, если не существует
        public static void create_directory_if_no_exist(string? pv_path_dir/*, GlobalSessionData po_GlobalSessionData*/)
        {
            if (pv_path_dir == null || pv_path_dir == "")
            {
                return;
            }


            DirectoryInfo lv_di = new DirectoryInfo(pv_path_dir);
            if (!lv_di.Exists)
            {
                try
                {
                    lv_di.Create();
                }
                catch (Exception ex)
                {
                    //// Формирование аварийного статуса задачи -1
                    //ProgressMonitor.SetStatus(-1);

                    //// Занесение в журнал событий
                    //po_GlobalSessionData.ao_indexModel.LogMessage(ex);
                }

            }
        }
        //-----------------------------------------------------------------------------------------------
        // Чтение данных из сессии
        public static string get_str_from_session(ISession po_session, string pv_name_parameter)
        {
            string? lv_result = "";

            try
            {

                if (po_session != null)
                {
                    if (pv_name_parameter != null && pv_name_parameter != "")
                    {
                        lv_result = po_session.GetString(pv_name_parameter);
                    }
                }

            }
            catch (Exception ex)
            {

            }

            return lv_result;
        }

        //-----------------------------------------------------------------------------------------------
        // Запись данных в сессию
        internal static void set_str_from_session(ISession po_session, string pv_name_parameter, string pv_value)
        {
            try
            {

                if (po_session != null)
                {
                    if (pv_name_parameter != null && pv_name_parameter != "")
                    {
                        po_session.SetString(pv_name_parameter, pv_value);
                    }
                }

            }
            catch (Exception ex)
            {

            }
        }



    } //==  end class CommonMethods =============================================================================

}