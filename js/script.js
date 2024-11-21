"use strict";

function TodoList() {
    const addButton = document.querySelector('.add-button');
    const inputField = document.querySelector('input[type="text"]');
    const clearAllButton = document.querySelector('.clear-all');
    const listContainer = document.querySelector('.cards');

    function addTask(inputText, isChecked = false) {
        if (inputText === '') {
            console.log("You must write something!");
        } else {

            const taskElement = document.createElement('li');
            taskElement.classList.add('card');
            taskElement.innerHTML = `
                <input type="checkbox" name="task-checkbox" ${isChecked ? 'checked' : ''}>
                <p>${inputText}</p>
                <button class="pencil-button"><img src="./img/pencil.svg" alt=""></button>
                <button class="delete-button"><img src="./img/clear.svg" alt=""></button>
                `;
            listContainer.appendChild(taskElement);

        }
        updateLocalStorage();
    }

    function updateLocalStorage() {
        const tasks = Array.from(listContainer.querySelectorAll('.card')).map(card => ({
            text: card.querySelector('p').textContent,
            checked: card.querySelector('input[type="checkbox"]').checked
        }));
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasksFromLocalStorage() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            addTask(task.text, task.checked);
        });
    }

    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            addTask(inputField.value.trim());
            inputField.value = "";
        }
    }

    addButton && addButton.addEventListener('click', () => {
        addTask(inputField.value.trim());
        inputField.value = "";
    });
    

    function handleClearAllButtonClick() {
        listContainer.innerHTML = "";
        localStorage.removeItem('tasks');
    }

    function handleListContainerClick(event) {
        const card = event.target.closest('.card');
        if (!card) return;

        const checkbox = card.querySelector('input[type="checkbox"]');
        if (!checkbox.checked) return;

        const pencilButton = card.querySelector('.pencil-button');
        const deleteButton = card.querySelector('.delete-button');

        if (event.target.classList.contains('delete-button')) {
            card.remove();
            updateLocalStorage();
        } else if (event.target.classList.contains('pencil-button')) {
            const paragraph = card.querySelector('p');
            const text = paragraph.textContent;
            paragraph.innerHTML = `<input type="text" class="edit-text" value="${text}">`;
            const editInput = card.querySelector('.edit-text');
            editInput.focus();

            const pencilButtonClasses = pencilButton.classList.value;
            const deleteButtonClasses = deleteButton.classList.value;

            pencilButton.style.display = 'none';
            deleteButton.style.display = 'none';

            const saveButton = document.createElement('button');
            saveButton.classList.add('save-button');
            saveButton.innerHTML = `<img src="./img/save.svg" alt="">`;
            card.appendChild(saveButton);

            saveButton.addEventListener('click', () => {
                const newText = editInput.value.trim();
                if (newText !== '') {
                    paragraph.textContent = newText;
                }
                saveButton.remove();

                pencilButton.style.display = '';
                deleteButton.style.display = '';
                pencilButton.className = pencilButtonClasses;
                deleteButton.className = deleteButtonClasses;

                updateLocalStorage();       
        });
    }
    updateLocalStorage(); 
}

    function handleCheckboxChange(event) {
        const checkbox = event.target;
        const card = checkbox.closest('.card');
        if (!card) return;
    
        checkbox.checked
            ? card.classList.add('hide-control-btns')
            : card.classList.remove('hide-control-btns');
    
        updateLocalStorage(); 
    }

    addButton && addButton.addEventListener('click', () => addTask(inputField.value.trim()));
    inputField && inputField.addEventListener('keypress', handleKeyPress);
    clearAllButton && clearAllButton.addEventListener('click', handleClearAllButtonClick);
    listContainer && listContainer.addEventListener('click', handleListContainerClick);
    listContainer && listContainer.addEventListener('change', handleCheckboxChange);

    loadTasksFromLocalStorage();
}

TodoList();
