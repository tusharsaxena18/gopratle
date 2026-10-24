const BASE_URL = process.env.TEST_BASE_URL ?? "http://localhost:5050";
const API = `${BASE_URL}/api`;

interface HttpResponse {
  status: number;
  body: any;
}

async function post(path: string, payload: unknown): Promise<HttpResponse> {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => null);
  return { status: res.status, body };
}

async function get(path: string): Promise<HttpResponse> {
  const res = await fetch(`${API}${path}`);
  const body = await res.json().catch(() => null);
  return { status: res.status, body };
}

import assert from "assert";

function expect<T>(actual: T) {
  return {
    toBe: (expected: T) =>
      assert.strictEqual(actual, expected, `Expected ${expected}, got ${actual}`),
    toBeGreaterThanOrEqualTo: (n: number) =>
      assert.ok(
        (actual as unknown as number) >= n,
        `Expected ≥ ${n}, got ${actual}`
      ),
    toBeTruthy: () =>
      assert.ok(actual, `Expected truthy value, got ${JSON.stringify(actual)}`),
    toContainKey: (key: string) =>
      assert.ok(
        actual && typeof actual === "object" && key in (actual as object),
        `Expected object to contain key "${key}", got: ${JSON.stringify(actual)}`
      ),
    toAllMatch: (predicate: (item: any) => boolean, msg: string) =>
      assert.ok(
        Array.isArray(actual) && (actual as any[]).every(predicate),
        msg
      ),
  };
}

let passed = 0;
let failed = 0;
const failedTests: string[] = [];

async function test(name: string, fn: () => Promise<void>): Promise<void> {
  try {
    await fn();
    console.log(`  PASS  ${name}`);
    passed++;
  } catch (err: any) {
    console.log(`  FAIL  ${name}`);
    const detail = err?.message ?? String(err);
    console.log(`      -> ${detail}`);
    failedTests.push(name);
    failed++;
  }
}

const tomorrow = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
})();

const PLANNER_PAYLOAD = {
  eventName: "Grand Wedding",
  eventType: "wedding",
  dateMode: "single",
  startDate: tomorrow,
  location: "Mumbai",
  venue: "The Grand Ballroom",
  details: {
    servicesNeeded: ["full_planning", "decor"],
    guestCount: 200,
    budget: 500_000,
    planningStage: "idea",
    teamSize: 5,
    notes: "Need vegan catering options",
  },
};

const PERFORMER_PAYLOAD = {
  eventName: "Rock Concert",
  eventType: "concert",
  dateMode: "single",
  startDate: tomorrow,
  location: "Delhi",
  details: {
    actType: "band",
    genre: ["rock", "alternative"],
    performerCount: 5,
    durationMinutes: 120,
    fee: 150_000,
    soundProvided: true,
  },
};

const CREW_PAYLOAD = {
  eventName: "Tech Summit",
  eventType: "corporate",
  dateMode: "single",
  startDate: tomorrow,
  location: "Bangalore",
  details: {
    rolesNeeded: ["sound", "lighting"],
    headcount: 10,
    experienceLevel: "intermediate",
    shiftTiming: { start: "08:00", end: "20:00" },
    payPerDay: 2_500,
    travelProvided: true,
    accommodationProvided: false,
  },
};

async function run(): Promise<void> {
  console.log(`\nRequirements API - HTTP Integration Tests`);
  console.log(`Target: ${API}\n`);

  // Verify server is reachable before running tests
  try {
    await fetch(API.replace("/api", "/"));
  } catch {
    console.error(`\nCould not reach ${BASE_URL}`);
    console.error(`Start the server first: npm run dev\n`);
    process.exit(1);
  }

  let plannerId: string;
  let performerId: string;
  let crewId: string;

  console.log("POST /register/*");

  await test("POST /register/planner - valid -> 201 + _id", async () => {
    const { status, body } = await post("/register/planner", PLANNER_PAYLOAD);
    expect(status).toBe(201);
    expect(body.success).toBe(true);
    expect(body.data).toContainKey("_id");
    plannerId = body.data._id;
  });

  await test("POST /register/performer - valid -> 201 + _id", async () => {
    const { status, body } = await post("/register/performer", PERFORMER_PAYLOAD);
    expect(status).toBe(201);
    expect(body.success).toBe(true);
    performerId = body.data._id;
  });

  await test("POST /register/crew - valid -> 201 + _id", async () => {
    const { status, body } = await post("/register/crew", CREW_PAYLOAD);
    expect(status).toBe(201);
    expect(body.success).toBe(true);
    crewId = body.data._id;
  });

  await test("POST /register/planner - empty body -> 400 + Zod errors", async () => {
    const { status, body } = await post("/register/planner", {});
    expect(status).toBe(400);
    expect(body.success).toBe(false);
    expect(body).toContainKey("errors");
  });

  await test("POST /register/performer - missing details -> 400 + Zod errors", async () => {
    const { eventName, eventType, dateMode, startDate, location } = PERFORMER_PAYLOAD;
    const { status, body } = await post("/register/performer", {
      eventName,
      eventType,
      dateMode,
      startDate,
      location,
      // no `details`
    });
    expect(status).toBe(400);
    expect(body.success).toBe(false);
  });

  await test("POST /register/crew - invalid experienceLevel -> 400", async () => {
    const invalid = {
      ...CREW_PAYLOAD,
      details: { ...CREW_PAYLOAD.details, experienceLevel: "wizard" },
    };
    const { status, body } = await post("/register/crew", invalid);
    expect(status).toBe(400);
    expect(body.success).toBe(false);
  });

  console.log("\nGET /requirements");

  await test("No ?category -> 200 + merged array (>= 3 docs)", async () => {
    const { status, body } = await get("/requirements");
    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.count).toBeGreaterThanOrEqualTo(3);
  });

  await test("?category=planner -> 200 + only planner docs", async () => {
    const { status, body } = await get("/requirements?category=planner");
    expect(status).toBe(200);
    expect(body.data).toAllMatch(
      (d: any) => d.category === "planner",
      'Expected all docs to have category "planner"'
    );
  });

  await test("?category=performer -> 200 + only performer docs", async () => {
    const { status, body } = await get("/requirements?category=performer");
    expect(status).toBe(200);
    expect(body.data).toAllMatch(
      (d: any) => d.category === "performer",
      'Expected all docs to have category "performer"'
    );
  });

  await test("?category=crew -> 200 + only crew docs", async () => {
    const { status, body } = await get("/requirements?category=crew");
    expect(status).toBe(200);
    expect(body.data).toAllMatch(
      (d: any) => d.category === "crew",
      'Expected all docs to have category "crew"'
    );
  });

  await test("?category=invalid -> 400 + message", async () => {
    const { status, body } = await get("/requirements?category=rockstar");
    expect(status).toBe(400);
    expect(body.success).toBe(false);
    expect(body).toContainKey("message");
  });

  console.log("\nGET /requirements/:id");

  await test("Planner id -> 200 + correct doc returned", async () => {
    const { status, body } = await get(`/requirements/${plannerId}`);
    expect(status).toBe(200);
    expect(body.data._id).toBe(plannerId);
    expect(body.data.category).toBe("planner");
  });

  await test("Performer id -> 200 + correct doc returned", async () => {
    const { status, body } = await get(`/requirements/${performerId}`);
    expect(status).toBe(200);
    expect(body.data._id).toBe(performerId);
    expect(body.data.category).toBe("performer");
  });

  await test("Crew id -> 200 + correct doc returned", async () => {
    const { status, body } = await get(`/requirements/${crewId}`);
    expect(status).toBe(200);
    expect(body.data._id).toBe(crewId);
    expect(body.data.category).toBe("crew");
  });

  await test("Non-existent ObjectId -> 404", async () => {
    const { status, body } = await get("/requirements/000000000000000000000000");
    expect(status).toBe(404);
    expect(body.success).toBe(false);
  });

  await test("Malformed id (not a valid ObjectId) -> 404", async () => {
    const { status } = await get("/requirements/not-an-id");
    expect(status).toBe(404);
  });

  const total = passed + failed;
  console.log(`\n${"-".repeat(55)}`);
  console.log(`Results: ${passed}/${total} passed, ${failed} failed`);
  if (failedTests.length > 0) {
    console.log("\nFailed:");
    failedTests.forEach((t) => console.log(`  - ${t}`));
  }
  console.log("-".repeat(55));

  process.exit(failed > 0 ? 1 : 0);
}

run().catch((err) => {
  console.error("Unexpected runner error:", err);
  process.exit(1);
});