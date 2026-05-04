export const COUNTRIES = [
  { code: "US", name: "United States",  flag: "🇺🇸", bigMac: 5.58, currency: "USD", region: "North America", gdpPerCapita: 76000 },
  { code: "IN", name: "India",          flag: "🇮🇳", bigMac: 2.54, currency: "INR", region: "Asia",          gdpPerCapita: 2500  },
  { code: "DE", name: "Germany",        flag: "🇩🇪", bigMac: 5.02, currency: "EUR", region: "Europe",        gdpPerCapita: 48000 },
  { code: "CA", name: "Canada",         flag: "🇨🇦", bigMac: 4.94, currency: "CAD", region: "North America", gdpPerCapita: 52000 },
  { code: "AU", name: "Australia",      flag: "🇦🇺", bigMac: 4.30, currency: "AUD", region: "Oceania",       gdpPerCapita: 55000 },
  { code: "SG", name: "Singapore",      flag: "🇸🇬", bigMac: 4.19, currency: "SGD", region: "Asia",          gdpPerCapita: 65000 },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", bigMac: 4.01, currency: "GBP", region: "Europe",        gdpPerCapita: 44000 },
  { code: "BR", name: "Brazil",         flag: "🇧🇷", bigMac: 3.13, currency: "BRL", region: "South America", gdpPerCapita: 8800  },
  { code: "MN", name: "Mongolia",       flag: "🇲🇳", bigMac: 2.28, currency: "MNT", region: "Asia",          gdpPerCapita: 4200  },
  { code: "PL", name: "Poland",         flag: "🇵🇱", bigMac: 2.76, currency: "PLN", region: "Europe",        gdpPerCapita: 18000 },
  { code: "NL", name: "Netherlands",    flag: "🇳🇱", bigMac: 5.35, currency: "EUR", region: "Europe",        gdpPerCapita: 57000 },
  { code: "JP", name: "Japan",          flag: "🇯🇵", bigMac: 3.40, currency: "JPY", region: "Asia",          gdpPerCapita: 33000 },
  { code: "KR", name: "South Korea",    flag: "🇰🇷", bigMac: 3.86, currency: "KRW", region: "Asia",          gdpPerCapita: 32000 },
  { code: "MX", name: "Mexico",         flag: "🇲🇽", bigMac: 2.68, currency: "MXN", region: "Latin America", gdpPerCapita: 10000 },
  { code: "ZA", name: "South Africa",   flag: "🇿🇦", bigMac: 2.16, currency: "ZAR", region: "Africa",        gdpPerCapita: 6000  },
];

export const ROLES = [
  { id: "ds",  title: "Data Scientist",  icon: "◈" },
  { id: "ml",  title: "ML Engineer",     icon: "⬡" },
  { id: "da",  title: "Data Analyst",    icon: "◇" },
  { id: "de",  title: "Data Engineer",   icon: "⬢" },
  { id: "ai",  title: "AI Researcher",   icon: "◉" },
];

export const EXP_LEVELS = [
  { id: "junior", label: "Junior (0–2 yrs)", multiplier: 0.65 },
  { id: "mid",    label: "Mid (3–5 yrs)",    multiplier: 1.00 },
  { id: "senior", label: "Senior (6+ yrs)",  multiplier: 1.55 },
];

export const SALARY_DATA = {
  US: { ds: 130000, ml: 155000, da: 85000,  de: 135000, ai: 175000 },
  IN: { ds: 18000,  ml: 22000,  da: 10000,  de: 20000,  ai: 28000  },
  DE: { ds: 75000,  ml: 90000,  da: 55000,  de: 80000,  ai: 100000 },
  CA: { ds: 95000,  ml: 115000, da: 70000,  de: 100000, ai: 130000 },
  AU: { ds: 90000,  ml: 105000, da: 65000,  de: 95000,  ai: 120000 },
  SG: { ds: 80000,  ml: 95000,  da: 55000,  de: 85000,  ai: 110000 },
  GB: { ds: 72000,  ml: 85000,  da: 50000,  de: 78000,  ai: 95000  },
  BR: { ds: 25000,  ml: 30000,  da: 15000,  de: 27000,  ai: 35000  },
  MN: { ds: 8000,   ml: 10000,  da: 5000,   de: 9000,   ai: 12000  },
  PL: { ds: 35000,  ml: 42000,  da: 22000,  de: 38000,  ai: 50000  },
  NL: { ds: 78000,  ml: 95000,  da: 58000,  de: 82000,  ai: 105000 },
  JP: { ds: 60000,  ml: 72000,  da: 42000,  de: 65000,  ai: 85000  },
  KR: { ds: 52000,  ml: 62000,  da: 38000,  de: 56000,  ai: 75000  },
  MX: { ds: 22000,  ml: 27000,  da: 13000,  de: 24000,  ai: 32000  },
  ZA: { ds: 20000,  ml: 24000,  da: 12000,  de: 21000,  ai: 28000  },
};

export const TREND_DATA = [
  { year: "2020", US: 110000, IN: 13000, DE: 62000, CA: 80000, SG: 65000 },
  { year: "2021", US: 118000, IN: 14500, DE: 66000, CA: 85000, SG: 69000 },
  { year: "2022", US: 127000, IN: 16000, DE: 70000, CA: 90000, SG: 74000 },
  { year: "2023", US: 129000, IN: 17200, DE: 73000, CA: 93000, SG: 78000 },
  { year: "2024", US: 130000, IN: 18000, DE: 75000, CA: 95000, SG: 80000 },
];

export const TOP_SKILLS = [
  { skill: "Python",           demand: 94, avgSalaryBoost: 22, category: "Language"  },
  { skill: "Machine Learning", demand: 88, avgSalaryBoost: 31, category: "Domain"    },
  { skill: "SQL",              demand: 82, avgSalaryBoost: 15, category: "Language"  },
  { skill: "Cloud (AWS/GCP)",  demand: 76, avgSalaryBoost: 25, category: "Platform"  },
  { skill: "TensorFlow",       demand: 71, avgSalaryBoost: 28, category: "Framework" },
  { skill: "NLP",              demand: 67, avgSalaryBoost: 33, category: "Domain"    },
  { skill: "LLMs / GenAI",     demand: 61, avgSalaryBoost: 38, category: "Domain"    },
  { skill: "Spark",            demand: 58, avgSalaryBoost: 20, category: "Platform"  },
  { skill: "PyTorch",          demand: 55, avgSalaryBoost: 29, category: "Framework" },
  { skill: "Tableau / BI",     demand: 53, avgSalaryBoost: 12, category: "Platform"  },
  { skill: "R",                demand: 45, avgSalaryBoost: 10, category: "Language"  },
  { skill: "dbt",              demand: 42, avgSalaryBoost: 18, category: "Platform"  },
];

export const ALL_TRACKED_SKILLS = TOP_SKILLS.map(s => s.skill);

export const CAREER_CLUSTERS = [
  { id: 1, label: "Research Track",      color: "#f59e0b", countries: ["US","DE","GB"],      skills: ["Python","ML","Research","PyTorch"], avgExp: 6, avgSalaryPPP: 142000, profile: { Python:90,"ML Depth":95,Cloud:50,SQL:60,Research:95,"Salary PPP":85 } },
  { id: 2, label: "Industry Applied",    color: "#34d399", countries: ["CA","AU","SG","NL"], skills: ["Python","Cloud","SQL","Spark"],     avgExp: 4, avgSalaryPPP: 105000, profile: { Python:95,"ML Depth":75,Cloud:90,SQL:85,Research:40,"Salary PPP":80 } },
  { id: 3, label: "Emerging Markets",    color: "#60a5fa", countries: ["IN","BR","PL","MX"], skills: ["Python","SQL","BI","R"],            avgExp: 3, avgSalaryPPP: 58000,  profile: { Python:80,"ML Depth":55,Cloud:60,SQL:90,Research:30,"Salary PPP":55 } },
  { id: 4, label: "Early Career Global", color: "#f472b6", countries: ["MN","ZA","BR","IN"], skills: ["Python","SQL","Excel","Tableau"],   avgExp: 1, avgSalaryPPP: 32000,  profile: { Python:70,"ML Depth":40,Cloud:35,SQL:85,Research:25,"Salary PPP":30 } },
];

export const RADAR_AXES = ["Python","ML Depth","Cloud","SQL","Research","Salary PPP"];
export const BASE_BIGMAC_US = 5.58;

export function pppAdjust(rawSalary, countryBigMac) {
  return Math.round((rawSalary * BASE_BIGMAC_US) / countryBigMac);
}
