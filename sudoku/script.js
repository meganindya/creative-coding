// ## GLOBALS ##
// ====================================================

// intrinsic parameters

var cellSize = 75;          // cell dimension in pixels
var initVals, finalVals;    // matrix of initial unfilled, filled board


// cell class definition: object stores properties of each cell

class Cell {
    constructor() {
        this.value = 0;
        this.guess = [
            false, false, false,
            false, false, false,
            false, false, false
        ];

        this.writable   = true;
        this.isGuessed  = false;
        this.isValWrong = false;
        this.hintPlaced = false;
    }
}

var grid;                   // variable to store cell matrix



// environment parameters

var selectedCell;           // stores row no, col no of selected cell

var isValueMode;            // stores whether number row is in value entry mode or not (guess entry mode)

var hintsTaken;             // stores count of times hint is taken
var numFilled;              // stores count of value filled cells
var wrongCount;             // stores count  of errors made

var numCount;                // stores count of each number' presence

var complete;               // stores whether game is complete (won)
var gameover;               // stores whether game is over (lost)








// ## BOARD WIDE FUNCTIONS ##
// ====================================================

// triggered after document is loaded

$(document).ready(function () {
    setupRender();
    reset();

    refreshBoard();
});


// resets all parameters

function reset() {
    isValueMode = true;

    hintsTaken  = 0;
    numFilled   = 0;
    wrongCount  = 0;

    numCount = new Array(9);
    for (var i = 0; i < 9; i++)
        numCount[i] = 0;

    complete = false;
    gameover = false;


    createGrid();
    setupGrid();

    outer:
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (grid[i][j].writable) {
                selectedCell = [i, j];
                break outer;
            }
        }
    }

    wrongValFound = false;
}


// creates matrix of cell objects

function createGrid() {
    grid = new Array(9);

    for (var i = 0; i < 9; i++) {
        grid[i] = new Array(9);

        for (var j = 0; j < 9; j++)
            grid[i][j] = new Cell();
    }
}


// fills the initVals, finalVals with valid values

function setupGrid() {
    initVals = new Array(9);
    initVals[0] = [7, 0, 0, 0, 0, 0, 8, 0, 0];
    initVals[1] = [3, 4, 9, 8, 5, 6, 0, 2, 0];
    initVals[2] = [0, 0, 5, 1, 0, 0, 6, 4, 9];
    initVals[3] = [5, 2, 0, 0, 4, 8, 9, 3, 6];
    initVals[4] = [0, 3, 7, 0, 0, 0, 4, 1, 8];
    initVals[5] = [8, 9, 0, 0, 0, 0, 0, 7, 2];
    initVals[6] = [1, 5, 3, 0, 0, 9, 7, 0, 0];
    initVals[7] = [0, 0, 0, 0, 0, 1, 0, 0, 0];
    initVals[8] = [0, 7, 0, 0, 8, 5, 3, 6, 0];

    finalVals = new Array(9);
    finalVals[0] = [7, 1, 6, 9, 2, 4, 8, 5, 3];
    finalVals[1] = [3, 4, 9, 8, 5, 6, 1, 2, 7];
    finalVals[2] = [2, 8, 5, 1, 3, 7, 6, 4, 9];
    finalVals[3] = [5, 2, 1, 7, 4, 8, 9, 3, 6];
    finalVals[4] = [6, 3, 7, 5, 9, 2, 4, 1, 8];
    finalVals[5] = [8, 9, 4, 6, 1, 3, 5, 7, 2];
    finalVals[6] = [1, 5, 3, 2, 6, 9, 7, 8, 4];
    finalVals[7] = [4, 6, 8, 3, 7, 1, 2, 9, 5];
    finalVals[8] = [9, 7, 2, 4, 8, 5, 3, 6, 1];


    // cells empty have value = 0
    // cells empty (initially) are writable

    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (initVals[i][j] == 0)
                grid[i][j].writable = true;

            else {
                grid[i][j].writable = false;

                grid[i][j].value = initVals[i][j];
                numCount[initVals[i][j] - 1]++;
                numFilled++;
            }
        }
    }
}


// checks whether new value entered is valid (unique in row, column, square)

function checkIfValid(row, col) {
    // checks for duplicate value in column

    for (var i = 0; i < 9; i++) {
        if (i == col)   continue;

        if (grid[row][i].value == grid[row][col].value) {
            grid[row][col].isValWrong = true;
            wrongCount++;

            return;
        }
    }


    // checks for duplicate value in column

    for (var i = 0; i < 9; i++) {
        if (i == row)   continue;

        if (grid[i][col].value == grid[row][col].value) {
            grid[row][col].isValWrong = true;
            wrongCount++;

            return;
        }
    }


    // checks for duplicate value in square

    var srow = row - (row % 3);     // square starting row index
    var scol = col - (col % 3);     // square starting column index

    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            if ((srow + i) == row && (scol + j) == col) continue;

            if (grid[srow + i][scol + j].value == grid[row][col].value) {
                grid[row][col].isValWrong = true;
                wrongCount++;

                return;
            }
        }
    }

    grid[row][col].isValWrong = false;
}


// checks if board is complete (game won)

function checkComplete() {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (grid[i][j].value != finalVals[i][j]) {
                complete = false;

                return;
            }
        }
    }

    complete = true;
}


// exposes an empty or wrongly filled cell

function hintExpose() {
    if (hintsTaken == 3) {
        gameover = true;
        return;
    }


    var emptyCount = 0;
    var wrongCount = 0;

    // stores number of empty and wrongly filled cells
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (grid[i][j].value == finalVals[i][j])
                continue;


            if (grid[i][j].value == 0)
                emptyCount++;

            else if (grid[i][j].value != finalVals[i][j])
                wrongCount++;
        }
    }


    var row, col;

    // finds an empty cell if there exists any
    if (emptyCount != 0) {
        var temp = 1 + Math.floor((Math.random() * emptyCount));

        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                if (grid[i][j].value == 0) {
                    if ((--temp) == 0) {
                        row = i;
                        col = j;
                    }
                }
            }
        }
    }

    // finds a wrongly filled cell if no empty cells exist
    else {
        var temp = 1 + Math.floor((Math.random() * wrongCount));

        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                if (grid[i][j].value != finalVals[i][j]) {
                    if ((--temp) == 0) {
                        row = i;
                        col = j;
                    }
                }
            }
        }
    }

    // fills spotted cell with correct value
    grid[row][col].value = finalVals[row][col];
    grid[row][col].hintPlaced = true;
    hintsTaken++;

    numCount[finalVals[row][col] - 1]++;

    $("#value-" + row + "-" + col).css("color", "gray");
}








// ## CLICK EVENT CALL ##
// ====================================================

$(document).click(function(event) {
    var curr = $(event.target);


    // reset button

    if (curr.attr('id') == "btn-reset") {
        reset();
        refreshBoard();
    }


    //  all buttons except reset are disabled if game is won or lost

    if (complete || gameover)   return;


    // show hint button

    if (curr.attr('id') == "btn-hint") {
        hintExpose();
        refreshBoard();
    }


    // input mode button

    else if (curr.attr('id') == "btn-mode") {
        isValueMode = !isValueMode;
        refreshBoard();
    }


    // erase button

    else if (curr.attr('id') == "btn-erase") {
        var cell = grid[selectedCell[0]][selectedCell[1]];

        if (cell.value != 0) {
            numCount[cell.value - 1]--;
            numFilled--;
        }


        // clear selected cell's value
        cell.value = 0;

        // clear selected cell's guesses
        for (var i = 0; i < 9; i++)
            cell.guess[i] = false;

        cell.isGuessed = false;

        refreshBoard();
    }


    // number input buttons

    else if (curr.hasClass("btn-num") || curr.parent().hasClass("btn-num")) {
        var btnNum;

        if (curr.hasClass("btn-num"))
            btnNum = curr.attr('id').split("-")[1];

        else if (curr.parent().hasClass("btn-num"))
            btnNum = curr.parent().attr('id').split("-")[1];


        var cell = grid[selectedCell[0]][selectedCell[1]];


        // value is entered

        if (isValueMode) {
            // remove cell guess values
            for (var i = 0; i < 9; i++)
                cell.guess[i] = false;
            cell.isGuessed = false;

            // remove cell value
            if (cell.value != 0) {
                numCount[cell.value - 1]--;
                numFilled--;
                
                cell.hintPlaced = false;
                cell.value = 0;
            }

            // enter cell value
            cell.value = btnNum;

            numCount[btnNum - 1]++;
            numFilled++;

            checkIfValid(selectedCell[0], selectedCell[1]);

            if (wrongCount == 5)    gameover = true;

            if (numFilled == 81)    checkComplete();
        }

        // guess is entered

        else {
            // remove cell value
            if (cell.value != 0) {
                numCount[cell.value - 1]--;
                numFilled--;

                cell.value = 0;
            }

            // toggle cell guess value
            cell.guess[btnNum - 1] = !cell.guess[btnNum - 1];

            for (var i = 0; i < 9; i++) {
                if (cell.guess[i]) {
                    cell.isGuessed = true;
                    break;
                }

                cell.isGuessed = false;
            }
        }

        refreshBoard();
    }


    // cell

    else if (curr.hasClass("cell") || curr.parent().hasClass("cell") ||
    curr.parent().parent().hasClass("cell")) {
        var coordinates;

        if (curr.hasClass("cell"))
            coordinates = curr.attr('id').split("-");

        else if (curr.parent().hasClass("cell"))
            coordinates = curr.parent().attr('id').split("-");

        else if (curr.parent().parent().hasClass("cell"))
            coordinates = curr.parent().parent().attr('id').split("-");

        if (grid[coordinates[1]][coordinates[2]].writable)
            selectedCell = [coordinates[1], coordinates[2]];

        refreshBoard();
    }
});








// ## RENDERING FUNCTIONS ##
// ====================================================

// creates initial DOM layout

function setupRender() {
    var wrapper = document.createElement("div");
        wrapper.id = "wrapper";
        wrapper.className = "clearfix";
    document.body.appendChild(wrapper);

        var header = document.createElement("div");
            header.id = "head-bar";
        wrapper.appendChild(header);

            var reset = document.createElement("div");
                reset.id = "btn-reset";
            header.appendChild(reset);

            var status = document.createElement("span");
                status.id = "status";
                status.innerHTML = "Running";
            header.appendChild(status);

            var hint = document.createElement("div");
                hint.id = "btn-hint";
            header.appendChild(hint);


        var numgrid = document.createElement("div");
            numgrid.id = "num-grid";
        wrapper.appendChild(numgrid);

            var board = document.createElement("div");
                board.id = "board";
            numgrid.appendChild(board);

            var overlay = document.createElement("div");
                overlay.id = "overlay";
            numgrid.appendChild(overlay);

                for (var i = 0; i < 9; i++) {
                    for (var j = 0; j < 9; j++) {
                        createCell(i, j);
                    }
                }


        var numbar = document.createElement("div");
            numbar.id = "num-bar";
        wrapper.appendChild(numbar);

            var mode = document.createElement("div");
                mode.className = "num-bar-btn";
                mode.id = "btn-mode";
            numbar.appendChild(mode);

            var buttons = document.createElement("div");
                buttons.id = "num-buttons";
            numbar.appendChild(buttons);

                for (var i = 0; i < 9; i++) {
                    var btnNum = document.createElement("div");
                        btnNum.id = "btn-" + (i + 1);
                        btnNum.className = "btn-num num-bar-btn";
                    buttons.appendChild(btnNum);

                        var btnVal = document.createElement("span");
                            btnVal.className = "btn-value";
                            btnVal.innerHTML = i + 1 + "";
                        btnNum.appendChild(btnVal);
                }

            var erase = document.createElement("div");
                erase.className = "num-bar-btn";
                erase.id = "btn-erase";
            numbar.appendChild(erase);



    // square borders

    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            var temp = $("#cell-" + i + "-" + j);

            if (i == 2 || i == 5) {
                temp.css("border-bottom", "4px solid gray");
            }

            else if (i == 3 || i == 6) {
                temp.css("border-top", "4px solid gray");
            }

            if (j == 2 || j == 5) {
                temp.css("border-right", "4px solid gray");
            }

            else if (j == 3 || j == 6) {
                temp.css("border-left", "4px solid gray");
            }
        }
    }
}

function createCell(row, col) {
    var cell = document.createElement("div");
        cell.className = "cell";
        cell.id = "cell-" + row + "-" + col;
    document.getElementById("board").appendChild(cell);

        var value = document.createElement("span");
            value.className = "cell-value";
            value.id = "value-" + row + "-" + col;
        cell.appendChild(value);

        var guesses = document.createElement("div");
            guesses.className = "guess-grid";
        cell.appendChild(guesses);

            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 3; j++) {
                    var guess = document.createElement("span");
                        guess.className = "guess-value";
                        guess.id = "guess-" + row + "-" + col + "-" + i + "-" + j;
                        guess.innerHTML = 1 + (i * 3) + j + "";
                    guesses.appendChild(guess);
                }
            }
}


// draws dynamic elements according to parameters

function refreshBoard() {
    // draws cells

    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            // clear cell
            $("#cell-" + i + "-" + j).css("box-shadow", "none");


            // draw unwritable cell
            if (!grid[i][j].writable)
                $("#cell-" + i + "-" + j).css({
                    "background":"beige",
                    "color":"midnightblue"
                });
            
            else {
                $("#cell-" + i + "-" + j).css("cursor", "pointer");

                if (grid[i][j].isValWrong)
                    $("#value-" + i + "-" + j).css("color", "firebrick");
                else
                    $("#value-" + i + "-" + j).css("color", "darkgreen");
                
                if (grid[i][j].hintPlaced)
                    $("#value-" + i + "-" + j).css("color", "darkcyan");
            }


                        
            // show value
            if (!grid[i][j].isGuessed) {
                //write value
                if (grid[i][j].value != 0)
                    $("#value-" + i + "-" + j).html(grid[i][j].value);
                else
                    $("#value-" + i + "-" + j).html("");

                // remove guesses
                for (var m = 0; m < 3; m++) {
                    for (var n = 0; n < 3; n++) {
                        $("#guess-" + i + "-" + j + "-" + m + "-" + n).css({
                            "visibility":"hidden"
                        });
                    }
                }
            }

            // show guesses
            else {
                // remove value
                $("#value-" + i + "-" + j).html("");

                // show guesses
                for (var m = 0; m < 3; m++) {
                    for (var n = 0; n < 3; n++) {
                        if (grid[i][j].guess[(3 * m) + n])
                            $("#guess-" + i + "-" + j + "-" + m + "-" + n).css({
                                "visibility":"visible"
                            });
                        
                        else
                            $("#guess-" + i + "-" + j + "-" + m + "-" + n).css({
                                "visibility":"hidden"
                            });
                    }
                }
            }
        }
    }

    
    // draw selected cell

    $("#cell-" + selectedCell[0] + "-" + selectedCell[1]).css({
        "box-shadow":"0 0 3px 4px royalblue inset"
    });



    // draw mode button

    // value mode
    if (isValueMode)
        $("#btn-mode").css({
            "background":"oldlace url(\"images/write.png\") no-repeat center",
            "background-size":"26px 26px"
        });

    // guess mode
    else
        $("#btn-mode").css({
            "background":"oldlace url(\"images/hint.png\") no-repeat center",
            "background-size":"26px 26px"
        });



    // status bar text

    if (gameover)
        $("#status").html("GAME OVER");
    else if (complete)
        $("#status").html("COMPLETE");
    else
        $("#status").html("RUNNING");
    
    
    
    // draw game end cover over number grid

    if (gameover || complete) {
        $("#overlay").css("visibility", "visible");
        
        $(".num-bar-btn").css({
            "box-shadow":"0 0 0 0 #000",
            "cursor":"default"
        });

        $("#btn-hint").css({
            "cursor":"default"
        });
    }

    else {
        $("#overlay").css("visibility", "hidden");

        $(".num-bar-btn.hover").css({
            "box-shadow":"0 0 2px #000",
            "cursor":"pointer"
        });

        $("#btn-hint").css({
            "cursor":"pointer"
        });
    }
}
