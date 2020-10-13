/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */
function makeBoard() {
	for (let y = 0; y < HEIGHT; y++) {
		board[y] = [];
		for (let x = 0; x < WIDTH; x++) {
			board[y].push(null);
		}
	}
	return board;
}

/** makeHtmlBoard: make HTML table and row of column tops. */
function makeHtmlBoard() {
	// get "htmlBoard" variable from the item in HTML w/ID of "board"
	const htmlBoard = document.getElementById('board');

	// Create top table row element, set id, add click event listener
	const top = document.createElement('tr');
	top.setAttribute('id', 'column-top');
	top.addEventListener('click', handleClick);

	// Create 7 td's, give each id-x, where x corresponds to index. Append td's to tr, append tr to html board
	for (let x = 0; x < WIDTH; x++) {
		const headCell = document.createElement('td');
		headCell.setAttribute('id', x);
		top.append(headCell);
	}
	htmlBoard.append(top);

	// Add 7 td's, give each id of y-x, where y is the row index and x is the column index. Append to tr. Repeat 6 times, appending each row to html board.
	for (let y = 0; y < HEIGHT; y++) {
		const row = document.createElement('tr');
		// row.classList.add('yellow');
		for (let x = 0; x < WIDTH; x++) {
			const newTd = document.createElement('td');
			newTd.setAttribute('id', `${y}-${x}`);
			row.append(newTd);
		}
		htmlBoard.append(row);
	}
}

/** findSpotForCol: given column x, return top empty y (null if filled) */
function findSpotForCol(x) {
	//  beginning at the bottom of the game...
	for (let y = HEIGHT - 1; y >= 0; y--) {
		// If there is a value AND the column is full, return null
		// Else if, there is a value, take no action and proceed up the board.
		// Else, (the value is null), return y
		/////// Does the previous line need to be an else if (!board[y][x]) followed by an empty else?

		if (board[y][x] && y === 0) {
			return null;
		} else if (board[y][x]) {
		} else {
			return y;
		}
	}
}

/** placeInTable: update DOM to place piece into HTML table of board */
function placeInTable(y, x) {
	// create a div and insert into correct table cell
	const pieceDiv = document.createElement('div');
	pieceDiv.classList.add('piece', `p${currPlayer}`);

	const cell = document.getElementById(`${y}-${x}`);
	cell.append(pieceDiv);
}

/** endGame: announce game end */
function endGame(msg) {
	alert(msg);
}

/** handleClick: handle click of column top to play piece */
function handleClick(evt) {
	// get x from ID of clicked cell
	///////////// WHAT DOES THE + DO?
	const x = +evt.target.id;

	// get next spot in column (if none, ignore click)
	const y = findSpotForCol(x);
	if (y === null) {
		return;
	}

	// place piece in board and add to HTML table
	placeInTable(y, x);

	// update in-memory board
	board[y][x] = currPlayer;

	// check for win
	if (checkForWin()) {
		return endGame(`Player ${currPlayer} won!`);
	}

	// check if all cells in board are filled; if so, call endGame
	//// why not just check to see if the top row is filled? Why check all cells?
	if (!board[0].includes(null)) {
		return endGame(
			'Q: What do your shoes and this game have in common? A: They are both tied.  Well...at least this game is tied!'
		);
	}

	// switch currPlayer 1 <-> 2
	currPlayer === 1 ? (currPlayer = 2) : (currPlayer = 1);
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */
function checkForWin() {
	function _win(cells) {
		// Check four cells to see if they're all color of current player
		//  - cells: list of four (y, x) cells
		//  - returns true if all are legal coordinates & all match currPlayer

		return cells.every(([ y, x ]) => y >= 0 && y < HEIGHT && x >= 0 && x < WIDTH && board[y][x] === currPlayer);
	}

	// TODO: read and understand this code. Add comments to help you.
	for (let y = 0; y < HEIGHT; y++) {
		for (let x = 0; x < WIDTH; x++) {
			const horiz = [ [ y, x ], [ y, x + 1 ], [ y, x + 2 ], [ y, x + 3 ] ];
			const vert = [ [ y, x ], [ y + 1, x ], [ y + 2, x ], [ y + 3, x ] ];
			const diagDR = [ [ y, x ], [ y + 1, x + 1 ], [ y + 2, x + 2 ], [ y + 3, x + 3 ] ];
			const diagDL = [ [ y, x ], [ y + 1, x - 1 ], [ y + 2, x - 2 ], [ y + 3, x - 3 ] ];

			if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
				return true;
			}
		}
	}
}

makeBoard();
makeHtmlBoard();
