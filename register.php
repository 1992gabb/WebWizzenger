<?php
	require_once("action/registerAction.php");
	
	$action = new RegisterAction();
	$action->execute();

	require_once("partial/header.php");
?>
	<body id = "register_body">
		<script>
			window.onload = () => {
				
			}
		</script>
		
		<header>
			<h1>S'enregister</h1>
		</header>

		<!-- Espace de register -->
	
		
		<?php
		require_once("partial/footer.php");