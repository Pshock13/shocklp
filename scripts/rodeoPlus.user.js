// ==UserScript==
// @name         Rodeo Plus
// @namespace    com.amazon.shocklp
// @version      1.5.13
// @description  Multiple add-ons that improve the functionality of Rodeo. Read more at https://drive-render.corp.amazon.com/view/shocklp@/Script_install.html#desc1
// @author       Phillip Shockley | shocklp
// @include      https://rodeo-iad.amazon.com/*
// @downloadURL  https://github.com/Pshock13/shocklp/raw/master/scripts/rodeoPlus.user.js
// @updateURL    https://github.com/Pshock13/shocklp/raw/master/scripts/rodeoPlus.user.js
// @sourceURL    https://github.com/Pshock13/shocklp/raw/master/scripts/rodeoPlus.user.js
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_info
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.3.1.js
// ==/UserScript==
/* global $ */
/* eslint-disable no-multi-spaces */

/*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
* Changelog
* https://drive-render.corp.amazon.com/view/shocklp@/changelog.html
*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*/

/*PRINT ASIN BUTTON DISABLED*/


GM_addStyle ( `
.fcpn-sprite{
    background-image: url("https://drive-render.corp.amazon.com/view/shocklp@/media/rodeoPlus.png") !important;
  }
#fcpn-header {
    position:sticky;
    top: 0;
    z-index: 1000;
}
#fcpn-site-input{
	color:#e47911 !important;
	text-shadow:-1px 1px 0px #000 !important;
}
.result-table thead {
    position: sticky;
    top: 35px;
    z-index: 1000;
}
.highlight-header.tablesorter-header{
    background-color:#fff !important;
}
#disabledScript {
    left: 350px;
    position: absolute;
    padding: 0 10px;
    border-radius: 10px;
    z-index:1001;
	animation: notify 3s ease-in-out infinite;
}
  @keyframes notify {
    0%  {background-color: yellow;}
    50% {background-color: gold;}
    100%{background-color: yellow;}
  }
#enabledScript{
    left:350px;
    position: absolute;
    padding: 0 10px;
    border-radius: 10px;
	animation: notify2 3s ease-in-out infinite;
}
@keyframes notify2 {
  0%  {background-color: lightgreen;}
  50% {background-color: limegreen;}
  100%{background-color: lightgreen;}
}
.tooltip{
  z-index:1001;
  visibility: hidden;
  opacity:0;
  position:absolute;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px;
  text-indent: initial;
  transition: opacity 0.3s;
  border-color: #fff;
}
.tooltip--pos{
	bottom: 130%;
	left:50%;
	transform:translate(-50%,0);
}
.conditiontip {
    bottom: 90%;
    right: 50%;
    margin-right: 12px;
}
.CopyBtn:hover + .tooltip,
.condition:hover > .tooltip{
  opacity:1;
  visibility: visible;
}
.CopyBtn,
.printBtn{
	opacity:0;
	cursor: pointer;
	text-indent:0;
}
.CopyBtn:hover,
.printBtn:hover{
	opacity:1;
	cursor:pointer;
}
.tooltip--pos::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #555 transparent transparent transparent;
}
.quickLink:hover + .tooltip,
.condition:hover > .tooltip{
  opacity:1;
  visibility: visible;
}
.quickLink {
	opacity:0;
	cursor: pointer;
	text-indent:0;
}
.quickLink:hover{
	opacity:1;
	cursor:pointer;
}
.justCopied {
background-color:#FEDA15;
	animation: copy 1s ease-in-out 1;
}
  @keyframes copy {
    50% { background-color: #0113DA;}
  }
.justCopied a{
color:#0113DA;
  animation: changeBlack 1s ease-in-out 1;
}
  @keyframes changeBlack {
    50% {color: #FEDA15;}
  }

.badScan{
  animation: blink 2s ease-in infinite;
}
  @keyframes blink {
    50% { background-color: #f00;}
  }

.badScan a{
  animation: whiteText 2s .5s ease-in infinite;
}

  @keyframes whiteText {
    50% { color: #fff;}
  }
.fl-right{
	float:right;
}
.moreThan1{
  animation: blink1 2s ease-in infinite;
}
@keyframes blink1 {
    50% { background-color: #10b7ff;color:#fff}
  }
.hardCapped{
 background-color:#ff443366;
}
/*Pushes quicklinks right to make room for clipboard*/
.filterable.check .filter-link,
.non-filterable.check .filter-link{
    right: -46px !important;
}
.filterable .euler-link,
.non-filterable .euler-link{
    right: -13px !important;
}
.filterable .aps-link,
.non-filterable .aps-link{
    right: -31px !important;
}
.filterable .hero-link,
.non-filterable .hero-link{
    right: -19px !important;
}
.filterable.check,
.non-filterable.check{
    padding-right: 48px !important;
}
.relative .filter-link{
    right: -12px !important;
}
#disabledScript{
    cursor:pointer;
}
.relative {
    display: flex;
    justify-content: space-between;
}
.condition{
    position:relative;
}
#fcpn-update {
    width: 24px;
    height: 24px;
    margin: 3.5px 4px;
    display: block;
    white-space: normal;
    background-image: url('https://drive-render.corp.amazon.com/view/shocklp@/media/update.png');
    background-size: contain;
    cursor:pointer;
}
#fcpn-update:hover > .fcpn-tooltip{
    display:block;
}
` );


function readCookie(name) {
    // From http://stackoverflow.com/a/1599291
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }


//Add fontawesome to the page
/*var link = document.createElement("link");
link.href="https://drive.corp.amazon.com/view/shocklp@/fontawesome-free-5.13.1-web/css/all.css";
link.rel="stylesheet";
link.type="text/css"
document.getElementsByTagName("head")[0].append(link);
*/


//Script version control
var currentVersion = GM_info.script.version;
console.log(currentVersion);
document.getElementsByClassName("fcpn-logo")[0].title = `Rodeo Plus V ${currentVersion}`

//Determine Fulfillment Center
var FC = readCookie("fcmenu-warehouseId"); //Get FC
console.log(FC);

//Shipment ID ==> New Rodeo Tab
document.querySelectorAll('table a[href*="&shipmentId="]')
  .forEach((a) => {
    const shipmentId = a.href.match(/\d+$/);
    a.href = `https://rodeo-iad.amazon.com/${FC}/Search?searchKey=${shipmentId}`;
  });

//ASIN ==> FCResearch
document.querySelectorAll('table a[href*="&asin="]')
  .forEach((a) => {
    var ASIN = a.href.match(/[A-Z0-9]+$/);
    a.href = `http://fcresearch-na.aka.amazon.com/${FC}/results?s=${ASIN}`;
  });

//location ==> FCResearch
document.querySelectorAll('table a[href*="&container="]')
  .forEach((a) => {
    var location = a.href.match(/[a-zA-Z0-9-_]+$/);
    a.href = `http://fcresearch-na.aka.amazon.com/${FC}/results?s=${location}`;
  });

    /* Define columns that will be used */
    var allTh = document.querySelectorAll('th');
console.log(allTh);

    var shipTh      = Array.from(allTh).find(th => th.innerText === 'Shipment ID' || th.innerText === 'Transfer Request ID');
    var scanTh      = Array.from(allTh).find(th => th.innerText === 'Scannable ID');
    var dateTh      = Array.from(allTh).find(th => th.innerText === 'Expected Ship Date' || th.innerText === 'Need To Ship By Date');
    var conditionTh = Array.from(allTh).find(th => th.innerText === 'Condition');
    var asinTh      = Array.from(allTh).find(th => th.innerText === 'FN SKU');
    var outerTh     = Array.from(allTh).find(th => th.innerText === 'Outer Scannable ID');
    var quantityTh    = Array.from(allTh).find(th => th.innerText === 'Quantity');
    var pickBatchTh    = Array.from(allTh).find(th => th.innerText === 'Pick Batch ID');
    var workPoolTh    = Array.from(allTh).find(th => th.innerText === 'Work Pool');
//console.log(pickBatchTh);
    // Get the index of that element with respect to its siblings (+1 because nodes are base 1 not base 0 like arrays)
    if ( typeof shipTh !== 'undefined' ) {
        var shipIndex = Array.from(shipTh.parentNode.children).indexOf(shipTh)+1;
        var shipColumn = shipTh.closest('table').querySelectorAll(`td:nth-child(${shipIndex}) > div.relative`);
    };
    if ( typeof scanTh !== 'undefined' ) {
        var scanIndex = Array.from(scanTh.parentNode.children).indexOf(scanTh)+1;
        var scanColumn = scanTh.closest('table').querySelectorAll(`td:nth-child(${scanIndex}) > div.relative`);
    };
    if ( typeof dateTh !== 'undefined' ) {
        var dateIndex = Array.from(dateTh.parentNode.children).indexOf(dateTh)+1;
        var dateColumn = dateTh.closest('table').querySelectorAll(`td:nth-child(${dateIndex})`);
    };
    if ( typeof conditionTh !== 'undefined' ) {
        var conditionIndex = Array.from(conditionTh.parentNode.children).indexOf(conditionTh)+1;
        var conditionColumn = conditionTh.closest('table').querySelectorAll(`td:nth-child(${conditionIndex}) > div`);
    };
    if ( typeof asinTh !== 'undefined' ) {
        var asinIndex = Array.from(asinTh.parentNode.children).indexOf(asinTh)+1;
        var asinColumn = asinTh.closest('table').querySelectorAll(`td:nth-child(${asinIndex}) > div`);
    };
    if ( typeof outerScan !== 'undefined' ) {
        var outerIndex = Array.from(outerTh.parentNode.children).indexOf(outerTh)+1;
        var outerColumn = outerTh.closest('table').querySelectorAll(`td:nth-child(${outerIndex}) > div`);
    };
    if (typeof quantityTh !== 'undefined'){
        var quantityIndex = Array.from(quantityTh.parentNode.children).indexOf(quantityTh)+1;
        var quantityColumn = quantityTh.closest('table').querySelectorAll(`td:nth-child(${quantityIndex})`);
    }
    if (typeof pickBatchTh !== 'undefined'){
        var pickBatchIndex = Array.from(pickBatchTh.parentNode.children).indexOf(pickBatchTh)+1;
        var pickBatchColumn = pickBatchTh.closest('table').querySelectorAll(`td:nth-child(${pickBatchIndex})`);
    }
    if (typeof workPoolTh !== 'undefined'){
        var workPoolIndex = Array.from(workPoolTh.parentNode.children).indexOf(workPoolTh)+1;
        var workPoolColumn = workPoolTh.closest('table').querySelectorAll(`td:nth-child(${workPoolIndex})`);
    }
    //console.log(pickBatchColumn);
    /* END define columns */
if (typeof quantityColumn !== 'undefined'){
    for(var j=0;j<quantityColumn.length;j++){
        if (quantityColumn[j].innerText !== '1'){
            quantityColumn[j].classList.add('moreThan1');
        };
    };
};
if(typeof workPoolColumn !=='undefined'){
    for(j=0;j<workPoolColumn.length;j++){
        if(workPoolColumn[j].innerText == 'PickingNotYetPickedHardCapped'){
            workPoolColumn[j].parentNode.classList.add('hardCapped');
        }
    }
};
function addClipboard(){
    if ( typeof shipColumn !== 'undefined') {
        for(var j=0;j<shipColumn.length;j++){
            shipColumn[j].innerHTML+=("<div class='relative'><img src='https://drive-render.corp.amazon.com/view/shocklp@/media/copy.png' width='20px' class='CopyBtn'><span class='tooltip tooltip--pos'>Copy ShipID</span></div>");
            //shipColumn[j].innerHTML+=("<span class='CopyBtn'>&#128203;</span>");
        };
    };

    if ( typeof scanColumn !== 'undefined') {
        for(j=0;j<scanColumn.length;j++){
            if(scanColumn[j].innerText==''){
                /*Do nothing to an empty cell*/
            }else{
                scanColumn[j].innerHTML+=("<div class='relative'><img src='https://drive-render.corp.amazon.com/view/shocklp@/media/copy.png' width='20px' class='CopyBtn'><span class='tooltip tooltip--pos'>Copy Scannable ID</span></div>");
                //scanColumn[j].innerHTML+=("<span class='CopyBtn'>&#128203;</span>");
            }
        };
    };

    if ( typeof asinColumn !== 'undefined') {
        for(j=0;j<asinColumn.length;j++){
            if(asinColumn[j].innerText==''){
                /*Do nothing to an empty cell*/
            }else{
                asinColumn[j].innerHTML+=("<div class='relative'><img src='https://drive-render.corp.amazon.com/view/shocklp@/media/copy.png' width='20px' class='CopyBtn'><span class='tooltip tooltip--pos'>Copy ASIN</span><img src='https://drive-render.corp.amazon.com/view/shocklp@/media/print.png' width='20px' class='printBtn'></div>");
                //asinColumn[j].innerHTML+=("<span class='CopyBtn'>&#128203;</span>");
            }
        };
    };

    // Activate the copy buttons:
    $("table").on ("click", ".CopyBtn", zEvent => {
        //-- Get text of adjacent <div> and strip leading/trailing whitespace:
        var targetDiv   = $(zEvent.target).parent().siblings ("a");
        var textToCopy  = targetDiv.text ().trim ();

        GM_setClipboard (textToCopy, "text/plain");

        //-- Feedback to user:
        $(".justCopied").removeClass ("justCopied");
        targetDiv.parent ().parent ().addClass ("justCopied");
    } );
    // Activate the print buttons:
    $("table").on ("click", ".printBtn", zEvent => {
        //-- Get text of adjacent <div> and strip leading/trailing whitespace:
        var targetDiv   = $(zEvent.target).parent().siblings ("a");
        var textToCopy  = targetDiv.text ().trim ();
        //-- Feedback to user:
        $(".justCopied").removeClass ("justCopied");
        targetDiv.parent ().parent ().addClass ("justCopied");
        printAsin(textToCopy, 1);
    } );
};

function printAsin(asin, qty) {
  var params = "asin=" + asin + "&qty=" + qty + "&printerdpi=300&badgeid=" + readCookie("fcmenu-employeeId") + "&printerip=" + readCookie("fcmenu-remoteAddr") + "&localprint=TRUE";
  var url = "https://fc-art.corp.amazon.com/process?";

  GM_xmlhttpRequest({
    method: "POST",
    url: url,
    data: params,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
    console.log(`${url}${params}`);
}

function cptChecker(){
    /* CPT HIGHLIGHTER */
    if ( typeof scanColumn !== 'undefined') {
        for(var i=0; i<dateColumn.length; i++){
            var CPT = new Date(dateColumn[i].innerText) - new Date();
            if(CPT <= 5400000/*1.5 hours in ms*/ && CPT >= 0) {
                dateColumn[i].style.backgroundColor="#f88";
            }else if(CPT >= 5400000/*1.5 hours in ms*/ && CPT <= 10800000)/*2.5 hours in ms*/{
                dateColumn[i].style.backgroundColor="#ff3";
            }else{
                null
            };
        };
    };
};

var padTime = document.createElement('input');
var waaa = document.getElementById('shipment-list-highlight-delete-exception');
var minsNode = document.createTextNode("minutes");
var ptNode = document.createTextNode("PAD time: ");
waaa.appendChild(ptNode)
waaa.appendChild(padTime);
waaa.appendChild(minsNode);
padTime.style.textAlign = "center";
padTime.style.width = "36px";
padTime.maxLength=2;
padTime.style.borderRadius ="20%";

if (localStorage.padTime !== '' && localStorage.padTime > 0){
    padTime.value = localStorage.padTime; //whatever is in storage will load into the text field
};

var d1=[];
for(var i=0; i<dateColumn.length; i++){
    d1[i] = new Date (dateColumn[i].innerText) //get time from column and use to calculate pad times
    console.log(d1[i])
}

padTime.addEventListener('input', function updateValue(e){
    localStorage.padTime = e.target.value;   //set storage to whatever is in the text field
    if(padTime.value==""){
        localStorage.padTime = 0;
    }

bla();
});

function bla(){
    if ( typeof scanColumn !== 'undefined') {
         for(var i=0; i<dateColumn.length; i++){
             var tempDate = new Date ( d1[i] );
             tempDate.setMinutes ( d1[i].getMinutes() - JSON.parse(localStorage.padTime));
             //display the new PAD time in the column
             dateColumn[i].innerText = `${tempDate.getFullYear()}-${tempDate.getMonth()+1}-${tempDate.getDate()} ${(tempDate.getHours()<10?'0':'')}${tempDate.getHours()}:${(tempDate.getMinutes()<10?'0':'')}${tempDate.getMinutes()}`;
         }
     }
}

if ( typeof conditionColumn !== 'undefined' ) {
    for(var k=0;k<conditionColumn.length;k++){
        conditionColumn[k].classList.remove('relative'); //remove .relative class from conditions cell so the numbers stay centered}
    };
};

var tooMany = 300; //number of items on a page that is deemed too large and slows down the loading of the page
var howMany = document.getElementsByTagName('tr').length-1;
if (howMany >= tooMany){
    var header = document.getElementById('fcpn-head-bg')
    header.innerHTML+=(`<div id="disabledScript"><img src="https://drive-render.corp.amazon.com/view/shocklp@/media/note.png" style="height: 26px;">Too many items (${howMany}), Script disabled. Click to enable. (May take 30+ secs.)</div>`);
    addClipboard();
    cptChecker();
    var search=document.getElementById('shipment-search');
    search.setAttribute("onfocus", "this.value=''");
    document.getElementById('disabledScript').addEventListener("click",function(){
        addConditions();
        toteChecker();
        document.getElementById('disabledScript').outerHTML = (`<div id="enabledScript">Scripts Re-enabled!</div>`);
    });
    return;
};

    /* CONDITIONS TOOLTIP */
function addConditions(){
    var conditions=[]
    conditions[0]="Cancelled"
    conditions[1]="Pending Payment"
    conditions[2]="Shipment Paid"
    conditions[3]="Shipment Pending Bank"
    conditions[4]="Being Picked"
    conditions[5]="Sideline by FC"
    conditions[6]="Shipped"
    conditions[7]="Scanned"
    conditions[8]="Manifesting"
    conditions[9]="Resolve Pending"
    conditions[11]="Picking Giftwrap"
    conditions[12]="Giftwrapped"
    conditions[13]="Manifest Pending"
    conditions[14]="DC Complete"
    conditions[15]="Problem Solve"
    conditions[21]="Software Error"
    conditions[22]="Refund Pending"
    conditions[25]="Pending Partial Refund"
    conditions[26]="Partial Refund Complete"
    conditions[27]="Scanned Giftwrap"
    conditions[29]="Pending Picking"
    conditions[32]="Manifesting"
    conditions[34]="Cancelling Pending Bank"
    conditions[35]="Waiting for Ship Complete Reply"
    conditions[36]="DC Refund Pending Reply"
    conditions[37]="Pending Ship Confirm Email"
    conditions[38]="Pending FIFO Costs"
    conditions[39]="Waiting for Ship Complete Costed Reply"
    conditions[42]="Email Sent Pending Settlement Results"
    conditions[43]="Pending Confirm Email"
    conditions[44]="Pending Processing"
    conditions[45]="Hold Before Processing"
    conditions[46]="Waiting for Cow Reply"
    conditions[50]="Confirming Inventory"
    conditions[51]="Inventory Confirmed"
    conditions[52]="Requested Shipment Confirmed"
    conditions[53]="Service Number Acquired"
    conditions[54]="Shipment at Drop Shipper"
    conditions[55]="Drop Shipper Shipped"
    conditions[56]="Activating Service"
    conditions[57]="Service Activated"
    conditions[58]="Needs Manual Deposit Refund"
    conditions[59]="Canceled While Confirming Inventory"
    conditions[60]="Shipment Pending"
    conditions[62]="Drop Shipment ID Just Created"
    conditions[63]="Pending Delayed Payment"
    conditions[99]=""
    conditions[101]="Pending Shipment Creation"
    conditions[102]="Pending Payment-Reverse"
    conditions[104]="Pending Crossdock"
    conditions[108]="AMTRAM Shipment Manifest"
    conditions[121]="Generic Shipment Error"
    conditions[202]="Virtual Bundle Shipment Paid"
    conditions[215]="Virtual Bundle Child Pending Deletion"
    conditions[222]="Shipment Pending Planning"
    conditions[225]="Virtual Bundle Shipment Partial Refund Pending"
    conditions[226]="Virtual Bundle Shipment Partial Refund Complete"
    conditions[236]="Virtual Bundle Shipment FC Refund Pending Reply"
    conditions[251]=""
    conditions[351]="Pending Inventory Delete"
    conditions[352]="Pending Inventory Cost"
    conditions[603]=""
    conditions[666]=""
    conditions[704]="Pack in Progress"
    conditions[707]="Shipment Packed"
    conditions[1320]="Slammed Pending Shipping Label"
    conditions[2667]="FCPickingRollbackService"
    conditions[3010]=""
    conditions[3603]=""
    conditions[4665]="Customer Order Item ID Quantity Mismatch"
    conditions[4666]="Unknown Shipment"
    conditions[4667]="Undership"
    conditions[4668]="Overship"
    conditions[4669]="Shipment Not Paid"
    if ( typeof conditionColumn !== 'undefined' ) {
        for(k=0; k<conditionColumn.length; k++){
            conditionColumn[k].classList.add('condition'); //add class to condition cell
            var currentCond = conditionColumn[k].innerText;
            if(currentCond == 11||
               currentCond == 12||
               currentCond == 27){
                conditionColumn[k].innerHTML+=('&#127873;');
            }else if (currentCond == 15){
                conditionColumn[k].parentNode.style.boxShadow = 'inset -3px -3px 0px #f9f, inset 3px 3px 0px #f9f';
            }else{null};
            conditionColumn[k].innerHTML+=(`<span class='conditiontip tooltip'>${conditions[currentCond]}</span>`); //add tooltip to cell
        };
    };
};

function toteChecker(){
    /* TOTE CHECKER */
    if(typeof scanColumn !== 'undefined'){
        for(var l=0; l<scanColumn.length; l++){
            //scannableColumn[l].parentElement.classList.add('scannable'); //add class to scannable cell
            var currentScan = scanColumn[l].innerText;
            var tote = currentScan.match(/tsX0[a-z0-9]{7}\b/); //ex: tsX0388hygx
            var wall = currentScan.match(/ch[PR]Afe\d{3}[B-F]\d{3}/); //ex: chRAfe082E012
            var tray = currentScan.match(/st\d{7}/); //ex: st9507389
            var swp = currentScan.match(/tspsCollA10\d/); //ex: tspsCollA103
            var sp00 = currentScan.match(/sp\w{9}/); //ex: spGXxfrbvhz
            var mods = currentScan.match(/[PR]-\d-[A-Z]\d{2,3}[A-Z]\d{2,3}/); //ex: P-1-B173C553
            var prob = currentScan.match(/chPSMAIN[\d]?W\w{4,}/); //ex: chPSMAINW03E22 or chPSMAIN1W03E22
            var rbin = currentScan.match(/tsAfe\w{5}/); //ex: tsAfeRsG8
            var cart = currentScan.match(/rb[A-Z]{2,3}\w*/); //ex: rbMM2574A05
            var mezzps = currentScan.match(/chPSSNG\w{6,7}/); //ex: chPSSNG1W01A10
            var mezzgw = currentScan.match(/chPSGWW\d{2}[A-Z]\d+/); //ex: chPSGWW01A2
            var mezzrbin = currentScan.match(/rbbfall\d{3}[A-Z]\d{2}/);  //ex:  rbbfall059B03
            var oops = currentScan.match(/ch[PR]OOPS\w\d{3}/); //ex: chPOOPSA014
            var EXCP = currentScan.match(/tsEXCPRebin01/); //ex:tsEXCPRebin01
            var ooo = currentScan.match(/D\w{8}/); //ex: DqVQgr8Bz
            var ovg = currentScan.match(/ch(SNG|MAIN|SLAM)\d?(SLAM)?OVG\d/); //ex: chMAINOVG2 or chSNG1SLAMOVG1
            var psline = currentScan.match(/tsps[Ll](ine)?\d+[-_]\d*/); //ex: tspsL05-114 or tspsline1_17
            var pstote = currentScan.match(/tspsAFE\d{1,2}_\d{1,2}/); //ex: tspsAFE1601
            var hptote = currentScan.match(/tsAFE1pslv1/);
            var slamtote = currentScan.match(/tspsAFESLAM\d{1}/); //ex: tspsAFESLAM1
            var csXP = currentScan.match(/csXP[a-zA-Z0-9]{7}/); //ex: csXP25cXxz5
            var tspsGW = currentScan.match(/tspsGW[0-9]{2}/); //tspsGW23
            var tspsKDP = currentScan.match(/tspsKDP[0-9]{2}/); //tspsGW23


            if (tote !== null) {
                            //console.log(`%c Tote: ${tote}`,'background-color:yellow;');
            }else if (tspsGW !== null){
                //do nothing
            }else if (tspsKDP !== null){
                //do nothing
            }else if (hptote !== null){
                scanColumn[l].parentNode.style.backgroundColor = '#93ff93';
            }else if (pstote !== null || slamtote != null){
                scanColumn[l].parentNode.style.boxShadow = 'inset -3px -3px 0px rgb(191, 128, 255), inset 3px 3px 0px rgb(191, 128, 255)';
                            //console.log(`%c PS Tote: ${pstote}`, 'background-color:purple; color:#fff');
            }else if (wall !== null){
                            //console.log(`%c Wall: ${wall}`, 'color:black');
            }else if (tray !== null){
                            //console.log(`%c Tray: ${tray}`, 'background-color:brown; color:white');
            }else if (swp !== null){
                scanColumn[l].parentNode.style.boxShadow = 'inset -3px -3px 0px rgb(255, 100, 255), inset 3px 3px 0px rgb(255, 100, 255)';
                            //console.log(`%c Sweep Cart: ${swp}`, 'background-color:purple; color:#fff');
            }else if (sp00 !== null){
                            //console.log(`%c sp00: ${sp00}`, 'color:orange');
            }else if (mods !== null){
                            //console.log(`%c Mods: ${mods}`, 'color:blue');
            }else if (prob !== null){
                            //console.log(`%c Problem Solve: ${prob}`, 'background-color:purple; color:#fff');
            }else if (rbin !== null){
                            //console.log(`%c Rebin: ${rbin}`, 'color:green');
            }else if (cart !== null){
                            //console.log(`%c PSCart: ${cart}`, 'background-color:purple; color:#fff');
            }else if (mezzps !== null){
                            //console.log(`%c Mezz PS: ${mezzps}`, 'background-color:purple; color:#fff');
            }else if (mezzgw !== null){
                            //console.log(`%c Mezz GW: ${mezzgw}`, 'background-color:purple; color:#fff');
            }else if (mezzrbin !== null){
                            //console.log(`%c Mezz GW: ${mezzgw}`, 'background-color:purple; color:#fff');
            }else if (oops !== null){
                            //console.log(`%c OOPS Chute: ${oops}`, 'background-color:purple; color:#fff');
            }else if (EXCP !== null){
                            //console.log(`%c EXCP Rebin: ${EXCP}`, 'color:green');
            }else if (ovg !== null){
                            //console.log(`%c Overage Bin: ${ovg}`, 'background-color:purple; color:#fff');
            }else if (psline !== null){
                            //console.log(`%c PS Line: ${psline}`, 'background-color:purple; color:#fff');
            }else if (csXP !== null){
                            //console.log(`%c Case: ${csXP}`, 'background-color:#f00; color:#000');
            }else if (ooo !== null){
                            //console.log(`%c Unfnished Shipment: ${ooo}`, 'background-color:#000; color:#fff');
                scanColumn[l].innerHTML+=("<span class='conditiontip tooltip'>Unfinished Shipment</span>")
                scanColumn[l].parentElement.classList.add('badScan');
                scanColumn[l].classList.add('condition');
            }else if (currentScan == ''){
                            //console.log(`%c Blank Cell`, 'color:#000');
            }else{
                            //console.log(`%c Bad Scan: ${currentScan[l]}`, 'color:red');
                scanColumn[l].innerHTML+=("<span class='conditiontip tooltip'>Bad Tote Scan</span>")
                scanColumn[l].parentElement.classList.add('badScan');
                scanColumn[l].classList.add('condition');
                //scannableColumn[l].firstElementChild.classList.add('badScan');
            };
        };
    };
};
    /*
if ( typeof shipColumn !== 'undefined') {
    for (j=shipColumn.length-1;j>=0;j--){
        if(typeof shipColumn[j].getElementsByClassName('euler-link')[0] !== 'undefined'){ //if the quick links exists...
            var link2euler = shipColumn[j].getElementsByClassName('euler-link')[0].href;  //define a variable for it's HREF..
            shipColumn[j].getElementsByClassName('euler-link')[0].remove();               //then delete the button...
            shipColumn[j].innerHTML+=("<div class='relative'><a href='" + link2euler + "' class='quickLink' target='_blank'><img src='https://drive.corp.amazon.com/view/shocklp@/media/euler.png'></a><span class='tooltip tooltip--pos'>Euler</span></div>");      //and add our new button.
        };
        if(typeof shipColumn[j].getElementsByClassName('hero-link')[0] !== 'undefined'){
           var link2hero = shipColumn[j].getElementsByClassName('hero-link')[0].href;
            shipColumn[j].getElementsByClassName('hero-link')[0].remove();
            shipColumn[j].innerHTML+=("<div class='relative'><a href='" + link2hero + "' class='quickLink' target='_blank'><img src='https://drive.corp.amazon.com/view/shocklp@/media/hero.png'></a><span class='tooltip tooltip--pos'>Hero</span></div>");
        };
        if(typeof shipColumn[j].getElementsByClassName('aps-link')[0] !== 'undefined'){
            var link2aps = shipColumn[j].getElementsByClassName('aps-link')[0].href;
            shipColumn[j].getElementsByClassName('aps-link')[0].remove();
            shipColumn[j].innerHTML+=("<div class='relative'><a href='" + link2aps + "' class='quickLink' target='_blank'><img src='https://drive.corp.amazon.com/view/shocklp@/media/aps.png'></a><span class='tooltip tooltip--pos'>APS</span></div>");
        };
        if(typeof shipColumn[j].getElementsByClassName('filter-link')[0] !== 'undefined'){
            var link2filter = shipColumn[j].getElementsByClassName('filter-link')[0].href;
            shipColumn[j].getElementsByClassName('filter-link')[0].remove();
            shipColumn[j].innerHTML+=("<div class='relative'><a href='" + link2filter + "' class='quickLink' target='_blank'><img src='https://drive.corp.amazon.com/view/shocklp@/media/filter.png'></a><span class='tooltip tooltip--pos'>Filter</span></div>");
        };
    };
};
*/
cptChecker();
addClipboard();
addConditions();
toteChecker();
bla();


function outerScanTooltip(){
    /* TOTE CHECKER */
    if(typeof outerColumn !== 'undefined'){
        for(var l=0; l<outerColumn.length; l++){
            //scannableColumn[l].parentElement.classList.add('scannable'); //add class to scannable cell
            var current = outerColumn[l].innerText;
            /*outer locations*/
            var xa = current.match(/reMAINW\d{2}/); //ex: reMAINW03
            var xb = current.match(/srAfe\d{3}/); //ex: srAfe092
            var xc = current.match(/AFEProbSolve/);
            var xd = current.match(/wsAFE_\d{2}_\d{2}/); //ex: wsAFE_04_03
            var xe = current.match(/cvAtPM00002/);
            var xf = current.match(/cvER_INDUCT/);
            cvPR_IND_7_8
            in004
            cvER_PASS_THRU_L1M3
            pmP-1-L
            cvRR_LANE_01
            cvRsAfeOut8
            rsAfeRebin3


            /*
            if (tote !== null) {
                //            console.log(`%c Tote: ${tote}`,'background-color:yellow;');
            }else if (ooo !== null){
                //            console.log(`%c Unfnished Shipment: ${ooo}`, 'background-color:#000; color:#fff');
                scanColumn[l].innerHTML+=("<span class='conditiontip tooltip'>Unfinished Shipment</span>")
                scanColumn[l].parentElement.classList.add('badScan');
                scanColumn[l].classList.add('condition');
            }else if (currentScan == ''){
                //            console.log(`%c Blank Cell`, 'color:#000');
            }else{
                //            console.log(`%c Bad Scan: ${currentScan[l]}`, 'color:red');
                scanColumn[l].innerHTML+=("<span class='conditiontip tooltip'>Bad Tote Scan</span>")
                scanColumn[l].parentElement.classList.add('badScan');
                scanColumn[l].classList.add('condition');
                //scannableColumn[l].firstElementChild.classList.add('badScan');

            };*/
        };
    };
};