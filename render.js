const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");


function renderAllLoops(mod, sum, size = 10) {
	const loops = generateAllLoops(mod, sum);

	const colours = Array(mod).fill().map((_, i) => `hsl(${360 * i / mod}, 100%, 50%)`);
	const dimensions = [
		loops.map(x => x.length).reduce((x, y) => Math.max(x, y)) * size,
		loops.length * size,
	];

	canvas.width = dimensions[0];
	canvas.height = dimensions[1];

	for (const y in loops) for (const x in loops[y]) {
		ctx.fillStyle = colours[loops[y][x]];
		ctx.fillRect(x * size, y * size, size, size);
	}
}

function renderAllLoopsHTML() {
	const mod = +document.getElementById("mod").value;
	const sum = +document.getElementById("sum").value;
	const size = +document.getElementById("size").value;

	if (isNaN(mod) || isNaN(sum) || isNaN(size)) return alert("One of the values you entered isn't a number");

	renderAllLoops(mod, sum, size);
}