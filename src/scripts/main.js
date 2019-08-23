$(document).ready(main);

let fpsText;
let posText;

function main() {
	startGame(update);
	resizeCanvas();
	$(window).resize(resizeCanvas);
}

function update(time, delta) {
	// update framerate
	fpsText.setText((1000 / delta).toFixed(1));
	
	// update mouse position label
	const mousePos = getMousePosInPixelSpace();
	const normMousePos = getMousePosNormalized();
	if (!posText) {
		posText = this.add.text(
			mousePos.x, mousePos.y,
			`(${normMousePos.x.toFixed(1)}, ${normMousePos.y.toFixed(1)})`,
			{ fontFamily: 'Courier New' }
		);
	} else {
		posText.setPosition(mousePos.x, mousePos.y);
		posText.setText(
			`(${normMousePos.x.toFixed(2)}, ${normMousePos.y.toFixed(2)})`
		);
	}
}