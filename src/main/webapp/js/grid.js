"use strict";
+function ($) {
    const key = "grid", checked = "checked";

    $.fn.grid = function (options) {
        if (typeof options == "string") {
            switch (options) {
                case "options":
                    return $.data(this[0], key).options;
            }
        }
        options = options || {};
        return this.each(function () {
            let state = $.data(this, key);
            if (state) {
                $.extend(state.options, options);
            } else {
                $.data(this, key, {
                    options: $.extend({}, $.fn.grid.defaults, options)
                });
            }
            init(this);
        });
    };

    function init(target) {
        const table = $("<table class=\"table\"><thead></thead><tbody></tbody></tbody></table>");

        $(target).html(table);

        const head = table.children("thead");
        const body = table.children("tbody");

        const options = $.data(target, key).options;

        $.each(options.style || [], function (i, value) {
            table.addClass(value)
        });

        const url = options.url, columns = options.columns, index = options.index, checkbox = options.checkbox;
        fillHead(head, columns, index, checkbox);

        if (!options.data && url) {
            $.ajax({
                url: url,
                type: options.method,
                async: options.async,
                dataType: options.type,
                success: function (r) {
                    // data = r ? r["list"] : [];
                    fillBody(body, columns, r, index, checkbox);
                }
            });
        }

        event(table, head, body);
    }

    function fillHead(head, columns, index, checkbox) {
        let tr = "<tr>";
        if (index) {
            tr += "<td></td>";
        }
        if (checkbox) {
            tr += "<td><input type=\"checkbox\" class=\"grid-check\"></td>";
        }
        $.each(columns, function (i, cell) {
            tr += "<td>" + cell.title + "</td>";
        });
        tr += "</tr>";
        head.html($(tr).data(checked, false));
    }

    function fillBody(body, columns, data, index, checkbox) {
        $.each(data, function (i, row) {
            let tr = "<tr>";
            if (index) {
                tr += "<td>" + ++i + "</td>";
            }
            if (checkbox) {
                tr += "<td><input type=\"checkbox\" class=\"grid-check\"></td>";
                // tr += "<td><button type=\"button\" class=\"btn btn-sm btn-info\">选择</button></td>";
            }
            $.each(columns, function (j, cell) {
                tr += "<td>" + row[cell.field] + "</td>";
            });
            tr += "</tr>";

            body.append($(tr).data("row", row).data(checked, false));
        });
    }

    function event(table, head, body) {
        //1.checkbox
        head.on("click." + key, ":checkbox.grid-check", function (e) {
            e.preventDefault();
            let flag = head.children("tr").data(checked);
            table.find("tr").each(function () {
                $(this).data(checked, !flag);
            });
            checkCss();
        });

        body.on("click." + key, ":checkbox.grid-check", function (e) {
            e.preventDefault();
            let tr = $(this).parents("tr");
            tr.data(checked, !tr.data(checked));

            let flag = true;
            body.find("tr").each(function () {
                flag = flag && $(this).data(checked);
                if (!flag) {
                    return false;
                }
            });
            head.children("tr").data(checked, flag);
            checkCss();
        });

        //2.row
        // body.on("click." + key, "tr", function (e) {
        //     let checkbox = $(this).find(":checkbox.gird-body-check");
        //     if (e.target === checkbox[0]) {
        //         return;
        //     }
        //
        //     // console.log("tr");
        //     let checked = !checkbox.prop("checked");
        //     checkbox.prop("checked", checked);
        //     if (checked) {
        //         $(this).addClass("success");
        //     } else {
        //         $(this).removeClass("success");
        //     }
        // });

        function checkCss() {
            table.find(":checkbox.grid-check").each(function () {
                let tr = $(this).parents("tr");
                let flag = tr.data(checked);
                console.log(tr, flag);

                $(this).prop(checked, flag);

                if (flag) {
                    $(this).addClass("success");
                } else {
                    $(this).removeClass("success");
                }
            });
            // let tr = head.children("tr");
            // tr.find(":checkbox").prop(tr.data(checked));
            //
            // body.find("tr").each(function (i) {
            //     let flag = $(this).data(checked);
            //     console.log(i, flag);
            //     $(this).find(":checkbox").prop(checked, flag);
            //
            // });
        }
    }

    $.fn.grid.defaults = {
        style: ["table-striped", "table-bordered", "table-hover"],
        data: null,

        url: null,
        method: "GET",
        async: true,
        type: "JSON",

        index: true,
        checkbox: true,
        params: null,

        single: false
    };
}(jQuery);

$("#data").grid({
    url: "lock/find",
    columns: [
        {field: "name", title: "名称", width: 10},
        {field: "number", title: "设备号", width: 10},
        {field: "gatewayId", title: "网关", width: 10},
        {field: "uuid", title: "序列号", width: 10},
        {field: "createTime", title: "创建时间", width: 10}
    ]
});

var data = [{"createTime": "2017-01-16T20:12:12.427", "gatewayId": 2, "id": 1, "name": "name1", "number": 3, "permission": false, "updateTime": "2017-01-16T20:12:12.428"}, {"createTime": "2017-01-16T20:12:12.428", "gatewayId": 4, "id": 2, "name": "name2", "number": 6, "permission": true, "updateTime": "2017-01-16T20:12:12.428"}, {"createTime": "2017-01-16T20:12:12.428", "gatewayId": 6, "id": 3, "name": "name3", "number": 9, "permission": false, "updateTime": "2017-01-16T20:12:12.428"}, {"createTime": "2017-01-16T20:12:12.428", "gatewayId": 8, "id": 4, "name": "name4", "number": 12, "permission": true, "updateTime": "2017-01-16T20:12:12.428"}];