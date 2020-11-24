import React from 'react';
import './Chip.scss';

// -- Component ----------------------------------------------------------------

export default function Chip(props: {
  type: string;
  color: string;
  index: number;
  position: { top: number; left: number };
}): JSX.Element {
  // -- Render -----------------------------------------------------------------

  return (
    <div
      className={`player-chip ${props.color}-chip`}
      style={props.position}
      id={`player-${props.color}-${props.index}`}
    ></div>
  );
}
