const { ValidateData }= require("./ValidateData.js");

test("Function returns True if the notes, title and question key values are a string", () => {
  let data = { notes: "something here", title: "something here" }
  expect(ValidateData(data)).toBe(true);
  data = { notes: "something here" };
  expect(ValidateData(data)).toBe(true);
  data = { title: "something here" };
  expect(ValidateData(data)).toBe(true);
  data = { question: "asking a question here"};
  expect(ValidateData(data)).toBe(true);
});

test("Function should return false if notes, title or question key values are not a string", () => {
  let data = { notes: 1234, title: "something here" };
  expect(ValidateData(data)).toBe(false);
  data = { notes: "something here", title: 1234 };
  expect(ValidateData(data)).toBe(false);
  data = { question: 1234 };
  expect(ValidateData(data)).toBe(false);
});

test("Function should return false if an undefiened variable is passed in or an empty object", () => {
  let data = undefined;
  expect(ValidateData(data)).toBe(null);
  data = {};
  expect(ValidateData(data)).toBe(null);
});

test("Function should return false if data passed in is not an object", () => {
  let data = 1234;
  expect(ValidateData(data)).toBe(false);
});