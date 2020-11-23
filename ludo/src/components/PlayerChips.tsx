import React, { useEffect, useState } from 'react';
import './PlayerChips.scss';

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

  const getAbsoluteStartCellPosition = (position: string): [number, number] => {
    const { row, col } = startCellIndices[position];
    return [props.blockSize * (col + 0.5), props.blockSize * (row + 0.5)];
  };

  const getAbsoluteBaseCellPosition = (position: string, index: number): [number, number] => {
    const baseIndices: { [key: string]: { rowInit: number; colInit: number } } = {
      'top-left': { rowInit: 0, colInit: 6 },
      'top-right': { rowInit: 6, colInit: 15 },
      'bottom-left': { rowInit: 9, colInit: 0 },
      'bottom-right': { rowInit: 15, colInit: 9 }
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

    const offset = props.blockSize * 2;
    return [
      colInit * props.blockSize + colOffMul * offset * (1 + colOffset) + 1,
      rowInit * props.blockSize + rowOffMul * offset * (1 + rowOffset) + 1
    ];
  };

  // -- States -----------------------------------------------------------------

  const gameMapArray: { type: string; chipIndex: string }[][][] = [];
  for (let i = 0; i < 15; i++) {
    gameMapArray[i] = new Array(15);
    for (let j = 0; j < 15; j++) {
      gameMapArray[i][j] = [];
    }
  }
  const [gameMap, setGameMap] = useState(gameMapArray);

  const playerTLStart = getAbsoluteStartCellPosition('top-left');
  const playerTRStart = getAbsoluteStartCellPosition('top-right');
  const playerBLStart = getAbsoluteStartCellPosition('bottom-left');
  const playerBRStart = getAbsoluteStartCellPosition('bottom-right');

  let playerTLPosInit: { [key: string]: [number, number] } = {};
  ['4', '3', '2', '1'].forEach((index) => {
    playerTLPosInit[index] = getAbsoluteBaseCellPosition('top-left', parseInt(index) - 1);
  });
  let playerTRPosInit: { [key: string]: [number, number] } = {};
  ['4', '3', '2', '1'].forEach((index) => {
    playerTRPosInit[index] = getAbsoluteBaseCellPosition('top-right', parseInt(index) - 1);
  });
  let playerBLPosInit: { [key: string]: [number, number] } = {};
  ['4', '3', '2', '1'].forEach((index) => {
    playerBLPosInit[index] = getAbsoluteBaseCellPosition('bottom-left', parseInt(index) - 1);
  });
  let playerBRPosInit: { [key: string]: [number, number] } = {};
  ['4', '3', '2', '1'].forEach((index) => {
    playerBRPosInit[index] = getAbsoluteBaseCellPosition('bottom-right', parseInt(index) - 1);
  });

  //   playerTLPosInit = { ...playerTLPosInit, '4': playerTLStart };
  //   playerTRPosInit = { ...playerTRPosInit, '4': playerTRStart };
  //   playerBLPosInit = { ...playerBLPosInit, '4': playerBLStart };
  //   playerBRPosInit = { ...playerBRPosInit, '4': playerBRStart };

  const [playerTLPos, setPlayerTLPos] = useState(playerTLPosInit);
  const [playerTRPos, setPlayerTRPos] = useState(playerTRPosInit);
  const [playerBLPos, setPlayerBLPos] = useState(playerBLPosInit);
  const [playerBRPos, setPlayerBRPos] = useState(playerBRPosInit);

  // -- Position actions -------------------------------------------------------

  const stateMap: { [key: string]: { [key: string]: [number, number] } } = {
    'top-left': playerTLPos,
    'top-right': playerTRPos,
    'bottom-left': playerBLPos,
    'bottom-right': playerBRPos
  };

  const updateStateMap: {
    [key: string]: React.Dispatch<
      React.SetStateAction<{
        [key: string]: [number, number];
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

    updateStateMap[type]({ ...stateMap[type], [chipIndex]: getAbsoluteStartCellPosition(type) });
  };

  // -- On mounnt --------------------------------------------------------------

  useEffect(() => {
    startChip('top-left', '4');
    startChip('top-right', '4');
    startChip('bottom-left', '4');
    startChip('bottom-right', '4');
  }, []);

  // -- Render -----------------------------------------------------------------
  return (
    <React.Fragment>
      {Object.keys(playerTLPos).map((chipPos, index) => (
        <div
          className={`player-chip ${props.arrangementScheme['top-left']}-chip`}
          style={{ left: playerTLPos[chipPos][0], top: playerTLPos[chipPos][1] }}
          key={`player-${props.arrangementScheme['top-left']}-${index}`}
          id={`player-${props.arrangementScheme['top-left']}-${index}`}
        ></div>
      ))}
      {Object.keys(playerTRPos).map((chipPos, index) => (
        <div
          className={`player-chip ${props.arrangementScheme['top-right']}-chip`}
          style={{ left: playerTRPos[chipPos][0], top: playerTRPos[chipPos][1] }}
          key={`player-${props.arrangementScheme['top-right']}-${index}`}
          id={`player-${props.arrangementScheme['top-right']}-${index}`}
        ></div>
      ))}
      {Object.keys(playerBLPos).map((chipPos, index) => (
        <div
          className={`player-chip ${props.arrangementScheme['bottom-left']}-chip`}
          style={{ left: playerBLPos[chipPos][0], top: playerBLPos[chipPos][1] }}
          key={`player-${props.arrangementScheme['bottom-left']}-${index}`}
          id={`player-${props.arrangementScheme['bottom-left']}-${index}`}
        ></div>
      ))}
      {Object.keys(playerBRPos).map((chipPos, index) => (
        <div
          className={`player-chip ${props.arrangementScheme['bottom-right']}-chip`}
          style={{ left: playerBRPos[chipPos][0], top: playerBRPos[chipPos][1] }}
          key={`player-${props.arrangementScheme['bottom-right']}-${index}`}
          id={`player-${props.arrangementScheme['bottom-right']}-${index}`}
        ></div>
      ))}
    </React.Fragment>
  );
}
