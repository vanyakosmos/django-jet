require('./../utils/jquery-slidefade');

const $ = require('jquery');
const t = require('../utils/translate');

require('jquery-ui-bundle/jquery-ui.min');

const Dashboard = function ($dashboard) {
    this.$dashboard = $dashboard;
};

Dashboard.prototype = {
    initTools: function($dashboard) {
        $dashboard.find('.dashboard-tools-toggle').on('click', function (e) {
            e.preventDefault();
            $dashboard.find('.dashboard-tools').toggleClass('visible');
        });

        const $form = $dashboard.find('#add-dashboard-module-form');

        $form.find('.add-dashboard-link').on('click', function (e) {
            const $typeInput = $form.find('[name="type"]');
            const type = $form.find('[name="module"] option:selected').data('type');

            if (type) {
                $typeInput.val(type);

                $.ajax({
                    url: $form.attr('action'),
                    method: $form.attr('method'),
                    dataType: 'json',
                    data: $form.serialize(),
                    success: function (result) {
                        if (result.error) {
                            return;
                        }

                        document.location = result.success_url;
                    }
                });
            }

            e.preventDefault();
        });

        $dashboard.find('.reset-dashboard-link').on('click', function(e) {
            const buttons = {};
            const resetDashboard = function () {
                const $form = $dashboard.find('#reset-dashboard-form');

                $.ajax({
                    url: $form.attr('action'),
                    method: $form.attr('method'),
                    dataType: 'json',
                    data: $form.serialize(),
                    success: function (result) {
                        if (result.error) {
                            return;
                        }

                        location.reload();
                    }
                });
            };

            buttons[t('Yes')] = function() {
                resetDashboard();
                $(this).dialog('close');
            };

            buttons[t('Cancel')] = function() {
                $(this).dialog('close');
            };

            $dashboard.find('#reset-dashboard-dialog').dialog({
                resizable: false,
                modal: true,
                buttons: buttons
            });

            e.preventDefault();
        });
    },
    updateDashboardModules: function($dashboard) {
        const $form = $dashboard.find('#update-dashboard-modules-form');
        const modules = [];

        $dashboard.find('.dashboard-column').each(function () {
            const $column = $(this);
            const column = $column.closest('.dashboard-column-wrapper').index();

            $column.find('.dashboard-item').each(function () {
                const $item = $(this);
                const order = $item.index();
                const id = $item.data('module-id');

                modules.push({
                    id: id,
                    column: column,
                    order: order
                });
            });
        });

        $form.find('[name="modules"]').val(JSON.stringify(modules));

        $.ajax({
            url: $form.attr('action'),
            method: $form.attr('method'),
            dataType: 'json',
            data: $form.serialize()
        });
    },
    initModulesDragAndDrop: function($dashboard) {
        const self = this;

        $dashboard.find('.dashboard-column').droppable({
            activeClass: 'active',
            hoverClass: 'hovered',
            tolerance: 'pointer',
            accept: '.dashboard-item'
        }).sortable({
            items: '.dashboard-item.draggable',
            handle: '.dashboard-item-header',
            tolerance: 'pointer',
            connectWith: '.dashboard-column',
            cursor: 'move',
            placeholder: 'dashboard-item placeholder',
            forcePlaceholderSize: true,
            update: function (event, ui) {
                self.updateDashboardModules($dashboard);
            }
        });
    },
    initCollapsibleModules: function($dashboard) {
        const $form = $dashboard.find('#update-dashboard-module-collapse-form');

        $dashboard.find('.dashboard-item.collapsible').each(function () {
            const $item = $(this);
            const $link = $item.find('.dashboard-item-collapse');
            const $collapsible = $item.find('.dashboard-item-content');
            const moduleId = $item.data('module-id');

            $link.on('click', function (e) {
                e.preventDefault();

                $collapsible.slideFadeToggle(200, 'swing', function () {
                    const collapsed = $collapsible.is(':visible') === false;

                    if (collapsed) {
                        $item.addClass('collapsed')
                    } else {
                        $item.removeClass('collapsed')
                    }

                    $form.find('[name="id"]').val(moduleId);
                    $form.find('[name="collapsed"]').val(collapsed ? 'true' : 'false');

                    $.ajax({
                        url: $form.attr('action'),
                        method: $form.attr('method'),
                        dataType: 'json',
                        data: $form.serialize()
                    });
                });
            });
        });
    },
    initDeletableModules: function($dashboard) {
        const $form = $dashboard.find('#remove-dashboard-module-form');

        $dashboard.find('.dashboard-item.deletable').each(function () {
            const $item = $(this);
            const $link = $item.find('.dashboard-item-remove');
            const moduleId = $item.data('module-id');

            $link.on('click', function (e) {
                e.preventDefault();

                const buttons = {};

                const deleteModule = function () {
                    $item.fadeOut(200, 'swing', function () {
                        $form.find('[name="id"]').val(moduleId);

                        $.ajax({
                            url: $form.attr('action'),
                            method: $form.attr('method'),
                            dataType: 'json',
                            data: $form.serialize()
                        });
                    });
                };

                buttons[t('Delete')] = function () {
                    deleteModule();
                    $(this).dialog('close');
                };

                buttons[t('Cancel')] = function () {
                    $(this).dialog('close');
                };

                $dashboard.find('#module-remove-dialog').dialog({
                    resizable: false,
                    modal: true,
                    buttons: buttons
                });
            });
        });
    },
    initAjaxModules: function($dashboard) {
        $dashboard.find('.dashboard-item.ajax').each(function () {
            const $item = $(this);
            const $content = $item.find('.dashboard-item-content');
            const url = $item.data('ajax-url');

            $.ajax({
                url: url,
                dataType: 'json',
                success: function (result) {
                    if (result.error) {
                        $content.empty();
                        return;
                    }

                    const oldHeight = $content.height();
                    $content.html(result.html);
                    const newHeight = $content.height();

                    $content.height(oldHeight);
                    $content.animate({
                        height: newHeight
                    }, 250, 'swing', function() {
                        $content.height('auto');
                    });
                },
                error: function () {
                    $content.empty();
                }
            });
        });
    },
    updateModuleChildrenFormsetLabels: function($inline) {
        $inline.find('.inline-related').each(function(i) {
            $(this).find('.inline_label').text('#' + (i + 1));
        });
    },
    updateModuleChildrenFormsetFormIndex: function($form, index) {
        const prefix = "children";
        const id_regex = new RegExp("(" + prefix + "-(\\d+|__prefix__))");
        const replacement = prefix + "-" + index;

        $form.find("fieldset.module *").each(function() {
            const $el = $(this);

            $.each(['for', 'id', 'name'], function() {
                const attr = this;

                if ($el.attr(attr)) {
                    $el.attr(attr, $el.attr(attr).replace(id_regex, replacement));
                }
            });
        });
    },
    updateModuleChildrenFormsetFormsIndexes: function($inline) {
        const self = this;
        const from = parseInt($inline.find('.inline-related.has_original').length);

        $inline.find('.inline-related.last-related').each(function(i) {
            self.updateModuleChildrenFormsetFormIndex($(this), from + i);
        });
    },
    updateModuleChildrenFormsetTotalForms: function($inline) {
        const $totalFormsInput = $inline.find('[name="children-TOTAL_FORMS"]');
        const totalForms = parseInt($inline.find('.inline-related').length);

        $totalFormsInput.val(totalForms);
    },
    initModuleChildrenFormsetUpdate: function($dashboard) {
        if (!$dashboard.hasClass('change-form')) {
            return;
        }

        const self = this;
        const $inline = $dashboard.find('.inline-group');

        $inline.find('.add-row a').on('click', function(e) {
            e.preventDefault();

            const $empty = $inline.find('.inline-related.empty-form');
            const $clone = $empty
                .clone(true)
                .removeClass('empty-form')
                .insertBefore($empty);

            self.updateModuleChildrenFormsetLabels($inline);
            self.updateModuleChildrenFormsetFormIndex($empty, parseInt($inline.find('.inline-related').length) - 1);
            self.updateModuleChildrenFormsetFormIndex($clone, parseInt($inline.find('.inline-related').length) - 2);
            self.updateModuleChildrenFormsetTotalForms($inline);
        });

        $inline.find('.inline-deletelink').on('click', function(e) {
            e.preventDefault();

            $(this).closest('.inline-related').remove();

            self.updateModuleChildrenFormsetFormsIndexes($inline);
            self.updateModuleChildrenFormsetLabels($inline);
            self.updateModuleChildrenFormsetTotalForms($inline);
        });
    },
    run: function() {
        const $dashboard = this.$dashboard;

        try {
            this.initTools($dashboard);
            this.initModulesDragAndDrop($dashboard);
            this.initCollapsibleModules($dashboard);
            this.initDeletableModules($dashboard);
            this.initAjaxModules($dashboard);
            this.initModuleChildrenFormsetUpdate($dashboard);
        } catch (e) {
            console.error(e, e.stack);
        }

        $dashboard.addClass('initialized');
    }
};

$(document).ready(function() {
    $('.dashboard.jet').each(function() {
        new Dashboard($(this)).run();
    });
});
