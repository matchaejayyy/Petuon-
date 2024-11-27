/* eslint-disable react-hooks/rules-of-hooks */
import WhiteContainer from "../components/WhiteContainer"
import Sidebar from "../components/SideBar";
import { useState, ChangeEvent, FormEvent, useRef, useEffect} from "react"
import {RotateCcw, SquarePlus, Save, Trash2 } from "lucide-react";
import Clock from "../components/Clock";
import axios from 'axios';


interface ToDoList { // Container for the each task element that it contains
    task_id: number
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
    
    const [isEditing, setIsEditing] = useState(false);
    const lastTaskRef = useRef<HTMLLIElement | null>(null);

    const [isAnimatingDropDown, setIsAnimatingDropDown] = useState<boolean>(false); //para sa dropdown animation

    const colors = ["#FE9B72", "#FFC973", "#E5EE91", "#B692FE"]; 

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get('http://localhost:3002/getTask');
              const taskData = response.data.map((task: {task_id: BigInteger, text: string; created_at: Date; due_at: Date; completed: boolean }) => {
                const createdAt = new Date(task.created_at);
                const dueAt = new Date(task.due_at);

                return {
                    task_id: task.task_id,
                    text: task.text,
                    createdAt: createdAt,
                    dueAt: dueAt,
                    completed: task.completed,
                }
                
            });
          
            setTasks(taskData);
            setTasksBackup(taskData);
              
          } catch (err) {
            console.error('There was an error retrieving data!', err);
          }
        };
    
        fetchData(); 
      }, []);

    useEffect(() => { //updates tasks
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

    
    const addTask = async (e: FormEvent) => { // when form is submitted 
        e.preventDefault(); // prevent from redirecting to a new page when submitted

        try {
            
            const newTask = {
                task_id:  Math.floor(Math.random() * 1000000000),
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

            axios.post("http://localhost:3002/insertTask", newTask);
        
            setTask("") // resets the value of the Task
            setDate("mm/dd/yyyy")  // resets the value of the Date
            setTime("--:-- --") // resets the value of the Time
         
            setIsAnimatingDropDown(true);
            setTimeout(() => {
                setIsAnimatingDropDown(false);
            }, 0.01); //duration sng drop down

            

        } catch (err) {
            console.error('There was an error inserting Task', err)
        }


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
    
    const  completeToggle = async (task_id: number) => {
        try {
            const FindComplete = tasks.find(task => task.task_id ===  task_id);
            
            if (!FindComplete) return;
            const updateTask = !FindComplete.completed
           

            setTasks(tasks.map(task =>
                task.task_id === task_id ? {...task, completed: !task.completed} : task
            ));
            setTasksBackup(tasks.map(task => 
                task.task_id === task_id ? {...task, completed: !task.completed} : task
            ))
    
            await axios.patch(`http://localhost:3002/completeTask/${task_id}`, {
                completed: updateTask,
            });
            
           
        } catch (error) {
            console.error('Error completing task:', error);
        }
    }

    const deleteTask = async (task_id: number) => {
        try {
            await axios.delete(`http://localhost:3002/deleteTask/${task_id}`);
            setIsEditing(false)
            setTasks((prevTasks) => prevTasks.filter((task) => task.task_id !== task_id));
            setTasksBackup((prevTasks) => prevTasks.filter((task) => task.task_id !== task_id));
            cancelEditing()
        }
        catch (error) {
            console.error('Error deleting task:', error);
        }
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

    async function saveEditing(task_id: number) {
        try {
            const updatedText = editText.trim();
            const updatedDueAt = editTaskDateTime();

            setIsEditing(false)
            setTasks(tasks.map(task =>
                task.task_id === task_id ? {...task, text: updatedText, dueAt: updatedDueAt} : task
            
            ));
            setTasksBackup(tasksBackup.map(task =>
                task.task_id === task_id ? {...task, text: updatedText, dueAt: updatedDueAt} : task
            ));
            cancelEditing()

            const findTask = tasks.find(task => task.task_id === task_id)
            if (!findTask) return;
            const text = updatedText;
            const dueAt = updatedDueAt;
            console.log(text, dueAt)

            if (editText.trim() === "") {
                setTasks(tasks.filter(task => task.task_id !== task_id));
                setTasksBackup(tasksBackup.filter(task => task.task_id !== task_id))
                deleteTask(task_id)
            }

            await axios.patch(`http://localhost:3002/updateTask/${task_id}`, {
                text: text,
                dueAt: dueAt,
            });

            console.log(editTime)
        } catch (error) {
            console.log('There was an error updating task', error)
        }
    }

    const handleTimeEditChange = (e:ChangeEvent<HTMLInputElement>) => {
        setEditTime(e.target.value)
    }

    const handleDateEditChange = (e:ChangeEvent<HTMLInputElement>) => {
        setEditDate(e.target.value)
    }

    return (
        <>  
            <div className="font-serif font-bold text-[#354F52] flex space-x-2 mt-[-2rem] mb-0 my-3 ml-8 ">
                <div>
                        <button className={`px-4 py-2 rounded-md ${filterType === "default" ? "font-serif font-bold bg-[#657F83] text-white" : "bg-none"}`}
                        onClick={() => filteredTasks("default")}>
                            Default
                            
                        </button>
                        <button  className={`px-4 py-2 rounded-md ${filterType === "noDate" ? "font-serif font-bold bg-[#657F83] text-white" : "bg-none"}`}
                        onClick={() => filteredTasks("noDate")}>
                            NoDue
                        </button>
                        <button className={`px-4 py-2 rounded-md ${filterType === "near" ? "font-serif font-bold bg-[#657F83] text-white" : "bg-none"}`}
                        onClick={() => filteredTasks("near")}>
                            Near
                        </button>
                        <button  className={`px-4 py-2 rounded-md ${filterType === "later" ? "font-serif font-bold bg-[#657F83] text-white" : "bg-none"}`}
                        onClick={() => filteredTasks("later")}>
                            Later
                        </button>
                        <button className={`px-4 py-2 rounded-md ${filterType === "pastDue" ? "font-serif font-bold bg-[#657F83] text-white" : "bg-none"}`}
                        onClick={() => filteredTasks("pastDue")}>
                            PastDue
                        </button>
        
                    <form onSubmit={addTask} 
                    className="fixed text-black left-[10rem] top-[10rem] w-[84rem] bg-white  pt-3 pb-3 rounded-lg shadow-md">   

                        <button type="submit"
                        className="ml-5 mt-2 text-2xl text-black w-10 pb-[0.3rem] rounded-lg"
                        ><SquarePlus size={25} color="#354f52"  /></button>

                        <input 
                        className="ml-1 text-lg text-black outline-none w-[46rem] overflow-hidden text-ellipsis transform translate-y-[-5px] bg-transparent  "
                        style={{fontFamily: '"Signika Negative", sans-serif' }}
                        type="text " 
                        placeholder="Enter a task" 

                        value = {task}
                        onChange={handleTextChange}
                        required
                        />
                        

                        <label className={`absolute right-[21rem] top-[1.4rem] text-[1rem] outline-none ${time === "--:-- --" ? "text-transparent select-none pointer-events-none" : "" }`}>{displayTime}</label>
                        <input
                        className="absolute right-[19rem] top-[1.4rem] text-[0.9rem] outline-none w-[1.8rem] bg-transparent text-white  "

                        type="time"
                        value={time}
                        onChange={handleTimeChange}
                        />

                        <button type="button" onClick={() => setTime("--:-- --")}
                           className="absolute right-[17rem] top-[1.5rem] text-2xl">
                        <RotateCcw size={20} color="black"  /></button>

                        <label className={`absolute right-[9rem] top-[1.4rem] text-[1rem] outline-none ${date === "mm/dd/yyyy" ? "text-transparent select-none pointer-events-none" : "" }`}>{date.split('-').reverse().join('-')}</label>
                        <input 
                        className="absolute right-[7rem] top-[1.2rem] text-[1.2rem] w-[1.55rem] outline-none bg-transparent"

                        type="date" 
                        value={date}
                        onChange={handleDateChange}
                        />
                        
                        <button type="button" onClick={() => setDate("mm/dd/yyyy")}
                        className="absolute right-[5rem] top-[1.5rem] text-2xl">
                        <RotateCcw size={20} color="black" /></button>
                    </form>
                </div>
                <div  className="font-normal text-[#354F52] flex space-x-2 mt-[-15px] mb-0 my-3 ml-8"  style={{ fontFamily: '"Signika Negative", sans-serif' }}>
                <div className="w-[84rem] h-[28.5rem] fixed left-[10rem] top-[14rem] rounded-lg overflow-auto">
                    <ul>
                        {tasks.map((task, index)=>
                            <li key={index}
                            
                            className={`bg-white mt-3 pt-4 pb-4 rounded-lg whitespace-nowrap flex shadow-md transition-transform duration-1000 ${isAnimatingDropDown ? 'transform translate-y-[-65px] opacity-100' : ''}`}
                            style={{ backgroundColor: colors[index % colors.length] }} // Dynamic color

                            ref={index === tasks.length - 1 ? lastTaskRef : null}
                            >
                                
                                <input 
                                className="absolute left-[1rem] translate-y-[0.1rem] peer appearance-none w-5 h-5 border-1 border-black rounded-full bg-white checked:bg-[#719191] checked:border-black transition-colors cursor-pointer"
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => completeToggle(task.task_id)}
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
                                        className="absolute left-[57rem] opacity-45 text-[0.9rem] w-[1.9rem] mt-[-0.1rem] bg-transparent outline-none"

                                        type="time"
                                        value={editTime}
                                        onChange={handleTimeEditChange}
                                        />
                                        <button type="button" onClick={() => {setEditTime("--:-- --"); console.log(editTime);}}

                                        className="absolute left-[59rem] opacity-45 text-[1.2rem] translate-y-[-0.3rem] z-50 mt-[0.3rem]"
                                            ><RotateCcw size={20}/></button>
                                        
                                        <label className={`absolute ml-[-0.1rem]  mt-[-0.1rem] left-[64.8rem] opacity-45 text-[0.9rem] translate-y-[0.1rem] ${editDate === "mm/dd/yyyy" ? "text-transparent select-none pointer-events-none" : "" }`}>{editDate.split('-').reverse().join('/')}</label>
                                        <input
                                        type="date"
                                        className="absolute mt-[-0.1rem] right-[12rem] opacity-45 mt-[-0.2rem] w-[1.33rem] text-[1.2rem] translate-y-[-0.1rem] bg-transparent outline-none"

                                        value={editDate}
                                        onChange={handleDateEditChange}
                                        />
                                        
                                        
                                         <button type="button" 

                                         className="absolute left-[72.2rem] opacity-45 text-[1.2rem] translate-y-[-0.3rem] mt-[0.3rem]"
                                         onClick={()=> setEditDate("mm/dd/yyyy")}
                                         ><RotateCcw size={20}/></button>
                                        <button onClick={() => saveEditing(task.task_id)}
                                        className="absolute right-[7rem] mt-[0rem]"
                                            ><Save size={20}/></button> 
                                    </div>
                                 ) : (
                                <div onClick={() => startEditing(index, task.text, task.dueAt)} className={`${task.dueAt.getTime() !== 0 && task.dueAt.getTime() < new Date().getTime() ? "text-red-800" : ""}`}>
                                    <span className="absolute left-[3rem] max-w-[46.3rem] overflow-hidden text-ellipsis whitespace-nowrap">

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

                                <button disabled={isEditing && editIndex !== index} onClick={() => deleteTask(task.task_id)} className={`ml-[81.5rem] text-red-600 ${isEditing === true && editIndex === index ? "opacity-45": "" }`}><Trash2 size={20}/></button>

                            </li>
                        )}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}



const ToDoListPage = () => {
    return(
        <>  
            <WhiteContainer>
                <h1 style={{ fontFamily: '"Crimson Pro", serif' }} className="text-[3rem] text-[#354F52] ftracking-normal mb-4 ml-8 mt-7">To Do List</h1>
                <Clock/>
              <ToDoListComponent/>
            </WhiteContainer>
            <Sidebar/> 
        </>
    )
}

export default ToDoListPage