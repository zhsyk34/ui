"use strict";
+function ($) {
    const key = "grid", checked = "checked", selected = "selected";

    $.fn.grid = function (options, param) {
        if (typeof options == "string") {
            return $.fn.grid.methods[options](this, param);
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

        //table style
        $.each(options.tableStyle || [], function (i, value) {
            table.addClass(value)
        });

        //row template for fill
        let tr = rowCell(options);

        //fill
        fillHead(head, options, tr);//TODO:reload checkbox
        fillBody(body, options, tr);

        //event
        event(table, options);
    }

    function rowCell(options) {
        let tr = "<tr>";
        if (options.rowIndex) {
            tr += "<td data-field=\"" + key + "-index\"></td>";
        }
        if (options.rowCheckbox) {
            tr += "<td data-field=\"" + key + "-check\"><input type=\"checkbox\" ></td>";
        }
        $.each(options.columns, function (i, map) {
            tr += "<td data-field=\"" + map.field + "\"></td>";
        });
        tr += "</tr>";
        return tr;
    }

    function fillHead(head, options, tr) {
        let $row = $(tr).data(selected, false);
        /*row.find("td[data-field ^= " + key + "]").each(function () {
         const field = $(this).attr("data-field");
         if (!/^grid-/.test(field)) {
         $(this).text();
         }
         });*/

        $.each(options.columns, function (index, map) {
            $row.find("td[data-field ^= " + map.field + "]").text(map.title);
        });
        head.html($row);
    }

    function fillBody(body, options, tr) {
        console.log("load data...");
        body.empty();//for reload
        if (options.url) {
            $.ajax({
                url: options.url,
                data: options.params,
                type: options.method,
                async: options.async,
                dataType: options.type,
                success: function (r) {
                    load(r);
                }
            });
        } else {
            load(options.data || []);
        }

        function load(data) {
            $.each(data, function (i, row) {
                let $row = $(tr).data(selected, false);

                $row.find("td[data-field]").each(function () {
                    const field = $(this).attr("data-field");
                    $(this).text("grid-index" === field ? ++i : row[field]);
                });
                body.append($row);
            });
        }
    }

    function event(table, options) {
        //1.checkbox
        table.on("change." + key, "thead td[data-field=grid-check] :checkbox", function () {
            const flag = $(this).parents("tr").data(selected);
            table.find("tr").each(function () {
                $(this).data(selected, !flag);
            });
            checkCss();
        });

        table.on("change." + key, "tbody td[data-field=grid-check] :checkbox", function () {
            const $tr = $(this).parents("tr");
            $tr.data(selected, !$tr.data(selected));
            checkCss();
        });

        //2.row
        if (options.clickSelect) {
            table.on("click." + key, "tbody > tr", function (e) {
                let checkbox = $(this).find("td[data-field=grid-check] :checkbox");
                if (e.target === checkbox[0]) {
                    console.log("input self");
                    return;
                }
                $(this).data(selected, !$(this).data(selected));

                checkCss();
            });
        } else {
            table.off("click." + key, "tbody > tr", function () {
            });
        }

        function checkCss() {
            let r = true;
            table.find("tbody td[data-field=grid-check] :checkbox").each(function () {
                const $tr = $(this).parents("tr");
                const flag = $tr.data(selected);

                $(this).prop(checked, flag);
                r = r && flag;

                if (flag) {
                    $tr.addClass(options.selectedStyle);
                } else {
                    $tr.removeClass(options.selectedStyle);
                }
            });

            const head = table.find("thead tr");
            head.find("td[data-field=grid-check] :checkbox").prop(checked, r);
            if (r) {
                head.addClass(options.selectedStyle);
            } else {
                head.removeClass(options.selectedStyle);
            }
        }
    }

    $.fn.grid.defaults = {
        tableStyle: ["table-striped", "table-bordered", "table-hover"],
        selectedStyle: "success",
        data: null,

        url: null,
        params: null,
        method: "GET",
        async: true,
        type: "JSON",

        rowIndex: true,
        rowCheckbox: true,

        singleSelect: false,
        clickSelect: true,

    };

    $.fn.grid.methods = {
        options: function (target) {
            return $.data(target[0], key).options;
        },
        reload: function (target) {
            const options = this.options(target);
            fillBody(target.find("tbody"), options, rowCell(options));
        }
    };
}(jQuery);

const data = [{"createTime": "2017-01-16T20:12:12.427", "gatewayId": 2, "id": 1, "name": "name1", "number": 3, "permission": false, "updateTime": "2017-01-16T20:12:12.428"}, {"createTime": "2017-01-16T20:12:12.428", "gatewayId": 4, "id": 2, "name": "name2", "number": 6, "permission": true, "updateTime": "2017-01-16T20:12:12.428"}, {"createTime": "2017-01-16T20:12:12.428", "gatewayId": 6, "id": 3, "name": "name3", "number": 9, "permission": false, "updateTime": "2017-01-16T20:12:12.428"}, {"createTime": "2017-01-16T20:12:12.428", "gatewayId": 8, "id": 4, "name": "name4", "number": 12, "permission": true, "updateTime": "2017-01-16T20:12:12.428"}];
$("#data").grid({
    // url: "lock/find",
    data: data,
    columns: [
        {field: "name", title: "名称", width: 10},
        {field: "number", title: "设备号", width: 10},
        {field: "gatewayId", title: "网关", width: 10},
        {field: "uuid", title: "序列号", width: 10},
        {field: "createTime", title: "创建时间", width: 10}
    ]
});

$("h1").on("click", function () {
    alert(1);
    $("#data").grid("reload");
    $("#data").grid({clickSelect: false});
});