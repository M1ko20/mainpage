import { tieAll } from '../lib/czech'

export interface Service {
  title: string
  body: string
  deliverables: string[]
}

export const services: Service[] = tieAll([
  {
    title: 'Webdesign',
    body: 'Art direction, layouty a designové systémy postavené kolem vaší značky a vašich zákazníků — ne ohnuté tak, aby se vešly do šablony.',
    deliverables: ['Art direction', 'UI design', 'Designový systém', 'Prototypy'],
  },
  {
    title: 'Frontend vývoj',
    body: 'Ručně psaná rozhraní v Reactu a TypeScriptu. Animace, které působí draze, a web, který se přesto načte okamžitě.',
    deliverables: ['React a TypeScript', 'Animace', 'Responzivní kód', 'Přístupnost'],
  },
  {
    title: 'Full-stack vývoj',
    body: 'Když má web umět víc než jen informovat: formuláře, rezervace, dashboardy, napojení na další služby a logika, která za tím stojí.',
    deliverables: ['Webové aplikace', 'Integrace', 'Formuláře a procesy', 'Data'],
  },
  {
    title: 'UI / UX',
    body: 'Informační architektura, uživatelské toky a cesty ke konverzi. Každá stránka má jeden úkol a je navržená tak, aby ho splnila.',
    deliverables: ['Struktura webu', 'Uživatelské toky', 'Konverzní cesty', 'Hierarchie textu'],
  },
  {
    title: 'Rychlost',
    body: 'Core Web Vitals beru jako požadavek, ne jako report. Optimalizované obrázky, minimum JavaScriptu a svižný web i na průměrném telefonu.',
    deliverables: ['Core Web Vitals', 'Optimalizace obrázků', 'Code splitting', 'Audity'],
  },
  {
    title: 'Spuštění a péče',
    body: 'Doména, hosting, analytika a základy SEO nastavené pořádně — s čistým předáním, takže všechno zůstává vám.',
    deliverables: ['Nasazení', 'Nastavení SEO', 'Analytika', 'Průběžné úpravy'],
  },
])

export interface Step {
  title: string
  body: string
  outcome: string
}

export const steps: Step[] = tieAll([
  {
    title: 'Analýza',
    body: 'Ujasníme si cíl, publikum a to, jak vypadá úspěch — v číslech, ne v přídavných jménech.',
    outcome: 'Písemný rozsah a cenová nabídka',
  },
  {
    title: 'Návrh',
    body: 'Nejdřív směr, pak klíčové stránky ve finální kvalitě. Reagujete na skutečné layouty, ne na drátěné modely, které si musíte domýšlet.',
    outcome: 'Schválený, proklikatelný návrh',
  },
  {
    title: 'Vývoj',
    body: 'Produkční kód od prvního dne, na soukromém náhledovém odkazu, který si kdykoli otevřete i na svém telefonu.',
    outcome: 'Živý náhled, který průběžně roste',
  },
  {
    title: 'Ladění',
    body: 'Skutečný obsah, skutečná zařízení, skutečná zpětná vazba. Rychlost, přístupnost a SEO zkontroluji dřív, než cokoli půjde ven.',
    outcome: 'Web připravený na návštěvnost',
  },
  {
    title: 'Spuštění',
    body: 'Doména, hosting, analytika, přesměrování. Spuštění je checklist, ne skok do neznáma — a i potom jsem na příjmu.',
    outcome: 'Živý web a kompletní předání',
  },
])

export interface Reason {
  title: string
  body: string
}

export const reasons: Reason[] = tieAll([
  {
    title: 'Postavené pro vaši firmu',
    body: 'Žádné šablony, žádné page buildery. Pět konceptů výše nesdílí ani řádek stylů — a váš web nebude vypadat jako žádný jiný.',
  },
  {
    title: 'Jeden člověk, celý projekt',
    body: 'Kdo váš web navrhuje, ten ho i staví. Nic se neztratí mezi návrhem a tím, jak si ho vyloží někdo další.',
  },
  {
    title: 'Rychlý ze zásady',
    body: 'Statická architektura, optimalizované obrázky, minimum JavaScriptu. Rychlost ovlivňuje pozice ve vyhledávání — i to, kolik lidí se vám ozve.',
  },
  {
    title: 'Responzivní doopravdy',
    body: 'Telefony dostanou vlastní rozvržení, ne zmenšený desktop. Vyzkoušeno na všem od 320px displejů po 4K monitory.',
  },
  {
    title: 'Dohledatelný a přístupný',
    body: 'Sémantické HTML, metadata, náhledy pro sdílení a ovládání z klávesnice na každé stránce — aby web správně pochopili lidé i vyhledávače.',
  },
  {
    title: 'Váš, bez závazků',
    body: 'Čistý kód ve vašem repozitáři, nasazený na váš účet. Nejste na mně závislí — a úpravy nebo nové stránky dostanete, kdykoli je budete potřebovat.',
  },
])

export interface Question {
  q: string
  a: string
}

export const questions: Question[] = tieAll([
  {
    q: 'Co ode mě potřebujete, abychom mohli začít?',
    a: 'Krátký popis vaší firmy, kdo jsou vaši zákazníci a čeho má web dosáhnout. Logo a další podklady pomůžou, ale nejsou podmínkou — směr můžeme vytvořit společně.',
  },
  {
    q: 'Používáte šablony nebo page buildery?',
    a: 'Ne. Každý web navrhuji od prázdné stránky a stavím ho v kódu. Proto je rychlý — a nezaměnitelně váš.',
  },
  {
    q: 'Jak dlouho tvorba webu trvá?',
    a: 'Záleží na rozsahu. Jednoduchá landing page je otázka týdnů, větší web s vlastními funkcemi trvá déle. Realistický harmonogram dostanete spolu s cenovou nabídkou, ještě než začne jakákoli práce.',
  },
  {
    q: 'Půjde obsah upravovat bez programátora?',
    a: 'Pokud to potřebujete, ano. Hned na začátku se domluvíme, které části má jít měnit bez zásahu do kódu, a podle toho web připravím.',
  },
  {
    q: 'Co se děje po spuštění?',
    a: 'Dostanete kód, přístupy a vysvětlení, jak do sebe všechno zapadá. Až budete potřebovat změny, nové stránky nebo vylepšení, víte, komu zavolat.',
  },
])

export const briefTypes = ['Nový web', 'Redesign', 'Landing page', 'E-shop', 'Webová aplikace', 'Zatím nevím'] as const
export const briefTimings = ['Co nejdřív', 'Za 1–3 měsíce', 'Zatím se jen rozhlížím'] as const
