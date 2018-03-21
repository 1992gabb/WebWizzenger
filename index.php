<?php
	require_once("action/indexAction.php");
	
	$action = new IndexAction();
	$action->execute();

	require_once("partial/header.php");
?>
	<body id = "index_body">
		<!-- Pour l'utilisation du login facebook -->
		<!--<script>
				window.fbAsyncInit = function() {
					FB.init({
					appId      : '{2005498436404804}',
					cookie     : true,
					xfbml      : true,
					version    : '{latest-api-version}'
					});
					
					FB.AppEvents.logPageView();   
					
				};
				
				(function(d, s, id){
					var js, fjs = d.getElementsByTagName(s)[0];
					if (d.getElementById(id)) {return;}
					js = d.createElement(s); js.id = id;
					js.src = "https://connect.facebook.net/en_US/sdk.js";
					fjs.parentNode.insertBefore(js, fjs);
					}(document, 'script', 'facebook-jssdk'));
		</script>-->

		<script>
			window.onload = () => {
				document.body.style.opacity = 1;
				document.body.style.paddingTop = 0;
				setTimeout(afficherWizz, 1500);
			}
		</script>
		
		<header>
			<h1>WIZZENGER</h1>
		</header>

		<!-- Espace de login -->
		<form action="index.php" method ="post" >
			<div id="login">
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
				<input type="submit" name="bouton" id="btn_submit" value="Connexion">
				<div class="fb-login-button" data-max-rows="1" data-size="large" data-button-type="continue_with" data-show-faces="false" data-auto-logout-link="false" data-use-continue-as="false"></div>
				<div class="google-login-button" data-max-rows="1" data-size="large" data-button-type="continue_with" data-show-faces="false" data-auto-logout-link="false" data-use-continue-as="false"></div>
			</div>
		</form>

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