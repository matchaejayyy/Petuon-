/* eslint-disable react-hooks/rules-of-hooks */
import WhiteContainer from "./WhiteContainer"
import Sidebar from "./SideBar";
import { useState, ChangeEvent, FormEvent, useRef} from "react"
import {RotateCcw, SquarePlus, Save, Trash2 } from "lucide-react";

type ToDoList = { // Container for the each task element that it contains
    text: string
    createdAt: Date
    dueAt: Date
    completed: boolean
}

const ToDoListComponent: React.FC = () => {
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


    const [displayTime, setdisplayTime] = useState<string>("")
    const [editDisplayTime, seteditDisplayTime] = useState<string>("")
    
    const [isEditing, setIsEditing] = useState(false);
    const lastTaskRef = useRef<HTMLLIElement | null>(null);

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
        // eslint-disable-next-line no-constant-condition, no-constant-binary-expression
        if (filterType === "default" || "later" || "near" || "noDue" || "pastDue") {
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

        if (lastTaskRef.current) {
            lastTaskRef.current.scrollIntoView({
                behavior: "smooth",
                block: "end", 
            });
        }
    }

    const handleDateChange = (e:ChangeEvent<HTMLInputElement>) => {

        setDate(e.target.value) 
    } 

    const handleTimeChange = (e:ChangeEvent<HTMLInputElement>) => {
        setTime(e.target.value) // stores the value of the time set\
        const displaytime = new Date(new Date().toLocaleDateString() + " " + e.target.value + ":00").toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        setdisplayTime(displaytime)
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
        setIsEditing(false)
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
        setIsEditing(true)
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
        setIsEditing(false)
        setTasks(tasks.map((task, i) =>
            i === index ? {...task, text: editText, dueAt: editTaskDateTime()} : task
           
        ));
        setTasksBackup(tasksBackup.map((task, i) =>
            i === index ? {...task, text: editText, dueAt: editTaskDateTime()} : task
        ));
        cancelEditing()

        if (editText.trim() === "") {
            setTasks(tasks.filter((_, i) => i !== index));
            setTasksBackup(tasksBackup.filter((_, i) => i !== index))
        }
    }

    const handleTimeEditChange = (e:ChangeEvent<HTMLInputElement>) => {
        setEditTime(e.target.value)
        const displaytime = new Date(new Date().toLocaleDateString() + " " + e.target.value + ":00").toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        seteditDisplayTime(displaytime)
        console.log(editDisplayTime)
    }

    const handleDateEditChange = (e:ChangeEvent<HTMLInputElement>) => {
        setEditDate(e.target.value)
    }



    return (
        <>  
            <div className="bg-[#657F83] ml-10 mt-[2.5rem] pb-[35rem] rounded-[1.5rem] w-[81.5rem]">
                <div>
                    <div className="fixed top-[9rem] ml-5">
                        <label className="bg-[#2C2C2C] rounded-[0.6rem] pl-2 pr-2 pt-1 pb-1.5 text-white ">Sort</label>
                        
                        <button className={`rounded-[0.7rem] pl-2 pr-2 pt-0.5 pb-1 text-757575 ml-2 hover:bg-[#FF5349] hover:text-white font-inter text-[#757575] ${filterType === "default" ? "bg-[#FF5349] text-white" : "bg-white "}`}
                        onClick={() => filteredTasks("default")}>
                            Default
                        </button>
                        <button  className={` rounded-[0.7rem] pl-2 pr-2 pt-0.5 pb-1 text-757575 ml-2 hover:bg-[#FF5349] hover:text-white font-inter text-[#757575] ${filterType === "noDate" ? "bg-[#FF5349] text-white" : "bg-white"}`}
                        onClick={() => filteredTasks("noDate")}>
                            NoDue
                        </button>
                        <button className={`rounded-[0.7rem] pl-2 pr-2 pt-0.5 pb-1 text-757575 ml-2 hover:bg-[#FF5349] hover:text-white font-inter text-[#757575] ${filterType === "near" ? "bg-[#FF5349] text-white" : "bg-white"}`}
                        onClick={() => filteredTasks("near")}>
                            Near
                        </button>
                        <button  className={` rounded-[0.7rem] pl-2 pr-2 pt-0.5 pb-1 text-757575 ml-2 hover:bg-[#FF5349] hover:text-white font-inter text-[#757575] ${filterType === "later" ? "bg-[#FF5349] text-white" : "bg-white"}`}
                        onClick={() => filteredTasks("later")}>
                            Later
                        </button>
                        <button className={` rounded-[0.7rem] pl-2 pr-2 pt-0.5 pb-1 text-757575 ml-2 hover:bg-[#FF5349] hover:text-white font-inter text-[#757575] ${filterType === "pastDue" ? "bg-[#FF5349] text-white" : "bg-white"}`}
                        onClick={() => filteredTasks("pastDue")}>
                            PastDue
                        </button>
                    </div>
                    <form onSubmit={addTask} 
                    className="fixed left-[11.6rem] top-[12rem] w-[78.5rem] bg-white pt-3 pb-3 rounded-lg">   

                        <button type="submit"
                        className="ml-5 mt-2 text-2xl text-[#719191] w-10 pb-[0.3rem] rounded-lg"
                        ><SquarePlus size={25}/></button>

                        <input 
                        className="ml-1  text-lg outline-none w-[46rem] overflow-hidden text-ellipsis"
                        type="text " 
                        placeholder="enter a task" 
                        value = {task}
                        onChange={handleTextChange}
                        required
                        />
                        
                        <label className={`absolute right-[21rem] top-[1.15rem] text-[1rem] outline-none ${time === "--:-- --" ? "text-transparent select-none pointer-events-none" : "" }`}>{displayTime}</label>
                        <input
                        className="absolute right-[19rem] top-[1.30rem] text-[0.9rem] outline-none w-[1.8rem]  "
                        type="time"
                        value={time}
                        onChange={handleTimeChange}
                        />

                        <button type="button" onClick={() => setTime("--:-- --")}
                           className="absolute right-[17rem] top-[1.4rem] text-2xl"
                        ><RotateCcw size={20}/></button>


                        <label className={`absolute right-[9rem] top-[1.15rem] text-[1rem] outline-none ${date === "mm/dd/yyyy" ? "text-transparent select-none pointer-events-none" : "" }`}>{date.split('-').reverse().join('-')}</label>
                        <input 
                        className="absolute right-[7rem] top-4 text-[1.2rem] w-[1.57rem] outline-none"
                        type="date" 
                        value={date}
                        onChange={handleDateChange}
                        />
                        
                        <button type="button" onClick={()=> setDate("mm/dd/yyyy")}
                          className="absolute right-[5rem] top-[1.5rem] text-2xl"
                        ><RotateCcw size={20}/></button>
                    </form>
                </div>

                <div className="w-[78.5rem] h-[23rem] fixed left-[11.5rem] top-[17rem] rounded-lg overflow-auto">
                    <ul>
                        {tasks.map((task, index)=>
                            <li key={index}
                            className="bg-white mt-3 font-bold pt-4 pb-4 rounded-lg whitespace-nowrap flex" 
                            ref={index === tasks.length - 1 ? lastTaskRef : null}
                            >
                                
                                <input 
                                className="absolute left-[1.9rem] translate-y-[0.1rem] peer appearance-none w-5 h-5 border-2 border-black rounded-full bg-white checked:bg-[#719191] checked:border-black transition-colors cursor-pointer"
                                type="checkbox"
                                onChange={() => completeToggle(index)}
                                />
                                {editIndex === index ? (
                                    <div>
                                        <input 
                                        className="absolute left-[5rem] opacity-45 w-[46rem] outline-none overflow-hidden text-ellipsis"
                                        type="text"
                                        value={editText}
                                        onChange={handleTextEditChange}
                                        placeholder={editText === "" ? "Input Task" : ""}
                                        />

                                        <label className={` opacity-45 absolute translate-x-[53.7rem] translate-y-[0.1rem] text-[0.85rem] outline-none ${editTime === "--:-- --" ? "text-transparent select-none pointer-events-none" : "" }`}>{editDisplayTime}</label>
                                        <input
                                        className="absolute left-[57.7rem] opacity-45 text-[0.9rem] w-[1.9rem] mt-[-0.1rem]"
                                        type="time"
                                        value={editTime}
                                        onChange={handleTimeEditChange}
                                        />
                                        <button type="button" onClick={() => {setEditTime("--:-- --"); console.log(editDisplayTime)}}
                                        className="absolute left-[60.5rem] opacity-45 text-[1.2rem] translate-y-[-0.3rem] z-50 mt-[0.3rem]"
                                            ><RotateCcw size={20}/></button>
                                        
                                        <label className={`absolute left-[64.8rem] opacity-45 text-[0.9rem] translate-y-[0.1rem] ${editDate === "mm/dd/yyyy" ? "text-transparent select-none pointer-events-none" : "" }`}>{editDate.split('-').reverse().join('-')}</label>
                                        <input
                                        type="date"
                                        className="absolute right-[6.9rem] opacity-45 mt-[-0.2rem] w-[1.33rem] text-[1.2rem] translate-y-[-0.1rem] "
                                        value={editDate}
                                        onChange={handleDateEditChange}
                                        />
                                        
                                        
                                         <button type="button" 
                                         className="absolute left-[72rem] opacity-45 text-[1.2rem] translate-y-[-0.3rem] mt-[0.3rem]"
                                         onClick={()=> setEditDate("mm/dd/yyyy")}
                                         ><RotateCcw size={20}/></button>
                                        <button onClick={() => saveEditing(index)}
                                        className="absolute right-[3rem] mt-[0rem]"
                                            ><Save size={20}/></button> 
                                    </div>
                                 ) : (
                                <div onClick={() => startEditing(index, task.text, task.dueAt)} className={`${task.dueAt.getTime() !== 0 && task.dueAt.getTime() < new Date().getTime() ? "text-red-500" : ""}`}>
                                    <span className="absolute left-[5rem] max-w-[46.3rem] overflow-hidden text-ellipsis whitespace-nowrap">
                                    {task.text}
                                    </span>

                                    {task.dueAt.getTime() !== 0 && (
                                        <span>
                                            <span className="absolute left-[53.6rem]">  
                                                {task.dueAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                            </span>
                                            <span className="absolute left-[64.6rem]"> 
                                                 
                                            {task.dueAt.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' }).slice(3,6) + task.dueAt.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' }).slice(0,3) + task.dueAt.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' }).slice(6,10)}
                                            </span>
                                        </span>
                                    )}
                                </div>

                                )}
                                <button disabled={isEditing && editIndex !== index} onClick={() => deleteTask(index)} className={`ml-[75.9rem] ${isEditing === true && editIndex === index ? "opacity-45": "" }`}><Trash2 size={20}/></button>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </>
    )
}


//the ToDoListComponent is called and displayed within the whitecontainer
const ToDoList = () => {
    return(
        <>  
            <WhiteContainer>
                <h1 className="text-[2rem] font-serif font-bold tracking-normal mb-4 ml-8 mt-7">To Do List</h1>
              <ToDoListComponent/>
            </WhiteContainer>
            <Sidebar/> 
        </>
    )
}

export default ToDoList