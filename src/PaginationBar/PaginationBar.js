import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import '../styles/caseManagement/_paginationBar.scss';
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi';

function PaginationBar({ pageNow, setPageNow, pageTotal }) {
  const items = [...Array(pageTotal).keys()]
    .map((key) => key + 1)
    .map((item) => ({
      type: 'page',
      isCurrent: pageNow === item,
      page: item,
      onClick: () => setPageNow(item),
    }));

  const markedItems = items.map((item) => {
    if (
      item.page === pageTotal ||
      item.page === 1 ||
      item.page === pageNow ||
      item.page === pageNow + 1 ||
      // item.page === pageNow + 2 ||
      item.page === pageNow - 1
      // item.page === pageNow - 2
    ) {
      return item;
    }
    return {
      ...item,
      type: item.page > pageNow ? 'end-ellipsis' : 'start-ellipsis',
    };
  });

  const ellipsisItems = markedItems.filter((item, index) => {
    if (
      item.type === 'start-ellipsis' &&
      markedItems[index + 1].type === 'start-ellipsis'
    ) {
      return false;
    }
    if (
      item.type === 'end-ellipsis' &&
      markedItems[index + 1].type === 'end-ellipsis'
    ) {
      return false;
    }
    return true;
  });

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
        {ellipsisItems.map((item) => {
          return (
            <div key={uuidv4()}>
              {item.type === 'page' ? (
                <div
                  className={`pagination-btn cursor-pointer ${
                    item.isCurrent ? 'pagination-active' : ''
                  }`}
                  onClick={item.onClick}
                >
                  {item.page}
                </div>
              ) : (
                <div key={item.page} className="mt-2">
                  ...
                </div>
              )}
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
