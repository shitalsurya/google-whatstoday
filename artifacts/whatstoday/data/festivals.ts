/**
 * Festival and calendar data for WhatsToday app.
 * Based on Indian calendar (Kalnirnay-inspired) for 2025-2026.
 */

export interface CalendarDay {
  date: string; // YYYY-MM-DD
  tithi: string;
  tithiMr: string;
  nakshatra: string;
  nakshtraMr: string;
  vaar: string;
  vaarMr: string;
  festival?: string;
  festivalMr?: string;
  festivalType?: "major" | "minor" | "holiday";
  quote: string;
  quoteMr: string;
  paksha: "Shukla" | "Krishna";
  pakshaMr: "शुक्ल" | "कृष्ण";

  // New fields for the detailed today card
  mainEvent?: string;
  mainEventMr?: string;
  mainEventDesc?: string;
  mainEventDescMr?: string;
  indianSignificance?: string[];
  indianSignificanceMr?: string[];
  vrat?: string;
  vratMr?: string;
  globalObservance?: string;
  globalObservanceMr?: string;
  historyFact?: string;
  historyFactMr?: string;
  didYouKnow?: string;
  didYouKnowMr?: string;
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
  {
    en: "Take responsibility and guide someone today with courage.",
    mr: "आज धाडसाने जबाबदारी घ्या आणि कोणाला मार्गदर्शन करा.",
  },
  {
    en: "Small steps taken daily lead to great destinations.",
    mr: "दररोज घेतलेली छोटी पावले मोठ्या ध्येयापर्यंत पोहोचवतात.",
  },
];

const getQuote = (index: number) => {
  const q = motivationalQuotes[index % motivationalQuotes.length];
  return { quote: q.en, quoteMr: q.mr };
};

export const calendarData: CalendarDay[] = [
  // === April 2026 ===
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
    mainEvent: "World Voice Day",
    mainEventMr: "जागतिक आवाज दिन",
    mainEventDesc: "Celebrating the phenomenon of voice and raising awareness about voice disorders.",
    mainEventDescMr: "आवाजाची घटना साजरी करणे आणि आवाजाच्या विकारांबद्दल जागरुकता वाढवणे.",
    indianSignificance: [
      "Indian Railways Day (Commemorating the first train run in 1853).",
      "Tithi • Panchami Shukla Paksha",
    ],
    indianSignificanceMr: [
      "भारतीय रेल्वे दिन (१८५३ मध्ये पहिली गाडी धावली).",
      "तिथी • शुक्ल पक्ष पंचमी",
    ],
    vrat: undefined,
    globalObservance: "World Voice Day",
    globalObservanceMr: "जागतिक आवाज दिन",
    historyFact: "1853: The first passenger train in India ran between Bori Bunder and Thane.",
    historyFactMr: "१८५३: भारतातील पहिली प्रवासी रेल्वे बोरी बंदर ते ठाणे दरम्यान धावली.",
    didYouKnow: "Take responsibility and guide someone today with courage.",
    didYouKnowMr: "आज धाडसाने जबाबदारी घ्या आणि कोणाला मार्गदर्शन करा.",
    ...getQuote(7),
  },
  {
    date: "2026-04-17",
    tithi: "Shashthi",
    tithiMr: "षष्ठी",
    nakshatra: "Punarvasu",
    nakshtraMr: "पुनर्वसु",
    vaar: "Friday",
    vaarMr: "शुक्रवार",
    paksha: "Shukla",
    pakshaMr: "शुक्ल",
    mainEvent: "World Haemophilia Day",
    mainEventMr: "जागतिक हिमोफिलिया दिन",
    mainEventDesc: "Raising awareness about haemophilia and other inherited bleeding disorders.",
    mainEventDescMr: "हिमोफिलिया आणि इतर आनुवंशिक रक्तस्राव विकारांबद्दल जागरुकता वाढवणे.",
    indianSignificance: ["Tithi • Shashthi Shukla Paksha"],
    indianSignificanceMr: ["तिथी • शुक्ल पक्ष षष्ठी"],
    globalObservance: "World Haemophilia Day",
    globalObservanceMr: "जागतिक हिमोफिलिया दिन",
    historyFact: "1524: Vasco da Gama arrived in India for the third time as Viceroy of Portuguese India.",
    historyFactMr: "१५२४: वास्को द गामा तिसऱ्यांदा पोर्तुगीज भारताचे व्हाइसरॉय म्हणून भारतात आले.",
    didYouKnow: "The lotus flower, India's national flower, blooms in muddy water — beauty rising from challenges.",
    didYouKnowMr: "कमळ, भारताचे राष्ट्रीय फूल, चिखलात फुलते — आव्हानांमधून सौंदर्य उदयास येते.",
    ...getQuote(0),
  },
  {
    date: "2026-04-14",
    tithi: "Dwitiya",
    tithiMr: "द्वितीया",
    nakshatra: "Mrigashira",
    nakshtraMr: "मृगशीर्ष",
    vaar: "Tuesday",
    vaarMr: "मंगळवार",
    festival: "Ambedkar Jayanti",
    festivalMr: "आंबेडकर जयंती",
    festivalType: "holiday",
    paksha: "Shukla",
    pakshaMr: "शुक्ल",
    mainEvent: "Ambedkar Jayanti",
    mainEventMr: "आंबेडकर जयंती",
    mainEventDesc: "Birthday of Dr. B.R. Ambedkar, the architect of the Indian Constitution.",
    mainEventDescMr: "डॉ. बाबासाहेब आंबेडकर यांची जयंती — भारतीय राज्यघटनेचे शिल्पकार.",
    indianSignificance: ["Ambedkar Jayanti — Public Holiday", "Tithi • Dwitiya Shukla Paksha"],
    indianSignificanceMr: ["आंबेडकर जयंती — सार्वजनिक सुट्टी", "तिथी • शुक्ल पक्ष द्वितीया"],
    globalObservance: "International Day of Reflection on the 1994 Genocide in Rwanda",
    globalObservanceMr: "रवांडा नरसंहाराचे स्मरण दिन",
    historyFact: "1891: Dr. B.R. Ambedkar was born in Mhow, Central Provinces (now Madhya Pradesh).",
    historyFactMr: "१८९१: डॉ. बाबासाहेब आंबेडकर यांचा जन्म म्हो, मध्य प्रांत (आता मध्य प्रदेश) येथे झाला.",
    didYouKnow: "Dr. Ambedkar held 32 degrees and could speak 9 languages fluently.",
    didYouKnowMr: "डॉ. आंबेडकरांकडे ३२ पदव्या होत्या आणि ते ९ भाषा अस्खलितपणे बोलत असत.",
    ...getQuote(2),
  },
  // === 2025 festivals ===
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
    mainEvent: "Gudi Padwa",
    mainEventMr: "गुडी पाडवा",
    mainEventDesc: "Maharashtrian New Year — celebrated with a decorated Gudi hoisted outside homes.",
    mainEventDescMr: "महाराष्ट्रीय नवीन वर्ष — घराबाहेर सजवलेली गुडी उभारून साजरे केले जाते.",
    indianSignificance: ["Marathi New Year (Gudi Padwa)", "Tithi • Tritiya Shukla Paksha", "Vrat • Ugadi"],
    indianSignificanceMr: ["मराठी नवीन वर्ष (गुडी पाडवा)", "तिथी • शुक्ल पक्ष तृतीया", "व्रत • उगादी"],
    vrat: "Gudi Padwa Vrat",
    vratMr: "गुडी पाडवा व्रत",
    globalObservance: "World Parkinson's Day",
    globalObservanceMr: "जागतिक पार्किन्सन दिन",
    historyFact: "1699: Guru Gobind Singh founded the Khalsa Panth on this day.",
    historyFactMr: "१६९९: गुरू गोबिंद सिंग यांनी खालसा पंथाची स्थापना केली.",
    didYouKnow: "The Gudi symbolizes victory, prosperity, and the triumph of good over evil.",
    didYouKnowMr: "गुडी विजय, समृद्धी आणि चांगल्याचा वाईटावरील विजयाचे प्रतीक आहे.",
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
    mainEvent: "Ugadi",
    mainEventMr: "उगादी",
    mainEventDesc: "Telugu and Kannada New Year — marked with Bevu-Bella (neem and jaggery).",
    mainEventDescMr: "तेलुगु आणि कन्नड नवीन वर्ष — बेवू-बेळ्ळा (कडुनिंब आणि गूळ) सह साजरे.",
    indianSignificance: ["Ugadi — Telugu/Kannada New Year", "Tithi • Chaturthi Shukla Paksha"],
    indianSignificanceMr: ["उगादी — तेलुगु/कन्नड नवीन वर्ष", "तिथी • शुक्ल पक्ष चतुर्थी"],
    globalObservance: "World Art Day",
    globalObservanceMr: "जागतिक कला दिन",
    historyFact: "1892: The Indian National Congress held its first session in Bombay.",
    historyFactMr: "१८९२: भारतीय राष्ट्रीय काँग्रेसचे मुंबईत पहिले अधिवेशन झाले.",
    didYouKnow: "Bevu-Bella in Ugadi represents life's mixture of bitterness and sweetness.",
    didYouKnowMr: "उगादीतील बेवू-बेळ्ळा जीवनातील कडूगोड मिश्रणाचे प्रतीक आहे.",
    ...getQuote(1),
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
    mainEvent: "Ram Navami",
    mainEventMr: "रामनवमी",
    mainEventDesc: "Birthday of Lord Rama — the seventh avatar of Vishnu, celebrated with prayers and fasting.",
    mainEventDescMr: "भगवान रामाची जयंती — विष्णूचा सातवा अवतार — प्रार्थना आणि उपवासाने साजरे.",
    indianSignificance: ["Ram Navami — Rama's Birthday", "Tithi • Navami Shukla Paksha"],
    indianSignificanceMr: ["रामनवमी — श्रीरामाची जयंती", "तिथी • शुक्ल पक्ष नवमी"],
    vrat: "Ram Navami Vrat",
    vratMr: "रामनवमी व्रत",
    globalObservance: "UN Chinese Language Day",
    globalObservanceMr: "संयुक्त राष्ट्र चीनी भाषा दिन",
    historyFact: "1303: Alauddin Khalji conquered Chittor Fort after a long siege.",
    historyFactMr: "१३०३: अलाउद्दीन खिलजीने दीर्घ वेढ्यानंतर चित्तोड किल्ला जिंकला.",
    didYouKnow: "The Ramayana has over 300 different versions across Asia.",
    didYouKnowMr: "रामायणाच्या आशियाभर ३०० हून अधिक वेगळ्या आवृत्त्या आहेत.",
    ...getQuote(6),
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
    mainEvent: "Kamada Ekadashi",
    mainEventMr: "कामदा एकादशी",
    mainEventDesc: "A sacred Ekadashi fast that fulfils all desires and removes sins.",
    mainEventDescMr: "एक पवित्र एकादशी उपवास जो सर्व इच्छा पूर्ण करतो आणि पाप नष्ट करतो.",
    indianSignificance: ["Kamada Ekadashi Vrat", "Tithi • Ekadashi Shukla Paksha"],
    indianSignificanceMr: ["कामदा एकादशी व्रत", "तिथी • शुक्ल पक्ष एकादशी"],
    vrat: "Kamada Ekadashi",
    vratMr: "कामदा एकादशी",
    globalObservance: "Earth Day",
    globalObservanceMr: "पृथ्वी दिन",
    historyFact: "1970: The first Earth Day was celebrated worldwide.",
    historyFactMr: "१९७०: पहिला पृथ्वी दिन जगभर साजरा झाला.",
    didYouKnow: "Ekadashi fasting is observed twice a month on the 11th day of each lunar fortnight.",
    didYouKnowMr: "एकादशी उपवास दर महिन्यात दोनदा, प्रत्येक चंद्र पक्षाच्या ११व्या दिवशी केला जातो.",
    ...getQuote(1),
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
    mainEvent: "Hanuman Jayanti",
    mainEventMr: "हनुमान जयंती",
    mainEventDesc: "Birthday of Lord Hanuman — the symbol of devotion, strength, and service.",
    mainEventDescMr: "हनुमानाची जयंती — भक्ती, शक्ती आणि सेवेचे प्रतीक.",
    indianSignificance: ["Hanuman Jayanti", "Purnima (Full Moon)", "Tithi • Purnima Shukla Paksha"],
    indianSignificanceMr: ["हनुमान जयंती", "पौर्णिमा (पूर्ण चंद्र)", "तिथी • शुक्ल पक्ष पौर्णिमा"],
    globalObservance: "World Intellectual Property Day",
    globalObservanceMr: "जागतिक बौद्धिक संपदा दिन",
    historyFact: "1986: The Chernobyl nuclear disaster occurred in Soviet Ukraine.",
    historyFactMr: "१९८६: सोव्हिएत युक्रेनमध्ये चेर्नोबिल अण्वस्त्र दुर्घटना घडली.",
    didYouKnow: "Hanuman Chalisa, written by Tulsidas, has 40 verses and is one of the most recited texts in India.",
    didYouKnowMr: "तुलसीदासांनी लिहिलेल्या हनुमान चालीसात ४० श्लोक आहेत — भारतातील सर्वाधिक पठित ग्रंथांपैकी एक.",
    ...getQuote(5),
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
    mainEvent: "Ganesh Chaturthi",
    mainEventMr: "गणेश चतुर्थी",
    mainEventDesc: "The grand 10-day festival celebrating the birth of Lord Ganesha, the remover of obstacles.",
    mainEventDescMr: "भगवान गणेशाच्या जन्माचा भव्य १०-दिवसीय उत्सव — विघ्नहर्त्याचा सण.",
    indianSignificance: ["Ganesh Chaturthi begins", "Tithi • Chaturthi Shukla Paksha"],
    indianSignificanceMr: ["गणेश चतुर्थी सुरू", "तिथी • शुक्ल पक्ष चतुर्थी"],
    vrat: "Ganesh Chaturthi Vrat",
    vratMr: "गणेश चतुर्थी व्रत",
    globalObservance: "Silent Day (Bhutan)",
    globalObservanceMr: "शांत दिन (भूतान)",
    historyFact: "1893: Lokmanya Bal Gangadhar Tilak started the public Ganesh Chaturthi festival.",
    historyFactMr: "१८९३: लोकमान्य बाळ गंगाधर टिळक यांनी सार्वजनिक गणेशोत्सव सुरू केला.",
    didYouKnow: "Ganeshotsav was started by Tilak to bring communities together during the freedom struggle.",
    didYouKnowMr: "टिळकांनी स्वातंत्र्यसंग्रामात समाजाला एकत्र आणण्यासाठी गणेशोत्सव सुरू केला.",
    ...getQuote(1),
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
    mainEvent: "Diwali — Lakshmi Puja",
    mainEventMr: "दिवाळी — लक्ष्मी पूजा",
    mainEventDesc: "The festival of lights — celebrating the victory of light over darkness.",
    mainEventDescMr: "दिव्यांचा सण — प्रकाशाचा अंधारावर विजय साजरा करण्याचा उत्सव.",
    indianSignificance: ["Diwali — Lakshmi Puja (Main Day)", "Amavasya — New Moon Night", "Tithi • Amavasya Krishna Paksha"],
    indianSignificanceMr: ["दिवाळी — लक्ष्मी पूजा (मुख्य दिवस)", "अमावस्या — नवीन चंद्र रात्र", "तिथी • कृष्ण पक्ष अमावस्या"],
    vrat: "Lakshmi Puja Vrat",
    vratMr: "लक्ष्मी पूजा व्रत",
    globalObservance: "Diwali — observed worldwide",
    globalObservanceMr: "दिवाळी — जगभर साजरी",
    historyFact: "1947: Lord Mountbatten and Nehru lit the first official Independence Day lamp.",
    historyFactMr: "१९४७: लॉर्ड माउंटबॅटन आणि नेहरूंनी पहिला अधिकृत स्वातंत्र्य दिनाचा दिवा प्रज्वलित केला.",
    didYouKnow: "India uses about 50,000 tonnes of firecrackers during Diwali season.",
    didYouKnowMr: "दिवाळीच्या हंगामात भारत सुमारे ५०,००० टन फटाके वापरतो.",
    ...getQuote(3),
  },
];

/**
 * Get calendar data for a specific date.
 * Returns default generated data if no specific entry exists.
 */
export function getCalendarDay(dateString: string): CalendarDay {
  const existing = calendarData.find((d) => d.date === dateString);
  if (existing) return existing;

  const date = new Date(dateString);
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayNamesMr = ["रविवार", "सोमवार", "मंगळवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"];
  const tithis = ["Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima"];
  const tithisMr = ["प्रतिपदा", "द्वितीया", "तृतीया", "चतुर्थी", "पंचमी", "षष्ठी", "सप्तमी", "अष्टमी", "नवमी", "दशमी", "एकादशी", "द्वादशी", "त्रयोदशी", "चतुर्दशी", "पौर्णिमा"];
  const nakshatras = ["Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishtha", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"];
  const nakshatrasMr = ["अश्विनी", "भरणी", "कृत्तिका", "रोहिणी", "मृगशीर्ष", "आर्द्रा", "पुनर्वसु", "पुष्य", "आश्लेषा", "मघा", "पूर्वाफाल्गुनी", "उत्तराफाल्गुनी", "हस्त", "चित्रा", "स्वाती", "विशाखा", "अनुराधा", "ज्येष्ठा", "मूल", "पूर्वाषाढा", "उत्तराषाढा", "श्रवण", "धनिष्ठा", "शतभिषा", "पूर्वाभाद्रपदा", "उत्तराभाद्रपदा", "रेवती"];

  const didYouKnowFacts = [
    { en: "India is the world's largest democracy with over 900 million voters.", mr: "भारत जगातील सर्वात मोठी लोकशाही आहे — ९०० दशलक्षाहून अधिक मतदार." },
    { en: "Chess was invented in India around the 6th century AD.", mr: "बुद्धिबळाचा शोध भारतात सुमारे सहाव्या शतकात लागला." },
    { en: "India has the world's largest number of post offices.", mr: "भारतात जगातील सर्वाधिक टपाल कार्यालये आहेत." },
    { en: "The game of Snakes and Ladders originated in ancient India.", mr: "सापशिडीचा खेळ प्राचीन भारतात उत्पन्न झाला." },
    { en: "Yoga has been practiced in India for over 5,000 years.", mr: "योगाचा सराव भारतात ५,००० वर्षांहून अधिक काळापासून केला जातो." },
    { en: "India is the birthplace of the decimal system and zero.", mr: "भारत दशांश प्रणाली आणि शून्याचे जन्मस्थान आहे." },
    { en: "Sanskrit is considered the mother of all European languages.", mr: "संस्कृतला सर्व युरोपियन भाषांची जननी मानले जाते." },
  ];

  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  const tithiIndex = dayOfYear % 15;
  const nakshatraIndex = dayOfYear % 27;
  const quoteIndex = dayOfYear % motivationalQuotes.length;
  const factIndex = dayOfYear % didYouKnowFacts.length;

  const dayOfWeek = date.getDay();
  const fact = didYouKnowFacts[factIndex];

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
    indianSignificance: [`Tithi • ${tithis[tithiIndex]} ${tithiIndex < 15 ? "Shukla" : "Krishna"} Paksha`],
    indianSignificanceMr: [`तिथी • ${tithiIndex < 15 ? "शुक्ल" : "कृष्ण"} पक्ष ${tithisMr[tithiIndex]}`],
    didYouKnow: fact.en,
    didYouKnowMr: fact.mr,
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
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
