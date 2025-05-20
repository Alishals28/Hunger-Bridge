import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './MakeRequest.css';

const MakeRequest = () => {
  const [formData, setFormData] = useState({
    donation: 0,         
    priority: '',
    request_description: '',
    status: 'Pending',
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const donationId = queryParams.get('donation_id');
    if (donationId) {
      setFormData(prev => ({ ...prev, donation: donationId }));  // updated here too
    }
  }, [location.search]);

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
      await axios.post('http://localhost:8000/api/make-request/', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
      });
      alert('Request submitted successfully!');
      navigate('/volunteer-dashboard');
    } catch (error) {
      console.error('Submission error:', error.response || error);
      alert('Failed to submit request.');
    }
  };

  return (
    <div className="request-form-container">
      <h2>Make a Request</h2>
      <form onSubmit={handleSubmit} className="request-form">
        <label>
  Priority:
  <select
    name="priority"
    value={formData.priority}
    onChange={handleChange}
    required
    className="styled-dropdown"
  >
    <option value="" disabled>Select priority</option>
    <option value="Low">Low</option>
    <option value="Medium">Medium</option>
    <option value="High">High</option>
    <option value="Urgent">Urgent</option>
  </select>
</label>


        <label>
          Request Description:
          <textarea
            name="request_description"
            value={formData.request_description}
            onChange={handleChange}
            required
            placeholder="Why are you requesting this donation?"
          />
        </label>

        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
};

export default MakeRequest;
