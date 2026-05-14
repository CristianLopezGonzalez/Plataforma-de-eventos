import { prisma } from '../config/prisma'
import { CreateEventDTO, EventDTO } from '../types/eventTypes';

export class EventService {

    async createEvent(data:CreateEventDTO): Promise<EventDTO> {
        try {

            const event = await prisma.event.create({
                data,
                select: {
                    id: true,
                    title: true,
                    description: true,
                    category: true,
                    imageUrl: true,
                    dateStart: true,
                    dateEnd: true,
                    capacity: true,
                    location: true,
                    latitude: true,
                    longitude: true,
                    ticketPrice: true,
                    organizerId: true,
                    createdAt: true,
                    updatedAt: true,
                }
            })
            
            return event;
        } catch (error) {
            console.log(error);
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Error al crear el evento');
        }
    }
}