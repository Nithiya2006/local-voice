import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    message: {
      type: String,
      required: [true, "Notification message is required"],
      trim: true
    },
    title: {
      type: String,
      default: "Civic Update",
      trim: true
    },
    type: {
      type: String,
      enum: ["status_change", "verified", "assigned", "in_progress", "resolved", "support", "nearby", "general"],
      default: "general"
    },
    issueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      default: null
    },
    category: {
      type: String,
      default: "General"
    },
    read: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        return ret;
      }
    }
  }
);

notificationSchema.index({ userId: 1, read: 1 });
notificationSchema.index({ createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
