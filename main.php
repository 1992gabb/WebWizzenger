<?php
	require_once("action/mainAction.php");
	
	$action = new MainAction();
	$action->execute();

	require_once("partial/header.php");
	require_once("partial/firebase.php");
?>
	<body id = "main_body">

	<script>

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

	
		window.onload = () => {
			firebase.auth().onAuthStateChanged(function(user) {
					if (user) {
						console.log(user);
						currentUser = user;
					} else {
						<?php $_SESSION["visibility"] = CommonAction::$VISIBILITY_PUBLIC;  ?>
						document.location.href="index.php";
					}
			});

			readConvos();

			document.getElementById("default").click();
		}

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

				readContacts();
			});
		}

		//Après avoir enregistré le nom des users, ajoute les contacts en lien avec le currentUser
		function readContacts(){
			contactsRef.once('value', function(snapshot) {
				contactsData = snapshot.val();

				console.log(contactsData);

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
					console.log(myContactsList[i]);
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
				afficherConvo(currentContactName);
			}
		}

		//Pour créer des div pour chacun des contacts
		function addContactToList(contactName){
			let newContact = document.createElement("div");
			newContact.setAttribute("class", "contactInList");

			let contactNameP = document.createElement("p");
			let text = document.createTextNode(contactName);
			contactNameP.appendChild(text);

			newContact.appendChild(contactNameP);

			let container = document.getElementById("zone_contacts");
			container.appendChild(newContact);
		}

		//Affiche la conversation dans l'espace de droite
		function afficherConvo(contactName){
			console.log(contactName);
			let pTitle = document.getElementById("p_title");
			pTitle.innerHTML = contactName;


			currentConvo = loadConvo(contactName);
			updateConvoMessages(currentConvo);
		}

		function loadConvo(contactName){
			for(let i=0;i<myConvosList.length;i++){
				console.log(myConvosList[i]);
				if(myConvosList[i].user2.username == contactName){
					currentConvo = convosData[data];
					console.log(currentConvo);
				}
			}
		}

		function updateConvoMessages(convo){

		}

	</script>
	<div id = "zone_browsing">
			<header id = "main_header">
				<p style="text-align:center;">Wizzenger</p>
			</header>
			<div id = "zone_recherche">
				<p style="text-align:center;">Zone Recherche</p>
			</div>

			<div id = "zone_titles">
				<div id="titles_tab_titles">
  					<button class="tab_links" onclick="openTab(event, 'zone_convos')" id ="default">Conversations</button>
					<button class="tab_links" onclick="openTab(event, 'zone_contacts')">Contacts</button>
				</div>
			</div>

			<div id = "zone_convos" class = "tab_content">
				<!-- Populé par le code javascript (voir readConvos) -->
			</div>

			<div id = "zone_contacts" class = "tab_content">
				<!-- Populé par le code javascript (voir readContacts) -->
			</div>
		</div>

		<div id = "zone_selectedConvo">
			<div id = "selectedConvo_title">
				<p id="p_title">Zone Convo Titre</p>

			</div>

			<div id = "selectedConvo_messages">
				<p>Zone Convo Messages</p>

			</div>

			<div id = "selectedConvo_writeSend">
				<div id = "selectedConvo_entryZone">
					<p>Zone Convo Entrée</p>

				</div>
				<div id = "selectedConvo_sendButton">
					<p>Zone Bouton envoyer</p>

				</div>
			</div>
		</div>
	</body>
		
		<?php
		require_once("partial/footer.php");