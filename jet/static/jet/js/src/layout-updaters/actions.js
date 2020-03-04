const $ = require('jquery');

const ActionsUpdater = function ($changelist) {
    this.$changelist = $changelist;
};

ActionsUpdater.prototype = {
    removeLabel: function($actions) {
        const $input = $actions.find('[name="action"]').first();

        if ($input.length === 0) {
            return;
        }

        const $label = $($input[0].previousSibling);

        if ($label.get(0).nodeType === 3) {
            $label.remove();
        }
    },
    wrapLabels: function($actions) {
        const $wrapper = $('<div>').addClass('labels');
        $actions.find('span.all, span.action-counter, span.clear, span.question')
                .wrapAll($wrapper);
    },
    moveActions: function($actions) {
        const $paginator = this.$changelist.find('.paginator');
        const $wrapper = $('<div>').addClass('changelist-footer');

        $wrapper.insertAfter($paginator);

        $actions.detach();
        $paginator.detach();

        $wrapper
            .append($actions)
            .append($paginator)
            .append($('<div>').addClass('cf'));
    },
    run: function() {
        const $actions = this.$changelist.find('.actions');

        try {
            this.removeLabel($actions);
            this.wrapLabels($actions);
            this.moveActions($actions);
        } catch (e) {
            console.error(e, e.stack);
        }

        $actions.addClass('initialized');
    }
};

$(document).ready(function() {
    $('#changelist').each(function() {
        new ActionsUpdater($(this)).run();
    });
});
