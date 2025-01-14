
export var Constants = {

    true : "true",
    false: "false",
    method_refresh_premodel: "refresh_premodel",
    method_start_refresh_premodel: "start_refresh_premodel",
    method_read_result_refresh_premodel: "read_result_refresh_premodel",
    method_make_model: "make_model",
    method_start_make_model: "start_make_model",
    method_read_model_parts: "read_model_parts",
    method_delete_model_parts: "delete_model_parts",
    method_read_screenshot: "ReadScreenshot",
    method_read_model_from_server: "ReadModelFromServer",
    method_check_file_exist_on_server: "CheckFileExistOnServer",
    method_read_progress_value: "read_progress_value",
    method_read_model_parts_zip_file: "ReadModelPartsZipFile",

    word_client_id: "client_id",
    word_task_id: "task_id",
    word_task_id: "task_id",
    path_result_file: "path_result_file",
    parameter_folder_for_model_parts_zip: "folder_for_model_parts_zip",

    file_model_ext: ".stl",
    file_model_screenshot: ".scr",
    file_model_prev: ".prev",
    file_model_graph: ".png",
    //Number_of_blocks: 6,
    //SeparatorNameSet_from_data: "_@&@_",
    //Separator_between_items: "_&&_",
    //Separator_from_value: "_@@_",
    //Separator_after_hash: "_$$_",
    //Separator_between_dir: "\\",
    //Directory_DataFiles: "DataFiles",
    //Directory_OutputAudio: "OutputAudio",
    //Separator_in_payment_label: "_@_",

    //true: "true",
    //false: "false",

    //t1c: ".t1c", // Выход - файл для перевода с двухколоночной таблицей с текстом в одной левой колонке  
    //t2c: ".t2c", // Выход - файл с серилизованным объектом - набором таблиц c переводом - по словам, предложениям, абзацам, страницам
    //mp3: ".mp3",  // Выход - аудиофайл со сгенертрованным звуком на основании таблицы текста

    //Membership_page_Login: "LoginUser",
    //Membership_page_Create: "RegisterUser",
    //Membership_page_Recovery: "PasswRecovery",
    //initial_playbackset_name: "initial_playback_set",
    //wwwroot_dir: "wwwroot/",
    //text_snippet_filename: "snippet.txt",
    //audio_snippet_filename: "audio_snippet.mp3",
    //all_texts_filename: "all_texts.txt",
    //message_count_per_day: 5,
    //feedback_data_cooki_name: "feedback_data",
    div_dialog_message: $("#id_div_dialog_message"),
    //div_dialog_question: $("#id_div_dialog_question"),
    //tooltip_delay_ms: 500,
    //grid_tooltip_delay_ms: 1500,
    //timeout_file_saved_dialog_ms: 1000,
    timeout_dialog_message_ms: 1500, //900
    //path_initial_playback_set: "wwwroot/datafiles/system_files/initial_playback_set.pbs", //06062023
    //is_debug_mode: false, //26112023 true,
    //lang_ru: "ru",
    //lang_en: "en",
    //initial_topic: "id_tt_choose_text_topic"
    path_file_initial_premodel: "wwwroot/datafiles\\initial_model\\models\\initial_model",
    initial_load: "initial_load",
    background_color: 'c3c3c3', // цвет фона сцены
    shape_countour_color: 0x0000ff, // цвет контура фигур
    shape_line_color: 0xff00ff, // цвет линий разреза
    path_model_parts_folder: ""
    //calc_jbmodel_server_url: "https://localhost:7095/CalcJBModel" //?method="
};


export var Wide_model_types = {
    common: "common",
    user: "user"
};