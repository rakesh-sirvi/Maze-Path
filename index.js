const container = document.getElementById("container");
const answers = document.getElementById("answers");

// const matrix = [
//   [1, 0, 0, 0],
//   [1, 1, 0, 1],
//   [1, 1, 0, 0],
//   [0, 1, 1, 1],
// ];
const matrix = [
  [1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0],
  [1, 0, 1, 1, 1],
  [1, 0, 1, 0, 1],
  [1, 1, 1, 1, 1],
];

matrix.forEach((row) => {
  const rowDiv = document.createElement("div");
  rowDiv.className = "row";
  row.forEach((element) => {
    const div = document.createElement("div");
    div.className = "block";
    if (element === 0) {
      div.style.backgroundColor = "black";
    } else {
      div.style.backgroundColor = "white";
    }
    rowDiv.appendChild(div);
  });
  container.appendChild(rowDiv);
});

class Pair {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
async function wait(ms) {
  return new Promise((resolve) => setTimeout(() => resolve(), ms));
}

const rows = document.querySelectorAll("#container > .row");
const delay = 0.1;
async function mazeUtil(x, y, vis, temp, direction) {
  if (x == matrix.length - 1 && y == matrix[0].length - 1) {
    await displayAnswer(Array.from(temp));
  }
  const x_a = [-1, 0, 1, 0];
  const y_a = [0, 1, 0, -1];
  const dir = ["UP", "RIGHT", "DOWN", "LEFT"];
  for (let i = 0; i < 4; i++) {
    const n_x = x_a[i] + x;
    const n_y = y_a[i] + y;
    if (
      n_x >= 0 &&
      n_x < matrix.length &&
      n_y < matrix[0].length &&
      n_y >= 0 &&
      matrix[n_x][n_y] == 1 &&
      !vis[n_x][n_y]
    ) {
      vis[x][y] = true;
      rows[x].childNodes[y].style.backgroundColor = "skyblue";
      await wait(delay);
      temp.push({ point: new Pair(x, y), dir: dir[i] });
      await mazeUtil(n_x, n_y, vis, temp, dir[i]);
      await wait(delay);
      rows[x].childNodes[y].style.backgroundColor = "white";
      vis[x][y] = false;
      temp.pop();
    }
  }
}

async function solve() {
  let vis = [];
  for (let i = 0; i < matrix.length; i++) {
    let temp = [];
    for (let j = 0; j < matrix[0].length; j++) {
      temp.push(false);
    }
    vis.push(temp);
  }
  await mazeUtil(0, 0, vis, [], "");
}

document.getElementById("start").addEventListener("click", async (e) => {
  document.getElementById("counter").innerText = 0;
  answers.innerHTML = "";
  e.target.setAttribute("disabled", "");
  await solve();
  e.target.removeAttribute("disabled");
});

async function displayAnswer(temp) {
  document.getElementById("counter").innerText =
    parseInt(document.getElementById("counter").innerText) + 1;
  const answer = document.createElement("div");
  answer.className = "answer";
  matrix.forEach((row) => {
    const ansDiv = document.createElement("div");
    ansDiv.className = "row";
    row.forEach((element) => {
      const div = document.createElement("div");
      div.className = "block";
      if (element === 0) {
        div.style.backgroundColor = "black";
      } else {
        div.style.backgroundColor = "white";
      }
      ansDiv.appendChild(div);
    });
    answer.appendChild(ansDiv);
    answers.appendChild(answer);
  });
  console.log(temp);
  temp.forEach((pair, idx) => {
    const target = answer.children[pair.point.x].children[pair.point.y];
    const span = document.createElement("span");
    span.className = "dir";
    const dir = pair.dir;
    if (dir === "RIGHT") {
      span.style.transform = "rotate(-90deg)";
    } else if (dir === "LEFT") {
      span.style.transform = "rotate(90deg)";
    } else if (dir === "UP") {
      span.style.transform = "rotate(180deg)";
    }
    target.appendChild(span);
  });
}
