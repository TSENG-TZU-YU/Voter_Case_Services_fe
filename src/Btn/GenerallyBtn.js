import React from 'react';
import '../styles/btn/_generallyBtn.scss';

function GenerallyBtn({ handleFn1, handleFn2, fn1, fn2, style, tit, eNull }) {
  // console.log('first', eNull );
  return (
    <button
      className="generallyBtn"
      style={{ ...style }}
      onClick={(e) => {
        eNull !== '1' ? handleFn1(fn1, fn2) : handleFn1(e, fn1, fn2);
        handleFn2();
      }}
    >
      {tit}
    </button>
  );
}

export default GenerallyBtn;
