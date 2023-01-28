const SteamInventories = require('./SteamInventories')

class ItemUtils {
    static isEmoticon(item) {
        if (!ItemUtils.isSteamCommunity(item)) {
            return false
        }

        const itemClass = item.getTag('item_class') || {}
        return itemClass?.internal_name === 'item_class_4'
    }

    static isProfileBackground(item) {
        if (!ItemUtils.isSteamCommunity(item)) {
            return false
        }

        const itemClass = item.getTag('item_class') || {}
        return itemClass?.internal_name === 'item_class_3'
    }

    static isSteamCommunity(item) {
        return `${item.appid}` === `${SteamInventories.STEAM_COMMUNITY.appid}` && `${item.contextid}` === `${SteamInventories.STEAM_COMMUNITY.contextid}`
    }
}

module.exports = ItemUtils
