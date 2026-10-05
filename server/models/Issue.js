import mongoose from "mongoose";

export const ALLOWED_CATEGORIES = [
  "Pothole",
  "Streetlight",
  "Garbage",
  "Water Leakage",
  "Road Damage",
  "Traffic Signal",
  "Fallen Tree",
  "Infrastructure",
  "Other"
];

export const ALLOWED_STATUSES = [
  "Reported",
  "Verified",
  "Assigned",
  "In Progress",
  "Resolved"
];

const timelineStepSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ALLOWED_STATUSES,
      required: true
    },
    date: {
      type: String,
      default: null
    },
    completed: {
      type: Boolean,
      default: false
    },
    note: {
      type: String,
      default: ""
    }
  },
  { _id: false }
);

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: ALLOWED_CATEGORIES,
        message: "{VALUE} is not a valid category"
      }
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true
    },
    image: {
      type: String,
      default: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80"
    },
    latitude: {
      type: Number,
      required: [true, "Latitude is required"]
    },
    longitude: {
      type: Number,
      required: [true, "Longitude is required"]
    },
    // GeoJSON format for MongoDB geospatial $near queries: [longitude, latitude]
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true
      }
    },
    locationName: {
      type: String,
      trim: true,
      default: "Civic Zone Area"
    },
    address: {
      type: String,
      trim: true,
      default: ""
    },
    area: {
      type: String,
      trim: true,
      default: ""
    },
    status: {
      type: String,
      enum: ALLOWED_STATUSES,
      default: "Reported"
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    reporterName: {
      type: String,
      default: "Citizen Reporter"
    },
    reporterRole: {
      type: String,
      default: "Community Member"
    },
    supportCount: {
      type: Number,
      default: 0,
      min: 0
    },
    timeline: {
      type: [timelineStepSchema],
      default: function () {
        const nowFormatted = new Date().toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit"
        });
        return [
          {
            status: "Reported",
            date: nowFormatted,
            completed: true,
            note: "Issue report submitted with GPS location."
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
        ];
      }
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

// Auto-sync GeoJSON location coordinates on save
issueSchema.pre("validate", function (next) {
  if (this.latitude !== undefined && this.longitude !== undefined) {
    this.location = {
      type: "Point",
      coordinates: [Number(this.longitude), Number(this.latitude)]
    };
  }
  if (!this.address && this.locationName) {
    this.address = this.locationName;
  }
  next();
});

// Create 2dsphere index for geospatial queries
issueSchema.index({ location: "2dsphere" });
issueSchema.index({ category: 1 });
issueSchema.index({ status: 1 });
issueSchema.index({ reportedBy: 1 });
issueSchema.index({ createdAt: -1 });

const Issue = mongoose.model("Issue", issueSchema);

export default Issue;
