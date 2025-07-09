import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertPartnerSchema, insertEnrollmentSchema, insertEventRegistrationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Partner routes
  app.get('/api/partner', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const partner = await storage.getPartnerByUserId(userId);
      if (!partner) {
        return res.status(404).json({ message: "Partner not found" });
      }
      res.json(partner);
    } catch (error) {
      console.error("Error fetching partner:", error);
      res.status(500).json({ message: "Failed to fetch partner" });
    }
  });

  app.post('/api/partner', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const partnerData = insertPartnerSchema.parse({
        ...req.body,
        userId,
      });
      
      const partner = await storage.createPartner(partnerData);
      res.json(partner);
    } catch (error) {
      console.error("Error creating partner:", error);
      res.status(500).json({ message: "Failed to create partner" });
    }
  });

  // Course routes
  app.get('/api/courses', isAuthenticated, async (req, res) => {
    try {
      const courses = await storage.getAllCourses();
      res.json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  app.get('/api/courses/:id', isAuthenticated, async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const course = await storage.getCourse(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      console.error("Error fetching course:", error);
      res.status(500).json({ message: "Failed to fetch course" });
    }
  });

  // Enrollment routes
  app.get('/api/enrollments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const partner = await storage.getPartnerByUserId(userId);
      if (!partner) {
        return res.status(404).json({ message: "Partner not found" });
      }
      
      const enrollments = await storage.getPartnerEnrollments(partner.id);
      res.json(enrollments);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      res.status(500).json({ message: "Failed to fetch enrollments" });
    }
  });

  app.post('/api/enrollments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const partner = await storage.getPartnerByUserId(userId);
      if (!partner) {
        return res.status(404).json({ message: "Partner not found" });
      }

      const enrollmentData = insertEnrollmentSchema.parse({
        ...req.body,
        partnerId: partner.id,
        status: 'enrolled',
        startDate: new Date(),
      });
      
      const enrollment = await storage.createEnrollment(enrollmentData);
      
      // Update partner stats
      await storage.updatePartner(partner.id, {
        coursesInProgress: partner.coursesInProgress + 1,
      });
      
      res.json(enrollment);
    } catch (error) {
      console.error("Error creating enrollment:", error);
      res.status(500).json({ message: "Failed to create enrollment" });
    }
  });

  app.patch('/api/enrollments/:id', isAuthenticated, async (req: any, res) => {
    try {
      const enrollmentId = parseInt(req.params.id);
      const updates = req.body;
      
      const enrollment = await storage.updateEnrollment(enrollmentId, updates);
      res.json(enrollment);
    } catch (error) {
      console.error("Error updating enrollment:", error);
      res.status(500).json({ message: "Failed to update enrollment" });
    }
  });

  // Event routes
  app.get('/api/events', isAuthenticated, async (req, res) => {
    try {
      const events = await storage.getAllEvents();
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.get('/api/events/upcoming', isAuthenticated, async (req, res) => {
    try {
      const events = await storage.getUpcomingEvents();
      res.json(events);
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
      res.status(500).json({ message: "Failed to fetch upcoming events" });
    }
  });

  app.post('/api/events/:id/register', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const partner = await storage.getPartnerByUserId(userId);
      if (!partner) {
        return res.status(404).json({ message: "Partner not found" });
      }

      const eventId = parseInt(req.params.id);
      const registrationData = insertEventRegistrationSchema.parse({
        partnerId: partner.id,
        eventId,
      });
      
      const registration = await storage.registerForEvent(registrationData);
      res.json(registration);
    } catch (error) {
      console.error("Error registering for event:", error);
      res.status(500).json({ message: "Failed to register for event" });
    }
  });

  // Document routes
  app.get('/api/courses/:id/documents', isAuthenticated, async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const documents = await storage.getCourseDocuments(courseId);
      res.json(documents);
    } catch (error) {
      console.error("Error fetching course documents:", error);
      res.status(500).json({ message: "Failed to fetch course documents" });
    }
  });

  app.get('/api/partner/documents', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const partner = await storage.getPartnerByUserId(userId);
      if (!partner) {
        return res.status(404).json({ message: "Partner not found" });
      }
      
      const documents = await storage.getPartnerDocuments(partner.id);
      res.json(documents);
    } catch (error) {
      console.error("Error fetching partner documents:", error);
      res.status(500).json({ message: "Failed to fetch partner documents" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
