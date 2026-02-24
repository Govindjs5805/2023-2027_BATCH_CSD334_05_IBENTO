


{eventData?.documents?.map((doc, index) => (
  <div key={index} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px", borderBottom: "1px solid #ddd" }}>
    <div>
      <p style={{ margin: 0 }}><strong>{doc.type}:</strong> {doc.name}</p>
      <small style={{ color: "#888" }}>{doc.uploadedAt?.toDate().toLocaleDateString()}</small>
    </div>
    <a href={doc.url} target="_blank" rel="noreferrer" style={{ color: "#0d6efd", textDecoration: "none" }}>
      View / Download
    </a>
  </div>
))}