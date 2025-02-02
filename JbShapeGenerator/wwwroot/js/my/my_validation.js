$(document).ready(function () {

    // Запрещение ввода символов, отличных от латиницы, цифр, пробела и подчёркивания
    $("#id_model_name").on("input", function () {
        let regex = /^[A-Za-z0-9_ ]{3,80}$/;
        //let regex = /^[A-Za-z0-9_ ]+$/;
        let value = $(this).val();

        if (!regex.test(value)) {
            $(this).val(value.replace(/[^A-Za-z0-9_ ]/g, "")); // Удаляем запрещённые символы
        }
    });

    // Проверка при переходе фокуса из поля ввода
    $("#id_model_name").on("blur", function () {
        $(this).valid();
    });

    // Кастомный метод для валидации regex
    $.validator.addMethod("regex", function (value, element, regexp) {
        let re = new RegExp(regexp);
        return this.optional(element) || re.test(value);
    }, "Only letters, numbers, spaces, and underscores allowed.");




    // Инициализация валидации формы
    $("#id_mainForm").validate({
        rules: {
            modelname: {
                required: true,
                minlength: 3,
                maxlength: 80,
                regex: "^[A-Za-z0-9_ ]+$"  // Используем кастомное правило
            }
        },
        messages: {
            modelname: {
                required: "This field is required",
                minlength: "Minimum 3 characters",
                maxlength: "Maximum 80 characters",
                regex: "Only letters, numbers, spaces, and underscores allowed."  // Изменили с pattern на regex
            }
        },
        errorPlacement: function (error, element) {
            console.log("Ошибка валидации:", error.text());  // Логируем ошибку
            $("#id_lb_model_name_error_message").text(error.text()).show();
        },
        success: function () {
            $("#id_lb_model_name_error_message").hide();  // Убираем сообщение при успехе
        }
    });

    // Блокируем отправку, если форма не валидна
    $("#id_mainForm").on("submit", function (e) {
        if (!$(this).valid()) {
            e.preventDefault();  // Останавливаем отправку формы
            console.log("⛔ Ошибка валидации, форма не отправляется.");
        }
    });
});