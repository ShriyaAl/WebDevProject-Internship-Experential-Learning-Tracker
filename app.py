from flask import Flask, render_template, request, redirect
import sqlite3
import pytesseract
from PIL import Image
import os

app = Flask(__name__)

# Tell Python where Tesseract is installed
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# Upload folder
UPLOAD_FOLDER = 'static/uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


# Database connection
def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn


# Login Page
@app.route('/')
def login():
    return render_template('login.html')


# Logout
@app.route('/logout')
def logout():
    return redirect('/')


# Dashboard
@app.route('/dashboard')
def dashboard():

    conn = get_db_connection()

    total_students = conn.execute(
        'SELECT COUNT(*) FROM students'
    ).fetchone()[0]

    total_internships = conn.execute(
        'SELECT COUNT(*) FROM internships'
    ).fetchone()[0]

    total_feedback = conn.execute(
        'SELECT COUNT(*) FROM feedback'
    ).fetchone()[0]

    conn.close()

    return render_template(
        'dashboard.html',
        total_students=total_students,
        total_internships=total_internships,
        total_feedback=total_feedback
    )


# Students page
@app.route('/students')
def students():

    conn = get_db_connection()

    students = conn.execute(
        'SELECT * FROM students'
    ).fetchall()

    conn.close()

    return render_template(
        'students.html',
        students=students
    )


# Add student
@app.route('/add_student', methods=['POST'])
def add_student():

    name = request.form['name']
    email = request.form['email']
    company = request.form['company']

    conn = get_db_connection()

    conn.execute(
        'INSERT INTO students (name,email,company) VALUES (?,?,?)',
        (name, email, company)
    )

    conn.commit()
    conn.close()

    return redirect('/students')


# Delete student
@app.route('/delete_student/<int:id>')
def delete_student(id):

    conn = get_db_connection()

    conn.execute(
        'DELETE FROM students WHERE id=?',
        (id,)
    )

    conn.commit()
    conn.close()

    return redirect('/students')


# Internship page
@app.route('/internship')
def internship():

    conn = get_db_connection()

    internships = conn.execute(
        'SELECT * FROM internships'
    ).fetchall()

    conn.close()

    return render_template(
        'internship.html',
        internships=internships
    )


# Add internship
@app.route('/add_internship', methods=['POST'])
def add_internship():

    student = request.form['student']
    company = request.form['company']
    duration = request.form['duration']
    status = request.form['status']

    proof = request.files['proof']

    filename = proof.filename
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)

    proof.save(filepath)

    # OCR TEXT EXTRACTION
    text = pytesseract.image_to_string(Image.open(filepath))
    text = text.lower()

    # Simple verification
    if "internship" in text or "certificate" in text:
        verification = "Verified"
    else:
        verification = "Rejected"

    conn = get_db_connection()

    conn.execute(
        'INSERT INTO internships (student,company,duration,status,verification,proof) VALUES (?,?,?,?,?,?)',
        (student, company, duration, status, verification, filename)
    )

    conn.commit()
    conn.close()

    return redirect('/internship')


# Delete internship
@app.route('/delete_internship/<int:id>')
def delete_internship(id):

    conn = get_db_connection()

    conn.execute(
        'DELETE FROM internships WHERE id=?',
        (id,)
    )

    conn.commit()
    conn.close()

    return redirect('/internship')


# Feedback page
@app.route('/feedback')
def feedback():

    conn = get_db_connection()

    feedbacks = conn.execute(
        'SELECT * FROM feedback'
    ).fetchall()

    conn.close()

    return render_template(
        'feedback.html',
        feedbacks=feedbacks
    )


# Add feedback
@app.route('/add_feedback', methods=['POST'])
def add_feedback():

    student = request.form['student']
    mentor = request.form['mentor']
    rating = request.form['rating']
    comments = request.form['comments']

    conn = get_db_connection()

    conn.execute(
        'INSERT INTO feedback (student,mentor,rating,comments) VALUES (?,?,?,?)',
        (student, mentor, rating, comments)
    )

    conn.commit()
    conn.close()

    return redirect('/feedback')


# Delete feedback
@app.route('/delete_feedback/<int:id>')
def delete_feedback(id):

    conn = get_db_connection()

    conn.execute(
        'DELETE FROM feedback WHERE id=?',
        (id,)
    )

    conn.commit()
    conn.close()

    return redirect('/feedback')


if __name__ == '__main__':
    app.run(debug=True)