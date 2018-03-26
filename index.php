<?php
	require_once("action/indexAction.php");
	
	$action = new IndexAction();
	$action->execute();

	require_once("partial/header.php");
?>
	<body id = "index_body">


		<script>
			let popupRegister;

			window.onload = () => {
				document.body.style.opacity = 1;
				document.body.style.paddingTop = 0;
				setTimeout(afficherWizz, 1500);
    			popupRegister = document.getElementById("zone_register");
			}
		</script>
		
		<header>
			<h1>WIZZENGER</h1>
		</header>

		<!-- Espace de login -->
		
		<div id="login">
			<form action="index.php" method ="post" >
				<h2>CONNEXION</h2>
				<div id = "ligne1">			
					<h2 id="titre_user">Courriel: </h2>
					<input type="text" name="username" id="user" placeholder="">
				</div>
				<div class="vider"></div>
				<div id = "ligne2">
					<h2>Mot de Passe: </h2>			
					<input type="password" name="pwd" id="password" placeholder="">
				</div>
				<div class="vider"></div>
				<?php
					if ($action->wrongLogin) {
						?>
						<div class="error-div"><strong> </strong><?=$action->errorMessage?></div>
						<?php
					}
				?>
				<div id="zone_boutons_index">
					<input type="submit" name="bouton" id="btn_submit" value="Connexion">
					
				</div>
			</form>
			<button onclick="register()" id="btn_register">S'enregistrer</button>
		</div>

		<!-- Message d'accueil -->
		<main>
			<p>Tanné de devoir utiliser facebook pour discuter avec vos meilleurs amis?</p>
			<p>Nostalgique du temps où l'on avait hâte de rentrer à la maison pour envoyer des wizz à ses copains?</p>
			<p>Vous êtes au bon endroit! Avec Wizzenger, combinez plaisir et simplicité afin de communiquer avec ceux qui vous sont cher.
			   Entrez votre courriel et le tour est joué!</p>
			<p>Wizzenger est un service gratuit et le sera TOUJOURS</p>
			<h3>Quoi de neuf dans la version 0.5:</h3>
			<ul>
				<li>	Conversations avec un contact</li>
				<li>	Modifier ses contacts</li>
			</ul>
			<h3>À venir</h3>
			<ul>
				<li>Envoyer un wizz!</li>
				<li>Envoyer des gif!</li>
			</ul>
			<h3>À venir dans très longtemps:</h3>
			<ul>
				<li>Une version pour iPhone.....</li>
			</ul>
		</main>
		<img id="img_wizz" src="images/back.jpg"></img>
		<div id="mess_mobile">
			<p>Pour utiliser l'application sur mobile, veuillez nous visiter sur le <a href="#">Play Store</a>!</p> 
			
		</div>
		
		<?php
		require_once("partial/footer.php");