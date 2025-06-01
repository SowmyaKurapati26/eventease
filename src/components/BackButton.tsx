import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BackButton = () => {
    return (
        <Button
            variant="ghost"
            size="sm"
            className="flex items-center text-gray-600 hover:text-blue-600"
            asChild
        >
            <Link to="/">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Home
            </Link>
        </Button>
    );
}; 