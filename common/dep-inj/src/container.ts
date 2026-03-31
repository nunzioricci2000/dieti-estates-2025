type Resolver<Name extends string | number | symbol, Dependencies, Result> = (deps: Dependencies) => Result;

type NameOf<R extends Resolver<any, any, any>> = R extends Resolver<infer N, any, any> ? N : never;
type DependenciesOf<R extends Resolver<any, any, any>> = R extends Resolver<any, infer D, any> ? D : never;
type ResultOf<R extends Resolver<any, any, any>> = R extends Resolver<any, any, infer Res> ? Res : never;


class Container<Resolvers extends Record<string | number | symbol, Resolver<any, any, any>> = {}> {
    private constructor(
        private resolvers: Resolvers
    ) {
        console.log("Container created with resolvers:", resolvers);
    }

    static create(): Container {
        console.log("Creating a new container...");
        return new Container({})
        console.log("Container instance created.");
    }

    add<Name extends string | number | symbol, Dependencies, Result>(name: Name, resolver: Resolver<Name, Dependencies, Result>): Container<Resolvers & { [name in Name]: Resolver<Name, Dependencies, Result> }> {
        console.log(`Adding resolver for ${String(name)}...`);
        const newResolver = { [name]: resolver } as { [name in Name]: Resolver<Name, Dependencies, Result> }
        console.log("New resolver added:", newResolver);
        return new Container<Resolvers & { [name in Name]: Resolver<Name, Dependencies, Result> }>({ ...this.resolvers, ...newResolver });
    }

    resolve<Name extends keyof Resolvers>(name: Name): ResultOf<Resolvers[Name]> {
        console.log(`Resolving ${String(name)}...`);
        const resolver = this.resolvers[name] as Resolver<Name, any, any>;
        const dependencies = resolver(this.resolvers as DependenciesOf<typeof resolver>);
        console.log(`Dependencies for ${String(name)}:`, dependencies);
        console.log(`Result for ${String(name)}:`, resolver(dependencies));
        return resolver(dependencies);
    }
}

const container = Container.create()
    .add("addendo1", (deps: {}) => { console.log("Resolving addendo1..."); return 5; })
    .add("addendo2", (deps: {}) => { console.log("Resolving addendo2..."); return 10; })
    .add("somma", (deps: { addendo1: number, addendo2: number }) => { console.log("Resolving somma..."); return deps.addendo1 + deps.addendo2; })

console.log(container.resolve("somma")); // Output: 15