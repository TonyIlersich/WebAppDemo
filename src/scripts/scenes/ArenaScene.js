const Depth = {
	Background: 0,
	GravNode: 1,
	Stick: 2,
	Node: 3,
	Count: 4
};

class ArenaScene extends Phaser.Scene {
	physicsIterationCount = 100;
	gravNodes = [];
	sticks = [];
	nodes = [];
	
	constructor() {
		super('ArenaScene');
	}
	
	// prepare data
	init() {
		AsyncInput.init(this);
	}
	
	// load stuff from disk
	preload() {
		// intentionally left empty, we are not loading any assets yet
	}
	
	// create game objects
	create() {
		this.titleText = this.add.text(
			resolution.x / 2, resolution.y / 2,
			'The Arena',
			{ fontSize: 200 }
		);
		this.titleText.setOrigin(.5, .5);
		const n = 50;
		for (let i = 0; i < n; i++) {
			this.nodes.push(
				this.createNode({
					x: (resolution.x - 400) * i / (n - 1) + 200,
					y: 540
				})//.setIsFixed(i == Math.floor(n / 2))
				.setIsFixed(i % (n - 1) === 0)
			);
			if (i > 0) {
				this.sticks.push(this.createStick({
					lNode: this.nodes[i],
					rNode: this.nodes[i - 1]
				}));
			}
		}
		this.gravNodes.push(
			this.createGravNode({
				x: 960, y: 200, gravity: -2000000000
		}));
		this.gravNodes.push(
			this.createGravNode({
				x: 560, y: 600, gravity: -20000000
		}));
		this.gravNodes.push(
			this.createGravNode({
				x: 1460, y: 700, gravity: 20000000
		}));
	}
	
	update(time, delta) {
		delta /= 1000;
		this.receiveInput();
		const iterationDelta = delta / this.physicsIterationCount;
		for (let i = 0; i < this.physicsIterationCount; i++) {
			this.updatePhysics(iterationDelta);
		}
		this.renderObjects();
		//console.log('fps:', (1 / delta).toFixed(1));
	}
	
	receiveInput() {
		//const zoomSpeed = 1.01;
		console.log('input:', AsyncInput.mouse.scrollDelta);
		//this.cameras.main.zoom *= zoomFactor;
	}
	
	updatePhysics(delta) {
		this.gravNodes.forEach(g => g.update(this.nodes));
		this.sticks.forEach(s => s.update(delta));
		this.nodes.forEach(n => n.update(delta));
	}
	
	renderObjects() {
		this.gravNodes.forEach(g => g.render());
		this.sticks.forEach(s => s.render());
		this.nodes.forEach(n => n.render());
	}
	
	createNode(props) {
		return new Node(this, props);
	}
	
	createStick(props) {
		return new Stick(this, props);
	}
	
	createGravNode(props) {
		return new GravNode(this, props);
	}
}

class AsyncInput {
	static mouse = {
		position: undefined,
		leftButtonDown: false,
		middleButtonDown: false,
		rightButtonDown: false,
		scrollDelta: 0
	};
	
	static init(scene) {
		scene.input.on('pointermove', e => this.mouse.position = {
			x: e.x,
			y: e.y
		});
		scene.input.on('pointerdown', e => {
			console.log('down');
			switch(e.button) {
				case 0: this.mouse.leftButtonDown = true; return
				case 1: this.mouse.middleButtonDown = true; return;
				case 2: this.mouse.rightButtonDown = true; return;
			}
		});
		scene.input.on('pointerup', e => {
			console.log('up');
			switch(e.button) {
				case 0: this.mouse.leftButtonDown = false; return;
				case 1: this.mouse.middleButtonDown = false; return;
				case 2: this.mouse.rightButtonDown = false; return;
			}
		});
		scene.input.on('wheel?', e => console.log(e));
	}
}

// TODO: dampen node velocity to velocity of other node instead of to rest
class Node {
	baseNodeMass = .01;
	dampingFactor = .00001;
	gameObject;
	position;
	velocity;
	force;
	isFixed;
	mass;
	
	constructor(scene, props) {
		props = props || {};
		this.position = {
			x: props.x || 0,
			y: props.y || 0
		};
		this.velocity = { x: 0, y: 0 };
		this.force = { x: 0, y: 0 };
		this.gameObject = scene.add.circle(
			this.position.x, this.position.y,
			10, 0xff0000
		).setDepth(Depth.Node);
		this.isFixed = false;
		this.mass = this.baseNodeMass;
	}
	
	setIsFixed(isFixed) {
		this.isFixed = isFixed;
		return this;
	}
	
	impulse(deltaMomentum) {
		deltaMomentum = deltaMomentum || {};
		this.velocity = {
			x: this.velocity.x + (deltaMomentum.x || 0) / this.mass,
			y: this.velocity.y + (deltaMomentum.y || 0) / this.mass
		};
	}
	
	addForce(deltaForce) {
		deltaForce = deltaForce || {};
		this.force = {
			x: this.force.x + deltaForce.x || 0,
			y: this.force.y + deltaForce.y || 0
		};
	}
	
	applyForce(delta) {
		const forceWithDamping = {
			x: this.force.x - this.velocity.x * this.dampingFactor,
			y: this.force.y - this.velocity.y * this.dampingFactor
		};
		this.force = { x: 0, y: 0 };
		const acceleration = {
			x: forceWithDamping.x / this.mass,
			y: forceWithDamping.y / this.mass
		};
		this.velocity = {
			x: this.velocity.x + acceleration.x * delta,
			y: this.velocity.y + acceleration.y * delta
		};
	}
	
	move(delta) {
		if (this.isFixed) return;
		this.position = {
			x: this.position.x + this.velocity.x * delta,
			y: this.position.y + this.velocity.y * delta
		};
	}
	
	update(delta) {
		this.applyForce(delta);
		this.move(delta);
	}
	
	render() {
		this.gameObject.setPosition(this.position.x, this.position.y);
		this.gameObject.setFillStyle(
			Math.floor(this.mass / (this.mass + 1000) * 256) * 0x010000
		);
	}
}

class Stick {
	// this is the spring constant and should not change during runtime
	k = 200000;
	maxStretch = 200;
	massPerLength = 1;
	gameObject;
	lNode;
	rNode;
	relaxedLength;
	isBroken;
	mass;
	
	constructor(scene, props) {
		if (!props.lNode || !props.rNode) {
			throw new Error('nodes were not given in Stick constructor.');
		}
		this.lNode = props.lNode;
		this.rNode = props.rNode;
		this.relaxedLength = this.getLength();
		this.mass = this.relaxedLength * this.massPerLength;
		this.lNode.mass += this.mass / 2;
		this.rNode.mass += this.mass / 2;
		this.gameObject = scene.add.line(
			0, 0,
			this.lNode.position.x, this.lNode.position.y,
			this.rNode.position.x, this.rNode.position.y,
			0x00ff00
		).setLineWidth(5)
		.setOrigin(0, 0)
		.setDepth(Depth.Stick);
		this.isBroken = false;
	}
	
	getLength() {
		return Math.sqrt(
			Math.pow(this.lNode.position.x - this.rNode.position.x, 2) +
			Math.pow(this.lNode.position.y - this.rNode.position.y, 2)
		);
	}
	
	getStretch() {
		return this.getLength() - this.relaxedLength;
	}
	
	pushNodes() {
		if (this.isBroken) return;
		const stretch = this.getStretch();
		const ltr = {
			x: this.rNode.position.x - this.lNode.position.x,
			y: this.rNode.position.y - this.lNode.position.y
		};
		const normLtr = {
			x: ltr.x / this.getLength(),
			y: ltr.y / this.getLength()
		};
		const lNodeForce = {
			x: this.k * stretch * normLtr.x,
			y: this.k * stretch * normLtr.y
		};
		const rNodeForce = {
			x: -lNodeForce.x,
			y: -lNodeForce.y
		};
		this.lNode.addForce(lNodeForce);
		this.rNode.addForce(rNodeForce);
	}
	
	maybeBreak() {
		if (this.isBroken) return;
		if (Math.abs(this.getStretch()) > this.maxStretch) {
			console.log('broken');
			this.isBroken = true;
			this.lNode.mass -= this.mass / 2;
			this.rNode.mass -= this.mass / 2;
		}
	}
	
	update() {
		this.maybeBreak();
		this.pushNodes();
	}
	
	render() {
		this.gameObject.setTo(
			this.lNode.position.x, this.lNode.position.y,
			this.rNode.position.x, this.rNode.position.y
		);
	}
}

class GravNode {
	gameObject;
	position;
	gravity;
	
	constructor(scene, props) {
		props = props || {};
		this.position = {
			x: props.x || 0,
			y: props.y || 0
		};
		this.gravity = props.gravity || 0;
		this.gameObject = scene.add.circle(
			this.position.x, this.position.y,
			10, 0x0000ff
		).setRadius(20)
		.setDepth(Depth.GravNode);
	}
	
	update(nodes) {
		nodes.forEach(n => {
			const delta = {
				x: this.position.x - n.position.x,
				y: this.position.y - n.position.y
			};
			const dist = Math.sqrt(
				Math.pow(delta.x, 2) +
				Math.pow(delta.y, 2)
			);
			const norm = {
				x: delta.x / dist,
				y: delta.y / dist
			};
			const strength = this.gravity / Math.pow(dist + 100, 2);
			// assume mass == 1
			const force = {
				x: norm.x * strength,
				y: norm.y * strength
			};
			n.addForce(force);
		});
	}
	
	render() {
		// intentionally empty: gameObject position doesn't have to change
		// TODO: put animation here?
	}
}