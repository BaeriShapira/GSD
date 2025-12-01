import DashboardBoard from "../components/dashboard/DashboardBoard";

export default function Dashboard() {
    return (
        <section className="p-2">
            <div className="px-4">
                <h1>Dashboard</h1>
                <p>Your daily and weekly action items at a glance.</p>
            </div>
            <DashboardBoard />
        </section>
    );
}
