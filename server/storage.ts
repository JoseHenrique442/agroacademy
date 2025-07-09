import {
  users,
  partners,
  courses,
  enrollments,
  events,
  eventRegistrations,
  courseDocuments,
  partnerDocuments,
  type User,
  type UpsertUser,
  type Partner,
  type InsertPartner,
  type Course,
  type InsertCourse,
  type Enrollment,
  type InsertEnrollment,
  type Event,
  type InsertEvent,
  type EventRegistration,
  type InsertEventRegistration,
  type CourseDocument,
  type PartnerDocument,
  type InsertPartnerDocument,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, count } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Partner operations
  getPartnerByUserId(userId: string): Promise<Partner | undefined>;
  createPartner(partner: InsertPartner): Promise<Partner>;
  updatePartner(id: number, updates: Partial<Partner>): Promise<Partner>;
  
  // Course operations
  getAllCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  
  // Enrollment operations
  getPartnerEnrollments(partnerId: number): Promise<(Enrollment & { course: Course })[]>;
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  updateEnrollment(id: number, updates: Partial<Enrollment>): Promise<Enrollment>;
  getEnrollmentProgress(partnerId: number, courseId: number): Promise<Enrollment | undefined>;
  
  // Event operations
  getAllEvents(): Promise<Event[]>;
  getUpcomingEvents(): Promise<Event[]>;
  registerForEvent(registration: InsertEventRegistration): Promise<EventRegistration>;
  getPartnerEventRegistrations(partnerId: number): Promise<(EventRegistration & { event: Event })[]>;
  
  // Document operations
  getCourseDocuments(courseId: number): Promise<CourseDocument[]>;
  uploadPartnerDocument(document: InsertPartnerDocument): Promise<PartnerDocument>;
  getPartnerDocuments(partnerId: number): Promise<PartnerDocument[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Partner operations
  async getPartnerByUserId(userId: string): Promise<Partner | undefined> {
    const [partner] = await db.select().from(partners).where(eq(partners.userId, userId));
    return partner;
  }

  async createPartner(partner: InsertPartner): Promise<Partner> {
    const [newPartner] = await db.insert(partners).values(partner).returning();
    return newPartner;
  }

  async updatePartner(id: number, updates: Partial<Partner>): Promise<Partner> {
    const [updatedPartner] = await db
      .update(partners)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(partners.id, id))
      .returning();
    return updatedPartner;
  }

  // Course operations
  async getAllCourses(): Promise<Course[]> {
    return await db.select().from(courses).where(eq(courses.isActive, true)).orderBy(courses.name);
  }

  async getCourse(id: number): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const [newCourse] = await db.insert(courses).values(course).returning();
    return newCourse;
  }

  // Enrollment operations
  async getPartnerEnrollments(partnerId: number): Promise<(Enrollment & { course: Course })[]> {
    return await db
      .select({
        id: enrollments.id,
        partnerId: enrollments.partnerId,
        courseId: enrollments.courseId,
        status: enrollments.status,
        progress: enrollments.progress,
        grade: enrollments.grade,
        startDate: enrollments.startDate,
        completionDate: enrollments.completionDate,
        certificateRequested: enrollments.certificateRequested,
        certificateIssued: enrollments.certificateIssued,
        createdAt: enrollments.createdAt,
        updatedAt: enrollments.updatedAt,
        course: courses,
      })
      .from(enrollments)
      .innerJoin(courses, eq(enrollments.courseId, courses.id))
      .where(eq(enrollments.partnerId, partnerId))
      .orderBy(desc(enrollments.createdAt));
  }

  async createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment> {
    const [newEnrollment] = await db.insert(enrollments).values(enrollment).returning();
    return newEnrollment;
  }

  async updateEnrollment(id: number, updates: Partial<Enrollment>): Promise<Enrollment> {
    const [updatedEnrollment] = await db
      .update(enrollments)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(enrollments.id, id))
      .returning();
    return updatedEnrollment;
  }

  async getEnrollmentProgress(partnerId: number, courseId: number): Promise<Enrollment | undefined> {
    const [enrollment] = await db
      .select()
      .from(enrollments)
      .where(and(eq(enrollments.partnerId, partnerId), eq(enrollments.courseId, courseId)));
    return enrollment;
  }

  // Event operations
  async getAllEvents(): Promise<Event[]> {
    return await db
      .select()
      .from(events)
      .where(eq(events.isActive, true))
      .orderBy(events.eventDate);
  }

  async getUpcomingEvents(): Promise<Event[]> {
    const now = new Date();
    return await db
      .select()
      .from(events)
      .where(and(eq(events.isActive, true)))
      .orderBy(events.eventDate)
      .limit(10);
  }

  async registerForEvent(registration: InsertEventRegistration): Promise<EventRegistration> {
    const [newRegistration] = await db.insert(eventRegistrations).values(registration).returning();
    return newRegistration;
  }

  async getPartnerEventRegistrations(partnerId: number): Promise<(EventRegistration & { event: Event })[]> {
    return await db
      .select({
        id: eventRegistrations.id,
        partnerId: eventRegistrations.partnerId,
        eventId: eventRegistrations.eventId,
        registrationDate: eventRegistrations.registrationDate,
        attended: eventRegistrations.attended,
        event: events,
      })
      .from(eventRegistrations)
      .innerJoin(events, eq(eventRegistrations.eventId, events.id))
      .where(eq(eventRegistrations.partnerId, partnerId))
      .orderBy(desc(eventRegistrations.registrationDate));
  }

  // Document operations
  async getCourseDocuments(courseId: number): Promise<CourseDocument[]> {
    return await db.select().from(courseDocuments).where(eq(courseDocuments.courseId, courseId));
  }

  async uploadPartnerDocument(document: InsertPartnerDocument): Promise<PartnerDocument> {
    const [newDocument] = await db.insert(partnerDocuments).values(document).returning();
    return newDocument;
  }

  async getPartnerDocuments(partnerId: number): Promise<PartnerDocument[]> {
    return await db
      .select()
      .from(partnerDocuments)
      .where(eq(partnerDocuments.partnerId, partnerId))
      .orderBy(desc(partnerDocuments.uploadDate));
  }
}

export const storage = new DatabaseStorage();
