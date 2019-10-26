var jumpToCell;
var playerPosOld;
var playerPosNew;
var playerActive;

var diceNum;

var gameover;
var winner;


var boardSize;
var cellSize;
var boardOffset;
var playerOffset;
var playerSize;







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
    playerPosOld = [undefined, undefined];
    playerPosNew = [1, 1];
    playerActive = [true, false];

    diceNum = 6;

    gameover = false;
    winner = undefined;
}







$(document).click(function(event) {
    var curr = $(event.target);

    if (curr.attr('id') == 'dice') {
        diceNum = 1 + Math.floor(Math.random() * 6);

        /*playerPosOld = playerPosNew;

        var activePlayer;
        if (playerActive[0])    activePlayer = 0;
        else                    activePlayer = 1;

        var newPos = Math.min(playerPosNew[activePlayer] + dice, 100);*/


        playerActive = [!playerActive[0], !playerActive[1]];
    }

    refreshBoard();
});








function setupRender() {
    var wrapper = document.createElement('div');
        wrapper.id = 'wrapper';
    document.body.appendChild(wrapper);

        var headbar = document.createElement('div');
            headbar.id = 'head-bar';
        wrapper.appendChild(headbar);

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
    $('#dice').css({
        'background': 'url(\'images/dice-' + diceNum + '.png\') no-repeat center',
        'background-size':'cover'
    });


    $('#player1').css({
        'left': playerOffset[0][0],
        'bottom': playerOffset[0][1]
    });

    $('#player2').css({
        'left': playerOffset[1][0],
        'bottom': playerOffset[1][1]
    });
}