function afficherWizz(){
	document.getElementById("img_wizz").style.opacity = 1;
}

function openTab(evt, tabTitle) {
    // Declare all variables
    let tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tab_content");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tab_links");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabTitle).style.display = "block";
	evt.currentTarget.className += " active";
}

function register(){
    document.location.href="register.php"
}

window.onclick = function(event) {
    if (event.target == popupRegister) {
        popupRegister.style.display = "none";
    }
}

