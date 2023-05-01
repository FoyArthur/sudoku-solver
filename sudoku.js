const SIZE = 9;

const getBoxCoordinates = (i, j) => Math.floor(i/3) * 3 + Math.floor(j/3);

function getInputs() {
  let grid = new Array(SIZE);
  for(let i = 0; i < SIZE; i++) {
    grid[i] = new Array(SIZE);
  }

  const sudoku = document.querySelector('.sudoku');
  let row = 0;
  for(const child of sudoku.children) {
    let column = 0;
    for(const cell of child.children) {
      grid[row][column] = cell.value ? parseInt(cell.value): 0;
      column++;
    }
    row++;
  }
  return grid;
}

function arrayCopy(array) {
  const newArray = [];
  for(let i= 0; i < 9; i++) {
    const set = new Set();
    for(const ele of array[i]) {
      set.add(ele);
    }
    newArray.push(set);
  }
  return newArray;
}

function gridCopy(grid) {
  const newArray = [];
  for(let i= 0; i < 9; i++) {
    const row = new Array();
    for(let j = 0; j < 9; j++) {
      row.push(grid[i][j]);
    }
    newArray.push(row);
  }
  return newArray;
}

function possible(grid, possibleRow, possibleBox, possibleColumn) {
  for(let i = 0; i < 9; i++) {
    const row = [];
    const column = [];
    const box = [];
    for(let j = 1; j < 10; j++) {
      row.push(j); column.push(j); box.push(j);
    }
    possibleRow.push(new Set(row));
    possibleColumn.push(new Set(column));
    possibleBox.push(new Set(box));
  }
  for(let i  = 0; i < 9; i++) {
    for(let j = 0; j < 9; j++) {
      if (grid[i][j] !== 0) {
          possibleRow[i].delete(grid[i][j])
          possibleColumn[j].delete(grid[i][j])
          //Grid equal to i//3 * 3 + j//3 
          possibleBox[getBoxCoordinates(i, j)].delete(grid[i][j])
      }
    }
  }
}

function setIntersect(set1, set2) {
  return new Set([...set1].filter((x) => set2.has(x)));
}

function checkPossible(grid, possibleRow, possibleBox, possibleColumn) {
  for(let i = 0; i < 9; i++) {
    for(let j = 0; j < 9; j++) {
      const intersect = setIntersect(setIntersect(possibleRow[i], possibleBox[getBoxCoordinates(i, j)]), possibleColumn[j]);
      if (grid[i][j] === 0 && !intersect.size) {
        return false;
      }
    }
  }
  return true;
}

let i = 0;

function recursiveSolve(grid, possibleRow, possibleBox, possibleColumn) {
  let zero = false;
  for(let i = 0; i < 9; i++) {
    for(let j = 0; j < 9; j++) {
      if (grid[i][j] == 0) {
        zero = true;

        if(!checkPossible(grid, possibleRow, possibleBox, possibleColumn)) return false;
        const possible = setIntersect(setIntersect(possibleRow[i], possibleBox[getBoxCoordinates(i, j)]), possibleColumn[j]);

        for(const ele of possible) {
          const possibleRowCopy = arrayCopy(possibleRow);
          possibleRowCopy[i].delete(ele);
          const possibleBoxCopy = arrayCopy(possibleBox);
          possibleBoxCopy[getBoxCoordinates(i, j)].delete(ele);
          const possibleColumnCopy = arrayCopy(possibleColumn);
          possibleColumnCopy[j].delete(ele);

          const newGrid = gridCopy(grid);
          newGrid[i][j] = ele;
          const finalGrid = recursiveSolve(newGrid, possibleRowCopy, possibleBoxCopy, possibleColumnCopy);
          if(!finalGrid) {
            continue;
          } else {
            return finalGrid;
          }
        }
        return false;
      }
    }
  }
  if(!zero) {
    return grid;
  }
}

function checkInput(grid) {
  for(let i = 0; i < 9; i++) {
    for(let j = 0; j < 9; j++) {
      if(isNaN(grid[i][j])) return false;
    }
  }
  return true;
}

function solve() {
  const grid = getInputs();

  if(!checkInput(grid)) {
    clear();
    return;
  }
  const possibleRow = []
  const possibleBox = []
  const possibleColumn = []
  possible(grid, possibleRow, possibleBox, possibleColumn);

  const finalGrid = recursiveSolve(grid, possibleRow, possibleBox, possibleColumn);
  if(finalGrid != false) {
    populateGrid(finalGrid);
  }
  console.log(finalGrid);
}

function populateGrid(grid) {
  console.log('here')
  const sudoku = document.querySelector('.sudoku');
  let row = 0;
  for(const child of sudoku.children) {
    let column = 0;
    for(const cell of child.children) {
      cell.value = grid[row][column];
      column++;
    }
    row++;
  }
}

function clear() {
  const sudoku = document.querySelector('.sudoku');
  let row = 0;
  for(const child of sudoku.children) {
    let column = 0;
    for(const cell of child.children) {
      cell.value = '';
      column++;
    }
    row++;
  }
}

function createBoard() {
  const sudoku = document.querySelector('.sudoku');
  for(let i = 0; i < SIZE; i++) {
      const row = document.createElement('div');
      row.className = 'row';
      for(let j = 0; j < SIZE; j++) {
        const cell = document.createElement('INPUT');
        cell.setAttribute('type', 'text');
        cell.className = 'cell';
        cell.setAttribute('maxLength', '1');
        row.appendChild(cell);
      }
      sudoku.appendChild(row);
  }
}

function createButtons() {
  const solveButton = document.createElement('button');
  const clearButton = document.createElement('button');
  solveButton.innerText = 'Solve';
  solveButton.addEventListener('click', solve);
  clearButton.innerText = 'Clear';
  clearButton.addEventListener('click', clear);
  document.body.appendChild(solveButton);
  document.body.appendChild(clearButton)
}



createBoard();
createButtons();