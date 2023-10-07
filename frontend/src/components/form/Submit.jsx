import React from 'react'
import {LiaSpinnerSolid} from 'react-icons/lia';

const Submit = ({value, busy}) => {
  return (
    // <input type="submit" className='w-full rounded dark:bg-white bg-secondary hover:bg-opacity-80 transition font-semibold text-lg dark:text-secondary text-white p-1 cursor-pointer' value={value}/>
    // we can't use input tag now since we have to conditionally render based on busy prop
    <button
      type='submit'
      className='w-full rounded dark:bg-white bg-secondary hover:bg-opacity-80 transition font-semibold text-lg dark:text-secondary text-white h-8 cursor-pointer flex items-center justify-center'
    >
      {/* h-8, will have to fix the height, otherwise the size of the button would change with padding */}
      {busy? <LiaSpinnerSolid className='animate-spin'/> : value}
    </button>
  )
} 

export default Submit