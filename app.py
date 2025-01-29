from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)

# Replace the SQLite URI with your PostgreSQL URI
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://taskmanager_db_0wz0_user:cBVP9wiGJyXRWH2x7Kmo8wy6uHMYACZx@dpg-cuct152n91rc73ekjp60-a.oregon-postgres.render.com/taskmanager_db_0wz0'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Define the Task model
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return f'<Task {self.name}>'

# Create the database tables (useful for first-time setup)
with app.app_context():
    db.create_all()  # This will create the Task table if it doesn't exist

CORS(app)  # Enable CORS globally for all routes

tasks = []  # Temporary list of tasks (you can keep using your DB instead)

@app.route('/tasks', methods=['GET', 'POST'])
def tasks_route():
    if request.method == 'GET':
        # Fetch tasks from the database instead of the temporary list
        tasks_from_db = Task.query.all()
        return jsonify([{'id': task.id, 'name': task.name} for task in tasks_from_db])

    elif request.method == 'POST':
        new_task = request.get_json()
        new_task_record = Task(name=new_task['name'])
        db.session.add(new_task_record)
        db.session.commit()
        return jsonify({'id': new_task_record.id, 'name': new_task_record.name}), 201

@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    task_to_delete = Task.query.get(task_id)
    if task_to_delete:
        db.session.delete(task_to_delete)
        db.session.commit()
        return '', 204  # Task deleted successfully
    else:
        return 'Task not found', 404

if __name__ == '__main__':
    app.run(debug=True)
