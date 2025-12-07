export default function NotFoundPage() {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "radial-gradient(circle at top, #1a1a2e, #0f0f17)",
          color: "#e5e5e5",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "80px",
            fontWeight: "bold",
            background: "linear-gradient(90deg, #a855f7, #ec4899)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "10px",
          }}
        >
          404
        </h1>
  
        <h2
          style={{
            fontSize: "24px",
            color: "#d0c8ff",
            marginBottom: "20px",
          }}
        >
          Strona nie została znaleziona
        </h2>
  
        <p style={{ fontSize: "16px", maxWidth: "400px", color: "#bdbdbd" }}>
          Wygląda na to, że ta strona nie istnieje lub została przeniesiona.
        </p>
  
        <a
          href="/"
          style={{
            marginTop: "30px",
            padding: "12px 28px",
            borderRadius: "999px",
            background: "linear-gradient(90deg, #a855f7, #ec4899)",
            color: "#ffffff",
            fontSize: "16px",
            fontWeight: "bold",
            textDecoration: "none",
            transition: "0.3s",
            boxShadow: "0 0 18px rgba(168,85,247,0.4)",
          }}
        >
          Wróć na stronę główną
        </a>
      </div>
    );
  }
  