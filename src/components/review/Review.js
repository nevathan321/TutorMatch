import './Review.css';
import sampleprofile from '../../images/sampleprofile.png';
import fullstar from '../../images/fullstar.png';
import emptystar from '../../images/emptystar.png';

function Review({ id, rating, title, body, author, date, pfp }) {
    // Renders full and empty star icons based on the rating
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
