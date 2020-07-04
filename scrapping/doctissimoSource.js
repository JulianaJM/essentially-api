var request = require("request-promise");
var cheerio = require("cheerio");
var fs = require("fs");

const specialConditions = [
  "menthe poivrée",
  "ravintsare",
  "tea tree",
  "laurier noble",
  "thym",
  "camomille romaine",
  "eucalyptus radié",
  "gaulthérie",
  "hélichryse italienne",
  "lavande vraie",
  "lavande aspic"
];

const getLinks = (url, patern, next) => {
  request(url, function(err, resp, html) {
    if (!err) {
      const links = [];
      const $ = cheerio.load(html);
      $(`a[href*="${patern}"]`).each((index, value) => {
        var link = $(value).attr("href");
        links.push(link);
      });
      next(null, links);
    }
  });
};

const promiseRequest = url => {
  const healthSymptoms = [];
  const moodSymptoms = [];
  const beautySymptoms = [];

  const options = {
    uri: url,
    transform: function(body) {
      return cheerio.load(body);
    }
  };
  return request(options).then($ => {
    // title
    const name = $("h1").text();

    // description
    const description = $(".row .doc-content")
      .children("div.col-md-18")
      .children("p")
      .first()
      .text();

    // img
    const picture = $(".doc-right").prop("src");

    // symptoms
    if (
      $("h3")
        .eq(0)
        .text()
        .trim() === "En santé"
    ) {
      healthSymptoms.push(...getSymptoms($, 15));
      if (
        $("h3")
          .eq(1)
          .text()
          .trim() === "En bien-être"
      ) {
        moodSymptoms.push(...getSymptoms($, 16));
      }

      if (
        $("h3")
          .eq(2)
          .text()
          .trim() === "En beauté"
      ) {
        beautySymptoms.push(...getSymptoms($, 17));
      }
    }
    if (
      $("h3")
        .eq(0)
        .text()
        .trim() === "En bien-être"
    ) {
      moodSymptoms.push(...getSymptoms($, 15));
      if (
        $("h3")
          .eq(1)
          .text()
          .trim() === "En beauté"
      ) {
        beautySymptoms.push(...getSymptoms($, 16));
      }
    }
    if (
      $("h3")
        .eq(0)
        .text()
        .trim() === "En beauté"
    ) {
      beautySymptoms.push(...getSymptoms($, 15));
    }

    return {
      name,
      description,
      picture,
      goodFor: [...healthSymptoms, ...moodSymptoms, ...beautySymptoms]
    };
  });
};

const promiseSymptomsRequest = url => {
  const healthSymptoms = [];
  const moodSymptoms = [];
  const beautySymptoms = [];

  const options = {
    uri: url,
    transform: function(body) {
      return cheerio.load(body);
    }
  };
  return request(options).then($ => {
    // symptoms
    if (
      $("h3")
        .eq(0)
        .text()
        .trim() === "En santé"
    ) {
      healthSymptoms.push(...getSymptoms($, 15));
      if (
        $("h3")
          .eq(1)
          .text()
          .trim() === "En bien-être"
      ) {
        moodSymptoms.push(...getSymptoms($, 16));
      }

      if (
        $("h3")
          .eq(2)
          .text()
          .trim() === "En beauté"
      ) {
        beautySymptoms.push(...getSymptoms($, 17));
      }
    }
    if (
      $("h3")
        .eq(0)
        .text()
        .trim() === "En bien-être"
    ) {
      moodSymptoms.push(...getSymptoms($, 15));
      if (
        $("h3")
          .eq(1)
          .text()
          .trim() === "En beauté"
      ) {
        beautySymptoms.push(...getSymptoms($, 16));
      }
    }
    if (
      $("h3")
        .eq(0)
        .text()
        .trim() === "En beauté"
    ) {
      beautySymptoms.push(...getSymptoms($, 15));
    }
    return [
      {
        category: "Health",
        list: [...new Set(healthSymptoms)]
      },
      {
        category: "Mood",
        list: [...new Set(moodSymptoms)]
      },
      {
        category: "Beauty",
        list: [...new Set(beautySymptoms)]
      }
    ];
  });
};

const getDataFromLinks = links => {
  return Promise.all(links.map(link => promiseRequest(link)));
};

const getDataSymptomsFromLinks = links => {
  return Promise.all(links.map(link => promiseSymptomsRequest(link)));
};

const getSymptoms = ($, index) => {
  const name = $("h1").text();
  const filter = specialConditions.filter(f => name.includes(f));
  if (filter.length === 1) {
    index++;
  }
  return $("ul")
    .eq(index)
    .children("li")
    .map(function(i, element) {
      return $(element)
        .text()
        .replace(/\+/g, "")
        .trim();
    })
    .get()
    .join("/")
    .split("/");
};

function getUnique(arr, comp) {
  const unique = arr
    .map(e => e[comp])

    // store the keys of the unique objects
    .map((e, i, final) => final.indexOf(e) === i && i)

    // eliminate the dead keys & store unique objects
    .filter(e => arr[e])
    .map(e => arr[e]);

  return unique;
}

const saveData = data => {
  const newData = getUnique(data, "name");
  fs.writeFileSync("../resources/oils.json", JSON.stringify(newData));
};

const saveDataSymptoms = data => {
  const listHealth = [];
  const listMood = [];
  const listBeauty = [];
  const symptoms = [];

  data.forEach(symptoms => {
    symptoms.forEach(symptom => {
      if (symptom.category === "Health") {
        listHealth.push(...symptom.list);
      }

      if (symptom.category === "Mood") {
        listMood.push(...symptom.list);
      }

      if (symptom.category === "Beauty") {
        listBeauty.push(...symptom.list);
      }
    });
  });

  symptoms.push(
    { category: "Health", list: [...new Set(listHealth)] },
    { category: "Mood", list: [...new Set(listMood)] },
    { category: "Beauty", list: [...new Set(listBeauty)] }
  );

  fs.writeFileSync("../resources/symptoms.json", JSON.stringify(symptoms));
};
getLinks(
  "http://www.doctissimo.fr/sante/aromatherapie/guide-huiles-essentielles",
  "http://www.doctissimo.fr/sante/aromatherapie/guide-huiles-essentielles/huile-essentielle-",
  (err, response) => {
    if (err) {
      throw new Error("une erreur est survenue");
    }
    getDataFromLinks(response)
      .then(response => {
        saveData(response);
      })
      .catch(e => {
        throw new Error(e);
        //console.log(e);
      });

    getDataSymptomsFromLinks(response)
      .then(response => {
        saveDataSymptoms(response);
      })
      .catch(e => {
        throw new Error(e);
        //console.log(e);
      });
  }
);
