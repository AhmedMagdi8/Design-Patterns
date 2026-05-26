// Open/Closed Principle (OCP):
// "Software entities (classes, modules, functions, etc.) should be open for
// extension, but closed for modification." — Bertrand Meyer
// You should be able to add new behavior without editing existing, working
// code. This is typically achieved through abstraction and polymorphism
// (interfaces, inheritance, composition, higher-order functions) so that new
// requirements plug in as new code rather than as edits to old code.
//
// OCP is not limited to classes — it applies at every level of abstraction:
//   - Functions:   accept strategies/callbacks instead of hard-coded branches.
//   - Modules:     expose extension points (plugins, hooks, registries).
//   - Components:  accept children/props/slots to vary behavior without forks.
//   - Services:    version APIs or add new endpoints rather than mutating
//                  existing contracts.
// The underlying idea — extend behavior without destabilizing what already
// works — is language- and paradigm-agnostic.
//
// Example below: the naive ProductFilter violates OCP because every new
// criterion forces editing the class (state-space explosion: 3 criteria → 7
// methods). The Specification pattern fixes this — BetterFilter is closed for
// modification, while new criteria are added by writing new Specification
// classes (open for extension), and combinators like AndSpecification compose
// them.

let Color = Object.freeze({
  red: 'red',
  green: 'green',
  blue: 'blue'
});

let Size = Object.freeze({
  small: 'small',
  medium: 'medium',
  large: 'large',
  yuge: 'yuge'
});

class Product
{
  constructor(name, color, size)
  {
    this.name = name;
    this.color = color;
    this.size = size;
  }
}

class ProductFilter
{
  filterByColor(products, color)
  {
    return products.filter(p => p.color === color);
  }

  filterBySize(products, size)
  {
    return products.filter(p => p.size === size);
  }

  filterBySizeAndColor(products, size, color)
  {
    return products.filter(p =>
      p.size === size && p.color === color);
  }

  // state space explosion
  // 3 criteria (+weight) = 7 methods

  // OCP = open for extension, closed for modification
}

let apple = new Product('Apple', Color.green, Size.small);
let tree  = new Product('Tree', Color.green, Size.large);
let house = new Product('House', Color.blue, Size.large);

let products = [apple, tree, house];

// let pf = new ProductFilter();
// console.log(`Green products (old):`);
// for (let p of pf.filterByColor(products, Color.green))
//   console.log(` * ${p.name} is green`);

// ↑↑↑ BEFORE

// ↓↓↓ AFTER

// general interface for a specification
class ColorSpecification
{
  constructor(color)
  {
    this.color = color;
  }

  isSatisfied(item)
  {
    return item.color === this.color;
  }
}

class SizeSpecification {
  constructor(size)
  {
    this.size = size;
  }

  isSatisfied(item)
  {
    return item.size === this.size;
  }
}

class BetterFilter
{
  filter(items, spec)
  {
    return items.filter(x => spec.isSatisfied(x));
  }
}

// specification combinator
class AndSpecification
{
  constructor(...specs)
  {
    this.specs = specs;
  }

  isSatisfied(item)
  {
    return this.specs.every(x => x.isSatisfied(item));
  }
}

let bf = new BetterFilter();
console.log(`Green products (new):`);
for (let p of bf.filter(products,
  new ColorSpecification(Color.green)))
{
  console.log(` * ${p.name} is green`);
}

console.log(`Large products:`);
for (let p of bf.filter(products,
  new SizeSpecification(Size.large)))
{
  console.log(` * ${p.name} is large`);
}

console.log(`Large and green products:`);
let spec = new AndSpecification(
  new ColorSpecification(Color.green),
  new SizeSpecification(Size.large)
);
for (let p of bf.filter(products, spec))
  console.log(` * ${p.name} is large and green`);