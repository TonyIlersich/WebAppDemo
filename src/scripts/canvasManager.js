const aspect = 16 / 9;

const resizeCanvas = () => {
	const width = Math.min(
		$(window).width(),
		$(window).height() * aspect
	);
	const height = Math.min(
		$(window).height(),
		$(window).width() / aspect
	);
	$('#phaserCanvas').width(width);
	$('#phaserCanvas').height(height);
}