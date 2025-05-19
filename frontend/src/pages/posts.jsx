import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import NavBar from "../Components/NavBar";
import PostCard from "../Components/Post-Card";
import './posts.css';

const Post = () => {
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

  return (
    <div className="posts-div">
      {loading ? (
        <p>Loading...</p>
      ) : (
        donations.map((donation, index) => (
          <PostCard key={index} donation={donation} />
        ))
      )}
    </div>
  );
};

export default Post;
