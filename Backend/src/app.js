const express = require("express")
const cookieParser = require("cookie-parser")

const app = express()

// ✅ Manual CORS middleware (cors npm package is not fully compatible with Express 5)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173")
    res.header("Access-Control-Allow-Credentials", "true")
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization")

    // Handle preflight requests
    if (req.method === "OPTIONS") {
        return res.sendStatus(204)
    }

    next()
})

app.use(express.json())
app.use(cookieParser())

const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")

app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

// Global error handler — preserve CORS headers on errors
app.use((err, req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173")
    res.header("Access-Control-Allow-Credentials", "true")
    console.error("Server error:", err.message)
    res.status(err.status || 500).json({ message: err.message || "Internal Server Error" })
})

module.exports = app