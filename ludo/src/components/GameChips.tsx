import React, { useEffect, useState } from 'react';
import Chip from './Chip';

// -- Component ------------------------------------------------------------------------------------

export default function PlayerChips(props: {
  arrangementScheme: { [key: string]: string };
  blockSize: number;
}): JSX.Element {
  // -- Position utilities -----------------------------------------------------

  /** Stores start cell indices for each type on game map. */
  const startCellIndices: { [key: string]: { row: number; col: number } } = {
    'top-left': { row: 6, col: 1 },
    'top-right': { row: 1, col: 8 },
    'bottom-left': { row: 13, col: 6 },
    'bottom-right': { row: 8, col: 13 }
  };

  /** Stores base cell indices for each type and index in type on game map. */
  const baseCellIndices: { [key: string]: { [key: string]: { row: number; col: number } } } = {};
  ['top-left', 'top-right', 'bottom-left', 'bottom-right'].forEach((position) => {
    [0, 1, 2, 3].forEach((index) => {
      const baseIndices: { [key: string]: { rowInit: number; colInit: number } } = {
        'top-left': { rowInit: 0, colInit: 5 },
        'top-right': { rowInit: 5, colInit: 14 },
        'bottom-left': { rowInit: 9, colInit: 0 },
        'bottom-right': { rowInit: 14, colInit: 9 }
      };
      const { rowInit, colInit } = baseIndices[position];

      const offsetMultiplier: { [key: string]: { rowOffMul: number; colOffMul: number } } = {
        'top-left': { rowOffMul: 1, colOffMul: -1 },
        'top-right': { rowOffMul: -1, colOffMul: -1 },
        'bottom-right': { rowOffMul: -1, colOffMul: 1 },
        'bottom-left': { rowOffMul: 1, colOffMul: 1 }
      };
      const { rowOffMul, colOffMul } = offsetMultiplier[position];

      let [rowOffset, colOffset] = [Math.floor(index / 2), index % 2];
      if (position === 'top-left' || position === 'bottom-right') {
        [rowOffset, colOffset] = [colOffset, rowOffset];
      }

      if (!baseCellIndices[position]) baseCellIndices[position] = {};
      baseCellIndices[position][(index + 1).toString()] = {
        row: rowInit + rowOffMul * (1.5 + rowOffset * 2),
        col: colInit + colOffMul * (1.5 + colOffset * 2)
      };
    });
  });

  /**
   * Returns position style property values (absolute positions on board).
   * @param indices - cell indices on game map.
   */
  const getAbsChipPos = (indices: { row: number; col: number }): { top: number; left: number } => {
    const absPos: { top: number; left: number } = {
      top: props.blockSize * (indices.row + 0.5),
      left: props.blockSize * (indices.col + 0.5)
    };

    if (indices.row % 1 !== 0 || indices.col % 1 !== 0) {
      absPos['top']++;
      absPos['left']++;
    }

    return absPos;
  };

  // /**
  //  * Returns whether a cell position is a safe cell.
  //  * @param indices - cell indices on game map.
  //  */
  // const isSafeCell = (indices: { row: number; col: number }): boolean => {
  //   return (
  //     Object.values(startCellIndices).find(
  //       (entry) => entry.row === indices.row && entry.col === indices.col
  //     ) !== undefined
  //   );
  // };

  // -- States -----------------------------------------------------------------

  /** A 15 x 15 array, entries of whose corresponds to the cells of the entire board. */
  const gameMapArray: { type: string; chipIndex: string }[][][] = new Array(15);
  for (let i = 0; i < 15; i++) {
    gameMapArray[i] = new Array(15);
    for (let j = 0; j < 15; j++) {
      gameMapArray[i][j] = [];
    }
  }
  const [gameMap, setGameMap] = useState(gameMapArray);

  const [playerTLPos, setPlayerTLPos] = useState(baseCellIndices['top-left']);
  const [playerTRPos, setPlayerTRPos] = useState(baseCellIndices['top-right']);
  const [playerBLPos, setPlayerBLPos] = useState(baseCellIndices['bottom-left']);
  const [playerBRPos, setPlayerBRPos] = useState(baseCellIndices['bottom-right']);

  // -- Position actions -------------------------------------------------------

  /** Maps type to position state hook. */
  const stateMap: { [key: string]: { [key: string]: { row: number; col: number } } } = {
    'top-left': playerTLPos,
    'top-right': playerTRPos,
    'bottom-left': playerBLPos,
    'bottom-right': playerBRPos
  };

  /** Maps type to update position state function hook. */
  const updateStateMap: {
    [key: string]: React.Dispatch<
      React.SetStateAction<{
        [key: string]: { row: number; col: number };
      }>
    >;
  } = {
    'top-left': setPlayerTLPos,
    'top-right': setPlayerTRPos,
    'bottom-left': setPlayerBLPos,
    'bottom-right': setPlayerBRPos
  };

  const startChip = (type: string, chipIndex: string) => {
    let newGameMap = gameMap;
    const { row, col } = startCellIndices[type];
    newGameMap[row][col].push({ type, chipIndex });
    setGameMap(newGameMap);

    updateStateMap[type]({ ...stateMap[type], [chipIndex]: startCellIndices[type] });
  };

  /**
   * Returns a chip's position after one move.
   * @param type - chip type.
   * @param chipIndex - chip index in it's type.
   */
  const getNextPos = (
    type: string,
    currentPos: { row: number; col: number }
  ): { row: number; col: number } => {
    let { row, col } = currentPos;

    if (
      Object.values(baseCellIndices[type]).find(
        (entry) => entry.row === currentPos.row && entry.col === currentPos.col
      ) !== undefined
    ) {
      return startCellIndices[type];
    }

    if (row === 7 && col === 6) 1;
    else if (row === 6 && col === 7) 1;
    else if (row === 7 && col === 8) 1;
    else if (row === 8 && col === 7) 1;
    else if (row === 7 && col === 0) {
      if (type === 'top-left') return { row: 7, col: 1 };
      row--;
    } else if (row === 0 && col === 7) {
      if (type === 'top-right') return { row: 1, col: 7 };
      col++;
    } else if (row === 14 && col === 7) {
      if (type === 'bottom-left') return { row: 13, col: 7 };
      col--;
    } else if (row === 7 && col === 14) {
      if (type === 'bottom-right') return { row: 7, col: 13 };
      row++;
    } else if (row === 6 && col === 5) {
      row--;
      col++;
    } else if (row === 0 && col === 6) {
      col++;
    } else if (row === 0 && col === 8) {
      row++;
    } else if (row === 5 && col === 8) {
      row++;
      col++;
    } else if (row === 6 && col === 14) {
      row++;
    } else if (row === 8 && col === 14) {
      col--;
    } else if (row === 8 && col === 9) {
      row++;
      col--;
    } else if (row === 14 && col === 8) {
      col--;
    } else if (row === 14 && col === 6) {
      row--;
    } else if (row === 9 && col === 6) {
      row--;
      col--;
    } else if (row === 8 && col === 0) {
      row--;
    } else if (row === 6 && col === 0) {
      col++;
    } else {
      if (row === 6) {
        col++;
      } else if (col === 6) {
        row--;
      } else if (col === 8) {
        row++;
      } else if (row === 8) {
        col--;
      } else if (row === 7) {
        if (col < 6) col++;
        else col--;
      } else if (col === 7) {
        if (row < 6) row++;
        else row--;
      }
    }

    return { row, col };
  };

  /**
   * Moves a chip one position ahead.
   * @param type - chip type.
   * @param chipIndex - chip index in it's type.
   * @param moves - number of moves.
   */
  const forwardChip = (type: string, chipIndex: string, moves = 1) => {
    let currentPos = stateMap[type][chipIndex],
      nextPos = currentPos;
    for (let i = 0; i < moves; i++) {
      nextPos = getNextPos(type, currentPos);
      currentPos = nextPos;
    }

    updateStateMap[type]({ ...stateMap[type], [chipIndex]: nextPos });
  };

  // -- On mount --------------------------------------------------------------

  useEffect(() => {
    startChip('top-left', '4');
    startChip('top-right', '4');
    startChip('bottom-left', '4');
    startChip('bottom-right', '4');
  }, []);

  // -- Render -----------------------------------------------------------------
  return (
    <React.Fragment>
      {Object.keys(playerTLPos).map((chipIndex) => (
        <Chip
          type="top-left"
          color={props.arrangementScheme['top-left']}
          index={chipIndex}
          position={getAbsChipPos(playerTLPos[chipIndex])}
          key={`player-${props.arrangementScheme['top-left']}-${chipIndex}`}
          updatePos={forwardChip}
        />
      ))}
      {Object.keys(playerTRPos).map((chipIndex) => (
        <Chip
          type="top-right"
          color={props.arrangementScheme['top-right']}
          index={chipIndex}
          position={getAbsChipPos(playerTRPos[chipIndex])}
          key={`player-${props.arrangementScheme['top-right']}-${chipIndex}`}
          updatePos={forwardChip}
        />
      ))}
      {Object.keys(playerBLPos).map((chipIndex) => (
        <Chip
          type="bottom-left"
          color={props.arrangementScheme['bottom-left']}
          index={chipIndex}
          position={getAbsChipPos(playerBLPos[chipIndex])}
          key={`player-${props.arrangementScheme['bottom-left']}-${chipIndex}`}
          updatePos={forwardChip}
        />
      ))}
      {Object.keys(playerBRPos).map((chipIndex) => (
        <Chip
          type="bottom-right"
          color={props.arrangementScheme['bottom-right']}
          index={chipIndex}
          position={getAbsChipPos(playerBRPos[chipIndex])}
          key={`player-${props.arrangementScheme['bottom-right']}-${chipIndex}`}
          updatePos={forwardChip}
        />
      ))}
    </React.Fragment>
  );
}
