/**
 * Festival and calendar data for WhatsToday app.
 * Based on Indian calendar (Kalnirnay-inspired) for 2025-2026.
 * Each entry contains date, festival info, tithi, nakshatra, and vaar.
 */

export interface CalendarDay {
  date: string; // YYYY-MM-DD
  tithi: string;
  tithiMr: string; // Marathi
  nakshatra: string;
  nakshtraMr: string; // Marathi
  vaar: string; // Day in English
  vaarMr: string; // Day in Marathi
  festival?: string;
  festivalMr?: string;
  festivalType?: "major" | "minor" | "holiday";
  quote: string;
  quoteMr: string;
  paksha: "Shukla" | "Krishna";
  pakshaMr: "शुक्ल" | "कृष्ण";
}

const motivationalQuotes: { en: string; mr: string }[] = [
  {
    en: "Every day is a new beginning. Take a deep breath and start again.",
    mr: "प्रत्येक दिवस नवीन सुरुवात आहे. दीर्घ श्वास घ्या आणि पुन्हा सुरू करा.",
  },
  {
    en: "The sun rises every day, and so does the opportunity to make it great.",
    mr: "सूर्य दररोज उगवतो, आणि त्याबरोबरच एक महान दिवस घडवण्याची संधीही येते.",
  },
  {
    en: "Life is a celebration. Make every moment count.",
    mr: "जीवन एक उत्सव आहे. प्रत्येक क्षण अर्थपूर्ण करा.",
  },
  {
    en: "Faith moves mountains. Believe in yourself.",
    mr: "श्रद्धा पर्वत हलवते. स्वतःवर विश्वास ठेवा.",
  },
  {
    en: "Gratitude turns what we have into enough.",
    mr: "कृतज्ञता जे आहे त्याला पुरेसे बनवते.",
  },
  {
    en: "A positive mind finds opportunity in every challenge.",
    mr: "सकारात्मक मन प्रत्येक आव्हानात संधी शोधते.",
  },
  {
    en: "The best way to predict the future is to create it.",
    mr: "भविष्याचा अंदाज घेण्याचा सर्वोत्तम मार्ग म्हणजे ते निर्माण करणे.",
  },
];

const getQuote = (index: number) => {
  const q = motivationalQuotes[index % motivationalQuotes.length];
  return { quote: q.en, quoteMr: q.mr };
};

export const calendarData: CalendarDay[] = [
  {
    date: "2025-04-14",
    tithi: "Tritiya",
    tithiMr: "तृतीया",
    nakshatra: "Rohini",
    nakshtraMr: "रोहिणी",
    vaar: "Monday",
    vaarMr: "सोमवार",
    festival: "Gudi Padwa",
    festivalMr: "गुडी पाडवा",
    festivalType: "major",
    paksha: "Shukla",
    pakshaMr: "शुक्ल",
    ...getQuote(0),
  },
  {
    date: "2025-04-15",
    tithi: "Chaturthi",
    tithiMr: "चतुर्थी",
    nakshatra: "Mrigashira",
    nakshtraMr: "मृगशीर्ष",
    vaar: "Tuesday",
    vaarMr: "मंगळवार",
    festival: "Ugadi",
    festivalMr: "उगादी",
    festivalType: "major",
    paksha: "Shukla",
    pakshaMr: "शुक्ल",
    ...getQuote(1),
  },
  {
    date: "2025-04-16",
    tithi: "Panchami",
    tithiMr: "पंचमी",
    nakshatra: "Ardra",
    nakshtraMr: "आर्द्रा",
    vaar: "Wednesday",
    vaarMr: "बुधवार",
    paksha: "Shukla",
    pakshaMr: "शुक्ल",
    ...getQuote(2),
  },
  {
    date: "2025-04-17",
    tithi: "Shashthi",
    tithiMr: "षष्ठी",
    nakshatra: "Punarvasu",
    nakshtraMr: "पुनर्वसु",
    vaar: "Thursday",
    vaarMr: "गुरुवार",
    paksha: "Shukla",
    pakshaMr: "शुक्ल",
    ...getQuote(3),
  },
  {
    date: "2025-04-18",
    tithi: "Saptami",
    tithiMr: "सप्तमी",
    nakshatra: "Pushya",
    nakshtraMr: "पुष्य",
    vaar: "Friday",
    vaarMr: "शुक्रवार",
    paksha: "Shukla",
    pakshaMr: "शुक्ल",
    ...getQuote(4),
  },
  {
    date: "2025-04-19",
    tithi: "Ashtami",
    tithiMr: "अष्टमी",
    nakshatra: "Ashlesha",
    nakshtraMr: "आश्लेषा",
    vaar: "Saturday",
    vaarMr: "शनिवार",
    paksha: "Shukla",
    pakshaMr: "शुक्ल",
    ...getQuote(5),
  },
  {
    date: "2025-04-20",
    tithi: "Navami",
    tithiMr: "नवमी",
    nakshatra: "Magha",
    nakshtraMr: "मघा",
    vaar: "Sunday",
    vaarMr: "रविवार",
    festival: "Ram Navami",
    festivalMr: "रामनवमी",
    festivalType: "major",
    paksha: "Shukla",
    pakshaMr: "शुक्ल",
    ...getQuote(6),
  },
  {
    date: "2025-04-21",
    tithi: "Dashami",
    tithiMr: "दशमी",
    nakshatra: "Purva Phalguni",
    nakshtraMr: "पूर्वाफाल्गुनी",
    vaar: "Monday",
    vaarMr: "सोमवार",
    paksha: "Shukla",
    pakshaMr: "शुक्ल",
    ...getQuote(0),
  },
  {
    date: "2025-04-22",
    tithi: "Ekadashi",
    tithiMr: "एकादशी",
    nakshatra: "Uttara Phalguni",
    nakshtraMr: "उत्तराफाल्गुनी",
    vaar: "Tuesday",
    vaarMr: "मंगळवार",
    festival: "Kamada Ekadashi",
    festivalMr: "कामदा एकादशी",
    festivalType: "minor",
    paksha: "Shukla",
    pakshaMr: "शुक्ल",
    ...getQuote(1),
  },
  {
    date: "2025-04-23",
    tithi: "Dwadashi",
    tithiMr: "द्वादशी",
    nakshatra: "Hasta",
    nakshtraMr: "हस्त",
    vaar: "Wednesday",
    vaarMr: "बुधवार",
    paksha: "Shukla",
    pakshaMr: "शुक्ल",
    ...getQuote(2),
  },
  {
    date: "2025-04-24",
    tithi: "Trayodashi",
    tithiMr: "त्रयोदशी",
    nakshatra: "Chitra",
    nakshtraMr: "चित्रा",
    vaar: "Thursday",
    vaarMr: "गुरुवार",
    paksha: "Shukla",
    pakshaMr: "शुक्ल",
    ...getQuote(3),
  },
  {
    date: "2025-04-25",
    tithi: "Chaturdashi",
    tithiMr: "चतुर्दशी",
    nakshatra: "Swati",
    nakshtraMr: "स्वाती",
    vaar: "Friday",
    vaarMr: "शुक्रवार",
    paksha: "Shukla",
    pakshaMr: "शुक्ल",
    ...getQuote(4),
  },
  {
    date: "2025-04-26",
    tithi: "Purnima",
    tithiMr: "पौर्णिमा",
    nakshatra: "Vishakha",
    nakshtraMr: "विशाखा",
    vaar: "Saturday",
    vaarMr: "शनिवार",
    festival: "Hanuman Jayanti",
    festivalMr: "हनुमान जयंती",
    festivalType: "major",
    paksha: "Shukla",
    pakshaMr: "शुक्ल",
    ...getQuote(5),
  },
  {
    date: "2025-05-12",
    tithi: "Tritiya",
    tithiMr: "तृतीया",
    nakshatra: "Rohini",
    nakshtraMr: "रोहिणी",
    vaar: "Monday",
    vaarMr: "सोमवार",
    festival: "Akshaya Tritiya",
    festivalMr: "अक्षय तृतीया",
    festivalType: "major",
    paksha: "Shukla",
    pakshaMr: "शुक्ल",
    ...getQuote(6),
  },
  {
    date: "2025-08-16",
    tithi: "Tritiya",
    tithiMr: "तृतीया",
    nakshatra: "Rohini",
    nakshtraMr: "रोहिणी",
    vaar: "Saturday",
    vaarMr: "शनिवार",
    festival: "Haritalika Teej",
    festivalMr: "हरितालिका तीज",
    festivalType: "major",
    paksha: "Shukla",
    pakshaMr: "शुक्ल",
    ...getQuote(0),
  },
  {
    date: "2025-08-27",
    tithi: "Chaturthi",
    tithiMr: "चतुर्थी",
    nakshatra: "Hasta",
    nakshtraMr: "हस्त",
    vaar: "Wednesday",
    vaarMr: "बुधवार",
    festival: "Ganesh Chaturthi",
    festivalMr: "गणेश चतुर्थी",
    festivalType: "major",
    paksha: "Shukla",
    pakshaMr: "शुक्ल",
    ...getQuote(1),
  },
  {
    date: "2025-10-02",
    tithi: "Dashami",
    tithiMr: "दशमी",
    nakshatra: "Uttara Phalguni",
    nakshtraMr: "उत्तराफाल्गुनी",
    vaar: "Thursday",
    vaarMr: "गुरुवार",
    festival: "Dussehra (Vijaya Dashami)",
    festivalMr: "दसरा (विजया दशमी)",
    festivalType: "major",
    paksha: "Shukla",
    pakshaMr: "शुक्ल",
    ...getQuote(2),
  },
  {
    date: "2025-10-20",
    tithi: "Amavasya",
    tithiMr: "अमावस्या",
    nakshatra: "Swati",
    nakshtraMr: "स्वाती",
    vaar: "Monday",
    vaarMr: "सोमवार",
    festival: "Diwali (Lakshmi Puja)",
    festivalMr: "दिवाळी (लक्ष्मी पूजा)",
    festivalType: "major",
    paksha: "Krishna",
    pakshaMr: "कृष्ण",
    ...getQuote(3),
  },
  {
    date: "2025-11-05",
    tithi: "Chaturthi",
    tithiMr: "चतुर्थी",
    nakshatra: "Mrigashira",
    nakshtraMr: "मृगशीर्ष",
    vaar: "Wednesday",
    vaarMr: "बुधवार",
    festival: "Chhath Puja",
    festivalMr: "छठ पूजा",
    festivalType: "major",
    paksha: "Shukla",
    pakshaMr: "शुक्ल",
    ...getQuote(4),
  },
  {
    date: "2026-04-16",
    tithi: "Panchami",
    tithiMr: "पंचमी",
    nakshatra: "Ardra",
    nakshtraMr: "आर्द्रा",
    vaar: "Thursday",
    vaarMr: "गुरुवार",
    paksha: "Shukla",
    pakshaMr: "शुक्ल",
    ...getQuote(5),
  },
];

/**
 * Get calendar data for a specific date.
 * Returns default data with computed values if no specific entry exists.
 */
export function getCalendarDay(dateString: string): CalendarDay {
  const existing = calendarData.find((d) => d.date === dateString);
  if (existing) return existing;

  // Generate a default entry for dates not in our dataset
  const date = new Date(dateString);
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayNamesMr = ["रविवार", "सोमवार", "मंगळवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"];
  const tithis = ["Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima/Amavasya"];
  const tithisMr = ["प्रतिपदा", "द्वितीया", "तृतीया", "चतुर्थी", "पंचमी", "षष्ठी", "सप्तमी", "अष्टमी", "नवमी", "दशमी", "एकादशी", "द्वादशी", "त्रयोदशी", "चतुर्दशी", "पौर्णिमा/अमावस्या"];
  const nakshatras = ["Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishtha", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"];
  const nakshatrasMr = ["अश्विनी", "भरणी", "कृत्तिका", "रोहिणी", "मृगशीर्ष", "आर्द्रा", "पुनर्वसु", "पुष्य", "आश्लेषा", "मघा", "पूर्वाफाल्गुनी", "उत्तराफाल्गुनी", "हस्त", "चित्रा", "स्वाती", "विशाखा", "अनुराधा", "ज्येष्ठा", "मूल", "पूर्वाषाढा", "उत्तराषाढा", "श्रवण", "धनिष्ठा", "शतभिषा", "पूर्वाभाद्रपदा", "उत्तराभाद्रपदा", "रेवती"];

  const dayOfWeek = date.getDay();
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  const tithiIndex = dayOfYear % 15;
  const nakshatraIndex = dayOfYear % 27;
  const quoteIndex = dayOfYear % motivationalQuotes.length;

  return {
    date: dateString,
    tithi: tithis[tithiIndex],
    tithiMr: tithisMr[tithiIndex],
    nakshatra: nakshatras[nakshatraIndex],
    nakshtraMr: nakshatrasMr[nakshatraIndex],
    vaar: dayNames[dayOfWeek],
    vaarMr: dayNamesMr[dayOfWeek],
    paksha: tithiIndex < 15 ? "Shukla" : "Krishna",
    pakshaMr: tithiIndex < 15 ? "शुक्ल" : "कृष्ण",
    quote: motivationalQuotes[quoteIndex].en,
    quoteMr: motivationalQuotes[quoteIndex].mr,
  };
}

export function getTodayString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDisplayDate(dateString: string, language: "en" | "mr"): string {
  const date = new Date(dateString);
  if (language === "mr") {
    const monthsMr = ["जानेवारी", "फेब्रुवारी", "मार्च", "एप्रिल", "मे", "जून", "जुलै", "ऑगस्ट", "सप्टेंबर", "ऑक्टोबर", "नोव्हेंबर", "डिसेंबर"];
    return `${date.getDate()} ${monthsMr[date.getMonth()]} ${date.getFullYear()}`;
  }
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}
