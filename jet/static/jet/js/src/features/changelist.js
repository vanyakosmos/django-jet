const $ = require('jquery');

const ChangeList = function ($changelist) {
    this.$changelist = $changelist;
};

ChangeList.prototype = {
    updateFixedHeaderVisibility: function($fixedTable, $originalHeader) {
        const show = $(window).scrollTop() > $originalHeader.offset().top;
        $fixedTable.closest('table').toggle(show);
    },
    updateFixedHeaderWidth: function($fixedHeader, $originalHeader) {
        const $originalColumns = $originalHeader.find('th');
        const $columns = $fixedHeader.find('th');

        $originalColumns.each(function(i) {
            $columns.eq(i).css('width', $(this).width());
        });
    },
    initFixedHeader: function($changelist) {
        const $originalHeader = $changelist.find('#result_list thead');

        if ($originalHeader.length === 0) {
            return;
        }

        const $fixedHeader = $originalHeader.clone();
        const $fixedTable = $('<table>').addClass('helper').append($fixedHeader);

        $fixedTable.find('.action-checkbox-column').empty();
        $fixedTable.appendTo(document.body);

        $(window).on('scroll', $.proxy(this.updateFixedHeaderVisibility, this, $fixedTable, $originalHeader));
        $(window).on('resize', $.proxy(this.updateFixedHeaderWidth, this, $fixedHeader, $originalHeader));

        this.updateFixedHeaderWidth($fixedHeader, $originalHeader);
    },
    updateFixedFooter: function($results, $footer) {
        if ($(window).scrollTop() + $(window).height() < $results.offset().top + $results.outerHeight(false) + $footer.innerHeight()) {
            if (!$footer.hasClass('fixed')) {
                const previousScrollTop = $(window).scrollTop();

                $footer.addClass('fixed');
                $results.css('margin-bottom', ($footer.innerHeight()) + 'px');

                $(window).scrollTop(previousScrollTop);
            }
        } else {
            if ($footer.hasClass('fixed')) {
                $footer.removeClass('fixed');
                $results.css('margin-bottom', 0);
            }
        }
    },
    initFixedFooter: function($changelist) {
        const $footer = $changelist.find('.changelist-footer');
        const $results = $footer.siblings('.results');

        if ($footer.length === 0 || $results.length === 0) {
            return;
        }

        $(window).on('scroll', $.proxy(this.updateFixedFooter, this, $results, $footer));
        $(window).on('resize', $.proxy(this.updateFixedFooter, this, $results, $footer));

        this.updateFixedFooter($results, $footer);
    },
    initHeaderSortableSelection: function() {
        $('table thead .sortable').on('click', function(e) {

            if (e.target !== this) {
                return;
            }

            const link = $(this).find('.text a').get(0);

            if (link !== undefined) {
                link.click();
            }
        });
    },
    initRowSelection: function($changelist) {
        $changelist.find('#result_list tbody th, #result_list tbody td').on('click', function(e) {
            // Fix selection on clicking elements inside row (e.x. links)
            if (e.target !== this) {
                return;
            }

            $(this).closest('tr').find('.action-checkbox .action-select').click();
        });
    },
    run: function() {
        const $changelist = this.$changelist;

        try {
            this.initFixedHeader($changelist);
            this.initFixedFooter($changelist);
            this.initHeaderSortableSelection($changelist);
            this.initRowSelection($changelist);
        } catch (e) {
            console.error(e, e.stack);
        }

        this.$changelist.addClass('initialized');
    }
};

$(document).ready(function() {
    $('#changelist').each(function() {
        new ChangeList($(this)).run();
    });
});
