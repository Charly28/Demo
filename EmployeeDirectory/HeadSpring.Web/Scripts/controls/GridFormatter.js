namespace("HeadSpring");

(function ($, undefined) {

    HeadSpring.Controls.GridFormatter = function () {

        function emptyString0Currency(cellvalue, options, rowObject) {
            return cellvalue == 0 ? "" : currencyFormatter(cellvalue, options, rowObject);
        }

        function emptyStringCurrency4(cellvalue, options, rowObject) {
            return isNaN(cellvalue) || cellvalue === '' || cellvalue === null ? "" : currencyFormatter4(cellvalue, options, rowObject);
        }

        function yesNoFormatter(cellvalue, options, rowObject) {
            return cellvalue ? "Yes" : "No";
        }

        function dateFormatter(cellvalue, options, rowObject) {
            var value = cellvalue || "";
            var date;

            if (value === "") {
                return "";
            }

            if (jQuery.type(cellvalue) === "date") {
                value = cellvalue.toString('dd/MM/yyyy');
            }
            else {
                if (cellvalue && cellvalue.startsWith("/Date")) {
                    value = cellvalue.dateFromJson().toString("dd/MM/yyyy");
                }
                else if (cellvalue && cellvalue.toString().indexOf("T") > 0) {
                    date = cellvalue.split('T')[0].split('-');
                    value = date[2] + "/" + date[1] + "/" + date[0];
                }
                else {
                    date = cellvalue.split('-');
                    if (date.length === 3)
                        value = date[2] + "/" + date[1] + "/" + date[0];
                    else
                        value = date[0];
                }
            }

            return value;
        }

        function fullDateFormatter(cellvalue, options, rowObject) {
            var value = cellvalue || "";
            var date;
            var hour;

            if (value === "") {
                return "";
            }

            if (jQuery.type(cellvalue) === "date") {
                value = cellvalue.toString('dd/MM/yyyy HH:mm');
            }
            else {
                if (cellvalue && cellvalue.startsWith("/Date")) {
                    value = cellvalue.dateFromJson().toString("dd/MM/yyyy");
                }
                else if (cellvalue && cellvalue.toString().indexOf("T") > 0) {
                    date = cellvalue.split('T')[0].split('-');
                    hour = cellvalue.split('T')[1].split(':');
                    value = date[2] + "/" + date[1] + "/" + date[0] + " " + hour[0] + ":" + hour[1];
                }
                else {
                    date = cellvalue.split('-');
                    if (date.length === 3)
                        value = date[2] + "/" + date[1] + "/" + date[0];
                    else
                        value = date[0];
                }
            }

            return value;
        }

        function roundTwoDecimals(num, decimals) {
            var d = decimals || 2;
            var m = Math.pow(10, d);
            var n = +(d ? num * m : num).toFixed(8);
            var i = Math.floor(n), f = n - i;
            var e = 1e-8;
            var r = (f > 0.5 - e && f < 0.5 + e) ?
                ((i % 2 == 0) ? i : i + 1) : Math.round(n);
            return d ? r / m : r;
        }

        function currencyFormatter(cellvalue, options, rowObject) {
            var num = isNaN(cellvalue) || cellvalue === '' || cellvalue === null ? 0.00 : cellvalue,
                value = "$ " + thousandSeparator(roundTwoDecimals(num).toFixed(2), ",");
            return value;
        }

        function currencyFormatter4(cellvalue, options, rowObject) {
            var num = isNaN(cellvalue) || cellvalue === '' || cellvalue === null ? 0.0000 : cellvalue,
                value = "$ " + thousandSeparator(parseFloat(num).toFixed(4), ",");
            return value;
        }

        function ssnFormatter(cellvalue, options, rowObject) {
            if (rowObject.SSN) {
                return "<a class='ssn' data-ssn='{0}' href='#'>{1}</a>".format(rowObject.SSN, cellvalue);
            }
            return cellvalue || "";
        }

        function activeRecord(cellValue, oprtions, rowObject) {
            return cellValue ? "Active" : "Inactive";
        }

        function numberFormatter(cellvalue, options, rowObject) {
            var num = isNaN(cellvalue) || cellvalue === '' || cellvalue === null ? 0.00 : cellvalue,
                      value = parseFloat(num).toFixed(2);
            return value;
        }

        function numberFormatter4(cellvalue, options, rowObject) {
            var num = isNaN(cellvalue) || cellvalue === '' || cellvalue === null ? 0.0000 : cellvalue,
                value = parseFloat(num).toFixed(4);
            return value;
        }

        function numberFormatter6(cellvalue, options, rowObject) {
            var num = isNaN(cellvalue) || cellvalue === '' || cellvalue === null ? 0.000000 : cellvalue,
                value = parseFloat(num).toFixed(6);
            return value;
        }

        function thousandSeparator(n, sep) {
            var sRegExp = new RegExp('(-?[0-9]+)([0-9]{3})'),
            sValue = n + '';

            var sValusSplited = sValue.split('.');

            if (sep === undefined) { sep = ','; }
            while (sRegExp.test(sValusSplited[0])) {
                sValusSplited[0] = sValusSplited[0].replace(sRegExp, '$1' + sep + '$2');
            }
            return sValusSplited.join('.');
        }

        function numericCell(rowid, val, rawObject, cm, rdata) {
            return "style='text-align:right!Important; padding-right:5px !Important;'";
        }


        return {
            Date: dateFormatter,
            FullDate: fullDateFormatter,
            Currency: currencyFormatter,
            Currency4: currencyFormatter4,
            SSN: ssnFormatter,
            ActiveRecord: activeRecord,
            YesNoFormatter: yesNoFormatter,
            EmptyString0Currency: emptyString0Currency,
            EmptyStringCurrency4: emptyStringCurrency4,
            Numeric: numberFormatter,
            Numeric4: numberFormatter4,
            Numeric6: numberFormatter6,
            NumericCell: numericCell,
            RoundTwoDecimals: roundTwoDecimals
        };

    }(); //Singleton

})(jQuery);