<?php
	require_once("action/CommonAction.php");

	class IndexAction extends CommonAction {
		public $wrongLogin = false;
		public $dataLogin = [];
		public $errorMessage = "Username ou mot de passe invalide.";
		
		public function __construct() {
			parent::__construct(CommonAction::$VISIBILITY_PUBLIC);
		}

		protected function executeAction() {
			$this->wrongLogin = false;
			
			// if(isset($_POST["username"]) && isset($_POST["pwd"])){
			// 	if($_POST["username"] === "gab" && $_POST["pwd"] === "aaa"){
			// 		$_SESSION["visibility"] = CommonAction::$VISIBILITY_MEMBER;
			// 		header("location:main.php");
			// 		exit;
			// 	}else{
			// 		$this->wrongLogin = true;
			// 	}
			// }else{
			// 	$this->wrongLogin = true;
			// }
		}
	}
