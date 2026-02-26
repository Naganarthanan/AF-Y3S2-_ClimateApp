// COMPONENT 4: User + Education + Analytics
// File: backend/src/services/analyticsService.js
const User = require("../models/User");
const ActivityLog = require("../models/ActivityLog");
const QuizAttempt = require("../models/QuizAttempt");
const RiskAssessment = require("../models/RiskAssessment");

async function getAnalyticsSummary() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [totalUsers, newUsersLast7Days, alertsViewed, quizzesTaken, quizStats, topRegions, riskHistory] =
    await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      ActivityLog.countDocuments({ action: "view_alert" }),
      QuizAttempt.countDocuments(),
      QuizAttempt.aggregate([{ $group: { _id: null, avgScore: { $avg: "$score" } } }]),
      ActivityLog.aggregate([
        { $match: { regionId: { $ne: null } } },
        { $group: { _id: "$regionId", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),
      RiskAssessment.aggregate([
        { $sort: { assessedAt: -1 } },
        { $limit: 200 },
        {
          $project: {
            regionId: 1,
            riskScore: 1,
            severity: 1,
            assessedAt: 1,
          },
        },
      ]),
    ]);

  return {
    totalUsers,
    newUsersLast7Days,
    alertsViewed,
    quizzesTaken,
    averageQuizScore: quizStats[0]?.avgScore || 0,
    topRegions,
    riskHistory,
  };
}

module.exports = { getAnalyticsSummary };