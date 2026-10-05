// LocalVoice Mock Notifications Dataset
// Pre-populated realistic community alerts

export const INITIAL_MOCK_NOTIFICATIONS = [
  {
    id: "notif-1",
    type: "verified",
    title: "Report Verified",
    message: "Your pothole report on 4th Main Crossroad was verified by Ward Inspector #104.",
    time: "15 minutes ago",
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    read: false,
    issueId: "iss-101",
    category: "Pothole",
    icon: "ShieldCheck"
  },
  {
    id: "notif-2",
    type: "support",
    title: "New Community Support",
    message: "5 people supported your report on Drinking Water Pipeline Rupture.",
    time: "45 minutes ago",
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    read: false,
    issueId: "iss-104",
    category: "Water Leakage",
    icon: "ThumbsUp"
  },
  {
    id: "notif-3",
    type: "progress",
    title: "Status Update: In Progress",
    message: "Your reported issue 'Hazardous Deep Pothole on 4th Main' is now In Progress. Work crew is on site.",
    time: "2 hours ago",
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    read: false,
    issueId: "iss-101",
    category: "Pothole",
    icon: "Clock"
  },
  {
    id: "notif-4",
    type: "nearby",
    title: "New Issue Near You",
    message: "A nearby issue 'Broken High-Intensity Streetlight' was reported 0.4 km away from your area.",
    time: "4 hours ago",
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    read: true,
    issueId: "iss-102",
    category: "Streetlight",
    icon: "MapPin"
  },
  {
    id: "notif-5",
    type: "resolved",
    title: "Community Issue Resolved",
    message: "Broken Pedestrian Traffic Light near Civic Hospital was successfully fixed and tested.",
    time: "1 day ago",
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    read: true,
    issueId: "iss-105",
    category: "Traffic Signal",
    icon: "CheckCircle2"
  }
];
