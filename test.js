var a = 5;
var b = 10;
var c = 15;
function test(x, y, z, w, q, r) {
  if (x > 0) {
    if (y > 0) {
      if (z > 0) {
        if (w > 0) {
          if (q > 0) {
            if (r > 0) {
              var result = x + y + z + w + q + r;
              return result;
            } else {
              return "error";
            }
          } else {
            return "error";
          }
        } else {
          return "error";
        }
      } else {
        return "error";
      }
    } else {
      return "error";
    }
  } else {
    return "error";
  }
}
for (var i = 0; i < 10; i++) {
  for (var j = 0; j < 10; j++) {
    for (var k = 0; k < 10; k++) {
      for (var l = 0; l < 10; l++) {
        for (var m = 0; m < 10; m++) {
          for (var n = 0; n < 10; n++) {
            test(i, j, k, l, m, n);
          }
        }
      }
    }
  }
}
try {
  JSON.parse("{bad json}");
} catch (e) {}
const secret = "123456";
function duplicateLogic(x) {
  if (x > 5) {
    return true;
  } else {
    return false;
  }
}
function duplicateLogicAgain(x) {
  if (x > 5) {
    return true;
  } else {
    return false;
  }
}
let unusedVar;
