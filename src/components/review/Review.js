import './Review.css';
import sampleprofile from '../../images/sampleprofile.png';
import fullstar from '../../images/fullstar.png';
import emptystar from '../../images/emptystar.png';

function Review({ id, rating, title, body, author, date, pfp }) {
    // Create an array of stars based on the rating
    function renderStars() {
        let stars = [];
        let fullStars = rating;
        let emptyStars = 5 - rating;

        // Add full stars
        for (let i = 0; i < fullStars; i++) {
            stars.push(<img key={`fullstar-${i}`} src={fullstar} alt="★" className='star'></img>);
        }

        // Add empty stars
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<img key={`emptystar-${i}`} src={emptystar} alt="☆" className='star'></img>);
        }

        return stars;
    };

    return (
        <div className='Review'>
            {/* Render the stars based on rating */}
            <div className='starReview'>
                {renderStars()}
            </div>
            {/* Display the title of the review */}
            <h2>{title}</h2>
            {/* Display the review body/content */}
            <p>{body}</p>
            {/* Display the author info (profile picture, name, and date) */}
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
