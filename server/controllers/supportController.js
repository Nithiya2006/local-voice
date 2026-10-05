import Support from "../models/Support.js";
import Issue from "../models/Issue.js";
import Notification from "../models/Notification.js";

// @desc    Toggle community support on an issue ("I Have the Same Problem")
// @route   POST /api/issues/:id/support
// @access  Private
export const toggleSupport = async (req, res) => {
  try {
    const issueId = req.params.id;
    const userId = req.user._id;

    const issue = await Issue.findById(issueId);
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found"
      });
    }

    // Check if user already supported
    const existingSupport = await Support.findOne({ issueId, userId });

    let supported = false;

    if (existingSupport) {
      // Remove support
      await Support.findByIdAndDelete(existingSupport._id);
      issue.supportCount = Math.max(0, (issue.supportCount || 1) - 1);
      supported = false;
    } else {
      // Add support
      await Support.create({ issueId, userId });
      issue.supportCount = (issue.supportCount || 0) + 1;
      supported = true;

      // Add a confirmation notification
      await Notification.create({
        userId,
        issueId: issue._id,
        type: "support",
        title: "Support Confirmed",
        category: issue.category,
        message: `You supported "${issue.title}". Total community support is now ${issue.supportCount}.`
      });
    }

    await issue.save();

    return res.status(200).json({
      success: true,
      supported,
      supportCount: issue.supportCount,
      message: supported
        ? "You supported this problem. Thank you for making your voice heard!"
        : "Support removed."
    });
  } catch (error) {
    console.error("Toggle Support Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update support status."
    });
  }
};

// @desc    Get all issue IDs supported by currently logged-in user
// @route   GET /api/support/my-supports
// @access  Private
export const getMySupports = async (req, res) => {
  try {
    const supports = await Support.find({ userId: req.user._id }).select("issueId");
    const supportedIssueIds = supports.map((s) => s.issueId.toString());

    return res.status(200).json({
      success: true,
      supportedIssueIds
    });
  } catch (error) {
    console.error("Get My Supports Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch supported issues."
    });
  }
};
