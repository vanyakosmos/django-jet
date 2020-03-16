const $ = require('jquery');
const t = require('../utils/translate');

const ChangeFormTabsUpdater = function ($changeform) {
    this.$changeform = $changeform;
};

ChangeFormTabsUpdater.prototype = {
    findTabs: function ($modules, $inlines) {
        const tabs = [];

        let j = 0;
        $modules.each(function (i) {
            const $module = $(this);
            if (i !== 0 && !$module.hasClass('follow')) {
                j++;
            }

            const $header = $module.find('> h2').first();
            const title = $header.length !== 0 ? $header.html() : t('General');
            const className = 'module_' + j;

            $module.addClass(className);
            if (!$module.hasClass('follow')) {
                $header.remove();
                tabs.push({
                    className: className,
                    title: title
                });
            }
        });

        $inlines.each(function (i) {
            const $inline = $(this);
            const $header = $inline.find('> h2, > fieldset.module > h2, .tabular.inline-related > .module > h2').first();
            const title = $header.length !== 0 ? $header.html() : t('General');
            const className = 'inline_' + i;

            $inline.addClass(className);
            $header.remove();

            tabs.push({
                className: className,
                title: title
            });
        });

        return tabs;
    },
    createTabs: function ($contentWrappers, tabs) {
        if (tabs.length < 2) {
            return;
        }

        const $tabs = $('<ul>').addClass('changeform-tabs');

        $.each(tabs, function () {
            const tab = this;
            const $item = $('<li>')
                .addClass('changeform-tabs-item');
            const $link = $('<a>')
                .addClass('changeform-tabs-item-link')
                .html(tab.title)
                .attr('href', '#/tab/' + tab.className + '/');

            $link.appendTo($item);
            $item.appendTo($tabs);
        });

        $tabs.insertBefore($contentWrappers.first());
    },
    run: function () {
        const $container = this.$changeform.find('#content-main > form > div');
        const $modules = $container.find('> .module');
        const $inlines = $container.find('> .inline-group');
        const $contentWrappers = $().add($modules).add($inlines);

        try {
            const tabs = this.findTabs($modules, $inlines);
            this.createTabs($contentWrappers, tabs);
        } catch (e) {
            console.error(e, e.stack);
        }

        $contentWrappers.addClass('initialized');
    }
};

$(document).ready(function () {
    $('.change-form').each(function () {
        new ChangeFormTabsUpdater($(this)).run();
    });
});
