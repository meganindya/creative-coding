import React from 'react';
import './LudoBoard.scss';

// -- Component ------------------------------------------------------------------------------------

export default function LudoBoard(): JSX.Element {
  // -- JSX Elements -----------------------------------------------------------

  const playerBase = (colorClassName: string) => (
    <div className={`player-base ${colorClassName}`}>
      <div className="player-base-box">
        {[1, 2, 3, 4].map((index) => (
          <div className={`player-base-position ${colorClassName}`} key={`base-${index}`}></div>
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
        'red triangle-left',
        'green triangle-top',
        'yellow triangle-right',
        'blue triangle-bottom'
      ].map((classNames) => (
        <div className={`home-triangle ${classNames}`} key={classNames.split(' ')[1]}></div>
      ))}
    </div>
  );

  // -- Render -----------------------------------------------------------------

  return (
    <div id="ludo-board">
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {playerBase('red')}
        {gamePath('green', 'path-column', 'flip')}
        {playerBase('green')}
      </div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {gamePath('red', 'path-row', 'flip')}
        {homeBlock}
        {gamePath('yellow', 'path-row', 'normal')}
      </div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {playerBase('blue')}
        {gamePath('blue', 'path-column', 'normal')}
        {playerBase('yellow')}
      </div>
    </div>
  );
}
