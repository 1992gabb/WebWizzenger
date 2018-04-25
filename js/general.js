function afficherWizz(){
	document.getElementById("img_wizz").style.opacity = 1;
}

//Merci à : https://www.w3schools.com/howto/howto_js_tabs.asp
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

function goRegister(){
    document.location.href="register.html"
}

function currentUserInfo(){
    return firebase.auth().currentUser;
}

//Retourne à la page de connexion
function goBack(){
	document.location.href = "index.html";
}

//Pour enregistrer un nouvel usager
function register(){
    email = document.getElementById("email_register").value;
    let phone = document.getElementById("phone_register").value;
    let username = document.getElementById("username_register").value;

    //Vérifie le mot de passe
    if(document.getElementById("pwd1_register").value == document.getElementById("pwd2_register").value){
        pwd = document.getElementById("pwd1_register").value;
    }else{
        pwd = -1;
        alert("Veuillez écrire le même mot de passe dans les 2 champs.");
        document.getElementById("pwd1_register").value = "";
        document.getElementById("pwd2_register").value = "";
    }
    
    if(pwd!=-1 && username!=""){
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(function() {
            return firebase.auth().createUserWithEmailAndPassword(email, pwd);
        })
        .then(function(firebaseUser) {
            let usersRef = firebase.database().ref('users/').push();
            let key = usersRef.key;
            
            if(phone == ""){
                phone = "111-111-1111"
            }
            let newUserToWrite={
                id: key, 
                avatar: 0,
                email:email,
                phone:phone,
                token:"noPhone",
                username:username
            }

            usersRef.set(newUserToWrite).then(function(){
                console.log("yo");
                firebase.auth().onAuthStateChanged(function(user) {
                    if (user) {
                        document.location.href="main.html";
                    }
                });
            });
        })
        .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage);
            if(errorCode == "auth/email-already-in-use"){
                alert("Le courriel est déjà lié à un compte. Veuillez en choisir un autre.");
            }
            
        });
    }
}
