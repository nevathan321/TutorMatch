import './card.css';


// Simple wrapper component to make stuff look like a card
function Card({ children }) {
    return (
        <div className="card">
            {children}
        </div>
    );
}

export default Card;
