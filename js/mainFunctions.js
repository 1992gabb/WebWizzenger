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

		for(let i=0;i<myContactsList.length;i++){
			addContactToList(myContactsList[i].user2.username);
		}
	});
}

//Créé les div pour chacune des conversations
function addConvoToList(contactName, textHint){
	let newConvo = document.createElement("div");
	newConvo.setAttribute("class", "conversationInList");
	
	let convoAvatar = document.createElement("img");
	convoAvatar.setAttribute("class", 'convoAvatar');
	convoAvatar.setAttribute("src", 'images/back.jpg');

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

//Pour créer des div pour chacun des contacts
function addContactToList(contactName){
	let newContact = document.createElement("div");
	newContact.setAttribute("class", "contactInList");

	let contactAvatar = document.createElement("img");
	contactAvatar.setAttribute("class", 'contactImages');
	contactAvatar.setAttribute("src", 'images/back.jpg');

	let contactNameP = document.createElement("p");
	contactNameP.setAttribute("style", "width:35%;height:100%;margin-left:10px;")
	let text = document.createTextNode(contactName);
	contactNameP.appendChild(text);

	let imageMess = document.createElement("img");
	let id = "imageMess" + contactName;
	imageMess.setAttribute("id", id);
	imageMess.setAttribute("class", 'contactImages');
	imageMess.setAttribute("src", 'images/back.jpg');

	let imageWizz = document.createElement("img");
	imageWizz.setAttribute("class", 'contactImages');
	imageWizz.setAttribute("src", 'images/back.jpg');

	newContact.appendChild(contactAvatar);
	newContact.appendChild(contactNameP);
	newContact.appendChild(imageMess);
	newContact.appendChild(imageWizz);

	let container = document.getElementById("zone_contacts");
	container.appendChild(newContact);
}

//Affiche la conversation dans l'espace de droite
function afficherConvo(contactName){
	let pTitle = document.getElementById("p_title");
	pTitle.setAttribute("style", "margin-bottom:0px;")
	pTitle.innerHTML = contactName;

	document.getElementById("selectedConvo_writeSend").style.display = "block";
	currentConvo = loadConvo(contactName);
}

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

//Va chercher les messages dans la conversations et les affiche
function updateConvoMessages(convo){
	let container = document.getElementById("selectedConvo_messages");
	container.innerHTML = "";

	for(id in convo.messages){
		let currentMessage = convo.messages[id];

		//Pour déterminer l'alignement gauche droite du message
		if(currentMessage.senderId == currentUserData.email){

			ajouterMessage(1, currentMessage);
		}else{
			ajouterMessage(0, currentMessage);
		}
		lastMessageCreated = currentMessage;
	}

	container.scrollTop = container.scrollHeight;
	
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
function sendMessage(){
	let container = document.getElementById("message_content");
	let content = container.value;

	if(content.trim().length != 0){
		let tempMessage;
		let refMessages = firebase.database().ref('conversations/' + currentConvo.id + "/messages");
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
		refMessages.push(newMessageToWrite);
	
		refTextHint.set(content);

		container.value = "";

		tempMessage = new Message(key, content, currentConvo.id, currentUserData.email, dateOutput, "text");
		ajouterMessage(1, tempMessage);
		document.getElementById("selectedConvo_messages").scrollTop = document.getElementById("selectedConvo_messages").scrollHeight;
		document.getElementById("textHint-"+currentContactName).innerHTML = content;
	}
}