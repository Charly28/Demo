namespace("HeadSpring.Navigation");

(function ($, undefined) {


    Ofiview.HeadSpring = function () {
        var _mainContent,
            _modules = [];

        function loadPage(module, args) {
            _mainContent = $("#main-content");

            var qs = getQueryString(),
                m = module(args);

            _modules.push(m);

            m.View.appendTo(_mainContent);
            m.Load(qs);
        }

        function open(module) {
            if (_modules.length == 0) {
                loadPage(module);
            }
            else {
                navigateTo(module, {});
            }
        }

        function navigateTo(module, options) {

            var currentModule = _modules[_modules.length - 1];
            currentModule.View.hide("fade", function () {
                var m = module();
                _modules.push(m);
                m.View.appendTo(_mainContent);
                m.Load(options);
                m.View.bind("close", back);
            }, { direction: "left" }, 1200);
        }



        function getQueryString() {
            //Get query string
            return $.deparam.querystring();
        }

        function getModule(index) {
            if (index >= 0 && _modules.length >= index) {
                return _modules[index];
            }

            return null;
        }

        function back(data, message) {
            if (_modules.length > 1) {
                var prevModule = _modules[_modules.length - 2],
                    currentModule = _modules[_modules.length - 1];

                currentModule.View.remove();
                prevModule.View.show();

                var moduleToolbar = prevModule.View.find('.message');
                moduleToolbar.hide();

                _modules.pop();

                if ($.isFunction(prevModule.Refresh) && message !== undefined) {
                    prevModule.Refresh(message);
                }

                $(window).trigger("scroll");
            }
        }

        function dialogFromModule(module, onSave, dialogOptions, moduleArguments, onCancelCallback, onlySaveButton) {
            var _module = module(),
                _onSave = onSave,
                _onCancelCallback = onCancelCallback || null;

            function saveCallback(result, data) {
                close();
                if ($.isFunction(_onSave)) {
                    _onSave.apply(_module.View, [data, result]);
                }
            }

            var buttons = [];

            var saveKey = Ofiview.TextFor(dialogOptions != null && dialogOptions.button_labels !== undefined && dialogOptions.button_labels.Save !== undefined ? dialogOptions.button_labels.Save : Ofiview.Resources.Keys.General_Dialog_Save);
            var cancelKey = Ofiview.TextFor(dialogOptions != null && dialogOptions.button_labels !== undefined && dialogOptions.button_labels.Cancel !== undefined ? dialogOptions.button_labels.Cancel : Ofiview.Resources.Keys.General_Dialog_Cancel);

            var cancelButton = {
                text: cancelKey,
                width: 80,
                click: function () {
                    if ($.isFunction(_onCancelCallback)) {
                        _onCancelCallback.apply();
                    }
                    close();
                }
            };

            var saveButton = {
                text: saveKey,
                width: 80,
                click: function () {
                    _module.Save(saveCallback);
                }
            };

            // This is necessary to standardize the JQuery UI buttons
            if ((saveKey === Ofiview.TextFor(Ofiview.Resources.Keys.General_Dialog_Yes) && cancelKey === Ofiview.TextFor(Ofiview.Resources.Keys.General_Dialog_No)) ||
                (saveKey === Ofiview.TextFor(Ofiview.Resources.Keys.General_Dialog_Accept) && cancelKey === Ofiview.TextFor(Ofiview.Resources.Keys.General_Dialog_Cancel)) ||
                (saveKey === Ofiview.TextFor(Ofiview.Resources.Keys.General_Dialog_Yes) && cancelKey === Ofiview.TextFor(Ofiview.Resources.Keys.General_Dialog_Cancel))) {
                if (!onlySaveButton) {
                    buttons.push(cancelButton);
                }
                buttons.push(saveButton);
            }

            else {
                buttons.push(saveButton);

                if (!onlySaveButton) {
                    buttons.push(cancelButton);
                }

            }

            var opts = $.extend({
                autoOpen: false,
                modal: true,
                width: 500,
                resizable: false,
                open: function () {
                    $(this).html('<span>Cargando...</span>');
                    var lOpts = _module.View.data('open-dialog-options');
                    _module.Load($.extend(moduleArguments, lOpts));
                },
                close: function (ev, ui) {
                    _module.View.dialog('destroy');
                    _module.View.empty();
                },
                buttons: buttons
            }, dialogOptions);

            _module.View.dialog(opts);

            function openDiag(openOpts) {
                _module.View.data('open-dialog-options', openOpts);
                _module.View.dialog('open');
            }

            function close() {
                _module.View.dialog('close');
                _module.View.dialog('destroy');
                _module.View.empty();
            }

            _module.View.bind("close", close);

            return {
                Open: openDiag,
                Close: close,
                Module: function () {
                    return _module;
                }
            };
        }

        function isValidBack(originalVM, modifiedVM, options) {
            if (options && options.readonly)
                return true;
            return originalVM == ko.toJSON(modifiedVM);
        };

        return {
            NavigateTo: navigateTo,
            LoadPage: loadPage,
            OpenDialog: dialogFromModule,
            Open: open,
            GetModuleByIndex: getModule,
            IsValidBack: isValidBack
        };
    }(); //Singleton


})(jQuery);