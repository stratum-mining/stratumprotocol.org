
import { users, type User, type InsertUser } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class DatabaseStorage implements IStorage {
  private async findOne(condition: any) {
    const [result] = await db.select().from(users).where(condition);
    return result;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.findOne(eq(users.id, id));
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.findOne(eq(users.username, username));
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
}

export const storage = new DatabaseStorage();
