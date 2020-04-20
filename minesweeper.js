let boxArr = [];
let gameSize = 5;
let bombs = 3;
let firstClick = true;
const xC = [1, 1, 1, 0, 0, -1, -1, -1];
const yC = [-1, 0, 1, -1, 1, -1, 0, 1];

/*const checkClick = (x, y, i=0) => {
	if (i === 8) return ;
	if (boxArr[x + xC[i]][y + yC[i]])
		if (!boxArr[x + xC[i]][y + yC[i]].num)
			check(x + xC[i], y + yC[i])
			//check() something ehre
	check(x, y, i + 1);
}*/


const rand = () => Math.floor(Math.random() * gameSize);

const bombNum = (x, y, i=0, n=0, dx=x+xC[i], dy=y+yC[i]) => {
	if (i === 8) return n;
	if (boxArr[dx] && boxArr[dx][dy] && (boxArr[dx][dy].num === "bomb")) n++;
	return bombNum(x, y, i + 1, n);
}

const assignNums = (x=0, y=0) => {
	if (x === boxArr.length) return ;
	if (y === boxArr.length) return assignNums(x + 1);
	if (!boxArr[x][y].num) boxArr[x][y].num = bombNum(x, y); 
	return assignNums(x, y + 1);
}
	
const assignBombs = (x1, y1, size=bombs, x=rand(), y=rand()) => {
	if (!size) return ;
	if ((x === x1) && (y === y1)) return assignBombs(x1, y1, size);
	if (!boxArr[x][y].num) {
		boxArr[x][y].num = "bomb";
		return assignBombs(x1, y1, size - 1);
	}
	else return assignBombs(x1, y1, size);
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
}

function Box (x, y) {
	const box = document.createElement('div');
	box.className = 'box';
	container.appendChild(box);
	this.num = 0;
	box.oncontextmenu = (e) => {
		box.classList.remove('flagged');
		e.preventDefault();
	}
	box.onclick = () => {
		if (firstClick) {
			assignBombs(x, y);
			assignNums();
			firstClick = false;
		}
		box.classList.add('selected');
		box.innerHTML = this.num;
		checkClick(x, y);	
	}
}

start();
