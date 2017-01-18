"use strict";
+function ($) {
    const key = "grid", checked = "checked", selected = "selected";

    $.fn.grid = function (options, param) {
        if (typeof options === "string") {
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

        const options = $.data(target, key).options;

        //table style
        $.each(options.tableStyle || [], function (i, value) {
            table.addClass(value)
        });

        //row template for fill
        let tr = cell(options);

        //fill
        head(table.children("thead"), options, tr);//TODO:reload checkbox
        body(table.children("tbody"), options, tr);

        //event
        event(table, options);
    }

    function cell(options) {
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

    function head(wrapper, options, tr) {
        let $tr = $(tr).data(selected, false);
        $.each(options.columns, function (index, map) {
            $tr.find("td[data-field ^= " + map.field + "]").text(map.title);
        });
        if (options.singleSelect) {
            $tr.find("td[data-field=grid-check]").empty();
        }
        wrapper.html($tr);
    }

    function body(wrapper, options, tr) {
        wrapper.empty();//for reload
        if (options.url) {
            $.ajax({
                url: options.url,
                data: options.params,
                type: options.method,
                async: options.async,
                dataType: options.type,
                success: function (data) {
                    load(data);
                }
            });
        } else {
            load(options.data || []);
        }

        function load(data) {
            $.each(data, function (i, row) {
                let $tr = $(tr).data(selected, false);

                $tr.find("td[data-field]").each(function () {
                    const field = $(this).attr("data-field");
                    $(this).text("grid-index" === field ? ++i : row[field]);
                });
                wrapper.append($tr);
            });
        }
    }

    function event(table, options) {
        //clean
        table.off("." + key);

        //1.checkbox
        const single = options.singleSelect;
        table.on("change." + key, "td[data-field=grid-check] :checkbox", function () {
            const $tr = $(this).parents("tr");
            const flag = $tr.data(selected);

            if ($tr.parent().is("thead")) {
                if (!single) {
                    $(table).find("tr").each(function () {
                        $(this).data(selected, !flag);
                    });
                }
            } else {
                if (single) {
                    $(table).find("tr").each(function () {
                        $(this).data(selected, false);
                    });
                }
                $tr.data(selected, !flag);
            }

            checkCss();
        });

        //2.row
        if (options.clickSelect) {
            table.on("click." + key, "tbody > tr", function (e) {
                /*if (!$(e.target).is("td[data-field=grid-check] :checkbox")) {
                 if (options.singleSelect) {
                 $(table).find("tr").each(function () {
                 $(this).data(selected, false);
                 });
                 }
                 $(this).data(selected, !$(this).data(selected));
                 checkCss();
                 }*/
                $(this).find("td[data-field=grid-check] :checkbox").trigger("click");
            });
        }

        function checkCss() {
            let parent = true;
            //td[data-field=grid-check] :checkbox
            table.find("tbody > tr").each(function () {
                const flag = $(this).data(selected);

                $(this).find("td[data-field=grid-check] :checkbox").prop(checked, flag);
                if (flag) {
                    $(this).addClass(options.selectedStyle);
                } else {
                    $(this).removeClass(options.selectedStyle);
                }

                parent = parent && flag;
            });

            const head = table.find("thead > tr");
            head.data(selected, parent);
            head.find("td[data-field=grid-check] :checkbox").prop(checked, parent);
            if (parent) {
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
        reload: function (target, params) {//TODO
            const options = this.options(target);
            if (params) {
                options.params = params;
            }
            body(target.find("tbody"), options, cell(options));
        }
    };
}(jQuery);