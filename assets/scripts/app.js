"use strict";

let COLUMN_STATE_TODO = 'TODO';
let COLUMN_STATE_IN_PROGRESS = 'IN_PROGRESS';
let COLUMN_STATE_DONE = 'DONE';

window.onload = (event) => {

    console.log('Cargando datos previos...');

    let recoveredData = JSON.parse(localStorage.getItem("kanban"));

    for (let step = 0; step < recoveredData.length; step++) {

        if (recoveredData[step] != null) {

            switch (recoveredData[step].status) {
                case COLUMN_STATE_TODO:
                    document.querySelector('.todo .tasks').append(createTask(recoveredData[step].description, COLUMN_STATE_TODO));
                    break;
    
                case COLUMN_STATE_IN_PROGRESS:
                    document.querySelector('.inprogress .tasks').append(createTask(recoveredData[step].description, COLUMN_STATE_IN_PROGRESS));
                    break;
    
                case COLUMN_STATE_DONE:
                    document.querySelector('.done .tasks').append(createTask(recoveredData[step].description, COLUMN_STATE_DONE));
                    break;
    
                default:
                    console.log(`Column '${expr}' unknown.`);
            }
        }
    }
};

//Carga datos de las tareas creadas en el panel en el 'localStorage'.

function loadData() {
    let tasks = document.getElementsByClassName("task");
    
    // recoleccion de datos
    let data = [];

    for (let step = 0; step < tasks.length; step++) {
        data[step] = getCustomData(tasks[step], step);
    }

    // guardar los datos obtenidos en el "localStorage"
    localStorage.setItem("kanban", JSON.stringify(data));
}

function getCustomData(item, index) {

    let jsonData = {};

    jsonData["description"] = item.children[0].innerHTML;
    jsonData["status"] = item.children[2].innerHTML;

    return jsonData;
}

// crear tarea como se vera graficamente

function createTask(title, column) {

    let task = document.createElement('div');
    let name = document.createElement('p');
    let close = document.createElement('img');

    // creamos el elemento de la tarea que indica a que columna pertenece
    let hiddenSpan = document.createElement('span');
    let col = document.createTextNode(column);
    
    hiddenSpan.append(col);
    hiddenSpan.style.display = 'none';

    let text = document.createTextNode(title);
    close.src = 'images/cancelar.png';

    // añadir estilo para el boton de "eliminar tarea"
    close.className = 'x';

    // colocar el elemento
    name.append(text);

    // escuchador para cerrarla
    close.addEventListener('click', deleteTask);

    task.classList.add('task');
    task.append(name);
    task.append(close);
    task.append(hiddenSpan);
    task.draggable = true;

    task.classList.add('tarea');

    // el atributo target almacena el elemento que disparo el evento

    task.addEventListener('dragstart', function(e){
        e.dataTransfer.setData('name',e.target.children[0].textContent);
        e.target.setAttribute('id','draggable');
    });

    return task;
}

// escuchador de eventos para añadir tarea

const item = document.querySelector('.buttom');

item.addEventListener('click', function(e) {

    // detener envio del formulario para evitar recarga de la pagina

    e.preventDefault();

    // obtener valor del input obteniendo el elemento por selector

    let taskName = document.querySelector('.input').value;

    // comprobar que el campo no este vacio

    if(!taskName){

        alert('No hay nada que añadir');

    } else {
        // añadir tarea
        document.querySelector('.todo .tasks').append(createTask(taskName, COLUMN_STATE_TODO));
        
        // limpiar contenido del formulario
        document.querySelector('.input').value = '';

        // almacenar datos en el localstorage
        loadData();
    }
})


// escuchador de eventos para borrar tarea

function deleteTask(e) {
    
    let recoveredData = JSON.parse(localStorage.getItem("kanban"));
    for (let step = 0; step < recoveredData.length; step++) {

        let elementChildren = e.target.parentElement.children;

        for (let child = 0; child < elementChildren.length; child++) {

            if (elementChildren[child].nodeName == "P") {

                // recorremos el contenido de localstorage para quitar el elemento eliminado
                let tasks = document.getElementsByClassName("task");
    
                // recoleccion de datos
                let data = [];
            
                for (let step = 0; step < tasks.length; step++) {
                    if (getCustomData(tasks[step], step).description != elementChildren[child].innerHTML) { // se omite el elemento a eliminar
                        data[step] = getCustomData(tasks[step], step);
                    }
                }

                // guardar los datos obtenidos en el "localStorage"
                localStorage.setItem("kanban", JSON.stringify(data));
            }
        }
    }

    e.target.parentElement.remove();
}

// hacer tareas draggable

let tasks = document.querySelectorAll('.task');

tasks.forEach(function(element){
    element.draggable = true;
    element.addEventListener('dragstart', function(e){
        e.dataTransfer.setData('name', e.target.children[0].textContent);
        e.target.setAttribute('id','draggable');
    });
});

// añadir un escuchador para cuando empiece a hacerse el drag (el arrastre)
// dataTransfer permite que la zona donde hago drop pueda coger info del elemento q hizo drag
// poner datos que se le quiere pasar
// crear nueva tarea donde lo suelte, la q estoy moviendo se va a borrar
// elementos con clase tasks q son las listas de tareas, se le van a añadir dos manejadores
// capturar el dragover
// luego hacer el drop

let tasks_list = document.querySelectorAll('.tasks');

tasks_list.forEach(function(lista) {
    lista.addEventListener('dragover', function(e){
        // prevent default para permitir drop
        e.preventDefault();
});

lista.addEventListener('drop', function(e) {
    // prevent default action
    e.preventDefault();
    let name = e.dataTransfer.getData('name');
    
    e.target.closest('.tasks').append(createTask(name, col));
    document.getElementById('draggable').remove();        
    });
});

// evento drop en "todo"
let todo = document.getElementsByClassName('todo')[0];

todo.addEventListener('drop', function(e) {
    let name = e.dataTransfer.getData('name');
    e.target.closest('.tasks').append(createTask(name, COLUMN_STATE_TODO));
    document.getElementById('draggable').remove();

    // almacenar datos en el localstorage
    loadData();
});

// evento drop en "inprogress"
let inProgress = document.getElementsByClassName('inprogress')[0];

inProgress.addEventListener('drop', function(e) {
    let name = e.dataTransfer.getData('name');
    e.target.closest('.tasks').append(createTask(name, COLUMN_STATE_IN_PROGRESS));
    document.getElementById('draggable').remove();

    // almacenar datos en el localstorage
    loadData();
});

// evento drop en "done"
let done = document.getElementsByClassName('done')[0];

done.addEventListener('drop', function(e) {
    let name = e.dataTransfer.getData('name');
    e.target.closest('.tasks').append(createTask(name, COLUMN_STATE_DONE));
    document.getElementById('draggable').remove();

    // almacenar datos en el localstorage
    loadData();
});

// Comprobar si el navegador es compatible
if (typeof(Storage) !== "undefined") {
    console.log('LocalStorage disponible');
} else {
    console.log('LocalStorage no soportado en este navegador');
}

// guardar en navegador

const storageInput = document.querySelector('.input');
const text = document.getElementsByTagName('p');
const buttom = document.querySelector('.buttom');
const input = document.getElementById('item');

// evento para limpiar columna 'TODO'
let deleteTODO = document.getElementsByClassName('delete')[0];

deleteTODO.addEventListener('click', function(e) {
    
    let tasks = document.querySelectorAll('.todo > .tasks > .task');

    for (let item = 0; item < tasks.length; item++) {

        tasks[item].childNodes[1].click();
    }
});

// evento para limpiar columna 'inprogress'
let deleteInProgress = document.getElementsByClassName('delete')[1];

deleteInProgress.addEventListener('click', function(e) {
    
    let tasks = document.querySelectorAll('.inprogress > .tasks > .task');

    for (let item = 0; item < tasks.length; item++) {

        tasks[item].childNodes[1].click();
    }
});

// evento para limpiar columna 'done'
let deleteDone = document.getElementsByClassName('delete')[2];

deleteDone.addEventListener('click', function(e) {
    
    let tasks = document.querySelectorAll('.done > .tasks > .task');

    for (let item = 0; item < tasks.length; item++) {
        
        tasks[item].childNodes[1].click();
    }
});

/*

// Aplicar dark mode
function darkMode() {
    var body = document.body;
    body.className = "dark";
}

// Aplicar light mode
function lightMode() {
    var body = document.body;
    body.classList.remove("dark");
}

// Aplicar mode selected
function changeMode() {
    let buttomState = document.getElementById("switchButton").checked;
    
    if (buttomState) {
        darkMode();
    } else {
        lightMode();
    }
}
*/