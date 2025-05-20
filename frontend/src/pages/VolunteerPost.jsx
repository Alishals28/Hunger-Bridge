import React, { useEffect, useState } from "react";
import VolunteerPostCard from "../Components/VolunteerPostCard";
import './posts.css';
import { useNavigate } from "react-router-dom";

const VolunteerPosts = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/donations/");
        if (!response.ok) throw new Error("Failed to fetch donations");
        const data = await response.json();
        setDonations(data);
      } catch (error) {
        console.error("Error fetching donation data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const handleRequest = (donation) => {
    // Navigate to MakeRequest page with donation ID as query param or path param
    navigate(`/make-request?donation_id=${donation.id}`);
  };

  return (
    <div className="posts-div">
      {loading ? (
        <p>Loading...</p>
      ) : donations.length === 0 ? (
        <p>No donations available at the moment.</p>
      ) : (
        donations.map((donation, index) => (
          <VolunteerPostCard
            key={index}
            donation={donation}
            onRequest={handleRequest}
          />
        ))
      )}
    </div>
  );
};

export default VolunteerPosts;
