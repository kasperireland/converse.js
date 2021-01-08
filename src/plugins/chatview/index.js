/**
 * @module converse-chatview
 * @copyright 2020, the Converse.js contributors
 * @license Mozilla Public License (MPLv2)
 */
import '../../components/chat_content.js';
import '../../components/help_messages.js';
import '../../components/toolbar.js';
import '../chatboxviews/index.js';
import '../modal.js';
import { _converse, api, converse } from '@converse/headless/core';
import ChatBoxView from './view.js';
import chatview_api from './api.js';

const { Strophe } = converse.env;

function onWindowStateChanged (data) {
    if (_converse.chatboxviews) {
        _converse.chatboxviews.forEach(view => {
            if (view.model.get('id') !== 'controlbox') {
                view.onWindowStateChanged(data.state);
            }
        });
    }
}

function onChatBoxViewsInitialized () {
    const views = _converse.chatboxviews;
    _converse.chatboxes.on('add', async item => {
        if (!views.get(item.get('id')) && item.get('type') === _converse.PRIVATE_CHAT_TYPE) {
            await item.initialized;
            views.add(item.get('id'), new _converse.ChatBoxView({ model: item }));
        }
    });
}

converse.plugins.add('converse-chatview', {
    /* Plugin dependencies are other plugins which might be
     * overridden or relied upon, and therefore need to be loaded before
     * this plugin.
     *
     * If the setting "strict_plugin_dependencies" is set to true,
     * an error will be raised if the plugin is not found. By default it's
     * false, which means these plugins are only loaded opportunistically.
     *
     * NB: These plugins need to have already been loaded via require.js.
     */
    dependencies: ['converse-chatboxviews', 'converse-chat', 'converse-disco', 'converse-modal'],

    initialize () {
        /* The initialize function gets called as soon as the plugin is
         * loaded by converse.js's plugin machinery.
         */
        api.settings.extend({
            'auto_focus': true,
            'debounced_content_rendering': true,
            'filter_url_query_params': null,
            'image_urls_regex': null,
            'message_limit': 0,
            'muc_hats': ['xep317'],
            'show_images_inline': true,
            'show_message_avatar': true,
            'show_retraction_warning': true,
            'show_send_button': true,
            'show_toolbar': true,
            'time_format': 'HH:mm',
            'use_system_emojis': true,
            'visible_toolbar_buttons': {
                'call': false,
                'clear': true,
                'emoji': true,
                'spoiler': true
            }
        });

        Object.assign(api, chatview_api);

        _converse.ChatBoxView = ChatBoxView;

        api.listen.on('chatBoxViewsInitialized', onChatBoxViewsInitialized);
        api.listen.on('windowStateChanged', onWindowStateChanged);
        api.listen.on('connected', () => api.disco.own.features.add(Strophe.NS.SPOILER));
    }
});