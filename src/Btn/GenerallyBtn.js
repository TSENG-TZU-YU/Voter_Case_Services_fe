import React from 'react';
import '../styles/btn/_generallyBtn.scss';

function GenerallyBtn({ handleFn1, fn1, fn2, style, tit }) {
  return (
    <button
      className="generallyBtn"
      style={{ ...style }}
      onClick={(e) => {
        handleFn1(e, fn1, fn2);
      }}
    >
      {tit}
    </button>
  );
}

export default GenerallyBtn;
