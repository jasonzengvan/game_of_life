angular
.module('gameOfLife', [])
.controller('GameController', function($interval) {

	var game = this;
	var N = 50;
	var interval = 150;
	var stop;

	// board is a N x N matrix
	game.board = getEmptyBoard(N);

	// collection of known game patterns
	game.collection = [
		{
			name: "Empty",
			width: 0,
			height: 0,
			data: []
		},
		{
			name: "Glider",
			width: 3,
			height: 3,
			data: [[0, 2], [1, 0], [1, 2], [2, 1], [2, 2]]
		},
		{
			name: "10 Cell Row", 
			width: 10,
			height: 1,
			data: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [0, 9]]
		},
		{
			name: "Tumbler", 
			width: 7,
			height: 6,
			data: [[0, 0], [0, 1], [0, 5], [0, 6], [1, 0], [1, 2], [1, 4], [1, 6], [2, 0], [2, 2], [2, 4], [2, 6], [3, 2], [3, 4], [4, 1], [4, 2], [4, 4], [4, 5], [5, 1], [5, 2], [5, 4], [5, 5]]
		},
		{
			name: "4-8-12 Diamond", 
			width: 12,
			height: 9,
			data: [[0, 4], [0, 5], [0, 6], [0, 7], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [2, 7], [2, 8], [2, 9], [4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [4, 7], [4, 8], [4, 9], [4, 10], [4, 11], [6, 2], [6, 3], [6, 4], [6, 5], [6, 6], [6, 7], [6, 8], [6, 9], [8, 4], [8, 5], [8, 6], [8, 7]]
		}
	];
	game.selected = game.collection[0];
	game.isRunning = false;
	game.generations = 0;


	// start auto stepping
	game.start = function() {
		if (angular.isDefined(stop)) return;

		stop = $interval(game.step, interval);
		game.isRunning = true;
	};

	// stop auto stepping
	game.stop = function() {
		if (angular.isDefined(stop)) {
			$interval.cancel(stop);
			stop = undefined;
			game.isRunning = false;
		}
	};

	// reset the board to initial state
	game.clear = function() {
		game.stop();
		game.board = getEmptyBoard(N);
		game.generations = 0;
	};

	// select a pattern from collection
	game.select = function() {
		var pattern = game.selected;
		var x = Math.floor((N - pattern.width) / 2);
		var y = Math.floor((N - pattern.height) / 2);
		console.log(x+ " "+ y);
		game.clear();
		pattern.data.forEach(function(cell) {
			game.board[y + cell[0]][x + cell[1]] = true;
		});
		game.generations = 0;
	};

	// change the boolean value of game.board[x][y]
	game.click = function(x, y) {
		game.board[x][y] = !game.board[x][y];
		game.generations = 0;
	};


	// TODO: optimize the algorithm
	// step through a single life iteration
	// Rule 1: If a cell is populated it survives iff it has 2 or 3 neighbors.
	// Rule 2: If a cell is unpopulated it becomes populated iff it has 3 neighbors.
	game.step = function() {

		var next = new Array(N);
		for (var i = 0; i < N; i++) {
			next[i] = new Array(N).fill(false);
		}

		for (var i = 0; i < N; i++) {
			for (var j = 0; j < N; j++) {
				var nb = 0;
				if (i - 1 >= 0 && j - 1 >= 0 && game.board[i-1][j-1]) nb++;
				if (i - 1 >= 0 && game.board[i-1][j]) nb++;
				if (j - 1 >= 0 && game.board[i][j-1]) nb++;
				if (i + 1 < N && j - 1 >= 0 && game.board[i+1][j-1]) nb++;
				if (i + 1 < N && game.board[i+1][j]) nb++;
				if (i - 1 >= 0 && j + 1 < N && game.board[i-1][j+1]) nb++;
				if (j + 1 < N && game.board[i][j+1]) nb++;
				if (i + 1 < N && j + 1 < N && game.board[i+1][j+1]) nb++;


				if ((nb == 2 && game.board[i][j])|| nb == 3) next[i][j] = true;
				else next[i][j] = false;
			}
		}

		game.board = next;
		game.generations ++;
	};

	function getEmptyBoard(size) {
		var board = new Array(size);
		for (var i = 0; i < size; i++) {
			board[i] = new Array(size).fill(false);
		}
		return board;
	};
});


