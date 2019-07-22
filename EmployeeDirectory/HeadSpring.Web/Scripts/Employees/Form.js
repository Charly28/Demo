HeadSpring.Employees.Form = (function ($) {

    var dataUrl = '/rest/Employees',
        listEmployeesUrl = '/Employees/Index/';

    var _options = {},
        _toolbar,
        _Id,
        _vm;

    function init() {
        initControls();
        getViewModel();

        if (_Id > 0) {
            HeadSpring.Common.LoadData(dataUrl + "/" + _Id, null, bind, _toolbar);
        }
        else {
            bind();
        }
    }

    function initControls() {
        _toolbar = $("#toolbar-Employees");
        $('#Active').bootstrapToggle({
            on: 'Yes',
            off: 'No'
        });

        $('#RequiresUser').bootstrapToggle({
            on: 'Yes',
            off: 'No'
        });

        var url = window.location.href;
        _Id = parseInt(url.substring(url.lastIndexOf('/') + 1)) || 0;

        $("#Employees-form").on('submit', function (e) {
            if ($(this).valid()) {
                e.preventDefault();
                if (_vm.EmployeeId() != undefined) {
                    _options.id = _vm.EmployeeId();
                }
                HeadSpring.Common.SaveData(dataUrl, _options, ko.toJSON(_vm), saved, _toolbar);
            }
        });

        $("#btnCancel").on('click', function () {
            window.location.href = listEmployeesUrl;
        });
    }

    function getViewModel(data) {
        data = data || {};
        _vm = this;

        _vm.EmployeeId = ko.observable(data.EmployeeId);
        _vm.UserId = ko.observable(data.UserId);
        _vm.Name = ko.observable(data.Name);
        _vm.LastName = ko.observable(data.LastName);
        _vm.MotherLastName = ko.observable(data.MotherLastName);
        _vm.Email = ko.observable(data.Email);
        _vm.Phone = ko.observable(data.Phone);
        _vm.Location = ko.observable(data.Location);
        _vm.JobTitle = ko.observable(data.JobTitle);
        _vm.Active = ko.observable(data.Active);
        _vm.RoleName = ko.observable(data.RoleName);
        _vm.RequiresUser = ko.observable(data.RequiresUser);

        if (_vm.EmployeeId() != undefined) {
            $("#Email").attr("disabled", "disabled");
        }
    }

    function saved() {
        _toolbar.removeClass("toolbar");
        _toolbar.addClass("alert-success");
        var action = _vm.EmployeeId() ? "updated" : "created"
        _toolbar.html("<p>" + " Employee was " + action + " succesfully. </p>");
        setTimeout(function () {
            window.location.href = listEmployeesUrl;
        }, 2000);
    }

    function bind(data) {
        var viewModel = new getViewModel(data);

        if (!_vm.RequiresUser()) {
            $("#RoleName").attr("disabled", "disabled");
        }

        _vm.RequiresUser.subscribe(function () {

            if (_vm.RequiresUser()) {
                $("#RoleName").removeAttr("disabled", "disabled");
            }

            else {
                $("#RoleName").attr("disabled", "disabled");
                _vm.RoleName("");
            }
        });

        ko.applyBindings(viewModel);
    }

    return {
        Init: init
    }
})(jQuery);
