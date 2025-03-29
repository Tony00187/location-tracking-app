import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLocationSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // Save location data
  app.post("/api/location", async (req, res) => {
    try {
      // Generate a unique user ID based on session or IP if no user authentication
      // For simplicity, we're using IP address as the user ID
      const userId = req.headers["x-forwarded-for"]?.toString() || req.socket.remoteAddress || "anonymous";
      
      // Create timestamp from current time if not provided
      const timestampValue = req.body.timestamp 
        ? new Date(req.body.timestamp) 
        : new Date();

      // Validate and transform the location data
      const locationData = insertLocationSchema.parse({
        userId,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        accuracy: req.body.accuracy,
        timestamp: timestampValue
      });

      // Save the location data
      const savedLocation = await storage.saveLocation(locationData);

      res.status(201).json({
        message: "Location saved successfully",
        id: savedLocation.id
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ 
          message: "Invalid location data",
          errors: validationError.message
        });
      } else {
        console.error("Error saving location:", error);
        res.status(500).json({ message: "Error saving location data" });
      }
    }
  });

  // Get recent locations for a user
  app.get("/api/location/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      
      const locations = await storage.getLocations(userId, limit);
      
      res.status(200).json({
        userId,
        count: locations.length,
        locations
      });
    } catch (error) {
      console.error("Error fetching locations:", error);
      res.status(500).json({ message: "Error fetching location data" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
