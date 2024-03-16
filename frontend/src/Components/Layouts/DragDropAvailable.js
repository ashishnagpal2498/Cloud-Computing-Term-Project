import React from 'react'
import '../../Stylesheets/drag-drop-available.css'

const DragDropAvailable = () => {
  return (
    <div className='drag-drop-av-container'>
        <div className='feature-existence'>
        <div class="drop-zone">
            <span class="drop-zone__prompt">Drop file here or click to upload</span>
         </div>
        </div>
        <div className='drag-drop-heading'>
            <h2>Simple drag your folders !!</h2>
        </div>
    </div>
  )
}

export default DragDropAvailable