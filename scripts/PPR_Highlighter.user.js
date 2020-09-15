// ==UserScript==
// @name         PPR Highlighter
// @namespace    com.amazon.shocklp
// @version      1.8
// @description  Highlights certain rows
// @author       Phillip Shockley | shocklp
// @match        https://fclm-portal.amazon.com/reports/processPathRollup*
// @grant        GM_info
// @grant        GM_addStyle
// @downloadURL  https://github.com/Pshock13/shocklp/raw/master/scripts/PPR_Highlighter.user.js
// @updateURL    https://github.com/Pshock13/shocklp/raw/master/scripts/PPR_Highlighter.user.js
// @sourceURL    https://github.com/Pshock13/shocklp/raw/master/scripts/PPR_Highlighter.user.js
// @run-at       document-end
// ==/UserScript==

/*
UPDATE
1.6 - percentages over 1,000% now highlight in green rather than red
1.8 - red highlight for under 100% now gets removed when unchecking corresponding box
*/
var row = document.getElementsByClassName('lineItem');
var hLightsArray = [];

//Add check boxes to rows
for (var j=0;j<row.length;j++){
    var checkbox = document.createElement('td');
    var input = document.createElement('input');
    input.type = 'checkbox';
    checkbox.appendChild(input);
    checkbox.appendChild(input);
    row[j].appendChild(checkbox);
    input.addEventListener('change', isChecked)
}

if(localStorage.highlights == null){localStorage.setItem('highlights',hLightsArray)} //Start localStorage if none exists

function isChecked() {
    if (this.checked == false){
        this.parentNode.parentNode.style.backgroundColor = null;
        for (var c=0;c<this.parentNode.parentNode.children.length;c++){
            this.parentNode.parentNode.children[c].style.backgroundColor = null;
            this.parentNode.parentNode.children[c].classList.remove('under100');
        }
        for( var i = 0; i < hLightsArray.length; i++){
            if ( hLightsArray[i] === this.parentNode.parentNode.id) {
                hLightsArray.splice(i, 1);
            }
        }
    } else if(this.checked == true) {
        this.parentNode.parentNode.style.backgroundColor = '#8ff';
        hLightsArray.push(this.parentNode.parentNode.id);
    }
    localStorage.setItem('highlights', JSON.stringify(hLightsArray)); //save new arrays in localStorage
    highlightThis();
}

hLightsArray = JSON.parse(localStorage.highlights);

function highlightThis(){
    for (var l=0;l<hLightsArray.length;l++){
        for (var i = 0; i < document.getElementById(hLightsArray[l]).childNodes.length; i++) {
            var ratio = document.getElementById(hLightsArray[l]).childNodes[i];
            if (ratio.className == 'numeric ratioToPlan ratio') {
                /*Determine if the ratio is above or below 100%*/
                if(parseFloat(ratio.innerText.replace(/,/g, ''),10)>100){
                    ratio.style.backgroundColor='#afa' //green
                    console.log(parseFloat(ratio.innerText.replace(/,/g, ''),10))
                }else if (parseFloat(ratio.innerText.replace(/,/g, ''),10)<100 && parseFloat(ratio.innerText,10)>0){
                    //ratio.style.backgroundColor = '#faa'; //red
                    ratio.classList.add('under100');
                    console.log(parseFloat(ratio.innerText.replace(/,/g, ''),10))
                };
            }
        }
        document.getElementById(hLightsArray[l]).style.backgroundColor = '#8ff';
        document.getElementById(hLightsArray[l]).lastElementChild.lastChild.checked = true;
    }
}

highlightThis();

var stickyHead = document.getElementsByTagName('thead')[0];
stickyHead.style.position = 'sticky';
stickyHead.style.top = 0;
for(var g=0;g<stickyHead.children.length;g++){
    for(var h=0;h<stickyHead.children[g].children.length;h++){
        stickyHead.children[g].children[h].style.backgroundClip = "content-box";
    }
}


var time = 1000;

function waitForElementToDisplay(time) {
    var removeHead = document.getElementsByTagName('thead')[1];
        if(removeHead!=null) {
            removeHead.remove();
            return;
        }
        else {
            setTimeout(function() {
                waitForElementToDisplay(removeHead, time);
            }, time);
        }
    }
waitForElementToDisplay();

GM_addStyle ( `
.under100 {
	animation: blink 1s ease-in-out infinite;
}
  @keyframes blink {
    0%  {background-color: #faa;}
    50% {background-color: #fff;color:#f00}
    100%{background-color: #faa;}
  }
`);
