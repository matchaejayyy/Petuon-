/* eslint-disable react-hooks/exhaustive-deps */
import { useState, ChangeEvent, FormEvent, useRef, useEffect} from "react"
import {RotateCcw, SquarePlus, Save, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useToDoList } from "../hooks/useToDoList";

import { ToDoListProps } from "../types/ToDoListTypes"

const ToDoListComponent: React.FC<ToDoListProps>  = ({variant = "default" }) => {
    // Creates Date
    const [date, setDate] = useState<string>("mm/dd/yyyy"); 
    // Creates Time
    const [time, setTime] = useState<string>("--:-- --"); 
    // Creates Task
    const [task, setTask] = useState<string>("");

    const [displayTime, setdisplayTime] = useState<string>("");

    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editText, setEditText] = useState<string>("");
    const [editTime, setEditTime] = useState<string>("");
    const [editDate, setEditDate] = useState<string>("");

    const [isEditing, setIsEditing] = useState(false);

    const lastTaskRef = useRef<HTMLLIElement | null>(null);

    const [isAnimatingDropDown, setIsAnimatingDropDown] = useState<boolean>(false); //para sa dropdown animation
    const colors = ["#FE9B72", "#FFC973", "#E5EE91", "#B692FE"]; 

    const { 
        tasksBackup,
        filterType, setFilterType,  
        tasks, setTasks,  
        addTask, deleteTask, toggleCompleteTask, saveEditedTask
    } = useToDoList();

    // Refreshes Tasks
    useEffect(() => {
        const interval = setInterval(() => {
            setTasks((prevTasks) =>
                prevTasks.map((task) => {
                    return task;
                
             })
            );
        }, 1000);

        return () => clearInterval(interval);
    }, []);


    function taskDateTime(){ // returns a new Date with the set condition
        if (date === "mm/dd/yyyy" &&  time === "--:-- --" ) { // if date and time are empty 
            return new Date(0) // date is set to 0
        } else {
            const taskDate = date === "mm/dd/yyyy" ? new Date().toLocaleDateString(): date; // if the value of date is not change with time it will set to today
            const taskTime = time === "--:-- --" ? "23:59": time; // if the value of time is not change with date it will set to the last minute of today
            return new Date(taskDate + " " + taskTime + ":00"); 
        }
    }
 
    function editTaskDateTime(){
        if (editDate === "mm/dd/yyyy" && editTime === "--:-- --") {
            return new Date(0)
        } else{
            const taskDate = editDate === "mm/dd/yyyy" ? new Date().toLocaleDateString(): editDate; 
            const taskTime = editTime === "--:-- --" ? "23:59": editTime; 
            return new Date(taskDate + " " + taskTime + ":00"); 
        }
    }

    const handleAddTask = async (e: FormEvent) => { // when form is submitted 
        e.preventDefault();
        const newTask = {
            task_id: uuidv4(),
            text: task, // the description of the task
            createdAt: new Date(), // stores the Date from when it is created
            dueAt: taskDateTime(), // from the function taskDateTime that stores the set Date
            completed: false, // the status of if it is complete or not
        }
            
        if (taskDateTime() < new Date() && !(time === "--:-- --" && date == "mm/dd/yyyy")) {
            alert("Cannot set time in current or past");
            return;
        }

            if (lastTaskRef.current) {
                lastTaskRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "end", 
                });
            }
            
            setIsAnimatingDropDown(true);
            setTimeout(() => {
                setIsAnimatingDropDown(false);
            }, 10); //duration sng drop down

            setTask(""); // resets the value of the Task
            setDate("mm/dd/yyyy");  // resets the value of the Date
            setTime("--:-- --"); // resets the value of the Time
            
            await addTask(newTask);
    }

    const handleDateChange = (e:ChangeEvent<HTMLInputElement>) => {
        setDate(e.target.value) ;
    } 

    const handleTimeChange = (e:ChangeEvent<HTMLInputElement>) => {


        setTime(e.target.value); // stores the value of the time set
        const displaytime = new Date(new Date().toLocaleDateString() + " " + e.target.value + ":00").toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        setdisplayTime(displaytime);
    }

    const handleTextChange = (e:ChangeEvent<HTMLInputElement>) => {
        setTask(e.target.value); // stores the description of the task
    };
    
    const completeToggle = async (task_id: string) => {
        await toggleCompleteTask(task_id);
    }

    const handleDeleteTask = async (task_id: string) => {
        try {
            setIsEditing(false);
            cancelEditing();
            await deleteTask(task_id);
        }
        catch (error) {
            console.error('Error deleting task:', error);
        }
    }

    function filteredTasks(filterType: string) {
        const now = new Date();

        let filteredTasks = tasksBackup;

        switch (filterType) {
            case "noDate":
                filteredTasks = tasksBackup.filter((task) => task.dueAt.getTime() === 0);
                break;
            case "near":
                filteredTasks = tasksBackup
                .filter((task) => task.dueAt.getTime() > now.getTime())
                .sort((a, b) => a.dueAt.getTime() - b.dueAt.getTime());
                break;
            case "later":
                filteredTasks = tasksBackup
                .filter((task) => task.dueAt.getTime() > now.getTime())
                .sort((a, b) => b.dueAt.getTime() - a.dueAt.getTime());
                break;
            case "default":
                filteredTasks = tasksBackup
                break;
            case "pastDue":
                filteredTasks = tasksBackup.filter((task) =>task.dueAt.getTime() !== 0 && task.dueAt.getTime() < now.getTime());
                break;
            default:
                filteredTasks = tasksBackup
                break;
        }
        
        setFilterType(filterType);
        setTasks(filteredTasks);
        
    }

    const startEditing = (index:number, text: string, date_time: Date) => {
        setEditIndex(index);
        setEditText(text);
        setIsEditing(true);
        if (date_time.toTimeString().slice(0, 5) === "08:00" && date_time.toISOString().split("T")[0] === "1970-01-01"){
            setEditTime("--:-- --");
        } else {
            setEditTime(date_time.toTimeString().slice(0, 5));
        }
        if (date_time.toISOString().split("T")[0] === "1970-01-01") {
            setEditDate("mm/dd/yyyy");
        } else {
            setEditDate(date_time.toISOString().split("T")[0]);
        }
    };

    const handleTextEditChange = (e:ChangeEvent<HTMLInputElement>) => {
        setEditText(e.target.value);
    }

    function cancelEditing() {
        setEditIndex(null);
        setEditText("");
    }

    async function saveEditing(task_id: string) {
        setIsEditing(false);
        cancelEditing();

        if (editTaskDateTime() < new Date() && !(editTime === "--:-- --" && editDate == "mm/dd/yyyy")) {
            alert('The due date and time cannot be in the past.');
            return;
          }

        await saveEditedTask(task_id, editText, editTaskDateTime())
    }

    const handleTimeEditChange = (e:ChangeEvent<HTMLInputElement>) => {
        setEditTime(e.target.value);
    }

    const handleDateEditChange = (e:ChangeEvent<HTMLInputElement>) => {
        setEditDate(e.target.value);
    }

    const displayStatus = (date: Date) => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        if (date.toLocaleDateString() === "1/1/1970")
            return "NoDue"
        else if (date.toLocaleDateString() === new Date().toLocaleDateString()) {
            return "Today"
        } else if (date.toLocaleDateString() === tomorrow.toLocaleDateString()) {
            return "Tomorrow"
        } else {
            return "Upcoming"
        }
    }

    if (variant === "default") {
        return (
            <>  
                <div className="font-serif font-bold text-[#354F52] flex space-x-2 mt-[-4rem] mb-0 my-3 ml-8">
                    <div>
                            <button 
                            className={`px-4 py-2 rounded-md ${filterType === "default" ? "font-serif font-bold bg-[#657F83] text-white" : "bg-none"} hover:scale-110"}`}
                            onClick={() => filteredTasks("default")}>
                                Default
                            </button>

                            <button  
                            className={`px-4 py-2 rounded-md ${filterType === "noDate" ? "font-serif font-bold bg-[#657F83] text-white" : "bg-none"} hover:scale-110`}
                            onClick={() => filteredTasks("noDate")}>
                                NoDue
                            </button>

                            <button 
                            className={`px-4 py-2 rounded-md ${filterType === "near" ? "font-serif font-bold bg-[#657F83] text-white" : "bg-none"} hover:scale-110`}
                            onClick={() => filteredTasks("near")}>
                                Near
                            </button>

                            <button  
                            className={`px-4 py-2 rounded-md ${filterType === "later" ? "font-serif font-bold bg-[#657F83] text-white" : "bg-none"} hover:scale-110`}
                            onClick={() => filteredTasks("later")}>
                                Later
                            </button>

                            <button 
                            className={`px-4 py-2 rounded-md ${filterType === "pastDue" ? "font-serif font-bold bg-[#657F83] text-white" : "bg-none"} hover:scale-110`}
                            onClick={() => filteredTasks("pastDue")}>
                                PastDue
                            </button>
            
                        <form 
                        onSubmit={handleAddTask} 
                        className="fixed text-black left-[10rem] top-[10rem] w-[84rem] bg-white  pt-3 pb-3 rounded-lg shadow-md"
                        >   

                            <button type="submit"
                            className="ml-5 mt-2 text-2xl text-black transform transition-transform duration-300 hover:scale-110 active:scale-50">
                                <SquarePlus size={25} color="#354f52"/>
                            </button>

                            <input 
                            className="ml-2 text-lg text-black outline-none w-[46rem] overflow-hidden text-ellipsis transform translate-y-[-5px] bg-transparent  "
                            style={{fontFamily: '"Signika Negative", sans-serif' }}
                            type="text " 
                            placeholder="Enter a task" 
                            value = {task}
                            onChange={handleTextChange}
                            required
                            />
                            
                            <label 
                            className={`absolute right-[21rem] top-[1.4rem] text-[1rem] outline-none ${time === "--:-- --" ? "text-transparent select-none pointer-events-none" : "" }`}>
                                {displayTime}
                            </label>

                            <input
                            className="absolute right-[18.9rem] top-[1.4rem] text-[0.9rem] outline-none w-[1.8rem] bg-transparent text-white  scale-125 transform transition-transform duration-200 hover:scale-150 active:scale-110 "
                            type="time"
                            value={time}
                            onChange={handleTimeChange}
                            />

                            <button 
                            type="button" 
                            onClick={() => setTime("--:-- --")}
                            className="absolute right-[17rem] top-[1.5rem] text-2xl transform transition-transform duration-400 hover:scale-125 active:rotate-[-360deg]">
                                <RotateCcw size={20} color="black"  />
                            
                            </button>

                            <label 
                            className={`absolute right-[9rem] top-[1.4rem] text-[1rem] outline-none ${date === "mm/dd/yyyy" ? "text-transparent select-none pointer-events-none" : "" }`}>
                                {date.split('-').reverse().join('-')}
                            </label>
                        
                            <input 
                            className="absolute right-[7rem] top-[1.2rem] text-[1.2rem] w-[1.55rem] outline-none bg-transparent transform transition-transform duration-200 hover:scale-125 active:scale-90"
                            type="date" 
                            value={date}
                            onChange={handleDateChange}
                            />
                            
                            <button 
                            type="button" 
                            onClick={() => setDate("mm/dd/yyyy")}
                            className="absolute right-[5rem] top-[1.5rem] text-2xl transform transition-transform duration-400 hover:scale-125 active:rotate-[-360deg]">
                                <RotateCcw size={20} color="black" />
                            </button>
                        </form>
                    </div>

                    <div  className="font-normal flex space-x-2 mt-[-15px] mb-0 my-3 ml-8"  style={{ fontFamily: '"Signika Negative", sans-serif' }}>
                    {tasks.length === 0 ? (
                        <h1 className="text-center text-gray-500 ml-[7rem] mt-[10.5rem] text-2xl">No tasks available.</h1>
                    ) : (
                        <div className="w-[84.4rem] h-[28rem] fixed left-[10rem] top-[14rem] rounded-lg overflow-auto [&::-webkit-scrollbar]:w-2">
                            <ul>
                                {tasks.map((task, index)=>
                                    <li key={index}
                                    className={`bg-white mt-3 pt-4 pb-4 rounded-lg whitespace-nowrap  group flex shadow-md  hover:shadow-lg transition-transform duration-1000 ${isAnimatingDropDown ? 'transform translate-y-[-65px] opacity-100' : ''}`}
                                    style={{ backgroundColor: colors[index % colors.length] }} // Dynamic color
                                    ref={index === tasks.length - 1 ? lastTaskRef : null}>

                                        <input 
                                        className="absolute left-[1rem] translate-y-[0.1rem] peer appearance-none w-5 h-5 border-1 border-black rounded-full bg-white checked:bg-[#719191] checked:border-black transition-colors cursor-pointer"
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => completeToggle(task.task_id!)}
                                        />
                                    
                                        {editIndex === index ? (
                                            <div>
                                                <input 
                                                className="absolute left-[3rem] opacity-45 w-[46rem] outline-none overflow-hidden text-ellipsis bg-transparent "
                                                type="text"
                                                value={editText}
                                                onChange={handleTextEditChange}
                                                placeholder={editText === "" ? "Input Task" : ""}
                                                />

                                                <label className={`opacity-45 ml-[-0.1rem] absolute translate-x-[53.7rem] translate-y-[0.1rem] text-[0.85rem] outline-none ${editTime === "--:-- --" ? "text-transparent select-none pointer-events-none" : "" }`}>{new Date(new Date().toLocaleDateString() + " " + editTime + ":00").toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</label>
                                            
                                                <input
                                                className="absolute left-[56.9rem] opacity-45 text-[0.9rem] w-[1.9rem] mt-[-0.1rem] bg-transparent outline-none scale-110 transform transition-transform duration-200 hover:scale-125 active:scale-90"
                                                type="time"
                                                value={editTime}
                                                onChange={handleTimeEditChange}
                                                />

                                                <button type="button" onClick={() => {setEditTime("--:-- --"); console.log(editTime);}}

                                                className="absolute left-[59rem] opacity-45 text-[1.2rem] translate-y-[-0.3rem] z-50 mt-[0.3rem] transform transition-transform duration-400 hover:scale-125 active:rotate-[-360deg]"><RotateCcw size={20}/></button>
                                            
                                                <label className={`absolute ml-[-0.1rem]  mt-[-0.1rem] left-[64.8rem] opacity-45 text-[0.9rem] translate-y-[0.1rem] ${editDate === "mm/dd/yyyy" ? "text-transparent select-none pointer-events-none" : "" }`}>{editDate.split('-').reverse().join('/')}</label>

                                                <input
                                                type="date"
                                                className="absolute right-[12rem] opacity-45 mt-[-0.2rem] w-[1.33rem] text-[1.2rem] translate-y-[-0.1rem] bg-transparent outline-none transform transition-transform duration-200 hover:scale-125 active:scale-90"
                                                value={editDate}
                                                onChange={handleDateEditChange}
                                                />
                                            
                                                <button type="button" 
                                                className="absolute left-[72.2rem] opacity-45 text-[1.2rem] translate-y-[-0.3rem] mt-[0.3rem] transform transition-transform duration-400 hover:scale-125 active:rotate-[-360deg]"
                                                onClick={()=> setEditDate("mm/dd/yyyy")}><RotateCcw size={20}/></button>

                                                <button onClick={() => saveEditing(task.task_id!)}className="absolute right-[7rem] mt-[0rem] transform transition-transform duration-200 hover:scale-125 active:scale-90"><Save size={20}/></button> 

                                            </div>

                                        ) : (

                                            <div 
                                            onClick={() => startEditing(index, task.text, task.dueAt)} 
                                            className={`${task.dueAt.getTime() !== 0 && task.dueAt.getTime() < new Date().getTime() ? "text-red-800" : ""}`}
                                            >
                                        
                                                <span 
                                                className="absolute left-[3rem] max-w-[46.3rem] overflow-hidden text-ellipsis whitespace-nowrap">
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
                                    
                                        <button 
                                        disabled={isEditing && editIndex !== index} onClick={() => handleDeleteTask(task.task_id)} 
                                        className={`ml-[81.5rem] text-red-600 opacity-0 group-hover:opacity-100 transform transition-transform duration-200 hover:scale-125 active:scale-90${isEditing === true && editIndex === index ? "opacity-45" : ""}`}>
                                            <Trash2 size={20}/>
                                        </button>

                                    </li>
                                )}   
                            
                            </ul>
                        </div>
                    )}
                    </div>
                </div>
            </>
        )
    } else {
        return (
            <>
                <div>
                    <h1>My Tasks</h1>
                    <ul>
                    {tasks
                    .sort((a, b) => {
                            if (a.dueAt && b.dueAt) {
                            if (a.dueAt.getTime() === 0) return 1; 
                            if (b.dueAt.getTime() === 0) return -1; 
                            return a.dueAt.getTime() - b.dueAt.getTime(); 
                        }
                            return 0; 
                        }).slice(0, 5).map((task, index) => 
                            <li key={index} className="border-t-2 mt-[1rem]">
                                <div className="">
                                    <input 
                                    className="ml-[0.7rem] mt-[0.7rem] translate-y-[0.1rem] peer appearance-none w-5 h-5 border-[0.05rem] border-black rounded-full bg-white checked:bg-[#719191] checked:border-black transition-colors cursor-pointer"
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => completeToggle(task.task_id!)}
                                    />

                                    <span className="absolute ml-9 mt-[0.7rem]">{task.text}</span>
                                    <span className="ml-[25rem]">{displayStatus(task.dueAt)}</span>
                                </div>
                            </li>
                        )}
                    </ul>
                    <button className="fixed bottom-[17rem] mt-4 w-[35rem] bg-teal-600 text-white py-2 rounded-br-[1.5rem] rounded-bl-[1.5rem] hover:bg-teal-700">View all</button>
                </div>
                {tasks.length <= 4 && (
                    <div className="mt-4 text-center text-gray-500">No more tasks</div>
                )}
            </>
        )   
    }

}

export default ToDoListComponent