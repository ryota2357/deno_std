// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.

/** Options for {@linkcode count}. */
export type CountOptions = Omit<
  Deno.KvListOptions,
  "batchSize" | "reverse"
>;

/**
 * Counts the number of entries in the database for the given selector.
 *
 * Warning: this function iterates over all entries for the given selector.
 * This should be taken into consideration when there is a cost for KV use,
 * such as {@link https://deno.com/deploy | Deno Deploy}. It's recommended to
 * use the most specific selector possible to avoid unnecessary iteration.
 *
 * @example
 * ```ts
 * import { count } from "https://deno.land/std@$STD_VERSION/kv/count.ts";
 *
 * using kv = await Deno.openKv();
 * await kv.set(["foo", "a"], "bar");
 * await kv.set(["bar", "b"], "baz");
 *
 * await count(kv, { prefix: [] }); // 2
 * await count(kv, { prefix: ["foo"] }); // 1
 * await count(kv, { prefix: ["bar"] }); // 1
 * await count(kv, { prefix: ["baz"] }); // 0
 * ```
 */
export async function count(
  kv: Deno.Kv,
  selector: Deno.KvListSelector,
  options?: Deno.KvListOptions,
): Promise<number> {
  // Use the largest possible batch size for fast executing iterator.
  const batchSize = options?.limit ?? 500;
  let count = 0;
  for await (const _ of kv.list(selector, { ...options, batchSize })) count++;
  return count;
}
