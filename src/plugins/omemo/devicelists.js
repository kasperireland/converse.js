import DeviceList from './devicelist.js';
import { Collection } from '@converse/skeletor/src/collection';

/**
 * @class
 * @namespace _converse.DeviceLists
 * @memberOf _converse
 */
const DeviceLists = Collection.extend({
    model: DeviceList,

    /**
     * Returns the {@link _converse.DeviceList} for a particular JID.
     * The device list will be created if it doesn't exist already.
     * @private
     * @method _converse.DeviceLists#getDeviceList
     * @param { String } jid - The Jabber ID for which the device list will be returned.
     */
    getDeviceList (jid) {
        return this.get(jid) || this.create({ 'jid': jid });
    }
});

export default DeviceLists;
