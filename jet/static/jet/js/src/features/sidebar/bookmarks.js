const $ = require('jquery');
const t = require('../../utils/translate');

require('jquery-ui-bundle/jquery-ui.min');

const SideBarBookmarks = function ($sidebar) {
    this.$sidebar = $sidebar;
};

SideBarBookmarks.prototype = {
    addBookmark: function ($form, $container) {
        $.ajax({
            url: $form.attr('action'),
            method: $form.attr('method'),
            dataType: 'json',
            data: $form.serialize(),
            success: function (result) {
                if (result.error) {
                    return;
                }

                const $item = $container
                    .find('.bookmark-item.clone')
                    .clone()
                    .removeClass('clone');

                $item
                    .attr('href', result.url)
                    .find('.sidebar-link-label')
                    .append(result.title);
                $item
                    .find('.bookmarks-remove')
                    .data('bookmark-id', result.id);

                $container.append($item);
            }
        });
    },
    deleteBookmark: function ($form, $item) {
        $.ajax({
            url: $form.attr('action'),
            method: $form.attr('method'),
            dataType: 'json',
            data: $form.serialize(),
            success: function (result) {
                if (result.error) {
                    return;
                }

                $item.remove();
            }
        });
    },
    initBookmarksAdding: function ($sidebar) {
        const self = this;
        const $form = $sidebar.find('#bookmarks-add-form');
        const $titleInput = $form.find('input[name="title"]');
        const $urlInput = $form.find('input[name="url"]');
        const $dialog = $sidebar.find('#bookmarks-add-dialog');
        const $container = $sidebar.find('.bookmarks-list');

        $sidebar.find('.bookmarks-add').on('click', function (e) {
            e.preventDefault();

            const $link = $(this);
            const defaultTitle = $link.data('title') ? $link.data('title') : document.title;
            const url = window.location.href;

            $titleInput.val(defaultTitle);
            $urlInput.val(url);

            const buttons = {};

            buttons[t('Add')] = function () {
                self.addBookmark($form, $container);
                $(this).dialog('close');
            };

            buttons[t('Cancel')] = function () {
                $(this).dialog('close');
            };

            $dialog.dialog({
                resizable: false,
                modal: true,
                buttons: buttons
            });
        });
    },
    initBookmarksRemoving: function ($sidebar) {
        const self = this;
        const $form = $sidebar.find('#bookmarks-remove-form');
        const $idInput = $form.find('input[name="id"]');
        const $dialog = $sidebar.find('#bookmarks-remove-dialog');

        $sidebar.on('click', '.bookmarks-remove', function (e) {
            e.preventDefault();

            const $remove = $(this);
            const $item = $remove.closest('.bookmark-item');
            const bookmarkId = $remove.data('bookmark-id');

            $idInput.val(bookmarkId);

            const buttons = {};

            buttons[t('Delete')] = function () {
                self.deleteBookmark($form, $item);
                $(this).dialog('close');
            };

            buttons[t('Cancel')] = function () {
                $(this).dialog('close');
            };

            $dialog.dialog({
                resizable: false,
                modal: true,
                buttons: buttons
            });
        });
    },
    initBookmarks: function ($sidebar) {
        this.initBookmarksAdding($sidebar);
        this.initBookmarksRemoving($sidebar);
    },
    run: function () {
        try {
            this.initBookmarksAdding(this.$sidebar);
            this.initBookmarksRemoving(this.$sidebar);
        } catch (e) {
            console.error(e, e.stack);
        }
    }
};

module.exports = SideBarBookmarks;
