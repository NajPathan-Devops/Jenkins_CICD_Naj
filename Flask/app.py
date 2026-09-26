from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/submit", methods=["POST"])
def submit():
    name = request.form.get("name")
    email = request.form.get("email")
    course = request.form.get("course")

    return jsonify({
        "message": "Form submitted successfully",
        "name": name,
        "email": email,
        "course": course
    })

@app.route("/")
def home():
    return "Flask Backend is Running!"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
