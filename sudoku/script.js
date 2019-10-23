var grid, arr, ans;
var cellSize = 75;

var selectedCell;
var modeValue;

var numFilled;
var complete;
var errorCount;
var gameover;
var numbers;


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
        this.isHinted = false;
        this.valCorrect = false;
        this.writable = true;
    }
}




$(document).ready(function () {
    setupRender();
    
    reset();
    refreshBoard();
});

$(document).click(function(event) {
    var curr = $(event.target);

    if (curr.attr('id') == "reset") {
        reset();
        refreshBoard();
    }

    if (complete || gameover)   return;

    if (curr.attr('id') == "mode") {
        modeValue = !modeValue;
    }

    else if (curr.attr('id') == "erase") {
        if (grid[selectedCell[0]][selectedCell[1]].value != 0)
            numFilled--;
        grid[selectedCell[0]][selectedCell[1]].value = 0;

        for (var i = 0; i < 9; i++)
            grid[selectedCell[0]][selectedCell[1]].hints[i] = false;
        
        grid[selectedCell[0]][selectedCell[1]].isHinted = false;
    }

    else if (curr.hasClass("btn-num") || curr.parent().hasClass("btn-num")) {
        var temp;

        if (curr.hasClass("btn-num"))
            temp = curr.attr('id').split("-")[1];
        
        else if (curr.parent().hasClass("btn-num"))
            temp = curr.parent().attr('id').split("-")[1];
        
        
        var cell = grid[selectedCell[0]][selectedCell[1]];
        
        
        if (modeValue) {
            for (var i = 0; i < 9; i++)
                cell.hints[i] = false;
            cell.isHinted = false;
            cell.value = temp;
            
            numFilled++;
            if (numFilled == 81)
                matchBoard();
            
            checkBoard(cell.rowIndex, cell.colIndex);
    
            if (errorCount == 5)    gameover = true;
        }

        else {
            if (cell.value != 0)    numFilled--;
            cell.value = 0;
            
            cell.hints[temp - 1] = !cell.hints[temp - 1];

            for (var i = 0; i < 9; i++) {
                if (cell.hints[i]) {
                    cell.isHinted = true;
                    break;
                }
                cell.isHinted = false;
            }
        }
    }

    else if (curr.hasClass("cell") || curr.parent().hasClass("cell") ||
    curr.parent().parent().hasClass("cell")) {
        var temp;

        if (curr.hasClass("cell"))
            temp = curr.attr('id').split("-");
        
        else if (curr.parent().hasClass("cell"))
            temp = curr.parent().attr('id').split("-");
        
        else if (curr.parent().parent().hasClass("cell"))
            temp = curr.parent().parent().attr('id').split("-");
        
        if (grid[temp[1]][temp[2]].writable)
            selectedCell = [temp[1], temp[2]];
    }
    
    refreshBoard();
});




function createGrid() {
    grid = new Array(9);

    var k = 1;
    for (var i = 0; i < 9; i++) {
        grid[i] = new Array(9);
        
        for (var j = 0; j < 9; j++) {
            grid[i][j] = new Cell(i, j);
        }
    }
}

function checkBoard(row, col) {
    for (var i = 0; i < 9; i++) {
        if (i == row)   continue;
        
        if (grid[i][col].value == grid[row][col].value) {
            $("#value-" + row + "-" + col).css({
                "color":"firebrick"
            });
            errorCount++;
            
            return;
        }
        
        else {
            $("#value-" + row + "-" + col).css({
                "color":"darkgreen"
            });
        }
    }

    for (var i = 0; i < 9; i++) {
        if (i == col)   continue;
        
        if (grid[row][i].value == grid[row][col].value) {
            $("#value-" + row + "-" + col).css({
                "color":"firebrick"
            });
            errorCount++;
            
            return;
        }
        
        else {
            $("#value-" + row + "-" + col).css({
                "color":"darkgreen"
            });
        }
    }

    var srow = row - (row % 3);
    var scol = col - (col % 3);
    

    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            if ((srow + i) == row && (scol + j) == col) continue;

            if (grid[srow + i][scol + j].value == grid[row][col].value) {
                $("#value-" + row + "-" + col).css({
                    "color":"firebrick"
                });
                errorCount++;
                
                return;
            }
            else {
                $("#value-" + row + "-" + col).css({
                    "color":"darkgreen"
                });
            }
        }
    }
}

function matchBoard() {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (grid[i][j].value != ans[i][j]) {
                complete = false;
                
                return;
            }
        }
    }
    
    complete = true;
}

function reset() {
    modeValue = true;
    numFilled = 0;
    complete = false;
    errorCount = 0;
    gameover = false;

    numbers = new Array(9);
    for (var i = 0; i < 9; i++)
        numbers[i] = 0;

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
}








function setupRender() {
    var wrapper = document.createElement("div");
    wrapper.id = "outer";
    wrapper.className = "clearfix";
    document.body.appendChild(wrapper);

    
    var status = document.createElement("div");
    status.id = "status";
    wrapper.appendChild(status);

    var reset = document.createElement("div");
    reset.id = "reset";
    status.appendChild(reset);

    var status_span = document.createElement("span");
    status_span.id = "status-val";
    status_span.innerHTML = "Running";
    status.appendChild(status_span);

    var hint = document.createElement("div");
    hint.id = "btn-hint";
    status.appendChild(hint);

    
    var numgrid = document.createElement("div");
    numgrid.id = "num-grid";
    wrapper.appendChild(numgrid);

    var board = document.createElement("div");
    board.id = "board";
    numgrid.appendChild(board);
    
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            createCell(i, j);
        }
    }


    var numrow = document.createElement("div");
    numrow.id = "num-row";
    wrapper.appendChild(numrow);

    var mode = document.createElement("div");
    mode.id = "mode";
    numrow.appendChild(mode);

    var buttons = document.createElement("div");
    buttons.id = "buttons";
    numrow.appendChild(buttons);

    var erase = document.createElement("div");
    erase.id = "erase";
    numrow.appendChild(erase);

    for (var i = 0; i < 9; i++) {
        var btn_num = document.createElement("div");
        btn_num.id = "btn-" + (i + 1);
        btn_num.className = "btn-num";
        buttons.appendChild(btn_num);

        var btn_val = document.createElement("span");
        btn_val.className = "btn-val";
        btn_val.innerHTML = i + 1 + "";
        btn_num.appendChild(btn_val);
    }



    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            var temp = $("#cell-" + i + "-" + j);
            
            if (i == 2 || i == 5) {
                temp.css("border-bottom", "4px solid indigo");
            }

            else if (i == 3 || i == 6) {
                temp.css("border-top", "4px solid indigo");
            }

            if (j == 2 || j == 5) {
                temp.css("border-right", "4px solid indigo");
            }

            else if (j == 3 || j == 6) {
                temp.css("border-left", "4px solid indigo");
            }
        }
    }
}

function createCell(row, col) {
    var cell = document.createElement("div");
    cell.className = "cell";
    cell.id = "cell-" + row + "-" + col;
    document.getElementById("board").appendChild(cell);

    var span = document.createElement("span");
    span.className = "cell-value";
    span.id = "value-" + row + "-" + col;
    cell.appendChild(span);

    var hints = document.createElement("div");
    hints.className = "hints-grid";
    cell.appendChild(hints);

    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            var hint = document.createElement("span");
            hint.className = "cell-hint";
            hint.id = "hint-" + row + "-" + col + "-" + i + "-" + j;
            hint.innerHTML = 1 + (i * 3) + j + "";
            hint.style.visibility = "hidden";
            hints.appendChild(hint);
        }
    }
}




function refreshBoard() {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            var temp = $("#cell-" + i + "-" + j);
            temp.css("box-shadow", "none");
            if (!grid[i][j].writable)
                temp.css({
                    "background":"beige",
                    "color":"black"
                });
            

            if (!grid[i][j].isHinted) {
                if (grid[i][j].value != 0)
                    $("#value-" + i + "-" + j).html(grid[i][j].value);
                else
                    $("#value-" + i + "-" + j).html("");
                
                for (var m = 0; m < 3; m++) {
                    for (var n = 0; n < 3; n++) {
                        $("#hint-" + i + "-" + j + "-" + m + "-" + n).css({
                            "visibility":"hidden"
                        });
                    }
                }
            }

            else {
                $("#value-" + i + "-" + j).html("");

                for (var m = 0; m < 3; m++) {
                    for (var n = 0; n < 3; n++) {
                        if (grid[i][j].hints[3 * m + n])
                            $("#hint-" + i + "-" + j + "-" + m + "-" + n).css({
                                "visibility":"visible"
                            });
                    }
                }
            }
        }
    }
    
    
    
    $("#cell-" + selectedCell[0] + "-" + selectedCell[1]).css({
        "box-shadow":"0 0 3px 4px darkslategrey inset"
    });

    
    
    if (modeValue) {
        $("#mode").css({
            "background":"oldlace url(\"images/write.png\") no-repeat center",
            "background-size":"32px 32px"
        });

        $("#mode").on({
            mouseenter: function() {
                $("#mode").css({
                    "background":"white url(\"images/write.png\") no-repeat center",
                    "background-size":"32px 32px"
                });
            },
            mouseleave: function() {
                $("#mode").css({
                    "background":"oldlace url(\"images/write.png\") no-repeat center",
                    "background-size":"32px 32px"
                });
            }
        });
    }

    else {
        $("#mode").css({
            "background":"oldlace url(\"images/hint.png\") no-repeat center",
            "background-size":"32px 32px"
        });

        $("#mode").on({
            mouseenter: function() {
                $("#mode").css({
                    "background":"white url(\"images/hint.png\") no-repeat center",
                    "background-size":"32px 32px"
                });
            },
            mouseleave: function() {
                $("#mode").css({
                    "background":"oldlace url(\"images/hint.png\") no-repeat center",
                    "background-size":"32px 32px"
                });
            }
        });
    }


    if (complete)
        $("#status-val").html("Complete");
    else if (gameover)
        $("#status-val").html("Game over");
    else
        $("#status-val").html("Running");
}





function setupGrid() {
    arr = new Array(9);
    arr[0] = [7, 0, 0, 0, 0, 0, 8, 0, 0];
    arr[1] = [3, 4, 9, 8, 5, 6, 0, 2, 0];
    arr[2] = [0, 0, 5, 1, 0, 0, 6, 4, 9];
    arr[3] = [5, 2, 0, 0, 4, 8, 9, 3, 6];
    arr[4] = [0, 3, 7, 0, 0, 0, 4, 1, 8];
    arr[5] = [8, 9, 0, 0, 0, 0, 0, 7, 2];
    arr[6] = [1, 5, 3, 0, 0, 9, 7, 0, 0];
    arr[7] = [0, 0, 0, 0, 0, 1, 0, 0, 0];
    arr[8] = [0, 7, 0, 0, 8, 5, 3, 6, 0];

    ans = new Array(9);
    ans[0] = [7, 1, 6, 9, 2, 4, 8, 5, 3];
    ans[1] = [3, 4, 9, 8, 5, 6, 1, 2, 7];
    ans[2] = [2, 8, 5, 1, 3, 7, 6, 4, 9];
    ans[3] = [5, 2, 1, 7, 4, 8, 9, 3, 6];
    ans[4] = [6, 3, 7, 5, 9, 2, 4, 1, 8];
    ans[5] = [8, 9, 4, 6, 1, 3, 5, 7, 2];
    ans[6] = [1, 5, 3, 2, 6, 9, 7, 8, 4];
    ans[7] = [4, 6, 8, 3, 7, 1, 2, 9, 5];
    ans[8] = [9, 7, 2, 4, 8, 5, 3, 6, 1];

    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (arr[i][j] == 0) {
                grid[i][j].writable = true;
            }

            else {
                grid[i][j].value = arr[i][j];
                grid[i][j].writable = false;
                
                numbers[arr[i][j] - 1]++;
                numFilled++;
            }
        }
    }
}
