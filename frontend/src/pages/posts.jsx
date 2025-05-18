import Header from "../Components/Header";
import NavBar from "../Components/NavBar";
import PostCard from "../Components/Post-Card";
import './posts.css'
const donations = [{
  donorName: "Jane Doe",
  food_description: "10 bags of rice and canned vegetables",
  quantity: 10,
  pickup_time: "2025-05-12T14:00:00Z",
  status: "available",
  posted_at: "2025-05-11T10:30:00Z",
},
{
  donorName: "Jennie",
  food_description: "10 bags of rice and canned vegetables",
  quantity: 10,
  pickup_time: "2025-05-12T14:00:00Z",
  status: "available",
  posted_at: "2025-05-11T10:30:00Z",
},
{
    donorName: "John Smith",
    food_description: "20 boxes of assorted fruits",
    quantity: 20,
    pickup_time: "2025-05-15T09:00:00Z",
    status: "taken",
    posted_at: "2025-05-09T11:00:00Z",
  },
  {
    donorName: "John Smith",
    food_description: "20 boxes of assorted fruits",
    quantity: 20,
    pickup_time: "2025-05-15T09:00:00Z",
    status: "taken",
    posted_at: "2025-05-09T11:00:00Z",
  }
  ,
  {
    donorName: "John Smith",
    food_description: "20 boxes of assorted fruits",
    quantity: 20,
    pickup_time: "2025-05-15T09:00:00Z",
    status: "taken",
    posted_at: "2025-05-09T11:00:00Z",
  },
  {
    donorName: "John Smith",
    food_description: "20 boxes of assorted fruits",
    quantity: 20,
    pickup_time: "2025-05-15T09:00:00Z",
    status: "taken",
    posted_at: "2025-05-09T11:00:00Z",
  }
];


const Post=() => {
    const img_url ="/images/posts.avif";
    return (
    <>
    <div className="posts-div">
    {donations.map((donation, index) => (
          <PostCard key={index} donation={donation} />
    ))}
    </div>
    </>
    );

};
export default Post;