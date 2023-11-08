import type { Subscriber, Unsubscriber, Readable } from "svelte/store";

export class Cell<T> extends Set<T> implements Readable<Set<T>> {
  private subscribers: Subscriber<Cell<T>>[] = [];

  set = (v: T): boolean => {
    let changed = false;
    for (let i of this) {
      if (i !== v) {
        changed = true;
        this.delete(i);
      }
    }
    return changed;
  };

  toggle(v: T) {
    if (!this.delete(v)) {
      this.add(v);
    }
  }

  get(): T | undefined {
    const it = this.values().next();

    if (!it.done) {
      return it.value;
    }
    return undefined;
  }

  is(id: T) {
    return this.has(id) && this.size === 1;
  }

  notify = () => {
    this.subscribers.forEach((sub) => sub(this));
  };

  subscribe = (run: Subscriber<Cell<T>>): Unsubscriber => {
    this.subscribers.push(run);
    run(this);
    return () => {
      const i = this.subscribers.findIndex((s) => s === run);
      if (i > -1) this.subscribers.splice(i, 1);
    };
  };
}
