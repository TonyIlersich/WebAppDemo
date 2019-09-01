class TitleScene extends Phaser.Scene {
	titleText;
	
	constructor() {
		super('TitleScene');
	}
	
	// prepare data
	init() {
	}
	
	// load stuff from disk
	preload() {
		// intentionally left empty, we are not loading any assets yet
	}
	
	// create game objects
	create() {
		this.titleText = this.add.text(
			resolution.x / 2, resolution.y / 2,
			'TITLE SCREEN',
			{ fontSize: 200 });
		this.titleText.setOrigin(.5, .5);
		this.input.on(
			'pointerdown',
			(pointer) => this.scene.start('ArenaScene'),
			this);
	}
	
	update(time, delta) {
		// TODO: add title screen animation
	}
}