const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 MySQL 連線
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "schedule"
});

db.connect(err => {
  if (err) {
    console.log("❌ MySQL 連線失敗:", err);
  } else {
    console.log("✅ MySQL 已連線");
  }
});


// ========================
// 📌 1. 取得所有行程
// ========================
app.get("/events", (req, res) => {
  db.query("SELECT * FROM events", (err, results) => {
    if (err) return res.status(500).json(err);

    // FullCalendar 需要 id/title/start/end
    res.json(results);
  });
});


// ========================
// ➕ 2. 新增行程
// ========================
app.post("/events", (req, res) => {
  const { title, start, end } = req.body;

  const sql = "INSERT INTO events (title, start, end) VALUES (?, ?, ?)";
  db.query(sql, [title, start, end], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({
      id: result.insertId,
      title,
      start,
      end
    });
  });
});


// ========================
// ✏️ 3. 修改行程
// ========================
app.put("/events/:id", (req, res) => {
  const { id } = req.params;
  const { title, start, end } = req.body;

  const sql = "UPDATE events SET title=?, start=?, end=? WHERE id=?";
  db.query(sql, [title, start, end, id], (err) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "updated" });
  });
});


// ========================
// ❌ 4. 刪除行程
// ========================
app.delete("/events/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM events WHERE id=?", [id], (err) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "deleted" });
  });
});


// ========================
// 🚀 啟動伺服器
// ========================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});