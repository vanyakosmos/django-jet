require('select2');

const $ = require('jquery');
const t = require('../utils/translate');

const Select2 = function () {
};

Select2.prototype = {
    updateAttachBody: function (AttachBody) {
        AttachBody.prototype._positionDropdown = function () {
            const $window = $(window);

            const isCurrentlyAbove = this.$dropdown.hasClass('select2-dropdown--above');
            const isCurrentlyBelow = this.$dropdown.hasClass('select2-dropdown--below');

            let newDirection = null;

            const position = this.$container.position();
            const offset = this.$container.offset();

            offset.bottom = offset.top + this.$container.outerHeight(false);

            const container = {
                height: this.$container.outerHeight(false)
            };

            container.top = offset.top;
            container.bottom = offset.top + container.height;

            const dropdown = {
                height: this.$dropdown.outerHeight(false)
            };

            const viewport = {
                top: $window.scrollTop(),
                bottom: $window.scrollTop() + $window.height()
            };

            const enoughRoomAbove = viewport.top < (offset.top - dropdown.height);
            const enoughRoomBelow = viewport.bottom > (offset.bottom + dropdown.height);

            const css = {
                left: offset.left,
                top: container.bottom
            };

            if (!isCurrentlyAbove && !isCurrentlyBelow) {
                newDirection = 'below';
            }

            if (!enoughRoomBelow && enoughRoomAbove && !isCurrentlyAbove) {
                newDirection = 'above';
            } else if (!enoughRoomAbove && enoughRoomBelow && isCurrentlyAbove) {
                newDirection = 'below';
            }

            if (newDirection === 'above' ||
                (isCurrentlyAbove && newDirection !== 'below')) {
                css.top = container.top - dropdown.height;
            }

            if (newDirection != null) {
                this.$dropdown
                    .removeClass('select2-dropdown--below select2-dropdown--above')
                    .addClass('select2-dropdown--' + newDirection);
                this.$container
                    .removeClass('select2-container--below select2-container--above')
                    .addClass('select2-container--' + newDirection);

                //hack
                const $search = this.$dropdown.find('.select2-search');

                if (newDirection === 'above' && $search.is(':first-child')) {
                    $search.detach().appendTo(this.$dropdown);
                } else if (newDirection === 'below' && $search.is(':last-child')) {
                    $search.detach().prependTo(this.$dropdown);
                }
            }

            this.$dropdownContainer.css(css);
        };

        AttachBody.prototype.render = function (decorated) {
            const $container = $('<span></span>');

            const $dropdown = decorated.call(this);
            $container.append($dropdown);

            this.$dropdownContainer = $container;

            //hack
            if (this.$element.prop('multiple')) {
                this.$dropdown.addClass('select2-multiple-dropdown');
            } else {
                this.$dropdown.removeClass('select2-multiple-dropdown');
            }

            return $container;
        };
    },
    updateDropdownAdapter: function (DropdownAdapter) {
        DropdownAdapter.prototype.render = function () {
            let buttons = '';

            if (this.options.get('multiple')) {
                buttons =
                    '<div class="select2-buttons">' +
                    '<a href="#" class="select2-buttons-button select2-buttons-button-select-all">' +
                    t('select all') +
                    '</a> ' +
                    '<a href="#" class="select2-buttons-button select2-buttons-button-deselect-all">' +
                    t('deselect all') +
                    '</a>' +
                    '</div>';
            }

            const $dropdown = $(
                '<span class="select2-dropdown">' +
                buttons +
                '<span class="select2-results"></span>' +
                '</span>'
            );

            const $element = this.$element;

            $dropdown.find('.select2-buttons-button-select-all').on('click', function (e) {
                e.preventDefault();
                const selected = [];
                $element.find('option').each(function () {
                    selected.push($(this).val());
                });
                $element.select2('val', selected);
                $element.select2('close');
            });

            $dropdown.find('.select2-buttons-button-deselect-all').on('click', function (e) {
                e.preventDefault();
                $element.select2('val', '');
                $element.select2('close');
            });

            $dropdown.attr('dir', this.options.get('dir'));
            this.$dropdown = $dropdown;
            return $dropdown;
        };
    },
    initSelect: function ($select, DropdownAdapter) {
        function opt(key, def) {
            return $select.data(key) || def;
        }

        const settings = {
            theme: 'jet',
            dropdownAdapter: DropdownAdapter,
            placeholder: opt('placeholder', ),
            width: opt('width', 'auto'),
            minimumInputLength: opt('minimumInputLength', 0),
            allowClear: opt('allowClear', false),
        };

        if ($select.hasClass('ajax')) {

            const contentTypeId = opt('content-type-id');
            const appLabel = opt('app-label');
            const model = opt('model');
            const objectId = opt('object-id');
            const blank = opt('blank', false);
            const pageSize = 100;

            settings['ajax'] = {
                delay: opt('delay', 250),
                dataType: 'json',
                data: function (params) {
                    return {
                        content_type: contentTypeId,
                        app_label: appLabel,
                        model: model,
                        q: params.term,
                        page: params.page,
                        page_size: pageSize,
                        object_id: objectId
                    };
                },
                processResults: function (data, {page, term}) {
                    if (blank &&
                        (page === undefined || page === 1) &&
                        (!term || term === '<empty string>')) {
                        data.results.unshift({
                            id: -1,  // select2 doesn't render empty id
                            text: '---------',
                            disabled: false,
                        });
                    }
                    return {
                        results: data.results,
                        pagination: data.pagination,
                    };
                }
            };
        }

        $select.on('change', function (e) {
            django.jQuery($select.get(0)).trigger(e);
        });

        $select.select2(settings);
    },
    initSelect2: function () {
        const self = this;
        const AttachBody = $.fn.select2.amd.require('select2/dropdown/attachBody');
        let DropdownAdapter = $.fn.select2.amd.require('select2/dropdown');
        const Utils = $.fn.select2.amd.require('select2/utils');
        const DropdownSearch = $.fn.select2.amd.require('select2/dropdown/search');
        const MinimumResultsForSearch = $.fn.select2.amd.require('select2/dropdown/minimumResultsForSearch');
        const closeOnSelect = $.fn.select2.amd.require('select2/dropdown/closeOnSelect');

        this.updateAttachBody(AttachBody);
        this.updateDropdownAdapter(DropdownAdapter);

        DropdownAdapter = Utils.Decorate(DropdownAdapter, DropdownSearch);
        DropdownAdapter = Utils.Decorate(DropdownAdapter, AttachBody);
        DropdownAdapter = Utils.Decorate(DropdownAdapter, MinimumResultsForSearch);
        DropdownAdapter = Utils.Decorate(DropdownAdapter, closeOnSelect);

        $(document).on('select:init', 'select', function () {
            const $select = $(this);

            if ($select.parents('.empty-form').length > 0) {
                return;
            }

            self.initSelect($select, DropdownAdapter);
        });

        $('select').trigger('select:init');

        $('.inline-group').on('inline-group-row:added', function (e, $inlineItem) {
            $inlineItem.find('select').trigger('select:init');
        });
    },
    run: function () {
        try {
            this.initSelect2();
        } catch (e) {
            console.error(e, e.stack);
        }
    }
};

$(document).ready(function () {
    new Select2().run();
});
