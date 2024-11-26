document.addEventListener("DOMContentLoaded", () => {
	let deck = [],
		suits = ["hearts", "diamonds", "clubs", "spades"],
		faces = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"],
		values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10],
		hand = [],
		pool = [],
		score = 0,
		t,
		s = 0;
	(games = 0), (start = true);
	function regeneratedeck() {
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 13; j++) {
				deck.push({
					suit: suits[i],
					face: faces[j],
					value: values[j],
					image: "img/card" + suits[i] + faces[j] + ".png",
				});
			}
		}
		document.getElementById("stats").innerHTML = "Score: " + score;
		if (games !== 0) {
			document.getElementById("stats").innerHTML += "<br>Average: " + (score / games).toFixed(0);
		} else {
			document.getElementById("stats").innerHTML += "<br>Average: 0";
		}
		document.getElementById("stats").innerHTML += "<br>Games: " + games;
		document.getElementById("stats").innerHTML += "<br>Previous Answer: " + s;
		games++;
	}
	function generateset() {
		start = true;
		let score = 0;
		for (let i = 0; i < 52; i++) {
			pool.push(i);
		}
		document.querySelectorAll("input")[0].value = "";
		document.getElementById("cards").innerHTML = "";
		document.getElementById("lower").className = "";
		hand = [];
		let index;
		for (let i = 0; i < 5; i++) {
			index = pool[Math.floor(Math.random() * pool.length)];
			window.console.log(pool, index);
			let e = document.createElement("img");
			document.getElementById("cards").appendChild(e);
			let temp = pool.indexOf(index);
			e.src = deck[temp].image;
			hand.push(deck[temp]);
			deck.splice(temp, 1);
			pool.splice(temp, 1);
			hand[i].face === "J" && hand[i].suit === hand[0].suit && i !== 0 ? score++ : 0; //knob
		}
		for (let i = 0; i < 5; i++) {
			for (let j = i + 1; j < 5; j++) {
				hand[i].face === hand[j].face ? (score += 2) : 0; //pairs
			}
		}
		let handvalues = [hand[0].value, hand[1].value, hand[2].value, hand[3].value, hand[4].value];
		function adder(arr, rest, results) {
			if (!arr.length && !rest.length) return;

			if (!rest.length) {
				results.push(arr);
			} else {
				var arr2 = arr.slice();
				arr.push(rest[0]);
				adder(arr2, rest.slice(1), results);
				adder(arr, rest.slice(1), results);
			}

			return results;
		}
		function arrayadder(arr) {
			return Number(
				arr.reduce(function (a, b) {
					return a + b;
				}, 0)
			);
		}
		let result = adder([], handvalues, []);
		for (let i = 0; i < result.length; i++) {
			arrayadder(result[i]) === 15 ? (score += 2) : 0; //15
		}
		let handsuits = [hand[0].suit, hand[1].suit, hand[2].suit, hand[3].suit, hand[4].suit];
		let uniquesuits = [...new Set(handsuits)];
		for (let i = 0; i < uniquesuits.length; i++) {
			let count = 0;
			for (let j = 0; j < handsuits.length; j++) {
				handsuits[j] === uniquesuits[i] ? count++ : 0;
			}
			if (count >= 4) {
				score += count; //flushes
				break;
			}
			count = 0;
		}
		let handfaces = [hand[0].face, hand[1].face, hand[2].face, hand[3].face, hand[4].face];
		handfaces.sort((a, b) => faces.indexOf(a) - faces.indexOf(b));
		handfaces = [
			faces.indexOf(handfaces[0]),
			faces.indexOf(handfaces[1]),
			faces.indexOf(handfaces[2]),
			faces.indexOf(handfaces[3]),
			faces.indexOf(handfaces[4]),
		];
		let allruns = adder([], handfaces, []);
		for (let i = 0; i < allruns.length; i++) {
			let list = allruns[i];
			if (list.length === 5 && list[0] === list[1] - 1 && list[1] === list[2] - 1 && list[2] === list[3] - 1 && list[3] === list[4] - 1) {
				score -= 4; //runs of 5
			} else if (list.length === 4 && list[0] === list[1] - 1 && list[1] === list[2] - 1 && list[2] === list[3] - 1) {
				score -= 2; //runs of 4
			} else if (list.length === 3 && list[0] === list[1] - 1 && list[1] === list[2] - 1) {
				score += 3; //runs of 3
			}
		}
		hand[0].face === "J" ? (score += 2) : 0; //heel
		pool = [];
		return score;
	}
	regeneratedeck();
	s = generateset();
	t = new Date();
	document.querySelectorAll("button")[0].addEventListener("click", () => {
		if (start) {
			start = false;
			let guess = document.querySelectorAll("input")[0].value;
			let t2 = new Date();
			if (guess === s.toString()) {
				score += 10000 - t2.getMilliseconds() - t.getMilliseconds();
				document.getElementById("lower").classList.add("correct");
			} else {
				score -= 50000 - t2.getMilliseconds() - t.getMilliseconds();
				document.getElementById("lower").classList.add("wrong");
			}
			regeneratedeck();
			setTimeout(() => {
				s = generateset();
			}, 250);
		}
	});
	document.addEventListener("keypress", (e) => {
		if (e.key === "Enter" && start) {
			start = false;
			let guess = document.querySelectorAll("input")[0].value;
			let t2 = new Date();
			if (guess === s.toString()) {
				score += 10000 - t2.getMilliseconds() - t.getMilliseconds();
				document.getElementById("lower").classList.add("correct");
			} else {
				score -= 50000 - t2.getMilliseconds() - t.getMilliseconds();
				document.getElementById("lower").classList.add("wrong");
			}
			regeneratedeck();
			setTimeout(() => {
				s = generateset();
			}, 250);
		}
	});
});
