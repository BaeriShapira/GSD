import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { colorClasses500 } from "../../config/areaColors";

export default function ArchiveStatsView({ tasks, areas }) {
    // Calculate statistics by area
    const areaStats = areas.map(area => {
        const areaTasks = tasks.filter(task => task.areaOfLifeId === area.id);
        return {
            name: area.name,
            value: areaTasks.length,
            color: area.color
        };
    }).filter(stat => stat.value > 0); // Only show areas with completed tasks

    // Add tasks with no area
    const noAreaTasks = tasks.filter(task => !task.areaOfLifeId);
    if (noAreaTasks.length > 0) {
        areaStats.push({
            name: 'General',
            value: noAreaTasks.length,
            color: 'gray'
        });
    }

    // Map colors to hex values for the pie chart
    const colorMap = {
        red: '#ef4444',
        orange: '#f97316',
        yellow: '#eab308',
        green: '#22c55e',
        blue: '#3b82f6',
        indigo: '#6366f1',
        purple: '#a855f7',
        pink: '#ec4899',
        gray: '#6b7280',
        white: '#d1d5db'
    };

    const COLORS = areaStats.map(stat => colorMap[stat.color] || '#6b7280');

    // Custom label for pie chart
    const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
        const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

        if (percent < 0.05) return null; // Don't show label for small slices

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                className="font-semibold text-sm"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    if (tasks.length === 0) {
        return (
            <div className="my-6 p-12 text-center">
                <h2>No completed tasks yet</h2>
                <p className="text-black/50 text-sm">
                    Complete some tasks to see your statistics here.
                </p>
            </div>
        );
    }

    return (
        <div className="my-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="border border-black/10 rounded-xl bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-black/60 uppercase tracking-wider mb-2">
                        Total Completed
                    </h3>
                    <p className="text-4xl font-bold text-black/90">{tasks.length}</p>
                </div>

                <div className="border border-black/10 rounded-xl bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-black/60 uppercase tracking-wider mb-2">
                        Active Areas
                    </h3>
                    <p className="text-4xl font-bold text-black/90">{areaStats.length}</p>
                </div>

                <div className="border border-black/10 rounded-xl bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-black/60 uppercase tracking-wider mb-2">
                        Top Area
                    </h3>
                    <p className="text-2xl font-bold text-black/90">
                        {areaStats.length > 0
                            ? areaStats.reduce((max, stat) => stat.value > max.value ? stat : max).name
                            : '—'
                        }
                    </p>
                </div>
            </div>

            {/* Pie Chart */}
            <div className="border border-black/10 rounded-xl bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-black/80 mb-6">
                    Completed Tasks by Area of Life
                </h3>

                <div style={{ width: '100%', height: 400 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={areaStats}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomLabel}
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {areaStats.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    padding: '8px 12px'
                                }}
                            />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                formatter={(value, entry) => `${value} (${entry.payload.value} tasks)`}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Detailed List */}
            <div className="border border-black/10 rounded-xl bg-white p-6 shadow-sm mt-6">
                <h3 className="text-lg font-semibold text-black/80 mb-4">
                    Breakdown by Area
                </h3>
                <div className="space-y-3">
                    {areaStats.sort((a, b) => b.value - a.value).map((stat, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: COLORS[areaStats.findIndex(s => s.name === stat.name)] }}
                                />
                                <span className="font-medium text-black/80">{stat.name}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-black/60">
                                    {stat.value} {stat.value === 1 ? 'task' : 'tasks'}
                                </span>
                                <span className="text-sm font-semibold text-black/80">
                                    {((stat.value / tasks.length) * 100).toFixed(1)}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
