import './VolunteerPostCard.css';
import React from "react";

const VolunteerPostCard = ({ donation, onRequest }) => {
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

        <div className="request-button-container">
          <button
            className={`request-button ${status !== 'Available' ? 'disabled' : ''}`}
            onClick={() => onRequest(donation)}
            disabled={status !== 'Available'}
          >
            {status === 'Available' ? 'Request' : 'Unavailable'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VolunteerPostCard;
