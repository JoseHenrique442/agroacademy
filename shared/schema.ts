import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  boolean,
  date,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Partners table for partner-specific data
export const partners = pgTable("partners", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  company: varchar("company").notNull(),
  classification: varchar("classification").notNull().default("bronze"), // bronze, silver, gold
  utmTag: varchar("utm_tag").notNull().unique(),
  totalScore: integer("total_score").default(0),
  completedCourses: integer("completed_courses").default(0),
  coursesInProgress: integer("courses_in_progress").default(0),
  completionRate: decimal("completion_rate", { precision: 5, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Courses table
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description").notNull(),
  duration: integer("duration").notNull(), // in hours
  instructors: text("instructors").array(),
  requirements: text("requirements").array(),
  imageUrl: varchar("image_url"),
  level: varchar("level").notNull().default("beginner"), // beginner, intermediate, advanced
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  enrolledStudents: integer("enrolled_students").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Students table - the actual people taking courses
export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  partnerId: integer("partner_id").notNull().references(() => partners.id),
  name: varchar("name").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone"),
  cpf: varchar("cpf"),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Student course enrollments (partners enroll their students)
export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => students.id),
  courseId: integer("course_id").notNull().references(() => courses.id),
  partnerId: integer("partner_id").notNull().references(() => partners.id), // Who enrolled this student
  status: varchar("status").notNull().default("enrolled"), // enrolled, in_progress, completed, dropped
  progress: decimal("progress", { precision: 5, scale: 2 }).default("0"),
  grade: decimal("grade", { precision: 5, scale: 2 }),
  startDate: timestamp("start_date"),
  completionDate: timestamp("completion_date"),
  certificateRequested: boolean("certificate_requested").default(false),
  certificateIssued: boolean("certificate_issued").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Course documents
export const courseDocuments = pgTable("course_documents", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => courses.id),
  name: varchar("name").notNull(),
  type: varchar("type").notNull(), // material, assignment, certificate
  fileUrl: varchar("file_url").notNull(),
  isRequired: boolean("is_required").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Partner document uploads
export const partnerDocuments = pgTable("partner_documents", {
  id: serial("id").primaryKey(),
  partnerId: integer("partner_id").notNull().references(() => partners.id),
  enrollmentId: integer("enrollment_id").notNull().references(() => enrollments.id),
  documentName: varchar("document_name").notNull(),
  fileUrl: varchar("file_url").notNull(),
  uploadDate: timestamp("upload_date").defaultNow(),
  status: varchar("status").default("pending"), // pending, approved, rejected
});

// Events table
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  eventDate: timestamp("event_date").notNull(),
  duration: integer("duration").notNull(), // in minutes
  type: varchar("type").notNull(), // workshop, webinar, conference
  isOnline: boolean("is_online").default(true),
  maxParticipants: integer("max_participants"),
  registeredParticipants: integer("registered_participants").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Event registrations
export const eventRegistrations = pgTable("event_registrations", {
  id: serial("id").primaryKey(),
  partnerId: integer("partner_id").notNull().references(() => partners.id),
  eventId: integer("event_id").notNull().references(() => events.id),
  registrationDate: timestamp("registration_date").defaultNow(),
  attended: boolean("attended").default(false),
});

// Relations
export const usersRelations = relations(users, ({ one }) => ({
  partner: one(partners, {
    fields: [users.id],
    references: [partners.userId],
  }),
}));

export const partnersRelations = relations(partners, ({ one, many }) => ({
  user: one(users, {
    fields: [partners.userId],
    references: [users.id],
  }),
  students: many(students),
  enrollments: many(enrollments),
  documents: many(partnerDocuments),
  eventRegistrations: many(eventRegistrations),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  partner: one(partners, {
    fields: [students.partnerId],
    references: [partners.id],
  }),
  enrollments: many(enrollments),
}));

export const coursesRelations = relations(courses, ({ many }) => ({
  enrollments: many(enrollments),
  documents: many(courseDocuments),
}));

export const enrollmentsRelations = relations(enrollments, ({ one, many }) => ({
  student: one(students, {
    fields: [enrollments.studentId],
    references: [students.id],
  }),
  partner: one(partners, {
    fields: [enrollments.partnerId],
    references: [partners.id],
  }),
  course: one(courses, {
    fields: [enrollments.courseId],
    references: [courses.id],
  }),
  documents: many(partnerDocuments),
}));

export const eventsRelations = relations(events, ({ many }) => ({
  registrations: many(eventRegistrations),
}));

// Insert schemas
export const insertPartnerSchema = createInsertSchema(partners).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertStudentSchema = createInsertSchema(students).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
});

export const insertEventRegistrationSchema = createInsertSchema(eventRegistrations).omit({
  id: true,
  registrationDate: true,
});

export const insertPartnerDocumentSchema = createInsertSchema(partnerDocuments).omit({
  id: true,
  uploadDate: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Partner = typeof partners.$inferSelect;
export type InsertPartner = z.infer<typeof insertPartnerSchema>;
export type Student = typeof students.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Enrollment = typeof enrollments.$inferSelect;
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type EventRegistration = typeof eventRegistrations.$inferSelect;
export type InsertEventRegistration = z.infer<typeof insertEventRegistrationSchema>;
export type CourseDocument = typeof courseDocuments.$inferSelect;
export type PartnerDocument = typeof partnerDocuments.$inferSelect;
export type InsertPartnerDocument = z.infer<typeof insertPartnerDocumentSchema>;
