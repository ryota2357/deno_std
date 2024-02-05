class KvFilterIterator<T> {
  #iterator: Deno.KvListIterator<T>;
  #predicate: (entry: Deno.KvEntry<T>) => boolean;

  constructor(
    iterator: Deno.KvListIterator<T>,
    predicate: (entry: Deno.KvEntry<T>) => boolean,
  ) {
    this.#iterator = iterator;
    this.#predicate = predicate;
  }

  get cursor(): string {
    return this.#iterator.cursor;
  }

  async next() {
    return await this.#iterator.next();
  }

  async *[Symbol.asyncIterator]() {
    for await (const entry of this.#iterator) {
      if (this.#predicate(entry)) {
        yield entry;
      }
    }
  }
}

export function filter<T>(
  kv: Deno.Kv,
  selector: Deno.KvListSelector,
  predicate: (entry: Deno.KvEntry<T>) => boolean,
  options?: Deno.KvListOptions,
): Deno.KvListIterator<T> {
  return new KvFilterIterator(kv.list<T>(selector, options), predicate);
}
