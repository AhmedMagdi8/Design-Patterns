// Liskov Substitution Principle (LSP):
// "Objects of a superclass should be replaceable with objects of its subclasses
// without breaking the correctness of the program." — Barbara Liskov
// A subtype must honor the behavioral contract of its supertype: same
// expectations about inputs (preconditions can't be strengthened), outputs
// (postconditions can't be weakened), and invariants. If callers must check
// the concrete type to use it correctly, LSP is broken.
//
// LSP is not limited to class inheritance — it applies wherever one type
// stands in for another:
//   - Functions:    a function passed in place of another must accept the
//                   same inputs and produce compatible outputs.
//   - Interfaces:   any implementation must fully satisfy the contract.
//   - Duck typing:  objects sharing a "shape" must share its semantics, not
//                   just its method names.
//   - APIs:         a v2 response must be usable anywhere v1 was.
// The underlying idea — substitutability without surprises — is language- and
// paradigm-agnostic.
//
// Example below: Square extends Rectangle but overrides the width/height
// setters to keep sides equal. This breaks code (useIt) that legitimately
// expects setting height on a Rectangle to leave its width alone — so Square
// is not a true behavioral subtype of Rectangle, even though it "is-a"
// rectangle mathematically. The fix is usually to model them as separate
// types rather than forcing an inheritance relationship.

class Rectangle
{
  constructor(width, height)
  {
    this._width = width;
    this._height = height;
  }

  get width() { return this._width; }
  get height() { return this._height; }

  set width(value) { this._width = value; }
  set height(value) { this._height = value; }

  get area()
  {
    return this._width * this._height;
  }

  toString()
  {
    return `${this._width}×${this._height}`;
  }
}

class Square extends Rectangle
{
  constructor(size)
  {
    super(size, size);
  }

  set width(value)
  {
    this._width = this._height = value;
  }

  set height(value)
  {
    this._width = this._height = value;
  }
}

let useIt = function(rc)
{
  let width = rc._width;
  rc.height = 10;
  console.log(
    `Expected area of ${10*width}, ` +
    `got ${rc.area}`
  );
};

let rc = new Rectangle(2,3);
useIt(rc);

let sq = new Square(5);
useIt(sq);