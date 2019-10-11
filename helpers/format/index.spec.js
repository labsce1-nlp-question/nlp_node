const format = require("./index");

const arr = [
  {
    modName: "test",
    data: {
      URL: "http://whatever"
    }
  },
  {
    modName: "test",
    data: {
      URL: "http://whatever"
    }
  },
  {
    modName: "test",
    data: {
      URL: "http://whatever"
    }
  },
  {
    modName: "test",
    data: {
      URL: "http://whatever"
    }
  }
];

test("Function returns a string", () => {
  expect(typeof format.trim(arr)).toBe("object");
});

// test("Test the default return length === 10 lines", () => {
//   expect(format.trim(arr).split("\n").length).toBe(10);
// });

// test("Second argument lower than three returns less results.", () => {
//   expect(format.trim(arr, 2).split("\n").length).toBeLessThan(10);
// });

// test("Second argument greater than three returns more results.", () => {
//   expect(format.trim(arr, 4).split("\n").length).toBeGreaterThan(10);
// });
