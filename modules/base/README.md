# Yggdrasil template - Base module

This module defines what function yggdrasil modules should have.

Generally, a module should depend on these packages:

- `@yggdrasil-template/base`: this package
- `drizzle-orm`: the ORM used by yggdrasil
- `fp-ts`: the functional programming library used by yggdrasil

General dependencies should be injected in the module constructor.

Any modules' interface must be defined clearly.

```ts
export interface YggdrasilModule<I> {
  (deps: CommonDependencies): I;
}
```

Some modules may use Redis as dependency. In this case, use `ioredis` package.