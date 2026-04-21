type Resolver = {
    name: string;
    dependencies: string[];
    execute: (...args: any[]) => any;
};

class Container {
    private constructor(
        private resolvers: Record<string, Resolver>,
        private resolvedComponents: Record<string, unknown>,
    ) {
        console.log("Container created with resolvers:", resolvers);
    }

    static create(): Container {
        console.log("Creating a new container...");
        return new Container({}, {});
    }

    register(
        name: string,
        dependencies: string[],
        resolver: (...args: any[]) => any,
    ): Container {
        console.log(`Registering component: ${name} with dependencies: ${dependencies.join(", ")}`);
        if (dependencies.some((dep) => this.resolvedComponents[dep] === undefined)) {
            return new Container(
                {
                    ...this.resolvers,
                    [name]: { name, dependencies, execute: resolver },
                },
                { ...this.resolvedComponents },
            );
        }
        const resolvedDependencies = dependencies.map((dep) => this.resolvedComponents[dep]);
        const resolvedValue = resolver(...resolvedDependencies);
        console.log(`Component: ${name} resolved with value:`, resolvedValue);
        const newResolvers = { ...this.resolvers };
        if (name in newResolvers) delete newResolvers[name];
        var result = new Container(
            { ...newResolvers },
            { ...this.resolvedComponents, [name]: resolvedValue },
        );
        for (const [_, resolver] of Object.entries(this.resolvers)) {
            if (resolver.dependencies.every((dep) => dep in this.resolvedComponents || dep === name)) {
                const deps = resolver.dependencies.map((dep) =>
                    dep === name ? resolvedValue : this.resolvedComponents[dep],
                );
                const value = resolver.execute(...deps);
                console.log(`Resolving dependent component: ${resolver.name} with value:`, value);
                result = result.register(resolver.name, [], () => value);
            }
        }
        return result;
    }

    get(name: string): any {
        console.log(`Resolving component: ${name} `);
        if (name in this.resolvedComponents) {
            console.log(`Component: ${name} found in resolved components. Returning cached value.`);
            return this.resolvedComponents[name];
        }
        if (name in this.resolvers) {
            throw new Error(`Component: ${name} is registered but not resolved yet. Please ensure all dependencies are registered and resolvable.`);
        }
        throw new Error(`Component: ${name} is not registered in the container.`);
    }
}

/// =======================================================================
/// TEST AREA THIS IS NOT PART OF THE FINAL CODE, JUST FOR TESTING PURPOSES
/// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

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

console.log(container.get("risultato")); // Output: 225
