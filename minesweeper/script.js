// declarations

var grid;
var numRow = 4, numCol = 4, numMines = 10;

var gameover = false;
var numExposed = 0;

class Cell {
    constructor(row, col) {
        this.rowIndex = row;
        this.colIndex = col;

        this.value = 0;
        this.isMine = false;
        this.exposed = false;
    }
}



// document functions

$(document).ready(function() {
    setupBoard();

    createGrid();
    addMines();
    addValues();
    
    //exposeAll();
    refreshBoard();
});

$(document).click(function(event) {
    var curr = $(event.target);
    if (curr.hasClass("cell") && !exploded) {
        var temp = curr.attr('id').split("-");
        exposeCell(temp[1], temp[2]);
        refreshBoard();
    }
});



// board specific

function createGrid() {
    grid = new Array(numRow);

    for (i = 0; i < numRow; i++) {
        grid[i] = new Array(numCol);

        for (j = 0; j < numCol; j++) {
            grid[i][j] = new Cell(i, j);
            createCell(i, j);
        }
    }
}

function addMines() {
    for (i = 0; i < numMines; i++) {
        var mineRow = Math.floor(Math.random() * numRow);
        var mineCol = Math.floor(Math.random() * numCol);

        if (!grid[mineRow][mineCol].isMine)
            grid[mineRow][mineCol].isMine = true;
        
        else    i--;
    }
}

function addValues() {
    for(i = 0; i < numRow; i++) {
        for(j = 0; j < numCol; j++) {
            if(grid[i][j].isMine)
                continue;
            
            var count = 0;
            for (m = -1; m <= 1; m++) {
                if ((i + m) < 0 || (i + m) >= numRow)
                    continue;
                
                for (n = -1; n <= 1; n++) {
                    if ((j + n) < 0 || (j + n) >= numCol || (m == 0 && n == 0))
                        continue;
                    
                    if (grid[i + m][j + n].isMine)
                        count++;
                }
            }
            grid[i][j].value = count;
        }
    }

    for (i = 0; i < numRow; i++) {
        var str = "";
        for (j = 0; j < numCol; j++)
            str += grid[i][j].value + " ";
        console.log(str);
    }
}

function exposeAll() {
    for (i = 0; i < numRow; i++) {
        for(j = 0; j < numCol; j++)
            grid[i][j].exposed = true;
    }
}

function exposeCell(row, col) {
    if (!isExposable(row, col))
        return;
    
    if (grid[row][col].isMine) {
        explodeMine(row, col);
        return;
    }


    // breadth first search
    var queue = [];
    queue.push([row, col]);

    while (queue.length != 0) {
        var coord = queue.shift();
        if (!isExposable(coord[0], coord[1]))
            continue;
        
        //console.log(coord[0], coord[1]);
        var cell = grid[coord[0]][coord[1]];
        cell.exposed = true;

        if (cell.value == 0) {
            for (i = -1; i <= 1; i++) {
                for (j = -1; j <= 1; j++) {
                    if (i == 0 && j == 0)   continue;
                    queue.push([cell.rowIndex + i, cell.colIndex + j]);
                }
            }
        }
    }
}

function isExposable(row, col) {
    if (row < 0 || row >= numRow || col < 0 || col >= numCol)
        return false;
    
    if (grid[row][col].exposed)
        return false;
    
    return true;
}



// cell specific

function createCell(row, col) {
    var cell = document.createElement("div");
    cell.className = "cell";
    cell.id = "cell-" + row + "-" + col;
    document.getElementById("board").appendChild(cell);

    var span = document.createElement("span");
    cell.appendChild(span);
}

function explodeMine(row, col) {
    gameover = true;
    grid[row][col].exposed = true;
    console.log("BOMB!! at", row, col);
}



// markup functions

function setupBoard() {
    var width = (numCol * 75) + "px";
    $("#board").css("width", width);
    var height = (numRow * 75) + "px";
    $("#board").css("width", height);
}

function refreshBoard() {
    for (i = 0; i < numRow; i++) {
        for (j = 0; j < numCol; j++) {
            var temp = ".cell:nth-child(" + (1 + (i * numCol) + j) + ")";
            var cell = $("#board").children(temp);
            var span = cell.children("span");
            
            if (grid[i][j].exposed) {
                cell.css("background-color", "#aaa");
                
                if (grid[i][j].isMine)
                    span.html("•");
                else
                    span.html(grid[i][j].value);
                
                span.show();
            }

            else {
                cell.css("background-color", "violet");
                span.hide();
            }
        }
    }
}
