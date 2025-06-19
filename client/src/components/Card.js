
import React from 'react';
import '../styles/card.css';

const Card = ({ gameName, reviewText, reviewer, hoursPlayed, reactions }) => {
  return (
    <div className="review-card">
      <h2>{gameName}</h2>
      <p className="review-text">"{reviewText}"</p>
      <div className="review-meta">
        <span>👤 {reviewer}</span>
        <span> | ⏱️ {hoursPlayed} hrs played</span>
        {reactions && (
          <>
            <span> | 👍 {reactions.thumbsUp}</span>
            <span> | 👎 {reactions.thumbsDown}</span>
            <span> | 😂 {reactions.funny}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default Card;
