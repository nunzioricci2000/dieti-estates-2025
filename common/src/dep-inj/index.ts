// Define how the container saves the registered components and their dependencies.
type ComponentDef = { deps: readonly string[]; result: any };
type Registry = Record<string, ComponentDef>;

// Checks if all dependencies in Deps are included in ResolvedKeys. If yes, returns true; otherwise, false.
type AreDepsSatisfied<Deps extends readonly string[], ResolvedKeys extends string> =
    Exclude<Deps[number], ResolvedKeys> extends never ? true : false;

// Returns a new type with only the components from Reg whose dependencies are satisfied by ResolvedKeys.
type ResolvePass<Reg extends Registry, ResolvedKeys extends string> = {
    [K in keyof Reg as AreDepsSatisfied<Reg[K]["deps"], ResolvedKeys> extends true ? K : never]: Reg[K]["result"];
};

// Recursively computes the fully resolved map of components.
// Every iteration adds new components whose dependencies are satisfied by the currently resolved keys, until no new components can be added.
type ComputeResolved<
    Reg extends Registry,
    ResolvedMap extends Record<string, any> = {}
> = ResolvePass<Reg, keyof ResolvedMap & string> extends infer NextMap
    ? NextMap extends Record<string, any>
    ? [Exclude<keyof NextMap, keyof ResolvedMap>] extends [never]
    ? ResolvedMap // No new keys found: we have resolved everything we can, return the current map
    : ComputeResolved<Reg, ResolvedMap & NextMap> // New keys found: add them to the resolved map and continue resolving
    : never
    : never;

// Runtime representation of a registered component, used internally in the Container class.
type InternalResolver = {
    name: string;
    dependencies: string[];
    execute: (...args: any[]) => any;
};

export class Container<Reg extends Registry = {}> {
    private constructor(
        private resolvers: Record<string, InternalResolver>,
        private resolvedComponents: Record<string, any>,
    ) { }

    static create(): Container<{}> {
        return new Container({}, {});
    }

    register<
        Name extends string,
        const Deps extends readonly string[],
        Args extends any[],
        Result
    >(
        name: Name,
        dependencies: Deps,
        resolver: (...args: Args) => Result,
    ): Container<Reg & Record<Name, { deps: Deps; result: Result }>> {

        if (dependencies.some((dep) => this.resolvedComponents[dep] === undefined)) {
            return new Container(
                {
                    ...this.resolvers,
                    [name]: { name, dependencies: [...dependencies], execute: resolver },
                },
                { ...this.resolvedComponents },
            ) as any;
        }

        const resolvedDependencies = dependencies.map((dep) => this.resolvedComponents[dep]);
        const resolvedValue = resolver(...resolvedDependencies as any);

        const newResolvers = { ...this.resolvers };
        if (name in newResolvers) delete newResolvers[name];

        let result = new Container<any>(
            { ...newResolvers },
            { ...this.resolvedComponents, [name]: resolvedValue },
        );

        for (const [_, currentResolver] of Object.entries(this.resolvers)) {
            if (currentResolver.dependencies.every((dep) => dep in this.resolvedComponents || dep === name)) {
                const deps = currentResolver.dependencies.map((dep) =>
                    dep === name ? resolvedValue : this.resolvedComponents[dep],
                );
                const value = currentResolver.execute(...deps);
                result = result.register(currentResolver.name, [], () => value);
            }
        }

        return result as any;
    }

    get<
        ResolvedMap extends ComputeResolved<Reg> = ComputeResolved<Reg>,
        Name extends keyof ResolvedMap & string = keyof ResolvedMap & string
    >(name: Name): ResolvedMap[Name] {
        if (name in this.resolvedComponents) {
            return this.resolvedComponents[name];
        }
        throw new Error(`Component: ${name} is registered but its dependencies are not satisfied.`);
    }
}
