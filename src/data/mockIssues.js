// LocalVoice Mock Issues Dataset
// Structured to easily map to a MongoDB/Express Issue Schema in future backend expansion

export const CATEGORIES = [
  { id: "all", name: "All Issues", icon: "🌐" },
  { id: "Pothole", name: "Potholes", icon: "🕳️", description: "Deep road craters and asphalt collapse" },
  { id: "Streetlight", name: "Streetlights", icon: "💡", description: "Dark roads, flickering or broken lamps" },
  { id: "Garbage", name: "Garbage", icon: "🗑️", description: "Overflowing dumpsters and uncollected waste" },
  { id: "Water Leakage", name: "Water Leakage", icon: "🚰", description: "Burst civic pipelines and flooding valves" },
  { id: "Road Damage", name: "Road Damage", icon: "🛣️", description: "Cracked pavement, sinkholes and eroded tarmac" },
  { id: "Traffic Signal", name: "Traffic Signals", icon: "🚦", description: "Malfunctioning lights and blind intersections" },
  { id: "Fallen Tree", name: "Fallen Trees", icon: "🌳", description: "Blocked lanes, broken branches and hazard trunks" },
  { id: "Infrastructure", name: "Infrastructure", icon: "🚧", description: "Broken guardrails, missing manholes, collapsed signs" }
];

export const STATUS_STEPS = ["Reported", "Verified", "Assigned", "In Progress", "Resolved"];

export const STATUS_CONFIG = {
  Reported: { label: "Reported", color: "#F59E0B", bg: "#FEF3C7", text: "#92400E" },
  Verified: { label: "Verified", color: "#2563EB", bg: "#DBEAFE", text: "#1E40AF" },
  Assigned: { label: "Assigned", color: "#8B5CF6", bg: "#EDE9FE", text: "#5B21B6" },
  "In Progress": { label: "In Progress", color: "#F97316", bg: "#FFEDD5", text: "#9A3412" },
  Resolved: { label: "Resolved", color: "#16A34A", bg: "#DCFCE7", text: "#15803D" }
};

// Default center: Civic Metro Hub (can dynamically offset to user GPS on demand)
export const DEFAULT_COORDINATES = {
  latitude: 13.0827,
  longitude: 80.2707,
  areaName: "Central Metro Civic Zone"
};

export const INITIAL_MOCK_ISSUES = [
  {
    id: "iss-101",
    title: "Hazardous Deep Pothole on 4th Main Crossroad",
    category: "Pothole",
    description: "A wide and deep crater has formed in the middle of the busy two-wheeler lane following heavy monsoon rain. Multiple cyclists have swerved dangerously into oncoming traffic.",
    latitude: 13.0852,
    longitude: 80.2735,
    address: "Opposite Grand Metro Station, 4th Main Rd",
    area: "Central Metro",
    status: "In Progress",
    supportCount: 42,
    reportedAt: "3 hours ago",
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    reportedBy: "Alex Morgan",
    reporterRole: "Community Member",
    isUserReport: true,
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
    id: "iss-102",
    title: "Broken High-Intensity Streetlight on School Walkway",
    category: "Streetlight",
    description: "Three consecutive street poles have been completely dark for over a week along the pedestrian pathway used by evening tutoring students and elderly residents.",
    latitude: 13.0795,
    longitude: 80.2681,
    address: "St. Jude Public School Lane, Sector 3",
    area: "West Parkside",
    status: "Assigned",
    supportCount: 31,
    reportedAt: "5 hours ago",
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    reportedBy: "David Chen",
    reporterRole: "Local Resident",
    isUserReport: false,
    image: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80",
    timeline: [
      { status: "Reported", date: "Sep 29, 2026, 07:15 AM", completed: true, note: "Reported with photos of blackened light fixture." },
      { status: "Verified", date: "Sep 29, 2026, 10:20 AM", completed: true, note: "Confirmed blown transformer fuse on line 12." },
      { status: "Assigned", date: "Sep 30, 2026, 09:00 AM", completed: true, note: "Assigned to Municipal Electrical Division B." },
      { status: "In Progress", date: null, completed: false, note: "Technicians awaiting replacement ballast." },
      { status: "Resolved", date: null, completed: false, note: "Final illumination testing." }
    ]
  },
  {
    id: "iss-103",
    title: "Overflowing Garbage Container Blocking Footpath",
    category: "Garbage",
    description: "Solid municipal waste has been piling up beside the market entrance without clearing for 48 hours. Stray animals are scattering plastic and food onto the road.",
    latitude: 13.0881,
    longitude: 80.2654,
    address: "Market Square & Vegetable Bazaar Junction",
    area: "Bazaar Ward",
    status: "Verified",
    supportCount: 56,
    reportedAt: "8 hours ago",
    createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    reportedBy: "Priya Sharma",
    reporterRole: "Shop Owners Representative",
    isUserReport: false,
    image: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80",
    timeline: [
      { status: "Reported", date: "Sep 29, 2026, 04:30 AM", completed: true, note: "Initial alert registered by neighborhood watch." },
      { status: "Verified", date: "Sep 29, 2026, 08:00 AM", completed: true, note: "Health and Sanitation officer notified of public health risk." },
      { status: "Assigned", date: null, completed: false, note: "Special sanitation truck assignment in queue." },
      { status: "In Progress", date: null, completed: false, note: "Compactor deployment." },
      { status: "Resolved", date: null, completed: false, note: "Bin sanitized and area cleared." }
    ]
  },
  {
    id: "iss-104",
    title: "Major Drinking Water Pipeline Rupture & Wastage",
    category: "Water Leakage",
    description: "High pressure municipal clean water main line cracked beneath sidewalk paving. Thousands of gallons of potable water are flowing down the gutter and eroding soil.",
    latitude: 13.0762,
    longitude: 80.2748,
    address: "Block 14, Sunrise Boulevard",
    area: "Sunrise Park",
    status: "Reported",
    supportCount: 19,
    reportedAt: "1 hour ago",
    createdAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    reportedBy: "Alex Morgan",
    reporterRole: "Community Member",
    isUserReport: true,
    image: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80",
    timeline: [
      { status: "Reported", date: "Sep 30, 2026, 02:00 PM", completed: true, note: "Urgent citizen report with video clip." },
      { status: "Verified", date: null, completed: false, note: "Valve inspection crew dispatched." },
      { status: "Assigned", date: null, completed: false, note: "Water Supply & Sewerage Board assignment." },
      { status: "In Progress", date: null, completed: false, note: "Pipe isolation and welding." },
      { status: "Resolved", date: null, completed: false, note: "Restoration of water pressure." }
    ]
  },
  {
    id: "iss-105",
    title: "Broken Pedestrian Traffic Light Stuck on Red",
    category: "Traffic Signal",
    description: "The pedestrian crossing signal button is jammed and lights blink simultaneously. School children and elders cannot safely cross during peak rush hours.",
    latitude: 13.0845,
    longitude: 80.2612,
    address: "Civic Hospital Gate No. 2, Ring Road",
    area: "Medical District",
    status: "Resolved",
    supportCount: 68,
    reportedAt: "2 days ago",
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    reportedBy: "Dr. Ronald Wright",
    reporterRole: "Resident Doctor",
    isUserReport: false,
    image: "https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=800&q=80",
    timeline: [
      { status: "Reported", date: "Sep 28, 2026, 08:30 AM", completed: true, note: "Traffic disruption logged." },
      { status: "Verified", date: "Sep 28, 2026, 09:15 AM", completed: true, note: "Traffic police post confirmed synchronization board failure." },
      { status: "Assigned", date: "Sep 28, 2026, 11:00 AM", completed: true, note: "Electronics signal team dispatched." },
      { status: "In Progress", date: "Sep 28, 2026, 01:30 PM", completed: true, note: "Controller unit replaced." },
      { status: "Resolved", date: "Sep 28, 2026, 04:00 PM", completed: true, note: "Signal cycle tested and restored to automated sync." }
    ]
  },
  {
    id: "iss-106",
    title: "Fallen Banyan Tree Branch Crushing Power Cable",
    category: "Fallen Tree",
    description: "Severe thunderstorm winds cracked a large heavy branch that is now resting precariously on live overhead electrical cables. Urgent clearing needed before it snaps lines.",
    latitude: 13.0894,
    longitude: 80.2789,
    address: "Lakeview Avenue, Corner of 9th Cross",
    area: "Lakeview Enclave",
    status: "In Progress",
    supportCount: 45,
    reportedAt: "4 hours ago",
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    reportedBy: "Meera Nair",
    reporterRole: "Community Volunteer",
    isUserReport: false,
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
    timeline: [
      { status: "Reported", date: "Sep 30, 2026, 11:00 AM", completed: true, note: "Hazard alert escalated to disaster helpline." },
      { status: "Verified", date: "Sep 30, 2026, 11:30 AM", completed: true, note: "Power grid safety officer isolated branch sector." },
      { status: "Assigned", date: "Sep 30, 2026, 12:15 PM", completed: true, note: "Forestry & Electrical joint team mobilised." },
      { status: "In Progress", date: "Sep 30, 2026, 01:00 PM", completed: true, note: "Hydraulic crane pruning in progress." },
      { status: "Resolved", date: null, completed: false, note: "Line testing and debris clearance." }
    ]
  },
  {
    id: "iss-107",
    title: "Missing Storm Drain Manhole Cover on Promenade",
    category: "Infrastructure",
    description: "An open 4-foot deep storm chamber cover is missing without any safety barriers or warning cones. Serious risk to night joggers and baby strollers.",
    latitude: 13.0811,
    longitude: 80.2635,
    address: "Marina Promenade Jogging Track, Bay 4",
    area: "Promenade",
    status: "Reported",
    supportCount: 38,
    reportedAt: "6 hours ago",
    createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    reportedBy: "Arun Varma",
    reporterRole: "Citizen Jogger",
    isUserReport: false,
    image: "https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=800&q=80",
    timeline: [
      { status: "Reported", date: "Sep 30, 2026, 09:10 AM", completed: true, note: "Emergency report filed." },
      { status: "Verified", date: null, completed: false, note: "Awaiting field inspector." },
      { status: "Assigned", date: null, completed: false, note: "Drainage maintenance wing." },
      { status: "In Progress", date: null, completed: false, note: "Cover installation." },
      { status: "Resolved", date: null, completed: false, note: "Safety inspection." }
    ]
  },
  {
    id: "iss-108",
    title: "Severely Cracked Tarmac with Gravel Slippage",
    category: "Road Damage",
    description: "Underground culvert settling has caused a 20-meter stretch of road to subside unevenly, leaving sharp ridges and loose stones that cause vehicle skidding.",
    latitude: 13.0788,
    longitude: 80.2795,
    address: "South Canal Expressway, Km Marker 4.2",
    area: "Canal Link",
    status: "Verified",
    supportCount: 22,
    reportedAt: "12 hours ago",
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    reportedBy: "Sunita Roy",
    reporterRole: "Commuter",
    isUserReport: false,
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
    timeline: [
      { status: "Reported", date: "Sep 29, 2026, 11:00 PM", completed: true, note: "Night commuter flagged severe bumps." },
      { status: "Verified", date: "Sep 30, 2026, 07:45 AM", completed: true, note: "Subsurface compaction damage confirmed." },
      { status: "Assigned", date: null, completed: false, note: "Highways asphalt resurfacing division." },
      { status: "In Progress", date: null, completed: false, note: "Milling and leveling machine." },
      { status: "Resolved", date: null, completed: false, note: "Quality certificate issuance." }
    ]
  }
];
