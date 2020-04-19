function Box (x, y) {
	console.log(`${x} + ${y}`);
}

let boxArr = [];
let gameSize = 3;
const makeBoxes = (x=0, y=0) => {
	if (x === gameSize) return
	boxArr[x].forEach(roww => row.push(new Box(x, y++)));
	makeBoxes(x + 1, y);
}

const start = () => {
	boxArr.length = gameSize;
	boxArr.fill([]);
	boxArr.forEach(
	makeBoxes();
}
start();
