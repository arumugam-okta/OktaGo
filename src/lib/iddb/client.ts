import fs from "node:fs";
import path from "node:path";

type Row = Record<string, unknown>;

type Result<T> = Promise<{ data: T | null; error: Error | null }>;

// Next.js compiles Route Handlers, Server Actions, and page Server Components
// as separate bundle layers in dev, each getting its own module instance —
// an in-memory Map would not be visible across layers. Persisting to a file
// keeps all layers reading/writing the same state.
const DB_FILE = path.join(process.cwd(), ".data", "iddb.json");

function readStore(): Record<string, Row[]> {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
  } catch {
    return {};
  }
}

function writeStore(store: Record<string, Row[]>): void {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
  fs.writeFileSync(DB_FILE, JSON.stringify(store, null, 2));
}

function readTable(name: string): Row[] {
  return readStore()[name] ?? [];
}

function writeTable(name: string, rows: Row[]): void {
  const store = readStore();
  store[name] = rows;
  writeStore(store);
}

class SelectQuery {
  private filters: Array<(row: Row) => boolean> = [];
  private orderBy?: { column: string; ascending: boolean };
  private rangeBounds?: { from: number; to: number };

  constructor(private tableName: string) {}

  eq(column: string, value: unknown): this {
    this.filters.push((row) => row[column] === value);
    return this;
  }

  order(column: string, opts?: { ascending?: boolean }): this {
    this.orderBy = { column, ascending: opts?.ascending ?? true };
    return this;
  }

  range(from: number, to: number): this {
    this.rangeBounds = { from, to };
    return this;
  }

  single(): Result<Row> {
    return this.exec().then(({ data, error }) => ({
      data: data?.[0] ?? null,
      error,
    }));
  }

  private exec(): Result<Row[]> {
    let rows = readTable(this.tableName).filter((row) =>
      this.filters.every((f) => f(row))
    );

    if (this.orderBy) {
      const { column, ascending } = this.orderBy;
      rows = [...rows].sort((a, b) => {
        const av = a[column];
        const bv = b[column];
        if (av === bv) return 0;
        const cmp = av! > bv! ? 1 : -1;
        return ascending ? cmp : -cmp;
      });
    }

    if (this.rangeBounds) {
      rows = rows.slice(this.rangeBounds.from, this.rangeBounds.to + 1);
    }

    return Promise.resolve({ data: rows, error: null });
  }

  then<TResult1 = { data: Row[] | null; error: Error | null }, TResult2 = never>(
    onfulfilled?:
      | ((value: { data: Row[] | null; error: Error | null }) => TResult1 | PromiseLike<TResult1>)
      | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ) {
    return this.exec().then(onfulfilled, onrejected);
  }
}

class InsertQuery {
  constructor(private tableName: string, private values: Row) {}

  select(): { single: () => Result<Row> } {
    return {
      single: (): Result<Row> => {
        const row = { ...this.values };
        writeTable(this.tableName, [...readTable(this.tableName), row]);
        return Promise.resolve({ data: row, error: null });
      },
    };
  }
}

class DeleteQuery {
  constructor(private tableName: string) {}

  eq(column: string, value: unknown): Result<null> {
    const remaining = readTable(this.tableName).filter(
      (row) => row[column] !== value
    );
    writeTable(this.tableName, remaining);
    return Promise.resolve({ data: null, error: null });
  }
}

class TableRef {
  constructor(private tableName: string) {}

  select(_columns = "*"): SelectQuery {
    return new SelectQuery(this.tableName);
  }

  insert(values: Row): InsertQuery {
    return new InsertQuery(this.tableName, values);
  }

  delete(): DeleteQuery {
    return new DeleteQuery(this.tableName);
  }
}

export function createIddbClient(_config: { tenant: string; key: string }) {
  return {
    from(tableName: string): TableRef {
      return new TableRef(tableName);
    },
  };
}
