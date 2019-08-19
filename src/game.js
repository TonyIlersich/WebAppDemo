$(document).ready(main);

let mainText;

function main() {
	setupPhaser();
}

function setupPhaser() {
	const config = {
		type: Phaser.WEBGL,
		canvas: $('#phaserCanvas')[0],
		width: 1920,
		height: 1080,	
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
	
	const phaserGame = new Phaser.Game(config);
	
	function preload() {
		// load assets here
	};
	
	function create() {
		mainText = this.add.text(
			0, 0,
			'loading...',
			{ fontFamily: 'Courier New' });
	};
	
	function update(time, delta) {
		mainText.setText((1000 / delta).toFixed(1));
	}
}