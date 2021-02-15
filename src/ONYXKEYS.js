/**
 * This is a file containing constants for all the top level keys in our store
 */
export default {
    // Holds information about the users account that is logging in
    ACCOUNT: 'account',

    // Holds an array of client IDs which is used for multi-tabs on web in order to know
    // which tab is the leader, and which ones are the followers
    ACTIVE_CLIENTS: 'activeClients2',

    // What the active route is for our navigator. Global route that determines what views to display.
    CURRENT_ROUTE: 'currentRoute',

    // Currently viewed reportID
    CURRENTLY_VIEWED_REPORTID: 'currentlyViewedReportID',

    // Credentials to authenticate the user
    CREDENTIALS: 'credentials',

    // Contains the personalDetails of the user as well as their timezone
    MY_PERSONAL_DETAILS: 'myPersonalDetails',

    // Has information about the network status (offline/online)
    NETWORK: 'network',

    // Contains all the personalDetails the user has access to
    PERSONAL_DETAILS: 'personalDetails',

    // Saves the current country code which is displayed when the user types a phone number without
    // an international code
    COUNTRY_CODE: 'countryCode',

    // Information about the current session (authToken, accountID, email, loading, error)
    SESSION: 'session',
    IS_CHAT_SWITCHER_ACTIVE: 'isChatSwitcherActive',
    IS_SIDEBAR_ANIMATING: 'isSidebarAnimating',
    BETAS: 'betas',

    // Collection Keys
    COLLECTION: {
        REPORT: 'report_',
        REPORT_ACTIONS: 'reportActions_',
        REPORT_DRAFT_COMMENT: 'reportDraftComment_',
        REPORT_USER_IS_TYPING: 'reportUserIsTyping_',
    },
};
