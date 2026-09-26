const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send(`
        <h1>Student Registration Form</h1>

        <form action="/submit" method="POST">
            <label>Name:</label><br>
            <input type="text" name="name" required><br><br>

            <label>Email:</label><br>
            <input type="email" name="email" required><br><br>

            <label>Course:</label><br>
            <input type="text" name="course" required><br><br>

            <button type="submit">Submit</button>
        </form>
    `);
});

app.post("/submit", async (req, res) => {
    try {
        const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";

        const response = await fetch(`${backendUrl}/submit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                name: req.body.name,
                email: req.body.email,
                course: req.body.course
            })
        });

        const data = await response.json();

        res.send(`
            <h1>Form Submitted Successfully</h1>
            <p>Name: ${data.name}</p>
            <p>Email: ${data.email}</p>
            <p>Course: ${data.course}</p>
        `);
    } catch (error) {
        res.status(500).send("Unable to connect to Flask backend.");
    }
});

app.listen(PORT, () => {
    console.log(`Frontend running on port ${PORT}`);
});
