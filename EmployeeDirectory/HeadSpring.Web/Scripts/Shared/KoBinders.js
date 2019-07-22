namespace("HeadSpring.Common");

(function ($, undefined) {

    HeadSpring.Common.koBinders = function () {

        ko.bindingHandlers.activo = {
            init: function (element, valueAccessor, allBindingsAccessor) {
                var observable = valueAccessor(),
                    interceptor = ko.computed({
                        read: function () {
                            return observable() ? "Activo" : "Inactivo";
                        },
                        write: function (newValue) {
                            observable(newValue === "true");
                        }
                    });

                ko.applyBindingsToNode(element, { value: interceptor });
            }
        };

        ko.bindingHandlers.textActive = {

            update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var value = valueAccessor();
                $(element).text(Ofiview.TextFor(value ? "General_Active_Record" : "General_Inactive_Record"));
            }
        };

        ko.bindingHandlers.currency = {
            update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var value = valueAccessor();
                $(element).text(Ofiview.Controls.GridFormatter.Currency(value));
            }
        };

        ko.bindingHandlers.dateString = {
            update: function (element, valueAccessor) {
                var value = ko.utils.unwrapObservable(valueAccessor());

                if (value === undefined || value === null || value === "") {
                    return;
                }

                if (jQuery.type(value) === "string") {
                    //handle date data coming via json
                    value = Date.parseExact(value.substring(0, 10), "yyyy-MM-dd");
                    if (value == null) {
                        return;
                    }
                }

                $(element).val(value.toString(Ofiview.Configuration.DateFormatMask));
            }
        };

        ko.bindingHandlers.datepicker = {
            init: function (element, valueAccessor, allBindingsAccessor) {
                //initialize datepicker with some optional options
                var options = allBindingsAccessor().datepickerOptions || {};
                $(element).datepicker(options);

                var current = $(element).datepicker("getDate");
                if (current !== null) {
                    $(element).datepicker("setDate", current);
                }

                //handle the field changing
                ko.utils.registerEventHandler(element, "change", function () {
                    var observable = valueAccessor();
                    var typedValue = $(element).val();
                    var parsedDate = Date.parseExact(typedValue, Ofiview.Configuration.DateFormatMask);
                    if (parsedDate !== null) {
                        observable(parsedDate);
                    } else {
                        observable(null);
                    }
                });

                //handle disposal (if KO removes by the template binding)
                ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                    $(element).datepicker("destroy");
                });

            },
            update: function (element, valueAccessor) {
                var value = ko.utils.unwrapObservable(valueAccessor());

                //gets triggered when our above "onchange" event is set to null because an invalid date
                //was entered and we force the observable to null
                if (value === undefined || value === null) {
                    return;
                }

                if (jQuery.type(value) === "string") {
                    if (value.indexOf("T") >= 0) {
                        //handle date data coming via json
                        value = Date.parseExact(value.substring(0, 10), "yyyy-MM-dd");
                    } else {
                        //handle data passed through options or query string
                        value = Date.parseExact(value.substring(0, 10), Ofiview.Configuration.DateFormatMask);
                    }
                    if (value == null) {
                        return;
                    }
                }

                //remove any timezone info created by direct calls to new Date() from JS or similar
                value = Ofiview.Common.CleanDate(value);

                //if we reach this line we can assume the date is correct so now we need to update the date picker
                var current = $(element).datepicker("getDate");

                if (value - current !== 0) {
                    $(element).datepicker("setDate", value);
                }
            }
        };

        ko.bindingHandlers.textChecked = {
            init: function (element, valueAccessor, allBindingsAccessor) {
                var observable = valueAccessor(),
                    interceptor = ko.computed({
                        read: function () {
                            return observable() ? "true" : "false";
                        },
                        write: function (newValue) {
                            observable(newValue == 'true');
                        }
                    });

                ko.applyBindingsToNode(element, { checked: interceptor });
            }

        };

        ko.bindingHandlers.enable_customDropdown = {
            update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var customDropdown = $(element).next();

                if (customDropdown.hasClass("combobox")) {
                    var button = customDropdown.find(".button");
                    var input = customDropdown.find(".combobox-textbox");

                    if (valueAccessor() == true) {
                        button.show();
                        input.removeAttr("disabled");
                        input.addClass("ui-widget-content");
                    } else {
                        button.hide();
                        input.attr("disabled", "disabled");
                        input.removeClass("ui-widget-content");
                    }
                }
            }
        };

        ko.bindingHandlers.enable_customSpinner = {
            update: function (element, valueAccessor, allBindingsAccessor, viewModel) {

                if ($(element).next().hasClass("ui-spinner")) {
                    var buttons = $(element).next();
                    var input = $(element);

                    if (valueAccessor() == true) {
                        buttons.show();
                        input.removeAttr("disabled");
                    } else {
                        buttons.hide();
                        input.attr("disabled", "disabled");
                    }
                }
            }
        };

        ko.bindingHandlers.lookup_binder = {
            init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var observable = valueAccessor(),
                    interceptor = ko.computed({
                        read: function () {
                            return observable();
                        },
                        write: function (newValue) {
                            observable(newValue);
                        }
                    });
                if ($(element).attr('data-prefetch') && element.value != "" && (observable() === undefined || observable() == null)) {
                    observable(element.value);
                    $(viewModel).prop($(element.form).find('#' + $(element).attr('data-related-control')).attr('data-bind').split(':')[1].replace(" ", ""))($(element).data("selected").id);
                }
                ko.applyBindingsToNode(element, { value: interceptor });
            },
            update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var valueUnwrapped = ko.utils.unwrapObservable(valueAccessor());

                if (valueUnwrapped === undefined) return;

                var input = $(element);

                if (input.attr('data-control') == 'lookup' || input.attr('data-control') == 'accountslookup' || input.attr('data-control') == 'searchlookup') {
                    var lookupType = input.attr('data-control');
                    var relatedControl = input.parent().parent().find("#{0}".format(input.attr('data-related-control')));
                    if (relatedControl.val() != "") {
                        if (lookupType == 'lookup')
                            input.lookup('selectItem', { id: relatedControl.val(), value: valueUnwrapped });

                        if (lookupType == 'accountslookup')
                            input.accountslookup('selectItem', { id: relatedControl.val(), value: valueUnwrapped });

                        if (lookupType == 'searchlookup')
                            input.lookup('selectItem', { id: relatedControl.val(), value: valueUnwrapped });
                    }

                    return;
                }

                throw 'Knockout binder error: Invalid Binding lookup_binding';
            }
        };

        /**
         * Creates a function with the specified options that will initialize the decimal binding handler.
         *
         * @param  {Object} options
         * @return {Function}
         */
        function decimalHandlerInit(options) {

            return function (element, valueAccessor) {
                var observable = valueAccessor();
                var interceptor = ko.computed({
                    read: function () { return ko.isObservable(observable) ? observable() : observable; },
                    write: function (newValue) { observable(newValue); }
                });

                try {
                    $(element).autoNumeric({
                        vMin: typeof (options.minValue) == "undefined" ? '0.0000' : options.minValue,
                        vMax: typeof (options.maxValue) == "undefined" ? '999999999999.9999' : options.maxValue,
                        mDec: typeof (options.decimalPlaces) == "undefined" ? 2 : options.decimalPlaces,
                        aSep: typeof (options.thousandSep) == "undefined" ? ',' : options.thousandSep,
                        wEmpty: typeof (options.defaultValue) == "undefined" ? 'zero' : options.defaultValue
                    });
                } catch (e) {
                    //This is expected, some of our views do
                    //a double binding and autonumeric doesn't like it
                    log("Warning: Possible double initialization of autonumeric");
                }

                ko.applyBindingsToNode(element, { value: interceptor });

                ko.utils.registerEventHandler(element, "change", function () {
                    var value = $(element).autoNumeric('get');
                    observable(value);
                });
            };
        }

        /**
         * Handles the ui update of the view model property.
         * Formats the value based on the autonumeric instance.
         */
        function decimalHandlerUpdate(element, valueAccessor) {
            var value = valueAccessor();
            var valueUnwrapped = ko.utils.unwrapObservable(value);

            if (valueUnwrapped !== undefined && valueUnwrapped !== null) {
                $(element).autoNumeric('set', valueUnwrapped);
            }
        }

        /**
         * Decimal Binding Handler.
         *
         * 4 Decimal places available
         * Defaults to 0
         * Comma as a thousands separator
         */
        ko.bindingHandlers.decimal4 = {
            init: decimalHandlerInit({ decimalPlaces: 4 }),
            update: decimalHandlerUpdate
        };

        /**
         * Decimal Binding Handler.
         *
         * 4 Decimal places available
         * Defaults to 0
         * Comma as a thousands separator
         */
        ko.bindingHandlers.decimal6 = {
            init: decimalHandlerInit({ decimalPlaces: 6 }),
            update: decimalHandlerUpdate
        };

        /**
         * Decimal Binding Handler.
         *
         * 2 Decimal places available
         * Defaults to 0
         * Comma as a thousands separator
         */
        ko.bindingHandlers.decimal2 = {
            init: decimalHandlerInit({ decimalPlaces: 2 }),
            update: decimalHandlerUpdate
        };

        /**
         * Decimal Binding Handler.
         *
         * 2 Decimal places available allows negatives
         * Defaults to 0
         * Comma as a thousands separator
         */
        ko.bindingHandlers.decimal2neg = {
            init: decimalHandlerInit({ decimalPlaces: 2, minValue: -9999999999.99 }),
            update: decimalHandlerUpdate
        };

        ko.bindingHandlers.decimal4neg = {
            init: decimalHandlerInit({ decimalPlaces: 4, minValue: -9999999999.9999 }),
            update: decimalHandlerUpdate
        };

        /**
         * IntegerMask Binding Handler.
         *
         * No decimal places
         * Defaults to 0
         * No comma separator
         */
        ko.bindingHandlers.numeric0 = {
            init: decimalHandlerInit({ decimalPlaces: 0, thousandSep: '' }),
            update: decimalHandlerUpdate
        };

        ko.bindingHandlers.numeric0Neg = {
            init: decimalHandlerInit({ decimalPlaces: 0, minValue: -9999999999, thousandSep: '' }),
            update: decimalHandlerUpdate
        };

        ko.bindingHandlers.money_text = {
            init: function (element, valueAccessor, allBindingsAccessor) {

                var observable = valueAccessor(),
                    interceptor = ko.computed({
                        read: function () {
                            if (ko.isObservable(observable))
                                return observable();
                            else
                                return observable;
                        }
                    });
                ko.applyBindingsToNode(element, { value: interceptor });
            },
            update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var value = valueAccessor();
                var valueUnwrapped = ko.utils.unwrapObservable(value);
                if (valueUnwrapped == null) {
                    return;
                }
                $(element).text(thousandSeparator(parseFloat(valueUnwrapped).toFixed(2), ","));
            }
        };

        ko.bindingHandlers.stopBinding = {
            init: function () {
                return { controlsDescendantBindings: true };
            }
        };

        function thousandSeparator(n, sep) {
            var sRegExp = new RegExp('(-?[0-9]+)([0-9]{3})'),
            sValue = n + '';

            if (sep === undefined) { sep = ','; }
            while (sRegExp.test(sValue)) {
                sValue = sValue.replace(sRegExp, '$1' + sep + '$2');
            }
            return sValue;
        };

        function koCurrencyFormatter (row, value, element) {
            var columnValue = (typeof element == "function")
                ? element()
                : element;
            var num = isNaN(columnValue) || columnValue === '' || columnValue === null ? 0.00 : columnValue;

            return thousandSeparator(Ofiview.FormatUtils.RoundTwoDecimals(num).toFixed(2), ",");
        };

        /**
         * Binding that creates a grid with columns representing each month
         */
        ko.bindingHandlers.conceptGrid = {

            /**
             * Initializes the Slick Grid view using the bindings 
             * and settings on the specified element
             * 
             * @param {HTMLElement} element
             * @param {Function} valueAccessor
             */
            init: function (element, valueAccessor) {
                var settings = valueAccessor();
                var data = ko.utils.unwrapObservable(settings.data);
                var options = ko.utils.unwrapObservable(settings.options) || {};
                var columns = ko.bindingHandlers.conceptGrid.columns(options);
                var grid;

                // Set last row for totals
                data.push(new Ofiview.Erp.ViewModel.TotalConcept(data));

                // Set default options
                var defaultOptions = {
                    enableColumnReorder: false,
                    editable: false,
                    enableCellNavigation: true,
                    autoEdit: true,
                    asyncEditorLoading: false,
                    enableAddRow: false,
                    forceFitColumns: false,
                    autoHeight: true
                };

                options = $.extend(options, defaultOptions);

                // Initialize grid
                grid = new Slick.Grid(element, data, columns, options);

                // Bind specific events.
                //grid.onBeforeEditCell.subscribe(function (e, args) {

                //    // Disable edition of Total row
                //    if (args.item instanceof Ofiview.Erp.ViewModel.TotalConcept) {
                //        return false;
                //    }

                //    return true;
                //});
                
                grid.onClick.subscribe(function (e, args) {

                    var cell = grid.getCellFromEvent(e);

                    var isReadOnly = $('#budgetConcept-grids').data('readonly');
                    //if (!isReadOnly) {
                        // discard all total or not account entry cells
                        if (grid.getDataItem(cell.row).Description() == "Total" || cell.cell > 0)
                            return;

                        if (grid.getColumns()[cell.cell].id == "Description") {
                            var urlOptions = {
                                Element: e.target.parentNode.parentNode.parentNode.parentNode.id,
                                Label: grid.getDataItem(cell.row).Description(),
                                IsSpecialBudget: grid.getDataItem(cell.row).IsSpecialBudget,
                                RowId: grid.getDataItem(cell.row).id,
                                Callback: ko.bindingHandlers.conceptGrid.setChildsData,
                                AccountFamilyId: grid.getDataItem(cell.row).AccountFamilyId(),
                                BudgetConceptId: grid.getDataItem(cell.row).BranchBudgetConceptId(),
                                VM: grid.getDataItem(cell.row).ConceptsDetail,
                                IsReadOnly: isReadOnly
                            };

                            // Accounting entry screen opens
                            Ofiview.Navigation.NavigateTo(Ofiview.Erp.BranchBudget.BudgetDetail, urlOptions);
                        }
                    //}
                    });

                $(element).data("slickgrid.instance", grid);
                $(element).data("slickgrid.source", data);
            },

            /**
             * Updates the Slick grid data items based on the KO internal data.
             * 
             * @param {HTMLElement} element
             * @param {Function} valueAccessor
             * @param {Function} allBindingAccessor
             * @param {Object} viewModel
             */
            update: function (element, valueAccessor, allBindingAccessor, viewModel) {
                var settings = valueAccessor();
                var data = ko.utils.unwrapObservable(settings.data);
                var grid = $(element).data("slickgrid.instance");

                grid.setData(data);
                grid.render();
                $(element).data("slickgrid.source", data);
            },

            /**
             * Returns the configuration of the columns for the grid
             *
             * @return  {Array.<Object>}
             */
            columns: function () {
                var meses = {
                    "JAN": "Ene", // PropertyKey : TITLE VERBIAGE --> "JAN" must match the property name used for each concept (case insensitive)
                    "FEB": "Feb",
                    "MAR": "Mar",
                    "APR": "Abr",
                    "MAY": "May",
                    "JUN": "Jun",
                    "JUL": "Jul",
                    "AUG": "Ago",
                    "SEP": "Sept",
                    "OCT": "Oct",
                    "NOV": "Nov",
                    "DEC": "Dic"
                };

                //Important: It received the value of each property (if it is turns out it is a function --> then it is an observable)
                //The assumptios is: if it is a function, then it is an observable
                var koFormatter = function (row, value, element) {
                    return typeof element == "function"
                        ? element()
                        : element;
                };

                var columns = [{
                    id: "Description",
                    name: "Rubro", // TITLE VERBIAGE
                    field: "Description", //This is the one that maps to the name of the property of the array
                    width: 136,
                    headerCssClass: 'mv-headerConcepto',
                    cssClass: 'mv-cellConcepto',
                    resizable: false,
                    focusable: false,
                    formatter: koFormatter
                }];

                $.each(meses, function (idx, description) {
                    var month = idx.charAt(0).toUpperCase() + idx.toLowerCase().slice(1);

                    columns.push({
                        id: month,
                        name: description,
                        field: month,
                        editor: Slick.Editors.AutoNumeric,
                        cssClass: 'mv-cell',
                        headerCssClass: 'mv-header',
                        resizable: false,
                        sortable: false,
                        width: 100,
                        formatter: koCurrencyFormatter
                    });

                });

                columns.push({
                    id: "Total",
                    name: "Total", // TITLE VERBIAGE
                    field: "Total",
                    width: 100,
                    cssClass: 'mv-cellTotal',
                    headerCssClass: 'mv-headerTotal',
                    resizable: false,
                    focusable: false,
                    formatter: koCurrencyFormatter
                });

                return columns;
            },

            setChildsData: function (data, options) {

                if (data) {

                    var gridData = $('#' + options.element).data("slickgrid.instance").getData(),
                        rowData = Enumerable.From(gridData).Where("$.id === " + options.rowId).Select().ToArray(),
                        vm = rowData[0];
                    // set in this vm concepts details values
                    vm.ConceptsDetail = data.ConceptsDetail;
                    // set monthly values individually
                    vm.Jan(data.Jan);
                    vm.Feb(data.Feb);
                    vm.Mar(data.Mar);
                    vm.Apr(data.Apr);
                    vm.May(data.May);
                    vm.Jun(data.Jun);
                    vm.Jul(data.Jul);
                    vm.Aug(data.Aug);
                    vm.Sep(data.Sep);
                    vm.Oct(data.Oct);
                    vm.Nov(data.Nov);
                    vm.Dec(data.Dec);
                }
            }

        };

        /**
         * Binding that creates a grid with columns representing each month.
         * The grid values represent rows from the specified source tables.
         */
        ko.bindingHandlers.conceptAggregatorGrid = {

            /**
             * Initializes the Slick Grid view using the bindings 
             * and settings on the specified element
             * 
             * @param {HTMLElement} element
             * @param {Function} valueAccessor
             */
            init: function (element, valueAccessor) {
                var settings = valueAccessor();
                var sources = ko.utils.unwrapObservable(settings.sources);
                var options = ko.utils.unwrapObservable(settings.options) || {};
                var columns = ko.bindingHandlers.conceptAggregatorGrid.columns(options);
                var grid;
                var data = [];

                // Get the total data rows from the source tables
                for (var idx = 0; idx < sources.length; idx++) {
                    grid = sources[idx];
                    var src = grid.data("slickgrid.source");

                    for (var rdx = 0; rdx < src.length; rdx++) {
                        if (src[rdx] instanceof Ofiview.Erp.ViewModel.TotalConcept) {
                            var row = new Ofiview.Erp.ViewModel.ReferencedConcept(-rdx - 2, grid.data("description"), grid.data("summonths"), src[rdx]);
                            data.push(row);
                        }
                    }
                }

                // Set last row for totals
                //data.push(new Ofiview.Erp.ViewModel.TotalConcept(data));

                // Set default options
                var defaultOptions = {
                    enableColumnReorder: false,
                    editable: false,
                    enableCellNavigation: true,
                    autoEdit: true,
                    asyncEditorLoading: false,
                    enableAddRow: false,
                    forceFitColumns: false,
                    autoHeight: true
                };

                options = $.extend(options, defaultOptions);

                // Initialize grid
                grid = new Slick.Grid(element, ko.observableArray(data), columns, options);

                $(element).data("slickgrid.instance", grid);
                $(element).data("slickgrid.source", data);
            },

            /**
             * Updates the Slick grid data items based on the KO internal data.
             * 
             * @param {HTMLElement} element
             * @param {Function} valueAccessor
             * @param {Function} allBindingAccessor
             * @param {Object} viewModel
             */
            update: function (element, valueAccessor, allBindingAccessor, viewModel) {
                var grid = $(element).data("slickgrid.instance");
                var data = $(element).data("slickgrid.source");

                grid.setData(data);
                grid.render();
            },

            /**
             * Returns the configuration of the columns for the grid
             *
             * @return  {Array.<Object>}
             */
            columns: function () {
                var meses = {
                    "JAN": "Ene", // PropertyKey : TITLE VERBIAGE
                    "FEB": "Feb",
                    "MAR": "Mar",
                    "APR": "Abr",
                    "MAY": "May",
                    "JUN": "Jun",
                    "JUL": "Jul",
                    "AUG": "Ago",
                    "SEP": "Sept",
                    "OCT": "Oct",
                    "NOV": "Nov",
                    "DEC": "Dic"
                };

                var koConceptFormatter = function (row, value, element) {
                    return (typeof element == "function")
                        ? element()
                        : element;
                };

                var columns = [{
                    id: "Description",
                    name: "Rubro", // TITLE VERBIAGE
                    field: "Description",
                    width: 136,
                    headerCssClass: 'mv-headerConcepto',
                    cssClass: 'mv-cellConcepto-fixed',
                    resizable: false,
                    focusable: false,
                    formatter: koConceptFormatter
                }];

                $.each(meses, function (idx, description) {
                    var month = idx.charAt(0).toUpperCase() + idx.toLowerCase().slice(1);

                    columns.push({
                        id: month,
                        name: description,
                        field: month,
                        editor: Slick.Editors.AutoNumeric,
                        cssClass: 'mv-cell-fixed',
                        headerCssClass: 'mv-header',
                        resizable: false,
                        sortable: false,
                        width: 100,
                        formatter: koCurrencyFormatter
                    });

                });

                columns.push({
                    id: "Total",
                    name: "Total", // TITLE VERBIAGE
                    field: "Total",
                    width: 100,
                    cssClass: 'mv-cellTotal-fixed',
                    headerCssClass: 'mv-headerTotal',
                    resizable: false,
                    focusable: false,
                    formatter: koCurrencyFormatter
                });

                return columns;
            }
        };

        return {
        };
    }(); //Singleton

})(jQuery);