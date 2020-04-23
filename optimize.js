let boxArr = [];
let gameSize = 10;
let bombs = 8;
let firstClick;
let tmpArr = [];
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
//ideas...
//use global bit masking
//structure code such that only a stack frame is used at a time
//put a tracker on, so that i know when a function is done..?
//maybe try local tmparr
//maybe think of how stack/queue could somehow help???
//push things to a global hashmap?

const runZeros = (i=0) => {
	while (i < tmpArr.length) {
		if (!boxArr[tmpArr[i][0]][tmpArr[i][1]].selected())
			boxArr[tmpArr[i][0]][tmpArr[i][1]].click();
		i++;
	}
}


const clickedZero = (x, y, i=0, dx, dy) => {
	while (i < 8) {
		dx = x + cXY[i][0];
		dy = y + cXY[i][1];
		if (boxArr[dx] && boxArr[dx][dy]) //if its 0 and unselected
			if (!boxArr[dx][dy].num && !boxArr[dx][dy].selected())
	 			tmpArr.push([dx, dy]);
		i++;
	}	
}

const rand = () => Math.floor(Math.random() * gameSize)

const bombNum = (x, y, i=0, n=0, dx, dy) => {
	while (i < 8) {
		dx = x + cXY[i][0]
		dy = y + cXY[i][1];
		if (boxArr[dx] && boxArr[dx][dy] && (boxArr[dx][dy].num === "bomb")) n++;
		i++;
	}
	return n;
}

const assignNums = (x=0, y=0) => {
	while (x < boxArr.length) {
		y = 0;
		while (y < boxArr.length) {
			if (!boxArr[x][y].num) boxArr[x][y].num = bombNum(x, y);
				y++; 
		}
		x++;
	}
}

const assignBombs = (x1, y1, size=bombs, x, y) => {
	while (size) {
		x = rand();
		y = rand();
		if ((x !== x1) && (y !== y1)) {
			if (!boxArr[x][y].num) {
				boxArr[x][y].num = "bomb";
				size--;
			}
		}
	}
}
	
const build = (x=0, y=0) => {
	while (x < gameSize) {
		boxArr.push([]);
		y = 0;
		while (y < gameSize) {
			boxArr[x].push(new Box(x, y));
			y++;
		}
		x++;	
	}
}

const start = () => {
	container.style.width = `${gameSize * 50}` + `px`;
	build();
	toggleClicks(true);
	firstClick = true;
	notReveal = true;
	win = 0;
}

const toggleClicks = (b, x=0, y) => {
	while (x < boxArr.length) {
		y = 0;
		while (y < boxArr.length) {
			boxArr[x][y].clickSwitch(b);
			y++;
		}
		x++;
	}
}


const revealAll = (x=0, y) => {
	while (x < boxArr.length) {
		y = 0;
		while (y < boxArr.length) {
			boxArr[x][y].click();
			y++;
		}
		x++;
	}
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
		if (!this.num && (this.num !== "bomb")) {
			clickedZero(x, y); 
			//maybe put tracker for stack problem
				if (tmpArr[0] !== undefined) {
					runZeros();	
					tmpArr = [];
				}
		}
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
	if (!Number.isInteger(box) || !Number.isInteger(bomb))
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
	if (!win) insults.innerText = "LOL CHEATER HAHAHAHAH";
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
