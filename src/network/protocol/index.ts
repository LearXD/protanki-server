
export class Protocol {

    static SIMPLE = -1

    /** LAUNCHER SETTINGS */
    // 1807685988
    static SET_CRYPT_KEYS = 2001736388
    static SET_LOAD_RESOURCES = -1797047325
    static RESOLVE_CALLBACK = -82304134
    static RESOLVE_FULL_LOADED = -1282173466 // pelo contexto é isso
    static SEND_LANGUAGE = -1864333717

    /** SEND_LOGIN */
    //-1179390022
    static SET_NETWORK_PARAMS = -1715719586
    static SET_REMEMBER_ME = -1967950183;
    //1243673979
    //-87665118
    //-570114058


    /** CAPTCHA */
    static SEND_REQUEST_CAPTCHA = -349828108
    //-373510957
    static SET_CAPTCHA_LOCATIONS = 321971701
    static SET_CAPTCHA_DATA = -1670408519
    static SET_CAPTCHA_RESPONSE = 1271163230
    static SET_CAPTCHA_LOCATION_2 = -819536476 // remove?


    /** RESOURCE */
    static SET_TIP_RESOURCE = 2094741924
    static SEND_REQUEST_LOAD_SCREEN = -1376947245


    /** INVITE? */
    //509394385
    //312571157
    //714838911
    //184934482
    static SET_INVITE_ENABLED = 444933603


    /** DO SEND_REGISTER */
    static SEND_REGISTER = 427083290;
    //-653665247
    static CHECK_USERNAME = 1083705823; // repetido
    static USERNAME_NOT_FOUND = 1083705823; //repetido
    //1480924803
    static SET_AUTH_RESOURCES = -1277343167
    //1003297349
    static SET_ADVISED_USERNAMES = 442888643;
    static RESULT_CHECK_USERNAME = -706679202;


    /** DO SEND_LOGIN */
    static SEND_LOGIN = -739684591;
    static SET_GAME_LOADED = -1923286328 // login success?
    static SET_INCORRECT_PASSWORD_POPUP = 103812952;


    /** EMAIL */
    static SET_EMAIL_INFO = 613462801;
    //1312986424
    //2029312880
    static SET_EMAIL = -822981766;
    //600420685
    //-1533422832
    //133238100
    //652872053
    //-714487273
    //1771456254
    //1544223090
    //-1507635228
    //147737736
    //1928355480
    //-20486732
    //2145091885
    //-822403331
    //-1515366171
    //668890771


    /** AUTO SEND_LOGIN */
    static SET_WRONG_LOGIN_HASH = 655372891;
    static SET_LOGIN_HASH = 932564569;
    static SEND_LOGIN_HASH = -845588810;


    /** ACCOUNT BONUS x2 CRYSTALS AND x2 SCORE */
    static SET_BONUS = 29211250;


    /** SERVER SIDE LAYOUT CONTROL */
    static SET_SUB_LAYOUT_STATE = -593368100;
    static SET_LAYOUT_STATE = 1118835050;


    /** CHAT */
    static SEND_CHAT_MESSAGE = 705454610;
    static SET_CHAT_COST = 744948472;
    static SET_REMOVE_CHAT = -920985123;
    static SET_CHAT_INIT_PARAMS = 178154988;
    static SET_SOME_UID = 1993050216 // TODO: see what is this (BAN?)
    static SET_CHAT_MESSAGES = -1263520410;
    // -1062190024


    /** PREMIUM */
    static SET_WELCOME_TO_PREMIUM = -478572181;
    static SET_PREMIUM_LEFT_TIME = 1391146385;
    static SET_PREMIUM_DATA = 1405859779;


    /** USER INFO */
    static SET_USER_PROPERTY = 907073245;
    //150222118


    /** FRIENDS */
    static SET_FRIENDS_DATA = 1422563374;
    // -2089008699
    // 650923390
    static SET_ADD_FRIEND_REQUEST = 553380510;
    // -221757454
    // 1716773193
    // 1286861380
    static SET_OPEN_FRIENDS_LIST = -437587751;
    static SEND_OPEN_FRIENDS = 1441234714; // nao tenho certeza
    static REMOVED_FRIEND_REQUEST = 614714702;
    static VALIDATE_FRIEND_REQUEST = -1041660861;
    // -1885167992
    static SEND_ACCEPT_FRIEND_REQUEST = -1926185291;
    // 2064692768
    static SEND_FRIEND_REQUEST = -1457773660;
    static SET_USER_NOT_FOUND_ON_FRIENDS_LIST = -1490761936;
    static REMOVE_FRIEND_REQUEST = 84050355;
    // -1258754138
    static SET_USER_FOUND_ON_FRIENDS_LIST = -707501253;
    static SET_ADD_FRIEND = -139645601;
    // -1588006900
    static SEND_FIND_USER_ON_FRIENDS_LIST = 126880779;
    // -1590185083
    static SET_ADD_SENT_FRIEND_REQUEST = -1241704092;
    // 837875576
    // 641950429


    /** ACHIEVEMENTS */
    // 579696867
    static SET_ACHIEVEMENT_CC = 602656160;
    static SET_ACHIEVEMENT_MESSAGE = -1042583203


    /** BATTLE INVITE  */
    static SEND_BATTLE_INVITE = -864265623;
    // 1152865919
    static SET_USER_ACCEPTED_BATTLE_INVITE = -1851236532;
    // 814687528
    // 1383159023
    // 810713262
    // 415207851
    static SET_USER_RECUSED_BATTLE_INVITE = 1015650019;
    static SET_BATTLE_INVITE_CC = 834877801;


    /** BATTLE CHAT */
    // -1331361684
    // -449356094
    // 1532749363
    static SET_BATTLE_MESSAGE = 1259981343;
    static SEND_BATTLE_MESSAGE = 945463181
    static SET_BATTLE_SYSTEM_MESSAGE = 606668848
    static SET_BATTLE_CHAT_ENABLED = -643105296;


    /** COUNTRY */
    // static SEND_SET_DEFAULT_COUNTRY = 921004371
    // static SEND_OPEN_SHOP = -296048697
    // 1870342869
    // static SET_SELECT_DEFAULT_COUNTRY = 1961542160
    static SET_COUNTRY_LOCALE_NAME = -1232334539;


    /** ???? */
    static SET_NOTIFICATION_ENABLED = 1447082276;
    static SEND_SHOW_DAMAGE_INDICATOR = -731115522;
    static SET_CLOSE_CONFIG = -1302674105;
    static SEND_REQUEST_CONFIG_DATA = 850220815; // nao tenho certeza


    /** BATTLE FUND & STATS */
    static SET_BATTLE_FUND = 1149211509;
    static SET_SOME_PACKET_ON_JOIN_BATTLE_5 = 1953272681;
    // 1249639251
    // 446781737
    static SET_BATTLE_REWARDS = 560336625
    static SET_USER_NEW_RANK = 1262947513;
    static SET_BATTLE_STATISTICS_CC = 522993449;
    static SET_BATTLE_TIME = 732434644;


    /** TEM BATTLE */
    static SET_USER_ID_USERS_INFO_TEAM = 2040021062;
    static SET_BATTLE_TEAM_USERS = -1668779175;
    static SEND_TEAM_SCORE = 561771020; // ctf
    static SET_BATTLE_STATISTICS_TEAM_CC = -1233891872;
    static SET_USER_LEFT_BATTLE = 1411656080;
    static SEND_TEAM_BATTLE_USER_START = -497293992;


    /** USER INFOS */
    static SET_USER_BATTLE = -1895446889; // AQUI PODERIA SER CREATE_BATTLE
    static SET_REMOVE_USER_PLAYING = 1941694508;
    static SEND_REQUEST_USER_DATA = 1774907609;
    // -2040152224
    static SET_USER_ONLINE = 2041598093;
    static SET_USER_PREMIUM_DATA = -2069508071;
    static SET_USER_RANK = -962759489;
    // -1353047954


    /** ON JOIN/LEFT BATTLE USERS INFO */
    static SET_BATTLE_USER_LEFT_NOTIFICATION = -1689876764;
    static SET_BATTLE_USER_STATUS = 696140460;
    static SET_BATTLE_CHAT_CONFIG = 862913394
    static SET_BATTLE_STATISTICS_DM_CC = -1959138292;
    static SET_BATTLE_USERS_STAT = 1061006142;


    /** BATTLE LIST INFO */
    // 2011860838
    static SET_BATTLE_RESTARTED = -994817471;
    static SET_REMOVE_USER_FROM_BATTLE_COUNTER = 504016996;
    // 1149131596
    static SET_REMOVE_USER_FROM_TEAM_BATTLE_COUNTER = 1447204641;
    // -751613832
    static SET_ADD_USER_ON_TEAM_BATTLE_COUNTER = -169305322;
    static SET_ADD_USER_ON_BATTLE_COUNTER = -2133657895;


    /** VIEWING BATTLE INFO */
    // -1315002220
    static SET_VIEWING_BATTLE_USER_SCORE = -375282889;
    static SET_BATTLE_ENDED = 1534651002;
    static SET_REMOVE_USER_FROM_VIEWING_TEAM_BATTLE = 1924874982;
    // -879771375
    static SET_BATTLE_STARTED = -344514517
    static SET_ADD_USER_INFO_ON_VIEWING_TEAM_BATTLE = 118447426;
    static SET_REMOVE_VIEWING_BATTLE_USER_INFO = -911626491;
    static SET_OK_POPUP = -831998018;
    static SET_REMOVE_VIEWING_BATTLE = -602527073
    // -698399183
    static SET_REMOVE_VIEWING_BATTLE_USER_KILLS = -1263036614;
    // 1561014187
    // -1702097572
    static SEND_JOIN_ON_BATTLE = -1284211503;
    static SET_VIEWING_BATTLE_TEAM_SCORE = 1428217189;
    // -10847382
    // 1229594925
    static SET_REMOVE_VIEWING_BATTLE_DATA = 546722394;


    /** USER SCORE/CRYSTALS  */
    static SET_SCORE = 2116086491;
    static SET_USER_RANK_UP_DIALOG = 1989173907
    static SET_RATTING = -1128606444;
    static SET_CRYSTALS = -593513288


    /** CTF INFO */
    static SET_TANK_FLAG = -1282406496;
    static SET_CAPTURE_THE_FLAG_CC = 789790814;
    static SET_FLAG_DROPPED = 1925237062;
    static SET_FLAG_RETURNED = -1026428589;
    static SEND_DROP_FLAG = -1832611824;
    // -1142938284
    static SET_WINNER_TEAM = -1870108387;


    /** MINE */
    static SET_PLACE_MINE = 272183855;
    // -718866741
    static SET_REMOVE_MINE = -624217047;
    static SET_EXPLODE_MINE = 1387974401;
    // -1200619383
    static SET_BATTLE_MINE_CC = -226978906;


    /** CREATE BATTLE */
    // 566338297
    // -1491503394
    static SEND_CHECK_BATTLE_NAME = 566652736;
    static SET_CANNOT_CREATE_BATTLE = -614313838;
    static SET_BATTLE_NAME = 120401338;
    static SEND_CREATE_BATTLE = -2135234426
    static SET_MAPS_DATA = -838186985;
    // 947161947


    /** BATTLE LIST */
    static SET_VIEWING_BATTLE = 2092412133;
    static SET_BATTLE_LIST = 552006706;
    static SET_REMOVE_BATTLES_SCREEN = -324155151;
    static SET_REMOVE_BATTLE_FROM_LIST = -1848001147;
    static SET_ADD_BATTLE_ON_LIST = 802300608;


    /** BATTLE TURRETS DATA */
    static SET_TURRETS_DATA = -2124388778;


    /** EFFECTS & BOXES */
    static SET_BONUS_BOX_COLLECTED = -1291499147
    static SET_SPAWN_BONUS_BOX = 1831462385;
    static SET_USER_TANK_RESOURCES_DATA = -1643824092;
    // 201628290
    static SET_BONUSES_DATA = 228171466;
    static SET_REMOVE_BATTLE_SCREEN = -985579124
    static SET_BATTLE_DATA = -152638117;
    // -745598420
    static SEND_COLLECT_BONUS_BOX = -1047185003;
    static SET_BATTLE_SPAWNED_BOXES = 870278784;
    static SET_BATTLE_USERS_EFFECTS = 417965410;
    static SET_REMOVE_BONUS_BOX = -2026749922


    /** DRUGS */
    static SET_SUPPLIES = -137249251;
    static SET_DRUG_QUANTITY = -502907094;
    // -1981777467
    static SEND_USE_DRUG = -2102525054;
    static SET_USE_DRUG = 2032104949;


    /**  */
    // -324894035
    // -1897104567
    static SET_SOCIAL_NETWORK_PANEL_CC = -583564465;
    // -20513325
    // -541741971
    // 2098576423


    /** BATTLE MOVEMENT */
    static SET_MOVE_CAMERA = -157204477;
    static SET_ADD_TANK_EFFECT = -1639713644;
    static SEND_MOVE_TANK_TRACKS = -1749108178;
    static SET_TANK_VISIBLE = 1868573511;
    static SEND_REQUEST_RESPAWN = -1378839846
    static SET_SPAWN_TANK = 875259457;
    static SEND_RESUME = 268832557
    static SEND_MOVE_TANK_AND_TURRET = -1683279062;
    static SEND_CHANGED_EQUIPMENT = 1178028365
    static SET_TANK_DESTROYED = -42520728;
    static SET_TANK_TEMPERATURE = 581377054;
    static SET_TANK_CONTROL = -301298508;
    static SET_MOVE_TANK = -64696933;
    static SEND_TANK_TURRET_DIRECTION = -114968993;
    static SET_REMOVE_TANK = 1719707347;
    static SET_MOVE_TANK_AND_TURRET = 1516578027;
    static SEND_MOVE_TANK = 329279865;
    static SET_TANK_HEALTH = -611961116;
    static SET_TANK_TURRET_ANGLE_CONTROL = 1927704181;
    static SET_TANK_SPEED = -1672577397;
    static SET_REMOVE_TANK_EFFECT = -1994318624;


    /** TWINS SHOT */
    // -1805942142
    static SET_TWINS_SHOT = -44282936;
    static SEND_TWINS_SECOND_SHOT = -159686980;
    static SEND_TWINS_FIRST_SHOT = -482023661;
    // -328554480
    // -1723353904


    /** SMOKY SHOT */
    static SEND_SHOT_VOID = 1478921140;
    static SET_SMOKY_TARGET_SHOT = -1334002026;
    static SET_SMOKY_CRITICAL_EFFECT = -671618989
    static SEND_SMOKY_HIT_POINT_SHOT = 1470597926;
    static SEND_SHOT_WITH_TARGET = 229267683;
    static SET_SMOKY_VOID_SHOT = -1032328347;
    static SET_SMOKY_HIT_POINT = 546849203;


    /** SHAFT SHOT */
    static SET_SHOOTER_TANK_SPOT = 11992250;
    static SEND_SHAFT_AIM_SHOT = 1632423559;
    static SEND_OPEN_SHAFT_AIM = -1487306515;
    static SET_SHAFT_SHOT = 1184835319;
    // -1527013252
    static SEND_START_SHAFT_AIM = -367760678;
    static SET_START_SHAFT_SHOT = -1222085753;
    static SET_STOP_SHAFT_SHOT = -380595194;
    static SET_SOME_SHAFT_SHOOTER = -1380283560;
    static SEND_MOVE_SHAFT_VERTICAL_AXIS = 1224288585;
    static SEND_SHAFT_LOCAL_SPOT = -1517837003;
    static SET_MOVE_SHAFT_VERTICAL_AXIS = -534192254;
    static SEND_SHAFT_STOP_AIM = 843751647;
    static SEND_SHAFT_SHOT = -2030760866;


    /**  STORM SHOT */
    static SET_STORM_HIT_POINT_SHOT = 1690491826;
    static SEND_STORM_HIT_POINT = 1501310158;
    static SET_STORM_TARGET_SHOT = -190359403;
    static SET_STORM_VOID_SHOT = 958509220;
    static SEND_STORM_VOID_SHOT = -136344740;
    static SEND_STORM_TARGET_SHOT = 259979915;


    /** RAILGUN SHOT */
    static SET_SOME_RAILGUN_SHOOTER = 1459211021;
    static SEND_START_RAILGUN_SHOT = -1759063234;
    static SEND_RAILGUN_SHOT = -484994657;
    static SET_RAILGUN_SHOT = -369590613;
    static SET_START_RAILGUN_SHOT = 346830254;
    // -18176641


    /** FLAME SHOT */
    static SET_STOP_FLAME_SHOT = 1333088437;
    static SET_START_FLAME_SHOT = 1212381771;
    static SEND_FLAME_TARGETS_SHOT = 1395251766;
    static SEND_STOP_FLAME_SHOT = -1300958299
    static SEND_START_FLAME_SHOT = -1986638927


    /** DAMAGE INDICATOR */
    static SET_DAMAGE_INDICATORS = -1165230470;


    /** TIME & LATENCY */
    static SET_LATENCY = 34068208;
    static SET_TIME = 2074243318;


    /** KICK */
    // 1200280053
    static KICK = -600078553;


    /** PING & PONG */
    static PING = -555602629;
    static PONG = 1484572481


    /** GARAGE? */
    static SET_GARAGE_ITEMS = -47424608
    // -1176568376


    /** DESTROY */
    static SET_DESTROY_TANK = 162656882
    static SEND_AUTO_DESTROY = 988664577;


    /** SEND LAYOUT */
    static SEND_LAYOUT_STATE = 377959142


    /** OPEN GARAGE */
    static SEND_OPEN_GARAGE = -479046431


    /** GARAGE BUY/EQUIP  */
    static SET_REMOVE_GARAGE = 1211186637;
    static SET_EQUIP_GARAGE_ITEM = 2062201643
    static SET_VIEW_GIFTS = -1154479430;
    // -161726525
    static SET_GARAGE_CATEGORY = 1318061480
    static SET_USER_GARAGE_ITEMS = -255516505
    static SET_GARAGE_ITEMS_PROPERTIES = -300370823
    static SET_REMOVE_GARAGE_ITEM = -803365239
    // -2001666558
    static SET_GIFT_RECEIVED = -1638767166;
    // -1518850075
    // -1968445033
    static SEND_EQUIP_ITEM = -1505530736
    // -1763914667
    // 1091756732
    static SEND_BUY_GARAGE_KIT = -523392052
    // -471022967
    // -1961983005

    /* CHANGE EQUIPMENT */
    static SET_SUICIDE_DELAY = -911983090;
    static SET_TANK_RESPAWN_DELAY = -173682854;
    static SET_TANK_CHANGED_EQUIPMENT = -1767633906


    /** NEWS */
    static SET_NEWS = -260270890;


    /**  */
    static SEND_REDEEM_DAILY_QUEST = -867767128;
    static SEND_OPEN_DAILY_QUESTS = 1227293080;
    // 1642608662
    static SET_REMOVE_DAILY_QUEST = 1768449810;
    static SET_DAILY_QUESTS = 809822533;
    // 1417347634
    static SET_CHANGE_QUEST = -1266665816;
    static SET_OPEN_DAILY_QUESTS = 956252237;
    static SET_DAILY_QUEST_ALERT = 1579425801;
    static SEND_CHANGE_QUEST = 326032325;
    // 885055495


    /** GOLD BOX */
    static SET_GOLD_BOX_TAKEN = 463494974;
    // 1382076950
    static SET_GOLD_BOX_ALERT = -666893269;


    /** ??? */
    static SET_KICK_MESSAGE = -322235316;


    /** VULCAN SHOT  */
    static SEND_STOP_VULCAN_SHOT = 1794372798;
    static SEND_VULCAN_SHOT = -1889502569;
    // 299028276
    static SET_STOP_VULCAN_SHOT = 133452238; // static SOME_SHOOTER = 133452238;
    static SET_START_VULCAN_SHOT = -1616602030;
    static SEND_START_VULCAN_SHOT = -520655432;
    static SET_VULCAN_SHOT = -891286317;


    /** RICOCHET SHOT */
    static SEND_RICOCHET_SHOT = -1907971330;
    // -1670466290
    static SET_RICOCHET_SHOT = -118119523;
    // 1147113344
    // -1823935471
    static SEND_RICOCHET_TARGET_SHOT = 1229701582;


    /** FREEZE SHOT */
    static SET_STOP_FREEZE_SHOT = 979099084;
    static SEND_START_FREEZE_SHOOT = -75406982;
    static SEND_FREEZE_TARGETS_SHOT = -2123941185;
    static SEND_STOP_FREEZE_SHOT = -1654947652;
    static SET_START_FREEZE_SHOT = -1171353580;

    /** ISIS SHOT */
    static SEND_ISIS_SHOT = 381067984;
    static SEND_START_ISIS_SHOT = -248693565;
    static SET_STOP_ISIS_SHOT = 981035905;
    static SET_START_ISIS_SHOT = -1271729363;
    static SET_ISIS_SHOT_POSITION = 2001632000;
    static SEND_ISIS_SHOT_POSITION = 244072998;
    static SEND_STOP_ISIS_SHOT = -1051248475;

    /** HAMMER SHOT */
    static SEND_HAMMER_SHOT = -541655881;
    // 2128281231
    static SET_HAMMER_SHOT = 471157826;

    /** ???? */
    static SEND_OPEN_BATTLES_LIST = 1452181070;


    /** REQUEST BATTLE */
    // -983139626
    static SEND_OPEN_LINK = -604091695;
    static SET_BATTLE_NOT_EXIST = 1132011721;
    // 1152930968


    /** SERVER WILL UPDATE */
    static SET_SERVER_WILL_UPDATE = -1712113407;



    static SET_CAPTURING_POINT = -2141998253;
    static SET_BATTLE_CONTROL_POINTS_CONFIGURATION = -1337059439;
    static SET_TANK_CAPTURING_CONTROL_POINT = -456245145;
    // -773473371
    static SET_TEAM_STOPPED_CAPTURING_CONTROL_POINT_PACKET = -1701488017;
    // -1548609916
    static SEND_TEAM_STARTED_CAPTURING_CONTROL_POINT = -1346883037;
    static SET_TANK_STOP_CAPTURING_CONTROL_POINT = -1410197917;
    static SET_CONTROL_POINT_STATE = -1073178885;


    /** SOME JSON */
    static SOME_JSON_RANK_UP = -1709511848;
    static SET_SOME_PACKET_ON_JOIN_BATTLE_4 = 930618015;


    /** SHOP */
    // -1850050333 (CODIGO INVALIDO)
    // 880756819 (clicou para comprar algo)
    // -1859441081
    // -1455955413 (foi pra loja externa???)
    // static SET_SHOP_DATA = 1863710730
    // -511004908 (ENVIAR CODIGO PROMOCIONAL)

    // GENERATE HERE
    static SEND_SHOW_NOTIFICATIONS = 1312986424;
    static SET_OPEN_CONFIG = 600420685;
    static SEND_OPEN_CONFIG = -1507635228;
    static VALIDATE_FRIEND = 1286861380;
    static SET_ALREADY_SENT_FRIEND_REQUEST_POPUP = 2064692768;
    static SET_REMOVE_FRIEND = 1716773193;
    static SEND_REMOVE_FRIEND = -221757454;
    static SET_REMOVE_FRIEND_REQUEST = -1885167992;
    static SEND_REFUSE_FRIEND_REQUEST = -1588006900;
    static SEND_REFUSE_ALL_FRIEND_REQUESTS = -1590185083;
    static SEND_PREVIEW_PAINTING = 1091756732;
    static SEND_BUY_GARAGE_ITEM = -1961983005;
    static SEND_INVITE_CODE = 509394385;
    static SET_SUCCESS_DIALOG = 1570555748;
    static SEND_CHANGE_PASSWORD = 762959326;
    static SET_CHANGE_PASSWORD_SCREEN = -2118900410;
    static SEND_EMAIL_CODE = 903498755;
    static SET_EMAIL_CODE_SCREEN = -1607756600;
    static SEND_VERIFY_EMAIL = 1744584433;
    static SEND_SUCCESSFUL_PURCHASE = 1566424318;


    static SET_ADD_SPECIAL_ITEM = -875418096;

    // TODO: implementar esses packets
    // static SET_SHOP = 1153801756
}