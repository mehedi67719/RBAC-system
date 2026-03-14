import DashboardHome from '@/Components/DashboardHome';
import Sidebar from '@/Components/Sidebar';
import React from 'react';

const page = () => {
    return (
        <div className='flex justify-between max-w-[90%] mx-auto items-center '>
            <Sidebar className="max-w-[20%] min-h-screen"/>
            <DashboardHome className="max-w-[78%] min-h-screen"/>
        </div>
    );
};

export default page;