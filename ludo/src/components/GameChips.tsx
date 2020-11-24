import React, { useEffect, useState } from 'react';
import Chip from './Chip';

// -- Component ------------------------------------------------------------------------------------

export default function PlayerChips(props: {
  arrangementScheme: { [key: string]: string };
  blockSize: number;
}): JSX.Element {
  // -- Position utilities -----------------------------------------------------

  const startCellIndices: { [key: string]: { row: number; col: number } } = {
    'top-left': { row: 6, col: 1 },
    'top-right': { row: 1, col: 8 },
    'bottom-left': { row: 13, col: 6 },
    'bottom-right': { row: 8, col: 13 }
  };

  const baseCellIndices: { [key: string]: { [key: string]: { row: number; col: number } } } = {};
  (() => {
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
  })();

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

  // -- Absolute position constants --------------------------------------------

  const playerTLStart = getAbsChipPos(startCellIndices['top-left']);
  const playerTRStart = getAbsChipPos(startCellIndices['top-right']);
  const playerBLStart = getAbsChipPos(startCellIndices['bottom-left']);
  const playerBRStart = getAbsChipPos(startCellIndices['bottom-right']);
  console.log(playerTLStart, playerTRStart, playerBLStart, playerBRStart);

  // -- States -----------------------------------------------------------------

  const gameMapArray: { type: string; chipIndex: string }[][][] = [];
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

  const stateMap: { [key: string]: { [key: string]: { row: number; col: number } } } = {
    'top-left': playerTLPos,
    'top-right': playerTRPos,
    'bottom-left': playerBLPos,
    'bottom-right': playerBRPos
  };

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
      {Object.keys(playerTLPos).map((chipIndex, index) => (
        <Chip
          type="top-left"
          color={props.arrangementScheme['top-left']}
          index={index}
          position={getAbsChipPos(playerTLPos[chipIndex])}
          key={`player-${props.arrangementScheme['top-left']}-${index}`}
        />
      ))}
      {Object.keys(playerTRPos).map((chipIndex, index) => (
        <Chip
          type="top-right"
          color={props.arrangementScheme['top-right']}
          index={index}
          position={getAbsChipPos(playerTRPos[chipIndex])}
          key={`player-${props.arrangementScheme['top-right']}-${index}`}
        />
      ))}
      {Object.keys(playerBLPos).map((chipIndex, index) => (
        <Chip
          type="bottom-left"
          color={props.arrangementScheme['bottom-left']}
          index={index}
          position={getAbsChipPos(playerBLPos[chipIndex])}
          key={`player-${props.arrangementScheme['bottom-left']}-${index}`}
        />
      ))}
      {Object.keys(playerBRPos).map((chipIndex, index) => (
        <Chip
          type="bottom-right"
          color={props.arrangementScheme['bottom-right']}
          index={index}
          position={getAbsChipPos(playerBRPos[chipIndex])}
          key={`player-${props.arrangementScheme['bottom-right']}-${index}`}
        />
      ))}
    </React.Fragment>
  );
}
