/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import {FilePen, Trash2, FilePlus } from "lucide-react";
import WhiteContainer from "../components/WhiteContainer";
import SideBar from "../components/SideBar";
import "react-quill/dist/quill.snow.css";
import Avatar from '../components/Avatar'

// Ang function para magkuha sang random pastel color para sa background sang notes
const getRandomPastelColor = () => {
    const colors = ["#FE9B72", "#FFC973", "#E5EE91", "#B692FE"];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
};

const NotepadPage: React.FC = () => {
    const [notes, setNotes] = useState<any[]>([]); // Para sa listahan sang notes
    const [currentTitle, setCurrentTitle] = useState<string>(""); // Para sa current title sang note
    const [currentNote, setCurrentNote] = useState<string>(""); // Para sa content sang note
    const [editingNote, setEditingNote] = useState<number | null>(null); // Para sa pag-edit sang note
    const [creatingNewNote, setCreatingNewNote] = useState<boolean>(false); // Flag kung nagahimo sang bago nga note
    const [filter, setFilter] = useState<string>("All"); // Para sa filter sang notes
    const [selectedNote, setSelectedNote] = useState<any | null>(null); // Para sa selected nga note

    // Handler para sa changes sa editor
    const handleEditorChange = (value: string) => setCurrentNote(value);

    // Function para mag-save sang note
    const saveNote = () => {
        if (currentNote.trim() === "" || currentTitle.trim() === "") return;
    
        // Remove <h1>, <h2>, <h3>, and <p> tags (mga header)
        const strippedNoteContent = currentNote
            .replace(/<\/?(h1|h2|h3|p)>/g, '')  // This will remove <h1>, <h2>, <h3>, and <p> tags
            .trim();  // Remove leading/trailing spaces
        
        const newNote = {
            id: Date.now(),
            title: currentTitle,
            content: strippedNoteContent,
            color: getRandomPastelColor(),
            createdDate: new Date().toLocaleDateString(),
            createdTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            timestamp: new Date().getTime(),
        };
    
        const updatedNotes = editingNote !== null
            ? notes.map((note) => note.id === editingNote ? newNote : note)
            : [newNote, ...notes];
    
        setNotes(updatedNotes);
        localStorage.setItem("notes", JSON.stringify(updatedNotes));
        setCurrentNote("");
        setCurrentTitle("");
        setEditingNote(null);
        setCreatingNewNote(false);
    };
    

    // Function para mag-edit sang note
    const editNote = (id: number) => {
        const noteToEdit = notes.find((note) => note.id === id);
        if (noteToEdit) {
            setEditingNote(id);
            setCurrentTitle(noteToEdit.title);
            setCurrentNote(noteToEdit.content);
        }
    };

    // Function para mag-delete sang note
    const deleteNote = (id: number) => {
        const updatedNotes = notes.filter((note) => note.id !== id);
        setNotes(updatedNotes);
        localStorage.setItem("notes", JSON.stringify(updatedNotes));
        setEditingNote(null);
    };

    // Function para mag-cancel sang edit or new note
    const cancelEdit = () => {
        setEditingNote(null);
        setCreatingNewNote(false);
        setCurrentNote("");
        setCurrentTitle("");
    };

    // Function para mag-filter sang notes base sa selected filter
    const getFilteredNotes = () => {
        const now = new Date().getTime();
        const oneDay = 24 * 60 * 60 * 1000;
        const oneWeek = 7 * oneDay;
        const oneMonth = 30 * oneDay;

        const filterDate = (timestamp: number) => {
            switch (filter) {
                case "Today":
                    return now - timestamp < oneDay;
                case "Yesterday":
                    return now - timestamp >= oneDay && now - timestamp < 2 * oneDay;
                case "This Week":
                    const startOfWeek = now - (now % oneWeek);
                    return timestamp >= startOfWeek && timestamp <= now;
                case "This Month":
                    return now - timestamp < oneMonth;
                default:
                    return true;
            }
        };

        return notes.filter((note) => filterDate(note.timestamp));
    };

    const filteredNotes = getFilteredNotes();

    // Function para mag-select sang note para makita ang details
    const handleNoteClick = (note: any) => {
        setSelectedNote(note);
    };

    // Function para mag-close sang detailed view sang note
    const closeNoteView = () => {
        setSelectedNote(null);
    };

    // Load notes from localStorage on component mount
    useEffect(() => {
        const savedNotes = localStorage.getItem("notes");
        if (savedNotes) {
            setNotes(JSON.parse(savedNotes));
        }
    }, []);

    return (
        <>
            <WhiteContainer>
                <h1  style={{ fontFamily: '"Crimson Pro", serif' }} className="text-[3rem] text-[#354F52] ftracking-normal mb-4 ml-8 mt-7"> My Notes</h1>

                {/* Filter Buttons */}
                <div className="font-serif font-bold text-[#354F52] flex space-x-2 mt-[-15px] mb-0 my-3 ml-8 ">
                    <button onClick={() => setFilter("All")} className={`px-4 py-2 rounded-md ${filter === "All" ? "font-serif font-bold bg-[#657F83] text-white" : "bg-none"}`}>All</button>
                    <button onClick={() => setFilter("Today")} className={`px-4 py-2 rounded-md ${filter === "Today" ? "font-serif font-bold bg-[#657F83] text-white " : "bg-none"}`}>Today</button>
                    <button onClick={() => setFilter("Yesterday")} className={`px-4 py-2 rounded-md ${filter === "Yesterday" ? "font-serif font-bold bg-[#657F83] text-white" : "bg-none"}`}>Yesterday</button>
                    <button onClick={() => setFilter("This Week")} className={`px-4 py-2 rounded-md ${filter === "This Week" ? "font-serif font-bold bg-[#657F83] text-white" : "bg-none"}`}>This Week</button>
                    <button onClick={() => setFilter("This Month")} className={`px-4 py-2 rounded-md ${filter === "This Month" ? "font-serif font-bold bg-[#657F83] text-white" : "bg-none"}`}>This Month</button>
                </div>

                {/* Notes Editor or Full Note View */}
                {editingNote !== null || creatingNewNote ? (
                    <div className="bg-white p-6 rounded-lg shadow-lg relative mb-4 my-5 ml-8 overflow-y-auto max-h-[36rem] w-full md:w-[80rem]">
                        <h2 className="text-lg font-semibold">{editingNote ? "Edit Note" : "Create New Note"}</h2>
                        {editingNote && (
                            <button onClick={() => deleteNote(editingNote)} className="absolute top-5 right-5 text-red-500 hover:text-red-700">
                                <Trash2 size={25} />
                            </button>
                        )}
                        <div className="flex items-center justify-between mb-4">
                            <input
                                type="text"
                                value={currentTitle}
                                onChange={(e) => setCurrentTitle(e.target.value)}
                                placeholder="Title"
                                className="w-full p-2 border-b mb-4 text-lg font-bold"
                            />
                        </div>
                        <ReactQuill value={currentNote} onChange={handleEditorChange} theme="snow" />
                        <div className="mt-4 flex justify-between">
                            <button onClick={cancelEdit} className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500">Cancel</button>
                            <button onClick={saveNote} className="px-4 py-2 bg-[#354F52] text-white rounded-md hover:bg-blue-700">
                                {editingNote ? "Save Changes" : "Save Note"}
                            </button>
                        </div>  
                    </div>
                ) : selectedNote ? (
                    <div className="bg-white p-6 rounded-lg shadow-lg relative mb-4 my-5 ml-8 overflow-y-auto max-h-[36rem] w-full md:w-[80rem]">
                        <h2 className="text-lg font-semibold">{selectedNote.title}</h2>
                        <button onClick={closeNoteView} className="absolute top-3 right-5 text-red-500 hover:text-red-700">Close</button>
                        <div className="mt-4">
                            <ReactQuill value={selectedNote.content} readOnly={true} theme="snow" />
                        </div>
                    </div>
                ) : (

                    /* Notes List */
                    <div className="mt-6 px-3">
                    <div className="overflow-x-auto">
                        <div className="grid grid-rows-[repeat(2,minmax(0,1fr))] grid-flow-col gap-y-1 w-max">
                            {/* New Note Button */}
                            <div
                                className="p-6 border rounded-3xl cursor-pointer shadow-lg hover:shadow-xl flex flex-col items-center justify-center ml-5 mb-2 ,"
                                onClick={() => setCreatingNewNote(true)}
                                style={{ 
                                    width: "16rem", // Set consistent width
                                    minHeight: "16rem", // Set consistent height
                                    backgroundColor: "#F9F9F9" 
                                }}
                                //add icon
                                >
                                <FilePlus size={90}  className="mb-2 text-[#354F52]" />  
                            </div>                  
                            {/* Render Notes */}
                            {filteredNotes.length === 0 ? (
                                <div className="text-center mt-4 ml-5">
                                    <p className="text-2xl font-serif font-bold text-gray-500">No notes available.</p>
                                </div>
                            ) : (
                                filteredNotes.map((note) => (
                                    <div
                                        key={note.id}
                                        className="border rounded-3xl shadow-lg hover:shadow-xl relative cursor-pointer ml-5 mb-2"
                                        style={{ 
                                            width: "16rem", // Set consistent width
                                            minHeight: "16rem", // Set consistent height
                                            backgroundColor: note.color 
                                        }}
                                        onClick={() => handleNoteClick(note)}
                                    >
                                        <h4 style={{ fontFamily: '"Signika Negative", sans-serif' }} className="text-xs text-black-500 ml-3 mt-3">{note.createdDate}</h4>
                                        <h3 style={{ fontFamily: '"Signika Negative", sans-serif' }} className="uppercase font-bold text-xl mb-1 ml-3 ">{note.title.slice(0, 14)}</h3>
                                        <hr className="border-t-2 border-black w-full mb-2" />
                                        <p style={{ fontFamily: '"Signika Negative", sans-serif' }} className="text-gray-700 ml-3">{note.content.slice(0, 20)}...</p>
                                        <p style={{ fontFamily: '"Signika Negative", sans-serif' }}className="font-serif text-xs text-black-500 absolute bottom-3 left-5">{note.createdTime}</p>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); editNote(note.id); }}
                                            className="absolute top-7 right-3 text-black hover:text-[#719191]"
                                        >
                                            <FilePen size={20} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>  
                </div>
                )}
                 <Avatar/>
            </WhiteContainer>
            <SideBar />
        </>
    );
};

export default NotepadPage;