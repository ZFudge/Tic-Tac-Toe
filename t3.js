const tic = {
	squares: [],
	turn: true,
	board: document.getElementById("tic-tac-toe-inner-container"),
	click(square) {
		if (square.innerHTML === "") {
			square.classList.remove("pointer");
			square.classList.add("depth");
			square.innerText = (this.turn) ? "X" : "O";
			this.turn = !this.turn;
			this.checkWin(square);
		}
	},
	checkWin(square) {
		
	}
}

for (let i = 0; i < 3; i++) {
	tic.squares.push([]);
	for (let j = 0; j < 3; j++) {
		const square = document.createElement("div");
		square.setAttribute("class", `square pointer row-${i+1} col-${j+1}`);
		square.id = `square-${i}-${j}`;
		square.onclick = () => tic.click(square);
		tic.board.appendChild(square);
		tic.squares[i].push(square);
	}	
}