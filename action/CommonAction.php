<?php
	session_start();

	abstract class CommonAction {
		public static $VISIBILITY_PUBLIC = 0;
		public static $VISIBILITY_MEMBER = 1;
		public static $VISIBILITY_MODERATOR = 2;
		public static $VISIBILITY_ADMINISTRATOR = 3;

		private $pageVisibility;

		public function __construct($pageVisibility) {
			$this->pageVisibility = $pageVisibility;
		}

		public function execute() {
			if (isset($_GET["logout"])) {
				session_unset();
				session_destroy();
				session_start();
			}

			if (!isset($_SESSION["visibility"])) {
				$_SESSION["visibility"] = CommonAction::$VISIBILITY_PUBLIC;
			}

			if ($_SESSION["visibility"] < $this->pageVisibility) {
				header("location:index.php");
				exit;
			}

			$this->executeAction();
		}

		public function getUsername() {
			return !$this->isLoggedIn() ? "Invité" : $_SESSION["username"];
		}

		public function isLoggedIn() {
			return $_SESSION["visibility"] > CommonAction::$VISIBILITY_PUBLIC;
		}

		public function isAdmin() {
			return $_SESSION["visibility"] >= CommonAction::$VISIBILITY_ADMINISTRATOR;
		}

		abstract protected function executeAction();


	}