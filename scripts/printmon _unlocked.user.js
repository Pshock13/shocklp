// ==UserScript==
// @name         Printmon Unlocked
// @namespace    com.amazon.shocklp
// @version      0.2
// @description  Unlocks the ability to print LPNs and other non-ASIN barcodes
// @author       Phillip Shockley | shocklp
// @match        http://localhost:5965/barcodegenerator
// @grant        none
// @run-at       document-idle
// ==/UserScript==

setTimeout(function(){
RESTRICT_ASINS = 0x0002;
RESTRICT_PAX = 0x0002;
RESTRICT_TSX = 0x0002;
RESTRICT_CSX = 0x0002;
RESTRICT_LPN = 0x0002;
RESTRICT_Z = 0x0002;
//REQUIRE_BADGE_ON_LABELS = 0x0002;

var code = document.getElementById('barcodedata');
    console.log(code);
code.addEventListener('click',function(){
    this.focus();
    this.select();
});

document.getElementById('badge_group').style.display='block';
}, 500);