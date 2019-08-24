const resolution = {
	x: 1920,
	y: 1080
};

let _phaserGame;

const startGame = (update) => {
	const config = {
		type: Phaser.WEBGL,
		canvas: $('#phaserCanvas')[0],
		width: resolution.x,
		height: resolution.y,
		physics: {
			default: 'arcade',
			arcade: {
				gravity: {
					y: 200
				}
			}
		},
		scene: {
			preload: preload,
			create: create,
			update: update
		}
	};
	
	_phaserGame = new Phaser.Game(config);
	
	function preload() {
		// load assets here
	};
	
	function create() {
		fpsText = this.add.text(
			0, 0,
			'loading...',
			{ fontFamily: 'Courier New' }
		);
	};
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