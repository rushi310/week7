const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost/student_tasks', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define MongoDB Schemas and Models
const courseSchema = new mongoose.Schema({
    courseId: String,
    courseName: String
});

const taskSchema = new mongoose.Schema({
    courseId: String,
    taskName: String,
    dueDate: Date,
    details: String
});

const Course = mongoose.model('Course', courseSchema);
const Task = mongoose.model('Task', taskSchema);

// Route to retrieve tasks for a specific course
app.get('/courses/:courseId/tasks', async (req, res) => {
    const { courseId } = req.params;

    try {
        const tasks = await Task.find({ courseId });
        
        if (tasks.length === 0) {
            return res.status(404).json({ message: 'No tasks found for the specified course ID.' });
        }

        res.json(tasks);
    } catch (error) {
        console.error('Error retrieving tasks:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
