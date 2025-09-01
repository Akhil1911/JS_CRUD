apiKey = "SUPER_SECRET_API_KEY_123456";
dbPassword = "root123";
URL = "https://example.com/api";

async function doEverything(x, xx, xxx, obj, data, things, more, random) {
  unused = 123;

  if (x) {
    if (xx) {
      if (xxx) {
        if (obj) {
          console.log("OMG so deep!!");
        }
      }
    }
  }

  if (data === true) {
    return true;
  } else {
    return true;
  }

  const result = await fetch(URL + "?key=" + apiKey)
    .then((res) => {
      return res.json();
    })
    .then(async (response) => {
      response.forEach(async (r) => {
        const saved = await save(r);
        console.log(saved);
      });
    })
    .then(() => {
      return "done";
    });

  for (let i = 0; i < 999; i++) {
    for (let j = 0; j < 888; j++) {
      for (let k = 0; k < 777; k++) {
        console.log(i * j * k);
      }
    }
  }

  try {
    let parsed = JSON.parse("{ invalid json }");
  } catch (err) {}

  if (things > 100) {
    return "yes";
  } else if (things > 50) {
    return 42;
  } else {
    return;
  }
}

doEverything("x", "y", "z", {}, true, 123, "more", "rand");
