import React from 'react';
import { FaStar, FaQuoteRight } from 'react-icons/fa';
import './Reviews.css';

const Reviews = () => {
  // Mock data - eventually you can fetch this from a "feedbacks" collection in Firestore
  const reviews = [
    {
      id: 1,
      name: "Henry Arthur",
      role: "Student, CS",
      text: "The 'Behind the HACK' event was mind-blowing! The organization by IBENTO made it so easy to track my attendance and schedule.",
      rating: 5,
    },
    {
      id: 2,
      name: "Jessica Miller",
      role: "Event Organizer",
      text: "Finally a platform that understands campus culture. Managing our community workshop through IBENTO increased our reach by 40%.",
      rating: 5,
    },
    {
      id: 3,
      name: "Rahul Sharma",
      role: "Volunteer",
      text: "Smooth check-ins and great UI. The dashboard is very intuitive and helps me stay updated with all college events.",
      rating: 4,
    }
  ];

  return (
    <section className="reviews-section">
      <div className="reviews-header">
        <h2 className="massive-title">Reviews</h2>
        <p className="subtitle">Feedback that Speaks to <span>Our Success</span></p>
      </div>

      <div className="reviews-container">
        {reviews.map((review) => (
          <div className="review-card" key={review.id}>
            <div className="quote-icon"><FaQuoteRight /></div>
            <div className="stars">
              {[...Array(review.rating)].map((_, i) => (
                <FaStar key={i} className="star-filled" />
              ))}
              <span className="rating-num">{review.rating}.0</span>
            </div>
            <p className="review-text">"{review.text}"</p>
            <div className="reviewer-info">
              <div className="reviewer-avatar">{review.name.charAt(0)}</div>
              <div>
                <h4>{review.name}</h4>
                <span>{review.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="carousel-controls">
         <div className="control-btn prev">←</div>
         <div className="control-btn next">→</div>
      </div>
    </section>
  );
};

export default Reviews;