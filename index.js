const container = document.getElementById("container");
const rows_input = document.getElementById("rows");
const cols_input = document.getElementById("cols");
const generate_button = document.getElementById("generate");
let rows = (rows_input.value = 4);
let cols = (cols_input.value = 4);
let block_size = 60;
let Matrix = [];
container.style.width = `${cols * block_size}px`;
container.style.height = `${rows * block_size}px`;

function matrixGenerate(row, col) {
  Matrix = Array.from(
    {
      length: row,
    },
    () =>
      Array.from(
        {
          length: col,
        },
        () => 1
      )
  );
  container.innerHTML = "";
  container.style.width = `${col * block_size}px`;
  container.style.height = `${row * block_size}px`;
  for (let i = 0; i < row; i++) {
    const row = document.createElement("div");
    row.className = "row";
    row.style.width = "100%";
    row.style.height = `${block_size}px`;
    for (let j = 0; j < col; j++) {
      const ele = document.createElement("div");
      ele.className = "block";
      ele.style.width = `${block_size}px`;
      ele.style.height = `${block_size}px`;
      ele.setAttribute("data-row", i);
      ele.setAttribute("data-col", j);
      row.appendChild(ele);
    }
    container.appendChild(row);
  }
}
matrixGenerate(rows, cols);
container.addEventListener("click", (e) => {
  console.log("click", e.target);
  let row = e.target.getAttribute("data-row");
  let col = e.target.getAttribute("data-col");
  if ((row == 0 && col == 0) || (row == rows - 1 && col == cols - 1)) return;
  if (
    !e.target.style.backgroundColor ||
    e.target.style.backgroundColor == "white"
  ) {
    e.target.style.backgroundColor = "black";
    Matrix[row][col] = 0;
  } else {
    e.target.style.backgroundColor = null;
    Matrix[row][col] = 1;
  }
});
rows_input.addEventListener("input", (e) => {
  let val = e.target.value;
  if (val.length == 1) rows = val;
  else {
    e.target.value = val.slice(0, 1);
    rows = val.slice(0, 1);
  }
});
rows_input.addEventListener("change", (e) => {
  if (!e.target.value || e.target.value > 5) {
    e.target.value = 4;
    rows = e.target.value;
  }
});
cols_input.addEventListener("input", (e) => {
  let val = e.target.value;
  if (val.length == 1) cols = val;
  else {
    e.target.value = val.slice(0, 1);
    cols = val.slice(0, 1);
  }
});
cols_input.addEventListener("change", (e) => {
  if (!e.target.value || e.target.value > 5) {
    e.target.value = 4;
    cols = e.target.value;
  }
});
generate_button.addEventListener("click", (e) => matrixGenerate(rows, cols));
const answers = document.getElementById("answers");

class Pair {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
async function wait(ms) {
  return new Promise((resolve) => setTimeout(() => resolve(), ms));
}

const delay = 0.1;
async function mazeUtil(x, y, vis, temp, direction) {
  const rows_div = document.querySelectorAll("#container > .row");
  if (x == Matrix.length - 1 && y == Matrix[0].length - 1) {
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
      n_x < Matrix.length &&
      n_y < Matrix[0].length &&
      n_y >= 0 &&
      Matrix[n_x][n_y] == 1 &&
      !vis[n_x][n_y]
    ) {
      vis[x][y] = true;
      rows_div[x].childNodes[y].style.backgroundColor = "skyblue";
      await wait(delay);
      temp.push({ point: new Pair(x, y), dir: dir[i] });
      await mazeUtil(n_x, n_y, vis, temp, dir[i]);
      await wait(delay);
      rows_div[x].childNodes[y].style.backgroundColor = null;
      vis[x][y] = false;
      temp.pop();
    }
  }
}

async function solve() {
  let vis = [];
  for (let i = 0; i < Matrix.length; i++) {
    let temp = [];
    for (let j = 0; j < Matrix[0].length; j++) {
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
  answer.style.width = `${block_size * cols * 0.5}px`;
  answer.style.height = `${block_size * rows * 0.5}px`;
  Matrix.forEach((row) => {
    const ansDiv = document.createElement("div");
    ansDiv.className = "row";
    ansDiv.style.width = "100%";
    ansDiv.style.height = `${block_size * 0.5}px`;
    row.forEach((element) => {
      const div = document.createElement("div");
      div.className = "ans-block";
      div.style.width = `${block_size * 0.5}px`;
      div.style.height = `${block_size * 0.5}px`;
      if (element === 0) {
        div.style.backgroundColor = "black";
      } else {
        div.style.backgroundColor = null;
      }
      ansDiv.appendChild(div);
    });
    answer.appendChild(ansDiv);
    answers.appendChild(answer);
  });
  temp.forEach((pair) => {
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
