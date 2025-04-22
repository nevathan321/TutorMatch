import './Dashboard.css';
import Review from '../../components/review/Review';
import Transaction from '../../components/transaction/Transaction';
import MyCalendar from '../../components/calendar/MyCalendar';


// Renders the entire dashboard layout with reviews, transactions, and a calendar

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
            type: "Payment",
            amount: 100,
            status: "Pending",
            date: "Date",
            time: "Time"
        },
        {
            id: 10000001,
            type: "Refund",
            amount: 100,
            status: "Confirmed",
            date: "Date",
            time: "Time"
        },
        {
            id: 10000002,
            type: "Currency Exchange",
            amount: 100,
            status: "Denied",
            date: "Date",
            time: "Time"
        },
    ];

    return (
        <div className="Dashboard">
            <h2 className="title">Dashboard</h2>

            <div className="reviewpanel">
                <h2 className="reviewheader">Latest Reviews</h2>
                <div className="reviewdisplay">
                    {reviews.map((review) => (
                        <Review
                            key={review.id}
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
                                key={transaction.id}
                                type={transaction.type}
                                id={transaction.id}
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
                    <MyCalendar/>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;