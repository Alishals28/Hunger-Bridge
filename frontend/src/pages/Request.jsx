// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './Request.css';
// const reqs=[
//   {
//     "request_id": 101,
//     "priority": "High",
//     "status": "Pending",
//     "requested_at": "2025-05-15T10:30:00Z",
//     "donation_id": 201,
//     "ngo_id": 301,
//     "volunteer_id": null
//   },
//   {
//     "request_id": 102,
//     "priority": "Medium",
//     "status": "Approved",
//     "requested_at": "2025-05-14T14:00:00Z",
//     "donation_id": 202,
//     "ngo_id": null,
//     "volunteer_id": 401
//   },
//   {
//     "request_id": 103,
//     "priority": "Low",
//     "status": "Completed",
//     "requested_at": "2025-05-13T08:15:00Z",
//     "donation_id": 203,
//     "ngo_id": 302,
//     "volunteer_id": null
//   }
// ]

// export default function Requests() {
//   const [requests, setRequests] = useState([]);

  // const token = localStorage.getItem('access');

  // useEffect(() => {
  //   fetchRequests();
  // }, []);

  // const fetchRequests = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:8000/api/requests/', {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     setRequests(response.data);
  //   } catch (error) {
  //     console.error('Error fetching requests:', error);
  //   }
//     const reqs=[
//   {
//     "request_id": 101,
//     "priority": "High",
//     "status": "Pending",
//     "requested_at": "2025-05-15T10:30:00Z",
//     "donation_id": 201,
//     "ngo_id": 301,
//     "volunteer_id": null
//   },
//   {
//     "request_id": 102,
//     "priority": "Medium",
//     "status": "Approved",
//     "requested_at": "2025-05-14T14:00:00Z",
//     "donation_id": 202,
//     "ngo_id": null,
//     "volunteer_id": 401
//   },
//   {
//     "request_id": 103,
//     "priority": "Low",
//     "status": "Completed",
//     "requested_at": "2025-05-13T08:15:00Z",
//     "donation_id": 203,
//     "ngo_id": 302,
//     "volunteer_id": null
//   }
// ]
//   setRequests(reqs);
//   };

//   return (
//     <div className="requests-container">
//         <header className="dashboard-welcome">
//                 <div className="welcome-content">
//                 <h1>📦 Requests</h1>
//                 </div>
//             </header>      
//     <div className="requests-grid">
//         {requests.length === 0 ? (
//           <p>No requests available.</p>
//         ) : (
//           requests.map((req) => (
//             <div className="request-card" key={req.request_id}>
//               <p><strong>Request ID:</strong> {req.request_id}</p>
//               <p><strong>Priority:</strong> {req.priority}</p>
//               <p><strong>Status:</strong> {req.status}</p>
//               <p><strong>Requested At:</strong> {new Date(req.requested_at).toLocaleString()}</p>
//               <p><strong>Donation ID:</strong> {req.donation_id}</p>
//               {req.volunteer_id ? (
//                 <p><strong>Volunteer ID:</strong> {req.volunteer_id}</p>
//               ) : (
//                 <p><strong>NGO ID:</strong> {req.ngo_id}</p>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }
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
  const handleAccept = (id) => {
    const updated = requests.map((req) =>
      req.request_id === id ? { ...req, status: 'Completed' } : req
    );
    setRequests(updated);
  };

  const handleReject = (id) => {
    const updated = requests.filter((req) => req.request_id !== id);
    setRequests(updated);
  };

  const pendingRequests = requests.filter((req) => req.status !== 'Completed');
  const completedRequests = requests.filter((req) => req.status === 'Completed');

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

