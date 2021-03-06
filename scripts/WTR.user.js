// ==UserScript==
// @name         Workflow Tab Renamer
// @namespace    com.amazon.shocklp
// @version      0.6
// @description  Renames the workflow tabs so that they are different
// @author       Phillip Shockley | shocklp
// @downloadURL  https://github.com/Pshock13/shocklp/blob/master/scripts/WTR.user.js
// @updateURL    https://github.com/Pshock13/shocklp/blob/master/scripts/WTR.user.js
// @sourceURL    https://github.com/Pshock13/shocklp/blob/master/scripts/WTR.user.js
// @match        https://flow-sortation-na.amazon.com/*
// @require      https://code.jquery.com/jquery-3.3.1.js
// @grant        none
// @run-at       document-end
// ==/UserScript==


setInterval(function getTime(){

    if(document.body.contains(document.getElementsByClassName('navbar-text ng-binding')[0])){
        var time = document.getElementsByClassName('navbar-text ng-binding')[0].innerText;
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

setTimeout(function newLink(){
var allA = document.querySelectorAll('td a[class="ng-binding"]');
console.log(allA);
document.querySelectorAll('td a[class="ng-binding"]')
  .forEach((a) => {
    const aa = a.innerText;
    a.href = `https://fclm-portal.amazon.com/employee/timeDetails?employeeId=${aa}&warehouseId=PHL7`;
  });
}, 1000);