const Note = ({note, cambiarImportancia}) =>{
  const label = note.important
    ? 'make not important' : 'make important'
  return(
    <li className="note">
      {note.content}
      <button onClick={cambiarImportancia}>{label}</button>
    </li>
  )
}

export default Note