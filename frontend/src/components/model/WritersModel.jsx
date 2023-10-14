import React from 'react'
import ModelContainer from './ModelContainer'
import {AiOutlineClose} from 'react-icons/ai'
const WritersModel = ({ profiles=[], visible, onClose, onRemoveClick }) => {
  return (
    <ModelContainer ignoreContainer visible={visible} onClose={onClose}>
        <div className="space-y-2 dark:bg-primary bg-white rounded max-w-[45rem] max-h-[40rem] overflow-auto p-2 custom-scroll-bar">
            {profiles.map(({id, name, avatar})=>{
                return (
                    <div key={id} className='flex space-x-3'>
                        <img className='w-24 h-24 aspect-square rounded object-cover' src={avatar} alt={name} />
                        <p className='font-semibold dark:text-white text-primary w-full'>{name}</p>
                        <button onClick={()=>onRemoveClick(id)} className='dark:text-white text-primary hover:opacity-80 transition p-2'>
                            <AiOutlineClose/>
                        </button>
                    </div>
                )
            })}
        </div>
    </ModelContainer>
  )
}

export default WritersModel