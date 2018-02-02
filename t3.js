const tic = {
	squares: [],
	turn: true,
	board: document.getElementById("tic-tac-toe-container"),
	click(square) {
		if (!square.innerHTML) {
			square.classList.remove("pointer");
			square.classList.add("depth");
			square.innerText = (this.turn) ? "X" : "O";
			this.turn = !this.turn;
			this.checkWin(this.coordinates(square));
		}
	},
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
	clear() {
		this.squares.forEach((arr) => arr.forEach((square) => { if (square.innerText) {
			square.innerText = "";
			square.classList.remove("depth");
			square.classList.add("pointer");
		}}));
	},
	initializeGame() {
		this.board.interface.style.display = "none";
		this.board.interface.restartButton.style.display = "inline-block";
		for (let i = 0; i < 3; i++) {
			this.squares.push([]);
			for (let j = 0; j < 3; j++) {
				const square = document.createElement("div");
				square.setAttribute("class", `square pointer row-${i+1} col-${j+1}`);
				square.setAttribute("data-coordinates", `${i}${j}`);
				square.id = `square-${i}-${j}`;
				square.onclick = () => this.click(square);
				this.board.appendChild(square);
				this.squares[i].push(square);
			}	
		}
	},
	restartGame() {
		while (this.board.children.length>2) {
			this.board.removeChild(this.board.lastChild);
		}
		this.board.interface.style.display = 'flex';
		this.board.interface.restartButton.style.display = "none";
	}
}
tic.board.interface = document.getElementById("interface-container");
tic.board.interface.restartButton = document.getElementById("restart");
