import React from 'react'
import ModelContainer from './ModelContainer'
import {AiOutlineCheck, AiOutlineClose} from 'react-icons/ai'

const CastModel = ({ cast=[], visible, onClose, onRemoveClick }) => {
  return (
    <ModelContainer ignoreContainer visible={visible} onClose={onClose}>
        <div className="space-y-2 dark:bg-primary bg-white rounded max-w-[45rem] max-h-[40rem] overflow-auto p-2 custom-scroll-bar">

            {cast.map(({ profile, roleAs, leadActor  })=>{

                const { name, avatar, id } = profile;

                return (

                    <div key={id} className='flex space-x-3 dark:bg-secondary bg-white drop-shadow-md rounded'>

                        <img className='w-24 h-24 aspect-square rounded object-cover' src={avatar.url} alt={name} />


                        <div className="w-full flex flex-col justify-between py-1">
                        
                            <div>
                                <p className='font-semibold dark:text-white text-primary w-full'>{name}</p>
                                <p className='text-sm dark:text-dark-subtle text-light-subtle'>{roleAs}</p>
                            </div>
                        
                            {leadActor && <AiOutlineCheck className='text-light-subtle dark:text-dark-subtle' />}

                        </div>


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

export default CastModel