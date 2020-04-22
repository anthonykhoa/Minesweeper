let boxArr = [];
let gameSize = 10;
let bombs = 8;
let firstClick;
const cXY = [[1, -1], [1, 0], [1, 1], [0, 1],
			[0, -1], [-1, -1], [-1, 0], [-1, 1]];

//checks all 8 sides to see if others are 0
const clickedZero = (x, y, i=0, d) => {
	if (i === 8) return ;	//if the box exists
	const dx = x + cXY[i][0];
	const dy = y + cXY[i][1]
	if (boxArr[dx] && boxArr[dx][dy]) //if its 0 and unselected
		if (!boxArr[dx][dy].num && !boxArr[dx][dy].selected())
	 		boxArr[dx][dy].click();
	return clickedZero(x, y, i + 1);
}


const rand = () => Math.floor(Math.random() * gameSize)

//returns total # of bombs around a box
const bombNum = (x, y, i=0, n=0) => {
	if (i === 8) return n;
	const dx = x + cXY[i][0]
	const dy = y + cXY[i][1];
	if (boxArr[dx] && boxArr[dx][dy] && (boxArr[dx][dy].num === "bomb")) n++;
	return bombNum(x, y, i + 1, n);
}

const assignNums = (x=0, y=0) => {
	if (x === boxArr.length) return ;
	if (y === boxArr.length) return assignNums(x + 1);
	if (!boxArr[x][y].num) boxArr[x][y].num = bombNum(x, y); 
	assignNums(x, y + 1);
}
	
// x1/y1=init_click_coords, checks to make sure we dont place bomb there
const assignBombs = (x1, y1, size=bombs, x=rand(), y=rand()) => {
	if (!size) return ;
	if ((x === x1) && (y === y1)) return assignBombs(x1, y1, size);
	if (!boxArr[x][y].num) {
		boxArr[x][y].num = "bomb";
		return assignBombs(x1, y1, size - 1);
	}
	assignBombs(x1, y1, size);
}

const build = (x=0, y=0, row=[]) => {
	if (x === gameSize) return ;
	if (y === gameSize) {
		boxArr.push(row);
		return build(x + 1);
	}
	row.push(new Box(x, y));
	build(x, y + 1, row);
}

const start = () => {
	container.style.width = `${gameSize * 50}` + `px`;
	build();
	toggleClicks(true);
	firstClick = true;
}

const toggleClicks = b => boxArr.forEach(r => r.forEach(c => c.clickSwitch(b)))

const revealAll = () => boxArr.forEach(r => r.forEach(c => c.click()))

function Box (x, y) {
	const box = document.createElement('div');
	box.className = 'box';
	container.appendChild(box);
	this.num = 0;
	this.clickSwitch = (b) => box.style.pointerEvents = b ? 'auto' : 'none';
	this.selected = () => box.className.includes('selected');
	this.flag = () => box.className.includes('flagged');
	box.oncontextmenu = (e) => {
		if (!this.flag()) box.classList.add('flagged');
		else box.classList.remove('flagged');
		e.preventDefault();
	}
	this.click = () => {
		if (firstClick) {
			assignBombs(x, y);
			assignNums();
			firstClick = false;
		}
		/*if (win) {
			alert("YOU WIN!");
			aftermath.innertext = 'YOU WON PURELY THRU LUCK!'
			return revealAll();
		}*/
	/*	if (this.num === "bomb") { //incase someone is noob at game
			alert("BAHAHAHHAH U HAVE LOST. U CAN TRY AGAIN OR RAGEQUIT");
			toggleClicks(false);
		}*/
		box.classList.add('selected');
		box.classList.remove('flagged');
		box.innerHTML = this.num ? this.num : '';
		if (!this.num) clickedZero(x, y); 
	}
	box.onclick = () => this.click();
}

const invalidInputs = () => {
	const box = Number(boxChange.value);
	const bomb = Number(bombChange.value);
	if (isNaN(box) || isNaN(bomb))
		return true;
	if (bomb && box && (bomb >= (box ** 2))) return true;
	return false;
}

//MAKE THE TEXT POSITION GOOD FIRST
reveal.addEventListener('click', () => revealAll());

replay.addEventListener('click', () => {
	if (invalidInputs()) return alert("INVALID INPUT DETECTED, FIX PLZ");
	container.innerHTML = '';
	boxArr = [];
	gameSize = Number(boxChange.value) || gameSize;
	bombs = Number(bombChange.value) || bombs;
	boxChange.value = '';
	bombChange.value = '';		
	start();
})

start();
