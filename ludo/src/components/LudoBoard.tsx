import React, { useEffect, useState } from 'react';
import GameChips from './GameChips';
import './LudoBoard.scss';

// -- Component ------------------------------------------------------------------------------------

export default function LudoBoard(): JSX.Element {
  const arrangementScheme: { [key: string]: string } = {
    'top-left': 'red',
    'top-right': 'green',
    'bottom-left': 'blue',
    'bottom-right': 'yellow'
  };

  const [blockSize, setBlockSize] = useState<number>(-1);
  useEffect(() => {
    const anyPathBlock = document.querySelector('.path-block') as HTMLElement | null;
    if (anyPathBlock) setBlockSize(anyPathBlock.offsetWidth);
  }, []);

  // -- JSX Elements -----------------------------------------------------------

  const playerBase = (position: string) => (
    <div className={`player-base ${arrangementScheme[position]}`} id={`position-${position}`}>
      <div className="player-base-box">
        {[1, 2, 3, 4].map((index) => (
          <div
            className={`player-base-position ${arrangementScheme[position]}`}
            key={`base-${index}`}
          ></div>
        ))}
      </div>
    </div>
  );

  const gamePathCol = (index: number) => (
    <React.Fragment>
      {[1, 2, 3, 4, 5, 6].map((blockIndex) => (
        <div
          className={`path-block ${
            ((index === 1 && blockIndex !== 5) ||
              (index === 2 && blockIndex === 6) ||
              index === 3) &&
            'white-block'
          }`}
          key={`block-col-${index}-cell-${blockIndex}`}
        ></div>
      ))}
    </React.Fragment>
  );

  const gamePath = (colorClassName: string, alignment: string, orientation: string) => (
    <div className={`game-path-block ${alignment} ${orientation}`}>
      {[1, 2, 3].map((index) => (
        <div className={`game-path-col ${colorClassName} ${orientation}`} key={`path-col-${index}`}>
          {gamePathCol(index)}
        </div>
      ))}
    </div>
  );

  const homeBlock = (
    <div id="home-block">
      {[
        { color: `${arrangementScheme['top-left']}`, id: 'triangle-left' },
        { color: `${arrangementScheme['top-right']}`, id: 'triangle-top' },
        { color: `${arrangementScheme['bottom-right']}`, id: 'triangle-right' },
        { color: `${arrangementScheme['bottom-left']}`, id: 'triangle-bottom' }
      ].map((params) => (
        <div className={`home-triangle ${params.color}`} id={params.id} key={params.id}></div>
      ))}
    </div>
  );

  // -- Render -----------------------------------------------------------------

  return (
    <div id="ludo-board">
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {playerBase('top-left')}
        {gamePath(arrangementScheme['top-right'], 'path-column', 'flip')}
        {playerBase('top-right')}
      </div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {gamePath(arrangementScheme['top-left'], 'path-row', 'flip')}
        {homeBlock}
        {gamePath(arrangementScheme['bottom-right'], 'path-row', 'normal')}
      </div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {playerBase('bottom-left')}
        {gamePath(arrangementScheme['bottom-left'], 'path-column', 'normal')}
        {playerBase('bottom-right')}
      </div>
      {blockSize !== -1 && (
        <GameChips arrangementScheme={arrangementScheme} blockSize={blockSize} />
      )}
    </div>
  );
}
