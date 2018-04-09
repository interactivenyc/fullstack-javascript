import React from 'react';

const ContestPreview = (contest) => (
  <div className="ContestPreview">
    <div className="category-name">
      <b>Category:</b> {contest.categoryName}
    </div>
    <div className="contest-name">
      <b>Contest:</b> {contest.contestName}
    </div>
  </div>
);

export default ContestPreview;
