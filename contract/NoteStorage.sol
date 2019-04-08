pragma solidity >=0.5.0 <0.6;
pragma experimental ABIEncoderV2;

contract NoteStorage {

    struct Note {
        uint uid;
        uint noteid;
        string text;
    }

    mapping(uint=>string) public notesContent;
    mapping(uint=>Note) public notesMap;
    mapping(uint=>uint) public noteidTouid;
    mapping(uint=>Note[]) public userNotes;

    mapping(uint=>mapping(uint=>uint)) public noteidToindex;

    Note[] public notesArr;

    uint public noteIdx;
    address public founder;
    uint public founderID;

    constructor() public{
        noteIdx = 0;
        founder = msg.sender;
        founderID = uint(founder);
    }

    function getAllNotes() public view returns(Note[] memory){
        return notesArr;
    }

    function getMyNotes() public view returns(Note[] memory){
        uint myuid = uint(msg.sender);
        return userNotes[myuid];
    }

    function getNote(uint noteid) public view returns(Note memory) {
        return notesMap[noteid];
    }

    function addNote(string memory text) public{
        uint myuid = uint(msg.sender);
        uint noteid = ++noteIdx;
        Note memory newNote = Note({
            uid:myuid,
            noteid:noteid,
            text:text
        });
        noteidTouid[noteid] = myuid;
        notesContent[noteid] = text;
        notesMap[noteid] = newNote;
        notesArr.push(newNote);

        uint userNotesLen = userNotes[myuid].push(newNote);
        noteidToindex[myuid][noteid] = userNotesLen - 1;

    }

    function updateNote(uint noteid,string memory newtext) public {
        require(uint(msg.sender) == noteidTouid[noteid],"you can only change the note belong to you!");
        notesContent[noteid] = newtext;
        notesMap[noteid].text = newtext;
        notesArr[noteid-1].text = newtext;

        uint myuid = uint(msg.sender);
        uint correctIndex = noteidToindex[myuid][noteid];
        userNotes[myuid][correctIndex].text = newtext;
    }

    function deleteNote(uint noteid) public {
        require(uint(msg.sender) == noteidTouid[noteid],"you can only delete the note belong to you!");
        delete notesContent[noteid];
        delete notesMap[noteid];
        delete noteidTouid[noteid];

        delete notesArr[noteid-1];

        delete noteidTouid[noteid];

        uint myuid = uint(msg.sender);

        uint correctIndex = noteidToindex[myuid][noteid];
        delete userNotes[myuid][correctIndex];
    }
}
