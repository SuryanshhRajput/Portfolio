/**
 * Solar position using the NOAA spreadsheet equations (accurate to about a
 * tenth of a degree for our purposes). Pure functions, no DOM.
 */

const RAD = Math.PI / 180;
const DEG = 180 / Math.PI;

export interface SunPosition {
  /** Degrees above the horizon. Negative below it. */
  altitude: number;
  /** Degrees clockwise from north. */
  azimuth: number;
}

interface SolarTerms {
  declination: number; // radians
  eqTime: number; // minutes
}

function terms(date: Date): SolarTerms {
  const jd = date.getTime() / 86400000 + 2440587.5;
  const jc = (jd - 2451545) / 36525;

  const l0 = (280.46646 + jc * (36000.76983 + jc * 0.0003032)) % 360;
  const m = 357.52911 + jc * (35999.05029 - 0.0001537 * jc);
  const e = 0.016708634 - jc * (0.000042037 + 0.0000001267 * jc);
  const c =
    Math.sin(m * RAD) * (1.914602 - jc * (0.004817 + 0.000014 * jc)) +
    Math.sin(2 * m * RAD) * (0.019993 - 0.000101 * jc) +
    Math.sin(3 * m * RAD) * 0.000289;
  const trueLong = l0 + c;
  const omega = 125.04 - 1934.136 * jc;
  const appLong = trueLong - 0.00569 - 0.00478 * Math.sin(omega * RAD);
  const meanObliq = 23 + (26 + (21.448 - jc * (46.815 + jc * (0.00059 - jc * 0.001813))) / 60) / 60;
  const obliq = meanObliq + 0.00256 * Math.cos(omega * RAD);
  const declination = Math.asin(Math.sin(obliq * RAD) * Math.sin(appLong * RAD));

  const y = Math.tan((obliq / 2) * RAD) ** 2;
  const eqTime =
    4 *
    DEG *
    (y * Math.sin(2 * l0 * RAD) -
      2 * e * Math.sin(m * RAD) +
      4 * e * y * Math.sin(m * RAD) * Math.cos(2 * l0 * RAD) -
      0.5 * y * y * Math.sin(4 * l0 * RAD) -
      1.25 * e * e * Math.sin(2 * m * RAD));

  return { declination, eqTime };
}

export function sunPosition(date: Date, lat: number, lon: number): SunPosition {
  const { declination, eqTime } = terms(date);
  const minutes = date.getUTCHours() * 60 + date.getUTCMinutes() + date.getUTCSeconds() / 60;
  const trueSolar = (((minutes + eqTime + 4 * lon) % 1440) + 1440) % 1440;
  let hourAngle = trueSolar / 4 - 180;
  if (hourAngle < -180) hourAngle += 360;

  const latR = lat * RAD;
  const cosZen =
    Math.sin(latR) * Math.sin(declination) + Math.cos(latR) * Math.cos(declination) * Math.cos(hourAngle * RAD);
  const zenith = Math.acos(Math.min(1, Math.max(-1, cosZen)));
  const altitude = 90 - zenith * DEG;

  const azDen = Math.cos(latR) * Math.sin(zenith);
  let azimuth = 180;
  if (Math.abs(azDen) > 1e-6) {
    const cosAz = (Math.sin(latR) * Math.cos(zenith) - Math.sin(declination)) / azDen;
    const a = Math.acos(Math.min(1, Math.max(-1, cosAz))) * DEG;
    azimuth = hourAngle > 0 ? (a + 180) % 360 : (540 - a) % 360;
  }
  return { altitude, azimuth };
}

/** Sunrise and sunset for the calendar day containing `date`, as Dates (or null in polar day/night). */
export function sunTimes(date: Date, lat: number, lon: number): { rise: Date | null; set: Date | null } {
  const noonUtc = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 12));
  const { declination, eqTime } = terms(noonUtc);
  const latR = lat * RAD;
  const cosHa =
    Math.cos(90.833 * RAD) / (Math.cos(latR) * Math.cos(declination)) - Math.tan(latR) * Math.tan(declination);
  if (cosHa > 1 || cosHa < -1) return { rise: null, set: null };
  const ha = Math.acos(cosHa) * DEG;
  const solarNoon = 720 - 4 * lon - eqTime; // minutes after 00:00 UTC
  const dayStart = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return {
    rise: new Date(dayStart + (solarNoon - ha * 4) * 60000),
    set: new Date(dayStart + (solarNoon + ha * 4) * 60000),
  };
}

/**
 * A Date for a given wall-clock minute of "today" in a fixed-offset time zone.
 * IST has no daylight saving, so a constant offset is exact.
 */
export function dateAtLocalMinute(minuteOfDay: number, offsetMinutes: number, ref = new Date()): Date {
  const local = new Date(ref.getTime() + offsetMinutes * 60000);
  const midnightLocalAsUtc = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate());
  return new Date(midnightLocalAsUtc + (minuteOfDay - offsetMinutes) * 60000);
}

export function localMinuteOf(date: Date, offsetMinutes: number): number {
  const local = new Date(date.getTime() + offsetMinutes * 60000);
  return local.getUTCHours() * 60 + local.getUTCMinutes();
}
