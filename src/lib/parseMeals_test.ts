import { expect, test } from "bun:test";

import kooperativetHtml from "./kooperatiet.html" with { type: "text" };
import bombayBistroHtml from "./bombay.html" with { type: "text" };
import worldoffoodRss from "./worldoffood.html" with { type: "text" };
import districtOneHtml from "./districtone.html" with { type: "text" };
import { parseBombayBistroMenuDays, parseDistrictOneMenuDays, parseKooperativetMenuDays, parseWorldOfFoodRSS } from "./parseMeals";
import type { MenuDay } from "./types";

test("kooperativet html parsing", () => {
  let output = parseKooperativetMenuDays(
    kooperativetHtml,
    new Date("2025-03-25T00:00:00.000Z"),
  );
  let expectedOutput: MenuDay[] = [
    {
      date: new Date("2025-03-24T00:01:00.000Z"),
      meals: [
        {
          category: "SALLADER",
          name: "Caesarsallad – romansallad toppad med kyckling & bacon, serveras med caesardressing, riven grana padano, sardeller samt krutonger",
        },
        {
          category: "SALLADER",
          name: "Västkust Caesarsallad – romansallad toppad med räkor & rökt lax serveras med caesardressing, riven grana padano, sardeller samt krutonger",
        },
        {
          category: "SALLADER",
          name: "Grillad Vårsallad – kolgrillad kycklingfilé på bladsallad toppad med pärlcouscous, vattenmelon, picklad rödlök & fetaost serveras med rostad vitlöksmajonnäs",
        },
        {
          category: "SALLADER",
          name: "Grillad Vårsallad – kolgrillad haloumi på bladsallad toppad med pärlcouscous, vattenmelon, picklad rödlök & fetaost serveras med rostad vitlöksmajonnäs",
        },
        {
          category: "KÖTT",
          name: "Kooperativets klassiska Kalv Köttbullar med potatispuré, gräddsås, rårörda lingon & pressgurka",
        },
        {
          category: "FISK",
          name: "Pocherad torsk serveras med potatispuré, brynt smör, Kapris & rödbetor samt örtsallad",
        },
        {
          category: "THAI",
          name: "Green curry chicken – Wokad kyckling med grönsaker i grön curry med kokosmjölk serveras med jasminris & koriander 2/5 chili",
        },
        {
          category: "INDISK",
          name: "Chicken Murg masala – Indisk currygryta med kyckling serveras basmatiris serveras chilipickels majonnäs & smörat naanbröd CHILI 2/5",
        },
        {
          category: "VÄRLDEN",
          name: "Kolgrillad kycklingfilé med rostad klyftpotatis, örtaioli, vinägersky samt rucola",
        },
        {
          category: "VEGETARISK",
          name: "Green Curry Pea chuncks – Wokat ärtprotein med grönsaker i grön curry med kokosmjölk serveras med jasminris & koriander   2/5 chili",
        },
      ],
    },
    {
      date: new Date("2025-03-25T00:01:00.000Z"),
      meals: [
        {
          category: "SALLADER",
          name: "Caesarsallad – romansallad toppad med kyckling & bacon, serveras med caesardressing, riven grana padano, sardeller samt krutonger",
        },
        {
          category: "SALLADER",
          name: "Västkust Caesarsallad – romansallad toppad med räkor & rökt lax serveras med caesardressing, riven grana padano, sardeller samt krutonger",
        },
        {
          category: "SALLADER",
          name: "Grillad Vårsallad – kolgrillad kycklingfilé på bladsallad toppad med pärlcouscous, vattenmelon, picklad rödlök & fetaost serveras med rostad vitlöksmajonnäs",
        },
        {
          category: "SALLADER",
          name: "Grillad Vårsallad – kolgrillad haloumi på bladsallad toppad med pärlcouscous, vattenmelon, picklad rödlök & fetaost serveras med rostad vitlöksmajonnäs",
        },
        {
          category: "KÖTT",
          name: "Schnitzel, pommes & bea",
        },
        {
          category: "FISK",
          name: "Bakad kolja serveras med krossad potatis, purjolökssås, citron och vårlök",
        },
        {
          category: "THAI",
          name: "Honey and garlic Fried chicken – friterad kyckling glacerad i rostad vitlökshonung serveras med jasminris, Rostad lök & koriander",
        },
        {
          category: "INDISK",
          name: "Fried rice ”Biryani” på vårt vis stekt basmatiris med massa goa grönsaker & kryddor toppat med kyckling serveras med limeyoghurt & garlic Naan",
        },
        {
          category: "VÄRLDEN",
          name: "Kooperativets Philly Cheese Sandwish- suregsbröd toppat med nattbakad högrev rostad paprika & brynt lök serveras med varm ostsås smaksatt med jalapeños samt frasiga pommes",
        },
        {
          category: "VEGETARISK",
          name: "Fried rice ”Biryani” på vårt vis stekt basmatiris med massa goa grönsaker & kryddor toppat med rostad oumph serveas med limeyoghurt & garlic Naan",
        },
      ],
    },
    {
      date: new Date("2025-03-26T00:01:00.000Z"),
      meals: [
        {
          category: "SALLADER",
          name: "Caesarsallad – romansallad toppad med kyckling & bacon, serveras med caesardressing, riven grana padano, sardeller samt krutonger",
        },
        {
          category: "SALLADER",
          name: "Västkust Caesarsallad – romansallad toppad med räkor & rökt lax serveras med caesardressing, riven grana padano, sardeller samt krutonger",
        },
        {
          category: "SALLADER",
          name: "Grillad Vårsallad – kolgrillad kycklingfilé på bladsallad toppad med pärlcouscous, vattenmelon, picklad rödlök & fetaost serveras med rostad vitlöksmajonnäs",
        },
        {
          category: "SALLADER",
          name: "Grillad Vårsallad – kolgrillad haloumi på bladsallad toppad med pärlcouscous, vattenmelon, picklad rödlök & fetaost serveras med rostad vitlöksmajonnäs",
        },
        {
          category: "KÖTT",
          name: "Viltskav med krämigt mos, gräddsås, persiljestekta champinjoner & lingon",
        },
        {
          category: "FISK",
          name: "Stekt panerad sejfilé serveras med dillkokt potatis, pepparrotshollandaise och ärtskott",
        },
        {
          category: "THAI",
          name: "Dan Dan nudlar – wokade äggnudlar med på högrevsfärs smaksatt med Gochujang serveras med böngroddar, rostad lök & koriander",
        },
        {
          category: "INDISK",
          name: "Bombay chicken burger – Kolgrillad kycklingburgare i briochebröd med tandoorimajonnäs, syrligkålsallad samt frasiga pommes med mangochutney glace",
        },
        {
          category: "VÄRLDEN",
          name: "Marstrands stolthet, Afrikana. Kolgrillad kyckling, krämig currysås, friterade bananchips, jordnötter samt mangochutney",
        },
        {
          category: "VEGETARISKT",
          name: "Marstrands vegetariska stolthet, Afrikana. Grillad Quorn, krämig currysås, friterade bananchips, jordnötter samt mango chutney",
        },
      ],
    },
    {
      date: new Date("2025-03-27T00:01:00.000Z"),
      meals: [
        {
          category: "SALLADER",
          name: "Caesarsallad – romansallad toppad med kyckling & bacon, serveras med caesardressing, riven grana padano, sardeller samt krutonger",
        },
        {
          category: "SALLADER",
          name: "Västkust Caesarsallad – romansallad toppad med räkor & rökt lax serveras med caesardressing, riven grana padano, sardeller samt krutonger",
        },
        {
          category: "SALLADER",
          name: "Grillad Vårsallad – kolgrillad kycklingfilé på bladsallad toppad med pärlcouscous, vattenmelon, picklad rödlök & fetaost serveras med rostad vitlöksmajonnäs",
        },
        {
          category: "SALLADER",
          name: "Grillad Vårsallad – kolgrillad haloumi på bladsallad toppad med pärlcouscous, vattenmelon, picklad rödlök & fetaost serveras med rostad vitlöksmajonnäs",
        },
        {
          category: "KÖTT",
          name: "Kalv Wallenbergare med krämig potatispuré, rödvinssås smaksatt med brynt smör & fermenterad peppar serveras med lingon & pressgurka",
        },
        {
          category: "FISK",
          name: "Färskostbakad kolja serveras med potatismos och schalottenlöks beurre blanc samt citron och frasiga brödsmulor",
        },
        {
          category: "THAI",
          name: "Sticky chicken på svensk kyckling i hosinsås med krämigkålsallad serveras med jasminris, koriander & rostade sesamfrön chili 1/5",
        },
        {
          category: "VEGETARISK",
          name: "Butter Haloumi– indisk gryta med friterad haloumi serveras med rostad mandel, koriander, Naan samt feffakräm 1/5",
        },
        {
          category: "INDISK",
          name: "Butter Chicken – indisk gryta med majskyckling serveras med rostad mandel, koriander, Naan samt feffakräm chili 1/5",
        },
        {
          category: "VÄRLDEN",
          name: "(Burgaren går att få med haloumi)\nItalien style högrevsburgare toppad med parmesan & mozzarella, tomat samt rostad vitlöksmajonnäs & rucola serveras med pommes smaksatta med svarta oliver",
        },
      ],
    },
    {
      date: new Date("2025-03-28T00:01:00.000Z"),
      meals: [
        {
          category: "SALLADER",
          name: "Caesarsallad – romansallad toppad med kyckling & bacon, serveras med caesardressing, riven grana padano, sardeller samt krutonger",
        },
        {
          category: "SALLADER",
          name: "Västkust Caesarsallad – romansallad toppad med räkor & rökt lax serveras med caesardressing, riven grana padano, sardeller samt krutonger",
        },
        {
          category: "SALLADER",
          name: "Grillad Vårsallad – kolgrillad kycklingfilé på bladsallad toppad med pärlcouscous, vattenmelon, picklad rödlök & fetaost serveras med rostad vitlöksmajonnäs",
        },
        {
          category: "SALLADER",
          name: "Grillad Vårsallad – kolgrillad haloumi på bladsallad toppad med pärlcouscous, vattenmelon, picklad rödlök & fetaost serveras med rostad vitlöksmajonnäs",
        },
        {
          category: "KÖTT",
          name: "Berras Mix Grill",
        },
        {
          category: "FISK",
          name: "Havets Wallenbergare serveras med potatispure, Kräftröra smaksatt med rostad chili och vitlök",
        },
        {
          category: "THAI",
          name: "Asiatisk kebabtallrik på handskuren Majskyckling med jasminris toppad med kålsallad, hosin & soyaglace samt chilimajonnäs och rostade sesam",
        },
        {
          category: "VEGETARISK",
          name: "Kooperativets Langos på surdeg med crèmefraiche, västerbottenost toppad med tångkaviar, picklad rödlök, spenat & aioli",
        },
        {
          category: "INDISK",
          name: "Chicken Vindaloo – kryddstark indisk currygryta med kyckling serveras med yoghurt, basmatiris & koriander och smörat Naan CHILI 5/5",
        },
        {
          category: "VÄRLDEN",
          name: "Kooperativets Langos på surdeg med crèmefraiche toppad med räkor, västerbottenost, picklad rödlök, spenat & aioli",
        },
      ],
    },
  ];

  expect(output).toEqual(expectedOutput);
});

test("World Of Food html parsing", () => {
  let output = parseWorldOfFoodRSS(worldoffoodRss);
  let expectedOutput = [
    {
      date: new Date("2025-03-24T00:00:00.000Z"),
      meals: [
        {
          category: "Earth",
          name: "Vreta gulärt, ärthummus, picklad silverlök, mejram och ostskum, persilja & stekt svamp Yellow peas, pea hummus, pickled silver onion, marjoram and cheese foam, parsley & fried mushrooms",
        },
        {
          category: "Metal",
          name: "Grillad fläskhöft, krämig polenta, blekselleri & tomatsalsa, libbsticka, fetaost & steksky Grilled pork loin, creamy polenta, celery & tomato salsa, lovage, feta cheese & dripping",
        },
        {
          category: "Water",
          name: "Bakad fisk, potatispuré med purjolök, sauce au café de paris, zucchinisallad & persilja Baked fish, potato puré with leek, sauce au café de paris, zucchini salad & parsley",
        },
        {
          category: "Fire",
          name: "Bakat kycklinglår, ”tom kha gai” ris, champinjon, zucchini, koriander, mynta & grön chili Baked chicken thigh, “tom kha gai” rice, mushroom, zucchini, cilantro, mint & green chili",
        },
      ],
    },
    {
      date: new Date("2025-03-25T00:00:00.000Z"),
      meals: [
        {
          category: "Earth",
          name: "Vreta gulärt, ärthummus, picklad silverlök, mejram och ostskum, persilja & stekt svamp Yellow peas, pea hummus, pickled silver onion, marjoram and cheese foam, parsley & fried mushrooms",
        },
        {
          category: "Metal",
          name: "Grillad fläskhöft, krämig polenta, blekselleri & tomatsalsa, libbsticka, fetaost & steksky Grilled pork loin, creamy polenta, celery & tomato salsa, lovage, feta cheese & dripping",
        },
        {
          category: "Water",
          name: "Bakad fisk, potatispuré med purjolök, sauce au café de paris, zucchinisallad & persilja Baked fish, potato puré with leek, sauce au café de paris, zucchini salad & parsley",
        },
        {
          category: "Fire",
          name: "Bakat kycklinglår, ”tom kha gai” ris, champinjon, zucchini, koriander, mynta & grön chili Baked chicken thigh, “tom kha gai” rice, mushroom, zucchini, cilantro, mint & green chili",
        },
      ],
    },
    {
      date: new Date("2025-03-26T00:00:00.000Z"),
      meals: [
        {
          category: "Earth",
          name: "Friterade potatis- och halloumibollar, ostkräm med picklad jalapeno, currypickles, grillad gemsallad & riven parmesan Fried potato- & halloumi balls, cheese cremé with pickled jalapeno, curry pickles, grilled gem lettuce & grated parmesan",
        },
        {
          category: "Metal",
          name: "Grillad fläskhöft, krämig polenta, blekselleri & tomatsalsa, libbsticka, fetaost & steksky Grilled pork loin, creamy polenta, celery & tomato salsa, lovage, feta cheese & dripping",
        },
        {
          category: "Water",
          name: "Bakad fisk, potatispuré med purjolök, sauce au café de paris, zucchinisallad & persilja Baked fish, potato puré with leek, sauce au café de paris, zucchini salad & parsley",
        },
        {
          category: "Fire",
          name: "Grillat kycklinglår, ris, jordnötssås, strimlad morot, fisksås, friterad vårrulledegkrisp, koriander & mynta  Grilled chicken thigh, rice, peanut sauce, grated carrot, fish sauce, fried spring roll dough crisp, cilantro & mint",
        },
        {
          category: "Wood",
          name: "Svart ris, rödkål, morot, grön currymajo, bönbiff & koriander  Black rice, red cabbage, carrot, green curry mayo, bean patty and cilantro",
        },
      ],
    },
    {
      date: new Date("2025-03-27T00:00:00.000Z"),
      meals: [
        {
          category: "Earth",
          name: "Friterade potatis- och halloumibollar, ostkräm med picklad jalapeno, currypickles, grillad gemsallad & riven parmesan Fried potato- & halloumi balls, cheese cremé with pickled jalapeno, curry pickles, grilled gem lettuce & grated parmesan",
        },
        {
          category: "Metal",
          name: "Rostad fläsksida, stuvad vitkål, rostad potatis,  sviskonchutney & persilja Roasted pork belly, stewed white cabbage, roasted potatoes, prune chutney & parsley",
        },
        {
          category: "Water",
          name: "Fisktaco, friterad fisk, tortillabröd, pico de gallo, koriander, mango och habaneromajonnäs & strimlad sallad Fish taco, fried fish, tortilla bread, pico de gallo, cilantro, mango and habanero mayo and shredded lettuce",
        },
        {
          category: "Fire",
          name: "Grillat kycklinglår, ris, jordnötssås, strimlad morot, fisksås, friterad vårrulledegkrisp, koriander & mynta  Grilled chicken thigh, rice, peanut sauce, grated carrot, fish sauce, fried spring roll dough crisp, cilantro & mint",
        },
        {
          category: "Wood",
          name: "Svart ris, rödkål, morot, grön currymajo, bönbiff & koriander  Black rice, red cabbage, carrot, green curry mayo, bean patty and cilantro",
        },
      ],
    },
    {
      date: new Date("2025-03-28T00:00:00.000Z"),
      meals: [
        {
          category: "Earth",
          name: "Friterade potatis- och halloumibollar, ostkräm med picklad jalapeno, currypickles, grillad gemsallad & riven parmesan Fried potato- & halloumi balls, cheese cremé with pickled jalapeno, curry pickles, grilled gem lettuce & grated parmesan",
        },
        {
          category: "Metal",
          name: "Rostad fläsksida, stuvad vitkål, rostad potatis,  sviskonchutney & persilja Roasted pork belly, stewed white cabbage, roasted potatoes, prune chutney & parsley",
        },
        {
          category: "Water",
          name: "Fisktaco, friterad fisk, tortillabröd, pico de gallo, koriander, mango och habaneromajonnäs & strimlad sallad Fish taco, fried fish, tortilla bread, pico de gallo, cilantro, mango and habanero mayo and shredded lettuce",
        },
        {
          category: "Fire",
          name: "Grillat kycklinglår, ris, jordnötssås, strimlad morot, fisksås, friterad vårrulledegkrisp, koriander & mynta  Grilled chicken thigh, rice, peanut sauce, grated carrot, fish sauce, fried spring roll dough crisp, cilantro & mint",
        },
        {
          category: "Wood",
          name: "Svart ris, rödkål, morot, grön currymajo, bönbiff & koriander  Black rice, red cabbage, carrot, green curry mayo, bean patty and cilantro",
        },
      ],
    },
  ];

  expect(output).toEqual(expectedOutput);
});



test("Bombay Bistro html parsing", () => {
  let output = parseBombayBistroMenuDays(bombayBistroHtml, 
    new Date("2025-04-08T00:00:00.000Z"),
  );
  let expectedOutput = [
    {
      date: new Date("2025-04-07T00:01:00.000Z"),
      meals: [
        {
          category: "Chicken Vindaloo",
          name: "Kycklingryta med ursprung från Goa består av rödvin, kanel, röd chili, curryblad.",
        },
        {
          category: "Lamm Korma",
          name: "Lammköttgryta gjord av grädde tomat, kardemumma, rosvatten och smör.",
        },
      ],
    },
    {
      date: new Date("2025-04-08T00:01:00.000Z"),
      meals: [
        {
          category: "Hariyali Chicken",
          name: "Kycklingfile i en örtsås som består av basilika, mynta, koriander, lök, grön chili och kokos.",
        },
        {
          category: "Masaledar Beef",
          name: "Kryddig oxköttgryta med lök, tomat, chili, nejlika, lime och koriander.",
        },
      ],
    },
    {
      date: new Date("2025-04-09T00:01:00.000Z"),
      meals: [
        {
          category: "Butter Chicken",
          name: "Kycklinggryta i en aromatisk gräddsås som består av tomat, ost, cashewnötter och smör.",
        },
        {
          category: "Balti Ghost",
          name: "Lammkött marinerad i vitlök och grön chilli tillagad i en kryddstark rödvinsås, lök, paprika och champinjoner.",
        },
      ],
    },
    {
      date: new Date("2025-04-10T00:01:00.000Z"),
      meals: [
        {
          category: "Murgh Jhalfrezi",
          name: "Kycklingfilé tillagad i söt och syrlig sås av tomat, rödlök, zucchini, paprika, fänkål och chili.",
        },
        {
          category: "Beef Bombay Special",
          name: "Oxköttgryta med en kryddstark gräddsås.",
        },
      ],
    },
    {
      date: new Date("2025-04-11T00:01:00.000Z"),
      meals: [
        {
          category: "Pahadi Grill Chicken",
          name: "Grillad kycklingfilé marinerad i yoghurt och örter, serveras med tandoori sås.",
        },
        {
          category: "Dalcha Ghost",
          name: "Lammgryta med linser, lök, tomat, chili och limejuice.",
        },
      ],
    },
  ];

  expect(output).toEqual(expectedOutput);
});

test("district one html parsing", () => {
  let output = parseDistrictOneMenuDays(
    districtOneHtml,
    new Date("2025-03-25T00:00:00.000Z")
  );
  
  let expectedOutput: MenuDay[] = [
    {
      date: new Date("2025-03-24T00:01:00.000Z"),
      meals: [
        {
          category: "Earth",
          name: "Vreta gulärt, ärthummus, picklad silverlök, mejram och ostskum, persilja & stekt svamp Yellow peas, pea hummus, pickled silver onion, marjoram and cheese foam, parsley & fried mushrooms"
        },
        {
          category: "Metal",
          name: "Grillad fläskhöft, krämig polenta, blekselleri & tomatsalsa, libbsticka, fetaost & steksky Grilled pork loin, creamy polenta, celery & tomato salsa, lovage, feta cheese & dripping"
        },
        {
          category: "Water",
          name: "Bakad fisk, potatispuré med purjolök, sauce au café de paris, zucchinisallad & persilja Baked fish, potato puré with leek, sauce au café de paris, zucchini salad & parsley"
        },
        {
          category: "Fire",
          name: "Bakat kycklinglår, \"tom kha gai\" ris, champinjon, zucchini, koriander, mynta & grön chili Baked chicken thigh, \"tom kha gai\" rice, mushroom, zucchini, cilantro, mint & green chili"
        }
      ]
    }
  ];
  
  // Verify we have 5 days (Monday to Friday)
  expect(output.length).toBe(5);
  
  // Check the first day (Monday)
  expect(output[0].date).toEqual(new Date("2025-03-24T00:01:00.000Z"));
  
  // Check that we have meals for Monday
  expect(output[0].meals.length).toBeGreaterThan(0);
  
  // Check that we have the expected categories
  const mondayCategories = output[0].meals.map(meal => meal.category);
  expect(mondayCategories).toContain("Ramen");
  expect(mondayCategories).toContain("Fisk");
  expect(mondayCategories).toContain("Kött");
  expect(mondayCategories).toContain("Sallad");
  
  // Check that we have the expected meals
  const mondayMeals = output[0].meals.map(meal => meal.name);
  expect(mondayMeals.some(meal => meal.includes("Sidfläsk, kyckling"))).toBe(true);
  expect(mondayMeals.some(meal => meal.includes("Pocherad torskfile"))).toBe(true);
  expect(mondayMeals.some(meal => meal.includes("Boeuf bourguignon"))).toBe(true);
  
  // Check the last day (Friday)
  expect(output[4].date).toEqual(new Date("2025-03-28T00:01:00.000Z"));
  
  // Check that we have meals for Friday
  expect(output[4].meals.length).toBeGreaterThan(0);
  
  // Check that we have the expected categories for Friday
  const fridayCategories = output[4].meals.map(meal => meal.category);
  expect(fridayCategories).toContain("Ramen");
  expect(fridayCategories).toContain("Fisk");
  expect(fridayCategories).toContain("Kött");
  expect(fridayCategories).toContain("Sallad");
  
  // Check that we have the expected meals for Friday
  const fridayMeals = output[4].meals.map(meal => meal.name);
  expect(fridayMeals.some(meal => meal.includes("Sidfläsk, kyckling"))).toBe(true);
  expect(fridayMeals.some(meal => meal.includes("Skaldjuröverbakad torskfile"))).toBe(true);
  expect(fridayMeals.some(meal => meal.includes("Nattbakad flankstek"))).toBe(true);
});

