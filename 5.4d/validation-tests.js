/**
 * SIT725 – 5.4D Validation Tests (MANDATORY TEMPLATE)
 *
 * HOW TO RUN: (Node.js 18+ is required)
 *   1. Start MongoDB
 *   2. Start your server (npm start)
 *   3. node validation-tests.js
 *
 * DO NOT MODIFY:
 *   - Output format (TEST|, SUMMARY|, COVERAGE|)
 *   - test() function signature
 *   - Exit behaviour
 *   - coverageTracker object
 *   - Logging structure
 *
 * YOU MUST:
 *   - Modify makeValidBook() to satisfy your schema rules
 *   - Add sufficient tests to meet coverage requirements
 */

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const API_BASE = "/api/books";

// =============================
// INTERNAL STATE (DO NOT MODIFY)
// =============================

const results = [];

const coverageTracker = {
  CREATE_FAIL: 0,
  UPDATE_FAIL: 0,
  TYPE: 0,
  REQUIRED: 0,
  BOUNDARY: 0,
  LENGTH: 0,
  TEMPORAL: 0,
  UNKNOWN_CREATE: 0,
  UNKNOWN_UPDATE: 0,
  IMMUTABLE: 0,
};

// =============================
// OUTPUTS FORMAT (DO NOT MODIFY)
// =============================

function logHeader(uniqueId) {
  console.log("SIT725_VALIDATION_TESTS");
  console.log(`BASE_URL=${BASE_URL}`);
  console.log(`API_BASE=${API_BASE}`);
  console.log(`INFO|Generated uniqueId=${uniqueId}`);
}

function logResult(r) {
  console.log(
    `TEST|${r.id}|${r.name}|${r.method}|${r.path}|expected=${r.expected}|actual=${r.actual}|pass=${r.pass ? "Y" : "N"}`
  );
}

function logSummary() {
  const failed = results.filter(r => !r.pass).length;
  console.log(
    `SUMMARY|pass=${failed === 0 ? "Y" : "N"}|failed=${failed}|total=${results.length}`
  );
  return failed === 0;
}

function logCoverage() {
  console.log(
    `COVERAGE|CREATE_FAIL=${coverageTracker.CREATE_FAIL}` +
    `|UPDATE_FAIL=${coverageTracker.UPDATE_FAIL}` +
    `|TYPE=${coverageTracker.TYPE}` +
    `|REQUIRED=${coverageTracker.REQUIRED}` +
    `|BOUNDARY=${coverageTracker.BOUNDARY}` +
    `|LENGTH=${coverageTracker.LENGTH}` +
    `|TEMPORAL=${coverageTracker.TEMPORAL}` +
    `|UNKNOWN_CREATE=${coverageTracker.UNKNOWN_CREATE}` +
    `|UNKNOWN_UPDATE=${coverageTracker.UNKNOWN_UPDATE}` +
    `|IMMUTABLE=${coverageTracker.IMMUTABLE}`
  );
}

// =============================
// HTTP HELPER
// =============================

async function http(method, path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  return { status: res.status, text };
}

// =============================
// TEST REGISTRATION FUNCTION
// =============================

async function test({ id, name, method, path, expected, body, tags }) {

  const { status } = await http(method, path, body);
  const pass = status === expected;

  const result = { id, name, method, path, expected, actual: status, pass };
  results.push(result);
  logResult(result);

  // treat missing or invalid tags as []
  const safeTags = Array.isArray(tags) ? tags : [];

  safeTags.forEach(tag => {
    if (Object.prototype.hasOwnProperty.call(coverageTracker, tag)) {
      coverageTracker[tag]++;
    }
  });
}

// =============================
// STUDENT MUST MODIFY THESE
// =============================

function makeValidBook(id) {
  return {
    id,
    title: "Valid Title",
    author: "Valid Author",
    year: 2020,
    genre: "Other",
    summary: "Valid summary text that satisfies the rules.",
    price: "9.99",
    currency: "AUD"
  };
}

function makeValidUpdate() {
  return {
    title: "Updated Title",
    author: "Updated Author",
    year: 2021,
    genre: "Other",
    summary: "Updated summary text that satisfies the rules.",
    price: "10.50",
    currency: "AUD"
  };
}

// =============================
// REQUIRED BASE TESTS (DO NOT REMOVE)
// =============================

async function run() {

  const uniqueId = `b${Date.now()}`;
  logHeader(uniqueId);

  const createPath = API_BASE;
  const updatePath = (id) => `${API_BASE}/${id}`;

  // ---- T01 Valid CREATE ----
  await test({
    id: "T01",
    name: "Valid create",
    method: "POST",
    path: createPath,
    expected: 201,
    body: makeValidBook(uniqueId),
    tags: []
  });

  // ---- T02 Duplicate ID ----
  await test({
    id: "T02",
    name: "Duplicate ID",
    method: "POST",
    path: createPath,
    expected: 409,
    body: makeValidBook(uniqueId),
    tags: ["CREATE_FAIL"]
  });

  // ---- T03 Immutable ID ----
  await test({
    id: "T03",
    name: "Immutable ID on update",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { ...makeValidUpdate(), id: "b999" },
    tags: ["UPDATE_FAIL", "IMMUTABLE"]
  });

  // ---- T04 Unknown field CREATE ----
  await test({
    id: "T04",
    name: "Unknown field CREATE",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now() + 1}`), hack: true },
    tags: ["CREATE_FAIL", "UNKNOWN_CREATE"]
  });

  // ---- T05 Unknown field UPDATE ----
  await test({
    id: "T05",
    name: "Unknown field UPDATE",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { ...makeValidUpdate(), hack: true },
    tags: ["UPDATE_FAIL", "UNKNOWN_UPDATE"]
  });

  // =============================
  // ADDITIONAL TESTS
  // =============================

  // ---- MISSING REQUIRED FIELDS ----

  // ---- T06 Missing required field - title ----
  await test({
    id: "T06",
    name: "Missing required field - title",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now() + 2}`), title: undefined },
    tags: ["CREATE_FAIL", "REQUIRED"]
  });

  // ---- T07 Missing required field - author ----
  await test({
    id: "T07",
    name: "Missing required field - author",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now() + 3}`), author: undefined },
    tags: ["CREATE_FAIL", "REQUIRED"]
  });

  // ---- T08 Missing required field - year ----
  await test({
    id: "T08",
    name: "Missing required field - year",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now() + 4}`), year: undefined },
    tags: ["CREATE_FAIL", "REQUIRED"]
  });

  // ---- T09 Missing required field - genre ----
  await test({
    id: "T09",
    name: "Missing required field - genre",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now() + 5}`), genre: undefined },
    tags: ["CREATE_FAIL", "REQUIRED"]
  });

  // ---- T10 Missing required field - price ----
  await test({
    id: "T10",
    name: "Missing required field - price",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now() + 6}`), price: undefined },
    tags: ["CREATE_FAIL", "REQUIRED"]
  });

  // ---- T11 Missing required field - currency ----
  await test({
    id: "T11",
    name: "Missing required field - currency",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now() + 7}`), currency: undefined },
    tags: ["CREATE_FAIL", "REQUIRED"]
  });

  // ---- WRONG TYPE ----

  // ---- T12 Wrong type - year as string ----
  await test({
    id: "T12",
    name: "Wrong type - year as string",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now() + 8}`), year: "not a year" },
    tags: ["CREATE_FAIL", "TYPE"]
  });

  // ---- T13 Wrong type - price as non-numeric string ----
  await test({
    id: "T13",
    name: "Wrong type - price as non-numeric string",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now() + 9}`), price: "abc" },
    tags: ["CREATE_FAIL", "TYPE"]
  });

  // ---- T14 Wrong type - invalid currency ----
  await test({
    id: "T14",
    name: "Wrong type - invalid currency not in enum",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now() + 10}`), currency: "NZD" },
    tags: ["CREATE_FAIL", "TYPE"]
  });

  // ---- BOUNDARY ----

  // ---- T15 Boundary - year in future ----
  await test({
    id: "T15",
    name: "Boundary - year in future",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now() + 11}`), year: new Date().getFullYear() + 1 },
    tags: ["CREATE_FAIL", "BOUNDARY", "TEMPORAL"]
  });

  // ---- T16 Boundary - year negative ----
  await test({
    id: "T16",
    name: "Boundary - year negative",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now() + 12}`), year: -1 },
    tags: ["CREATE_FAIL", "BOUNDARY", "TEMPORAL"]
  });

  // ---- T17 Boundary - current year valid ----
  await test({
    id: "T17",
    name: "Boundary - current year is valid",
    method: "POST",
    path: createPath,
    expected: 201,
    body: { ...makeValidBook(`b${Date.now() + 13}`), year: new Date().getFullYear() },
    tags: []
  });

  // ---- T18 Boundary - price zero ----
  await test({
    id: "T18",
    name: "Boundary - price zero",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now() + 14}`), price: "0" },
    tags: ["CREATE_FAIL", "BOUNDARY"]
  });

  // ---- T19 Boundary - price negative ----
  await test({
    id: "T19",
    name: "Boundary - price negative",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now() + 15}`), price: "-1" },
    tags: ["CREATE_FAIL", "BOUNDARY"]
  });

  // ---- LENGTH ----

  // ---- T20 Length - summary too short ----
  await test({
    id: "T20",
    name: "Length - summary too short",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now() + 16}`), summary: "too short" },
    tags: ["CREATE_FAIL", "LENGTH"]
  });

  // ---- T21 Length - summary too long ----
  await test({
    id: "T21",
    name: "Length - summary too long",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now() + 17}`), summary: "a".repeat(4097) },
    tags: ["CREATE_FAIL", "LENGTH"]
  });

  // ---- T22 Length - summary exactly at min boundary ----
  await test({
    id: "T22",
    name: "Length - summary exactly 20 chars",
    method: "POST",
    path: createPath,
    expected: 201,
    body: { ...makeValidBook(`b${Date.now() + 18}`), summary: "a".repeat(20) },
    tags: []
  });

  // ---- T23 Length - summary exactly at max boundary ----
  await test({
    id: "T23",
    name: "Length - summary exactly 4096 chars",
    method: "POST",
    path: createPath,
    expected: 201,
    body: { ...makeValidBook(`b${Date.now() + 19}`), summary: "a".repeat(4096) },
    tags: []
  });

  // ---- T24 Length - title empty ----
  await test({
    id: "T24",
    name: "Length - title empty string",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now() + 20}`), title: "" },
    tags: ["CREATE_FAIL", "LENGTH"]
  });

  // ---- T25 Length - title too long ----
  await test({
    id: "T25",
    name: "Length - title too long",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now() + 21}`), title: "a".repeat(1025) },
    tags: ["CREATE_FAIL", "LENGTH"]
  });

  // ---- ID FORMAT ----

  // ---- T26 ID format - uppercase B ----
  await test({
    id: "T26",
    name: "ID format - uppercase B rejected",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now() + 22}`), id: "B1" },
    tags: ["CREATE_FAIL", "TYPE"]
  });

  // ---- T27 ID format - no digits ----
  await test({
    id: "T27",
    name: "ID format - no digits rejected",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now() + 23}`), id: "b" },
    tags: ["CREATE_FAIL", "TYPE"]
  });

  // ---- T28 ID format - wrong order ----
  await test({
    id: "T28",
    name: "ID format - digits before b rejected",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now() + 24}`), id: "1b" },
    tags: ["CREATE_FAIL", "TYPE"]
  });

  // ---- UPDATE FAIL ----

  // ---- T29 Update fail - book not found ----
  await test({
    id: "T29",
    name: "Update fail - book not found",
    method: "PUT",
    path: updatePath("b99999"),
    expected: 404,
    body: makeValidUpdate(),
    tags: ["UPDATE_FAIL"]
  });

  // ---- T30 Update fail - year in future ----
  await test({
    id: "T30",
    name: "Update fail - year in future",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { ...makeValidUpdate(), year: new Date().getFullYear() + 1 },
    tags: ["UPDATE_FAIL", "BOUNDARY", "TEMPORAL"]
  });

  // ---- T31 Update fail - summary too short ----
  await test({
    id: "T31",
    name: "Update fail - summary too short",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { ...makeValidUpdate(), summary: "too short" },
    tags: ["UPDATE_FAIL", "LENGTH"]
  });

  // ---- T32 Update fail - year as string ----
  await test({
    id: "T32",
    name: "Update fail - year as string",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { ...makeValidUpdate(), year: "not a year" },
    tags: ["UPDATE_FAIL", "TYPE"]
  });

  // ---- PARTIAL UPDATE ----

  // ---- T33 Partial update - only author ----
  await test({
    id: "T33",
    name: "Partial update - only author",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 200,
    body: { author: "Only Author Updated" },
    tags: []
  });

  // Print summary and coverage
  const pass = logSummary();
  logCoverage();

  // Exit with code 0 if all tests passed, 1 if any failed
  process.exit(pass ? 0 : 1);
}

run().catch(err => {
  console.error("ERROR", err);
  process.exit(2);
});