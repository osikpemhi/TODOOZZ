import "./styles.css";

// DOM Selectors
const todoDialog = document.getElementById("todo-dialog");
const todoForm = document.getElementById("todo-form");

const allBtn = document.getElementById("all-btn");
const priorityBtn = document.getElementById("priority");
const completedBtn = document.getElementById("completed-btn");
const futurePlansBtn = document.getElementById("future-plans");

const allTodos = document.getElementById("all-todos");
const priorityTodos = document.getElementById("priority-todos");
const completedTodos = document.getElementById("completed-todos");
const futurePlansTodos = document.getElementById("future-plans-todos");

const alarmSound = document.getElementById("alarm-sound");


// Your app code here
console.log("Webpack is running!");

class TodoManager {
  constructor() {
    this.tasks = [];
  }

  // Pass the data AS AN OBJECT to this method
  addTask(taskData) {
    this.tasks.push(taskData);
    this.renderTasks(); // Call a separate method to update the UI
    console.log(`Added: "${taskData.title}"`);
  }

  renderTasks() {
    allTodos.innerHTML = ""; 
    
    this.tasks.forEach((element) => {
      const todoDiv = document.createElement("div");
      todoDiv.className = "todo";
      
      todoDiv.innerHTML = `
          <h3>${element.title}</h3>
          <div class="details">
            <p>${element.description || "No description provided."}</p>
            <div class="more-details">
              <p>Time: ${element.time}</p>
              <p>Priority: ${element.priority}</p>
            </div>
            <div class="status">
              <button class="delete-btn">Delete</button>
              <button class="edit-btn">Edit</button>
            </div>
          </div>
      `;

      // FIX: Select the button we just created and add a listener
      const deleteBtn = todoDiv.querySelector(".delete-btn");
      deleteBtn.addEventListener("click", () => {
        this.deleteTask(element.id);
      });

      const editBtn = todoDiv.querySelector(".edit-btn");
      editBtn.addEventListener("click", () => {
        const newTitle = prompt("Edit Task Title:", element.title);
        const newDescription = prompt("Edit Task Description:", element.description);
        const newTime = prompt("Edit Task Time (HH:MM):", element.time);
        const newPriority = prompt("Edit Task Priority (Low/Medium/High):", element.priority);

        this.editTask(element.id, { title: newTitle, description: newDescription, time: newTime, priority: newPriority });
      });

      allTodos.appendChild(todoDiv);
    });


  }

  setAlarm(taskTime) {
    if (!taskTime) return; // Don't set an alarm if no time is provided
  
    const [alarmHours, alarmMinutes] = taskTime.split(":").map(Number);
    const now = new Date();
    const alarmDate = new Date();
    
    alarmDate.setHours(alarmHours, alarmMinutes, 0, 0);
  
    // FIX: If the time has already passed today, set it for tomorrow
    if (alarmDate <= now) {
      alarmDate.setDate(alarmDate.getDate() + 1);
    }
  
    const timeToAlarm = alarmDate.getTime() - now.getTime();
  
    console.log(`Alarm set for ${alarmDate.toLocaleTimeString()}. Triggering in ${Math.round(timeToAlarm/1000)} seconds.`);
  
    setTimeout(() => {
      // We wrap play() in a promise check because browsers are strict
      alert(`Reminder: Your task is due!`);

      alarmSound.play().catch(error => {
        console.log("Audio playback failed. Please interact with the page first!", error);
      });
      

    }, timeToAlarm);
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.renderTasks();
    console.log(`Deleted task with ID: ${id}`);
  }

  editTask(id, newData) {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
      this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...newData };
      this.renderTasks();
      console.log(`Edited task with ID: ${id}`);
    } else {
      console.log(`Task with ID: ${id} not found.`);
    }
  } 

  sortTasksByPriority() {
    const priorityOrder = { "high": 1, "medium": 2, "low": 3 };
    
    this.tasks.sort((a, b) => {
      // Convert to lowercase to ensure it matches the keys in priorityOrder
      const priorityA = a.priority.toLowerCase();
      const priorityB = b.priority.toLowerCase();
      
      return (priorityOrder[priorityA] || 4) - (priorityOrder[priorityB] || 4);
    });
  
    this.renderTasks();
    console.log("Tasks sorted by priority.");
    console.log(this.tasks);
    
  }

}

const myApp = new TodoManager();

// Handle the Form logic OUTSIDE the class
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const taskData = {
    title: document.getElementById("todo-input").value.trim(),
    description: document.getElementById("todo-description").value.trim(),
    time: document.getElementById("todo-time").value,
    priority: document.getElementById("priority").value,
    isCompleted: false,
    id: crypto.randomUUID()
  };

  if (taskData.title) {
    myApp.addTask(taskData);
    
    // Pass the time string (e.g., "14:30") to the alarm function
    myApp.setAlarm(taskData.time); 

    todoForm.reset();
    todoDialog.close();
  }
});


priorityBtn.addEventListener("click", () => {
  myApp.sortTasksByPriority();
}
);





// // Adding tasks
// myApp.addTask("Learn OOP in JavaScript");
// myApp.addTask("Drink some water");

// // Toggling a task (Encapsulation in action)
// // Let's pretend we found the first task in the array
// myApp.tasks[0].toggleStatus();

// myApp.showTasks();
