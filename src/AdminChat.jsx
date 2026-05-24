import { useState, useEffect, useRef } from "react";
import { db } from "./firebase";
import {
    collection, addDoc, onSnapshot,
    orderBy, query, serverTimestamp, getDocs
} from "firebase/firestore";

export default function AdminChat() {
    const [sessions, setSessions] = useState([]);
    const [activeSession, setActiveSession] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const bottomRef = useRef();

    // Load all chat sessions
    useEffect(() => {
        const unsub = onSnapshot(collection(db, "chats"), snap => {
            setSessions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });
        return unsub;
    }, []);

    // Load messages for active session
    useEffect(() => {
        if (!activeSession) return;
        const q = query(collection(db, "chats", activeSession, "messages"), orderBy("createdAt"));
        const unsub = onSnapshot(q, snap => {
            setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
        });
        return unsub;
    }, [activeSession]);

    const send = async () => {
        if (!text.trim() || !activeSession) return;
        await addDoc(collection(db, "chats", activeSession, "messages"), {
            text: text.trim(),
            sender: "admin",
            senderName: "StyleHub Support",
            createdAt: serverTimestamp(),
        });
        setText("");
    };

    return (
        <div style={{ display: "flex", height: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
            {/* Sessions List */}
            <div style={{ width: 240, borderRight: "1px solid #eee", overflowY: "auto", background: "#f9f7f4" }}>
                <div style={{ padding: "1rem", fontWeight: 600, fontSize: ".9rem", borderBottom: "1px solid #eee" }}>
                    💬 Customer Chats
                </div>
                {sessions.length === 0 && <div style={{ padding: "1rem", color: "#aaa", fontSize: ".8rem" }}>No chats yet</div>}
                {sessions.map(s => (
                    <div key={s.id} onClick={() => setActiveSession(s.id)} style={{
                        padding: ".8rem 1rem", cursor: "pointer", fontSize: ".83rem",
                        background: activeSession === s.id ? "#e8ede2" : "transparent",
                        borderBottom: "1px solid #eee",
                    }}>
                        👤 {s.id.startsWith("guest_") ? "Guest" : s.id}
                    </div>
                ))}
            </div>

            {/* Chat Area */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                {!activeSession ? (
                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#aaa" }}>
                        Select a conversation
                    </div>
                ) : (
                    <>
                        <div style={{ padding: "1rem", borderBottom: "1px solid #eee", fontWeight: 600, background: "#fff" }}>
                            Chat with: {activeSession}
                        </div>
                        <div style={{ flex: 1, overflowY: "auto", padding: "1rem", display: "flex", flexDirection: "column", gap: ".5rem" }}>
                            {messages.map(m => (
                                <div key={m.id} style={{
                                    alignSelf: m.sender === "admin" ? "flex-end" : "flex-start",
                                    background: m.sender === "admin" ? "#4a5e3a" : "#f4f1ec",
                                    color: m.sender === "admin" ? "#fff" : "#333",
                                    padding: ".5rem .85rem", borderRadius: 12,
                                    fontSize: ".83rem", maxWidth: "70%",
                                }}>
                                    {m.text}
                                </div>
                            ))}
                            <div ref={bottomRef} />
                        </div>
                        <div style={{ display: "flex", borderTop: "1px solid #eee", padding: ".6rem" }}>
                            <input
                                value={text}
                                onChange={e => setText(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && send()}
                                placeholder="Reply..."
                                style={{ flex: 1, border: "none", outline: "none", fontSize: ".85rem", padding: ".3rem .5rem" }}
                            />
                            <button onClick={send} style={{
                                background: "#4a5e3a", color: "#fff", border: "none",
                                borderRadius: 8, padding: ".3rem .8rem", cursor: "pointer",
                            }}>Send</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}