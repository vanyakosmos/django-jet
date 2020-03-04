const $ = require('jquery');

const ChangeFormTabs = function ($changeform) {
    this.$changeform = $changeform;
};

ChangeFormTabs.prototype = {
    getContentWrappers: function() {
        const $container = this.$changeform.find('#content-main > form > div');
        const $modules = $container.find('> .module');
        const $inlines = $container.find('> .inline-group');

        return $().add($modules).add($inlines);
    },
    getHashSelector: function(hash) {
        if (hash === undefined) {
            return null;
        }

        const result = hash.match(/^(#(\/tab\/(.+)\/)?)?$/i);

        if (result == null) {
            return null;
        }

        return result[3] !== undefined ? result[3] : '';
    },
    showTab: function(hash, firstOnError) {
        const $tabItems = this.$changeform.find('.changeform-tabs-item');
        const $contentWrappers = this.getContentWrappers();
        let selector = this.getHashSelector(hash);

        if (!firstOnError && selector == null) {
            return;
        }

        if (selector == null || selector.length === 0) {
            selector = this.getHashSelector(
                $tabItems.first().find('.changeform-tabs-item-link').attr('href')
            )
        }

        const $contentWrapper = $contentWrappers.filter('.' + selector);
        const $tabItem = $tabItems
            .find('.changeform-tabs-item-link[href="#/tab/' + selector + '/"]')
            .closest('.changeform-tabs-item');

        $tabItems.removeClass('selected');
        $tabItem.addClass('selected');

        $contentWrappers.removeClass('selected');
        $contentWrapper.addClass('selected');
    },
    initTabs: function() {
        const self = this;

        $(window).on('hashchange',function() {
            self.showTab(location.hash, false);
        });

        this.showTab(location.hash, true);
    },
    updateErrorState: function() {
        const $tabItems = this.$changeform.find('.changeform-tabs-item');
        const $contentWrappers = this.getContentWrappers();
        const obj = this;

        $tabItems.each(function() {
            const $tabItem = $(this);
            const selector = obj.getHashSelector(
                $tabItem.find('.changeform-tabs-item-link').attr('href')
            );

            if (selector) {
                const $contentWrapper = $contentWrappers.filter('.' + selector);

                if ($contentWrapper.find('.form-row.errors').length) {
                    $tabItem.addClass('errors');
                }
            }
        });
    },
    run: function() {
        try {
            this.initTabs();
            this.updateErrorState();
        } catch (e) {
            console.error(e, e.stack);
        }
    }
};

$(document).ready(function() {
    $('.change-form').each(function() {
        new ChangeFormTabs($(this)).run();
    });
});
