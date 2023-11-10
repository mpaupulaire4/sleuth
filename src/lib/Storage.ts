import { Preferences } from "@capacitor/preferences";

export interface Saveable {
  key: string;
  toStorageString(): string;
}

export interface Loadable {
  key: string;
  fromStorageString(data: string | null): void;
}

export async function save(a: Saveable): Promise<void> {
  return Preferences.set({ key: a.key, value: a.toStorageString() });
}

export async function load(a: Loadable): Promise<void> {
  const { value } = await Preferences.get({ key: a.key });
  return a.fromStorageString(value);
}
