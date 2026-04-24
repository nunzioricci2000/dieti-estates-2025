export type CreatorOf<
    ValueName extends string,
    Value,
    Ref = null,
> = null extends Ref
    ? {
        [K in `create${Capitalize<ValueName>}`]: (
            ...args: [Value]
        ) => Promise<Value>;
    }
    : Value extends Ref
    ? {
        [K in `create${Capitalize<ValueName>}`]: (
            ...args: [Value]
        ) => Promise<Value>;
    }
    : {
        [K in `create${Capitalize<ValueName>}`]: (
            ...args: [Ref, Value]
        ) => Promise<Ref>;
    };

export type ReaderOf<
    ValueName extends string,
    Value,
    Ref = null,
> = null extends Ref
    ? {
        [K in `read${Capitalize<ValueName>}`]: () => Promise<Value>;
    }
    : {
        [K in `read${Capitalize<ValueName>}`]: (ref: Ref) => Promise<Value>;
    };

export type UpdaterOf<
    ValueName extends string,
    Value,
    Ref = null,
> = null extends Ref
    ? {
        [K in `update${Capitalize<ValueName>}`]: (
            ...args: [Value]
        ) => Promise<Value>;
    }
    : Value extends Ref
    ? {
        [K in `update${Capitalize<ValueName>}`]: (
            ...args: [Value]
        ) => Promise<Value>;
    }
    : {
        [K in `update${Capitalize<ValueName>}`]: (
            ...args: [Ref, Value]
        ) => Promise<Value>;
    };

export type DeleterOf<
    ValueName extends string,
    Value,
    Ref = null,
> = null extends Ref
    ? {
        [K in `delete${Capitalize<ValueName>}`]: () => Promise<Value>;
    }
    : {
        [K in `delete${Capitalize<ValueName>}`]: (ref: Ref) => Promise<Value>;
    };

/**
 * Defines types for a generic repository pattern, allowing for the creation,
 * reading, updating, and deletion of values based on a reference. The types are
 * designed to be flexible, accommodating both cases where the value itself can
 * serve as a reference and cases where a separate reference is required.
 *
 * @template ValueName - The name of the value being managed, used to generate
 * method names.
 * @template Value - The type of the value being managed.
 * @template Ref - The type of the reference used to identify values, defaulting
 * to string, number, or symbol.
 *
 * @example
 *  type User = { username: string };
 *
 *  class UserRepository implements RepositoryOf<"User", User, User> {
 *      private users: Map<string, User> = new Map();
 *
 *      createUser(user: User): User {
 *          if (this.users.has(user.username)) {
 *              throw new ValueAlreadyExistsException(user.username);
 *          }
 *          this.users.set(user.username, user);
 *          return user;
 *      }
 *
 *      readUser(ref: User): User {
 *          const user = this.users.get(ref.username);
 *          if (!user) {
 *              throw new ValueNotFoundException(ref);
 *          }
 *          return user;
 *      }
 *
 *      updateUser(user: User): User {
 *          if (!this.users.has(user.username)) {
 *              throw new ValueNotFoundException(user.username);
 *          }
 *          this.users.set(user.username, user);
 *          return user;
 *      }
 *
 *      deleteUser(ref: User): User {
 *          const user = this.users.get(ref.username);
 *          if (!user) {
 *              throw new ValueNotFoundException(ref);
 *          }
 *          this.users.delete(ref.username);
 *          return user;
 *      }
 *  }
 *
 *  class PasswordRepository implements RepositoryOf<"Password", string, User> {
 *      private passwords: Map<string, string> = new Map();
 *
 *      createPassword(user: User, password: string): User {
 *          if (this.passwords.has(user.username)) {
 *              throw new ValueAlreadyExistsException(user);
 *          }
 *          this.passwords.set(user.username, password);
 *          return user;
 *      }
 *
 *      readPassword(user: User): string {
 *          const password = this.passwords.get(user.username);
 *          if (!password) {
 *              throw new ValueNotFoundException(user);
 *          }
 *          return password;
 *      }
 *
 *      updatePassword(user: User, password: string): string {
 *          if (!this.passwords.has(user.username)) {
 *              throw new ValueNotFoundException(user);
 *          }
 *          this.passwords.set(user.username, password);
 *          return password;
 *      }
 *
 *      deletePassword(user: User): string {
 *          const password = this.passwords.get(user.username);
 *          if (!password) {
 *              throw new ValueNotFoundException(user);
 *          }
 *          this.passwords.delete(user.username);
 *          return password;
 *      }
 *  }
 */
export type RepositoryOf<
    ValueName extends string,
    Value,
    Ref = null,
> = CreatorOf<ValueName, Value, Ref> &
    ReaderOf<ValueName, Value, Ref> &
    UpdaterOf<ValueName, Value, Ref> &
    DeleterOf<ValueName, Value, Ref>;

export class ValueAlreadyExistsException extends Error {
    readonly value: unknown;

    constructor(value: unknown) {
        super(`Value already exists: ${JSON.stringify(value)}`);
        this.name = "ValueAlreadyExistsException";
        this.value = value;
    }
}

export class ValueNotFoundException extends Error {
    readonly ref: unknown;

    constructor(ref: unknown) {
        super(`Value not found for reference: ${JSON.stringify(ref)}`);
        this.name = "ValueNotFoundException";
        this.ref = ref;
    }
}
