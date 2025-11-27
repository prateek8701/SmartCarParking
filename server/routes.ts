import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";
import { randomUUID } from "crypto";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth Routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const parsed = insertUserSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid input" });
      }

      const existingUser = await storage.getUserByUsername(parsed.data.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const user = await storage.createUser(parsed.data);
      res.json({ id: user.id, username: user.username });
    } catch (error) {
      res.status(500).json({ message: "Signup failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Simple comparison (no hashing for basic mode)
      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      res.json({ id: user.id, username: user.username });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Payment Routes
  app.post("/api/payments/create", async (req, res) => {
    try {
      const { slotId, slotLabel, slotType, hours, amount } = req.body;

      if (!slotId || !slotLabel || !hours || !amount) {
        return res.status(400).json({ message: "Missing payment details" });
      }

      // Create a simple receipt
      const receipt = {
        id: `RCP-${randomUUID().slice(0, 8).toUpperCase()}`,
        slotId,
        slotLabel,
        slotType,
        hours,
        amount,
        createdAt: new Date().toISOString(),
        status: "paid",
      };

      res.json(receipt);
    } catch (error) {
      res.status(500).json({ message: "Payment failed" });
    }
  });

  return httpServer;
}
