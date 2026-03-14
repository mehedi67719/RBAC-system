import React from 'react';
import { RefreshCw } from "lucide-react";

const loading = () => {
    return (
        <div className="min-h-screen bg-gray-50 w-full flex items-center justify-center">
            <div className="text-center">
                <RefreshCw className="w-16 h-16 text-[#F97316] animate-spin mx-auto mb-4" />
                <div className="space-y-2">
                    <div className="h-6 w-48 bg-gray-200 rounded-lg animate-pulse mx-auto"></div>
                    <div className="h-4 w-64 bg-gray-200 rounded-lg animate-pulse mx-auto"></div>
                </div>
                <p className="text-gray-500 text-sm mt-4">Loading tasks...</p>
            </div>
        </div>
    );
};

export default loading;