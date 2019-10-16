var x;
$(document).ready(function(){
    initialDraw();
    var row = 8, col = 8, mines = 10;
    addGrid(row, col);
    addMines(mines, row, col);
    addNumbers(row, col);
    allShown(row, col);
});

$(document).click(function(event){
    if($(event.target).hasClass("cell")){
        var coord = event.target.id.split(".");
        exposeCell(coord[0], coord[1]);
    }
});

function allShown(r, c){
    for(i = 0; i < r; i++){
        for(j = 0; j < c; j++)
            document.getElementById(i + "." + j).innerHTML = x[i][j];
    }
}

function exposeCell(r, c){
    var cell = document.getElementById(r + "." + c);
    if(getComputedStyle(cell, null).background.includes("rgb(255, 255, 255)"))
        return;
    console.log(r, c);
    cell.style.background = "#fff";
    cell.style.color = "#000";
    if(x[r][c] == "•"){
        //Bomb
    }
    else if(x[r][c] != ""){
        cell.innerHTML = x[r][c];
    }
    else{
        row = x.length, col = x[0].length;
        r = parseInt(r); c = parseInt(c);
        for(m = -1; m <= 1; m++){
            if((r + m) < 0 || (r + m) >= row) continue;
            for(n = -1; n <= 1; n++){
                if((c + n) < 0 || (c + n) >= col || (m == 0 && n == 0))   continue;
                console.log("---", r, c);
                if(m == 1 && n == 1)    console.log("end", r, c);
                exposeCell(r + m, c + n);
            }
        }
    }
}

function addNumbers(r, c){
    for(i = 0; i < r; i++){
        for(j = 0; j < c; j++){
            if(x[i][j] == '•')  continue;
            var k = 0;
            for(m = -1; m <= 1; m++){
                if((i + m) < 0 || (i + m) >= r) continue;
                for(n = -1; n <= 1; n++){
                    if((j + n) < 0 || (j + n) >= c || (m == 0 && n == 0))   continue;
                    if(x[i + m][j + n] == '•')  k++;
                }
            }
            if(k > 0)   x[i][j] = k; 
        }
    }
}

function addMines(n, r, c){
    for(i = 0; i < n; i++){
        var row = Math.floor(Math.random() * r);
        var col = Math.floor(Math.random() * c);
        if(x[row][col] != '•')    x[row][col] = '•';
        else{   i--; continue;  }
    }
    console.log(x);
}

function addGrid(r, c){
    x = new Array(r);
    for(i = 0; i < x.length; i++)
        x[i] = new Array(c);
    for(i = 0; i < x.length; i++){
        for(j = 0; j < x[i].length; j++)
            x[i][j] = "";
    }
    console.log(x);
    for(i = 0; i < r; i++){
        for(j = 0; j < c; j++)
            addBlock(i, j);
    }
}

function addBlock(r, c){
    var div = document.createElement("div");
    div.id = r + "." + c;
    div.className = "cell";
    document.getElementById("outer").appendChild(div);
}

function initialDraw(){
    var div = document.createElement("div");
    div.id = "outer";
    div.className = "clearfix";
    document.body.appendChild(div);
    div = document.createElement("div");
    div.className = "heading";
    document.getElementById("outer").appendChild(div);
}