var grid;
var cellSize = 75;

//var gameOver, gameWon, numExposed, numFlags, numSpotted, explodedCell;


class Cell {
    constructor(row, col) {
        this.rowIndex = row;
        this.colIndex = col;

        this.value = 0;
        this.hints = [
            false, false, false,
            false, false, false,
            false, false, false
        ];
        this.writable = true;
    }
}

$(document).ready(function () {
    createGrid();
});



function createGrid() {
    grid = new Array(9);

    /*for (i = 0; i < 9; i++) {
        grid[i] = new Array(9);

        for (j = 0; j < 9; j++) {
            grid[i][j] = new Cell(i, j);
            createCell(i, j);
        }
    }*/
    createCell(0, 0);
    createCell(0, 1);
    createCell(0, 2);createCell(0, 0);
    createCell(0, 1);
    createCell(0, 2);createCell(0, 0);
    createCell(0, 1);
    createCell(0, 2);createCell(0, 0);
    createCell(0, 1);
    createCell(0, 2);
}


function createCell(row, col) {
    var cell = document.createElement("div");
    cell.className = "cell";
    cell.id = "cell-" + row + "-" + col;
    document.getElementById("board").appendChild(cell);
    
    var span = document.createElement("span");
    span.id = "value";
    cell.appendChild(span);

    for (i = 0; i < 3; i++) {
        for (j = 0; j < 3; j++) {
            var hint = document.createElement("span");
            hint.className = "hint";
            hint.id = "hint-" + i + "-" + j;
            hint.innerHTML("1" + (i * 3) + j);
            cell.appendChild(hint);
        }
    }
}