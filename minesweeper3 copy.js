let boxArr = [];
let gameSize = 10;
let bombs = 8;
let firstClick;
const cXY = [[1, -1], [1, 0], [1, 1], [0, 1],
			[0, -1], [-1, -1], [-1, 0], [-1, 1]];

//checks all 8 sides to see if others are 0


const clickedZero = (x, y, i=0, dx, dy) => {
	while (i < 8) {
		dx = x + cXY[i][0];
		dy = y + cXY[i][1];
		if (boxArr[dx] && boxArr[dx][dy]) //if its 0 and unselected
			if (!boxArr[dx][dy].num && !boxArr[dx][dy].selected())
	 			boxArr[dx][dy].click();
		i++;
	}
}

/*const clickedZero = (x, y) => {
	cXY.forEach((e) => {
		const dx = x + e[0];
		const dy = y + e[1];
		if (boxArr[dx] && boxArr[dx][dy]) //if its 0 and unselected
			if (!boxArr[dx][dy].num && !boxArr[dx][dy].selected())
	 			boxArr[dx][dy].click();
	});
}*/

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

/*const toggleClicks = (b, x=0, y=0) => {
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
}*/
	

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
