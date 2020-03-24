const $ = require('jquery');

const Icons = function () {
};

Icons.prototype = {
    updateBooleanIcons: function() {
        $('img[src*="admin/img/icon-yes."]').after($('<span class="icon-tick">'));
        $('img[src*="admin/img/icon-no."]').after($('<span class="icon-cross">'));
        $('img[src*="admin/img/icon-unknown."]').after($('<span class="icon-question">'));
    },
    run: function() {
        try {
            this.updateBooleanIcons();
        } catch (e) {
            console.error(e, e.stack);
        }
    }
};

$(document).ready(function() {
    new Icons().run();
});
