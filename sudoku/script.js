var grid;
var cellSize = 75;


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
    setupRender();
    createGrid();
    $("#cell-4-4").css("box-shadow", "0 0 3px 3px skyblue inset");
});




function createGrid() {
    grid = new Array(9);

    var k = 1;
    for (var i = 0; i < 9; i++) {
        grid[i] = new Array(9);
        
        for (var j = 0; j < 9; j++) {
            grid[i][j] = new Cell(i, j);
            createCell(i, j);
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
    span.innerHTML = "0";
    cell.appendChild(span);

    var hints = document.createElement("div");
    hints.className = "hints-grid";
    cell.appendChild(hints);

    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            var hint = document.createElement("span");
            hint.className = "cell-hint";
            hint.id = "hint-" + i + "-" + j;
            hint.innerHTML = 1 + (i * 3) + j + "";
            hints.appendChild(hint);
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

    var status_span = document.createElement("span");
    status_span.innerHTML = "Complete";
    status.appendChild(status_span);

    
    var numgrid = document.createElement("div");
    numgrid.id = "num-grid";
    wrapper.appendChild(numgrid);

    var board = document.createElement("div");
    board.id = "board";
    numgrid.appendChild(board);
    


    var numrow = document.createElement("div");
    numrow.id = "num-row";
    wrapper.appendChild(numrow);

    var mode = document.createElement("div");
    mode.id = "mode";
    numrow.appendChild(mode);

    var buttons = document.createElement("div");
    buttons.id = "buttons";
    numrow.appendChild(buttons);

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

    var borders = document.createElement("div");
    borders.id = "borders";
    numgrid.appendChild(borders);

    for (var i = 0; i < 9; i++) {
        var box_border = document.createElement("div");
        box_border.className = "box-border";
        borders.appendChild(box_border);
    }
}
