class Sudoku {
    /** Maximum dimension value of the longest size of the sudoku wrapper. */
    static MAXSIZE = Math.min(window.innerWidth, window.innerHeight);
    /** Dimension of each board cell. */
    static CELLSIZE = 75;

    constructor() {
        /** Matrix of initial unfilled board. */
        this.initVals = null;
        /** Matrix of final filled board. */
        this.finalVals = null;
        /** Stores the cell matrix. */
        this.grid = null;

        /** Stores [row, col] of selected cell. */
        this.selectedCell = [-1, -1];
        /** Stores whether number row is in value entry mode or not (guess entry mode). */
        this.isValueMode = true;
        /** Stores count of times hint is taken. */
        this.hintsTaken = 0;
        /** Stores count of value filled cells. */
        this.numFilled = 0;
        /** Stores count of errors made. */
        this.wrongCount = 0;
        /** Stores count of each number's presence. */
        this.numCount = null;
        /** Stores whether game is complete (won). */
        this.complete = false;
        /** Stores whether game is over (lost). */
        this.gameover = false;

        this.reset();

        this.initDOM();
    }

    /**
     * Initializes the DOM of the sudoku board.
     */
    initDOM() {
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
        reset.onclick = () => {
            this.reset();
            this.refreshBoard();
        };
        headBar.appendChild(reset);

        const status = document.createElement('span');
        status.id = 'status';
        headBar.appendChild(status);

        const hint = document.createElement('div');
        hint.id = 'btn-hint';
        hint.onclick = () => this.onClick('btn-hint');
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
            cell.onclick = () => this.onClick('cell', [row, col]);
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
        mode.onclick = () => this.onClick('btn-mode');
        numbar.appendChild(mode);

        const buttons = document.createElement('div');
        buttons.id = 'num-buttons';
        numbar.appendChild(buttons);

        for (let i = 0; i < 9; i++) {
            const btnNum = document.createElement('div');
            btnNum.id = `btn-${i + 1}`;
            btnNum.className = 'btn-num num-bar-btn';
            btnNum.onclick = () => this.onClick('num-btn', i + 1);
            buttons.appendChild(btnNum);

            const btnVal = document.createElement('span');
            btnVal.className = 'btn-value';
            btnVal.innerHTML = i + 1 + '';
            btnNum.appendChild(btnVal);
        }

        const erase = document.createElement('div');
        erase.className = 'num-bar-btn';
        erase.id = 'btn-erase';
        erase.onclick = () => this.onClick('btn-erase');
        numbar.appendChild(erase);

        // Draw square borders.
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const temp = $('#cell-' + i + '-' + j);
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

        setTimeout(() => this.refreshBoard());
    }

    /**
     * Redraws board corresponding to current state.
     */
    refreshBoard() {
        // Draw cells.
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                // Clear cell.
                $(`#cell-${i}-${j}`).css('box-shadow', 'none');

                // Draw unwritable cell.
                if (!this.grid[i][j].writable) {
                    $(`#cell-${i}-${j}`).css({
                        background: 'beige',
                        color: 'midnightblue'
                    });
                } else {
                    $(`#cell-${i}-${j}`).css('cursor', 'pointer');
                    $(`#value-${i}-${j}`).css(
                        'color',
                        this.grid[i][j].isValWrong ? 'firebrick' : 'darkgreen'
                    );
                    if (this.grid[i][j].hintPlaced) {
                        $(`#value-${i}-${j}`).css('color', 'darkcyan');
                    }
                }

                if (!this.grid[i][j].isGuessed) {
                    // Write value.
                    $(`#value-${i}-${j}`).html(
                        this.grid[i][j].value !== 0 ? this.grid[i][j].value : ''
                    );

                    // Remove guesses.
                    for (let m = 0; m < 3; m++) {
                        for (let n = 0; n < 3; n++) {
                            $(`#guess-${i}-${j}-${m}-${n}`).css({
                                visibility: 'hidden'
                            });
                        }
                    }
                } else {
                    // Remove value.
                    $(`#value-${i}-${j}`).html('');

                    // Show guesses.
                    for (let m = 0; m < 3; m++) {
                        for (let n = 0; n < 3; n++) {
                            $(`#guess-${i}-${j}-${m}-${n}`).css({
                                visibility: this.grid[i][j].guess[3 * m + n] ? 'visible' : 'hidden'
                            });
                        }
                    }
                }
            }
        }

        // Draw selected cell marker.
        $(`#cell-${this.selectedCell[0]}-${this.selectedCell[1]}`).css({
            'box-shadow': '0 0 3px 4px royalblue inset'
        });

        // Draw mode button.
        $('#btn-mode').css({
            background: `oldlace url("images/btn-${
                this.isValueMode ? 'write' : 'guess'
            }.png") no-repeat center`,
            'background-size': '26px 26px'
        });

        // Status bar text.
        $('#status').html(this.gameover ? 'GAME OVER' : this.complete ? 'COMPLETE' : 'RUNNING');

        // Draw game end cover over number grid.
        if (this.gameover || this.complete) {
            $('#overlay').css('visibility', 'visible');
            $('.num-bar-btn').css({
                'box-shadow': '0 0 0 0 #000',
                cursor: 'default'
            });
            $('#btn-hint').css({
                cursor: 'default'
            });
        } else {
            $('#overlay').css('visibility', 'hidden');
            $('.num-bar-btn.hover').css({
                'box-shadow': '0 0 2px #000',
                cursor: 'pointer'
            });
            $('#btn-hint').css({
                cursor: 'pointer'
            });
        }
    }

    /**
     * Resets the game state.
     */
    reset() {
        this.isValueMode = true;
        this.hintsTaken = 0;
        this.numFilled = 0;
        this.wrongCount = 0;
        this.numCount = new Array(9).fill(0);
        this.complete = false;
        this.gameover = false;

        class Cell {
            constructor() {
                this.value = 0;
                this.guess = new Array(9).fill(false);
                this.writable = true;
                this.isGuessed = false;
                this.isValWrong = false;
                this.hintPlaced = false;
            }
        }

        this.grid = new Array(9);
        for (let i = 0; i < 9; i++) {
            this.grid[i] = new Array(9);
            for (let j = 0; j < 9; j++) {
                this.grid[i][j] = new Cell();
            }
        }

        /**
         * Creates a new sudoku matrix and fills initVals and finalVals.
         * Empty cells empty have value 0; those cells are writable.
         */
        const SetupGrid = () => {
            this.initVals = new Array(9);
            this.initVals[0] = [7, 0, 0, 0, 0, 0, 8, 0, 0];
            this.initVals[1] = [3, 4, 9, 8, 5, 6, 0, 2, 0];
            this.initVals[2] = [0, 0, 5, 1, 0, 0, 6, 4, 9];
            this.initVals[3] = [5, 2, 0, 0, 4, 8, 9, 3, 6];
            this.initVals[4] = [0, 3, 7, 0, 0, 0, 4, 1, 8];
            this.initVals[5] = [8, 9, 0, 0, 0, 0, 0, 7, 2];
            this.initVals[6] = [1, 5, 3, 0, 0, 9, 7, 0, 0];
            this.initVals[7] = [0, 0, 0, 0, 0, 1, 0, 0, 0];
            this.initVals[8] = [0, 7, 0, 0, 8, 5, 3, 6, 0];

            this.finalVals = new Array(9);
            this.finalVals[0] = [7, 1, 6, 9, 2, 4, 8, 5, 3];
            this.finalVals[1] = [3, 4, 9, 8, 5, 6, 1, 2, 7];
            this.finalVals[2] = [2, 8, 5, 1, 3, 7, 6, 4, 9];
            this.finalVals[3] = [5, 2, 1, 7, 4, 8, 9, 3, 6];
            this.finalVals[4] = [6, 3, 7, 5, 9, 2, 4, 1, 8];
            this.finalVals[5] = [8, 9, 4, 6, 1, 3, 5, 7, 2];
            this.finalVals[6] = [1, 5, 3, 2, 6, 9, 7, 8, 4];
            this.finalVals[7] = [4, 6, 8, 3, 7, 1, 2, 9, 5];
            this.finalVals[8] = [9, 7, 2, 4, 8, 5, 3, 6, 1];

            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    const value = this.initVals[i][j];
                    if (value === 0) {
                        this.grid[i][j].writable = true;
                    } else {
                        this.grid[i][j].writable = false;
                        this.grid[i][j].value = value;
                        this.numCount[value - 1]++;
                        this.numFilled++;
                    }
                }
            }
        };
        SetupGrid();

        // Mark the first writable cell as selected.
        outer: for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.grid[i][j].writable) {
                    this.selectedCell = [i, j];
                    break outer;
                }
            }
        }
    }

    /**
     * Expose an empty cell's value.
     */
    hintExpose() {
        if (this.hintsTaken === 3) {
            this.gameover = true;
            return;
        }

        let emptyCount = 0;
        let wrongCount = 0;

        // Store number of empty and wrongly filled cells.
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.grid[i][j].value === this.finalVals[i][j]) continue;

                if (this.grid[i][j].value === 0) {
                    emptyCount++;
                } else if (this.grid[i][j].value !== this.finalVals[i][j]) {
                    wrongCount++;
                }
            }
        }

        let row, col;
        if (emptyCount !== 0) {
            // Find an empty cell if there exists any.
            let temp = 1 + Math.floor(Math.random() * emptyCount);
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    if (this.grid[i][j].value == 0) {
                        if (--temp === 0) {
                            [row, col] = [i, j];
                        }
                    }
                }
            }
        } else {
            // Find a wrongly filled cell if no empty cells exist.
            let temp = 1 + Math.floor(Math.random() * wrongCount);
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    if (this.grid[i][j].value !== this.finalVals[i][j]) {
                        if (--temp === 0) {
                            [row, col] = [i, j];
                        }
                    }
                }
            }
        }

        // Fill spotted cell with correct value.
        this.grid[row][col].value = this.finalVals[row][col];
        this.grid[row][col].hintPlaced = true;
        this.hintsTaken++;
        this.numCount[this.finalVals[row][col] - 1]++;

        $('#value-' + row + '-' + col).css('color', 'gray');
    }

    /**
     * Checks whether new value entered is valid (unique in row, column, square).
     * @param {number} row - row index
     * @param {number} col - column index
     */
    checkIfValid(row, col) {
        // Check for duplicate value in column.
        for (let i = 0; i < 9; i++) {
            if (i === col) continue;

            if (this.grid[row][i].value === this.grid[row][col].value) {
                this.grid[row][col].isValWrong = true;
                this.wrongCount++;
                return;
            }
        }

        // Check for duplicate value in row.
        for (let i = 0; i < 9; i++) {
            if (i === row) continue;

            if (this.grid[i][col].value === this.grid[row][col].value) {
                this.grid[row][col].isValWrong = true;
                this.wrongCount++;
                return;
            }
        }

        /** Square starting row index. */
        const srow = row - (row % 3);
        /** Square starting column index. */
        const scol = col - (col % 3);

        // Check for duplicate value in square.
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (srow + i === row && scol + j === col) continue;

                if (this.grid[srow + i][scol + j].value === this.grid[row][col].value) {
                    this.grid[row][col].isValWrong = true;
                    this.wrongCount++;
                    return;
                }
            }
        }

        this.grid[row][col].isValWrong = false;
    }

    /**
     * Checks if board is complete (game won).
     */
    checkComplete() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.grid[i][j].value !== this.finalVals[i][j]) {
                    this.complete = false;
                    return;
                }
            }
        }
        this.complete = true;
    }

    /**
     * Custom click event handler.
     * @param {string} target - click target
     * @param {?number|[number, number]} vals - additional data supplied
     */
    onClick(target, vals) {
        // All buttons except reset are disabled if game is won or lost.
        if (this.complete || this.gameover) return;

        let cell;
        switch (target) {
            case 'btn-hint':
                this.hintExpose();
                this.refreshBoard();
                break;
            case 'btn-mode':
                this.isValueMode = !this.isValueMode;
                this.refreshBoard();
                break;
            case 'btn-erase':
                cell = this.grid[this.selectedCell[0]][this.selectedCell[1]];
                if (cell.value !== 0) {
                    this.numCount[cell.value - 1]--;
                    this.numFilled--;
                }
                // Clear selected cell's value.
                cell.value = 0;
                // Clear selected cell's guesses.
                cell.guess.fill(false);
                cell.isGuessed = false;
                this.refreshBoard();
                break;
            case 'num-btn':
                const btnNum = vals;
                cell = this.grid[this.selectedCell[0]][this.selectedCell[1]];

                if (this.isValueMode) {
                    // Remove cell guess values.
                    cell.guess.fill(false);
                    cell.isGuessed = false;
                    // Remove cell value.
                    if (cell.value !== 0) {
                        this.numCount[cell.value - 1]--;
                        this.numFilled--;
                        cell.hintPlaced = false;
                        cell.value = 0;
                    }
                    // Enter cell value.
                    cell.value = btnNum;
                    this.numCount[btnNum - 1]++;
                    this.numFilled++;

                    this.checkIfValid(this.selectedCell[0], this.selectedCell[1]);

                    if (this.wrongCount === 5) this.gameover = true;
                    if (this.numFilled === 81) this.checkComplete();
                } else {
                    // Remove cell value.
                    if (cell.value !== 0) {
                        this.numCount[cell.value - 1]--;
                        this.numFilled--;
                        cell.value = 0;
                    }
                    // Toggle cell guess value.
                    cell.guess[btnNum - 1] = !cell.guess[btnNum - 1];
                    for (let i = 0; i < 9; i++) {
                        if (cell.guess[i]) {
                            cell.isGuessed = true;
                            break;
                        }
                        cell.isGuessed = false;
                    }
                }

                this.refreshBoard();
                break;
            case 'cell':
                if (this.grid[vals[0]][vals[1]].writable) {
                    this.selectedCell = [...vals];
                }
                this.refreshBoard();
        }
    }
}

new Sudoku();
