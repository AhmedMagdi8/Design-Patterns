// Interface Segregation Principle (ISP):
// "Clients should not be forced to depend on methods they do not use."
// — Robert C. Martin
// Prefer many small, focused interfaces over one large, general-purpose one.
// A "fat" interface couples clients to capabilities they don't need, forcing
// stub implementations (no-ops, "not implemented" errors) and making changes
// ripple to unrelated consumers.
//
// ISP is not limited to OO interfaces — it applies at every level of
// abstraction:
//   - Functions:    take only the parameters they actually use; avoid passing
//                   giant "context" objects when a couple of fields suffice.
//   - Modules:      export narrow, purpose-built APIs rather than one
//                   kitchen-sink module.
//   - Components:   accept just the props they render; don't demand the whole
//                   domain object.
//   - Services:     expose role-specific endpoints rather than one generic
//                   "do everything" RPC.
// The underlying idea — depend only on what you actually use — is language-
// and paradigm-agnostic.
//
// Example below: Machine bundles print/fax/scan into one fat interface, so
// OldFashionedPrinter is forced to implement (or stub) scan() with a
// NotImplementedError — a classic ISP smell. The fix splits the contract
// into focused abstractions (Printer, Scanner) which devices then compose
// only as needed (e.g. Photocopier aggregates both).

var aggregation = (baseClass, ...mixins) => {
  class base extends baseClass {
    constructor (...args) {
      super(...args);
      mixins.forEach((mixin) => {
        copyProps(this,(new mixin));
      });
    }
  }
  let copyProps = (target, source) => {  // this function copies all properties and symbols, filtering out some special ones
    Object.getOwnPropertyNames(source)
      .concat(Object.getOwnPropertySymbols(source))
      .forEach((prop) => {
        if (!prop.match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/))
          Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop));
      })
  };
  mixins.forEach((mixin) => {
    // outside constructor() to allow aggregation(A,B,C).staticFunction() to be called etc.
    copyProps(base.prototype, mixin.prototype);
    copyProps(base, mixin);
  });
  return base;
};

class Document
{

}

class Machine
{
  constructor()
  {
    if (this.constructor.name === 'Machine')
      throw new Error('Machine is abstract!');
  }

  print(doc) {}
  fax(doc) {}
  scan(doc) {}
}

class MultiFunctionPrinter extends Machine
{
  print(doc) {
    //
  }

  fax(doc) {
    //
  }

  scan(doc) {
    //
  }
}

class NotImplementedError extends Error
{
  constructor(name)
  {
    let msg = `${name} is not implemented!`;
    super(msg);
    // maintain proper stack trace
    if (Error.captureStackTrace)
      Error.captureStackTrace(this, NotImplementedError);
    // your custom stuff here :)
  }
}

class OldFashionedPrinter extends Machine
{
  print(doc) {
    // ok
  }

  // omitting this is the same as no-op impl

  // fax(doc) {
  //   // do nothing
  // }

  scan(doc) {
    // throw new Error('not implemented!');
    throw new NotImplementedError(
      'OldFashionedPrinter.scan')
  }
}

// solution
class Printer
{
  constructor()
  {
    if (this.constructor.name === 'Printer')
      throw new Error('Printer is abstract!');
  }

  print(){}
}

class Scanner
{
  constructor()
  {
    if (this.constructor.name === 'Scanner')
      throw new Error('Scanner is abstract!');
  }

  scan(){}
}

class Photocopier extends aggregation(Printer, Scanner)
{
  print()
  {
    // IDE won't help you here
  }

  scan()
  {
    //
  }
}

// we don't allow this!
// let m = new Machine();

let printer = new OldFashionedPrinter();
printer.fax(); // nothing happens
//printer.scan();