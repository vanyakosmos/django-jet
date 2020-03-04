const $ = require('jquery');

const BreadcrumbsUpdater = function ($breadcrumbs) {
    this.$breadcrumbs = $breadcrumbs;
};

BreadcrumbsUpdater.prototype = {
    replaceSeparators: function($breadcrumbs) {
        let html = $breadcrumbs.html();

        html = html.replace(/›/g, '<span class="icon-arrow-right breadcrumbs-separator"></span>');

        $breadcrumbs.html(html);
    },
    scrollToEnd: function($breadcrumbs) {
        $breadcrumbs.scrollLeft($breadcrumbs[0].scrollWidth - $breadcrumbs.width());
    },
    run: function() {
        const $breadcrumbs = this.$breadcrumbs;

        try {
            this.replaceSeparators($breadcrumbs);
            this.scrollToEnd($breadcrumbs);
        } catch (e) {
            console.error(e, e.stack);
        }

        $breadcrumbs.addClass('initialized');
    }
};

$(document).ready(function() {
    const $breadcrumbs = $('.breadcrumbs');

    if ($breadcrumbs.length === 0) {
        return;
    }

    $breadcrumbs.each(function() {
        new BreadcrumbsUpdater($(this)).run();
    });
});
