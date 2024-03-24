// document.getElementById('taskForm').addEventListener('submit', async function(event) {
//     event.preventDefault();

//     const formData = new FormData(event.target);
//     const taskData = {
//         courseId: formData.get('courseId'),
//         taskName: formData.get('taskName'),
//         dueDate: formData.get('dueDate'),
//         details: formData.get('details')
//     };

//     try {
//         const response = await fetch('/courses/' + taskData.courseId + '/tasks', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(taskData)
//         });

//         if (response.ok) {
//             console.log('Task submitted successfully!');
//             // Optionally, you can reset the form here
//         } else {
//             console.error('Error submitting task:', response.statusText);
//         }
//     } catch (error) {
//         console.error('Error submitting task:', error);
//     }
// });

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/student_tasks', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define MongoDB Schema
const taskSchema = new mongoose.Schema({
    courseId: String,
    taskName: String,
    dueDate: Date,
    details: String
});

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

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
