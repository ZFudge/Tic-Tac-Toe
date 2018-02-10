const tic = {
	squares: [],
	turn: null, // true -> X false -> O
	active: true,
	players: "none",// true -> 1, false -> 2
	playerOne: null,
	count: 9,
	getRowAndColumn: (square) => [parseInt(square.dataset.coordinates[0]),parseInt(square.dataset.coordinates[1])],
	checkWin(coordinates) {
		const row = coordinates[0];
		const column = coordinates[1];
		if ((row + column) % 2 === 0) { // square is a corner or middle
			if (row === column) 	
				if (this.checkMoves([[0,0],[1,1],[2,2]])) {
					this.highlight([[0,0],[1,1],[2,2]]);
					return true;
				}  // Major Diagonal
			if (row + column === 2) 
				if (this.checkMoves([[2,0],[1,1],[0,2]])) {
					this.highlight([[2,0],[1,1],[0,2]]);
					return true; // Minor Diagonal
				}
		}
		const rowAndColumn = this.getRowAndColumnNeighbors(row,column);

		if (this.checkMoves(rowAndColumn[0])) {
			this.highlight(rowAndColumn[0]);
			return true;
		} else if (this.checkMoves(rowAndColumn[1])) {
			this.highlight(rowAndColumn[1]);
			return true;
		}
	},
	checkMoves(arr) {
		return this.squares[arr[0][0]][arr[0][1]].innerHTML === this.squares[arr[1][0]][arr[1][1]].innerHTML && 
		this.squares[arr[0][0]][arr[0][1]].innerHTML === this.squares[arr[2][0]][arr[2][1]].innerHTML;
	},
	// returns vertically/horizontally adjacent squares and their aligned neighbors 
	getRowAndColumnNeighbors(row,column) {
		let rowArray = [];
		let columnArray = [];
		for (let index = 0; index < 3; index++) {
			rowArray.push([row,index]);
			columnArray.push([index,column]);
		}
		return [rowArray,columnArray];
	},
	restartCurrentGame() {
		this.count = 9;
		this.squares = [];
		while (interface.body.children.length > 6) interface.body.removeChild(interface.body.lastChild);
		interface.initializeGame();
		if (machine.active && tic.turn === tic.playerOne) {
			setTimeout(() => machine.move(),1000);
		} else {
			this.turn = !this.turn; 
			interface.statusChange();
		}
	},
	highlight(arr) {
		if (Math.random() < 0.5) [arr[0][0],arr[0][1],arr[2][0],arr[2][1]] = [arr[2][0],arr[2][1],arr[0][0],arr[0][1]]; // randomizes start and finish
		line.cross(arr[0][0],arr[0][1],arr[2][0],arr[2][1]);
		arr.forEach((coordinates) => {
			this.squares[coordinates[0]][coordinates[1]].style.backgroundColor = (tic.turn) ? "#F55" : "#36F";
			this.squares[coordinates[0]][coordinates[1]].style.textShadow = (tic.turn) ? "-3px 2.5px 3px #36f" : "-3px 2.5px 3px #F55";
			this.squares[coordinates[0]][coordinates[1]].style.borderRadius = "50px";
		})
	}
}

const interface = {
	body: document.getElementById("tic-tac-toe-container"),
	contentContainer: document.getElementById("interface-container"),
	status: document.getElementById("status"),
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
	// called from index.html. takes html p element as argument
	options(input) {
		const arr = Array.from(this.contentContainer.children);
		if (tic.players === "none") {
			tic.players = (input.dataset.player === "true"); // true -> one false -> two
			if (!tic.players) machine.active = true; 
			arr.forEach((element,index) => interface.fadeReplace(element, (tic.players) ? interface.textSets.second.two[index] : interface.textSets.second.one[index]));
			this.buttons.restartAll.style.display = "initial";
			setTimeout(()=>this.buttons.restartAll.style.opacity = 1);
		} else {
			tic.playerOne = (input.dataset.player === "true");
			tic.turn = (input.dataset.player === "true");
			arr.forEach((element) => interface.fadeReplace(element, ""));
			interface.initializeGame();
		}
	},
	initializeGame() {
		Object.entries(this.buttons).forEach((button) => {
			button[1].style.display = "initial"; 
			setTimeout(()=>button[1].style.opacity = 1);
		});
		this.contentContainer.style.display = "none";
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
		this.statusChange();
	},
	restartAll() {
		tic.squares = [];
		tic.turn = null;
		tic.active = true;
		tic.players = "none";
		tic.count = 9;
		machine.active = false;
		this.status.innerHTML = "";
		this.contentContainer.style.display = 'flex';
		this.body.style.color = "#444";
		while (this.body.children.length > 6) this.body.removeChild(this.body.lastChild);
		Object.entries(this.buttons).forEach((button) => button[1].style.display = "none");
		Array.from(this.contentContainer.children).forEach( (element,index) => interface.fadeReplace(element, interface.textSets.first[index]));
	},
	fadeReplace(tag, txt) {
		tag.style.opacity = 0;
		setTimeout(function() {
			tag.innerText = txt;
			tag.style.opacity = 1;
		}, 500);
	},
	statusChange() { // true => O, false => X same with playerOne
		this.status.innerHTML = (tic.turn === tic.playerOne) ? "Player One's Turn" : (machine.active) ? "Computer's Turn" : "Player Two's Turn";
	},
	click(square, cont = true) {
		if (!square.innerHTML && tic.active) {
			square.classList.remove("pointer");
			square.classList.add("depth");
			square.innerText = (tic.turn) ? "O" : "X";
			tic.count--;
			if (tic.checkWin(tic.getRowAndColumn(square))) {
				tic.active = false;
				this.status.innerHTML = (tic.turn === tic.playerOne) ? "Player One Wins!" : (machine.active) ? "Computer Wins!" : "Player Two Wins!";
				setTimeout(() => {
					this.status.innerHTML = (tic.turn === tic.playerOne) ? (machine.active) ? "Computer's Turn" : "Player Two's Turn" : "Player One's Turn";
					tic.active = true;
					line.clear();
					tic.restartCurrentGame();
				}, 3000);
			} else if (tic.count === 0) {
				tic.active = false;
				this.status.innerHTML = "Cat Wins!";
				setTimeout(() => {
					this.status.innerHTML = (tic.turn === tic.playerOne) ? (machine.active) ? "Computer's Turn" : "Player Two's Turn" : "Player One's Turn";
					tic.active = true;
					tic.restartCurrentGame();
				}, 3000);
			} else {
				(machine.active && cont) ? machine.move() : (
					tic.turn = !tic.turn,
					this.statusChange()
				);
			}
		}
	}
};

const machine = {
	active: false,
	move() {
		tic.turn = !tic.turn;
		interface.statusChange();
		setTimeout(()=>this.analyze(),1000);
	},
	analyze() {
		const squArray = [];
		tic.squares.forEach((row) => {
			row.forEach((square) => {
				if (!square.innerHTML) squArray.push([square, this.priority(tic.getRowAndColumn(square))]);
			});
		});
		console.log("Squarray: " + squArray);
		Array.from(squArray.sort((a,b) => b[1] - a[1])).forEach((sq) => {
			console.log(sq[0].id,sq[1],"");
		});
		if (squArray.length < 9) {
			const choiceArray = [];
			squArray.sort((a,b) => b[1] - a[1]).forEach((pair, index) => { 
				(!choiceArray.length) ? choiceArray.push(pair) 
				: (choiceArray[choiceArray.length-1][1] == pair[1]) ? choiceArray.push(pair):null
			});
			const best = choiceArray[Math.floor(Math.random() * choiceArray.length)][0];
			interface.click(best,false);
		} else {
			interface.click(squArray[Math.floor(Math.random() * 9)][0], false);
		}
	},
	priority(coordinatesArray) {
		const row = coordinatesArray[0], column = coordinatesArray[1];
		let sum = 0;
		if ((row+column) % 2 === 0) { // square is a corner or middle
			if (row === column) 	sum += this.getPoints([[0,0],[1,1],[2,2]]);	// Major Diagonal
			if (row + column === 2) sum += this.getPoints([[2,0],[1,1],[0,2]]);	// Minor Diagonal
			const letter = (tic.playerOne) ? "X" : "O";
			if (tic.count === 6 && (row+column != 2 || row != 1|| column != 1) && tic.squares[1][1].innerHTML == letter) sum -= 1.5;
		}
		const rowAndColumn = tic.getRowAndColumnNeighbors(row,column);
		sum += this.getPoints(rowAndColumn[0]);
		sum += this.getPoints(rowAndColumn[1]);
		return sum;
	},
	getPoints(arr) {
		let points = 0;
		const profile = arr.reduce(function(obj, innerArr) {
			if (tic.squares[innerArr[0]][innerArr[1]].innerHTML != "") obj[tic.squares[innerArr[0]][innerArr[1]].innerHTML]++;
			return obj;
		}, { "X" : 0, "O" : 0 });
		if (profile["X"] === profile["O"]) { // three empty or unmatching pair
			if (profile["X"] === 0) points = 0.5;
		} else { // one or matching pair
			if (tic.turn) { // "O"
				if (profile["O"] > 0) {
					(profile["O"] === 2) ? points = 6.5 : points = 2.5;
				} else {
					(profile["X"] === 2) ? points = 4 : points = 1;
				}
			} else { // "X"
				if (profile["X"] > 0) {
					(profile["X"] === 2) ? points = 6.5 : points = 2.5;
				} else {
					(profile["O"] === 2) ? points = 4 : points = 1;
				}
			}
		}
		return points;
	}
};

line.context.fillStyle = '#111';