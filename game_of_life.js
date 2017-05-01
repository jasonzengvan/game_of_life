angular
.module('gameOfLife', [])
.controller('GameController', function($interval) {

	var N = 50;
	var TIMER = 50;

	var game = this;
	var stop;
	
	// board is a N x N matrix
	game.board = new Array(N);
	for (var i = 0; i < N; i++) {
		game.board[i] = new Array(N).fill(false);
	}

	// TODO: start auto stepping
	game.start = function() {
		if (angular.isDefined(stop)) return;

		stop = $interval(game.step, TIMER);
	};

	// TODO: stop auto stepping
	game.stop = function() {
		if (angular.isDefined(stop)) {
			$interval.cancel(stop);
			stop = undefined;
		}
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


				if ((nb == 2 && game.board[i][j])|| nb == 3) next[i][j] = true;
				else next[i][j] = false;
			}
		}

		game.board = next;

	};
});


