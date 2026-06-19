import { Router } from 'express';
import { authMiddleware } from '../auth.js';
import * as ctrl from '../controllers/employeeController.js';

const router = Router();

// Protect all routes with authMiddleware
router.use(authMiddleware);

// 1. Employee Auth/Profile
router.get('/me', ctrl.getMe);
router.get('/profile', ctrl.getProfile);
router.put('/profile/update-request', ctrl.updateProfileRequest);

// 2. Dashboard
router.get('/dashboard', ctrl.getDashboardSummary);
router.post('/attendance/tap-in', ctrl.tapIn);
router.post('/attendance/tap-out', ctrl.tapOut);

// 3. Attendance
router.get('/attendance/overview', ctrl.getAttendanceOverview);
router.get('/attendance/calendar', ctrl.getAttendanceCalendar);
router.get('/attendance/history', ctrl.getAttendanceHistory);
router.get('/attendance/month-summary', ctrl.getAttendanceMonthSummary);
router.get('/attendance/date-details/:date', ctrl.getAttendanceDateDetails);
router.post('/attendance/corrections', ctrl.postAttendanceCorrection);
router.get('/attendance/corrections', ctrl.getAttendanceCorrections);
router.get('/attendance/late-credits', ctrl.getLateCredits);
router.get('/attendance/leaderboard', ctrl.getAttendanceLeaderboard);
router.get('/attendance/analytics', ctrl.getAttendanceAnalytics);
router.get('/attendance/export/csv', ctrl.exportAttendanceCsv);
router.get('/attendance/export/pdf', ctrl.exportAttendancePdf);

// 4. Leave
router.get('/leave/balance', ctrl.getLeaveBalance);
router.post('/leave/apply', ctrl.applyLeave);
router.get('/leave/history', ctrl.getLeaveHistory);
router.get('/leave/holidays', ctrl.getHolidays);

// 5. Request Center
router.post('/on-duty', ctrl.postOnDuty);
router.get('/on-duty/history', ctrl.getOnDutyHistory);
router.get('/on-duty/approved', ctrl.getOnDutyApproved);
router.post('/reimbursement', ctrl.postReimbursement);
router.get('/reimbursement/history', ctrl.getReimbursementHistory);
router.get('/reimbursement/pending-badge', ctrl.getReimbursementPendingBadge);

// 6. Payroll
router.get('/payroll/slips', ctrl.getPayrollSlips);
router.get('/payroll/structure', ctrl.getPayrollStructure);
router.get('/payroll/tax-documents', ctrl.getTaxDocuments);

// 7. Documents
router.get('/documents', ctrl.getDocuments);
router.post('/documents/upload', ctrl.uploadDocument);

// 8. Task Workspace
router.get('/tasks/dashboard', ctrl.getTaskDashboard);
router.get('/tasks', ctrl.getTasks);
router.get('/projects', ctrl.getProjects);
router.get('/goals', ctrl.getGoals);
router.get('/performance', ctrl.getPerformance);
router.get('/collaboration', ctrl.getCollaboration);
router.get('/reports', ctrl.getReports);

export default router;
