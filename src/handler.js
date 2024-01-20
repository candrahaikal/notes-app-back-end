const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload; // INGAT! body request ditampung dalam payload

  const id = nanoid(16); // Library nanoid untuk generate string random berjumlah 16 karakter
  const createdAt = new Date().toISOString(); // Get waktu saat ini
  const updatedAt = createdAt;

  const newNote = {
    title, tags, body, id, createdAt, updatedAt,
  }

  notes.push(newNote);

  // Cek var notes apakah terdapat data (bukan kosong)
  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  // Response 
  if(isSuccess){
    const response = h.response({ // INGAT! h adalah variable response
      status: 'success',
      message: 'Note added successfully',
      data: {
        noteId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Note add failed'
  });
  response.code(500);
  return response;


};


const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});


const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const note = notes.filter((note) => note.id === id)[0];

  if (note!=undefined){
    return {
      status: 'success',
      data: {
        note,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Note not found',
  });
  response.code(404);
  return response;
};


const editNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const { title, tags, body } = request.payload;
  const updateAt = new Date().toISOString();

  const index = notes.findIndex((note) => note.id === id);

  if(index !== -1){
    notes[index] = {
      ...notes[index],
      title,
      tags, 
      body, 
      updateAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Note updated successfully'
    });
    response.code(200);
    return response;

  }

  const response = h.response({
    status: 'fail',
    message: 'Failed update note. ID not found'
  });
  response.code(404);
  return response;

}


const deleteNoteByIdHandler = (request, h)=> {
  const { id } = request.params;

  const index = notes.findIndex((note) => note.id === id);

  if(index!== -1){
    notes.splice(index, 1);
    
    const response = h.response({
      status: 'success',
      message: 'Note deleted successfully',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Failed delete note'
  });
  response.code(200);
  return response;  
}

module.exports = { addNoteHandler, getAllNotesHandler, getNoteByIdHandler, editNoteByIdHandler, deleteNoteByIdHandler };