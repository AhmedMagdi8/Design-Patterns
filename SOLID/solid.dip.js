// Dependency Inversion Principle (DIP):
// "High-level modules should not depend on low-level modules. Both should
// depend on abstractions. Abstractions should not depend on details; details
// should depend on abstractions." — Robert C. Martin
// Invert the natural direction of dependency: instead of business/policy code
// reaching down into concrete infrastructure, both sides agree on an
// abstraction (interface, protocol, contract) and depend on it. This keeps
// high-level policy decoupled from interchangeable low-level mechanisms
// (storage, transport, framework choice, etc.).
//
// Note: DIP is not the same as Dependency Injection. DI is a technique
// (passing collaborators in from the outside); DIP is the design principle
// that says those collaborators should be abstractions, not concretions.
//
// DIP is not limited to classes — it applies at every level of abstraction:
//   - Functions:   accept callbacks/strategies rather than calling concrete
//                  helpers directly.
//   - Modules:     depend on a port/interface module; let composition wire in
//                  the concrete adapter (hexagonal / ports-and-adapters).
//   - Components:  depend on prop/context contracts, not on specific data
//                  sources or services.
//   - Services:    talk through message contracts or API schemas, not direct
//                  database/library coupling.
// The underlying idea — depend on abstractions, not on details — is language-
// and paradigm-agnostic.
//
// Example below: the commented-out Research constructor depends directly on
// Relationships.data (a low-level storage detail) — a DIP violation, because
// changing storage breaks high-level research code. The fix has Research
// depend on the RelationshipBrowser abstraction; Relationships implements it,
// so storage can change freely without touching Research.

let Relationship = Object.freeze({
  parent: 0,
  child: 1,
  sibling: 2
});

class Person
{
  constructor(name)
  {
    this.name = name;
  }
}

// LOW-LEVEL (STORAGE)

class RelationshipBrowser
{
  constructor()
  {
    if (this.constructor.name === 'RelationshipBrowser')
      throw new Error('RelationshipBrowser is abstract!');
  }

  findAllChildrenOf(name) {}
}

class Relationships extends RelationshipBrowser
{
  constructor()
  {
    super();
    this.data = [];
  }

  addParentAndChild(parent, child)
  {
    this.data.push({
      from: parent,
      type: Relationship.parent,
      to: child
    });
    this.data.push({
      from: child,
      type: Relationship.child,
      to: parent
    });
  }


  findAllChildrenOf(name) {
    return this.data.filter(r =>
      r.from.name === name &&
      r.type === Relationship.parent
    ).map(r => r.to);
  }
}

// HIGH-LEVEL (RESEARCH)

class Research
{
  // constructor(relationships)
  // {
  //   // problem: direct dependence ↓↓↓↓ on storage mechanic
  //   let relations = relationships.data;
  //   for (let rel of relations.filter(r =>
  //     r.from.name === 'John' &&
  //     r.type === Relationship.parent
  //   ))
  //   {
  //     console.log(`John has a child named ${rel.to.name}`);
  //   }
  // }

  constructor(browser)
  {
    for (let p of browser.findAllChildrenOf('John'))
    {
      console.log(`John has a child named ${p.name}`);
    }
  }
}

let parent = new Person('John');
let child1 = new Person('Chris');
let child2 = new Person('Matt');

// low-level module
let rels = new Relationships();
rels.addParentAndChild(parent, child1);
rels.addParentAndChild(parent, child2);

new Research(rels);