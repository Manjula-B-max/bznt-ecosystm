import { Router } from 'express';
import { authMiddleware } from '../auth.js';
import * as ctrl from '../controllers/employeeController.js';
import * as profileCtrl from '../controllers/profileController.js';

const router = Router();

// Protect all routes with authMiddleware
router.use(authMiddleware);

// 1. Employee Auth/Profile
router.get('/me', ctrl.getMe);

// ─── My Profile Module ────────────────────────────────────────────────────
// Order matters: more-specific routes before less-specific
router.get('/profile/documents/:doc_type/view',     profileCtrl.viewDocument);
router.get('/profile/documents/:doc_type/download', profileCtrl.downloadDocument);
router.get('/profile/documents',                    profileCtrl.getProfileDocuments);
router.get('/profile/manager',                      profileCtrl.getManagerProfile);
router.get('/profile/requests/:id',                 profileCtrl.getProfileRequestById);
router.get('/profile/requests',                     profileCtrl.getProfileRequests);
router.post('/profile/requests',                    profileCtrl.submitProfileRequest);
router.get('/profile',                              profileCtrl.getFullProfile);
// ─────────────────────────────────────────────────────────────────────────

router.put('/profile/update-request', ctrl.updateProfileRequest);


// 2. Dashboard
router.get('/dashboard', ctrl.getDashboardSummary);
router.post('/attendance/tap-in', ctrl.tapIn);
router.post('/attendance/tap-out', ctrl.tapOut);

// 3. Attendance
router.get('/attendance/today', ctrl.getTodayAttendance);
router.get('/attendance/overview', ctrl.getAttendanceOverview);
router.get('/attendance/calendar', ctrl.getAttendanceCalendar);
router.get('/attendance/history', ctrl.getAttendanceHistory);
router.get('/attendance/month-summary', ctrl.getAttendanceMonthSummary);
router.get('/attendance/date-details/:date', ctrl.getAttendanceDateDetails);
router.post('/attendance/corrections', ctrl.postAttendanceCorrection);
router.get('/attendance/corrections', ctrl.getAttendanceCorrections);
router.put('/attendance/corrections/:id', ctrl.editAttendanceCorrection);
router.post('/attendance/corrections/:id/cancel', ctrl.cancelAttendanceCorrection);
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
router.get('/notifications', ctrl.getNotifications);
router.post('/notifications/read', ctrl.markNotificationsRead);

// 6. Payroll
router.get('/payroll/slips', ctrl.getPayrollSlips);
router.get('/payroll/structure', ctrl.getPayrollStructure);
router.get('/payroll/tax-documents', ctrl.getTaxDocuments);
router.post('/loans', ctrl.applyLoan);
router.get('/loans', ctrl.getLoans);

// 7. Documents
router.get('/documents', ctrl.getDocuments);
router.post('/documents/upload', ctrl.uploadDocument);

// 8. Task Workspace
router.get('/tasks/dashboard', ctrl.getTaskDashboard);
router.get('/tasks', ctrl.getTasks);
router.get('/projects', ctrl.getProjects);
router.get('/goals', ctrl.getGoals);
router.get('/performance', ctrl.getPerformance);
router.get('/performance/overview', ctrl.getPerformanceOverview);
router.get('/performance/goals', ctrl.getPerformanceGoals);
router.get('/performance/reviews', ctrl.getPerformanceReviews);
router.get('/performance/feedback', ctrl.getPerformanceFeedback);
router.get('/performance/achievements', ctrl.getPerformanceAchievements);
router.get('/performance/analytics', ctrl.getPerformanceAnalytics);
router.get('/collaboration', ctrl.getCollaboration);
router.get('/reports', ctrl.getReports);

export default router;
