const cells = document.querySelectorAll('.cell');
const wonTitle = document.querySelector('.won-title');
const wonMessage = document.querySelector('.won-message');

const restartBtn = document.querySelector('.restart-btn');
restartBtn.addEventListener('click', restartGame);

let movesArray = [];
let nextMovesArray = [];
let counter = 0;

const fieldOfCells = document.querySelector('.field');
fieldOfCells.addEventListener('click', detectTarget);

const undoBtn = document.querySelector('.undo-btn');
undoBtn.addEventListener('click', undoMove);

const redoBtn = document.querySelector('.redo-btn');
redoBtn.addEventListener('click', redoMove);

function detectTarget() {
	let element = event.target;
	if (element.className == 'cell' && wonTitle.className == 'won-title hidden') {
		makeMove(element);
	}

}

function makeMove(element) {

	movesArray.push({id: element.dataset.id, class: ''});
	
	undoBtn.removeAttribute('disabled');
	
	if (movesArray.length % 2 == 0) {
		element.classList.add('r');
		movesArray[movesArray.length - 1].class = 'r';
	} else {
		element.classList.add('ch');
		movesArray[movesArray.length - 1].class = 'ch';
	}

	nextMovesArray = [];
	redoBtn.setAttribute('disabled', '');

	let isItDraw = false;
	// Решение с "ничьей" мне не понравилось, но не смогла придумать ничего лучше.
	// Хотела использовать метод every, но NodeList - не массив.
	cells.forEach((elem) => {
		if (elem.className !== 'cell') {
			counter++;
		}	
	})

	if (counter == 9) isItDraw = true;

	counter = 0;

	if (isItDraw) {
		wonTitle.classList.remove('hidden');
		wonMessage.innerText = "It's a draw!";
		undoBtn.setAttribute('disabled', '');
		redoBtn.setAttribute('disabled', '');
	}

	checkWinner();

}

// Еще вероятно функции undoMove() и redoMove() можно объединить в одну,
// но не стала, чтоб код был более читаемым

function undoMove() {

	let lastMove = movesArray.pop();

	nextMovesArray.push(lastMove);

	redoBtn.removeAttribute('disabled');

	let id = 'c-' + lastMove.id;
	element = document.querySelector(`#${id}`);

	element.classList.remove(lastMove.class);

	if (movesArray.length == 0) {
		undoBtn.setAttribute('disabled', '');
		redoBtn.setAttribute('disabled', '');
	};

}

function redoMove() {
	let lastMove = nextMovesArray.pop();

	movesArray.push(lastMove);

	undoBtn.removeAttribute('disabled');

	let id = 'c-' + lastMove.id;
	element = document.querySelector(`#${id}`);

	element.classList.add(lastMove.class);
	
	if (nextMovesArray.length == 0) redoBtn.setAttribute('disabled', '');

}

function checkWinner() {
	const rows = [[0,1,2], [3,4,5], [6,7,8]];
	const verticals = [[0,3,6], [1,4,7], [2,5,8]];
	const diagonalRight = [[0,4,8]];
	const diagonalLeft = [[6,4,2]];

	const arrOfWinLines =[rows, verticals, diagonalRight, diagonalLeft];
	arrOfWinLines.forEach((arr) => callWinner(arr));
	
	function callWinner(arr) {

		arr.forEach((array) => {
			if (cells[array[0]].className == cells[array[1]].className && 
				cells[array[0]].className == cells[array[2]].className &&
				cells[array[0]].className !== 'cell') {

				let winArray = [cells[array[0]], cells[array[1]], cells[array[2]]];

				switch (arr) {
					case rows: winArray.forEach((cell) => {
									cell.classList.add('win','horizontal');
								});
								break;
					case verticals: winArray.forEach((cell) => {
									cell.classList.add('win','vertical');
								});
								break;
					case diagonalRight: winArray.forEach((cell) => {
									cell.classList.add('win','diagonal-right');
								});
								break;
					default: winArray.forEach((cell) => {
									cell.classList.add('win','diagonal-left');
								});
				}

				wonTitle.classList.remove('hidden');

				if (cells[array[0]].className.indexOf('ch') == -1) {
					wonMessage.innerText = 'Toes won!'
				}	else {
					wonMessage.innerText = 'Crosses won!'
				}

				undoBtn.setAttribute('disabled', '');
				redoBtn.setAttribute('disabled', '');
			}
		})
	}

}

function restartGame() {

	movesArray = [];
	nextMovesArray = [];

	cells.forEach((elem) => {
		elem.setAttribute('class', 'cell');
	});

	wonTitle.classList.add('hidden');
	
}