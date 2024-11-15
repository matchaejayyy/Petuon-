/* eslint-disable react-hooks/rules-of-hooks */
import WhiteContainer from "./WhiteContainer"
import Sidebar from "./SideBar";
import { useState, ChangeEvent, FormEvent } from "react"

type ToDoList = { // Container for the each task element that it contains
    text: string
    createdAt: Date
    dueAt: Date
    completed: boolean
}

const TodoListComponent: React.FC = () => {
    const [tasks, setTasks] = useState<ToDoList[]>([]); // stores tasks within the Array
    const [tasksBackup, setTasksBackup] = useState<ToDoList[]>([]); // a preserved version of the task use in the filter functionaility
    const [task, setTask] = useState<string>(""); // creates tasks
    const [date, setDate] = useState<string>("mm/dd/yyyy"); // creates date
    const [time, setTime] = useState<string>("--:-- --") // creates time

    const [filterType, setFilterType] = useState<string>("default")

    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editText, setEditText] = useState<string>("");

    const [editTime, setEditTime] = useState<string>("");
    const [editDate, setEditDate] = useState<string>("");

    function taskDateTime(){ // returns a new Date with the set condition
        if (date === "mm/dd/yyyy" &&  time === "--:-- --" ) { // if date and time are empty 
            return new Date(0) // date is set to 0
        } else {
            const taskDate = date === "mm/dd/yyyy" ? new Date().toLocaleDateString(): date; // if the value of date is not change with time it will set to today
            const taskTime = time === "--:-- --" ? "23:59": time; // if the value of time is not change with date it will set to the last minute of today
            return new Date(taskDate + " " + taskTime + ":00") 
        }
    }

    function editTaskDateTime(){
        if (editDate === "mm/dd/yyyy" && editTime === "--:-- --") {
            return new Date(0)
        } else{
            const taskDate = editDate === "mm/dd/yyyy" ? new Date().toLocaleDateString(): editDate; 
            const taskTime = editTime === "--:-- --" ? "23:59": editTime; 
            return new Date(taskDate + " " + taskTime + ":00") 
        }
    }

    
    const addTask = (e: FormEvent) => { // when form is submitted 
        e.preventDefault(); // prevent from redirecting to a new page when submitted

        const newTask = {
            text: task, // the description of the task
            createdAt: new Date(), // stores the Date from when it is created
            dueAt: taskDateTime(), // from the function taskDateTime that stores the set Date
            completed: false // the status of if it is complete or not
        }

        // stores the new task in an array.
        if (filterType == "default") {
            setTasks([...tasks, // "... tasks" copies the element from the array and stores it previously
                        newTask  
                    ]);
         } 

         
        // stores the new task in a backup array.
        setTasksBackup([...tasksBackup,  // "... tasks" copies the element from the tasks array and stores it in the backupTasks 
            newTask
        ]);

        setTask("") // resets the value of the Task
        setDate("mm/dd/yyyy")  // resets the value of the Date
        setTime("--:-- --") // resets the value of the Time
        console.log(tasks)
    }

    const handleDateChange = (e:ChangeEvent<HTMLInputElement>) => {
        console.log(new Date(e.target.value).toISOString().split("T")[0])
        setDate(e.target.value) 
    } 

    const handleTimeChange = (e:ChangeEvent<HTMLInputElement>) => {
        setTime(e.target.value) // stores the value of the time set\
        console.log(e.target.value)
    }

    const handleTextChange = (e:ChangeEvent<HTMLInputElement>) => {
        setTask(e.target.value) // stores the description of the task
    };
    
    function completeToggle(index: number) {
        setTasks(tasks.map((task, i) =>
            i === index ? {...task, completed: !task.completed} : task
    ));
    }

    function deleteTask(index: number){
        setTasks(tasks.filter((_, i) => i !== index));
        setTasksBackup(tasksBackup.filter((_, i) => i !== index))
        cancelEditing()
    }

    function filteredTasks(filterType: string) {
        const now = new Date();

        let filteredTasks = tasksBackup

        switch (filterType) {
            case "noDate":
                filteredTasks = tasksBackup.filter((task) => task.dueAt.getTime() === 0);
                break
            case "near":
                filteredTasks = tasksBackup.filter((task) => task.dueAt.getTime() > now.getTime());
                break
            case "later":
                filteredTasks = tasksBackup.filter((task) => task.dueAt.getTime() > now.getTime()).reverse()
                break
            case "default":
                filteredTasks = tasksBackup
                break
            case "pastDue":
                filteredTasks = tasksBackup.filter((task) =>task.dueAt.getTime() !== 0 && task.dueAt.getTime() < now.getTime())
                break
            default:
                filteredTasks = tasksBackup
                break;
        }
        
        setFilterType(filterType)
        setTasks(filteredTasks)
        
    }

    const startEditing = (index:number, text: string, date_time: Date) => {
        setEditIndex(index)
        setEditText(text)
       
        if (date_time.toTimeString().slice(0, 5) === "08:00" && date_time.toISOString().split("T")[0] === "1970-01-01"){
            setEditTime("--:-- --")
        } else {
            setEditTime(date_time.toTimeString().slice(0, 5))
        }
        if (date_time.toISOString().split("T")[0] === "1970-01-01") {
            setEditDate("mm/dd/yyyy")
        } else {
            setEditDate(date_time.toISOString().split("T")[0])
        }
    };

    const handleTextEditChange = (e:ChangeEvent<HTMLInputElement>) => {
        setEditText(e.target.value)
    }

    function cancelEditing() {
        setEditIndex(null);
        setEditText("")
    }

    function saveEditing(index: number) {
        setTasks(tasks.map((task, i) =>
            i === index ? {...task, text: editText, dueAt: editTaskDateTime()} : task
           
        ));
        setTasksBackup(tasksBackup.map((task, i) =>
            i === index ? {...task, text: editText, dueAt: editTaskDateTime()} : task
        ));
        cancelEditing()
    }

    const handleTimeEditChange = (e:ChangeEvent<HTMLInputElement>) => {
        setEditTime(e.target.value)
    }

    const handleDateEditChange = (e:ChangeEvent<HTMLInputElement>) => {
        setEditDate(e.target.value)
    }

    return (
        <>  
            <div className="ml-40 overflow-auto h-96">
                <div>
                    <div>
                        <button onClick={() => filteredTasks("default")}>Default</button>
                        <button  onClick={() => filteredTasks("noDate")}>No Date</button>
                        <button  onClick={() => filteredTasks("near")}>Near</button>
                        <button  onClick={() => filteredTasks("later")}>Later</button>
                        <button onClick={() => filteredTasks("pastDue")}>Past Due</button>
                    </div>
                    <form onSubmit={addTask}>   
                        <button type="submit">+</button>
                        <input 
                        type="text" 
                        placeholder="enter a task" 
                        value = {task}
                        onChange={handleTextChange}
                        required
                        />
                        <input
                        type="time"
                        value={time}
                        onChange={handleTimeChange}
                        />
                        <button type="button" onClick={() => setTime("--:-- --")}>Reset Time</button>
                        <input 
                        type="date" 
                        value={date}
                        onChange={handleDateChange}
                        />
                        <button type="button" onClick={()=> setDate("mm/dd/yyyy")}>Reset Date</button>
                    </form>
                </div>

                <div className="bg-slate-100">
                    <ul>
                        {tasks.map((task, index)=>
                            <div key={index}>
                                <input 
                                type="checkbox"
                                onChange={() => completeToggle(index)}
                                />
                                {editIndex === index ? (
                                    <>
                                        <input 
                                        type="text"
                                        value={editText}
                                        onChange={handleTextEditChange}
                                        />
                                        <input
                                        type="time"
                                        value={editTime}
                                        onChange={handleTimeEditChange}
                                        />
                                        <button type="button" onClick={() => setEditTime("--:-- --")}>Reset Time</button>
                                        <input
                                        type="date"
                                        value={editDate}
                                        onChange={handleDateEditChange}
                                        />
                                         <button type="button" onClick={()=> setEditDate("mm/dd/yyyy")}>Reset Date</button>
                                        <button onClick={() => saveEditing(index)}>Save</button> 
                                    </>
                                 ) : (
                                <span onClick={() => startEditing(index, task.text, task.dueAt)}>
                                    {task.text } 
                                    {task.dueAt.getTime() !== 0 && (
                                        <>
                                            - {task.dueAt.toLocaleString().slice(11, 17)} {task.dueAt.toLocaleString().slice(20, 23)} - {task.dueAt.toLocaleString().slice(0, 11)}
                                        </>
                                    )}
                                </span>
                                )}
                                <button onClick={() => deleteTask(index)}>Del</button>
                            </div>
                        )}
                    </ul>
                </div>
            </div>
        </>
    )
}


const ToDoList = () => {
    return(
        <>  
            <WhiteContainer>
              <TodoListComponent/>
            </WhiteContainer>
            <Sidebar/> 
        </>
    )
}

export default ToDoList