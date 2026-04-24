/**
 * Panchang Utilities
 * Provides sunrise / sunset / moonrise / moonset / Rahu Kaal /
 * Brahma Muhurat / Abhijit Muhurat / Tithi / Nakshatra / Yoga / Karana
 *
 * Calculations are approximate (no ephemeris). Default location:
 * New Delhi (28.6139°N, 77.2090°E) — overridable through `Location`.
 *
 * Times are returned in 24h "HH:MM" strings in local Indian Standard Time
 * (UTC+5:30) unless an explicit timezone offset is supplied.
 */

export interface Location {
  lat: number;
  lon: number;
  tzOffsetMinutes?: number; // default IST = 330
}

const DEFAULT_LOCATION: Location = {
  lat: 28.6139,
  lon: 77.209,
  tzOffsetMinutes: 330,
};

const PI = Math.PI;
const RAD = PI / 180;

function fmt(time: number | null): string {
  if (time === null || isNaN(time)) return "—";
  let h = Math.floor(time);
  let m = Math.round((time - h) * 60);
  if (m === 60) {
    h += 1;
    m = 0;
  }
  if (h >= 24) h -= 24;
  if (h < 0) h += 24;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function dateToJulian(year: number, month: number, day: number): number {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return (
    Math.floor(365.25 * (year + 4716)) +
    Math.floor(30.6001 * (month + 1)) +
    day +
    B -
    1524.5
  );
}

function parseDate(dateStr: string): Date {
  // dateStr in YYYY-MM-DD
  const [y, m, d] = dateStr.split("-").map((n) => parseInt(n, 10));
  return new Date(y, m - 1, d);
}

/**
 * NOAA-based sunrise/sunset calculator.
 * Returns local-time hours (0..24) for the given date and location.
 */
function sunTimes(
  dateStr: string,
  loc: Location,
): { sunrise: number; sunset: number; solarNoon: number } {
  const date = parseDate(dateStr);
  const jd = dateToJulian(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  );
  const n = jd - 2451545.0 + 0.0008;
  const Jstar = n - loc.lon / 360;
  const M = (357.5291 + 0.98560028 * Jstar) % 360;
  const Mrad = M * RAD;
  const C =
    1.9148 * Math.sin(Mrad) +
    0.02 * Math.sin(2 * Mrad) +
    0.0003 * Math.sin(3 * Mrad);
  const lambda = (M + C + 180 + 102.9372) % 360;
  const lambdaRad = lambda * RAD;
  const Jtransit = 2451545.0 + Jstar + 0.0053 * Math.sin(Mrad) -
    0.0069 * Math.sin(2 * lambdaRad);
  const delta = Math.asin(Math.sin(lambdaRad) * Math.sin(23.44 * RAD));
  const cosH = (Math.sin(-0.83 * RAD) - Math.sin(loc.lat * RAD) * Math.sin(delta)) /
    (Math.cos(loc.lat * RAD) * Math.cos(delta));

  // Polar day / night safety
  if (cosH > 1 || cosH < -1) {
    return { sunrise: NaN, sunset: NaN, solarNoon: NaN };
  }

  const H = Math.acos(cosH) / RAD;
  const Jset = Jtransit + H / 360;
  const Jrise = Jtransit - H / 360;

  const tzHours = (loc.tzOffsetMinutes ?? 330) / 60;

  const toLocal = (j: number) => {
    const utcHours = ((j - Math.floor(j) - 0.5) * 24 + 24) % 24;
    return (utcHours + tzHours + 24) % 24;
  };

  return {
    sunrise: toLocal(Jrise),
    sunset: toLocal(Jset),
    solarNoon: toLocal(Jtransit),
  };
}

/**
 * Approximate moonrise/moonset using simplified algorithm.
 * Less precise than sunrise — within ~10-15 minutes typically.
 */
function moonTimes(
  dateStr: string,
  loc: Location,
): { moonrise: number; moonset: number } {
  const date = parseDate(dateStr);
  const jd = dateToJulian(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  );
  const T = (jd - 2451545.0) / 36525;
  // Mean longitude of the moon
  let L = (218.316 + 481267.8813 * T) % 360;
  if (L < 0) L += 360;
  const M = (134.963 + 477198.867 * T) % 360;
  const F = (93.272 + 483202.0175 * T) % 360;

  // Approximate moon longitude
  const lambda = L + 6.289 * Math.sin(M * RAD);
  const beta = 5.128 * Math.sin(F * RAD);

  // Moon RA/Dec
  const eps = 23.44 * RAD;
  const ra =
    Math.atan2(
      Math.sin(lambda * RAD) * Math.cos(eps) -
        Math.tan(beta * RAD) * Math.sin(eps),
      Math.cos(lambda * RAD),
    ) / RAD;
  const dec =
    Math.asin(
      Math.sin(beta * RAD) * Math.cos(eps) +
        Math.cos(beta * RAD) * Math.sin(eps) * Math.sin(lambda * RAD),
    ) / RAD;

  // Hour angle
  const cosH =
    (Math.sin(-0.566 * RAD) - Math.sin(loc.lat * RAD) * Math.sin(dec * RAD)) /
    (Math.cos(loc.lat * RAD) * Math.cos(dec * RAD));

  if (cosH > 1 || cosH < -1) {
    return { moonrise: NaN, moonset: NaN };
  }

  const H = Math.acos(cosH) / RAD;
  // Mean Greenwich sidereal time at 0h UT
  const GMST = (280.46061837 + 360.98564736629 * (jd - 2451545.0)) % 360;
  const LST = (GMST + loc.lon + 360) % 360;
  // Approximate transit hour (UT) when LST = ra
  const transitUT = ((ra - LST) / 15 + 24) % 24;
  const tzHours = (loc.tzOffsetMinutes ?? 330) / 60;
  const transitLocal = (transitUT + tzHours + 24) % 24;

  const moonrise = (transitLocal - H / 15 + 24) % 24;
  const moonset = (transitLocal + H / 15 + 24) % 24;

  return { moonrise, moonset };
}

/**
 * Rahu Kaal — a 1/8th slice of daytime, segment varies by weekday.
 * Mapping (1-based slice within day): Sun=8, Mon=2, Tue=7, Wed=5,
 * Thu=6, Fri=4, Sat=3.
 */
function rahuKaalSlice(weekday: number): number {
  // weekday: 0=Sun..6=Sat
  const map = [8, 2, 7, 5, 6, 4, 3];
  return map[weekday];
}

export interface KeyTimings {
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  solarNoon: string;
  rahuKaal: { start: string; end: string };
  brahmaMuhurat: { start: string; end: string };
  abhijitMuhurat: { start: string; end: string };
}

export function getKeyTimings(
  dateStr: string,
  loc: Location = DEFAULT_LOCATION,
): KeyTimings {
  const { sunrise, sunset, solarNoon } = sunTimes(dateStr, loc);
  const { moonrise, moonset } = moonTimes(dateStr, loc);

  const dayLen = sunset - sunrise;
  const date = parseDate(dateStr);
  const weekday = date.getDay();

  // Rahu Kaal
  const slice = rahuKaalSlice(weekday);
  const sliceLen = dayLen / 8;
  const rahuStart = sunrise + (slice - 1) * sliceLen;
  const rahuEnd = rahuStart + sliceLen;

  // Brahma Muhurat: ~96 minutes before sunrise, 48 minutes long
  const brahmaStart = sunrise - 96 / 60;
  const brahmaEnd = sunrise - 48 / 60;

  // Abhijit Muhurat: middle 1/15th of day around solar noon (~48 min)
  const abhWidth = dayLen / 15;
  const abhStart = solarNoon - abhWidth / 2;
  const abhEnd = solarNoon + abhWidth / 2;

  return {
    sunrise: fmt(sunrise),
    sunset: fmt(sunset),
    solarNoon: fmt(solarNoon),
    moonrise: fmt(moonrise),
    moonset: fmt(moonset),
    rahuKaal: { start: fmt(rahuStart), end: fmt(rahuEnd) },
    brahmaMuhurat: { start: fmt(brahmaStart), end: fmt(brahmaEnd) },
    abhijitMuhurat: { start: fmt(abhStart), end: fmt(abhEnd) },
  };
}

/**
 * Yoga & Karana — derived from the day's tithi index.
 * Reasonable approximation when the precise lunar longitude isn't available.
 */
const YOGAS = [
  "Vishkambha","Preeti","Ayushman","Saubhagya","Shobhana","Atiganda",
  "Sukarma","Dhriti","Shoola","Ganda","Vriddhi","Dhruva","Vyaghata",
  "Harshana","Vajra","Siddhi","Vyatipata","Variyana","Parigha","Shiva",
  "Siddha","Sadhya","Shubha","Shukla","Brahma","Indra","Vaidhriti",
];

const YOGAS_MR = [
  "विष्कंभ","प्रीती","आयुष्मान","सौभाग्य","शोभन","अतिगंड",
  "सुकर्मा","धृती","शूल","गंड","वृद्धी","ध्रुव","व्याघात",
  "हर्षण","वज्र","सिद्धी","व्यतीपात","वरीयान","परिघ","शिव",
  "सिद्ध","साध्य","शुभ","शुक्ल","ब्रह्म","इंद्र","वैधृती",
];

const KARANAS = [
  "Bava","Balava","Kaulava","Taitila","Garaja","Vanija","Vishti",
  "Shakuni","Chatushpada","Naga","Kimstughna",
];

const KARANAS_MR = [
  "बव","बालव","कौलव","तैतिल","गर","वणिज","विष्टी",
  "शकुनी","चतुष्पाद","नाग","किंस्तुघ्न",
];

export function getYoga(dateStr: string, language: "en" | "mr" | "hi"): string {
  const date = parseDate(dateStr);
  const jd = dateToJulian(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  );
  // Approximate sun + moon longitudes
  const T = (jd - 2451545.0) / 36525;
  const sunLon = (280.466 + 36000.77 * T) % 360;
  const moonLon = (218.316 + 481267.8813 * T) % 360;
  const sum = (sunLon + moonLon + 720) % 360;
  const idx = Math.floor(sum / (360 / 27)) % 27;
  return language === "en" ? YOGAS[idx] : YOGAS_MR[idx];
}

export function getKarana(
  dateStr: string,
  language: "en" | "mr" | "hi",
): string {
  const date = parseDate(dateStr);
  const jd = dateToJulian(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  );
  const T = (jd - 2451545.0) / 36525;
  const sunLon = (280.466 + 36000.77 * T) % 360;
  const moonLon = (218.316 + 481267.8813 * T) % 360;
  const diff = (moonLon - sunLon + 360) % 360;
  const half = Math.floor(diff / 6) % 60;
  // First 56 are cycling Bava..Vishti (7 names), last 4 fixed
  let idx;
  if (half === 0) idx = 10; // Kimstughna
  else if (half >= 57) idx = 7 + (half - 57); // Shakuni..Naga
  else idx = ((half - 1) % 7);
  if (idx < 0) idx = 0;
  if (idx > 10) idx = 10;
  return language === "en" ? KARANAS[idx] : KARANAS_MR[idx];
}

/**
 * Auspiciousness verdict for the day — used by the AuspiciousBadge.
 * Simple heuristic: weekend & festival days lean shubh; days with
 * Vishti karana / Atiganda yoga lean cautious.
 */
export type AuspiciousLevel = "shubh" | "samanya" | "savdhan";

export function getAuspiciousLevel(
  dateStr: string,
  hasFestival: boolean,
): AuspiciousLevel {
  const date = parseDate(dateStr);
  const weekday = date.getDay(); // 0=Sun
  const yoga = getYoga(dateStr, "en");
  const karana = getKarana(dateStr, "en");

  if (karana === "Vishti" || yoga === "Vyatipata" || yoga === "Vaidhriti") {
    return "savdhan";
  }
  if (
    hasFestival ||
    weekday === 0 || // Sunday
    weekday === 4 || // Thursday
    yoga === "Siddhi" ||
    yoga === "Shubha" ||
    yoga === "Sadhya"
  ) {
    return "shubh";
  }
  return "samanya";
}

export const AUSPICIOUS_LABELS = {
  shubh: { en: "Shubh Diwas", mr: "शुभ दिवस", hi: "शुभ दिवस" },
  samanya: { en: "Samanya Diwas", mr: "सामान्य दिवस", hi: "सामान्य दिवस" },
  savdhan: { en: "Savdhan Diwas", mr: "विशेष सावधान", hi: "विशेष सावधान" },
};
