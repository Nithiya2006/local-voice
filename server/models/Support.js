import mongoose from "mongoose";

const supportSchema = new mongoose.Schema(
  {
    issueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      required: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
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

// Prevent the same user from supporting the same issue multiple times
supportSchema.index({ issueId: 1, userId: 1 }, { unique: true });

const Support = mongoose.model("Support", supportSchema);

export default Support;
