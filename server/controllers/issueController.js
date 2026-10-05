import Issue, { ALLOWED_CATEGORIES, ALLOWED_STATUSES } from "../models/Issue.js";
import Support from "../models/Support.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

// Helper to format uploaded image URL
const getImageUrl = (req) => {
  if (req.file) {
    const protocol = req.protocol || "http";
    const host = req.get("host") || "localhost:5000";
    return `${protocol}://${host}/uploads/${req.file.filename}`;
  }
  return req.body.image || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80";
};

// @desc    Create a new civic issue report
// @route   POST /api/issues
// @access  Private
export const createIssue = async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      latitude,
      longitude,
      locationName,
      address,
      area
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide an issue title."
      });
    }

    if (!category || !ALLOWED_CATEGORIES.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Invalid category. Allowed: ${ALLOWED_CATEGORIES.join(", ")}`
      });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide a detailed description of the problem."
      });
    }

    const lat = Number(latitude);
    const lng = Number(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({
        success: false,
        message: "Valid GPS coordinates (latitude and longitude) are required."
      });
    }

    const imageUrl = getImageUrl(req);
    const locName = (locationName || address || area || "Civic Area").trim();

    const nowFormatted = new Date().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });

    // Create issue
    const issue = await Issue.create({
      title: title.trim(),
      category,
      description: description.trim(),
      image: imageUrl,
      latitude: lat,
      longitude: lng,
      location: {
        type: "Point",
        coordinates: [lng, lat]
      },
      locationName: locName,
      address: locName,
      area: area || locName,
      status: "Reported",
      supportCount: 1, // Author automatically supports
      reportedBy: req.user._id,
      reporterName: req.user.name,
      reporterRole: "Citizen Reporter",
      timeline: [
        {
          status: "Reported",
          date: nowFormatted,
          completed: true,
          note: "Issue report submitted with GPS verification."
        },
        {
          status: "Verified",
          date: null,
          completed: false,
          note: "Pending municipal inspector review."
        },
        {
          status: "Assigned",
          date: null,
          completed: false,
          note: "Awaiting civic department dispatch."
        },
        {
          status: "In Progress",
          date: null,
          completed: false,
          note: "Repair crew work scheduled."
        },
        {
          status: "Resolved",
          date: null,
          completed: false,
          note: "Resolution inspection pending."
        }
      ]
    });

    // Automatically record support for the author
    await Support.create({
      issueId: issue._id,
      userId: req.user._id
    });

    // Create confirmation notification for user
    await Notification.create({
      userId: req.user._id,
      issueId: issue._id,
      type: "general",
      title: "Report Submitted",
      category: issue.category,
      message: `Your report "${issue.title}" has been successfully broadcast to nearby community members.`
    });

    return res.status(201).json({
      success: true,
      message: "Issue created successfully",
      issue
    });
  } catch (error) {
    console.error("Create Issue Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create issue report."
    });
  }
};

// @desc    Get all issues with optional filtering & search
// @route   GET /api/issues
// @access  Public
export const getIssues = async (req, res) => {
  try {
    const { category, status, search, sort = "recent" } = req.query;

    const query = {};

    // Category filter
    if (category && category !== "all") {
      if (category === "Water") {
        query.category = "Water Leakage";
      } else if (category === "Roads") {
        query.category = "Road Damage";
      } else if (category === "Traffic") {
        query.category = "Traffic Signal";
      } else {
        query.category = category;
      }
    }

    // Status filter
    if (status && status !== "all") {
      query.status = status;
    }

    // Search query
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { locationName: searchRegex },
        { address: searchRegex },
        { category: searchRegex }
      ];
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === "most_supported") {
      sortOption = { supportCount: -1, createdAt: -1 };
    } else if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    }

    const issues = await Issue.find(query)
      .sort(sortOption)
      .populate("reportedBy", "name email city avatar");

    return res.status(200).json({
      success: true,
      count: issues.length,
      issues
    });
  } catch (error) {
    console.error("Get Issues Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch issues."
    });
  }
};

// @desc    Get issues near coordinates using geospatial query
// @route   GET /api/issues/nearby
// @access  Public
export const getNearbyIssues = async (req, res) => {
  try {
    const { latitude, longitude, maxDistance = 50000, category } = req.query;

    const lat = Number(latitude);
    const lng = Number(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid latitude and longitude query parameters."
      });
    }

    const query = {
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat]
          },
          $maxDistance: Number(maxDistance) // in meters (default 50km)
        }
      }
    };

    if (category && category !== "all") {
      query.category = category;
    }

    let issues = [];
    try {
      issues = await Issue.find(query)
        .populate("reportedBy", "name email city avatar")
        .limit(100);
    } catch (geoError) {
      // Fallback if 2dsphere index is still building or coords out of range
      console.warn("Geospatial index fallback:", geoError.message);
      issues = await Issue.find().populate("reportedBy", "name email city avatar");
    }

    return res.status(200).json({
      success: true,
      count: issues.length,
      issues
    });
  } catch (error) {
    console.error("Get Nearby Issues Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch nearby issues."
    });
  }
};

// @desc    Get currently logged in user's reported issues
// @route   GET /api/issues/my-reports
// @access  Private
export const getMyReports = async (req, res) => {
  try {
    const issues = await Issue.find({ reportedBy: req.user._id })
      .sort({ createdAt: -1 })
      .populate("reportedBy", "name email city avatar");

    return res.status(200).json({
      success: true,
      count: issues.length,
      issues
    });
  } catch (error) {
    console.error("Get My Reports Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch your reports."
    });
  }
};

// @desc    Get single issue by ID
// @route   GET /api/issues/:id
// @access  Public
export const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id).populate(
      "reportedBy",
      "name email city avatar"
    );

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found"
      });
    }

    let isSupportedByMe = false;
    if (req.user) {
      const supportExists = await Support.findOne({
        issueId: issue._id,
        userId: req.user._id
      });
      isSupportedByMe = !!supportExists;
    }

    return res.status(200).json({
      success: true,
      issue,
      isSupportedByMe
    });
  } catch (error) {
    console.error("Get Issue By ID Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch issue details."
    });
  }
};

// @desc    Update issue (including status updates and timeline notifications)
// @route   PUT /api/issues/:id
// @access  Private
export const updateIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found"
      });
    }

    const { status, title, description, category, note } = req.body;
    const prevStatus = issue.status;

    if (title) issue.title = title.trim();
    if (description) issue.description = description.trim();
    if (category && ALLOWED_CATEGORIES.includes(category)) issue.category = category;

    // Handle status change
    if (status && ALLOWED_STATUSES.includes(status) && status !== prevStatus) {
      issue.status = status;

      const nowFormatted = new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit"
      });

      // Update timeline
      const statusIdx = ALLOWED_STATUSES.indexOf(status);
      issue.timeline = issue.timeline.map((step) => {
        const stepIdx = ALLOWED_STATUSES.indexOf(step.status);
        if (stepIdx < statusIdx) {
          return { ...step.toObject(), completed: true };
        } else if (stepIdx === statusIdx) {
          return {
            ...step.toObject(),
            completed: true,
            date: nowFormatted,
            note: note || `Status advanced to ${status}.`
          };
        } else {
          return { ...step.toObject(), completed: false };
        }
      });

      // Generate notification message based on status
      let notifMessage = `Your ${issue.category.toLowerCase()} report status was updated to "${status}".`;
      let notifType = "status_change";

      if (status === "Verified") {
        notifMessage = `Your ${issue.category.toLowerCase()} report has been verified by municipal field inspectors.`;
        notifType = "verified";
      } else if (status === "Assigned") {
        notifMessage = `Your ${issue.category.toLowerCase()} report has been assigned to the civic repair department.`;
        notifType = "assigned";
      } else if (status === "In Progress") {
        notifMessage = `Your report is now In Progress. Maintenance crews are addressing the problem.`;
        notifType = "in_progress";
      } else if (status === "Resolved") {
        notifMessage = `Your reported issue has been resolved! Thank you for improving our community.`;
        notifType = "resolved";
      }

      // Create notification for the reporter
      if (issue.reportedBy) {
        await Notification.create({
          userId: issue.reportedBy,
          issueId: issue._id,
          type: notifType,
          title: `Status: ${status}`,
          category: issue.category,
          message: notifMessage
        });
      }
    }

    issue.updatedAt = Date.now();
    const updatedIssue = await issue.save();

    return res.status(200).json({
      success: true,
      message: "Issue updated successfully",
      issue: updatedIssue
    });
  } catch (error) {
    console.error("Update Issue Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update issue."
    });
  }
};

// @desc    Delete issue
// @route   DELETE /api/issues/:id
// @access  Private
export const deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found"
      });
    }

    // Check ownership or admin
    if (
      issue.reportedBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this issue"
      });
    }

    await Issue.findByIdAndDelete(req.params.id);
    await Support.deleteMany({ issueId: req.params.id });

    return res.status(200).json({
      success: true,
      message: "Issue deleted successfully"
    });
  } catch (error) {
    console.error("Delete Issue Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete issue."
    });
  }
};

// @desc    Get dashboard statistics from real MongoDB counts
// @route   GET /api/dashboard/stats
// @access  Public
export const getDashboardStats = async (req, res) => {
  try {
    const [totalIssues, resolvedIssues, totalUsers] = await Promise.all([
      Issue.countDocuments(),
      Issue.countDocuments({ status: "Resolved" }),
      User.countDocuments()
    ]);

    const activeIssues = totalIssues - resolvedIssues;

    return res.status(200).json({
      success: true,
      stats: {
        totalIssues,
        resolvedIssues,
        activeIssues,
        totalUsers: Math.max(totalUsers, 1)
      }
    });
  } catch (error) {
    console.error("Get Dashboard Stats Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch dashboard statistics."
    });
  }
};
