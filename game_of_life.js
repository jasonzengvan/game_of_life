angular
.module('gameOfLife', [])
.controller('GameController', function($interval) {

	var WIDTH = 50;
	var HEIGHT = 35;
	var INTERVAL = 150;

	var game = this;
	var stop;

	// board is a WIDTH x HEIGHT matrix
	game.board = getEmptyBoard(WIDTH, HEIGHT);

	// collection of known game patterns
	game.collection = [
		{
			name: "Empty",
			width: 0,
			height: 0,
			data: [],
			found_by: "N/A",
			found_in: "N/A",
			url: ""
		},
		{
			name: "Block",
			width: 2,
			height: 2,
			data: [[0, 0], [0, 1], [1, 0], [1, 1]],
			found_by: "John Conway",
			found_in: "1970",
			url: "http://www.conwaylife.com/wiki/Block"
		},
		{
			name: "Glider",
			width: 3,
			height: 3,
			data: [[0, 2], [1, 0], [1, 2], [2, 1], [2, 2]],
			found_by: "Richard K. Guy",
			found_in: "1970",
			url: "http://www.conwaylife.com/wiki/Glider"
		},
		{
			name: "Pentadecathlon", 
			width: 10,
			height: 1,
			data: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [0, 9]],
			found_by: "John Conway",
			found_in: "1970",
			url: "http://www.conwaylife.com/wiki/Pentadecathlon"
		},
		{
			name: "Tumbler", 
			width: 7,
			height: 6,
			data: [[0, 0], [0, 1], [0, 5], [0, 6], [1, 0], [1, 2], [1, 4], [1, 6], [2, 0], [2, 2], [2, 4], [2, 6], [3, 2], [3, 4], [4, 1], [4, 2], [4, 4], [4, 5], [5, 1], [5, 2], [5, 4], [5, 5]],
			found_by: "George Collins",
			found_in: "1970",
			url: "http://www.conwaylife.com/wiki/Tumbler"
		},
		{
			name: "4-8-12 Diamond", 
			width: 12,
			height: 9,
			data: [[0, 4], [0, 5], [0, 6], [0, 7], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [2, 7], [2, 8], [2, 9], [4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [4, 7], [4, 8], [4, 9], [4, 10], [4, 11], [6, 2], [6, 3], [6, 4], [6, 5], [6, 6], [6, 7], [6, 8], [6, 9], [8, 4], [8, 5], [8, 6], [8, 7]],
			found_by: "Honeywell group",
			found_in: "1971",
			url: "http://www.conwaylife.com/wiki/4-8-12_Diamond"
		},
		{
			name: "Queen Bee Shuttle",
			width: 22,
			height: 7,
			data: [[0, 9], [1, 7], [1, 9], [2, 6], [2, 8], [3, 0], [3, 1], [3, 5], [3, 8], [3, 20], [3, 21], [4, 0], [4, 1], [4, 6], [4, 8], [4, 20], [4, 21], [5, 7], [5, 9], [6, 9]],
			found_by: "Bill Gosper",
			found_in: "1970",
			url: "http://www.conwaylife.com/wiki/Queen_bee_shuttle"
		}
	];
	game.selected = game.collection[0];
	game.isRunning = false;
	game.generations = 0;


	// start auto stepping
	game.start = function() {
		if (angular.isDefined(stop)) return;

		stop = $interval(game.step, INTERVAL);
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

	// reset the board to empty
	game.clear = function() {
		game.stop();
		game.board = getEmptyBoard(WIDTH, HEIGHT);
		game.generations = 0;
	};

	// select a pattern from collection
	game.select = function() {
		var pattern = game.selected;
		var x = Math.floor((WIDTH - pattern.width) / 2);
		var y = Math.floor((HEIGHT - pattern.height) / 2);
		game.clear();
		pattern.data.forEach(function(cell) {
			game.board[y + cell[0]][x + cell[1]] = true;
		});
		game.generations = 0;
	};

	// reset the board to selected pattern
	game.reset = function() {
		game.clear();
		game.select();
	};

	// change the boolean value of game.board[x][y]
	game.click = function(x, y) {
		game.board[x][y] = !game.board[x][y];
		game.stop();
		game.generations = 0;
	};


	// TODO: optimize the algorithm
	// step through a single life iteration
	// Rule 1: If a cell is populated it survives iff it has 2 or 3 neighbors.
	// Rule 2: If a cell is unpopulated it becomes populated iff it has 3 neighbors.
	game.step = function() {

		var next = getEmptyBoard(WIDTH, HEIGHT);

		for (var i = 0; i < HEIGHT; i++) {
			for (var j = 0; j < WIDTH; j++) {
				var nb = 0;
				if (i - 1 >= 0 && j - 1 >= 0 && game.board[i-1][j-1]) nb++;
				if (i - 1 >= 0 && game.board[i-1][j]) nb++;
				if (j - 1 >= 0 && game.board[i][j-1]) nb++;
				if (i + 1 < HEIGHT && j - 1 >= 0 && game.board[i+1][j-1]) nb++;
				if (i + 1 < HEIGHT && game.board[i+1][j]) nb++;
				if (i - 1 >= 0 && j + 1 < WIDTH && game.board[i-1][j+1]) nb++;
				if (j + 1 < WIDTH && game.board[i][j+1]) nb++;
				if (i + 1 < HEIGHT && j + 1 < WIDTH && game.board[i+1][j+1]) nb++;


				if ((nb == 2 && game.board[i][j])|| nb == 3) next[i][j] = true;
				else next[i][j] = false;
			}
		}

		game.board = next;
		game.generations ++;
	};

	function getEmptyBoard(width, height) {
		var board = new Array(height);
		for (var i = 0; i < height; i++) {
			board[i] = new Array(width).fill(false);
		}
		return board;
	};
});


