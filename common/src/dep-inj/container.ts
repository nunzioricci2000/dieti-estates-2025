type Resolver = {
    name: string;
    dependencies: string[];
    execute: (...args: any[]) => any;
};

class Container {
    private constructor(private resolvers: Record<string, Resolver>) {
        console.log("Container created with resolvers:", resolvers);
    }

    static create(): Container {
        console.log("Creating a new container...");
        return new Container({});
    }

    register(
        name: string,
        dependencies: string[],
        resolver: (...args: any[]) => any,
    ): Container {
        console.log(
            `Registering component: ${name} with dependencies: ${dependencies}`,
        );
        const resolvable = dependencies.every((dep) => dep in this.resolvers);
        if (!resolvable) {
            console.warn(
                `Cannot resolve dependencies for component: ${name}. Missing dependencies: ${dependencies.filter((dep) => !(dep in this.resolvers))}`,
            );
            return new Container({
                ...this.resolvers,
                [name]: {
                    name,
                    dependencies,
                    execute: resolver,
                },
            });
        }
        console.log(
            `All dependencies for component: ${name} are resolvable. Resolving...`,
        );
        const resolvedDependencies = dependencies.map((dep) => this.get(dep));
        const resolvedComponent = resolver(...resolvedDependencies);
        var result = new Container({
            ...this.resolvers,
            [name]: {
                name,
                dependencies: [],
                execute: () => resolvedComponent,
            },
        });
        console.log(
            `Component ${name} registered successfully. Updating dependent resolvers...`,
        );
        for (const res in this.resolvers) {
            const deps = this.resolvers[res]!.dependencies;
            if (
                deps.includes(name) &&
                deps.every((dep) => dep in this.resolvers || dep === name)
            ) {
                console.log(`Updating resolver: ${res} which depends on: ${name}`);
                const resovedDependencies = deps.map((dep) =>
                    dep === name ? resolvedComponent : this.get(dep),
                );
                const rc = this.resolvers[res]!.execute(...resovedDependencies);
                result = result.register(res, [], () => rc);
            }
        }
        return result;
    }

    get(name: string): any {
        console.log(`Resolving component: ${name}`);
        const resolver = this.resolvers[name];
        if (!resolver) {
            throw new Error(`Component ${name} not found`);
        }
        if (resolver.dependencies.length !== 0) {
            throw new Error(
                `Component ${name} has unresolved dependencies: ${resolver.dependencies.filter((dep) => !(dep in this.resolvers))}`,
            );
        }
        return resolver.execute();
    }

    private updateResolvers(resolver: Resolver): Record<string, Resolver> {
        console.log(`Resolving with resolver: ${resolver.name}`);
        var resolvedDependencies: Record<string, Resolver> = { ...this.resolvers };
        resolver.dependencies.forEach((dep) => {
            if (!(dep in resolvedDependencies)) {
                const depResolver = this.resolvers[dep];
                if (!depResolver) {
                    return {
                        ...resolvedDependencies,
                        resolver,
                    };
                }
                resolvedDependencies = {
                    ...resolvedDependencies,
                    ...this.updateResolvers(depResolver),
                };
            }
        });
        return {
            ...resolvedDependencies,
            [resolver.name]: resolver,
        };
    }
}

const container = Container.create()
    .register("risultato", ["somma"], (somma) => {
        console.log("Resolving risultato...");
        return somma * somma;
    })
    .register("addendo1", [], () => {
        console.log("Resolving addendo1...");
        return 5;
    })
    .register("somma", ["addendo1", "addendo2"], (addendo1, addendo2) => {
        console.log("Resolving somma...");
        return addendo1 + addendo2;
    })
    .register("addendo2", [], () => {
        console.log("Resolving addendo2...");
        return 10;
    });

console.log(container.get("risultato")); // Output: 15
