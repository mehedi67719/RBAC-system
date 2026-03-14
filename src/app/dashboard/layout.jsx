import Sidebar from '@/Components/Sidebar';
import React from 'react';

const layout = ({ children }) => {
    return (
        <div className='flex items-center justify-between w-full  bg-orange-300 '>
            <Sidebar classname="max-w-[20%] w-full" />

            <div className='max-w-[80%] w-full'>
                {
                    children
                }
            </div>

        </div>
    );
};

export default layout;