var convosRef = firebase.database().ref('conversations/');
var convosData;
var convosList = [];
var myConvosList = [];
let currentConvo;

var usersRef = firebase.database().ref('users/');
var usersData;
var currentUserData;

var contactsRef = firebase.database().ref('contacts/');
var contactsData;
var myContactsList = [];
let contactsLoaded = false;

//Pour les éléments de la conversation courante
var currentContactName;
let divTitle;
let divMessages;
let divEntry;
let lastMessageCreated;
let done = false;
let convoAvatar;

//Pour le storage
let storage = firebase.storage();
let storageRef = storage.ref('avatars/');


//Obtient les informations des conversations et appelle ensuite readUsers pour trouver les noms des contacts.
function readConvos(){
	convosRef.once('value', function(snapshot) {
		convosData = snapshot.val();
		readUsers();
	});
}

//Obtient les informations sur les users et ajoute ensuite les conversations en lien avec le currentUser
function readUsers(){
	usersRef.once('value', function(snapshot) {
		usersData = snapshot.val();

		//Pour avoir les infos de l'utilisateur connecté
		for(data in usersData){
			if(usersData[data].email == currentUser.email){
				currentUserData = new User(data, usersData[data].email,usersData[data].avatar,usersData[data].phone,usersData[data].username,usersData[data].token);
			}
		}

		//Pour créer la liste des conversations
		myConvosList = [];
		for(data in convosData){
			if(convosData[data].idUser1 == currentUser.email){
				//Pour trouver le user correspondant au contact
				for(data2 in usersData){
					if(usersData[data2].email == convosData[data].idUser2){
						contact = new User(data2, usersData[data2].email,usersData[data2].avatar,usersData[data2].phone,usersData[data2].username,usersData[data2].token);
						myConvosList.push(new Conversation(data, currentUserData, contact, convosData[data].textHint,convosData[data].messages,convosData[data].lastMessageDate));
					}
				}
				
			}else if(convosData[data].idUser2 == currentUser.email){
				//Pour trouver le user correspondant au contact
				for(data3 in usersData){
					if(usersData[data3].email == convosData[data].idUser1){
						contact = new User(data3, usersData[data3].email,usersData[data3].avatar,usersData[data3].phone,usersData[data3].username,usersData[data3].token);
						myConvosList.push(new Conversation(data, currentUserData, contact, convosData[data].textHint,convosData[data].messages,convosData[data].lastMessageDate));
					}
				}
			}
		}

		//Créé la première instance de la liste de conversations
		createConvoList();

		//Lis les contacts et les affiche (une seule fois)
		if(!contactsLoaded){
			contactsLoaded = true;
			readContacts();
		}
		
	});
}

//Pour mettre les conversations en ordre du plus récent. Merci : https://en.proft.me/2015/11/14/sorting-array-objects-number-string-date-javascrip/
function sortConvoList(){
	myConvosList.sort(function(a,b){
		var c = new Date(a.lastMessageDate).getTime();
		var d = new Date(b.lastMessageDate).getTime();
		return d-c;
	});
}

//Crée la liste de conversations
function createConvoList(){
		sortConvoList();
		document.getElementById("zone_convos").innerHTML = "";

		for(let i=0;i<myConvosList.length;i++){
			addConvoToList(myConvosList[i].user2.username, myConvosList[i].textHint, myConvosList[i].lastMessageDate);
		}

		if(myConvosList.length<15){
			addMessageToConvoList();
		}
}

//Crée la liste de contacts
function createContactList(){
	document.getElementById("zone_contacts").innerHTML = "";

	addMessageToContactList(); //Pour ajouter la zone d'ajout et suppression d'un contact
	for(let i=0;i<myContactsList.length;i++){
		addContactToList(myContactsList[i].user2.username);
	}
}
//Après avoir enregistré le nom des users, ajoute les contacts en lien avec le currentUser
function readContacts(){
	contactsRef.once('value', function(snapshot) {
		contactsData = snapshot.val();

		for(data in contactsData){
			if(contactsData[data].userID == currentUser.email){
				//Pour trouver le user correspondant au contact
				for(data2 in usersData){
					if(usersData[data2].email == contactsData[data].contactID){
						contact = new User(data2, usersData[data2].email,usersData[data2].avatar,usersData[data2].phone,usersData[data2].username,usersData[data2].token);
						myContactsList.push(new Contact(data, currentUserData,contact));
					}
				}
				
			}else if(contactsData[data].contactID == currentUser.email){
				//Pour trouver le user correspondant au contact
				for(data3 in usersData){
					if(usersData[data3].email == contactsData[data].userID){
						contact = new User(data3, usersData[data3].email,usersData[data3].avatar,usersData[data3].phone,usersData[data3].username,usersData[data3].token);
						myContactsList.push(new Contact(data, currentUserData,contact));
					}
				}
			}
		}

		createContactList();
	});
}

//Créé les div pour chacune des conversations
function addConvoToList(contactName, textHint, lastMessageDate){
	//Création des variables contenant des valeurs importantes
	let newConvo = document.createElement("div");
	let zoneTexte = document.createElement("div");
	let convoContact = document.createElement("p");
	let text;
	let convoTextHint = document.createElement("p");
	let id;
	let convoTime = document.createElement("p");
	let nowDate = new Date();
	let container = document.getElementById("zone_convos");

	//Création du div contenant tous les éléments
	newConvo.setAttribute("class", "conversationInList");
	
	//Création de l'avatar
	convoAvatar = document.createElement("img");
	convoAvatar.setAttribute("class", 'convoAvatar');
	convoAvatar.setAttribute("src", 'images/default_avatar.png');
	getAvatar(contactName, convoAvatar);

	//Création de la zone contenant le nom et le textHint
	zoneTexte.setAttribute("class", "conversationsInList_texte");

	//Création du nom
	text = document.createTextNode(contactName);
	convoContact.appendChild(text);
	zoneTexte.appendChild(convoContact);
	
	//Création du textHint
	id = "textHint-" + contactName;
	convoTextHint.setAttribute("id", id)
	convoTextHint.setAttribute("style", "font-size: 12px;color:#a8a8a8;");

	if(textHint.length >=45){
		let newTextHint = textHint.substr(0,42) + "...";
		text = document.createTextNode(newTextHint);
	}else{
		text = document.createTextNode(textHint);
	}
	convoTextHint.appendChild(text);
	zoneTexte.appendChild(convoTextHint);

	//Création du timeStamp
	id = "convoTime-" + contactName;
	convoTime.setAttribute("id", id)
	convoTime.setAttribute("style", "font-size: 12px;color:#a8a8a8;float:right; height:100%; line-height:30px;");
	
	if(nowDate.getDate() == Number(lastMessageDate.substr(8,2))){
		text = document.createTextNode(lastMessageDate.substr(11,8));
	}else{
		text = document.createTextNode(lastMessageDate.substr(5,5));
	}
	convoTime.appendChild(text);

	//Ajout des 3 parties au grand div
	newConvo.appendChild(convoAvatar);
	newConvo.appendChild(zoneTexte);
	newConvo.appendChild(convoTime);

	//Ajout des infos de laconversation dans la liste
	container.appendChild(newConvo);

	//Pour gérer le fait d'ouvrir une conversation
	newConvo.onclick = function (e) {
		let currentDOM = e.target.parentElement.parentElement;
		currentContactName = currentDOM.childNodes[1].childNodes[0].innerHTML;
		lastMessageCreated = null;
		document.getElementById("message_content").value = "";
		showConvo(currentContactName);
	}
}

//Va chercher la photo associé a un client
function getAvatar(contactName, currentDiv){

	let currentContact;
	for(data in usersData){
		if(usersData[data].username == contactName){
			currentContact = usersData[data];
		}
	}

	// Get the download URL
	let currentAvatarRef = storage.ref('avatars/' + currentContact.email);
	currentAvatarRef.getDownloadURL().then(function(url) {
		currentAvatarUrl = url;
		currentDiv.setAttribute("src", url);
  	}).catch(function(error) {
	switch (error.code) {
	  case 'storage/object_not_found':
		// File doesn't exist
		break;
	  case 'storage/unauthorized':
		// User doesn't have permission to access the object
		break;
	  case 'storage/canceled':
		// User canceled the upload
		break;
	  case 'storage/unknown':
		// Unknown error occurred, inspect the server response
		break;
	  case 403:
		console.log("error");
	  	break;
	}
  });
}

//Pour ajouter un petit message dans la liste de convos
function addMessageToConvoList(){
	let newConvo = document.createElement("div");
	newConvo.setAttribute("class", "conversationInList");

	let zoneTexte = document.createElement("div");
	zoneTexte.setAttribute("class", "conversationsInList_texte2");

	let convoContact = document.createElement("p");
	convoContact.setAttribute("style", "text-align:center; width:100%");
	let text = document.createTextNode("Continuez à parler et vos conversations s'afficheront ici!");
	convoContact.appendChild(text);
	zoneTexte.appendChild(convoContact);
	newConvo.appendChild(zoneTexte);

	let container = document.getElementById("zone_convos");
	container.appendChild(newConvo);
}

//Pour ajouter un petit message dans la liste de convos
function addMessageToContactList(){
	let newConvo = document.createElement("div");
	newConvo.setAttribute("class", "addRemoveContact");

	let addButton = document.createElement("img");
	addButton.setAttribute("id", 'contact_addButton');
	addButton.setAttribute("src", 'images/button_add.png');

	let removeButton = document.createElement("img");
	removeButton.setAttribute("id", 'contact_removeButton');
	removeButton.setAttribute("src", 'images/button_remove.png');
	
	newConvo.appendChild(addButton);
	newConvo.appendChild(removeButton);

	let container = document.getElementById("zone_contacts");
	container.appendChild(newConvo);

	//Pour gérer le fait d'ouvrir une conversation
	addButton.onclick = function (e) {
		let contactToAdd = window.prompt("Entrez le courriel du contact que vous voulez ajouter","");
		addContact(contactToAdd);
	}

	//Pour gérer le fait d'ouvrir une conversation
	removeButton.onclick = function (e) {
		let contactToRemove = window.prompt("Entrez le courriel du contact que vous voulez supprimer","");
		removeContact(contactToRemove);
	}
}

//Créé un nouveau contact dans le compte de l'utilisateur
function addContact(email){
	let create = false;
	let already = false;
	let contactId;
	let contact;

	usersRef.once('value', function(snapshot) {
		usersData = snapshot.val();

		for(data in usersData){
			//Si l'usager existe
			if(usersData[data].email == email){
				create = true;
				contactId = data;
				contact = new User(data, usersData[data].email,usersData[data].avatar,usersData[data].phone,usersData[data].username,usersData[data].token);
				//Si ils sont déja contact
				for(let i = 0; i<myContactsList.length; i++){
					if(myContactsList[i].user1.email == usersData[data].email && myContactsList[i].user2.email == currentUserData.email){
						already = true;
					}else if(myContactsList[i].user2.email == usersData[data].email && myContactsList[i].user1.email == currentUserData.email){
						already = true;
					}
				}	
			}
		}	

		if(create && !already){
			myContactsList.push(new Contact(contactId, currentUserData,contact));
			let refContacts = firebase.database().ref('contacts/').push();
			let key = refContacts.key;
			
			let newContactToWrite={
				id: key, 
				contactID: email,
				userID:currentUserData.email,
			}
		
			refContacts.set(newContactToWrite);

			createContactList();
		}else if(!create){
			alert("Ce email n'est lié a aucun contact. Veuillez rééssayer.")
		}else if(already){
			alert("Le contact existe déja!")
		}
	});
	
	
}

//Retir le contact du compte de l'utilisateur
function removeContact(email){
	console.log(email);
	let remove = false;
	let found = false;
	let contactId;
	let convoId = -1;
	let userId;

	usersRef.once('value', function(snapshot) {
		usersData = snapshot.val();

		for(data in usersData){
			//Si l'usager existe
			if(usersData[data].email == email){
				found = true;
				userId = data;
				//Si ils sont contact
				for(let i = 0; i<myContactsList.length; i++){
					if(myContactsList[i].user1.email == usersData[data].email && myContactsList[i].user2.email == currentUserData.email){
						remove = true;
						contactId = i;
					}else if(myContactsList[i].user2.email == usersData[data].email && myContactsList[i].user1.email == currentUserData.email){
						remove = true;
						contactId = i;
					}
				}	
			}
		}	

		if(found && remove){
			let refContacts = firebase.database().ref('contacts/' + myContactsList[contactId].id);
			refContacts.remove();
			myContactsList.splice(contactId, 1);

			for(let i = 0; i<myConvosList.length;i++){
				console.log(myConvosList[i].user2.email);
				if(myConvosList[i].user1.email == usersData[userId].email && myConvosList[i].user2.email == currentUserData.email){
					remove = true;
					convoId = i;
				}else if(myConvosList[i].user2.email == usersData[userId].email && myConvosList[i].user1.email == currentUserData.email){
					remove = true;
					convoId = i;
				}
			}

			if(convoId != -1){
				myConvosList.splice(convoId, 1);
			}


			createContactList();
			createConvoList();
			alert("Le contact a bien été supprimé.");
		}else if(!found){
			alert("Ce email n'est lié a aucun usager. Veuillez rééssayer.")
		}else if(!remove){
			alert("Ce n'est même pas votre contact!")
		}
	});
}


//Pour créer des div pour chacun des contacts
function addContactToList(contactName){
	let newContact = document.createElement("div");
	newContact.setAttribute("class", "contactInList");

	let contactAvatar = document.createElement("img");
	contactAvatar.setAttribute("class", 'contactImages');
	contactAvatar.setAttribute("src", 'images/default_avatar.png');
	getAvatar(contactName, contactAvatar);

	let contactNameP = document.createElement("p");
	contactNameP.setAttribute("style", "width:48%;height:100%;margin-left:10px;")
	let text = document.createTextNode(contactName);
	contactNameP.appendChild(text);

	let imageMess = document.createElement("img");
	let id = "imageMess" + contactName;
	imageMess.setAttribute("id", id);
	imageMess.setAttribute("class", 'contactImagesMess');
	imageMess.setAttribute("src", 'images/ic_mess.png');

	let imageWizz = document.createElement("img");
	imageWizz.setAttribute("class", 'contactImagesWizz');
	imageWizz.setAttribute("src", 'images/ic_wizz.png');

	newContact.appendChild(contactAvatar);
	newContact.appendChild(contactNameP);
	newContact.appendChild(imageMess);
	newContact.appendChild(imageWizz);

	let container = document.getElementById("zone_contacts");
	container.appendChild(newContact);

	contactAvatar.onclick = function(event){
		showContact(contactName);
	}
	contactNameP.onclick = function(event){
		showContact(contactName);
	}
	imageMess.onclick = function(event){
		showConvo(contactName);
	}

	imageWizz.onclick = function(event){
		showConvo(contactName);
		sendWizz();
	}
}

//Affiche la conversation dans l'espace de droite
function showConvo(contactName){
	let pTitle = document.getElementById("p_title");
	pTitle.innerHTML = contactName;

	document.getElementById("selectedContactInfo").style.display = "none";
	document.getElementById("selectedConvo_messages").style.display = "block";
	document.getElementById("selectedConvo_writeSend").style.display = "block";
	loadConvo(contactName);
}

//Affiche le contact dans l'espace de droite
function showContact(contactName){
	let pTitle = document.getElementById("p_title");
	pTitle.innerHTML = contactName;

	document.getElementById("selectedConvo_writeSend").style.display = "none";
	document.getElementById("selectedConvo_messages").style.display = "none";
	document.getElementById("selectedContactInfo").style.display = "block";

	let currentContact;
	for(data in usersData){
		if(usersData[data].username == contactName){
			currentContact = usersData[data];
		}
	}

	// document.getElementById("selectedContact_avatar")
	getAvatar(contactName, document.getElementById("selectedContact_avatar"));
	document.getElementById("selectedContact_phone").innerHTML = "Téléphone: " + currentContact.phone;
	document.getElementById("selectedContact_email").innerHTML = "Courriel: " + currentContact.email;

}

//**Modifier pour qu'il n'aille pas tout loader a chaque fois */
//Pour aller loader la convo sélectionnée
function loadConvo(contactName){
	let contactId;
	let user;
	let found = false;
	let created = false;
	convosRef.on('value', function(snapshot) {
		convosData = snapshot.val();

		//Pour trouver le user correspondant au contact
		for(data2 in usersData){
			if(usersData[data2].username == contactName){
				contactId = data2;
				user = usersData[data2];
			}
		}

		for(data in convosData){
			if(convosData[data].idUser1 == currentUser.email && convosData[data].idUser2 == usersData[contactId].email){
				currentConvo =  new Conversation(data, currentUserData, usersData[contactId], convosData[data].textHint,convosData[data].messages,convosData[data].lastMessageDate);
				updateConvoMessages(currentConvo);
				found = true;
			}else if(convosData[data].idUser2 == currentUser.email && convosData[data].idUser1 == usersData[contactId].email){
				currentConvo =  new Conversation(data, currentUserData, usersData[contactId], convosData[data].textHint,convosData[data].messages,convosData[data].lastMessageDate);
				updateConvoMessages(currentConvo);
				found = true;
			}
		}

		if(!found && !created){
			created = true;
			createNewConvo(user, contactId);
		}
	});

	
}

function createNewConvo(otherUserData, contactId){
	let refConvos = firebase.database().ref('conversations/').push();
	let key = refConvos.key;
	
	let newConvoToWrite={
		id: key, 
		idUser1: currentUserData.email,
		idUser2: otherUserData.email,
		lastMessageDate: "",
		messages: "",
		textHint: "Nouvelle convo!"
	}

	currentContactName = otherUserData.username;
	currentConvo =  new Conversation(data, currentUserData, usersData[contactId], convosData[data].textHint,convosData[data].messages,convosData[data].lastMessageDate);
	myConvosList.push(currentConvo);

	refConvos.set(newConvoToWrite);
	createConvoList();
	createDatabaseEntry("Nouvelle convo!");
}

//**Modifier pour qu'il n'aille pas tout loader a chaque fois */
//Va chercher les messages dans la conversations et les affiche
function updateConvoMessages(convo){
	let container = document.getElementById("selectedConvo_messages");
	container.innerHTML = "";
	let currentMessage;
	let readLineDone = false;
	let content;
	
	for(id in convo.messages){
		currentMessage = convo.messages[id];

		if(lastMessageCreated == null){
			if(currentMessage.senderId == currentUserData.email){
				addMessage(1, currentMessage);
			}else{
				addMessage(0, currentMessage);
			}
		}else{
			if(currentMessage.id != lastMessageCreated.id){
				if(currentMessage.senderId == currentUserData.email){
					if(currentMessage.wizzTriggered == "false"){
						if(!readLineDone){
							//Permet de dire où est ce que le contact est rendu
							readLineDone = true;
							addReadLine();
						}
						
					}
					addMessage(1, currentMessage);
					
				}else{
					addMessage(0, currentMessage);
					if(currentMessage.wizzTriggered == "false"){
						let refCurrentMessage = firebase.database().ref('conversations/' + currentConvo.id + "/messages/" + currentMessage.id + "/wizzTriggered");
						refCurrentMessage.set("true");
						if(currentMessage.content != "woush" && currentMessage.content != "blur" && currentMessage.content != "WIZZ"){
							soundAnimation("new");
						}
						
					}
				}
			}
		}
		lastMessageCreated = currentMessage;
	}

	//Pour updater le textHint
	if(lastMessageCreated==null){
		content = "Nouvelle Convo!";
	}else{
		content = lastMessageCreated.content;
	}
	
	console.log(currentContactName);
	if(content.length >=30){
		document.getElementById("textHint-"+currentContactName).innerHTML = content.substr(0,30) + "...";
	}else{
		document.getElementById("textHint-"+currentContactName).innerHTML = content;
	}

	container.scrollTop = container.scrollHeight;
	done = true;
}

//Pour tracer la ligne de progression du contact
function addReadLine(){
	let container = document.getElementById("selectedConvo_messages");

	let line = document.createElement("div");
	line.setAttribute("class", "contact_line");
	container.appendChild(line);

	let zoneTexte = document.createElement("p");
	zoneTexte.innerHTML = "Le contact a lu jusqu'ici";
	zoneTexte.setAttribute("style", "width:10%;font-size:12px;float:left; text-align:center;");
	container.appendChild(zoneTexte);

	let line2 = document.createElement("div");
	line2.setAttribute("class", "contact_line");
	container.appendChild(line2);

	//Saute une ligne après un mesage
	let clear = document.createElement("div");
	clear.setAttribute("class", "vider");
	container.appendChild(clear);
}

//Pour créer un message par DOM
function addMessage(position, message){
	//Détermine si on ajoute la date
	nowTime = new Date(message.timeStamp.substr(0, 10));
	
	if(lastMessageCreated == undefined){
		addTimeStamp(nowTime);
	}else{
		lastTime = new Date(lastMessageCreated.timeStamp.substr(0, 10));
	
		if(nowTime > lastTime){
			addTimeStamp(nowTime);
		}
	}

	//construit le message  image - contenu
	let container = document.getElementById("selectedConvo_messages");

	let newMessage = document.createElement("div");
	newMessage.setAttribute("class", "one_message");

	let zoneTexte = document.createElement("p");
	zoneTexte.innerHTML = message.content;
	newMessage.appendChild(zoneTexte);
	container.appendChild(newMessage);

	if(message.content.length > 100){
		newMessage.style.width = "700px";
		newMessage.style.justifyContent = "flex-end";
	}

	//Saute une ligne après un mesage
	let clear = document.createElement("div");
	clear.setAttribute("class", "vider");
	container.appendChild(clear);
	
	//a gauche
	if(position == 0){
		newMessage.style.cssFloat = "left";
		newMessage.style.backgroundColor = "#eaeaea";

		if(message.content == "WIZZ" && message.wizzTriggered == "false"){
			let refCurrentMessage = firebase.database().ref('conversations/' + currentConvo.id + "/messages/" + message.id + "/wizzTriggered");
			refCurrentMessage.set("true");
			wizzAnimation();
		}else if(message.content == "woush" && message.wizzTriggered == "false"){
			let refCurrentMessage = firebase.database().ref('conversations/' + currentConvo.id + "/messages/" + message.id + "/wizzTriggered");
			refCurrentMessage.set("true");
			soundAnimation("woush");
		}else if(message.content == "blur" && message.wizzTriggered == "false"){
			let refCurrentMessage = firebase.database().ref('conversations/' + currentConvo.id + "/messages/" + message.id + "/wizzTriggered");
			refCurrentMessage.set("true");
			soundAnimation("blur");
		}
	}
	//a droite
	else if (position == 1){
		newMessage.style.cssFloat = "right";
		newMessage.style.backgroundColor = "#bbddaa";
	}

	
}

function wizzAnimation(){
	let wizzSound = new Audio("sounds/wizzSound.mp3");
	wizzSound.play();
	let container = document.getElementById("main_body");
	container.style.animation = "shake 0.5s";
	console.log(container.style.animation);
	container.style.animationIterationCount = "infinite";
	setTimeout(function() {
		container.style.animation = '';
		wizzSound.pause();
		wizzSound.currentTime = 0;
	}, 2000);
	
}

function soundAnimation(name){
	let path = "sounds/" + name + "Sound.mp3";
	let sound = new Audio(path);
	sound.play();
	setTimeout(function() {
		sound.pause();
		sound.currentTime = 0;
	}, 2000);
}

function addTimeStamp(date){
	let timeZone = document.createElement("div");
	timeZone.setAttribute("class", "timestamp");

	let zoneTexte = document.createElement("p");
	zoneTexte.innerHTML = date.toString().substr(4,11);
	
	timeZone.appendChild(zoneTexte);

	let container = document.getElementById("selectedConvo_messages");
	container.appendChild(timeZone);

	let clear = document.createElement("div");
	clear.setAttribute("class", "vider");
	container.appendChild(clear);
}

//Réagit au onclick du bouton et envoie le contenu du text area
function sendMessage(enterRequest){
	let container = document.getElementById("message_content");
	let content;
	let str = container.value;

	if(enterRequest == 0){
		content = str;
	}else{
		content = str.substr(0,str.length-1);
	}

	createDatabaseEntry(content);

	readConvos();

	container.value = "";

	document.getElementById("selectedConvo_messages").scrollTop = document.getElementById("selectedConvo_messages").scrollHeight;

	if(content.length >=45){
		document.getElementById("textHint-"+currentContactName).innerHTML = content.substr(0,42) + "...";
	}else{
		document.getElementById("textHint-"+currentContactName).innerHTML = content;
	}
}

//Réagit au onclick du bouton wizz et envoie un wizz!
function sendWizz(){
	let container = document.getElementById("message_content");
	container.value = "";

	createDatabaseEntry("WIZZ");

	readConvos();

	document.getElementById("selectedConvo_messages").scrollTop = document.getElementById("selectedConvo_messages").scrollHeight;
	document.getElementById("textHint-"+currentContactName).innerHTML = "**Un bon vieux Wizz**";
	wizzAnimation();
}

//Réagit au onclick du bouton son et envoie un son!
function sendSound(number){
	let container = document.getElementById("message_content");
	let content;

	if(number == 0){
		content = "prout";
	}else if(number == 1){
		content = "woush";
	}else if (number == 2){
		content = "blur";
	}

	createDatabaseEntry(content);

	container.value = "";
	readConvos();

	document.getElementById("selectedConvo_messages").scrollTop = document.getElementById("selectedConvo_messages").scrollHeight;
	document.getElementById("textHint-"+currentContactName).innerHTML = "**Un bon vieux Wizz**";
	soundAnimation(content);
	
}

function createDatabaseEntry(content){
	if(content.trim().length != 0){
		let tempMessage;
		let refMessages = firebase.database().ref('conversations/' + currentConvo.id + "/messages").push();
		let refTextHint = firebase.database().ref('conversations/' + currentConvo.id+"/textHint");
		let refLastMessage = firebase.database().ref('conversations/' + currentConvo.id+"/lastMessageDate");
		let key = refMessages.key;
	
		let date = new Date();
		let dateOutput;

		let mois;
		let jour;
		let heures;
		let minutes;
		let seconds;
		
		if((date.getMonth()+1) < 10){
			mois = "-0" + (date.getMonth()+1);
		}else{
			mois = "-" + (date.getMonth()+1);
		}
		
		if(date.getDate()<10){
			jour = "-0" + (date.getDate());
		}else{
			jour = "-" + (date.getDate());
		}
		
		if(date.getMinutes()<10){
			minutes = ":0" + date.getMinutes();
		}else{
			minutes = ":" + date.getMinutes();
		}
	
		if(date.getSeconds()<10){
			seconds = ":0" + date.getSeconds();
		}else{
			seconds = ":" + date.getSeconds();
		}

		if(date.getHours()<10){
			heures = "0" + date.getHours();
		}else{
			heures = " " + date.getHours();
		}

		dateOutput = date.getFullYear() + mois + jour + heures + minutes + seconds;

		let newMessageToWrite={
			id: key, 
			convoId: currentConvo.id,
			content:content,
			senderId: currentUserData.email,
			timeStamp: dateOutput,
			type: "sound",
			wizzTriggered : "false"
		}

		refMessages.set(newMessageToWrite);
		refTextHint.set(content);
		refLastMessage.set(dateOutput);
	}	
}

//Se déconnecte et retourne à la page de connexion
function logout(){
	firebase.auth().signOut().then(function() {
		// Sign-out successful.
		document.location.href = "index.html";
	  }, function(error) {
		// An error happened.
	  });
	
}

//Adapte la zone de conversation en fonction de ce qui est dans la zone recherche
function searchListener(event){
	let searchText = document.getElementById("searchBar").value;
	
	if(document.getElementById("zone_convos").style.display == "block"){
		document.getElementById("zone_convos").innerHTML = "";
		if(searchText == ""){
			createConvoList();
		}else{
			for(let i=0;i<myConvosList.length;i++){
				if(myConvosList[i].user2.username.toLowerCase().startsWith(searchText)){
					console.log(myConvosList[i].user2.username);
					addConvoToList(myConvosList[i].user2.username, myConvosList[i].textHint);
				}
			}
		}
	}else{
		document.getElementById("zone_contacts").innerHTML = "";
		if(searchText == ""){
			createContactList();
		}else{
			for(let i=0;i<myContactsList.length;i++){
				if(myContactsList[i].user2.username.toLowerCase().startsWith(searchText)){
					console.log(myContactsList[i].user2.username);
					addContactToList(myContactsList[i].user2.username);
				}
			}
		}
	}
	
	
}
