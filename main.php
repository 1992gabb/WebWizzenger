<?php
	require_once("action/mainAction.php");
	
	$action = new MainAction();
	$action->execute();

	require_once("partial/header.php");
?>
	<body id = "main_body">
	<div id = "zone_browsing">
			<div id = "zone_recherche">
				<p>Zone Recherche</p>
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
			

			</div>

			<div id = "selectedConvo_messages">
			

			</div>

			<div id = "selectedConvo_writeSend">
				<div id = "selectedConvo_entryZone">
			

				</div>
				<div id = "selectedConvo_sendButton">
			

				</div>
			</div>
		</div>
	</body>
		
		<?php
		require_once("partial/footer.php");