// declarations

var grid;
var numRow = 8, numCol = 8, numMines = 10;

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
    createGrid();
    addMines();
    addValues();
    
    //exposeAll();
    refreshBoard();
});

$(document).click(function(event) {
    var curr = $(event.target);
    if (curr.hasClass("cell")) {
        var parent = curr.parent();
        var rowIndex, colIndex;
        
        /*outer:
        for (i = 0; i < numRow; i++) {
            for (j = 0; j < numCol; j++) {
                var temp = ".cell:nth-child(" + ((i * numCol) + j) + ")";
                var cell = parent.children(temp);
                console.log(cell);

                if (cell == curr) {
                    rowIndex = i;
                    colIndex = j;

                    break outer;
                }
            }
        }*/

        console.log(rowIndex, colIndex);
    }
});



// board specific

function createGrid() {
    grid = new Array(numRow);

    for (i = 0; i < numRow; i++) {
        grid[i] = new Array(numCol);

        for (j = 0; j < numCol; j++) {
            grid[i][j] = new Cell(i, j);
            createCell();
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
}

function exposeAll() {
    for (i = 0; i < numRow; i++) {
        for(j = 0; j < numCol; j++)
            grid[i][j].exposed = true;
    }
}



// cell specific

function createCell() {
    cell = document.createElement("div");
    cell.className = "cell";
    document.getElementById("board").appendChild(cell);

    span = document.createElement("span");
    cell.appendChild(span);
}



// drawing functions

function refreshBoard() {
    for (i = 0; i < numRow; i++) {
        for (j = 0; j < numCol; j++) {
            var temp = ".cell:nth-child(" + (1 + (i * numCol) + j) + ")";
            var cell = $("#board").children(temp);
            var span = cell.children("span");
            
            if (grid[i][j].exposed) {
                cell.css("background-color", "red");
                
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
