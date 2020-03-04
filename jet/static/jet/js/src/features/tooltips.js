const $ = require('jquery');

require('jquery-ui-bundle/jquery-ui.min');
require('browsernizr/test/touchevents');
require('browsernizr');

const Tooltips = function () {
};

Tooltips.prototype = {
    initTooltips: function () {
        if (!$(document.documentElement).hasClass('touchevents')) {
            $('a[title], .tooltip[title]').tooltip({
                track: true
            });
        }
    },
    run: function () {
        try {
            this.initTooltips();
        } catch (e) {
            console.error(e, e.stack);
        }
    }
};

$(document).ready(function () {
    new Tooltips($(this)).run();
});
