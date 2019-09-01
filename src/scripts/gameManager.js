const resolution = {
	x: 1920,
	y: 1080
};

let phaserGame;

const startGame = () => {
	const config = {
		type: Phaser.WEBGL,
		canvas: $('#phaserCanvas')[0],
		width: resolution.x,
		height: resolution.y,
		scene: [TitleScene, ArenaScene],
		physics: {
			default: 'arcade',
			arcade: {
				gravity: {
					y: 200
				}
			}
		},
	};
	
	phaserGame = new Phaser.Game(config);
}

// returns {x, y} where {0, 0} is top left, {1920, 1080} is bottom right.
const getMousePosInPixelSpace = () => {
	return {
		x: _phaserGame.input.mousePointer.x,
		y: _phaserGame.input.mousePointer.y
	};
}

// returns mouse pos adjusted so height is 1, width is aspect, and the origin is
// at the center of canvas.
const getMousePosNormalized = () => {
	const pixelPos = getMousePosInPixelSpace();
	return {
		x: pixelPos.x / resolution.y - aspect / 2,
		y: pixelPos.y / resolution.y - .5
	};
}