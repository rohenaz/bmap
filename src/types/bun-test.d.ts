declare module "bun:test" {
  export interface Assertion {
    toBe(expected: any): void;
    toEqual(expected: any): void;
    toBeDefined(): void;
    toBeTruthy(): void;
    toThrow(expected?: string | RegExp): void;
    rejects: {
      toThrow(expected?: string | RegExp): Promise<void>;
    };
  }

  export function expect(actual: any): Assertion;
  export function describe(name: string, fn: () => void): void;
  export function test(name: string, fn: () => void | Promise<void>): void;
}
