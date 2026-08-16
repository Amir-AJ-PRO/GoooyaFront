export interface City {
  id: string;
  name: string;
  coordinates: [number, number]; // [latitude, longitude]
}

export interface Province {
  id: string;
  name: string;
  coordinates: [number, number]; // [latitude, longitude]
  cities: City[];
}

export const iranProvinces: Province[] = [
  {
    id: "tehran",
    name: "تهران",
    coordinates: [35.6892, 51.3890],
    cities: [
      { id: "tehran-city", name: "تهران", coordinates: [35.6892, 51.3890] },
      { id: "karaj", name: "کرج", coordinates: [35.8327, 50.9916] },
      { id: "eslamshahr", name: "اسلامشهر", coordinates: [35.5446, 51.2302] },
      { id: "rey", name: "ری", coordinates: [35.5936, 51.4400] },
      { id: "varamin", name: "ورامین", coordinates: [35.3252, 51.6472] },
      { id: "shahriar", name: "شهریار", coordinates: [35.6589, 51.0578] },
      { id: "malard", name: "ملارد", coordinates: [35.6658, 50.9767] },
      { id: "robat-karim", name: "رباط کریم", coordinates: [35.4847, 51.0828] },
      { id: "baharestan", name: "بهارستان", coordinates: [35.5300, 51.1800] },
      { id: "pakdasht", name: "پاکدشت", coordinates: [35.4817, 51.6783] },
      { id: "damavand", name: "دماوند", coordinates: [35.7177, 52.0695] },
      { id: "roudehen", name: "رودهن", coordinates: [35.7340, 51.9060] },
      { id: "pardis", name: "پردیس", coordinates: [35.7460, 51.8070] },
      { id: "absard", name: "آبسرد", coordinates: [35.6200, 52.1530] },
      { id: "abali", name: "آبعلی", coordinates: [35.7670, 51.9630] },
      { id: "kilan", name: "کیلان", coordinates: [35.5530, 52.1680] },
      { id: "gilavand", name: "گیلاوند", coordinates: [35.5890, 52.0460] },
    ]
  },
  {
    id: "isfahan",
    name: "اصفهان",
    coordinates: [32.6546, 51.6680],
    cities: [
      { id: "isfahan-city", name: "اصفهان", coordinates: [32.6546, 51.6680] },
      { id: "kashan", name: "کاشان", coordinates: [33.9850, 51.4100] },
      { id: "najafabad", name: "نجف آباد", coordinates: [32.6344, 51.3667] },
      { id: "khomeini-shahr", name: "خمینی شهر", coordinates: [32.7000, 51.5167] },
      { id: "shahin-shahr", name: "شاهین شهر", coordinates: [32.8667, 51.5500] },
      { id: "mobarakeh", name: "مبارکه", coordinates: [32.3500, 51.5000] },
      { id: "falavarjan", name: "فلاورجان", coordinates: [32.5500, 51.5167] },
      { id: "lenjan", name: "لنجان", coordinates: [32.4667, 51.4500] },
    ]
  },
  {
    id: "fars",
    name: "فارس",
    coordinates: [29.5918, 52.5837],
    cities: [
      { id: "shiraz", name: "شیراز", coordinates: [29.5918, 52.5837] },
      { id: "kazerun", name: "کازرون", coordinates: [29.6167, 51.6500] },
      { id: "marvdasht", name: "مرودشت", coordinates: [29.8667, 52.8000] },
      { id: "jahrom", name: "جهرم", coordinates: [28.5000, 53.5500] },
      { id: "fasa", name: "فسا", coordinates: [28.9333, 53.6500] },
      { id: "darab", name: "داراب", coordinates: [28.7500, 54.5500] },
      { id: "larestan", name: "لارستان", coordinates: [27.6833, 54.3333] },
      { id: "lamerd", name: "لامرد", coordinates: [27.3333, 53.1833] },
    ]
  },
  {
    id: "khorasan-razavi",
    name: "خراسان رضوی",
    coordinates: [36.2605, 59.6168],
    cities: [
      { id: "mashhad", name: "مشهد", coordinates: [36.2605, 59.6168] },
      { id: "nishapur", name: "نیشابور", coordinates: [36.2133, 58.7958] },
      { id: "sabzevar", name: "سبزوار", coordinates: [36.2167, 57.6833] },
      { id: "kashmar", name: "کاشمر", coordinates: [35.2383, 58.4656] },
      { id: "torbat-heydariyeh", name: "تربت حیدریه", coordinates: [35.2739, 59.2194] },
      { id: "taybad", name: "تایباد", coordinates: [34.7400, 60.7756] },
      { id: "gonabad", name: "گناباد", coordinates: [34.3528, 58.6836] },
      { id: "khorasan", name: "خراسان", coordinates: [36.2605, 59.6168] },
    ]
  },
  {
    id: "khorasan-south",
    name: "خراسان جنوبی",
    coordinates: [32.8649, 59.2262],
    cities: [
      { id: "birjand", name: "بیرجند", coordinates: [32.8649, 59.2262] },
      { id: "qaen", name: "قائن", coordinates: [33.7267, 59.1844] },
      { id: "ferdows", name: "فردوس", coordinates: [34.0183, 58.1725] },
      { id: "tabas", name: "طبس", coordinates: [33.5958, 56.9244] },
      { id: "boshruyeh", name: "بشرویه", coordinates: [33.8667, 57.4333] },
    ]
  },
  {
    id: "khorasan-north",
    name: "خراسان شمالی",
    coordinates: [37.4751, 57.3333],
    cities: [
      { id: "bojnurd", name: "بجنورد", coordinates: [37.4751, 57.3333] },
      { id: "shirvan", name: "شیروان", coordinates: [37.4000, 57.9167] },
      { id: "esfarayen", name: "اسفراین", coordinates: [37.0667, 57.5000] },
      { id: "faruj", name: "فاروج", coordinates: [37.2333, 58.2167] },
    ]
  },
  {
    id: "alborz",
    name: "البرز",
    coordinates: [35.9961, 50.6611],
    cities: [
      { id: "karaj-alborz", name: "کرج", coordinates: [35.9961, 50.6611] },
      { id: "nazarabad", name: "نظرآباد", coordinates: [35.9500, 50.6000] },
      { id: "taleqan", name: "طالقان", coordinates: [36.1833, 50.7667] },
      { id: "savojbolagh", name: "ساوجبلاغ", coordinates: [35.8500, 50.7000] },
    ]
  },
  {
    id: "qom",
    name: "قم",
    coordinates: [34.6399, 50.8764],
    cities: [
      { id: "qom-city", name: "قم", coordinates: [34.6399, 50.8764] },
      { id: "salafchegan", name: "سلفچگان", coordinates: [34.4667, 50.8000] },
    ]
  },
  {
    id: "markazi",
    name: "مرکزی",
    coordinates: [34.6399, 50.8764],
    cities: [
      { id: "arak", name: "اراک", coordinates: [34.0917, 49.6892] },
      { id: "saveh", name: "ساوه", coordinates: [35.0211, 50.3567] },
      { id: "mahallat", name: "محلات", coordinates: [33.9000, 50.4500] },
      { id: "delijan", name: "دلیجان", coordinates: [33.9833, 50.6833] },
      { id: "tafresh", name: "تفرش", coordinates: [34.6833, 50.0167] },
      { id: "khomein", name: "خمین", coordinates: [33.6500, 50.0833] },
    ]
  },
  {
    id: "hamadan",
    name: "همدان",
    coordinates: [34.7983, 48.5148],
    cities: [
      { id: "hamadan-city", name: "همدان", coordinates: [34.7983, 48.5148] },
      { id: "malayer", name: "ملایر", coordinates: [34.3000, 48.8167] },
      { id: "nahavand", name: "نهاوند", coordinates: [34.1833, 48.3667] },
      { id: "tuyserkan", name: "تویسرکان", coordinates: [34.5500, 48.4500] },
      { id: "kabudarahang", name: "کبودراهنگ", coordinates: [35.2167, 48.7167] },
      { id: "bahar", name: "بهار", coordinates: [34.9000, 48.4333] },
    ]
  },
  {
    id: "kermanshah",
    name: "کرمانشاه",
    coordinates: [34.3142, 47.0650],
    cities: [
      { id: "kermanshah-city", name: "کرمانشاه", coordinates: [34.3142, 47.0650] },
      { id: "eslamabad-gharb", name: "اسلام آباد غرب", coordinates: [34.1167, 46.5167] },
      { id: "kangavar", name: "کنگاور", coordinates: [34.5000, 47.9667] },
      { id: "sahneh", name: "صحنه", coordinates: [34.4833, 47.6833] },
      { id: "javanrud", name: "جوانرود", coordinates: [34.8000, 46.4833] },
      { id: "qasr-shirin", name: "قصرشیرین", coordinates: [34.5167, 45.5833] },
    ]
  },
  {
    id: "kurdistan",
    name: "کردستان",
    coordinates: [35.3019, 46.9981],
    cities: [
      { id: "sanandaj", name: "سنندج", coordinates: [35.3019, 46.9981] },
      { id: "marivan", name: "مریوان", coordinates: [35.5167, 46.1833] },
      { id: "saghez", name: "سقز", coordinates: [36.2500, 46.2667] },
      { id: "baneh", name: "بانه", coordinates: [35.9833, 45.8833] },
      { id: "qorveh", name: "قروه", coordinates: [35.1667, 47.8000] },
      { id: "bijar", name: "بیجار", coordinates: [35.8667, 47.6000] },
    ]
  },
  {
    id: "ilam",
    name: "ایلام",
    coordinates: [33.6374, 46.4227],
    cities: [
      { id: "ilam-city", name: "ایلام", coordinates: [33.6374, 46.4227] },
      { id: "dehloran", name: "دهلران", coordinates: [32.6833, 47.2667] },
      { id: "ivan", name: "ایوان", coordinates: [33.8333, 46.3167] },
      { id: "mehran", name: "مهران", coordinates: [33.1167, 46.1667] },
      { id: "abadan", name: "آبدانان", coordinates: [32.9833, 47.4167] },
    ]
  },
  {
    id: "lorestan",
    name: "لرستان",
    coordinates: [33.4878, 48.3558],
    cities: [
      { id: "khorramabad", name: "خرم آباد", coordinates: [33.4878, 48.3558] },
      { id: "borujerd", name: "بروجرد", coordinates: [33.9000, 48.7500] },
      { id: "dorud", name: "دورود", coordinates: [33.5000, 49.0667] },
      { id: "kuhdasht", name: "کوهدشت", coordinates: [33.5333, 47.6000] },
      { id: "azna", name: "ازنا", coordinates: [33.4500, 49.4500] },
      { id: "aligudarz", name: "الیگودرز", coordinates: [33.4000, 49.7000] },
    ]
  },
  {
    id: "chaharmahal-bakhtiari",
    name: "چهارمحال و بختیاری",
    coordinates: [32.3256, 50.8644],
    cities: [
      { id: "shahrekord", name: "شهرکرد", coordinates: [32.3256, 50.8644] },
      { id: "borujen", name: "بروجن", coordinates: [31.9667, 51.2833] },
      { id: "farsan", name: "فارسان", coordinates: [32.2500, 50.5667] },
      { id: "lordegan", name: "لردگان", coordinates: [31.5167, 50.8167] },
      { id: "koohrang", name: "کوهرنگ", coordinates: [32.5000, 50.1333] },
    ]
  },
  {
    id: "kohgiluyeh-boyer-ahmad",
    name: "کهگیلویه و بویراحمد",
    coordinates: [30.6680, 51.5880],
    cities: [
      { id: "yasuj", name: "یاسوج", coordinates: [30.6680, 51.5880] },
      { id: "dehdasht", name: "دهدشت", coordinates: [30.7833, 50.5667] },
      { id: "dogonbadan", name: "دوگنبدان", coordinates: [30.3500, 50.8000] },
      { id: "sisakht", name: "سی سخت", coordinates: [30.8667, 51.4500] },
    ]
  },
  {
    id: "bushehr",
    name: "بوشهر",
    coordinates: [28.9234, 50.8203],
    cities: [
      { id: "bushehr-city", name: "بوشهر", coordinates: [28.9234, 50.8203] },
      { id: "borazjan", name: "برازجان", coordinates: [29.2667, 51.2167] },
      { id: "genaveh", name: "گناوه", coordinates: [29.5667, 50.5167] },
      { id: "kangan", name: "کنگان", coordinates: [27.8333, 52.0667] },
      { id: "asaluyeh", name: "عسلویه", coordinates: [27.4667, 52.6000] },
    ]
  },
  {
    id: "hormozgan",
    name: "هرمزگان",
    coordinates: [27.1833, 56.2667],
    cities: [
      { id: "bandar-abbas", name: "بندرعباس", coordinates: [27.1833, 56.2667] },
      { id: "minab", name: "میناب", coordinates: [27.1333, 57.0833] },
      { id: "kish", name: "کیش", coordinates: [26.5333, 53.9667] },
      { id: "qeshm", name: "قشم", coordinates: [26.9500, 56.2667] },
      { id: "jask", name: "جاسک", coordinates: [25.6500, 57.7667] },
      { id: "rudan", name: "رودان", coordinates: [27.4333, 57.1833] },
    ]
  },
  {
    id: "sistan-baluchestan",
    name: "سیستان و بلوچستان",
    coordinates: [29.4960, 60.8629],
    cities: [
      { id: "zahedan", name: "زاهدان", coordinates: [29.4960, 60.8629] },
      { id: "zabol", name: "زابل", coordinates: [31.0333, 61.5000] },
      { id: "chabahar", name: "چابهار", coordinates: [25.2833, 60.6333] },
      { id: "iranshahr", name: "ایرانشهر", coordinates: [27.2000, 60.6833] },
      { id: "saravan", name: "سراوان", coordinates: [27.3667, 62.3333] },
      { id: "khash", name: "خاش", coordinates: [28.2167, 61.2000] },
    ]
  },
  {
    id: "kerman",
    name: "کرمان",
    coordinates: [30.2839, 57.0833],
    cities: [
      { id: "kerman-city", name: "کرمان", coordinates: [30.2839, 57.0833] },
      { id: "jiroft", name: "جیرفت", coordinates: [28.6667, 57.7333] },
      { id: "bam", name: "بم", coordinates: [29.1061, 58.3569] },
      { id: "shahdad", name: "شهداد", coordinates: [30.4167, 57.7000] },
      { id: "sirjan", name: "سیرجان", coordinates: [29.4500, 55.6833] },
      { id: "rafsanjan", name: "رفسنجان", coordinates: [30.4000, 55.9833] },
      { id: "bardsir", name: "بردسیر", coordinates: [29.9167, 56.5667] },
    ]
  },
  {
    id: "yazd",
    name: "یزد",
    coordinates: [31.8974, 54.3569],
    cities: [
      { id: "yazd-city", name: "یزد", coordinates: [31.8974, 54.3569] },
      { id: "mehriz", name: "مهریز", coordinates: [31.5833, 54.4333] },
      { id: "ardakan", name: "اردکان", coordinates: [32.3167, 54.0167] },
      { id: "bafq", name: "بافق", coordinates: [31.6000, 55.4000] },
      { id: "taft", name: "تفت", coordinates: [31.7500, 54.2000] },
    ]
  },
  {
    id: "golestan",
    name: "گلستان",
    coordinates: [36.8456, 54.4342],
    cities: [
      { id: "gorgan", name: "گرگان", coordinates: [36.8456, 54.4342] },
      { id: "aliabad-katul", name: "علی آباد کتول", coordinates: [36.9167, 54.8667] },
      { id: "minodasht", name: "مینودشت", coordinates: [37.0333, 55.3667] },
      { id: "kalaleh", name: "کلاله", coordinates: [37.3833, 55.4833] },
      { id: "azadshahr", name: "آزادشهر", coordinates: [37.0833, 55.1667] },
    ]
  },
  {
    id: "mazandaran",
    name: "مازندران",
    coordinates: [36.5656, 53.0586],
    cities: [
      { id: "sari", name: "ساری", coordinates: [36.5656, 53.0586] },
      { id: "babol", name: "بابل", coordinates: [36.5500, 52.6833] },
      { id: "amol", name: "آمل", coordinates: [36.4667, 52.3500] },
      { id: "qaemshahr", name: "قائمشهر", coordinates: [36.4667, 52.8667] },
      { id: "behshahr", name: "بهشهر", coordinates: [36.6833, 53.5500] },
      { id: "chalus", name: "چالوس", coordinates: [36.6500, 51.4167] },
      { id: "ramsar", name: "رامسر", coordinates: [36.9167, 50.6500] },
      { id: "tonekabon", name: "تنکابن", coordinates: [36.8167, 50.8667] },
    ]
  },
  {
    id: "gilan",
    name: "گیلان",
    coordinates: [37.2808, 49.5831],
    cities: [
      { id: "rasht", name: "رشت", coordinates: [37.2808, 49.5831] },
      { id: "bandar-anzali", name: "بندر انزلی", coordinates: [37.4667, 49.4667] },
      { id: "lahijan", name: "لاهیجان", coordinates: [37.2000, 50.0000] },
      { id: "langarud", name: "لنگرود", coordinates: [37.1833, 50.1500] },
      { id: "rudsar", name: "رودسر", coordinates: [37.1333, 50.2833] },
      { id: "fouman", name: "فومن", coordinates: [37.2167, 49.3167] },
      { id: "masal", name: "ماسال", coordinates: [37.3667, 49.1333] },
      { id: "talesh", name: "تالش", coordinates: [37.8000, 48.9000] },
    ]
  },
  {
    id: "ardabil",
    name: "اردبیل",
    coordinates: [38.2498, 48.2933],
    cities: [
      { id: "ardabil-city", name: "اردبیل", coordinates: [38.2498, 48.2933] },
      { id: "parsabad", name: "پارس آباد", coordinates: [39.6500, 47.9167] },
      { id: "meshgin-shahr", name: "مشگین شهر", coordinates: [38.4000, 47.6833] },
      { id: "khalkhal", name: "خلخال", coordinates: [37.6167, 48.5167] },
      { id: "germi", name: "گرمی", coordinates: [39.0167, 48.0833] },
      { id: "bilehsavar", name: "بیله سوار", coordinates: [39.3500, 48.3500] },
    ]
  },
  {
    id: "west-azerbaijan",
    name: "آذربایجان غربی",
    coordinates: [37.5522, 45.0753],
    cities: [
      { id: "urmia", name: "ارومیه", coordinates: [37.5522, 45.0753] },
      { id: "khoy", name: "خوی", coordinates: [38.5500, 44.9500] },
      { id: "mahabad", name: "مهاباد", coordinates: [36.7667, 45.7167] },
      { id: "miandoab", name: "میاندوآب", coordinates: [36.9667, 46.1000] },
      { id: "bukan", name: "بوکان", coordinates: [36.5167, 46.2167] },
      { id: "sardasht", name: "سردشت", coordinates: [36.1500, 45.4667] },
      { id: "piranshahr", name: "پیرانشهر", coordinates: [36.7000, 45.1333] },
      { id: "naghadeh", name: "نقده", coordinates: [36.9500, 45.3833] },
    ]
  },
  {
    id: "east-azerbaijan",
    name: "آذربایجان شرقی",
    coordinates: [38.0806, 46.2919],
    cities: [
      { id: "tabriz", name: "تبریز", coordinates: [38.0806, 46.2919] },
      { id: "maragheh", name: "مراغه", coordinates: [37.3833, 46.2333] },
      { id: "miyaneh", name: "میانه", coordinates: [37.4167, 47.7167] },
      { id: "bonab", name: "بناب", coordinates: [37.3333, 46.0667] },
      { id: "azar-shahr", name: "آذر شهر", coordinates: [37.7667, 45.9667] },
      { id: "shabestar", name: "شبستر", coordinates: [38.1833, 45.7000] },
      { id: "hashtrud", name: "هشترود", coordinates: [37.4667, 47.0500] },
      { id: "ajabshir", name: "عجب شیر", coordinates: [37.4667, 45.8833] },
    ]
  },
  {
    id: "zanjan",
    name: "زنجان",
    coordinates: [36.6736, 48.4787],
    cities: [
      { id: "zanjan-city", name: "زنجان", coordinates: [36.6736, 48.4787] },
      { id: "abhar", name: "ابهر", coordinates: [36.1500, 49.2167] },
      { id: "khodabandeh", name: "خدابنده", coordinates: [36.1167, 48.5833] },
      { id: "khorramdarreh", name: "خرمدره", coordinates: [36.2000, 49.1833] },
      { id: "mahneshan", name: "ماهنشان", coordinates: [36.7500, 47.6667] },
      { id: "tarom", name: "طارم", coordinates: [36.8167, 48.9000] },
    ]
  }
];

// Helper function to get all cities from all provinces
export const getAllCities = (): City[] => {
  return iranProvinces.flatMap(province => province.cities);
};

// Helper function to search cities by name
export const searchCities = (query: string): City[] => {
  const allCities = getAllCities();
  return allCities.filter(city => 
    city.name.includes(query) || city.name.startsWith(query)
  );
};

// Helper function to get province by city
export const getProvinceByCity = (cityId: string): Province | undefined => {
  return iranProvinces.find(province => 
    province.cities.some(city => city.id === cityId)
  );
};
