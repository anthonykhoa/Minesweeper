let boxArr = [];
let gameSize = 10;
let bombs = 10;
const xC = [1, 1, 1, 0, 0, -1, -1, -1];
const yC = [-1, 0, 1, -1, 1, -1, 0, 1];

//set bombs first then assignnum
//if 0, need to turn select and do same check algo
//bomb will be number 10(a string named bomb)
//start algo again by calling boxarr[][].onclick()
//make func to add bombs and assign nums to each object
//first place bombs and then assign numbers
/*const checkClick = (x, y, i=0) => {
	if (i === 8) return ;
	if (boxArr[x + xC[i]][y + yC[i]])
		if (!boxArr[x + xC[i]][y + yC[i]].num)
			check(x + xC[i], y + yC[i])
			//check() something ehre
	check(x, y, i + 1);
}*/


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
		box.classList.add('selected');
		box.innerHTML = this.num;
		//checkClick(x, y);	
	}
}

const rand = () => Math.floor(Math.random() * gameSize);

const bombNum = (x, y, i=0, n=0) => {
	if (i === 8) return n;
	const dx = x + xC[i];
	const dy = y + yC[i];
	if (boxArr[dx] && boxArr[dx][dy] && (boxArr[dx][dy].num === "bomb")) {
		n++;
		console.log(n);
	}
	return bombNum(x, y, i + 1, n);
}

const assignNums = (x=0, y=0) => {
	if (x === boxArr.length) return ;
	if (y === boxArr.length) return assignNums(x + 1);
	if (!boxArr[x][y].num) boxArr[x][y].num = bombNum(x, y); 
	return assignNums(x, y + 1);
}
	
const assignBombs = (size=bombs) => {
	if (!size) return ;
	x = rand();
	y = rand();
	if (!boxArr[x][y].num) {
		boxArr[x][y].num = "bomb";
		return assignBombs(size - 1);
	}
	else return assignBombs(size);
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
	build();
	container.style.width = `${gameSize * 50}` + `px`;
	assignBombs();
	assignNums();
}

start();
