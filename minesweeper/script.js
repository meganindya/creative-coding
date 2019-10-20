// globals

var grid;
var numRow = 8, numCol = 8, numMines = 10;
var cellSize = 75;

var gameOver, gameWon, numExposed, numFlags, numSpotted, explodedCell;

class Cell {
    constructor(row, col) {
        this.rowIndex = row;
        this.colIndex = col;

        this.value = 0;
        this.isMine = false;
        this.exposed = false;
        this.flagged = false;
    }
}



// document functions

$(document).ready(function() {
    setupBoard();
    createGrid();
    
    reset();

    $('.cell').contextmenu(function() {
        return false;
    })
});

$(document).click(function(event) {
    var curr = $(event.target);
    
    if (curr.hasClass("btn-reset") || curr.parent().hasClass("btn-reset")) {
        reset();
    }

    if (curr.hasClass("cell") && !gameOver) {
        var temp = curr.attr('id').split("-");
        exposeCell(temp[1], temp[2]);

        checkGame();
        refreshBoard();
    }
});

$(document).mousedown(function(event) {
    if (event.button == 2) {
        var curr = $(event.target);
        
        if (curr.hasClass("cell") && !gameOver) {
            var temp = curr.attr('id').split("-");
            placeFlag(temp[1], temp[2]);

            checkGame();
            refreshBoard();
        }
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

    //printGrid();
}

function exposeCell(row, col) {
    if (!isExposable(row, col))
        return;
    
    if (grid[row][col].isMine) {
        explodeMine(row, col);
        return;
    }


    // breadth-first search
    var queue = [];
    queue.push([row, col]);

    while (queue.length != 0) {
        var coord = queue.shift();
        if (!isExposable(coord[0], coord[1]))
            continue;
        
        var cell = grid[coord[0]][coord[1]];
        cell.exposed = true;
        numExposed++;

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

function exposeAll() {
    for (i = 0; i < numRow; i++)
        for (j = 0; j < numCol; j++)
            grid[i][j].exposed = true;
}

function printGrid() {
    for (i = 0; i < numRow; i++) {
        var str = "";
        for (j = 0; j < numCol; j++) {
            if (grid[i][j].isMine)
                str += "X ";
            else
                str += grid[i][j].value + " ";
        }
        console.log(str);
    }
    console.log("");
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

function placeFlag(row, col) {
    if (!grid[row][col].flagged) {
        grid[row][col].flagged = true;
        numFlags++;
        
        if (grid[row][col].isMine)  numSpotted++;
    }

    else {
        grid[row][col].flagged = false;
        numFlags--;
        
        if (grid[row][col].isMine)  numSpotted--;
        
        $("#cell-" + row + "-" + col).css({
            "background":"SlateBlue",
        });
    }
    
}



// environment functions

function reset() {
    gameOver = false;
    gameWon = false;
    numExposed = 0;
    numFlags = 0;
    numSpotted = 0;
    explodedCell = [-1, -1];

    for (i = 0; i < numRow; i++)
        for (j = 0; j < numCol; j++) {
            grid[i][j] = new Cell(i, j);
            $("#cell-" + i + "-" + j).css({
                "background":"SlateBlue"
            });
        }

    addMines();
    addValues();
    
    checkGame();
    refreshBoard();
}

function checkGame() {
    if ((numRow * numCol == numMines + numExposed) ||
        (numMines == numSpotted)) {
        gameOver = true;
        gameWon = true;

        $("#status").children("span").html("You Won!");
    }

    else {
        if (gameOver)
            $("#status").children("span").html("Game Over!");
        else
            $("#status").children("span").html("");
    }

    if (gameOver)   exposeAll();
}

function explodeMine(row, col) {
    gameOver = true;
    gameWon = false;
    
    grid[row][col].exposed = true;
    explodedCell = [row, col];
}



// markup functions

function setupBoard() {
    var width = (numCol * cellSize) + "px";
    $("#board").css("width", width);
    var height = (numRow * cellSize) + "px";
    $("#board").css("width", height);
}

function refreshBoard() {
    for (i = 0; i < numRow; i++) {
        for (j = 0; j < numCol; j++) {
            var temp = ".cell:nth-child(" + (1 + (i * numCol) + j) + ")";
            var cell = $("#board").children(temp);
            var span = cell.children("span");
            
            if (grid[i][j].exposed) {
                cell.css("background-color", "Seashell");
                
                if (!grid[i][j].isMine) {
                    if (grid[i][j].value != 0) {
                        span.html(grid[i][j].value);
                        span.css("color", getTextColor(grid[i][j].value));
                    }
                    
                    else
                        span.html("");
                }

                else {
                    span.html(""/*"•"*/);
                    cell.css({
                        "background":"Seashell url(\"images/bomb.png\") no-repeat center",
                        "background-size":(cellSize - 27 + "px")
                    });
                }
                
                span.show();
            }

            else {
                cell.css("background", "SlateBlue");
                span.hide();
            }

            if (grid[i][j].flagged) {
                span.html("");
                $("#cell-" + i + "-" + j).css({
                    "background":"SlateBlue url(\"images/flag.png\") no-repeat center",
                    "background-size":(cellSize - 15 + "px")
                });
            }

            if (gameOver && grid[i][j].flagged && !grid[i][j].isMine) {
                span.html("");
                $("#cell-" + i + "-" + j).css({
                    "background":"Red url(\"images/flag.png\") no-repeat center",
                    "background-size":(cellSize - 15 + "px")
                });
            }

            if (gameOver && grid[i][j].flagged && grid[i][j].isMine) {
                span.html("");
                $("#cell-" + i + "-" + j).css({
                    "background":"Green url(\"images/flag.png\") no-repeat center",
                    "background-size":(cellSize - 15 + "px")
                });
            }
        }
    }

    if (gameOver && !gameWon) {
        $("#cell-" + explodedCell[0] + "-" + explodedCell[1]).css({
            "background-image":"url(\"images/explosion.png\")",
            "background-size":(cellSize + "px")
        });
    }

    $("#bomb-count").children("span").html(numMines);
    $("#flag-count").children("span").html(numFlags);
}

function getTextColor(value) {
    switch (value) {
        case 1: return "Navy";
        case 2: return "DarkGreen";
        case 3: return "Sienna";
        case 4: return "Purple";
        case 5: return "Maroon";
        case 6: return "Teal";
        case 7: return "Black";
        case 8: return "DimGray";
    }
}
