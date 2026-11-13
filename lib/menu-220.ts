
/**
 * Меню МОК на Октябрьской, 220 — перенесено с печатного меню заведения.
 * Цены в рублях. Это начальные данные: дальше меню редактируется в админ-панели.
 */

export type MenuItem = {
  name: string;
  /** Одна цена или несколько — для разных объёмов (см. category.volumes) */
  price: number | number[];
  note?: string;
  /** Адрес фото блюда (загружается в админке), например /media/abc.webp */
  photo?: string;
};

export type MenuCategory = {
  id: string;
  title: string;
  /** Подписи к ценам, например ["0,4 л", "1 л"] */
  volumes?: string[];
  adultsOnly?: boolean;
  items: MenuItem[];
};

export type MenuSection = {
  id: "kitchen" | "bar";
  title: string;
  subtitle: string;
  categories: MenuCategory[];
};

export const MENU_220: MenuSection[] = [
  {
    id: "kitchen",
    title: "Кухня",
    subtitle: "Работает до 2:30",
    categories: [
      {
        id: "salads",
        title: "Салаты",
        items: [
          { name: "Цезарь с курицей", price: 620 },
          { name: "Цезарь с креветками", price: 740 },
          { name: "Салат с хрустящими баклажанами", price: 560 },
          { name: "Греческий", price: 460 },
          { name: "Греческий с хрустящим сыром", price: 480 },
        ],
      },
      {
        id: "soups",
        title: "Первые блюда",
        items: [
          { name: "Крем-суп чечевичный", price: 380 },
          { name: "Том-ям", price: 720 },
          { name: "Куриный суп-лапша", price: 360 },
        ],
      },
      {
        id: "hot",
        title: "Горячие блюда",
        items: [
          { name: "Куриное филе в сливочном соусе", price: 590 },
          { name: "Фетучини с курицей и грибами", price: 620 },
          { name: "Фетучини с креветками", price: 780 },
          { name: "Бышлакъ биширген", price: 490 },
          { name: "Стейк тибон", price: 1850 },
          { name: "Стейк сёмги (бабочка)", price: 1490, note: "в сливочно-икорном соусе" },
          { name: "Жаркое с курицей", price: 580 },
          { name: "Жаркое с телятиной", price: 680 },
        ],
      },
      {
        id: "pizza",
        title: "Пицца и выпечка",
        items: [
          { name: "Пепперони", price: 980 },
          { name: "Цезарь", price: 1050 },
          { name: "Маргарита", price: 740 },
          { name: "Бьянка", price: 960 },
          { name: "Хачапури по-аджарски", price: 530 },
          { name: "Хычин с картофелем и сыром", price: 380 },
          { name: "Хлеб", price: 60 },
        ],
      },
      {
        id: "fastfood",
        title: "Фаст-фуд",
        items: [
          { name: "Сэндвич с курицей", price: 560 },
          { name: "Бургер из говядины", price: 690 },
          { name: "Чикен бургер", price: 640 },
          { name: "Наггетсы", price: 260 },
        ],
      },
      {
        id: "sides",
        title: "Гарниры",
        items: [
          { name: "Картофель фри", price: 200 },
          { name: "Картофель по-деревенски", price: 240 },
          { name: "Рис", price: 200 },
          { name: "Картофельное пюре", price: 230 },
        ],
      },
      {
        id: "sauces",
        title: "Соусы",
        items: [
          { name: "Сырный", price: 120 },
          { name: "Кетчуп", price: 120 },
          { name: "Кавказский красный", price: 130 },
          { name: "Цезарь", price: 130 },
          { name: "Наршараб", price: 150 },
          { name: "Свит чили", price: 150 },
          { name: "Тузлук", price: 130 },
          { name: "Тар-тар", price: 150 },
        ],
      },
      {
        id: "desserts",
        title: "Десерты",
        items: [
          { name: "Сан-Себастьян", price: 540 },
          { name: "Сан-Себастьян фисташковый", price: 540 },
          { name: "Шоколадный фондан", price: 440 },
          { name: "Штрудель с яблоком", price: 420 },
          { name: "Штрудель с вишней", price: 430 },
          { name: "Мороженое с шоколадом", price: 360 },
          { name: "Мороженое с фруктами", price: 380 },
          { name: "Мороженое", price: 330 },
        ],
      },
    ],
  },
  {
    id: "bar",
    title: "Бар",
    subtitle: "Лимонады, кофе, чай и милкшейки",
    categories: [
      {
        id: "lemonades",
        title: "Лимонады",
        volumes: ["0,4 л", "1 л"],
        items: [
          { name: "Клубника-базилик", price: [350, 620] },
          { name: "Яблоко-персик", price: [350, 620] },
          { name: "Мохито клубничный", price: [350, 620] },
          { name: "Яблоко-лайм", price: [350, 620] },
          { name: "Малина-лайм", price: [350, 620] },
          { name: "Мохито", price: [350, 620] },
          { name: "Лагуна тропик", price: [350, 620] },
        ],
      },
      {
        id: "milkshakes",
        title: "Милкшейки",
        volumes: ["0,4 л"],
        items: [
          { name: "Банановый", price: 420 },
          { name: "Орео", price: 420 },
          { name: "Шоколадный", price: 420 },
          { name: "Рафаэлло", price: 420 },
          { name: "Ванильный", price: 420 },
          { name: "Карамельный", price: 420 },
          { name: "Ягодный", price: 420 },
        ],
      },
      {
        id: "coffee",
        title: "Кофе",
        items: [
          { name: "Эспрессо", price: 200 },
          { name: "Американо", price: 250 },
          { name: "Флэт уайт", price: 350 },
          { name: "Капучино", price: 350 },
          { name: "Латте", price: 350 },
          { name: "Раф", price: 350 },
          { name: "Мокка", price: 350 },
          { name: "Айс латте", price: 350 },
          { name: "Бамбл", price: 350 },
          { name: "Фраппучино", price: 380 },
        ],
      },
      {
        id: "tea",
        title: "Чай",
        volumes: ["0,5 л", "1 л"],
        items: [
          { name: "Земляничный с бананом", price: [320, 550] },
          { name: "Клубника-фейхоа", price: [320, 550] },
          { name: "Имбирно-манговый", price: [320, 550] },
          { name: "Маракуйя-лайм", price: [320, 550] },
          { name: "Облепиховый с апельсином", price: [320, 550] },
          { name: "Сенча", price: [220, 370] },
          { name: "Ассам", price: [200, 370] },
          { name: "Эрл Грей", price: [200, 370] },
          { name: "Молочный улун", price: [220, 370] },
          { name: "Жасминовый", price: [220, 370] },
        ],
      },
      {
        id: "cold",
        title: "Холодные напитки",
        items: [
          { name: "Вода без газа", price: 120, note: "0,5 л" },
          { name: "Груша", price: 120 },
          { name: "Ессентуки № 4", price: 250 },
          { name: "Боржоми", price: 250 },
          { name: "Кола", price: 200, note: "ж/б" },
          { name: "Кола", price: 250, note: "стекло" },
          { name: "Кинза", price: 200, note: "ж/б" },
          { name: "Адреналин", price: 250 },
          { name: "Горилла", price: 200 },
          { name: "Сок натуральный", price: 350 },
          { name: "Липтон", price: [200, 250], note: "0,5 л / 1 л" },
        ],
      },
      {
        id: "beer",
        title: "Пиво на розлив",
        volumes: ["0,5 л"],
        adultsOnly: true,
        items: [
          { name: "Хадыженское", price: 250 },
          { name: "Карачаевское", price: 250 },
        ],
      },
      {
        id: "beer-snacks",
        title: "Закуски к пиву",
        items: [
          { name: "Гренки чесночные", price: 230 },
          { name: "Креветки жареные", price: 670 },
          { name: "Сырные палочки", price: 290 },
          { name: "Баварские колбаски", price: 350 },
          { name: "Луковые кольца в кляре", price: 200 },
          { name: "Сырные нити копчёные", price: 260 },
          { name: "Палочки куриные", price: 290 },
          { name: "Лимонная нарезка", price: 200 },
          { name: "Сет «Большая компания»", price: 1600 },
          { name: "Сет для двоих", price: 800 },
        ],
      },
    ],
  },
];
