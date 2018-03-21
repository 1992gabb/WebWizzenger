<?php
	require_once("action/mainAction.php");
	
	$action = new MainAction();
	$action->execute();

	require_once("partial/header.php");
?>
	<body id = "main_body">
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
				<p>Zone Conversations</p>

			</div>

			<div id = "zone_contacts" class = "tab_content">
				<p>Zone Contacts</p>

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