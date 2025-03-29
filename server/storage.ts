import { 
  users, 
  type User, 
  type InsertUser, 
  locations,
  type Location,
  type InsertLocation 
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  saveLocation(location: InsertLocation): Promise<Location>;
  getLocations(userId: string, limit?: number): Promise<Location[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private locations: Map<number, Location>;
  private userCurrentId: number;
  private locationCurrentId: number;

  constructor() {
    this.users = new Map();
    this.locations = new Map();
    this.userCurrentId = 1;
    this.locationCurrentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async saveLocation(insertLocation: InsertLocation): Promise<Location> {
    const id = this.locationCurrentId++;
    const location: Location = { 
      ...insertLocation, 
      id,
      createdAt: new Date()
    };
    this.locations.set(id, location);
    return location;
  }

  async getLocations(userId: string, limit: number = 100): Promise<Location[]> {
    return Array.from(this.locations.values())
      .filter(location => location.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
