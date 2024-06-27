export class DamageIndicator {
    static readonly NORMAL = 'NORMAL';
    static readonly CRITICAL = 'CRITICAL';
    static readonly FATAL = 'FATAL';
    static readonly HEAL = 'HEAL';

    static readonly INDICATORS = [
        DamageIndicator.NORMAL,
        DamageIndicator.CRITICAL,
        DamageIndicator.FATAL,
        DamageIndicator.HEAL
    ]
}