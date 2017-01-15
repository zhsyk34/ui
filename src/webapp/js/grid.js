"use strict";

+function ($) {

    const key = "grid";

    $.fn.grid = function (options) {
        if (typeof options == "string") {
            switch (options) {
                case "options":
                    return $.data(this[0], "page").options;
            }
        }
        options = options || {};
        return this.each(function () {
            var state = $.data(this, key);
            if (state) {
                $.extend(state.options, options);
            } else {
                $.data(this, key, {
                    options: $.extend({}, $.fn.grid.defaults, options)
                });
            }
            html(this);
            // listener(this);
        });
    };

    function html(target) {
        const table = $("<table class=\"table table-striped table-bordered table-hover\"><thead><tr></tr></thead><tbody></tbody></tbody></table>");
        $(target).html(table);

        const head = table.find("thead>tr");
        const body = table.children("tbody").empty();

        var options = $.data(target, key).options;
        var columns = options.columns;
        var url = options.url;

        var titles = [], fields = [];
        for (var i = 0, len = columns.length; i < len; i++) {
            titles.push(columns[i].title);
            fields.push(columns[i].field);
        }

        fillHead(head, titles);

        $.ajax({
            url: url,
            dataType: "json",
            success: function (data) {
                if (data == null || data.length === 0) {
                    return;
                }
                fillBody(body, data, fields);
            }
        });

    }

    function fillHead(tr, titles) {
        var str = "";
        $.each(titles, function (index, value) {
            str += "<td>" + value + "</td>";
        });
        tr.html(str);
    }

    function fillBody(body, data, fields) {
        $.each(data, function (index, row) {
            var tr = $("<tr></tr>");
            body.append(tr);

            var str = "";
            $.each(fields, function (index, key) {
                if (key === "") {

                }
                str += "<td>" + row[key] + "</td>";
            });
            tr.html(str);
        });
    }

    $.fn.grid.defaults = {
        style: ["table-striped", "table-bordered", "table-hover"],
        url: null,
        params: null,
        style: function (index, row) {

        }
    };
}(jQuery);

$("#data").grid({
    url: "lock/find",
    columns: [
        {field: "", checkbox: true},
        {field: "name", title: "名称", width: 10},
        {field: "number", title: "设备号", width: 10},
        {field: "uuid", title: "序列号", width: 10},
        {field: "createTime", title: "创建时间", width: 10},
        {
            field: "id", title: "密码设置", width: 10, align: "center", formatter: function (value) {
            return '<a class="set" data-id="' + value + '">设置</a>';
        }
        }
    ]
});
