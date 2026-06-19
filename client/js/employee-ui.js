import { employeeState } from './employee-state.js';
import { apiClient } from './employee-api.js';

let currentAttendanceSubView = 'landing';
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
                <button onclick="setAttendanceSubView('landing')" class="p-2 border border-[#ECECF3] hover:border-[#610173] hover:text-[#610173] bg-white rounded-xl transition shadow-sm">
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

function renderAttendanceLanding(state) {
    return `
        <div class="space-y-6 animate-fade-in">
            <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div class="att-kpi-card">
                    <div class="att-icon-wrapper bg-emerald-50 text-emerald-600">
                        <i data-lucide="check-square" class="w-5 h-5"></i>
                    </div>
                    <div>
                        <p class="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider">Present Days</p>
                        <h3 class="text-xl font-extrabold text-slate-800 mt-0.5" id="landing-present">-</h3>
                    </div>
                </div>
                <div class="att-kpi-card">
                    <div class="att-icon-wrapper bg-rose-50 text-rose-600">
                        <i data-lucide="x-circle" class="w-5 h-5"></i>
                    </div>
                    <div>
                        <p class="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider">Absent Days</p>
                        <h3 class="text-xl font-extrabold text-slate-800 mt-0.5" id="landing-absent">-</h3>
                    </div>
                </div>
                <div class="att-kpi-card">
                    <div class="att-icon-wrapper bg-amber-50 text-amber-600">
                        <i data-lucide="clock" class="w-5 h-5"></i>
                    </div>
                    <div>
                        <p class="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider">Half Days</p>
                        <h3 class="text-xl font-extrabold text-slate-800 mt-0.5" id="landing-half">-</h3>
                    </div>
                </div>
                <div class="att-kpi-card">
                    <div class="att-icon-wrapper bg-purple-50 text-purple-600">
                        <i data-lucide="alert-circle" class="w-5 h-5"></i>
                    </div>
                    <div>
                        <p class="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider">Late Arrivals</p>
                        <h3 class="text-xl font-extrabold text-slate-800 mt-0.5" id="landing-late">-</h3>
                    </div>
                </div>
                <div class="att-kpi-card">
                    <div class="att-icon-wrapper bg-blue-50 text-blue-600">
                        <i data-lucide="award" class="w-5 h-5"></i>
                    </div>
                    <div>
                        <p class="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider">Late Credits</p>
                        <h3 class="text-xl font-extrabold text-slate-800 mt-0.5" id="landing-credits">-</h3>
                    </div>
                </div>
            </div>

            <div class="att-snapshot-card">
                <div class="flex items-center gap-6">
                    <div class="flex flex-col">
                        <span class="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider">Attendance Rate</span>
                        <span class="text-2xl font-extrabold text-slate-800 mt-1" id="landing-percent">-%</span>
                    </div>
                    <div class="h-10 w-[1px] bg-slate-200"></div>
                    <div class="flex flex-col">
                        <span class="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider">On Duty Days</span>
                        <span class="text-2xl font-extrabold text-slate-800 mt-1" id="landing-onduty">-</span>
                    </div>
                    <div class="h-10 w-[1px] bg-slate-200"></div>
                    <div class="flex flex-col">
                        <span class="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider">Worked Hours This Month</span>
                        <span class="text-2xl font-extrabold text-slate-800 mt-1" id="landing-hours">-</span>
                    </div>
                </div>
                <div class="flex items-center gap-2 text-xs font-semibold text-purple-600 bg-purple-50 px-4 py-2 rounded-xl border border-purple-100">
                    <span class="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                    <span>Real DB Data Sync</span>
                </div>
            </div>

            <div class="space-y-4">
                <h3 class="font-bold text-xs text-slate-400 uppercase tracking-wider">Attendance Center</h3>
                <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
                    <div class="att-feature-card" onclick="setAttendanceSubView('calendar')">
                        <div class="w-12 h-12 bg-purple-50 border border-purple-100 rounded-2xl flex items-center justify-center text-[#610173] mb-4">
                            <i data-lucide="calendar" class="w-6 h-6"></i>
                        </div>
                        <div class="flex-grow flex flex-col justify-center">
                            <h4 class="font-bold text-slate-800 text-sm mb-1">Calendar</h4>
                            <p class="text-[10.5px] text-[#6B7280] leading-relaxed">Interactive calendar workspace & date logs</p>
                        </div>
                        <div class="mt-4 arrow-btn">
                            <i data-lucide="arrow-right" class="w-4 h-4"></i>
                        </div>
                    </div>
                    <div class="att-feature-card" onclick="setAttendanceSubView('history')">
                        <div class="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-4">
                            <i data-lucide="file-text" class="w-6 h-6"></i>
                        </div>
                        <div class="flex-grow flex flex-col justify-center">
                            <h4 class="font-bold text-slate-800 text-sm mb-1">History</h4>
                            <p class="text-[10.5px] text-[#6B7280] leading-relaxed">Filters, pagination, and exports (CSV/PDF)</p>
                        </div>
                        <div class="mt-4 arrow-btn">
                            <i data-lucide="arrow-right" class="w-4 h-4"></i>
                        </div>
                    </div>
                    <div class="att-feature-card" onclick="setAttendanceSubView('corrections')">
                        <div class="w-12 h-12 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
                            <i data-lucide="edit-3" class="w-6 h-6"></i>
                        </div>
                        <div class="flex-grow flex flex-col justify-center">
                            <h4 class="font-bold text-slate-800 text-sm mb-1">Corrections</h4>
                            <p class="text-[10.5px] text-[#6B7280] leading-relaxed">Request corrections & check manager remarks</p>
                        </div>
                        <div class="mt-4 arrow-btn">
                            <i data-lucide="arrow-right" class="w-4 h-4"></i>
                        </div>
                    </div>
                    <div class="att-feature-card" onclick="setAttendanceSubView('late-credits')">
                        <div class="w-12 h-12 bg-pink-50 border border-pink-100 rounded-2xl flex items-center justify-center text-pink-600 mb-4">
                            <i data-lucide="award" class="w-6 h-6"></i>
                        </div>
                        <div class="flex-grow flex flex-col justify-center">
                            <h4 class="font-bold text-slate-800 text-sm mb-1">Late Credits</h4>
                            <p class="text-[10.5px] text-[#6B7280] leading-relaxed">Check balance and monthly deduction logs</p>
                        </div>
                        <div class="mt-4 arrow-btn">
                            <i data-lucide="arrow-right" class="w-4 h-4"></i>
                        </div>
                    </div>
                    <div class="att-feature-card" onclick="setAttendanceSubView('leaderboard')">
                        <div class="w-12 h-12 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-center text-amber-600 mb-4">
                            <i data-lucide="trophy" class="w-6 h-6"></i>
                        </div>
                        <div class="flex-grow flex flex-col justify-center">
                            <h4 class="font-bold text-slate-800 text-sm mb-1">Leaderboard</h4>
                            <p class="text-[10.5px] text-[#6B7280] leading-relaxed">Monthly attendance ranks & movement</p>
                        </div>
                        <div class="mt-4 arrow-btn">
                            <i data-lucide="arrow-right" class="w-4 h-4"></i>
                        </div>
                    </div>
                    <div class="att-feature-card" onclick="setAttendanceSubView('analytics')">
                        <div class="w-12 h-12 bg-teal-50 border border-teal-100 rounded-2xl flex items-center justify-center text-teal-600 mb-4">
                            <i data-lucide="pie-chart" class="w-6 h-6"></i>
                        </div>
                        <div class="flex-grow flex flex-col justify-center">
                            <h4 class="font-bold text-slate-800 text-sm mb-1">Analytics</h4>
                            <p class="text-[10.5px] text-[#6B7280] leading-relaxed">Visual trends, charts & distributions</p>
                        </div>
                        <div class="mt-4 arrow-btn">
                            <i data-lucide="arrow-right" class="w-4 h-4"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

async function initAttendanceLanding(state) {
    try {
        const overview = await apiClient('/employee/attendance/overview');
        document.getElementById('landing-present').innerText = overview.present_days;
        document.getElementById('landing-absent').innerText = overview.absent_days;
        document.getElementById('landing-half').innerText = overview.half_days;
        document.getElementById('landing-late').innerText = overview.late_arrivals;
        document.getElementById('landing-credits').innerText = overview.late_credits;
        document.getElementById('landing-percent').innerText = `${overview.attendance_percent}%`;
        document.getElementById('landing-onduty').innerText = overview.on_duty_days;
        document.getElementById('landing-hours').innerText = `${overview.worked_hours} hrs`;
    } catch (e) {
        console.error('Failed to load overview data', e);
        showToast('Failed to load overview metrics', 'error');
    }
}

function renderAttendanceCalendar(state) {
    return `
        <div class="space-y-6 animate-fade-in">
            ${getSubViewHeader('Calendar Workspace', 'Calendar')}

            <div class="calendar-wrapper">
                <div class="bg-white rounded-2xl border border-[#ECECF3] p-6 shadow-sm">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="font-bold text-sm text-slate-800 uppercase tracking-wider">Interactive Calendar</h3>
                        <div class="flex items-center gap-2">
                            <select id="cal-month-select" class="text-xs font-bold border border-[#ECECF3] rounded-lg px-2 py-1 focus:outline-none" onchange="changeCalendarMonth(this.value)">
                                ${[
                                    'January', 'February', 'March', 'April', 'May', 'June',
                                    'July', 'August', 'September', 'October', 'November', 'December'
                                ].map((m, idx) => `<option value="${idx + 1}" ${calendarMonth === idx + 1 ? 'selected' : ''}>${m}</option>`).join('')}
                            </select>
                            <select id="cal-year-select" class="text-xs font-bold border border-[#ECECF3] rounded-lg px-2 py-1 focus:outline-none" onchange="changeCalendarYear(this.value)">
                                ${[2024, 2025, 2026, 2027].map(y => `<option value="${y}" ${calendarYear === y ? 'selected' : ''}>${y}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-7 gap-2 text-center text-[10px] font-extrabold text-[#6B7280] uppercase tracking-wider mb-2">
                        <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div class="text-purple-400">Sat</div><div class="text-purple-400">Sun</div>
                    </div>
                    
                    <div id="calendar-grid-container" class="grid grid-cols-7 gap-2">
                    </div>
                </div>

                <div class="bg-white rounded-2xl border border-[#ECECF3] p-6 shadow-sm flex flex-col justify-between" style="min-height: 400px;">
                    <div id="cal-right-panel-content" class="flex-grow flex flex-col justify-center">
                    </div>
                </div>
            </div>
        </div>
    `;
}

async function initAttendanceCalendar(state) {
    try {
        const list = await apiClient(`/employee/attendance/calendar?year=${calendarYear}&month=${calendarMonth}`);
        
        const firstDay = new Date(calendarYear, calendarMonth - 1, 1).getDay();
        const startOffset = firstDay === 0 ? 6 : firstDay - 1;
        const totalDays = new Date(calendarYear, calendarMonth, 0).getDate();
        
        let gridHtml = '';
        for (let i = 0; i < startOffset; i++) {
            gridHtml += `<div class="calendar-day-tile inactive-day"></div>`;
        }
        
        for (let day = 1; day <= totalDays; day++) {
            const dateStr = `${calendarYear}-${String(calendarMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const record = list.find(r => r.date === dateStr);
            
            let dotHtml = '';
            let labelText = '';
            if (record) {
                dotHtml = `<span class="status-dot ${record.status.replace(' ', '-')}"></span>`;
                labelText = record.status;
            }
            
            const isSelected = calendarSelectedDate === dateStr ? 'active-day' : '';
            gridHtml += `
                <div class="calendar-day-tile ${isSelected}" onclick="selectCalendarDate('${dateStr}')">
                    <span class="text-xs font-bold text-slate-700">${day}</span>
                    <div class="flex items-center gap-1 mt-1.5 justify-center">
                        ${dotHtml}
                        <span class="text-[8px] font-bold text-slate-400 truncate max-w-[40px]">${labelText}</span>
                    </div>
                </div>
            `;
        }
        
        const container = document.getElementById('calendar-grid-container');
        if (container) container.innerHTML = gridHtml;
        
        if (calendarSelectedDate) {
            await selectCalendarDate(calendarSelectedDate);
        } else {
            const summary = await apiClient(`/employee/attendance/month-summary?year=${calendarYear}&month=${calendarMonth}`);
            const rightPanel = document.getElementById('cal-right-panel-content');
            if (rightPanel) {
                rightPanel.innerHTML = `
                    <div class="space-y-6 animate-fade-in text-center flex flex-col items-center">
                        <div class="w-16 h-16 bg-purple-50 text-[#610173] border border-purple-100 rounded-full flex items-center justify-center mb-2 shadow-sm">
                            <i data-lucide="bar-chart-2" class="w-8 h-8"></i>
                        </div>
                        <div>
                            <h4 class="font-extrabold text-slate-800 text-base">Month Summary</h4>
                            <p class="text-[10px] text-[#6B7280] font-bold tracking-wider uppercase mt-1">Calendar Overview</p>
                        </div>
                        
                        <div class="grid grid-cols-2 gap-4 w-full text-left mt-2 border-t border-b border-[#ECECF3] py-4">
                            <div>
                                <span class="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider block">Present Days</span>
                                <span class="text-lg font-bold text-slate-800 mt-0.5">${summary.present_days}</span>
                            </div>
                            <div>
                                <span class="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider block">Absent Days</span>
                                <span class="text-lg font-bold text-slate-800 mt-0.5">${summary.absent_days}</span>
                            </div>
                            <div>
                                <span class="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider block">Half Days</span>
                                <span class="text-lg font-bold text-slate-800 mt-0.5">${summary.half_days}</span>
                            </div>
                            <div>
                                <span class="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider block">On Duty Days</span>
                                <span class="text-lg font-bold text-slate-800 mt-0.5">${summary.on_duty_days}</span>
                            </div>
                            <div>
                                <span class="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider block">Attendance Rate</span>
                                <span class="text-lg font-bold text-emerald-600 mt-0.5">${summary.attendance_percent}%</span>
                            </div>
                            <div>
                                <span class="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider block">Worked Hours</span>
                                <span class="text-lg font-bold text-slate-800 mt-0.5">${summary.worked_hours}</span>
                            </div>
                        </div>
                    </div>
                `;
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
        }
    } catch (e) {
        console.error('Calendar error', e);
        showToast('Failed to load calendar logs', 'error');
    }
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

window.selectCalendarDate = async (dateStr) => {
    calendarSelectedDate = dateStr;
    try {
        const details = await apiClient(`/employee/attendance/date-details/${dateStr}`);
        const rightPanel = document.getElementById('cal-right-panel-content');
        if (rightPanel) {
            if (!details) {
                rightPanel.innerHTML = `
                    <div class="text-center py-10 space-y-3">
                        <div class="w-12 h-12 rounded-full bg-slate-50 border border-[#ECECF3] flex items-center justify-center mx-auto text-[#6B7280]">
                            <i data-lucide="info" class="w-6 h-6"></i>
                        </div>
                        <h4 class="font-bold text-slate-800 text-sm">No Record Found</h4>
                        <p class="text-xs text-[#6B7280] max-w-[200px] mx-auto">There are no attendance or approved on-duty records for ${dateStr}.</p>
                    </div>
                `;
            } else {
                let rowsHtml = '';
                const fields = [
                    { key: 'date', label: 'Date' },
                    { key: 'status', label: 'Status' },
                    { key: 'clock_in', label: 'Check In' },
                    { key: 'clock_out', label: 'Check Out' },
                    { key: 'worked_hours', label: 'Worked Hours' },
                    { key: 'overtime', label: 'Overtime' },
                    { key: 'late_minutes', label: 'Late Minutes' },
                    { key: 'remarks', label: 'Remarks' }
                ];
                
                fields.forEach(f => {
                    const val = details[f.key];
                    if (val !== undefined && val !== null && val !== '') {
                        rowsHtml += `
                            <div class="flex items-center justify-between py-2 border-b border-[#ECECF3]">
                                <span class="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider">${f.label}</span>
                                <span class="text-xs font-bold text-slate-800 text-right">${val}</span>
                            </div>
                        `;
                    }
                });
                
                rightPanel.innerHTML = `
                    <div class="space-y-4 animate-fade-in text-left">
                        <div class="flex items-center justify-between mb-4 pb-2 border-b border-[#ECECF3]">
                            <h4 class="font-extrabold text-slate-800 text-sm">Day Details</h4>
                            <button onclick="clearSelectedDate(event)" class="text-[10px] font-extrabold text-purple-600 uppercase hover:text-purple-700 tracking-wider">Close</button>
                        </div>
                        <div class="space-y-1 bg-[#FAFAFC] p-3 rounded-xl border border-[#ECECF3]">
                            ${rowsHtml}
                        </div>
                    </div>
                `;
            }
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }
    } catch (e) {
        console.error('Details fetch error', e);
        showToast('Failed to load date details', 'error');
    }
};

window.clearSelectedDate = (e) => {
    if (e) e.stopPropagation();
    calendarSelectedDate = null;
    loadPanel('attendance');
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

function renderAttendanceLateCredits(state) {
    return `
        <div class="space-y-6 animate-fade-in">
            ${getSubViewHeader('Late Credits Logs', 'Late Credits')}

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <div class="px-6 py-4 border-b border-[#ECECF3]">
                    <h3 class="font-bold text-sm text-slate-800 uppercase tracking-wider">Credits Deduction Log</h3>
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
                        <tbody id="credits-table-body" class="divide-y divide-[#ECECF3]">
                        </tbody>
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

function renderAttendanceLeaderboard(state) {
    return `
        <div class="space-y-6 animate-fade-in">
            ${getSubViewHeader('Monthly Leaderboard Rankings', 'Leaderboard')}

            <div class="bg-gradient-to-r from-[#610173] to-[#312E81] text-white p-6 rounded-2xl shadow-md flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center font-bold text-lg border border-white/20">
                        🏆
                    </div>
                    <div>
                        <h4 class="font-bold text-sm text-purple-100 uppercase tracking-wider">Your Standings</h4>
                        <p class="text-xl font-extrabold mt-0.5">Your Current Rank: <span id="lead-my-rank" class="text-amber-300">-</span></p>
                    </div>
                </div>
                <div class="text-right">
                    <span class="text-[10px] text-purple-200 font-bold uppercase tracking-wider block">Rank Movement</span>
                    <span class="text-xl font-bold mt-0.5 inline-block px-3 py-0.5 rounded-lg bg-white/10 border border-white/10" id="lead-my-movement">—</span>
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
                        <tbody id="leaderboard-table-body" class="divide-y divide-[#ECECF3]">
                        </tbody>
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

function renderAttendanceAnalytics(state) {
    return `
        <div class="space-y-6 animate-fade-in">
            ${getSubViewHeader('Attendance Performance Analytics', 'Analytics')}

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-white rounded-2xl border border-[#ECECF3] p-5 shadow-sm flex flex-col items-center">
                    <h3 class="font-bold text-xs text-slate-400 uppercase tracking-wider mb-4 w-full text-left">Attendance Distribution</h3>
                    <div style="width: 100%; height: 220px; display: flex; align-items: center; justify-content: center;">
                        <canvas id="chart-distribution" style="max-height: 220px; max-width: 220px;"></canvas>
                    </div>
                </div>

                <div class="bg-white rounded-2xl border border-[#ECECF3] p-5 shadow-sm md:col-span-2 flex flex-col justify-between" style="min-height: 300px;">
                    <h3 class="font-bold text-xs text-slate-400 uppercase tracking-wider mb-4">Attendance Trend (%)</h3>
                    <div class="flex-grow w-full" style="height: 200px;">
                        <canvas id="chart-trend" style="height: 100%; width: 100%;"></canvas>
                    </div>
                </div>
            </div>
            
            <div class="grid grid-cols-1 gap-6">
                <div class="bg-white rounded-2xl border border-[#ECECF3] p-5 shadow-sm flex flex-col justify-between" style="min-height: 300px;">
                    <h3 class="font-bold text-xs text-slate-400 uppercase tracking-wider mb-4">Worked Hours Trend (Weekly)</h3>
                    <div class="flex-grow w-full" style="height: 200px;">
                        <canvas id="chart-worked-hours" style="height: 100%; width: 100%;"></canvas>
                    </div>
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
        title: 'Attendance History',
        icon: 'calendar',
        render: (state) => {
            if (currentAttendanceSubView === 'landing') return renderAttendanceLanding(state);
            if (currentAttendanceSubView === 'calendar') return renderAttendanceCalendar(state);
            if (currentAttendanceSubView === 'history') return renderAttendanceHistory(state);
            if (currentAttendanceSubView === 'corrections') return renderAttendanceCorrections(state);
            if (currentAttendanceSubView === 'late-credits') return renderAttendanceLateCredits(state);
            if (currentAttendanceSubView === 'leaderboard') return renderAttendanceLeaderboard(state);
            if (currentAttendanceSubView === 'analytics') return renderAttendanceAnalytics(state);
            return '<div>Invalid view</div>';
        },
        init: (state) => {
            if (currentAttendanceSubView === 'landing') initAttendanceLanding(state);
            if (currentAttendanceSubView === 'calendar') initAttendanceCalendar(state);
            if (currentAttendanceSubView === 'history') initAttendanceHistory(state);
            if (currentAttendanceSubView === 'corrections') initAttendanceCorrections(state);
            if (currentAttendanceSubView === 'late-credits') initAttendanceLateCredits(state);
            if (currentAttendanceSubView === 'leaderboard') initAttendanceLeaderboard(state);
            if (currentAttendanceSubView === 'analytics') initAttendanceAnalytics(state);
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
        currentAttendanceSubView = 'landing';
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
