var numProps = 0;

function lexExp(symbol, index){
  var lex = {};
  switch(symbol){
    case Unot: lex = new newConnective(CONNECTIVE.NEGATION.value); break;
    case Uand: lex = new newConnective(CONNECTIVE.CONJUNCTION.value); break;
    case Uor: lex = new newConnective(CONNECTIVE.DISJUNCTION.value); break;
    case Urarr: lex = new newConnective(CONNECTIVE.IMPLICATION.value); break;
    case Uharr: lex = new newConnective(CONNECTIVE.BICONDITIONAL.value); break;
    case Uthus: lex = CONNECTIVE.THUS; break;
    case '(': lex = PAREN.LPAREN; break;
    case ')': lex = PAREN.RPAREN; break;

    default:
    lex.name = symbol;
    lex.type = TYPE.PROPOSITION;
    lex.value = TYPE.PROPOSITION.value;
    break;
  }

  lex.index = index;
  lex.children = [];
  lex.paren = null;
  lex.sipling = null;
  lex.hasPrinted = false;

  return lex;
}

function parseSentence() {
  resetTable();
  startLoader();

  var form = document.getElementById("form");

  var lexIndex = 0;
  numProps = 0;

  var expArr = document.getElementById("inputfield").value.split("");
  var output = [];

  // lexify all inputs
  var i;
  for (i = 0; i < expArr.length; i++) {
    output.push(lexExp(expArr[i], i));
  }

  if (isIllFormed(output)) {
    return;
  }

  // logical parsing is done for now.

  // lets build an HTML-table showing truthvalues, and do some evalutian
  // only if its a logical expression, not a syllogism

  document.getElementById("tableautitle").style.visibility = "visible";
  document.getElementById("myCanvas").style.visibility = "visible";

  if (numThus(output) == 0) {
    document.getElementById("tabletitle").style.visibility = "visible";
    document.getElementById("truthtable").style.visibility = "visible";

    var root = buildObject(output);
    buildHTMLTable(root, output);
  }

  // analyze the syllogism by a logical plateau
  var thusPos = findTherefore(output);
  var root;

  if (thusPos == -1) {
    root = buildObject(output);
  } else {
    var conclusionList = output.slice(thusPos + 1, output.length + 1);
    var premisesList = output.slice(0, thusPos);

    incrementIndex(premisesList, 1);

    premisesList.unshift(lexExp('(', 0));
    premisesList.push(lexExp(')', 0));

    incrementIndex(conclusionList, premisesList.length);

    conclusionList.unshift(lexExp('(', 0));
    conclusionList.unshift(lexExp(Unot, 1 + premisesList.length));
    conclusionList.unshift(lexExp(Uand, premisesList.length));
    conclusionList.push(lexExp(')', 0));

    var totallist = premisesList.concat(conclusionList);
    root = buildObject(totallist);

    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
  }


  buildHTMLTree(root, 0, 0);
}

// recursively builds a logical expression
//  into a tree, finding the main connective over and over again
function buildObject(exprList) {

  if (exprList.length == 0) {
    return null;
  } else if (exprList.length == 1 && exprList[0].type.value == TYPE.PROPOSITION.value) {
    return exprList[0];
  }

  var root = findRoot(exprList);

  // if theres is no root in exp-list, (no logical operators)
  // then find first proposition and return it
  if (!root) {
    return firstProp(exprList);
  }

  if (root.value == CONNECTIVE.NEGATION.value) {

    var findex = findIndex(exprList, root);
    var childObject = buildObject(exprList.slice(findex + 1, exprList.length + 1));

    if (childObject && root.children.length === 0) {
      childObject.paren = root;
      root.children.push(childObject);
    } else {
      parseError(err0 + (root.index + 1) + "!");
      return;
    }

  } else if (isCon(root) && !isNOT(root)) {

    var findex = findIndex(exprList, root);

    var childObject = buildObject(exprList.slice(0, findex));
    childObject.paren = root;
    if (childObject) {
      root.children.push(childObject);

      if (childObject.type.value == TYPE.PROPOSITION.value)
        numProps++;
    }

    childObject = buildObject(exprList.slice((findex + 1), (exprList.length + 1)));
    childObject.paren = root;
    if (childObject) {
      root.children.push(childObject);

      if (childObject.type.value == TYPE.PROPOSITION.value)
        numProps++;
    }

    if (root.children.length != 2) {
      parseError(err1 + root.type.name + err2 + (root.index + 1) + "!");
      return;
    }
  }

  return root;
}

/// returns the root from a list of logical operators
// and parentheses. uses operatorprecendence rules


function findRoot(expList) {

  if (expList.length == 0)
    return;
  var root;

  inparen = false;
  rparen = 0;
  lparen = 0;

  for (j = 0; j < expList.length; j++) {

    if (j == 0 && isNOT(expList[0]) && allExpInParen(expList)) {
      root = expList[0];
      break;
    }
    if (allNOT(expList)) {
      root = expList[0];
      break;
    }
    if (isLParen(expList[j])) {
      inparen = true;
      lparen++;
    }
    if (isRParen(expList[j])) {
      rparen++;

      if (rparen == lparen)
        inparen = false;
    }
    if (!inparen && isCon(expList[j]) && !isNOT(expList[j])) {
      root = expList[j];
      break;
    }
  }
  if (!root) {
    root = findRoot(expList.slice(1, expList.length));
  }
  if (root) {
    root.children = new Array();
  }

  return root;
}


// returns whether all expressions in a list
//  is in side a parentheses

function allExpInParen(expList) {

  if (expList.length == 1)
    return true;

  inparen = false;

  for (i = 1; i < expList.length; i++) {

    if (isLParen(expList[i])) {
      inparen = true;
      lparen++;
    } else if (isRParen(expList[i])) {
      rparen++;

      if (rparen == lparen)
        inparen = false;
    } else if (!inparen && isCon(expList[i])) {
      return false;
    }
  }

  return true;
}

function findPropValue(arr, prop) {
  var val = "";

  var i;
  for (i = 0; i < arr.length; i++) {
    if (arr[i].prop == prop.name)
      val = arr[i].truth;
  }

  return val;
}


function interpretRow(truthrow, root) {

  var result = {};
  var par1;
  var par2;

  result.truth = "?";

  if (root.type.value == TYPE.PROPOSITION.value) {
    result.truth = findPropValue(truthrow, root);
    result.prop = root.name;
  } else if (root.value == CONNECTIVE.NEGATION.value) {
    par1 = interpretRow(truthrow, root.children[0]);

    if (par1.truth == "F")
      result.truth = "T";
    else
      result.truth = "F";

  } else if (root.value == CONNECTIVE.CONJUNCTION.value) {
    par1 = interpretRow(truthrow, root.children[0]);
    par2 = interpretRow(truthrow, root.children[1]);

    if (par1.truth == "T" && par2.truth == "T")
      result.truth = "T";
    else
      result.truth = "F";

  } else if (root.value == CONNECTIVE.DISJUNCTION.value) {
    par1 = interpretRow(truthrow, root.children[0]);
    par2 = interpretRow(truthrow, root.children[1]);

    if (par1.truth == "T" || par2.truth == "T")
      result.truth = "T";
    else
      result.truth = "F";
  } else if (root.value == CONNECTIVE.IMPLICATION.value) {
    par1 = interpretRow(truthrow, root.children[0]);
    par2 = interpretRow(truthrow, root.children[1]);

    if (par1.truth == "T" && par2.truth == "F")
      result.truth = "F";
    else
      result.truth = "T";

  } else if (root.value == CONNECTIVE.BICONDITIONAL.value) {
    par1 = interpretRow(truthrow, root.children[0]);
    par2 = interpretRow(truthrow, root.children[1]);

    if (par1.truth == par2.truth)
      result.truth = "T";
    else
      result.truth = "F";
  }
  return result;
}