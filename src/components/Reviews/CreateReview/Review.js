/**
 * File: Review.js
 * Date: 2025-04-24
 * Team: WebFusion
 * Members: Nevathan, Liyu, Adrian, Abishan
 * 
 * Description:
 * Reusable component that renders a single review with title, content, author, date, and star rating.
 * Uses local images for full and empty stars and a placeholder profile picture.
 */


import './Review.css';
import sampleprofile from '../../../images/sampleprofile.png';
import fullstar from '../../../images/fullstar.png';
import emptystar from '../../../images/emptystar.png';


/**
 * Renders a single review card with a star rating, title, body, and author information.
 *
 * @param {Object} props - Component props
 * @param {number} props.rating - Rating out of 5 (integer)
 * @param {string} props.title - Title of the review
 * @param {string} props.body - Body text of the review
 * @param {string} props.author - Name of the review's author
 * @param {string} props.date - Date the review was written (ISO or formatted string)
 * @returns {JSX.Element} The rendered review card
 */

function Review({rating, title, body, author, date }) {
    /**
     * Generates a visual star rating using full and empty star icons.
     *
     * @returns {JSX.Element[]} Array of <img> elements representing the rating stars.
     */
    function renderStars() {
        let stars = [];
        let fullStars = rating;
        let emptyStars = 5 - rating;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<img key={`fullstar-${i}`} src={fullstar} alt="★" className='star'></img>);
        }

        for (let i = 0; i < emptyStars; i++) {
            stars.push(<img key={`emptystar-${i}`} src={emptystar} alt="☆" className='star'></img>);
        }

        return stars;
    };

    return (
        <div className='Review'>
            <div className='starReview'>
                {renderStars()}
            </div>
            <h2>{title}</h2>
            <p>{body}</p>
            <div className='authorinfo'>
                <img src={sampleprofile} alt="PFP" />
                <div>
                    <p className='authorname'>{author}</p>
                    <p className='date'>{date}</p>
                </div>
            </div>
        </div>
    )
}

export default Review;
