namespace("HeadSpring.Common");

(function ($, undefined) {

    HeadSpring.Common = function () {

        var genericMessage = 'An error occurred while processing your request.';

        function loadView(view, url, options, callback) {

            var initView = function () {

                if ($.isFunction(callback)) {
                    callback();
                }

                if (options.readonly === true) {
                    readonly(view);
                }
            };

            $.ajax({
                url: url,
                data: options,
                type: options.method === undefined ? "get" : options.method,
                dataType: "html",
                success: function (html) {
                    //view.html(html);
                    window.location.href = url + options.Id;
                    initView();
                },
                complete: function () {

                }
            });
        }

        function readonly(view) {
            view.find(":input").each(function (index, object) {
                $(object).attr('disabled', 'disabled');
            });
        }

        function loadData(url, options, callback, view) {
            var req = $.ajax({
                url: url,
                data: options,
                type: "get",
                dataType: "json",
                beforeSend: function (xhr) {
                    if (options && options.requestOriginator) {
                        xhr.setRequestHeader("x-request-originator", "dropdownlist");
                    }
                }
            });

            req.done(function (data) {
                if ($.isFunction(callback)) {
                    callback(data);
                }
            });

            req.fail(function (xhr, responseText) {
                if (xhr.status === 403) {
                    window.location.replace("/Account/Login");
                }
                handleDataErrors(xhr, view);
            });
        }

        function saveData(url, options, vm, callback, view, errorcallback, asGetMethod) {
            var method = options.id === undefined ? 'POST' : 'PUT';

            if (asGetMethod === undefined || asGetMethod === null || asGetMethod === false) {
                if (!url.endsWith("/")) {
                    url += "/";
                }

                url += options.id === undefined ? '' : options.id;

            } else {
                method = 'POST'
            }

            var req = $.ajax({
                contentType: "application/json; charset=utf-8",
                url: url,
                data: vm,
                type: method,
                dataType: "text",
                beforeSend: function (xhr) {
                    if (options && options.requestOriginator) {
                        xhr.setRequestHeader("x-request-originator", options.requestOriginator);
                    }
                }
            });

            req.complete(function () {

            });


            req.done(function (data) {
                if ($.isFunction(callback)) {
                    callback(data);
                }
            });

            req.fail(function (data) {
                if ($.isFunction(errorcallback)) {
                    var rendererror = errorcallback(data);
                    if (rendererror === true) {
                        handleDataErrors(data, view);
                    }
                }
                else {
                    handleDataErrors(data, view);
                }
            });
        }

        function deleteData(url, id, callback, view) {

            if (!url.endsWith("/")) {
                url += "/";
            }

            var req = $.ajax({
                contentType: "application/json; charset=utf-8",
                type: "DELETE",
                url: url + id,
                dataType: "text",
                beforeSend: function (xhr) {

                },
                statusCode: handleStatusCode(view)
            });

            req.done(function (result) {
                if ($.isFunction(callback)) {
                    callback(result);
                }
            });

            req.fail(function (jqXHR, textStatus) {
                handleDataErrors(jqXHR, view);
            });

        }

        function handleErrorsInsideContainer(data, container) {
            if (data) {
                switch (data.status) {
                    case 403:
                        container.html("<p>" + 'Unauthorized Access' + "</p>");
                        break;
                    case 400:
                        var errors;
                        try {
                            errors = jQuery.parseJSON(data.responseText);
                        } catch (e) {
                            container.html("<p>" + genericMessage + "</p>");
                            return;
                        }

                        if (errors.length == 1) {
                            var singleError = errors[0];
                            switch (singleError.Name) {
                                case "BusinessException":
                                    container.removeClass("toolbar");
                                    container.addClass("alert-danger");
                                    container.html("<p>" + singleError.Message + "</p>");
                                    setTimeout(function () {
                                        container.addClass("toolbar");
                                        container.removeClass("alert-danger");
                                        container.empty();
                                    }, 3000);
                                    break;
                                case "ValidationException":
                                    handleServerSideValidationExceptions(errors, container);
                                    break;
                            }
                        } else {
                            handleServerSideValidationExceptions(errors, container);
                        }
                        break;
                    default:
                        container.removeClass("toolbar");
                        container.addClass("alert-danger");
                        container.html("<p>" + genericMessage + "</p>");
                        setTimeout(function () {
                            container.addClass("toolbar");
                            container.removeClass("alert-danger");
                            container.empty();
                        }, 3000);
                        return;
                }
            } else {
                container.html("<p>" + genericMessage + "</p>");
            }
        }

        function handleServerSideValidationExceptions(errors, container) {
            jQuery.each(errors, function (k, v) {
                if (v.Message.trim() !== "") {
                    genericMessage += "<br />" + v.Message;
                }
            });
        }

        function getNotSelectedItemError(view, html) {
            view.removeClass("toolbar");
            view.addClass("alert-warning");
            view.html(html);

            setTimeout(function () {
                view.addClass("toolbar");
                view.removeClass("alert-warning");
                view.html("");
            }, 2000);
        }

        function handleDataErrors(data, view) {
            handleErrorsInsideContainer(data, view);
        }

        function handleStatusCode(view) {

            function pageNotFound() {

            }
            function validationErrors() {
            }

            function internalError(req, status, error) {

            }

            return {
                400: validationErrors,
                404: pageNotFound,
                500: internalError
            };
        }

        return {
            LoadData: loadData,
            SaveData: saveData,
            DeleteData: deleteData,
            LoadView: loadView,
            GetNotSelectedItem: getNotSelectedItemError,
            HandleErrorsInsideContainer: handleErrorsInsideContainer
        };
    }(); //Singleton

})(jQuery);
