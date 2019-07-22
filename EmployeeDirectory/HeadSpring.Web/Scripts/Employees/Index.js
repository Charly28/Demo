HeadSpring.Employees = (function ($) {

    var dataUrl = "/rest/Employees/",
        employeesInfoUrl = '/Employees/Info/',
        employeesFormUrl = '/Employees/Form/';

    var grid,
        _view,
        _nameFilter,
        _lastNameFilter,
        _locationFilter,
        _emailFilter,
        _activeFilter,
        _toolbar,
        _html;

    function init() {
        initControls();
        initGrid();
        initButtons();
    }

    function initControls() {
        _view = $(".container");
        _nameFilter = $("#name-filter");
        _lastNameFilter = $("#lastName-filter");
        _locationFilter = $("#location-filter");
        _emailFilter = $("#email-filter");
        _activeFilter = $("#active-dropdown");
        _toolbar = $("#toolbar-List");
        _html = '<p> Please select an Employee. </p>';
    }

    function initGrid() {
        var colModel = [
            { id: "EmployeeId", name: "EmployeeId", field: "EmployeeId", sortable: false, key: true, hidden: true },
            { id: "Name", name: "Name", field: "Name", sortable: true, label: "Name" },
            { id: "LastName", name: "LastName", field: "LastName", sortable: true, label: "LastName" },
            { id: "Email", name: "Email", field: "Email", sortable: true, label: "Email" },
            { id: "Location", name: "Location", field: "Location", sortable: true, label: "Location" },
            { id: "Active", name: "Active", field: "Active", sortable: true, label: "Active", formatter: HeadSpring.Controls.GridFormatter.ActiveRecord }
        ];

        grid = HeadSpring.Controls.Grid($("#employees-Grid"));
        grid.Load(colModel, dataUrl, { rowNum: 30 });
    }

    function initButtons() {
        $("#btnSearch").click(search);
        $("#btnReload").click(reload);
        $(".add").click(add);
        $(".edit").click(edit);
        $(".delete").click(remove);
        $(".info").click(info);
    }

    function search() {
        var searchUrl = dataUrl + "?";

        if (_nameFilter.val().length > 0) {
            searchUrl = searchUrl + "&Name=" + _nameFilter.val();
        }

        if (_lastNameFilter.val().length > 0) {
            searchUrl = searchUrl + "&LastName=" + _lastNameFilter.val();
        }

        if (_locationFilter.val().length > 0) {
            searchUrl = searchUrl + "&Location=" + _locationFilter.val();
        }

        if (_emailFilter.val().length > 0) {
            searchUrl = searchUrl + "&Email=" + _emailFilter.val();
        }

        if (_activeFilter.val().length > 0) {
            searchUrl = searchUrl + "&Active=" + _activeFilter.val();
        }

        grid.Reload(searchUrl);
    }

    function add() {
        window.location.href = employeesFormUrl;
    }

    function edit() {
        var _options = {};
        if (grid.GetSelectedId() != undefined) {
            window.location.href = employeesFormUrl + grid.GetSelectedId();
        }

        else {
            getNotSelectedItemError();
        }
    }

    function remove() {
        var selected = grid.GetSelected();
        if (selected != undefined) {
            HeadSpring.Common.DeleteData(dataUrl, selected.EmployeeId, itemDeleted, _toolbar);
        }

        else {
            getNotSelectedItemError();
        }
    }

    function itemDeleted() {
        _toolbar.removeClass("toolbar");
        _toolbar.addClass("alert-success");
        _toolbar.html("<p>" + "Employee was deleted succesfully." + "</p>");

        setTimeout(function () {
            _toolbar.addClass("toolbar");
            _toolbar.removeClass("alert-success");
            _toolbar.html("");
            grid.Reload();
        }, 1000);
    }

    function info() {
        var selected = grid.GetSelected();
        if (grid.GetSelected()) {
            window.location.href = employeesInfoUrl + grid.GetSelectedId();
        }

        else {
            getNotSelectedItemError();
        }
    }

    function getNotSelectedItemError() {
        HeadSpring.Common.GetNotSelectedItem(_toolbar, _html);
    }

    function reload() {
        setTimeout(function () {
            location.reload();
        }, 200);

        //Clear all filters
        $('input[type="text"]').val('');
        $('select').val('');
    }

    return {
        Init: init
    }
})(jQuery);
