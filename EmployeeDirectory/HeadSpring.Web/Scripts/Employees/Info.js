HeadSpring.Employees.Info = (function ($) {

    var dataUrl = '/rest/Employees',
        listEmployeesUrl = '/Employees/Index/';

    var _options = {},
        _toolbar,
        _Id,
        _vm;

    function init() {
        initControls();
        getViewModel();

        if (_Id) {
            HeadSpring.Common.LoadData(dataUrl + "/" + _Id, null, bind, _toolbar);
        }
        else {
            bind();
        }
    }

    function initControls() {
        _toolbar = $("#toolbar-InfoEmployees");

        var url = window.location.href;
        _Id = url.substring(url.lastIndexOf('/') + 1);

        $("#btnCancel").on('click', function () {
            window.location.href = listEmployeesUrl;
        });
    }

    function getViewModel(data) {
        data = data || {};
        _vm = this;

        _vm.EmployeeId = ko.observable(_Id != undefined ? data.EmployeeId : null);
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
    }

    function bind(data) {
        var viewModel = new getViewModel(data);
        ko.applyBindings(viewModel);
    }

    return {
        Init: init
    }
})(jQuery);
