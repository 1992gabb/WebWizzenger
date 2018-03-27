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

		var usersRef = firebase.database().ref('users/');
		var usersData;

		var contactsRef = firebase.database().ref('contacts/');
		var contactsData;

		var usersName = {};
	
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
				console.log(snapshot.val());
				convosData = snapshot.val();

				convosList = [];
				for(data in convosData){
					convosList.push(new Conversation(data, convosData[data].idUser1, convosData[data].idUser2, convosData[data].textHint,convosData[data].messages,convosData[data].lastMessageDate));
				}

				readUsers();
			});
		}

		//Obtient les informations sur les users et ajoute ensuite les conversations en lien avec le currentUser
		function readUsers(){
			usersRef.once('value', function(snapshot) {
				console.log(snapshot.val());
				usersData = snapshot.val();

				for(data in usersData){
					usersName[usersData[data].email] = usersData[data].username;
				}

				for(let i=0;i<convosList.length;i++){
					console.log(convosList[i])
					if(convosList[i].user1 == currentUser.email){
						addConvoToList(convosList[i].user2, convosList[i].textHint);
					}else if(convosList[i].user2 == currentUser.email){
						addConvoToList(convosList[i].user1, convosList[i].textHint);
					}
				}

				readContacts();
			});
		}

		//Après avoir enregistré le nom des users, ajoute les contacts en lien avec le currentUser
		function readContacts(){
			contactsRef.once('value', function(snapshot) {
				console.log(snapshot.val());
				contactsData = snapshot.val();

				for(data in contactsData){
					if(contactsData[data].userID == currentUser.email){
						addContactToList(contactsData[data].contactID);
					}else if(contactsData[data].contactID == currentUser.email){
						addContactToList(contactsData[data].userID);
					}
				}
			});
		}

		function addConvoToList(contactEmail, textHint){
			let newConvo = document.createElement("div");
			newConvo.setAttribute("class", "conversationInList");

			let convoAvatar = document.createElement("img");
			convoAvatar.setAttribute("class", 'convoAvatar');
			convoAvatar.setAttribute("src", 'images/back.jpg');

			let zoneTexte = document.createElement("div");
			zoneTexte.setAttribute("class", "conversationsInList_texte");

			let convoContact = document.createElement("p");
			let text = document.createTextNode(usersName[contactEmail]);
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
		}

		function addContactToList(contactEmail){
			let newContact = document.createElement("div");
			newContact.setAttribute("class", "contactInList");

			let contactName = document.createElement("p");
			let text = document.createTextNode(usersName[contactEmail]);
			contactName.appendChild(text);

			newContact.appendChild(contactName);

			let container = document.getElementById("zone_contacts");
			container.appendChild(newContact);
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
				<p>Zone Convo Titre</p>

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