import React from 'react';
import './Chip.scss';

// -- Component ----------------------------------------------------------------

export default function Chip(props: {
  type: string;
  color: string;
  index: string;
  position: { top: number; left: number };
  updatePos: (type: string, index: string) => void;
}): JSX.Element {
  // -- Render -----------------------------------------------------------------

  return (
    <div
      className={`player-chip ${props.color}-chip`}
      style={props.position}
      id={`player-${props.color}-${props.index}`}
      onClick={() => props.updatePos(props.type, props.index)}
    ></div>
  );
}
