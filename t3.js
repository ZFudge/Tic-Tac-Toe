const tic = {
	squares: [],
	turn: null,
	players: "none",// true > 1, false > 2
	coordinates: (square) => [parseInt(square.dataset.coordinates[0]),parseInt(square.dataset.coordinates[1])],
	checkWin(coordinates) {
		const r = coordinates[0];
		const c = coordinates[1];
		if ((r+c) % 2 === 0) {
			if (r === c) {
					console.log('check MAJOR');
				if (this.checkMoves([[0,0],[1,1],[2,2]])) { //(this.checkMajor()) {
					return true;
				}
			}
			if (r + c === 2) {
					console.log('check MINOR');
				if (this.checkMoves([[2,0],[1,1],[0,2]])) {
					return true;
				}
			}
		}
		const rowAndColumn = this.getRowAndColumn(r,c);
		console.log(rowAndColumn);
		if (this.checkMoves(rowAndColumn[0])) {
			return true;
		}
		if (this.checkMoves(rowAndColumn[1])) {
			return true;
		}
		return false;
	},
	checkMoves(arr) {
		return this.squares[arr[0][0]][arr[0][1]].innerHTML === this.squares[arr[1][0]][arr[1][1]].innerHTML && 
		this.squares[arr[0][0]][arr[0][1]].innerHTML === this.squares[arr[2][0]][arr[2][1]].innerHTML;
	},
	getRowAndColumn(r,c) {
		let row = [];
		let column = [];
		for (let i = 0; i < 3; i++) {
			row.push([r,i]);
			column.push([i,c]);
		}
		return [row,column];
	},
	checkMajor() {
		return this.squares[0][0].innerHTML === this.squares[1][1].innerHTML && this.squares[0][0].innerHTML === this.squares[2][2].innerHTML;
	},
	checkMinor() {
		return this.squares[2][0].innerHTML === this.squares[1][1].innerHTML && this.squares[2][0].innerHTML === this.squares[0][2].innerHTML;
	},
	resetCurrentGame() {
		this.squares.forEach((arr) => arr.forEach((square) => { if (square.innerText) {
			square.innerText = "";
			square.classList.remove("depth");
			square.classList.add("pointer");
		}}));
	}
}

const interface = {
	body: document.getElementById("tic-tac-toe-container"),
	content: document.getElementById("interface-container"), 
	buttons: {
		restartAll: document.getElementById("restart-all"),
		resetCurrentGame: document.getElementById("reset-current-game"),
		misc: document.getElementById("misc")
	},
	textSets: {
		first: ["One or two players?", "One", "Two"],
		second: {
			one: ["Will you play as X or O?", "X", "O"],
			two: ["Player One, will you play as X or O?", "X", "O"]
		}
	},
	options(input) {
		const arr = Array.from(this.content.children);
		if (tic.players === "none") {
			tic.players = (input.dataset.player === "true");
			arr.forEach((element,index) => interface.fadeReplace(element, (tic.players) ? interface.textSets.second.one[index] : interface.textSets.second.two[index]));
			this.buttons.restartAll.style.display = "initial";
			setTimeout(()=>this.buttons.restartAll.style.opacity = 1);
		} else {
			tic.turn = (input.dataset.player === "true");
			arr.forEach((element) => interface.fadeReplace(element, ""));
			interface.initializeGame();
		}
	},
	initializeGame() {
		if (!tic.squares.length) {
			Object.entries(this.buttons).forEach((button) => {
				button[1].style.display = "initial"; 
				setTimeout(()=>button[1].style.opacity = 1);
			});
			this.content.style.display = "none";
			this.body.style.color = "#def";
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
					setTimeout(()=>square.style.opacity = 1, 250);
				}	
			}
			setTimeout(()=>{
			}, 250);
		}
	},
	restartAll() {
		tic.squares = [];
		while (this.body.children.length>4) this.body.removeChild(this.body.lastChild);
		this.content.style.display = 'flex';
		this.body.style.color = "#444";
		tic.players = "none";
		tic.turn = null;
		Object.entries(this.buttons).forEach((button) => button[1].style.display = "none");
		Array.from(this.content.children).forEach( (element,index) => interface.fadeReplace(element, interface.textSets.first[index]));
	},
	fadeReplace(tag, txt) {
		tag.style.opacity = 0;
		setTimeout(function() {
			tag.innerText = txt;
			tag.style.opacity = 1;
		}, 500);
	},
	click(square) {
		if (!square.innerHTML) {
			square.classList.remove("pointer");
			square.classList.add("depth");
			square.innerText = (tic.turn) ? "X" : "O";
			tic.turn = !tic.turn;
			if (tic.checkWin(tic.coordinates(square))) {
				console.log("WINNNNNNNNNNNNNNNNNNER")
			}
		}
	}
};


