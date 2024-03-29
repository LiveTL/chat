/** Base JSON */
/**
 * Expected YTC JSON response.
 * @typedef {Object} YtcResponse
 * @property {Object} [continuationContents]
 * @property {Object} continuationContents.liveChatContinuation
 * @property {ContinuationData[]} continuationContents.liveChatContinuation.continuations
 * @property {YtcAction[]} [continuationContents.liveChatContinuation.actions]
 * @property {Object} [contents] Initial data only
 * @property {Object} contents.liveChatRenderer
 * @property {ContinuationData[]} contents.liveChatRenderer.continuations
 * @property {YtcAction[]} [contents.liveChatRenderer.actions]
 */
/**
 * Expected YTC continuation data object
 * @typedef {Object} ContinuationData
 * @property {Object} [timedContinuationData]
 * @property {number} timedContinuationData.timeoutMs
 * @property {Object} [invalidationContinuationData]
 * @property {number} invalidationContinuationData.timeoutMs
 */
/**
 * Expected YTC action object.
 * @typedef {Object} YtcAction
 * @property {AddChatItemAction} [addChatItemAction]
 * @property {ReplayChatItemAction} [replayChatItemAction]
 * @property {AuthorBonkedAction} [markChatItemsByAuthorAsDeletedAction]
 * @property {MessageDeletedAction} [markChatItemAsDeletedAction]
 * @property {AddPinnedAction} [addBannerToLiveChatCommand]
 * @property {*} [removeBannerForLiveChatCommand]
 */

/** Actions */
/**
 * YTC addChatItemAction object.
 * @typedef {Object} AddChatItemAction
 * @property {Object} item
 * @property {MessageRenderer} [item.liveChatTextMessageRenderer]
 * @property {MessageRenderer} [item.liveChatPaidMessageRenderer]
 * @property {MessageRenderer} [item.liveChatPaidStickerRenderer]
 */
/**
 * @typedef {Object} ReplayChatItemAction
 * @property {ytcAction[]} actions
 * @property {IntString} videoOffsetTimeMsec
 */
/**
 * YTC markChatItemsByAuthorAsDeletedAction object.
 * @typedef {Object} AuthorBonkedAction
 * @property {Object} deletedStateMessage Message to replace deleted messages.
 * @property {MessageRun[]} deletedStateMessage.runs
 * @property {string} externalChannelId ID of channel that was bonked.
 */
/**
 * YTC markChatItemAsDeletedAction object.
 * @typedef {Object} MessageDeletedAction
 * @property {Object} deletedStateMessage Message to replace deleted messages.
 * @property {MessageRun[]} deletedStateMessage.runs
 * @property {string} targetItemId ID of message to be deleted.
 */
/**
 * YTC addBannerToLiveChatCommand object.
 * @typedef {Object} AddPinnedAction
 * @property {Object} bannerRenderer
 * @property {Object} bannerRenderer.liveChatBannerRenderer
 * @property {MessageRenderer} bannerRenderer.liveChatBannerRenderer.contents
 * @property {BannerHeader} bannerRenderer.liveChatBannerRenderer.header
 */

/** Misc types */
/**
 * YTC message run object.
 * @typedef {Object} MessageRun
 * @property {string} [text]
 * @property {Object} [navigationEndpoint]
 * @property {Object} navigationEndpoint.commandMetadata
 * @property {Object} navigationEndpoint.commandMetadata.webCommandMetadata
 * @property {string} navigationEndpoint.commandMetadata.webCommandMetadata.url
 * @property {Object} [emoji]
 * @property {Object} emoji.image
 * @property {{url: string}[]} emoji.image.thumbnails
 */
/**
 * YTC message renderer object.
 * @typedef {Object} MessageRenderer
 * @property {Object} message
 * @property {MessageRun[]} message.runs
 * @property {{simpleText: string}} authorName
 * @property {AuthorBadge[]} [authorBadges]
 * @property {string} id
 * @property {IntString} timestampUsec Timestamp in microseconds
 * @property {string} authorExternalChannelId
 * @property {{simpleText: string}} [timestampText] Only available on VODs
 * @property {{simpleText: string}} [purchaseAmountText] Only available on superchats
 * @property {number} [bodyBackgroundColor] Only available on superchats
 */
/**
 * YTC author badge object.
 * @typedef {Object} AuthorBadge
 * @property {Object} liveChatAuthorBadgeRenderer
 * @property {*} liveChatAuthorBadgeRenderer.customThumbnail
 * @property {string} liveChatAuthorBadgeRenderer.tooltip
 * @property {Object} [liveChatAuthorBadgeRenderer.icon] Only available for verified, mods and owner
 * @property {string} liveChatAuthorBadgeRenderer.icon.iconType Unlocalized string
 */
/**
 * YTC banner header object.
 * @typedef {Object} BannerHeader
 * @property {Object} liveChatBannerHeaderRenderer
 * @property {Object} liveChatBannerHeaderRenderer.text
 * @property {MessageRun[]} liveChatBannerHeaderRenderer.text.runs
 */
/** @typedef {string} IntString Integer formatted as string */
