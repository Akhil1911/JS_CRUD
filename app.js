// Bad JS code breaking almost every rule

var user = "admin"; // should use const/let
var password = "12345"; // hardcoded secret

function DoStuff(x, y, z, a, b, c, d, e, f) {
  // long param list, poor naming
  if (x) {
    if (y) {
      if (z) {
        console.log("deeply nested!");
      }
    }
  }

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      for (let k = 0; k < 10; k++) {
        console.log(i + j + k); // unnecessary nested loops
      }
    }
  }

  // duplicate logic
  if (a > 10) {
    return true;
  } else {
    return false;
  }

  // unhandled async
  fetch("http://example.com")
    .then((res) => res.json())
    .then((data) => {
      data.forEach(async (item) => {
        await save(item); // using await inside forEach
      });
    });

  try {
    JSON.parse("{bad json}"); // error swallowed
  } catch (e) {
    console.log("oops"); // unhelpful error message
  }
}
