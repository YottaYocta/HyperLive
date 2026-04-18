export type UserType = "mentor" | "volunteer" | "admin";

export interface StaffUser {
  id: string;
  name: string;
  type: UserType;
  specializations: string;
}

export interface Event {
  id: string;
  name: string;
}

export interface UserEvent {
  userId: string;
  eventId: string;
}

export const staff: StaffUser[] = [
  {
    id: "u1",
    name: "Alice Chen",
    type: "mentor",
    specializations: "hardware, embedded systems, PCB design",
  },
  {
    id: "u2",
    name: "Ben Nakamura",
    type: "mentor",
    specializations: "web development, React, Node.js",
  },
  {
    id: "u3",
    name: "Carla Diaz",
    type: "mentor",
    specializations: "machine learning, Python, data science",
  },
  {
    id: "u4",
    name: "David Park",
    type: "volunteer",
    specializations: "logistics, event coordination",
  },
  {
    id: "u5",
    name: "Eva Torres",
    type: "admin",
    specializations: "operations, scheduling, communications",
  },
];

export const events: Event[] = [
  { id: "e1", name: "Hack Cornell 2026" },
  { id: "e2", name: "Opening Ceremony" },
  { id: "e3", name: "Hardware Workshop" },
  { id: "e4", name: "Closing Ceremony" },
];

export const userEvents: UserEvent[] = [
  { userId: "u1", eventId: "e1" },
  { userId: "u1", eventId: "e3" },
  { userId: "u2", eventId: "e1" },
  { userId: "u3", eventId: "e1" },
  { userId: "u4", eventId: "e1" },
  { userId: "u4", eventId: "e2" },
  { userId: "u4", eventId: "e4" },
  { userId: "u5", eventId: "e1" },
  { userId: "u5", eventId: "e2" },
  { userId: "u5", eventId: "e3" },
  { userId: "u5", eventId: "e4" },
];
