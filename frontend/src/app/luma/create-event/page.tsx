"use client";

import { useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Chrome,
  Clock3,
  Copy,
  Fingerprint,
  FileText,
  Globe,
  ImagePlus,
  Link2,
  Mail,
  MapPin,
  ShieldCheck,
  Smartphone,
  SlidersHorizontal,
  Ticket,
  Upload,
  Users,
  X,
} from "lucide-react";

const bg = "linear-gradient(135deg, #0e7678 0%, #1a9a9c 30%, #c8ecec 65%, #ffffff 100%)";
const teal = "#0e7678";
const tealAccent = "#1a9a9c";
const tealSoft = "#5a9a9b";
const dark = "#0a3535";
const muted = "#2d6b6c";

export default function CreateEventLuma() {
  const [showAuth, setShowAuth] = useState(false);

  const authButtons = [
    { icon: <Chrome size={18} strokeWidth={2} color={tealSoft} />, label: "Sign in with Google" },
    { icon: <Fingerprint size={18} strokeWidth={2} color={tealSoft} />, label: "Sign in with Passkey" },
    { icon: <Smartphone size={18} strokeWidth={2} color={tealSoft} />, label: "Use phone number" },
  ];

  const optionRows = [
    { label: "Ticket Price", value: "Free", icon: <Ticket size={16} strokeWidth={2} color={teal} /> },
    { label: "Require Approval", value: "Off", icon: <ShieldCheck size={16} strokeWidth={2} color={teal} /> },
    { label: "Capacity", value: "Unlimited", icon: <Users size={16} strokeWidth={2} color={teal} /> },
  ];

  return (
    <main style={{ minHeight: "100vh", background: bg, fontFamily: "inherit", color: dark }}>
      <style>{`
        * { box-sizing: border-box; }
        input, textarea, button { font-family: inherit; }
        .date-box:hover, .option-row:hover, .input-box:focus-within {
          border-color: ${teal} !important;
          box-shadow: 0 0 0 3px rgba(14,118,120,0.1) !important;
        }
        .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(14,118,120,0.42) !important; }
        .submit-btn:active { transform: translateY(0); }
        .create-btn:hover { background: rgba(255,255,255,0.25) !important; }
      `}</style>

      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 32px", maxWidth: "1080px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <span style={{ fontSize: "1.4rem", fontWeight: 700, color: "#fff", letterSpacing: "0.04em" }}>
            luma<span style={{ opacity: 0.6 }}>*</span>
          </span>
          <nav style={{ display: "flex", gap: "20px" }}>
            {["Events", "Calendars", "Discover"].map((label) => (
              <a key={label} href="#" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontWeight: 600, fontSize: "14px" }}>
                {label}
              </a>
            ))}
          </nav>
        </div>
        <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>4:19 PM GMT+5:30</span>
          <button
            onClick={() => setShowAuth(true)}
            style={{ background: "none", border: "none", color: "rgba(255,255,255,0.9)", fontFamily: "inherit", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}
          >
            Sign In
          </button>
          <button
            className="create-btn"
            style={{ padding: "9px 16px", borderRadius: "10px", border: "1.5px solid rgba(255,255,255,0.45)", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(6px)", color: "#fff", fontFamily: "inherit", fontWeight: 700, fontSize: "14px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px" }}
          >
            Create Event
            <ArrowRight size={14} strokeWidth={2.2} />
          </button>
        </div>
      </header>

      <section style={{ maxWidth: "1080px", margin: "0 auto", padding: "20px 32px 80px", display: "grid", gridTemplateColumns: "0.42fr 0.58fr", gap: "24px", alignItems: "start" }}>
        <div style={{ display: "grid", gap: "16px" }}>
          <div style={{ height: "340px", borderRadius: "20px", background: "linear-gradient(145deg, #0e7678, #1fb8ba, #7ddada, #ffffff)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", boxShadow: "0 20px 48px rgba(14,118,120,0.32)" }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 70% 30%, rgba(255,255,255,0.28) 0%, transparent 60%)" }} />
            <div style={{ width: "82%", height: "82%", borderRadius: "14px", border: "1.5px dashed rgba(255,255,255,0.45)", display: "grid", placeItems: "center", color: "rgba(255,255,255,0.8)" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                <ImagePlus size={48} strokeWidth={1.4} />
                <span style={{ fontSize: "13px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>Upload Cover</span>
              </div>
            </div>
            <button
              type="button"
              aria-label="Upload cover image"
              style={{ position: "absolute", bottom: "14px", right: "14px", width: 38, height: 38, borderRadius: "50%", background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)", border: "none", display: "grid", placeItems: "center", cursor: "pointer", color: "white" }}
            >
              <Upload size={16} strokeWidth={2.2} />
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: "14px", background: "rgba(255,255,255,0.72)", border: "1px solid rgba(14,118,120,0.18)", backdropFilter: "blur(8px)", fontWeight: 700, color: dark, fontSize: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: 28, height: 20, borderRadius: "6px", background: "linear-gradient(90deg, #0e7678, #7ddada)" }} />
              <span>Theme</span>
            </div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
              Ocean Teal
              <ChevronDown size={12} strokeWidth={2.5} color={tealSoft} />
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", borderRadius: "12px", background: "rgba(255,255,255,0.72)", border: "1px solid rgba(14,118,120,0.18)", backdropFilter: "blur(8px)" }}>
            <Link2 size={15} strokeWidth={2} color={tealSoft} />
            <input placeholder="Paste image URL..." style={{ flex: 1, border: "none", background: "transparent", fontFamily: "inherit", fontSize: "13px", color: "#2d6b6c", outline: "none" }} />
            <button type="button" aria-label="Copy image URL" style={{ background: "none", border: "none", cursor: "pointer", color: tealSoft, display: "grid", placeItems: "center" }}>
              <Copy size={15} strokeWidth={2} />
            </button>
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.88)", backdropFilter: "blur(16px)", border: "1px solid rgba(14,118,120,0.14)", borderRadius: "20px", padding: "22px", display: "grid", gap: "16px", boxShadow: "0 20px 48px rgba(14,118,120,0.14)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
            <input placeholder="Event Name" style={{ flex: 1, fontSize: "1.65rem", fontWeight: 700, border: "none", background: "transparent", outline: "none", color: dark }} />
            <button
              type="button"
              style={{ padding: "8px 14px", borderRadius: "10px", border: "1.5px solid rgba(14,118,120,0.18)", background: "rgba(255,255,255,0.9)", color: muted, fontWeight: 700, fontFamily: "inherit", fontSize: "13px", cursor: "pointer", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <Globe size={14} strokeWidth={2} color={tealSoft} />
              Public
              <ChevronDown size={12} strokeWidth={2.5} color={tealSoft} />
            </button>
          </div>

          <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, #b2e0e1, transparent)" }} />

          <div style={{ display: "grid", gap: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, color: muted, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              <CalendarDays size={14} strokeWidth={2.2} color={tealAccent} />
              Date & Time
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {["Start", "End"].map((label) => (
                <div key={label} className="date-box" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "11px 12px", borderRadius: "12px", background: "linear-gradient(135deg, #e8f7f7, #ffffff)", border: "1.5px solid rgba(14,118,120,0.18)", cursor: "pointer", transition: "border-color 0.2s, box-shadow 0.2s" }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: "10px", fontWeight: 700, color: teal, textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "2px" }}>
                      {label}
                    </span>
                    <input type="date" style={{ border: "none", background: "transparent", fontFamily: "inherit", fontWeight: 700, fontSize: "13px", color: dark, outline: "none", width: "100%" }} />
                  </div>
                  <Clock3 size={14} strokeWidth={2} color={tealAccent} />
                  <input type="time" style={{ width: "60px", fontSize: "13px", fontWeight: 700, color: dark, border: "none", background: "transparent", outline: "none" }} />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: "12px", background: "linear-gradient(135deg, #e0f4f4, #f5fcfc)", border: "1.5px solid rgba(14,118,120,0.18)", fontSize: "13px", color: muted, fontWeight: 600 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Globe size={14} strokeWidth={2} color={tealAccent} />
                GMT+05:30 - Calcutta
              </div>
              <ChevronDown size={12} strokeWidth={2.5} color={tealSoft} />
            </div>
          </div>

          <div style={{ display: "grid", gap: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, color: muted, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              <MapPin size={14} strokeWidth={2.2} color={tealAccent} />
              Event Location
            </div>
            <div className="input-box" style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "12px 14px", borderRadius: "12px", background: "linear-gradient(135deg, #e8f7f7, #ffffff)", border: "1.5px solid rgba(14,118,120,0.18)", transition: "border-color 0.2s, box-shadow 0.2s" }}>
              <MapPin size={15} strokeWidth={2} color={tealSoft} style={{ marginTop: "2px", flexShrink: 0 }} />
              <input placeholder="Offline location or virtual link" style={{ flex: 1, border: "none", background: "transparent", fontFamily: "inherit", fontSize: "14px", color: dark, outline: "none" }} />
            </div>
          </div>

          <div style={{ display: "grid", gap: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, color: muted, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              <FileText size={14} strokeWidth={2.2} color={tealAccent} />
              Description
            </div>
            <div className="input-box" style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "12px 14px", borderRadius: "12px", background: "linear-gradient(135deg, #e8f7f7, #ffffff)", border: "1.5px solid rgba(14,118,120,0.18)", transition: "border-color 0.2s, box-shadow 0.2s" }}>
              <FileText size={15} strokeWidth={2} color={tealSoft} style={{ marginTop: "3px", flexShrink: 0 }} />
              <textarea rows={3} placeholder="Tell guests what makes this gathering special..." style={{ flex: 1, border: "none", background: "transparent", fontFamily: "inherit", fontSize: "14px", color: dark, outline: "none", resize: "vertical" }} />
            </div>
          </div>

          <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, #b2e0e1, transparent)" }} />

          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 800, color: dark, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.08em", paddingBottom: "4px", borderBottom: "2px solid #b2e0e1" }}>
            <SlidersHorizontal size={13} strokeWidth={2.5} color={teal} />
            Event Options
          </div>

          <div style={{ display: "grid", gap: "10px" }}>
            {optionRows.map((item) => (
              <div key={item.label} className="option-row" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 14px", borderRadius: "12px", background: "linear-gradient(135deg, #e8f7f7, #ffffff)", border: "1.5px solid rgba(14,118,120,0.18)", fontSize: "14px", color: dark, fontWeight: 600, cursor: "pointer", transition: "border-color 0.2s, box-shadow 0.2s" }}>
                {item.icon}
                <span style={{ flex: 1 }}>{item.label}</span>
                <span style={{ color: teal, fontWeight: 700, fontSize: "13px" }}>{item.value}</span>
              </div>
            ))}
          </div>

          <button
            className="submit-btn"
            style={{ marginTop: "4px", padding: "15px", borderRadius: "14px", border: "none", background: "linear-gradient(135deg, #0e7678, #1fb8ba)", color: "#fff", fontFamily: "inherit", fontWeight: 800, fontSize: "1rem", cursor: "pointer", letterSpacing: "0.04em", boxShadow: "0 8px 24px rgba(14,118,120,0.35)", transition: "transform 0.15s, box-shadow 0.15s", position: "relative", overflow: "hidden", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
          >
            <span style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,255,255,0.15), transparent)", pointerEvents: "none" }} />
            <span style={{ position: "relative", zIndex: 1 }}>Create Event</span>
            <ArrowRight size={16} strokeWidth={2.2} style={{ position: "relative", zIndex: 1 }} />
          </button>
        </div>
      </section>

      {showAuth && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", display: "grid", placeItems: "center", zIndex: 20, backdropFilter: "blur(4px)" }}>
          <div style={{ width: "420px", borderRadius: "20px", background: "#fff", boxShadow: "0 24px 56px rgba(14,118,120,0.22)", padding: "26px", position: "relative" }}>
            <button
              type="button"
              aria-label="Close sign-in modal"
              onClick={() => setShowAuth(false)}
              style={{ position: "absolute", top: 14, right: 14, border: "none", background: "transparent", cursor: "pointer", color: tealSoft }}
            >
              <X size={18} strokeWidth={2.5} />
            </button>
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "1.2rem", fontWeight: 700, color: dark, marginBottom: "6px" }}>Welcome to Luma</div>
              <div style={{ color: tealSoft, fontSize: "0.95rem" }}>Please sign in or sign up below.</div>
            </div>
            <div style={{ display: "grid", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontWeight: 700, color: muted, fontSize: "13px", marginBottom: "6px" }}>Email</label>
                <div style={{ display: "flex", alignItems: "center", borderRadius: "12px", border: "1.5px solid rgba(14,118,120,0.2)", background: "linear-gradient(135deg, #e8f7f7, #fff)", padding: "11px 14px", gap: "10px" }}>
                  <Mail size={16} strokeWidth={2} color={tealSoft} />
                  <input placeholder="you@email.com" style={{ border: "none", background: "transparent", width: "100%", fontFamily: "inherit", fontSize: "14px", outline: "none", color: dark }} />
                </div>
              </div>
              <button
                type="button"
                style={{ padding: "13px", borderRadius: "12px", background: "linear-gradient(135deg, #0e7678, #1fb8ba)", color: "#fff", fontWeight: 800, fontFamily: "inherit", border: "none", cursor: "pointer", fontSize: "14px", letterSpacing: "0.03em" }}
              >
                Continue with Email
              </button>
              {authButtons.map((btn) => (
                <button
                  key={btn.label}
                  type="button"
                  style={{ padding: "12px 14px", borderRadius: "12px", background: "#fff", border: "1.5px solid rgba(14,118,120,0.18)", display: "flex", alignItems: "center", gap: "12px", fontWeight: 700, fontFamily: "inherit", fontSize: "14px", cursor: "pointer", color: dark }}
                >
                  {btn.icon} {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
