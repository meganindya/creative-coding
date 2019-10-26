var jumpcell = new Array(101);
jumpcell[ 2] = 22;
jumpcell[ 9] = 29;
jumpcell[17] =  5;
jumpcell[20] = 41;
jumpcell[32] =  8;
jumpcell[36] = 56;
jumpcell[48] = 26;
jumpcell[49] = 72;
jumpcell[57] = 46;
jumpcell[59] = 79;
jumpcell[61] = 37;
jumpcell[64] = 84;
jumpcell[65] = 50;
jumpcell[71] = 91;
jumpcell[75] = 95;
jumpcell[93] = 69;
jumpcell[97] = 78;
jumpcell[99] = 80;








$('document').ready(function() {
    setupRender();
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