namespace("HeadSpring.Controls");

(function ($, undefined) {

    var gridIndex = 0;

    var jsonReader = {
        root: "Rows",
        page: "CurrentPage",
        total: "TotalPages",
        records: "Records",
        repeatitems: false,
        cell: "Cell",
        id: "Id",
        userdata: "Rows",
        subgrid: {
            root: "Rows",
            repeatitems: false,
            cell: "Cell"
        }
    };

    var gridConfiguration = {
        datatype: "json",
        mtype: "GET",
        autoencode: true,
        jsonReader: jsonReader,
        height: "100%", 
        autowidth: true,
        rowNum: 10, 
        viewrecords: true,
        sortname: "Id",
        sortorder: "asc",
        shrinkToFit: true,
        hidegrid: false,
        onSortCol: function () {
            $(this).setGridParam({ requestOriginator: "ignoreme" });
        },
        onPaging: function () {
            $(this).setGridParam({ requestOriginator: "ignoreme" });
        }
    };

    HeadSpring.Controls.Grid = function (c) {
        gridIndex++;

        var container = c,
            grid;

        function getColNames(colModel) {
            var colNames = [];

            $.each(colModel, function (index, item) {
                colNames.push(item.label || item.name || item.id || "");
            });

            return colNames;
        }

        function getKey(colModel) {
            var key = null;

            $.each(colModel, function (index, item) {
                if (item.key) {
                    key = item.name;
                    return false;
                }
            });

            return key;
        }

        function load(colModel, data, options) {
            var gridOptions = $.extend({}, gridConfiguration, {
                colNames: getColNames(colModel),
                colModel: colModel,
                sortname: getKey(colModel)
            });

            gridOptions = $.extend(gridOptions, options);

            if (typeOf(data) == "string") {
                gridOptions.url = data;
            } else {
                gridOptions.datatype = "local";
                gridOptions.data = data;
            }

            return initGrid(gridOptions);
        }

        function resizeGrid() {
            $(window).on("resize", function () {
                var width = grid.parent().parent().parent().parent().parent().parent().width();
                grid.setGridWidth(width);
            }).resize();
        }

        function initGrid(gridOptions) {
            var containerId = container.attr("id");

            gridOptions.altRows = true;
            gridOptions.altclass = "jqgrid-alt-row";
            gridOptions.autowidth = true;

            grid = $("<table id='{0}-{1}-grid' class=''>".format(gridIndex, containerId)).appendTo(container);

            if (gridOptions.pager === undefined || gridOptions.pager === true) {
                $("<div id=\"{0}-{1}-pager\" class=\"grid-pager\"></div>".format(gridIndex, containerId)).insertAfter(grid);
                gridOptions.pager = "#{0}-{1}-pager".format(gridIndex, containerId);
            }

            grid.jqGrid(gridOptions);
            grid.navGrid(gridOptions.pager, { refresh: false, search: false, edit: false, add: false, del: false, searchtext: "Search" });
            resizeGrid();

            return grid;
        }

        /* Methods */
        function getSelectedRow() {
            return grid.jqGrid("getGridParam", "selrow");
        }

        function getSelectedData() {
            var rowid = getSelectedRow();
            return rowid == null ? null : grid.jqGrid("getRowData", rowid);
        }

        function reload(data) {
            if (typeOf(data) == "string") {
                grid.jqGrid("setGridParam", { url: data });
            } else {
                grid.jqGrid("setGridParam", { data: data });
            }

            grid.trigger("reloadGrid", [{ page: 1 }]);
        }

        function addRow(id, data) {
            return grid.jqGrid("addRowData", id, data, "last");
        }

        function editRow(id, data) {
            return grid.jqGrid("setRowData", id, data);
        }

        function deleteRow(id) {
            return grid.jqGrid("delRowData", id);
        }

        function resetGrid() {
            return grid.jqGrid("clearGridData");
        }

        function originalGrid() {
            return grid;
        }

        return {
            Load: load,
            GetSelected: getSelectedData,
            GetSelectedId: getSelectedRow,
            Reload: reload,
            AddRow: addRow,
            EditRow: editRow,
            DeleteRow: deleteRow,
            OriginalGrid: originalGrid,
            ResetGrid: resetGrid,
            ResizeGrid: resizeGrid
        };
    };

})(jQuery);
