import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './MakeDonation.css';

const MakeDonation = () => {
  const [formData, setFormData] = useState({
    food_description: '',
    quantity: '',
    pickup_time: '',
    status: 'Available',
  });

  const navigate = useNavigate();
  const token = localStorage.getItem('access');

  const donationStatusOptions = [
    'Available',
    'Picked Up',
    'Delivered',
    'Cancelled',
    'Expired',
  ];

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:8000/api/make-donations/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Donation submitted successfully!');
      navigate('/donor-dashboard');
    } catch (error) {
      console.error('Error submitting donation:', error.response || error);
      alert('Failed to submit donation.');
    }
  };

  return (
    <div className="donation-form-container">
      <h2>Make a Donation</h2>
      <form onSubmit={handleSubmit} className="donation-form">
        <label>
          Food Description:
          <textarea
            name="food_description"
            value={formData.food_description}
            onChange={handleChange}
            required
            placeholder="Describe the food items..."
          />
        </label>

        <label>
          Quantity (in units):
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            min={1}
          />
        </label>

        <label>
          Pickup Time:
          <input
            type="datetime-local"
            name="pickup_time"
            value={formData.pickup_time}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Status:
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            {donationStatusOptions.map(status => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        <button type="submit">Submit Donation</button>
      </form>
    </div>
  );
};

export default MakeDonation;
