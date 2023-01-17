import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import '../../styles/caseManagement/_paginationBar.scss';
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi';

function PaginationBar(props) {
  const { pageNow, setPageNow, pageTotal } = props;
  return (
    <>
      <div className="pagination">
        <div
          className="pagination-btn cursor-pointer"
          onClick={() => {
            setPageNow(pageNow === 1 ? pageNow : pageNow - 1);
            window.scrollTo({
              top: 0,
              left: 0,
            });
          }}
        >
          <FiChevronLeft />
        </div>
        {Array(pageTotal)
          .fill(1)
          .map((v, i) => {
            return (
              <div
                key={uuidv4()}
                className={`pagination-btn cursor-pointer ${
                  i + 1 === pageNow ? 'pagination-active' : ''
                }`}
                onClick={() => {
                  setPageNow(i + 1);
                  window.scrollTo({
                    top: 0,
                    left: 0,
                  });
                }}
              >
                {i + 1}
              </div>
            );
          })}
        <div
          className="pagination-btn cursor-pointer"
          onClick={() => {
            setPageNow(pageNow === pageTotal ? pageNow : pageNow + 1);
            window.scrollTo({
              top: 0,
              left: 0,
              // behavior: 'smooth',
            });
          }}
        >
          <FiChevronRight />
        </div>
      </div>
    </>
  );
}

export default PaginationBar;
