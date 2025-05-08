import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// English translations
const enUS = {
  navigation: {
    miners: "Miners",
    pools: "Pools",
    developers: "Developers",
    getStarted: "Get started",
    language: "Language"
  },
  hero: {
    title: "Next Generation Bitcoin Mining Protocol",
    subtitle: "Enhanced security, reduced latency, and decentralized mining infrastructure"
  },
  sections: {
    miningCentralization: {
      title: "Mining Power Distribution",
      subtitle: "Currently, just 5 mining pools control over 83% of Bitcoin's total hashrate"
    },
    security: {
      title: "Enhanced Security",
      subtitle: "Stratum V2 encrypts all communication, protecting your credentials and mining data from attacks",
      before: "Before: Vulnerable",
      after: "After: Protected"
    },
    latency: {
      title: "Faster & Lighter",
      subtitle: "Binary protocol reduces bandwidth usage by 75Lower bandwidth plays a supporting role in maintaining stable operations, especially in environments with constrained or unreliable connectivity.% and slashes latency from hundreds to just a few milliseconds",
      v1: "Stratum V1",
      v2: "Stratum V2"
    }
  }
};

// Russian translations
const ruRU = {
  navigation: {
    miners: "Майнеры",
    pools: "Пулы",
    developers: "Разработчики",
    getStarted: "Начать",
    language: "Язык"
  },
  hero: {
    title: "Протокол майнинга биткойнов нового поколения",
    subtitle: "Повышенная безопасность, сниженная задержка и децентрализованная инфраструктура майнинга"
  },
  sections: {
    miningCentralization: {
      title: "Распределение майнинг-мощностей",
      subtitle: "В настоящее время всего 5 майнинг-пулов контролируют более 83% хешрейта Биткойна"
    },
    security: {
      title: "Улучшенная безопасность",
      subtitle: "Stratum V2 шифрует все коммуникации, защищая ваши учетные данные и данные майнинга от атак",
      before: "До: Уязвимый",
      after: "После: Защищённый"
    },
    latency: {
      title: "Быстрее и легче",
      subtitle: "Бинарный протокол снижает использование трафика на 75% и сокращает задержку с сотен до нескольких миллисекунд",
      v1: "Stratum V1",
      v2: "Stratum V2"
    }
  }
};

// Chinese translations
const zhCN = {
  navigation: {
    miners: "矿工",
    pools: "矿池",
    developers: "开发者",
    getStarted: "开始使用",
    language: "语言"
  },
  hero: {
    title: "下一代比特币挖矿协议",
    subtitle: "增强安全性，降低延迟，去中心化挖矿基础设施"
  },
  sections: {
    miningCentralization: {
      title: "挖矿算力分布",
      subtitle: "目前仅5个矿池就控制了比特币83%以上的算力"
    },
    security: {
      title: "增强安全性",
      subtitle: "Stratum V2加密所有通信，保护您的凭证和挖矿数据免受攻击",
      before: "之前：易受攻击",
      after: "之后：受保护"
    },
    latency: {
      title: "更快更轻",
      subtitle: "二进制协议将带宽使用减少75%，将延迟从数百毫秒降低到几毫秒",
      v1: "Stratum V1",
      v2: "Stratum V2"
    }
  }
};

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: {
      en: { translation: enUS },
      ru: { translation: ruRU },
      zh: { translation: zhCN }
    },
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
