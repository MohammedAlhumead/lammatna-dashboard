function StatCard({ title, value }) {
    return (
        <div className="card">
            <h3>{title}</h3>
            <p className="card-value">{value}</p>
        </div>

    )


}

export default StatCard;