var startAliveChance = 0.3;  // percantage of alive cells on grid

function make2DArray(columns, rows) {  
    let arr = new Array(columns);
    for(let i = 0; i < arr.length; ++i) {
        arr[i] = new Array(rows);
    }

    for(let i = 0; i < columns; ++i) {
        for(let j = 0; j < rows; ++j) {
            arr[i][j] = new Cell();
        }
    }

    return arr;
}


var columns ;
var rows ;
var next;
var grid;
var resolution = 10;


function isInArea(x, y, columns, rows) {        // is coords belong to grid?
    if(0 <= x && x < columns) {
        if(0 <= y && y < rows) {
            return true;
        }
    }
    return false;
}



function Cell() {
    this.alive = 0;
    this.oldness = 0;
}


function show(grid, i, j) {          
    fill(0, 0, 200);
    if(grid[i][j].alive == 1) {                                                  // if cell is alive , setting color depends on oldness
        fill(grid[i][j].oldness * 15,  grid[i][j].oldness, grid[i][j].oldness);
    }
    stroke(0, 0, 200);
    rect(i * resolution, j * resolution, resolution - 1, resolution - 1);
}


function checkNeighbors(grid, x, y, columns, rows) {  // checking closest cells to current 
    
    var aliveCounter = 0;
    
    var shifts = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]];
    for(let i = 0; i < shifts.length; ++i) {
        if(isInArea(x + shifts[i][0], y + shifts[i][1], columns, rows)) {    
            if(grid[x + shifts[i][0]][y + shifts[i][1]].alive == 1) {                                    
                if(grid[x + shifts[i][0]][y + shifts[i][1]].oldness <= 55) { // cell is not reproductive if cell is old
                    ++aliveCounter;
                } 
                // ++aliveCounter;
            }
        }
    }
    
    
    return aliveCounter;
}



function setup() {
    createCanvas(1200, 800);
    console.log("life");

    columns = width / resolution;
    rows = height / resolution;
    grid = make2DArray(columns, rows);
    
    for(let i = 0; i < columns; i++) {
        for(let j = 0; j < rows; j++) {

            if(random(1) < startAliveChance) {   // set state of cell 
                grid[i][j].alive = 1;
            } else {
                grid[i][j].alive = 0;
            }
        }
    }
}



function draw() {
    frameRate(20);
    for(let i = 0; i < columns; ++i) {    // showing previous grid's version
        for(let j = 0; j < rows; ++j) {
            show(grid, i, j);
        }
    }
    
    next = make2DArray(columns, rows);   // creating tmp grid for next version
    
    // Calculating next version of grid
    for(let i = 0; i < columns; ++i) {
        for(let j = 0; j < rows; ++j) {

            if(grid[i][j].alive == 1) {  // alive cell
                if(checkNeighbors(grid, i, j, columns, rows) < 2 || checkNeighbors(grid, i, j, columns, rows) > 3) {   // if alive cell has 2 or 3 alive neighbors, he stays alive
                    next[i][j].alive = 0;
                    next[i][j].oldness = 0;
                } else {
                    next[i][j].alive = 1;
                    next[i][j].oldness = grid[i][j].oldness + 1;
                }
                
            } else {   // dead cell
                if(checkNeighbors(grid, i, j, columns, rows) == 3) {
                    next[i][j].alive = 1;
                    next[i][j].oldness = 0;
                } else {
                    next[i][j] = grid[i][j];
                }
            }
        }
    }

    grid = next;
}

