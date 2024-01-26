// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
import { count } from "./count.ts";
import { assertEquals } from "../assert/assert_equals.ts";

Deno.test("count()", async () => {
  using kv = await Deno.openKv(":memory:");
  await kv.set(["foo", "a"], "bar");
  await kv.set(["bar", "b"], "baz");

  assertEquals(await count(kv, { prefix: [] }), 2);
  assertEquals(await count(kv, { prefix: ["foo"] }), 1);
  assertEquals(await count(kv, { prefix: ["bar"] }), 1);
  assertEquals(await count(kv, { prefix: ["baz"] }), 0);
});
