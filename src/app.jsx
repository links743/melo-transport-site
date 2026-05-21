export default function App() {
  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center", 
      padding: "40px", 
      textAlign: "center", 
      fontFamily: "sans-serif",
      backgroundColor: "#f9fafb"
    }}>
      <h1 style={{ fontSize: "48px", marginBottom: "16px", color: "#111827" }}>
        Melo Transport Services
      </h1>
      <p style={{ fontSize: "18px", color: "#6b7280", marginBottom: "24px" }}>
        Your reliable transport partner
      </p>
      <button 
        style={{
          padding: "12px 24px",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "16px"
        }}
        onClick={() => alert("Contact us!")}
      >
        Get in Touch
      </button>
    </div>
  )
}
