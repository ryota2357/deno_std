// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
import { count } from "./count.ts";
import { assertEquals } from "../assert/assert_equals.ts";

Deno.test("count()", async () => {
  using kv = await Deno.openKv(":memory:");
  await kv.set(["foo", "a"], "bar");
  await kv.set(["foo", "b"], "baz");
  await kv.set(["bar", "c"], "caz");

  assertEquals(await count(kv, { prefix: [] }), 3);
  assertEquals(await count(kv, { prefix: ["foo"] }), 2);
  assertEquals(await count(kv, { prefix: ["bar"] }), 1);
  assertEquals(await count(kv, { prefix: ["baz"] }), 0);
});

Deno.test("count() works with large key spaces", async () => {
  const COUNT = 1_234;
  using kv = await Deno.openKv(":memory:");
  for (let i = 0; i < COUNT; i++) {
    await kv.set([i.toString()], i);
  }

  assertEquals(await count(kv, { prefix: [] }), COUNT);
});
