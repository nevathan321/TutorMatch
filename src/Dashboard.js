import './Dashboard.css';
import Review from './Review';
import Transaction from './Transaction';

function Dashboard() {
    let reviews = [
        {
            id: 1,
            rating: 5,
            title: "Title",
            body: "Body Goes Here",
            author: "Name",
            date: "1/1/2025",
            pfp: "imgURL"
        },
        {
            id: 2,
            rating: 4,
            title: "Title",
            body: "Body Goes Here",
            author: "Name",
            date: "1/1/2025",
            pfp: "imgURL"
        },
        {
            id: 3,
            rating: 1,
            title: "Title",
            body: "Body Goes Here",
            author: "Name",
            date: "1/1/2025",
            pfp: "imgURL"
        }
    ];

    let transactions = [
        {
            id: 10000000,
            type: "Type",
            amount: 100,
            status: "Pending",
            date: "Date",
            time: "Time"
        },
        {
            id: 10000000,
            type: "Type",
            amount: 100,
            status: "Confirmed",
            date: "Date",
            time: "Time"
        },
        {
            id: 10000000,
            type: "Type",
            amount: 100,
            status: "Confirmed",
            date: "Date",
            time: "Time"
        },
    ];

    return (
        <div className="Dashboard">
            <p className="title">Dashboard</p>

            <div className="reviewpanel">
                <h2 className="reviewheader">Latest Reviews</h2>
                <div className="reviewdisplay">
                    {reviews.map((review) => (
                        <Review
                            id={review.id}
                            rating={review.rating}
                            title={review.title}
                            body={review.body}
                            author={review.author}
                            date={review.date}
                            pfp={review.pfp}
                        />
                    ))}
                </div>
            </div>
            <div className='transaction-schedule'>
                <div className='transactionpanel'>
                    <h4>Recent Transactions</h4>
                    <div className='transactions'>
                        {transactions.map((transaction) => (
                            <Transaction
                                id={transaction.id}
                                type={transaction.type}
                                amount={transaction.amount}
                                status={transaction.status}
                                date={transaction.date}
                                time={transaction.time}
                            />
                        ))}
                    </div>
                </div>
                <div className='schedulepanel'>
                    <h4>Schedule</h4>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;