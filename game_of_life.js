angular
.module('gameOfLife', [])
.controller('GameController', function() {
	var game = this;
	var N = 25;

	// board is a N x N matrix
	game.board = new Array(N);
	for (var i = 0; i < N; i++) {
		game.board[i] = new Array(N).fill(false);
	}
	for (var i = 8; i < 18; i++) game.board[13][i] = true;

	// TODO: start auto stepping
	game.start = function() {

	};

	// TODO: stop auto stepping
	game.stop = function() {

	};

	// reset the board to initial state
	game.clear = function() {
		game.board = new Array(N).fill(new Array(N).fill(false));
	};

	// change the boolean value of game.board[x][y]
	game.click = function(x, y) {
		game.board[x][y] = !game.board[x][y];
	};

	// TODO: step a single life emulation
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
				console.log("i = " + i + ", j = " + j + ", nb = " + nb);


				if ((nb == 2 && game.board[i][j])|| nb == 3) next[i][j] = true;
				else next[i][j] = false;
			}
		}

		game.board = next;

	};
});


