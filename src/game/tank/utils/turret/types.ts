import { ITurretProperties } from "@/network/packets/set-turrets-data";

export interface IRailgunProperties extends ITurretProperties {
    special_entity: {
        chargingTimeMsec: number;
        weakeningCoeff: number;
    }
}

export interface ISmokyProperties extends ITurretProperties {
    max_damage_radius: number;
    min_damage_radius: number;
    min_damage_percent: number;
}

export interface IFlamethrowerProperties extends ITurretProperties {
    max_damage_radius: number;
    min_damage_radius: number;
    min_damage_percent: number;
    special_entity: {
        coneAngle: number;
        range: number;
        energyCapacity: number;
        energyDischargeSpeed: number;
        energyRechargeSpeed: number;
        tickIntervalMsec: number;
    }
}

export interface ITwinsProperties extends ITurretProperties {
    max_damage_radius: number;
    min_damage_radius: number;
    min_damage_percent: number;
    special_entity: {
        distance: number;
        shellRadius: number;
        speed: number;
    }
}

export interface IIsisProperties extends ITurretProperties {
    special_entity: {
        coneAngle: number;
        capacity: number;
        chargeRate: number;
        checkPeriodMsec: number;
        dischargeIdleRate: number;
        dischargeDamageRate: number;
        dischargeHealingRate: number;
        radius: number;
    }
}

export interface IThunderProperties extends ITurretProperties {
    max_damage_radius: number;
    min_damage_radius: number;
    min_damage_percent: number;
    special_entity: {
        impactForce: number;
        radiusOfMaxSplashDamage: number;
        minSplashDamagePercent: number;
        splashDamageRadius: number;
    }
}

export interface IShotgunProperties extends ITurretProperties {
    max_damage_radius: number;
    min_damage_radius: number;
    min_damage_percent: number;
    special_entity: {
        coneHorizontalAngle: number;
        coneVerticalAngle: number;
        pelletCount: number;
        magazineReloadTime: number;
        magazineSize: number;
    }
}

export interface IFreezeProperties extends ITurretProperties {
    max_damage_radius: number;
    min_damage_radius: number;
    min_damage_percent: number;
    special_entity: {
        damageAreaConeAngle: number;
        damageAreaRange: number;
        energyCapacity: number;
        energyRechargeSpeed: number;
        energyDischargeSpeed: number;
        tickIntervalMsec: number;
    }
}

export interface IRicochetProperties extends ITurretProperties {
    max_damage_radius: number;
    min_damage_radius: number;
    min_damage_percent: number;
    special_entity: {
        energyCapacity: number;
        energyPerShot: number;
        energyRechargeSpeed: number;
        maxRicochetCount: number;
        shotDistance: number;
        shellRadius: number;
        shellSpeed: number;
    }
}

export interface IMachinegunProperties extends ITurretProperties {
    max_damage_radius: number;
    min_damage_radius: number;
    min_damage_percent: number;
    special_entity: {
        spinDownTime: number;
        spinUpTime: number;
        temperatureHittingTime: number;
        weaponTurnDecelerationCoeff: number;
    }
}

export interface IShaftProperties extends ITurretProperties {
    special_entity: {
        max_energy: number;
        charge_rate: number;
        discharge_rate: number;
        elevation_angle_up: number;
        elevation_angle_down: number;
        vertical_targeting_speed: number;
        horizontal_targeting_speed: number;
        initial_fov: number;
        minimum_fov: number;
        shrubs_hiding_radius_min: number;
        shrubs_hiding_radius_max: number;
        afterShotPause: number;
        aimingImpact: number;
        fastShotEnergy: number;
        minAimedShotEnergy: number;
        rotationCoeffKmin: number;
        rotationCoeffT1: number;
        rotationCoeffT2: number;
        targetingAcceleration: number;
        targetingTransitionTime: number;
        reticleImageId: number;
        weakeningCoeff: number;
        fadeInTimeMs: number;
        laserPointerBlueColor: number;
        laserPointerRedColor: number;
        locallyVisible: boolean;
    }
}