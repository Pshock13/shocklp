// ==UserScript==
// @name         Workflow Tab Renamer
// @namespace    com.amazon.shocklp
// @version      0.3
// @description  Renames the workflow tabs so that they are different
// @author       Phillip Shockley | shocklp
// @downloadURL  https://drive.corp.amazon.com/view/shocklp@/Scripts/WTR.user.js
// @updateURL    https://drive.corp.amazon.com/view/shocklp@/Scripts/WTR.user.js
// @sourceURL    https://drive.corp.amazon.com/view/shocklp@/Scripts/WTR.user.js
// @match        https://flow-sortation-na.amazon.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

/* window.addEventListener('mouseover',function() {
        if(document.body.contains(document.getElementsByClassName('text-center wcs-con-count-number ng-binding')[0])){
            var trays = document.getElementsByClassName('text-center wcs-con-count-number ng-binding')[0].innerText
if (window.location == 'https://flow-sortation-na.amazon.com/PHL7/#/wcs/container-count'){
    document.getElementsByTagName('title')[0].innerText = `${trays} Tray Count`
}
        }
    }
)
*/
setInterval(function getTime(){
    if(document.body.contains(document.getElementsByClassName('navbar-text ng-binding')[1])){
        var time = document.getElementsByClassName('navbar-text ng-binding')[1].innerText;
        var trays = document.getElementsByClassName('text-center wcs-con-count-number ng-binding')[0].innerText;
        document.getElementsByTagName('title')[0].innerText = `${trays} Tray Count`
        //console.log(trays);
        if (time == 'undefined'){
            getTime()
        }
    }
},1000)

if (window.location == 'https://flow-sortation-na.amazon.com/PHL7/#/afe/workforce'){
    document.getElementsByTagName('title')[0].innerText = `AFE Workforce`
}else if (window.location == 'https://flow-sortation-na.amazon.com/PHL7/#/afe/rainbow'){
    document.getElementsByTagName('title')[0].innerText = `Rainbow`
}else if (window.location == 'https://flow-sortation-na.amazon.com/PHL7/#/wcs/container-count'){
    document.getElementsByTagName('title')[0].innerText = `Tray Count`
}else if (window.location == 'https://flow-sortation-na.amazon.com/PHL7/#/afe/rates'){
    document.getElementsByTagName('title')[0].innerText = `Rates`
}else if (window.location == 'https://flow-sortation-na.amazon.com/PHL7/#/afe/induct/buffers'){
    document.getElementsByTagName('title')[0].innerText = `Buffer Status`
}


