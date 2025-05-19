import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DonorDashboard.css';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaTruck, FaClock, FaTimesCircle, FaExclamationCircle, FaEdit, FaSave } from 'react-icons/fa';

const statusIcons = {
  Available: <FaCheckCircle className="status-icon available" />,
  'Picked Up': <FaTruck className="status-icon picked-up" />,
  Delivered: <FaCheckCircle className="status-icon delivered" />,
  Cancelled: <FaTimesCircle className="status-icon cancelled" />,
  Expired: <FaExclamationCircle className="status-icon expired" />,
};

const statusOptions = ['Available', 'Picked Up', 'Delivered', 'Cancelled', 'Expired'];

const DonorDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingStatus, setEditingStatus] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('access');
  const firstName = localStorage.getItem('first_name');

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/make-donations/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDonations(response.data);
    } catch (error) {
      console.error('Error fetching donations:', error);
    }
  };

  

  const handleEdit = (id, currentStatus) => {
    setEditingId(id);
    setEditingStatus(currentStatus);
  };
  const handleCancel = () => {
  setEditingId(null);
  setEditingStatus('');
};

  const handleSave = async (id) => {
  try {
    const response = await axios.patch(
      `http://localhost:8000/api/make-donations/${id}/`,
      { status: editingStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('PATCH response:', response.data);

    // Update only the edited donation locally
    setDonations((prev) =>
      prev.map((donation) =>
        donation.id === id ? { ...donation, status: response.data.status } : donation
      )
    );

    setEditingId(null);
    setEditingStatus('');
  } catch (error) {
    console.error('Failed to update status:', error);
  }
};


  return (
    <div className="dashboard-container">
      <header className="dashboard-welcome">
        <div className="welcome-content">
          <h1>👋 Welcome, <span>{firstName}</span>!</h1>
          <p>Here's a summary of your recent donations.</p>
        </div>
      </header>

      <section className="dashboard-actions">
        <button className="donate-button" onClick={() => navigate('/make-donations')}>Make a Donation</button>
      </section>

      <section className="donations-list">
        <h3>Your Donations</h3>
        {donations.length === 0 ? (
          <p>You haven't made any donations yet.</p>
        ) : (
          <div className="donation-grid">
            {donations.map((donation) => (
              <div key={donation.id} className="donation-card">
                <div className="card-header">
                  {statusIcons[donation.status] || <FaClock className="status-icon" />}
                  <h4>{donation.food_description}</h4>
                </div>
                <div className="card-body">
                  {editingId === donation.id ? (
  <>
    <label><strong>Status:</strong></label>
    <select
      value={editingStatus}
      onChange={(e) => setEditingStatus(e.target.value)}
      className="status-select"
    >
      {statusOptions.map((status) => (
        <option key={status} value={status}>{status}</option>
      ))}
                        </select>
                      </>
                    ) : (
                      <p><strong>Status:</strong> {donation.status}</p>
                    )}

                  <p><strong>Quantity:</strong> {donation.quantity}</p>
                  <p><strong>Pickup Time:</strong> {new Date(donation.pickup_time).toLocaleString()}</p>
                </div>
                <div className="card-actions">
                  {editingId === donation.id ? (
                    <>
                      <button className="save-button" onClick={() => handleSave(donation.id)}>
                        <FaSave /> Save
                      </button>
                      <button className="cancel-button" onClick={handleCancel}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      className="edit-button"
                      onClick={() => handleEdit(donation.id, donation.status)}
                      disabled={editingId !== null}
                    >
                      <FaEdit /> Edit
                    </button>
                  )}

                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default DonorDashboard;

