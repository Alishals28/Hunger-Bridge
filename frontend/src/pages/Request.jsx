import React, { useEffect, useState } from 'react';
import './Request.css';
import axios from 'axios';

export default function Requests() {
  const [requests, setRequests] = useState([]);

    const token = localStorage.getItem('access');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/requests/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Fetched requests:', response.data);  // 👈 Add this line
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }}
  const handleAccept = async (request_id) => {
  try {
    // Make PATCH/PUT request to update status to 'Completed' (or 'Approved' if you want)
    await axios.patch(`http://localhost:8000/api/requests/${request_id}/`, 
      { status: 'Claimed' },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Update local state after successful update
    const updated = requests.map((req) =>
      req.request_id === request_id ? { ...req, status: 'Claimed' } : req
    );

    setRequests(updated);
  } catch (error) {
    console.error('Failed to update request status:', error);
    alert('Failed to accept request.');
  }
};

const handleReject = async (request_id) => {
  try {
    // If you want to mark rejected, do a PATCH update with status 'Rejected'
    // or if you want to delete the request, make DELETE call instead

    await axios.patch(`http://localhost:8000/api/requests/${request_id}/`, 
      { status: 'Pending' },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Or if deleting:
    // await axios.delete(`http://localhost:8000/api/requests/${id}/`, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });

    // Update local state after successful update
    const updated = requests.filter((req) => req.request_id !== request_id);
    setRequests(updated);
  } catch (error) {
    console.error('Failed to update request status:', error);
    alert('Failed to reject request.');
  }
};


  const pendingRequests = requests.filter((req) => req.status !== 'Claimed');
  const completedRequests = requests.filter((req) => req.status === 'Claimed');

  return (
  <div className="requests-container">
    <header className="dashboard-welcome">
      <div className="welcome-content">
        <h1>📦 Requests</h1>
      </div>
    </header>

    <h2>🕓 Pending Requests</h2>
    <div className="table-wrapper">
      <table className="request-table">
        <thead>
          <tr>
            <th>Request ID</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Requested At</th>
            <th>Request Description</th>
            <th>Description</th>
            <th>NGO/Volunteer</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
      {pendingRequests.length === 0 ? (
        <tr>
          <td colSpan="8">No pending requests.</td>
        </tr>
      ) : (
        pendingRequests.map((req) => (
          <tr key={req.request_id}>
            <td>{req.request_id}</td>
            <td>{req.priority}</td>
            <td>{req.status}</td>
            <td>{new Date(req.requested_at).toLocaleString()}</td>
            <td>{req.request_description}</td>
            <td>{req.donation_description}</td>
            <td>{req.volunteer_name || req.ngo_name}</td>
            <td>
              <button onClick={() => handleAccept(req.request_id)} className="accept-btn">Accept</button>
              <button onClick={() => handleReject(req.request_id)} className="reject-btn">Reject</button>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>


    <h2>✅ Completed Requests</h2>
<div className="table-wrapper">
  <table className="request-table completed">
    <thead>
      <tr>
        <th>Request ID</th>
        <th>Priority</th>
        <th>Status</th>
        <th>Requested At</th>
        <th>Request Description</th>
        <th>Description</th>
        <th>NGO/Volunteer</th>
      </tr>
    </thead>
    <tbody>
      {completedRequests.length === 0 ? (
        <tr>
          <td colSpan="7">No completed requests.</td>
        </tr>
      ) : (
        completedRequests.map((req) => (
          <tr key={req.request_id}>
            <td>{req.request_id}</td>
            <td>{req.priority}</td>
            <td>{req.status}</td>
            <td>{new Date(req.requested_at).toLocaleString()}</td>
            <td>{req.request_description}</td>
            <td>{req.donation_description}</td>
            <td>{req.volunteer_name || req.ngo_name}</td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>
</div>
);

}

