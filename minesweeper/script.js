var x;

var row = 8, col = 8, mines = 10;

$(document).ready(function() {
    initialDraw();
    addGrid();
    addMines();
    addNumbers();
    exposeAll();
});

$(document).click(function(event) {
    if($(event.target).hasClass("cell")) {
        var coord = event.target.id.split(".");
        exposeCell(coord[0], coord[1]);
    }
});



// applicable to whole grid

function initialDraw() {
    var div = document.createElement("div");
    div.id = "outer";
    div.className = "clearfix";
    document.body.appendChild(div);

    div = document.createElement("div");
    div.className = "heading";
    document.getElementById("outer").appendChild(div);
}

function addGrid() {
    x = new Array(row);

    for (i = 0; i < row; i++) {
        x[i] = new Array(col);

        for (j = 0; j < col; j++) {
            x[i][j] = "";
            addBlock(i, j);
        }
    }
}

function addBlock(r, c) {
    var div = document.createElement("div");
    div.id = r + "." + c;
    div.className = "cell";
    document.getElementById("outer").appendChild(div);
}

function addMines() {
    for (i = 0; i < mines; i++) {
        var mr = Math.floor(Math.random() * row);
        var mc = Math.floor(Math.random() * col);

        if (x[mr][mc] != '•')
            x[mr][mc] = '•';
        
        else {
            i--;
            continue;
        }
    }
}

function addNumbers() {
    for(i = 0; i < row; i++) {
        for(j = 0; j < col; j++) {
            if(x[i][j] == '•')
                continue;
            
            var k = 0;
            for (m = -1; m <= 1; m++) {
                if ((i + m) < 0 || (i + m) >= row)
                    continue;
                
                for (n = -1; n <= 1; n++) {
                    if ((j + n) < 0 || (j + n) >= col || (m == 0 && n == 0))
                        continue;
                    
                    if (x[i + m][j + n] == '•')
                        k++;
                }
            }

            if (k > 0)  x[i][j] = k; 
        }
    }
}

function exposeAll() {
    for (i = 0; i < row; i++) {
        for(j = 0; j < col; j++) {
            document.getElementById(i + "." + j).innerHTML = x[i][j];
        }
    }
}



// cell specific

function exposeCell(r, c) {
    var cell = document.getElementById(r + "." + c);
    
    if (getComputedStyle(cell, null).background.includes("rgb(255, 255, 255)"))
        return;
    
    cell.style.background = "#fff";
    cell.style.color = "#000";
    
    // bomb
    if (x[r][c] == "•") {
        exposeAll();
    }

    // number
    else if (x[r][c] != "") {
        cell.innerHTML = x[r][c];
    }
    
    // empty
    else {
        r = parseInt(r);
        c = parseInt(c);
        
        for (m = -1; m <= 1; m++) {
            if ((r + m) < 0 || (r + m) >= row)
                continue;
            
            for (n = -1; n <= 1; n++) {
                if ((c + n) < 0 || (c + n) >= col || (m == 0 && n == 0))
                    continue;
                
                exposeCell(r + m, c + n);
            }
        }
    }
}
