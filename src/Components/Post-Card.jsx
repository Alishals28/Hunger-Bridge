import './Post-Card.css';
import React from "react";
// this will be from the backend
const PostCard = ({ donation }) => {
  const {
    donorName,
    food_description,
    quantity,
    pickup_time,
    status,
    posted_at,
  } = donation;

  return (
    <div className="post-card">
      <div className="post-card-content">
  <div>
    <h2 className="donor-name">{donorName}</h2>
    <p className="food-description">{food_description}</p>
  </div>

  <div className="info-section">
    <div className="info-row">
      <span className="icon">📦</span>
      <span>Quantity: {quantity}</span>
    </div>
    <div className="info-row">
      <span className="icon">⏰</span>
      <span>Pickup Time: {new Date(pickup_time).toLocaleString()}</span>
    </div>
    <div className="info-row">
      <span className="icon">✅</span>
      <span>Status: <strong>{status}</strong></span>
    </div>
  </div>

  <div className="posted-time">
    Posted at: {new Date(posted_at).toLocaleString()}
  </div>
</div>
    </div>
  );
};

export default PostCard;
