import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SteamReviews({ appid }) {
  const [reviews, setReviews] = useState([]);
  const [cursor, setCursor] = useState('*');
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    if (!hasMore || loading) return;
    setLoading(true);

    try {
      const res = await axios.get(`https://steamreviewrandomizer.onrender.com/reviews/${appid}`, {
        params: {
          cursor,
          num: 100,
        },
      });

      const newReviews = res.data.reviews;
      const newCursor = res.data.cursor;

      if (newReviews.length === 0 || cursor === newCursor) {
        setHasMore(false);
      } else {
        setReviews((prev) => [...prev, ...newReviews]);
        setCursor(newCursor);
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setReviews([]);
    setCursor('*');
    setHasMore(true);
  }, [appid]);

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appid]);

  return (
    <div>
      <h2>Reviews for AppID: {appid}</h2>

      {reviews.map((r, i) => (
        <div key={i} style={{ borderBottom: '1px solid #ccc', marginBottom: '10px' }}>
          <p><strong>{r.author?.steamid}</strong></p>
          <p>{r.review}</p>
          <p>👍 {r.votes_up} | 😂 {r.votes_funny}</p>
        </div>
      ))}

      {hasMore && !loading && (
        <button onClick={fetchReviews}>Load More Reviews</button>
      )}

      {loading && <p>Loading...</p>}
      {!hasMore && <p>No more reviews to load.</p>}
    </div>
  );
}

export default SteamReviews;
