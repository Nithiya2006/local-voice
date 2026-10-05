import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useIssues } from "../context/IssueContext";
import { Search, ArrowUpDown } from "lucide-react";
import LocationMap from "../components/LocationMap";
import LocationButton from "../components/LocationButton";
import IssueCard from "../components/IssueCard";
import EmptyState from "../components/EmptyState";
import { CATEGORIES } from "../data/mockIssues";

const NearbyIssues = () => {
  const { issues, userLocation, getIssueDistance } = useIssues();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const selectedCategory = searchParams.get("category") || "all";
  const [sortBy, setSortBy] = useState("nearest"); // 'nearest' | 'most_supported' | 'recent'
  const [viewMode, setViewMode] = useState("both"); // 'both' | 'map' | 'grid'

  const handleCategorySelect = (catName) => {
    if (catName === "all") {
      searchParams.delete("category");
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: catName });
    }
  };

  // Filtered & Sorted issues
  const filteredIssues = useMemo(() => {
    return issues
      .filter((issue) => {
        // Category filter
        if (selectedCategory !== "all") {
          const match =
            issue.category.toLowerCase() === selectedCategory.toLowerCase() ||
            (selectedCategory === "Water" && issue.category === "Water Leakage") ||
            (selectedCategory === "Roads" && issue.category === "Road Damage") ||
            (selectedCategory === "Traffic" && issue.category === "Traffic Signal");
          if (!match) return false;
        }

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = issue.title.toLowerCase().includes(q);
          const matchDesc = issue.description.toLowerCase().includes(q);
          const matchAddr = (issue.address || "").toLowerCase().includes(q);
          const matchCat = issue.category.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchAddr && !matchCat) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "nearest") {
          const distA = getIssueDistance(a) ?? 99999;
          const distB = getIssueDistance(b) ?? 99999;
          return distA - distB;
        } else if (sortBy === "most_supported") {
          return (b.supportCount || 0) - (a.supportCount || 0);
        } else if (sortBy === "recent") {
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }
        return 0;
      });
  }, [issues, selectedCategory, searchQuery, sortBy, getIssueDistance]);

  return (
    <div className="container page-content">
      {/* Top Header & Location Bar */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
          <div>
            <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Community Map & Feed
            </span>
            <h1 style={{ fontSize: "2.25rem", color: "var(--text-dark)", marginTop: "0.25rem" }}>
              Issues Near You
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginTop: "0.25rem" }}>
              Viewing problems reported within your vicinity in <strong>{userLocation?.name || "Active Area"}</strong>.
            </p>
          </div>

          <LocationButton variant="secondary" />
        </div>

        {/* Interactive Map Showcase */}
        {(viewMode === "both" || viewMode === "map") && (
          <div style={{ marginBottom: "2rem" }}>
            <LocationMap
              center={[userLocation.latitude, userLocation.longitude]}
              userLocation={userLocation}
              issues={filteredIssues}
              height="400px"
              zoom={13}
            />
          </div>
        )}
      </div>

      {/* Search, Category Filters & Sort Controls */}
      <div className="card" style={{ padding: "1.25rem 1.5rem", marginBottom: "2rem" }}>
        {/* Search Bar + Sort Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: "1rem", alignItems: "center", marginBottom: "1.25rem" }}>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Search by problem title, street name, or landmark..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
              style={{ paddingLeft: "2.5rem" }}
            />
            <Search size={18} style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-light)" }} />
          </div>

          {/* Sort By Dropdown */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <ArrowUpDown size={16} color="#64748b" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-control"
              style={{ width: "auto", padding: "0.65rem 1rem", fontSize: "0.875rem", cursor: "pointer", fontWeight: 600 }}
            >
              <option value="nearest">Sort: Nearest to Me</option>
              <option value="most_supported">Sort: Most Supported</option>
              <option value="recent">Sort: Recently Reported</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div style={{ display: "flex", border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
            <button
              type="button"
              onClick={() => setViewMode("both")}
              style={{
                padding: "0.65rem 0.85rem",
                background: viewMode === "both" ? "var(--primary-light)" : "#ffffff",
                color: viewMode === "both" ? "var(--primary)" : "var(--text-main)",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.8125rem"
              }}
              title="Map & Grid"
            >
              Split View
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              style={{
                padding: "0.65rem 0.85rem",
                background: viewMode === "grid" ? "var(--primary-light)" : "#ffffff",
                color: viewMode === "grid" ? "var(--primary)" : "var(--text-main)",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.8125rem"
              }}
              title="Cards Only"
            >
              Cards
            </button>
            <button
              type="button"
              onClick={() => setViewMode("map")}
              style={{
                padding: "0.65rem 0.85rem",
                background: viewMode === "map" ? "var(--primary-light)" : "#ffffff",
                color: viewMode === "map" ? "var(--primary)" : "var(--text-main)",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.8125rem"
              }}
              title="Map Only"
            >
              Map
            </button>
          </div>
        </div>

        {/* Filter Chips */}
        <div>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
            Filter by Category:
          </div>
          <div className="filter-chips-row" style={{ margin: 0, padding: 0 }}>
            {CATEGORIES.map((cat) => {
              const isActive =
                selectedCategory === cat.name ||
                (selectedCategory === "all" && cat.id === "all") ||
                (selectedCategory === cat.id);

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategorySelect(cat.id === "all" ? "all" : cat.name)}
                  className={`filter-chip ${isActive ? "active" : ""}`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <p style={{ fontSize: "0.9375rem", color: "var(--text-main)" }}>
          Showing <strong>{filteredIssues.length}</strong> {filteredIssues.length === 1 ? "problem" : "problems"}
          {selectedCategory !== "all" && <span> in <strong>{selectedCategory}</strong></span>}
          {searchQuery && <span> matching "<strong>{searchQuery}</strong>"</span>}
        </p>

        {(selectedCategory !== "all" || searchQuery) && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              searchParams.delete("category");
              setSearchParams(searchParams);
            }}
            style={{
              background: "none",
              border: "none",
              color: "var(--primary)",
              fontWeight: 600,
              fontSize: "0.8125rem",
              cursor: "pointer"
            }}
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Issues Grid */}
      {viewMode !== "map" && (
        <>
          {filteredIssues.length > 0 ? (
            <div className="issues-grid">
              {filteredIssues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No issues found matching your filters"
              description="Try adjusting your search query, switching categories, or adjusting your location."
              actionLabel="Reset Filters"
              onAction={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default NearbyIssues;
