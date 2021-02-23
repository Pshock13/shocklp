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

var FC=readCookie("fcmenu-warehouseId"),
login=readCookie("fcmenu-employeeLogin"),
addr=readCookie("fcmenu-remoteAddr");

//console.log(FC, login, addr)

//accordion menu
var acc = document.getElementsByClassName("accordion");
  var i;

  for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
        /* Toggle between adding and removing the "active" class,
        to highlight the button that controls the panel */
        this.classList.toggle("active");

        /* Toggle between hiding and showing the active panel */
        var panel = this.nextElementSibling;
		 if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
        
        if (panel.style.maxHeight){
      		panel.style.maxHeight = null;
    		} else {
      		panel.style.maxHeight = panel.scrollHeight + "px";
    }
    });
} 

//Create the main navigation elements
var nav = document.createElement('nav')
,   navUl = document.createElement('ul')

nav.id="nav";
navUl.id="navUl";

//Add links to new pages here
var links = [
    {href:"index.html", text:"Home"},
    {href:"Script_install.html",text:"Script Install"},
    {href:"new_rule.html",text:"Declutter Outlook"},
    {href:"atrops_ticket.html",text:"How to: ATROPS Ticket"},
    {href:"helpful_tools.html",text:"Helpful Tools"},
    {href:"afe_workflows.html",text:"AFE Workflows"}
];

nav.prepend(navUl);

document.getElementsByTagName('body')[0].prepend(nav);

function startNav(){
    for(var i=0;i<links.length;i++){
        document.getElementsByTagName('ul')[0].appendChild(document.createElement('li'));
        document.getElementsByTagName('li')[i].innerText = links[i].text;
        document.getElementsByTagName('li')[i].addEventListener('click', loadLink);
        if(window.location.pathname.includes(links[i].href)){
            document.getElementsByTagName('li')[i].id="thisPage";
        };
    };
};

function loadLink(){
    for(i=0;i<links.length;i++){
        if(this.innerText == links[i].text){
            window.open(links[i].href, "_self");
        };
    };
};

startNav();

document.getElementById('changelog').classList.add('hidden');
//show/hide info/changelog
/*https://javascript.info/event-delegation*/

// Get the element, add a click listener...
document.getElementById("pages").addEventListener("click", function(e) {
    // e.target is the clicked element!    
    // If it was a list item
    if(e.target && e.target.innerText == "[Info]") {
        document.getElementById("changelog").classList.add("hidden");
        document.getElementById("information").classList.remove("hidden");
        
    } else if(e.target && e.target.innerText == "[Changelog]"){
        document.getElementById("changelog").classList.remove("hidden");
        document.getElementById("information").classList.add("hidden");
    }
});

let selectedLi = document.getElementById("pages").children[0];
selectedLi.style.color="#f90";

document.getElementById("pages").onclick = function(e) {
    let li = event.target;
    if (li.tagName != 'LI') return; // not on li? Then we're not interested

    highlight(e.target); // highlight it
};

function highlight(li) {
    
  if (selectedLi) { // remove the existing highlight if any
    selectedLi.style.color="#000";
  }
  selectedLi = li;
  selectedLi.style.color="#f90"; // highlight the new li
};