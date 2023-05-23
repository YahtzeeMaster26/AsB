function generateLoop(mod, sum, seed) {
	if (seed.length !== sum) throw "Length of seed must equal sum amount";

	const seq = [...seed];

	while (true) {
		const end = seq.slice(-seed.length);
		if (seq.length >= end.length * 2 && end.every((x, i) => seq[i] === x)) return seq.slice(0, -seed.length);
		seq.push(end.reduce((a, b) => a + b) % mod);
	}
}

function seedsSameLoop(loop, seed) {
	outer: for (let i = 0; i < loop.length; i++) {
		for (const j in seed) if (seed[j] !== loop[(i + +j) % loop.length]) continue outer;
		return true;
	}

	return false;
}

/*function generateAllLoops(mod, sum) {
	const loops = [];
	const currentSeed = Array(sum).fill(0);

	// we will eventually break...
	while (true) {
		let isNew = true;
		for (const loop of loops) if (seedsSameLoop(loop, currentSeed)) {
			isNew = false;
			break;
		}

		if (isNew) loops.push(generateLoop(mod, sum, currentSeed));

		currentSeed[sum - 1]++;
		for (let i = sum - 1; i > 0; i--) if (currentSeed[i] === mod) {
			currentSeed[i] = 0;
			currentSeed[i - 1]++;
		} else break;

		if (currentSeed[0] === mod) break;
	}

	return loops;
}*/


// far faster than the old one
function generateAllLoops(mod, sum) {
	const lookup = {};
	const first = { first: "yeah", next: undefined };

	// Yeah
	const key = Array(sum).fill(0);
	let prev = first;
	while (true) {
		const keyCopy = [...key];

		prev = { last: prev, next: undefined, val: keyCopy };
		prev.last.next = prev;
		lookup[key.join(",")] = prev;

		key[sum - 1]++;
		for (let i = sum - 1; i > 0; i--) if (key[i] === mod) {
			key[i] = 0;
			key[i - 1]++;
		} else break;

		if (key[0] === mod) break;
	}

	const final = { final: "yeah", last: prev };
	prev.next = final;


	const loops = [];
	while (first.next !== final) {
		const seed = first.next.val;

		// delete the seed entry from the list and lookup
		first.next.next.last = first;
		first.next = first.next.next;
		delete lookup[seed.join(",")];

		const seq = [...seed];
		while (true) {
			const end = seq.slice(-sum);

			const endListEntry = lookup[end.join(",")];
			if (endListEntry !== undefined) {
				endListEntry.last.next = endListEntry.next;
				endListEntry.next.last = endListEntry.last;
				delete lookup[end.join(",")];
			}

			if (seq.length >= end.length * 2 && end.every((x, i) => seq[i] === x)) {
				loops.push(seq.slice(0, -sum));
				break;
			}
			seq.push(end.reduce((x, y) => x + y) % mod);
		}
	}

	return loops;
}