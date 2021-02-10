<?php
	mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
	$db = new PDO('mysql:host=localhost;dbname=top_players;charset=UTF8', 'mysql', 'mysql');
	$player = $db->query("SELECT * FROM players WHERE nickname = '$_POST[nickname]'");
	if($player){
		echo $_POST['nickname'].'</br>';

		// var_dump($db->query("SELECT * FROM players WHERE nickname = '$_POST[nickname]'"));
		if ($player->fetchAll()[0]['score'] < $_POST['score']) {
			$db->query("UPDATE players SET score= $_POST[score] WHERE nickname = '$_POST[nickname]'");
		}
	} else{
		$db->query("INSERT INTO `players`(`nickname`, `score`) VALUES ('$_POST[nickname]',$_POST[score])");
	}
	echo "<script>location.href = 'index.php'</script>";
	// header('Location: http://pinguin-game/?#');