let boxArr = [];
let gameSize = 10;
let bombs = 8;
let firstClick;
let win = 0;
let notReveal = true;
const cXY = [[1, -1], [1, 0], [1, 1], [0, 1],
			[0, -1], [-1, -1], [-1, 0], [-1, 1]];

//[gamesize, bombs]
const levels = {
	noob: [10, 8],
	beginner: [12, 14],
	impossibru: [25, 500]
}
//checks all 8 sides to see if others are 0
const clickedZero = (x, y, i=0, d) => {
	if (i === 8) return ;	//if the box exists
	const dx = x + cXY[i][0];
	const dy = y + cXY[i][1]
	if (boxArr[dx] && boxArr[dx][dy]) //if its 0 and unselected
		if ((boxArr[dx][dy].num !== "bomb") && !boxArr[dx][dy].selected())
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
	notReveal = true;
	win = 0;
}

const toggleClicks = (b, x=0, y=0) => {
	if (x === boxArr.length) return ;
	if (y === boxArr.length) return toggleClicks(b, x + 1);
	boxArr[x][y].clickSwitch(b);
	toggleClicks(b, x, y + 1);
}

const revealAll = (x=0, y=0) => {
	if (x === boxArr.length) return ;
	if (y === boxArr.length) return revealAll(x + 1);
	boxArr[x][y].click();
	revealAll(x, y + 1);
}

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
		if (this.num === "bomb" && (notReveal)) { 
			win--; //incase there is only 1 number and 1 bomb left
			alert("BAHAHAHHAH U HAVE LOST. U CAN TRY AGAIN OR RAGEQUIT");
			insults.innerText = "HELLO U ARE A LOoO0oo0oSER HAHAHAHAHA";
			toggleClicks(false);
		}
		if (notReveal) win++;
		box.classList.add('selected');
		box.classList.remove('flagged');
		box.innerHTML = this.num ? this.num : '';
		if (!this.num && (this.num !== "bomb")) clickedZero(x, y);
		if (win === (gameSize**2 - bombs)) {
			alert("YOU WIN!");
			insults.innerText = "U ARE STILL A LOSER"
			notReveal = false;
			win = 0;
			revealAll();
		}
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

const restart = (bool, level) => {
	container.innerHTML = '';
	boxArr = [];
	if (bool) {
		gameSize = level[0];
		bombs = level[1];
	}
	else {
		gameSize = Number(boxChange.value) || gameSize;
 		bombs = Number(bombChange.value) || bombs;
	}
	boxChange.value = '';
	bombChange.value = '';		
	start();
}

reveal.addEventListener('click', () => {
	if (win !== (gameSize**2 - bombs))
		insults.innerText = "LOL CHEATER HAHAHAHAH";
	notReveal = false;
 	revealAll();
 });


replay.addEventListener('click', () => {
	if (invalidInputs()) return alert("INVALID INPUT DETECTED, FIX PLZ >:(");
	insults.innerText = "mhmmm"
	restart(false);
});


noob.addEventListener('click', () => restart(true, levels.noob));

beginner.addEventListener('click', () => restart(true, levels.beginner));

impossibru.addEventListener('click', () => restart(true, levels.impossibru));

start();
