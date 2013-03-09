var Upi = "\u03C0";
var Unot = "\u00AC";
var Urarr = "\u21D2";
var Uharr = "\u21D4";
var Uand = "\u2227";
var Uor = "\u2228";
var Uthus = "\u22A8";

function updateField(){
  var field = document.getElementById("inputfield");
  var sel = field.selectionStart;
  var sentence = field.value.toUpperCase().replace("NOT",Unot).replace("AND",Uand).replace("OR",Uor).replace("RARROW",Urarr).replace("RLARROW",Uharr).replace("THUS",Uthus).replace(" ","").replace(",",Uand);
  field.value = sentence;
  
  setCaretPosition(field, sel);
  
}

function addT(value){
    
  var field = document.getElementById("inputfield");
  var arr = field.value.split("");
  
  var car = field.selectionStart;//getCaret(field);
  var before = arr.slice(0,car);
  var after = arr.slice(car,arr.length+1);
  
  var join = before.join("") + value + after.join("");
  
  field.value = join;
  setCaretPosition(field, car+1);
  field.focus();
}

function getCaret(el) { 
  if (el.selectionStart) { 
    return el.selectionStart; 
  } else if (document.selection) { 
    el.focus(); 

    var r = document.selection.createRange(); 
    if (r == null) { 
      return 0; 
    } 

    var re = el.createTextRange(), 
        rc = re.duplicate(); 
    re.moveToBookmark(r.getBookmark()); 
    rc.setEndPoint('EndToStart', re); 

    return rc.text.length; 
  }  
  return 0; 
}

function setCaretPosition(elem, caretPos) {
    if(elem != null) {
        if(elem.createTextRange) {
            var range = elem.createTextRange();
            range.move('character', caretPos);
            range.select();
        }
        else {
            if(elem.selectionStart) {
                elem.focus();
                elem.setSelectionRange(caretPos, caretPos);
            }
            else
                elem.focus();
        }
    }
}

function example(ex){
    var field = document.getElementById("inputfield");
    field.value = ex;
    
    parseSentence();
    


}
