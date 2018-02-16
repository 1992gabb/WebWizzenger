window.onload = () => {
	document.body.style.opacity = 1;
	document.body.style.paddingTop = 0;
	setTimeout(afficherWizz, 1500);
}

function afficherWizz(){
	document.getElementById("img_wizz").style.opacity = 1;
}