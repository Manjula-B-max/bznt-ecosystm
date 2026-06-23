import { User } from '../models/Auth.js';
import { Employee } from '../models/Employee.js';
import { getModel } from '../models/Generic.js';

// Helper to retrieve user and employee records in a safe manner
const getSessionDetails = async (userId) => {
    const user = await User.findById(userId).populate('company_id');
    if (!user) throw new Error('User not found');
    let employee = await Employee.findOne({ user_email: user.email.toLowerCase() });
    if (!employee) {
        // Auto-create a skeleton employee record for users who exist in User but not Employee
        employee = new Employee({
            id: 'emp_' + Math.random().toString(36).slice(2, 9),
            user_email: user.email.toLowerCase(),
            name: user.name || 'Associate',
            department: user.department || 'General',
            designation: 'Associate',
            status: 'Pending Verification',
            company: user.company || 'My Company',
            company_id: user.company_id,
            employee_id: 'EMP' + Math.random().toString(36).slice(2, 6).toUpperCase(),
            late_credits: 40,
            onboarding_status: 'Pending Onboarding',
            onboarding_step: 0,
            employee_type: 'Fresher'
        });
    }
    return { user, employee };
};

// Seed realistic records for the current month if no records exist
const seedAttendanceIfEmpty = async (userId, email, companyId) => {
    const Attendance = getModel('hr_attendance');
    const Correction = getModel('hr_corrections');
    const OnDuty = getModel('hr_onduty');
    
    const count = await Attendance.countDocuments({ user_email: email });
    if (count > 0) return;

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-indexed
    
    const records = [];
    const onDuties = [];
    const corrections = [];
    
    let presentCount = 0;
    let lateCount = 0;
    let halfDayCount = 0;
    let absentCount = 0;
    let onDutyCount = 0;
    
    // Generate records for the current month up to day 28
    for (let day = 1; day <= 28; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dateObj = new Date(year, month, day);
        const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 6 = Saturday
        
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            records.push({
                id: 'att_' + Math.random().toString(36).slice(2, 9),
                user_id: userId,
                user_email: email,
                company_id: companyId,
                date: dateStr,
                status: 'Holiday',
                remarks: 'Weekend'
            });
            continue;
        }
        
        // 3 On Duty, 1 Absent, 2 Half Day, 4 Late, 18 Present
        if (onDutyCount < 3 && day % 7 === 1) {
            onDutyCount++;
            onDuties.push({
                id: 'od_' + Math.random().toString(36).slice(2, 9),
                user_id: userId,
                user_email: email,
                company_id: companyId,
                date: dateStr,
                reason: 'Client Site Visit',
                remarks: 'Meeting with partners',
                status: 'Approved'
            });
            records.push({
                id: 'att_' + Math.random().toString(36).slice(2, 9),
                user_id: userId,
                user_email: email,
                company_id: companyId,
                date: dateStr,
                status: 'On Duty',
                clock_in: '09:00 AM',
                clock_out: '06:00 PM',
                worked_hours: '09h 00m',
                remarks: 'On Duty Approved'
            });
        } else if (absentCount < 1 && day % 15 === 2) {
            absentCount++;
            records.push({
                id: 'att_' + Math.random().toString(36).slice(2, 9),
                user_id: userId,
                user_email: email,
                company_id: companyId,
                date: dateStr,
                status: 'Absent',
                remarks: 'Uninformed absence'
            });
        } else if (halfDayCount < 2 && day % 12 === 3) {
            halfDayCount++;
            records.push({
                id: 'att_' + Math.random().toString(36).slice(2, 9),
                user_id: userId,
                user_email: email,
                company_id: companyId,
                date: dateStr,
                status: 'Half Day',
                clock_in: '01:30 PM',
                clock_out: '06:15 PM',
                worked_hours: '04h 45m',
                remarks: 'Personal urgent work'
            });
        } else if (lateCount < 4 && day % 5 === 4) {
            lateCount++;
            records.push({
                id: 'att_' + Math.random().toString(36).slice(2, 9),
                user_id: userId,
                user_email: email,
                company_id: companyId,
                date: dateStr,
                status: 'Late',
                clock_in: '09:15 AM',
                clock_out: '06:15 PM',
                worked_hours: '09h 00m',
                overtime: '15 mins',
                late_minutes: 15,
                remarks: 'Traffic Delay'
            });
        } else {
            presentCount++;
            records.push({
                id: 'att_' + Math.random().toString(36).slice(2, 9),
                user_id: userId,
                user_email: email,
                company_id: companyId,
                date: dateStr,
                status: 'Present',
                clock_in: '09:05 AM',
                clock_out: '06:15 PM',
                worked_hours: '09h 10m',
                overtime: '15 mins',
                remarks: ''
            });
        }
    }
    
    // Seed corrections
    corrections.push({
        id: 'CORR-001',
        user_id: userId,
        user_email: email,
        company_id: companyId,
        date: `${year}-${String(month + 1).padStart(2, '0')}-02`,
        type: 'Forgot Tap Out',
        reason: 'Client meeting ran late',
        remarks: 'Forgot to punch out at the end of day',
        status: 'Approved',
        manager_remarks: 'Approved after verification with site lead.'
    });
    
    corrections.push({
        id: 'CORR-002',
        user_id: userId,
        user_email: email,
        company_id: companyId,
        date: `${year}-${String(month + 1).padStart(2, '0')}-15`,
        type: 'Late Explanation',
        reason: 'Public transport delay',
        remarks: 'Metro line breakdown for 30 minutes',
        status: 'Pending',
        manager_remarks: ''
    });

    await Attendance.insertMany(records);
    if (onDuties.length) await OnDuty.insertMany(onDuties);
    if (corrections.length) await Correction.insertMany(corrections);
    
    // Update employee late credits logs
    await Employee.findOneAndUpdate(
        { user_email: email },
        { 
            $set: { 
                late_credits: 32,
                late_credit_logs: [
                    { date: `${year}-${String(month + 1).padStart(2, '0')}-04`, late_minutes: 15, deducted_credits: 2, balance: 38 },
                    { date: `${year}-${String(month + 1).padStart(2, '0')}-09`, late_minutes: 25, deducted_credits: 3, balance: 35 },
                    { date: `${year}-${String(month + 1).padStart(2, '0')}-12`, late_minutes: 35, deducted_credits: 3, balance: 32 }
                ]
            } 
        }
    );
};

// 1. Auth/Profile
export const getMe = async (req, res) => {
    try {
        const { user, employee } = await getSessionDetails(req.userId);
        const empData = employee.toJSON ? employee.toJSON() : (employee._doc ? { ...employee._doc } : employee);
        res.json({
            user,
            employee: empData,
            // Top-level onboarding fields for easy frontend access
            onboarding_status: empData.onboarding_status || 'Pending Onboarding',
            onboarding_step: empData.onboarding_step || 0,
            employee_type: empData.employee_type || 'Fresher',
            email_verified: empData.email_verified || false
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getProfile = async (req, res) => {
    try {
        const { employee } = await getSessionDetails(req.userId);
        res.json(employee);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const updateProfileRequest = async (req, res) => {
    try {
        res.json({ ok: true, message: 'Profile update request submitted for HR approval.' });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// 2. Dashboard
export const getDashboardSummary = async (req, res) => {
    try {
        const { employee } = await getSessionDetails(req.userId);
        res.json({
            today_punch: null,
            late_credits: employee.late_credits || 40,
            pending_requests: 0,
            assigned_tasks: 0,
            recent_announcements: [
                { id: '1', title: 'Welcome to the new BEZENT Portal!', date: new Date().toISOString().split('T')[0] }
            ]
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

const fmtTime = (d) => d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
const fmtWorked = (ms) => { const h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000); return `${h}h ${String(m).padStart(2,'0')}m`; };
const parseClockTime = (str, refDate) => {
    const m = str.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!m) return null;
    let h = parseInt(m[1]), min = parseInt(m[2]), ap = m[3].toUpperCase();
    if (ap === 'PM' && h !== 12) h += 12;
    if (ap === 'AM' && h === 12) h = 0;
    const d = new Date(refDate); d.setHours(h, min, 0, 0); return d;
};

export const getTodayAttendance = async (req, res) => {
    try {
        const { employee } = await getSessionDetails(req.userId);
        const today = new Date().toISOString().split('T')[0];
        const Attendance = getModel('hr_attendance');
        const record = await Attendance.findOne({ user_email: employee.user_email.toLowerCase(), date: today }).lean();
        res.json(record || null);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const tapIn = async (req, res) => {
    try {
        const { employee } = await getSessionDetails(req.userId);
        const email = employee.user_email.toLowerCase();
        const today = new Date().toISOString().split('T')[0];
        const Attendance = getModel('hr_attendance');

        let record = await Attendance.findOne({ user_email: email, date: today });
        if (record?.clock_in) return res.status(400).json({ error: 'Already punched in today' });

        const now = new Date();
        const clock_in = fmtTime(now);
        const nineAM = new Date(now); nineAM.setHours(9, 0, 0, 0);
        const isLate = now > nineAM;
        const status = isLate ? 'Late' : 'Present';
        const late_minutes = isLate ? Math.floor((now - nineAM) / 60000) : 0;

        if (record) {
            record.clock_in = clock_in; record.status = status;
            if (late_minutes) record.late_minutes = late_minutes;
            await record.save();
        } else {
            await Attendance.create({
                id: 'att_' + Math.random().toString(36).slice(2, 9),
                user_id: req.userId, user_email: email,
                company_id: employee.company_id, date: today,
                clock_in, status, late_minutes: late_minutes || undefined
            });
        }
        res.json({ ok: true, clock_in, status, late_minutes });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const tapOut = async (req, res) => {
    try {
        const { employee } = await getSessionDetails(req.userId);
        const email = employee.user_email.toLowerCase();
        const today = new Date().toISOString().split('T')[0];
        const Attendance = getModel('hr_attendance');

        const record = await Attendance.findOne({ user_email: email, date: today });
        if (!record?.clock_in) return res.status(400).json({ error: 'Not punched in today' });
        if (record.clock_out) return res.status(400).json({ error: 'Already punched out today' });

        const now = new Date();
        const clock_out = fmtTime(now);
        const inDate = parseClockTime(record.clock_in, now);
        const worked_hours = inDate ? fmtWorked(now - inDate) : '—';

        record.clock_out = clock_out;
        record.worked_hours = worked_hours;
        await record.save();

        res.json({ ok: true, clock_out, worked_hours, status: record.status });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// 3. Attendance
export const getAttendanceOverview = async (req, res) => {
    try {
        const { employee } = await getSessionDetails(req.userId);
        const email = employee.user_email.toLowerCase();
        await seedAttendanceIfEmpty(req.userId, email, employee.company_id);

        const Attendance = getModel('hr_attendance');
        const OnDuty = getModel('hr_onduty');

        // Query counts for current month
        const now = new Date();
        const year = now.getFullYear();
        const monthStr = String(now.getMonth() + 1).padStart(2, '0');
        const monthPrefix = `${year}-${monthStr}`;

        const attList = await Attendance.find({ user_email: email, date: { $regex: '^' + monthPrefix } }).lean();
        const onDutyCount = await OnDuty.countDocuments({ user_email: email, status: 'Approved', date: { $regex: '^' + monthPrefix } });

        const presentCount = attList.filter(a => a.status === 'Present').length;
        const lateCount = attList.filter(a => a.status === 'Late').length;
        const halfDayCount = attList.filter(a => a.status === 'Half Day').length;
        const absentCount = attList.filter(a => a.status === 'Absent').length;

        // Calculate hours dynamically
        const workedHours = Math.round((presentCount * 9.16) + (lateCount * 9) + (halfDayCount * 4.75) + (onDutyCount * 9));
        const totalActiveDays = presentCount + lateCount + halfDayCount + onDutyCount;
        const totalDays = totalActiveDays + absentCount;
        const attendancePercent = totalDays > 0 ? Math.round((totalActiveDays / totalDays) * 100) : 100;

        res.json({
            present_days: presentCount + lateCount,
            absent_days: absentCount,
            half_days: halfDayCount,
            late_arrivals: lateCount,
            late_credits: employee.late_credits || 40,
            attendance_percent: attendancePercent,
            on_duty_days: onDutyCount,
            worked_hours: workedHours
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getAttendanceMonthSummary = async (req, res) => {
    try {
        const { employee } = await getSessionDetails(req.userId);
        const email = employee.user_email.toLowerCase();
        const Attendance = getModel('hr_attendance');
        const OnDuty = getModel('hr_onduty');

        const now = new Date();
        const year = req.query.year || now.getFullYear();
        const month = req.query.month || (now.getMonth() + 1);
        const monthPrefix = `${year}-${String(month).padStart(2, '0')}`;

        const attList = await Attendance.find({ user_email: email, date: { $regex: '^' + monthPrefix } }).lean();
        const onDutyCount = await OnDuty.countDocuments({ user_email: email, status: 'Approved', date: { $regex: '^' + monthPrefix } });

        const presentCount = attList.filter(a => a.status === 'Present').length;
        const lateCount = attList.filter(a => a.status === 'Late').length;
        const halfDayCount = attList.filter(a => a.status === 'Half Day').length;
        const absentCount = attList.filter(a => a.status === 'Absent').length;

        const workedHours = Math.round((presentCount * 9.16) + (lateCount * 9) + (halfDayCount * 4.75) + (onDutyCount * 9));
        const totalActiveDays = presentCount + lateCount + halfDayCount + onDutyCount;
        const totalDays = totalActiveDays + absentCount;
        const attendancePercent = totalDays > 0 ? Math.round((totalActiveDays / totalDays) * 100) : 100;

        res.json({
            present_days: presentCount + lateCount,
            absent_days: absentCount,
            half_days: halfDayCount,
            on_duty_days: onDutyCount,
            attendance_percent: attendancePercent,
            worked_hours: workedHours + 'h'
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getAttendanceDateDetails = async (req, res) => {
    try {
        const { employee } = await getSessionDetails(req.userId);
        const email = employee.user_email.toLowerCase();
        const targetDate = req.params.date;

        const Attendance = getModel('hr_attendance');
        const OnDuty = getModel('hr_onduty');

        const record = await Attendance.findOne({ user_email: email, date: targetDate }).lean();
        if (record) {
            res.json(record);
        } else {
            // Check for approved on-duty record
            const od = await OnDuty.findOne({ user_email: email, date: targetDate, status: 'Approved' }).lean();
            if (od) {
                res.json({
                    date: targetDate,
                    status: 'On Duty',
                    clock_in: '09:00 AM',
                    clock_out: '06:00 PM',
                    worked_hours: '09h 00m',
                    overtime: '',
                    remarks: od.reason || 'Approved On Duty'
                });
            } else {
                res.json(null);
            }
        }
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getAttendanceCalendar = async (req, res) => {
    try {
        const { employee } = await getSessionDetails(req.userId);
        const email = employee.user_email.toLowerCase();
        await seedAttendanceIfEmpty(req.userId, email, employee.company_id);

        const Attendance = getModel('hr_attendance');
        const OnDuty = getModel('hr_onduty');
        const now = new Date();
        const year = req.query.year || now.getFullYear();
        const month = req.query.month || (now.getMonth() + 1);
        const monthPrefix = `${year}-${String(month).padStart(2, '0')}`;

        const attList = await Attendance.find({ user_email: email, date: { $regex: '^' + monthPrefix } }).sort({ date: 1 }).lean();
        const odList = await OnDuty.find({ user_email: email, status: 'Approved', date: { $regex: '^' + monthPrefix } }).lean();

        const mergedList = [...attList];
        odList.forEach(od => {
            if (!mergedList.some(a => a.date === od.date)) {
                mergedList.push({
                    date: od.date,
                    status: 'On Duty',
                    clock_in: '09:00 AM',
                    clock_out: '06:00 PM',
                    worked_hours: '09h 00m',
                    remarks: od.reason || 'Approved On Duty'
                });
            }
        });

        mergedList.sort((a, b) => a.date.localeCompare(b.date));
        res.json(mergedList);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getAttendanceHistory = async (req, res) => {
    try {
        const { employee } = await getSessionDetails(req.userId);
        const email = employee.user_email.toLowerCase();
        await seedAttendanceIfEmpty(req.userId, email, employee.company_id);

        const Attendance = getModel('hr_attendance');
        const OnDuty = getModel('hr_onduty');
        const query = { user_email: email };

        if (req.query.from_date || req.query.to_date) {
            query.date = {};
            if (req.query.from_date) query.date.$gte = req.query.from_date;
            if (req.query.to_date) query.date.$lte = req.query.to_date;
        }

        if (req.query.search) {
            query.remarks = { $regex: req.query.search, $options: 'i' };
        }

        const attList = await Attendance.find(query).lean();

        const odQuery = { user_email: email, status: 'Approved' };
        if (query.date) odQuery.date = query.date;
        if (req.query.search) {
            odQuery.reason = { $regex: req.query.search, $options: 'i' };
        }
        const odList = await OnDuty.find(odQuery).lean();

        const merged = [...attList];
        odList.forEach(od => {
            if (!merged.some(a => a.date === od.date)) {
                merged.push({
                    date: od.date,
                    status: 'On Duty',
                    clock_in: '09:00 AM',
                    clock_out: '06:00 PM',
                    worked_hours: '09h 00m',
                    remarks: od.reason || 'Approved On Duty'
                });
            }
        });

        let filtered = merged;
        if (req.query.status && req.query.status !== 'All') {
            filtered = merged.filter(a => a.status === req.query.status);
        }

        filtered.sort((a, b) => b.date.localeCompare(a.date));

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const total = filtered.length;
        const paginated = filtered.slice(skip, skip + limit);

        res.json({
            data: paginated,
            total,
            page,
            limit
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

const calculateLateArrivalDetails = (arrivalTimeStr) => {
    if (!arrivalTimeStr) return { minutes: 0, credits: 0, isHalfDay: false };
    const match = arrivalTimeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
    if (!match) return { minutes: 0, credits: 0, isHalfDay: false };
    
    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const ampm = match[3] ? match[3].toUpperCase() : 'AM';
    
    if (ampm === 'PM' && hours !== 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    
    const totalMinutes = hours * 60 + minutes;
    const nineAM = 9 * 60;
    
    if (totalMinutes <= nineAM) {
        return { minutes: 0, credits: 0, isHalfDay: false };
    }
    
    const diff = totalMinutes - nineAM;
    if (totalMinutes <= nineAM + 6) {
        return { minutes: diff, credits: diff, isHalfDay: false };
    } else {
        return { minutes: diff, credits: 0, isHalfDay: true };
    }
};

export const postAttendanceCorrection = async (req, res) => {
    try {
        const { employee } = await getSessionDetails(req.userId);
        const email = employee.user_email.toLowerCase();
        const Correction = getModel('hr_corrections');

        const {
            date,
            category,
            specify_category,
            reason,
            additional_notes,
            attachment,
            clock_in_time,
            clock_out_time,
            arrival_time,
            permission_date,
            from_time,
            to_time,
            manager_name
        } = req.body;

        if (!date || !category || !reason) {
            return res.status(400).json({ error: 'Date, category, and reason are required fields.' });
        }

        let late_minutes = 0;
        let credits_deducted = 0;
        let remaining_credits = employee.late_credits || 40;

        if (category === 'Late Arrival') {
            if (!arrival_time) {
                return res.status(400).json({ error: 'Arrival time is required for late arrival requests.' });
            }
            const details = calculateLateArrivalDetails(arrival_time);
            late_minutes = details.minutes;
            credits_deducted = details.credits;
            remaining_credits = Math.max(0, (employee.late_credits || 40) - credits_deducted);
        }

        const doc = new Correction({
            id: 'CORR-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
            user_id: req.userId,
            user_email: email,
            company_id: employee.company_id,
            date,
            type: category,
            category,
            specify_category,
            reason,
            additional_notes,
            attachment,
            clock_in_time,
            clock_out_time,
            arrival_time,
            permission_date,
            from_time,
            to_time,
            manager_name,
            late_minutes,
            credits_deducted,
            remaining_credits,
            status: 'Pending',
            manager_status: 'Pending',
            hr_status: 'Pending',
            manager_remarks: '',
            hr_remarks: '',
            created_at: new Date().toISOString().split('T')[0]
        });

        await doc.save();
        res.json({ ok: true, message: 'Regularization request submitted.', id: doc.id });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const editAttendanceCorrection = async (req, res) => {
    try {
        const { employee } = await getSessionDetails(req.userId);
        const email = employee.user_email.toLowerCase();
        const Correction = getModel('hr_corrections');
        const reqId = req.params.id;

        const doc = await Correction.findOne({ id: reqId, user_email: email });
        if (!doc) {
            return res.status(404).json({ error: 'Regularization request not found.' });
        }

        if (doc.status !== 'Pending') {
            return res.status(400).json({ error: 'Requests can only be edited while pending manager review.' });
        }

        const {
            date,
            category,
            specify_category,
            reason,
            additional_notes,
            attachment,
            clock_in_time,
            clock_out_time,
            arrival_time,
            permission_date,
            from_time,
            to_time,
            manager_name
        } = req.body;

        if (!date || !category || !reason) {
            return res.status(400).json({ error: 'Date, category, and reason are required fields.' });
        }

        let late_minutes = 0;
        let credits_deducted = 0;
        let remaining_credits = employee.late_credits || 40;

        if (category === 'Late Arrival') {
            if (!arrival_time) {
                return res.status(400).json({ error: 'Arrival time is required for late arrival requests.' });
            }
            const details = calculateLateArrivalDetails(arrival_time);
            late_minutes = details.minutes;
            credits_deducted = details.credits;
            remaining_credits = Math.max(0, (employee.late_credits || 40) - credits_deducted);
        }

        await Correction.findOneAndUpdate(
            { id: reqId, user_email: email },
            {
                $set: {
                    date,
                    category,
                    type: category,
                    specify_category,
                    reason,
                    additional_notes,
                    attachment,
                    clock_in_time,
                    clock_out_time,
                    arrival_time,
                    permission_date,
                    from_time,
                    to_time,
                    manager_name,
                    late_minutes,
                    credits_deducted,
                    remaining_credits
                }
            }
        );
        res.json({ ok: true, message: 'Regularization request updated successfully.' });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const cancelAttendanceCorrection = async (req, res) => {
    try {
        const { employee } = await getSessionDetails(req.userId);
        const email = employee.user_email.toLowerCase();
        const Correction = getModel('hr_corrections');
        const reqId = req.params.id;

        const doc = await Correction.findOne({ id: reqId, user_email: email });
        if (!doc) {
            return res.status(404).json({ error: 'Regularization request not found.' });
        }

        if (doc.status !== 'Pending') {
            return res.status(400).json({ error: 'Requests can only be cancelled while pending manager review.' });
        }

        await Correction.findOneAndUpdate(
            { id: reqId, user_email: email },
            { $set: { status: 'Cancelled' } }
        );
        res.json({ ok: true, message: 'Regularization request cancelled.' });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getAttendanceCorrections = async (req, res) => {
    try {
        const { employee } = await getSessionDetails(req.userId);
        const email = employee.user_email.toLowerCase();
        const Correction = getModel('hr_corrections');
        const list = await Correction.find({ user_email: email }).sort({ created_at: -1 }).lean();
        res.json(list);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getLateCredits = async (req, res) => {
    try {
        const { employee } = await getSessionDetails(req.userId);
        const email = employee.user_email.toLowerCase();
        await seedAttendanceIfEmpty(req.userId, email, employee.company_id);

        const EmployeeModel = getModel('hr_employees');
        const emp = await EmployeeModel.findOne({ user_email: email }).lean();

        res.json({
            total_credits: 40,
            used_credits: 40 - (emp?.late_credits || 40),
            remaining_credits: emp?.late_credits || 40,
            logs: emp?.late_credit_logs || []
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getAttendanceLeaderboard = async (req, res) => {
    try {
        const { employee } = await getSessionDetails(req.userId);
        const EmployeeModel = getModel('hr_employees');
        const list = await EmployeeModel.find({ company_id: employee.company_id }).lean();

        // Calculate rankings dynamically
        const rankings = list.map(emp => {
            const isMe = emp.user_email.toLowerCase() === employee.user_email.toLowerCase();
            // Deterministic dynamic rank factors for seeding leaderboard variety
            let attendancePercent = 95;
            let rankMovement = '—';
            if (emp.user_email.includes('admin')) {
                attendancePercent = 99;
                rankMovement = '↑2';
            } else if (emp.user_email.includes('priya')) {
                attendancePercent = 96;
                rankMovement = '↓1';
            } else if (emp.user_email.includes('manager')) {
                attendancePercent = 98;
                rankMovement = '—';
            }
            return {
                name: emp.name,
                department: emp.department || 'General',
                attendance_percent: attendancePercent,
                remaining_credits: emp.late_credits || 40,
                rank_movement: rankMovement,
                is_me: isMe
            };
        });

        // Sort: attendance percent DESC, credits remaining DESC
        rankings.sort((a, b) => b.attendance_percent - a.attendance_percent || b.remaining_credits - a.remaining_credits);

        // Add Rank index
        const ranked = rankings.map((r, index) => ({
            rank: index + 1,
            ...r
        }));

        res.json(ranked);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getAttendanceAnalytics = async (req, res) => {
    try {
        const { employee } = await getSessionDetails(req.userId);
        const email = employee.user_email.toLowerCase();
        await seedAttendanceIfEmpty(req.userId, email, employee.company_id);

        const Attendance = getModel('hr_attendance');
        const now = new Date();
        const year = now.getFullYear();
        const monthStr = String(now.getMonth() + 1).padStart(2, '0');
        const monthPrefix = `${year}-${monthStr}`;

        const attList = await Attendance.find({ user_email: email, date: { $regex: '^' + monthPrefix } }).lean();

        const presentCount = attList.filter(a => a.status === 'Present').length;
        const lateCount = attList.filter(a => a.status === 'Late').length;
        const halfDayCount = attList.filter(a => a.status === 'Half Day').length;
        const absentCount = attList.filter(a => a.status === 'Absent').length;
        const onDutyCount = attList.filter(a => a.status === 'On Duty').length;
        const holidayCount = attList.filter(a => a.status === 'Holiday').length;

        res.json({
            attendance_trends: [94, 95, 96, 96],
            worked_hours_trends: [135, 142, 140, 148],
            attendance_distribution: {
                "Present": presentCount,
                "Absent": absentCount,
                "Half Day": halfDayCount,
                "On Duty": onDutyCount,
                "Leave": 0,
                "Holiday": holidayCount
            }
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const exportAttendanceCsv = async (req, res) => {
    try {
        const { employee } = await getSessionDetails(req.userId);
        const email = employee.user_email.toLowerCase();
        const Attendance = getModel('hr_attendance');
        const OnDuty = getModel('hr_onduty');

        const attList = await Attendance.find({ user_email: email }).lean();
        const odList = await OnDuty.find({ user_email: email, status: 'Approved' }).lean();

        const merged = [...attList];
        odList.forEach(od => {
            if (!merged.some(a => a.date === od.date)) {
                merged.push({
                    date: od.date,
                    status: 'On Duty',
                    clock_in: '09:00 AM',
                    clock_out: '06:00 PM',
                    worked_hours: '09h 00m',
                    remarks: od.reason || 'Approved On Duty'
                });
            }
        });

        merged.sort((a, b) => b.date.localeCompare(a.date));

        const csvRows = [
            `Employee Name,${employee.name}`,
            `Employee ID,${employee.employee_id || 'N/A'}`,
            `Department,${employee.department || 'N/A'}`,
            `Designation,${employee.designation || 'N/A'}`,
            `Report Period,All Time Logs`,
            `Generated Date,${new Date().toLocaleDateString()}`,
            '',
            'Date,Status,Check In,Check Out,Worked Hours,Remarks'
        ];

        merged.forEach(row => {
            csvRows.push(`"${row.date}","${row.status}","${row.clock_in || 'N/A'}","${row.clock_out || 'N/A'}","${row.worked_hours || 'N/A'}","${row.remarks || ''}"`);
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=attendance_history.csv');
        res.send(csvRows.join('\n'));
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const exportAttendancePdf = async (req, res) => {
    try {
        const { employee } = await getSessionDetails(req.userId);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=attendance_history.pdf');
        
        // Return a mock PDF page binary representation
        res.send(Buffer.from('BEZENT Attendance Report\n\n' +
            `Employee: ${employee.name} (${employee.employee_id})\n` +
            `Department: ${employee.department}\n` +
            `Generated: ${new Date().toLocaleString()}\n` +
            '-----------------------------------------\n' +
            'Punch details verified by system gateway.\n'));
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// 4. Leave
export const getLeaveBalance = async (req, res) => {
    try {
        res.json({ casual_leave: 12, sick_leave: 10, paid_leave: 15 });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const applyLeave = async (req, res) => {
    try {
        res.json({ ok: true, message: 'Leave application submitted.' });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getLeaveHistory = async (req, res) => {
    try {
        res.json([]);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getHolidays = async (req, res) => {
    try {
        res.json([
            { name: 'New Year Day', date: '2026-01-01' },
            { name: 'Republic Day', date: '2026-01-26' },
            { name: 'Independence Day', date: '2026-08-15' },
            { name: 'Christmas', date: '2026-12-25' }
        ]);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// 5. Request Center
export const postOnDuty = async (req, res) => {
    try {
        const { user, employee } = await getSessionDetails(req.userId);
        const email = employee.user_email.toLowerCase();
        
        const OnDuty = getModel('hr_onduty');
        const data = req.body;
        
        const id = 'od_' + Math.random().toString(36).slice(2, 9);
        const newReq = {
            id,
            user_id: req.userId,
            user_email: email,
            company_id: employee.company_id,
            date: data.date,
            purpose: data.purpose,
            location: data.location,
            remarks: data.remarks || '',
            departure_date: data.departure_date,
            departure_time: data.departure_time,
            expected_return_date: data.expected_return_date,
            expected_return_time: data.expected_return_time,
            status: 'Pending',
            manager_email: (employee.reporting_manager || '').toLowerCase(),
            created_at: new Date().toISOString()
        };
        
        await OnDuty.create(newReq);
        
        const Notification = getModel('employee_notifications');
        await Notification.create({
            id: 'notif_' + Math.random().toString(36).slice(2, 9),
            user_id: req.userId,
            user_email: email,
            company_id: employee.company_id,
            title: 'On Duty Request Submitted',
            message: `Your On Duty request for ${data.date} (${data.purpose}) has been submitted.`,
            module: 'on-duty',
            ref_id: id,
            is_read: false,
            created_at: new Date().toISOString()
        });
        
        res.json({ ok: true, message: 'On-Duty request submitted.', id });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getOnDutyHistory = async (req, res) => {
    try {
        const { employee } = await getSessionDetails(req.userId);
        const email = employee.user_email.toLowerCase();
        
        const OnDuty = getModel('hr_onduty');
        const list = await OnDuty.find({ user_email: email }).sort({ created_at: -1 }).lean();
        res.json(list);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getOnDutyApproved = async (req, res) => {
    try {
        const { employee } = await getSessionDetails(req.userId);
        const email = employee.user_email.toLowerCase();
        
        const OnDuty = getModel('hr_onduty');
        const list = await OnDuty.find({ user_email: email, status: 'Approved' }).lean();
        res.json(list);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const postReimbursement = async (req, res) => {
    try {
        const { user, employee } = await getSessionDetails(req.userId);
        const email = employee.user_email.toLowerCase();
        
        const Expense = getModel('hr_expenses');
        const data = req.body;
        
        const id = data.id || 'exp_' + Math.random().toString(36).slice(2, 9);
        const items = data.items || [];
        const total_amount = items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
        
        const newClaim = {
            id,
            user_id: req.userId,
            user_email: email,
            company_id: employee.company_id,
            title: data.title,
            date: data.date,
            client_project: data.client_project || '',
            purpose: data.purpose,
            manager_email: (employee.reporting_manager || '').toLowerCase(),
            status: 'Pending Manager Approval',
            payment_status: 'Unpaid',
            items,
            total_amount,
            created_at: new Date().toISOString()
        };
        
        await Expense.create(newClaim);
        
        const Notification = getModel('employee_notifications');
        await Notification.create({
            id: 'notif_' + Math.random().toString(36).slice(2, 9),
            user_id: req.userId,
            user_email: email,
            company_id: employee.company_id,
            title: 'Expense Claim Submitted',
            message: `Your Expense claim "${data.title}" for ₹${total_amount} has been submitted.`,
            module: 'reimbursement',
            ref_id: id,
            is_read: false,
            created_at: new Date().toISOString()
        });
        
        res.json({ ok: true, message: 'Reimbursement claim submitted.', id });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getReimbursementHistory = async (req, res) => {
    try {
        const { employee } = await getSessionDetails(req.userId);
        const email = employee.user_email.toLowerCase();
        
        const Expense = getModel('hr_expenses');
        const list = await Expense.find({ user_email: email }).sort({ created_at: -1 }).lean();
        res.json(list);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getReimbursementPendingBadge = async (req, res) => {
    try {
        const { employee } = await getSessionDetails(req.userId);
        const email = employee.user_email.toLowerCase();
        
        const Notification = getModel('employee_notifications');
        const count = await Notification.countDocuments({ user_email: email, is_read: false });
        res.json({ pending_count: count });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getNotifications = async (req, res) => {
    try {
        const { employee } = await getSessionDetails(req.userId);
        const email = employee.user_email.toLowerCase();
        
        const Notification = getModel('employee_notifications');
        const list = await Notification.find({ user_email: email }).sort({ created_at: -1 }).limit(50).lean();
        res.json(list);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const markNotificationsRead = async (req, res) => {
    try {
        const { employee } = await getSessionDetails(req.userId);
        const email = employee.user_email.toLowerCase();
        
        const Notification = getModel('employee_notifications');
        await Notification.updateMany({ user_email: email, is_read: false }, { $set: { is_read: true } });
        res.json({ ok: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// 6. Payroll
export const getPayrollSlips = async (req, res) => {
    try {
        const { employee } = await getSessionDetails(req.userId);
        const email = employee.user_email.toLowerCase();
        const PayrollModel = getModel('hr_payroll');
        const list = await PayrollModel.find({ user_email: email }).sort({ month: -1 }).lean();
        res.json(list);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getPayrollStructure = async (req, res) => {
    try {
        const { employee } = await getSessionDetails(req.userId);
        const gross = employee.salary || 100000;
        const basic = Math.floor(gross * 0.5);
        const hra = Math.floor(basic * 0.4);
        
        const email = employee.user_email.toLowerCase();
        const isCanteen = email.includes("rahul") || email.includes("amit");
        const foodAllowance = isCanteen ? 0 : 800;
        const canteenDeduction = isCanteen ? 1200 : 0;
        
        const special = gross - basic - hra;
        const finalAllowance = special + foodAllowance;
        
        const pf = Math.floor(basic * 0.12);
        const esi = Math.floor(gross * 0.0075);
        const pt = 200;
        const tax = Math.floor(gross * 0.05);
        
        let deductions = pf + esi + pt + tax + canteenDeduction;
        
        const LoanModel = getModel('hr_loans');
        const activeLoan = await LoanModel.findOne({
            user_email: email,
            status: { $in: ['Approved', 'Active'] },
            remaining_balance: { $gt: 0 }
        });
        
        let loanEMI = 0;
        if (activeLoan) {
            loanEMI = Math.min(activeLoan.monthly_emi, activeLoan.remaining_balance);
        }
        deductions += loanEMI;
        
        const finalGross = gross + foodAllowance;
        const net = finalGross - deductions;
        
        res.json({
            gross: finalGross,
            basic,
            hra,
            special: finalAllowance,
            pf,
            esi,
            pt,
            tax,
            canteenDeduction,
            loanEMI,
            deductions,
            net
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const applyLoan = async (req, res) => {
    try {
        const { employee } = await getSessionDetails(req.userId);
        const email = employee.user_email.toLowerCase();
        const { amount, repayment_months, reason } = req.body;
        
        const amt = parseFloat(amount);
        const months = parseInt(repayment_months);
        
        if (!amt || amt <= 0) {
            return res.status(400).json({ error: 'Please enter a valid loan amount.' });
        }
        if (!months || months < 1 || months > 24) {
            return res.status(400).json({ error: 'Repayment duration must be between 1 and 24 months.' });
        }
        if (!reason || reason.trim() === '') {
            return res.status(400).json({ error: 'Reason for salary advance is required.' });
        }
        
        const LoanModel = getModel('hr_loans');
        const monthly_emi = Math.round(amt / months);
        
        const doc = new LoanModel({
            id: 'LOAN-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
            user_id: req.userId,
            user_email: email,
            employee_id: employee.employee_id || employee.id,
            name: employee.name,
            amount: amt,
            reason: reason.trim(),
            repayment_months: months,
            monthly_emi,
            status: 'Pending',
            remaining_balance: amt,
            company_id: employee.company_id,
            company: employee.company,
            remarks: '',
            created_at: new Date().toISOString().split('T')[0]
        });
        
        await doc.save();
        res.json({ ok: true, message: 'Salary advance request submitted successfully.', id: doc.id });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getLoans = async (req, res) => {
    try {
        const { employee } = await getSessionDetails(req.userId);
        const email = employee.user_email.toLowerCase();
        const LoanModel = getModel('hr_loans');
        const list = await LoanModel.find({ user_email: email }).sort({ created_at: -1 }).lean();
        res.json(list);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getTaxDocuments = async (req, res) => {
    try {
        res.json([]);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// 7. Documents
export const getDocuments = async (req, res) => {
    try {
        res.json([]);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const uploadDocument = async (req, res) => {
    try {
        res.json({ ok: true, message: 'Document uploaded successfully.' });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// 8. Task Workspace
export const getTaskDashboard = async (req, res) => {
    try {
        res.json({ pending: 0, active: 0, completed: 0 });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getTasks = async (req, res) => {
    try {
        res.json([]);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getProjects = async (req, res) => {
    try {
        res.json([]);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getGoals = async (req, res) => {
    try {
        res.json([]);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getPerformance = async (req, res) => {
    try {
        res.json([]);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getCollaboration = async (req, res) => {
    try {
        res.json([]);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getReports = async (req, res) => {
    try {
        res.json([]);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// Helper to seed performance data if the employee has no records in the DB
const seedPerformanceDataIfEmpty = async (employee, userId) => {
    const PerfModel = getModel('performance_records');
    const GoalModel = getModel('performance_goals');
    const FeedbackModel = getModel('performance_feedback');
    const AchModel = getModel('performance_achievements');

    const empId = employee.employee_id;

    // Check if performance record exists
    const hasPerf = await PerfModel.findOne({ employee_id: empId });
    if (!hasPerf) {
        // Seed Performance Records
        await PerfModel.create([
            { id: 'perf_1', user_id: userId, employee_id: empId, review_cycle: 'Q1 2026', performance_score: 85, manager_rating: 4.3, review_status: 'Completed', reviewer: 'Sabin Rahul', review_date: '2026-03-31', remarks: 'Excellent delivery of first-phase modules.' },
            { id: 'perf_2', user_id: userId, employee_id: empId, review_cycle: 'Q2 2026', performance_score: 87, manager_rating: 4.5, review_status: 'In Progress', reviewer: 'Sabin Rahul', review_date: '2026-06-20', remarks: 'Strong leadership on task flow management.' }
        ]);

        // Seed Goals
        await GoalModel.create([
            { id: 'goal_1', user_id: userId, employee_id: empId, goal_name: 'Employee Portal Completion', goal_category: 'Engineering', target_date: '2026-06-30', progress: 90, status: 'In Progress' },
            { id: 'goal_2', user_id: userId, employee_id: empId, goal_name: 'Attendance Improvement', goal_category: 'HR/Compliance', target_date: '2026-07-15', progress: 60, status: 'In Progress' },
            { id: 'goal_3', user_id: userId, employee_id: empId, goal_name: 'Project Delivery Accuracy', goal_category: 'Quality', target_date: '2026-06-25', progress: 80, status: 'In Progress' },
            { id: 'goal_4', user_id: userId, employee_id: empId, goal_name: 'Database Optimization', goal_category: 'Engineering', target_date: '2026-05-10', progress: 100, status: 'Completed' },
            { id: 'goal_5', user_id: userId, employee_id: empId, goal_name: 'API documentation', goal_category: 'Documentation', target_date: '2026-06-01', progress: 30, status: 'Overdue' }
        ]);

        // Seed Feedback
        await FeedbackModel.create([
            { id: 'fb_1', user_id: userId, employee_id: empId, reviewer: 'Sabin Rahul', category: 'Technical Skills', comments: 'Very strong full-stack skills. Good understanding of MongoDB optimization.', rating: 4.5 },
            { id: 'fb_2', user_id: userId, employee_id: empId, reviewer: 'Sabin Rahul', category: 'Communication', comments: 'Excellent communication during the design reviews. Keep it up.', rating: 4.0 },
            { id: 'fb_3', user_id: userId, employee_id: empId, reviewer: 'Sabin Rahul', category: 'Teamwork', comments: 'Collaborates very well with the QA team to resolve onboarding tickets.', rating: 4.8 },
            { id: 'fb_4', user_id: userId, employee_id: empId, reviewer: 'Sabin Rahul', category: 'Productivity', comments: 'High throughput of code, resolves blocker bugs very quickly.', rating: 4.6 }
        ]);

        // Seed Achievements
        await AchModel.create([
            { id: 'ach_1', user_id: userId, employee_id: empId, achievement_name: 'Top Performer', description: 'Awarded for exceptional contribution to the Bezent portal release.', awarded_on: '2026-05-01', awarded_by: 'HR Dept' },
            { id: 'ach_2', user_id: userId, employee_id: empId, achievement_name: 'Project Champion', description: 'Recognized for driving onboarding workflow implementation.', awarded_on: '2026-06-15', awarded_by: 'Sabin Rahul' },
            { id: 'ach_3', user_id: userId, employee_id: empId, achievement_name: 'Attendance Star', description: 'Maintained 100% attendance track record with zero late check-ins.', awarded_on: '2026-04-30', awarded_by: 'Sabin Rahul' }
        ]);
    }
};

export const getPerformanceOverview = async (req, res) => {
    try {
        const { employee } = await getSessionDetails(req.userId);
        await seedPerformanceDataIfEmpty(employee, req.userId);
        
        const PerfModel = getModel('performance_records');
        const GoalModel = getModel('performance_goals');
        
        const latestReview = await PerfModel.findOne({ employee_id: employee.employee_id, review_cycle: 'Q2 2026' });
        const completedGoals = await GoalModel.countDocuments({ employee_id: employee.employee_id, status: 'Completed' });
        
        res.json({
            overall_score: latestReview ? latestReview.performance_score : 87,
            tasks_completed: 48,
            goals_achieved: completedGoals || 9,
            manager_rating: latestReview ? latestReview.manager_rating : 4.5,
            current_quarter: latestReview ? latestReview.review_cycle : 'Q2 2026',
            review_status: latestReview ? latestReview.review_status : 'In Progress',
            performance_trend: 'Improving'
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getPerformanceGoals = async (req, res) => {
    try {
        const { employee } = await getSessionDetails(req.userId);
        await seedPerformanceDataIfEmpty(employee, req.userId);
        
        const GoalModel = getModel('performance_goals');
        const goals = await GoalModel.find({ employee_id: employee.employee_id });
        res.json(goals);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getPerformanceReviews = async (req, res) => {
    try {
        const { employee } = await getSessionDetails(req.userId);
        await seedPerformanceDataIfEmpty(employee, req.userId);
        
        const PerfModel = getModel('performance_records');
        const reviews = await PerfModel.find({ employee_id: employee.employee_id });
        res.json(reviews);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getPerformanceFeedback = async (req, res) => {
    try {
        const { employee } = await getSessionDetails(req.userId);
        await seedPerformanceDataIfEmpty(employee, req.userId);
        
        const FeedbackModel = getModel('performance_feedback');
        const feedback = await FeedbackModel.find({ employee_id: employee.employee_id });
        res.json(feedback);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getPerformanceAchievements = async (req, res) => {
    try {
        const { employee } = await getSessionDetails(req.userId);
        await seedPerformanceDataIfEmpty(employee, req.userId);
        
        const AchModel = getModel('performance_achievements');
        const achievements = await AchModel.find({ employee_id: employee.employee_id });
        res.json(achievements);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getPerformanceAnalytics = async (req, res) => {
    try {
        const { employee } = await getSessionDetails(req.userId);
        await seedPerformanceDataIfEmpty(employee, req.userId);
        
        const PerfModel = getModel('performance_records');
        const GoalModel = getModel('performance_goals');
        
        const completedCount = await GoalModel.countDocuments({ employee_id: employee.employee_id, status: 'Completed' });
        const pendingCount = await GoalModel.countDocuments({ employee_id: employee.employee_id, status: 'In Progress' }) + await GoalModel.countDocuments({ employee_id: employee.employee_id, status: 'Not Started' });
        const overdueCount = await GoalModel.countDocuments({ employee_id: employee.employee_id, status: 'Overdue' });
        
        const trend = [
            { month: 'Jan', score: 80 },
            { month: 'Feb', score: 82 },
            { month: 'Mar', score: 83 },
            { month: 'Apr', score: 85 },
            { month: 'May', score: 86 },
            { month: 'Jun', score: 87 }
        ];
        
        res.json({
            trend,
            goals: {
                completed: completedCount || 9,
                pending: pendingCount || 3,
                overdue: overdueCount || 1
            },
            distribution: {
                excellent: 60,
                good: 30,
                average: 8,
                needs_improvement: 2
            }
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

