var fmc = require("./formality_core.js");

// Base code
var code = `
  Bool : Type
    self(P : (x : Bool) -> Type;) ->
    (t : P(true)) ->
    (f : P(false)) ->
    P(self)

  true : Bool
    (P;) => (t) => (f) => t

  false : Bool
    (P;) => (t) => (f) => f

  Nat : Type
    self(P : (x : Nat) -> Type;) ->
    (z : P(zero)) ->
    (s : (pred : Nat) -> P(succ(pred))) ->
    P(self)

  zero : Nat
    (P;) => (z) => (s) => z

  succ : (n : Nat) -> Nat
    (n) => (P;) => (z) => (s) => s(n)

  double : (n : Nat) -> Nat
    (n) => n((x) => Nat;)(zero)((pred) => pred)

  elim : (b : Bool) ->
         (P : (x : Bool) -> Type;) ->
         (t : P(true)) ->
         (f : P(false)) ->
         P(b)
    (b) => (P;) => (t) => (f) => b(P;)(t)(f)

  main : Nat
    double(zero)
`;

// Parses module
var module = fmc.parse_mod(code, 0);

// Normalizes and type-checks all terms
for (var name in module) {
  console.log("name:", name);
  console.log("term:", fmc.stringify_trm(module[name].term));
  try {
    console.log("norm:", fmc.stringify_trm(fmc.normalize(module[name].term, module)));
  } catch (e) {
    console.log("norm:", fmc.stringify_trm(fmc.reduce(module[name].term, module)));
  }
  try {
    console.log("type:", fmc.stringify_trm(fmc.typecheck(module[name].term, module[name].type, module)));
  } catch (e) {
    console.log("type:", e);
  }
  console.log("");
};

// FIXME true === false ?
console.log(fmc.equal(module.true.term, module.false.term, module));
