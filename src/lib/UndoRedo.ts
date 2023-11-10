import { writable, type Readable } from "svelte/store";

interface UndoRedo<T> {
  can_undo: Readable<boolean>;
  can_redo: Readable<boolean>;
  undo(): T | undefined;
  redo(): T | undefined;
  action(action: T): void;
  list: T[];
}

export function createUndoRedo<T>(
  undos: T[] = [],
  redos: T[] = [],
): UndoRedo<T> {
  const can_undo = writable<boolean>(!!undos.length);
  const can_redo = writable<boolean>(!!redos.length);
  const update = () => {
    can_undo.set(!!undos.length);
    can_redo.set(!!redos.length);
  };
  return {
    get list() {
      return undos;
    },
    action: (a) => {
      undos.push(a);
      redos = [];
      update();
    },
    undo: () => {
      const changes = undos.pop();
      if (!changes) return changes;
      redos.push(changes);
      update();
      return changes;
    },
    redo: () => {
      const changes = redos.pop();
      if (!changes) return changes;
      undos.push(changes);
      update();
      return changes;
    },
    can_redo: {
      subscribe: can_redo.subscribe,
    },
    can_undo: {
      subscribe: can_undo.subscribe,
    },
  };
}
