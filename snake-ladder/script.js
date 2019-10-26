var jumpToCell;

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

    jumpToCell[ 2] = 22; jumpToCell[ 9] = 29; jumpToCell[17] =  5;
    jumpToCell[20] = 41; jumpToCell[32] =  8; jumpToCell[36] = 56;
    jumpToCell[48] = 26; jumpToCell[49] = 72; jumpToCell[57] = 46;
    jumpToCell[59] = 79; jumpToCell[61] = 37; jumpToCell[64] = 84;
    jumpToCell[65] = 50; jumpToCell[71] = 91; jumpToCell[75] = 95;
    jumpToCell[93] = 69; jumpToCell[97] = 78; jumpToCell[99] = 80;


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
    playerPosOld = [undefined, undefined];
    playerPosNew = [1, 1];
    playerPosJmp = [undefined, undefined];
    playerActive = [true, false];

    diceNum = 6;

    gameover = false;
    winner = undefined;
}







$(document).click(function(event) {
    var curr = $(event.target);

    if (curr.attr('id') == 'reset') {
        reset();
        refreshBoard();
    }

    if (gameover)   return;

    if (curr.attr('id') == 'dice') {
        diceRoll();
    }

    refreshBoard();
});








function diceRoll() {
    diceNum = 1 + Math.floor(Math.random() * 6);

    var activePlayer;
    if (playerActive[0])    activePlayer = 0;
    else                    activePlayer = 1;

    console.log(diceNum, playerActive[0] ? "Player 1" : "Player 2");


    playerPosOld[0] = playerPosNew[0];
    playerPosOld[1] = playerPosNew[1];


    if (playerStarted[activePlayer]) {
        var newPos = playerPosNew[activePlayer] + diceNum;
        if (newPos <= 100)
            playerPosNew[activePlayer] = newPos;

        if (newPos == 100) {
            gameover = true;
            winner = activePlayer;

            return;
        }
    }

    else if (!playerStarted[activePlayer] && diceNum == 6) {
        playerStarted[activePlayer] = true;

        diceRoll();
        return;
    }


    playerActive = [!playerActive[0], !playerActive[1]];
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

            var reset = document.createElement('div');
                reset.id = 'reset';
            headbar.appendChild(reset);

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

        var dice = document.createElement('div');
            dice.id = 'dice';
        wrapper.appendChild(dice);
}


function refreshBoard() {
    if (!gameover) {
        if (playerActive[0])
            $('#status').html("TURN&nbsp;&nbsp;&nbsp;PLAYER&nbsp;&nbsp;1");
        else
            $('#status').html("TURN&nbsp;&nbsp;&nbsp;PLAYER&nbsp;&nbsp;2");

        $('#status').css('background', 'midnightblue');
    }

    else {
        if (winner == 0)
            $('#status').html("WINNER&nbsp;&nbsp;&nbsp;PLAYER&nbsp;&nbsp;1");
        else
            $('#status').html("WINNER&nbsp;&nbsp;&nbsp;PLAYER&nbsp;&nbsp;2");

        $('#status').css('background', 'darkgreen');
    }


    $('#dice').css({
        'background': 'url(\'images/dice-' + diceNum + '.png\') no-repeat center',
        'background-size':'cover'
    });


    var playerCoordinate;

    playerCoordinate = getCoordFromPos(playerPosNew[0]);
    $('#player1').css({
        'left': playerOffset[0][0] + playerCoordinate[1] * cellSize,
        'bottom': playerOffset[0][1] + playerCoordinate[0] * cellSize
    });

    playerCoordinate = getCoordFromPos(playerPosNew[1]);
    $('#player2').css({
        'left': playerOffset[1][0] + playerCoordinate[1] * cellSize,
        'bottom': playerOffset[1][1] + playerCoordinate[0] * cellSize
    });
}