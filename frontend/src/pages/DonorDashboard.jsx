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


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './DonorDashboard.css';
// import { useNavigate } from 'react-router-dom';
// import {
//   FaCheckCircle, FaTruck, FaClock, FaTimesCircle,
//   FaExclamationCircle, FaEdit, FaSave, FaInfo
// } from 'react-icons/fa';

// const API_BASE_URL = 'http://localhost:8000/api';

// const statusIcons = {
//   Available: <FaCheckCircle className="status-icon available" />,
//   'Picked Up': <FaTruck className="status-icon picked-up" />,
//   Delivered: <FaCheckCircle className="status-icon delivered" />,
//   Cancelled: <FaTimesCircle className="status-icon cancelled" />,
//   Expired: <FaExclamationCircle className="status-icon expired" />,
// };

// const statusOptions = ['Available', 'Picked Up', 'Delivered', 'Cancelled', 'Expired'];

// const DonorDashboard = () => {
//   const [donations, setDonations] = useState([]);
//   const [editingId, setEditingId] = useState(null);
//   const [editingStatus, setEditingStatus] = useState('');
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [maintenanceMode, setMaintenanceMode] = useState(false);
//   const navigate = useNavigate();

//   const token = localStorage.getItem('access');
//   const firstName = localStorage.getItem('first_name');

//   useEffect(() => {
//     fetchDonations();
//   }, []);

//   const fetchDonations = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.get(`${API_BASE_URL}/make-donations/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setDonations(response.data);
//       setMaintenanceMode(false);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching donations:', error);
//       // Check if we can simulate the data if the API is not available
//       setError('Failed to load donations. Please try again later.');
//       setLoading(false);
//       setMaintenanceMode(true);
//     }
//   };

//   const handleEdit = (id, currentStatus) => {
//     setEditingId(id);
//     setEditingStatus(currentStatus);
//   };

//   const handleCancel = () => {
//     setEditingId(null);
//     setEditingStatus('');
//   };

//   const handleSave = async (id) => {
//     // Backend workaround - update locally without making the API call
//     if (maintenanceMode) {
//       // Update the donation status locally since the backend is having issues
//       setDonations((prev) =>
//         prev.map((donation) =>
//           donation.donation_id === id
//             ? { ...donation, status: editingStatus }
//             : donation
//         )
//       );
//       setEditingId(null);
//       setEditingStatus('');
//       return;
//     }
    
//     try {
//       const response = await axios.patch(
//         `${API_BASE_URL}/make-donations/${id}/`,
//         { status: editingStatus },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       // Handle successful response
//       if (response.data && response.data.status) {
//         setDonations((prev) =>
//           prev.map((donation) =>
//             donation.donation_id === id
//               ? { ...donation, status: response.data.status }
//               : donation
//           )
//         );
//         setEditingId(null);
//         setEditingStatus('');
//       } else {
//         console.error('Invalid response format:', response);
//         setError('Failed to update donation status. Unexpected response format.');
//         // Fallback to local update if API response is invalid
//         setDonations((prev) =>
//           prev.map((donation) =>
//             donation.donation_id === id
//               ? { ...donation, status: editingStatus }
//               : donation
//           )
//         );
//         setEditingId(null);
//         setEditingStatus('');
//       }
//     } catch (error) {
//       console.error('Failed to update status:', error);
//       // Update the donation status locally since the backend is failing
//       setDonations((prev) =>
//         prev.map((donation) =>
//           donation.donation_id === id
//             ? { ...donation, status: editingStatus }
//             : donation
//         )
//       );
//       setError('Backend error detected. Changes saved locally only.');
//       setEditingId(null);
//       setEditingStatus('');
//       setMaintenanceMode(true);
//     }
//   };

//   return (
//     <div className="dashboard-container">
//       <header className="dashboard-welcome">
//         <div className="welcome-content">
//           <h1>👋 Welcome, <span>{firstName}</span>!</h1>
//           <p>Here's a summary of your recent donations.</p>
//         </div>
//       </header>

//       {maintenanceMode && (
//         <div className="maintenance-banner">
//           <FaInfo />
//           <p>The system is currently in maintenance mode. Changes will be saved locally but not synchronized with the server.</p>
//         </div>
//       )}

//       <section className="dashboard-actions">
//         <button className="donate-button" onClick={() => navigate('/make-donations')}>
//           Make a Donation
//         </button>
//       </section>

//       {error && (
//         <div className="error-message">
//           {error}
//           <button onClick={() => setError(null)}>Dismiss</button>
//         </div>
//       )}

//       <section className="donations-list">
//         <h3>Your Donations</h3>

//         {loading ? (
//           <p>Loading your donations...</p>
//         ) : donations.length === 0 ? (
//           <p>You haven't made any donations yet.</p>
//         ) : (
//           <div className="donation-grid">
//             {donations.map((donation) => (
//               <div key={donation.donation_id} className="donation-card">
//                 <div className="card-header">
//                   {statusIcons[donation.status] || <FaClock className="status-icon" />}
//                   <h4>{donation.food_description}</h4>
//                 </div>
//                 <div className="card-body">
//                   {editingId === donation.donation_id ? (
//                     <>
//                       <div className="status-edit">
//                         <label><strong>Status:</strong></label>
//                         <select
//                           value={editingStatus}
//                           onChange={(e) => setEditingStatus(e.target.value)}
//                           className="status-select"
//                         >
//                           {statusOptions.map((status) => (
//                             <option key={status} value={status}>
//                               {status}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                     </>
//                   ) : (
//                     <p><strong>Status:</strong> {donation.status}</p>
//                   )}

//                   <p><strong>Quantity:</strong> {donation.quantity}</p>
//                   <p><strong>Pickup Time:</strong> {donation.pickup_time ? new Date(donation.pickup_time).toLocaleString() : 'Not specified'}</p>
//                 </div>
//                 <div className="card-actions">
//                   {editingId === donation.donation_id ? (
//                     <>
//                       <button
//                         className="save-button"
//                         onClick={() => handleSave(donation.donation_id)}
//                       >
//                         <FaSave /> Save {maintenanceMode ? '(Local)' : ''}
//                       </button>
//                       <button className="cancel-button" onClick={handleCancel}>
//                         Cancel
//                       </button>
//                     </>
//                   ) : (
//                     <button
//                       className="edit-button"
//                       onClick={() => handleEdit(donation.donation_id, donation.status)}
//                       disabled={editingId !== null && editingId !== donation.donation_id}
//                     >
//                       <FaEdit /> Edit
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>
//     </div>
//   );
// };

// export default DonorDashboard;