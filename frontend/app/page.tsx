"use client";

import { useState, useEffect } from "react";
import "./globals.css";

export default function Page() {
  const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL!;
  const PROVIDER = process.env.NEXT_PUBLIC_PROVIDER_URL!;

  const [task, setTask] = useState("Generate 3 images of Dhule skyline");
  const [maxUsd, setMaxUsd] = useState(0.05);
  const [out, setOut] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);

  async function refresh() {
    try {
      const r = await fetch(`${BACKEND}/payments`);
      const j = await r.json();
      setPayments(j.payments || []);
      // Simulate balance calculation
      const totalSpent = (j.payments || []).reduce((sum: number, p: any) => sum + (p.total_cost_usd || 0), 0);
      setBalance(1.0 - totalSpent); // Start with $1.00
    } catch (err) {
      console.error("Failed to fetch payments:", err);
    }
  }

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, []);

  async function pay() {
    setOut(null);
    setLoading(true);
    try {
      const r = await fetch(`${BACKEND}/pay-api`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task, max_usd: maxUsd, provider_url: PROVIDER }),
      });
      const j = await r.json();
      setOut(j);
      setTimeout(refresh, 1000);
    } catch (err) {
      setOut({ ok: false, error: String(err) });
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleString("en-US", { 
      month: "short", 
      day: "numeric", 
      hour: "2-digit", 
      minute: "2-digit" 
    });
  };

  const truncateHash = (hash: string) => {
    if (!hash) return "";
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom, #0f0c29, #302b63, #24243e)", position: "relative", overflow: "hidden" }}>
      {/* Animated background elements */}
      <div style={{
        position: "absolute",
        top: "-50%",
        right: "-20%",
        width: "800px",
        height: "800px",
        background: "radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%)",
        borderRadius: "50%",
        animation: "float 15s ease-in-out infinite",
        zIndex: 0
      }} />
      <div style={{
        position: "absolute",
        bottom: "-30%",
        left: "-10%",
        width: "600px",
        height: "600px",
        background: "radial-gradient(circle, rgba(118, 75, 162, 0.3) 0%, transparent 70%)",
        borderRadius: "50%",
        animation: "float 12s ease-in-out infinite",
        zIndex: 0
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Hero Section */}
        <section style={{
          padding: "60px 20px",
          textAlign: "center",
          maxWidth: "1200px",
          margin: "0 auto",
        }}>
          <div className="animate-fade-in-up" style={{ animationDelay: "0.1s", opacity: 0 }}>
            {/* Logo */}
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "30px"
            }}>
              <img 
                src="/icon.png" 
                alt="API Wallet Agent Logo" 
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "24px",
                  boxShadow: "0 20px 60px rgba(102, 126, 234, 0.4)",
                  animation: "float 6s ease-in-out infinite",
                  border: "3px solid rgba(102, 126, 234, 0.3)",
                  background: "rgba(255, 255, 255, 0.1)",
                  padding: "10px"
                }}
              />
            </div>

            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              background: "rgba(102, 126, 234, 0.2)",
              padding: "8px 20px",
              borderRadius: "50px",
              marginBottom: "20px",
              border: "1px solid rgba(102, 126, 234, 0.3)"
            }}>
              <span style={{ fontSize: "24px" }}>🚀</span>
              <span style={{ color: "#a5b4fc", fontWeight: 600 }}>Powered by Arc + Circle + Gemini</span>
            </div>
            
            <h1 style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontWeight: 800,
              color: "white",
              margin: "20px 0",
              lineHeight: 1.2,
              fontFamily: "'Poppins', sans-serif",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "15px",
              flexWrap: "wrap"
            }}>
              <span className="gradient-text">API Wallet Agent</span>
              <br style={{ display: "block", width: "100%" }} />
              <span style={{ fontSize: "0.6em", fontWeight: 600, color: "#cbd5e1", width: "100%" }}>
                Real-time USDC Micropayments for AI Services
              </span>
            </h1>
            
            <p style={{
              fontSize: "1.2rem",
              color: "#94a3b8",
              maxWidth: "700px",
              margin: "20px auto",
              lineHeight: 1.6
            }}>
              The future of API payments is here. Pay per request with USDC on Arc blockchain, 
              powered by x402-style web-native micropayments and Gemini AI routing.
            </p>

            {/* Stats Cards */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px",
              maxWidth: "800px",
              margin: "40px auto"
            }}>
              <div className="card-hover glass-effect" style={{
                padding: "25px",
                borderRadius: "16px",
                textAlign: "center",
              }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>💳</div>
                <div style={{ color: "white", fontSize: "1.8rem", fontWeight: 700, marginBottom: "5px" }}>
                  ${balance !== null ? balance.toFixed(2) : "1.00"}
                </div>
                <div style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Wallet Balance</div>
              </div>
              
              <div className="card-hover glass-effect" style={{
                padding: "25px",
                borderRadius: "16px",
                textAlign: "center",
              }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>⚡</div>
                <div style={{ color: "white", fontSize: "1.8rem", fontWeight: 700, marginBottom: "5px" }}>
                  {payments.length}
                </div>
                <div style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Transactions</div>
              </div>
              
              <div className="card-hover glass-effect" style={{
                padding: "25px",
                borderRadius: "16px",
                textAlign: "center",
              }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>🌐</div>
                <div style={{ color: "white", fontSize: "1.8rem", fontWeight: 700, marginBottom: "5px" }}>
                  x402
                </div>
                <div style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Protocol</div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section style={{
          padding: "40px 20px",
          maxWidth: "1400px",
          margin: "0 auto"
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "30px",
            marginBottom: "40px"
          }}>
            {/* Consumer Agent Card */}
            <div className="card-hover glass-effect animate-slide-in-left" style={{
              padding: "30px",
              borderRadius: "20px",
              opacity: 0,
              animationDelay: "0.3s"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "25px" }}>
                <div style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px"
                }}>
                  🤖
                </div>
                <h2 style={{ color: "white", fontSize: "1.5rem", fontWeight: 700, margin: 0, fontFamily: "'Poppins', sans-serif" }}>
                  Consumer Agent
                </h2>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "#cbd5e1",
                  fontWeight: 600,
                  fontSize: "0.95rem"
                }}>
                  Task Description
                </label>
                <textarea
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "14px",
                    fontSize: "14px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    background: "rgba(255, 255, 255, 0.05)",
                    color: "white",
                    fontFamily: "inherit",
                    resize: "vertical",
                    transition: "all 0.3s ease"
                  }}
                  onFocus={(e) => {
                    e.target.style.border = "1px solid rgba(102, 126, 234, 0.6)";
                    e.target.style.background = "rgba(255, 255, 255, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.border = "1px solid rgba(255, 255, 255, 0.2)";
                    e.target.style.background = "rgba(255, 255, 255, 0.05)";
                  }}
                />
              </div>

              <div style={{ marginBottom: "25px" }}>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "#cbd5e1",
                  fontWeight: 600,
                  fontSize: "0.95rem"
                }}>
                  Max Budget (USD)
                </label>
                <div style={{ position: "relative" }}>
                  <span style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94a3b8",
                    fontSize: "1.2rem",
                    fontWeight: 600
                  }}>$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={maxUsd}
                    onChange={(e) => setMaxUsd(parseFloat(e.target.value))}
                    style={{
                      width: "100%",
                      padding: "14px 14px 14px 35px",
                      fontSize: "16px",
                      borderRadius: "12px",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      background: "rgba(255, 255, 255, 0.05)",
                      color: "white",
                      fontFamily: "inherit",
                      transition: "all 0.3s ease"
                    }}
                    onFocus={(e) => {
                      e.target.style.border = "1px solid rgba(102, 126, 234, 0.6)";
                      e.target.style.background = "rgba(255, 255, 255, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.border = "1px solid rgba(255, 255, 255, 0.2)";
                      e.target.style.background = "rgba(255, 255, 255, 0.05)";
                    }}
                  />
                </div>
              </div>

              <button
                onClick={pay}
                disabled={loading}
                className={loading ? "animate-pulse-slow" : ""}
                style={{
                  width: "100%",
                  padding: "16px",
                  fontSize: "1rem",
                  fontWeight: 600,
                  borderRadius: "12px",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  background: loading
                    ? "rgba(102, 126, 234, 0.5)"
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  transition: "all 0.3s ease",
                  fontFamily: "'Poppins', sans-serif",
                  boxShadow: loading ? "none" : "0 10px 30px rgba(102, 126, 234, 0.4)",
                  transform: loading ? "scale(0.98)" : "scale(1)"
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = "scale(1.02)";
                    e.currentTarget.style.boxShadow = "0 15px 40px rgba(102, 126, 234, 0.5)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 10px 30px rgba(102, 126, 234, 0.4)";
                  }
                }}
              >
                {loading ? (
                  <span>⏳ Processing Payment...</span>
                ) : (
                  <span>💳 Pay + Execute</span>
                )}
              </button>

              {out && (
                <div style={{
                  marginTop: "25px",
                  padding: "20px",
                  borderRadius: "12px",
                  background: out.ok
                    ? "rgba(16, 185, 129, 0.1)"
                    : "rgba(239, 68, 68, 0.1)",
                  border: `1px solid ${out.ok ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
                  animation: "fadeInUp 0.5s ease-out"
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "15px",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    color: out.ok ? "#10b981" : "#ef4444"
                  }}>
                    {out.ok ? "✅ Success" : "❌ Error"}
                  </div>
                  {out.ok && out.receipt && (
                    <div style={{ color: "#cbd5e1", fontSize: "0.9rem", lineHeight: 1.6 }}>
                      <div style={{ marginBottom: "8px" }}>
                        <strong>Provider:</strong> {out.receipt.provider}
                      </div>
                      <div style={{ marginBottom: "8px" }}>
                        <strong>Amount:</strong> ${out.receipt.total_cost_usd} USDC
                      </div>
                      <div style={{ marginBottom: "8px" }}>
                        <strong>Quantity:</strong> {out.receipt.quantity} units
                      </div>
                      {out.receipt.txHash && (
                        <div style={{ marginTop: "12px", padding: "10px", background: "rgba(0, 0, 0, 0.2)", borderRadius: "8px" }}>
                          <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "5px" }}>Transaction Hash:</div>
                          <code style={{ fontSize: "0.8rem", color: "#a5b4fc", wordBreak: "break-all" }}>
                            {out.receipt.txHash}
                          </code>
                        </div>
                      )}
                    </div>
                  )}
                  {out.error && (
                    <div style={{ color: "#fca5a5", fontSize: "0.9rem" }}>{out.error}</div>
                  )}
                </div>
              )}
            </div>

            {/* Payment History Card */}
            <div className="card-hover glass-effect animate-slide-in-right" style={{
              padding: "30px",
              borderRadius: "20px",
              opacity: 0,
              animationDelay: "0.4s",
              maxHeight: "800px",
              display: "flex",
              flexDirection: "column"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "25px" }}>
                <div style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px"
                }}>
                  📜
                </div>
                <h2 style={{ color: "white", fontSize: "1.5rem", fontWeight: 700, margin: 0, fontFamily: "'Poppins', sans-serif" }}>
                  Payment History
                </h2>
              </div>

              <div style={{
                flex: 1,
                overflowY: "auto",
                paddingRight: "10px"
              }}>
                {payments.length === 0 ? (
                  <div style={{
                    textAlign: "center",
                    padding: "60px 20px",
                    color: "#94a3b8"
                  }}>
                    <div style={{ fontSize: "3rem", marginBottom: "15px", opacity: 0.5 }}>💸</div>
                    <div style={{ fontSize: "1.1rem" }}>No payments yet</div>
                    <div style={{ fontSize: "0.9rem", marginTop: "8px" }}>Start by making your first payment above</div>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    {payments.map((p, idx) => (
                      <div
                        key={idx}
                        className="card-hover"
                        style={{
                          padding: "20px",
                          borderRadius: "12px",
                          background: "rgba(255, 255, 255, 0.05)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          transition: "all 0.3s ease"
                        }}
                      >
                        <div style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: "12px"
                        }}>
                          <div style={{ flex: 1 }}>
                            <div style={{
                              color: "white",
                              fontSize: "1.1rem",
                              fontWeight: 600,
                              marginBottom: "8px"
                            }}>
                              {p.provider || "Unknown Provider"}
                            </div>
                            <div style={{
                              display: "inline-block",
                              padding: "4px 10px",
                              borderRadius: "6px",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              background: p.status === "simulated"
                                ? "rgba(245, 158, 11, 0.2)"
                                : "rgba(16, 185, 129, 0.2)",
                              color: p.status === "simulated" ? "#fbbf24" : "#34d399",
                              border: `1px solid ${p.status === "simulated" ? "rgba(245, 158, 11, 0.3)" : "rgba(16, 185, 129, 0.3)"}`
                            }}>
                              {p.status || "completed"}
                            </div>
                          </div>
                          <div style={{
                            fontSize: "1.3rem",
                            fontWeight: 700,
                            color: "#10b981",
                            fontFamily: "'Poppins', sans-serif"
                          }}>
                            ${(p.total_cost_usd || 0).toFixed(2)}
                          </div>
                        </div>

                        <div style={{
                          color: "#94a3b8",
                          fontSize: "0.85rem",
                          lineHeight: 1.6,
                          marginTop: "12px"
                        }}>
                          <div style={{ marginBottom: "6px" }}>
                            <span style={{ color: "#cbd5e1" }}>Quantity:</span> {p.quantity || 0} units @ ${(p.price_usd_per_unit || 0).toFixed(2)} each
                          </div>
                          <div style={{ marginBottom: "6px" }}>
                            <span style={{ color: "#cbd5e1" }}>Invoice:</span>{" "}
                            <code style={{
                              padding: "2px 6px",
                              borderRadius: "4px",
                              background: "rgba(0, 0, 0, 0.2)",
                              fontSize: "0.8rem"
                            }}>
                              {p.invoiceId ? truncateHash(p.invoiceId) : "N/A"}
                            </code>
                          </div>
                          {p.txHash && (
                            <div style={{ marginBottom: "6px" }}>
                              <span style={{ color: "#cbd5e1" }}>Tx Hash:</span>{" "}
                              <code style={{
                                padding: "2px 6px",
                                borderRadius: "4px",
                                background: "rgba(0, 0, 0, 0.2)",
                                fontSize: "0.8rem",
                                color: "#a5b4fc",
                                cursor: "pointer"
                              }}
                              onClick={() => {
                                if (p.txHash) {
                                  navigator.clipboard.writeText(p.txHash);
                                  alert("Transaction hash copied to clipboard!");
                                }
                              }}
                              title="Click to copy">
                                {truncateHash(p.txHash)}
                              </code>
                            </div>
                          )}
                          <div style={{ fontSize: "0.8rem", opacity: 0.7, marginTop: "8px" }}>
                            {formatDate(p.created_at)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Provider Info Section */}
          <div className="card-hover glass-effect animate-fade-in-up" style={{
            padding: "30px",
            borderRadius: "20px",
            marginTop: "30px",
            opacity: 0,
            animationDelay: "0.5s"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <div style={{
                width: "50px",
                height: "50px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px"
              }}>
                🔗
              </div>
              <h3 style={{ color: "white", fontSize: "1.3rem", fontWeight: 700, margin: 0, fontFamily: "'Poppins', sans-serif" }}>
                Provider Configuration
              </h3>
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
              color: "#cbd5e1"
            }}>
              <div>
                <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "5px" }}>Provider URL</div>
                <code style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  background: "rgba(0, 0, 0, 0.2)",
                  fontSize: "0.9rem",
                  display: "block",
                  wordBreak: "break-all"
                }}>
                  {PROVIDER}
                </code>
              </div>
              <div>
                <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "5px" }}>Backend URL</div>
                <code style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  background: "rgba(0, 0, 0, 0.2)",
                  fontSize: "0.9rem",
                  display: "block",
                  wordBreak: "break-all"
                }}>
                  {BACKEND}
                </code>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          padding: "40px 20px",
          textAlign: "center",
          color: "#94a3b8",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          marginTop: "60px"
        }}>
          <div style={{ marginBottom: "15px", fontSize: "1.1rem", fontWeight: 600, color: "#cbd5e1" }}>
            API Wallet Agent
          </div>
          <div style={{ fontSize: "0.9rem" }}>
            Built with Arc Blockchain • Circle USDC • Gemini AI • x402 Protocol
          </div>
        </footer>
      </div>
    </div>
  );
}
