import { writable, type Readable } from "svelte/store";
import type { Loadable, Saveable } from "./Storage";
import type { Change } from "./Game/Board";

const STACK_SAVE_KEY = "STACK_SAVE_KEY";

export class Stack implements Loadable, Saveable {
  protected undos: Set<Change>[] = [];
  protected redos: Set<Change>[] = [];
  protected update: () => void;

  can_undo: Readable<boolean>;
  can_redo: Readable<boolean>;

  constructor() {
    const { set: set_undo, subscribe: undo_sub } = writable<boolean>(false);
    const { set: set_redo, subscribe: redo_sub } = writable<boolean>(false);
    this.update = () => {
      set_undo(!!this.undos.length);
      set_redo(!!this.redos.length);
    };
    this.can_undo = {
      subscribe: undo_sub,
    };
    this.can_redo = {
      subscribe: redo_sub,
    };
  }

  get key() {
    return STACK_SAVE_KEY;
  }

  private pop(end = true): Set<Change> | undefined {
    const [undos, redos] = end
      ? [this.undos, this.redos]
      : [this.redos, this.undos];
    const changes = undos.pop();
    if (!changes) return changes;
    redos.push(changes);
    this.update();
    return changes;
  }

  clear() {
    this.undos = [];
    this.redos = [];
    this.update();
  }

  action(a: Set<Change>) {
    this.undos.push(a);
    this.redos = [];
    this.update();
  }

  undo(): Set<Change> | undefined {
    return this.pop(true);
  }

  redo(): Set<Change> | undefined {
    return this.pop(false);
  }

  toStorageString(): string {
    return [
      this.undos.map(changeSetToString).join(","),
      this.redos.map(changeSetToString).join(","),
    ].join("$");
  }

  fromStorageString(data: string | null): void {
    if (!data) return;
    const [undo_data, redo_data] = data.split("$");
    this.undos = undo_data ? undo_data.split(",").map(changeSetFromString) : [];
    this.redos = redo_data ? redo_data.split(",").map(changeSetFromString) : [];
    console.log(this.undos, this.redos);
    this.update();
  }
}

function changeSetFromString(data: string): Set<Change> {
  return new Set(data.split("|") as Change[]);
}

function changeSetToString(set: Set<Change>) {
  return [...set].join("|");
}
