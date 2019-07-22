namespace("HeadSpring.Common");

(function ($, undefined) {

    HeadSpring.Common = function () {

        var _nextId = -1;

        function handleToolbarScroll(view) {
            var toolbar = view.find(".toolbar:first");

            if (toolbar.length == 0) {
                return;
            }

            var parent = toolbar.parent(),
                positionTop = toolbar.offset().top;

            $(window).scroll(function () { positionToolbar(positionTop, parent); });
            $(window).resize(function () { positionToolbar(positionTop, parent); });
        }

        function positionToolbar(positionTop, parent) {

            var yoffset = $(window).scrollTop();
            if (positionTop > yoffset || positionTop == yoffset) { //embed
                parent.removeClass("fixed-toolbar");
            }
            else { //fixed
                parent.addClass("fixed-toolbar");
            }
        }

        function hideToolbarEmptyButtons() {
            var toolbarActions = $("#.toolbar .actions");

            for (var i = 0; i < toolbarActions.length; i++) {
                if (toolbarActions[i].children.length == 0) {
                    toolbarActions[i].style.display = 'none';
                }
            }
        }

        function checkPermission() {
            loadData("/Account/CheckPermission", null, function (data) {
                if (!data) { // No permissions to Company Level
                    window.location.replace("/Erp/Home/ContextSelection");
                }
            });
        }

        function loadView(view, url, options, callback) {
            if (!options.skipPermissionsValidation || options.skipPermissionsValidation === undefined || options.skipPermissionsValidation === null) {
                checkPermission();
            }

            var initView = function () {
                handleToolbarScroll(view);

                Ofiview.Forms.InitControls(view);

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
                    view.html(html);
                    initView();
                },
                complete: function() {
                    hideLoadingDialog();
                    hideToolbarEmptyButtons();
                }
            });
        }

        function readonly(view) {
            view.find(":input").each(function (index, object) {
                if ($(object).hasClass("accountslookup")) {
                    $(object).accountslookup("disable");
                }
                else if ($(object).hasClass("lookup")) {
                    $(object).lookup("disable");
                }
                else if ($(object).attr("data-control") === "numeric") {
                    $(object).spinner("disable");
                }
                else {
                    $(object).attr('disabled', 'disabled');
                }
            });

            $("select").each(function () {
                if (!$(this).get(0).hasAttribute("data-keep-always-enabled")) {
                    $(this).combobox("disable");
                }
            });

            view.find(":input").each(function (index, object) {
                if ($(this).get(0).hasAttribute("data-keep-always-enabled")) {
                    $(this).removeAttr("disabled");
                }
            });
        }

        function loadData(url, options, callback, view) {
            var req = $.ajax({
                url: url,
                data: options,
                type: "get",
                dataType: "json",
                beforeSend: function (xhr) {
                    if (options && options.requestOriginator)
                    {
                        xhr.setRequestHeader("x-request-originator", "dropdownlist");
                    }
                    xhr.setRequestHeader("x-application-section", Ofiview.Common.Context.CurrentModule());
                }
            });

            req.done(function (data) {
                if ($.isFunction(callback)) {
                    callback(data);
                }
            });

            req.fail(function (xhr, responseText) {
                if (xhr.status === 403) { // Forbidden - SecurityException
                    window.location.replace("/Erp/Home/ContextSelection");
                }

                handleDataErrors(xhr, view);
            });
        }

        function isXssAttack(vm) {
            if (vm.indexOf("<script") != -1 ||
                vm.indexOf("</script>") != -1) {
                return true;
            }

            return false;
        }

        function saveData(url, options, vm, callback, view, errorcallback, asGetMethod) {
            if (isXssAttack(vm)) {
                var error = {
                    readyState: 4,
                    responseText: '[{ "Name": "BusinessException", "Message": "Algún campo contiene una cadena no permitida" }]',
                    status: 400,
                    statusText: "Bad Request"
                }

                hideLoadingDialog();
                handleDataErrors(error, view);
                return;
            }

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
                dataType: "json",
                beforeSend: function (xhr) {
                    if (options && options.requestOriginator) {
                        xhr.setRequestHeader("x-request-originator", options.requestOriginator);
                    }
                    xhr.setRequestHeader("x-application-section", Ofiview.Common.Context.CurrentModule());
                    showLoadingDialog(".page", "Procesando");
                }
            });

            req.complete(function () {
                
            });

            req.done(function (data) {
                hideLoadingDialog();
                if ($.isFunction(callback)) {
                    callback(data);
                }
            });

            req.fail(function (data) {
                hideLoadingDialog();
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
            var deleteDialog = Ofiview.Navigation.OpenDialog(Ofiview.Erp.Delete.Dialog, function (args) {

                if (!url.endsWith("/")) {
                    url += "/";
                }

                var req = $.ajax({
                    contentType: "application/json; charset=utf-8",
                    type: "DELETE",
                    url: url + id,
                    dataType: "json",
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("x-application-section", Ofiview.Common.Context.CurrentModule());

                        showLoadingDialog(".page", "Procesando");
                    },
                    statusCode: handleStatusCode(view)
                });

                req.done(function (result) {
                    if ($.isFunction(callback)) {
                        callback.apply(view, result);
                    }
                    hideLoadingDialog();
                });

                req.fail(function (jqXHR, textStatus) {
                    handleDataErrors(jqXHR, view);
                    hideLoadingDialog();
                });
            },
                {
                    width: 150,
                    title: Ofiview.TextFor(Ofiview.Resources.Keys.General_Deleted_Dialog),
                    button_labels: {
                        Save: Ofiview.Resources.Keys.General_Dialog_Yes,
                        Cancel: Ofiview.Resources.Keys.General_Dialog_No
                }
                }, null);
            deleteDialog.Open();

            return;

        }

        function handleErrorsInsideContainer(data, container) {
            if (data) {
                switch (data.status) {
                case 403:
                    container.Error(Ofiview.TextFor(Ofiview.Resources.Keys.General_Request_Unauthorized_Access));
                    break;
                case 400:
                    var errors;
                    try {
                        errors = jQuery.parseJSON(data.responseText);
                    } catch(e) {
                        //Not expected error - unable to parse JSON
                        container.Error(Ofiview.TextFor(Ofiview.Resources.Keys.General_Request_Error));
                        return;
                    }

                    //At this poing we know we have valid json
                    if (errors.length == 1) {
                        var singleError = errors[0];
                        switch (singleError.Name) {
                        case "BusinessException":
                            container.Error(singleError.Message);
                            break;
                        case "ValidationException":
                            handleServerSideValidationExceptions(errors, container);
                            break;
                        case "OptimisticConcurrencyException":
                            container.Error("Error de concurrencia, favor de actualizar los datos y volver a intentar");
                            break;
                        }
                    } else {
                        handleServerSideValidationExceptions(errors, container);
                    }
                    break;
                default:
                    //et. all
                    container.Error(Ofiview.TextFor(Ofiview.Resources.Keys.General_Request_Error));
                    return;
                }
            } else {
                container.Error(Ofiview.TextFor(Ofiview.Resources.Keys.General_Request_Error));
            }
        }

        function handleServerSideValidationExceptions(errors, container) {
            var message = Ofiview.TextFor(Ofiview.Resources.Keys.General_Request_Error);
            jQuery.each(errors, function (k, v) {
                if (v.Message.trim() !== "") {
                    message += "<br />" + v.Message;
                }
            });

            if (message !== "") {
                container.Error(message);
            }
        }

        function handleDataErrors(data, view) {
            var toolbar = Ofiview.Controls.Toolbar(view);
            toolbar.Clear("");
            handleErrorsInsideContainer(data, toolbar);
        }

        function handleStatusCode(view) {
            var toolbar = view.find(".toolbar").data("toolbar");
            if (!toolbar) {
                toolbar = Ofiview.Controls.Toolbar(view);
            }

            function pageNotFound() {
                toolbar.Error("Page not found!");
            }
            function validationErrors() {
                //   toolbar.Warning("Internal Error!");
            }

            function internalError(req, status, error) {
                //_toolbar.Error(Ofiview.TextFor(Ofiview.Resources.Keys.General_Request_Error));
            }

            return {
                400: validationErrors,
                404: pageNotFound,
                500: internalError
            };
        }

        function validate(form) {
            form.removeData('unobtrusiveValidation');
            form.removeData('validator');
            form.find("li.warning").removeClass("warning");
            initValidator(form);
            return form.valid();
        }

        function initValidator(form) {
            $.validator.unobtrusive.parse(form);
            var data = form.data('validator');
            data.settings.onkeyup = false;
            data.settings.errorPlacement = $.proxy(onError, form[0]);
        }

        function makeTooltipForMultipleSelect(elem, error, container) {
            var button = elem.next();

            button.qtip({
                overwrite: false,
                content: error,
                position: {
                    my: "bottom center",
                    at: "top center",
                    container: container
                },
                show: {
                    event: false,
                    ready: true
                },
                hide: false,
                style: {
                    classes: "ui-tooltip-red"
                }
            }).qtip("option", "content.text", error);

            button.addClass("ms-choice-error");
        }

        function destroyTooltipForMultipleSelect(elem) {
            var button = elem.next();
            button.removeClass("ms-choice-error");
            button.qtip("destroy");
        }

        function onError(error, inputElement) {  // 'this' is the form element
            var container = $(this).find("[data-valmsg-for='" + inputElement[0].name + "']"),
                replace = $.parseJSON(container.attr("data-valmsg-replace")) !== false;

            container.removeClass("field-validation-valid").addClass("field-validation-error");
            error.data("unobtrusiveContainer", container);

            if (replace) {
                container.empty();
                error.removeClass("input-validation-error").appendTo(container);
            }
            else {
                error.hide();
            }

            var element = inputElement;
            // Set positioning based on the elements position in the form
            var elem = $(element);
            
            if (!error.is(':empty')) {
                var $uitab = elem.parents(".ui-tabs-panel:first");
                if ($uitab.size() === 1) {
                    var id = $uitab[0].id;
                    var $anchor = $uitab.siblings("ul.ui-tabs-nav").find("li > a[href*='" + id + "']");
                    var $li = $anchor.parent();
                    if (!$li.hasClass("warning")) {
                        $li.addClass("warning");
                    }
                }
            }

            if (elem.attr("type") !== "hidden" && (elem.css("display") !== "none" || elem.prop("multiple"))) {
                // Check we have a valid error message
                if (!error.is(':empty')) {
                    // Apply the tooltip only if it isn't valid
                    elem.filter(':not(.valid)').qtip({
                        overwrite: false,
                        content: error,
                        position: {
                            my: 'bottom center',
                            at: 'top center',
                            container: $(this)
                        },
                        show: {
                            event: false,
                            ready: true
                        },
                        hide: false,
                        style: {
                            classes: 'ui-tooltip-red' // Make it red... the classic error colour!
                        }
                    }).qtip('option', 'content.text', error);// If we have a tooltip on this element already, just update its content

                    if (elem.prop("multiple")) {
                        makeTooltipForMultipleSelect(elem, error, $(this));
                    }
                } else {
                    // If the error is empty, remove the qTip
                    elem.qtip('destroy');

                    if (elem.prop("multiple")) {
                        destroyTooltipForMultipleSelect(elem);
                    }
                }
            }
        }

        function registerCustomValidators() {
            jQuery.validator.unobtrusive.adapters.add('validdate', ['validdate'], function (options) {
                var params = {
                };

                // Match parameters to the method to execute
                options.rules['validdate'] = params;
                if (options.message) {
                    // If there is a message, set it for the rule
                    options.messages['validdate'] = options.message;
                }
            });

            jQuery.validator.addMethod('validdate', function (value, element, param) {
                return value ? Date.parseExact(value, Ofiview.Configuration.DateFormatMask) : true;
            });




            jQuery.validator.unobtrusive.adapters.add('level1account', ['level1account'], function (options) {
                var params = {
                };

                // Match parameters to the method to execute
                options.rules['level1account'] = params;
                if (options.message) {
                    // If there is a message, set it for the rule
                    options.messages['level1account'] = options.message;
                }
            });

            jQuery.validator.addMethod('level1account', function (value, element, param) {
                var data = $(element).data();
                if (data && data.selected) {
                    if (data.selected !== null && data.selected.accountlevel !== undefined) {
                        return data.selected.accountlevel == 1 ? true : false;
                    }
                    else {
                        return true;
                    }
                }
                return false;
            });




            jQuery.validator.unobtrusive.adapters.add('level2account', ['level2account'], function (options) {
                var params = {
                };

                // Match parameters to the method to execute
                options.rules['level2account'] = params;
                if (options.message) {
                    // If there is a message, set it for the rule
                    options.messages['level2account'] = options.message;
                }
            });

            jQuery.validator.addMethod('level2account', function (value, element, param) {
                var data = $(element).data();
                if (data && data.selected) {
                    if (data.selected !== null && data.selected.accountlevel !== undefined) {
                        return data.selected.accountlevel == 2 ? true : false;
                    }
                    else {
                        return true;
                    }
                }
                return false;
            });

            jQuery.validator.unobtrusive.adapters.add('level4account', ['level4account'], function (options) {
                var params = {
                };

                // Match parameters to the method to execute
                options.rules['level4account'] = params;
                if (options.message) {
                    // If there is a message, set it for the rule
                    options.messages['level4account'] = options.message;
                }
            });

            jQuery.validator.addMethod('level4account', function (value, element, param) {
                var data = $(element).data();
                if (data && data.selected) {
                    if (data.selected !== null && data.selected.accountlevel !== undefined) {
                        return (data.selected.accountlevel == 4 || data.selected.accountlevel == null) ? true : false;
                    }
                    else {
                        return true;
                    }
                }
                return false;
            });

            jQuery.validator.unobtrusive.adapters.add('level4accountoptional', ['level4accountoptional'], function (options) {
                var params = {
                };

                // Match parameters to the method to execute
                options.rules['level4accountoptional'] = params;
                if (options.message) {
                    // If there is a message, set it for the rule
                    options.messages['level4accountoptional'] = options.message;
                }
            });

            jQuery.validator.addMethod('level4accountoptional', function (value, element, param) {
                var data = $(element).data();
                    if (data.selected !== null && data.selected.accountlevel !== undefined) {
                        return (data.selected.accountlevel == 4 || data.selected.accountlevel == null) ? true : false;
                    }
                    else {
                        return true;
                    }
            });

            jQuery.validator.unobtrusive.adapters.add('uploadfileaccept', ['uploadfileaccept'], function (options) {
                var params = {
                };

                // Match parameters to the method to execute
                options.rules['uploadfileaccept'] = params;
                if (options.message) {
                    // If there is a message, set it for the rule
                    options.messages['uploadfileaccept'] = options.message;
                }
            });

            jQuery.validator.addMethod('uploadfileaccept', function (value, element, param) {
                var isValid = false;
                var fileExtension = value.split('.');
                var extAccepted = element.dataset["accept"].split(',');

                fileExtension = fileExtension[fileExtension.length-1];

                for (var i = 0; extAccepted.length > i; i++) {
                    if (extAccepted[i].trim() === fileExtension) {
                        isValid = true;
                    }
                }

                return isValid;
            });

            //Override unobstrusive validation for date and force it to a specific format
            jQuery.validator.methods.date = function (value, element) {
                return value ? Date.parseExact(value, Ofiview.Configuration.DateFormatMask) : true;
            };

            // Validation for Required IF attribute
            jQuery.validator.addMethod("requiredif", function (value, element, params) {
                if ($(element).val() != '') return true

                var $other = $('#' + params.other);

                if ($other) {
                    var otherVal = ($other.attr('type').toUpperCase() == "CHECKBOX" || $other.attr('type').toUpperCase() == "RADIO") ?
                             ($other.attr("checked") ? "true" : "false") : $other.val();

                    return params.comp == 'isequalto' ? (otherVal != params.value) : (otherVal == params.value);
                }
                else {
                    console.warn("El id del campo debe llamarse igual al pasado en el atributo RequiredIf");
                    return false;
                }

            });

            jQuery.validator.unobtrusive.adapters.add("requiredif", ["other", "comp", "value"], function (options) {
                options.rules['requiredif'] = {
                    other: options.params.other,
                    comp: options.params.comp,
                    value: options.params.value
                };
                options.messages['requiredif'] = options.message;
            }
            );
        }


        registerCustomValidators();
        // set logo size when headear has no users dropdown menu
        function setLogoSize() {
            $('header').addClass('no-user-dropdown');
        }

        /** 
         * Shows the loading dialog
         *
         * @param   {string}        containerSelector   Represents the CSS selector of the element that will contain the loading dialog
         * @return  {HTMLElement}   
         */
        function showLoadingDialog(containerSelector, message) {
            var mainContent = $(containerSelector);
            var msg = message || "Cargando";
            var background = $('<div class="loading-background ui-widget-overlay" style="display:none;z-index:1001"><div class="loading-message"><img src="/Content/Images/ajax-loading.gif" /> <div>' + msg + ' ...</div></div></div>');

            mainContent.prepend(background);

            background.height(mainContent.outerHeight());
            background.width(mainContent.outerWidth());

            var dlg = $(".loading-message").dialog({
                modal: false,
                position: { my: 'center', at: 'center', of: mainContent },
                width: 200,
                resizable: false,
                draggable: false,
                dialogClass: 'alert loading',
                autoOpen: false
            });

            dlg.dialog("open");
            background.show();

            return dlg;
        }

        function hideLoadingDialog() {
            $(".loading-message").dialog("destroy").remove();
            $(".loading-background").hide().remove();
        }

        function cleanQueryString(options, preserve) {
            var clean = {};
            var available = {};

            for (var idx = 0; idx < preserve.length; idx++) {
                available[preserve[idx].toLowerCase()] = true;
            }

            for (var prop in options) {
                if (options.hasOwnProperty(prop) && available[prop.toLowerCase()]) {
                    clean[prop] = options[prop];
                }
            }

            return clean;
        }


        function acceptReadOnly(options) {
            return cleanQueryString(options, ["readonly"]);
        }

        function getCleanDate(value) {
            return Date.parseExact(value.toString(Ofiview.Configuration.DateFormatMask), Ofiview.Configuration.DateFormatMask);
        }
        
        function getNextId() {
            return _nextId--;
        }
        
        function cloneAddress(fromViewModel, destinationAddressViewModel, destinationAddressControl) {
            var countryId = fromViewModel.CountryId(),
		        stateId = fromViewModel.StateId(),
		        cityId = fromViewModel.CityId(),
		        countryName = fromViewModel.CountryName(),
		        stateName = fromViewModel.StateName(),
		        cityName = fromViewModel.CityName();

            destinationAddressControl.ResetLookups();

            destinationAddressViewModel.CountryName(countryName);
            destinationAddressViewModel.StateName(stateName);
            destinationAddressViewModel.CityName(cityName);
            destinationAddressViewModel.CountryId(countryId);
            destinationAddressViewModel.StateId(stateId);
            destinationAddressViewModel.CityId(cityId);
            destinationAddressViewModel.Street(fromViewModel.Street());
            destinationAddressViewModel.StreetNumber(fromViewModel.StreetNumber());
            destinationAddressViewModel.Suite(fromViewModel.Suite());
            destinationAddressViewModel.District(fromViewModel.District());
            destinationAddressViewModel.ZipCode(fromViewModel.ZipCode());

            if (countryId > 0) {
                destinationAddressControl.SetCountry({ id: countryId, value: countryName });
            }

            if (stateId > 0) {
                destinationAddressControl.SetState({ id: stateId, value: stateName, CountryId: countryId, StateId: stateId });
            }

            if (cityId > 0) {
                destinationAddressControl.SetCity({ id: cityId, value: cityName });
            }
        }

        return {
            LoadView: loadView,
            LoadData: loadData,
            SaveData: saveData,
            DeleteData: deleteData,
            Validate: validate,
            SetLogoSize: setLogoSize,
            ShowLoadingDialog: showLoadingDialog,
            HideLoadingDialog: hideLoadingDialog,
            HandleErrorsInsideContainer: handleErrorsInsideContainer,
            CleanQueryString: cleanQueryString,
            AcceptReadOnly: acceptReadOnly,
            CleanDate: getCleanDate,
            GetNextId: getNextId,
            CloneAddress: cloneAddress
        };
    }(); //Singleton

})(jQuery);

/*
 * Override how dates are serialized in JSON so that we can remove the timezone conflict
 *
 */
Date.prototype.toJSON = function (key) {
    return isFinite(this.valueOf()) ? this.toString("yyyy-MM-dd") : null;
};