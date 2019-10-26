var jumpToCell;
var jumps;
var isSnake;

var boardSize;
var cellSize;
var boardOffset;
var playerOffset;
var playerSize;




var playerStarted;
var playerPosOld;
var playerPosNew;
var playerPosJmp;
var playerActive;

var diceNum;
var count6s;
var repeatThrow;
var diceLocked;

var gameover;
var winner;










$(document).ready(function() {
    initVars();
    reset();

    setupRender();
    refreshBoard();
});

function initVars() {
    jumpToCell = new Array(101);
    jumps = new Array(101);

    jumpToCell[ 2] = 22; jumpToCell[ 9] = 29; jumpToCell[20] = 41;
    jumpToCell[36] = 56; jumpToCell[49] = 72; jumpToCell[59] = 79;
    jumpToCell[64] = 84; jumpToCell[71] = 91; jumpToCell[75] = 95;

    jumpToCell[17] =  5; jumpToCell[32] =  8; jumpToCell[48] = 26;
    jumpToCell[57] = 46; jumpToCell[61] = 37; jumpToCell[65] = 50;
    jumpToCell[93] = 69; jumpToCell[97] = 78; jumpToCell[99] = 80;
    


    jumps[ 2] = [19, 22];
    jumps[ 9] = [12, 29];
    jumps[20] = [21, 40, 41];
    jumps[36] = [45, 56];
    jumps[49] = [52, 69, 72];
    jumps[59] = [62, 79];
    jumps[64] = [77, 84];
    jumps[71] = [90, 91];
    jumps[75] = [86, 95];

    jumps[17] = [16, 15, 14, 7, 6, 5];
    jumps[32] = [31, 30, 11, 12, 13, 8];
    jumps[48] = [47, 34, 35, 26];
    jumps[57] = [44, 45, 46];
    jumps[61] = [62, 63, 58, 43, 42, 39, 38, 37];
    jumps[65] = [66, 55, 54, 53, 52, 51, 50];
    jumps[93] = [94, 87, 88, 73, 74, 67, 68, 69];
    jumps[97] = [96, 85, 76, 77, 78];
    jumps[99] = [82, 81, 80];

    for (var i = 1; i < 101; i++) {
        if (jumps[i] != undefined) {
            for (var j = 0; j < 2; j++)
                jumps[i].unshift(i);
        }
    }

    isSnake = new Array(101);
    for (var i = 1; i < 101; i++)
        isSnake[i] = false;

    isSnake[17] = isSnake[32] = isSnake[48] = true;
    isSnake[57] = isSnake[61] = isSnake[65] = true;
    isSnake[93] = isSnake[97] = isSnake[99] = true;



    boardSize = 2000 / 3;
    cellSize = boardSize * 0.09;

    boardOffset = boardSize * 0.05;
    playerOffset = [
        [boardOffset + (cellSize / 2), boardOffset + (cellSize / 2)],
        [boardOffset + (cellSize / 2), boardOffset + (cellSize / 2)]
    ];

    playerSize = cellSize * 0.5;
    playerOffset[0][0] -= playerSize / 2;
    playerOffset[1][0] -= playerSize / 2;
    playerOffset[0][1] -= playerSize;
}

function reset() {
    playerStarted = [false, false];
    playerPosOld = [1, 1];
    playerPosNew = [1, 1];
    playerPosJmp = [1, 1];
    playerActive = [true, false];

    diceNum = 6;
    count6s = 0;
    repeatThrow = true;
    diceLocked = false;

    gameover = false;
    winner = undefined;
}







$(document).click(function(event) {
    var curr = $(event.target);

    if (curr.attr('id') == 'reset') {
        reset();
        refreshBoard();

        return;
    }

    if (gameover)   return;

    if (curr.attr('id') == 'dice') {
        if (!diceLocked)    diceRoll();
    }
});








function diceRoll() {
    diceLocked = true;
    $('#dice').css('cursor', 'default');

    diceNum = 1 + Math.floor(Math.random() * 6);
    


    var activePlayer = playerActive[0] ? 0 : 1;

    if (playerStarted[activePlayer]) {
        playerPosOld[activePlayer] = playerPosJmp[activePlayer];


        var newPos = playerPosJmp[activePlayer] + diceNum;

        if (newPos == 100) {
            gameover = true;
            winner = activePlayer;

            playerPosNew[activePlayer] = playerPosJmp[activePlayer] = 100;

            animateDice();
            return;
        }

        if (newPos <= 100)
            playerPosNew[activePlayer] = newPos;


        if (jumpToCell[newPos] != undefined)
            playerPosJmp[activePlayer] = jumpToCell[newPos];

        else
            playerPosJmp[activePlayer] = playerPosNew[activePlayer];
        
        
        if (diceNum == 6 && count6s != 3 && !isSnake(playerPosNew[activePlayer])) {
            repeatThrow = true;
            count6s++;
        }
    }

    else if (!playerStarted[activePlayer] && diceNum == 6) {
        playerStarted[activePlayer] = true;
        repeatThrow = true;
    }

    
    animateDice();
}


function getCoordFromPos(pos) {
    var row, col;

    if (pos % 10 == 0) {
        row = Math.floor(pos / 10) - 1;

        if (row % 2 == 0)   col = 9;
        else                col = 0;
    }

    else {
        row = Math.floor(pos / 10);

        if (row % 2 == 0)   col = (pos % 10) - 1;
        else                col = 10 - (pos % 10);
    }

    return [row, col];
}








function setupRender() {
    var wrapper = document.createElement('div');
        wrapper.id = 'wrapper';
    document.body.appendChild(wrapper);

        var headbar = document.createElement('div');
            headbar.id = 'head-bar';
        wrapper.appendChild(headbar);

            var status = document.createElement('div');
                status.id = 'status';
            headbar.appendChild(status);

        var board = document.createElement('div');
            board.id = 'board';
        wrapper.appendChild(board);

            var player1 = document.createElement('div');
                player1.className = 'player';
                player1.id = 'player1';
                player1.innerHTML = '1';
            board.appendChild(player1);

            var player2 = document.createElement('div');
                player2.className = 'player';
                player2.id = 'player2';
                player2.innerHTML = '2';
            board.appendChild(player2);

        var footbar = document.createElement('div');
            footbar.id = 'foot-bar';
        wrapper.appendChild(footbar);

            var reset = document.createElement('div');
                reset.id = 'reset';
            footbar.appendChild(reset);

            var dicebox = document.createElement('div');
                dicebox.id = 'dicebox';
            footbar.appendChild(dicebox);

            var turn = document.createElement('div');
                turn.id = 'turn';
            footbar.appendChild(turn);

            var dice = document.createElement('div');
                dice.id = 'dice';
            footbar.appendChild(dice);
    
    
    $('#player1').css({
        'left': playerOffset[0][0],
        'bottom': playerOffset[0][1]
    });
    
    $('#player2').css({
        'left': playerOffset[1][0],
        'bottom': playerOffset[1][1]
    });
}


function animateDice() {
    var diceAnimOrder = [4, 1, 3, 2, 5, 6, 1, 4, 5, 3, 2, 6, 3];
    diceAnimOrder.push(diceNum);
    var animPos = 0;

    var diceAnim = setInterval(function () {
        if (animPos == diceAnimOrder.length) {
            clearInterval(diceAnim);
            
            animateMove();
        }

        else
            $('#dice').css({
                'background': 'url(\'images/dice-' + diceAnimOrder[animPos++] + '.png\') no-repeat center',
                'background-size': 'cover'
            });
    }, 25);
}


function animateMove() {
    var activePlayer = playerActive[0] ? 0 : 1;

    var initPos = playerPosOld[activePlayer];
    var finalPos = playerPosNew[activePlayer];
    
    var moveAnim = setInterval(function() {
        if (initPos == finalPos) {
            clearInterval(moveAnim);

            animateJump();
        }

        else {
            var playerCoordinate = getCoordFromPos(++initPos);
            $('#player' + (activePlayer + 1) + '').css({
                'left': playerOffset[activePlayer][0] + playerCoordinate[1] * cellSize,
                'bottom': playerOffset[activePlayer][1] + playerCoordinate[0] * cellSize
            });
        }
    }, 200);
}

function animateJump() {
    var activePlayer = playerActive[0] ? 0 : 1;

    if (playerPosNew[activePlayer] == playerPosJmp[activePlayer]) {
        refreshBoard();
        return;
    }


    var currPos = playerPosNew[activePlayer];
    var jumpPos = jumps[currPos];
    var jumpInd = 0;

    var jumpAnim = setInterval(function() {
        if (jumpInd == jumpPos.length) {
            clearInterval(jumpAnim);
            refreshBoard();
        }
    
        else {
            var playerCoordinate = getCoordFromPos(jumpPos[jumpInd++]);
    
            $('#player' + (activePlayer + 1) + '').css({
                'left': playerOffset[activePlayer][0] + playerCoordinate[1] * cellSize,
                'bottom': playerOffset[activePlayer][1] + playerCoordinate[0] * cellSize
            });
        }
    }, 100);
}


function refreshBoard() {
    if (!repeatThrow)
        playerActive = [!playerActive[0], !playerActive[1]];
    else
        repeatThrow = false;



    var playerCoordinate;

    playerCoordinate = getCoordFromPos(playerPosJmp[0]);
    $('#player1').css({
        'left': playerOffset[0][0] + playerCoordinate[1] * cellSize,
        'bottom': playerOffset[0][1] + playerCoordinate[0] * cellSize
    });
    
    playerCoordinate = getCoordFromPos(playerPosJmp[1]);
    $('#player2').css({
        'left': playerOffset[1][0] + playerCoordinate[1] * cellSize,
        'bottom': playerOffset[1][1] + playerCoordinate[0] * cellSize
    });


    $('#dice').css({
        'background': 'url(\'images/dice-' + diceNum + '.png\') no-repeat center',
        'background-size': 'cover'
    });

    
    if (!gameover) {
        if (playerActive[0])
            $('#turn').html("1");
        else
            $('#turn').html("2");

        $('#status').css('visibility', 'hidden');
        $('#dice').css('cursor', 'pointer');
    }

    else {
        if (winner == 0)
            $('#status').html("WINNER&nbsp;&nbsp;&nbsp;PLAYER&nbsp;&nbsp;1");
        else
            $('#status').html("WINNER&nbsp;&nbsp;&nbsp;PLAYER&nbsp;&nbsp;2");

        $('#status').css('visibility', 'visible');
    }

    diceLocked = false;
}