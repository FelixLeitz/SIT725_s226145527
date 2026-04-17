const expect = require("chai").expect;
const request = require("request");

const baseUrl = "http://localhost:3000";

describe("Coffee API", () => {

  // Test 1: Base URL works
  it("returns status 200 for base URL", (done) => {
    request(baseUrl, (err, res, body) => {
      expect(res.statusCode).to.equal(200);
      done();
    });
  });

  // Test 2: Valid request — happy path
  it("returns correct coffee cups for valid hours", (done) => {
    request(`${baseUrl}/api/coffee/required?hours=3`, (err, res, body) => {
      const json = JSON.parse(body);
      expect(res.statusCode).to.equal(200);
      expect(json.hoursOfSleep).to.equal(3);
      expect(json.coffeeCupsRequired).to.equal(10);
      done();
    });
  });

  // Test 3: Invalid — missing hours param
  it("returns 400 when hours is missing", (done) => {
    request(`${baseUrl}/api/coffee/required`, (err, res, body) => {
      const json = JSON.parse(body);
      expect(res.statusCode).to.equal(400);
      expect(json).to.have.property("error");
      done();
    });
  });

  // Test 4: Invalid — non-numeric hours
  it("returns 400 when hours is not a number", (done) => {
    request(`${baseUrl}/api/coffee/required?hours=abc`, (err, res, body) => {
      const json = JSON.parse(body);
      expect(res.statusCode).to.equal(400);
      expect(json.error).to.equal("hours must be a number");
      done();
    });
  });

  // Test 5: Edge case — 0 hours of sleep
  it("returns max coffee for 0 hours of sleep", (done) => {
    request(`${baseUrl}/api/coffee/required?hours=0`, (err, res, body) => {
      const json = JSON.parse(body);
      expect(res.statusCode).to.equal(200);
      expect(json.coffeeCupsRequired).to.equal(16);
      done();
    });
  });

  // Test 6: Edge case — 8+ hours (no coffee needed)
  it("returns 0 cups for 8 or more hours of sleep", (done) => {
    request(`${baseUrl}/api/coffee/required?hours=10`, (err, res, body) => {
      const json = JSON.parse(body);
      expect(res.statusCode).to.equal(200);
      expect(json.coffeeCupsRequired).to.equal(0);
      done();
    });
  });

  // Test 7: Edge case — negative hours
  it("returns 400 for negative hours", (done) => {
    request(`${baseUrl}/api/coffee/required?hours=-5`, (err, res, body) => {
      const json = JSON.parse(body);
      expect(res.statusCode).to.equal(400);
      expect(json.error).to.equal("hours must be between 0 and 24");
      done();
    });
  });
});
