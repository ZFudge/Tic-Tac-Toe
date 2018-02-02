const tic = {
	squares: [],
	turn: null,
	players: null,
	coordinates: (square) => [parseInt(square.dataset.coordinates[0]),parseInt(square.dataset.coordinates[1])],
	checkWin(c) {
		console.log(c);
		if (c[0] === c[1] || c[0] + c[1] === 2) {
			if (c[0] === c[1] && c[0] + c[1] === 2) {
				console.log('middle')
			} else if (c[0] === c[1]) {
				console.log("diagonal major");
			} else {
				console.log("diagonal minor");
			}
		} else {
			console.log('edge')
		}
	},
	resetCurrentGame() {
		this.squares.forEach((arr) => arr.forEach((square) => { if (square.innerText) {
			square.innerText = "";
			square.classList.remove("depth");
			square.classList.add("pointer");
		}}));
	},
}

const interface = {
	body: document.getElementById("tic-tac-toe-container"),
	content: document.getElementById("interface-container"), 
	buttons: {
		restartAll: document.getElementById("restart-all"),
		resetCurrentGame: document.getElementById("reset-current-game"),
		misc: document.getElementById("misc")
	},
	text: {
		first: {
			title: "One or two players?",
			opt_1: "One",
			opt_2: "Two"
		},
		second: {
			titles: {
				one: "Will you play as X or O?",
				two: "Player One, will you play as X or O?"
			},
			opt_1: "X",
			opt_2: "O"
		}
	},
	options(input) {
		if (!tic.players) {
			tic.players = (input.dataset.player === "true");
			this.fadeReplace(input,"test");
		} else {
			tic.turn = input.dataset.player;
			this.fadeReplace(input,"test");
		}

		Array.from(this.content.children).forEach(function(element) {
			console.log(element);
		});

	},
	initializeGame() {
		this.content.style.display = "none";
		Object.entries(this.buttons).forEach(function(button) {
			button[1].style.display = "initial";
		});
		for (let i = 0; i < 3; i++) {
			tic.squares.push([]);
			for (let j = 0; j < 3; j++) {
				const square = document.createElement("div");
				square.setAttribute("class", `square pointer row-${i+1} col-${j+1}`);
				square.setAttribute("data-coordinates", `${i}${j}`);
				square.id = `square-${i}-${j}`;
				square.onclick = () => this.click(square);
				this.body.appendChild(square);
				tic.squares[i].push(square);
			}	
		}
	},
	restartAll() {
		while (this.body.children.length>4) this.body.removeChild(this.body.lastChild);
		this.content.style.display = 'flex';
		
		Object.entries(this.buttons).forEach(function(button) {
			button[1].style.display = "none";
		});
	},
	fadeReplace(tag, txt) {
		tag.style.opacity = 0;
		setTimeout(function() {
			tag.innerText = txt;
			tag.style.opacity = 1;
		}, 1000);
	},
	click(square) {
		if (!square.innerHTML) {
			square.classList.remove("pointer");
			square.classList.add("depth");
			square.innerText = (this.turn) ? "X" : "O";
			tic.turn = !tic.turn;
			tic.checkWin(tic.coordinates(square));
		}
	}
};
