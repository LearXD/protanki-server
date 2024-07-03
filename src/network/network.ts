import { Protocol } from "./protocol";

import { PingPacket } from "./packets/ping";
import { PongPacket } from "./packets/pong";
import { SetCaptchaLocationsPacket } from "./packets/set-captcha-locations";
import { SetTipResourcePacket } from "./packets/set-tip-resource";
import { SendLanguagePacket } from "./packets/send-language";
import { SetNetworkParamsPacket } from "./packets/set-network-params";
import { SimplePacket } from "./packets/simple-packet";
import { SendRequestLoadScreenPacketPacket } from "./packets/send-request-load-screen";
import { ResolveCallbackPacket } from "./packets/resolve-callback";
import { SetAuthResourcesPacket } from "./packets/set-auth-resources";
import { SetLoadResourcesPacket } from "./packets/set-load-resources";
import { SetInviteEnabledPacket } from "./packets/set-invite-enabled";
import { ResolveFullLoadedPacket } from "./packets/resolve-full-loaded";
import { SendRequestCaptchaPacket } from "./packets/send-request-captcha";
import { SetCaptchaDataPacket } from "./packets/set-captcha-data";
import { CheckUsernamePacket } from "./packets/check-username";
import { SetAdvisedUsernames } from "./packets/set-advised-usernames";
import { ResultCheckUsernamePacket } from "./packets/result-check-username";
import { SetRememberMePacket } from "./packets/set-remember-me";
import { SetCaptchaResponsePacket } from "./packets/set-captcha-response";
import { SendRegisterPacket } from "./packets/send-register";
import { SetLoginHashPacket } from "./packets/set-login-hash";
import { SetBonusPacket } from "./packets/set-bonus";
import { SetLayoutStatePacket } from "./packets/set-layout-state";
import { SetPremiumDataPacket } from "./packets/set-premium-data";
import { SetUserPropertyPacket } from "./packets/set-user-property";
import { SendLoginPacket } from "./packets/send-login";
import { IncorrectPasswordPacket } from "./packets/incorrect-password";
import { SetEmailInfoPacket } from "./packets/set-email-info";
import { SetFriendsDataPacket } from "./packets/set-friends-data";
import { SetSubLayoutStatePacket } from "./packets/set-sub-layout-state";
import { SetChatInitParamsPacket } from "./packets/set-chat-init-params";
import { SetAchievementCCPacket } from "./packets/set-achievement-cc";
import { SetBattleInviteCCPacket } from "./packets/set-battle-invite-cc";
import { SetCountryLocaleNamePacket } from "./packets/set-country-locale-name";
import { SendLoginHashPacket } from "./packets/send-login-hash";
import { SetChatCostPacket } from "./packets/set-chat-cost";
import { SetChatMessagesPacket } from "./packets/set-chat-messages";
import { SendShowDamageIndicatorPacket } from "./packets/send-show-damage-indicator";
import { SendRequestUserDataPacket } from "./packets/send-request-user-data";
import { SetRemoveUserFromBattleCounterPacket } from "./packets/set-remove-user-from-battle-counter";
import { SetMapsDataPacket } from "./packets/set-maps-data";
import { SetBattleListPacket } from "./packets/set-battle-list";
import { SetViewingBattlePacket } from "./packets/set-viewing-battle";
import { SetViewingBattleDataPacket } from "./packets/set-viewing-battle-data";
import { SetUserOnlinePacket } from "./packets/set-user-online";
import { SetUserRankPacket } from "./packets/set-user-rank";
import { SetUserBattlePacket } from "./packets/set-user-battle";
import { SetUserPremiumDataPacket } from "./packets/set-user-premium-data";
import { SetRemoveUserFromTeamBattleCounterPacket } from "./packets/set-remove-user-from-team-battle-counter";
import { SetRemoveUserPlayingPacket } from "./packets/set-remove-user-playing";
import { SetAddUserOnTeamBattleCounterPacket } from "./packets/set-add-user-on-team-battle-counter";
import { SetViewingBattleUserKillsPacket } from "./packets/set-viewing-battle-user-kills";
import { SetBattleRestartedPacket } from "./packets/set-battle-restarted";
import { SetAddUserOnBattleCounterPacket } from "./packets/set-add-user-on-battle-counter";
import { SetViewingBattleUserInfoPacket } from "./packets/set-viewing-battle-user-info";
import { SetViewingBattleUserScorePacket } from "./packets/set-viewing-battle-user-score";
import { SendChatMessagePacket } from "./packets/send-chat-message";
import { SetRemoveBattleFromListPacket } from "./packets/set-remove-battle-from-list";
import { SetAddBattleOnListPacket } from "./packets/set-add-battle-on-list";
import { SetBattleEndedPacket } from "./packets/set-battle-ended";
import { SetRemoveUserFromViewingTeamBattlePacket } from "./packets/set-remove-user-from-viewing-team-battle";
import { SendRequestConfigDataPacket } from "./packets/send-request-config-data";
import { SetSocialNetworkPanelCCPacket } from "./packets/set-social-network-panel-cc";
import { SetNotificationEnabledPacket } from "./packets/set-notification-enabled";
import { SendOpenFriendsPacket } from "./packets/send-open-friends";
import { SendFindUserOnFriendsListPacket } from "./packets/send-find-user-on-friends-list";
import { SetUserNotFoundOnFriendsListPacket } from "./packets/set-user-not-found-on-friends-list";
import { SetUserFoundOnFriendsListPacket } from "./packets/set-user-found-on-friends-list";
import { SendFriendRequestPacket } from "./packets/send-friend-request";
import { SetAddSentFriendRequestPacket } from "./packets/set-add-sent-friend-request";
import { RemoveFriendRequestPacket } from "./packets/remove-friend-request";
import { RemovedFriendRequestPacket } from "./packets/removed-friend-request";
import { SendJoinOnBattlePacket } from "./packets/send-join-on-battle";
import { SetTurretsDataPacket } from "./packets/set-turrets-data";
import { SetLatencyPacket } from "./packets/set-latency";
import { SetTimePacket } from "./packets/set-time";
import { SetBonusesDataPacket } from "./packets/set-bonuses-data";
import { SetBattleDataPacket } from "./packets/set-battle-data";
import { SetBattleStatisticsCCPacket } from "./packets/set-battle-statistics-cc";
import { SetBattleStatisticsDMCCPacket } from "./packets/set-battle-statistics-dm-cc";
import { SetBattleMineCCPacket } from "./packets/set-battle-mine-cc";
import { SetUserTankResourcesDataPacket } from "./packets/set-user-tank-resources-data";
import { SetSuppliesPacket } from "./packets/set-supplies";
import { SetBattleUserStatusPacket } from "./packets/set-battle-user-status";
import { SetBattleUsersEffectsPacket } from "./packets/set-battle-users-effects";
import { SetBattleSpawnedBoxesPacket } from "./packets/set-battle-spawned-boxes";
import { SetTankTurretAngleControlPacket } from "./packets/set-tank-turret-angle-control";
import { SetMoveTankAndTurretPacket } from "./packets/set-move-tank-and-turret";
import { SetTankVisiblePacket } from "./packets/set-tank-visible";
import { SetMoveTankPacket } from "./packets/set-move-tank";
import { SetTankSpeedPacket } from "./packets/set-tank-speed";
import { SetMoveCameraPacket } from "./packets/set-move-camera";
import { SetTwinsShotPacket } from "./packets/set-twins-shot";
import { SetTankHealthPacket } from "./packets/set-tank-health";
import { SetSmokyTargetShotPacket } from "./packets/set-smoky-target-shot";
import { SetTankControlPacket } from "./packets/set-tank-control";
import { SetStartFlameShotPacket } from "./packets/set-start-flame-shot";
import { SetTankTemperaturePacket } from "./packets/set-tank-temperature";
import { SetTankDestroyedPacket } from "./packets/set-tank-destroyed";
import { SetBattleFundPacket } from "./packets/set-battle-fund";
import { SetSpawnTankPacket } from "./packets/set-spawn-tank";
import { SendMoveTankPacket } from "./packets/send-move-tank";
import { SendMoveTankAndTurretPacket } from "./packets/send-move-tank-and-turret";
import { SendTankTurretDirectionPacket } from "./packets/send-tank-turret-direction";
import { SetSmokyHitPointPacket } from "./packets/set-smoky-hit-point";
import { SendShotWithTargetPacket } from "./packets/send-shot-with-target";
import { SetDamageIndicatorsPacket } from "./packets/set-damage-indicators";
import { SetSpawnBonusBoxPacket } from "./packets/set-spawn-bonus-box";
import { SendMoveTankTracksPacket } from "./packets/send-move-tank-tracks";
import { SetStopFlameShotPacket } from "./packets/set-stop-flame-shot";
import { SetRattingPacket } from "./packets/set-rating";
import { KickPacket } from "./packets/kick";
import { SetCrystalsPacket } from "./packets/set-crystals";
import { SetRemoveBonusBoxPacket } from "./packets/set-remove-bonus-box";
import { SetBattleRewardsPacket } from "./packets/set-battle-rewards";
import { SetAchievementMessagePacket } from "./packets/set-achievement-message";
import { SetBattleChatConfigPacket } from "./packets/set-battle-chat-config";
import { SetBattleUserLeftNotificationPacket } from "./packets/set-battle-user-left-notification";
import { SetRemoveTankPacket } from "./packets/set-remove-tank";
import { SetAddTankEffectPacket } from "./packets/set-add-tank-effect";
import { SetBonusBoxCollectedPacket } from "./packets/set-some-bonus-id";
import { SendSmokyHitPointShotPacket } from "./packets/send-smoky-hit-point";
import { SetSmokyCriticalEffectPacket } from "./packets/set-smoky-critical-effect";
import { SetViewingBattleTeamScorePacket } from "./packets/set-viewing-battle-team-score";
import { SetScorePacket } from "./packets/set-score";
import { SetStartShaftShotPacket } from "./packets/set-start-shaft-shot";
import { SetMoveShaftVerticalAxisPacket } from "./packets/set-move-shaft-vertical-axis";
import { SendCollectBonusBoxPacket } from "./packets/send-collect-bonus-box";
import { SetShooterTankSpotPacket } from "./packets/set-shooter-tank-spot";
import { SetShaftShotPacket } from "./packets/set-shaft-shot";
import { SetBattleMessagePacket } from "./packets/set-battle-message";
import { SetCaptureTheFlagCCPacket } from "./packets/set-capture-the-flag-cc";
import { SetBattleStatisticsTeamCCPacket } from "./packets/set-battle-statistics-team-cc";
import { SetTeamBattleUserStatPacket } from "./packets/set-team-battle-user-stat";
import { SetWinnerTeamPacket } from "./packets/set-winner-team";
import { SetTeamScorePacket } from "./packets/set-team-score";
import { SetStartRailgunShotPacket } from "./packets/set-start-railgun-start";
import { SetRailgunShotPacket } from "./packets/set-railgun-shot";
import { SetTankFlagPacket } from "./packets/set-tank-flag";
import { SetUserIdUsersInfoTeamPacket } from "./packets/set-user-id-users-info-team";
import { SetStormTargetShotPacket } from "./packets/set-storm-target-shot";
import { SetUserNewRankPacket } from "./packets/set-user-new-rank";
import { SetUserRankUpDialogPacket } from "./packets/set-user-rank-up-dialog";
import { SetGarageItemsPacket } from "./packets/set-garage-items";
import { SendCheckBattleNamePacket } from "./packets/send-check-battle-name";
import { SetBattleNamePacket } from "./packets/set-battle-name";
import { SendAutoDestroyPacket } from "./packets/send-auto-destroy";
import { SetDestroyTankPacket } from "./packets/set-destroy-tank";
import { Logger } from "../utils/logger";
import { SetGameLoadedPacket } from "./packets/set-game-loaded";
import { SetRemoveTankEffectPacket } from "./packets/set-remove-tank-effect";
import { SendShotVoidPacket } from "./packets/send-shot-void";
import { SendSetLayoutStatePacket } from "./packets/send-set-layout-state";
import { SetRemoveBattleScreenPacket } from "./packets/set-remove-battle-screen";
import { SendBattleMessagePacket } from "./packets/send-battle-message";
import { SetBattleSystemMessagePacket } from "./packets/set-battle-system-message";
import { SendOpenGaragePacket } from "./packets/send-open-garage";
import { SetUserGarageItemsPacket } from "./packets/set-user-garage-items";
import { SetEquipGarageItemPacket } from "./packets/set-equip-garage-item";
import { SetGarageItemsPropertiesPacket } from "./packets/set-garage-items-properties";
import { SendEquipItemPacket } from "./packets/send-equip-item";
import { SetRemoveGarageItemPacket } from "./packets/set-remove-garage-item";
import { SetGarageCategoryPacket } from "./packets/set-garage-category";
import { SendBuyGarageKitPacket } from "./packets/send-buy-garage-kit";
import { SendResumePacket } from "./packets/send-resume";
import { SendRequestRespawnPacket } from "./packets/send-request-respawn";
import { SetTankChangedEquipmentPacket } from "./packets/set-tank-changed-equipment";
import { SendChangedEquipmentPacket } from "./packets/send-changed-equipment";
import { SendStartFlameShotPacket } from "./packets/send-start-flame-shot";
import { SendStopFlameShotPacket } from "./packets/send-stop-flame-shot";
import { SetBattleStartedPacket } from "./packets/set-battle-started";
import { SendCreateBattlePacket } from "./packets/send-create-battle";
import { SetSomeUidPacket } from "./packets/set-some-uid";
import { SetAddUserInfoOnViewingTeamBattlePacket } from "./packets/set-add-user-info-on-viewing-team-battle";
import { SetRemoveViewingBattlePacket } from "./packets/set-remove-viewing-battle";
import { SetCaptchaLocation2Packet } from "./packets/set-captcha-location-2";

// GENERATE IMPORT HERE
import { SendShowNotificationsPacket } from "./packets/send-show-notifications";
import { SetOpenConfigPacket } from "./packets/set-open-config";
import { SendOpenConfigPacket } from "./packets/send-open-config";
import { ValidateFriendPacket } from "./packets/validate-friend";
import { SetAlreadySentFriendRequestPopupPacket } from "./packets/set-already-sent-friend-request-popup";
import { SetRemoveFriendPacket } from "./packets/set-remove-friend";
import { SendRemoveFriendPacket } from "./packets/send-remove-friend";
import { SetRemoveFriendRequestPacket } from "./packets/set-remove-friend-request";
import { SendRefuseFriendRequestPacket } from "./packets/send-refuse-friend-request";
import { SendRefuseAllFriendRequestsPacket } from "./packets/send-refuse-all-friend-requests";
import { SendPreviewPaintingPacket } from "./packets/send-preview-painting";
import { SendBuyGarageItemPacket } from "./packets/send-buy-garage-item";
import { SendInviteCodePacket } from "./packets/send-invite-code";
import { SetSuccessDialogPacket } from "./packets/set-success-dialog";
import { SendChangePasswordPacket } from "./packets/send-change-password";
import { SetChangePasswordScreenPacket } from "./packets/set-change-password-screen";
import { SendEmailCodePacket } from "./packets/send-email-code";
import { SetEmailCodeScreenPacket } from "./packets/set-email-code-screen";
import { SendVerifyEmailPacket } from "./packets/send-verify-email";
import { SendSuccessfulPurchasePacket } from "./packets/send-successful-purchase";
import { SetSomeShaftShooterPacket } from "./packets/set-some-shaft-shooter";
import { SendShaftLocalSpotPacket } from "./packets/send-shaft-local-spot";
import { SetSomeRailgunShooterPacket } from "./packets/set-some-railgun-shooter";
import { SetOpenDailyQuestsPacket } from "./packets/set-open-daily-quests";
import { SetAddSpecialItemPacket } from "./packets/set-add-special-item";
import { SetEmailPacket } from "./packets/set-email";
import { SetPremiumLeftTimePacket } from "./packets/set-premium-left-time";
import { SetWelcomeToPremiumPacket } from "./packets/set-welcome-to-premium";
import { SetNewsPacket } from "./packets/set-news";
import { SetDailyQuestAlertPacket } from "./packets/set-daily-quest-alert";
import { SetGoldBoxTakenPacket } from "./packets/set-gold-box-taken";
import { SetGoldBoxAlertPacket } from "./packets/set-gold-box-alert";
import { SetRemoveDailyQuestPacket } from "./packets/set-remove-daily-quest";
import { SendRedeemDailyQuestPacket } from "./packets/send-redeem-daily-quest";
import { SetCannotCreateBattlePacket } from "./packets/set-cannot-create-battle";
import { SetWrongLoginHashPacket } from "./packets/set-wrong-login-hash";
import { SendTwinsSecondShotPacket } from "./packets/send-twins-second-shot";
import { SetKickMessagePacket } from "./packets/set-kick-message";
import { SetViewGiftsPacket } from "./packets/set-view-gifts";
import { SetGiftReceivedPacket } from "./packets/set-gift-received";
import { SetChangeQuestPacket } from "./packets/set-change-quest";
import { SendChangeQuestPacket } from "./packets/send-change-quest";
import { SetDailyQuestsPacket } from "./packets/set-daily-quests";
import { SendOpenDailyQuestsPacket } from "./packets/send-open-daily-quests";
import { SetUseDrugPacket } from "./packets/set-use-drug";
import { SendUseDrugPacket } from "./packets/send-use-drug";
import { SetExplodeMinePacket } from "./packets/set-explode-mine";
import { SetPlaceMinePacket } from "./packets/set-place-mine";
import { SetStopShaftShotPacketPacket } from "./packets/set-stop-shaft-shot";
import { SendOpenShaftAimPacket } from "./packets/send-open-shaft-aim";
import { SendMoveShaftVerticalAxisPacket } from "./packets/send-move-shaft-vertical-axis";
import { SendShaftAimShotPacket } from "./packets/send-shaft-aim-shot";
import { SendShaftShotPacket } from "./packets/send-shaft-shot";
import { SendShaftStopAimPacket } from "./packets/send-shaft-stop-aim";
import { SendStartShaftAimPacket } from "./packets/send-start-shaft-aim";
import { SetVulcanShotPacket } from "./packets/set-vulcan-shot";
import { SetStopVulcanShotPacket } from "./packets/set-stop-vulcan-shot";
import { SetStartVulcanShotPacket } from "./packets/set-start-vulcan-shot";
import { SendVulcanShotPacket } from "./packets/send-vulcan-shot";
import { SendStopVulcanShotPacket } from "./packets/send-stop-vulcan-shot";
import { SendStartVulcanShotPacket } from "./packets/send-start-vulcan-shot";
import { SetRicochetShotPacket } from "./packets/set-ricochet-shot";
import { SendRicochetTargetShotPacket } from "./packets/send-ricochet-target-shot";
import { SendRicochetShotPacket } from "./packets/send-ricochet-shot";
import { SetStopFreezeShotPacket } from "./packets/set-stop-freeze-shot";
import { SetStartFreezeShotPacket } from "./packets/set-start-freeze-shot";
import { SendFreezeTargetsShotPacket } from "./packets/send-freeze-targets-shot";
import { SendStopFreezeShotPacket } from "./packets/send-stop-freeze-shot";
import { SendStartFreezeShootPacket } from "./packets/send-start-freeze-shoot";
import { SetStormVoidShotPacket } from "./packets/set-storm-void-shot";
import { SetStormHitPointShotPacket } from "./packets/set-storm-hit-point-shot";
import { SendStormTargetShotPacket } from "./packets/send-storm-target-shot";
import { SendStormVoidShotPacket } from "./packets/send-storm-void-shot";
import { SendStormHitPointPacket } from "./packets/send-storm-hit-point";
import { SetIsisShotPositionPacket } from "./packets/set-isis-shot-position";
import { SetStopIsisShotPacket } from "./packets/set-stop-isis-shot";
import { SetStartIsisShotPacket } from "./packets/set-start-isis-shot";
import { SendStopIsisShotPacket } from "./packets/send-stop-isis-shot";
import { SendIsisShotPacket } from "./packets/send-isis-shot";
import { SendRailgunShotPacket } from "./packets/send-railgun-shot";
import { SendStartRailgunShotPacket } from "./packets/send-start-railgun-shot";
import { SendTwinsFirstShotPacket } from "./packets/send-twins-first-shot";
import { SetHammerShotPacket } from "./packets/set-hammer-shot";
import { SendHammerShotPacket } from "./packets/send-hammer-shot";
import { SendOpenBattlesListPacket } from "./packets/send-open-battles-list";
import { SetAddFriendRequestPacket } from "./packets/set-add-friend-request";
import { ValidateFriendRequestPacket } from "./packets/validate-friend-request";
import { SendOpenLinkPacket } from "./packets/send-open-link";
import { SendAcceptFriendRequestPacket } from "./packets/send-accept-friend-request";
import { SetAddFriendPacket } from "./packets/set-add-friend";
import { SetUserAcceptedBattleInvitePacket } from "./packets/set-user-accepted-battle-invite";
import { SetUserRecusedBattleInvitePacket } from "./packets/set-user-recused-battle-invite";
import { SendBattleInvitePacket } from "./packets/send-battle-invite";
import { SetOkPopupPacket } from "./packets/set-ok-popup";
import { SetServerWillUpdatePacket } from "./packets/set-server-will-update";
import { SetTeamStoppedCapturingControlPointPacketPacket } from "./packets/set-team-stopped-capturing-control-point-packet";
import { SendFlameTargetsShotPacket } from "./packets/send-flame-targets-shot";
import { SomeUserLeftPacket } from "./packets/some-user-left";
import { SetDrugQuantityPacket } from "./packets/set-drug-quantity";
import { SetCapturingPointPacket } from "./packets/set-capturing-point";
import { SetTankRespawnDelayPacket } from "./packets/set-tank-respawn-delay";
import { SetSuicideDelayPacket } from "./packets/set-suicide-delay";
import { SetRemoveGaragePacket } from "./packets/set-remove-garage";
import { SetOpenFriendsListPacket } from "./packets/set-open-friends-list";
import { SetBattleNotExistPacket } from "./packets/set-battle-not-exist";
import { SetSmokyVoidShotPacket } from "./packets/set-smoky-void-shot";
import { SetControlPointStatePacket } from "./packets/set-control-point-state";
import { SetTankStopCapturingControlPointPacket } from "./packets/set-tank-stop-capturing-control-point";
import { SetTankCapturingControlPointPacket } from "./packets/set-tank-capturing-control-point";
import { SetTeamStartedCapturingControlPointPacket } from "./packets/set-team-started-capturing-control-point";
import { SetBattleControlPointsConfigurationPacket } from "./packets/set-battle-control-points-configuration";
import { SetBattleTeamUsersPacket } from "./packets/set-battle-team-users";
import { SetFlagReturnedPacket } from "./packets/set-flag-returned";
import { SetFlagDroppedPacket } from "./packets/set-flag-dropped";
import { SendDropFlagPacket } from "./packets/send-drop-flag";
import { SetBattleUsersStatPacket } from "./packets/set-battle-users-stat";
import { SetBattleTimePacket } from "./packets/set-battle-time";
import { SomeJsonRankUpPacket } from "./packets/some-json-rank-up";
import { SetSomePacketOnJoinBattle5Packet } from "./packets/set-some-packet-on-join-battle-5";
import { SetSomePacketOnJoinBattle4Packet } from "./packets/set-some-packet-on-join-battle-4";
import { SetBattleChatEnabledPacket } from "./packets/set-battle-chat-enabled";
import { SetRemoveChatPacket } from "./packets/set-remove-chat";
import { SetRemoveBattlesScreenPacket } from "./packets/set-remove-battles-screen";
import { SendIsisShotPositionPacket } from "./packets/send-isis-shot-position";
import { SendStartIsisShotPacket } from "./packets/send-start-isis-shot";
import { SetRemoveMinePacket } from "./packets/set-remove-mine";
import { SetCloseConfigPacket } from "./packets/set-close-config";

export class Network {
    private packetPool = new Map<number, typeof require>()

    constructor() {
        this.registerPackets()
    }

    private registerPackets() {

        Logger.info('NETWORK', 'Registering packets...')

        this.registerPacket(Protocol.SET_NETWORK_PARAMS, SetNetworkParamsPacket)
        this.registerPacket(Protocol.SET_CAPTCHA_LOCATIONS, SetCaptchaLocationsPacket)

        this.registerPacket(Protocol.SET_TIP_RESOURCE, SetTipResourcePacket)
        this.registerPacket(Protocol.SEND_REQUEST_LOAD_SCREEN, SendRequestLoadScreenPacketPacket)

        this.registerPacket(Protocol.SEND_LANGUAGE, SendLanguagePacket)

        this.registerPacket(Protocol.SET_LOAD_RESOURCES, SetLoadResourcesPacket)
        this.registerPacket(Protocol.RESOLVE_CALLBACK, ResolveCallbackPacket)
        this.registerPacket(Protocol.RESOLVE_FULL_LOADED, ResolveFullLoadedPacket)

        this.registerPacket(Protocol.SET_INVITE_ENABLED, SetInviteEnabledPacket)
        this.registerPacket(Protocol.SET_AUTH_RESOURCES, SetAuthResourcesPacket)

        this.registerPacket(Protocol.SEND_REQUEST_CAPTCHA, SendRequestCaptchaPacket)
        this.registerPacket(Protocol.SET_CAPTCHA_LOCATION_2, SetCaptchaLocation2Packet)

        this.registerPacket(Protocol.SET_CAPTCHA_DATA, SetCaptchaDataPacket)
        this.registerPacket(Protocol.SET_CAPTCHA_RESPONSE, SetCaptchaResponsePacket)

        this.registerPacket(Protocol.CHECK_USERNAME, CheckUsernamePacket)
        this.registerPacket(Protocol.RESULT_CHECK_USERNAME, ResultCheckUsernamePacket)
        this.registerPacket(Protocol.SET_ADVISED_USERNAMES, SetAdvisedUsernames)

        this.registerPacket(Protocol.SET_REMEMBER_ME, SetRememberMePacket)

        this.registerPacket(Protocol.SEND_REGISTER, SendRegisterPacket)

        this.registerPacket(Protocol.SEND_LOGIN, SendLoginPacket)
        this.registerPacket(Protocol.INCORRECT_PASSWORD, IncorrectPasswordPacket)
        this.registerPacket(Protocol.SET_EMAIL_INFO, SetEmailInfoPacket)

        this.registerPacket(Protocol.SET_LOGIN_HASH, SetLoginHashPacket)
        this.registerPacket(Protocol.SEND_LOGIN_HASH, SendLoginHashPacket)

        this.registerPacket(Protocol.SET_BONUS, SetBonusPacket)

        this.registerPacket(Protocol.SET_LAYOUT_STATE, SetLayoutStatePacket)
        this.registerPacket(Protocol.SET_SUB_LAYOUT_STATE, SetSubLayoutStatePacket)

        this.registerPacket(Protocol.SET_PREMIUM_DATA, SetPremiumDataPacket)
        this.registerPacket(Protocol.SET_USER_PROPERTY, SetUserPropertyPacket)
        this.registerPacket(Protocol.SET_FRIENDS_DATA, SetFriendsDataPacket)
        this.registerPacket(Protocol.SET_CHAT_INIT_PARAMS, SetChatInitParamsPacket)
        this.registerPacket(Protocol.SET_ACHIEVEMENT_CC, SetAchievementCCPacket)

        this.registerPacket(Protocol.SET_BATTLE_INVITE_CC, SetBattleInviteCCPacket)
        this.registerPacket(Protocol.SET_USER_BATTLE, SetUserBattlePacket)

        this.registerPacket(Protocol.SET_BATTLE_STATISTICS_CC, SetBattleStatisticsCCPacket)
        this.registerPacket(Protocol.SET_BATTLE_STATISTICS_DM_CC, SetBattleStatisticsDMCCPacket)
        this.registerPacket(Protocol.SET_CAPTURE_THE_FLAG_CC, SetCaptureTheFlagCCPacket)
        this.registerPacket(Protocol.SET_BATTLE_STATISTICS_TEAM_CC, SetBattleStatisticsTeamCCPacket)
        this.registerPacket(Protocol.SEND_TEAM_BATTLE_USER_START, SetTeamBattleUserStatPacket)

        this.registerPacket(Protocol.SET_WINNER_TEAM, SetWinnerTeamPacket)
        this.registerPacket(Protocol.SEND_TEAM_SCORE, SetTeamScorePacket)

        this.registerPacket(Protocol.SET_BATTLE_MINE_CC, SetBattleMineCCPacket)
        this.registerPacket(Protocol.SET_BATTLE_MESSAGE, SetBattleMessagePacket)
        this.registerPacket(Protocol.SET_BATTLE_FUND, SetBattleFundPacket)

        this.registerPacket(Protocol.SET_BATTLE_USER_STATUS, SetBattleUserStatusPacket)

        this.registerPacket(Protocol.SET_COUNTRY_LOCALE_NAME, SetCountryLocaleNamePacket)
        this.registerPacket(Protocol.SET_CHAT_COST, SetChatCostPacket)
        this.registerPacket(Protocol.SET_CHAT_MESSAGES, SetChatMessagesPacket)

        this.registerPacket(Protocol.SEND_SHOW_DAMAGE_INDICATOR, SendShowDamageIndicatorPacket)

        this.registerPacket(Protocol.SET_USER_ID_USERS_INFO_TEAM, SetUserIdUsersInfoTeamPacket)
        this.registerPacket(Protocol.SEND_REQUEST_USER_DATA, SendRequestUserDataPacket)
        this.registerPacket(Protocol.SET_REMOVE_USER_PLAYING, SetRemoveUserPlayingPacket)
        this.registerPacket(Protocol.SET_BATTLE_USER_LEFT_NOTIFICATION, SetBattleUserLeftNotificationPacket)

        this.registerPacket(Protocol.SEND_FIND_USER_ON_FRIENDS_LIST, SendFindUserOnFriendsListPacket)
        this.registerPacket(Protocol.SET_USER_NOT_FOUND_ON_FRIENDS_LIST, SetUserNotFoundOnFriendsListPacket)
        this.registerPacket(Protocol.SET_USER_FOUND_ON_FRIENDS_LIST, SetUserFoundOnFriendsListPacket)

        this.registerPacket(Protocol.SEND_FRIEND_REQUEST, SendFriendRequestPacket)
        this.registerPacket(Protocol.SET_ADD_SENT_FRIEND_REQUEST, SetAddSentFriendRequestPacket)

        this.registerPacket(Protocol.REMOVE_FRIEND_REQUEST, RemoveFriendRequestPacket)
        this.registerPacket(Protocol.REMOVED_FRIEND_REQUEST, RemovedFriendRequestPacket)

        this.registerPacket(Protocol.SET_REMOVE_USER_FROM_BATTLE_COUNTER, SetRemoveUserFromBattleCounterPacket)
        this.registerPacket(Protocol.SET_REMOVE_USER_FROM_TEAM_BATTLE_COUNTER, SetRemoveUserFromTeamBattleCounterPacket)
        this.registerPacket(Protocol.SET_ADD_USER_ON_BATTLE_COUNTER, SetAddUserOnBattleCounterPacket)
        this.registerPacket(Protocol.SET_REMOVE_USER_FROM_VIEWING_TEAM_BATTLE, SetRemoveUserFromViewingTeamBattlePacket)
        this.registerPacket(Protocol.SET_RATTING, SetRattingPacket)

        this.registerPacket(Protocol.SET_REMOVE_VIEWING_BATTLE_USER_INFO, SetViewingBattleUserInfoPacket)

        this.registerPacket(Protocol.SET_MAPS_DATA, SetMapsDataPacket)
        this.registerPacket(Protocol.SET_BATTLE_LIST, SetBattleListPacket)

        this.registerPacket(Protocol.SET_REMOVE_VIEWING_BATTLE_DATA, SetViewingBattleDataPacket)
        this.registerPacket(Protocol.SET_ADD_BATTLE_ON_LIST, SetAddBattleOnListPacket)
        this.registerPacket(Protocol.SET_TURRETS_DATA, SetTurretsDataPacket)
        this.registerPacket(Protocol.SET_BONUSES_DATA, SetBonusesDataPacket)
        this.registerPacket(Protocol.SET_BATTLE_DATA, SetBattleDataPacket)
        this.registerPacket(Protocol.SET_USER_TANK_RESOURCES_DATA, SetUserTankResourcesDataPacket)
        this.registerPacket(Protocol.SET_SUPPLIES, SetSuppliesPacket)
        this.registerPacket(Protocol.SET_BATTLE_USERS_EFFECTS, SetBattleUsersEffectsPacket)
        this.registerPacket(Protocol.SET_BATTLE_SPAWNED_BOXES, SetBattleSpawnedBoxesPacket)

        this.registerPacket(Protocol.SET_VIEWING_BATTLE, SetViewingBattlePacket)
        this.registerPacket(Protocol.SET_USER_ONLINE, SetUserOnlinePacket)
        this.registerPacket(Protocol.SET_USER_RANK, SetUserRankPacket)
        this.registerPacket(Protocol.SET_USER_PREMIUM_DATA, SetUserPremiumDataPacket)
        this.registerPacket(Protocol.SET_ADD_USER_ON_TEAM_BATTLE_COUNTER, SetAddUserOnTeamBattleCounterPacket)
        this.registerPacket(Protocol.SET_REMOVE_VIEWING_BATTLE_USER_KILLS, SetViewingBattleUserKillsPacket)

        this.registerPacket(Protocol.SET_SCORE, SetScorePacket)
        this.registerPacket(Protocol.SET_VIEWING_BATTLE_USER_SCORE, SetViewingBattleUserScorePacket)
        this.registerPacket(Protocol.SET_VIEWING_BATTLE_TEAM_SCORE, SetViewingBattleTeamScorePacket)

        this.registerPacket(Protocol.SET_BATTLE_RESTARTED, SetBattleRestartedPacket)
        this.registerPacket(Protocol.SET_REMOVE_BATTLE_FROM_LIST, SetRemoveBattleFromListPacket)
        this.registerPacket(Protocol.SET_BATTLE_ENDED, SetBattleEndedPacket)

        this.registerPacket(Protocol.SEND_CHAT_MESSAGE, SendChatMessagePacket)

        this.registerPacket(Protocol.SEND_REQUEST_CONFIG_DATA, SendRequestConfigDataPacket)
        this.registerPacket(Protocol.SEND_OPEN_FRIENDS, SendOpenFriendsPacket)

        this.registerPacket(Protocol.SET_SOCIAL_NETWORK_PANEL_CC, SetSocialNetworkPanelCCPacket)
        this.registerPacket(Protocol.SET_NOTIFICATION_ENABLED, SetNotificationEnabledPacket)

        this.registerPacket(Protocol.SET_TANK_TURRET_ANGLE_CONTROL, SetTankTurretAngleControlPacket)

        this.registerPacket(Protocol.SET_MOVE_TANK_AND_TURRET, SetMoveTankAndTurretPacket)
        this.registerPacket(Protocol.SEND_MOVE_TANK_AND_TURRET, SendMoveTankAndTurretPacket)
        this.registerPacket(Protocol.SEND_TANK_TURRET_DIRECTION, SendTankTurretDirectionPacket)

        this.registerPacket(Protocol.SET_MOVE_TANK, SetMoveTankPacket)
        this.registerPacket(Protocol.SET_TANK_SPEED, SetTankSpeedPacket)
        this.registerPacket(Protocol.SET_TANK_CONTROL, SetTankControlPacket)
        this.registerPacket(Protocol.SET_TANK_TEMPERATURE, SetTankTemperaturePacket)
        this.registerPacket(Protocol.SET_TANK_DESTROYED, SetTankDestroyedPacket)
        this.registerPacket(Protocol.SET_TANK_FLAG, SetTankFlagPacket)

        this.registerPacket(Protocol.SET_SPAWN_TANK, SetSpawnTankPacket)
        this.registerPacket(Protocol.SET_MOVE_CAMERA, SetMoveCameraPacket)

        this.registerPacket(Protocol.SET_TWINS_SHOT, SetTwinsShotPacket)
        this.registerPacket(Protocol.SEND_SHOT_VOID, SendShotVoidPacket)

        this.registerPacket(Protocol.SET_SMOKY_HIT_POINT, SetSmokyHitPointPacket)
        this.registerPacket(Protocol.SEND_SMOKY_HIT_POINT_SHOT, SendSmokyHitPointShotPacket)

        this.registerPacket(Protocol.SET_SMOKY_TARGET_SHOT, SetSmokyTargetShotPacket)
        this.registerPacket(Protocol.SET_SHAFT_SHOT, SetShaftShotPacket)
        this.registerPacket(Protocol.SET_STORM_TARGET_SHOT, SetStormTargetShotPacket)

        this.registerPacket(Protocol.SEND_SHOT_WITH_TARGET, SendShotWithTargetPacket)
        this.registerPacket(Protocol.SET_RAILGUN_SHOT, SetRailgunShotPacket)

        this.registerPacket(Protocol.SET_START_FLAME_SHOT, SetStartFlameShotPacket)
        this.registerPacket(Protocol.SET_STOP_FLAME_SHOT, SetStopFlameShotPacket)
        this.registerPacket(Protocol.SET_START_SHAFT_SHOT, SetStartShaftShotPacket)
        this.registerPacket(Protocol.SET_START_RAILGUN_SHOT, SetStartRailgunShotPacket)
        this.registerPacket(Protocol.SET_MOVE_SHAFT_VERTICAL_AXIS, SetMoveShaftVerticalAxisPacket)
        this.registerPacket(Protocol.SET_SHOOTER_TANK_SPOT, SetShooterTankSpotPacket)

        this.registerPacket(Protocol.SET_DAMAGE_INDICATORS, SetDamageIndicatorsPacket)

        this.registerPacket(Protocol.SET_TANK_HEALTH, SetTankHealthPacket)
        this.registerPacket(Protocol.SET_ADD_TANK_EFFECT, SetAddTankEffectPacket)
        this.registerPacket(Protocol.SET_REMOVE_TANK_EFFECT, SetRemoveTankEffectPacket)

        this.registerPacket(Protocol.SEND_MOVE_TANK, SendMoveTankPacket)

        this.registerPacket(Protocol.SET_TANK_VISIBLE, SetTankVisiblePacket)
        this.registerPacket(Protocol.SET_REMOVE_TANK, SetRemoveTankPacket)

        this.registerPacket(Protocol.SET_SPAWN_BONUS_BOX, SetSpawnBonusBoxPacket)
        this.registerPacket(Protocol.SEND_COLLECT_BONUS_BOX, SendCollectBonusBoxPacket)

        this.registerPacket(Protocol.SEND_MOVE_TANK_TRACKS, SendMoveTankTracksPacket)

        this.registerPacket(Protocol.SEND_JOIN_ON_BATTLE, SendJoinOnBattlePacket)
        this.registerPacket(Protocol.SET_LATENCY, SetLatencyPacket)
        this.registerPacket(Protocol.SET_TIME, SetTimePacket)
        this.registerPacket(Protocol.KICK, KickPacket)
        this.registerPacket(Protocol.PING, PingPacket)
        this.registerPacket(Protocol.PONG, PongPacket)

        this.registerPacket(Protocol.SET_CRYSTALS, SetCrystalsPacket)
        this.registerPacket(Protocol.SET_REMOVE_BONUS_BOX, SetRemoveBonusBoxPacket)
        this.registerPacket(Protocol.SET_BATTLE_REWARDS, SetBattleRewardsPacket)
        this.registerPacket(Protocol.SET_ACHIEVEMENT_MESSAGE, SetAchievementMessagePacket)
        this.registerPacket(Protocol.SET_BATTLE_CHAT_CONFIG, SetBattleChatConfigPacket)
        this.registerPacket(Protocol.SET_BONUS_BOX_COLLECTED, SetBonusBoxCollectedPacket)
        this.registerPacket(Protocol.SET_SMOKY_CRITICAL_EFFECT, SetSmokyCriticalEffectPacket)

        this.registerPacket(Protocol.SET_USER_NEW_RANK, SetUserNewRankPacket)
        this.registerPacket(Protocol.SET_USER_RANK_UP_DIALOG, SetUserRankUpDialogPacket)
        this.registerPacket(Protocol.SET_GARAGE_ITEMS, SetGarageItemsPacket)

        this.registerPacket(Protocol.SEND_CHECK_BATTLE_NAME, SendCheckBattleNamePacket)
        this.registerPacket(Protocol.SET_BATTLE_NAME, SetBattleNamePacket)
        this.registerPacket(Protocol.SEND_AUTO_DESTROY, SendAutoDestroyPacket)
        this.registerPacket(Protocol.SET_DESTROY_TANK, SetDestroyTankPacket)

        this.registerPacket(Protocol.SET_GAME_LOADED, SetGameLoadedPacket)
        this.registerPacket(Protocol.SEND_SET_LAYOUT_STATE, SendSetLayoutStatePacket)
        this.registerPacket(Protocol.SET_REMOVE_BATTLE_SCREEN, SetRemoveBattleScreenPacket)
        this.registerPacket(Protocol.SEND_BATTLE_MESSAGE, SendBattleMessagePacket)
        this.registerPacket(Protocol.SET_BATTLE_SYSTEM_MESSAGE, SetBattleSystemMessagePacket)
        this.registerPacket(Protocol.SEND_OPEN_GARAGE, SendOpenGaragePacket)
        this.registerPacket(Protocol.SET_USER_GARAGE_ITEMS, SetUserGarageItemsPacket)
        this.registerPacket(Protocol.SET_EQUIP_GARAGE_ITEM, SetEquipGarageItemPacket)
        this.registerPacket(Protocol.SET_GARAGE_ITEMS_PROPERTIES, SetGarageItemsPropertiesPacket)
        this.registerPacket(Protocol.SEND_EQUIP_ITEM, SendEquipItemPacket)
        this.registerPacket(Protocol.SEND_BUY_GARAGE_KIT, SendBuyGarageKitPacket)
        this.registerPacket(Protocol.SET_REMOVE_GARAGE_ITEM, SetRemoveGarageItemPacket)
        this.registerPacket(Protocol.SET_GARAGE_CATEGORY, SetGarageCategoryPacket)

        this.registerPacket(Protocol.SEND_RESUME, SendResumePacket)
        this.registerPacket(Protocol.SEND_REQUEST_RESPAWN, SendRequestRespawnPacket)
        this.registerPacket(Protocol.SET_TANK_CHANGED_EQUIPMENT, SetTankChangedEquipmentPacket)
        this.registerPacket(Protocol.SEND_CHANGED_EQUIPMENT, SendChangedEquipmentPacket)
        this.registerPacket(Protocol.SET_BATTLE_STARTED, SetBattleStartedPacket)
        this.registerPacket(Protocol.SEND_CREATE_BATTLE, SendCreateBattlePacket)
        this.registerPacket(Protocol.SET_SOME_UID, SetSomeUidPacket)
        this.registerPacket(Protocol.SET_ADD_USER_INFO_ON_VIEWING_TEAM_BATTLE, SetAddUserInfoOnViewingTeamBattlePacket)
        this.registerPacket(Protocol.SET_REMOVE_VIEWING_BATTLE, SetRemoveViewingBattlePacket)

        this.registerPacket(Protocol.SEND_START_FLAME_SHOT, SendStartFlameShotPacket)
        this.registerPacket(Protocol.SEND_STOP_FLAME_SHOT, SendStopFlameShotPacket)

        // GENERATE SEND_REGISTER HERE
        this.registerPacket(Protocol.SET_SOME_SHAFT_SHOOTER, SetSomeShaftShooterPacket);
        this.registerPacket(Protocol.SEND_SHAFT_LOCAL_SPOT, SendShaftLocalSpotPacket);
        this.registerPacket(Protocol.SET_SOME_RAILGUN_SHOOTER, SetSomeRailgunShooterPacket);
        this.registerPacket(Protocol.SET_OPEN_DAILY_QUESTS, SetOpenDailyQuestsPacket);
        this.registerPacket(Protocol.SET_ADD_SPECIAL_ITEM, SetAddSpecialItemPacket);
        this.registerPacket(Protocol.SET_CLOSE_CONFIG, SetCloseConfigPacket);
        this.registerPacket(Protocol.SET_EMAIL, SetEmailPacket);
        this.registerPacket(Protocol.SET_PREMIUM_LEFT_TIME, SetPremiumLeftTimePacket);
        this.registerPacket(Protocol.SET_WELCOME_TO_PREMIUM, SetWelcomeToPremiumPacket);
        this.registerPacket(Protocol.SET_NEWS, SetNewsPacket);
        this.registerPacket(Protocol.SET_DAILY_QUEST_ALERT, SetDailyQuestAlertPacket);
        this.registerPacket(Protocol.SET_GOLD_BOX_TAKEN, SetGoldBoxTakenPacket);
        this.registerPacket(Protocol.SET_GOLD_BOX_ALERT, SetGoldBoxAlertPacket);
        this.registerPacket(Protocol.SET_REMOVE_DAILY_QUEST, SetRemoveDailyQuestPacket);
        this.registerPacket(Protocol.SEND_REDEEM_DAILY_QUEST, SendRedeemDailyQuestPacket);
        this.registerPacket(Protocol.SET_CANNOT_CREATE_BATTLE, SetCannotCreateBattlePacket);
        this.registerPacket(Protocol.SET_WRONG_LOGIN_HASH, SetWrongLoginHashPacket);
        this.registerPacket(Protocol.SEND_TWINS_SECOND_SHOT, SendTwinsSecondShotPacket);
        this.registerPacket(Protocol.SET_KICK_MESSAGE, SetKickMessagePacket);
        this.registerPacket(Protocol.SET_VIEW_GIFTS, SetViewGiftsPacket);
        this.registerPacket(Protocol.SET_GIFT_RECEIVED, SetGiftReceivedPacket);
        this.registerPacket(Protocol.SET_CHANGE_QUEST, SetChangeQuestPacket);
        this.registerPacket(Protocol.SEND_CHANGE_QUEST, SendChangeQuestPacket);
        this.registerPacket(Protocol.SET_DAILY_QUESTS, SetDailyQuestsPacket);
        this.registerPacket(Protocol.SEND_OPEN_DAILY_QUESTS, SendOpenDailyQuestsPacket);
        this.registerPacket(Protocol.SET_USE_DRUG, SetUseDrugPacket);
        this.registerPacket(Protocol.SEND_USE_DRUG, SendUseDrugPacket);
        this.registerPacket(Protocol.SET_EXPLODE_MINE, SetExplodeMinePacket);
        this.registerPacket(Protocol.SET_REMOVE_MINE, SetRemoveMinePacket);
        this.registerPacket(Protocol.SET_PLACE_MINE, SetPlaceMinePacket);
        this.registerPacket(Protocol.SET_STOP_SHAFT_SHOT, SetStopShaftShotPacketPacket);
        this.registerPacket(Protocol.SEND_OPEN_SHAFT_AIM, SendOpenShaftAimPacket);
        this.registerPacket(Protocol.SEND_MOVE_SHAFT_VERTICAL_AXIS, SendMoveShaftVerticalAxisPacket);
        this.registerPacket(Protocol.SEND_SHAFT_AIM_SHOT, SendShaftAimShotPacket);
        this.registerPacket(Protocol.SEND_SHAFT_SHOT, SendShaftShotPacket);
        this.registerPacket(Protocol.SEND_SHAFT_STOP_AIM, SendShaftStopAimPacket);
        this.registerPacket(Protocol.SEND_START_SHAFT_AIM, SendStartShaftAimPacket);
        this.registerPacket(Protocol.SET_VULCAN_SHOT, SetVulcanShotPacket);
        this.registerPacket(Protocol.SET_STOP_VULCAN_SHOT, SetStopVulcanShotPacket);
        this.registerPacket(Protocol.SET_START_VULCAN_SHOT, SetStartVulcanShotPacket);
        this.registerPacket(Protocol.SEND_VULCAN_SHOT, SendVulcanShotPacket);
        this.registerPacket(Protocol.SEND_STOP_VULCAN_SHOT, SendStopVulcanShotPacket);
        this.registerPacket(Protocol.SEND_START_VULCAN_SHOT, SendStartVulcanShotPacket);
        this.registerPacket(Protocol.SET_RICOCHET_SHOT, SetRicochetShotPacket);
        this.registerPacket(Protocol.SEND_RICOCHET_TARGET_SHOT, SendRicochetTargetShotPacket);
        this.registerPacket(Protocol.SEND_RICOCHET_SHOT, SendRicochetShotPacket);
        this.registerPacket(Protocol.SET_STOP_FREEZE_SHOT, SetStopFreezeShotPacket);
        this.registerPacket(Protocol.SET_START_FREEZE_SHOT, SetStartFreezeShotPacket);
        this.registerPacket(Protocol.SEND_FREEZE_TARGETS_SHOT, SendFreezeTargetsShotPacket);
        this.registerPacket(Protocol.SEND_STOP_FREEZE_SHOT, SendStopFreezeShotPacket);
        this.registerPacket(Protocol.SEND_START_FREEZE_SHOOT, SendStartFreezeShootPacket);
        this.registerPacket(Protocol.SET_STORM_VOID_SHOT, SetStormVoidShotPacket);
        this.registerPacket(Protocol.SET_STORM_HIT_POINT_SHOT, SetStormHitPointShotPacket);
        this.registerPacket(Protocol.SEND_STORM_TARGET_SHOT, SendStormTargetShotPacket);
        this.registerPacket(Protocol.SEND_STORM_VOID_SHOT, SendStormVoidShotPacket);
        this.registerPacket(Protocol.SEND_STORM_HIT_POINT, SendStormHitPointPacket);
        this.registerPacket(Protocol.SET_ISIS_SHOT_POSITION, SetIsisShotPositionPacket);
        this.registerPacket(Protocol.SET_STOP_ISIS_SHOT, SetStopIsisShotPacket);
        this.registerPacket(Protocol.SET_START_ISIS_SHOT, SetStartIsisShotPacket);
        this.registerPacket(Protocol.SEND_STOP_ISIS_SHOT, SendStopIsisShotPacket);
        this.registerPacket(Protocol.SEND_ISIS_SHOT, SendIsisShotPacket);
        this.registerPacket(Protocol.SEND_START_ISIS_SHOT, SendStartIsisShotPacket);
        this.registerPacket(Protocol.SEND_ISIS_SHOT_POSITION, SendIsisShotPositionPacket);
        this.registerPacket(Protocol.SEND_RAILGUN_SHOT, SendRailgunShotPacket);
        this.registerPacket(Protocol.SEND_START_RAILGUN_SHOT, SendStartRailgunShotPacket);
        this.registerPacket(Protocol.SEND_TWINS_FIRST_SHOT, SendTwinsFirstShotPacket);
        this.registerPacket(Protocol.SET_HAMMER_SHOT, SetHammerShotPacket);
        this.registerPacket(Protocol.SEND_HAMMER_SHOT, SendHammerShotPacket);
        this.registerPacket(Protocol.SEND_OPEN_BATTLES_LIST, SendOpenBattlesListPacket);
        this.registerPacket(Protocol.SET_ADD_FRIEND_REQUEST, SetAddFriendRequestPacket);
        this.registerPacket(Protocol.VALIDATE_FRIEND_REQUEST, ValidateFriendRequestPacket);
        this.registerPacket(Protocol.SEND_OPEN_LINK, SendOpenLinkPacket);
        this.registerPacket(Protocol.SEND_ACCEPT_FRIEND_REQUEST, SendAcceptFriendRequestPacket);
        this.registerPacket(Protocol.SET_ADD_FRIEND, SetAddFriendPacket);
        this.registerPacket(Protocol.SET_USER_ACCEPTED_BATTLE_INVITE, SetUserAcceptedBattleInvitePacket);
        this.registerPacket(Protocol.SET_USER_RECUSED_BATTLE_INVITE, SetUserRecusedBattleInvitePacket);
        this.registerPacket(Protocol.SEND_BATTLE_INVITE, SendBattleInvitePacket);
        this.registerPacket(Protocol.SET_OK_POPUP, SetOkPopupPacket);
        this.registerPacket(Protocol.SET_SERVER_WILL_UPDATE, SetServerWillUpdatePacket);
        this.registerPacket(Protocol.SET_TEAM_STOPPED_CAPTURING_CONTROL_POINT_PACKET, SetTeamStoppedCapturingControlPointPacketPacket);
        this.registerPacket(Protocol.SEND_FLAME_TARGETS_SHOT, SendFlameTargetsShotPacket);
        this.registerPacket(Protocol.SOME_USER_LEFT, SomeUserLeftPacket);
        this.registerPacket(Protocol.SET_DRUG_QUANTITY, SetDrugQuantityPacket);
        this.registerPacket(Protocol.SET_CAPTURING_POINT, SetCapturingPointPacket);
        this.registerPacket(Protocol.SET_TANK_RESPAWN_DELAY, SetTankRespawnDelayPacket);
        this.registerPacket(Protocol.SET_SUICIDE_DELAY, SetSuicideDelayPacket);
        this.registerPacket(Protocol.SET_REMOVE_GARAGE, SetRemoveGaragePacket);
        this.registerPacket(Protocol.SET_OPEN_FRIENDS_LIST, SetOpenFriendsListPacket);
        this.registerPacket(Protocol.SET_BATTLE_NOT_EXIST, SetBattleNotExistPacket);
        this.registerPacket(Protocol.SET_SMOKY_VOID_SHOT, SetSmokyVoidShotPacket);
        this.registerPacket(Protocol.SET_CONTROL_POINT_STATE, SetControlPointStatePacket);
        this.registerPacket(Protocol.SET_TANK_STOP_CAPTURING_CONTROL_POINT, SetTankStopCapturingControlPointPacket);
        this.registerPacket(Protocol.SET_TANK_CAPTURING_CONTROL_POINT, SetTankCapturingControlPointPacket);
        this.registerPacket(Protocol.SEND_TEAM_STARTED_CAPTURING_CONTROL_POINT, SetTeamStartedCapturingControlPointPacket);
        this.registerPacket(Protocol.SET_BATTLE_CONTROL_POINTS_CONFIGURATION, SetBattleControlPointsConfigurationPacket);
        this.registerPacket(Protocol.SET_BATTLE_TEAM_USERS, SetBattleTeamUsersPacket);
        this.registerPacket(Protocol.SET_FLAG_RETURNED, SetFlagReturnedPacket);
        this.registerPacket(Protocol.SET_FLAG_DROPPED, SetFlagDroppedPacket);
        this.registerPacket(Protocol.SEND_DROP_FLAG, SendDropFlagPacket);
        this.registerPacket(Protocol.SET_BATTLE_USERS_STAT, SetBattleUsersStatPacket);
        this.registerPacket(Protocol.SET_BATTLE_TIME, SetBattleTimePacket);
        this.registerPacket(Protocol.SOME_JSON_RANK_UP, SomeJsonRankUpPacket);
        this.registerPacket(Protocol.SET_SOME_PACKET_ON_JOIN_BATTLE_5, SetSomePacketOnJoinBattle5Packet);
        this.registerPacket(Protocol.SET_SOME_PACKET_ON_JOIN_BATTLE_4, SetSomePacketOnJoinBattle4Packet);
        this.registerPacket(Protocol.SET_BATTLE_CHAT_ENABLED, SetBattleChatEnabledPacket);
        this.registerPacket(Protocol.SET_REMOVE_CHAT, SetRemoveChatPacket);
        this.registerPacket(Protocol.SET_REMOVE_BATTLES_SCREEN, SetRemoveBattlesScreenPacket);

        // GENERATE REGISTER HERE
        this.registerPacket(Protocol.SEND_SHOW_NOTIFICATIONS, SendShowNotificationsPacket);
        this.registerPacket(Protocol.SET_OPEN_CONFIG, SetOpenConfigPacket);
        this.registerPacket(Protocol.SEND_OPEN_CONFIG, SendOpenConfigPacket);
        this.registerPacket(Protocol.VALIDATE_FRIEND, ValidateFriendPacket);
        this.registerPacket(Protocol.SET_ALREADY_SENT_FRIEND_REQUEST_POPUP, SetAlreadySentFriendRequestPopupPacket);
        this.registerPacket(Protocol.SET_REMOVE_FRIEND, SetRemoveFriendPacket);
        this.registerPacket(Protocol.SEND_REMOVE_FRIEND, SendRemoveFriendPacket);
        this.registerPacket(Protocol.SET_REMOVE_FRIEND_REQUEST, SetRemoveFriendRequestPacket);
        this.registerPacket(Protocol.SEND_REFUSE_FRIEND_REQUEST, SendRefuseFriendRequestPacket);
        this.registerPacket(Protocol.SEND_REFUSE_ALL_FRIEND_REQUESTS, SendRefuseAllFriendRequestsPacket);
        this.registerPacket(Protocol.SEND_PREVIEW_PAINTING, SendPreviewPaintingPacket);
        this.registerPacket(Protocol.SEND_BUY_GARAGE_ITEM, SendBuyGarageItemPacket);
        this.registerPacket(Protocol.SEND_INVITE_CODE, SendInviteCodePacket);
        this.registerPacket(Protocol.SET_SUCCESS_DIALOG, SetSuccessDialogPacket);
        this.registerPacket(Protocol.SEND_CHANGE_PASSWORD, SendChangePasswordPacket);
        this.registerPacket(Protocol.SET_CHANGE_PASSWORD_SCREEN, SetChangePasswordScreenPacket);
        this.registerPacket(Protocol.SEND_EMAIL_CODE, SendEmailCodePacket);
        this.registerPacket(Protocol.SET_EMAIL_CODE_SCREEN, SetEmailCodeScreenPacket);
        this.registerPacket(Protocol.SEND_VERIFY_EMAIL, SendVerifyEmailPacket);
        this.registerPacket(Protocol.SEND_SUCCESSFUL_PURCHASE, SendSuccessfulPurchasePacket);

        Logger.info('NETWORK', `${this.packetPool.size} packets registered`)
    }

    private registerPacket<P = SimplePacket>(id: number, packet: P) {
        if (this.packetPool.has(id)) {
            throw new Error(`Packet with id ${id} already exists`)
        }
        this.packetPool.set(id, packet as typeof require)
    }

    public findPacket<P>(id: number) {
        const packet = this.packetPool.get(id)
        if (!packet) {
            throw new Error(`Packet ${id} handler not found`)
        }
        return packet as P
    }

    public getPacketPool() {
        return this.packetPool
    }
}