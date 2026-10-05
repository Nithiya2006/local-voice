import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useIssues } from "../context/IssueContext";
import { useAuth } from "../context/AuthContext";
import {
  Camera,
  Upload,
  MapPin,
  CheckCircle2,
  AlertCircle,
  X,
  Trash2,
  Image as ImageIcon,
  ArrowRight,
  Info
} from "lucide-react";
import Button from "../components/Button";
import LocationButton from "../components/LocationButton";
import LocationMap from "../components/LocationMap";
import { CATEGORIES } from "../data/mockIssues";
import { formatCoordinates } from "../utils/location";

const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const ReportIssue = () => {
  const { userLocation, addReport } = useIssues();
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [category, setCategory] = useState("Pothole");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [fileMeta, setFileMeta] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [customLocation, setCustomLocation] = useState({
    latitude: userLocation.latitude,
    longitude: userLocation.longitude
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);

  // File processing and validation helper (JPG/PNG/WebP, max 5MB)
  const processFile = (file) => {
    if (!file) return;

    // Validate type
    const validMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    const validExtension = /\.(jpe?g|png|webp)$/i.test(file.name);
    if (!validMimeTypes.includes(file.type) && !validExtension) {
      setErrors((prev) => ({
        ...prev,
        image: "Unsupported file format. Please upload a JPG, PNG, or WebP image."
      }));
      return;
    }

    // Validate size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setErrors((prev) => ({
        ...prev,
        image: `Image exceeds 5MB limit (${formatFileSize(file.size)}). Please choose a smaller photo.`
      }));
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setFileMeta({
        name: file.name,
        size: file.size,
        sizeFormatted: formatFileSize(file.size),
        type: file.type
      });
      setErrors((prev) => ({ ...prev, image: "" }));
    };
    reader.readAsDataURL(file);
  };

  // Drag & Drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // File picker change handler
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Remove photo selection handler
  const handleRemoveImage = () => {
    setImagePreview("");
    setFileMeta(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Map click handler for adjusting pin
  const handleMapPinPicked = (coords) => {
    setCustomLocation({
      latitude: coords.latitude,
      longitude: coords.longitude
    });
  };

  const validate = () => {
    const errs = {};
    if (!title.trim()) {
      errs.title = "Please provide an issue title.";
    } else if (title.trim().length < 5) {
      errs.title = "Title should be at least 5 characters.";
    }
    if (!description.trim()) {
      errs.description = "Please describe the problem details.";
    } else if (description.trim().length < 10) {
      errs.description = "Description should be at least 10 characters.";
    }
    if (!category) {
      errs.category = "Please select a category.";
    }
    if (!imagePreview && !selectedFile) {
      errs.image = "Please attach a photo of the problem (JPG, PNG, or WebP up to 5MB).";
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      window.scrollTo({ top: 150, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await addReport({
        title: title.trim(),
        category,
        description: description.trim(),
        address: address.trim() || `${userLocation.name || "Civic Area"}`,
        latitude: customLocation.latitude,
        longitude: customLocation.longitude,
        imageFile: selectedFile,
        image: imagePreview
      });

      setIsSubmitting(false);

      if (res.success) {
        setShowSuccessModal(true);
      } else {
        setErrors((prev) => ({
          ...prev,
          general: res.message || "Failed to submit report. Please check server connection."
        }));
      }
    } catch (err) {
      setIsSubmitting(false);
      setErrors((prev) => ({
        ...prev,
        general: err.message || "Failed to submit report. Please check server connection."
      }));
    }
  };

  return (
    <div className="container-narrow page-content">
      <div style={{ marginBottom: "2rem" }}>
        <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Civic Incident Submission
        </span>
        <h1 style={{ fontSize: "2.25rem", color: "var(--text-dark)", marginTop: "0.25rem" }}>
          Report a Local Problem
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginTop: "0.25rem" }}>
          Submit photos and location details of damaged infrastructure to notify neighbors and municipal repair teams.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Category */}
        <div className="card" style={{ padding: "1.75rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <span style={{ width: "26px", height: "26px", borderRadius: "50%", background: "var(--primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 700 }}>
              1
            </span>
            <h2 style={{ fontSize: "1.2rem", color: "var(--text-dark)" }}>Select Issue Category</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "0.75rem" }}>
            {CATEGORIES.filter((c) => c.id !== "all").map((cat) => {
              const isSelected = category === cat.name;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.name)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "1rem 0.5rem",
                    borderRadius: "var(--radius-md)",
                    border: isSelected ? "2px solid var(--primary)" : "1px solid var(--border-light)",
                    backgroundColor: isSelected ? "var(--primary-light)" : "#ffffff",
                    color: isSelected ? "var(--primary)" : "var(--text-main)",
                    cursor: "pointer",
                    transition: "all var(--transition-fast)"
                  }}
                >
                  <span style={{ fontSize: "1.75rem" }}>{cat.icon}</span>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 700 }}>{cat.name}</span>
                </button>
              );
            })}
          </div>
          {errors.category && <span className="form-error" style={{ marginTop: "0.5rem" }}>{errors.category}</span>}
        </div>

        {/* Step 2 & 3: Title and Description */}
        <div className="card" style={{ padding: "1.75rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
            <span style={{ width: "26px", height: "26px", borderRadius: "50%", background: "var(--primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 700 }}>
              2
            </span>
            <h2 style={{ fontSize: "1.2rem", color: "var(--text-dark)" }}>Problem Details</h2>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="issue-title">
              Issue Title *
            </label>
            <input
              id="issue-title"
              type="text"
              placeholder="e.g. Large pothole near main road or broken water main"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
              }}
              className={`form-control ${errors.title ? "error" : ""}`}
            />
            {errors.title && <span className="form-error">{errors.title}</span>}
            <span className="form-help">Be concise and specific about the hazard.</span>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="issue-description">
              Detailed Description *
            </label>
            <textarea
              id="issue-description"
              rows={4}
              placeholder="Explain how severe the problem is, how long it has been there, and the danger to pedestrians, vehicles, or public safety..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors((prev) => ({ ...prev, description: "" }));
              }}
              className={`form-control ${errors.description ? "error" : ""}`}
            />
            {errors.description && <span className="form-error">{errors.description}</span>}
          </div>
        </div>

        {/* Step 3: Upload Image */}
        <div className="card" style={{ padding: "1.75rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
            <span style={{ width: "26px", height: "26px", borderRadius: "50%", background: "var(--primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 700 }}>
              3
            </span>
            <h2 style={{ fontSize: "1.2rem", color: "var(--text-dark)" }}>Attach Photo Evidence *</h2>
          </div>

          <input
            ref={fileInputRef}
            id="image-file-input"
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />

          {!imagePreview ? (
            <div
              className={`upload-dropzone ${isDragging ? "dragging" : ""} ${errors.image ? "has-error" : ""}`}
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
                <div
                  style={{
                    width: "54px",
                    height: "54px",
                    borderRadius: "50%",
                    backgroundColor: isDragging ? "var(--primary)" : "var(--primary-light)",
                    color: isDragging ? "#ffffff" : "var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all var(--transition-fast)"
                  }}
                >
                  <Upload size={24} />
                </div>
                <div>
                  <strong style={{ color: "var(--text-dark)", fontSize: "0.975rem", display: "block" }}>
                    {isDragging ? "Drop your photo right here" : "Click to browse or drag-and-drop a photo"}
                  </strong>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem", marginTop: "4px" }}>
                    Supports JPG, PNG, or WebP up to 5MB
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="upload-preview-card">
              <div className="upload-preview-media">
                <img src={imagePreview} alt="Attached incident photo" />
              </div>

              <div className="upload-preview-meta">
                <div className="upload-file-details">
                  <div className="upload-file-icon-wrap">
                    <ImageIcon size={18} />
                  </div>
                  <div>
                    <div className="upload-file-name" title={fileMeta?.name || "Incident Photo"}>
                      {fileMeta?.name || "Attached Photo"}
                    </div>
                    {fileMeta?.sizeFormatted && (
                      <span className="upload-file-size">
                        {fileMeta.sizeFormatted}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="upload-remove-btn"
                  title="Remove photo"
                >
                  <Trash2 size={14} />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          )}

          {errors.image && (
            <span className="form-error" style={{ marginTop: "0.75rem", display: "block" }}>
              {errors.image}
            </span>
          )}
        </div>

        {/* Step 4: Location */}
        <div className="card" style={{ padding: "1.75rem", marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
            <span style={{ width: "26px", height: "26px", borderRadius: "50%", background: "var(--primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 700 }}>
              4
            </span>
            <h2 style={{ fontSize: "1.2rem", color: "var(--text-dark)" }}>Pinpoint Location</h2>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="landmark-address">
              Street Address / Landmark
            </label>
            <input
              id="landmark-address"
              type="text"
              placeholder="e.g. Near 4th Main Crossing, in front of Metro gate 2"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="form-control"
            />
            <span className="form-help">Helps maintenance crews locate the exact problem spot.</span>
          </div>

          <div style={{ margin: "1.25rem 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-dark)" }}>
                GPS Coordinates
              </span>
              <LocationButton
                variant="outline"
                onLocationSelect={(loc) => {
                  setCustomLocation({
                    latitude: loc.latitude,
                    longitude: loc.longitude
                  });
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.5rem",
                padding: "0.75rem 1rem",
                backgroundColor: "var(--bg-subtle)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-light)",
                fontSize: "0.875rem",
                marginBottom: "1rem"
              }}
            >
              <div>
                <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>LATITUDE: </span>
                <strong>{customLocation.latitude.toFixed(5)}</strong>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>LONGITUDE: </span>
                <strong>{customLocation.longitude.toFixed(5)}</strong>
              </div>
            </div>

            <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <Info size={14} color="#2563eb" />
              <span>Click anywhere on the map to adjust the pin directly over the problem.</span>
            </div>

            <div style={{ height: "280px", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
              <LocationMap
                center={[customLocation.latitude, customLocation.longitude]}
                zoom={15}
                isPicker={true}
                selectedLocation={customLocation}
                onLocationPicked={handleMapPinPicked}
                height="280px"
              />
            </div>
          </div>
        </div>

        {/* Step 6: Submit */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate("/home")}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isSubmitting}
            icon={ArrowRight}
            iconPosition="right"
          >
            Submit Report
          </Button>
        </div>
      </form>

      {/* Success Modal */}
      {showSuccessModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem"
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "var(--radius-xl)",
              padding: "2.5rem 2rem",
              width: "100%",
              maxWidth: "480px",
              textAlign: "center",
              boxShadow: "var(--shadow-xl)"
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                backgroundColor: "#dcfce7",
                color: "#16a34a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.25rem"
              }}
            >
              <CheckCircle2 size={36} />
            </div>

            <h3 style={{ fontSize: "1.5rem", color: "var(--text-dark)", marginBottom: "0.5rem" }}>
              Report Submitted!
            </h3>

            <p style={{ color: "var(--text-muted)", fontSize: "0.9375rem", lineHeight: 1.5, marginBottom: "1.75rem" }}>
              Your issue <strong>"{title}"</strong> has been logged with live GPS coordinates and saved to your records. Nearby community members will now be notified to co-sign.
            </p>

            <Button
              variant="primary"
              size="lg"
              style={{ width: "100%" }}
              onClick={() => {
                setShowSuccessModal(false);
                navigate("/my-reports");
              }}
            >
              Go to My Reports →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportIssue;
