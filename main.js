window.addEventListener('load',()=>{
  const form= document.querySelector("#new-task-form");
  const input = document.querySelector("#new-task-input");
  const list_el = document.querySelector("#tasks");
  fetch('db.json')
    .then(response => response.json())
    .then(data => {
      data.tasks.forEach(task => {
        const task_el = document.createElement("div");
        task_el.classList.add("task");

        const task_content_el = document.createElement("div");
        task_content_el.classList.add("content");

        task_el.appendChild(task_content_el);

        const task_input_el = document.createElement("input");
        task_input_el.classList.add("text");
        task_input_el.type = "text";
        task_input_el.value = task.name;
        task_input_el.setAttribute("readonly","readonly");

        task_content_el.appendChild(task_input_el);

        const task_actions_el = document.createElement("div");
        task_actions_el.classList.add("actions");

        const task_edit_el = document.createElement("button");
        task_edit_el.classList.add("edit");
        task_edit_el.innerHTML = "Edit";

        const task_delete_el = document.createElement("button");
        task_delete_el.classList.add("delete");
        task_delete_el.innerHTML = "Delete";

        task_actions_el.appendChild(task_edit_el);
        task_actions_el.appendChild(task_delete_el);

        task_el.appendChild(task_actions_el);
        list_el.appendChild(task_el);

        task_edit_el.addEventListener('click',()=>{
          if(task_edit_el.innerText.toLowerCase()=='edit'){
            task_input_el.removeAttribute("readonly");
            task_input_el.focus();
            task_edit_el.innerText="Save";
          } else{
            const updatedTask = {
              ...task,
              name: task_input_el.value
            };
            fetch(`http://localhost:3000/tasks/${task.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(updatedTask)
            })
              .then(response => response.json())
              .then(data => console.log(data))
              .catch(error => console.log(error));
        
            task_input_el.setAttribute("readonly","readonly");
            task_edit_el.innerText="Edit";
          }
        });          
        task_delete_el.addEventListener('click', () => {
          if (confirm("Are you sure you want to delete this task?")) {
            list_el.removeChild(task_el);
            fetch(`http://localhost:3000/tasks/${task.id}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(task)
            })
              .then(response => response.json())
              .then(data => console.log(data))
              .catch(error => console.log(error));
          }
        });
        
      });
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const task = input.value.trim();
      
      if (!task) {
        alert("Please fill out the task.");
        return;
      }
      const words = task.split(" ");
      if (words.length > 120) {
        alert("Task description can not be more than 120 words.");
        return;
      }
    const newTask = {
      name: task,
      completed: false
    };
    fetch('http://localhost:3000/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newTask)
    })
      .then(response => response.json())
      .then(data => {
        // Create task element for the new task
        const task_el = document.createElement("div");
        task_el.classList.add("task");

        const task_content_el = document.createElement("div");
        task_content_el.classList.add("content");

        task_el.appendChild(task_content_el);

        const task_input_el = document.createElement("input");
        task_input_el.classList.add("text");
        task_input_el.type = "text";
        task_input_el.value = data.name;
        task_input_el.setAttribute("readonly","readonly");

        task_content_el.appendChild(task_input_el);

        const task_actions_el = document.createElement("div");
        task_actions_el.classList.add("actions");

        const task_edit_el = document.createElement("button");
        task_edit_el.classList.add("edit");
        task_edit_el.innerHTML = "Edit";
    
        const task_delete_el = document.createElement("button");
        task_delete_el.classList.add("delete");
        task_delete_el.innerHTML = "Delete";
    
        task_actions_el.appendChild(task_edit_el);
        task_actions_el.appendChild(task_delete_el);
    
        task_el.appendChild(task_actions_el);
        list_el.appendChild(task_el);

        task_edit_el.addEventListener('click',()=>{
          if(task_edit_el.innerText.toLowerCase()=='edit'){
            task_input_el.removeAttribute("readonly");
            task_input_el.focus();
            task_edit_el.innerText="Save";
          } else{
            task_input_el.setAttribute("readonly","readonly");
            task_edit_el.innerText="Edit";
          }
        });
    
        task_delete_el.addEventListener('click',()=>{
          list_el.removeChild(task_el);
          fetch('db.json', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTask)
          })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.log(error));
        });
        input.value = "";
      })
      .catch(error => console.log(error));
  });
});      
