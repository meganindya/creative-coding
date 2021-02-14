const MAXSIZE = Math.min(window.innerWidth, window.innerHeight);

class Sudoku {
    constructor() {
        if (this._instance) return this;
        this._instance = this;

        setTimeout(this._initDOM());
    }

    _initDOM() {
        /*
        sudoku
            head-bar
                btn-reset
                status
                btn-hint
            num-grid
                board
                overlay
            num-bar
                btn-mode
                num-buttons
                btn-erase
        */

        const wrapper = document.createElement('div');
        wrapper.id = 'sudoku';
        document.body.appendChild(wrapper);

        const headBar = document.createElement('div');
        headBar.id = 'head-bar';
        wrapper.appendChild(headBar);

        const reset = document.createElement('div');
        reset.id = 'btn-reset';
        headBar.appendChild(reset);

        const status = document.createElement('span');
        status.id = 'status';
        headBar.appendChild(status);

        const hint = document.createElement('div');
        hint.id = 'btn-hint';
        headBar.appendChild(hint);

        const numgrid = document.createElement('div');
        numgrid.id = 'num-grid';
        wrapper.appendChild(numgrid);

        const board = document.createElement('div');
        board.id = 'board';
        numgrid.appendChild(board);

        const overlay = document.createElement('div');
        overlay.id = 'overlay';
        numgrid.appendChild(overlay);

        const CreateCell = (row, col) => {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.id = 'cell-' + row + '-' + col;
            board.appendChild(cell);

            const value = document.createElement('span');
            value.className = 'cell-value';
            value.id = 'value-' + row + '-' + col;
            cell.appendChild(value);

            const guesses = document.createElement('div');
            guesses.className = 'guess-grid';
            cell.appendChild(guesses);

            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    const guess = document.createElement('span');
                    guess.className = 'guess-value';
                    guess.id = 'guess-' + row + '-' + col + '-' + i + '-' + j;
                    guess.innerHTML = 1 + i * 3 + j + '';
                    guesses.appendChild(guess);
                }
            }
        };

        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                CreateCell(i, j);
            }
        }

        const numbar = document.createElement('div');
        numbar.id = 'num-bar';
        wrapper.appendChild(numbar);

        const mode = document.createElement('div');
        mode.className = 'num-bar-btn';
        mode.id = 'btn-mode';
        numbar.appendChild(mode);

        const buttons = document.createElement('div');
        buttons.id = 'num-buttons';
        numbar.appendChild(buttons);

        for (let i = 0; i < 9; i++) {
            const btnNum = document.createElement('div');
            btnNum.id = 'btn-' + (i + 1);
            btnNum.className = 'btn-num num-bar-btn';
            buttons.appendChild(btnNum);

            const btnVal = document.createElement('span');
            btnVal.className = 'btn-value';
            btnVal.innerHTML = i + 1 + '';
            btnNum.appendChild(btnVal);
        }

        const erase = document.createElement('div');
        erase.className = 'num-bar-btn';
        erase.id = 'btn-erase';
        numbar.appendChild(erase);

        // square borders

        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                var temp = $('#cell-' + i + '-' + j);

                if (i == 2 || i == 5) {
                    temp.css('border-bottom', '4px solid gray');
                } else if (i == 3 || i == 6) {
                    temp.css('border-top', '4px solid gray');
                }

                if (j == 2 || j == 5) {
                    temp.css('border-right', '4px solid gray');
                } else if (j == 3 || j == 6) {
                    temp.css('border-left', '4px solid gray');
                }
            }
        }
    }
}

new Sudoku();

setTimeout(async () => await import('./game.js'));
