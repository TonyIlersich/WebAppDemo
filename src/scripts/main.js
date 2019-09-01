$(document).ready(main);

function main() {
	startGame();
	resizeCanvas();
	$(window).resize(resizeCanvas);
}