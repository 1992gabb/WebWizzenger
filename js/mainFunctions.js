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
		convosList = [];
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

		for(let i=0;i<myConvosList.length;i++){
			addConvoToList(myConvosList[i].user2.username, myConvosList[i].textHint);
		}

		if(myConvosList.length<15){
			addMessageToConvoList();
		}

		readContacts();
	});
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
						myContactsList.push(new Contact(data2, currentUserData,contact));
					}
				}
				
			}else if(contactsData[data].contactID == currentUser.email){
				//Pour trouver le user correspondant au contact
				for(data3 in usersData){
					if(usersData[data3].email == contactsData[data].userID){
						contact = new User(data3, usersData[data3].email,usersData[data3].avatar,usersData[data3].phone,usersData[data3].username,usersData[data3].token);
						myContactsList.push(new Contact(data3, currentUserData,contact));
					}
				}
			}
		}

		addMessageToContactList();
		for(let i=0;i<myContactsList.length;i++){
			addContactToList(myContactsList[i].user2.username);
		}

	});
}

//Créé les div pour chacune des conversations
function addConvoToList(contactName, textHint){
	let newConvo = document.createElement("div");
	newConvo.setAttribute("class", "conversationInList");
	
	convoAvatar = document.createElement("img");
	convoAvatar.setAttribute("class", 'convoAvatar');
	convoAvatar.setAttribute("src", 'images/default_avatar.png');
	getAvatar(contactName, convoAvatar);

	let zoneTexte = document.createElement("div");
	zoneTexte.setAttribute("class", "conversationsInList_texte");

	let convoContact = document.createElement("p");
	let text = document.createTextNode(contactName);
	convoContact.appendChild(text);
	zoneTexte.appendChild(convoContact);
	
	let convoTextHint = document.createElement("p");
	let id = "textHint-" + contactName;
	convoTextHint.setAttribute("id", id)
	convoTextHint.setAttribute("style", "font-size: 12px;color:#a8a8a8;")
	let text2 = document.createTextNode(textHint);
	convoTextHint.appendChild(text2);
	zoneTexte.appendChild(convoTextHint);

	newConvo.appendChild(convoAvatar);
	newConvo.appendChild(zoneTexte);

	let container = document.getElementById("zone_convos");
	container.appendChild(newConvo);

	//Pour gérer le fait d'ouvrir une conversation
	newConvo.onclick = function (e) {
		let currentDOM = e.target.parentElement.parentElement;
		currentContactName = currentDOM.childNodes[1].childNodes[0].innerHTML;
		lastMessageCreated = null;
		document.getElementById("message_content").value = "";
		afficherConvo(currentContactName);
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
	newConvo.setAttribute("class", "contactInList");

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
		afficherContact(contactName);
	}
	contactNameP.onclick = function(event){
		afficherContact(contactName);
	}
	imageMess.onclick = function(event){
		afficherConvo(contactName);
	}

	imageWizz.onclick = function(event){
		afficherConvo(contactName);
		sendWizz();
	}
}

//Affiche la conversation dans l'espace de droite
function afficherConvo(contactName){
	let pTitle = document.getElementById("p_title");
	pTitle.innerHTML = contactName;

	document.getElementById("selectedContactInfo").style.display = "none";
	document.getElementById("selectedConvo_messages").style.display = "block";
	document.getElementById("selectedConvo_writeSend").style.display = "block";
	loadConvo(contactName);
}

//Affiche le contact dans l'espace de droite
function afficherContact(contactName){
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
	document.getElementById("selectedContact_phone").innerHTML = "Téléphone: " + currentContact.phone;
	document.getElementById("selectedContact_email").innerHTML = "Courriel: " + currentContact.email;

}

//**Modifier pour qu'il n'aille pas tout loader a chaque fois */
//Pour aller loader la convo sélectionnée
function loadConvo(contactName){
	convosRef.on('value', function(snapshot) {
		convosData = snapshot.val();
		let contactId;
		
		//Pour trouver le user correspondant au contact
		for(data2 in usersData){
			if(usersData[data2].username == contactName){
				contactId = data2;
			}
		}

		for(data in convosData){
			if(convosData[data].idUser1 == currentUser.email && convosData[data].idUser2 == usersData[contactId].email){
				currentConvo =  new Conversation(data, currentUserData, usersData[contactId], convosData[data].textHint,convosData[data].messages,convosData[data].lastMessageDate);
				updateConvoMessages(currentConvo);
			}else if(convosData[data].idUser2 == currentUser.email && convosData[data].idUser1 == usersData[contactId].email){
				currentConvo =  new Conversation(data, currentUserData, usersData[contactId], convosData[data].textHint,convosData[data].messages,convosData[data].lastMessageDate);
				updateConvoMessages(currentConvo);
			}
		}
	});
}

//**Modifier pour qu'il n'aille pas tout loader a chaque fois */
//Va chercher les messages dans la conversations et les affiche
function updateConvoMessages(convo){
	let container = document.getElementById("selectedConvo_messages");
	container.innerHTML = "";
	let currentMessage;
	console.log("update");
	
	for(id in convo.messages){
		currentMessage = convo.messages[id];

		if(lastMessageCreated == null){
			if(currentMessage.senderId == currentUserData.email){
				ajouterMessage(1, currentMessage);
			}else{
				ajouterMessage(0, currentMessage);
			}
		}else{
			if(currentMessage.id != lastMessageCreated.id){
				if(currentMessage.senderId == currentUserData.email){
					ajouterMessage(1, currentMessage);
				}else{
					ajouterMessage(0, currentMessage);
				}
			}
		}
		lastMessageCreated = currentMessage;
	}

	container.scrollTop = container.scrollHeight;
	done = true;
}

//Pour créer un message par DOM
function ajouterMessage(position, message){
	//Détermine si on ajoute la date
	nowTime = new Date(message.timeStamp.substr(0, 10));
	
	if(lastMessageCreated == undefined){
		ajouterTimeStamp(nowTime);
	}else{
		lastTime = new Date(lastMessageCreated.timeStamp.substr(0, 10));
	
		if(nowTime > lastTime){
			ajouterTimeStamp(nowTime);
		}
	}

	let newMessage = document.createElement("div");
	newMessage.setAttribute("class", "one_message");

	let zoneTexte = document.createElement("p");
	zoneTexte.innerHTML = message.content;
	
	newMessage.appendChild(zoneTexte);

	let container = document.getElementById("selectedConvo_messages");
	container.appendChild(newMessage);

	let clear = document.createElement("div");
	clear.setAttribute("class", "vider");
	container.appendChild(clear);
	
	//a gauche
	if(position == 0){
		newMessage.style.cssFloat = "left";
		newMessage.style.backgroundColor = "#d3d3d3";
	}
	//a droite
	else if (position == 1){
		newMessage.style.cssFloat = "right";
		newMessage.style.backgroundColor = "#8bb372";
	}
}

function ajouterTimeStamp(date){
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

	if(content.trim().length != 0){
		let tempMessage;
		let refMessages = firebase.database().ref('conversations/' + currentConvo.id + "/messages").push();
		let refTextHint = firebase.database().ref('conversations/' + currentConvo.id+"/textHint");
		let key = refMessages.key;
	
		let date = new Date();
		let dateOutput;
		
		if((date.getMonth()+1) < 10){
			if(date.getDate()<10){
				dateOutput = date.getFullYear() + "-0" + (date.getMonth()+1) + "-0" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":00";
			}else{
				dateOutput = date.getFullYear() + "-0" + (date.getMonth()+1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":00";
			}
		}else{
			if(date.getDate()<10){
				dateOutput = date.getFullYear() + "-" + (date.getMonth()+1) + "-0" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":00";
			}else{
				
				dateOutput = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":00";
			}
		}

		let newMessageToWrite={
			id: key, 
			convoId: currentConvo.id,
			content:content,
			senderId: currentUserData.email,
			timeStamp: dateOutput,
			type: "text",
		}
		refMessages.set(newMessageToWrite);
	
		refTextHint.set(content);

		container.value = "";

		//tempMessage = new Message(key, content, currentConvo.id, currentUserData.email, dateOutput, "text", "false");
		//ajouterMessage(1, tempMessage);
		document.getElementById("selectedConvo_messages").scrollTop = document.getElementById("selectedConvo_messages").scrollHeight;
		document.getElementById("textHint-"+currentContactName).innerHTML = content;
	}
}

	//Réagit au onclick du bouton wizz et envoie un wizz!
function sendWizz(){
	let container = document.getElementById("message_content");
	let content = "WIZZ";

	if(content.trim().length != 0){
		let tempMessage;
		let refMessages = firebase.database().ref('conversations/' + currentConvo.id + "/messages").push();
		let refTextHint = firebase.database().ref('conversations/' + currentConvo.id+"/textHint");
		let refTime = firebase.database().ref('conversations/' + currentConvo.id+"/lastMessageDate");
		let key = refMessages.key;
	
		let date = new Date();
		let dateOutput;
		
		if((date.getMonth()+1) < 10){
			if(date.getDate()<10){
				dateOutput = date.getFullYear() + "-0" + (date.getMonth()+1) + "-0" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":00";
			}else{
				dateOutput = date.getFullYear() + "-0" + (date.getMonth()+1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":00";
			}
		}else{
			if(date.getDate()<10){
				dateOutput = date.getFullYear() + "-" + (date.getMonth()+1) + "-0" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":00";
			}else{
				
				dateOutput = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":00";
			}
		}
		
		let newMessageToWrite={
			id: key, 
			convoId: currentConvo.id,
			content:'WIZZ',
			senderId: currentUserData.email,
			timeStamp: dateOutput,
			type: "wizz",
			wizzTriggered : "false"
		}
		refMessages.set(newMessageToWrite);
	
		refTextHint.set(content);

		container.value = "";

		//tempMessage = new Message(key, content, currentConvo.id, currentUserData.email, dateOutput, "text", "false");
		//ajouterMessage(1, tempMessage);
		document.getElementById("selectedConvo_messages").scrollTop = document.getElementById("selectedConvo_messages").scrollHeight;
		document.getElementById("textHint-"+currentContactName).innerHTML = "**Un bon vieux Wizz**";
	}
}

function logout(){
	firebase.auth().signOut().then(function() {
		// Sign-out successful.
		document.location.href = "index.html";
	  }, function(error) {
		// An error happened.
	  });
	
}