// TYPE ENUMS
var TYPE = {
  TRUTHVALUE : {value: 0, name: "TRUTHVALUE"}, 
  CONNECTIVE: {value: 1, name: "CONNECTIVE"},
  PROPOSITION: {value: 2, name: "PROPOSITION"},
  PAREN: {value: 3, name: "PAREN"},
  EXP: {value: 4, name: "EXPRESSION"}
};

// EXP types
// not has one child, all others have two
var EXP = {
  NOT: {value: 5, name: "NOT", type: TYPE.EXP},
  AND: {value: 6, name: "AND", type: TYPE.EXP},
  OR: {value: 7, name: "OR", type: TYPE.EXP},
  IMPLICATION: {value: 8, name: "IMPLICATION", type: TYPE.EXP},
  BICONDITIONAL: {value: 9, name: "BICONDITIONAL", type: TYPE.EXP}
};

// TRUE FALSE ENUMS
var TRUTHVALUE = {
  FALSE : {value: 10, name: "TRUE", type: TYPE.TRUTHVALUE}, 
  TRUE: {value: 11, name: "FALSE", type: TYPE.TRUTHVALUE}
};

// TRUE FALSE ENUMS
var PAREN = {
  RPAREN : {value: 12, name: "RPAREN", type: TYPE.PAREN}, 
  LPAREN: {value: 13, name: "LPAREN", type: TYPE.PAREN}
};

// LOGICAL CONNECTIVE ENUMS
var CONNECTIVE = {
  NEGATION : {value: 14, name: "NOT", type: TYPE.CONNECTIVE}, 
  CONJUNCTION: {value: 15, name: "AND", type: TYPE.CONNECTIVE}, 
  DISJUNCTION : {value: 16, name: "OR", type: TYPE.CONNECTIVE},
  IMPLICATION : {value: 17, name: "RARROW", type: TYPE.CONNECTIVE},
  BICONDITIONAL : {value: 18, name: "RLARROW", type: TYPE.CONNECTIVE},
  THUS : {value: 19, name: "THUS", type: TYPE.CONNECTIVE}
};


// 'class' for connectives
// this is needed because the index needs to by unique, which is not possible with enums
function newConnective(type){
  var name;

  switch(type){
    case CONNECTIVE.NEGATION.value: name = "NOT"; break;
    case CONNECTIVE.CONJUNCTION.value: name = "AND"; break;
    case CONNECTIVE.DISJUNCTION.value: name = "OR"; break;
    case CONNECTIVE.IMPLICATION.value: name = "RARROW"; break;
    case CONNECTIVE.BICONDITIONAL.value: name = "RLARROW"; break;
    case CONNECTIVE.THUS.value: name = "THUS"; break;
    default: name = ""; break;
  }

  this.name = name;
  this.value = type;
  this.type = TYPE.CONNECTIVE;
  this.index = 0;
}


