import mongoose from "mongoose";
import User from "../models/User.js";
import Issue from "../models/Issue.js";
import Notification from "../models/Notification.js";
import Support from "../models/Support.js";

const seedInitialData = async () => {
  try {
    const userCount = await User.countDocuments();
    let defaultUser;

    if (userCount === 0) {
      console.log("Seeding default civic demo user...");
      defaultUser = await User.create({
        name: "Alex Morgan",
        email: "alex.morgan@community.org",
        phone: "+1 (555) 349-8201",
        password: "community2026",
        city: "Central Metro Civic Zone",
        role: "citizen",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80"
      });
      console.log("✓ Demo user created: alex.morgan@community.org / community2026");
    } else {
      defaultUser = await User.findOne({ email: "alex.morgan@community.org" });
      if (!defaultUser) {
        defaultUser = await User.findOne();
      }
    }

    const issueCount = await Issue.countDocuments();
    if (issueCount === 0 && defaultUser) {
      console.log("Seeding initial mock issues into MongoDB...");
      const sampleIssues = [
        {
          title: "Hazardous Deep Pothole on 4th Main Crossroad",
          category: "Pothole",
          description: "A wide and deep crater has formed in the middle of the busy two-wheeler lane following heavy monsoon rain. Multiple cyclists have swerved dangerously into oncoming traffic.",
          latitude: 13.0852,
          longitude: 80.2735,
          location: { type: "Point", coordinates: [80.2735, 13.0852] },
          locationName: "Opposite Grand Metro Station, 4th Main Rd",
          address: "Opposite Grand Metro Station, 4th Main Rd",
          area: "Central Metro",
          status: "In Progress",
          supportCount: 42,
          reportedBy: defaultUser._id,
          reporterName: defaultUser.name,
          image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
          timeline: [
            { status: "Reported", date: "Sep 29, 2026, 09:30 AM", completed: true, note: "Citizen report logged with photographic evidence." },
            { status: "Verified", date: "Sep 29, 2026, 11:15 AM", completed: true, note: "Field Inspector #104 verified hazard level as Priority A." },
            { status: "Assigned", date: "Sep 29, 2026, 02:40 PM", completed: true, note: "Dispatched to Central Road Works Asphalt Unit." },
            { status: "In Progress", date: "Sep 30, 2026, 08:00 AM", completed: true, note: "Work crew on site laying sub-base aggregate." },
            { status: "Resolved", date: null, completed: false, note: "Final asphalt seal & inspection pending." }
          ]
        },
        {
          title: "Broken Overhead Streetlight Creating Blind Spot",
          category: "Streetlight",
          description: "High-pressure sodium lamp casing is shattered and dark for 3 blocks along the pedestrian walkway. Poor visibility at night has increased safety concerns for evening commuters.",
          latitude: 13.081,
          longitude: 80.268,
          location: { type: "Point", coordinates: [80.268, 13.081] },
          locationName: "Pillar #42, North Avenue Promenade",
          address: "Pillar #42, North Avenue Promenade",
          area: "North Avenue",
          status: "Verified",
          supportCount: 28,
          reportedBy: defaultUser._id,
          reporterName: defaultUser.name,
          image: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80",
          timeline: [
            { status: "Reported", date: "Oct 01, 2026, 07:15 PM", completed: true, note: "Citizen report logged with GPS coordinates." },
            { status: "Verified", date: "Oct 02, 2026, 10:00 AM", completed: true, note: "Electrical maintenance team confirmed fixture circuit failure." },
            { status: "Assigned", date: null, completed: false, note: "Pending LED fixture replacement schedule." },
            { status: "In Progress", date: null, completed: false, note: "Electrician dispatch scheduled." },
            { status: "Resolved", date: null, completed: false, note: "Illumination testing pending." }
          ]
        },
        {
          title: "Major Mainline Potable Water Pipe Burst",
          category: "Water Leakage",
          description: "Subsurface 12-inch municipal drinking water feeder line ruptured under the asphalt. Clean water is gushing into storm drains causing local low pressure and road erosion.",
          latitude: 13.0895,
          longitude: 80.276,
          location: { type: "Point", coordinates: [80.276, 13.0895] },
          locationName: "Intersection of 2nd Cross & Park Blvd",
          address: "Intersection of 2nd Cross & Park Blvd",
          area: "Greenway Park",
          status: "Assigned",
          supportCount: 65,
          reportedBy: defaultUser._id,
          reporterName: defaultUser.name,
          image: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80",
          timeline: [
            { status: "Reported", date: "Oct 02, 2026, 06:45 AM", completed: true, note: "High-priority burst pipe incident logged." },
            { status: "Verified", date: "Oct 02, 2026, 07:30 AM", completed: true, note: "Emergency water board supervisor visited site." },
            { status: "Assigned", date: "Oct 02, 2026, 08:15 AM", completed: true, note: "Hydraulic repair unit dispatched with heavy excavator." },
            { status: "In Progress", date: null, completed: false, note: "Main valve isolation in progress." },
            { status: "Resolved", date: null, completed: false, note: "Pipe weld & pressure testing pending." }
          ]
        },
        {
          title: "Overflowing Public Waste Dumpster Spilling onto Pavement",
          category: "Garbage",
          description: "Large 4-yard municipal green bin has not been cleared for over four days. Organic waste and plastic trash have overflowed across the pedestrian sidewalk.",
          latitude: 13.078,
          longitude: 80.264,
          location: { type: "Point", coordinates: [80.264, 13.078] },
          locationName: "Commercial Market Complex, Lane 3",
          address: "Commercial Market Complex, Lane 3",
          area: "Market Square",
          status: "Resolved",
          supportCount: 19,
          reportedBy: defaultUser._id,
          reporterName: defaultUser.name,
          image: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80",
          timeline: [
            { status: "Reported", date: "Sep 27, 2026, 08:20 AM", completed: true, note: "Waste overflow report filed." },
            { status: "Verified", date: "Sep 27, 2026, 10:45 AM", completed: true, note: "Sanitation supervisor verified bin status." },
            { status: "Assigned", date: "Sep 27, 2026, 01:10 PM", completed: true, note: "Assigned to Compactor Truck Route #12." },
            { status: "In Progress", date: "Sep 28, 2026, 07:30 AM", completed: true, note: "Sanitation crew cleared dumpster." },
            { status: "Resolved", date: "Sep 28, 2026, 09:15 AM", completed: true, note: "Waste cleared, area disinfected, and bin replaced." }
          ]
        }
      ];

      const createdIssues = await Issue.insertMany(sampleIssues);
      console.log(`✓ Seeded ${createdIssues.length} sample issues.`);

      // Seed initial support records for default user
      for (const iss of createdIssues) {
        await Support.create({
          issueId: iss._id,
          userId: defaultUser._id
        });
      }

      // Seed initial notifications
      await Notification.create({
        userId: defaultUser._id,
        issueId: createdIssues[0]._id,
        type: "in_progress",
        title: "Status: In Progress",
        category: "Pothole",
        message: "Your pothole report on 4th Main Crossroad is now In Progress with the road asphalt crew."
      });
      console.log("✓ Initial notifications and supports seeded.");
    }
  } catch (seedErr) {
    console.warn("Seed Data Notice:", seedErr.message);
  }
};

const connectDB = async () => {
  try {
    const mongoUri =
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/localvoice";

    const conn = await mongoose.connect(mongoUri);

    console.log(`MongoDB connected successfully: ${conn.connection.host}`);
    console.log(`Database name: ${conn.connection.name}`);

    // Seed initial dataset if database is empty
    await seedInitialData();
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error(
      "Please ensure MongoDB is installed and running locally on mongodb://127.0.0.1:27017"
    );
  }
};

export default connectDB;
