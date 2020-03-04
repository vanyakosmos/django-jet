const $ = require('jquery');

const ToolbarUpdater = function ($changelist) {
    this.$changelist = $changelist;
};

ToolbarUpdater.prototype = {
    getToolbar: function($changelist) {
        let $toolbar = $changelist.find('#toolbar');

        if ($toolbar.length === 0) {
            $toolbar = $('<div>').attr('id', 'toolbar');
            $('#changelist').prepend($toolbar);
        }

        return $toolbar;
    },
    updateToolbar: function($toolbar) {
        const placeholder = $toolbar.find('input[type="submit"]').val();
        $toolbar.find('#searchbar').attr('placeholder', placeholder);
    },
    moveFilters: function($changelist, $toolbar) {
        let filterName;
        const $search = $toolbar.find('#searchbar');

        $changelist.find('#changelist-filter').children().each(function() {
            const $element = $(this);

            if ($element.prop('tagName') === 'H3') {
                filterName = $element.text();
            } else if ($element.prop('tagName') === 'UL') {
                const $select = $('<select>');
                const $items = $element.find('li');

                $.each($element.prop('attributes'), function() {
                    $select.attr(this.name, this.value);
                });

                $select.addClass('changelist-filter-select');

                if ($items.filter('.selected').length > 1) {
                    $select.attr('multiple', true);
                }

                $items.each(function(i) {
                    const $item = $(this);
                    const $link = $item.find('a');
                    let $option = $('<option>')
                        .text($link.text())
                        .attr('data-url', $link.attr('href'))
                        .attr('selected', $item.hasClass('selected'));

                    if (i === 0 ) {
                        if (filterName != null) {
                            $option.text(filterName)
                        }

                        const $separator = $('<option>')
                            .attr('disabled', true)
                            .text('---');

                        $option = $option.add($separator);
                    }

                    $select.append($option);
                });

                var $wrapper = $('<span>')
                    .addClass('changelist-filter-select-wrapper')
                    .append($select);

                if ($search.length) {
                    $wrapper.insertAfter($search);
                } else {
                    $toolbar.append($wrapper);
                }

                filterName = null;
            } else if ($element.hasClass('changelist-filter-popup')) {
                const $toggle = $element.find('.changelist-filter-popup-toggle');
                const $content = $element.find('.changelist-filter-popup-content');
                var $wrapper = $('<span>')
                    .addClass('changelist-filter-select-wrapper')
                    .append($element);

                if ($search.length) {
                    $wrapper.insertAfter($search);
                } else {
                    $toolbar.append($wrapper);
                }

                $toggle.on('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    $content.toggleClass('visible');
                });

                $content.on('click', function(e) {
                    e.stopPropagation();
                });

                $(document.body).on('click', function() {
                    $content.removeClass('visible');
                });
            }
        });

        $changelist.find('#changelist-filter').remove();
    },
    fixFloatLineBreak: function() {
        $('#content-main').each(function() {
            const $content = $(this);

            $.each(['#toolbar', '.object-tools', 'changeform-navigation'], function(i, selector) {
                const $element = $content.find(selector).first();

                if ($element.length === 0) {
                    return;
                }

                $('<div>')
                    .addClass('clear')
                    .insertAfter($element);

                return false;
            });
        });
    },
    run: function() {
        const $toolbar = this.getToolbar(this.$changelist);

        try {
            this.updateToolbar($toolbar);
            this.moveFilters(this.$changelist, $toolbar);
        } catch (e) {
            console.error(e, e.stack);
        }

        try {
            this.fixFloatLineBreak();
        } catch (e) {
            console.error(e, e.stack);
        }

        $toolbar.addClass('initialized');
    }
};

$(document).ready(function() {
    $('#changelist').each(function() {
        new ToolbarUpdater($(this)).run();
    });
});
