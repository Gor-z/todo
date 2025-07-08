const Todo = (
    title,
    description,
    dueDate,
    priority,
    initialNotes = [],
    initialChecklist = []
) => {
    const _id = crypto.randomUUID();

    let _title = title;
    let _description = description;
    let _dueDate = dueDate;
    let _priority = priority;
    let _status = 'todo';
    let _notes = [...initialNotes];
    let _checklist = [...initialChecklist];

    const getId = () => _id;

    const getTitle = () => _title;
    const setTitle = (value) => { _title = value; };

    const getDescription = () => _description;
    const setDescription = (value) => { _description = value; };

    const getDueDate = () => _dueDate;
    const setDueDate = (value) => { _dueDate = value; };

    const getPriority = () => _priority;
    const setPriority = (value) => { _priority = value; };

    const getStatus = () => _status;
    const setStatus = (value) => { _status = value; };

    const getNotes = () => [..._notes];
    const addNote = (note) => { _notes.push(note); };
    const removeNote = (index) => {
        if (index >= 0 && index < _notes.length) {
            _notes.splice(index, 1);
        }
    };

    const getChecklist = () => _checklist.map(item => ({ ...item }));
    const addCheckListItem = (text) => {
        _checklist.push({ text, status: false });
    };
    const toggleCheckListItem = (index) => {
        if (index >= 0 && index < _checklist.length) {
            _checklist[index].status = !_checklist[index].status;
        }
    };

    return {
        getId,
        getTitle,
        setTitle,
        getDescription,
        setDescription,
        getDueDate,
        setDueDate,
        getPriority,
        setPriority,
        getStatus,
        setStatus,
        getNotes,
        addNote,
        removeNote,
        getChecklist,
        addCheckListItem,
        toggleCheckListItem,
    };
};

export { Todo };