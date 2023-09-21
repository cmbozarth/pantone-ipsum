import {pantoneColors} from './pantone_names.js';
let resultBox = document.getElementById("result");
let generateBtn = document.getElementById('generateText');
let alertDiv = document.getElementById('alertDiv');
let alertDivText = "";
const namesArr = [...pantoneColors.names];
const valuesArr = [...pantoneColors.values];
const root = document.querySelector(':root');
for(let i = 0; i < namesArr.length; i++){
     let rootName = '--' + namesArr[i];
     let rootVal = valuesArr[i];
     root.style.setProperty(rootName, rootVal);
}

function shuffleArray(arr) {
     for (let i = arr.length - 1; i > 0; i--){
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
     }
}

function randomLength(min,max){
     return Math.floor(Math.random() * (max - min + 1) + min);
}

shuffleArray(namesArr);

generateBtn.onclick = function generateText() { 
     alertDiv.innerHTML = " ";
     var numofPara = document.getElementById('str-amount').value;                   
     var resultText = generateLorem(numofPara);   //Make so many paragraphs
     resultBox.innerHTML = "";
     resultBox.innerHTML = resultText;      //Put Text into Container
     copyAllToClip(resultBox.innerHTML);
     let words = document.querySelectorAll(".result span");
     var wordArray = [...words];
     wordArray.forEach(words => {
     let wordBkg = window.getComputedStyle(words).backgroundColor;
     let textCol = window.getComputedStyle(words).color;
     wordBkg = rgbtohex(wordBkg);
     textCol = rgbtohex(textCol);
     let invertedColor = invertColor(wordBkg, textCol);
     words.style.color = invertedColor;
     copyToClip(words,wordBkg);
     });

};

function generateLorem(numofPara) {
var loremText = "";
for (var i = 0; i < numofPara; i++) {
     var paragraph = "";
     var numSent = randomLength(3,6);
          for (var j = 0; j < numSent; j++) {
               var sentence = "";
               var numWords = randomLength(3,8);
               for (var k = 0; k < numWords; k++) {
                    const spanElem = document.createElement("span");
                    const colorName = namesArr[i].replace(/\s+/g, '').toLowerCase()
                    spanElem.style.background = 'var(--' + colorName + ')';
                    spanElem.innerHTML = namesArr[i].replace(/-/g, " "); 
                         if (k == 0) {
                              spanElem.textContent = spanElem.textContent[0].toUpperCase() + spanElem.textContent.slice(1);
                         }
                    
                         if (k + 1 == numWords) {
                              sentence += spanElem.outerHTML;
                         } else {
                              sentence += spanElem.outerHTML + " ";
                         }                            
                    shuffleArray(namesArr);
               }
          paragraph += sentence + '. ';
          }  
     loremText += "<p>" + paragraph + "</p><br>";
     }
     
     return loremText;
}

function invertColor(hex, bw) {
     if (hex.indexOf('#') === 0) {
         hex = hex.slice(1);
     }
     if (hex.length === 3) {
         hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
     }
     if (hex.length !== 6) {
         throw new Error('Invalid HEX color.');
     }
     var r = parseInt(hex.slice(0, 2), 16),
         g = parseInt(hex.slice(2, 4), 16),
         b = parseInt(hex.slice(4, 6), 16);
     if (bw) {
         return (r * 0.299 + g * 0.587 + b * 0.114) < 125
             ? '#ffffff'
             : '#000000';
     }
     r = (255 - r).toString(16);
     g = (255 - g).toString(16);
     b = (255 - b).toString(16);
     return "#" + padZero(r) + padZero(g) + padZero(b);
 }
 
 function rgbtohex(rgb) {
      if (  rgb.search("rgb") == -1 ) {
           return rgb;
      } else {
           rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
           function hex(x) {
                return ("0" + parseInt(x).toString(16)).slice(-2);
           }
           return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]); 
      }
 }

function copyToClip(item, attribute){
     item.addEventListener("click", function(){
          console.log("You have copied " + item.innerHTML +  ": " + attribute);
          navigator.clipboard.writeText(attribute);
          alertDiv.innerHTML = "";
          alertDivText = "<p> The hex color for '" + item.innerHTML + "': <b>" + attribute + "</b> is copied to the clipboard.</p>";
          alertDiv.innerHTML += alertDivText;
     });
}

function copyAllToClip(textToWrite){
     let copyAllBtn = document.getElementById("copyAllText");
     copyAllBtn.addEventListener("click", function(){

          if(navigator.clipboard.write){
          //Chrome, Safari
               const type = "text/html";
               const blurb = new Blob([textToWrite], { type });
               const dataText = [new ClipboardItem({[type]: blurb})];
               navigator.clipboard.write(dataText);
               console.log("You have copied all the text: " + textToWrite);
               alertDiv.innerHTML = "";
               alertDivText = "<p> The text is copied to the clipboard. </p>";
               alertDiv.innerHTML += alertDivText;
          } else {
               //Firefox
               function listener(e) {
                    e.clipboardData.setData("text/html", textToWrite);
                    e.clipboardData.setData("text/plain", textToWrite);
                    e.preventDefault();
               }
               
               document.addEventListener("copy", listener);
               document.execCommand("copy");
               document.removeEventListener("copy", listener); 
               alertDiv.innerHTML = "";
               alertDivText = "<p> The text is copied to the clipboard. </p>";
               alertDiv.innerHTML += alertDivText;
          }

          });                     
}
