var printedProps = [];
var rownum = 0;
var err0;var err1;var err2; var err3; var err5;var err6;var err7;var err8;var err9;var err10;var err11;var err12;var err13;

function sleep(ms) {
  ms += new Date().getTime();
  while (new Date() < ms){}
} 

function logicalSymbol(root){
  var symbol;
  
  switch(root.value){
    case CONNECTIVE.NEGATION.value: symbol = Unot; break;
    case CONNECTIVE.CONJUNCTION.value: symbol = Uand; break;
    case CONNECTIVE.DISJUNCTION.value: symbol = Uor; break;
    case CONNECTIVE.IMPLICATION.value: symbol = Urarr; break;
    case CONNECTIVE.BICONDITIONAL.value: symbol = Uharr; break;
    case CONNECTIVE.THUS.value: symbol = Uthus; break;
    default: symbol = root.name; break;
  }
  
  return symbol;
}

function numCons(arr){
  var count = 0;
  var i;
  for(i = 0; i < arr.length; i++){
    if(arr[i].type.value == TYPE.CONNECTIVE.value){
      count++;
    }
  }
  return count;
}

/* returns first proposition in expressionList */
function firstProp(exprList){
  var i;
  for(i=0; i < exprList.length; i++){
   if(exprList[i].type.value == TYPE.PROPOSITION.value){
    return exprList[i];
  }
}
return null;
}

function findTherefore(exprList){
  var i;
  for(i = 0; i < exprList.length; i++){
   if(exprList[i].value == CONNECTIVE.THUS.value){
    return i;
  }
}
return -1;
}

function findIndex(exprList,root){
  var i;
  for(i = 0; i < exprList.length; i++){
   if(exprList[i].index == root.index){
    return i;
  }
}
return -1;
}

function numProp(arr){
  var count = 0;
  var i;
  for(i = 0; i < arr.length; i++){
    if(arr[i].type.value == TYPE.PROPOSITION.value){
      count++;
    }
  }
  return count;
}

function numTruth(arr){
  var count = 0;
  var i;
  for(i = 0; i < arr.length; i++){
    if(arr[i].type.value == TYPE.TRUTHVALUE.value){
      count++;
    }
  }
  return count;
}

function numParen(arr){
  var count = 0;
  var i;
  for(i = 0; i < arr.length; i++){
    if(arr[i].type.value == TYPE.PAREN.value){
      count++;
    }
  }
  return count;
}

function numRParen(arr){
  var count = 0;
  var i;
  for(i = 0; i < arr.length; i++){
    if(arr[i].value == PAREN.RPAREN.value){
      count++;
    }
  }
  return count;
}

function numLParen(arr){
  var count = 0;
  var i;
  for(i = 0; i < arr.length; i++){
    if(arr[i].value == PAREN.LPAREN.value){
      count++;
    }
  }
  return count;
}

function numThus(arr){
  var count = 0;
  var i;
  for(i = 0; i < arr.length; i++){
    if(arr[i].value == CONNECTIVE.THUS.value){
      count++;
    }
  }
  return count;
}

function isLParen(paren){
  if(!paren){
    return false;
  }
  
  return (paren.value == PAREN.LPAREN.value);
}

function isRParen(paren){
  if(!paren){
    return false;
  }

  return (paren.value == PAREN.RPAREN.value);
}

function isNOT(expr){
  if(!expr){
    return false;
  }
  
  return (expr.value == CONNECTIVE.NEGATION.value);
}

function isCon(expr){
  if(!expr){
    return false;
  }
  
  return expr.type.value == TYPE.CONNECTIVE.value;
}

function isProp(expr){
  if(!expr){
    return false;
  }  
  
  return expr.type.value == TYPE.PROPOSITION.value;
}

function stopLoader(){
  var loader = document.getElementById("loader");
  loader.style.visibility = "hidden";
}

function startLoader(){
  var loader = document.getElementById("loader");
  loader.style.visibility = "visible";
}

function hideItems(){
  document.getElementById("notbutton").disabled = true;
  document.getElementById("andbutton").disabled = true;
  document.getElementById("orbutton").disabled = true;
  document.getElementById("implicationbutton").disabled = true;
  document.getElementById("biconditionalbutton").disabled = true;
  document.getElementById("lparbutton").disabled = true;
  document.getElementById("rparbutton").disabled = true;
  document.getElementById("thusbutton").disabled = true;
  document.getElementById("e1").disabled = true;
  document.getElementById("e2").disabled = true;
  document.getElementById("e3").disabled = true;
  document.getElementById("pbutton").disabled = true;
  document.getElementById("qbutton").disabled = true;
  document.getElementById("rbutton").disabled = true;
  document.getElementById("sbutton").disabled = true;
  document.getElementById("gobutton").disabled = true;

  document.getElementById("tabletitle").style.visibility = "hidden";
  document.getElementById("truthtable").style.visibility = "hidden";
  document.getElementById("tableautitle").style.visibility = "hidden";
  document.getElementById("myCanvas").style.visibility = "hidden";
  stopLoader();
}

function parseError(str){
  hideItems();
  showItems();
  alert(str);
  throw new Error(str);
}

// still needs some checks
function isIllFormed(expr){

  // search for wrong characters
  var i;
  for(i = 0; i < expr.length; i++){
    if(isProp(expr[i])){
      if(expr[i].name.toUpperCase() == expr[i].name.toLowerCase()){
        parseError(err3 + expr[i].name + err2 + (i+1));
        return true;
      }
    }
  }
  
   // not more than one thus
   if(numThus(expr) > 1){
    parseError(err5);
    return true;
  }

  // at least one proposition
  if(numProp(expr) === 0){
    parseError(err6);
    return true;
  }
  
  // equal number of parentheses (and of same kind)
  if(numParen(expr) % 2 !== 0 || numLParen(expr) != numRParen(expr)){
    parseError(err7);
    return true;
  }
  
  // wrong parantheses. ie )(
  var lparen = false;
  var rparen = false;
  
  for(i = 0; i < expr.length; i++){
    if(isLParen(expr[i])){
      lparen = true;
    }
    if(isRParen(expr[i])){
      rparen = true;
    }
    
    if(rparen && !lparen){
      parseError(err8);
      return true;
    }    
  }

  // not two opposite parentheses side-by-side
  rparen = false;
  lparen = false;
  for(i = 0; i < expr.length; i++){
    if(isLParen(expr[i])){
      lparen = true;
    }
    else if(isRParen(expr[i])){
      rparen = true;
    }
    else{
      lparen = false;
      rparen = false;
    }
    
    if(rparen && lparen){
      parseError(err9);
      return true;
    }
    
  }
  
  // not two propositions side-by-side
  var propcount = 0;
  for(i = 0; i < expr.length; i++){
    if(expr[i].type.value == TYPE.PROPOSITION.value){
      propcount++;
    }
    else{
      if(propcount !== 0){
        propcount--;
      }
    }
    
    if(propcount == 2){
      parseError(err10);
      return true;
    }
  }
  
  // not two connectives side-by-side (except NOT)
  var concount = 0;
  for(i = 0; i < expr.length; i++){
    if(expr[i].type.value == TYPE.CONNECTIVE.value && !isNOT(expr[i])){
      concount++;
    }
    else{
      if(concount !== 0){
        concount--;
      }
    }
    
    if(concount == 2){
      parseError(err11);
      return true;
    }
  }
  
  // first item cant be connective (except NOT)
  
  if(expr[0].type.value == TYPE.CONNECTIVE.value && !isNOT(expr[0])){
    parseError(err12);
    return true;
  }
  
  // last item cant be connective
  if(expr[expr.length-1].type.value == TYPE.CONNECTIVE.value){
    parseError(err13);
    return true;
  }
  
  return false;
}

function insertRow(list){

  var table = document.getElementById("truthtable");
  var rowCount = table.rows.length;
  var row = table.insertRow(rowCount);
  var cell;
  
  var i;
  for(i = 0; i < list.length; i++){
    cell = row.insertCell(i);
    cell.innerHTML = list[i].truth;
  }
}

function insertCell(character){
  if(printedProps.indexOf(character) == -1){
    printedProps.push(character);
  }
  else{
    return;
  }
  
  var table = document.getElementById("truthtable");
  var rowCount = table.rows.length;
  
  if(rowCount === 0){
    table.insertRow(0);
  }
  
  var row = table.rows[0];
  var cell = row.insertCell(0);
  cell.innerHTML = "<strong>"+character+"</strong>";
  
}

function stringOfRoot(root){

 var con = logicalSymbol(root);
 var result = "";
 
 if(!root.children || root.children.length === 0 || root.type.value == TYPE.PROPOSITION.value){
  return con;
}
else{
  
  if(root.children.length == 1 && root.value == CONNECTIVE.NEGATION.value){
    if(root.children[0].children.length == 2){
      return con + "(" + stringOfRoot(root.children[0]) + ")";
    }
    else{
      return con + stringOfRoot(root.children[0]);
    }
  }
  else if(root.children.length == 2){
    
    if(root.children[0].children.length == 2 && root.children[1].children.length == 2){
      return "(" + stringOfRoot(root.children[0]) + ")" +  con + "(" + stringOfRoot(root.children[1]) + ")";
    }
    else if(root.children[0].children.length == 2 && root.children[1].children.length != 2){
      return "(" + stringOfRoot(root.children[0]) + ")" +  con + stringOfRoot(root.children[1]);
    }
    else if(root.children[0].children.length != 2 && root.children[1].children.length == 2){
      return stringOfRoot(root.children[0]) +  con + "(" + stringOfRoot(root.children[1]) + ")";
    }  
    else{
      return stringOfRoot(root.children[0]) +  con + stringOfRoot(root.children[1]);
    }  
  }
}

return result;
}

function printProps2(exprList){
  var i;
  var used = [];
  var candidate;
  
  for(i = 0; i < exprList.length; i++){
    candidate = exprList[exprList.length-1-i];
    
    if(candidate.type.value == TYPE.PROPOSITION.value && used.indexOf(candidate) == -1){
     insertCell(candidate.name);
     used.push(candidate);
   }
   
 }
}

function xprintProps(root){

  var candidate = root;
  
  if(candidate.type.value == TYPE.PROPOSITION.value){
    insertCell(candidate.name);
  }
  
  if(candidate.children.length == 2){
    printProps(candidate.children[0]);
    printProps(candidate.children[1]);
  }
  else if(candidate.children.length == 1){
    printProps(candidate.children[0]);
  }
}

function proceedStructure(arr, size){
  var len = arr.length;
  var copy = arr;
  var i;
  
  while(true){
    if(copy.length == size){
      break;
    }
    
    for(i=0;i<len;i++){
      copy.push(arr[i]);
    }
  }

  return arr;
}

function createTrueFalseColumn(i,totalColumns, totalRows){
  var arr = [];
  
  var mod = Math.pow(2,i); // 2, 4, 8
  var magic = totalRows/mod/2; // 4, 2, 1
  
  var k;
  for(k = 0; k < magic; k++){
    arr.push("T");
  }
  
  for(k=0; k < magic; k++){
    arr.push("F");
  }
  
  return proceedStructure(arr, totalRows);
}

function buildHTMLTable(root,output){
  
  if(!root){
    return;
  }
  
  printedProps = [];
  rownum = 0;
  
  insertCell(stringOfRoot(root));
  printProps2(output);
  //printProps(root);
  
  var totalColumns = printedProps.length-1;
  
  if(totalColumns === 0){
    totalColumns+=1; 
  }
  
  var totalRows = Math.pow(2,totalColumns);

  var columnArray = [];
  var j;
  for(j = 0; j < totalColumns; j++){

    var arr = createTrueFalseColumn(j, totalColumns, totalRows);
    columnArray.push(arr);
  }

  var reversedProps = printedProps.reverse();
  
  if(reversedProps.length == 1){
    printedProps = [];
    insertCell(reversedProps[0]);
  }  
  
  var k;
  var l;
  for(k = 0; k < totalRows; k++){
    
    var tempRow = [];
    
    for(l = 0; l < totalColumns; l++){
      var obj = {};
      obj.prop = reversedProps[l];
      obj.truth = columnArray[l][k];
      tempRow.push(obj);
    }
    
    tempRow.push(interpretRow(tempRow,root));
    
    insertRow(tempRow);
  }
  
}


function hasNegated(root,varname){
  if(!root){
    return false;
  }

  while(root){
   if(root.value == CONNECTIVE.NEGATION.value && root.children[0].type.value == TYPE.PROPOSITION.value && root.children[0].name == varname && root.hasPrinted){
     return true;
   }
   
/*  
   if(hasNegated(root.sipling,varname)){
       return true;
   }
   */
   
   if(root.value == CONNECTIVE.CONJUNCTION.value){
     
     if(root.children[0].value == CONNECTIVE.NEGATION.value && root.children[0].children[0].type.value == TYPE.PROPOSITION.value && root.children[0].children[0].name == varname && root.children[0].hasPrinted){
       return true;
     }
     if(root.children[1].value == CONNECTIVE.NEGATION.value && root.children[1].children[0].type.value == TYPE.PROPOSITION.value && root.children[1].children[0].name == varname && root.children[1].hasPrinted){
       return true;
     }
   }
   
   root = root.paren;
 }

 return false;
}



function hasNonNegated(root,varname){
  if(!root){
    return false;
  }

  
  while(root){
   if(root.type.value == TYPE.PROPOSITION.value && root.name == varname && root.hasPrinted){
     return true;
   }
   
   if(root.value == CONNECTIVE.CONJUNCTION.value){
     if(root.children[0].type.value == TYPE.PROPOSITION.value && root.children[0].name == varname && root.children[0].hasPrinted){
       return true;
     }
     if(root.children[1].type.value == TYPE.PROPOSITION.value && root.children[1].name == varname && root.children[1].hasPrinted){
       return true;
     }
   }
   
   root = root.paren;
 }

 return false;
}

function addCanvas(x,y){
  var canvas = document.getElementById("myCanvas");
  var context = canvas.getContext("2d");

  var oldCanvas = canvas.toDataURL("image/png");
  canvas.width += x;
  canvas.height += y;

  var img = new Image();
  img.src = oldCanvas;
  img.onload = function (){
    context.drawImage(img, 0, 0);
  };
}

function clone(obj) {
  if (null === obj || "object" != typeof obj){ return obj; }
  var copy = {};
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)){
      copy[attr] = obj[attr];
    }
  }
  return copy;
}

function findParenSipling(root){
  var sipling;
  while(root){
    if(root.sipling && !root.printedSipling){
      sipling = root.sipling;
      root.printedSipling = true;
            //root.sipling = null;
            break;
          }
          root = root.paren;
        }

        return clone(sipling);
      }

      function exprLength(expr){
        var val = 0;
        
        for(var i = 0; i < expr.length; i++){
          switch(expr[i]){
            case Unot: val=+1.1; break;
            case Uand: val+=1.2; break;
            case Uor: val+=1.2; break;
            case Urarr: val+=1.2; break;
            case Uharr: val+=1.2; break;
            case Uthus: val+=1.2; break;
            case '(': val+= 0.5; break;
             case ')': val+= 0.5; break;
default: val+=1.5; break;
}
}
return val*4;
}

function drawOr(ctx,posX,posY,pos){
  ctx.moveTo(posX+(pos/2),posY+10);
  ctx.lineTo(posX+80+(pos/2),posY+40);
  ctx.stroke();

  ctx.moveTo(posX+pos/2,posY+10);
  ctx.lineTo(posX-80+(pos/2),posY+40);
  ctx.stroke();
}

function drawAnd(ctx,posX,posY,pos){
  ctx.moveTo(posX+(pos/2),posY+5);
  ctx.lineTo(posX+(pos/2),posY+60);
  ctx.stroke(); 
}

function showItems(){

  document.getElementById("notbutton").disabled = false;
  document.getElementById("andbutton").disabled = false;
  document.getElementById("orbutton").disabled = false;
  document.getElementById("implicationbutton").disabled = false;
  document.getElementById("biconditionalbutton").disabled = false;
  document.getElementById("lparbutton").disabled = false;
  document.getElementById("rparbutton").disabled = false;
  document.getElementById("thusbutton").disabled = false;
  document.getElementById("e1").disabled = false;
  document.getElementById("e2").disabled = false;
  document.getElementById("e3").disabled = false;
  document.getElementById("pbutton").disabled = false;
  document.getElementById("qbutton").disabled = false;
  document.getElementById("rbutton").disabled = false;
  document.getElementById("sbutton").disabled = false;
  document.getElementById("gobutton").disabled = false;
  stopLoader();

}


function buildHTMLTree(root,posX,posY,pos){

  if(!root){
    showItems();
    return;
  }
  
  var obj;
  var c = document.getElementById("myCanvas");
  
  var treeStr = stringOfRoot(root);  
  
  var pos = exprLength(treeStr);
  
  if(posX === 0 && posY === 0){
    posX = (c.width / 2) - (pos/2);
    posY = 25;
  }
  
  pos = Math.round(pos);
  posX = Math.round(posX);
  posY = Math.round(posY);
  
  //addCanvas(10+(pos/2),20);
  addCanvas(0,20);

  var ctx=c.getContext("2d");
  ctx.fillStyle = "black";
  ctx.font="20px Arial";
  if(!root.hasPrinted){
    ctx.fillText(treeStr,posX-pos,posY);
  }
  
  // PROPOSITION
  if(root.type.value == TYPE.PROPOSITION.value){
    root.hasPrinted = true;
    
    if(hasNegated(root, root.name)){
      ctx.fillStyle = 'red';
      ctx.fillText("X",posX,posY+20);
      return;
    }
    
    
    var childsipling = findParenSipling(root);
    if(childsipling) childsipling.paren = root;
    
    setTimeout(function() { buildHTMLTree(childsipling, posX,posY+20); },250);
    //buildHTMLTree(childsipling, posX,posY+20);
    
    return;
  }
  // NEGATIONs...
  else if(root.value == CONNECTIVE.NEGATION.value){
    root.hasPrinted = true;
    var notC = root.children[0];
    
    // not A
    if(notC.type.value == TYPE.PROPOSITION.value){
      if(hasNonNegated(root,root.children[0].name)){
        ctx.fillStyle = 'red';
        ctx.fillText("X",posX,posY+20);
        return;
      }
      
      var childsipling2 = findParenSipling(root);
      if(childsipling2) childsipling2.paren = root;
      
      setTimeout(function() { buildHTMLTree(childsipling2, posX,posY+20); },250);
        //buildHTMLTree(childsipling2, posX,posY+20);
      }
    // not not
    else if(notC.value == CONNECTIVE.NEGATION.value){
        //buildHTMLTree(root.children[0].children[0], posX+10,posY+20);
        setTimeout(function() { buildHTMLTree(root.children[0].children[0], posX+10,posY+20); },250);
      }
    // not or
    else if(notC.value == CONNECTIVE.DISJUNCTION.value){
      drawAnd(ctx,posX,posY,pos);
      
      child1 = clone(notC.children[0]);
      child2 = clone(notC.children[1]);
      
      notC.children[0].type = TYPE.CONNECTIVE;
      notC.children[0].value = CONNECTIVE.NEGATION.value;
      notC.children[0].children = [child1];
      
      notC.children[1].type = TYPE.CONNECTIVE;
      notC.children[1].value = CONNECTIVE.NEGATION.value;
      notC.children[1].children = [child2];
      
      root.type = TYPE.CONNECTIVE;
      root.value = CONNECTIVE.CONJUNCTION.value;
      root.children = [notC.children[0], notC.children[1]];
      
      setTimeout(function() { buildHTMLTree(root, posX,posY+80); },250);
        //buildHTMLTree(root, posX,posY+80);
      }
    // not and
    else if(notC.value == CONNECTIVE.CONJUNCTION.value){
      drawOr(ctx,posX,posY,pos);
      
      child1 = clone(notC.children[0]);
      child2 = clone(notC.children[1]);
      
      notC.children[0].type = TYPE.CONNECTIVE;
      notC.children[0].value = CONNECTIVE.NEGATION.value;
      notC.children[0].children = [child1];
      
      notC.children[1].type = TYPE.CONNECTIVE;
      notC.children[1].value = CONNECTIVE.NEGATION.value;
      notC.children[1].children = [child2];
      
      root.type = TYPE.CONNECTIVE;
      root.value = CONNECTIVE.DISJUNCTION.value;
      root.children = [notC.children[0], notC.children[1]];
      
      setTimeout(function() { buildHTMLTree(root, posX,posY); },500);        
        //buildHTMLTree(root, posX,posY);
      }
    // not implication
    else if(notC.value == CONNECTIVE.IMPLICATION.value){

      child2 = clone(notC.children[1]);
      
      notC.children[1].type = TYPE.CONNECTIVE;
      notC.children[1].value = CONNECTIVE.NEGATION.value;
      notC.children[1].children = [child2];
      
      root.type = TYPE.CONNECTIVE;
      root.value = CONNECTIVE.CONJUNCTION.value;
      root.children = [notC.children[0], notC.children[1]];
      
        //notC.children[0].sipling = notC.children[1];    
        
        drawAnd(ctx,posX,posY,pos); 

        setTimeout(function() { buildHTMLTree(root,posX+15,posY+80); },500);  
        //buildHTMLTree(root,posX+15,posY+80);
      }
    // not biconditional
    else if(notC.value == CONNECTIVE.BICONDITIONAL.value){
      
      drawOr(ctx,posX,posY,pos);
      
      var child1 = clone(notC.children[0]);
      var child2 = clone(notC.children[1]);
      var child1n = clone(notC.children[0]);
      var child2n = clone(notC.children[1]);
      
      notC.children[0].type = TYPE.CONNECTIVE;
      notC.children[0].value = CONNECTIVE.CONJUNCTION.value;
      notC.children[0].children = [child1, child2];
      notC.children[0].hasPrinted = true;
      
      child1n.type = TYPE.CONNECTIVE;
      child1n.value = CONNECTIVE.NEGATION.value;
      child1n.children = [child1];
      
      child2.type = TYPE.CONNECTIVE;
      child2.value = CONNECTIVE.NEGATION.value;
      child2.children = [child2n];
      
      notC.children[1].type = TYPE.CONNECTIVE;
      notC.children[1].value = CONNECTIVE.CONJUNCTION.value;
      notC.children[1].children = [child1n, child2n];
      notC.children[1].hasPrinted = true;
      
      notC.type = TYPE.CONNECTIVE;
      notC.value = CONNECTIVE.DISJUNCTION.value;
      
      notC.hasPrinted = true;
      
      setTimeout(function() { buildHTMLTree(notC,posX,posY); },500);  
        //buildHTMLTree(notC,posX,posY);
      }
      
    }
  // DISJUNCTION
  else if(root.value == CONNECTIVE.DISJUNCTION.value){
    
   if(!root.hasPrinted){
    drawOr(ctx,posX,posY,pos);
  }
  
  setTimeout(function() { buildHTMLTree(root.children[0],posX-(pos/2)-65,posY+60); },250);
  setTimeout(function() { buildHTMLTree(root.children[1],posX+(pos/2)+75,posY+60); },500);    
  
    //buildHTMLTree(root.children[0],posX-(pos/2)-65,posY+60);
    //buildHTMLTree(root.children[1],posX+(pos/2)+75,posY+60);
    
  }
  // CONJUNCTION
  else if(root.value == CONNECTIVE.CONJUNCTION.value){
    
    if(!root.hasPrinted){
      drawAnd(ctx,posX,posY,pos);
    }
    
    root.children[0].sipling = root.children[1];    
    
    if(!root.hasPrinted){
      setTimeout(function() { buildHTMLTree(root.children[0],posX+(pos/2)-5,posY+80); },500);    
        //buildHTMLTree(root.children[0],posX+(pos/2)-5,posY+80);
      }
      else{
        setTimeout(function() { buildHTMLTree(root.children[0],posX+(pos/2)-5,posY); },500);    
        //buildHTMLTree(root.children[0],posX+(pos/2)-5,posY);
      }
    }
  // IMPLICATION
  else if(root.value == CONNECTIVE.IMPLICATION.value){
    drawOr(ctx,posX,posY,pos);
    
    var child1 = clone(root.children[0]);
    
    root.children[0].type = TYPE.CONNECTIVE;
    root.children[0].value = CONNECTIVE.NEGATION.value;
    root.children[0].children = [child1];
    
    setTimeout(function() { buildHTMLTree(root.children[0],posX-(pos/2)-65,posY+60); },500);    
    setTimeout(function() { buildHTMLTree(root.children[1],posX+(pos/2)+75,posY+60); },500);    
    //buildHTMLTree(root.children[0],posX-(pos/2)-65,posY+60);
    //buildHTMLTree(root.children[1],posX+(pos/2)+75,posY+60);
    
  }
  // BICONDITIONAL
  else if(root.value == CONNECTIVE.BICONDITIONAL.value){
    
    drawOr(ctx,posX,posY,pos);
    
    var child1 = clone(root.children[0]);
    var child2 = clone(root.children[1]);
    var child1n = clone(root.children[0]);
    var child2n = clone(root.children[1]);
    
    root.children[0].type = TYPE.CONNECTIVE;
    root.children[0].value = CONNECTIVE.CONJUNCTION.value;
    root.children[0].children = [child1, child2];
    root.children[0].hasPrinted = true;
    
    child1n.type = TYPE.CONNECTIVE;
    child1n.value = CONNECTIVE.NEGATION.value;
    child1n.children = [child1];
    
    child2n.type = TYPE.CONNECTIVE;
    child2n.value = CONNECTIVE.NEGATION.value;
    child2n.children = [child2];
    
    root.children[1].type = TYPE.CONNECTIVE;
    root.children[1].value = CONNECTIVE.CONJUNCTION.value;
    root.children[1].children = [child1n, child2n];
    root.children[1].hasPrinted = true;
    
    root.type = TYPE.CONNECTIVE;
    root.value = CONNECTIVE.DISJUNCTION.value;
    
    root.hasPrinted = true;
    
    setTimeout(function() { buildHTMLTree(root,posX,posY); },500);    
    //buildHTMLTree(root,posX,posY);
  }

}

function incrementIndex(list,amount){
  for(var i = 0; i < list.length; i++){
    list[i].index += amount;
  }
}

function resetTable(){
  hideItems();

  var table = document.getElementById("truthtable");
  while(table.rows.length > 0){
    table.deleteRow(table.rows.length-1);
  }
  var c=document.getElementById("myCanvas");
  c.width = screen.width-50;
  c.height = 200;
  nots = [];
  printedProps = [];
  rownum = 0;
}



function insertColumn(list){

  var tblHeadObj = document.getElementById("truthtable").tHead;
  for(i = 0; i < tblHeadObj.rows.length; i++){
    var newTH = document.createElement("th");
    tblHeadObj.rows[h].appendChild(newTH);
    newTH.innerHTML = list[i];
    
    var newCell = tblBodyObj.rows[i].insertCell(-1);
    newCell.innerHTML = list[i];
  }
}

function allNOT(expList){
  for(i = 0; i < expList.length; i++){
    if(!isNOT(expList[i]) && expList[i].type.value != TYPE.PROPOSITION.value){
      return false;
      break;
    }
  }
  return true;
}

function changeLang(lang){
  if(lang == "en"){
    document.getElementById("helptext").innerHTML = "Enter your propositional logical expression, and hit enter. Use keywords: and, or, rarrow, rlarrow and thus.";
    document.getElementById("filebug").innerHTML = "File Bug";
    document.getElementById("contact").innerHTML = "Contact";
    document.getElementById("tabletitle").innerHTML = "Truth table";
    document.getElementById("tableautitle").innerHTML = "Semantic Tableaux";
    
    document.getElementById("e1").innerHTML = "Example 1";
    document.getElementById("e2").innerHTML = "Example 2";
    document.getElementById("e3").innerHTML = "Example 3";
    
    err0 = "Ill-formed expression: wrong placement of negation at position ";
    err1 = "Ill-formed expression: wrong placement of ";
    err2 = " at position ";
    err3 = "Ill-formed expression: illegal character: ";
    err5 = "Ill-formed expression: only one thus allowed";
    err6 = "Ill-formed expression: no propositions found";
    err7 = "Ill-formed expression: wrong number of parentheses!";
    err8 = "Ill-formed expression: wrong placement of parentheses!";
    err9 = "Ill-formed expression: empty parentheses ()!";
    err10 = "Ill-formed expression: wrong placement of propositions!";
    err11 = "Ill-formed expression: wrong placement of connectives!";
    err12 = "Ill-formed expression: starts with connective!";
    err13 = "Ill-formed expression: ends with connective!";
    
  }
  else if(lang == "da"){
    document.getElementById("helptext").innerHTML = "Indtast dit logiske udsagn, og tryk enter. Brug n&oslash;gleordene: and, or, rarrow, rlarrow og thus.";
    document.getElementById("filebug").innerHTML = "Anmeld fejl";
    document.getElementById("contact").innerHTML = "Kontakt";
    document.getElementById("tabletitle").innerHTML = "Sandhedstabel";
    document.getElementById("tableautitle").innerHTML = "Semantisk Tableaux";
    
    document.getElementById("e1").innerHTML = "Eksempel 1";
    document.getElementById("e2").innerHTML = "Eksempel 2";
    document.getElementById("e3").innerHTML = "Eksempel 3";
    
    err0 = "Fejlartet udtryk: forkert placering af negation p&aring; position ";
    err1 = "Fejlartet udtryk:: wrong placement of ";
    err2 = " p&aring; position ";
    err3 = "Fejlartet udtryk: ulovligt tegn: ";
    err5 = "Fejlartet udtryk: kun en konklusion tilladt";
    err6 = "Fejlartet udtryk: ingen pr&aelig;dikater fundet";
    err7 = "Fejlartet udtryk: forkert antal of paranteser!";
    err8 = "Fejlartet udtryk: forkert placering af paranteser!";
    err9 = "Fejlartet udtryk: tom parentes ()!";
    err10 = "Fejlartet udtryk: forkert placering af pr&aelig;dikater!";
    err11 = "Fejlartet udtryk: forkert placering af konnektiver!";
    err12 = "Fejlartet udtryk: starter med et konnektiv!";
    err13 = "Fejlartet udtryk: slutter med et konnektiv!";
  }

}

