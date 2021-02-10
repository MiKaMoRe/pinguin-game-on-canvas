<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>
	<link rel="stylesheet" href="style.css">
</head>
<body>
	<?php 
		$db = new PDO('mysql:host=localhost;dbname=top_players;charset=UTF8', 'mysql', 'mysql');

		$result = $db->query('SELECT * FROM `players` ORDER BY `players`.`score` DESC LIMIT 10')->fetchAll();
		// var_dump($result)s
	?>
	<div class="start">
		<form action="#">
			<h1>МЕТКИЙ ВЫСТРЕЛ</h1>
			<input type="text" placeholder="Введите свой никнейм" id="nickname">
			<button id="start_game" type="button">start</button>
		</form>
	</div>
	<div class="game">
		<canvas id="canvas" width="1000px" height="500px">Ваш браузер не поддерживает Canvas</canvas>
		<div class="menu">
			<div class="leftside">
				<div class="score">
					<h3>Счет:</h3>
					<input type="text" id="score" readonly required>
				</div>
				<button type="submit" id="restart">Начать заново</button>
			</div>
			<div class="rightside">
				<div class="stamina">
					<div id="progress_bar"></div>
				</div>
			</div>
		</div>
	</div>
	<div class="end">
		<div class="end_menu">
			<ol type="1">
				<?php	
					foreach ($result as $value){
						echo "<li>$value[nickname] : $value[score]</li>";
					}
				?>
			</ol>
			<form action="php_update.php" method="post">
				<div>
					<input type="text" id="nickname_output" name="nickname" readonly>
					<input type="number" id="score_output" name="score" readonly>
				</div>
				<button id="restart2">Начать заново</button>
				<button type="submit">Сохранить результат</button>
			</form>
		</div>
	</div>
	
	<script src="main.js"></script>
</body>
</html>