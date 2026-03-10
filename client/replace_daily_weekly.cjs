const fs = require('fs');
let content = fs.readFileSync('client/app.js', 'utf8');

// 1. replace getDashboardDaily
let dailyStart = content.indexOf('    getDashboardDaily() {');
let dailyEnd = content.indexOf('    getTodayScheduleItems() {');
if (dailyStart > -1 && dailyEnd > -1) {
    const replacement = \    getDashboardDaily() {
        const todayStr = new Date().toISOString().slice(0, 10);
        let callsToday = 0;
        let meetingsToday = 0;
        const storedFollowups = this.getStoredFollowups ? this.getStoredFollowups() : [];
        storedFollowups.forEach(f => {
            if (!f.done && (String(f.scheduled_date || f.scheduledDate || f.date || '').startsWith(todayStr))) {
                const typ = String(f.type || '').toLowerCase();
                if (typ === 'call' || typ === 'phone') callsToday++;
                if (typ === 'meeting') meetingsToday++;
            }
        });
        const tasks = this.readStore('bezent_tasks', []).filter(t => !t.completed).length;
        
        let expectedPayments = 0;
        this.getAllInvoices().forEach(inv => {
            if (String(inv.status || '').toLowerCase() !== 'paid' && String(inv.dueDate || inv.date || '').startsWith(todayStr)) {
                expectedPayments += Number(inv.total || inv.amount || 0);
            }
        });

        return \\\
            <div class="space-y-6 fade-in">
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Daily View</h2>
                        <p class="text-sm text-slate-500">Today's schedule, quick actions, and daily summary</p>
                    </div>
                    <div class="flex gap-2">
                        <button data-action="nav:dashboard/daily" class="px-3 py-1.5 text-xs font-medium bg-purple-50 text-purple-700 rounded-lg">Daily</button>
                        <button data-action="nav:dashboard/weekly" class="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg">Weekly</button>
                    </div>
                </div>

                <!-- Summary Cards -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div class="bg-gradient-to-br from-sky-500 to-sky-600 rounded-lg p-4 sm:p-6 text-white max-w-full overflow-hidden">
                        <i data-lucide="phone" class="w-8 h-8 mb-3 opacity-80"></i>
                        <div class="text-2xl sm:text-3xl font-semibold mb-1">\</div>
                        <div class="text-sm opacity-90 truncate">Calls Scheduled</div>
                    </div>
                    
                    <div class="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg p-4 sm:p-6 text-white max-w-full overflow-hidden">
                        <i data-lucide="calendar" class="w-8 h-8 mb-3 opacity-80"></i>
                        <div class="text-2xl sm:text-3xl font-semibold mb-1">\</div>
                        <div class="text-sm opacity-90 truncate">Meetings Today</div>
                    </div>
                    
                    <div class="bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg p-4 sm:p-6 text-white max-w-full overflow-hidden">
                        <i data-lucide="check-square" class="w-8 h-8 mb-3 opacity-80"></i>
                        <div class="text-2xl sm:text-3xl font-semibold mb-1">\</div>
                        <div class="text-sm opacity-90 truncate">Tasks Due Today</div>
                    </div>
                    
                    <div class="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg p-4 sm:p-6 text-white max-w-full overflow-hidden">
                        <i data-lucide="indian-rupee" class="w-8 h-8 mb-3 opacity-80"></i>
                        <div class="text-2xl sm:text-3xl font-semibold mb-1">\</div>
                        <div class="text-sm opacity-90 truncate">Expected Payments</div>
                    </div>
                </div>

                <!-- Today's Schedule -->
                <div class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg">
                    <div class="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-6">
                        <h3 class="text-lg font-semibold text-slate-900">Today's Schedule</h3>
                        <span class="px-3 py-1 text-xs font-medium bg-purple-50 text-purple-700 rounded-full">Upcoming</span>
                    </div>
                    
                    <div class="space-y-4">
                        \
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div data-action="dashboard:scheduleCall" class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg hover:bg-slate-50 transition-colors cursor-pointer">
                        <div class="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-4">
                            <i data-lucide="phone" class="w-6 h-6 text-purple-600"></i>
                        </div>
                        <h4 class="font-medium text-slate-900 mb-2">Schedule Call</h4>
                        <p class="text-sm text-slate-600">Add new call to calendar</p>
                    </div>
                    
                    <div data-action="task:create" class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg hover:bg-slate-50 transition-colors cursor-pointer">
                        <div class="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-4">
                            <i data-lucide="plus" class="w-6 h-6 text-purple-600"></i>
                        </div>
                        <h4 class="font-medium text-slate-900 mb-2">Create Task</h4>
                        <p class="text-sm text-slate-600">Add task to today's list</p>
                    </div>
                    
                    <div data-action="lead:add" class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg hover:bg-slate-50 transition-colors cursor-pointer">
                        <div class="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-4">
                            <i data-lucide="user-plus" class="w-6 h-6 text-purple-600"></i>
                        </div>
                        <h4 class="font-medium text-slate-900 mb-2">Add Lead</h4>
                        <p class="text-sm text-slate-600">Register new lead</p>
                    </div>
                </div>
            </div>
        \\\;
    }

\;
    content = content.substring(0, dailyStart) + replacement + content.substring(dailyEnd);
}

// 2. replace getDashboardWeekly
let weeklyStart = content.indexOf('    getDashboardWeekly() {');
let weeklyEnd = content.indexOf('    getDashboardAnalytics() {');
if (weeklyStart > -1 && weeklyEnd > -1) {
    const replacement = \    getDashboardWeekly() {
        // Compute dynamic weekly stats
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
        const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
        
        let leadsThisWeek = 0; let leadsLastWeek = 0;
        this.getStoredLeads().forEach(l => {
            const dStr = String(l.createdOn || l.date || l.createdAt || '');
            if (dStr >= oneWeekAgo) leadsThisWeek++;
            else if (dStr >= twoWeeksAgo) leadsLastWeek++;
        });
        const lP = leadsLastWeek ? Math.round(((leadsThisWeek - leadsLastWeek)/leadsLastWeek)*100) : 0;
        const leadDiff = lP > 0 ? '\u2191 ' + lP + '%' : lP < 0 ? '\u2193 ' + Math.abs(lP) + '%' : '0%';
        const leadColor = lP >= 0 ? 'green' : 'rose';

        let dealsThisWeek = 0; let dealsLastWeek = 0;
        this.getAllProjectsMerged().forEach(p => {
             const dStr = String(p.startDate || p.createdOn || p.date || '');
             if (dStr >= oneWeekAgo) dealsThisWeek++;
             else if (dStr >= twoWeeksAgo) dealsLastWeek++;
        });
        const dP = dealsLastWeek ? Math.round(((dealsThisWeek - dealsLastWeek)/dealsLastWeek)*100) : 0;
        const dealDiff = dP > 0 ? '\u2191 ' + dP + '%' : dP < 0 ? '\u2193 ' + Math.abs(dP) + '%' : '0%';
        const dealColor = dP >= 0 ? 'green' : 'rose';

        let rThisWeek = 0; let rLastWeek = 0;
        this.getAllInvoices().forEach(i => {
             if (String(i.status || '').toLowerCase() === 'paid') {
                 const dStr = String(i.issueDate || i.date || i.createdOn || '');
                 if (dStr >= oneWeekAgo) rThisWeek += Number(i.total || i.amount || 0);
                 else if (dStr >= twoWeeksAgo) rLastWeek += Number(i.total || i.amount || 0);
             }
        });
        const rP = rLastWeek ? Math.round(((rThisWeek - rLastWeek)/rLastWeek)*100) : 0;
        const revDiff = rP > 0 ? '\u2191 ' + rP + '%' : rP < 0 ? '\u2193 ' + Math.abs(rP) + '%' : '0%';
        const revColor = rP >= 0 ? 'green' : 'rose';

        // Fake campaigns logic
        let cThisWeek = this.readStore('bezent_campaigns', []).length || 0;
        
        return \\\
            <div class="space-y-6 fade-in">
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Weekly View</h2>
                        <p class="text-sm text-slate-500">Weekly metrics and performance highlights</p>
                    </div>
                    <div class="flex gap-2">
                        <button data-action="nav:dashboard/daily" class="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg">Daily</button>
                        <button data-action="nav:dashboard/weekly" class="px-3 py-1.5 text-xs font-medium bg-purple-50 text-purple-700 rounded-lg">Weekly</button>
                    </div>
                </div>

                <!-- Weekly Metrics -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg break-words overflow-hidden">
                        <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
                            <i data-lucide="users" class="w-8 h-8 text-sky-600"></i>
                            <span class="text-xs font-medium text-\-600 bg-\-50 px-2 py-1 rounded-full whitespace-nowrap">\</span>
                        </div>
                        <div class="text-3xl font-semibold text-slate-900 mb-1 truncate">\</div>
                        <div class="text-sm text-slate-600 truncate">Leads This Week</div>
                        <div class="text-xs text-slate-500 mt-2 truncate">vs last week</div>
                    </div>
                    
                    <div class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg break-words overflow-hidden">
                        <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
                            <i data-lucide="briefcase" class="w-8 h-8 text-indigo-600"></i>
                            <span class="text-xs font-medium text-\-600 bg-\-50 px-2 py-1 rounded-full whitespace-nowrap">\</span>
                        </div>
                        <div class="text-3xl font-semibold text-slate-900 mb-1 truncate">\</div>
                        <div class="text-sm text-slate-600 truncate">Deals Closed</div>
                        <div class="text-xs text-slate-500 mt-2 truncate">vs last week</div>
                    </div>
                    
                    <div class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg break-words overflow-hidden">
                        <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
                            <i data-lucide="indian-rupee" class="w-8 h-8 text-emerald-600"></i>
                            <span class="text-xs font-medium text-\-600 bg-\-50 px-2 py-1 rounded-full whitespace-nowrap">\</span>
                        </div>
                        <div class="text-xl sm:text-2xl font-semibold text-slate-900 mb-1 truncate">\</div>
                        <div class="text-sm text-slate-600 truncate">Revenue Generated</div>
                        <div class="text-xs text-slate-500 mt-2 truncate">vs last week</div>
                    </div>
                    
                    <div class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg break-words overflow-hidden">
                        <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
                            <i data-lucide="send" class="w-8 h-8 text-amber-600"></i>
                            <span class="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded-full whitespace-nowrap">Active</span>
                        </div>
                        <div class="text-3xl font-semibold text-slate-900 mb-1 truncate">\</div>
                        <div class="text-sm text-slate-600 truncate">Campaigns</div>
                        <div class="text-xs text-slate-500 mt-2 truncate">Email, SMS, WhatsApp</div>
                    </div>
                </div>

                <!-- Weekly Chart -->
                <div class="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-lg">
                    <div class="mb-6">
                        <h3 class="text-lg font-semibold text-slate-900">Leads vs Deals - This Week</h3>
                        <p class="text-sm text-slate-500">Daily comparison of leads generated and deals closed</p>
                    </div>
                    <div class="relative h-64 w-full bg-slate-50 rounded-lg">
                            <div class="relative w-full h-full" style="position: relative; height: 100%; width: 100%; min-height: 250px; min-width: 0"><div class="absolute inset-0" style="position: absolute; left: 0; right: 0; top: 0; bottom: 0; min-height: 250px; min-width: 0"><canvas id="weeklyChart"></canvas></div></div>
                    </div>
                </div>
            </div>
        \\\;
    }

\;
    content = content.substring(0, weeklyStart) + replacement + content.substring(weeklyEnd);
}

// 3. Add formatCurrentMoney helper alongside getStoredFollowups or wherever
if (!content.includes('formatCurrentMoney(')) {
    content = content.replace('    formatDate(str) {', \    formatCurrentMoney(v) {
        if (!v) return '?0';
        if (v >= 10000000) return '?' + (v / 10000000).toFixed(1) + ' Cr';
        if (v >= 100000) return '?' + (v / 100000).toFixed(1) + ' L';
        if (v >= 1000) return '?' + (v / 1000).toFixed(1) + ' k';
        return '?' + Math.round(v);
    }

    formatDate(str) {\);
}

// 4. Update initializeWeeklyChart
let chartStart = content.indexOf('    initializeWeeklyChart() {');
let chartEnd = content.indexOf('    updateAllDashboardContent() {');
if (chartStart > -1 && chartEnd > -1) {
    const replacement = \    initializeWeeklyChart() {
        const ctx = document.getElementById('weeklyChart');
        if (ctx) {
            // Compute last 7 days metrics
            const days = [];
            const leads = [];
            const deals = [];
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const dStr = d.toISOString().slice(0, 10);
                days.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
                
                let ln = 0; let dn = 0;
                this.getStoredLeads().forEach(l => {
                    if (String(l.createdOn || l.date || l.createdAt || '').startsWith(dStr)) ln++;
                });
                this.getAllProjectsMerged().forEach(p => {
                    if (String(p.startDate || p.createdOn || p.date || '').startsWith(dStr)) dn++;
                });
                leads.push(ln);
                deals.push(dn);
            }

            this.charts.weeklyChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: days,
                    datasets: [
                        {
                            label: 'Leads',
                            data: leads,
                            backgroundColor: 'rgba(99, 102, 241, 0.7)'
                        },
                        {
                            label: 'Deals',
                            data: deals,
                            backgroundColor: 'rgba(16, 185, 129, 0.7)'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom' }
                    },
                    scales: {
                        x: { grid: { display: false } },
                        y: { beginAtZero: true, ticks: { precision: 0 } }
                    }
                }
            });
        }
    }

\;
    content = content.substring(0, chartStart) + replacement + content.substring(chartEnd);
}

fs.writeFileSync('client/app.js', content, 'utf8');
console.log('Successfully completed daily/weekly refactor');
