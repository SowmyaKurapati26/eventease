import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User } from 'lucide-react';

interface Participant {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
}

interface ParticipantsModalProps {
    isOpen: boolean;
    onClose: () => void;
    participants: Participant[];
    eventTitle: string;
}

export const ParticipantsModal: React.FC<ParticipantsModalProps> = ({
    isOpen,
    onClose,
    participants,
    eventTitle,
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Participants - {eventTitle}</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[60vh]">
                    <div className="space-y-4 p-4">
                        {participants.length === 0 ? (
                            <p className="text-center text-gray-500">No participants yet</p>
                        ) : (
                            participants.map((participant) => (
                                <div
                                    key={participant._id}
                                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                                >
                                    <div className="bg-blue-100 p-2 rounded-full">
                                        <User className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium">
                                            {participant.firstName} {participant.lastName}
                                        </p>
                                        <p className="text-sm text-gray-500">{participant.email}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}; 