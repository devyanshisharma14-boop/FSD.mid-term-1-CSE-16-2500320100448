const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

const students = [];

const validateStudentPayload = (payload, { requireAllFields = true } = {}) => {
    const { id, name, email, course, age } = payload || {};

    if (requireAllFields) {
        if (!id || !name || !email || !course || age === undefined || age === null || age === '') {
            return {
                valid: false,
                error: 'All fields (id, name, email, course, age) are required.'
            };
        }
    }

    if (age !== undefined && age !== null && age !== '') {
        const parsedAge = Number(age);
        if (Number.isNaN(parsedAge) || parsedAge < 0) {
            return {
                valid: false,
                error: 'Age must be a valid non-negative number.'
            };
        }
    }

    return { valid: true };
};

app.get('/api/students', (req, res) => {
    res.status(200).json({
        message: 'Student records fetched successfully',
        data: students
    });
});

app.get('/api/students/:id', (req, res) => {
    const student = students.find((item) => item.id === req.params.id);

    if (!student) {
        return res.status(404).json({ error: 'Student not found.' });
    }

    res.status(200).json({
        message: 'Student retrieved successfully',
        data: student
    });
});

// Task 2: Create Student Records
// Implement: POST /api/students
app.post('/api/students', (req, res) => {
    const { id, name, email, course, age } = req.body;
    const validation = validateStudentPayload(req.body, { requireAllFields: true });

    if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
    }

    if (students.some((student) => student.id === id)) {
        return res.status(409).json({ error: 'Student with this id already exists.' });
    }

    const newStudent = { id, name, email, course, age: Number(age) };

    students.push(newStudent);

    res.status(201).json({
        message: 'Student record created successfully',
        data: newStudent
    });
});

app.put('/api/students/:id', (req, res) => {
    const studentIndex = students.findIndex((student) => student.id === req.params.id);

    if (studentIndex === -1) {
        return res.status(404).json({ error: 'Student not found.' });
    }

    const validation = validateStudentPayload(req.body, { requireAllFields: true });
    if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
    }

    const { id, name, email, course, age } = req.body;
    const updatedStudent = { id, name, email, course, age: Number(age) };

    students[studentIndex] = updatedStudent;

    res.status(200).json({
        message: 'Student record updated successfully',
        data: updatedStudent
    });
});

app.delete('/api/students/:id', (req, res) => {
    const studentIndex = students.findIndex((student) => student.id === req.params.id);

    if (studentIndex === -1) {
        return res.status(404).json({ error: 'Student not found.' });
    }

    const [deletedStudent] = students.splice(studentIndex, 1);

    res.status(200).json({
        message: 'Student record deleted successfully',
        data: deletedStudent
    });
});

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Student API is running.' });
});

// Task 1: Configure the server to run on port 3000
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

module.exports = app;
module.exports.app = app;
module.exports.students = students;