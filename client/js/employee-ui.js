import { employeeState } from './employee-state.js';
import { apiClient } from './employee-api.js';

let currentAttendanceSubView = 'calendar';
let calendarSelectedDate = null;
let calendarMonth = new Date().getMonth() + 1; // 1-12
let calendarYear = new Date().getFullYear();
let historyFilters = {
    from_date: '',
    to_date: '',
    status: 'All',
    search: '',
    page: 1,
    limit: 10
};

let distChartInstance = null;
let trendChartInstance = null;
let hoursChartInstance = null;

window.setAttendanceSubView = (viewName) => {
    currentAttendanceSubView = viewName;
    calendarSelectedDate = null;
    historyFilters.page = 1;
    loadPanel('attendance');
};

function getSubViewHeader(title, label) {
    return `
        <div class="flex items-center justify-between pb-4 border-b border-[#ECECF3] mb-6 animate-fade-in">
            <div class="flex items-center gap-3">
                <button onclick="setAttendanceSubView('calendar')" class="p-2 border border-[#ECECF3] hover:border-[#610173] hover:text-[#610173] bg-white rounded-xl transition shadow-sm">
                    <i data-lucide="arrow-left" class="w-4 h-4"></i>
                </button>
                <div>
                    <h2 class="text-base font-extrabold text-slate-800 leading-tight">${title}</h2>
                    <p class="text-[9.5px] text-[#6B7280] font-bold uppercase tracking-wider mt-0.5">Attendance Center / ${label}</p>
                </div>
            </div>
        </div>
    `;
}

function renderAttendanceHybrid() {
    const FEATURES = [
        {
            id: 'calendar', label: 'Calendar', icon: 'calendar', navAway: false,
            illusBg: 'bg-[#F4F2FF]', iconColor: 'text-[#7C3AED]',
            desc: 'View your daily attendance\nin calendar view',
            illusEmoji: `<span style="font-size:54px;line-height:1;filter:drop-shadow(0 4px 10px rgba(124,58,237,0.18))">🗓️</span>
                         <span style="position:absolute;bottom:8px;right:8px;font-size:22px;line-height:1">🌿</span>`
        },
        {
            id: 'history', label: 'History', icon: 'refresh-cw', navAway: true,
            illusBg: 'bg-[#F0FDF9]', iconColor: 'text-[#059669]',
            desc: 'View and export your\nattendance history',
            illusEmoji: `<span style="font-size:54px;line-height:1;filter:drop-shadow(0 4px 10px rgba(5,150,105,0.18))">📋</span>
                         <span style="position:absolute;bottom:10px;right:10px;font-size:20px;line-height:1">✅</span>`
        },
        {
            id: 'corrections', label: 'Corrections', icon: 'edit-3', navAway: true,
            illusBg: 'bg-[#FFFBEB]', iconColor: 'text-[#D97706]',
            desc: 'Request corrections &\ntrack their status',
            illusEmoji: `<span style="font-size:54px;line-height:1;filter:drop-shadow(0 4px 10px rgba(217,119,6,0.18))">✏️</span>
                         <span style="position:absolute;bottom:8px;right:8px;font-size:20px;line-height:1">📝</span>`
        },
        {
            id: 'late-credits', label: 'Late Credits', icon: 'wallet', navAway: false,
            illusBg: 'bg-[#EFF6FF]', iconColor: 'text-[#2563EB]',
            desc: 'View late credits and\nusage history',
            illusEmoji: `<span style="font-size:54px;line-height:1;filter:drop-shadow(0 4px 10px rgba(37,99,235,0.18))">💳</span>
                         <span style="position:absolute;bottom:8px;right:10px;font-size:20px;line-height:1">💰</span>`
        },
        {
            id: 'leaderboard', label: 'Leaderboard', icon: 'trophy', navAway: false,
            illusBg: 'bg-[#FDF4FF]', iconColor: 'text-[#9333EA]',
            desc: 'See top performers and\nyour ranking',
            illusEmoji: `<span style="font-size:54px;line-height:1;filter:drop-shadow(0 4px 10px rgba(147,51,234,0.18))">🏆</span>
                         <span style="position:absolute;bottom:8px;right:8px;font-size:20px;line-height:1">🥇</span>`
        },
        {
            id: 'analytics', label: 'Analytics', icon: 'bar-chart-2', navAway: false,
            illusBg: 'bg-[#FFF1F2]', iconColor: 'text-[#E11D48]',
            desc: 'Explore attendance\ninsights & trends',
            illusEmoji: `<span style="font-size:54px;line-height:1;filter:drop-shadow(0 4px 10px rgba(225,29,72,0.18))">📊</span>
                         <span style="position:absolute;bottom:8px;right:8px;font-size:20px;line-height:1">📈</span>`
        },
    ];

    const featureCardsHtml = FEATURES.map(f => {
        const isActive = currentAttendanceSubView === f.id;
        const ringCls  = isActive ? 'ring-2 ring-[#7C3AED] ring-offset-1 shadow-md' : '';
        const descLines = f.desc.split('\n').join('<br>');
        return `
            <div class="att-feature-card ${ringCls}" onclick="setAttendanceSubView('${f.id}')">
                <!-- Illustration area -->
                <div class="att-feature-illus ${f.illusBg} relative overflow-hidden" style="height:138px">
                    <!-- Decorative blobs -->
                    <div style="position:absolute;top:-18px;right:-18px;width:64px;height:64px;border-radius:50%;background:rgba(255,255,255,0.55)"></div>
                    <div style="position:absolute;bottom:-12px;left:-12px;width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,0.45)"></div>
                    <!-- Small icon badge top-left -->
                    <div style="position:absolute;top:10px;left:10px;width:28px;height:28px;border-radius:10px;background:rgba(255,255,255,0.92);box-shadow:0 2px 6px rgba(0,0,0,0.08);display:flex;align-items:center;justify-content:center;z-index:2">
                        <i data-lucide="${f.icon}" style="width:13px;height:13px" class="${f.iconColor}"></i>
                    </div>
                    <!-- Main illustration -->
                    <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding-top:14px">
                        ${f.illusEmoji}
                    </div>
                </div>
                <!-- Text body -->
                <div class="att-feature-body">
                    <div class="flex-1">
                        <h4 class="font-bold text-slate-800 text-[13px] mb-0.5 leading-tight">${f.label}</h4>
                        <p class="text-[11px] text-[#9CA3AF] leading-relaxed">${descLines}</p>
                    </div>
                    <div class="flex justify-end pt-2">
                        <div class="att-feature-arrow ${isActive ? 'att-feature-arrow--active' : ''}">
                            <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    let workspaceHtml = '';
    if (currentAttendanceSubView === 'calendar')          workspaceHtml = renderCalendarWorkspace();
    else if (currentAttendanceSubView === 'late-credits') workspaceHtml = renderLateCreditsWorkspace();
    else if (currentAttendanceSubView === 'leaderboard')  workspaceHtml = renderLeaderboardWorkspace();
    else if (currentAttendanceSubView === 'analytics')    workspaceHtml = renderAnalyticsWorkspace();

    return `
        <div class="space-y-5 animate-fade-in w-full min-w-0">
            <!-- KPI Cards -->
            <div class="grid grid-cols-5 gap-4">
                <div class="att-kpi-card">
                    <div class="att-kpi-icon" style="background:#ECFDF5">
                        <i data-lucide="user-check" class="w-7 h-7 text-emerald-500"></i>
                    </div>
                    <div class="min-w-0">
                        <p class="att-kpi-label">Present Days</p>
                        <p class="att-kpi-value" id="landing-present">-</p>
                        <p class="att-kpi-sub">This Month</p>
                    </div>
                </div>
                <div class="att-kpi-card">
                    <div class="att-kpi-icon" style="background:#FEF2F2">
                        <i data-lucide="user-x" class="w-7 h-7 text-red-400"></i>
                    </div>
                    <div class="min-w-0">
                        <p class="att-kpi-label">Absent Days</p>
                        <p class="att-kpi-value" id="landing-absent">-</p>
                        <p class="att-kpi-sub">This Month</p>
                    </div>
                </div>
                <div class="att-kpi-card">
                    <div class="att-kpi-icon" style="background:#FFFBEB">
                        <i data-lucide="clock" class="w-7 h-7 text-amber-500"></i>
                    </div>
                    <div class="min-w-0">
                        <p class="att-kpi-label">Half Days</p>
                        <p class="att-kpi-value" id="landing-half">-</p>
                        <p class="att-kpi-sub">This Month</p>
                    </div>
                </div>
                <div class="att-kpi-card">
                    <div class="att-kpi-icon" style="background:#F5F3FF">
                        <i data-lucide="alarm-clock" class="w-7 h-7 text-violet-500"></i>
                    </div>
                    <div class="min-w-0">
                        <p class="att-kpi-label">Late Arrivals</p>
                        <p class="att-kpi-value" id="landing-late">-</p>
                        <p class="att-kpi-sub">This Month</p>
                    </div>
                </div>
                <div class="att-kpi-card">
                    <div class="att-kpi-icon" style="background:#FFF1F2">
                        <i data-lucide="wallet" class="w-7 h-7 text-rose-400"></i>
                    </div>
                    <div class="min-w-0">
                        <p class="att-kpi-label">Late Credits</p>
                        <p class="att-kpi-value" id="landing-credits">-</p>
                        <p class="att-kpi-sub">Remaining</p>
                    </div>
                </div>
            </div>

            <!-- Attendance Center -->
            <div>
                <h2 class="text-[18px] font-bold text-slate-800 mb-0.5">Attendance Center</h2>
                <p class="text-[12px] text-[#9CA3AF] mb-4">Choose an option below to manage and view your attendance</p>
                <div class="grid grid-cols-6 gap-3">
                    ${featureCardsHtml}
                </div>
            </div>

            <!-- Dynamic Workspace -->
            <div id="att-workspace-area" class="animate-fade-in">
                ${workspaceHtml}
            </div>
        </div>
    `;
}

async function initAttendanceLanding(state) {
    try {
        const overview = await apiClient('/employee/attendance/overview');
        const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };
        setEl('landing-present', overview.present_days);
        setEl('landing-absent',  overview.absent_days);
        setEl('landing-half',    overview.half_days);
        setEl('landing-late',    overview.late_arrivals);
        setEl('landing-credits', overview.late_credits);
    } catch (e) {
        console.error('Failed to load overview data', e);
        showToast('Failed to load overview metrics', 'error');
    }
}

function renderCalendarWorkspace() {
    const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const monthOpts = MONTH_NAMES.map((m, i) => `<option value="${i+1}" ${calendarMonth === i+1 ? 'selected' : ''}>${m}</option>`).join('');
    const yearOpts = [2024,2025,2026,2027].map(y => `<option value="${y}" ${calendarYear === y ? 'selected' : ''}>${y}</option>`).join('');

    const LEGEND_ITEMS = [
        { label: 'Present',  color: '#22C55E' },
        { label: 'Absent',   color: '#EF4444' },
        { label: 'Half Day', color: '#F59E0B' },
        { label: 'On Duty',  color: '#2563EB' },
        { label: 'Leave',    color: '#06B6D4' },
        { label: 'Holiday',  color: '#8B5CF6' },
    ];
    const legendHtml = LEGEND_ITEMS.map(l =>
        `<span class="cal-legend-item">
            <span style="width:8px;height:8px;border-radius:50%;background:${l.color};display:inline-block;flex-shrink:0"></span>${l.label}
        </span>`
    ).join('');

    const dayHeaders = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
        .map((d,i) => `<div class="cal-day-header ${i>=5?'cal-day-header--weekend':''}">${d}</div>`).join('');

    return `
        <div class="cal-workspace">
            <!-- Header row -->
            <div class="flex items-center gap-3">
                <div class="cal-workspace-icon">
                    <i data-lucide="calendar-days" class="w-5 h-5 text-violet-600"></i>
                </div>
                <div>
                    <h2 class="cal-workspace-title">Calendar</h2>
                    <p class="cal-workspace-subtitle">View your attendance for the selected date</p>
                </div>
            </div>

            <div class="cal-layout">
                <!-- Left: Calendar (65%) -->
                <div>
                    <!-- Controls -->
                    <div class="cal-controls">
                        <div class="flex items-center gap-2">
                            <div class="cal-month-pill">
                                <select id="cal-month-select" onchange="changeCalendarMonth(this.value)">${monthOpts}</select>
                                <i data-lucide="chevron-down" class="w-3 h-3 text-slate-400 pointer-events-none flex-shrink-0"></i>
                            </div>
                            <div class="cal-month-pill">
                                <select id="cal-year-select" onchange="changeCalendarYear(this.value)">${yearOpts}</select>
                                <i data-lucide="chevron-down" class="w-3 h-3 text-slate-400 pointer-events-none flex-shrink-0"></i>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <button class="cal-nav-btn" onclick="prevCalendarMonth()">
                                <i data-lucide="chevron-left" class="w-4 h-4"></i>
                            </button>
                            <button class="cal-nav-btn" onclick="nextCalendarMonth()">
                                <i data-lucide="chevron-right" class="w-4 h-4"></i>
                            </button>
                            <button class="cal-today-btn" onclick="goToToday()">Today</button>
                            <button class="cal-legend-btn" onclick="toggleCalLegend(this)">
                                <i data-lucide="layout-grid" class="w-3 h-3"></i>
                                <span>Legend</span>
                                <i data-lucide="chevron-down" class="w-3 h-3 opacity-50" id="cal-legend-arrow" style="transition:transform 0.2s"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Day-of-week labels -->
                    <div class="cal-day-headers">${dayHeaders}</div>

                    <!-- Calendar grid (filled by initAttendanceCalendar) -->
                    <div id="calendar-grid-container" class="cal-grid"></div>

                    <!-- Permanent legend row -->
                    <div class="cal-legend-row">${legendHtml}</div>
                </div>

                <!-- Right: Details panel (35%) -->
                <div class="cal-right-panel">
                    <div id="cal-right-panel-content" class="flex-1 flex flex-col"></div>
                </div>
            </div>
        </div>
    `;
}

async function initAttendanceCalendar() {
    try {
        const list = await apiClient(`/employee/attendance/calendar?year=${calendarYear}&month=${calendarMonth}`);

        const firstDay = new Date(calendarYear, calendarMonth - 1, 1).getDay();
        const startOffset = firstDay === 0 ? 6 : firstDay - 1;
        const totalDays = new Date(calendarYear, calendarMonth, 0).getDate();
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

        // Previous month's trailing days
        const prevMonthLastDay = new Date(calendarYear, calendarMonth - 1, 0).getDate();
        let gridHtml = '';
        for (let i = 0; i < startOffset; i++) {
            const prevDay = prevMonthLastDay - (startOffset - 1 - i);
            gridHtml += `<div class="cal-tile cal-tile--inactive"><span class="cal-tile__day">${prevDay}</span><span class="cal-tile__dot cal-tile__dot--empty"></span></div>`;
        }

        // Current month days
        for (let day = 1; day <= totalDays; day++) {
            const dateStr = `${calendarYear}-${String(calendarMonth).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
            const record = list.find(r => r.date === dateStr);
            const isSelected = calendarSelectedDate === dateStr;
            const isToday = dateStr === todayStr;
            const dotCls = record ? `cal-tile__dot--${record.status.replace(/\s+/g,'-')}` : 'cal-tile__dot--empty';
            let extraCls = isSelected ? 'cal-tile--selected' : isToday ? 'cal-tile--today' : '';
            gridHtml += `
                <div class="cal-tile ${extraCls}" onclick="selectCalendarDate('${dateStr}')">
                    <span class="cal-tile__day">${day}</span>
                    <span class="cal-tile__dot ${dotCls}"></span>
                </div>`;
        }

        // Next month's leading days to complete the grid
        const totalCells = Math.ceil((startOffset + totalDays) / 7) * 7;
        const trailingCount = totalCells - (startOffset + totalDays);
        for (let i = 1; i <= trailingCount; i++) {
            gridHtml += `<div class="cal-tile cal-tile--inactive"><span class="cal-tile__day">${i}</span><span class="cal-tile__dot cal-tile__dot--empty"></span></div>`;
        }

        const container = document.getElementById('calendar-grid-container');
        if (container) container.innerHTML = gridHtml;

        if (calendarSelectedDate) {
            await selectCalendarDate(calendarSelectedDate);
        } else {
            renderCalRightEmpty();
        }
    } catch (e) {
        console.error('Calendar error', e);
        showToast('Failed to load calendar logs', 'error');
    }
}

function renderCalRightEmpty() {
    const rightPanel = document.getElementById('cal-right-panel-content');
    if (!rightPanel) return;
    rightPanel.innerHTML = `
        <div class="flex flex-col items-center justify-between h-full py-8 px-6">
            <div class="flex-1 flex flex-col items-center justify-center gap-5">
                <div class="cal-illus-wrap">
                    <div class="cal-illus-circle">
                        <i data-lucide="calendar-days" class="w-12 h-12 text-violet-300"></i>
                    </div>
                    <div class="cal-illus-plant">🌿</div>
                </div>
                <div class="text-center">
                    <p class="text-[14px] font-semibold text-slate-500 mb-1">Select a date</p>
                    <p class="text-[12px] text-[#9CA3AF] leading-relaxed">Click on any calendar tile<br>to view attendance details</p>
                </div>
            </div>
            <!-- Bottom decoration -->
            <div class="opacity-20 pointer-events-none select-none">
                <svg width="120" height="56" viewBox="0 0 120 56" fill="none">
                    <rect x="4" y="8" width="48" height="44" rx="9" fill="#7C3AED"/>
                    <rect x="4" y="8" width="48" height="16" rx="9" fill="#5B21B6"/>
                    <rect x="17" y="2" width="4" height="12" rx="2" fill="#5B21B6"/>
                    <rect x="31" y="2" width="4" height="12" rx="2" fill="#5B21B6"/>
                    <rect x="12" y="34" width="12" height="3" rx="1.5" fill="white" opacity="0.5"/>
                    <rect x="12" y="42" width="8" height="3" rx="1.5" fill="white" opacity="0.35"/>
                    <circle cx="93" cy="28" r="22" fill="#7C3AED"/>
                    <circle cx="93" cy="28" r="16" fill="#5B21B6"/>
                    <line x1="93" y1="28" x2="93" y2="17" stroke="white" stroke-width="2" stroke-linecap="round"/>
                    <line x1="93" y1="28" x2="102" y2="28" stroke="white" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </div>
        </div>
    `;
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

window.changeCalendarMonth = (m) => {
    calendarMonth = parseInt(m);
    calendarSelectedDate = null;
    loadPanel('attendance');
};

window.changeCalendarYear = (y) => {
    calendarYear = parseInt(y);
    calendarSelectedDate = null;
    loadPanel('attendance');
};

window.prevCalendarMonth = () => {
    calendarMonth--;
    if (calendarMonth < 1) { calendarMonth = 12; calendarYear--; }
    calendarSelectedDate = null;
    loadPanel('attendance');
};

window.nextCalendarMonth = () => {
    calendarMonth++;
    if (calendarMonth > 12) { calendarMonth = 1; calendarYear++; }
    calendarSelectedDate = null;
    loadPanel('attendance');
};

window.goToToday = () => {
    const now = new Date();
    calendarMonth = now.getMonth() + 1;
    calendarYear = now.getFullYear();
    calendarSelectedDate = null;
    loadPanel('attendance');
};

window.selectCalendarDate = async (dateStr) => {
    calendarSelectedDate = dateStr;
    // Update tile selection highlight without full reload
    document.querySelectorAll('.cal-tile').forEach(t => t.classList.remove('cal-tile--selected'));
    const tiles = document.querySelectorAll('.cal-tile:not(.cal-tile--inactive)');
    const day = parseInt(dateStr.split('-')[2]);
    if (tiles[day - 1]) tiles[day - 1].classList.add('cal-tile--selected');

    const rightPanel = document.getElementById('cal-right-panel-content');
    if (!rightPanel) return;

    try {
        const details = await apiClient(`/employee/attendance/date-details/${dateStr}`);

        const [y, m, d] = dateStr.split('-');
        const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const displayDate = `${parseInt(d)} ${monthNames[parseInt(m)-1]} ${y}`;

        if (!details) {
            rightPanel.innerHTML = `
                <div class="flex flex-col h-full items-center justify-center p-8 text-center gap-4">
                    <div class="w-14 h-14 rounded-2xl flex items-center justify-center" style="background:rgba(124,58,237,0.08)">
                        <i data-lucide="calendar-x" class="w-7 h-7 text-violet-300"></i>
                    </div>
                    <div>
                        <p class="text-[13px] font-semibold text-slate-600 mb-1">No record found</p>
                        <p class="text-[11px] text-[#9CA3AF]">${displayDate}</p>
                    </div>
                    <button onclick="clearSelectedDate(event)" class="text-[11px] font-bold text-violet-600 hover:text-violet-700 px-4 py-2 rounded-xl hover:bg-violet-50 transition-colors">← Back</button>
                </div>`;
            if (typeof lucide !== 'undefined') lucide.createIcons();
            return;
        }

        // Status pill styles
        const STATUS_STYLES = {
            'Present':  { bg: '#DCFCE7', color: '#15803D' },
            'Absent':   { bg: '#FEE2E2', color: '#DC2626' },
            'Half Day': { bg: '#FEF3C7', color: '#D97706' },
            'On Duty':  { bg: '#DBEAFE', color: '#1D4ED8' },
            'Leave':    { bg: '#CFFAFE', color: '#0E7490' },
            'Holiday':  { bg: '#EDE9FE', color: '#6D28D9' },
        };
        const ss = STATUS_STYLES[details.status] || { bg: '#F3F4F6', color: '#6B7280' };

        // Detail rows — only render fields with values
        const DETAIL_FIELDS = [
            { key: 'clock_in',     label: 'Check In',     icon: 'log-in',         valueClass: 'font-bold text-slate-800' },
            { key: 'clock_out',    label: 'Check Out',    icon: 'log-out',        valueClass: 'font-bold text-slate-800' },
            { key: 'worked_hours', label: 'Worked Hours', icon: 'clock',          valueClass: 'font-bold text-slate-800' },
            { key: 'overtime',     label: 'Overtime',     icon: 'zap',            valueClass: 'font-bold text-emerald-600' },
            { key: 'late_minutes', label: 'Late Minutes', icon: 'alarm-clock',    valueClass: 'font-bold text-amber-600' },
            { key: 'remarks',      label: 'Remarks',      icon: 'message-circle', valueClass: 'font-semibold text-slate-700' },
        ];
        const detailRows = DETAIL_FIELDS
            .filter(f => details[f.key] !== undefined && details[f.key] !== null && details[f.key] !== '')
            .map(f => `
                <div class="flex items-center justify-between py-3 last:border-0" style="border-bottom:1px solid rgba(124,58,237,0.07)">
                    <div class="flex items-center gap-2.5">
                        <div class="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0" style="background:rgba(124,58,237,0.08)">
                            <i data-lucide="${f.icon}" class="w-3.5 h-3.5 text-violet-500"></i>
                        </div>
                        <span class="text-[12px] text-[#6B7280] font-medium">${f.label}</span>
                    </div>
                    <span class="text-[13px] ${f.valueClass} ml-2 text-right">${details[f.key]}</span>
                </div>`).join('');

        rightPanel.innerHTML = `
            <div class="flex flex-col h-full animate-fade-in">
                <!-- Date badge + status -->
                <div class="flex flex-col items-center text-center pt-7 pb-5 px-5">
                    <div class="cal-date-badge mb-3">${parseInt(d)}</div>
                    <p class="cal-detail-date mb-2">${displayDate}</p>
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-bold" style="background:${ss.bg};color:${ss.color}">${details.status}</span>
                </div>
                <!-- Gradient divider -->
                <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(124,58,237,0.15),transparent);margin:0 20px"></div>
                <!-- Detail rows -->
                <div class="flex-1 px-5 py-3 overflow-y-auto">
                    ${detailRows || '<p class="text-center text-[12px] text-[#9CA3AF] py-6 font-medium">No additional details.</p>'}
                </div>
                <!-- Bottom illustration + back -->
                <div class="flex flex-col items-center pb-4 pt-2 gap-3">
                    <div class="opacity-[0.12] pointer-events-none select-none">
                        <svg width="130" height="60" viewBox="0 0 130 60" fill="none">
                            <rect x="4" y="8" width="50" height="48" rx="10" fill="#7C3AED"/>
                            <rect x="4" y="8" width="50" height="17" rx="10" fill="#5B21B6"/>
                            <rect x="18" y="2" width="5" height="13" rx="2.5" fill="#5B21B6"/>
                            <rect x="33" y="2" width="5" height="13" rx="2.5" fill="#5B21B6"/>
                            <rect x="13" y="36" width="13" height="3" rx="1.5" fill="white" opacity="0.55"/>
                            <rect x="13" y="45" width="9" height="3" rx="1.5" fill="white" opacity="0.38"/>
                            <rect x="31" y="36" width="10" height="3" rx="1.5" fill="white" opacity="0.55"/>
                            <circle cx="101" cy="30" r="24" fill="#7C3AED"/>
                            <circle cx="101" cy="30" r="17" fill="#5B21B6"/>
                            <line x1="101" y1="30" x2="101" y2="17" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
                            <line x1="101" y1="30" x2="111" y2="30" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
                            <path d="M62 58 Q72 40 84 52" stroke="#7C3AED" stroke-width="3" fill="none" stroke-linecap="round"/>
                            <path d="M67 60 Q82 38 98 50" stroke="#5B21B6" stroke-width="2.5" fill="none" stroke-linecap="round"/>
                        </svg>
                    </div>
                    <button onclick="clearSelectedDate(event)" class="text-[11px] font-bold text-[#9CA3AF] hover:text-violet-600 transition-colors">← Back to month view</button>
                </div>
            </div>`;

        if (typeof lucide !== 'undefined') lucide.createIcons();
    } catch (e) {
        console.error('Details fetch error', e);
        showToast('Failed to load date details', 'error');
    }
};

window.clearSelectedDate = (e) => {
    if (e) e.stopPropagation();
    calendarSelectedDate = null;
    renderCalRightEmpty();
    document.querySelectorAll('.cal-tile--selected').forEach(t => t.classList.remove('cal-tile--selected'));
};

window.toggleCalLegend = (btn) => {
    const panel = document.getElementById('cal-legend-panel');
    const arrow = document.getElementById('cal-legend-arrow');
    if (!panel) return;
    const isHidden = panel.classList.contains('hidden');
    panel.classList.toggle('hidden', !isHidden);
    if (arrow) arrow.style.transform = isHidden ? 'rotate(180deg)' : '';
};

function renderAttendanceHistory(state) {
    return `
        <div class="space-y-6 animate-fade-in">
            ${getSubViewHeader('Attendance History Logs', 'History')}

            <div class="bg-white rounded-2xl border border-[#ECECF3] p-5 shadow-sm space-y-4">
                <div class="flex flex-wrap items-center justify-between gap-4">
                    <div class="flex flex-wrap items-center gap-3">
                        <div class="relative w-48">
                            <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6B7280]"></i>
                            <input type="text" id="hist-search" placeholder="Search remarks..." class="text-xs border border-[#ECECF3] rounded-xl pl-8 pr-3 py-1.5 focus:outline-none w-full text-slate-600 font-semibold" value="${historyFilters.search}" oninput="updateHistoryFilters('search', this.value)">
                        </div>
                        
                        <select id="hist-status" class="text-xs border border-[#ECECF3] rounded-xl px-3 py-1.5 focus:outline-none text-slate-600 font-semibold" onchange="updateHistoryFilters('status', this.value)">
                            ${['All', 'Present', 'Absent', 'Half Day', 'Late', 'On Duty', 'Holiday'].map(s => `<option value="${s}" ${historyFilters.status === s ? 'selected' : ''}>${s}</option>`).join('')}
                        </select>
                        
                        <div class="flex items-center gap-1.5 text-xs text-[#6B7280] font-semibold">
                            <input type="date" id="hist-from" class="border border-[#ECECF3] rounded-xl px-2 py-1.5 focus:outline-none text-slate-600" value="${historyFilters.from_date}" onchange="updateHistoryFilters('from_date', this.value)">
                            <span>to</span>
                            <input type="date" id="hist-to" class="border border-[#ECECF3] rounded-xl px-2 py-1.5 focus:outline-none text-slate-600" value="${historyFilters.to_date}" onchange="updateHistoryFilters('to_date', this.value)">
                        </div>
                    </div>

                    <div class="flex items-center gap-2">
                        <button onclick="triggerExport('csv')" class="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white border border-[#ECECF3] hover:border-purple-600 hover:text-purple-600 px-3 py-2 rounded-xl transition shadow-sm">
                            <i data-lucide="download" class="w-3.5 h-3.5"></i> Export CSV
                        </button>
                        <button onclick="triggerExport('pdf')" class="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white border border-[#ECECF3] hover:border-purple-600 hover:text-purple-600 px-3 py-2 rounded-xl transition shadow-sm">
                            <i data-lucide="file" class="w-3.5 h-3.5"></i> Export PDF
                        </button>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-2xl border border-[#ECECF3] shadow-sm overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="border-b border-[#ECECF3] bg-[#FAFAFC]">
                                <th class="px-6 py-4 text-[10px] font-extrabold text-[#6B7280] uppercase tracking-wider">Date</th>
                                <th class="px-6 py-4 text-[10px] font-extrabold text-[#6B7280] uppercase tracking-wider">Status</th>
                                <th class="px-6 py-4 text-[10px] font-extrabold text-[#6B7280] uppercase tracking-wider">Check In</th>
                                <th class="px-6 py-4 text-[10px] font-extrabold text-[#6B7280] uppercase tracking-wider">Check Out</th>
                                <th class="px-6 py-4 text-[10px] font-extrabold text-[#6B7280] uppercase tracking-wider">Worked Hours</th>
                                <th class="px-6 py-4 text-[10px] font-extrabold text-[#6B7280] uppercase tracking-wider">Overtime</th>
                                <th class="px-6 py-4 text-[10px] font-extrabold text-[#6B7280] uppercase tracking-wider">Remarks</th>
                            </tr>
                        </thead>
                        <tbody id="history-table-body" class="divide-y divide-[#ECECF3]">
                        </tbody>
                    </table>
                </div>
                
                <div class="px-6 py-4 border-t border-[#ECECF3] flex items-center justify-between bg-[#FAFAFC]">
                    <div class="flex items-center gap-2">
                        <span class="text-xs text-[#6B7280] font-semibold">Rows per page:</span>
                        <select class="text-xs border border-[#ECECF3] rounded-lg px-2 py-1 focus:outline-none text-slate-600 font-bold" onchange="updateHistoryFilters('limit', this.value)">
                            ${[10, 25, 50, 100].map(l => `<option value="${l}" ${historyFilters.limit == l ? 'selected' : ''}>${l}</option>`).join('')}
                        </select>
                        <span class="text-xs text-[#6B7280] font-semibold ml-4" id="hist-total-range">-</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <button id="hist-prev-btn" onclick="historyPrevPage()" class="p-1.5 border border-[#ECECF3] hover:border-purple-600 rounded-lg text-[#6B7280] hover:text-purple-600 transition disabled:opacity-40 disabled:pointer-events-none">
                            <i data-lucide="chevron-left" class="w-4 h-4"></i>
                        </button>
                        <button id="hist-next-btn" onclick="historyNextPage()" class="p-1.5 border border-[#ECECF3] hover:border-purple-600 rounded-lg text-[#6B7280] hover:text-purple-600 transition disabled:opacity-40 disabled:pointer-events-none">
                            <i data-lucide="chevron-right" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

async function initAttendanceHistory(state) {
    try {
        const queryParams = new URLSearchParams({
            page: historyFilters.page,
            limit: historyFilters.limit,
            status: historyFilters.status,
            search: historyFilters.search,
            from_date: historyFilters.from_date,
            to_date: historyFilters.to_date
        });
        
        const res = await apiClient(`/employee/attendance/history?${queryParams.toString()}`);
        
        let rowsHtml = '';
        if (res.data.length === 0) {
            rowsHtml = `
                <tr>
                    <td colspan="7" class="px-6 py-12 text-center text-xs text-[#6B7280] font-semibold">
                        No records match the current filters.
                    </td>
                </tr>
            `;
        } else {
            res.data.forEach(row => {
                let statusBadge = `<span class="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase border `;
                if (row.status === 'Present') statusBadge += `bg-emerald-50 text-emerald-700 border-emerald-100">Present</span>`;
                else if (row.status === 'Absent') statusBadge += `bg-red-50 text-red-700 border-red-100">Absent</span>`;
                else if (row.status === 'Half Day') statusBadge += `bg-amber-50 text-amber-700 border-amber-100">Half Day</span>`;
                else if (row.status === 'Late') statusBadge += `bg-purple-50 text-purple-700 border-purple-100">Late</span>`;
                else if (row.status === 'On Duty') statusBadge += `bg-blue-50 text-blue-700 border-blue-100">On Duty</span>`;
                else if (row.status === 'Holiday') statusBadge += `bg-violet-50 text-violet-700 border-violet-100">Holiday</span>`;
                else statusBadge += `bg-slate-50 text-slate-700 border-slate-100">${row.status}</span>`;
                
                rowsHtml += `
                    <tr class="hover:bg-[#FAFAFC]/50 transition-colors">
                        <td class="px-6 py-4 text-xs font-bold text-slate-800">${row.date}</td>
                        <td class="px-6 py-4 text-xs font-bold">${statusBadge}</td>
                        <td class="px-6 py-4 text-xs font-semibold text-slate-600">${row.clock_in || '—'}</td>
                        <td class="px-6 py-4 text-xs font-semibold text-slate-600">${row.clock_out || '—'}</td>
                        <td class="px-6 py-4 text-xs font-semibold text-slate-600">${row.worked_hours || '—'}</td>
                        <td class="px-6 py-4 text-xs font-semibold text-slate-600">${row.overtime || '—'}</td>
                        <td class="px-6 py-4 text-xs font-semibold text-[#6B7280] max-w-[200px] truncate" title="${row.remarks || ''}">${row.remarks || '—'}</td>
                    </tr>
                `;
            });
        }
        
        const body = document.getElementById('history-table-body');
        if (body) body.innerHTML = rowsHtml;
        
        const startRange = (historyFilters.page - 1) * historyFilters.limit + 1;
        const endRange = Math.min(historyFilters.page * historyFilters.limit, res.total);
        const rangeText = res.total > 0 ? `${startRange}-${endRange} of ${res.total}` : '0-0 of 0';
        
        const textRange = document.getElementById('hist-total-range');
        if (textRange) textRange.innerText = rangeText;
        
        const prevBtn = document.getElementById('hist-prev-btn');
        const nextBtn = document.getElementById('hist-next-btn');
        
        if (prevBtn) prevBtn.disabled = historyFilters.page === 1;
        if (nextBtn) nextBtn.disabled = endRange >= res.total;
        
        if (typeof lucide !== 'undefined') lucide.createIcons();
    } catch (e) {
        console.error('History fetch error', e);
        showToast('Failed to load history logs', 'error');
    }
}

let filterDebounceTimer;
window.updateHistoryFilters = (key, val) => {
    historyFilters[key] = val;
    if (key !== 'page') historyFilters.page = 1;
    
    if (key === 'search') {
        clearTimeout(filterDebounceTimer);
        filterDebounceTimer = setTimeout(() => {
            initHistoryFetch();
        }, 300);
    } else {
        loadPanel('attendance');
    }
};

function initHistoryFetch() {
    const activePanel = employeeState.activePanel;
    if (activePanel === 'attendance' && currentAttendanceSubView === 'history') {
        initAttendanceHistory(employeeState);
    }
}

window.historyPrevPage = () => {
    if (historyFilters.page > 1) {
        historyFilters.page--;
        loadPanel('attendance');
    }
};

window.historyNextPage = () => {
    historyFilters.page++;
    loadPanel('attendance');
};

window.triggerExport = (type) => {
    const queryParams = new URLSearchParams({
        status: historyFilters.status,
        search: historyFilters.search,
        from_date: historyFilters.from_date,
        to_date: historyFilters.to_date
    });
    
    const url = `/api/employee/attendance/export/${type}?${queryParams.toString()}`;
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `attendance_history.${type}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Downloading Attendance ${type.toUpperCase()}...`, 'success');
};

function renderAttendanceCorrections(state) {
    return `
        <div class="space-y-6 animate-fade-in">
            ${getSubViewHeader('Attendance Corrections Center', 'Corrections')}

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="bg-white rounded-2xl border border-[#ECECF3] p-6 shadow-sm h-fit">
                    <h3 class="font-bold text-sm text-slate-800 uppercase tracking-wider mb-4">New Request</h3>
                    <form id="correction-form" onsubmit="submitCorrectionRequest(event)" class="space-y-4">
                        <div>
                            <label class="block text-[10px] text-[#6B7280] font-bold uppercase tracking-wider mb-1">Attendance Date</label>
                            <input type="date" id="corr-date" required class="text-xs border border-[#ECECF3] rounded-xl px-3 py-2 focus:outline-none w-full text-slate-600 font-semibold">
                        </div>
                        <div>
                            <label class="block text-[10px] text-[#6B7280] font-bold uppercase tracking-wider mb-1">Correction Type</label>
                            <select id="corr-type" required class="text-xs border border-[#ECECF3] rounded-xl px-3 py-2 focus:outline-none w-full text-slate-600 font-semibold">
                                <option value="Forgot Tap In">Forgot Tap In</option>
                                <option value="Forgot Tap Out">Forgot Tap Out</option>
                                <option value="Late Explanation">Late Explanation</option>
                                <option value="Incorrect Status">Incorrect Status</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-[10px] text-[#6B7280] font-bold uppercase tracking-wider mb-1">Reason</label>
                            <select id="corr-reason" required class="text-xs border border-[#ECECF3] rounded-xl px-3 py-2 focus:outline-none w-full text-slate-600 font-semibold">
                                <option value="Public transport delay">Public transport delay</option>
                                <option value="Client meeting">Client meeting</option>
                                <option value="Technical issue">Technical issue</option>
                                <option value="Medical emergency">Medical emergency</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-[10px] text-[#6B7280] font-bold uppercase tracking-wider mb-1">Remarks</label>
                            <textarea id="corr-remarks" required placeholder="Provide brief explanation..." rows="3" class="text-xs border border-[#ECECF3] rounded-xl px-3 py-2 focus:outline-none w-full text-slate-600 font-semibold"></textarea>
                        </div>
                        <div>
                            <label class="block text-[10px] text-[#6B7280] font-bold uppercase tracking-wider mb-1">Attachment</label>
                            <input type="file" id="corr-attachment" class="text-xs border border-[#ECECF3] rounded-xl px-3 py-1.5 focus:outline-none w-full text-slate-500">
                        </div>
                        <button type="submit" class="w-full py-2.5 bg-[#610173] hover:bg-[#540063] text-white text-xs font-bold rounded-xl transition shadow-sm">
                            Submit Request
                        </button>
                    </form>
                </div>

                <div class="bg-white rounded-2xl border border-[#ECECF3] p-6 shadow-sm lg:col-span-2 overflow-hidden flex flex-col">
                    <h3 class="font-bold text-sm text-slate-800 uppercase tracking-wider mb-4">Request History</h3>
                    <div class="overflow-x-auto flex-grow">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="border-b border-[#ECECF3] bg-[#FAFAFC]">
                                    <th class="px-4 py-3 text-[10px] font-extrabold text-[#6B7280] uppercase tracking-wider">Request ID</th>
                                    <th class="px-4 py-3 text-[10px] font-extrabold text-[#6B7280] uppercase tracking-wider">Date</th>
                                    <th class="px-4 py-3 text-[10px] font-extrabold text-[#6B7280] uppercase tracking-wider">Type</th>
                                    <th class="px-4 py-3 text-[10px] font-extrabold text-[#6B7280] uppercase tracking-wider">Applied On</th>
                                    <th class="px-4 py-3 text-[10px] font-extrabold text-[#6B7280] uppercase tracking-wider">Status</th>
                                    <th class="px-4 py-3 text-[10px] font-extrabold text-[#6B7280] uppercase tracking-wider">Manager Remarks</th>
                                </tr>
                            </thead>
                            <tbody id="corrections-table-body" class="divide-y divide-[#ECECF3]">
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
}

async function initAttendanceCorrections(state) {
    try {
        const list = await apiClient('/employee/attendance/corrections');
        let rowsHtml = '';
        if (list.length === 0) {
            rowsHtml = `
                <tr>
                    <td colspan="6" class="px-4 py-10 text-center text-xs text-[#6B7280] font-semibold">
                        No correction requests submitted yet.
                    </td>
                </tr>
            `;
        } else {
            list.forEach(row => {
                let statusBadge = `<span class="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase border `;
                if (row.status === 'Approved') statusBadge += `bg-emerald-50 text-emerald-700 border-emerald-100">Approved</span>`;
                else if (row.status === 'Rejected') statusBadge += `bg-rose-50 text-rose-700 border-rose-100">Rejected</span>`;
                else statusBadge += `bg-amber-50 text-amber-700 border-amber-100">Pending</span>`;
                
                rowsHtml += `
                    <tr class="hover:bg-[#FAFAFC]/50 transition-colors">
                        <td class="px-4 py-3 text-xs font-bold text-[#610173]">${row.id}</td>
                        <td class="px-4 py-3 text-xs font-bold text-slate-800">${row.date}</td>
                        <td class="px-4 py-3 text-xs font-semibold text-slate-600">${row.type}</td>
                        <td class="px-4 py-3 text-xs font-semibold text-slate-600">${row.created_at || '—'}</td>
                        <td class="px-4 py-3 text-xs font-bold">${statusBadge}</td>
                        <td class="px-4 py-3 text-xs font-semibold text-[#6B7280] max-w-[150px] truncate" title="${row.manager_remarks || ''}">${row.manager_remarks || '—'}</td>
                    </tr>
                `;
            });
        }
        
        const body = document.getElementById('corrections-table-body');
        if (body) body.innerHTML = rowsHtml;
    } catch (e) {
        console.error('Corrections load error', e);
        showToast('Failed to load correction history', 'error');
    }
}

window.submitCorrectionRequest = async (e) => {
    e.preventDefault();
    const date = document.getElementById('corr-date').value;
    const type = document.getElementById('corr-type').value;
    const reason = document.getElementById('corr-reason').value;
    const remarks = document.getElementById('corr-remarks').value;
    
    try {
        const res = await apiClient('/employee/attendance/corrections', {
            method: 'POST',
            body: { date, type, reason, remarks }
        });
        
        if (res.ok) {
            showToast('Correction request submitted successfully!', 'success');
            document.getElementById('correction-form').reset();
            initAttendanceCorrections(employeeState);
        }
    } catch (err) {
        console.error('Submit correction error', err);
        showToast(err.message, 'error');
    }
};

function renderLateCreditsWorkspace() {
    return `
        <div class="space-y-5 animate-fade-in">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <div class="w-7 h-7 bg-pink-50 border border-pink-100 rounded-xl flex items-center justify-center text-pink-600">
                        <i data-lucide="award" class="w-3.5 h-3.5"></i>
                    </div>
                    <h3 class="font-bold text-sm text-slate-800">Late Credits</h3>
                </div>
                <div class="text-[10px] font-extrabold text-[#6B7280] bg-[#FAFAFC] px-3 py-1.5 rounded-xl border border-[#ECECF3] uppercase tracking-wider">
                    40 Credits / Month
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="att-kpi-card">
                    <div class="att-icon-wrapper bg-slate-50 text-slate-600">
                        <i data-lucide="award" class="w-5 h-5"></i>
                    </div>
                    <div>
                        <p class="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider">Total Credits</p>
                        <h3 class="text-xl font-extrabold text-slate-800 mt-0.5" id="credits-total">40</h3>
                    </div>
                </div>
                <div class="att-kpi-card">
                    <div class="att-icon-wrapper bg-rose-50 text-rose-600">
                        <i data-lucide="minus-circle" class="w-5 h-5"></i>
                    </div>
                    <div>
                        <p class="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider">Used Credits</p>
                        <h3 class="text-xl font-extrabold text-slate-800 mt-0.5" id="credits-used">-</h3>
                    </div>
                </div>
                <div class="att-kpi-card">
                    <div class="att-icon-wrapper bg-emerald-50 text-emerald-600">
                        <i data-lucide="shield-check" class="w-5 h-5"></i>
                    </div>
                    <div>
                        <p class="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider">Remaining Credits</p>
                        <h3 class="text-xl font-extrabold text-slate-800 mt-0.5" id="credits-remaining">-</h3>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-2xl border border-[#ECECF3] shadow-sm overflow-hidden">
                <div class="px-6 py-4 border-b border-[#ECECF3] flex items-center justify-between">
                    <h3 class="font-bold text-sm text-slate-800 uppercase tracking-wider">Credit History</h3>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="border-b border-[#ECECF3] bg-[#FAFAFC]">
                                <th class="px-6 py-4 text-[10px] font-extrabold text-[#6B7280] uppercase tracking-wider">Date</th>
                                <th class="px-6 py-4 text-[10px] font-extrabold text-[#6B7280] uppercase tracking-wider">Late Minutes</th>
                                <th class="px-6 py-4 text-[10px] font-extrabold text-[#6B7280] uppercase tracking-wider">Credits Deducted</th>
                                <th class="px-6 py-4 text-[10px] font-extrabold text-[#6B7280] uppercase tracking-wider">Balance</th>
                            </tr>
                        </thead>
                        <tbody id="credits-table-body" class="divide-y divide-[#ECECF3]"></tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

async function initAttendanceLateCredits(state) {
    try {
        const info = await apiClient('/employee/attendance/late-credits');
        document.getElementById('credits-total').innerText = info.total_credits;
        document.getElementById('credits-used').innerText = info.used_credits;
        document.getElementById('credits-remaining').innerText = info.remaining_credits;
        
        let rowsHtml = '';
        if (info.logs.length === 0) {
            rowsHtml = `
                <tr>
                    <td colspan="4" class="px-6 py-10 text-center text-xs text-[#6B7280] font-semibold">
                        No credit deductions recorded.
                    </td>
                </tr>
            `;
        } else {
            info.logs.forEach(row => {
                rowsHtml += `
                    <tr class="hover:bg-[#FAFAFC]/50 transition-colors">
                        <td class="px-6 py-4 text-xs font-bold text-slate-800">${row.date}</td>
                        <td class="px-6 py-4 text-xs font-semibold text-slate-600">${row.late_minutes} mins</td>
                        <td class="px-6 py-4 text-xs font-bold text-rose-600">-${row.deducted_credits}</td>
                        <td class="px-6 py-4 text-xs font-bold text-emerald-600">${row.balance}</td>
                    </tr>
                `;
            });
        }
        
        const body = document.getElementById('credits-table-body');
        if (body) body.innerHTML = rowsHtml;
    } catch (e) {
        console.error('Credits load error', e);
        showToast('Failed to load late credits data', 'error');
    }
}

function renderLeaderboardWorkspace() {
    return `
        <div class="space-y-5 animate-fade-in">
            <div class="flex items-center gap-2">
                <div class="w-7 h-7 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                    <i data-lucide="trophy" class="w-3.5 h-3.5"></i>
                </div>
                <h3 class="font-bold text-sm text-slate-800">Monthly Leaderboard</h3>
            </div>

            <div class="bg-gradient-to-r from-[#610173] to-[#312E81] text-white p-5 rounded-2xl shadow-md flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <div class="w-11 h-11 bg-white/10 rounded-full flex items-center justify-center text-lg border border-white/20">🏆</div>
                    <div>
                        <h4 class="font-bold text-xs text-purple-100 uppercase tracking-wider">Your Standings</h4>
                        <p class="text-lg font-extrabold mt-0.5">Your Current Rank: <span id="lead-my-rank" class="text-amber-300">-</span></p>
                    </div>
                </div>
                <div class="text-right">
                    <span class="text-[10px] text-purple-200 font-bold uppercase tracking-wider block">Rank Movement</span>
                    <span class="text-lg font-bold mt-0.5 inline-block px-3 py-0.5 rounded-lg bg-white/10 border border-white/10" id="lead-my-movement">—</span>
                </div>
            </div>

            <div class="bg-white rounded-2xl border border-[#ECECF3] shadow-sm overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="border-b border-[#ECECF3] bg-[#FAFAFC]">
                                <th class="px-6 py-4 text-[10px] font-extrabold text-[#6B7280] uppercase tracking-wider">Rank</th>
                                <th class="px-6 py-4 text-[10px] font-extrabold text-[#6B7280] uppercase tracking-wider">Employee</th>
                                <th class="px-6 py-4 text-[10px] font-extrabold text-[#6B7280] uppercase tracking-wider">Department</th>
                                <th class="px-6 py-4 text-[10px] font-extrabold text-[#6B7280] uppercase tracking-wider">Attendance %</th>
                                <th class="px-6 py-4 text-[10px] font-extrabold text-[#6B7280] uppercase tracking-wider">Credits Remaining</th>
                                <th class="px-6 py-4 text-[10px] font-extrabold text-[#6B7280] uppercase tracking-wider">Rank Movement</th>
                            </tr>
                        </thead>
                        <tbody id="leaderboard-table-body" class="divide-y divide-[#ECECF3]"></tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

async function initAttendanceLeaderboard(state) {
    try {
        const list = await apiClient('/employee/attendance/leaderboard');
        let rowsHtml = '';
        let myRank = '-';
        let myMovement = '—';
        
        list.forEach(row => {
            const isMe = row.is_me;
            if (isMe) {
                myRank = `#${row.rank}`;
                myMovement = row.rank_movement;
            }
            
            const rowHighlightClass = isMe ? 'rank-highlight-me font-bold bg-[#fdf6ff]/60' : 'hover:bg-[#FAFAFC]/50';
            const meIndicator = isMe ? `<span class="ml-2 px-1.5 py-0.5 rounded text-[8px] font-extrabold bg-[#610173] text-white tracking-widest uppercase">You</span>` : '';
            
            let movementColor = 'text-slate-400';
            if (row.rank_movement.includes('↑')) movementColor = 'text-emerald-500 font-bold';
            else if (row.rank_movement.includes('↓')) movementColor = 'text-rose-500 font-bold';
            
            rowsHtml += `
                <tr class="transition-colors ${rowHighlightClass}">
                    <td class="px-6 py-4 text-xs font-bold text-slate-800">
                        <div class="flex items-center gap-2">
                            <span>#${row.rank}</span>
                            ${row.rank === 1 ? '🥇' : row.rank === 2 ? '🥈' : row.rank === 3 ? '🥉' : ''}
                        </div>
                    </td>
                    <td class="px-6 py-4 text-xs font-bold text-slate-800">
                        <div class="flex items-center">
                            <span>${row.name}</span>
                            ${meIndicator}
                        </div>
                    </td>
                    <td class="px-6 py-4 text-xs font-semibold text-slate-600">${row.department}</td>
                    <td class="px-6 py-4 text-xs font-bold text-slate-800">${row.attendance_percent}%</td>
                    <td class="px-6 py-4 text-xs font-semibold text-slate-600">${row.remaining_credits} credits</td>
                    <td class="px-6 py-4 text-xs ${movementColor}">${row.rank_movement}</td>
                </tr>
            `;
        });
        
        const myRankEl = document.getElementById('lead-my-rank');
        const myMovEl = document.getElementById('lead-my-movement');
        const body = document.getElementById('leaderboard-table-body');
        
        if (myRankEl) myRankEl.innerText = myRank;
        if (myMovEl) {
            myMovEl.innerText = myMovement;
            myMovEl.className = `text-xl font-bold mt-0.5 inline-block px-3 py-0.5 rounded-lg bg-white/10 border border-white/10 ` + 
                (myMovement.includes('↑') ? 'text-emerald-400' : myMovement.includes('↓') ? 'text-rose-400' : 'text-purple-200');
        }
        if (body) body.innerHTML = rowsHtml;
    } catch (e) {
        console.error('Leaderboard load error', e);
        showToast('Failed to load leaderboard standings', 'error');
    }
}

function renderAnalyticsWorkspace() {
    return `
        <div class="space-y-5 animate-fade-in">
            <div class="flex items-center gap-2">
                <div class="w-7 h-7 bg-teal-50 border border-teal-100 rounded-xl flex items-center justify-center text-teal-600">
                    <i data-lucide="pie-chart" class="w-3.5 h-3.5"></i>
                </div>
                <h3 class="font-bold text-sm text-slate-800">Performance Analytics</h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-white rounded-2xl border border-[#ECECF3] p-5 shadow-sm flex flex-col items-center">
                    <h3 class="font-bold text-xs text-slate-400 uppercase tracking-wider mb-4 w-full text-left">Attendance Distribution</h3>
                    <div style="width: 100%; height: 220px; display: flex; align-items: center; justify-content: center;">
                        <canvas id="chart-distribution" style="max-height: 220px; max-width: 220px;"></canvas>
                    </div>
                </div>
                <div class="bg-white rounded-2xl border border-[#ECECF3] p-5 shadow-sm md:col-span-2 flex flex-col justify-between" style="min-height: 280px;">
                    <h3 class="font-bold text-xs text-slate-400 uppercase tracking-wider mb-4">Attendance Trend (%)</h3>
                    <div class="flex-grow w-full" style="height: 200px;">
                        <canvas id="chart-trend" style="height: 100%; width: 100%;"></canvas>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-2xl border border-[#ECECF3] p-5 shadow-sm flex flex-col justify-between" style="min-height: 280px;">
                <h3 class="font-bold text-xs text-slate-400 uppercase tracking-wider mb-4">Worked Hours Trend (Weekly)</h3>
                <div class="flex-grow w-full" style="height: 200px;">
                    <canvas id="chart-worked-hours" style="height: 100%; width: 100%;"></canvas>
                </div>
            </div>
        </div>
    `;
}

async function initAttendanceAnalytics(state) {
    try {
        const info = await apiClient('/employee/attendance/analytics');
        
        if (distChartInstance) distChartInstance.destroy();
        if (trendChartInstance) trendChartInstance.destroy();
        if (hoursChartInstance) hoursChartInstance.destroy();
        
        const distCanvas = document.getElementById('chart-distribution');
        const trendCanvas = document.getElementById('chart-trend');
        const hoursCanvas = document.getElementById('chart-worked-hours');
        
        if (distCanvas) {
            const labels = Object.keys(info.attendance_distribution);
            const data = Object.values(info.attendance_distribution);
            const colors = {
                "Present": "#10B981",
                "Absent": "#EF4444",
                "Half Day": "#F59E0B",
                "On Duty": "#3B82F6",
                "Leave": "#06B6D4",
                "Holiday": "#8B5CF6"
            };
            const backgroundColors = labels.map(l => colors[l] || "#94A3B8");
            
            distChartInstance = new Chart(distCanvas, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: backgroundColors,
                        borderWidth: 2,
                        borderColor: '#ffffff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                boxWidth: 10,
                                font: { size: 9, weight: 'bold', family: 'Outfit' },
                                color: '#6B7280'
                            }
                        }
                    },
                    cutout: '65%'
                }
            });
        }
        
        if (trendCanvas) {
            trendChartInstance = new Chart(trendCanvas, {
                type: 'line',
                data: {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                    datasets: [{
                        label: 'Attendance %',
                        data: info.attendance_trends,
                        borderColor: '#610173',
                        backgroundColor: 'rgba(97, 1, 115, 0.04)',
                        borderWidth: 3,
                        pointBackgroundColor: '#610173',
                        pointBorderColor: '#ffffff',
                        pointHoverRadius: 6,
                        tension: 0.3,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            min: 80,
                            max: 100,
                            ticks: {
                                stepSize: 5,
                                font: { size: 9, weight: 'bold', family: 'Outfit' },
                                color: '#6B7280'
                            },
                            grid: { color: '#ECECF3' }
                        },
                        x: {
                            ticks: {
                                font: { size: 9, weight: 'bold', family: 'Outfit' },
                                color: '#6B7280'
                            },
                            grid: { display: false }
                        }
                    }
                }
            });
        }
        
        if (hoursCanvas) {
            hoursChartInstance = new Chart(hoursCanvas, {
                type: 'bar',
                data: {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                    datasets: [{
                        label: 'Worked Hours',
                        data: info.worked_hours_trends,
                        backgroundColor: '#dd73f0',
                        hoverBackgroundColor: '#610173',
                        borderRadius: 8,
                        barThickness: 24
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            min: 100,
                            max: 160,
                            ticks: {
                                stepSize: 10,
                                font: { size: 9, weight: 'bold', family: 'Outfit' },
                                color: '#6B7280'
                            },
                            grid: { color: '#ECECF3' }
                        },
                        x: {
                            ticks: {
                                font: { size: 9, weight: 'bold', family: 'Outfit' },
                                color: '#6B7280'
                            },
                            grid: { display: false }
                        }
                    }
                }
            });
        }
    } catch (e) {
        console.error('Analytics load error', e);
        showToast('Failed to load performance analytics', 'error');
    }
}

// Panel definitions containing title, icons, and placeholder render methods
const PANELS = {
    // 1. Everyday Routine Hub
    dashboard: {
        title: 'Dashboard',
        icon: 'layout-dashboard',
        render: (state) => `
            <div class="space-y-6">
                <!-- Premium Hero Banner matching APJ3D Design -->
                <div class="hero-gradient p-8 rounded-[36px] text-white shadow-xl overflow-hidden flex flex-col justify-between" style="min-height: 270px; max-height: 270px; height: 270px;">
                    <!-- Dot grid / background particles -->
                    <div class="particle particle-1"></div>
                    <div class="particle particle-2"></div>
                    <div class="particle particle-3"></div>
                    <div class="particle particle-4"></div>
                    <div class="particle particle-5"></div>
                    <div class="particle particle-6"></div>

                    <!-- CONTENT CONTAINER (Relative positioned container to place Left Area, Vertical divider, and Command Panel) -->
                    <div class="relative flex-grow flex flex-col justify-between" style="min-height: 220px;">

                        <!-- Left Content Area (Width restricted to 58% to allow absolute split) -->
                        <div class="w-[58%] flex flex-col justify-between" style="height: calc(100% - 2px);">

                            <!-- Title Block (shifted slightly lower, pt-2 to reduce space above) -->
                            <div class="text-left pt-2 flex flex-col gap-1">
                                <h2 class="text-[34px] font-bold tracking-tight leading-[120%]">Administration & System Center</h2>
                                <p class="text-purple-200/90 text-[16px] font-medium leading-[140%]">Governance & Access Control Center</p>
                            </div>

                            <!-- Title -> Metrics Space (20px) -->
                            <div class="h-[20px]"></div>

                            <!-- Metrics pills -->
                            <div class="flex flex-wrap gap-2">
                                <div class="mini-glass-pill" style="height: 40px; font-size: 14px; padding: 0 16px; border-radius: 20px; display: inline-flex; align-items: center; gap: 6px;">
                                    <i data-lucide="award" class="w-3.5 h-3.5 text-emerald-400 flex-shrink-0"></i>
                                    <span><span id="metricLateCredits">${state.employee?.late_credits ?? 40}</span> Late Credits</span>
                                </div>
                                <div class="mini-glass-pill" style="height: 40px; font-size: 14px; padding: 0 16px; border-radius: 20px; display: inline-flex; align-items: center; gap: 6px;">
                                    <i data-lucide="clock" class="w-3.5 h-3.5 text-blue-400 flex-shrink-0"></i>
                                    <span>Active Session</span>
                                </div>
                                <div class="mini-glass-pill" style="height: 40px; font-size: 14px; padding: 0 16px; border-radius: 20px; display: inline-flex; align-items: center; gap: 6px;">
                                    <i data-lucide="shield-check" class="w-3.5 h-3.5 text-amber-400 flex-shrink-0"></i>
                                    <span>System Health 100%</span>
                                </div>
                            </div>

                        </div>

                        <!-- DIVIDER #2 (Full width, below metrics, above actions) -->
                        <div class="bezent-hero-divider"></div>

                        <!-- Actions Area (width restricted to 58%) -->
                        <div class="w-[58%] pb-1">
                            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; width: 100%; align-items: center;">
                                <button id="btnTapIn" class="btn-premium-primary gap-1.5" style="height: 50px; padding: 0 16px; border-radius: 18px; white-space: nowrap; font-size: 13px; font-weight: 700; display: inline-flex; align-items: center; justify-content: center;">
                                    <i data-lucide="log-in" class="w-4 h-4 text-emerald-300 flex-shrink-0"></i>
                                    <span>Tap In</span>
                                </button>
                                <button id="btnTapOut" class="btn-premium-secondary gap-1.5" style="height: 50px; padding: 0 16px; border-radius: 18px; white-space: nowrap; font-size: 13px; display: inline-flex; align-items: center; justify-content: center;">
                                    <i data-lucide="log-out" class="w-4 h-4 flex-shrink-0"></i>
                                    <span>Tap Out</span>
                                </button>
                                <button onclick="employeeState.update({ activePanel: 'profile' })" class="btn-premium-secondary gap-1.5" style="height: 50px; padding: 0 16px; border-radius: 18px; white-space: nowrap; font-size: 13px; display: inline-flex; align-items: center; justify-content: center;">
                                    <i data-lucide="user" class="w-4 h-4 flex-shrink-0"></i>
                                    <span>My Profile</span>
                                </button>
                                <button onclick="employeeState.update({ activePanel: 'settings' })" class="btn-premium-secondary gap-1.5" style="height: 50px; padding: 0 16px; border-radius: 18px; white-space: nowrap; font-size: 13px; display: inline-flex; align-items: center; justify-content: center;">
                                    <i data-lucide="settings" class="w-4 h-4 flex-shrink-0"></i>
                                    <span>Settings</span>
                                </button>
                            </div>
                        </div>

                        <!-- VERTICAL DIVIDER (Absolute positioned at 60%) -->
                        <div class="bezent-vertical-divider"></div>

                        <!-- COMMAND PANEL (Absolute positioned on the right at 38% width, spanning full height below Divider #1) -->
                        <div class="absolute right-0 top-0 bottom-0 w-[38%] command-glass-panel flex flex-col justify-between p-4 text-white">
                            <div class="flex items-center justify-between pb-1.5 border-b border-white/5">
                                <span class="text-[9px] font-extrabold text-purple-200 uppercase tracking-widest">Command Panel</span>
                                <span class="text-[8px] font-mono font-bold bg-purple-500/20 text-purple-200 px-1.5 py-0.5 rounded border border-purple-500/10">System Secure</span>
                            </div>

                            <!-- Horizontal Grid with Dominant numbers -->
                            <div class="grid grid-cols-4 gap-2 my-2">
                                <div class="premium-kpi-card" onclick="employeeState.update({ activePanel: 'attendance' })">
                                    <span class="card-number" id="hero-credits">${state.employee?.late_credits ?? 40}</span>
                                    <span class="card-label">Credits</span>
                                </div>
                                <div class="premium-kpi-card" onclick="employeeState.update({ activePanel: 'attendance' })">
                                    <span class="card-number">0</span>
                                    <span class="card-label">Pending</span>
                                </div>
                                <div class="premium-kpi-card" onclick="employeeState.update({ activePanel: 'my-tasks' })">
                                    <span class="card-number">0</span>
                                    <span class="card-label">Tasks</span>
                                </div>
                                <div class="premium-kpi-card">
                                    <span class="card-number">0</span>
                                    <span class="card-label">Alerts</span>
                                </div>
                            </div>

                            <!-- Progress Bar -->
                            <div class="space-y-1">
                                <div class="flex justify-between items-center text-[9.5px] text-white/95">
                                    <span class="font-semibold tracking-wide">Attendance Rate</span>
                                    <span class="font-mono text-purple-200 font-bold">100%</span>
                                </div>
                                <div class="w-full bg-white/10 rounded-full h-1 overflow-hidden relative">
                                    <div class="progress-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                                    <div class="bg-emerald-400 h-full rounded-full transition-all duration-[1200ms]" style="width: 100%"></div>
                                </div>
                            </div>

                            <!-- Alert Footer -->
                            <div class="pt-2 border-t border-white/5 flex items-center justify-between text-[9.5px] text-purple-200/90 font-semibold">
                                <div class="flex items-center gap-1.5 font-semibold text-purple-200">
                                    <span class="w-1.5 h-1.5 rounded-full bg-amber-400 live-pulse-dot"></span>
                                    <span id="punch-status-text">Not punched in today</span>
                                </div>
                                <i data-lucide="shield-alert" class="w-3.5 h-3.5 text-purple-200/60"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Info alerts card -->
                <div class="bg-white p-6 rounded-2xl border border-[#ECECF3] shadow-sm">
                    <h3 class="font-bold text-sm text-slate-800 mb-4 uppercase tracking-wider">Operations Alerts Log</h3>
                    <div class="space-y-4">
                        <div class="flex gap-3 text-xs text-slate-600">
                            <div class="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1 flex-shrink-0"></div>
                            <div>
                                <div class="font-bold text-slate-800">Account parameters synched with corporate registers</div>
                                <div class="text-[10px] text-slate-400 mt-0.5">12 mins ago</div>
                            </div>
                        </div>
                        <div class="flex gap-3 text-xs text-slate-600">
                            <div class="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 flex-shrink-0"></div>
                            <div>
                                <div class="font-bold text-slate-800">All system services running within design boundaries</div>
                                <div class="text-[10px] text-slate-400 mt-0.5">1 hour ago</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `,
        init: (state) => {
            document.getElementById('btnTapIn')?.addEventListener('click', async () => {
                try {
                    const res = await apiClient('/employee/attendance/tap-in', { method: 'POST' });
                    document.getElementById('punch-status-text').innerText = `Punched in at ${res.time}`;
                    showToast('Successfully punched in!', 'success');
                } catch (e) { showToast(e.message, 'error'); }
            });
            document.getElementById('btnTapOut')?.addEventListener('click', async () => {
                try {
                    const res = await apiClient('/employee/attendance/tap-out', { method: 'POST' });
                    document.getElementById('punch-status-text').innerText = `Punched out at ${res.time}`;
                    showToast('Successfully punched out!', 'success');
                } catch (e) { showToast(e.message, 'error'); }
            });
        }
    },
    profile: {
        title: 'My Profile',
        icon: 'user',
        render: (state) => `
            <div class="bg-white rounded-2xl border border-[#ECECF3] p-8 shadow-sm space-y-8">
                <div class="flex items-center gap-6 pb-6 border-b border-[#ECECF3]">
                    <div class="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#610173] to-[#dd73f0] flex items-center justify-center text-white text-2xl font-bold">
                        ${state.employee?.name ? state.employee.name.slice(0, 2).toUpperCase() : 'U'}
                    </div>
                    <div>
                        <h2 class="text-2xl font-bold text-slate-800">${state.employee?.name || 'Associate'}</h2>
                        <p class="text-slate-400 text-sm">${state.employee?.employee_id || 'N/A'}</p>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="text-xs text-slate-400 uppercase font-bold">Email</label>
                        <div class="text-sm font-semibold text-slate-800 mt-1">${state.employee?.user_email || 'N/A'}</div>
                    </div>
                    <div>
                        <label class="text-xs text-slate-400 uppercase font-bold">Department</label>
                        <div class="text-sm font-semibold text-slate-800 mt-1">${state.employee?.department || 'N/A'}</div>
                    </div>
                    <div>
                        <label class="text-xs text-slate-400 uppercase font-bold">Designation</label>
                        <div class="text-sm font-semibold text-slate-800 mt-1">${state.employee?.designation || 'N/A'}</div>
                    </div>
                    <div>
                        <label class="text-xs text-slate-400 uppercase font-bold">Reporting Manager</label>
                        <div class="text-sm font-semibold text-slate-800 mt-1">${state.employee?.reporting_manager || 'N/A'}</div>
                    </div>
                </div>
                <div class="pt-4 border-t border-[#ECECF3]">
                    <button id="btnUpdateProfile" class="px-5 py-2.5 bg-[#610173] hover:bg-[#540063] text-white text-xs font-bold rounded-xl transition-all shadow-sm">
                        Submit Profile Update Request
                    </button>
                </div>
            </div>
        `,
        init: () => {
            document.getElementById('btnUpdateProfile')?.addEventListener('click', async () => {
                try {
                    await apiClient('/employee/profile/update-request', { method: 'PUT', body: {} });
                    showToast('Update request submitted successfully!', 'success');
                } catch (e) { showToast(e.message, 'error'); }
            });
        }
    },
    attendance: {
        title: 'Attendance',
        icon: 'calendar',
        render: (state) => {
            // History & Corrections open as dedicated full pages
            if (currentAttendanceSubView === 'history') return renderAttendanceHistory(state);
            if (currentAttendanceSubView === 'corrections') return renderAttendanceCorrections(state);
            // All other sub-views render inside the hybrid workspace
            return renderAttendanceHybrid();
        },
        init: (state) => {
            if (currentAttendanceSubView === 'history') {
                initAttendanceHistory(state);
            } else if (currentAttendanceSubView === 'corrections') {
                initAttendanceCorrections(state);
            } else {
                // Always load the top KPI/snapshot data
                initAttendanceLanding(state);
                // Then load the active workspace content
                if (currentAttendanceSubView === 'calendar')     initAttendanceCalendar(state);
                else if (currentAttendanceSubView === 'late-credits') initAttendanceLateCredits(state);
                else if (currentAttendanceSubView === 'leaderboard')  initAttendanceLeaderboard(state);
                else if (currentAttendanceSubView === 'analytics')    initAttendanceAnalytics(state);
            }
        }
    },
    leave: {
        title: 'Leaves Dashboard',
        icon: 'rocket',
        render: () => getPlaceholderTemplate('Leave Panel', 'rocket', 'Apply for leaves, track approval status, and check holiday calendars.')
    },
    'on-duty': {
        title: 'On Duty Requests',
        icon: 'map-pin',
        render: () => getPlaceholderTemplate('On Duty Requests', 'map-pin', 'Submit and manage field work requests or client meetings.')
    },
    reimbursement: {
        title: 'Expense Reimbursements',
        icon: 'dollar-sign',
        render: () => getPlaceholderTemplate('Expense Reimbursements', 'dollar-sign', 'Upload bills and file reimbursement claims for approval.')
    },
    payroll: {
        title: 'Payroll slips',
        icon: 'wallet',
        render: () => getPlaceholderTemplate('Payroll Panel', 'wallet', 'Download salary slips, view salary structures, and manage tax documentation.')
    },
    documents: {
        title: 'My Documents',
        icon: 'folder',
        render: () => getPlaceholderTemplate('Documents Panel', 'folder', 'Access joining letters, compliance agreements, or upload work proofs.')
    },
    'company-space': {
        title: 'Company Space',
        icon: 'globe',
        render: () => getPlaceholderTemplate('Company Space', 'globe', 'View news, policy compliance requirements, and active announcements.')
    },

    // 2. Task Workspace Hub
    'task-dashboard': {
        title: 'Task Dashboard',
        icon: 'target',
        render: () => getPlaceholderTemplate('Task Workspace Dashboard', 'target', 'Analyze progress, monitor deliverables, and check goal completions.')
    },
    'my-tasks': {
        title: 'My Tasks',
        icon: 'check-square',
        render: () => getPlaceholderTemplate('My Tasks', 'check-square', 'Track individual tickets, prioritize daily tasks, and update work status.')
    },
    projects: {
        title: 'Projects',
        icon: 'layers',
        render: () => getPlaceholderTemplate('Projects Portal', 'layers', 'Monitor active deliverables, check sprints, and collaborate with teams.')
    },
    goals: {
        title: 'OKR Goals',
        icon: 'compass',
        render: () => getPlaceholderTemplate('Objectives & Key Results', 'compass', 'View and set quarterly OKR targets aligned with organization strategies.')
    },
    performance: {
        title: 'My Performance',
        icon: 'trending-up',
        render: () => getPlaceholderTemplate('Performance Evaluations', 'trending-up', 'Acknowledge performance appraisals, reviews, and HR feedback reports.')
    },
    'team-collaboration': {
        title: 'Team Collaboration',
        icon: 'users',
        render: () => getPlaceholderTemplate('Team Collaboration Space', 'users', 'Share status reports, schedule board meets, and access shared documents.')
    },
    reports: {
        title: 'Analytics Reports',
        icon: 'bar-chart',
        render: () => getPlaceholderTemplate('Analytics & Reports', 'bar-chart', 'Generate time logs, sprint velocity reports, and attendance exports.')
    },

    // 3. Settings
    settings: {
        title: 'Settings',
        icon: 'settings',
        render: () => getPlaceholderTemplate('Settings Configuration', 'settings', 'Manage session passwords, MFA access credentials, and portal preferences.')
    }
};

function getPlaceholderTemplate(title, iconName, description) {
    return `
        <div class="bg-white rounded-2xl border border-[#ECECF3] p-8 shadow-sm text-center py-20 animate-pulse">
            <div class="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 text-[#610173] mx-auto border border-purple-100">
                <i data-lucide="${iconName}" class="w-8 h-8"></i>
            </div>
            <h2 class="text-xl font-bold text-slate-800 mb-2">${title}</h2>
            <p class="text-slate-400 text-sm max-w-sm mx-auto mb-6">${description}</p>
            <div class="w-full max-w-xs mx-auto h-2 bg-slate-100 rounded-full overflow-hidden">
                <div class="w-1/3 h-full bg-[#610173] rounded-full"></div>
            </div>
        </div>
    `;
}

// Render the sidebar navigation dynamically depending on the current state
export function renderSidebar(state) {
    const nav = document.getElementById('sidebar-nav');
    if (!nav) return;

    if (state.onboarding_status && state.onboarding_status !== 'Approved') {
        nav.innerHTML = `
            <div class="px-4 py-8 text-center text-xs text-slate-400 space-y-3">
                <div class="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mx-auto text-slate-400 border border-slate-200">
                    <i data-lucide="lock" class="w-5 h-5"></i>
                </div>
                <div>
                    <p class="font-bold text-slate-700">Features Locked</p>
                    <p class="text-[10px] text-slate-400 mt-1">Complete onboarding to unlock portal access.</p>
                </div>
            </div>
        `;
        if (typeof lucide !== 'undefined') lucide.createIcons();
        return;
    }

    let linksHtml = '';
    const hasActiveSubitem = ['on-duty', 'reimbursement'].includes(state.activePanel);
    const accordionActiveClass = hasActiveSubitem ? 'active' : '';

    if (state.activeWorkspace === 'everyday') {
        // Everyday Hub Nav Links
        linksHtml = `
            <div class="space-y-1">
                ${getSidebarItemLink('dashboard', 'layout-dashboard', 'Dashboard', state.activePanel)}
                ${getSidebarItemLink('profile', 'user', 'My Profile', state.activePanel)}
                ${getSidebarItemLink('attendance', 'calendar', 'Attendance', state.activePanel)}
                ${getSidebarItemLink('leave', 'rocket', 'Leave', state.activePanel)}
                
                <!-- Collapsible Accordion: Request Center -->
                <div class="accordion-group">
                    <div id="request-center-header" class="accordion-header ${accordionActiveClass}">
                        <div class="flex items-center gap-3">
                            <i data-lucide="help-circle" class="w-4 h-4"></i>
                            <span>Request Center</span>
                        </div>
                        <i data-lucide="chevron-down" id="request-center-arrow" class="w-3.5 h-3.5 transition-transform duration-200"></i>
                    </div>
                    <div id="request-center-content" class="accordion-content">
                        <div class="flex flex-col gap-0.5 py-0.5">
                            ${getSidebarItemLink('on-duty', 'map-pin', 'On Duty Request', state.activePanel, true)}
                            ${getSidebarItemLink('reimbursement', 'dollar-sign', 'Expense Reimbursement', state.activePanel, true)}
                        </div>
                    </div>
                </div>

                ${getSidebarItemLink('payroll', 'wallet', 'Payroll', state.activePanel)}
                ${getSidebarItemLink('documents', 'folder', 'Documents', state.activePanel)}
                ${getSidebarItemLink('company-space', 'globe', 'Company Space', state.activePanel)}
            </div>
        `;
    } else {
        // Task Workspace Hub Nav Links
        linksHtml = `
            <div class="space-y-1">
                ${getSidebarItemLink('task-dashboard', 'target', 'Task Dashboard', state.activePanel)}
                ${getSidebarItemLink('my-tasks', 'check-square', 'My Tasks', state.activePanel)}
                ${getSidebarItemLink('projects', 'layers', 'Projects', state.activePanel)}
                ${getSidebarItemLink('goals', 'compass', 'Goals', state.activePanel)}
                ${getSidebarItemLink('performance', 'trending-up', 'Performance', state.activePanel)}
                ${getSidebarItemLink('team-collaboration', 'users', 'Team Collaboration', state.activePanel)}
                ${getSidebarItemLink('reports', 'bar-chart', 'Reports', state.activePanel)}
            </div>
        `;
    }

    nav.innerHTML = linksHtml;

    // Attach listeners for accordion toggle
    const reqHeader = document.getElementById('request-center-header');
    const reqContent = document.getElementById('request-center-content');
    const reqArrow = document.getElementById('request-center-arrow');

    if (reqHeader && reqContent) {
        // Keep accordion open if sub-item is active
        if (hasActiveSubitem) {
            reqContent.classList.add('expanded');
            reqContent.style.maxHeight = reqContent.scrollHeight + 'px';
            reqContent.style.opacity = '1';
            if (reqArrow) reqArrow.style.transform = 'rotate(180deg)';
        }

        reqHeader.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = reqContent.classList.contains('expanded');
            if (!isExpanded) {
                reqContent.classList.add('expanded');
                reqContent.style.maxHeight = reqContent.scrollHeight + 'px';
                reqContent.style.opacity = '1';
                reqHeader.classList.add('active');
                if (reqArrow) reqArrow.style.transform = 'rotate(180deg)';
            } else {
                reqContent.classList.remove('expanded');
                reqContent.style.maxHeight = '0px';
                reqContent.style.opacity = '0';
                // Only remove active state if neither subitem is active
                const currentActive = employeeState.activePanel;
                if (!['on-duty', 'reimbursement'].includes(currentActive)) {
                    reqHeader.classList.remove('active');
                }
                if (reqArrow) reqArrow.style.transform = 'rotate(0deg)';
            }
        });
    }

    // Attach listeners to standard navigation items
    document.querySelectorAll('[data-panel-target]').forEach(item => {
        item.addEventListener('click', (e) => {
            const panelId = e.currentTarget.getAttribute('data-panel-target');
            employeeState.update({ activePanel: panelId });
        });
    });

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function getSidebarItemLink(panelId, iconName, label, activePanel, isSubmenu = false) {
    const isActive = activePanel === panelId;
    const activeClass = isActive ? 'active' : '';
    const styleAttr = isSubmenu ? 'style="margin: 2px 16px !important; padding: 8px 12px !important; font-size: 13px !important;"' : '';
    
    return `
        <div data-panel-target="${panelId}" class="submenu-item ${activeClass}" ${styleAttr}>
            <i data-lucide="${iconName}" class="w-4 h-4"></i>
            <span>${label}</span>
        </div>
    `;
}

// Switch workspace dynamically
export function switchWorkspace(workspaceId) {
    let defaultPanel = 'dashboard';
    if (workspaceId === 'workspace') {
        defaultPanel = 'task-dashboard';
    }
    employeeState.update({
        activeWorkspace: workspaceId,
        activePanel: defaultPanel
    });
}

// Render the active panel layout in the main workspace
export function loadPanel(panelId) {
    const main = document.getElementById('main-content');
    const headerTitle = document.getElementById('navbar-title');
    
    if (!main) return;

    // Reset attendance sub-view state when navigating away from attendance
    if (typeof _lastPanelId !== 'undefined' && _lastPanelId === 'attendance' && panelId !== 'attendance') {
        currentAttendanceSubView = 'calendar';
        calendarSelectedDate = null;
    }
    window._lastPanelId = panelId;

    const panel = PANELS[panelId];
    if (!panel) {
        main.innerHTML = getPlaceholderTemplate('404 Not Found', 'alert-circle', 'The requested panel does not exist.');
        return;
    }

    if (headerTitle) {
        headerTitle.innerText = panel.title;
    }

    // Render HTML content
    main.innerHTML = panel.render(employeeState);

    // Call panel initialization if it exists
    if (panel.init) {
        panel.init(employeeState);
    }

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

let _lastLoadedPanelId = null;

// Centered Toast Notification system
export function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-card flex items-center gap-3 px-4 py-3 bg-white border border-[#ECECF3] rounded-xl shadow-lg animate-slide-in text-xs font-semibold pointer-events-auto`;
    
    let borderClass = 'border-l-4 border-blue-500';
    let icon = 'info';
    
    if (type === 'success') {
        borderClass = 'border-l-4 border-emerald-500';
        icon = 'check-circle';
    } else if (type === 'error') {
        borderClass = 'border-l-4 border-rose-500';
        icon = 'alert-triangle';
    }

    toast.classList.add(...borderClass.split(' '));

    toast.innerHTML = `
        <i data-lucide="${icon}" class="w-4 h-4"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    setTimeout(() => {
        toast.classList.add('opacity-0', 'transition-opacity', 'duration-300');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}
window.showToast = showToast;
