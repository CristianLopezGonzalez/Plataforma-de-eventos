import { Category, Review, Ticket, User } from "../generated/prisma";

export interface CreateEventDTO {
    title: string;
    description: string;
    date: Date;
    category: Category;
    imageUrl?: string | null;
    dateStart: Date;
    dateEnd: Date;
    capacity: number;
    location: string;
    latitude: number;
    longitude: number;
    ticketPrice: number;
    organizerId: string;
}

export interface UpdateEventDTO {

}

export interface EventDTO {
    id: string;
    category: Category;
    imageUrl: string | null;
    dateStart: Date;
    dateEnd: Date;
    capacity: number;
    location: string;
    latitude: number;
    longitude: number;
    ticketPrice: number;
    organizerId: string;
    tickets?:Ticket[] | [] | null;
    reviews?: Review[] | [] | null;
    attendees?:User[] | [] | null;
    createdAt: Date;
    updatedAt: Date;
}