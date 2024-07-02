export class CaptchaLocation {

    public static readonly LOGIN_FORM = "LOGIN_FORM"
    public static readonly REGISTER_FORM = "REGISTER_FORM"
    public static readonly CLIENT_STARTUP = "CLIENT_STARTUP"
    public static readonly RESTORE_PASSWORD_FORM = "RESTORE_PASSWORD_FORM"
    public static readonly EMAIL_CHANGE_HASH = "EMAIL_CHANGE_HASH"
    public static readonly ACCOUNT_SETTINGS_FORM = "ACCOUNT_SETTINGS_FORM"

    public static readonly ALL = [
        CaptchaLocation.LOGIN_FORM,
        CaptchaLocation.REGISTER_FORM,
        CaptchaLocation.CLIENT_STARTUP,
        CaptchaLocation.RESTORE_PASSWORD_FORM,
        CaptchaLocation.EMAIL_CHANGE_HASH,
        CaptchaLocation.ACCOUNT_SETTINGS_FORM
    ]
}

export type OnlyStringKeys<T> = T extends string ? T : never
export type CaptchaLocationType = OnlyStringKeys<typeof CaptchaLocation[keyof typeof CaptchaLocation]>