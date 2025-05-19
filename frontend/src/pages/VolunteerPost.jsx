import React, { useEffect, useState } from "react";
import VolunteerPostCard from "../Components/VolunteerPostCard";
import './posts.css'; // reuse existing styling

const VolunteerPosts = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleRequest = async (donation) => {
    try {
      const response = await fetch(`http://localhost:8000/api/request-donation/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Adjust if needed
        },
        body: JSON.stringify({ donation_id: donation.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to request donation");
      }

      alert("Request sent successfully!");

      // Optionally refetch or update UI
      setDonations((prevDonations) =>
        prevDonations.map((d) =>
          d.id === donation.id ? { ...d, status: "requested" } : d
        )
      );
    } catch (error) {
      console.error("Request error:", error);
      alert("Error requesting donation: " + error.message);
    }
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
