import { useState, useEffect, useRef } from "react";
import { db } from "./firebase";
import {
    collection, addDoc, onSnapshot,
    orderBy, query, serverTimestamp, doc, setDoc
} from "firebase/firestore";


const ADMIN_NAME = "StyleHub Support";

export default function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const bottomRef = useRef();

    const user = (() => {
        try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
    })();

    const sessionId = (() => {
        let id = sessionStorage.getItem("chatSessionId");
        if (!id) { id = user?.id || ("guest_" + Math.random().toString(36).slice(2)); sessionStorage.setItem("chatSessionId", id); }
        return id;
    })();

    const userName = user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "Guest";

    useEffect(() => {
        if (!open) return;
        const q = query(collection(db, "chats", sessionId, "messages"), orderBy("createdAt"));
        const unsub = onSnapshot(q, snap => {
            setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
        });
        return unsub;
    }, [open, sessionId]);

    const send = async () => {
        if (!text.trim()) return;

        // عشان الـ admin يشوف الـ session
        await setDoc(doc(db, "chats", sessionId), {
            userName,
            lastMessage: text.trim(),
            updatedAt: serverTimestamp(),
        }, { merge: true });

        await addDoc(collection(db, "chats", sessionId, "messages"), {
            text: text.trim(),
            sender: "customer",
            senderName: userName,
            createdAt: serverTimestamp(),
        });
        setText("");
    };

    return (
        <>
            {/* Floating Button */}
            <button onClick={() => setOpen(o => !o)} style={{
                position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 9999,
                width: 56, height: 56, borderRadius: "50%", border: "none",
                background: "#4a5e3a", color: "#fff", fontSize: "1.5rem",
                boxShadow: "0 4px 16px rgba(0,0,0,.18)", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
            }}>
                {open ? "✕" : "💬"}
            </button>

            {/* Chat Box */}
            {open && (
                <div style={{
                    position: "fixed", bottom: "5rem", right: "1.5rem", zIndex: 9998,
                    width: 320, height: 420, background: "#fff", borderRadius: 16,
                    boxShadow: "0 8px 32px rgba(0,0,0,.15)", display: "flex",
                    flexDirection: "column", overflow: "hidden", fontFamily: "'DM Sans', sans-serif",
                }}>
                    {/* Header */}
                    <div style={{ background: "#4a5e3a", padding: "1rem", color: "#fff" }}>
                        <div style={{ fontWeight: 600, fontSize: ".95rem" }}>💬 StyleHub Support</div>
                        <div style={{ fontSize: ".72rem", opacity: .8 }}>We usually reply instantly</div>
                    </div>

                    {/* Messages */}
                    <div style={{ flex: 1, overflowY: "auto", padding: "1rem", display: "flex", flexDirection: "column", gap: ".5rem" }}>
                        {messages.length === 0 && (
                            <div style={{ textAlign: "center", color: "#aaa", fontSize: ".8rem", marginTop: "2rem" }}>
                                👋 Hi {userName}! How can we help you?
                            </div>
                        )}
                        {messages.map(m => (
                            <div key={m.id} style={{
                                alignSelf: m.sender === "customer" ? "flex-end" : "flex-start",
                                background: m.sender === "customer" ? "#4a5e3a" : "#f4f1ec",
                                color: m.sender === "customer" ? "#fff" : "#333",
                                padding: ".5rem .85rem", borderRadius: 12,
                                fontSize: ".83rem", maxWidth: "75%",
                            }}>
                                {m.sender === "admin" && <div style={{ fontSize: ".68rem", fontWeight: 600, marginBottom: 2, color: "#4a5e3a" }}>{ADMIN_NAME}</div>}
                                {m.text}
                            </div>
                        ))}
                        <div ref={bottomRef} />
                    </div>

                    {/* Input */}
                    <div style={{ display: "flex", borderTop: "1px solid #eee", padding: ".6rem" }}>
                        <input
                            value={text}
                            onChange={e => setText(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && send()}
                            placeholder="Type a message..."
                            style={{
                                flex: 1, border: "none", outline: "none", fontSize: ".85rem",
                                fontFamily: "inherit", padding: ".3rem .5rem",
                            }}
                        />
                        <button onClick={send} style={{
                            background: "#4a5e3a", color: "#fff", border: "none",
                            borderRadius: 8, padding: ".3rem .8rem", cursor: "pointer", fontSize: ".85rem",
                        }}>Send</button>
                    </div>
                </div>
            )}
        </>
    );
}