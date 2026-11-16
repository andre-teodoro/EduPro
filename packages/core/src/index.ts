export interface StoragePort {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export class StorageError extends Error {
  constructor(
    public readonly code: "storageRead" | "storageWrite" | "storageInvalid",
  ) {
    super(code);
  }
}

export class JsonStorage {
  constructor(
    private readonly storage: StoragePort,
    private readonly key: string,
  ) {}

  read<T>(validate: (value: unknown) => value is T): T | null {
    let raw: string | null;
    try {
      raw = this.storage.getItem(this.key);
    } catch {
      throw new StorageError("storageRead");
    }
    if (raw === null) return null;
    try {
      const value: unknown = JSON.parse(raw);
      if (!validate(value)) throw new Error("invalid");
      return value;
    } catch {
      throw new StorageError("storageInvalid");
    }
  }

  write(value: unknown): void {
    try {
      this.storage.setItem(this.key, JSON.stringify(value));
    } catch {
      throw new StorageError("storageWrite");
    }
  }

  clear(): void {
    try {
      this.storage.removeItem(this.key);
    } catch {
      throw new StorageError("storageWrite");
    }
  }
}
