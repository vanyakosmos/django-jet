const $ = require('jquery');

const TouchMoveNonScrollable = function () {
};

TouchMoveNonScrollable.prototype = {
    initTouchMoveHandler: function() {
        $(document).on('touchmove', function(e) {
            let allowed = true;
            let $node = $(e.target);

            while ($node.length > 0) {
                if ($node.hasClass('non-scrollable')) {
                    allowed = false;
                    break;
                } else if ($node.hasClass('scrollable') || $node.hasClass('ui-widget-overlay')) {
                    break;
                } else {
                    $node = $node.parent();
                }
            }

            if (!allowed) {
                e.preventDefault();
            }
        });
    },
    run: function() {
        try {
            this.initTouchMoveHandler();
        } catch (e) {
            console.error(e, e.stack);
        }
    }
};

$(document).ready(function() {
    new TouchMoveNonScrollable().run();
});
