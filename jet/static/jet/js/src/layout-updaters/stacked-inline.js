const $ = require('jquery');

const StackedInlineUpdater = function ($inline) {
    this.$inline = $inline;
};

StackedInlineUpdater.prototype = {
    updateObjectLinks: function() {
        const $label = this.$inline.find('.inline_label');
        const $changelink = $label.find('> .inlinechangelink');

        $label
            .find('+ a')
            .addClass('inlineviewlink')
            .text('');
        $changelink
            .text('')
            .detach()
            .insertAfter($label);
    },
    run: function() {
        try {
            this.updateObjectLinks();
        } catch (e) {
            console.error(e, e.stack);
        }

        this.$inline.addClass('initialized');
    }
};

$(document).ready(function() {
    $('.inline-related:not(.tabular)').each(function() {
        new StackedInlineUpdater($(this)).run();
    });
});
