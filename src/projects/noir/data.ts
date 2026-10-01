export const photos = {
  hero: '1414235077428-338989a2e8c0',
  knife: '1551218808-94e220e084d2',
  flame: '1600565193348-f74bd3c7ccdf',
  chef: '1577219491135-ce391730fb2c',
  plate: '1611599537845-1c7aca0091c0',
  counter: '1590846406792-0adc7f938f1d',
  cellar: '1470337458703-46ad1756a187',
  room: '1517248135467-4c7edcad34c4',
  eggs: '1482049016688-2d3e1b311543',
  pasta: '1600803907087-f56d462fd26b',
  steak: '1529692236671-f1f6cf9683ba',
  cocktail: '1514362545857-3bc16c4c7d1b',
  salmon: '1467003909585-2f8a72700288',
  facade: '1579027989536-b7b1f875659b',
}

export interface Dish {
  name: string
  note: string
  price?: string
}

export const menus: { id: string; label: string; intro: string; dishes: Dish[]; footer: string }[] = [
  {
    id: 'tasting',
    label: 'Tasting',
    intro: 'Eleven courses, served to the whole room at once. The menu changes with the season, and sometimes with the weather.',
    dishes: [
      { name: 'Smoked butter, rye, ember salt', note: 'Bread baked at noon, butter smoked over beech' },
      { name: 'Oyster, green apple, dill oil', note: 'Brittany, lightly torched' },
      { name: 'Beetroot baked in ash', note: 'Horseradish snow, aged goat’s cheese' },
      { name: 'Trout, fermented cucumber', note: 'Cured for thirty-six hours, cold smoke' },
      { name: 'Hand-cut pasta, bone marrow', note: 'Black pepper, forty-month parmesan' },
      { name: 'Turbot on the bone', note: 'Brown butter, sea herbs, burnt leek' },
      { name: 'Dry-aged duck, cherry', note: 'Twenty-one days, glazed over vine cuttings' },
      { name: 'Cheese from the cellar', note: 'Three, chosen on the day' },
      { name: 'Sour cream sorbet, rhubarb', note: 'Pre-dessert' },
      { name: 'Dark chocolate, rye, smoked caramel', note: 'Seventy-two per cent, Valrhona' },
      { name: 'Mignardises', note: 'With coffee or tea, at the fire' },
    ],
    footer: 'Tasting menu 3,900 CZK · Wine pairing 2,400 CZK · Non-alcoholic pairing 1,400 CZK',
  },
  {
    id: 'carte',
    label: 'À la carte',
    intro: 'At the bar counter only, Tuesday to Thursday. No reservations — just walk in.',
    dishes: [
      { name: 'Grilled flatbread, whipped lardo', note: 'Rosemary, honey', price: '180' },
      { name: 'Steak tartare, smoked yolk', note: 'Capers, crisp shallots', price: '420' },
      { name: 'Charred hispi cabbage', note: 'Miso butter, hazelnut', price: '340' },
      { name: 'Hand-cut pasta, bone marrow', note: 'Black pepper, parmesan', price: '460' },
      { name: 'Flat-iron steak, bone sauce', note: 'Aged forty days, fries in beef fat', price: '890' },
      { name: 'Dark chocolate, smoked caramel', note: 'Rye crumb, crème fraîche', price: '260' },
    ],
    footer: 'Prices in CZK · Service is not included',
  },
  {
    id: 'wine',
    label: 'Wine',
    intro: 'Four hundred labels, most of them small growers. Our sommelier pours by the glass from anything open that night.',
    dishes: [
      { name: 'Grüner Veltliner, Kamptal 2022', note: 'Mineral, white pepper — with the trout', price: '220 / glass' },
      { name: 'Ryzlink rýnský, Moravia 2021', note: 'Lime, petrol, long — with the oyster', price: '240 / glass' },
      { name: 'Blaufränkisch, Burgenland 2019', note: 'Dark cherry, iron — with the duck', price: '280 / glass' },
      { name: 'Champagne, Grower Brut Nature', note: 'To begin', price: '390 / glass' },
      { name: 'Tokaji Aszú, 5 puttonyos', note: 'With chocolate and caramel', price: '310 / glass' },
    ],
    footer: 'The full list — four hundred labels — is brought to the table',
  },
]

export const rooms = [
  {
    title: 'The Counter',
    body: 'Eight seats at the pass, close enough to feel the heat of the grill. The chef serves the counter personally.',
    photo: photos.counter,
    alt: 'Dimly lit dining room with brass lights and a long counter',
  },
  {
    title: 'The Cellar',
    body: 'Under the vaulted brick, pairings and aperitifs before dinner — or a long last glass after it.',
    photo: photos.cellar,
    alt: 'Bartender pouring an amber drink over a single ice cube',
  },
  {
    title: 'The Private Room',
    body: 'Twelve guests, one table, one menu written for the occasion. Available Sunday and Monday.',
    photo: photos.room,
    alt: 'Private dining room with dark wood and low pendant lights',
  },
]

export const gallery = [
  { photo: photos.eggs, alt: 'Soft eggs on greens, served on a dark plate' },
  { photo: photos.pasta, alt: 'Hand-cut pasta with ragù in a black bowl' },
  { photo: photos.cocktail, alt: 'Amber cocktail with a sprig of rosemary on a dark bar' },
  { photo: photos.steak, alt: 'Aged steak being sliced at the table' },
  { photo: photos.salmon, alt: 'Salmon with a bright vegetable salsa' },
  { photo: photos.plate, alt: 'Grilled fish with herbs and tomato' },
]
