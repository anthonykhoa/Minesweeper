let boxArr = [];
let gameSize = 5;
let bombs = 3;
let firstClick;
const xC = [1, 1, 1, 0, 0, -1, -1, -1]; 
const yC = [-1, 0, 1, -1, 1, -1, 0, 1];

//mark is used to mark value '0' boxes that have already been clicked
const checkClick = (x, y, i=0, dx=x+xC[i], dy=y+yC[i]) => {
	if (i === 8) return ;
	if (boxArr[dx] && boxArr[dx][dy] && !boxArr[dx][dy].mark) 
		!boxArr[dx][dy].num ? boxArr[dx][dy].click() : boxArr[dx][dy].select();
	return checkClick(x, y, i + 1);
}

const toggleClicks = b => boxArr.forEach(r => r.forEach(c => c.clickSwitch(b)))

const rand = () => Math.floor(Math.random() * gameSize)

//returns total # of bombs around a box
const bombNum = (x, y, i=0, n=0, dx=x+xC[i], dy=y+yC[i]) => {
	if (i === 8) return n;
	if (boxArr[dx] && boxArr[dx][dy] && (boxArr[dx][dy].num === "bomb")) n++;
	return bombNum(x, y, i + 1, n);
}

const assignNums = (x=0, y=0) => {
	if (x === boxArr.length) return ;
	if (y === boxArr.length) return assignNums(x + 1);
	if (!boxArr[x][y].num) boxArr[x][y].num = bombNum(x, y); 
	assignNums(x, y + 1);
}
	
// x1/y1=init click coords, checks to make sure we dont place bomb there
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

function Box (x, y) {
	const box = document.createElement('div');
	box.className = 'box';
	container.appendChild(box);
	this.num = 0;
	this.mark = false;
	this.clickSwitch = (b) => box.style.pointerEvents = b ? 'auto' : 'none';
	this.select = () => {
		box.classList.add('selected');
		this.mark = true;
		box.innerHTML = this.num ? this.num : '';
	}
	box.oncontextmenu = (e) => {
		box.classList.remove('flagged');
		e.preventDefault();
	}
	this.click = () => {
		if (firstClick) {
			assignBombs(x, y);
			assignNums();
			firstClick = false;
		}
	/*	if (this.num === "bomb") { //incase someone is noob at game
			alert("BAHAHAHHAH U HAVE LOST. U CAN TRY AGAIN OR RAGEQUIT");
			toggleClicks(false);
		}*/
		this.select();
		if (!this.num) checkClick(x, y); //checks if sides are 0 too
	}
	box.onclick = () => this.click();
}

start();
