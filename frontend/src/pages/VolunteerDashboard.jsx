import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './VolunteerDashboard.css';
import { FaCheckCircle, FaTruck, FaClock, FaTimesCircle, FaExclamationCircle, FaEdit, FaSave } from 'react-icons/fa';

const statusIcons = {
  Available: <FaCheckCircle className="status-icon available" />,
  'Picked Up': <FaTruck className="status-icon picked-up" />,
  Delivered: <FaCheckCircle className="status-icon delivered" />,
  Cancelled: <FaTimesCircle className="status-icon cancelled" />,
  Expired: <FaExclamationCircle className="status-icon expired" />,
};

const statusOptions = ['Picked Up', 'Delivered', 'Cancelled'];

const VolunteerDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingStatus, setEditingStatus] = useState('');

  const token = localStorage.getItem('access');
  const firstName = localStorage.getItem('first_name');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/requests/', {
        
        headers: { Authorization: `Bearer ${token}` },
      });
      const volunteerId = localStorage.getItem('user_id');
      const filtered = response.data.filter((r) => r.volunteer === Number(volunteerId));
      setRequests(filtered);
    } catch (error) {
      console.error('Error fetching volunteer requests:', error);
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
        `http://localhost:8000/api/requests/${id}/`,
        { status: editingStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRequests((prev) =>
        prev.map((req) => (req.request_id === id ? { ...req, status: response.data.status } : req))
      );

      setEditingId(null);
      setEditingStatus('');
    } catch (error) {
      console.error('Failed to update request status:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-welcome">
        <div className="welcome-content">
          <h1>🙌 Welcome, <span>{firstName}</span>!</h1>
          <p>Here are the requests assigned to you.</p>
        </div>
      </header>

      <section className="donations-list">
        <h3>Your Assigned Requests</h3>
        {requests.length === 0 ? (
          <p>No requests assigned yet.</p>
        ) : (
          <div className="donation-grid">
            {requests.map((req) => (
              <div key={req.request_id} className="donation-card">
                <div className="card-header">
                  {statusIcons[req.status] || <FaClock className="status-icon" />}
                  <h4>{req.food_description || 'No Description'}</h4>
                </div>
                <div className="card-body">
                  {editingId === req.request_id ? (
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
                    <p><strong>Status:</strong> {req.status}</p>
                  )}

                  <p><strong>NGO:</strong> {req.ngo_name}</p>
                  <p><strong>Description:</strong> {req.request_description}</p>
                </div>
                <div className="card-actions">
                  {editingId === req.request_id ? (
                    <>
                      <button className="save-button" onClick={() => handleSave(req.request_id)}><FaSave /> Save</button>
                      <button className="cancel-button" onClick={handleCancel}>Cancel</button>
                    </>
                  ) : (
                    <button
                      className="edit-button"
                      onClick={() => handleEdit(req.request_id, req.status)}
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

export default VolunteerDashboard;
