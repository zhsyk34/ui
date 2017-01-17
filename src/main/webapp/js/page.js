+function ($) {
    const key = "page";
    $.fn.page = function (options, param) {
        if (typeof options === "string") {
            return $.fn.page.methods[options](this, param);
        }
        options = options || {};
        return this.each(function () {
            let state = $.data(this, key);
            if (state) {
                $.extend(state.options, options);
            } else {
                $.data(this, key, {
                    options: $.extend({}, $.fn.page.defaults, options)
                });
            }
            init(this);
            event(this);
        });
    };

    function init(target) {
        const $nav = $("<nav><ul class=\"pagination\"></ul></nav>");
        $(target).html($nav);

        const options = $.data(target, key).options;

        const $ul = $nav.children("ul");
        //style
        if (options.style) {
            $ul.addClass("pagination-" + options.style);
        }

        //pages
        let count = options.count = Math.ceil(options.total / options.size);

        $ul.append("<li data-index=\"back\"><a href=\"#\">&laquo;</a></li>");

        for (let i = 0; i < count; i++) {
            $ul.append("<li data-index=\"" + (i + 1) + "\"><a href=\"#\">" + (i + 1) + "</a></li>");
        }

        $ul.append("<li data-index=\"forward\"><a href=\"#\">&raquo;</a></li>");

        css(target);
    }

    function event(target) {
        $(target).find("li[data-index] > a").on("click", function (e) {
            e.preventDefault();
        });

        const options = $(target).page("options");
        $(target).on("click." + key, "li[data-index]:not(.disabled)", function () {
            let index = $(this).attr("data-index");
            switch (index) {
                case "back":
                    options.number = 1;
                    break;
                case "forward":
                    options.number = options.count;
                    break;
                default:
                    options.number = parseInt(index) || 1;
                    break;
            }

            css(target);
            options.change.call(this, options.number, options.size);
        });
    }

    function css(target) {
        const $ul = $(target).find("nav > ul.pagination");
        const options = $(target).page("options");
        //reset
        $ul.find("li[data-index]").removeClass("active disabled");
        const number = options.number, count = options.count;
        if (number === 1) {
            $ul.find("li[data-index=back]").addClass("disabled");
        }
        if (number === count) {
            $ul.find("li[data-index=forward]").addClass("disabled");
        }

        $ul.find("li[data-index=" + number + "]").addClass("active");
    }

    $.fn.page.defaults = {
        style: "lg",//lg sm null
        number: 1,
        size: 10,
        total: 50,
        change: function (number, size) {
            console.log(number, size);
        }
    };

    $.fn.page.methods = {
        options: function (target) {
            return $.data(target[0], key).options;
        },
        select: function (target, number) {//TODO
            const options = this.options(target);
            options.number = Math.min(options.count, number);
            css(target);
            options.change.call(this, options.number, options.size);
        }
    };
}(jQuery);

$("#data").page();

var i = 1;
setInterval(function () {
    $("#data").page("select", i++ % 6 + 1);
}, 800);
