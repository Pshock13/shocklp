// ==UserScript==
// @name         POPS Master User
// @namespace    com.amazon.shocklp
// @version      1.4.2
// @description  Adds functions to the POPS UI
// @author       Phillip Shockley | shocklp
// @match        http://aft-pops-iad.aka.amazon.com/*
// @grant        GM_info
// @grant        GM_addStyle
// @downloadURL  https://drive.corp.amazon.com/view/shocklp@/Scripts/POPS_MU.user.js
// @updateURL    https://drive.corp.amazon.com/view/shocklp@/Scripts/POPS_MU.user.js
// @sourceURL    https://drive.corp.amazon.com/view/shocklp@/Scripts/POPS_MU.user.js
// @require      https://code.jquery.com/jquery-3.3.1.js
/*// @require      https://github.com/lindell/JsBarcode/releases/download/v3.11.0/JsBarcode.all.jss*/
// @require      https://cdn.jsdelivr.net/npm/jsbarcode@3.11.0/dist/JsBarcode.all.min.js
// @run-at       document-idle
// ==/UserScript==

var notes =`
Test:
◼ does putting in a bigger number than chuteMax actually add the 'error' class to the input field?
☑ does selecting another overage beside the default remove the old ovg from history and add the new one?

Create:
◼ default chute letter. Have a chute automatically be chosen when checking in items, also have the other chute buttons underneath incase you need to use anotherwall
◼ get ALL buttons to change color
◼ background positioning
◼ add themes
◼ holiday themes based on date

Coding:
◼ add mezz totes to check in. ex tspsSNG_06_03
◼ condense the history list localStorage
◼ have the overage barcode change when switching overages (so as to not make a long list of overages that were not actually used)
`;


//https://lindell.me/JsBarcode/#cdn
setTimeout(popsMU, 500);
if ( document.styleSheets[4]){
console.log('stylesheet loaded!')
}else{
        console.log('stylesheet not loaded')
    };

function popsMU(){
    //Change Tab name
    document.getElementsByTagName('title')[0].innerText = `POPS`

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var user = document.getElementById('hcUsername').value                                      //the user that is signed in
    ,   theBarcode                                                                              //the barcode that has been generated and placed on screen
    ,   version = GM_info.script.version                                                        //this script's current version
    ,   backdrop = document.createElement('div')                                                //semi-transparent fill for when the settings appear
    ,   body = document.getElementsByTagName('body')[0]                                         //the body
    ,   FC = JSON.parse(document.getElementById('cookieJSON').value).warehouseId                //warehouse ID from hidden input
    ,   areaId = JSON.parse(document.getElementById('cookieJSON').value).areaId                 //areaId from hidden input (ex. psMAIN, psSNG1 or psGW)
    ,   navbar = document.styleSheets[1].cssRules                                               //the top navigation bar's styles
    ,   gear = document.createElement('span')                                                   //gear button that leads to the settings
    ,   custom = document.styleSheets[4].cssRules[3].selectorText.slice(12,29)                  //ex. _ngcontent-vpm-14
    ,   generated = document.styleSheets[4].cssRules[3].selectorText.slice(12,27)               //ex. _ngcontent-vpm-
    ,   colorSheet = document.styleSheets[4]                                                    //style sheet used for changing the colors of buttons
    ,   X = document.createElement('span')                                                      //to close the settings modal
    ,   confirm = document.createElement('button')                                              //the settings 'apply' button
    ,   ovgPrefix                                                                               //for overage bins
    ,   sections                                                                                //for check-in chutes (letters of the walls)
    ,   chutePrefix                                                                             //prefix of the chute based on location (afe v. mezz)
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //Variable classes/ids////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    gear.innerHTML = '&#9881;';                                                                 //gives the gear shape
    gear.classList.add('gear');                                                                 //adds a class to the gear for styles
    backdrop.className = 'backdrop';                                                            //adds a class to the backdrop for styles
    X.className = 'X';                                                                          //adds a class to the 'X'' for styles
    X.innerHTML = '&times;';                                                                    //gives the X shape

    body.appendChild(gear);                                                                     //add the gear to the body
    body.appendChild(backdrop);                                                                 //add the backdrop to the body

    /*----------------------------------------------------------------------------------------------------------------------------------------------------------*/
    switch(areaId){
        case 'psMAIN': //AFE
            ovgPrefix = 'chMAINOVG';
            sections = ['A','B','C','D','E'];
            chutePrefix = 'chPSMAINW0';
            break;                                                                                  //this determines a few things based on where you are problem
        case 'psSNG1': //Mezz                                                                       //solving, be it AFE, MEZZ, or GW.
            ovgPrefix = 'chSNG1OVG';
            sections = ['A','B','C','D','E','F','G','H','I','J','K','L','M'];
            chutePrefix = 'chPSSNG1W0';
            break;
        case 'psGW':
            ovgPrefix = 'chGWOVG1';
            sections = ['A'];
            chutePrefix = 'chPSGWW0';
    }
    /*----------------------------------------------------------------------------------------------------------------------------------------------------------*/

    setInterval(function addBarcode(){

        if (document.body.contains(document.getElementsByClassName('text-position text-style-title')[0])){
            var el = document.getElementsByClassName('text-position text-style-title')[0]       //the barcode(s) will be replacing this element
            , instruction = document.getElementsByClassName('text-position text-style-instruction')[0].innerText;
        };
        //console.log(instruction)
        var newDiv = document.createElement('div')
        newDiv.id = 'newDiv'
        if(el){
            el.replaceWith(el, newDiv);
            el.className='newElClass';
        };

        var barcodeElement = document.createElement('img');
        barcodeElement.id = 'barcode';

        /********************************************************************************/
        /***************************Overaging an item************************************/
        /********************************************************************************/
        if (instruction === 'Scan Overage Bin to Move Item'){
            newDiv.appendChild(barcodeElement);                                               //add the id tagged element for the barcode into the new div
            var def_num = JSON.parse(localStorage.settings).def_overage;
            JsBarcode("#barcode", `${ovgPrefix}${def_num}`)                                   //display default overage barcode
            theBarcode = `${ovgPrefix}${def_num}`;
            addToHistory();                                                                   //record to history

            function ovgButtons(){
                for(var j=0;4>j;j++){                                                         //creates the buttons 'Overage 1-4'
                    var btn = document.createElement('button');
                    btn.innerText = `Overage ${j+1}`;                                         //adds text 'Overage x' to each button where x is 1-4
                    btn.className = 'btn btn-block btn-lg btn-custom';
                    btn.setAttribute(`${custom}`,'');
                    btn.addEventListener("click", ovgBarcode);
                    newDiv.appendChild(btn);
                };
                function ovgBarcode(){
                    var whatNum = this.innerText.substring(this.innerText.length - 1, this.innerText.length); //grabs the number at the end of the button text
                    JsBarcode("#barcode", `${ovgPrefix}${whatNum}`)                                          //generates the barcode
                    theBarcode = `${ovgPrefix}${whatNum}`;
                    //console.log('overage specific history change');
                    list = JSON.parse(localStorage.History);
                    list.shift();
                    count.shift();
                    list.unshift(theBarcode);
                    count.unshift(0);
                    localStorage.setItem('History', JSON.stringify(list));
                    localStorage.setItem('count', JSON.stringify(count));
                    addToHistory();
                }
                document.getElementById('barcode').addEventListener('click', clickBarcode);
            };
            ovgButtons();
            /********************************************************************************/
            /*********************When checking-in & picking the chute***********************/
            /********************************************************************************/
        }else if(instruction === 'Scan Chute to Move Item' && document.getElementsByClassName('component')[3].innerText == ''){
            //https://www.ianposton.com/create-multiple-buttons-with-javascript/
            function addButtons(){
                for(var i=0;i<sections.length;i++){
                    let btn = document.createElement('button');
                    btn.innerText = sections[i];                             //sections is determinded by PS location
                    btn.className = 'btn btn-block btn-lg btn-custom';
                    btn.setAttribute(`${custom}`,'');
                    newDiv.appendChild(btn);
                    btn.addEventListener("click",chute_input)
                }
                function chute_input(){
                    var sect = this.innerText
                    ,wallNum
                    ,chuteMax;
                    if(areaId == 'psMAIN'){
                        switch(sect){
                            case 'A':
                                wallNum = 1;
                                chuteMax = 32;
                                break;
                            case 'B':
                                wallNum = 1;
                                chuteMax = 24;
                                break;
                            case 'C': //fallthrough
                            case 'D': //fallthrough
                            case 'E':
                                wallNum = 3;
                                chuteMax = 40;
                                break;
                        }}else if (areaId = 'psSNG1'){
                            wallNum = 1;
                            chuteMax = 34;
                        }
                    var input = document.createElement('input'); //Known issue, input will accept decimal numbers and create barcodes like chPSMAINW01A1.2
                    input.setAttribute("type", "text");
                    input.placeholder = `1-${chuteMax}`;
                    var submitBtn = document.createElement('button');
                    submitBtn.innerText = `Submit (\\)`;
                    /*input.onblur = function(){
                    while (input.value == ''){
                        input.placeholder = `1-${chuteMax}`}
                };*/
                    input.id = "chuteInput";
                    /*input.onfocus = function () {
                    while (input.value != ''){                  //While something has been typed in the field
                        input.placeholder = '';            //the placeholder will disappear
                    }
                };*/
                    input.addEventListener('keypress', function submitWallNum(e){
                        var key = e.which || e.keyCode;
                        if (key === 92 && input.value > 0 && input.value <= chuteMax) {// 92 is \ 'backslash'
                            var chuteNum = input.value;
                            input.parentNode.replaceChild(barcodeElement, input);
                            JsBarcode("#barcode",`${chutePrefix}${wallNum}${sect}${chuteNum}`);
                            theBarcode = `${chutePrefix}${wallNum}${sect}${chuteNum}`;
                            //console.log(theBarcode);
                            addToHistory();
                            var myBtn = document.createElement('button');
                            myBtn.type = 'button';
                            myBtn.className = 'sect-btn';
                            myBtn.innerText = 'Use another chute';
                            myBtn.addEventListener('click', function(){
                                removeButtons();
                                newDiv.className = 'text-position text-style-title';
                                addButtons();
                            });

                            submitBtn.remove();
                            document.getElementById('barcode').parentNode.appendChild(myBtn); //'use another chute' button
                        }else if(key === 92 && input.value > chuteMax){
                            console.log('error should be added to classlist');
                            input.classList.add('error');
                            input.value = '';
                        }
                    });

                    submitBtn.addEventListener('click', function (){
                        if (input.value > 0 && input.value <= chuteMax) {// 92 is \ 'backslash'
                            var chuteNum = input.value;
                            input.parentNode.replaceChild(barcodeElement, input);
                            JsBarcode("#barcode",`${chutePrefix}${wallNum}${sect}${chuteNum}`);
                            theBarcode = `${chutePrefix}${wallNum}${sect}${chuteNum}`;
                            //console.log(theBarcode);
                            addToHistory();
                            var myBtn = document.createElement('button');
                            myBtn.type = 'button';
                            myBtn.className = 'sect-btn';
                            myBtn.innerText = 'Use another chute';
                            myBtn.addEventListener('click', function(){
                                removeButtons();
                                newDiv.className = 'text-position text-style-title';
                                addButtons();
                            });

                            submitBtn.remove();
                            document.getElementById('barcode').parentNode.appendChild(myBtn); //'use another chute' button
                        }else if(input.value > chuteMax){
                            console.log('error should be added to classlist');
                            input.classList.add('error');
                            input.value = '';
                        }
                    });

                    removeButtons();
                    newDiv.appendChild(input);
                    newDiv.appendChild(submitBtn);
                    submitBtn.className = 'sect-btn';
                    input.focus();
                };
            }
            addButtons();
            /********************************************************************************/
            /**************************When clearing chutes**********************************/
            /********************************************************************************/
        }else if(instruction === 'Scan Chute and Move Items to an Overage Container'){
            var scanChute = document.getElementsByClassName('component')[2].innerText;
            var doesMatch = scanChute.match(/chPS(SNG|MAIN)\d?W\d{2}\w{1}\d{1,2}/);
            if (doesMatch !== null && doesMatch !== ''){
                newDiv.appendChild(barcodeElement);
                barcodeElement.className = "component";
                JsBarcode("#barcode", `${scanChute}`);
                theBarcode = `${scanChute}`;
                //console.log(theBarcode);
                addToHistory();
            }
            /********************************************************************************/
            /****************when checking-in and not picking the chute**********************/
            /********************************************************************************/
        }else if(instruction === 'Scan Chute to Move Item'){
            scanChute = document.getElementsByClassName('component')[3].innerText; //grabs the text of the chute to be scanned ex:chPSMAINW01A21
            doesMatch = scanChute.match(/chPS(SNG|MAIN)\d?W\d{2}\w{1}\d{1,2}/);
            if(scanChute == "No more items" || scanChute == "No more items\nExit" || scanChute == ""){
                // do nothing
            }else if (doesMatch !== null && doesMatch !== ''){
                newDiv.appendChild(barcodeElement);
                barcodeElement.className = "component";
                JsBarcode("#barcode", `${scanChute}`);
                theBarcode = `${scanChute}`;
                //console.log(theBarcode);
                addToHistory();
            }
            /********************************************************************************/
            /****************When checking-in from problem solve totes***********************/
            /********************************************************************************/
        }else if(instruction === 'Scan Tote or Scan SP00' && areaId == 'psMAIN'){
            var newInstructions = document.createElement('span');
            newInstructions.innerHTML = '<h2> Scan a SP00 or select a number below to generate PS tote barcode</h2>';
            newDiv.appendChild(newInstructions);

            newDiv.appendChild(barcodeElement);
            JsBarcode("#barcode",`tsAFE1pslv1`);
            for(var i=0;i<18;i++){
                let btn = document.createElement('button');
                btn.innerText = [i+1];
                btn.className = 'btn btn-block btn-lg btn-custom half';
                btn.setAttribute(`${custom}`,'');
                btn.addEventListener("click",wallBarcode);
                newDiv.appendChild(btn);
            }
            function wallBarcode(){
                removeButtons();
                newDiv.appendChild(barcodeElement);
                JsBarcode("#barcode",`tspsAFE${this.innerText}_01`);
            }
            /********************************************************************************/
            /***********************When unsidelining a shipment*****************************/
            /********************************************************************************/
        }else if (instruction ==='Scan Chute to Sideline or Unsideline Shipment'){
            console.log('Make each shipment that is listed to unsideline clickable so that it produces the chute number as a barcode');
            var unside = document.getElementsByClassName('lms-box-text');
            for(i=0;i<unside.length;i++){
                var usBTN = document.createElement('button');
                usBTN.innerText = 'Show barcode';
                usBTN.classList.add('unsideline');
                unside[i].appendChild(usBTN);
                usBTN.addEventListener('click', function (){
                    newDiv.appendChild(barcodeElement);
                    JsBarcode("#barcode",`${this.parentNode.children[0].innerText.slice(33, 47).trim()}`);
                });
            }

        }else if(document.getElementsByClassName('text-input-style')[0]){
            document.getElementsByClassName('text-input-style')[0].focus();
        };
    },500);


    //currently does not work as intented
    function clickBarcode(){
        console.log(`Clicked! Barcode: ${theBarcode}`);
        [...theBarcode].forEach(function(c) {
            window.dispatchEvent(new KeyboardEvent('keydown', {'key': c}));
            //window.dispatchEvent(new KeyboardEvent('keydown', {'key': c}));
            //window.dispatchEvent(new KeyboardEvent('keyup', {'key': c}));
        });
        window.dispatchEvent(new KeyboardEvent('keydown', {
            code: 'Enter',
            key: 'Enter',
            charKode: 13,
            keyCode: 13
        }));
        /*window.dispatchEvent(new KeyboardEvent('keyup', {
        code: 'Enter',
        key: 'Enter',
        charKode: 13,
        keyCode: 13
    }));*/
    };

    //window.addEventListener('keydown', function(e){ console.log(`key: ${e.key}, keyCode: ${e.keyCode}`) });

    //https://blog.logrocket.com/the-complete-guide-to-using-localstorage-in-javascript-apps-ba44edb53a36

    //this will be for storing and displaying the history of scanned chutes
    var list = []
    ,   count = []
    ,   historyTitle = document.createElement('h1');


    //Update history list
    /************************************************************************************************************************************************************************ */
    function addToHistory(){
        if(localStorage.History) {list = JSON.parse(localStorage.History);} //turn localStorage into arrays
        if(localStorage.count) {count = JSON.parse(localStorage.count);}
        if(list.length > 5 ||
           count.length > 5 ||
           localStorage.count==null ||
           localStorage.History==null){                                                                //delete all history if for some reason
            localStorage.History = '';                                                                            //either has more than 5 logged or if one doesn't exist
            localStorage.count = '';
            list=[];
            count=[];
        }
        if(theBarcode!=undefined){
            //console.log('general history change');
            if (localStorage.History === null ||
                localStorage.count === null) {                                                         //start history if none exists
                list.push(theBarcode);
                count.push(1);
            }else if(theBarcode == list[0]){                                                                      //+1 in history if the same barcode is generated
                count[0]++;
            }else if (list.length == 5){                                                                         //when history reaches 5 entries
                list.pop();                                                                                       //remove oldest history
                count.pop();
                list.unshift(theBarcode);                                                                         //add theBarcode to the front of history
                count.unshift(1);
            }else {
                list.unshift(theBarcode);                                                                         //only add theBarcode when less than 5 in history
                count.unshift(1);
            }
            localStorage.setItem('History', JSON.stringify(list)); //save new arrays in localStorage
            localStorage.setItem('count', JSON.stringify(count));
        }
        //Display History
        //Create container & title if they dont already exist
        if (document.body.contains(document.getElementById('historyContainer'))){
            //delete previous history entries
            while(document.getElementById('history').firstChild){
                document.getElementById('history').firstChild.remove();
            }
        }else{
            var historyContainer = document.createElement('div')
            ,   popup = document.createElement('div')                                                           //div for the invisible popup
            ,   qMark = document.createElement('span')
            ,   trash = document.createElement('span')                                                          //trash can delete button
            ,   inside = document.createElement('p')                                                            //p tag for text inside popup
            ,   ul = document.createElement('ul');

            historyContainer.id = 'historyContainer';
            qMark.innerHTML = '&#x2754;';
            qMark.id = 'qMark';
            popup.className = 'popup';
            inside.innerText = 'This history is only of barcodes generated, not necessarily barcodes scanned';
            historyTitle.id = 'title';
            historyTitle.innerText = 'History';
            trash.id = 'trash';
            trash.innerHTML = '&#x1F5D1;';
            historyContainer.appendChild(historyTitle);
            ul.id = 'history';

            document.getElementsByTagName('body')[0].appendChild(historyContainer);
            historyTitle.appendChild(trash);
            historyTitle.appendChild(qMark);
            historyTitle.appendChild(popup);                                                                   //add the popup to the page
            popup.appendChild(inside);                                                                         //put the text in the popup
            document.getElementById('historyContainer').appendChild(ul);

            trash.onclick = function(event){
                if(event.target == trash){
                    localStorage.removeItem('History');
                    localStorage.removeItem('count');
                    while(ul.firstChild){
                        ul.firstChild.remove()
                    }
                }
            }
        };

        //create and add each history item
        for(var i=0;i<list.length;i++){
            var li = document.createElement('li');
            li.className = 'button-component btn-custom';
            li.style.display='block';
            li.setAttribute(`${custom}`,'');
            if (count[i] == 1){
                li.innerText = list[i]; //display just the barcode if it is the first of its kind
            }else if (count[i] > 1){
                li.innerText = `${list[i]} (${count[i]})`; //display the barcode and the number of times it has been scanned
            }
            li.addEventListener('click', toFcResearch);
            document.getElementById('history').appendChild(li)
        }
    }

    /***************************************************************************************************************************************************************/
    function toFcResearch(){
        var chute = this.innerText.replace(/ .*/,'');                                                 //removes '(#)' so that the link works when clicking the button
        window.open(`http://fcresearch-na.aka.amazon.com/${FC}/results?s=${chute}`, '_blank');
    }
    /***************************************************************************************************************************************************************/
    addToHistory();

    function removeButtons(){//removes the numbered buttons when one of them is clicked
        while(newDiv.firstChild){
            newDiv.firstChild.remove();
        }
    }
    /*https://www.w3schools.com/howto/howto_js_rangeslider.asp*/

    /****************************************************************************************************************************************************************
***************************************************************************** SETTINGS *************************************************************************
****************************************************************************************************************************************************************/
    var defaultSettings = {
        color0:{h:210, s:100, l:40, a:1}, //blue
        color1:{h:34,s:84, l:50, a:1}, //orange
        color2:{h:210,s:100, l:13, a:1}, //gray
        background: '',
        position: 'cover',
        def_overage: 1,
        def_section: 'A',
    }
    ,settingsContent = document.createElement('div')
    ,version_container = document.createElement('span')
    ,colorDiv = document.createElement('div')
    ,applyBtn = document.createElement('button')
    ,bgLink = document.createElement('input')
    ,imagePos = document.createElement('select')
    ,defOvg = document.createElement('select')
    ,defSec = document.createElement('select')
    ,resetDefault = document.createElement('button')
    ,ovgDiv = document.createElement('div')
    ,wallDiv = document.createElement('div')
    ,label = []
    ,hueSlider = []
    ,satSlider = []
    ,lightSlider = []
    ,alphaSlider = []
    ,pos = []
    ,settings;


    /*****************************************************************************Storing settings**************************************************************************************/

    if(localStorage.settings == null){                                     //if there is no stored settings,
        localStorage.settings=JSON.stringify(defaultSettings);             //create stored settings from the defaultSettings
        settings = JSON.parse(localStorage.settings);                      //and pull the stored settings into var settings
    }else{
        settings = JSON.parse(localStorage.settings)}                      //just pull the stored settings into var settings

    Object.keys(defaultSettings).forEach(function(key) {                              //for each key in the defaultSettings
        if(JSON.parse(localStorage.settings)[key] == undefined){                          //when the matching key is undefined in stored setting (ie. a new setting is introduced)
            console.log(`settings.${key} is undefined, adding the default to stored settings`)
            settings[key] = defaultSettings[key];                                         //make the key of settings equal to the key of defaultSettings
            localStorage.settings=JSON.stringify(settings);                               //and save setting into localStorage
        }
    });
    /***********************************************************************************************************************************************************************************/


    gear.classList.add('gear');
    document.getElementsByTagName('body')[0].appendChild(gear);
    gear.addEventListener('click', settingsModal);
    settingsContent.classList.add('settings-content');


    settingsContent.appendChild(version_container);
    if (user =='shockl'){
        version_container.innerText = `Version: ${version}
${notes}`
    }else{
        version_container.innerText = `Version: ${version}`
    }

    /*SLIDERS*/
    /*Create each slider and label, add attribute, append*/
    for(var s=0; s<=2; s++){
        hueSlider[s] = document.createElement('input');
        satSlider[s] = document.createElement('input');
        lightSlider[s] = document.createElement('input');
        alphaSlider[s] = document.createElement('input');
        label[s] = document.createElement('label');         //create label[0-2]

        hueSlider[s].type = 'range';
        hueSlider[s].min='0';
        hueSlider[s].max='360';
        hueSlider[s].className = 'hue';

        satSlider[s].type = 'range';
        satSlider[s].min = '0';
        satSlider[s].max = '100';
        satSlider[s].className = 'sat';

        lightSlider[s].type = 'range';
        lightSlider[s].min = '0';
        lightSlider[s].max = '100';
        lightSlider[s].className = 'light';

        alphaSlider[s].type = 'range';
        alphaSlider[s].min = '0';
        alphaSlider[s].max = '1';
        alphaSlider[s].className = 'alpha';
        alphaSlider[s].step = '.1';

        label[s].className = 'center';

        colorDiv.appendChild(label[s]);
        colorDiv.appendChild(hueSlider[s]);
        colorDiv.appendChild(satSlider[s]);
        colorDiv.appendChild(lightSlider[s]);
        colorDiv.appendChild(alphaSlider[s]);
    }
    /*set the value (position of the slider thumb) for each slider based on what is saved in storage*/
    function thumbChange(){
        hueSlider[0].value = JSON.parse(localStorage.settings).color0.h;
        hueSlider[1].value = JSON.parse(localStorage.settings).color1.h;
        hueSlider[2].value = JSON.parse(localStorage.settings).color2.h;

        satSlider[0].value = JSON.parse(localStorage.settings).color0.s;
        satSlider[1].value = JSON.parse(localStorage.settings).color1.s;
        satSlider[2].value = JSON.parse(localStorage.settings).color2.s;

        lightSlider[0].value = JSON.parse(localStorage.settings).color0.l;
        lightSlider[1].value = JSON.parse(localStorage.settings).color1.l;
        lightSlider[2].value = JSON.parse(localStorage.settings).color2.l;

        alphaSlider[0].value = JSON.parse(localStorage.settings).color0.a;
        alphaSlider[1].value = JSON.parse(localStorage.settings).color1.a;
        alphaSlider[2].value = JSON.parse(localStorage.settings).color2.a;
    }
    thumbChange();

    /*addEvenetListener to each slider*/
    for(s=0; s<=2; s++){
        hueSlider[s].addEventListener('input', slideChange);
        satSlider[s].addEventListener('input', slideChange);
        lightSlider[s].addEventListener('input', slideChange);
        alphaSlider[s].addEventListener('input', slideChange);
    }

    function slideChange(){
        var hue=[],sat=[],light=[],alpha=[];
        for(var s=0; s<=2; s++){
            hue[s] = hueSlider[s].value;
            sat[s] = satSlider[s].value;
            light[s] = lightSlider[s].value;
            alpha[s] = alphaSlider[s].value;

            hueSlider[s].style.backgroundImage = `linear-gradient(to right,hsla(0,${sat[s]}%,${light[s]}%,${alpha[s]}),hsla(45,${sat[s]}%,${light[s]}%,${alpha[s]}), hsla(90,${sat[s]}%,${light[s]}%,${alpha[s]}),hsla(180,${sat[s]}%,${light[s]}%,${alpha[s]}),hsla(270,${sat[s]}%,${light[s]}%,${alpha[s]}),hsla(315,${sat[s]}%,${light[s]}%,${alpha[s]}),hsla(360,${sat[s]}%,${light[s]}%,${alpha[s]}))`
            satSlider[s].style.backgroundImage = `linear-gradient(to right,hsla(${hue[s]},0%,${light[s]}%,${alpha[s]}),hsla(${hue[s]},100%,${light[s]}%,${alpha[s]}))`
            lightSlider[s].style.backgroundImage = `linear-gradient(to right,hsla(${hue[s]},${sat[s]}%,0%,${alpha[s]}),hsla(${hue[s]},${sat[s]}%,50%,${alpha[s]}),hsla(${hue[s]},${sat[s]}%,100%,${alpha[s]}))`;
            alphaSlider[s].style.backgroundImage = `linear-gradient(to right,hsla(${hue[s]},${sat[s]}%,${light[s]}%,0),hsla(${hue[s]},${sat[s]}%,${light[s]}%,1))`;

            settings.color0.h = hueSlider[0].value;
            settings.color0.s = satSlider[0].value;
            settings.color0.l = lightSlider[0].value;
            settings.color0.a = alphaSlider[0].value;

            settings.color1.h = hueSlider[1].value;
            settings.color1.s = satSlider[1].value;
            settings.color1.l = lightSlider[1].value;
            settings.color1.a = alphaSlider[1].value;

            settings.color2.h = hueSlider[2].value;
            settings.color2.s = satSlider[2].value;
            settings.color2.l = lightSlider[2].value;
            settings.color2.a = alphaSlider[2].value;

            applyColors();
            localStorage.settings = JSON.stringify(settings);
        }
    }

    slideChange(); //run this one time on page load to set the slider backgrounds equal to stored values.
    /*END SLIDERS*/

    for(var i=0;i<=2;i++){
        pos[i] = document.createElement('option')        //creates an option for each background position
        imagePos.appendChild(pos[i]);
    }

    colorDiv.style.marginTop = '20px';
    colorDiv.className = 'colorDiv';
    label[0].innerText = 'Primary Color';
    label[1].innerText = 'Hover Color';
    label[2].innerText = 'Secondary Color';
    bgLink.type = 'text';
    label[3] = document.createElement('label');
    label[3].innerText = 'Background Image: ';
    pos[0].innerText = 'Center';
    pos[1].innerText = 'Top';
    pos[2].innerText = 'Cover';
    applyBtn.innerText = 'Apply';
    applyBtn.id = 'applySettings';
    resetDefault.innerText = 'Reset to Default';
    X.className = 'X';

    //replaces the input placeholder with the link to the wallpaper (if there is one)
    if (JSON.parse(localStorage.settings).background != ''){
        bgLink.value = JSON.parse(localStorage.settings).background;
    }else{
        bgLink.placeholder = 'Link to image';
    }


    imagePos.value = JSON.parse(localStorage.settings).position;    //the value of the position option is whatever is stored in settings



    //Attach everything to the DOM
    settingsContent.appendChild(X);              //add the closing X to the window
    settingsContent.appendChild(colorDiv);       //add the color slider container to the window

    colorDiv.appendChild(label[3]); //background image
    colorDiv.appendChild(bgLink);   //link to background
    colorDiv.appendChild(imagePos); //positioning of the BG
    colorDiv.appendChild(ovgDiv);   //container for the default overage selector
    colorDiv.appendChild(wallDiv);  //container for the default wall selector

    /*insert default overage*/
    label[4] = document.createElement('label');
    label[4].innerText = 'Default Overage Bin: ';
    label[4].className = 'center';
    ovgDiv.appendChild(label[4]);
    ovgDiv.appendChild(defOvg);
    defOvg.addEventListener('input', set_defaults);
    /*insert default wall*/
    label[5] = document.createElement('label');
    label[5].innerText = 'Default Wall: ';
    label[5].className = 'center';
    wallDiv.appendChild(label[5]);
    wallDiv.appendChild(defSec);
    defSec.addEventListener('input', set_defaults);
    /*insert overage options */
    for(i=0;i<4;i++){
        var sec = document.createElement('option');
        sec.innerText = i+1;
        defOvg.appendChild(sec);
    }
    /*insert wall options*/
    for(i=0;i<sections.length;i++){
        sec = document.createElement('option');
        sec.innerText = sections[i];
        defSec.appendChild(sec);
    }
    /*
if(JSON.parse(localStorage.settings).def_overage == undefined){
    localStorage.settings.def_overage = defaultSettings.def_overage;
    defOvg.value = JSON.parse(localStorage.settings).def_overage;
}*/

    defOvg.value = JSON.parse(localStorage.settings).def_overage;
    defSec.value = JSON.parse(localStorage.settings).def_section;

    function set_defaults(){
        settings.def_overage = defOvg.value;
        settings.def_section = defSec.value;

        localStorage.settings = JSON.stringify(settings);
        //console.log(JSON.parse(localStorage.settings).def_overage);
        //console.log(JSON.parse(localStorage.settings).def_section);
    }

    settingsContent.appendChild(applyBtn);
    settingsContent.appendChild(resetDefault);




    backdrop.appendChild(settingsContent);
    function settingsModal() {
        backdrop.style.display = 'block';
        settingsContent.style.display='block';
    }
    window.onclick = function(event) {
        if (event.target == backdrop ||
            event.target == X) {
            backdrop.style.display = 'none';
            settingsContent.style.display = 'none';
        } else if (event.target == applyBtn) {
            applySettings();
        } else if (event.target == resetDefault){
            settings=defaultSettings;
            localStorage.settings = JSON.stringify(settings);
            thumbChange();
            slideChange();
        }
    }

    function applySettings(){
        settings.color0.h = hueSlider[0].value;
        settings.color0.s = satSlider[0].value;
        settings.color0.l = lightSlider[0].value;
        settings.color0.a = alphaSlider[0].value;

        settings.color1.h = hueSlider[1].value;
        settings.color1.s = satSlider[1].value;
        settings.color1.l = lightSlider[1].value;
        settings.color1.a = alphaSlider[1].value;

        settings.color2.h = hueSlider[2].value;
        settings.color2.s = satSlider[2].value;
        settings.color2.l = lightSlider[2].value;
        settings.color2.a = alphaSlider[2].value;

        settings.background = bgLink.value;
        settings.position = imagePos.value;
        localStorage.settings = JSON.stringify(settings);
        applyColors();
        //hide modal and settings
        settingsContent.style.display = 'none';
        backdrop.style.display = 'none';
    }



    function applyColors(){
        colorSheet.cssRules[3].style.backgroundColor= `hsla(${settings.color0.h},${settings.color0.s}%,${settings.color0.l}%,${settings.color0.a})`//main css - main color
        colorSheet.cssRules[5].style.backgroundColor=`hsla(${settings.color1.h},${settings.color1.s}%,${settings.color1.l}%,${settings.color1.a})`; // main css - hover color

        navbar[10].style.backgroundColor=`hsla(${settings.color2.h},${settings.color2.s}%,${settings.color2.l}%,${settings.color2.a})`; //navbar - secondary color
        navbar[12].style.backgroundColor=`hsla(${settings.color2.h},${settings.color2.s}%,${settings.color2.l}%,${settings.color2.a})`; //navbar - secondary color
        navbar[13].style.backgroundColor=`hsla(${settings.color2.h},${settings.color2.s}%,${settings.color2.l}%,${settings.color2.a})`; //navbar - secondary color
        historyTitle.style.backgroundColor=`hsla(${settings.color2.h},${settings.color2.s}%,${settings.color2.l}%,${settings.color2.a})`; //history - secondary color

        body.style.background = `url(${JSON.parse(localStorage.settings).background})`
        body.style.backgroundSize = `${JSON.parse(localStorage.settings).position}`;
        body.style.backgroundAttachment = `fixed`;
    }

    applyColors();

    document.getElementsByTagName('topbar-component')[0].style.position = 'sticky';
    document.getElementsByTagName('topbar-component')[0].style.top = '0';
    document.getElementsByTagName('topbar-component')[0].style.zIndex = '100';

    GM_addStyle (`

.sectionshadowNone{
background:none;
}

#newDiv{
text-align:center;
}

.button-component{
color: #FFFFFF;
padding: 1vh;
font-size: calc(20px + 0.6vmin);
border:none !important;
}

.button-component:hover{
color: #FFFFFF;
background-color: #EA8D14;
border:none !important;
}

.btn-custom{
border:none !important;
text-shadow: black -1px 1px 0px, black 1px 1px 0px, black -1px -1px 0px, black 1px -1px 0px;
}

#barcode{
display:block;
margin:0 auto;
/*border:2px outset #000;*/
border:2px solid #fff;
}

#barcode:active{
/*border:2px inset #000;*/
}

#barcode:hover{
cursor: pointer;
}

#chuteInput{
width: 50%;
font-size:72px;
text-align: center;
display: block;
margin: 0 auto !important;
}

.sect-btn {
display: block;
color: #FFFFFF;
background-color: #06c !important;
border: none; !important
padding: 1vh;
margin: 0 auto;
font-size: calc(20px + 0.6vmin);
}

.sect-btn:hover {
color: #000;
background-color: #EA8D14 !important;
cursor: pointer;
}

#historyContainer {
position: fixed;
z-index: 99;
top: 40px;
padding: 0 10px;
}

#title {
border-radius: 6px;
color: #fff;
background-color: #002244;
text-align: center;
padding:5px;
-moz-user-select: none;
user-select: none;
}

ul#history{
padding:0;
}

ul#history li {
list-style: none;
padding: 1vh;
margin: 0 0 5px 0;
border-radius: 6px;
text-align: center;
}
ul#history li:hover {
cursor: pointer;
}

.topbar{
margin-top:0 !important;
}

.container{
margin-right:0 !important;
}

/* The Modal (background) */
.backdrop {
display: none;
position: fixed; /* Stay in place */
z-index: 1000; /* Sit on top */
padding-top: 100px; /* Location of the box */
left: 0;
top: 0;
width: 100%; /* Full width */
height: 100%; /* Full height */
overflow: auto; /* Enable scroll if needed */
background-color: rgb(180, 180, 180); /* Fallback color */
background-color: rgba(180, 180, 180, .4); /* gray w/ opacity */
}

.settings-content {
display:none;
background-color: #fefefe;
border-radius: 10px;
margin: auto;
padding: 20px;
padding-top:0;
border: 1px solid #888;
width: 50%;
}

/* The X Button */
.X {
color: rgba(255, 0, 0, 1);;
float: right;
font-size: 28px;
font-weight: bold;
}
.X:hover,
.X:focus {
color: #000;
text-decoration: none;
cursor: pointer;
}

#title{
-moz-user-select: none;
user-select: none;
}
.popup{
position: absolute;
margin: 10px 10px;
padding: 10px;
left: 0;
width:400px;
background-color: white;
color: black;
border-radius: 5px;
display: none;
box-shadow: 1px 1px 5px #000;
z-index: 100;
}
#qMark {
font-size: 20px;
float: right;
-moz-user-select: none;
user-select: none;
}
#qMark:hover {
cursor: help;
}
#qMark:hover + .popup{
display: block;
}
#trash:hover{
color: #f00;
cursor: pointer;
}
.half{
width:30%;
display: inline;
margin: 10px !important;
padding:0 !important;
}

.gear{
position: absolute;
left: 2px;
top: 2px;
z-index: 101;
font-size: 30px;
color: #fff;
text-shadow: black -1px 1px 0px, black 1px 1px 0px, black -1px -1px 0px, black 1px -1px 0px;
}

.gear:hover{
cursor: pointer;
}

/* Location Switch */
#location{
height: 0;
width: 0;
display: none;
visibility: hidden;
}

#locLabel {
z-index: 1000;
cursor: pointer;
text-indent: 30px;
width: 100px;
height: 25px;
background: #000;
border-radius: 100px;
position: relative;
display: inline-block;
-moz-user-select: none;
user-select: none;
}

#locLabel::after {
content: '';
z-index: 999;
position: absolute;
top: 2px;
left: 2px;
width: 20px;
height: 20px;
background: #999;
border-radius: 100px;
transition: 0.3s;
}

#location:checked + #locLabel {
background: #fff;
}

#location:checked + #locLabel::after {
left: calc(100% - 2.5px);
transform: translateX(-100%);
}

#location:active:after {
width: 400px;
}

#locDiv{
display: flex;
justify-content: center;
align-items: center;
}

.settings-content input[type='color']:hover,
.settings-content input[type='color']+label:hover{
cursor: pointer;
}

.center{
text-align: center;
}

input[type="range"]{
width: 100%;
border: 1px solid #000;
-webkit-appearance: none;
height: 10px;
-moz-appearance: none;
border-radius: 10px;
margin: 2px;
}

input[type="range"]::-moz-range-thumb {
-moz-appearance: none;
border-radius: 100%;
background-color: transparent;
box-shadow: inset 0px 0px 0px 2px #ccc;
height: 15px;
width: 15px;
vertical-align: middle;
border: none;
cursor: pointer;
}

input[type="range"]::-moz-range-track {
height: 0px;
}

.colorDiv {
display: flex;
flex-direction: column;
}


.error {
animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
transform: translate3d(0, 0, 0);
backface-visibility: hidden;
box-shadow: 5px 5px 5px red, -5px -5px 5px red, -5px 5px 5px red, 5px -5px 5px red;
perspective: 1000px;
}

@keyframes shake {
10%, 90% {
transform: translate3d(-1px, 0, 0);
}

20%, 80% {
transform: translate3d(2px, 0, 0);
}

30%, 50%, 70% {
transform: translate3d(-4px, 0, 0);
}

40%, 60% {
transform: translate3d(4px, 0, 0);
}
}

.newElClass{
color: #7A7A7A;
font-size: 30px;
font-weight: bold;
text-align: center;
margin: auto;
padding-top: 2%;
padding-bottom: 2%;
}

.unsideline{
float:right;
}
`);

    bgLink.addEventListener('input',enterTheMatrix);


    function enterTheMatrix(){
        if(/*(JSON.parse(localStorage.settings).background) == "matrix" ||*/
            bgLink.value.toLowerCase() == "enter the matrix"){
            console.log(`%cEnter the Matrix!`,
                        "color:#0f0;font-family:system-ui;font-size:4rem;-webkit-text-stroke: 1px black;font-weight:bold"
                       );
            canvas.style.display='block';
            /*var matrixSpeed = document.createElement('input'),
            matrixSize = document.createElement('input'),
            matrixColor = document.createElement('input'),
            matrixBackground = document.createElement('input');

        matrixSpeed.type='range';

        matrixSize.type='range';
        matrixSize.style.backgroundImage = `linear-gradient(to bottom right, transparent 50%, #464646 50%)`;

        matrixColor.type='range';
        matrixColor.style.backgroundImage = `linear-gradient(to right,hsl(0,100%,50%),hsl(45,100%,50%), hsl(90,100%,50%),hsl(180,100%,50%),hsl(270,100%,50%),hsl(315,100%,50%),hsl(360,100%,50%))`

        matrixBackground.type='range';
        matrixBackground.style.backgroundImage = `linear-gradient(to right,hsl(0,100%,50%),hsl(45,100%,50%), hsl(90,100%,50%),hsl(180,100%,50%),hsl(270,100%,50%),hsl(315,100%,50%),hsl(360,100%,50%))`


        imagePos.parentNode.replaceChild(matrixSpeed,imagePos);
        matrixSpeed.insertAdjacentElement('afterend', matrixSize);
        matrixSpeed.insertAdjacentElement('afterend', matrixColor);
        matrixSpeed.insertAdjacentElement('afterend', matrixBackground);*/

            var timing = setInterval( draw, time );
        }else if(bgLink.value.toLowerCase() !== "enter the matrix"){
            console.clear();
            console.log(`Not the Matrix`);
            canvas.style.display='none';
        }
    };


    var canvas = document.createElement('canvas'),
        ctx = canvas.getContext("2d"),
        hue = "#fff",
        size = 30,
        fade = 'hsla(0,0%,0%,.10)',
        bgColor= "#000",
        table = [],
        time = 60;

    canvas.style.display='block';
    canvas.style.position='fixed';
    canvas.style.top=0;
    canvas.style.zIndex='-1';
    body.insertAdjacentElement('afterbegin',canvas);

    body.style.backgroundColor=bgColor;
    body.style.overflow='auto';
    canvas.height = window.innerHeight;//making the canvas full screen
    canvas.width = window.innerWidth;



    /*CHARACTER SETS*/
    var charSets = [
        //"ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%^&():",
        //"10",
        //"日一大年中会人本月長国出上十生子分東三行同今高金時手見市力米自前円合立内二事社者地京間田体学下目五後新明方部女八心四民対主正代言九小思七山実入回場野開万全定家北六問話文動度県水氏和政保表相党",
        //"ｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ",
        "アイウエオカキクケサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヰヱヲコ"
    ]
    var matrix = charSets[Math.floor( Math.random() * charSets.length )]
    matrix = matrix.split(""); //converting the string into an array of single characters


    //an array of drop - one per column
    var drop = [];  //which drop across the screen (x-axis)
    for(var x = 0; x < canvas.width/size; x++){
        drop[x] = canvas.height; //initial vertical start position (set to 0 for 'curtain' start)
        table[x]=[];
        for(var y=0;y<canvas.height/size;y++){
            table[x][y]='';
        }
    }

    //drawing the characters
    var n=0;
    function draw(){
        hue=`hsla(${n++},100%, 50%,1)`;
        //Black BG for the canvas
        //translucent BG to show trail
        ctx.fillStyle = fade;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = size + "px arial"; //set size and font

        //looping over drop
        for( var i = 0; i < drop.length; i++ ){

            //hue=`hsla(${n++},100%, 50%,1)`;
            //hue=`hsla(${Math.floor( Math.random() * 360 )},100%, 50%,1)`;  //activate unicorn mode
            var y = drop[i];
            var char = matrix[ Math.floor( Math.random() * matrix.length ) ]; //random character

            if(table[i][y] !== undefined){
                ctx.font = `bold ${size}px arial`; //set size and font
                ctx.fillStyle=bgColor
                ctx.fillText(table[i][y], (i)*(size), y*(size)); //used to 'erase' letters as a drop comes down on them
                ctx.font = size + "px arial"; //set size and font
            }
            //ctx.shadowColor =hue;
            ctx.shadowBlur = 50;
            ctx.fillStyle = "#fff"; //white
            ctx.fillText(char, (i)*size, (drop[i])*size); //first drop is white


            //prevents characters from being added to array if they were to be off screen anyway
            if(y<=Math.ceil(canvas.height/size)){
                table[i][y]=char;
            }
            //ctx.shadowColor=hue;
            ctx.fillStyle = hue; //chosen color
            ctx.fillText(table[i][y-1], (i)*size, (y-1)*size); //will be the same character as the white character before it

            ctx.shadowColor="transparent";
            //randomly drops rain after it crosses bottom of screen
            if( drop[i] * size > canvas.height && Math.random() > 0.975 ){
                drop[i] = 0;
            }else{
                //moves drop down
                drop[i]++;
            }
        }
        if(Math.random()>0){
            glitch();
        }
    }
    function glitch(){
        ctx.font = `bold ${size}px arial`; //set size and font
        //grab random coordinates
        var glitchX = Math.floor( Math.random() * table.length ),
            glitchY = Math.floor( Math.random() * table[0].length );
        //erase current character
        ctx.fillStyle=bgColor;
        ctx.fillText(table[glitchX][glitchY], glitchX*size, glitchY*size); //used to 'erase' letters as a drop comes down on them
        //replace table with random character
        table[glitchX][glitchY]= matrix[ Math.floor( Math.random() * matrix.length ) ];

        ctx.font = size + "px arial"; //set size and font
        //print that character over the same location
        ctx.fillStyle=hue;
        ctx.fillText(table[glitchX][glitchY], glitchX*size, glitchY*size);
    }


    window.addEventListener('click',changeColor);
    window.addEventListener('keypress',changeColor);

    function changeColor(){
        hue=`hsla(${Math.floor( Math.random() * 360 )},100%, 50%,1)`;
    }
    enterTheMatrix(); //run function on page load to see if matrix should display.
};//end of entire script