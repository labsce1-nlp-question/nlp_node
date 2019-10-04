require("dotenv").config();

// Checks to see if the required env vars are set
// SLACK_AUTH_TOKEN
test("Checks if SLACK_AUTH_TOKEN is set", () => {
  const SATExists = () => {
    if (process.env.SLACK_AUTH_TOKEN === undefined) {
      return false;
    }
    return true;
  };
  expect(SATExists()).toBe(true);
});

// SLACK_CLIENT_ID
test("Checks SLACK_CLIENT_ID is set", () => {
  const SCIExists = () => {
    if (process.env.SLACK_CLIENT_ID === undefined) {
      return false;
    }
    return true;
  };
  expect(SCIExists()).toBe(true);
});

// SLACK_CLIENT_SECRET
test("Checks SLACK_CLIENT_SECRET is set", () => {
  const SCSExists = () => {
    if (process.env.SLACK_CLIENT_SECRET === undefined) {
      return false;
    }
    return true;
  };
  expect(SCSExists()).toBe(true);
});

// SLACK_SIGNING_SECRET
test("Checks SLACK_SIGNING_SECRET is set", () => {
  const SVTExists = () => {
    if (process.env.SLACK_SIGNING_SECRET === undefined) {
      return false;
    }
    return true;
  };
  expect(SVTExists()).toBe(true);
});
