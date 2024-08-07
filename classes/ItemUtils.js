const SteamInventory = require('./SteamInventory')

class ItemUtils {
  static isEmoticon (item) {
    if (!ItemUtils.isSteamCommunity(item)) {
      return false
    }

    const itemClass = item.getTag('item_class') || {}
    return itemClass.internal_name === 'item_class_4'
  }

  static isProfileBackground (item) {
    if (!ItemUtils.isSteamCommunity(item)) {
      return false
    }

    const itemClass = item.getTag('item_class') || {}
    return itemClass.internal_name === 'item_class_3'
  }

  static isSteamCommunity (item) {
    return `${item.appid}` === `${SteamInventory.STEAM_COMMUNITY.appid}` && `${item.contextid}` === `${SteamInventory.STEAM_COMMUNITY.contextid}`  // appid is "Steam" & contextid is "Community"
  }
}

module.exports = ItemUtils
