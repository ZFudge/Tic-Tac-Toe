const tic = {
	squares: [],
	turn: null, // true -> X false -> O
	active: true,
	players: "none",// true -> 1, false -> 2
	playerOne: null,
	getRowAndColumn: (square) => [parseInt(square.dataset.coordinates[0]),parseInt(square.dataset.coordinates[1])],
	checkWin(coordinates) {
		const row = coordinates[0];
		const column = coordinates[1];
		if ((row + column) % 2 === 0) { // square is a corner or middle
			if (row === column) 	if (this.checkMoves([[0,0],[1,1],[2,2]])) return true; // Major Diagonal
			if (row + column === 2) if (this.checkMoves([[2,0],[1,1],[0,2]])) return true; // Minor Diagonal
		}
		const rowAndColumn = this.getRowAndColumnNeighbors(row,column);
		return this.checkMoves(rowAndColumn[0]) || this.checkMoves(rowAndColumn[1]);
	},
	draw() {
		for (let i = 0; i < 3; i++)  
			for (let j = 0; j < 3; j++) 
				if (this.squares[i][j].innerHTML === "") return false;
		return true;
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
		this.squares.forEach((arr) => arr.forEach((square) => {
			if (square.innerText) {
				square.innerText = "";
				square.classList.remove("depth");
				square.classList.add("pointer");
			}
		}));
		interface.statusChange();
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
		if (!tic.squares.length) {
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
		}
	},
	restartAll() {
		tic.squares = [];
		tic.turn = null;
		tic.active = true;
		tic.players = "none";
		machine.active = false;
		this.status.innerHTML = "";
		this.contentContainer.style.display = 'flex';
		this.body.style.color = "#444";
		while (this.body.children.length > 5) this.body.removeChild(this.body.lastChild);
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
	click(square) {
		if (!square.innerHTML && tic.active) {
			square.classList.remove("pointer");
			square.classList.add("depth");
			square.innerText = (tic.turn) ? "O" : "X";
			if (tic.checkWin(tic.getRowAndColumn(square))) {
				tic.active = false;
				this.status.innerHTML = (tic.turn === tic.playerOne) ? "Player One Wins!" : (machine.active) ? "Computer Wins!" : "Player Two Wins!";
				setTimeout(() => {
					this.status.innerHTML = "";
					tic.active = true;
					tic.turn = !tic.turn;
					tic.restartCurrentGame();
				}, 3000);
			} else if (tic.draw()) {
				tic.active = false;
				this.status.innerHTML = "Cat Wins!";
				setTimeout(() => {
					this.status.innerHTML = "";
					tic.active = true;
					tic.turn = !tic.turn;
					tic.restartCurrentGame();
				}, 3000);
			} else {
				(machine.active) ? machine.move() : (
					tic.turn = !tic.turn,
					this.statusChange());
			}
		}
	}
};

const machine = {
	active: false,
	move() {
		tic.turn = !tic.turn;
		interface.statusChange();
		this.analyze();
	},
	analyze() {
		console.log('Analyze');
		const squArray = [];
		tic.squares.forEach((row) => {
			row.forEach((square) => {
				if (!square.innerHTML) {
					squArray.push([square, this.priority(tic.getRowAndColumn(square))]);
				}
			});
		});
		console.log("Squarray: " + squArray);
		loop = squArray;
		/* choose move 
		squArray.sort(function(a,b){
			return a[1] - b[1];
		});
		let best = squArray;
		interface.click(best);
		
		*/
	},
	priority(coordinatesArray) {
		const row = coordinatesArray[0], column = coordinatesArray[1];
		let sum = 0;

		if ((row+column) % 2 === 0) { // square is a corner or middle
			if (row === column) 	sum += this.getPoints([[0,0],[1,1],[2,2]]);//if (this.getPoints() return true; // Major Diagonal
			if (row + column === 2) sum += this.getPoints([[2,0],[1,1],[0,2]]);//if (this.getPoints() return true; // Minor Diagonal
		}

		const rowAndColumn = tic.getRowAndColumnNeighbors(row,column);

		sum += this.getPoints(rowAndColumn[0]);
		sum += this.getPoints(rowAndColumn[1]);

		console.log("sum: " + sum);
		return sum;
	},
	getPoints(arr) {
		let points = 0;
		
		const profile = arr.reduce(function(obj, innerArr) {
			if (tic.squares[innerArr[0]][innerArr[1]].innerHTML != "") {
				obj[tic.squares[innerArr[0]][innerArr[1]].innerHTML]++;
			}
			return obj;
		}, { "X" : 0, "O" : 0 });

		if (profile["X"] === profile["O"]) { // three empty or unmatching pair
			if (profile["X"] === 0) points = 0.5;
		} else { // one or matching pair
			if (tic.turn) { // "O"
				if (profile["O"] > 0) {
					(profile["O"] === 2) ? points = 2.5 : points = 1.5;
				} else {
					(profile["X"] === 2) ? points = 2 : points = 1;
				}
			} else { // "X"
				if (profile["X"] > 0) {
					(profile["X"] === 2) ? points = 2.5 : points = 1.5;
				} else {
					(profile["O"] === 2) ? points = 2 : points = 1;
				}
			}
		}
		console.log("Points: " + points);
		return points;
		// if (tic.squares[arr[0][0]][arr[0][1]].innerHTML === "O") {} else if (tic.squares[arr[0][0]][arr[0][1]].innerHTML === "X") {}
	}
};

/* 
	two of same			2.5
	two of different	2
	one of same			1.5
	one of different	1
	less than three*		0.5
*empty

3 	1.5 "O"
2  	1.5	1.5
"x"	2	3

2	1	2
1.5	2.5	1
"O"	1.5 2
  */