import React from 'react';
import ModelContainer from './ModelContainer';
import {ImSpinner3} from 'react-icons/im';

const ConfirmModel = ({ visible, busy, onConfirm, onCancel, title, subtitle, onClose }) => {
    const commonClasses = 'px-3 py-1 text-white rounded';
	return (
        <ModelContainer visible={visible} ignoreContainer onClose={onClose}>
            <div className='dark:bg-primary bg-white rounded p-5'>
                <h1 className='text-red-400 font-semibold text-lg'>{title}</h1>
                <p className='text-sm text-secondary dark:text-white'>{subtitle}</p>
                
                <div className="flex items-center space-x-3 mt-3">                    
                    {busy ? (
                        <p className='flex items-center space-x-2 text-primary dark:text-white'>
                            <ImSpinner3 className='animate-spin text-2xl'/>
                            <span></span>
                        </p>
                    ) : ( 
                        <>
                            <button onClick={onConfirm} type='button' className={commonClasses + ' bg-red-500'}>Confirm</button>
                            <button onClick={onCancel} type='button' className={commonClasses + ' bg-gray-700'}>Cancel</button>
                        </>
                    )}

                </div>

            </div>
            
        </ModelContainer>
    );
};

export default ConfirmModel;
