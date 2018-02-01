const tic = {
	squares: [],
	turn: true,
	board: document.getElementById("tic-tac-toe-inner-container"),
	click(square) {
		if (square.innerHTML === "") {
			square.classList.remove("pointer");
			square.innerHTML = (this.turn) ? "X" : "O";
			this.turn = !this.turn;
		}
	}
}

for (let i = 0; i < 3; i++) {
	for (let j = 0; j < 3; j++) {
		const square = document.createElement("div");
		square.setAttribute("class", `square pointer row-${j+1} col-${i+1}`);
		square.id = `square-${j}-${i}`;
		square.onclick = ()=>tic.click(square);
		tic.board.appendChild(square);
	}	
}