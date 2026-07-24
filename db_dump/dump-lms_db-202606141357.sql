--
-- PostgreSQL database dump
--

\restrict ctGagbNBuRwLp1s28YrYgXp04qPyYVkAY5NAQg6iRlMOAwUauSNCkOTlB1FaNaP

-- Dumped from database version 16.13
-- Dumped by pg_dump version 18.4

-- Started on 2026-06-14 13:57:09 WIB

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 25584)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres_lms
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres_lms;

--
-- TOC entry 3771 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres_lms
--

COMMENT ON SCHEMA public IS '';


--
-- TOC entry 985 (class 1247 OID 26990)
-- Name: AssignmentStatus; Type: TYPE; Schema: public; Owner: postgres_lms
--

CREATE TYPE public."AssignmentStatus" AS ENUM (
    'PENDING',
    'IN_PROGRESS',
    'COMPLETED',
    'OVERDUE'
);


ALTER TYPE public."AssignmentStatus" OWNER TO postgres_lms;

--
-- TOC entry 982 (class 1247 OID 26982)
-- Name: AssignmentType; Type: TYPE; Schema: public; Owner: postgres_lms
--

CREATE TYPE public."AssignmentType" AS ENUM (
    'COURSE',
    'TRAINING',
    'LEARNING_PATH'
);


ALTER TYPE public."AssignmentType" OWNER TO postgres_lms;

--
-- TOC entry 889 (class 1247 OID 25660)
-- Name: CourseLevel; Type: TYPE; Schema: public; Owner: postgres_lms
--

CREATE TYPE public."CourseLevel" AS ENUM (
    'BEGINNER',
    'INTERMEDIATE',
    'ADVANCED'
);


ALTER TYPE public."CourseLevel" OWNER TO postgres_lms;

--
-- TOC entry 886 (class 1247 OID 25652)
-- Name: CourseStatus; Type: TYPE; Schema: public; Owner: postgres_lms
--

CREATE TYPE public."CourseStatus" AS ENUM (
    'DRAFT',
    'PUBLISHED',
    'ARCHIVED'
);


ALTER TYPE public."CourseStatus" OWNER TO postgres_lms;

--
-- TOC entry 904 (class 1247 OID 25720)
-- Name: EnrollmentStatus; Type: TYPE; Schema: public; Owner: postgres_lms
--

CREATE TYPE public."EnrollmentStatus" AS ENUM (
    'ENROLLED',
    'IN_PROGRESS',
    'COMPLETED',
    'DROPPED'
);


ALTER TYPE public."EnrollmentStatus" OWNER TO postgres_lms;

--
-- TOC entry 946 (class 1247 OID 25919)
-- Name: LearningPathStatus; Type: TYPE; Schema: public; Owner: postgres_lms
--

CREATE TYPE public."LearningPathStatus" AS ENUM (
    'DRAFT',
    'PUBLISHED',
    'ARCHIVED'
);


ALTER TYPE public."LearningPathStatus" OWNER TO postgres_lms;

--
-- TOC entry 892 (class 1247 OID 25668)
-- Name: LessonType; Type: TYPE; Schema: public; Owner: postgres_lms
--

CREATE TYPE public."LessonType" AS ENUM (
    'VIDEO',
    'DOCUMENT',
    'TEXT'
);


ALTER TYPE public."LessonType" OWNER TO postgres_lms;

--
-- TOC entry 961 (class 1247 OID 26003)
-- Name: NotificationType; Type: TYPE; Schema: public; Owner: postgres_lms
--

CREATE TYPE public."NotificationType" AS ENUM (
    'INFO',
    'ACHIEVEMENT',
    'REMINDER',
    'SYSTEM'
);


ALTER TYPE public."NotificationType" OWNER TO postgres_lms;

--
-- TOC entry 979 (class 1247 OID 26974)
-- Name: OrderItemType; Type: TYPE; Schema: public; Owner: postgres_lms
--

CREATE TYPE public."OrderItemType" AS ENUM (
    'COURSE',
    'TRAINING',
    'LEARNING_PATH'
);


ALTER TYPE public."OrderItemType" OWNER TO postgres_lms;

--
-- TOC entry 976 (class 1247 OID 26964)
-- Name: OrderStatus; Type: TYPE; Schema: public; Owner: postgres_lms
--

CREATE TYPE public."OrderStatus" AS ENUM (
    'PENDING',
    'PAID',
    'CANCELLED',
    'REFUNDED'
);


ALTER TYPE public."OrderStatus" OWNER TO postgres_lms;

--
-- TOC entry 928 (class 1247 OID 25833)
-- Name: QuestionType; Type: TYPE; Schema: public; Owner: postgres_lms
--

CREATE TYPE public."QuestionType" AS ENUM (
    'MULTIPLE_CHOICE',
    'ESSAY',
    'FILE_UPLOAD'
);


ALTER TYPE public."QuestionType" OWNER TO postgres_lms;

--
-- TOC entry 916 (class 1247 OID 25770)
-- Name: RegistrationStatus; Type: TYPE; Schema: public; Owner: postgres_lms
--

CREATE TYPE public."RegistrationStatus" AS ENUM (
    'REGISTERED',
    'ATTENDED',
    'ABSENT',
    'CANCELLED'
);


ALTER TYPE public."RegistrationStatus" OWNER TO postgres_lms;

--
-- TOC entry 871 (class 1247 OID 25596)
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres_lms
--

CREATE TYPE public."Role" AS ENUM (
    'SUPER_ADMIN',
    'HR_ADMIN',
    'MENTOR',
    'LEADER',
    'EMPLOYEE',
    'CUSTOMER'
);


ALTER TYPE public."Role" OWNER TO postgres_lms;

--
-- TOC entry 913 (class 1247 OID 25758)
-- Name: TrainingStatus; Type: TYPE; Schema: public; Owner: postgres_lms
--

CREATE TYPE public."TrainingStatus" AS ENUM (
    'DRAFT',
    'OPEN',
    'CLOSED',
    'COMPLETED',
    'CANCELLED'
);


ALTER TYPE public."TrainingStatus" OWNER TO postgres_lms;

--
-- TOC entry 910 (class 1247 OID 25751)
-- Name: TrainingType; Type: TYPE; Schema: public; Owner: postgres_lms
--

CREATE TYPE public."TrainingType" AS ENUM (
    'WORKSHOP',
    'SEMINAR',
    'BOOTCAMP'
);


ALTER TYPE public."TrainingType" OWNER TO postgres_lms;

--
-- TOC entry 973 (class 1247 OID 26959)
-- Name: Visibility; Type: TYPE; Schema: public; Owner: postgres_lms
--

CREATE TYPE public."Visibility" AS ENUM (
    'INTERNAL',
    'PUBLIC'
);


ALTER TYPE public."Visibility" OWNER TO postgres_lms;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 25585)
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres_lms
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres_lms;

--
-- TOC entry 217 (class 1259 OID 25617)
-- Name: accounts; Type: TABLE; Schema: public; Owner: postgres_lms
--

CREATE TABLE public.accounts (
    id text NOT NULL,
    "userId" text NOT NULL,
    type text NOT NULL,
    provider text NOT NULL,
    "providerAccountId" text NOT NULL,
    refresh_token text,
    access_token text,
    expires_at integer,
    token_type text,
    scope text,
    id_token text,
    session_state text
);


ALTER TABLE public.accounts OWNER TO postgres_lms;

--
-- TOC entry 240 (class 1259 OID 27021)
-- Name: ai_providers; Type: TABLE; Schema: public; Owner: postgres_lms
--

CREATE TABLE public.ai_providers (
    id text NOT NULL,
    provider text NOT NULL,
    "apiKey" text NOT NULL,
    model text NOT NULL,
    "isActive" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "customName" text,
    "apiUrl" text,
    models jsonb
);


ALTER TABLE public.ai_providers OWNER TO postgres_lms;

--
-- TOC entry 243 (class 1259 OID 27049)
-- Name: assignment_targets; Type: TABLE; Schema: public; Owner: postgres_lms
--

CREATE TABLE public.assignment_targets (
    id text NOT NULL,
    "assignmentId" text NOT NULL,
    "userId" text NOT NULL,
    status public."AssignmentStatus" DEFAULT 'PENDING'::public."AssignmentStatus" NOT NULL,
    progress integer DEFAULT 0 NOT NULL,
    "completedAt" timestamp(3) without time zone
);


ALTER TABLE public.assignment_targets OWNER TO postgres_lms;

--
-- TOC entry 242 (class 1259 OID 27040)
-- Name: assignments; Type: TABLE; Schema: public; Owner: postgres_lms
--

CREATE TABLE public.assignments (
    id text NOT NULL,
    type public."AssignmentType" NOT NULL,
    "itemId" text NOT NULL,
    title text NOT NULL,
    "assignedById" text NOT NULL,
    "startDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "dueDate" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.assignments OWNER TO postgres_lms;

--
-- TOC entry 231 (class 1259 OID 25876)
-- Name: attempt_answers; Type: TABLE; Schema: public; Owner: postgres_lms
--

CREATE TABLE public.attempt_answers (
    id text NOT NULL,
    "attemptId" text NOT NULL,
    "questionId" text NOT NULL,
    "optionId" text,
    "essayText" text,
    score integer,
    feedback text,
    "uploadedFiles" jsonb
);


ALTER TABLE public.attempt_answers OWNER TO postgres_lms;

--
-- TOC entry 235 (class 1259 OID 25978)
-- Name: certificates; Type: TABLE; Schema: public; Owner: postgres_lms
--

CREATE TABLE public.certificates (
    id text NOT NULL,
    "userId" text NOT NULL,
    "courseId" text,
    "pathId" text,
    "issuedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "pdfUrl" text,
    "isValid" boolean DEFAULT true NOT NULL
);


ALTER TABLE public.certificates OWNER TO postgres_lms;

--
-- TOC entry 220 (class 1259 OID 25675)
-- Name: courses; Type: TABLE; Schema: public; Owner: postgres_lms
--

CREATE TABLE public.courses (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    thumbnail text,
    level public."CourseLevel" DEFAULT 'BEGINNER'::public."CourseLevel" NOT NULL,
    status public."CourseStatus" DEFAULT 'DRAFT'::public."CourseStatus" NOT NULL,
    "creatorId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    price numeric(12,2),
    "promoPrice" numeric(12,2),
    visibility public."Visibility" DEFAULT 'INTERNAL'::public."Visibility" NOT NULL
);


ALTER TABLE public.courses OWNER TO postgres_lms;

--
-- TOC entry 223 (class 1259 OID 25729)
-- Name: enrollments; Type: TABLE; Schema: public; Owner: postgres_lms
--

CREATE TABLE public.enrollments (
    id text NOT NULL,
    "userId" text NOT NULL,
    "courseId" text NOT NULL,
    status public."EnrollmentStatus" DEFAULT 'ENROLLED'::public."EnrollmentStatus" NOT NULL,
    progress integer DEFAULT 0 NOT NULL,
    "enrolledAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "completedAt" timestamp(3) without time zone,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "lastLessonId" text,
    "dueDate" timestamp(3) without time zone,
    "expiresAt" timestamp(3) without time zone,
    "isMandatory" boolean DEFAULT false NOT NULL,
    "isTemporary" boolean DEFAULT false NOT NULL,
    "startDate" timestamp(3) without time zone
);


ALTER TABLE public.enrollments OWNER TO postgres_lms;

--
-- TOC entry 232 (class 1259 OID 25925)
-- Name: learning_paths; Type: TABLE; Schema: public; Owner: postgres_lms
--

CREATE TABLE public.learning_paths (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    thumbnail text,
    status public."LearningPathStatus" DEFAULT 'DRAFT'::public."LearningPathStatus" NOT NULL,
    "creatorId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    price numeric(12,2),
    "promoPrice" numeric(12,2),
    visibility public."Visibility" DEFAULT 'INTERNAL'::public."Visibility" NOT NULL
);


ALTER TABLE public.learning_paths OWNER TO postgres_lms;

--
-- TOC entry 226 (class 1259 OID 25813)
-- Name: lesson_completions; Type: TABLE; Schema: public; Owner: postgres_lms
--

CREATE TABLE public.lesson_completions (
    id text NOT NULL,
    "enrollmentId" text NOT NULL,
    "lessonId" text NOT NULL,
    "completedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.lesson_completions OWNER TO postgres_lms;

--
-- TOC entry 222 (class 1259 OID 25694)
-- Name: lessons; Type: TABLE; Schema: public; Owner: postgres_lms
--

CREATE TABLE public.lessons (
    id text NOT NULL,
    "moduleId" text NOT NULL,
    title text NOT NULL,
    type public."LessonType" DEFAULT 'TEXT'::public."LessonType" NOT NULL,
    content text,
    "videoUrl" text,
    "fileUrl" text,
    duration integer,
    "order" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.lessons OWNER TO postgres_lms;

--
-- TOC entry 221 (class 1259 OID 25685)
-- Name: modules; Type: TABLE; Schema: public; Owner: postgres_lms
--

CREATE TABLE public.modules (
    id text NOT NULL,
    "courseId" text NOT NULL,
    title text NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.modules OWNER TO postgres_lms;

--
-- TOC entry 236 (class 1259 OID 26011)
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres_lms
--

CREATE TABLE public.notifications (
    id text NOT NULL,
    "userId" text NOT NULL,
    type public."NotificationType" DEFAULT 'INFO'::public."NotificationType" NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    "actionUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.notifications OWNER TO postgres_lms;

--
-- TOC entry 241 (class 1259 OID 27030)
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres_lms
--

CREATE TABLE public.orders (
    id text NOT NULL,
    "userId" text NOT NULL,
    "itemType" public."OrderItemType" NOT NULL,
    "itemId" text NOT NULL,
    "itemTitle" text NOT NULL,
    price numeric(12,2) NOT NULL,
    "originalPrice" numeric(12,2) NOT NULL,
    status public."OrderStatus" DEFAULT 'PENDING'::public."OrderStatus" NOT NULL,
    "paidAt" timestamp(3) without time zone,
    notes text,
    "xenditInvoiceId" text,
    "xenditInvoiceUrl" text,
    "paymentMethod" text,
    "paymentGateway" text DEFAULT 'MANUAL'::text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.orders OWNER TO postgres_lms;

--
-- TOC entry 233 (class 1259 OID 25934)
-- Name: path_courses; Type: TABLE; Schema: public; Owner: postgres_lms
--

CREATE TABLE public.path_courses (
    id text NOT NULL,
    "pathId" text NOT NULL,
    "courseId" text NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.path_courses OWNER TO postgres_lms;

--
-- TOC entry 234 (class 1259 OID 25943)
-- Name: path_enrollments; Type: TABLE; Schema: public; Owner: postgres_lms
--

CREATE TABLE public.path_enrollments (
    id text NOT NULL,
    "userId" text NOT NULL,
    "pathId" text NOT NULL,
    "enrolledAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "completedAt" timestamp(3) without time zone,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "dueDate" timestamp(3) without time zone,
    "isMandatory" boolean DEFAULT false NOT NULL,
    "startDate" timestamp(3) without time zone
);


ALTER TABLE public.path_enrollments OWNER TO postgres_lms;

--
-- TOC entry 238 (class 1259 OID 26035)
-- Name: point_histories; Type: TABLE; Schema: public; Owner: postgres_lms
--

CREATE TABLE public.point_histories (
    id text NOT NULL,
    "userId" text NOT NULL,
    amount integer NOT NULL,
    reason text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.point_histories OWNER TO postgres_lms;

--
-- TOC entry 229 (class 1259 OID 25859)
-- Name: question_options; Type: TABLE; Schema: public; Owner: postgres_lms
--

CREATE TABLE public.question_options (
    id text NOT NULL,
    "questionId" text NOT NULL,
    text text NOT NULL,
    "isCorrect" boolean DEFAULT false NOT NULL,
    "order" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.question_options OWNER TO postgres_lms;

--
-- TOC entry 228 (class 1259 OID 25849)
-- Name: questions; Type: TABLE; Schema: public; Owner: postgres_lms
--

CREATE TABLE public.questions (
    id text NOT NULL,
    "quizId" text NOT NULL,
    type public."QuestionType" NOT NULL,
    text text NOT NULL,
    points integer DEFAULT 1 NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "allowedFileTypes" text,
    "maxFileCount" integer DEFAULT 1,
    "maxFileSizeMB" integer,
    "uploadInstructions" text
);


ALTER TABLE public.questions OWNER TO postgres_lms;

--
-- TOC entry 230 (class 1259 OID 25868)
-- Name: quiz_attempts; Type: TABLE; Schema: public; Owner: postgres_lms
--

CREATE TABLE public.quiz_attempts (
    id text NOT NULL,
    "quizId" text NOT NULL,
    "enrollmentId" text NOT NULL,
    score integer,
    passed boolean,
    "startedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "submittedAt" timestamp(3) without time zone
);


ALTER TABLE public.quiz_attempts OWNER TO postgres_lms;

--
-- TOC entry 227 (class 1259 OID 25837)
-- Name: quizzes; Type: TABLE; Schema: public; Owner: postgres_lms
--

CREATE TABLE public.quizzes (
    id text NOT NULL,
    "courseId" text NOT NULL,
    title text NOT NULL,
    description text,
    "passingScore" integer DEFAULT 70 NOT NULL,
    duration integer,
    "maxAttempts" integer DEFAULT 1 NOT NULL,
    "shuffleQuestions" boolean DEFAULT false NOT NULL,
    "showResult" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "order" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.quizzes OWNER TO postgres_lms;

--
-- TOC entry 218 (class 1259 OID 25624)
-- Name: sessions; Type: TABLE; Schema: public; Owner: postgres_lms
--

CREATE TABLE public.sessions (
    id text NOT NULL,
    "sessionToken" text NOT NULL,
    "userId" text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.sessions OWNER TO postgres_lms;

--
-- TOC entry 237 (class 1259 OID 26026)
-- Name: settings; Type: TABLE; Schema: public; Owner: postgres_lms
--

CREATE TABLE public.settings (
    id text NOT NULL,
    key text NOT NULL,
    value text NOT NULL,
    description text,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.settings OWNER TO postgres_lms;

--
-- TOC entry 239 (class 1259 OID 27012)
-- Name: training_courses; Type: TABLE; Schema: public; Owner: postgres_lms
--

CREATE TABLE public.training_courses (
    id text NOT NULL,
    "trainingId" text NOT NULL,
    "courseId" text NOT NULL,
    "accessDurationInDays" integer DEFAULT 14 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.training_courses OWNER TO postgres_lms;

--
-- TOC entry 225 (class 1259 OID 25788)
-- Name: training_registrations; Type: TABLE; Schema: public; Owner: postgres_lms
--

CREATE TABLE public.training_registrations (
    id text NOT NULL,
    "userId" text NOT NULL,
    "trainingId" text NOT NULL,
    status public."RegistrationStatus" DEFAULT 'REGISTERED'::public."RegistrationStatus" NOT NULL,
    "registeredAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "dueDate" timestamp(3) without time zone,
    "isMandatory" boolean DEFAULT false NOT NULL,
    "startDate" timestamp(3) without time zone
);


ALTER TABLE public.training_registrations OWNER TO postgres_lms;

--
-- TOC entry 224 (class 1259 OID 25779)
-- Name: trainings; Type: TABLE; Schema: public; Owner: postgres_lms
--

CREATE TABLE public.trainings (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    type public."TrainingType" NOT NULL,
    status public."TrainingStatus" DEFAULT 'DRAFT'::public."TrainingStatus" NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    location text,
    "onlineUrl" text,
    capacity integer,
    cover text,
    "creatorId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    price numeric(12,2),
    "promoPrice" numeric(12,2),
    visibility public."Visibility" DEFAULT 'INTERNAL'::public."Visibility" NOT NULL
);


ALTER TABLE public.trainings OWNER TO postgres_lms;

--
-- TOC entry 216 (class 1259 OID 25607)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres_lms
--

CREATE TABLE public.users (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    role public."Role" DEFAULT 'EMPLOYEE'::public."Role" NOT NULL,
    department text,
    "position" text,
    avatar text,
    "isActive" boolean DEFAULT true NOT NULL,
    "emailVerified" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    points integer DEFAULT 0 NOT NULL,
    "joinYear" integer,
    nik text
);


ALTER TABLE public.users OWNER TO postgres_lms;

--
-- TOC entry 219 (class 1259 OID 25631)
-- Name: verification_tokens; Type: TABLE; Schema: public; Owner: postgres_lms
--

CREATE TABLE public.verification_tokens (
    identifier text NOT NULL,
    token text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.verification_tokens OWNER TO postgres_lms;

--
-- TOC entry 3737 (class 0 OID 25585)
-- Dependencies: 215
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres_lms
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
d02d4d9e-81a4-4fcb-9ed8-440ec05e8fd5	a706205a7ee44c493799a38041ff1a3fd64da6f174dc6d08cd6f545ab3b36c30	2026-05-14 04:29:17.355736+00	20260213025855_init	\N	\N	2026-05-14 04:29:14.25818+00	1
c1f4affd-11cf-4c98-9905-d408b74d1c48	090f304dc54e928c5345abe320b53c256a532cc4f9629facc4951c26fd5d1a51	2026-05-14 04:29:20.245+00	20260218232113_add_course_module_lesson	\N	\N	2026-05-14 04:29:17.733254+00	1
4197f9c6-c9d5-435c-aad9-5884bc626210	fde7b9cce55563002e9ac5ce5833a1290079efdb7878fc8dbab65f83a1177adb	2026-05-14 04:29:22.323522+00	20260219000238_add_enrollment	\N	\N	2026-05-14 04:29:20.617776+00	1
5bc4cdd0-c4c3-4376-a9ca-da17a0cd2712	95820842161ed6b7e7a30e8783fcd03185afa2d8b734fcdae30dfb2d50f77d64	2026-05-14 04:29:25.175174+00	20260219001224_add_training	\N	\N	2026-05-14 04:29:22.701428+00	1
c229a698-e386-4d54-a073-8d8c29884fbb	83130605521a9857d015b83c3d1a8a5f864e11b6892f94e7793392070829d4ec	2026-05-14 04:29:27.297423+00	20260226021850_add_lesson_completion_and_last_lesson	\N	\N	2026-05-14 04:29:25.547088+00	1
3bc05ce5-5f36-437b-8d6e-f7ec171b3996	8a50e1cf6ec9d2a02acd3758261b090f21e33ed483a36837d15a0fbd18328122	2026-05-14 04:29:30.934124+00	20260226023545_add_quiz_assessment	\N	\N	2026-05-14 04:29:27.672298+00	1
0fcc8f09-db88-4962-a689-34469749b144	dc9a2ac0149e2b597e5b477e93a3ceb3b2596688fb6d8ddbaf12a773f11be83a	2026-05-14 04:29:34.175714+00	20260226034414_add_learning_path_milestone_9	\N	\N	2026-05-14 04:29:31.31749+00	1
26763dcb-5684-495c-b5d2-c2ee4a39a986	3632081649e1f23212022aaed60091051780230e7990a856430bd38c1aca0e39	2026-05-14 04:29:36.066389+00	20260226041133_add_certificate_milestone_10	\N	\N	2026-05-14 04:29:34.548645+00	1
91d172b0-dd0f-4e6b-82d3-3078dc58f817	b6354496a07727aea409fde83cab7faa251329db176531ec06aaadc45dd96b41	2026-05-14 04:29:37.762886+00	20260226063114_add_notification_milestone_11	\N	\N	2026-05-14 04:29:36.439732+00	1
dc292771-b749-43e4-b849-493602637847	ca7ee12b6f73029bbc7461989a861c6debfc3f9a50436b8ffd055b64e1e23058	2026-05-14 04:29:39.266585+00	20260226095500_add_setting_model	\N	\N	2026-05-14 04:29:38.13493+00	1
0c09fadd-afd4-40df-b781-7e154f8baab4	49840c3193d70822ad0825f2aaaf5e607f144c154b204bdd10d80dc5753b7ae5	2026-05-14 04:29:40.956162+00	20260227012230_add_gamification_models	\N	\N	2026-05-14 04:29:39.63852+00	1
\.


--
-- TOC entry 3739 (class 0 OID 25617)
-- Dependencies: 217
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: postgres_lms
--

COPY public.accounts (id, "userId", type, provider, "providerAccountId", refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) FROM stdin;
\.


--
-- TOC entry 3762 (class 0 OID 27021)
-- Dependencies: 240
-- Data for Name: ai_providers; Type: TABLE DATA; Schema: public; Owner: postgres_lms
--

COPY public.ai_providers (id, provider, "apiKey", model, "isActive", "createdAt", "updatedAt", "customName", "apiUrl", models) FROM stdin;
cmpqnlype000004lamw2o9xy6	CUSTOM	djE6V21oTktvYUJrUVNHS1IyVGIxYlphUT09OlJLZ2tTdWlzZHZ0MEdzRi96OTZTZXc9PTpZbllQbzk4aXFXa2RleEdRbDc3M3dyQjByY1ZOMmhYbE5reUtpbC91NEszdUZKYz0=	gemini/gemini-3-flash-preview	t	2026-05-29 08:22:25.01	2026-06-09 03:25:18.211	9 router	https://9router-dev.sitamoto.ai/v1	[{"id": "gemini/gemini-3-flash-preview", "label": "gemini-3-flash-preview", "description": ""}]
\.


--
-- TOC entry 3765 (class 0 OID 27049)
-- Dependencies: 243
-- Data for Name: assignment_targets; Type: TABLE DATA; Schema: public; Owner: postgres_lms
--

COPY public.assignment_targets (id, "assignmentId", "userId", status, progress, "completedAt") FROM stdin;
\.


--
-- TOC entry 3764 (class 0 OID 27040)
-- Dependencies: 242
-- Data for Name: assignments; Type: TABLE DATA; Schema: public; Owner: postgres_lms
--

COPY public.assignments (id, type, "itemId", title, "assignedById", "startDate", "dueDate", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 3753 (class 0 OID 25876)
-- Dependencies: 231
-- Data for Name: attempt_answers; Type: TABLE DATA; Schema: public; Owner: postgres_lms
--

COPY public.attempt_answers (id, "attemptId", "questionId", "optionId", "essayText", score, feedback, "uploadedFiles") FROM stdin;
\.


--
-- TOC entry 3757 (class 0 OID 25978)
-- Dependencies: 235
-- Data for Name: certificates; Type: TABLE DATA; Schema: public; Owner: postgres_lms
--

COPY public.certificates (id, "userId", "courseId", "pathId", "issuedAt", "pdfUrl", "isValid") FROM stdin;
cmpex22tk000204jsdnqitw28	cmpdjyd2m000004l8a618xllh	cmp6h8i5g000004jsg0sqon65	\N	2026-05-21 03:13:39.178	\N	t
cmpexh07g000204l1qieruxqy	cmpauwy88000504l7brbkrk7a	cmp6h8i5g000004jsg0sqon65	\N	2026-05-21 03:25:15.627	\N	t
cmpexsxw7000804l41vq9zfaa	cmpauwy88000504l7brbkrk7a	cmp6hjoca000404jsoue7f5uq	\N	2026-05-21 03:34:32.5	\N	t
cmpexzhzi000f04l40ev9p5yi	cmpavwml8000104icnr5fi1j5	cmp6h8i5g000004jsg0sqon65	\N	2026-05-21 03:39:38.478	\N	t
cmpeyu0jv000204ldzqe61rt4	cmpavzuvp000204ictsqhg7iy	cmp6h8i5g000004jsg0sqon65	\N	2026-05-21 04:03:22.215	\N	t
cmpeyx6cw000o04l451fapv1f	cmpeu0z8h000004jxdbm3yh50	cmp6h8i5g000004jsg0sqon65	\N	2026-05-21 04:05:49.715	\N	t
cmpeyy16o000a04ldyzxomgjh	cmpdjyd2m000004l8a618xllh	cmp6hjoca000404jsoue7f5uq	\N	2026-05-21 04:06:29.606	\N	t
cmpeyy38z000g04ldl11bvgke	cmpavzuvp000204ictsqhg7iy	cmp6hjoca000404jsoue7f5uq	\N	2026-05-21 04:06:32.339	\N	t
cmpeyytnw000m04ldc9ixi9ds	cmpeu0z8h000004jxdbm3yh50	cmp6hjoca000404jsoue7f5uq	\N	2026-05-21 04:07:06.549	\N	t
cmpf38b8j000204kvt85y0931	cmpavzuvp000204ictsqhg7iy	cmp6hooc6000404kz4q7ups1p	\N	2026-05-21 06:06:27.707	\N	t
cmpf3s7ly000904jlpiaisj0w	cmpc2e7ss000004jmotm0s6l6	cmp6h8i5g000004jsg0sqon65	\N	2026-05-21 06:21:56.138	\N	t
cmpf3vt41000f04jlpjeu9ztm	cmpavwml8000104icnr5fi1j5	cmp6hjoca000404jsoue7f5uq	\N	2026-05-21 06:24:43.97	\N	t
cmpf40y6c000b04kv5me6a9vb	cmpc2e7ss000004jmotm0s6l6	cmp6hjoca000404jsoue7f5uq	\N	2026-05-21 06:28:43.807	\N	t
cmpf4clwx000o04jlk0z5trge	cmpauwy88000504l7brbkrk7a	cmp6hooc6000404kz4q7ups1p	\N	2026-05-21 06:37:47.793	\N	t
cmpf4q34n000604jocfl3h8dl	cmpc2e7ss000004jmotm0s6l6	cmp6hooc6000404kz4q7ups1p	\N	2026-05-21 06:48:16.629	\N	t
cmpf4qeb7001104jlv1fo42gf	cmpdjyd2m000004l8a618xllh	cmp6hooc6000404kz4q7ups1p	\N	2026-05-21 06:48:31.12	\N	t
cmpf4qfoa001704jlu8qrf8jb	cmpby3n1h000404jmxq5up352	cmp6h8i5g000004jsg0sqon65	\N	2026-05-21 06:48:32.89	\N	t
cmpf4ridq001e04jlm32uo3wk	cmpby3n1h000404jmxq5up352	cmp6hjoca000404jsoue7f5uq	\N	2026-05-21 06:49:23.053	\N	t
cmpf4w7hk000404l1nmuharog	cmpc00slt000204ldi8ru8xiz	cmp6h8i5g000004jsg0sqon65	\N	2026-05-21 06:53:02.215	\N	t
cmpf5i3q4000p04jo9ebzrpla	cmpcco602000004jszi4gyji2	cmp6h8i5g000004jsg0sqon65	\N	2026-05-21 07:10:03.756	\N	t
cmpf5iyg4000404jvvbhcwf1x	cmpcco602000004jszi4gyji2	cmp6hjoca000404jsoue7f5uq	\N	2026-05-21 07:10:43.588	\N	t
cmpf5tl3n000604jun4zekr9a	cmpf5rfbl000004i8ujcbh2hd	cmp6h8i5g000004jsg0sqon65	\N	2026-05-21 07:18:59.502	\N	t
cmpf5ud59000t04jvv6afh041	cmpf5rfbl000004i8ujcbh2hd	cmp6hjoca000404jsoue7f5uq	\N	2026-05-21 07:19:35.853	\N	t
cmpf5w3a4000a04l6b4q6utwt	cmpavwml8000104icnr5fi1j5	cmp6hooc6000404kz4q7ups1p	\N	2026-05-21 07:20:56.374	\N	t
cmpf5ym3p000z04jvo0pgj8is	cmpf5rfbl000004i8ujcbh2hd	cmp6hooc6000404kz4q7ups1p	\N	2026-05-21 07:22:54.086	\N	t
cmpf5zww1000a05kw3jzo1zhu	cmpf5rfbl000004i8ujcbh2hd	cmp6ht3jr000204l46dmtac0x	\N	2026-05-21 07:23:54.721	\N	t
cmpf60oxe000i05kwomq7tl86	cmpf5rfbl000004i8ujcbh2hd	cmp6i2wxu000504l4y25ozxel	\N	2026-05-21 07:24:31.061	\N	t
cmpf628o7000m04l6k84u1ufm	cmpbzh465000004kzf90zix9b	cmp6h8i5g000004jsg0sqon65	\N	2026-05-21 07:25:43.297	\N	t
cmpf635e3000u04l6v5mwx2wl	cmpbzh465000004kzf90zix9b	cmp6hjoca000404jsoue7f5uq	\N	2026-05-21 07:26:25.703	\N	t
cmpf64u5n000v05kwlejwl4xa	cmpbzh465000004kzf90zix9b	cmp6hooc6000404kz4q7ups1p	\N	2026-05-21 07:27:44.443	\N	t
cmpf69e9b000p04jukqkh5u6v	cmpcco602000004jszi4gyji2	cmp6hooc6000404kz4q7ups1p	\N	2026-05-21 07:31:17.142	\N	t
cmpf6ax0o001304l6glzim0r4	cmpcco602000004jszi4gyji2	cmp6ht3jr000204l46dmtac0x	\N	2026-05-21 07:32:28.104	\N	t
cmpf6cmi9000x04juwwmfwv3y	cmpcco602000004jszi4gyji2	cmp6i2wxu000504l4y25ozxel	\N	2026-05-21 07:33:47.794	\N	t
cmpf71r63001c04l6g4c7hiot	cmpavwml8000104icnr5fi1j5	cmp6ht3jr000204l46dmtac0x	\N	2026-05-21 07:53:20.162	\N	t
cmpf86ehe000204kwkfooew8q	cmpauwy88000504l7brbkrk7a	cmp6ht3jr000204l46dmtac0x	\N	2026-05-21 08:24:56.689	\N	t
cmpfa2kg5000204kzgpk76skx	cmpdjyd2m000004l8a618xllh	cmp6ht3jr000204l46dmtac0x	\N	2026-05-21 09:17:57.032	\N	t
cmpfb803x000104ic8r7tah4l	cmpauwy88000504l7brbkrk7a	cmp6i2wxu000504l4y25ozxel	\N	2026-05-21 09:50:10.222	\N	t
cmpfb9rs6000304i5eadop4gv	cmpdjyd2m000004l8a618xllh	\N	cmp6eetva000004l5ibt5lfdn	2026-05-21 09:51:32.745	\N	t
cmpfb9sj7000504i5nks9329k	cmpdjyd2m000004l8a618xllh	cmp6i2wxu000504l4y25ozxel	\N	2026-05-21 09:51:33.716	\N	t
cmpflr2s8000404l1z35snw0h	cmpcj94wh000004l2n1xb9l80	cmp6h8i5g000004jsg0sqon65	\N	2026-05-21 14:44:56.316	\N	t
cmpfm9vih000204jp3uu7jh53	cmpcj94wh000004l2n1xb9l80	cmp6hjoca000404jsoue7f5uq	\N	2026-05-21 14:59:33.351	\N	t
cmpg66enp000304ic300h0ztd	cmpavuniy000004ic2scwt305	cmp6h8i5g000004jsg0sqon65	\N	2026-05-22 00:16:43.865	\N	t
cmpg6e1tt000404kz1woq5duw	cmpavuniy000004ic2scwt305	cmp6hjoca000404jsoue7f5uq	\N	2026-05-22 00:22:40.465	\N	t
cmpg6hmq3000204l53mnlgywj	cmpavuniy000004ic2scwt305	cmp6hooc6000404kz4q7ups1p	\N	2026-05-22 00:25:27.532	\N	t
cmpg6in8r000a04l5tst9l1ck	cmpavuniy000004ic2scwt305	cmp6ht3jr000204l46dmtac0x	\N	2026-05-22 00:26:14.86	\N	t
cmpg6pdks000g04l5tk714nno	cmpavuniy000004ic2scwt305	cmp6i2wxu000504l4y25ozxel	\N	2026-05-22 00:31:28.929	\N	t
cmpg74d2y000504jp2pqnrzc2	cmpby3n1h000404jmxq5up352	cmp6hooc6000404kz4q7ups1p	\N	2026-05-22 00:43:08.118	\N	t
cmpg75nip000504jpqnwoymqs	cmpby3n1h000404jmxq5up352	cmp6ht3jr000204l46dmtac0x	\N	2026-05-22 00:44:08.306	\N	t
cmpg76hz7000c04jpbbn737vn	cmpby3n1h000404jmxq5up352	\N	cmp6eetva000004l5ibt5lfdn	2026-05-22 00:44:47.78	\N	t
cmpg76iqw000e04jpc9ipma71	cmpby3n1h000404jmxq5up352	cmp6i2wxu000504l4y25ozxel	\N	2026-05-22 00:44:48.773	\N	t
cmpg80qg1000404l8cy1yrmaz	cmpby32ba000304jm517sn0i2	cmp6h8i5g000004jsg0sqon65	\N	2026-05-22 01:08:18.427	\N	t
cmpg81k4u000504laulyb2vy8	cmpby32ba000304jm517sn0i2	cmp6hjoca000404jsoue7f5uq	\N	2026-05-22 01:08:56.912	\N	t
cmpg82gcr000804jpfnv1q8s9	cmpby32ba000304jm517sn0i2	cmp6hooc6000404kz4q7ups1p	\N	2026-05-22 01:09:38.662	\N	t
cmpg8fgjt000304l7l2v5dce5	cmpbzwne4000004icd9d3mj9g	cmp6h8i5g000004jsg0sqon65	\N	2026-05-22 01:19:45.449	\N	t
cmpg8gimn000i04jpn84s1aov	cmpbzwne4000004icd9d3mj9g	cmp6hjoca000404jsoue7f5uq	\N	2026-05-22 01:20:34.802	\N	t
cmpg8h8ob000804l2xsqelhve	cmpbzwne4000004icd9d3mj9g	cmp6hooc6000404kz4q7ups1p	\N	2026-05-22 01:21:08.557	\N	t
cmpg8i7yb000d04l7fk7qqihc	cmpbzwne4000004icd9d3mj9g	cmp6ht3jr000204l46dmtac0x	\N	2026-05-22 01:21:54.276	\N	t
cmpg8iyim000e04l827lrd8ju	cmpbzwne4000004icd9d3mj9g	\N	cmp6eetva000004l5ibt5lfdn	2026-05-22 01:22:28.7	\N	t
cmpg8iz9z000g04l8abx0qc1o	cmpbzwne4000004icd9d3mj9g	cmp6i2wxu000504l4y25ozxel	\N	2026-05-22 01:22:29.688	\N	t
cmpgffr8l000404jsx3uk64p3	cmpb17ttx000004l2le1aa3f4	cmp6h8i5g000004jsg0sqon65	\N	2026-05-22 04:35:56.611	\N	t
cmpgfgpvy000704lbr0icwzqa	cmpb17ttx000004l2le1aa3f4	cmp6hjoca000404jsoue7f5uq	\N	2026-05-22 04:36:41.515	\N	t
cmpgfhdlu000604kzhbqs25wi	cmpb17ttx000004l2le1aa3f4	cmp6hooc6000404kz4q7ups1p	\N	2026-05-22 04:37:12.256	\N	t
cmpgfj238000d04jsrog9sdmg	cmpb17ttx000004l2le1aa3f4	cmp6ht3jr000204l46dmtac0x	\N	2026-05-22 04:38:30.646	\N	t
cmpgfjrr7000g04kz2d6lkcci	cmpb17ttx000004l2le1aa3f4	\N	cmp6eetva000004l5ibt5lfdn	2026-05-22 04:39:03.9	\N	t
cmpgfjsle000i04kziq8jy2lp	cmpb17ttx000004l2le1aa3f4	cmp6i2wxu000504l4y25ozxel	\N	2026-05-22 04:39:04.989	\N	t
cmq60j75n000304jv1y24msp2	cmpcfpyx4000504l2ub2vc5ae	cmp6h8i5g000004jsg0sqon65	\N	2026-06-09 02:20:43.547	\N	t
cmq6d5p3t000204jvurwklqp6	cmpcfpyx4000504l2ub2vc5ae	cmp6hjoca000404jsoue7f5uq	\N	2026-06-09 08:14:08.637	\N	t
\.


--
-- TOC entry 3742 (class 0 OID 25675)
-- Dependencies: 220
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: postgres_lms
--

COPY public.courses (id, title, description, thumbnail, level, status, "creatorId", "createdAt", "updatedAt", price, "promoPrice", visibility) FROM stdin;
cmp6h8i5g000004jsg0sqon65	Modul 1: Mengenal Kecerdasan Buatan (AI)	# Modul 1: Fondasi Pemahaman AI\r\n\r\n> *Membangun fondasi pemahaman tentang apa itu AI, bagaimana sejarah perkembangannya, dan mengapa AI relevan di dunia kerja modern.*\r\n\r\nSebelum kita masuk ke teknik prompting (Modul 3) atau metodologi 4D (Modul 4), kita perlu fondasi yang solid. Tanpa fondasi ini, kamu akan menggunakan AI seperti orang yang asal pencet tombol di mesin — kadang dapat hasil bagus, kadang tidak, tanpa tahu kenapa.\r\n\r\nModul 1 ini terbagi menjadi tiga section yang saling melengkapi:\r\n- **Section 1.1:** Apa itu AI?\r\n- **Section 1.2:** Bagaimana cara kerjanya?\r\n- **Section 1.3:** Alat apa saja yang tersedia?\r\n\r\nKombinasi ketiganya akan membuatmu siap melangkah ke modul-modul berikutnya dengan percaya diri.	\N	BEGINNER	PUBLISHED	cmp6e3upk000004l79aodzzpi	2026-05-15 05:28:35.812	2026-06-08 06:15:08.212	\N	\N	INTERNAL
cmp6ht3jr000204l46dmtac0x	Modul 4: The 4D Prompt Optimization Methodology	# Modul 4: Framework 4D\r\n\r\n> *Kerangka kerja sistematis untuk mengoptimalkan setiap prompt sebelum dikirim ke AI, sehingga output berkualitas tinggi dihasilkan secara konsisten.*\r\n\r\nModul ini adalah inti dari seluruh Level Beginner. Di Modul 1-3 kamu belajar apa itu AI, cara kerjanya, etika pemakaian, komponen prompt, dan teknik-teknik prompting. Di Modul 4, semua itu dirangkai jadi satu kerangka kerja yang bisa kamu jalankan secara sistematis.\r\n\r\n**4D Methodology** bukan teori baru. Ini adalah kerangka berpikir yang memaksa kamu tidak melewatkan langkah-langkah penting saat sedang buru-buru. Empat tahap berurutan:\r\n- **Deconstruct**\r\n- **Diagnose**\r\n- **Develop**\r\n- **Deliver**\r\n\r\nMasing-masing hanya memakan waktu 2–3 menit. Total waktu **7–11 menit** untuk tugas menengah, yang hampir selalu lebih singkat daripada waktu yang dihabiskan untuk iterasi yang tidak perlu.	\N	BEGINNER	PUBLISHED	cmp6e3upk000004l79aodzzpi	2026-05-15 05:44:36.663	2026-06-03 06:25:01.52	\N	\N	INTERNAL
cmp6i2wxu000504l4y25ozxel	Modul 5: Aplikasi Praktis AI dalam Pekerjaan Sehari-Hari	# Modul 5: Penutup Level Beginner\r\n\r\n> *Modul penutup Level Beginner. Ini bukan teori lagi, ini praktik yang bisa langsung kamu jalankan mulai besok.*\r\n\r\nDi empat modul sebelumnya kamu telah membangun fondasi yang solid:\r\n- **Modul 1:** Apa itu AI\r\n- **Modul 2:** Etika dan keamanan\r\n- **Modul 3:** Teknik prompting\r\n- **Modul 4:** Framework 4D\r\n\r\nSekarang saatnya menerapkan semuanya ke pekerjaan nyata.\r\n\r\nModul ini berbeda dari modul sebelumnya. Fokusnya bukan menambah pengetahuan baru, tapi **membangun kebiasaan**. Kamu akan:\r\n- Mempraktikkan AI untuk tugas-tugas kerja sebenarnya\r\n- Membangun *Prompt Library* pribadi yang akan kamu pakai bertahun-tahun\r\n- Membuat rencana integrasi AI untuk 30 hari ke depan	\N	BEGINNER	PUBLISHED	cmp6e3upk000004l79aodzzpi	2026-05-15 05:52:14.658	2026-05-19 06:08:26.145	\N	\N	INTERNAL
cmp6hjoca000404jsoue7f5uq	Modul 2: Etika dan Keamanan Penggunaan AI	# Modul 2: Etika dan Keamanan AI\r\n\r\n> *Menggunakan AI yang powerful tanpa pemahaman etika adalah risiko yang nyata. Modul ini membekali Anda dengan enam prinsip etika AI, cara mengenali dan menghindari AI Hallucination, teknik mengklasifikasikan dan mengamankan data perusahaan, serta pemahaman regulasi AI yang berlaku.*\r\n\r\nSebelum kita mendalami cara menggunakan AI secara efektif (Modul 3), sangat penting memahami dimensi etika dan keamanannya. Ini bukan sekadar aturan formal — ini tentang menjadi pengguna AI yang bertanggung jawab dan melindungi dirimu, timmu, dan perusahaanmu dari risiko yang sangat nyata.\r\n\r\nDi Modul 1, kamu sudah belajar apa itu AI dan cara kerjanya. Sekarang kamu tahu bahwa AI itu sangat powerful. Tapi ingat: **semakin powerful sebuah alat, semakin besar tanggung jawab penggunanya.** *Spider-Man wisdom* yang ternyata sangat relevan di era AI.	\N	BEGINNER	PUBLISHED	cmp6e3upk000004l79aodzzpi	2026-05-15 05:37:17.05	2026-06-03 06:23:29.674	\N	\N	INTERNAL
cmp6hooc6000404kz4q7ups1p	Modul 3: Dasar-Dasar Prompting	# Modul 3: Teknik Prompting\r\n\r\n> *Kemampuan berkomunikasi secara efektif dengan AI adalah keterampilan terpenting di era sekarang. Modul ini mengajarkan seni dan ilmu menyusun instruksi untuk mendapatkan hasil terbaik dari AI.*\r\n\r\nDi Modul 1 kamu sudah paham apa itu AI dan cara kerjanya. Di Modul 2 kamu sudah paham batasan etika dan keamanan yang harus dijaga. **Sekarang saatnya belajar cara berbicara dengan AI supaya mendapat output terbaik.** Ini yang akan jadi pembeda terbesar antara pengguna AI yang biasa-biasa saja dengan yang benar-benar produktif.\r\n\r\nKabar baiknya: prompting bukan ilmu hitam yang butuh bertahun-tahun dikuasai. Dalam 3–4 jam modul ini, kamu akan punya fondasi yang setara dengan apa yang dipelajari banyak *"prompt engineer"* profesional. Sisanya hanya latihan dan penyempurnaan.	\N	BEGINNER	PUBLISHED	cmp6e3upk000004l79aodzzpi	2026-05-15 05:41:10.326	2026-06-03 06:24:18.089	\N	\N	INTERNAL
cmpwfacbn000004jowtmvf46s	Talent Development Program: Human Capital Management	KONTEKS PROGRAM:\r\nProgram ini bukan sekadar pelatihan teknis, melainkan membangun cara berpikir, ownership, dan leadership maturity agar peserta mampu menjadi business partner dan operational leader — bukan hanya executor pekerjaan HR.\r\n\r\nBuatkan struktur kursus TDP (Training & Development Program) untuk 2 peserta berikut, berdasarkan program HCM Successorship & Operational Readiness di PT Vascomm Solusi Teknologi:\r\n\r\nPESERTA 1 — ROFIQ (HC Strategic, Supervisor Level)\r\nTarget akhir: Mampu menjadi acting HC Manager\r\nFokus kompetensi: Strategic thinking, workforce planning, policy awareness, OKR & business alignment, leadership communication, operational governance, decision making\r\n\r\nPESERTA 2 — SUKMA (HC Assistant, Staff Level)\r\nTarget akhir: Mampu menjadi operational backbone HCM secara mandiri\r\nFokus kompetensi: Operational accuracy, administrative governance, detail orientation, communication confidence, execution consistency, reporting quality	\N	INTERMEDIATE	DRAFT	admin_4b0bb3106fe9207a83a7	2026-06-02 09:16:02.914	2026-06-08 06:10:14.008	\N	\N	INTERNAL
cmqang6v9000004jp7qrrgjgr	Talent Development Program: Finance & Accounting	Deskripsi Program: Finance & Accounting Excellence & Leadership Development\r\nProgram ini mentransformasi staf dari pencatat transaksi menjadi Strategic Business Partner. Tujuannya adalah menstandardisasi kompetensi, menjaga kelangsungan operasional, dan mencetak suksesor manajerial.\r\nKompetensi Utama:\r\n1. Penguasaan operasional end-to-end FA (akuntansi, pajak, arus kas) dengan prinsip zero-error tolerance.  \r\n2. Pengembangan keahlian financial storytelling, pengambilan keputusan taktis, dan ownership atas efisiensi risiko.  \r\n\r\nStruktur Program:\r\nTerdiri dari 4 fase komprehensif: Financial Observation, Siklus Bulanan, Controlled Financial Ownership, dan Successor Readiness.  \r\nTarget Kelulusan:\r\nPeserta mampu memimpin operasional secara mandiri, mempresentasikan performa keuangan ke jajaran manajemen secara lugas, dan bertindak sebagai backup penuh untuk Manajer FA.  	\N	INTERMEDIATE	DRAFT	admin_4b0bb3106fe9207a83a7	2026-06-12 08:13:19.172	2026-06-12 08:13:34.864	\N	\N	INTERNAL
\.


--
-- TOC entry 3745 (class 0 OID 25729)
-- Dependencies: 223
-- Data for Name: enrollments; Type: TABLE DATA; Schema: public; Owner: postgres_lms
--

COPY public.enrollments (id, "userId", "courseId", status, progress, "enrolledAt", "completedAt", "updatedAt", "lastLessonId", "dueDate", "expiresAt", "isMandatory", "isTemporary", "startDate") FROM stdin;
cmpdhm0g2000104ju2viw71ye	cmpcf8423000104le1xk4s30x	cmp6h8i5g000004jsg0sqon65	IN_PROGRESS	0	2026-05-20 03:13:29.186	\N	2026-05-20 03:14:17.844	cmpc81kvf000004l7a94e5otf	\N	\N	f	f	\N
cmpf3os8g000404jl2ttemrt1	cmpc2e7ss000004jmotm0s6l6	cmp6h8i5g000004jsg0sqon65	IN_PROGRESS	100	2026-05-21 06:19:16.209	2026-05-21 06:21:54.807	2026-05-21 06:25:31.676	cmp6hde8e000104l1tehzmuzm	\N	\N	f	f	\N
cmpeyu03t000104lducprwdkp	cmpavzuvp000204ictsqhg7iy	cmp6hjoca000404jsoue7f5uq	COMPLETED	100	2026-05-21 04:03:21.542	2026-05-21 04:06:31.328	2026-05-21 04:06:31.328	cmp6hn3al000304joeay3gzut	\N	\N	f	f	\N
cmpevib8o000104l2ygoqoq6a	cmpchuyb6000004l8ak22lana	cmp6h8i5g000004jsg0sqon65	IN_PROGRESS	0	2026-05-21 02:30:17.354	\N	2026-05-21 06:17:50.402	cmpc81kvf000004l7a94e5otf	\N	\N	f	f	\N
cmpeu5woi000004l7m5xrrocd	cmpeu0z8h000004jxdbm3yh50	cmp6h8i5g000004jsg0sqon65	COMPLETED	100	2026-05-21 01:52:39.09	2026-05-21 04:05:49.23	2026-05-21 04:05:49.23	cmp6hhw8m000004jojbatlj17	\N	\N	f	f	\N
cmpf4qfad001604jlvjceadro	cmpby3n1h000404jmxq5up352	cmp6hjoca000404jsoue7f5uq	COMPLETED	100	2026-05-21 06:48:32.253	2026-05-21 06:49:21.562	2026-05-21 06:49:21.562	cmp6hn3al000304joeay3gzut	\N	\N	f	f	\N
cmpevi6cy000204jrph6x3xal	cmpc092ja000104jpqz6ee86a	cmp6h8i5g000004jsg0sqon65	ENROLLED	0	2026-05-21 02:30:11.022	\N	2026-05-21 02:30:11.022	\N	\N	\N	f	f	\N
cmpeyy2uo000f04ldchk3jiis	cmpavzuvp000204ictsqhg7iy	cmp6hooc6000404kz4q7ups1p	COMPLETED	100	2026-05-21 04:06:31.71	2026-05-21 06:06:26.223	2026-05-21 06:06:26.226	cmp6hrnki000104jp0dxufsxe	\N	\N	f	f	\N
cmpevid3r000804jp36kwg8li	cmpaw9hap000604ic7noel0hz	cmp6h8i5g000004jsg0sqon65	IN_PROGRESS	25	2026-05-21 02:30:19.766	\N	2026-05-21 06:26:32.821	cmp6haw1k000104jsjws3jyz5	\N	\N	f	f	\N
cmpevih95000e04jrm1jxf6oj	cmpdcpawm000004ji1xv7g6ra	cmp6h8i5g000004jsg0sqon65	ENROLLED	0	2026-05-21 02:30:25.139	\N	2026-05-21 02:30:25.139	\N	\N	\N	f	f	\N
cmpexgzsn000104l1078basp8	cmpauwy88000504l7brbkrk7a	cmp6hjoca000404jsoue7f5uq	IN_PROGRESS	100	2026-05-21 03:25:14.999	2026-05-21 03:34:31.113	2026-05-21 09:51:33.465	cmp6hmiby000604l1lr2p1y5y	\N	\N	f	f	\N
cmpf4rhwy001d04jlr42zrjwb	cmpby3n1h000404jmxq5up352	cmp6hooc6000404kz4q7ups1p	COMPLETED	100	2026-05-21 06:49:22.349	2026-05-22 00:43:07.118	2026-05-22 00:43:07.12	cmp6hrnki000104jp0dxufsxe	\N	\N	f	f	\N
cmpf40xss000a04kv4p4xaaxh	cmpc2e7ss000004jmotm0s6l6	cmp6hooc6000404kz4q7ups1p	IN_PROGRESS	100	2026-05-21 06:28:43.229	2026-05-21 06:48:15.609	2026-05-21 06:48:26.692	cmp6hrnki000104jp0dxufsxe	\N	\N	f	f	\N
cmpevi8gh000a04jrd2sas927	cmpawzous000004kwfacrrpdf	cmp6h8i5g000004jsg0sqon65	IN_PROGRESS	63	2026-05-21 02:30:13.681	\N	2026-05-21 07:15:49.72	cmp6hde8e000104l1tehzmuzm	\N	\N	f	f	\N
cmpevi51c000504jp81eivsc6	cmpav8yfu000704l7kdsi9nkj	cmp6h8i5g000004jsg0sqon65	IN_PROGRESS	0	2026-05-21 02:30:09.312	\N	2026-05-21 02:30:35.502	cmp6hdvp5000004kzt1tv7tmg	\N	\N	f	f	\N
cmpf6287t000l04l6qaecfqkn	cmpbzh465000004kzf90zix9b	cmp6hjoca000404jsoue7f5uq	COMPLETED	100	2026-05-21 07:25:42.609	2026-05-21 07:26:24.599	2026-05-21 07:26:24.6	cmp6hn3al000304joeay3gzut	\N	\N	f	f	\N
cmpeyycq5000704kywhbcez1s	cmpeu0z8h000004jxdbm3yh50	cmp6hjoca000404jsoue7f5uq	COMPLETED	100	2026-05-21 04:06:44.717	2026-05-21 04:07:05.525	2026-05-21 04:07:05.525	cmp6hn3al000304joeay3gzut	\N	\N	f	f	\N
cmpeyz1lg000c04kyc0301ghu	cmpeu0z8h000004jxdbm3yh50	cmp6hooc6000404kz4q7ups1p	ENROLLED	0	2026-05-21 04:07:16.948	\N	2026-05-21 04:07:16.948	\N	\N	\N	f	f	\N
cmpexzhlz000e04l4wk7gn45j	cmpavwml8000104icnr5fi1j5	cmp6hjoca000404jsoue7f5uq	COMPLETED	100	2026-05-21 03:39:37.894	2026-05-21 06:24:42.988	2026-05-21 06:24:42.988	cmp6hn3al000304joeay3gzut	\N	\N	f	f	\N
cmpet1w4i000104ji71napgy7	cmpavzuvp000204ictsqhg7iy	cmp6h8i5g000004jsg0sqon65	COMPLETED	100	2026-05-21 01:21:32.034	2026-05-21 04:03:20.701	2026-05-21 04:03:20.705	cmp6hhw8m000004jojbatlj17	\N	\N	f	f	\N
cmpex22fy000104jszrg2zh9v	cmpdjyd2m000004l8a618xllh	cmp6hjoca000404jsoue7f5uq	COMPLETED	100	2026-05-21 03:13:38.592	2026-05-21 04:06:28.025	2026-05-21 04:06:28.026	cmp6hn3al000304joeay3gzut	\N	\N	f	f	\N
cmpdjzhjj000104js3ne1xoo9	cmpdjyd2m000004l8a618xllh	cmp6h8i5g000004jsg0sqon65	COMPLETED	100	2026-05-20 04:19:57.103	2026-05-21 03:13:37.789	2026-05-21 03:13:37.792	cmp6hhw8m000004jojbatlj17	\N	\N	f	f	\N
cmpeyy0rl000904ldn6eczjor	cmpdjyd2m000004l8a618xllh	cmp6hooc6000404kz4q7ups1p	COMPLETED	100	2026-05-21 04:06:29.033	2026-05-21 06:48:30.082	2026-05-21 06:48:30.083	cmp6hrnki000104jp0dxufsxe	\N	\N	f	f	\N
cmpf3s78n000804jl6d5r112u	cmpc2e7ss000004jmotm0s6l6	cmp6hjoca000404jsoue7f5uq	COMPLETED	100	2026-05-21 06:21:55.565	2026-05-21 06:28:42.837	2026-05-21 06:28:42.838	cmp6hmiby000604l1lr2p1y5y	\N	\N	f	f	\N
cmpf3vsqd000e04jlciz1o778	cmpavwml8000104icnr5fi1j5	cmp6hooc6000404kz4q7ups1p	COMPLETED	100	2026-05-21 06:24:43.379	2026-05-21 07:20:55.411	2026-05-21 07:20:55.413	cmp6hrnki000104jp0dxufsxe	\N	\N	f	f	\N
cmpexsxii000704l4c92vdfnn	cmpauwy88000504l7brbkrk7a	cmp6hooc6000404kz4q7ups1p	COMPLETED	100	2026-05-21 03:34:31.912	2026-05-21 06:37:46.813	2026-05-21 06:37:46.813	cmp6hrnki000104jp0dxufsxe	\N	\N	f	f	\N
cmpf5i39k000o04jofetqi9r3	cmpcco602000004jszi4gyji2	cmp6hjoca000404jsoue7f5uq	IN_PROGRESS	100	2026-05-21 07:10:03.036	2026-05-21 07:10:42.173	2026-05-21 07:34:26.758	cmp6hn3al000304joeay3gzut	\N	\N	f	f	\N
cmpevi8bu000904jraokz014m	cmpby3n1h000404jmxq5up352	cmp6h8i5g000004jsg0sqon65	COMPLETED	100	2026-05-21 02:30:13.566	2026-05-21 06:48:31.878	2026-05-21 06:48:31.878	cmp6hhw8m000004jojbatlj17	\N	\N	f	f	\N
cmpdhm748000104joyy3q9rd9	cmpbzh465000004kzf90zix9b	cmp6h8i5g000004jsg0sqon65	COMPLETED	100	2026-05-20 03:13:37.835	2026-05-21 07:25:42.202	2026-05-21 07:25:42.202	cmp6hhw8m000004jojbatlj17	\N	\N	f	f	\N
cmpf4sze4001j04jlxld9tvht	cmpc00slt000204ldi8ru8xiz	cmp6h8i5g000004jsg0sqon65	COMPLETED	100	2026-05-21 06:50:31.75	2026-05-21 06:53:00.849	2026-05-21 06:53:00.851	cmp6hhw8m000004jojbatlj17	\N	\N	f	f	\N
cmpf4w73m000304l1kybzcdny	cmpc00slt000204ldi8ru8xiz	cmp6hjoca000404jsoue7f5uq	ENROLLED	0	2026-05-21 06:53:01.609	\N	2026-05-21 06:53:01.609	\N	\N	\N	f	f	\N
cmpeu8lpv000304ksb4vpow57	cmpcco602000004jszi4gyji2	cmp6h8i5g000004jsg0sqon65	COMPLETED	100	2026-05-21 01:54:44.757	2026-05-21 07:10:02.244	2026-05-21 07:10:02.244	cmp6hhw8m000004jojbatlj17	\N	\N	f	f	\N
cmpevi80u000504jrsr3wxp6l	cmpauwy88000504l7brbkrk7a	cmp6h8i5g000004jsg0sqon65	IN_PROGRESS	100	2026-05-21 02:30:13.181	2026-05-21 03:25:14.593	2026-05-21 09:52:26.468	cmp6hhw8m000004jojbatlj17	\N	\N	f	f	\N
cmpf5w2wj000904l6arhvkt0i	cmpavwml8000104icnr5fi1j5	cmp6ht3jr000204l46dmtac0x	IN_PROGRESS	100	2026-05-21 07:20:55.8	2026-05-21 07:53:19.14	2026-05-21 08:05:31.469	cmp6hy8vj000204l4ri5mo48e	\N	\N	f	f	\N
cmpf4qdww001004jlap6o6j1z	cmpdjyd2m000004l8a618xllh	cmp6ht3jr000204l46dmtac0x	COMPLETED	100	2026-05-21 06:48:30.501	2026-05-21 09:17:55.682	2026-05-21 09:17:55.684	cmp6hy8vj000204l4ri5mo48e	\N	\N	f	f	\N
cmpetm4j6000104jlk9brtp89	cmpavwml8000104icnr5fi1j5	cmp6h8i5g000004jsg0sqon65	IN_PROGRESS	100	2026-05-21 01:37:16.043	2026-05-21 03:39:37.503	2026-05-21 07:30:47.824	cmp6hhw8m000004jojbatlj17	\N	\N	f	f	\N
cmpf4q2qh000504jox6iij8ip	cmpc2e7ss000004jmotm0s6l6	cmp6ht3jr000204l46dmtac0x	IN_PROGRESS	0	2026-05-21 06:48:16.02	\N	2026-05-21 07:51:27.263	cmp6hy8vj000204l4ri5mo48e	\N	\N	f	f	\N
cmpf4clj9000n04jls6aq0bx4	cmpauwy88000504l7brbkrk7a	cmp6ht3jr000204l46dmtac0x	COMPLETED	100	2026-05-21 06:37:47.206	2026-05-21 08:24:55.297	2026-05-21 08:24:55.3	cmp6hy8vj000204l4ri5mo48e	\N	\N	f	f	\N
cmpf38atr000104kv2kanxkm2	cmpavzuvp000204ictsqhg7iy	cmp6ht3jr000204l46dmtac0x	IN_PROGRESS	0	2026-05-21 06:06:27.092	\N	2026-05-21 08:31:19.36	cmp6hv69k000204jpznlxyuua	\N	\N	f	f	\N
cmpeviif0000b04jp2yjbrn25	cmpcfpyx4000504l2ub2vc5ae	cmp6h8i5g000004jsg0sqon65	COMPLETED	100	2026-05-21 02:30:26.653	2026-06-09 02:20:42.547	2026-06-09 02:20:42.548	cmpxojuop000104ikhp57gwdh	\N	\N	f	f	\N
cmpf5iy24000304jvv1vs78my	cmpcco602000004jszi4gyji2	cmp6hooc6000404kz4q7ups1p	COMPLETED	100	2026-05-21 07:10:42.968	2026-05-21 07:31:15.851	2026-05-21 07:31:15.852	cmp6hrnki000104jp0dxufsxe	\N	\N	f	f	\N
cmpfa2k2u000104kz5wp3m1up	cmpdjyd2m000004l8a618xllh	cmp6i2wxu000504l4y25ozxel	COMPLETED	100	2026-05-21 09:17:56.459	2026-05-21 09:51:31.975	2026-05-21 09:51:31.977	cmpc8gp2q000004jmu8137nw1	\N	\N	f	f	\N
cmpfbalqs000d04i5clanh6bc	cmpazdrk1000004i6qmdd98yv	cmp6h8i5g000004jsg0sqon65	ENROLLED	0	2026-05-21 09:52:11.575	\N	2026-05-21 09:52:11.575	\N	\N	\N	f	f	\N
cmpf71qpg001b04l60ezzc5w0	cmpavwml8000104icnr5fi1j5	cmp6i2wxu000504l4y25ozxel	IN_PROGRESS	0	2026-05-21 07:53:19.541	\N	2026-05-21 07:54:02.278	cmp6i3j0v000704l4mmtswi6o	\N	\N	f	f	\N
cmpfbawx9000504jxwyv8duac	cmpcc089w000004ldyubgbcht	cmp6h8i5g000004jsg0sqon65	ENROLLED	0	2026-05-21 09:52:26.061	\N	2026-05-21 09:52:26.061	\N	\N	\N	f	f	\N
cmpfbd7qz000204jp3x26kmtn	cmpcf5vqi000004le2dq5l7sn	cmp6h8i5g000004jsg0sqon65	ENROLLED	0	2026-05-21 09:54:13.402	\N	2026-05-21 09:54:13.402	\N	\N	\N	f	f	\N
cmpgffqua000304jsbvc7qrzd	cmpb17ttx000004l2le1aa3f4	cmp6hjoca000404jsoue7f5uq	COMPLETED	100	2026-05-22 04:35:55.991	2026-05-22 04:36:40.536	2026-05-22 04:36:40.537	cmp6hn3al000304joeay3gzut	\N	\N	f	f	\N
cmpg6hmcm000104l5onsem3lj	cmpavuniy000004ic2scwt305	cmp6ht3jr000204l46dmtac0x	COMPLETED	100	2026-05-22 00:25:26.95	2026-05-22 00:26:13.45	2026-05-22 00:26:13.451	cmp6hy8vj000204l4ri5mo48e	\N	\N	f	f	\N
cmpf634zw000t04l6qgil5f0p	cmpbzh465000004kzf90zix9b	cmp6hooc6000404kz4q7ups1p	COMPLETED	100	2026-05-21 07:26:25.086	2026-05-21 07:27:43.432	2026-05-21 07:27:43.432	cmp6hrnki000104jp0dxufsxe	\N	\N	f	f	\N
cmpg6e1f3000304kzok08r4j2	cmpavuniy000004ic2scwt305	cmp6hooc6000404kz4q7ups1p	COMPLETED	100	2026-05-22 00:22:39.854	2026-05-22 00:25:26.173	2026-05-22 00:25:26.175	cmp6hrnki000104jp0dxufsxe	\N	\N	f	f	\N
cmpg80q1r000304l8h5za856q	cmpby32ba000304jm517sn0i2	cmp6hjoca000404jsoue7f5uq	IN_PROGRESS	100	2026-05-22 01:08:17.811	2026-05-22 01:08:55.542	2026-05-22 01:09:01.156	cmp6hmiby000604l1lr2p1y5y	\N	\N	f	f	\N
cmpg66eam000204ice1hqglaz	cmpavuniy000004ic2scwt305	cmp6hjoca000404jsoue7f5uq	COMPLETED	100	2026-05-22 00:16:43.298	2026-05-22 00:22:39.063	2026-05-22 00:22:39.065	cmp6hn3al000304joeay3gzut	\N	\N	f	f	\N
cmpf69dwv000o04juu4hr0hh5	cmpcco602000004jszi4gyji2	cmp6ht3jr000204l46dmtac0x	COMPLETED	100	2026-05-21 07:31:16.608	2026-05-21 07:32:27.111	2026-05-21 07:32:27.112	cmp6hy8vj000204l4ri5mo48e	\N	\N	f	f	\N
cmpf64trb000u05kwa6vy08ao	cmpbzh465000004kzf90zix9b	cmp6ht3jr000204l46dmtac0x	IN_PROGRESS	60	2026-05-21 07:27:43.844	\N	2026-05-21 07:29:54.639	cmp6hws08000304l4zi2giios	\N	\N	f	f	\N
cmpfb20a0000104jxylbsy06j	cmpcfkuz6000204l2xll6kbnf	cmp6h8i5g000004jsg0sqon65	ENROLLED	0	2026-05-21 09:45:30.506	\N	2026-05-21 09:45:30.506	\N	\N	\N	f	f	\N
cmpf86e3k000104kwlxxdzn8v	cmpauwy88000504l7brbkrk7a	cmp6i2wxu000504l4y25ozxel	COMPLETED	100	2026-05-21 08:24:56.093	2026-05-21 09:50:09.229	2026-05-21 09:50:09.232	cmpc8gp2q000004jmu8137nw1	\N	\N	f	f	\N
cmpg8h8as000704l2bpkeaose	cmpbzwne4000004icd9d3mj9g	cmp6ht3jr000204l46dmtac0x	COMPLETED	100	2026-05-22 01:21:07.97	2026-05-22 01:21:52.91	2026-05-22 01:21:52.91	cmp6hy8vj000204l4ri5mo48e	\N	\N	f	f	\N
cmpfm9v49000104jp755xsms0	cmpcj94wh000004l2n1xb9l80	cmp6hooc6000404kz4q7ups1p	ENROLLED	0	2026-05-21 14:59:32.74	\N	2026-05-21 14:59:32.74	\N	\N	\N	f	f	\N
cmpflr2ey000304l13bqq9vkh	cmpcj94wh000004l2n1xb9l80	cmp6hjoca000404jsoue7f5uq	IN_PROGRESS	100	2026-05-21 14:44:55.744	2026-05-21 14:59:31.923	2026-05-21 15:00:16.37	cmp6hn3al000304joeay3gzut	\N	\N	f	f	\N
cmpfobz87000104lb8kven0ml	cmpby2ke1000204jmtuusb6y5	cmp6h8i5g000004jsg0sqon65	ENROLLED	0	2026-05-21 15:57:10.71	\N	2026-05-21 15:57:10.71	\N	\N	\N	f	f	\N
cmpgfhd7v000504kzm3yqx23i	cmpb17ttx000004l2le1aa3f4	cmp6ht3jr000204l46dmtac0x	COMPLETED	100	2026-05-22 04:37:11.655	2026-05-22 04:38:29.291	2026-05-22 04:38:29.292	cmp6hy8vj000204l4ri5mo48e	\N	\N	f	f	\N
cmpfb7nsm000104jxfeweedx1	cmpby32ba000304jm517sn0i2	cmp6h8i5g000004jsg0sqon65	IN_PROGRESS	100	2026-05-21 09:49:54.267	2026-05-22 01:08:17	2026-05-22 01:08:23.856	cmp6hgdcm000304l1xt82nzez	\N	\N	f	f	\N
cmpg75n5f000404jpvhqaks9s	cmpby3n1h000404jmxq5up352	cmp6i2wxu000504l4y25ozxel	COMPLETED	100	2026-05-22 00:44:07.733	2026-05-22 00:44:46.709	2026-05-22 00:44:46.709	cmpc8gp2q000004jmu8137nw1	\N	\N	f	f	\N
cmpf6awmw001204l6ivgitknj	cmpcco602000004jszi4gyji2	cmp6i2wxu000504l4y25ozxel	COMPLETED	100	2026-05-21 07:32:27.506	2026-05-21 07:33:46.778	2026-05-21 07:33:46.778	cmpc8gp2q000004jmu8137nw1	\N	\N	f	f	\N
cmpfbak89000a04i5eptsc0qn	cmpcj94wh000004l2n1xb9l80	cmp6h8i5g000004jsg0sqon65	IN_PROGRESS	100	2026-05-21 09:52:09.614	2026-05-21 14:44:54.968	2026-05-21 14:50:52.582	cmp6hhw8m000004jojbatlj17	\N	\N	f	f	\N
cmpg8i7ks000c04l7zahw7fud	cmpbzwne4000004icd9d3mj9g	cmp6i2wxu000504l4y25ozxel	COMPLETED	100	2026-05-22 01:21:53.689	2026-05-22 01:22:27.611	2026-05-22 01:22:27.611	cmpc8gp2q000004jmu8137nw1	\N	\N	f	f	\N
cmpg8gi9m000h04jpadeckfyt	cmpbzwne4000004icd9d3mj9g	cmp6hooc6000404kz4q7ups1p	COMPLETED	100	2026-05-22 01:20:34.239	2026-05-22 01:21:07.562	2026-05-22 01:21:07.563	cmp6hrnki000104jp0dxufsxe	\N	\N	f	f	\N
cmpg6imvc000904l5d2hzlub1	cmpavuniy000004ic2scwt305	cmp6i2wxu000504l4y25ozxel	COMPLETED	100	2026-05-22 00:26:14.287	2026-05-22 00:31:27.984	2026-05-22 00:31:27.984	cmpc8gp2q000004jmu8137nw1	\N	\N	f	f	\N
cmpg74cp7000404jpwcsz4atm	cmpby3n1h000404jmxq5up352	cmp6ht3jr000204l46dmtac0x	COMPLETED	100	2026-05-22 00:43:07.53	2026-05-22 00:44:06.853	2026-05-22 00:44:06.854	cmp6hy8vj000204l4ri5mo48e	\N	\N	f	f	\N
cmpg8fg5v000204l7u9uzehze	cmpbzwne4000004icd9d3mj9g	cmp6hjoca000404jsoue7f5uq	COMPLETED	100	2026-05-22 01:19:44.851	2026-05-22 01:20:33.483	2026-05-22 01:20:33.484	cmp6hn3al000304joeay3gzut	\N	\N	f	f	\N
cmpgfgpie000604lb1ajyeuyt	cmpb17ttx000004l2le1aa3f4	cmp6hooc6000404kz4q7ups1p	COMPLETED	100	2026-05-22 04:36:40.933	2026-05-22 04:37:10.853	2026-05-22 04:37:10.855	cmp6hrnki000104jp0dxufsxe	\N	\N	f	f	\N
cmpg81jre000404lao0r2p8f9	cmpby32ba000304jm517sn0i2	cmp6hooc6000404kz4q7ups1p	COMPLETED	100	2026-05-22 01:08:56.329	2026-05-22 01:09:37.636	2026-05-22 01:09:37.639	cmp6hrnki000104jp0dxufsxe	\N	\N	f	f	\N
cmpg82fyg000704jptkpy9hhy	cmpby32ba000304jm517sn0i2	cmp6ht3jr000204l46dmtac0x	ENROLLED	0	2026-05-22 01:09:38.042	\N	2026-05-22 01:09:38.042	\N	\N	\N	f	f	\N
cmpfbch9t000404jxgwx99275	cmpbzwne4000004icd9d3mj9g	cmp6h8i5g000004jsg0sqon65	COMPLETED	100	2026-05-21 09:53:39.086	2026-05-22 01:19:44.067	2026-05-22 01:19:44.068	cmp6hhw8m000004jojbatlj17	\N	\N	f	f	\N
cmpgfj1pz000c04jsv00w15pq	cmpb17ttx000004l2le1aa3f4	cmp6i2wxu000504l4y25ozxel	COMPLETED	100	2026-05-22 04:38:30.073	2026-05-22 04:39:03.189	2026-05-22 04:39:03.189	cmpc8gp2q000004jmu8137nw1	\N	\N	f	f	\N
cmq60j6rv000204jvswoxzbvm	cmpcfpyx4000504l2ub2vc5ae	cmp6hjoca000404jsoue7f5uq	COMPLETED	100	2026-06-09 02:20:42.951	2026-06-09 08:14:07.284	2026-06-09 08:14:07.286	cmpxol5he000104l1fp9whdeq	\N	\N	f	f	\N
cmpfacyis000804l447fx4ndz	cmpb17ttx000004l2le1aa3f4	cmp6h8i5g000004jsg0sqon65	COMPLETED	100	2026-05-21 09:26:01.832	2026-05-22 04:35:55.141	2026-05-22 04:35:55.143	cmp6hhw8m000004jojbatlj17	\N	\N	f	f	\N
cmpg5nd8p000104l8x9n9p5sh	cmpavuniy000004ic2scwt305	cmp6h8i5g000004jsg0sqon65	IN_PROGRESS	100	2026-05-22 00:01:55.561	2026-05-22 00:16:42.527	2026-05-29 02:24:12.025	cmpc80kfb000004lao5wtkeih	\N	\N	f	f	\N
cmq6d5oqr000104jvxwdrxk17	cmpcfpyx4000504l2ub2vc5ae	cmp6hooc6000404kz4q7ups1p	IN_PROGRESS	33	2026-06-09 08:14:08.075	\N	2026-06-09 08:36:04.432	cmp6hpvkx000004l4on2inxho	\N	\N	f	f	\N
\.


--
-- TOC entry 3754 (class 0 OID 25925)
-- Dependencies: 232
-- Data for Name: learning_paths; Type: TABLE DATA; Schema: public; Owner: postgres_lms
--

COPY public.learning_paths (id, title, description, thumbnail, status, "creatorId", "createdAt", "updatedAt", price, "promoPrice", visibility) FROM stdin;
cmp6eetva000004l5ibt5lfdn	Pelatihan AI Level Beginner	Selamat Datang di Level Beginner\r\nKalau ini pertama kalinya kamu serius belajar AI dan belum tahu harus mulai dari mana, kamu di tempat yang tepat. Level ini didesain untuk membangun fondasi yang kuat: mulai dari memahami apa itu AI, cara kerjanya di balik layar, sampai berkomunikasi dengan AI secara efektif untuk pekerjaan sehari-hari.\r\n\r\nYang membedakan Level Beginner ini dari pelatihan AI lain: kami tidak akan membombardirmu dengan jargon teknis. Setiap konsep dijelaskan dengan analogi yang mudah dipahami, dilengkapi contoh nyata dari konteks kerja Indonesia, dan diakhiri dengan latihan praktis yang langsung bisa kamu coba.\r\n\r\nDi akhir modul ini, kamu tidak hanya paham teorinya, tapi juga punya cukup kepercayaan diri untuk langsung mempraktikkan AI di pekerjaanmu. Tidak perlu jadi expert, cukup jadi pengguna yang sadar dan efektif.	\N	PUBLISHED	cmp6e3upk000004l79aodzzpi	2026-05-15 04:09:32.086	2026-05-21 07:14:01.763	0.00	\N	PUBLIC
\.


--
-- TOC entry 3748 (class 0 OID 25813)
-- Dependencies: 226
-- Data for Name: lesson_completions; Type: TABLE DATA; Schema: public; Owner: postgres_lms
--

COPY public.lesson_completions (id, "enrollmentId", "lessonId", "completedAt") FROM stdin;
cmpetug25000304jla2fspvaq	cmpetm4j6000104jlk9brtp89	cmpc81kvf000004l7a94e5otf	2026-05-21 01:43:44.128
cmpetujl1000004ksepmksnfm	cmpetm4j6000104jlk9brtp89	cmpc80kfb000004lao5wtkeih	2026-05-21 01:43:48.712
cmpetvvf2000004lb82ltske4	cmpet1w4i000104ji71napgy7	cmpc81kvf000004l7a94e5otf	2026-05-21 01:44:50.702
cmpetvys2000404jljjusegbj	cmpet1w4i000104ji71napgy7	cmpc80kfb000004lao5wtkeih	2026-05-21 01:44:55.063
cmpeu63o5000104ks0xrh3x03	cmpeu5woi000004l7m5xrrocd	cmpc80kfb000004lao5wtkeih	2026-05-21 01:52:47.968
cmpeuz9ol000004laeghps18v	cmpdjzhjj000104js3ne1xoo9	cmpc80kfb000004lao5wtkeih	2026-05-21 02:15:28.772
cmpev086j000004l89p6ubznz	cmpdjzhjj000104js3ne1xoo9	cmpc81kvf000004l7a94e5otf	2026-05-21 02:16:13.471
cmpevg8eh000004jpehn9eow5	cmpeu5woi000004l7m5xrrocd	cmpc81kvf000004l7a94e5otf	2026-05-21 02:28:40.231
cmpevgvyp000104lame9uelxo	cmpeu5woi000004l7m5xrrocd	cmp6haw1k000104jsjws3jyz5	2026-05-21 02:29:10.8
cmpevgznb000004jrv9imbj09	cmpeu5woi000004l7m5xrrocd	cmp6hde8e000104l1tehzmuzm	2026-05-21 02:29:15.579
cmpevhbje000104jp2r267tfq	cmpet1w4i000104ji71napgy7	cmp6hdvp5000004kzt1tv7tmg	2026-05-21 02:29:30.991
cmpevhhit000204jpev7khy21	cmpet1w4i000104ji71napgy7	cmp6haw1k000104jsjws3jyz5	2026-05-21 02:29:38.741
cmpevhjd3000304jp5jkhx6ci	cmpet1w4i000104ji71napgy7	cmp6hde8e000104l1tehzmuzm	2026-05-21 02:29:41.128
cmpeviml9000d04jpjazzqo3h	cmpevi8gh000a04jrd2sas927	cmpc80kfb000004lao5wtkeih	2026-05-21 02:30:31.963
cmpevisee000304l2xhk6z6et	cmpevi8gh000a04jrd2sas927	cmpc81kvf000004l7a94e5otf	2026-05-21 02:30:39.505
cmpevj1z0000404l2x76mcljy	cmpevi8gh000a04jrd2sas927	cmp6haw1k000104jsjws3jyz5	2026-05-21 02:30:51.892
cmpevj4f5000g04jrz8fwfdvb	cmpevi8bu000904jraokz014m	cmpc80kfb000004lao5wtkeih	2026-05-21 02:30:55.081
cmpevj9yz000e04jp5k7p2vxd	cmpevi8bu000904jraokz014m	cmpc81kvf000004l7a94e5otf	2026-05-21 02:31:02.268
cmpevk6ib000f04jp3mfzk8io	cmpdjzhjj000104js3ne1xoo9	cmp6haw1k000104jsjws3jyz5	2026-05-21 02:31:44.439
cmpevk8wz000h04jrvpdigp1i	cmpdjzhjj000104js3ne1xoo9	cmp6hde8e000104l1tehzmuzm	2026-05-21 02:31:47.565
cmpex1roy000004l4ur4f89jo	cmpdjzhjj000104js3ne1xoo9	cmp6hdvp5000004kzt1tv7tmg	2026-05-21 03:13:24.662
cmpex1ui6000004jml1jch20g	cmpdjzhjj000104js3ne1xoo9	cmp6heog6000204l1kk29qvig	2026-05-21 03:13:28.315
cmpex1yee000104jmx5zs9rcd	cmpdjzhjj000104js3ne1xoo9	cmp6hgdcm000304l1xt82nzez	2026-05-21 03:13:33.357
cmpex219w000004jsbkk4il27	cmpdjzhjj000104js3ne1xoo9	cmp6hhw8m000004jojbatlj17	2026-05-21 03:13:37.063
cmpex2sbu000604jsgcscweu0	cmpex22fy000104jszrg2zh9v	cmp6hl37g000504l12bjfsq32	2026-05-21 03:14:12.143
cmpex4riw000204jm7o0ms71l	cmpevid3r000804jp36kwg8li	cmpc80kfb000004lao5wtkeih	2026-05-21 03:15:44.414
cmpex4zor000304jmoymn67ev	cmpevid3r000804jp36kwg8li	cmpc81kvf000004l7a94e5otf	2026-05-21 03:15:54.988
cmpexeefx000104l4m1qhvw2d	cmpevi80u000504jrsr3wxp6l	cmpc80kfb000004lao5wtkeih	2026-05-21 03:23:14.018
cmpexemka000204l498j66l8a	cmpevi80u000504jrsr3wxp6l	cmpc81kvf000004l7a94e5otf	2026-05-21 03:23:24.545
cmpexfja6000004laoa40usun	cmpevi80u000504jrsr3wxp6l	cmp6haw1k000104jsjws3jyz5	2026-05-21 03:24:06.93
cmpexft59000104la7c209luv	cmpevi80u000504jrsr3wxp6l	cmp6hde8e000104l1tehzmuzm	2026-05-21 03:24:19.733
cmpexg8gc000404jmakmgd88y	cmpevi80u000504jrsr3wxp6l	cmp6hdvp5000004kzt1tv7tmg	2026-05-21 03:24:39.573
cmpexgeea000304l4ec1o8p1f	cmpet1w4i000104ji71napgy7	cmp6heog6000204l1kk29qvig	2026-05-21 03:24:47.256
cmpexggcs000404l4f4h00f4b	cmpevi80u000504jrsr3wxp6l	cmp6heog6000204l1kk29qvig	2026-05-21 03:24:49.795
cmpexgtgh000204larly3u10k	cmpevi80u000504jrsr3wxp6l	cmp6hgdcm000304l1xt82nzez	2026-05-21 03:25:06.568
cmpexgyx2000004l14iyzct7x	cmpevi80u000504jrsr3wxp6l	cmp6hhw8m000004jojbatlj17	2026-05-21 03:25:13.851
cmpexj7t7000604l119soq2pm	cmpexgzsn000104l1078basp8	cmp6hkcz4000404l1e9z37t41	2026-05-21 03:26:58.7
cmpexjni6000304lam177hj9m	cmpexgzsn000104l1078basp8	cmp6hl37g000504l12bjfsq32	2026-05-21 03:27:19.034
cmpexjwg7000704l1tscssmk3	cmpexgzsn000104l1078basp8	cmp6hlm4c000304kz0bb39jwo	2026-05-21 03:27:30.627
cmpexnwt3000404la4p1psqh0	cmpex22fy000104jszrg2zh9v	cmp6hkcz4000404l1e9z37t41	2026-05-21 03:30:37.718
cmpexsc2o000804l1s17ln6n5	cmpexgzsn000104l1078basp8	cmp6hm626000104joaf89svaz	2026-05-21 03:34:04.121
cmpexsl00000504l4dlkbsmsx	cmpexgzsn000104l1078basp8	cmp6hmiby000604l1lr2p1y5y	2026-05-21 03:34:15.694
cmpexswcv000604l4c2zh2zr1	cmpexgzsn000104l1078basp8	cmp6hn3al000304joeay3gzut	2026-05-21 03:34:30.405
cmpexy0c1000004kyxkbxlieo	cmpetm4j6000104jlk9brtp89	cmp6haw1k000104jsjws3jyz5	2026-05-21 03:38:28.847
cmpexy958000104kyck9ocmu1	cmpetm4j6000104jlk9brtp89	cmp6hde8e000104l1tehzmuzm	2026-05-21 03:38:40.262
cmpexylfh000c04l4i1xk39l0	cmpetm4j6000104jlk9brtp89	cmp6heog6000204l1kk29qvig	2026-05-21 03:38:56.19
cmpexyw1t000204kylqfhe0kg	cmpetm4j6000104jlk9brtp89	cmp6hgdcm000304l1xt82nzez	2026-05-21 03:39:09.944
cmpexyyr0000904l1rig89da3	cmpetm4j6000104jlk9brtp89	cmp6hdvp5000004kzt1tv7tmg	2026-05-21 03:39:13.458
cmpexzgsb000d04l4nodvgeg1	cmpetm4j6000104jlk9brtp89	cmp6hhw8m000004jojbatlj17	2026-05-21 03:39:36.828
cmpey0mvc000a04l1nfce90ep	cmpexzhlz000e04l4wk7gn45j	cmp6hl37g000504l12bjfsq32	2026-05-21 03:40:31.362
cmpey11hk000304kye4uciyam	cmpexzhlz000e04l4wk7gn45j	cmp6hm626000104joaf89svaz	2026-05-21 03:40:50.309
cmpey17mq000004l2p9lm791h	cmpexzhlz000e04l4wk7gn45j	cmp6hkcz4000404l1e9z37t41	2026-05-21 03:40:58.277
cmpey1aez000j04l4zsu6oeal	cmpexzhlz000e04l4wk7gn45j	cmp6hlm4c000304kz0bb39jwo	2026-05-21 03:41:01.858
cmpey3gx7000b04l120gjzvsj	cmpexzhlz000e04l4wk7gn45j	cmp6hmiby000604l1lr2p1y5y	2026-05-21 03:42:43.631
cmpey9z6b000k04l4egtqxnrm	cmpex22fy000104jszrg2zh9v	cmp6hlm4c000304kz0bb39jwo	2026-05-21 03:47:47.225
cmpeya3sq000004l4hpv322u5	cmpex22fy000104jszrg2zh9v	cmp6hm626000104joaf89svaz	2026-05-21 03:47:53.216
cmpeyriiu000404kywb1rr4m1	cmpexsxii000704l4c92vdfnn	cmp6hp1em000404joldu5xtu2	2026-05-21 04:01:25.323
cmpeytv7h000l04l4yzuwu36r	cmpet1w4i000104ji71napgy7	cmp6hgdcm000304l1xt82nzez	2026-05-21 04:03:15.209
cmpeytyx1000004ldbzi6jfl2	cmpet1w4i000104ji71napgy7	cmp6hhw8m000004jojbatlj17	2026-05-21 04:03:19.681
cmpeywt2u000m04l45vnn6572	cmpeu5woi000004l7m5xrrocd	cmp6hdvp5000004kzt1tv7tmg	2026-05-21 04:05:32.355
cmpeyww9n000604ldp7li24i9	cmpeu5woi000004l7m5xrrocd	cmp6heog6000204l1kk29qvig	2026-05-21 04:05:36.54
cmpeyx313000504ky5aygzaya	cmpeu5woi000004l7m5xrrocd	cmp6hgdcm000304l1xt82nzez	2026-05-21 04:05:45.298
cmpeyx5jq000n04l4f7uwa3nz	cmpeu5woi000004l7m5xrrocd	cmp6hhw8m000004jojbatlj17	2026-05-21 04:05:48.572
cmpeyxpsd000s04l4wfcw1py3	cmpeyu03t000104lducprwdkp	cmp6hkcz4000404l1e9z37t41	2026-05-21 04:06:14.793
cmpeyxs0j000604kytwhzwcbn	cmpeyu03t000104lducprwdkp	cmp6hl37g000504l12bjfsq32	2026-05-21 04:06:17.633
cmpeyxv34000004icwr9hahj2	cmpeyu03t000104lducprwdkp	cmp6hlm4c000304kz0bb39jwo	2026-05-21 04:06:21.667
cmpeyxw6n000104ic629kk06n	cmpex22fy000104jszrg2zh9v	cmp6hmiby000604l1lr2p1y5y	2026-05-21 04:06:23.081
cmpeyxxie000204icpxs0d1j4	cmpeyu03t000104lducprwdkp	cmp6hm626000104joaf89svaz	2026-05-21 04:06:24.791
cmpeyxze5000704ld4y8y6f9o	cmpex22fy000104jszrg2zh9v	cmp6hn3al000304joeay3gzut	2026-05-21 04:06:27.229
cmpeyxznk000804ldqyrzmlwb	cmpeyu03t000104lducprwdkp	cmp6hmiby000604l1lr2p1y5y	2026-05-21 04:06:27.573
cmpeyy1yz000d04ldg9tlxhjg	cmpeyu03t000104lducprwdkp	cmp6hn3al000304joeay3gzut	2026-05-21 04:06:30.594
cmpeyyge8000304icg5xuu8c5	cmpeyycq5000704kywhbcez1s	cmp6hkcz4000404l1e9z37t41	2026-05-21 04:06:49.229
cmpeyyilr000k04ldf9lakrus	cmpeyycq5000704kywhbcez1s	cmp6hl37g000504l12bjfsq32	2026-05-21 04:06:52.136
cmpeyylbj000904kypht1n0uf	cmpeyycq5000704kywhbcez1s	cmp6hlm4c000304kz0bb39jwo	2026-05-21 04:06:55.636
cmpeyyo7i000a04kypavdiag4	cmpeyycq5000704kywhbcez1s	cmp6hm626000104joaf89svaz	2026-05-21 04:06:59.358
cmpeyyqjq000b04kyv5hui4w0	cmpeyycq5000704kywhbcez1s	cmp6hmiby000604l1lr2p1y5y	2026-05-21 04:07:02.441
cmpeyysak000l04lddioq9rsp	cmpeyycq5000704kywhbcez1s	cmp6hn3al000304joeay3gzut	2026-05-21 04:07:04.683
cmpezhrnt000t04l4yvmyz7o1	cmpexsxii000704l4c92vdfnn	cmp6hpiy6000504jo9io5jofz	2026-05-21 04:21:50.343
cmpezwui6000004jp1j6c0jbr	cmpexsxii000704l4c92vdfnn	cmp6hpvkx000004l4on2inxho	2026-05-21 04:33:33.868
cmpezwxd6000104jp1o9tyl12	cmpexsxii000704l4c92vdfnn	cmp6hqewd000004l46hb3ywid	2026-05-21 04:33:37.569
cmpf03ite000004lafjlaq12v	cmpexsxii000704l4c92vdfnn	cmp6hr2cb000104l45pt7cm3w	2026-05-21 04:38:45.308
cmpf37xvh000004jlkeatw71d	cmpeyy2uo000f04ldchk3jiis	cmp6hp1em000404joldu5xtu2	2026-05-21 06:06:10.29
cmpf380du000004l7j3wlvq09	cmpeyy2uo000f04ldchk3jiis	cmp6hpiy6000504jo9io5jofz	2026-05-21 06:06:13.54
cmpf3837e000104l72esbxfcd	cmpeyy2uo000f04ldchk3jiis	cmp6hpvkx000004l4on2inxho	2026-05-21 06:06:17.118
cmpf385ap000104jleh2zq6ym	cmpeyy2uo000f04ldchk3jiis	cmp6hqewd000004l46hb3ywid	2026-05-21 06:06:19.903
cmpf3872h000204jl0baghp3f	cmpeyy2uo000f04ldchk3jiis	cmp6hr2cb000104l45pt7cm3w	2026-05-21 06:06:22.201
cmpf389lm000004kvrvo6zhls	cmpeyy2uo000f04ldchk3jiis	cmp6hrnki000104jp0dxufsxe	2026-05-21 06:06:25.468
cmpf3a8n9000004jvx761509q	cmpeviif0000b04jp2yjbrn25	cmpc81kvf000004l7a94e5otf	2026-05-21 06:07:57.566
cmpf3af6f000604kvwpkf06mh	cmpeviif0000b04jp2yjbrn25	cmpc80kfb000004lao5wtkeih	2026-05-21 06:08:06.039
cmpf3r2w6000004lamtee8jro	cmpf3os8g000404jl2ttemrt1	cmp6hde8e000104l1tehzmuzm	2026-05-21 06:21:03.208
cmpf3rnsg000704kvpfpr0tzv	cmpf3os8g000404jl2ttemrt1	cmp6hdvp5000004kzt1tv7tmg	2026-05-21 06:21:30.355
cmpf3rrwo000104laatcetxa8	cmpf3os8g000404jl2ttemrt1	cmp6hhw8m000004jojbatlj17	2026-05-21 06:21:35.674
cmpf3rulq000104jv4m9t9oav	cmpf3os8g000404jl2ttemrt1	cmp6hgdcm000304l1xt82nzez	2026-05-21 06:21:39.17
cmpf3rx08000604jla129q0be	cmpf3os8g000404jl2ttemrt1	cmp6heog6000204l1kk29qvig	2026-05-21 06:21:42.309
cmpf3rzjg000204jvsc54qr0d	cmpf3os8g000404jl2ttemrt1	cmp6haw1k000104jsjws3jyz5	2026-05-21 06:21:45.572
cmpf3s36k000304jvl7jauwdk	cmpf3os8g000404jl2ttemrt1	cmpc81kvf000004l7a94e5otf	2026-05-21 06:21:50.304
cmpf3s65f000704jlphjn0lry	cmpf3os8g000404jl2ttemrt1	cmpc80kfb000004lao5wtkeih	2026-05-21 06:21:54.155
cmpf3vrwm000d04jlceqbnw4u	cmpexzhlz000e04l4wk7gn45j	cmp6hn3al000304joeay3gzut	2026-05-21 06:24:42.312
cmpf40bsa000j04jlob1ia1pq	cmpf3s78n000804jl6d5r112u	cmp6hn3al000304joeay3gzut	2026-05-21 06:28:14.691
cmpf40lb6000k04jl3qmycc2z	cmpf3s78n000804jl6d5r112u	cmp6hkcz4000404l1e9z37t41	2026-05-21 06:28:27.049
cmpf40o3q000404jvfylnst8x	cmpf3s78n000804jl6d5r112u	cmp6hl37g000504l12bjfsq32	2026-05-21 06:28:30.654
cmpf40qb3000l04jljtqqm3a0	cmpf3s78n000804jl6d5r112u	cmp6hlm4c000304kz0bb39jwo	2026-05-21 06:28:33.519
cmpf40ugb000804kvsa2turtr	cmpf3s78n000804jl6d5r112u	cmp6hm626000104joaf89svaz	2026-05-21 06:28:38.889
cmpf40wyp000904kvegqej5g9	cmpf3s78n000804jl6d5r112u	cmp6hmiby000604l1lr2p1y5y	2026-05-21 06:28:42.144
cmpf4ckpf000m04jlgt3sny3j	cmpexsxii000704l4c92vdfnn	cmp6hrnki000104jp0dxufsxe	2026-05-21 06:37:46.13
cmpf4poln000s04jly04pjujm	cmpf40xss000a04kv4p4xaaxh	cmp6hp1em000404joldu5xtu2	2026-05-21 06:47:57.706
cmpf4pqxn000504jv78zpz8i8	cmpf40xss000a04kv4p4xaaxh	cmp6hpiy6000504jo9io5jofz	2026-05-21 06:48:00.719
cmpf4ptu9000t04jlwj80sa73	cmpf40xss000a04kv4p4xaaxh	cmp6hpvkx000004l4on2inxho	2026-05-21 06:48:04.51
cmpf4pw1w000u04jlm2sugmnl	cmpf40xss000a04kv4p4xaaxh	cmp6hqewd000004l46hb3ywid	2026-05-21 06:48:07.362
cmpf4pz2x000004jo8nimev45	cmpeyy0rl000904ldn6eczjor	cmp6hp1em000404joldu5xtu2	2026-05-21 06:48:11.293
cmpf4pzqz000104joyzn2bx3h	cmpf40xss000a04kv4p4xaaxh	cmp6hr2cb000104l45pt7cm3w	2026-05-21 06:48:12.123
cmpf4q0nq000204jow0rfofbn	cmpevi8bu000904jraokz014m	cmp6haw1k000104jsjws3jyz5	2026-05-21 06:48:13.324
cmpf4q1vn000304jokaosb2k4	cmpf40xss000a04kv4p4xaaxh	cmp6hrnki000104jp0dxufsxe	2026-05-21 06:48:14.911
cmpf4q22l000404joflnz8xeg	cmpeyy0rl000904ldn6eczjor	cmp6hpiy6000504jo9io5jofz	2026-05-21 06:48:15.165
cmpf4q3hy000704jo472tkxcz	cmpevi8bu000904jraokz014m	cmp6hde8e000104l1tehzmuzm	2026-05-21 06:48:17.007
cmpf4q546000604jv6j6sc4qm	cmpeyy0rl000904ldn6eczjor	cmp6hpvkx000004l4on2inxho	2026-05-21 06:48:19.115
cmpf4q66w000704jvzzaya5nw	cmpevi8bu000904jraokz014m	cmp6hdvp5000004kzt1tv7tmg	2026-05-21 06:48:20.52
cmpf4q7g5000v04jljynzenkz	cmpeyy0rl000904ldn6eczjor	cmp6hqewd000004l46hb3ywid	2026-05-21 06:48:22.137
cmpf4q8n6000w04jl6g2yx3vl	cmpevi8bu000904jraokz014m	cmp6heog6000204l1kk29qvig	2026-05-21 06:48:23.68
cmpf4qafc000x04jlwfakkeec	cmpeyy0rl000904ldn6eczjor	cmp6hr2cb000104l45pt7cm3w	2026-05-21 06:48:26
cmpf4qbc1000y04jl8ozryb02	cmpevi8bu000904jraokz014m	cmp6hgdcm000304l1xt82nzez	2026-05-21 06:48:27.161
cmpf4qd1j000z04jl3ykfs8a8	cmpeyy0rl000904ldn6eczjor	cmp6hrnki000104jp0dxufsxe	2026-05-21 06:48:29.379
cmpf4qegh001204jlm4aezr91	cmpevi8bu000904jraokz014m	cmp6hhw8m000004jojbatlj17	2026-05-21 06:48:31.231
cmpf4qx72000b04jom2izm9lg	cmpf4qfad001604jlvjceadro	cmp6hkcz4000404l1e9z37t41	2026-05-21 06:48:55.507
cmpf4r1fx001b04jlasjf15a9	cmpf4qfad001604jlvjceadro	cmp6hl37g000504l12bjfsq32	2026-05-21 06:49:00.997
cmpf4r4jk000804jvkqf8gykk	cmpf4qfad001604jlvjceadro	cmp6hlm4c000304kz0bb39jwo	2026-05-21 06:49:05.014
cmpf4r73m000c04jo1ox9p52i	cmpf4qfad001604jlvjceadro	cmp6hm626000104joaf89svaz	2026-05-21 06:49:08.326
cmpf4r9x4000d04jo2kdzi4xd	cmpf4qfad001604jlvjceadro	cmp6hmiby000604l1lr2p1y5y	2026-05-21 06:49:11.981
cmpf4rgsi001c04jl98zamimz	cmpf4qfad001604jlvjceadro	cmp6hn3al000304joeay3gzut	2026-05-21 06:49:20.899
cmpf4vm4n000904jv236kj79a	cmpf4sze4001j04jlxld9tvht	cmpc80kfb000004lao5wtkeih	2026-05-21 06:52:34.439
cmpf4vp03000e04jox0zqr0an	cmpf4sze4001j04jlxld9tvht	cmpc81kvf000004l7a94e5otf	2026-05-21 06:52:38.17
cmpf4vrbh000f04johkxhey6y	cmpf4sze4001j04jlxld9tvht	cmp6haw1k000104jsjws3jyz5	2026-05-21 06:52:41.165
cmpf4vu6g000g04jo999h63kx	cmpf4sze4001j04jlxld9tvht	cmp6hde8e000104l1tehzmuzm	2026-05-21 06:52:44.883
cmpf4vwpe000004l1c217ldv5	cmpf4sze4001j04jlxld9tvht	cmp6hdvp5000004kzt1tv7tmg	2026-05-21 06:52:48.153
cmpf4vzi7000h04jo15fytqov	cmpf4sze4001j04jlxld9tvht	cmp6heog6000204l1kk29qvig	2026-05-21 06:52:51.776
cmpf4w23k000104l15ia5mfg9	cmpf4sze4001j04jlxld9tvht	cmp6hgdcm000304l1xt82nzez	2026-05-21 06:52:55.123
cmpf4w5yx000204l1bumlux42	cmpf4sze4001j04jlxld9tvht	cmp6hhw8m000004jojbatlj17	2026-05-21 06:53:00.154
cmpf5h1cv000i04jovlh27dv7	cmpeu8lpv000304ksb4vpow57	cmpc80kfb000004lao5wtkeih	2026-05-21 07:09:13.951
cmpf5h5q1000j04jok9aw5gi3	cmpeu8lpv000304ksb4vpow57	cmpc81kvf000004l7a94e5otf	2026-05-21 07:09:19.61
cmpf5h9og000k04jon6ixxcwo	cmpeu8lpv000304ksb4vpow57	cmp6haw1k000104jsjws3jyz5	2026-05-21 07:09:24.747
cmpf5hk5p000l04jovnn8nod2	cmpeu8lpv000304ksb4vpow57	cmp6hde8e000104l1tehzmuzm	2026-05-21 07:09:38.324
cmpf5hmwd000m04jo11h763hf	cmpeu8lpv000304ksb4vpow57	cmp6hdvp5000004kzt1tv7tmg	2026-05-21 07:09:41.869
cmpf5hq62000004jvtyptihj2	cmpeu8lpv000304ksb4vpow57	cmp6heog6000204l1kk29qvig	2026-05-21 07:09:46.104
cmpf5hujp000104jvf7y8j4ab	cmpeu8lpv000304ksb4vpow57	cmp6hgdcm000304l1xt82nzez	2026-05-21 07:09:51.779
cmpf5i1x9000n04jok0sfp22q	cmpeu8lpv000304ksb4vpow57	cmp6hhw8m000004jojbatlj17	2026-05-21 07:10:01.342
cmpf5ii2f000004juefv2piao	cmpf5i39k000o04jofetqi9r3	cmp6hkcz4000404l1e9z37t41	2026-05-21 07:10:22.259
cmpf5il3k000005kwj5b3lsuv	cmpf5i39k000o04jofetqi9r3	cmp6hl37g000504l12bjfsq32	2026-05-21 07:10:26.181
cmpf5io1k000104jupvq83lom	cmpf5i39k000o04jofetqi9r3	cmp6hlm4c000304kz0bb39jwo	2026-05-21 07:10:30.004
cmpf5ir3v000105kwfialaoe3	cmpf5i39k000o04jofetqi9r3	cmp6hm626000104joaf89svaz	2026-05-21 07:10:33.979
cmpf5itrp000t04joee22tmy3	cmpf5i39k000o04jofetqi9r3	cmp6hmiby000604l1lr2p1y5y	2026-05-21 07:10:37.408
cmpf5iwwt000204jvac1tjoik	cmpf5i39k000o04jofetqi9r3	cmp6hn3al000304joeay3gzut	2026-05-21 07:10:41.496
cmpf5ml8k000804jvr71i86yf	cmpf4clj9000n04jls6aq0bx4	cmp6hu0dv000004l4nqzxvx87	2026-05-21 07:13:32.991
cmpf5mojl000205kwyus8t8g1	cmpf4clj9000n04jls6aq0bx4	cmp6htl24000104l4seo9jcvj	2026-05-21 07:13:37.271
cmpf5mz76000904jvj4nl915q	cmpf4clj9000n04jls6aq0bx4	cmp6hulyc000404l4mxgnd66i	2026-05-21 07:13:51.087
cmpf5nppv000204juai291xew	cmpf4clj9000n04jls6aq0bx4	cmp6hv69k000204jpznlxyuua	2026-05-21 07:14:25.46
cmpf5ougf000004l6i0qc3fox	cmpf4clj9000n04jls6aq0bx4	cmp6hwbxl000504jp26vf0yhs	2026-05-21 07:15:18.253
cmpf5pfbp000g04jv5kzs2nna	cmpevi8gh000a04jrd2sas927	cmp6hdvp5000004kzt1tv7tmg	2026-05-21 07:15:45.3
cmpf5pi7k000104l6nfuuvu20	cmpevi8gh000a04jrd2sas927	cmp6hde8e000104l1tehzmuzm	2026-05-21 07:15:49.046
cmpf5pluv000304jupdc9t8jg	cmpf4clj9000n04jls6aq0bx4	cmp6hvpqq000404jp703zek6o	2026-05-21 07:15:53.763
cmpf5q2tv000w04jola7fqdvt	cmpf4clj9000n04jls6aq0bx4	cmp6hws08000304l4zi2giios	2026-05-21 07:16:15.752
cmpf5q5gu000204l6doipa8ud	cmpf4clj9000n04jls6aq0bx4	cmp6hx9qg000104l4c4q5wsc9	2026-05-21 07:16:19.181
cmpf5qc3r000304l6txjxjef6	cmpf4clj9000n04jls6aq0bx4	cmp6hxpic000604jpybydais2	2026-05-21 07:16:27.766
cmpf5vpkl000a04ju9gri8vnx	cmpf3vsqd000e04jlciz1o778	cmp6hp1em000404joldu5xtu2	2026-05-21 07:20:38.494
cmpf5vsba001004jo9o7rzj00	cmpf3vsqd000e04jlciz1o778	cmp6hpiy6000504jo9io5jofz	2026-05-21 07:20:42.067
cmpf5vv5h000704l623rqi0u3	cmpf3vsqd000e04jlciz1o778	cmp6hpvkx000004l4on2inxho	2026-05-21 07:20:45.745
cmpf5vxlx000b04ju4ruh68wk	cmpf3vsqd000e04jlciz1o778	cmp6hqewd000004l46hb3ywid	2026-05-21 07:20:48.925
cmpf5vztd000c04jug0anbmya	cmpf3vsqd000e04jlciz1o778	cmp6hr2cb000104l45pt7cm3w	2026-05-21 07:20:51.793
cmpf5w231000804l63j1n9m3n	cmpf3vsqd000e04jlciz1o778	cmp6hrnki000104jp0dxufsxe	2026-05-21 07:20:54.736
cmpf5wzz1000d04ju4r8780yi	cmpf5w2wj000904l6arhvkt0i	cmp6hu0dv000004l4nqzxvx87	2026-05-21 07:21:38.623
cmpf5x28v001104jodlko3uz5	cmpf5w2wj000904l6arhvkt0i	cmp6htl24000104l4seo9jcvj	2026-05-21 07:21:41.599
cmpf5xj7x000e04juacj6pyt4	cmpf5w2wj000904l6arhvkt0i	cmp6hv69k000204jpznlxyuua	2026-05-21 07:22:03.597
cmpf5xle5000f04ju3bg6rrnx	cmpf5w2wj000904l6arhvkt0i	cmp6hulyc000404l4mxgnd66i	2026-05-21 07:22:06.412
cmpf5zmt8001504jvlw9p51ye	cmpf5w2wj000904l6arhvkt0i	cmp6hvpqq000404jp703zek6o	2026-05-21 07:23:41.563
cmpf61nyw000h04l6wwo77xel	cmpdhm748000104joyy3q9rd9	cmpc80kfb000004lao5wtkeih	2026-05-21 07:25:16.3
cmpf61r7w001904jv3iv7vlh9	cmpdhm748000104joyy3q9rd9	cmpc81kvf000004l7a94e5otf	2026-05-21 07:25:20.59
cmpf61u6a000m05kwiszlu4cq	cmpdhm748000104joyy3q9rd9	cmp6haw1k000104jsjws3jyz5	2026-05-21 07:25:24.417
cmpf61wxu000n05kwnguutskj	cmpdhm748000104joyy3q9rd9	cmp6hde8e000104l1tehzmuzm	2026-05-21 07:25:27.982
cmpf61zkg001a04jvrq9nz4eq	cmpdhm748000104joyy3q9rd9	cmp6hdvp5000004kzt1tv7tmg	2026-05-21 07:25:31.38
cmpf622ca000i04l6hspkfhlr	cmpdhm748000104joyy3q9rd9	cmp6heog6000204l1kk29qvig	2026-05-21 07:25:35.011
cmpf624t4000j04l6fkaannu5	cmpdhm748000104joyy3q9rd9	cmp6hgdcm000304l1xt82nzez	2026-05-21 07:25:38.178
cmpf627cv000k04l6xc4bsy9u	cmpdhm748000104joyy3q9rd9	cmp6hhw8m000004jojbatlj17	2026-05-21 07:25:41.49
cmpf62pj9000q04l638cpenjv	cmpf6287t000l04l6qaecfqkn	cmp6hkcz4000404l1e9z37t41	2026-05-21 07:26:05.055
cmpf62s6p000o05kwwdzsosql	cmpf6287t000l04l6qaecfqkn	cmp6hl37g000504l12bjfsq32	2026-05-21 07:26:08.498
cmpf62veb000r04l6i0jdrdiv	cmpf6287t000l04l6qaecfqkn	cmp6hlm4c000304kz0bb39jwo	2026-05-21 07:26:12.652
cmpf62y1h000p05kw2oc4vbcp	cmpf6287t000l04l6qaecfqkn	cmp6hm626000104joaf89svaz	2026-05-21 07:26:16.085
cmpf630py000j04ju2vy8bsp5	cmpf6287t000l04l6qaecfqkn	cmp6hmiby000604l1lr2p1y5y	2026-05-21 07:26:19.546
cmpf6341l000s04l6pg5ohucz	cmpf6287t000l04l6qaecfqkn	cmp6hn3al000304joeay3gzut	2026-05-21 07:26:23.826
cmpf64ezy000k04juschet4zd	cmpf634zw000t04l6qgil5f0p	cmp6hp1em000404joldu5xtu2	2026-05-21 07:27:24.709
cmpf64i7z000q05kwjyf6jh5l	cmpf634zw000t04l6qgil5f0p	cmp6hpiy6000504jo9io5jofz	2026-05-21 07:27:28.892
cmpf64lvq001b04jv08woulff	cmpf634zw000t04l6qgil5f0p	cmp6hpvkx000004l4on2inxho	2026-05-21 07:27:33.632
cmpf64o93000r05kw8vntzecv	cmpf634zw000t04l6qgil5f0p	cmp6hqewd000004l46hb3ywid	2026-05-21 07:27:36.707
cmpf64qdw000s05kwysq9wlc7	cmpf634zw000t04l6qgil5f0p	cmp6hr2cb000104l45pt7cm3w	2026-05-21 07:27:39.475
cmpf64swd000t05kwoqcjyihv	cmpf634zw000t04l6qgil5f0p	cmp6hrnki000104jp0dxufsxe	2026-05-21 07:27:42.74
cmpf66149001c04jv3vgknrnm	cmpf64trb000u05kwa6vy08ao	cmp6htl24000104l4seo9jcvj	2026-05-21 07:28:40.05
cmpf6686d000z05kwdyh5avgx	cmpf64trb000u05kwa6vy08ao	cmp6hu0dv000004l4nqzxvx87	2026-05-21 07:28:49.19
cmpf66ayi001005kwx4f13n7r	cmpf64trb000u05kwa6vy08ao	cmp6hulyc000404l4mxgnd66i	2026-05-21 07:28:52.8
cmpf66dh6000l04juj8ymma4a	cmpf64trb000u05kwa6vy08ao	cmp6hv69k000204jpznlxyuua	2026-05-21 07:28:55.884
cmpf67ghl001105kw29u2kpxw	cmpf64trb000u05kwa6vy08ao	cmp6hvpqq000404jp703zek6o	2026-05-21 07:29:46.615
cmpf67kea001205kwggcu53k4	cmpf64trb000u05kwa6vy08ao	cmp6hwbxl000504jp26vf0yhs	2026-05-21 07:29:51.682
cmpf68we0001305kwn6am2hrf	cmpf5iy24000304jvv1vs78my	cmp6hp1em000404joldu5xtu2	2026-05-21 07:30:53.889
cmpf690ka000m04ju19hhjsyy	cmpf5iy24000304jvv1vs78my	cmp6hpiy6000504jo9io5jofz	2026-05-21 07:30:59.298
cmpf692ya000y04l6tahe38xy	cmpf5w2wj000904l6arhvkt0i	cmp6hwbxl000504jp26vf0yhs	2026-05-21 07:31:02.381
cmpf69472000z04l6oh3ne7n8	cmpf5iy24000304jvv1vs78my	cmp6hpvkx000004l4on2inxho	2026-05-21 07:31:03.999
cmpf696rj001405kweg82o1ms	cmpf5iy24000304jvv1vs78my	cmp6hqewd000004l46hb3ywid	2026-05-21 07:31:07.319
cmpf699ad001505kweaazeo0b	cmpf5iy24000304jvv1vs78my	cmp6hr2cb000104l45pt7cm3w	2026-05-21 07:31:10.6
cmpf69cts000n04juriwicoq8	cmpf5iy24000304jvv1vs78my	cmp6hrnki000104jp0dxufsxe	2026-05-21 07:31:14.86
cmpf6a09a001d04jvacjliv5s	cmpf69dwv000o04juu4hr0hh5	cmp6htl24000104l4seo9jcvj	2026-05-21 07:31:45.533
cmpf6a459001605kwisozwnxm	cmpf69dwv000o04juu4hr0hh5	cmp6hu0dv000004l4nqzxvx87	2026-05-21 07:31:50.592
cmpf6a70q000t04juhiupjsbi	cmpf69dwv000o04juu4hr0hh5	cmp6hulyc000404l4mxgnd66i	2026-05-21 07:31:54.303
cmpf6aauc001e04jvtbf6mo63	cmpf69dwv000o04juu4hr0hh5	cmp6hv69k000204jpznlxyuua	2026-05-21 07:31:59.257
cmpf6adna000u04ju02rzmx8m	cmpf69dwv000o04juu4hr0hh5	cmp6hvpqq000404jp703zek6o	2026-05-21 07:32:02.903
cmpf6agc5001705kwbzw6myo8	cmpf69dwv000o04juu4hr0hh5	cmp6hwbxl000504jp26vf0yhs	2026-05-21 07:32:06.381
cmpf6aj7x001805kwa5a6o2ke	cmpf69dwv000o04juu4hr0hh5	cmp6hws08000304l4zi2giios	2026-05-21 07:32:10.109
cmpf6amxe000v04jumkeaareh	cmpf69dwv000o04juu4hr0hh5	cmp6hx9qg000104l4c4q5wsc9	2026-05-21 07:32:14.907
cmpf6aqp8001004l66w3dshix	cmpf69dwv000o04juu4hr0hh5	cmp6hxpic000604jpybydais2	2026-05-21 07:32:19.804
cmpf6avs4001104l65vjkc75k	cmpf69dwv000o04juu4hr0hh5	cmp6hy8vj000204l4ri5mo48e	2026-05-21 07:32:26.373
cmpf6bxvq001704l6hkzflufq	cmpf6awmw001204l6ivgitknj	cmp6i3j0v000704l4mmtswi6o	2026-05-21 07:33:15.767
cmpf6c11p001905kw4msmqt7j	cmpf6awmw001204l6ivgitknj	cmp6i404b000704jptmv9x14m	2026-05-21 07:33:19.883
cmpf6c3zt001f04jv119vlind	cmpf6awmw001204l6ivgitknj	cmp6i4nwx000704l47g83bzrw	2026-05-21 07:33:23.706
cmpf6c6wf001a05kwe5zpyqb5	cmpf6awmw001204l6ivgitknj	cmp6i55pg000804jpxtstc5hw	2026-05-21 07:33:27.468
cmpf6cc0t001b05kwy91251at	cmpf6awmw001204l6ivgitknj	cmp6i5n1p000404l4n0ejkhtj	2026-05-21 07:33:34.118
cmpf6cikd001g04jvy71ymx83	cmpf6awmw001204l6ivgitknj	cmp6i614r000804l4052it3sl	2026-05-21 07:33:42.596
cmpf6cl9b000w04jujxwvm8jj	cmpf6awmw001204l6ivgitknj	cmpc8gp2q000004jmu8137nw1	2026-05-21 07:33:46.078
cmpf71gcz001804l69hq05bpv	cmpf5w2wj000904l6arhvkt0i	cmp6hws08000304l4zi2giios	2026-05-21 07:53:06.127
cmpf71jbw001904l6boksvt0m	cmpf5w2wj000904l6arhvkt0i	cmp6hx9qg000104l4c4q5wsc9	2026-05-21 07:53:09.987
cmpf71ngo000004l5wdlbnsaf	cmpf5w2wj000904l6arhvkt0i	cmp6hxpic000604jpybydais2	2026-05-21 07:53:15.32
cmpf71pvx001a04l64ixatelo	cmpf5w2wj000904l6arhvkt0i	cmp6hy8vj000204l4ri5mo48e	2026-05-21 07:53:18.482
cmpf86cy9000004kwmiq9y045	cmpf4clj9000n04jls6aq0bx4	cmp6hy8vj000204l4ri5mo48e	2026-05-21 08:24:54.608
cmpfa1siq000004jleffgwb0z	cmpf4qdww001004jlap6o6j1z	cmp6htl24000104l4seo9jcvj	2026-05-21 09:17:20.734
cmpfa1v97000004iha8mwewa9	cmpf4qdww001004jlap6o6j1z	cmp6hu0dv000004l4nqzxvx87	2026-05-21 09:17:24.281
cmpfa1xwl000104jlajs0awxy	cmpf4qdww001004jlap6o6j1z	cmp6hulyc000404l4mxgnd66i	2026-05-21 09:17:27.714
cmpfa21de000004l4fpeyuk3y	cmpf4qdww001004jlap6o6j1z	cmp6hv69k000204jpznlxyuua	2026-05-21 09:17:32.21
cmpfa2474000104l4hi8fx9us	cmpf4qdww001004jlap6o6j1z	cmp6hvpqq000404jp703zek6o	2026-05-21 09:17:35.871
cmpfa27m3000204l4gdrszi2d	cmpf4qdww001004jlap6o6j1z	cmp6hwbxl000504jp26vf0yhs	2026-05-21 09:17:40.3
cmpfa2az2000304l45pqllcnw	cmpf4qdww001004jlap6o6j1z	cmp6hws08000304l4zi2giios	2026-05-21 09:17:44.655
cmpfa2d9p000404l4a0p1nzyz	cmpf4qdww001004jlap6o6j1z	cmp6hx9qg000104l4c4q5wsc9	2026-05-21 09:17:47.624
cmpfa2gnx000504l4jhs9n2i2	cmpf4qdww001004jlap6o6j1z	cmp6hxpic000604jpybydais2	2026-05-21 09:17:52.031
cmpfa2iy6000004kzicj3zqrp	cmpf4qdww001004jlap6o6j1z	cmp6hy8vj000204l4ri5mo48e	2026-05-21 09:17:54.987
cmpfa7mjm000104ih5y77vadw	cmpf86e3k000104kwlxxdzn8v	cmp6i3j0v000704l4mmtswi6o	2026-05-21 09:21:52.931
cmpfa7z5u000204ih75479qok	cmpf86e3k000104kwlxxdzn8v	cmp6i404b000704jptmv9x14m	2026-05-21 09:22:09.27
cmpfa886h000604l4mjsbth5p	cmpf86e3k000104kwlxxdzn8v	cmp6i4nwx000704l47g83bzrw	2026-05-21 09:22:20.959
cmpfa8hin000604kz9pgj4i7l	cmpf86e3k000104kwlxxdzn8v	cmp6i55pg000804jpxtstc5hw	2026-05-21 09:22:33.075
cmpfa8mb2000704kzdanlynj0	cmpf86e3k000104kwlxxdzn8v	cmp6i5n1p000404l4n0ejkhtj	2026-05-21 09:22:39.268
cmpfa8rc3000304ih877r5qmn	cmpf86e3k000104kwlxxdzn8v	cmp6i614r000804l4052it3sl	2026-05-21 09:22:45.805
cmpfb7ywg000004ich14tvjs5	cmpf86e3k000104kwlxxdzn8v	cmpc8gp2q000004jmu8137nw1	2026-05-21 09:50:08.561
cmpfb9b70000504icvccs4jfv	cmpfa2k2u000104kz5wp3m1up	cmp6i3j0v000704l4mmtswi6o	2026-05-21 09:51:11.135
cmpfb9edj000004jphn3bpfwq	cmpfa2k2u000104kz5wp3m1up	cmp6i404b000704jptmv9x14m	2026-05-21 09:51:15.265
cmpfb9gx7000004i54d36excx	cmpfa2k2u000104kz5wp3m1up	cmp6i4nwx000704l47g83bzrw	2026-05-21 09:51:18.573
cmpfb9j7n000104i510qiwalp	cmpfa2k2u000104kz5wp3m1up	cmp6i55pg000804jpxtstc5hw	2026-05-21 09:51:21.536
cmpfb9ly9000304jx29eudyaq	cmpfa2k2u000104kz5wp3m1up	cmp6i5n1p000404l4n0ejkhtj	2026-05-21 09:51:25.087
cmpfb9ocj000604icqxp3my2e	cmpfa2k2u000104kz5wp3m1up	cmp6i614r000804l4052it3sl	2026-05-21 09:51:28.207
cmpfb9qqp000204i5gs88ysu3	cmpfa2k2u000104kz5wp3m1up	cmpc8gp2q000004jmu8137nw1	2026-05-21 09:51:31.303
cmpfbji6e000604jxswtbk3lj	cmpfbak89000a04i5eptsc0qn	cmpc80kfb000004lao5wtkeih	2026-05-21 09:59:06.765
cmpfbjvhj000704jxmr52c5mn	cmpfbak89000a04i5eptsc0qn	cmpc81kvf000004l7a94e5otf	2026-05-21 09:59:24.01
cmpfbkpz9000804jxuh616hq7	cmpfbak89000a04i5eptsc0qn	cmp6haw1k000104jsjws3jyz5	2026-05-21 10:00:03.52
cmpfblddp000904jxjmusppo8	cmpfbak89000a04i5eptsc0qn	cmp6hde8e000104l1tehzmuzm	2026-05-21 10:00:33.854
cmpfbmgm5000a04jxok49amts	cmpfbak89000a04i5eptsc0qn	cmp6hdvp5000004kzt1tv7tmg	2026-05-21 10:01:24.698
cmpflndm3000004l13xf0kbiy	cmpfbak89000a04i5eptsc0qn	cmp6heog6000204l1kk29qvig	2026-05-21 14:42:03.625
cmpflohg3000104l17tlfy2fh	cmpfbak89000a04i5eptsc0qn	cmp6hgdcm000304l1xt82nzez	2026-05-21 14:42:55.25
cmpflr1at000204l1xqkp43sd	cmpfbak89000a04i5eptsc0qn	cmp6hhw8m000004jojbatlj17	2026-05-21 14:44:54.297
cmpfm6p4l000804l1nckfpn5s	cmpflr2ey000304l13bqq9vkh	cmp6hl37g000504l12bjfsq32	2026-05-21 14:57:05.006
cmpfm6xml000904l1skag6mc6	cmpflr2ey000304l13bqq9vkh	cmp6hkcz4000404l1e9z37t41	2026-05-21 14:57:16.022
cmpfm7s14000004l8ksystrr4	cmpflr2ey000304l13bqq9vkh	cmp6hlm4c000304kz0bb39jwo	2026-05-21 14:57:55.414
cmpfm8izi000a04l1mrva39gl	cmpflr2ey000304l13bqq9vkh	cmp6hm626000104joaf89svaz	2026-05-21 14:58:30.356
cmpfm8zy1000004jpzc9mfsf9	cmpflr2ey000304l13bqq9vkh	cmp6hmiby000604l1lr2p1y5y	2026-05-21 14:58:52.335
cmpfm9tye000004jp5mxs902u	cmpflr2ey000304l13bqq9vkh	cmp6hn3al000304joeay3gzut	2026-05-21 14:59:31.236
cmpg647cp000004k3ehq2ii2o	cmpg5nd8p000104l8x9n9p5sh	cmpc81kvf000004l7a94e5otf	2026-05-22 00:15:00.977
cmpg64atx000004kzced1p324	cmpg5nd8p000104l8x9n9p5sh	cmpc80kfb000004lao5wtkeih	2026-05-22 00:15:05.477
cmpg64z4n000104kz5rcgude3	cmpg5nd8p000104l8x9n9p5sh	cmp6haw1k000104jsjws3jyz5	2026-05-22 00:15:36.96
cmpg65c7e000104k3358tp8l2	cmpg5nd8p000104l8x9n9p5sh	cmp6hde8e000104l1tehzmuzm	2026-05-22 00:15:53.927
cmpg65rkb000204k3vmg3jxq5	cmpg5nd8p000104l8x9n9p5sh	cmp6hdvp5000004kzt1tv7tmg	2026-05-22 00:16:13.836
cmpg660sf000004ichywle71y	cmpg5nd8p000104l8x9n9p5sh	cmp6heog6000204l1kk29qvig	2026-05-22 00:16:25.789
cmpg667yd000004l1zg5t5w89	cmpg5nd8p000104l8x9n9p5sh	cmp6hgdcm000304l1xt82nzez	2026-05-22 00:16:35.069
cmpg66d59000104icctnm5nuf	cmpg5nd8p000104l8x9n9p5sh	cmp6hhw8m000004jojbatlj17	2026-05-22 00:16:41.797
cmpg6do9d000104l1bpbygd2b	cmpg66eam000204ice1hqglaz	cmp6hkcz4000404l1e9z37t41	2026-05-22 00:22:22.801
cmpg6dqpc000304k3izy06lh0	cmpg66eam000204ice1hqglaz	cmp6hl37g000504l12bjfsq32	2026-05-22 00:22:25.968
cmpg6dt18000204l1cenl28yd	cmpg66eam000204ice1hqglaz	cmp6hlm4c000304kz0bb39jwo	2026-05-22 00:22:28.989
cmpg6dvmz000304l16opijgtj	cmpg66eam000204ice1hqglaz	cmp6hm626000104joaf89svaz	2026-05-22 00:22:32.361
cmpg6dxqs000404k3nw6y2ncg	cmpg66eam000204ice1hqglaz	cmp6hmiby000604l1lr2p1y5y	2026-05-22 00:22:35.102
cmpg6e0a4000204kzqjb2mvya	cmpg66eam000204ice1hqglaz	cmp6hn3al000304joeay3gzut	2026-05-22 00:22:38.378
cmpg6g30g000804kz6i3cec38	cmpg6e1f3000304kzok08r4j2	cmp6hp1em000404joldu5xtu2	2026-05-22 00:24:15.233
cmpg6g5ot000904kzfygcp8v3	cmpg6e1f3000304kzok08r4j2	cmp6hpiy6000504jo9io5jofz	2026-05-22 00:24:18.698
cmpg6g83z000504k3c3osax49	cmpg6e1f3000304kzok08r4j2	cmp6hpvkx000004l4on2inxho	2026-05-22 00:24:21.833
cmpg6gao8000604k3ycdxilfk	cmpg6e1f3000304kzok08r4j2	cmp6hqewd000004l46hb3ywid	2026-05-22 00:24:25.162
cmpg6hiuy000a04kzw6kgdzj8	cmpg6e1f3000304kzok08r4j2	cmp6hr2cb000104l45pt7cm3w	2026-05-22 00:25:22.427
cmpg6hl8f000004l57rnuxeq6	cmpg6e1f3000304kzok08r4j2	cmp6hrnki000104jp0dxufsxe	2026-05-22 00:25:25.508
cmpg6hy5j000604l5of1w9o7i	cmpg6hmcm000104l5onsem3lj	cmp6htl24000104l4seo9jcvj	2026-05-22 00:25:42.255
cmpg6i0wf000704l5lhrbkgno	cmpg6hmcm000104l5onsem3lj	cmp6hu0dv000004l4nqzxvx87	2026-05-22 00:25:45.805
cmpg6i3mf000404l19tbxjuu7	cmpg6hmcm000104l5onsem3lj	cmp6hulyc000404l4mxgnd66i	2026-05-22 00:25:49.324
cmpg6i6i0000704k3uw32ygmq	cmpg6hmcm000104l5onsem3lj	cmp6hv69k000204jpznlxyuua	2026-05-22 00:25:53.07
cmpg6i8ub000804k3hgqkixst	cmpg6hmcm000104l5onsem3lj	cmp6hvpqq000404jp703zek6o	2026-05-22 00:25:56.099
cmpg6ib0d000504l1tlwk7rb9	cmpg6hmcm000104l5onsem3lj	cmp6hwbxl000504jp26vf0yhs	2026-05-22 00:25:58.876
cmpg6idyy000b04kzo4zhz7z3	cmpg6hmcm000104l5onsem3lj	cmp6hws08000304l4zi2giios	2026-05-22 00:26:02.74
cmpg6igl4000c04kz0a0mh9cj	cmpg6hmcm000104l5onsem3lj	cmp6hx9qg000104l4c4q5wsc9	2026-05-22 00:26:06.136
cmpg6iiya000d04kzohbevpb2	cmpg6hmcm000104l5onsem3lj	cmp6hxpic000604jpybydais2	2026-05-22 00:26:09.182
cmpg6ilok000804l57ik89bpy	cmpg6hmcm000104l5onsem3lj	cmp6hy8vj000204l4ri5mo48e	2026-05-22 00:26:12.717
cmpg6j2mp000604l1xbuiwcfb	cmpg6imvc000904l5d2hzlub1	cmp6i3j0v000704l4mmtswi6o	2026-05-22 00:26:34.704
cmpg6j553000e04kztwoej570	cmpg6imvc000904l5d2hzlub1	cmp6i404b000704jptmv9x14m	2026-05-22 00:26:37.959
cmpg6jnbw000e04l570ulvo1t	cmpg6imvc000904l5d2hzlub1	cmp6i4nwx000704l47g83bzrw	2026-05-22 00:27:01.532
cmpg6jr1i000704l13yzt2029	cmpg6imvc000904l5d2hzlub1	cmp6i55pg000804jpxtstc5hw	2026-05-22 00:27:06.346
cmpg6jtkg000804l1krod62pp	cmpg6imvc000904l5d2hzlub1	cmp6i5n1p000404l4n0ejkhtj	2026-05-22 00:27:09.612
cmpg6jvqu000904l1x5mcshqd	cmpg6imvc000904l5d2hzlub1	cmp6i614r000804l4052it3sl	2026-05-22 00:27:12.443
cmpg6pcf5000f04l5rw45sqdb	cmpg6imvc000904l5d2hzlub1	cmpc8gp2q000004jmu8137nw1	2026-05-22 00:31:27.335
cmpg73mqu000004jpazto7n2o	cmpf4rhwy001d04jlr42zrjwb	cmp6hp1em000404joldu5xtu2	2026-05-22 00:42:33.889
cmpg73qyj000004jpglxuggn8	cmpf4rhwy001d04jlr42zrjwb	cmp6hpiy6000504jo9io5jofz	2026-05-22 00:42:39.36
cmpg73u96000104jp4ehiqo2c	cmpf4rhwy001d04jlr42zrjwb	cmp6hpvkx000004l4on2inxho	2026-05-22 00:42:43.625
cmpg73xdp000104jpixohseim	cmpf4rhwy001d04jlr42zrjwb	cmp6hqewd000004l46hb3ywid	2026-05-22 00:42:47.677
cmpg747xe000204jpfv03y2yr	cmpf4rhwy001d04jlr42zrjwb	cmp6hr2cb000104l45pt7cm3w	2026-05-22 00:43:01.344
cmpg74bus000304jpvvck7ok2	cmpf4rhwy001d04jlr42zrjwb	cmp6hrnki000104jp0dxufsxe	2026-05-22 00:43:06.429
cmpg74qzw000a04l1q8v4pj0r	cmpg74cp7000404jpwcsz4atm	cmp6htl24000104l4seo9jcvj	2026-05-22 00:43:26.058
cmpg74ubv000004jmcbellk2u	cmpg74cp7000404jpwcsz4atm	cmp6hu0dv000004l4nqzxvx87	2026-05-22 00:43:30.375
cmpg74xjt000204jpvq4ait9s	cmpg74cp7000404jpwcsz4atm	cmp6hulyc000404l4mxgnd66i	2026-05-22 00:43:34.554
cmpg750ng000104jmreakbl87	cmpg74cp7000404jpwcsz4atm	cmp6hv69k000204jpznlxyuua	2026-05-22 00:43:38.568
cmpg753gr000b04l1q33d7c5d	cmpg74cp7000404jpwcsz4atm	cmp6hvpqq000404jp703zek6o	2026-05-22 00:43:42.218
cmpg756mq000904jpaqncv2iq	cmpg74cp7000404jpwcsz4atm	cmp6hwbxl000504jp26vf0yhs	2026-05-22 00:43:46.322
cmpg75aad000a04jpam56foqw	cmpg74cp7000404jpwcsz4atm	cmp6hws08000304l4zi2giios	2026-05-22 00:43:51.06
cmpg75dkh000c04l1z1m7sm71	cmpg74cp7000404jpwcsz4atm	cmp6hx9qg000104l4c4q5wsc9	2026-05-22 00:43:55.324
cmpg75gpb000d04l1m32z96ng	cmpg74cp7000404jpwcsz4atm	cmp6hxpic000604jpybydais2	2026-05-22 00:43:59.373
cmpg75lx9000304jpcyziutgs	cmpg74cp7000404jpwcsz4atm	cmp6hy8vj000204l4ri5mo48e	2026-05-22 00:44:06.122
cmpg75xvh000904jpxt3im184	cmpg75n5f000404jpvhqaks9s	cmp6i3j0v000704l4mmtswi6o	2026-05-22 00:44:21.628
cmpg760hl000e04l1lpcj1cf4	cmpg75n5f000404jpvhqaks9s	cmp6i404b000704jptmv9x14m	2026-05-22 00:44:25.017
cmpg763q5000f04l1a9a0tpzw	cmpg75n5f000404jpvhqaks9s	cmp6i4nwx000704l47g83bzrw	2026-05-22 00:44:29.21
cmpg766jq000204jmd1j0bfxf	cmpg75n5f000404jpvhqaks9s	cmp6i55pg000804jpxtstc5hw	2026-05-22 00:44:32.867
cmpg769hb000a04jpfuofoutc	cmpg75n5f000404jpvhqaks9s	cmp6i5n1p000404l4n0ejkhtj	2026-05-22 00:44:36.682
cmpg76cn7000304jmtl28licu	cmpg75n5f000404jpvhqaks9s	cmp6i614r000804l4052it3sl	2026-05-22 00:44:40.771
cmpg76gpp000b04jpqbjhpoqi	cmpg75n5f000404jpvhqaks9s	cmpc8gp2q000004jmu8137nw1	2026-05-22 00:44:46.052
cmpg806pq000004layy7si0tl	cmpfb7nsm000104jxfeweedx1	cmpc80kfb000004lao5wtkeih	2026-05-22 01:07:52.769
cmpg8093q000104la791lx27x	cmpfb7nsm000104jxfeweedx1	cmpc81kvf000004l7a94e5otf	2026-05-22 01:07:55.869
cmpg80b9v000004l8g19mue8u	cmpfb7nsm000104jxfeweedx1	cmp6haw1k000104jsjws3jyz5	2026-05-22 01:07:58.67
cmpg80dq4000104l8bjmilm09	cmpfb7nsm000104jxfeweedx1	cmp6hde8e000104l1tehzmuzm	2026-05-22 01:08:01.836
cmpg80gus000004jsygtwayz6	cmpfb7nsm000104jxfeweedx1	cmp6hdvp5000004kzt1tv7tmg	2026-05-22 01:08:05.897
cmpg80k2h000004jpig5inm25	cmpfb7nsm000104jxfeweedx1	cmp6heog6000204l1kk29qvig	2026-05-22 01:08:10.068
cmpg80mcy000104jphxb8q0zs	cmpfb7nsm000104jxfeweedx1	cmp6hgdcm000304l1xt82nzez	2026-05-22 01:08:13.05
cmpg80ow5000204l8gapu07mc	cmpfb7nsm000104jxfeweedx1	cmp6hhw8m000004jojbatlj17	2026-05-22 01:08:16.325
cmpg814xa000804l8s7c0c0nj	cmpg80q1r000304l8h5za856q	cmp6hkcz4000404l1e9z37t41	2026-05-22 01:08:37.096
cmpg8192m000204lamig4oj0n	cmpg80q1r000304l8h5za856q	cmp6hl37g000504l12bjfsq32	2026-05-22 01:08:42.478
cmpg81bhf000204jp5kh6yz6s	cmpg80q1r000304l8h5za856q	cmp6hlm4c000304kz0bb39jwo	2026-05-22 01:08:45.591
cmpg81dj7000104js3lulztgq	cmpg80q1r000304l8h5za856q	cmp6hm626000104joaf89svaz	2026-05-22 01:08:48.256
cmpg81gcb000204js7l5z2ad9	cmpg80q1r000304l8h5za856q	cmp6hmiby000604l1lr2p1y5y	2026-05-22 01:08:51.895
cmpg81imr000304la4pfjitka	cmpg80q1r000304l8h5za856q	cmp6hn3al000304joeay3gzut	2026-05-22 01:08:54.844
cmpg81v6b000904laeln2kwtd	cmpg81jre000404lao0r2p8f9	cmp6hp1em000404joldu5xtu2	2026-05-22 01:09:11.133
cmpg81xw1000304jp7ilju3et	cmpg81jre000404lao0r2p8f9	cmp6hpiy6000504jo9io5jofz	2026-05-22 01:09:14.65
cmpg823c6000404jp3v9zgwu0	cmpg81jre000404lao0r2p8f9	cmp6hpvkx000004l4on2inxho	2026-05-22 01:09:21.7
cmpg829wp000904l8joks8tfr	cmpg81jre000404lao0r2p8f9	cmp6hqewd000004l46hb3ywid	2026-05-22 01:09:30.216
cmpg82clw000504jpj6eh6jz8	cmpg81jre000404lao0r2p8f9	cmp6hr2cb000104l45pt7cm3w	2026-05-22 01:09:33.715
cmpg82f3w000604jpwuefxvg6	cmpg81jre000404lao0r2p8f9	cmp6hrnki000104jp0dxufsxe	2026-05-22 01:09:36.953
cmpg8eqqe000004l7645ro9ck	cmpfbch9t000404jxgwx99275	cmpc80kfb000004lao5wtkeih	2026-05-22 01:19:11.878
cmpg8ev4i000a04l8iey5gk6l	cmpfbch9t000404jxgwx99275	cmpc81kvf000004l7a94e5otf	2026-05-22 01:19:17.589
cmpg8ey69000c04jpuzma4nz5	cmpfbch9t000404jxgwx99275	cmp6haw1k000104jsjws3jyz5	2026-05-22 01:19:21.542
cmpg8f0rq000d04jpz0jby84p	cmpfbch9t000404jxgwx99275	cmp6hde8e000104l1tehzmuzm	2026-05-22 01:19:24.894
cmpg8f3zy000e04jpp6okzjop	cmpfbch9t000404jxgwx99275	cmp6hdvp5000004kzt1tv7tmg	2026-05-22 01:19:29.08
cmpg8f8a3000004l2yb2m4lr7	cmpfbch9t000404jxgwx99275	cmp6heog6000204l1kk29qvig	2026-05-22 01:19:34.633
cmpg8fbm8000104l2hzd3n3wz	cmpfbch9t000404jxgwx99275	cmp6hgdcm000304l1xt82nzez	2026-05-22 01:19:38.956
cmpg8ff1c000104l7mueuxkep	cmpfbch9t000404jxgwx99275	cmp6hhw8m000004jojbatlj17	2026-05-22 01:19:43.392
cmpg8g2pd000204l2wn5ame25	cmpg8fg5v000204l7u9uzehze	cmp6hkcz4000404l1e9z37t41	2026-05-22 01:20:14.063
cmpg8g68p000f04jpyuqiw5fu	cmpg8fg5v000204l7u9uzehze	cmp6hl37g000504l12bjfsq32	2026-05-22 01:20:18.657
cmpg8g94q000704l7banv5rqf	cmpg8fg5v000204l7u9uzehze	cmp6hlm4c000304kz0bb39jwo	2026-05-22 01:20:22.392
cmpg8gbrz000804l7hlki5lkm	cmpg8fg5v000204l7u9uzehze	cmp6hm626000104joaf89svaz	2026-05-22 01:20:25.821
cmpg8geir000904l7pd3uq05y	cmpg8fg5v000204l7u9uzehze	cmp6hmiby000604l1lr2p1y5y	2026-05-22 01:20:29.385
cmpg8gh67000g04jpphlhfzga	cmpg8fg5v000204l7u9uzehze	cmp6hn3al000304joeay3gzut	2026-05-22 01:20:32.819
cmpg8gte1000m04jpakjuo17f	cmpg8gi9m000h04jpadeckfyt	cmp6hp1em000404joldu5xtu2	2026-05-22 01:20:48.645
cmpg8gwt5000304l2g5s8j2k0	cmpg8gi9m000h04jpadeckfyt	cmp6hpiy6000504jo9io5jofz	2026-05-22 01:20:53.092
cmpg8gza4000404l2lqo4kvsd	cmpg8gi9m000h04jpadeckfyt	cmp6hpvkx000004l4on2inxho	2026-05-22 01:20:56.282
cmpg8h1nt000504l2up2epq5v	cmpg8gi9m000h04jpadeckfyt	cmp6hqewd000004l46hb3ywid	2026-05-22 01:20:59.365
cmpg8h4s8000n04jp0i2uelm4	cmpg8gi9m000h04jpadeckfyt	cmp6hr2cb000104l45pt7cm3w	2026-05-22 01:21:03.415
cmpg8h7gl000604l2t7m6kw0e	cmpg8gi9m000h04jpadeckfyt	cmp6hrnki000104jp0dxufsxe	2026-05-22 01:21:06.886
cmpg8hh5q000c04l2f7fimvw8	cmpg8h8as000704l2bpkeaose	cmp6htl24000104l4seo9jcvj	2026-05-22 01:21:19.46
cmpg8hjoh000d04l2c2pqvofj	cmpg8h8as000704l2bpkeaose	cmp6hu0dv000004l4nqzxvx87	2026-05-22 01:21:22.732
cmpg8hn8e000a04l7mnu7vt3i	cmpg8h8as000704l2bpkeaose	cmp6hulyc000404l4mxgnd66i	2026-05-22 01:21:27.327
cmpg8hq6j000e04l27vxlg1uv	cmpg8h8as000704l2bpkeaose	cmp6hv69k000204jpznlxyuua	2026-05-22 01:21:31.153
cmpg8htcb000o04jp26p86ozu	cmpg8h8as000704l2bpkeaose	cmp6hvpqq000404jp703zek6o	2026-05-22 01:21:35.245
cmpg8hwmh000b04l8lpq9bzg1	cmpg8h8as000704l2bpkeaose	cmp6hwbxl000504jp26vf0yhs	2026-05-22 01:21:39.494
cmpg8hzdr000f04l292ptx73o	cmpg8h8as000704l2bpkeaose	cmp6hws08000304l4zi2giios	2026-05-22 01:21:43.082
cmpg8i1co000c04l8kjcqweb5	cmpg8h8as000704l2bpkeaose	cmp6hx9qg000104l4c4q5wsc9	2026-05-22 01:21:45.615
cmpg8i3rw000g04l20q4qcesu	cmpg8h8as000704l2bpkeaose	cmp6hxpic000604jpybydais2	2026-05-22 01:21:48.77
cmpg8i6g2000b04l7kziyx2vt	cmpg8h8as000704l2bpkeaose	cmp6hy8vj000204l4ri5mo48e	2026-05-22 01:21:52.225
cmpg8if2b000h04l7glgwvmkf	cmpg8i7ks000c04l7zahw7fud	cmp6i3j0v000704l4mmtswi6o	2026-05-22 01:22:03.394
cmpg8ihfd000i04l7h1oq45j4	cmpg8i7ks000c04l7zahw7fud	cmp6i404b000704jptmv9x14m	2026-05-22 01:22:06.458
cmpg8ikc8000p04jp9pneg9wc	cmpg8i7ks000c04l7zahw7fud	cmp6i4nwx000704l47g83bzrw	2026-05-22 01:22:10.228
cmpg8imv0000q04jpfnun6m0g	cmpg8i7ks000c04l7zahw7fud	cmp6i55pg000804jpxtstc5hw	2026-05-22 01:22:13.5
cmpg8iq8v000r04jpl6w6r7bc	cmpg8i7ks000c04l7zahw7fud	cmp6i5n1p000404l4n0ejkhtj	2026-05-22 01:22:17.886
cmpg8iufh000s04jp70ajkltd	cmpg8i7ks000c04l7zahw7fud	cmp6i614r000804l4052it3sl	2026-05-22 01:22:23.307
cmpg8ix7p000d04l8mxabggdz	cmpg8i7ks000c04l7zahw7fud	cmpc8gp2q000004jmu8137nw1	2026-05-22 01:22:26.923
cmpgfdeli000004jsaxcnx7wc	cmpfacyis000804l447fx4ndz	cmpc80kfb000004lao5wtkeih	2026-05-22 04:34:06.825
cmpgfdvlh000004ju5fhv3x2p	cmpfacyis000804l447fx4ndz	cmpc81kvf000004l7a94e5otf	2026-05-22 04:34:28.851
cmpgfdzyj000004lb73lgilcd	cmpfacyis000804l447fx4ndz	cmp6haw1k000104jsjws3jyz5	2026-05-22 04:34:34.512
cmpgfe7af000004kzs0cih9ot	cmpfacyis000804l447fx4ndz	cmp6hde8e000104l1tehzmuzm	2026-05-22 04:34:44.004
cmpgfebyl000104jsmcje7cvk	cmpfacyis000804l447fx4ndz	cmp6hdvp5000004kzt1tv7tmg	2026-05-22 04:34:50.06
cmpgfeeo1000104kzik9zsxvv	cmpfacyis000804l447fx4ndz	cmp6heog6000204l1kk29qvig	2026-05-22 04:34:53.569
cmpgfflv0000204kzdjn1vi8e	cmpfacyis000804l447fx4ndz	cmp6hgdcm000304l1xt82nzez	2026-05-22 04:35:49.548
cmpgffpmn000204js9ltwpxwz	cmpfacyis000804l447fx4ndz	cmp6hhw8m000004jojbatlj17	2026-05-22 04:35:54.418
cmpgfgbgz000104lbqiz2rj16	cmpgffqua000304jsbvc7qrzd	cmp6hkcz4000404l1e9z37t41	2026-05-22 04:36:22.722
cmpgfgdw3000204lbvlxd0av7	cmpgffqua000304jsbvc7qrzd	cmp6hl37g000504l12bjfsq32	2026-05-22 04:36:25.875
cmpgfggcc000304lbbddalx9b	cmpgffqua000304jsbvc7qrzd	cmp6hlm4c000304kz0bb39jwo	2026-05-22 04:36:28.996
cmpgfgig5000404lb0bukj253	cmpgffqua000304jsbvc7qrzd	cmp6hm626000104joaf89svaz	2026-05-22 04:36:31.782
cmpgfgm7p000304kz123tfrg8	cmpgffqua000304jsbvc7qrzd	cmp6hmiby000604l1lr2p1y5y	2026-05-22 04:36:36.649
cmpgfgoo4000504lbmgeuvvut	cmpgffqua000304jsbvc7qrzd	cmp6hn3al000304joeay3gzut	2026-05-22 04:36:39.846
cmpgfgzmp000804js0gawhsji	cmpgfgpie000604lb1ajyeuyt	cmp6hp1em000404joldu5xtu2	2026-05-22 04:36:54.04
cmpgfh241000104ju8aaqbu9u	cmpgfgpie000604lb1ajyeuyt	cmp6hpiy6000504jo9io5jofz	2026-05-22 04:36:57.262
cmpgfh4y5000b04lbqb7bu3ld	cmpgfgpie000604lb1ajyeuyt	cmp6hpvkx000004l4on2inxho	2026-05-22 04:37:00.939
cmpgfh7h9000904jsyvcw8cqb	cmpgfgpie000604lb1ajyeuyt	cmp6hqewd000004l46hb3ywid	2026-05-22 04:37:04.221
cmpgfh9pa000c04lb9ud1rdvz	cmpgfgpie000604lb1ajyeuyt	cmp6hr2cb000104l45pt7cm3w	2026-05-22 04:37:07.103
cmpgfhc28000404kzlj02tobc	cmpgfgpie000604lb1ajyeuyt	cmp6hrnki000104jp0dxufsxe	2026-05-22 04:37:10.158
cmpgfhmqj000a04kzu6s9p4jb	cmpgfhd7v000504kzm3yqx23i	cmp6htl24000104l4seo9jcvj	2026-05-22 04:37:23.954
cmpgfhpcw000204jul1b75veu	cmpgfhd7v000504kzm3yqx23i	cmp6hu0dv000004l4nqzxvx87	2026-05-22 04:37:27.388
cmpgfhrwf000304julwvf54kp	cmpgfhd7v000504kzm3yqx23i	cmp6hulyc000404l4mxgnd66i	2026-05-22 04:37:30.68
cmpgfhulx000d04lb55eujcmk	cmpgfhd7v000504kzm3yqx23i	cmp6hv69k000204jpznlxyuua	2026-05-22 04:37:34.197
cmpgfhxsh000a04js3n71zjoe	cmpgfhd7v000504kzm3yqx23i	cmp6hvpqq000404jp703zek6o	2026-05-22 04:37:38.3
cmpgfi7c7000e04lbq1l91ec5	cmpgfhd7v000504kzm3yqx23i	cmp6hwbxl000504jp26vf0yhs	2026-05-22 04:37:50.691
cmpgfiaz6000404ju9xdx7of9	cmpgfhd7v000504kzm3yqx23i	cmp6hws08000304l4zi2giios	2026-05-22 04:37:55.41
cmpgfidph000b04kzl1wdr6b8	cmpgfhd7v000504kzm3yqx23i	cmp6hx9qg000104l4c4q5wsc9	2026-05-22 04:37:58.949
cmpgfixsd000504jumfsqco13	cmpgfhd7v000504kzm3yqx23i	cmp6hxpic000604jpybydais2	2026-05-22 04:38:24.982
cmpgfj0la000b04jsgn7n1u1k	cmpgfhd7v000504kzm3yqx23i	cmp6hy8vj000204l4ri5mo48e	2026-05-22 04:38:28.605
cmpgfjc7q000h04jsis5a7val	cmpgfj1pz000c04jsv00w15pq	cmp6i3j0v000704l4mmtswi6o	2026-05-22 04:38:43.67
cmpgfjf01000c04kz3m3f4zx1	cmpgfj1pz000c04jsv00w15pq	cmp6i404b000704jptmv9x14m	2026-05-22 04:38:47.291
cmpgfjhfk000i04js22uq2s6b	cmpgfj1pz000c04jsv00w15pq	cmp6i4nwx000704l47g83bzrw	2026-05-22 04:38:50.438
cmpgfjjk2000d04kz4s70xihv	cmpgfj1pz000c04jsv00w15pq	cmp6i55pg000804jpxtstc5hw	2026-05-22 04:38:53.196
cmpgfjm17000f04lbh7xpb7xn	cmpgfj1pz000c04jsv00w15pq	cmp6i5n1p000404l4n0ejkhtj	2026-05-22 04:38:56.405
cmpgfjocf000e04kzic1tmvx1	cmpgfj1pz000c04jsv00w15pq	cmp6i614r000804l4052it3sl	2026-05-22 04:38:59.391
cmpgfjqqt000f04kz63g2is72	cmpgfj1pz000c04jsv00w15pq	cmpc8gp2q000004jmu8137nw1	2026-05-22 04:39:02.496
cmq0e3kgi000004jpy6mgl1ct	cmpeviif0000b04jp2yjbrn25	cmp6haw1k000104jsjws3jyz5	2026-06-05 03:53:51.759
cmq4unmen000004l5r4kbg9xx	cmpeviif0000b04jp2yjbrn25	cmp6hde8e000104l1tehzmuzm	2026-06-08 06:48:25.956
cmq4unylj000004la7ugdki3v	cmpeviif0000b04jp2yjbrn25	cmpxlqul0000004l5vgyndqrx	2026-06-08 06:48:41.772
cmq4vkwxk000004l3dcqg8g0x	cmpeviif0000b04jp2yjbrn25	cmp6hdvp5000004kzt1tv7tmg	2026-06-08 07:14:19.253
cmq4vo00q000004l4otysw7l1	cmpeviif0000b04jp2yjbrn25	cmp6heog6000204l1kk29qvig	2026-06-08 07:16:43.23
cmq4vp66g000004jrjoqbjza3	cmpeviif0000b04jp2yjbrn25	cmpxojm87000004ik0rgo4r7a	2026-06-08 07:17:37.826
cmq60i8g2000004l8l28j06k8	cmpeviif0000b04jp2yjbrn25	cmp6hgdcm000304l1xt82nzez	2026-06-09 02:19:58.459
cmq60j2bc000004jv4jc7u37l	cmpeviif0000b04jp2yjbrn25	cmp6hhw8m000004jojbatlj17	2026-06-09 02:20:37.184
cmq60j5xp000104jvu7cyrerp	cmpeviif0000b04jp2yjbrn25	cmpxojuop000104ikhp57gwdh	2026-06-09 02:20:41.868
cmq6bvenq000004l2l0b474g5	cmq60j6rv000204jvswoxzbvm	cmp6hkcz4000404l1e9z37t41	2026-06-09 07:38:08.819
cmq6bvjio000104l2g3if8s9t	cmq60j6rv000204jvswoxzbvm	cmp6hl37g000504l12bjfsq32	2026-06-09 07:38:15.12
cmq6bvwib000004jpfpylvr36	cmq60j6rv000204jvswoxzbvm	cmpxoklgv000004l1ih7o2ut8	2026-06-09 07:38:31.962
cmq6czu6p000004iekhmu80gc	cmq60j6rv000204jvswoxzbvm	cmp6hlm4c000304kz0bb39jwo	2026-06-09 08:09:35.186
cmq6czxc5000104iekjd2bpht	cmq60j6rv000204jvswoxzbvm	cmp6hm626000104joaf89svaz	2026-06-09 08:09:39.27
cmq6d07t8000204iehg3ys6is	cmq60j6rv000204jvswoxzbvm	cmpxokwo0000004lby9749w3o	2026-06-09 08:09:52.846
cmq6d5cxf000004l7hpqnz4ek	cmq60j6rv000204jvswoxzbvm	cmp6hmiby000604l1lr2p1y5y	2026-06-09 08:13:52.76
cmq6d5g6v000304ietvaaxgcr	cmq60j6rv000204jvswoxzbvm	cmp6hn3al000304joeay3gzut	2026-06-09 08:13:56.978
cmq6d5nl9000004jvmqvomqms	cmq60j6rv000204jvswoxzbvm	cmpxol5he000104l1fp9whdeq	2026-06-09 08:14:06.56
cmq6dxmlz000004l51ul9ega8	cmq6d5oqr000104jvxwdrxk17	cmp6hp1em000404joldu5xtu2	2026-06-09 08:35:51.664
cmq6dxqex000004kz7x3s6668	cmq6d5oqr000104jvxwdrxk17	cmp6hpiy6000504jo9io5jofz	2026-06-09 08:35:56.6
cmq6dxubn000004lbq8z5roel	cmq6d5oqr000104jvxwdrxk17	cmpxoljnu000204l17x8pjnse	2026-06-09 08:36:01.657
\.


--
-- TOC entry 3744 (class 0 OID 25694)
-- Dependencies: 222
-- Data for Name: lessons; Type: TABLE DATA; Schema: public; Owner: postgres_lms
--

COPY public.lessons (id, "moduleId", title, type, content, "videoUrl", "fileUrl", duration, "order", "createdAt", "updatedAt") FROM stdin;
cmp6haw1k000104jsjws3jyz5	cmp6h8oqa000004l1hmaixi2w	Section 1.1: Apa Itu Kecerdasan Buatan?	DOCUMENT	\N	\N	https://drive.google.com/file/d/1B8idpO4zRv7jzIdznRi9ZAzD1gtKwD7h/view?usp=sharing	\N	0	2026-05-15 05:30:27.128	2026-05-15 05:30:27.128
cmp6hde8e000104l1tehzmuzm	cmp6h8oqa000004l1hmaixi2w	PPT: 1.1 Mengenal AI, Dari Fiksi Ilmiah ke Realita Kerja	DOCUMENT	\N	\N	https://docs.google.com/presentation/d/13TCtxk5lmMh5JQ4A0tbWnF3weDxZ2_UN2V8hkuBtCfQ/edit?usp=sharing	\N	1	2026-05-15 05:32:24.014	2026-05-15 05:32:24.014
cmp6hdvp5000004kzt1tv7tmg	cmp6hdgan000204js93o19rn2	Section 1.2: Bagaimana AI Bekerja, Memahami di Balik Layar	DOCUMENT	\N	\N	https://drive.google.com/file/d/1ngM2EovHRDCjToRXo-tFfAEMgGm01unx/view?usp=sharing	\N	0	2026-05-15 05:32:46.649	2026-05-15 05:32:46.649
cmp6heog6000204l1kk29qvig	cmp6hdgan000204js93o19rn2	PPT: 1.2 Bagaimana AI Bekerja, Memahami di Balik Layar	DOCUMENT	\N	\N	https://docs.google.com/presentation/d/1ppP7WjU17UFZ9xVZ-2Kxi6JRJqHVoDBdIFnzNrmCt4g/edit?usp=sharing	\N	1	2026-05-15 05:33:23.91	2026-05-15 05:33:23.91
cmp6hvpqq000404jp703zek6o	cmp6hv8vy000304jp3htr3hjj	Section 4.3: D2 — DIAGNOSE	DOCUMENT	\N	\N	https://drive.google.com/file/d/1jyRN3_2N0UdZm4emx8OeSX3Ia-UGGwjo/view?usp=sharing	\N	0	2026-05-15 05:46:38.738	2026-05-15 05:46:38.738
cmp6hwbxl000504jp26vf0yhs	cmp6hv8vy000304jp3htr3hjj	PPT: 4.3 D2 — DIAGNOSE Menemukan dan Mengisi Celah	DOCUMENT	\N	\N	https://docs.google.com/presentation/d/1v0QE-EIYbS6HsLLxKiuY1lWlqC1Fx3uXjHE6Pd1nAFI/edit?usp=sharing	\N	1	2026-05-15 05:47:07.497	2026-05-15 05:47:07.497
cmp6hws08000304l4zi2giios	cmp6hwdyh000504l4lus8b20u	Section 4.4: D3 — DEVELOP	DOCUMENT	\N	\N	https://drive.google.com/file/d/1YmNNyqX0u0wJS42OLu-JUzqgZCm3ITZN/view?usp=sharing	\N	0	2026-05-15 05:47:28.328	2026-05-15 05:47:28.328
cmp6hx9qg000104l4c4q5wsc9	cmp6hwdyh000504l4lus8b20u	PPT: 4.4 D3 — DEVELOP Memilih Teknik & Membangun Struktur	DOCUMENT	\N	\N	https://docs.google.com/presentation/d/1Mcvf1y0U-cyZ_RDdK1mlfsoyqdMWmN398cDSjeLQLic/edit?usp=sharing	\N	1	2026-05-15 05:47:51.304	2026-05-15 05:47:51.304
cmp6hxpic000604jpybydais2	cmp6hxbgh000404l4env80e40	Section 4.5: D4 — DELIVER	DOCUMENT	\N	\N	https://drive.google.com/file/d/1bx3VlM6DOGvRoG61pPo2C3-vRQxlvhNI/view?usp=sharing	\N	0	2026-05-15 05:48:11.748	2026-05-15 05:48:11.748
cmp6hgdcm000304l1xt82nzez	cmp6hevy5000104kzsx85zc6f	Section 1.3: Ekosistem AI Tools — Peta Lanskap Alat AI	DOCUMENT	\N	\N	https://drive.google.com/file/d/18WkX4O3tfCajMurGW-vATlrZdiLWLMtw/view?usp=sharing	\N	0	2026-05-15 05:34:42.838	2026-05-15 05:35:21.387
cmp6hy8vj000204l4ri5mo48e	cmp6hxbgh000404l4env80e40	PPT: 4.5 D4 — DELIVER Merangkai Prompt Final yang Optimal	DOCUMENT	\N	\N	https://docs.google.com/presentation/d/1KoIvxV_dGoLJRb8zWbcM5wlVOi6mMKJPy-K3F6siT8o/edit?usp=sharing	\N	1	2026-05-15 05:48:36.847	2026-05-15 05:48:36.847
cmp6hkcz4000404l1e9z37t41	cmp6hjvp8000504jsghjqcd1j	Section 2.1: Prinsip-Prinsip Etika AI	DOCUMENT	\N	\N	https://drive.google.com/file/d/1qUeMnHJ9Z9Q7LfrLlJMMStOTDYPtQy4A/view?usp=sharing	\N	0	2026-05-15 05:37:48.976	2026-05-15 05:37:48.976
cmp6hl37g000504l12bjfsq32	cmp6hjvp8000504jsghjqcd1j	PPT: 2.1 Prinsip-Prinsip Etika AI	DOCUMENT	\N	\N	https://docs.google.com/presentation/d/1HdYcg4faLFfjOYMTfn0FnxF8rk33DRfFN-VkLHTBX9c/edit?usp=sharing	\N	1	2026-05-15 05:38:22.972	2026-05-15 05:38:22.972
cmp6hlm4c000304kz0bb39jwo	cmp6hl5dn000204kzp2g6v90y	Section 2.2: Keamanan Data & Kebijakan Penggunaan AI Perusahaan	DOCUMENT	\N	\N	https://drive.google.com/file/d/1-ZkDhytjX6B-z_BK_YN793-f0fuw01VS/view?usp=sharing	\N	0	2026-05-15 05:38:47.484	2026-05-15 05:38:47.484
cmp6hm626000104joaf89svaz	cmp6hl5dn000204kzp2g6v90y	PPT: 2.2 Keamanan Data & Kebijakan AI Perusahaan	DOCUMENT	\N	\N	https://docs.google.com/presentation/d/1PgYdf4oXDdCJ9NHKzktZfEHSxFCLVmnhbLQcvhR5IkE/edit?usp=sharing	\N	1	2026-05-15 05:39:13.326	2026-05-15 05:39:13.326
cmp6hmiby000604l1lr2p1y5y	cmp6hm80f000204jokn7bh0us	Section 2.3: Kepatuhan, Regulasi & Masa Depan AI	DOCUMENT	\N	\N	https://drive.google.com/file/d/1iIUez6eB4l4FZy5_E5pHZocqi0h833Hm/view?usp=sharing	\N	0	2026-05-15 05:39:29.23	2026-05-15 05:39:29.23
cmp6hn3al000304joeay3gzut	cmp6hm80f000204jokn7bh0us	PPT: Kepatuhan, Regulasi & Masa Depan AI	DOCUMENT	\N	\N	https://docs.google.com/presentation/d/1ikC64ax5vONpsOhpG4tvuXwQS9g46RAAlpAn8Teu6TQ/edit?usp=sharing	\N	1	2026-05-15 05:39:56.397	2026-05-15 05:39:56.397
cmp6hp1em000404joldu5xtu2	cmp6hosv8000504kzeplo6okd	Section 3.1: Apa Itu Prompting?	DOCUMENT	\N	\N	https://drive.google.com/file/d/1Xp2DQmLzUeSjK2BezpbXP6F1Z1T5adFL/view?usp=sharing	\N	0	2026-05-15 05:41:27.262	2026-05-15 05:41:27.262
cmp6hpiy6000504jo9io5jofz	cmp6hosv8000504kzeplo6okd	PPT: 3.1 Apa Itu Prompting?, Dari Pertanyaan Biasa ke Prompt yang Powerful	DOCUMENT	\N	\N	https://docs.google.com/presentation/d/1ziPu09eWc-t9MVARUx9emXlsgm96cDNu0p-eG3faBpM/edit?usp=sharing	\N	1	2026-05-15 05:41:49.997	2026-05-15 05:41:49.997
cmp6hpvkx000004l4on2inxho	cmp6hpkyg000604jogh665e28	Section 3.2: Teknik-Teknik Prompting Dasar	DOCUMENT	\N	\N	https://drive.google.com/file/d/1lGGDka7LU4oXmCiHvDuBnVD2FSk8fjpd/view?usp=sharing	\N	0	2026-05-15 05:42:06.369	2026-05-15 05:42:06.369
cmp6hqewd000004l46hb3ywid	cmp6hpkyg000604jogh665e28	PPT: 3.2 Teknik-Teknik Prompting Dasar	DOCUMENT	\N	\N	https://docs.google.com/presentation/d/1o51aEz4RuoxbqQzbMTQLrZTKYH6kPNc_-bSH0M3202c/edit?usp=sharing	\N	1	2026-05-15 05:42:31.405	2026-05-15 05:42:31.405
cmp6hr2cb000104l45pt7cm3w	cmp6hqnle000004jp0nyagy4q	Section 3.3: Kesalahan Umum dalam Prompting dan Cara Mengatasinya	DOCUMENT	\N	\N	https://drive.google.com/file/d/1ONGO7ZvzMHUO18FdxEEu4eF0leGlrALG/view?usp=sharing	\N	0	2026-05-15 05:43:01.787	2026-05-15 05:43:01.787
cmp6hrnki000104jp0dxufsxe	cmp6hqnle000004jp0nyagy4q	PPT: 3.3 Kesalahan Umum dalam Prompting	DOCUMENT	\N	\N	https://docs.google.com/presentation/d/12-FjkJcj8wlF_XslyZHDO0VMMO8eKctNiaHqN80ohaY/edit?usp=sharing	\N	1	2026-05-15 05:43:29.298	2026-05-15 05:43:29.298
cmp6htl24000104l4seo9jcvj	cmp6ht9tc000304l4a0z37b5e	Section 4.1: Memahami Kerangka 4D	DOCUMENT	\N	\N	https://drive.google.com/file/d/1JCym7vC7CRtDtGRSRlJe_rFDQdqbriCJ/view?usp=sharing	\N	0	2026-05-15 05:44:59.356	2026-05-15 05:44:59.356
cmp6hu0dv000004l4nqzxvx87	cmp6ht9tc000304l4a0z37b5e	PPT: 4.1 Memahami Kerangka 4D Methodology	DOCUMENT	\N	\N	https://docs.google.com/presentation/d/1vmh5TqrDkyIPUITmYGUSEoE1oknk8Rg9oFvanuN9uD0/edit?usp=sharing	\N	1	2026-05-15 05:45:19.218	2026-05-15 05:45:19.218
cmp6hulyc000404l4mxgnd66i	cmp6hu3td000204l4q05ul13t	Section 4.2: D1 — DECONSTRUCT	DOCUMENT	\N	\N	https://drive.google.com/file/d/1rtr6Ktdx9KagSUovbx1l_u8W0_SuzAUb/view?usp=sharing	\N	0	2026-05-15 05:45:47.172	2026-05-15 05:45:47.172
cmp6hv69k000204jpznlxyuua	cmp6hu3td000204l4q05ul13t	PPT: 4.2 D1 — DECONSTRUCT Membedah Inti dari Setiap Permintaan	DOCUMENT	\N	\N	https://docs.google.com/presentation/d/1MwtBFNrKNSd8SqDOZQEqwlLNVBWef_59nm0l56H_5XM/edit?usp=sharing	\N	1	2026-05-15 05:46:13.495	2026-05-15 05:46:13.495
cmp6i3j0v000704l4mmtswi6o	cmp6i34b5000604l4gma5s67e	Section 5.1: AI untuk Penulisan dan Komunikasi Profesional	DOCUMENT	\N	\N	https://drive.google.com/file/d/1RRwN33FBPW5RblR8AV3lWWKfPu9_Ftm8/view?usp=sharing	\N	0	2026-05-15 05:52:43.279	2026-05-15 05:52:43.279
cmp6i404b000704jptmv9x14m	cmp6i34b5000604l4gma5s67e	PPT: 5.1 AI untuk Penulisan & Komunikasi Profesional	DOCUMENT	\N	\N	https://docs.google.com/presentation/d/1kKsc2kRf43oEGLk0yerOlt-XPmIOzq0w_-_FUDSFWik/edit?usp=sharing	\N	1	2026-05-15 05:53:05.435	2026-05-15 05:53:05.435
cmp6i4nwx000704l47g83bzrw	cmp6i439f000604l40vd96ltg	Section 5.2: AI untuk Analisis dan Pengambilan Keputusan	DOCUMENT	\N	\N	https://drive.google.com/file/d/1MoaVlWxeArjmm-A3bNRxlpqfFEEgmn6W/view?usp=sharing	\N	0	2026-05-15 05:53:36.273	2026-05-15 05:53:36.273
cmp6i55pg000804jpxtstc5hw	cmp6i439f000604l40vd96ltg	PPT: 5.2 AI untuk Analisis & Pengambilan Keputusan	DOCUMENT	\N	\N	https://docs.google.com/presentation/d/16YIDUZbfDMjIjH6KjBHG4bP5GprujmwdcQAGVVpsluw/edit?usp=sharing	\N	1	2026-05-15 05:53:59.332	2026-05-15 05:53:59.332
cmp6i5n1p000404l4n0ejkhtj	cmp6i58l4000304l47vti0lxm	Section 5.3: Membangun Kebiasaan Penggunaan AI yang Produktif	DOCUMENT	\N	\N	https://drive.google.com/file/d/13KyB0Ya76uxUcml0Xd44SIvDWOryZQWs/view?usp=sharing	\N	0	2026-05-15 05:54:21.805	2026-05-15 05:54:21.805
cmp6i614r000804l4052it3sl	cmp6i58l4000304l47vti0lxm	PPT: 5.3 Membangun Kebiasaan AI yang Produktif	DOCUMENT	\N	\N	https://docs.google.com/presentation/d/1Ib-CPEvW6Jl4z8yimRY9gnBBzdG081XabNDvxxFYIKA/edit?usp=sharing	\N	1	2026-05-15 05:54:40.059	2026-05-15 05:54:40.059
cmpc80kfb000004lao5wtkeih	cmpc7yktd000004l2lme7jpjp	PPT: pembukaan & rules 	DOCUMENT	\N	\N	https://docs.google.com/presentation/d/1ZEM5xOJJ5XEXcdnH_ZmHQzq8qjcB48ZOZQ4PZ3bWjjY/edit?usp=sharing	\N	0	2026-05-19 05:57:06.023	2026-05-19 05:57:06.023
cmpc81kvf000004l7a94e5otf	cmpc7yktd000004l2lme7jpjp	Link Google Form pengerjaan Pre-Test	DOCUMENT	\N	\N	https://docs.google.com/forms/d/e/1FAIpQLSd-2ZxnPRf2BKurUFitcVZiwU2kqEhQR1b4gpucqdZcuHd_ww/viewform	\N	1	2026-05-19 05:57:53.259	2026-05-19 05:58:10.319
cmpc8gp2q000004jmu8137nw1	cmp6i58l4000304l47vti0lxm	Link Google Form Post-Test	DOCUMENT	\N	\N	https://forms.gle/7y1hmbHAoZ6sQJCQ8	\N	2	2026-05-19 06:09:38.546	2026-05-19 06:09:38.546
cmp6hhw8m000004jojbatlj17	cmp6hevy5000104kzsx85zc6f	PPT: 1.3 Ekosistem AI Tools Peta Lanskap Alat AI	DOCUMENT	\N	\N	https://docs.google.com/presentation/d/1cxmiiOAISyUSZ9mSBSeOuaFbIMQT1OVYkP_GX6CwDjQ/edit?usp=drive_link	\N	1	2026-05-15 05:35:53.974	2026-05-21 07:21:38.291
cmq09cbbp000104ihskkvdrwj	cmq08teex000004l4c8t836tt	Transformasi Peran HC: Dari Administrator ke Mitra Strategis Bisnis	TEXT	## Transformasi Peran HC: Dari Administrator ke Mitra Strategis Bisnis\r\n\r\n### Pendahuluan\r\nLanskap bisnis modern yang dinamis, didorong oleh inovasi teknologi, globalisasi, dan persaingan ketat, telah mengubah ekspektasi terhadap seluruh fungsi organisasi, termasuk Human Capital (HC). Peran HC tidak lagi terbatas pada tugas-tugas administratif rutin, melainkan telah berevolusi menjadi fungsi strategis yang esensial dalam mencapai tujuan bisnis. Modul ini akan menjelaskan pergeseran peran ini, mengapa transformasi ini krusial, dan bagaimana HC dapat menjadi mitra strategis yang tak tergantikan bagi Vascomm.\r\n\r\n### Peran HC Tradisional: Fokus Administratif\r\nSecara historis, fungsi Human Capital (sebelumnya sering disebut HRD atau Personalia) sebagian besar berfokus pada tugas-tugas **administratif dan transaksional**. Peran ini bersifat reaktif dan memastikan kepatuhan terhadap peraturan serta kelancaran operasional harian.\r\n\r\n#### Karakteristik Utama HC Administratif:\r\n*   **Fokus Utama**: Penggajian, administrasi cuti, rekrutmen massal, manajemen benefit, pencatatan data karyawan, kepatuhan hukum dan peraturan ketenagakerjaan.\r\n*   **Orientasi**: Internal, menjaga stabilitas, efisiensi operasional.\r\n*   **Persepsi**: Sering dianggap sebagai **pusat biaya (cost center)**, departemen yang menangani "masalah orang".\r\n*   **Keterlibatan Bisnis**: Minimal dalam pengambilan keputusan strategis, kurang memahami konteks bisnis yang lebih luas.\r\n*   **Alat**: Sistem pencatatan manual atau sederhana.\r\n\r\n#### Contoh Aktivitas Administratif:\r\n*   Memastikan semua karyawan menerima gaji tepat waktu.\r\n*   Mengelola dokumen kontrak kerja dan surat-menyurat.\r\n*   Menyelenggarakan proses rekrutmen untuk mengisi posisi kosong tanpa analisis kebutuhan jangka panjang.\r\n*   Mengurus klaim asuransi karyawan.\r\n\r\nMeskipun tugas-tugas ini tetap penting untuk kelancaran operasional, fokus eksklusif pada administrasi tidak cukup untuk menghadapi tantangan bisnis saat ini dan tidak mampu memberikan nilai tambah strategis.\r\n\r\n### Peran HC Strategis: Mitra Bisnis\r\nPeran HC strategis menandai pergeseran fundamental dari fokus administratif menjadi **mitra bisnis (Business Partner)** yang proaktif, berorientasi masa depan, dan terintegrasi dengan strategi inti perusahaan. HC strategis memahami visi, misi, dan tujuan bisnis organisasi secara mendalam dan berupaya menyelaraskan strategi SDM untuk mencapai tujuan tersebut.\r\n\r\n#### Karakteristik Utama HC Strategis:\r\n*   **Fokus Utama**: Manajemen talenta, pengembangan kepemimpinan, perencanaan suksesi, manajemen perubahan, budaya organisasi, analitik SDM, desain organisasi, dan penyelarasan strategi SDM dengan tujuan bisnis.\r\n*   **Orientasi**: Eksternal (pasar, kompetitor) dan internal (kapabilitas organisasi), mendorong pertumbuhan dan inovasi.\r\n*   **Persepsi**: Dianggap sebagai **investasi strategis (value creator)**, kontributor langsung terhadap laba dan keberlanjutan bisnis.\r\n*   **Keterlibatan Bisnis**: Terlibat aktif dalam diskusi strategis, memberikan masukan berbasis SDM untuk keputusan bisnis.\r\n*   **Alat**: Sistem HRIS canggih, analitik data, alat penilaian talenta, platform pembelajaran digital.\r\n\r\n#### Contoh Aktivitas Strategis:\r\n*   Menganalisis kebutuhan talenta di masa depan berdasarkan roadmap produk dan ekspansi pasar Vascomm.\r\n*   Merancang program pengembangan kepemimpinan untuk mempersiapkan pemimpin masa depan Vascomm.\r\n*   Mengembangkan strategi retensi untuk talenta kunci di bidang teknologi seperti AI/ML engineers atau blockchain developers.\r\n*   Menerapkan budaya inovasi dan kolaborasi untuk mendukung kecepatan pengembangan produk.\r\n*   Menggunakan data analitik untuk mengidentifikasi faktor-faktor yang mempengaruhi produktivitas tim.\r\n\r\n### Pilar Transformasi HC Menuju Mitra Strategis di Vascomm\r\nUntuk bertransformasi menjadi mitra strategis, HC di Vascomm perlu mengembangkan kapabilitas dan pola pikir baru:\r\n\r\n1.  **Pemahaman Bisnis Mendalam (Business Acumen)**\r\n    *   Mengerti model bisnis Vascomm, target pasar, produk/layanan, teknologi inti, tren industri (misalnya, Fintech, Web3, AI), dan tantangan kompetitif.\r\n    *   Memahami bagaimana Vascomm menghasilkan pendapatan dan apa saja faktor-faktor kunci keberhasilan bisnis.\r\n    *   Mampu membaca laporan keuangan dan mengkaitkan keputusan SDM dengan dampak finansial.\r\n\r\n2.  **Analitik & Pengambilan Keputusan Berbasis Data**\r\n    *   Menggunakan data SDM (misalnya, tingkat _turnover_, produktivitas, biaya rekrutmen, efektivitas pelatihan) untuk mengidentifikasi tren, memprediksi masalah, dan membuat rekomendasi yang terukur.\r\n    *   Menerapkan **People Analytics** untuk memberikan _insight_ yang dapat ditindaklanjuti kepada manajemen.\r\n\r\n3.  **Pengembangan Kapabilitas Talenta**\r\n    *   Merancang dan mengimplementasikan strategi untuk menarik, mengembangkan, dan mempertahankan talenta yang dibutuhkan Vascomm untuk mencapai tujuan strategisnya.\r\n    *   Fokus pada identifikasi **_skill gaps_** dan pengembangan program pembelajaran yang relevan dengan teknologi dan kebutuhan bisnis masa depan.\r\n\r\n4.  **Manajemen Perubahan & Budaya Organisasi**\r\n    *   Bertindak sebagai agen perubahan yang memfasilitasi adaptasi terhadap inisiatif strategis baru dan perubahan organisasi.\r\n    *   Membentuk dan menjaga budaya organisasi yang mendukung nilai-nilai Vascomm, inovasi, kolaborasi, dan kinerja tinggi.\r\n\r\n5.  **Kemitraan & Konsultasi Strategis**\r\n    *   Berperan sebagai konsultan internal bagi para pemimpin departemen, memberikan saran dan solusi SDM yang relevan dengan tantangan spesifik mereka.\r\n    *   Membangun hubungan yang kuat dan saling percaya dengan para _stakeholder_ di seluruh organisasi.\r\n\r\n### Mengapa Peran Mitra Strategis Sangat Penting di Vascomm?\r\nDi lingkungan Vascomm yang bergerak cepat dan berfokus pada inovasi, peran HC sebagai mitra strategis menjadi sangat vital:\r\n\r\n*   **Keunggulan Kompetitif**: Dalam industri teknologi, talenta adalah aset paling berharga. HC strategis memastikan Vascomm memiliki talenta terbaik untuk berinovasi dan bersaing.\r\n*   **Adaptasi Cepat**: Industri teknologi berubah dengan sangat cepat. HC strategis membantu organisasi beradaptasi dengan perubahan teknologi, pasar, dan kebutuhan pelanggan melalui manajemen talenta dan perubahan yang efektif.\r\n*   **Pertumbuhan & Ekspansi**: Ketika Vascomm berencana untuk meluncurkan produk baru atau berekspansi ke pasar baru, HC strategis akan proaktif dalam memastikan ketersediaan talenta dan struktur organisasi yang mendukung.\r\n*   **Budaya Inovasi**: HC berperan penting dalam membentuk budaya yang mendorong eksperimen, pembelajaran, dan inovasi, yang merupakan inti dari kesuksesan Vascomm.\r\n*   **Efisiensi & Produktivitas**: Dengan menyelaraskan SDM dengan tujuan bisnis, HC strategis dapat mengoptimalkan alokasi sumber daya manusia dan meningkatkan produktivitas secara keseluruhan.\r\n\r\n### Poin-Poin Kunci\r\n\r\n*   Peran Human Capital telah mengalami transformasi signifikan dari fungsi **administratif** yang reaktif menjadi **mitra strategis** yang proaktif.\r\n*   HC strategis berfokus pada **penyelarasan strategi SDM dengan tujuan bisnis** untuk menciptakan nilai dan keunggulan kompetitif.\r\n*   Transformasi ini memerlukan **pemahaman bisnis mendalam, kemampuan analitik, pengembangan talenta, manajemen perubahan, dan keterampilan konsultatif**.\r\n*   Di Vascomm, peran HC sebagai mitra strategis sangat krusial untuk **inovasi, pertumbuhan, adaptasi cepat, dan penciptaan budaya kinerja tinggi**.\r\n*   HC bukan lagi sekadar pusat biaya, melainkan **investasi strategis** yang berkontribusi langsung pada keberhasilan bisnis.	\N	\N	20	1	2026-06-05 01:40:41.941	2026-06-05 01:52:42.556
cmpxlqul0000004l5vgyndqrx	cmp6h8oqa000004l1hmaixi2w	Section 1.1	VIDEO	\N	https://drive.google.com/file/d/1ZsI9c0zJXY2oTAeF8IbCSG_BJzh2V04o/view?usp=drive_link	\N	\N	2	2026-06-03 05:04:36.948	2026-06-03 06:22:38.395
cmpxojm87000004ik0rgo4r7a	cmp6hdgan000204js93o19rn2	Section 1.2	VIDEO	\N	https://drive.google.com/file/d/10YshewxtGLzSItVdR5jnfPTEpQ4WWWFN/view?usp=drive_link	\N	\N	2	2026-06-03 06:22:58.375	2026-06-03 06:22:58.375
cmpxojuop000104ikhp57gwdh	cmp6hevy5000104kzsx85zc6f	Section 1.3	VIDEO	\N	https://drive.google.com/file/d/16y9m6wgZNoDP_vr9k9YwVLOO5ErhYJf7/view?usp=drive_link	\N	\N	2	2026-06-03 06:23:09.337	2026-06-03 06:23:18.6
cmpxoklgv000004l1ih7o2ut8	cmp6hjvp8000504jsghjqcd1j	Section 2.1	VIDEO	\N	https://drive.google.com/file/d/1aCgz7Z-PFrTVtolsJYKZilNfDjl-EeNQ/view?usp=drive_link	\N	\N	2	2026-06-03 06:23:44.047	2026-06-03 06:23:44.047
cmpxokwo0000004lby9749w3o	cmp6hl5dn000204kzp2g6v90y	Section 2.2	VIDEO	\N	https://drive.google.com/file/d/1kn7W4bDPTFllhacgLNn3JOcPZxpVlnjh/view?usp=drive_link	\N	\N	2	2026-06-03 06:23:58.56	2026-06-03 06:23:58.56
cmpxol5he000104l1fp9whdeq	cmp6hm80f000204jokn7bh0us	Section 2.3	VIDEO	\N	https://drive.google.com/file/d/1h3s1ebrvhR1v-zWFTQn-i7NIQUj7l10K/view?usp=drive_link	\N	\N	2	2026-06-03 06:24:09.986	2026-06-03 06:24:09.986
cmpxoljnu000204l17x8pjnse	cmp6hosv8000504kzeplo6okd	Section 3.1	VIDEO	\N	https://drive.google.com/file/d/1ZW4vwUPJ6DPN_2qGMNF9uNe1jJYomdEC/view?usp=drive_link	\N	\N	2	2026-06-03 06:24:28.362	2026-06-03 06:24:28.362
cmpxolsy8000004jmgztpcm65	cmp6hpkyg000604jogh665e28	Section 3.2	VIDEO	\N	https://drive.google.com/file/d/1tUE9IojjMGdSMXVDJbNN3NXf8j7gWqd6/view?usp=drive_link	\N	\N	2	2026-06-03 06:24:40.4	2026-06-03 06:24:40.4
cmpxom39b000204iks4jkjuej	cmp6hqnle000004jp0nyagy4q	Section 3.3	VIDEO	\N	https://drive.google.com/file/d/1gPZ4aIP-LBbDORyijpS538SU5CvNqhWO/view?usp=drive_link	\N	\N	2	2026-06-03 06:24:53.759	2026-06-03 06:24:53.759
cmpxomjps000304ikj1ygml8k	cmp6ht9tc000304l4a0z37b5e	Section 4.1	VIDEO	\N	https://drive.google.com/file/d/1E6z2jJZzXQEOE5KFhVTmUVYKwkV5tmL-/view?usp=drive_link	\N	\N	2	2026-06-03 06:25:15.088	2026-06-03 06:25:15.088
cmpxomzh0000404ik7bhx6v01	cmp6hu3td000204l4q05ul13t	Section 4.2	VIDEO	\N	https://drive.google.com/file/d/1P0rTJ-qbBL4Tk_Na0w8FIElNaPEfcp5u/view?usp=sharing	\N	\N	2	2026-06-03 06:25:35.508	2026-06-03 06:25:35.508
cmpxona52000104lb6uguoh0s	cmp6hv8vy000304jp3htr3hjj	Section 4.3	VIDEO	\N	https://drive.google.com/file/d/15727DDvGVi4ka0PNdJv5ZuH0Fr5DfNOJ/view?usp=drive_link	\N	\N	2	2026-06-03 06:25:49.334	2026-06-03 06:25:49.334
cmpxonlcy000504ike800fpjf	cmp6hwdyh000504l4lus8b20u	Section 4.4	VIDEO	\N	https://drive.google.com/file/d/13MiNc7USqBIh3R0equIqrwqoNV1cXzAe/view?usp=drive_link	\N	\N	2	2026-06-03 06:26:03.874	2026-06-03 06:26:03.874
cmpxonxyr000304l151z4jla8	cmp6hxbgh000404l4env80e40	Section 4.5	VIDEO	\N	https://drive.google.com/file/d/16WAByWk_t3RqxkNssnUG_pdQHR-YV-eY/view?usp=drive_link	\N	\N	2	2026-06-03 06:26:20.211	2026-06-03 06:26:20.211
cmq09cbfq000204ihlz3ntorl	cmq08teex000004l4c8t836tt	Kondisi Eksisting HC Vascomm: Baseline, Sistem, dan Tantangan Utama	TEXT	# Kondisi Eksisting HC Vascomm: Baseline, Sistem, dan Tantangan Utama\r\n\r\nMemahami kondisi eksisting Human Capital (HC) di Vascomm adalah langkah fundamental untuk merumuskan strategi dan inisiatif pengembangan talenta yang efektif. Sesi ini akan membekali Anda dengan gambaran menyeluruh mengenai titik awal (baseline), sistem dan proses yang sedang berjalan, serta tantangan utama yang dihadapi fungsi HC Vascomm saat ini.\r\n\r\n## 1. Baseline Human Capital Vascomm\r\n\r\nBaseline HC merujuk pada potret kondisi HC Vascomm saat ini, termasuk struktur, komposisi, dan data kunci yang relevan.\r\n\r\n### 1.1. Struktur Organisasi Tim HC\r\n\r\n*   **Tim HC saat ini:** Gambaran umum mengenai jumlah personel dan pembagian peran dalam tim HC.\r\n    *   Contoh: Terdiri dari 1 Manager HC, 2 Spesialis Rekrutmen, 1 Spesialis People Operations, dan 1 Administrator HC.\r\n*   **Ruang Lingkup Fungsi:** Fungsi-fungsi utama yang menjadi tanggung jawab tim HC saat ini.\r\n    *   Contoh: Rekrutmen, Onboarding, Penggajian & Benefit, Administrasi HC, sebagian kecil Performance Management.\r\n*   **Posisi dalam Struktur Organisasi Perusahaan:** Di mana posisi HC dalam hierarki Vascomm, apakah di bawah CEO, CFO, atau lainnya.\r\n    *   Contoh: Tim HC berada di bawah Chief Operating Officer (COO) dengan fokus utama pada operasional dan kepatuhan.\r\n\r\n### 1.2. Data Karyawan Kunci\r\n\r\nData ini memberikan gambaran demografis dan kinerja awal tenaga kerja Vascomm.\r\n\r\n*   **Jumlah Karyawan:** Total karyawan aktif di Vascomm.\r\n    *   Contoh: 150 karyawan aktif.\r\n*   **Komposisi Demografis:**\r\n    *   **Usia:** Distribusi usia karyawan (misal: 60% Gen Z, 30% Milenial, 10% Gen X).\r\n    *   **Gender:** Perbandingan karyawan pria dan wanita.\r\n    *   **Pendidikan:** Tingkat pendidikan mayoritas karyawan.\r\n    *   **Masa Kerja:** Distribusi masa kerja karyawan (misal: 70% di bawah 2 tahun).\r\n*   **Tingkat Retensi & Turnover Awal:** Angka awal yang menunjukkan kemampuan Vascomm mempertahankan karyawannya.\r\n    *   Contoh: Rata-rata turnover 15% per tahun, dengan turnover tertinggi di departemen Teknologi (25%).\r\n*   **Distribusi Departemen:** Jumlah karyawan per departemen atau fungsi bisnis.\r\n    *   Contoh: Mayoritas karyawan berada di departemen Teknologi (60%), disusul oleh Pemasaran (20%), dan Operasional (20%).\r\n\r\n## 2. Sistem dan Proses HC yang Sedang Berjalan\r\n\r\nBagian ini menguraikan bagaimana fungsi HC dilaksanakan di Vascomm, dari sistem yang digunakan hingga alur prosesnya.\r\n\r\n### 2.1. Sistem Informasi Human Capital (HRIS)\r\n\r\n*   **Penggunaan HRIS:** Platform atau perangkat lunak yang digunakan untuk mengelola data dan proses HC.\r\n    *   Contoh: Menggunakan *Talenta by Mekari* untuk penggajian, cuti, dan absensi. Integrasi dengan sistem lain masih terbatas.\r\n*   **Fitur Utama yang Dimanfaatkan:** Modul HRIS yang aktif digunakan.\r\n    *   Contoh: Pengelolaan data karyawan, penggajian otomatis, pengajuan dan persetujuan cuti, rekap absensi.\r\n*   **Keterbatasan Saat Ini:** Aspek-aspek yang belum tercakup atau belum optimal dari HRIS yang ada.\r\n    *   Contoh: Belum ada modul Performance Management, Learning Management, atau Talent Acquisition yang terintegrasi. Data seringkali perlu diolah secara manual untuk laporan lanjutan.\r\n\r\n### 2.2. Proses Kunci HC\r\n\r\n*   **Rekrutmen & Akuisisi Talenta:**\r\n    *   **Sumber Kandidat:** Portal kerja online (Jobstreet, LinkedIn), *employee referral*, media sosial.\r\n    *   **Tahapan:** Screening CV, wawancara HR, wawancara user, tes teknis (jika relevan), offering.\r\n    *   **Waktu Rata-rata Rekrutmen (Time-to-Hire):** Contoh: Rata-rata 45 hari untuk posisi teknis.\r\n*   **Onboarding Karyawan Baru:**\r\n    *   **Proses:** Pengenalan perusahaan, sesi orientasi, penugasan mentor (belum konsisten), penyediaan fasilitas kerja.\r\n    *   **Materi Onboarding:** Company profile, *code of conduct*, struktur organisasi.\r\n*   **Manajemen Kinerja (Performance Management):**\r\n    *   **Sistem:** Saat ini masih berbasis manual atau ad-hoc, dengan evaluasi tahunan oleh atasan langsung. Belum ada sistem objektif berbasis KPI/OKR yang terstruktur.\r\n    *   **Feedback:** Feedback cenderung bersifat informal dan kurang terstruktur.\r\n*   **Pengembangan Karyawan (Learning & Development):**\r\n    *   **Program:** Pelatihan internal terbatas, fokus pada pelatihan teknis yang didorong oleh departemen. Belum ada program pengembangan kepemimpinan atau soft skill yang terstruktur.\r\n    *   **Jalur Karir:** Belum ada *career path* yang jelas dan terkomunikasi dengan baik kepada karyawan.\r\n*   **Kompensasi & Benefit:**\r\n    *   **Struktur Gaji:** Menggunakan skala gaji yang ditetapkan berdasarkan standar pasar dan pengalaman.\r\n    *   **Benefit:** BPJS Kesehatan & Ketenagakerjaan, tunjangan makan, transportasi, THR.\r\n    *   **Kebijakan:** Tinjauan gaji tahunan berdasarkan kinerja dan evaluasi pasar.\r\n*   **Hubungan Industrial & Karyawan:**\r\n    *   **Kebijakan:** Merujuk pada peraturan perusahaan dan UU Ketenagakerjaan.\r\n    *   **Penanganan Keluhan:** Melalui *direct manager* atau tim HC.\r\n*   **Administrasi HC:**\r\n    *   **Penggajian:** Bulanan, melalui HRIS.\r\n    *   **Cuti & Absensi:** Melalui HRIS.\r\n    *   **Kontrak Kerja:** Pengelolaan secara fisik dan digital.\r\n\r\n## 3. Tantangan Utama HC Vascomm Saat Ini\r\n\r\nMengidentifikasi tantangan adalah kunci untuk merumuskan solusi strategis. Berikut adalah beberapa tantangan utama yang dihadapi fungsi HC di Vascomm:\r\n\r\n### 3.1. Rekrutmen & Akuisisi Talenta\r\n\r\n*   **Kesulitan Mencari Talenta Spesifik:** Terutama untuk posisi teknologi tingkat lanjut (misal: Senior Developer, Data Scientist) di tengah persaingan pasar yang ketat.\r\n*   **Kecepatan Rekrutmen:** Proses rekrutmen yang terkadang lambat menyebabkan hilangnya kandidat berkualitas.\r\n*   **Branding Pemberi Kerja (Employer Branding):** Belum optimal dalam menarik perhatian talenta terbaik.\r\n\r\n### 3.2. Retensi & Engagement Karyawan\r\n\r\n*   **Tingkat Turnover:** Angka turnover yang relatif tinggi di beberapa departemen, terutama di tahun-tahun awal masa kerja.\r\n*   **Keterlibatan Karyawan (Employee Engagement):** Survei awal menunjukkan tingkat engagement yang bervariasi; beberapa karyawan merasa kurang didengar atau kurang memiliki kesempatan untuk berkembang.\r\n*   **Manajemen Ekspektasi:** Kesenjangan antara ekspektasi karyawan dan realitas perusahaan.\r\n\r\n### 3.3. Pengembangan & Peningkatan Kompetensi\r\n\r\n*   **Kesenjangan Keterampilan (Skill Gap):** Kesenjangan antara keterampilan yang dimiliki karyawan dan yang dibutuhkan oleh pertumbuhan bisnis.\r\n*   **Program L&D yang Belum Terstruktur:** Pelatihan yang bersifat ad-hoc, kurang terintegrasi dengan kebutuhan bisnis strategis.\r\n*   **Jalur Karir yang Kurang Jelas:** Kurangnya visibilitas mengenai potensi pertumbuhan dan promosi di dalam perusahaan.\r\n\r\n### 3.4. Efisiensi Proses & Digitalisasi\r\n\r\n*   **Ketergantungan Manual:** Banyak proses HC yang masih mengandalkan intervensi manual, menyebabkan inefisiensi dan potensi kesalahan.\r\n*   **Integrasi Sistem yang Kurang:** HRIS yang ada belum terintegrasi sepenuhnya dengan sistem lain (misal: Performance Management, Learning Management System), menyebabkan silo data.\r\n*   **Pengambilan Keputusan Berbasis Data:** Keterbatasan dalam mengumpulkan, menganalisis, dan memanfaatkan data HC untuk pengambilan keputusan strategis.\r\n\r\n### 3.5. Budaya Organisasi & Komunikasi\r\n\r\n*   **Konsistensi Budaya:** Tantangan dalam menjaga konsistensi budaya seiring pertumbuhan perusahaan dan masuknya karyawan baru.\r\n*   **Komunikasi Lintas Departemen:** Potensi kesenjangan komunikasi antara HC dengan departemen lain mengenai kebutuhan talenta dan pengembangan karyawan.\r\n\r\n### 3.6. Peran Strategis HC\r\n\r\n*   **Persepsi HC:** HC masih sering dipersepsikan sebagai fungsi administratif, bukan mitra strategis dalam pencapaian tujuan bisnis.\r\n*   **Keterlibatan HC dalam Strategi Bisnis:** Keterlibatan HC dalam perencanaan strategis bisnis masih terbatas.\r\n\r\n## 4. Studi Kasus Singkat: Dampak Tantangan HC\r\n\r\n**Contoh Kasus:**\r\nVascomm mengalami tingkat *turnover* sebesar 25% di tim *Frontend Developer* dalam 12 bulan terakhir. Waktu rata-rata untuk mengisi posisi ini adalah 60 hari.\r\n\r\n**Dampak:**\r\n*   **Penurunan Produktivitas:** Proyek tertunda, beban kerja tim yang tersisa meningkat.\r\n*   **Biaya Rekrutmen Tinggi:** Iklan lowongan, waktu wawancara, biaya onboarding.\r\n*   **Penurunan Moral Tim:** Beban kerja berlebih, ketidakpastian.\r\n*   **Kehilangan Pengetahuan Institusional:** Pengetahuan dan pengalaman yang dibawa oleh karyawan yang keluar hilang.\r\n*   **Penurunan Kualitas Produk/Layanan:** Karena kurangnya SDM yang memadai atau terburu-buru dalam rekrutmen.\r\n\r\nStudi kasus ini menyoroti bagaimana tantangan HC secara langsung berdampak pada kinerja operasional dan strategis Vascomm.\r\n\r\n## 5. Ringkasan & Poin-Poin Kunci\r\n\r\n*   **Baseline HC Vascomm:** Menunjukkan struktur tim HC, data demografi karyawan, dan tingkat retensi awal yang menjadi dasar pemahaman.\r\n*   **Sistem & Proses HC:** Menggambarkan bagaimana fungsi HC dioperasikan saat ini, termasuk penggunaan HRIS dan tahapan proses rekrutmen, onboarding, manajemen kinerja, L&D, kompensasi, dan administrasi.\r\n*   **Tantangan Utama:** Vascomm menghadapi tantangan signifikan dalam rekrutmen talenta spesifik, retensi dan engagement karyawan, pengembangan kompetensi, efisiensi proses digitalisasi, konsistensi budaya, dan elevasi peran strategis HC.\r\n*   **Dampak Nyata:** Tantangan HC memiliki dampak langsung dan signifikan terhadap produktivitas, biaya, dan pencapaian tujuan bisnis Vascomm.\r\n\r\nMemahami kondisi eksisting ini adalah pondasi bagi kita semua untuk bersama-sama merumuskan dan mengimplementasikan solusi yang inovatif dan strategis guna membangun Human Capital yang lebih kuat dan adaptif di Vascomm.	\N	\N	30	2	2026-06-05 01:40:42.086	2026-06-05 01:53:11.92
cmq09cbil000304ih8w5vnvte	cmq08teex000004l4c8t836tt	Studi Kasus HC: Dampak Keputusan dan Perbedaan Perspektif Tim	TEXT	## Studi Kasus HC: Dampak Keputusan dan Perbedaan Perspektif Tim\r\n\r\n### Pengantar: Mengapa Perspektif Berbeda Itu Penting?\r\n\r\nDalam organisasi dinamis seperti Vascomm, keputusan Human Capital (HC) tidak pernah berdiri sendiri. Setiap kebijakan atau program yang dirancang oleh tim HC akan memiliki riak dampak yang meluas ke seluruh departemen. Memahami dampak ini, serta menyadari adanya perbedaan perspektif antar tim, adalah kunci bagi HC untuk menjadi mitra strategis yang efektif. Studi kasus ini akan mengilustrasikan bagaimana sebuah keputusan HC dapat dilihat secara berbeda oleh berbagai departemen dan bagaimana keselarasan menjadi krusial.\r\n\r\n### Konsep Dasar: Dampak & Perspektif\r\n\r\n#### Dampak Keputusan Human Capital\r\n\r\nKeputusan HC memiliki dampak multidimensional yang memengaruhi:\r\n\r\n*   **Kinerja Bisnis:** Produktivitas, kualitas produk/layanan, inovasi.\r\n*   **Keuangan:** Biaya operasional, investasi, ROI, profitabilitas.\r\n*   **Budaya Organisasi:** Keterlibatan karyawan (*engagement*), retensi, kepuasan kerja, *employer branding*.\r\n*   **Kepatuhan & Risiko:** Regulasi ketenagakerjaan, reputasi perusahaan.\r\n*   **Strategi Jangka Panjang:** Ketersediaan talenta, suksesi kepemimpinan, kapabilitas masa depan.\r\n\r\n#### Perbedaan Perspektif Tim\r\n\r\nSetiap departemen memiliki fokus dan metrik keberhasilan yang berbeda, yang secara alami membentuk perspektif unik terhadap isu yang sama.\r\n\r\n*   **HC (Human Capital):** Fokus pada talenta, budaya, *engagement*, pengembangan, retensi, kesejahteraan karyawan.\r\n*   **Keuangan:** Fokus pada biaya, anggaran, ROI, profitabilitas, efisiensi keuangan.\r\n*   **Operasional/Teknis:** Fokus pada produktivitas, efisiensi proses, ketersediaan sumber daya, penyelesaian proyek tepat waktu.\r\n*   **Penjualan/Bisnis:** Fokus pada pendapatan, kepuasan pelanggan, pangsa pasar, daya saing.\r\n*   **Hukum/Kepatuhan:** Fokus pada risiko hukum, regulasi, etika.\r\n\r\nMemahami perbedaan ini memungkinkan HC untuk mengkomunikasikan nilai usulan mereka dengan cara yang relevan bagi setiap pemangku kepentingan.\r\n\r\n### Studi Kasus Vascomm: "Inisiatif Pengembangan Talenta 'Tech-Up' untuk Divisi Engineering"\r\n\r\n#### Latar Belakang Masalah\r\n\r\nVascomm menghadapi tantangan signifikan:\r\n\r\n1.  **Teknologi Baru:** Pasar menuntut adopsi cepat teknologi *blockchain* dan AI generatif, namun mayoritas *engineer* internal Vascomm belum memiliki keahlian mendalam di area ini.\r\n2.  **Kesenjangan Keterampilan:** Ada kesenjangan keterampilan yang melebar antara kebutuhan proyek dan kapabilitas tim *engineering* saat ini.\r\n3.  **Ancaman Retensi:** *Engineer* berbakat mulai mencari peluang di luar yang menawarkan pengembangan di teknologi mutakhir.\r\n4.  **Ketergantungan Eksternal:** Vascomm terpaksa merekrut konsultan eksternal dengan biaya tinggi untuk proyek-proyek yang membutuhkan keahlian *blockchain* atau AI.\r\n\r\n#### Usulan Tim HC: Program "Tech-Up"\r\n\r\nTim HC mengusulkan program komprehensif bernama "Tech-Up":\r\n\r\n*   **Tujuan:** Mengembangkan keahlian *blockchain* dan AI generatif di 70% *engineer* internal dalam 12 bulan.\r\n*   **Komponen:**\r\n    *   Pelatihan intensif (online & offline) dari penyedia eksternal terkemuka.\r\n    *   Sertifikasi industri yang diakui.\r\n    *   *Mentoring* internal dan proyek *proof-of-concept*.\r\n    *   Penyesuaian struktur gaji dan tunjangan bagi *engineer* yang berhasil menyelesaikan program dan menerapkan keahlian baru.\r\n*   **Estimasi Biaya:** Rp 2 Miliar untuk pelatihan dan sertifikasi, ditambah 10% kenaikan biaya gaji untuk *engineer* yang berhasil.\r\n\r\n#### Perspektif Berbagai Tim Terhadap Program "Tech-Up"\r\n\r\nBerikut adalah pandangan dari berbagai departemen terhadap usulan program "Tech-Up":\r\n\r\n##### 1. Tim Keuangan\r\n\r\n*   **Fokus:** Biaya, anggaran, ROI, arus kas.\r\n*   **Reaksi Awal:** "Rp 2 Miliar adalah investasi yang sangat besar di luar anggaran tahun ini. Bagaimana kita bisa membenarkan pengeluaran ini? Apa ROI yang jelas? Kenaikan gaji 10% juga akan membebani *fixed cost* kita."\r\n*   **Pertanyaan Kunci:** Berapa lama waktu yang dibutuhkan untuk melihat pengembalian investasi? Apakah ada opsi pelatihan yang lebih murah? Bagaimana ini akan memengaruhi profitabilitas jangka pendek?\r\n\r\n##### 2. Tim Engineering (Manajer & Karyawan)\r\n\r\n*   **Fokus:** Ketersediaan talenta, produktivitas, kualitas kode, penyelesaian proyek.\r\n*   **Reaksi Awal:** "Kami sangat membutuhkan ini! Kesenjangan *skill* membuat proyek tertunda dan membebani tim. Ini akan meningkatkan moral dan kemampuan tim kami. Namun, bagaimana dengan jadwal kerja? Apakah akan mengganggu proyek yang sedang berjalan? Siapa yang akan menggantikan *engineer* yang sedang pelatihan?"\r\n*   **Pertanyaan Kunci:** Bagaimana program ini akan diintegrasikan dengan beban kerja saat ini? Apakah ada dukungan untuk *engineer* yang sedang belajar? Apakah sertifikasi ini benar-benar relevan dengan kebutuhan proyek Vascomm?\r\n\r\n##### 3. Tim Penjualan & Bisnis\r\n\r\n*   **Fokus:** Kemampuan bersaing, penawaran produk, kepuasan klien, pendapatan.\r\n*   **Reaksi Awal:** "Ini kritis untuk masa depan Vascomm! Klien kami menuntut solusi *blockchain* dan AI. Jika kita tidak memiliki kapabilitas ini, kita akan kehilangan pasar. Program ini akan memperkuat posisi kita di pasar dan memungkinkan kita menawarkan layanan yang lebih inovatif. Kapan *engineer* baru ini siap untuk proyek klien?"\r\n*   **Pertanyaan Kunci:** Seberapa cepat kita bisa mulai menjual layanan baru ini setelah program berjalan? Apakah program ini cukup ambisius untuk mengejar pesaing?\r\n\r\n##### 4. Tim HC (Pengusul)\r\n\r\n*   **Fokus:** Pengembangan talenta, retensi, *engagement*, *employer branding*, keselarasan strategi.\r\n*   **Reaksi Awal:** "Program ini esensial untuk menjaga daya saing talenta kita dan mempertahankan *engineer* terbaik. Ini menunjukkan komitmen Vascomm terhadap pengembangan karyawan dan akan meningkatkan *employer branding* kita. Tanpa ini, kita berisiko kehilangan talenta kunci dan tertinggal dari kompetitor."\r\n*   **Pertanyaan Kunci:** Bagaimana kita bisa mengkomunikasikan nilai jangka panjang program ini kepada tim Keuangan? Bagaimana kita bisa memastikan partisipasi dan *engagement* maksimal dari *engineer*?\r\n\r\n### Analisis Dampak & Resolusi\r\n\r\n#### Potensi Dampak dari Program "Tech-Up"\r\n\r\n| Aspek Bisnis          | Dampak Positif Potensial                                  | Dampak Negatif/Risiko Potensial                           |\r\n| :-------------------- | :-------------------------------------------------------- | :-------------------------------------------------------- |\r\n| **Keuangan**          | Penghematan biaya konsultan eksternal, peningkatan pendapatan dari layanan baru, ROI jangka panjang. | Biaya investasi awal yang tinggi, potensi beban gaji jangka panjang. |\r\n| **Operasional**       | Peningkatan produktivitas, kualitas solusi, inovasi internal, pengurangan ketergantungan eksternal. | Gangguan sementara pada proyek karena waktu pelatihan, potensi kelelahan karyawan. |\r\n| **Talenta/HC**        | Peningkatan retensi, *engagement*, *skill set* karyawan, *employer branding*. | Potensi *turnover* jika karyawan merasa program tidak efektif atau tidak dihargai. |\r\n| **Strategis/Bisnis**  | Peningkatan daya saing, pembukaan pasar baru, kemampuan adaptasi teknologi. | Kegagalan program dapat merusak reputasi dan membuang investasi. |\r\n\r\n#### Strategi Penyelarasan dan Kolaborasi oleh HC\r\n\r\nUntuk mendapatkan dukungan dan memastikan keberhasilan program, tim HC perlu melakukan:\r\n\r\n1.  **Presentasi Berbasis Data:**\r\n    *   **Untuk Keuangan:** Hitung **ROI yang diproyeksikan** (misalnya, penghematan dari konsultan, potensi peningkatan pendapatan) dan bandingkan dengan biaya *turnover* jika talenta kunci pergi. Sajikan sebagai investasi strategis, bukan hanya biaya.\r\n    *   **Untuk Operasional/Engineering:** Tawarkan **solusi mitigasi** untuk gangguan kerja (misalnya, jadwal pelatihan fleksibel, *backfill* sementara, prioritas proyek). Tekankan peningkatan kualitas dan efisiensi jangka panjang.\r\n    *   **Untuk Bisnis/Penjualan:** Fokus pada **peluang pasar baru** dan peningkatan kapabilitas produk yang dapat segera ditawarkan kepada klien.\r\n\r\n2.  **Melibatkan Pemangku Kepentingan:** Bentuk gugus tugas lintas departemen untuk merancang detail program, memastikan kebutuhan semua pihak terpenuhi dan mendapatkan *buy-in*.\r\n\r\n3.  **Pengukuran & Pelaporan Progres:** Tetapkan **metrik keberhasilan** yang jelas (misalnya, jumlah sertifikasi, *skill assessment*, kontribusi pada proyek, tingkat retensi) dan laporkan progres secara berkala kepada semua pemangku kepentingan.\r\n\r\n4.  **Fleksibilitas & Iterasi:** Bersedia untuk menyesuaikan aspek program berdasarkan *feedback* dan data yang terkumpul.\r\n\r\n### Poin-Poin Kunci\r\n\r\n*   **Dampak Luas:** Setiap keputusan HC memiliki dampak finansial, operasional, dan strategis yang signifikan.\r\n*   **Perbedaan Perspektif:** Departemen yang berbeda melihat isu yang sama dari sudut pandang yang unik, dipengaruhi oleh tujuan dan metrik mereka sendiri.\r\n*   **Peran Strategis HC:** HC harus mampu "berbicara bahasa" setiap departemen, mengkomunikasikan nilai usulan mereka dalam konteks yang relevan bagi masing-masing.\r\n*   **Kolaborasi adalah Kunci:** Mendapatkan *buy-in* dan memastikan keberhasilan inisiatif HC memerlukan kolaborasi aktif dan penyelarasan dengan semua pemangku kepentingan.\r\n*   **Data & ROI:** Mendukung usulan HC dengan data konkret dan proyeksi ROI akan memperkuat argumen dan memfasilitasi pengambilan keputusan.	\N	\N	30	3	2026-06-05 01:40:42.189	2026-06-05 01:55:03.164
cmq09cb85000004ihg4qrbxlk	cmq08teex000004l4c8t836tt	Pembuka & Konteks Bisnis: Dinamika Startup vs. Perusahaan Besar dan Profil Vascomm	TEXT	## Pembuka & Konteks Bisnis: Dinamika Startup vs. Perusahaan Besar dan Profil Vascomm\r\n\r\nSelamat datang di modul "ROFIQ: Memahami Konteks Bisnis & Peran Strategis HC di Vascomm". Pelajaran ini akan menjadi fondasi penting untuk memahami bagaimana fungsi Human Capital (HC) dapat beroperasi secara strategis dan efektif di lingkungan bisnis yang dinamis. Kita akan menjelajahi perbedaan fundamental antara startup dan perusahaan besar, serta bagaimana dinamika ini membentuk profil unik Vascomm. Memahami konteks bisnis adalah langkah pertama untuk memastikan setiap inisiatif HC selaras dengan tujuan organisasi.\r\n\r\n### Dinamika Startup vs. Perusahaan Besar\r\n\r\nLingkungan bisnis sangat bervariasi, dan pemahaman tentang jenis organisasi tempat kita beroperasi sangat krusial. Dua spektrum utama yang sering dibandingkan adalah **startup** dan **perusahaan besar (established company)**. Keduanya memiliki karakteristik, tantangan, dan peluang yang berbeda, terutama dari perspektif Human Capital.\r\n\r\n#### Karakteristik Startup\r\n\r\n**Startup** adalah organisasi yang baru didirikan, biasanya berfokus pada inovasi, pertumbuhan cepat, dan seringkali beroperasi dengan sumber daya yang terbatas.\r\n\r\n*   **Agility & Inovasi Cepat:** Mampu beradaptasi dengan cepat terhadap perubahan pasar dan menghasilkan solusi inovatif tanpa banyak hambatan birokrasi.\r\n*   **Pertumbuhan Eksponensial:** Fokus utama adalah skala dan ekspansi pasar yang agresif.\r\n*   **Sumber Daya Terbatas:** Anggaran dan tim yang relatif kecil, mendorong efisiensi dan kreativitas.\r\n*   **Kultur Dinamis & Fleksibel:** Struktur datar, komunikasi terbuka, dan karyawan seringkali multi-peran.\r\n*   **Risiko Tinggi:** Tingkat kegagalan yang lebih tinggi karena model bisnis yang belum teruji sepenuhnya.\r\n*   **Fokus pada Produk/Pasar:** Energi utama dicurahkan untuk pengembangan produk dan validasi pasar.\r\n\r\n**Tantangan HC di Startup:**\r\n*   **Perekrutan Cepat & Tepat:** Menarik talenta terbaik dengan tawaran yang mungkin tidak sekompetitif perusahaan besar.\r\n*   **Retensi Talenta Kunci:** Membangun loyalitas di tengah ketidakpastian dan tawaran dari kompetitor.\r\n*   **Pengembangan Kultur:** Membentuk dan mempertahankan kultur yang kuat di tengah pertumbuhan pesat.\r\n*   **Skalabilitas Proses:** Mengembangkan proses HC yang bisa tumbuh seiring dengan organisasi.\r\n*   **Kompensasi & Benefit:** Menyesuaikan paket yang menarik namun berkelanjutan.\r\n\r\n#### Karakteristik Perusahaan Besar (Established Company)\r\n\r\n**Perusahaan besar** adalah organisasi yang sudah mapan, seringkali memiliki sejarah panjang, struktur yang kompleks, dan pangsa pasar yang signifikan.\r\n\r\n*   **Struktur & Proses Mapan:** Hierarki yang jelas, standar operasional prosedur (SOP) yang terdefinisi, dan birokrasi yang lebih kental.\r\n*   **Stabilitas & Keamanan:** Sumber daya yang lebih besar, pendapatan yang stabil, dan risiko yang lebih terukur.\r\n*   **Sumber Daya Melimpah:** Anggaran besar untuk investasi, R&D, dan pengembangan karyawan.\r\n*   **Kultur Terdefinisi:** Kultur yang seringkali sudah mengakar, kadang sulit diubah.\r\n*   **Fokus pada Efisiensi & Optimalisasi:** Meningkatkan produktivitas dan profitabilitas dari operasi yang sudah ada.\r\n*   **Reputasi & Brand Kuat:** Kepercayaan pasar dan pelanggan yang sudah terbangun.\r\n\r\n**Tantangan HC di Perusahaan Besar:**\r\n*   **Manajemen Perubahan:** Mendorong inovasi dan adaptasi di tengah resistensi terhadap perubahan.\r\n*   **Pengembangan Kepemimpinan:** Memastikan suksesi dan pengembangan pemimpin yang efektif.\r\n*   **Birokrasi & Proses:** Menavigasi proses yang kompleks dan lambat.\r\n*   **Mempertahankan Inovasi:** Mencegah stagnasi dan mendorong pemikiran baru.\r\n*   **Manajemen Kinerja:** Menerapkan sistem yang adil dan memotivasi di organisasi besar.\r\n*   **Manajemen Pensiun & Pengetahuan:** Mengelola transisi karyawan senior dan transfer pengetahuan.\r\n\r\n#### Perbandingan Kunci: Startup vs. Perusahaan Besar\r\n\r\n| Aspek              | Startup                               | Perusahaan Besar                             |\r\n| :----------------- | :------------------------------------ | :------------------------------------------- |\r\n| **Struktur**       | Datar, fleksibel                      | Hierarkis, terstruktur                       |\r\n| **Kecepatan**      | Cepat, gesit                          | Lambat, terukur                              |\r\n| **Sumber Daya**    | Terbatas, fokus efisiensi             | Melimpah, fokus optimasi                     |\r\n| **Kultur**         | Dinamis, inovatif, multi-peran        | Mapan, spesialisasi, terdefinisi             |\r\n| **Pengambilan Keputusan** | Cepat, desentralisasi                 | Terpusat, melalui banyak level               |\r\n| **Risiko**         | Tinggi, belum teruji                  | Rendah, terukur                              |\r\n| **Fokus HC**       | Perekrutan, kultur, skalabilitas      | Retensi, pengembangan, manajemen kinerja     |\r\n\r\n### Profil Vascomm: Dinamika di Lingkungan Teknologi\r\n\r\nVascomm adalah perusahaan yang beroperasi di sektor teknologi, sebuah industri yang secara inheren dinamis dan inovatif. Memahami posisi Vascomm dalam spektrum startup vs. perusahaan besar adalah kunci untuk mengidentifikasi bagaimana HC dapat paling efektif mendukung tujuannya.\r\n\r\n#### Vascomm: Identitas dan Visi\r\n\r\n*   **Siapa Kami:** Vascomm adalah [Deskripsikan jenis perusahaan Vascomm, misal: perusahaan teknologi yang berfokus pada solusi digital/pengembangan perangkat lunak/platform B2B, dll.]. Kami memiliki misi untuk [Sebutkan Misi Vascomm, misal: memberdayakan bisnis melalui teknologi inovatif dan layanan terdepan].\r\n*   **Visi:** [Sebutkan Visi Vascomm, misal: menjadi pemimpin di industri X dengan solusi yang relevan dan berdampak].\r\n*   **Nilai Inti:** [Sebutkan beberapa nilai inti Vascomm, misal: Inovasi, Kolaborasi, Integritas, Customer Focus, Growth Mindset. Ini sangat penting untuk HC].\r\n\r\n#### Sejarah Singkat dan Perkembangan\r\n\r\nVascomm dimulai sebagai [Sebutkan awal mula Vascomm, misal: sebuah startup dengan ide revolusioner di bidang Y]. Sejak didirikan pada [Tahun Pendirian], kami telah melalui fase [Sebutkan fase pertumbuhan, misal: validasi produk, ekspansi pasar, peningkatan jumlah karyawan]. Perkembangan ini menunjukkan transisi kami dari sebuah entitas rintisan yang gesit menjadi organisasi yang lebih matang dengan [Sebutkan pencapaian, misal: portofolio produk yang solid, basis pelanggan yang loyal, dan tim yang berkembang].\r\n\r\n#### Lini Bisnis dan Produk Utama\r\n\r\nVascomm menawarkan berbagai [Sebutkan jenis produk/layanan, misal: solusi perangkat lunak kustom, platform SaaS, layanan konsultasi teknologi, dll.] yang melayani [Sebutkan target pasar/industri, misal: UMKM, korporasi besar, sektor keuangan, retail]. Produk-produk kami dirancang untuk [Sebutkan tujuan utama produk, misal: meningkatkan efisiensi operasional, mendorong transformasi digital, menciptakan pengalaman pelanggan yang lebih baik].\r\n\r\n#### Kultur Kerja di Vascomm\r\n\r\nMengingat sejarah dan lingkup operasi kami, kultur Vascomm mencerminkan perpaduan antara **semangat startup** dan **kebutuhan akan struktur perusahaan yang berkembang**.\r\n*   **Aspek Startup:** Kami menghargai **inisiatif, inovasi, kolaborasi lintas fungsi, dan kecepatan dalam eksekusi**. Tim kami didorong untuk berpikir kreatif dan adaptif.\r\n*   **Aspek Perusahaan Berkembang:** Seiring pertumbuhan, kami juga mulai membangun **proses yang lebih terstruktur, standar kualitas, dan jalur karir yang jelas** untuk memastikan skalabilitas dan keberlanjutan. Kami berinvestasi dalam pengembangan profesional dan kepemimpinan.\r\n\r\n#### Tantangan & Peluang Human Capital di Vascomm\r\n\r\nMemahami konteks ini sangat krusial bagi fungsi Human Capital di Vascomm:\r\n\r\n1.  **Menyeimbangkan Inovasi dan Struktur:** Bagaimana HC dapat mempertahankan semangat inovasi dan fleksibilitas startup sambil membangun struktur dan proses yang diperlukan untuk perusahaan yang tumbuh?\r\n2.  **Perekrutan & Retensi Talenta:** Menarik dan mempertahankan talenta terbaik yang sesuai dengan kultur Vascomm, sekaligus mampu beradaptasi dengan perubahan yang cepat. Ini berarti mencari individu yang memiliki **growth mindset** dan **resiliensi**.\r\n3.  **Pengembangan Pemimpin:** Mengidentifikasi dan mengembangkan pemimpin yang dapat memimpin tim di lingkungan yang terus berkembang, yang membutuhkan kemampuan adaptasi dan visi strategis.\r\n4.  **Manajemen Perubahan:** HC harus menjadi agen perubahan yang proaktif, membantu karyawan menavigasi evolusi perusahaan dan mengadopsi cara kerja baru.\r\n5.  **Penguatan Kultur:** Memastikan nilai-nilai inti Vascomm tidak hanya tercetak di dinding, tetapi benar-benar terinternalisasi dan tercermin dalam setiap aspek operasional dan interaksi antar karyawan. Ini melibatkan program **onboarding**, **engagement**, dan **pengakuan**.\r\n\r\n### Ringkasan & Poin-Poin Kunci\r\n\r\n*   **Dinamika Organisasi:** Startup fokus pada agility, inovasi, pertumbuhan cepat, dan sumber daya terbatas, sementara perusahaan besar memiliki struktur mapan, stabilitas, sumber daya melimpah, dan fokus pada efisiensi.\r\n*   **Peran HC yang Berbeda:** Human Capital di startup berhadapan dengan tantangan perekrutan cepat, retensi, dan pembentukan kultur; sedangkan di perusahaan besar, fokusnya pada manajemen perubahan, pengembangan kepemimpinan, dan birokrasi.\r\n*   **Vascomm di Tengah Spektrum:** Vascomm adalah perusahaan teknologi yang menggabungkan semangat inovasi dan adaptasi startup dengan kebutuhan akan struktur dan proses yang lebih matang seiring pertumbuhannya.\r\n*   **Kultur Hibrida:** Kultur Vascomm menghargai inisiatif dan fleksibilitas, namun juga mulai membangun proses dan standar untuk skalabilitas.\r\n*   **HC Strategis di Vascomm:** Fungsi Human Capital di Vascomm memiliki peran strategis untuk menyeimbangkan inovasi dan struktur, menarik dan mempertahankan talenta yang tepat, mengembangkan pemimpin, mengelola perubahan, dan memperkuat kultur perusahaan.\r\n\r\nMemahami konteks bisnis ini adalah langkah fundamental bagi setiap profesional HC untuk dapat merancang dan mengimplementasikan strategi yang relevan dan berdampak bagi kesuksesan Vascomm.	\N	\N	25	0	2026-06-05 01:40:41.813	2026-06-05 01:51:53.3
cmq09wv49000604ihk2p0unx0	cmq08teex000104l4cg50y2h0	Mengidentifikasi Talenta Unggul & Menyusun Rencana Pengembangan Individu (IDP)	TEXT	## Mengidentifikasi Talenta Unggul & Menyusun Rencana Pengembangan Individu (IDP)\r\n\r\nSelamat datang di pelajaran tentang identifikasi talenta unggul dan penyusunan Rencana Pengembangan Individu (IDP). Dalam manajemen sumber daya manusia, kemampuan untuk mengenali individu dengan potensi tinggi dan mengembangkan mereka adalah kunci keberlanjutan dan keunggulan kompetitif organisasi. Pelajaran ini akan membekali Anda dengan pemahaman dan alat praktis untuk melakukan kedua hal tersebut.\r\n\r\n### 1. Mengidentifikasi Talenta Unggul\r\n\r\nIdentifikasi talenta unggul adalah proses sistematis untuk mengenali karyawan yang memiliki potensi tinggi untuk memberikan kontribusi signifikan terhadap tujuan strategis organisasi, baik saat ini maupun di masa depan. Ini bukan hanya tentang kinerja masa lalu, tetapi juga tentang kapasitas untuk tumbuh dan mengambil peran yang lebih besar.\r\n\r\n#### 1.1. Definisi Talenta Unggul\r\n\r\n**Talenta Unggul** adalah individu dalam organisasi yang secara konsisten menunjukkan kinerja yang luar biasa, memiliki potensi tinggi untuk naik ke peran kepemimpinan atau peran kritis lainnya, dan selaras dengan nilai-nilai serta budaya perusahaan. Mereka adalah *high-performers* dan *high-potentials*.\r\n\r\n#### 1.2. Kriteria Identifikasi Talenta\r\n\r\nIdentifikasi talenta biasanya didasarkan pada kombinasi beberapa kriteria:\r\n\r\n*   **Kinerja (Performance)**: Sejauh mana individu memenuhi atau melampaui ekspektasi dalam peran mereka saat ini. Ini sering diukur melalui evaluasi kinerja, pencapaian target, dan umpan balik dari atasan dan rekan kerja.\r\n*   **Potensi (Potential)**: Kapasitas individu untuk tumbuh, belajar, dan berhasil dalam peran yang lebih kompleks atau di tingkat yang lebih tinggi di masa depan. Ini mencakup kemampuan belajar, adaptabilitas, ambisi, dan keterampilan kepemimpinan yang muncul.\r\n*   **Kesesuaian Budaya (Cultural Fit)**: Sejauh mana nilai-nilai, perilaku, dan etos kerja individu selaras dengan budaya dan nilai-nilai inti organisasi. Talenta unggul tidak hanya berkinerja baik tetapi juga menjadi teladan budaya.\r\n*   **Keterampilan Kritis (Critical Skills)**: Kepemilikan keterampilan spesifik yang sangat penting untuk kesuksesan organisasi, terutama di area strategis atau inovatif.\r\n\r\n#### 1.3. Metode Identifikasi Talenta\r\n\r\nBerbagai metode dapat digunakan untuk mengidentifikasi talenta unggul:\r\n\r\n*   **Peninjauan Kinerja (Performance Reviews)**: Evaluasi formal dan terstruktur terhadap kinerja karyawan selama periode tertentu.\r\n*   **Assessment Center**: Serangkaian simulasi, latihan, dan wawancara yang dirancang untuk mengukur kompetensi dan potensi karyawan dalam berbagai skenario kerja.\r\n*   **Umpan Balik 360 Derajat (360-Degree Feedback)**: Pengumpulan umpan balik kinerja dari berbagai sumber, termasuk atasan, rekan kerja, bawahan, dan bahkan pelanggan.\r\n*   **Matriks 9 Kotak (9-Box Grid)**: Alat visual yang memplot karyawan berdasarkan dua dimensi: *kinerja* dan *potensi*. Ini adalah metode yang sangat populer dan efektif.\r\n*   **Nominasi Manajer (Manager Nomination)**: Atasan langsung menominasikan karyawan yang mereka yakini sebagai talenta unggul berdasarkan observasi dan interaksi sehari-hari.\r\n\r\n#### 1.4. Contoh Praktis: Penggunaan Matriks 9 Kotak\r\n\r\nMatriks 9 Kotak adalah alat yang ampuh untuk memvisualisasikan dan mengkategorikan talenta dalam organisasi. Sumbu X mewakili *Kinerja* (dari rendah hingga tinggi), dan Sumbu Y mewakili *Potensi* (dari rendah hingga tinggi).\r\n\r\n| Potensi Tinggi         | **Bintang** (Star)          | **High Potential**          | **Masalah Performa** (Performance Issue) |\r\n| :--------------------- | :-------------------------- | :-------------------------- | :--------------------------------------- |\r\n| **Potensi Sedang**     | **Pekerja Keras** (Core Contributor) | **Pengembang** (Developer) | **Tidak Cocok** (Misaligned)             |\r\n| **Potensi Rendah**     | **Keterampilan Khusus** (Specialist) | **Rata-rata** (Average)     | **Risiko** (Risk)                        |\r\n|                        | Kinerja Rendah              | Kinerja Sedang              | Kinerja Tinggi                           |\r\n\r\n**Interpretasi Kotak Kunci:**\r\n\r\n*   **Bintang (Star) - Kinerja Tinggi, Potensi Tinggi**: Ini adalah talenta unggul Anda. Mereka harus menjadi fokus utama untuk pengembangan kepemimpinan dan suksesi.\r\n*   **Pengembang (Developer) - Kinerja Sedang, Potensi Tinggi**: Individu ini memiliki potensi besar tetapi mungkin membutuhkan pengembangan keterampilan spesifik atau pengalaman untuk mencapai kinerja penuh.\r\n*   **Pekerja Keras (Core Contributor) - Kinerja Tinggi, Potensi Sedang**: Mereka adalah fondasi organisasi, berkinerja sangat baik dalam peran mereka saat ini, tetapi mungkin tidak memiliki ambisi atau kemampuan untuk naik ke tingkat yang lebih tinggi. Penting untuk mempertahankan mereka.\r\n\r\n### 2. Menyusun Rencana Pengembangan Individu (IDP)\r\n\r\nSetelah talenta unggul diidentifikasi, langkah selanjutnya adalah menyusun Rencana Pengembangan Individu (IDP) yang terstruktur. IDP adalah dokumen formal yang menguraikan tujuan pengembangan karier seorang karyawan dan rencana tindakan untuk mencapai tujuan tersebut.\r\n\r\n#### 2.1. Apa itu IDP?\r\n\r\n**Rencana Pengembangan Individu (IDP)** adalah dokumen yang berfokus pada tujuan pengembangan karyawan, keterampilan yang perlu ditingkatkan, dan aktivitas spesifik yang akan diambil untuk mencapai tujuan tersebut. IDP adalah alat kolaboratif antara karyawan dan manajer untuk mendorong pertumbuhan dan kemajuan karier.\r\n\r\n#### 2.2. Manfaat IDP\r\n\r\n**Bagi Individu:**\r\n*   Memberikan arah yang jelas untuk pengembangan karier.\r\n*   Meningkatkan motivasi dan keterlibatan.\r\n*   Membantu mencapai tujuan pribadi dan profesional.\r\n*   Meningkatkan keterampilan dan kompetensi.\r\n\r\n**Bagi Organisasi:**\r\n*   Memastikan ketersediaan talenta untuk peran masa depan (suksesi).\r\n*   Meningkatkan retensi karyawan kunci.\r\n*   Meningkatkan kinerja dan produktivitas karyawan.\r\n*   Menciptakan budaya pembelajaran berkelanjutan.\r\n\r\n#### 2.3. Komponen Kunci IDP\r\n\r\nIDP yang efektif biasanya mencakup elemen-elemen berikut:\r\n\r\n*   **Tujuan Pengembangan (Development Goals)**: Apa yang ingin dicapai karyawan? Harus spesifik dan terukur (SMART).\r\n*   **Kesenjangan Keterampilan (Skill Gaps)**: Keterampilan atau kompetensi apa yang perlu ditingkatkan untuk mencapai tujuan?\r\n*   **Aktivitas Pengembangan (Development Activities)**: Tindakan konkret yang akan diambil. Seringkali mengikuti model 70-20-10:\r\n    *   **70% Pembelajaran Melalui Pengalaman (On-the-Job Learning)**: Penugasan proyek baru, rotasi pekerjaan, memimpin inisiatif.\r\n    *   **20% Pembelajaran Melalui Orang Lain (Learning from Others)**: Mentoring, coaching, umpan balik, jejaring.\r\n    *   **10% Pembelajaran Formal (Formal Learning)**: Kursus pelatihan, seminar, workshop, e-learning, sertifikasi.\r\n*   **Sumber Daya (Resources)**: Dukungan yang dibutuhkan (misalnya, anggaran pelatihan, waktu luang, akses ke mentor).\r\n*   **Kerangka Waktu (Timeline)**: Kapan aktivitas akan diselesaikan dan tujuan dicapai.\r\n*   **Metrik Keberhasilan (Success Metrics)**: Bagaimana keberhasilan akan diukur?\r\n\r\n#### 2.4. Proses Penyusunan IDP\r\n\r\nPenyusunan IDP adalah proses kolaboratif yang melibatkan karyawan dan manajer:\r\n\r\n1.  **Penilaian Diri & Umpan Balik**: Karyawan melakukan refleksi diri tentang kekuatan, kelemahan, minat karier, dan aspirasi. Manajer memberikan umpan balik kinerja dan potensi berdasarkan data (misalnya, Matriks 9 Kotak).\r\n2.  **Menetapkan Tujuan SMART**: Bersama-sama, karyawan dan manajer menetapkan tujuan pengembangan yang **S**pecific, **M**easurable, **A**chievable, **R**elevant, dan **T**ime-bound.\r\n3.  **Memilih Aktivitas Pengembangan**: Mengidentifikasi aktivitas yang paling efektif untuk menutup kesenjangan keterampilan dan mencapai tujuan, dengan mempertimbangkan model 70-20-10.\r\n4.  **Menetapkan Sumber Daya & Batas Waktu**: Mengalokasikan sumber daya yang diperlukan dan menetapkan jadwal yang realistis.\r\n5.  **Meninjau & Memperbarui**: IDP bukanlah dokumen statis. Perlu ditinjau secara berkala (misalnya, setiap kuartal atau semester) untuk melacak kemajuan, membuat penyesuaian, dan menambahkan tujuan baru seiring perkembangan.\r\n\r\n#### 2.5. Contoh Praktis: Template IDP Sederhana\r\n\r\n```\r\n# Rencana Pengembangan Individu (IDP)\r\n\r\n**Nama Karyawan:** [Nama Karyawan]\r\n**Jabatan:** [Jabatan Karyawan]\r\n**Manajer:** [Nama Manajer]\r\n**Tanggal Disusun:** [DD/MM/YYYY]\r\n**Tanggal Revisi Berikutnya:** [DD/MM/YYYY]\r\n\r\n---\r\n\r\n### Tujuan Karier Jangka Panjang (3-5 Tahun)\r\n\r\n*   [Contoh: Menjadi Manajer Proyek Senior yang memimpin tim lintas fungsi.]\r\n*   [Contoh: Menjadi Ahli Subject Matter di bidang Analisis Data Lanjutan.]\r\n\r\n---\r\n\r\n### Tujuan Pengembangan Jangka Pendek (6-12 Bulan)\r\n\r\n| Tujuan SMART                                   | Kesenjangan Keterampilan           | Metrik Keberhasilan                                         |\r\n| :--------------------------------------------- | :--------------------------------- | :---------------------------------------------------------- |\r\n| **Meningkatkan keterampilan kepemimpinan tim.** | Delegasi, Coaching, Resolusi Konflik | Berhasil memimpin 1 proyek kecil dengan tim 3 orang dalam 6 bulan. |\r\n| **Menguasai penggunaan perangkat lunak X.**     | Pengetahuan & aplikasi teknis     | Mendapatkan sertifikasi Level 1 untuk perangkat lunak X dalam 4 bulan. |\r\n\r\n---\r\n\r\n### Aktivitas Pengembangan\r\n\r\n| Tujuan Terkait            | Jenis Aktivitas               | Deskripsi Aktivitas                                                                                                          | Kerangka Waktu  | Sumber Daya/Dukungan                                  | Status |\r\n| :------------------------ | :---------------------------- | :--------------------------------------------------------------------------------------------------------------------------- | :-------------- | :---------------------------------------------------- | :----- |\r\n| Keterampilan Kepemimpinan | **70% Pengalaman**            | Memimpin tim kecil dalam proyek "Optimalisasi Proses Internal".                                                              | Bulan 1-6       | Dukungan manajer, akses ke data proyek                | Dalam Proses |\r\n|                           | **20% Orang Lain**            | Mentoring dengan [Nama Mentor], pertemuan mingguan untuk diskusi studi kasus kepemimpinan.                                   | Bulan 1-6       | Waktu mentor, jadwal fleksibel                        | Dalam Proses |\r\n|                           | **10% Formal**                | Mengikuti kursus "Kepemimpinan Efektif untuk Manajer" di platform e-learning [Nama Platform].                                | Bulan 1-3       | Biaya kursus, 2 jam/minggu waktu kerja untuk belajar | Selesai |\r\n| Penguasaan Perangkat Lunak | **70% Pengalaman**            | Menerapkan perangkat lunak X untuk menganalisis data penjualan bulanan.                                                      | Bulan 1-4       | Akses ke software X, data riil                        | Dalam Proses |\r\n|                           | **20% Orang Lain**            | Berkolaborasi dengan [Nama Rekan Kerja Ahli] untuk memecahkan masalah kompleks menggunakan software X.                       | Bulan 2-4       | Sesi mingguan dengan rekan kerja                      | Dalam Proses |\r\n|                           | **10% Formal**                | Mengikuti pelatihan online "Dasar-dasar Software X" dan mempersiapkan ujian sertifikasi.                                     | Bulan 1-3       | Biaya pelatihan & ujian, 3 jam/minggu waktu belajar  | Selesai |\r\n\r\n---\r\n\r\n### Catatan & Komentar (Manajer/Karyawan)\r\n\r\n*   [Contoh: Karyawan menunjukkan inisiatif tinggi dalam mencari peluang proyek. Perlu memastikan beban kerja tetap seimbang.]\r\n*   [Contoh: Manajer akan memberikan umpan balik rutin setiap dua minggu dan menyediakan sumber daya yang diperlukan.]\r\n```\r\n\r\n### Ringkasan & Poin-Poin Kunci\r\n\r\n*   **Identifikasi Talenta Unggul** adalah proses krusial untuk menemukan *high-performers* dan *high-potentials* yang akan mendorong organisasi maju.\r\n*   Kriteria utama identifikasi meliputi **Kinerja**, **Potensi**, **Kesesuaian Budaya**, dan **Keterampilan Kritis**.\r\n*   **Matriks 9 Kotak** adalah alat visual yang sangat efektif untuk mengkategorikan karyawan berdasarkan kinerja dan potensi.\r\n*   **Rencana Pengembangan Individu (IDP)** adalah dokumen strategis yang menguraikan tujuan pengembangan karier karyawan dan langkah-langkah konkret untuk mencapainya.\r\n*   IDP bermanfaat bagi individu (motivasi, pertumbuhan) dan organisasi (suksesi, retensi, kinerja).\r\n*   Komponen kunci IDP meliputi tujuan **SMART**, identifikasi kesenjangan keterampilan, **aktivitas pengembangan (model 70-20-10)**, sumber daya, kerangka waktu, dan metrik keberhasilan.\r\n*   Penyusunan IDP adalah proses **kolaboratif** yang membutuhkan tinjauan dan pembaruan berkala.	\N	\N	45	1	2026-06-05 01:56:40.713	2026-06-08 07:30:46.823
cmq09cbll000404ih7sk0ac6n	cmq08teex000004l4c8t836tt	Refleksi dan Rencana Aksi: Membangun HC Strategis di Vascomm	TEXT	## Refleksi dan Rencana Aksi: Membangun HC Strategis di Vascomm\r\n\r\nPelajaran ini merupakan kelanjutan dari sesi "ROFIQ: Memahami Konteks Bisnis & Peran Strategis HC di Vascomm". Setelah memahami konteks bisnis Vascomm dan peran strategis Human Capital (HC) secara komprehensif, saatnya kita merefleksikan pembelajaran tersebut dan merumuskan rencana aksi konkret untuk membangun HC yang benar-benar strategis di Vascomm.\r\n\r\n### Refleksi: Mengapa HC Strategis Krusial bagi Vascomm?\r\n\r\nSesi ROFIQ telah menggarisbawahi bahwa Vascomm beroperasi di lingkungan yang dinamis, kompetitif, dan menuntut inovasi berkelanjutan. Dalam konteks ini, **HC strategis** bukan lagi sekadar fungsi administratif, melainkan mitra bisnis esensial yang secara langsung berkontribusi pada pencapaian tujuan organisasi.\r\n\r\n*   **Koneksi Bisnis-HC:** Tanpa HC strategis, Vascomm akan kesulitan menarik, mengembangkan, dan mempertahankan talenta yang dibutuhkan untuk berinovasi, memperluas pasar, dan menjaga keunggulan kompetitif.\r\n*   **Dampak pada Kinerja:** Keputusan HC yang selaras dengan strategi bisnis (misalnya, program pelatihan yang mendukung pengembangan produk baru, sistem insentif yang mendorong penjualan) secara langsung meningkatkan kinerja individu, tim, dan pada akhirnya, organisasi.\r\n*   **Antisipasi Perubahan:** HC strategis memungkinkan Vascomm untuk proaktif mengidentifikasi kebutuhan talenta masa depan, merencanakan suksesi kepemimpinan, dan membangun kapabilitas organisasi yang adaptif terhadap perubahan teknologi dan pasar.\r\n\r\n**Contoh Konkret di Vascomm:**\r\nKetika Vascomm berencana meluncurkan produk fintech baru yang inovatif, peran HC strategis adalah:\r\n1.  **Mengidentifikasi Kebutuhan Skill:** Menentukan keahlian teknis (misalnya, blockchain developer, data scientist) dan soft skill (misalnya, design thinking, agile leadership) yang dibutuhkan.\r\n2.  **Strategi Akuisisi Talenta:** Merancang kampanye rekrutmen yang menarik untuk talenta spesialis di bidang fintech.\r\n3.  **Pengembangan Kapabilitas:** Menyediakan program pelatihan atau *upskilling* bagi karyawan internal untuk mengisi kesenjangan keahlian.\r\n4.  **Budaya Inovasi:** Membangun lingkungan kerja yang mendukung eksperimen, kolaborasi lintas fungsi, dan pengambilan risiko yang terukur.\r\n\r\n### Pilar-Pilar Membangun HC Strategis di Vascomm\r\n\r\nUntuk mewujudkan HC strategis, ada beberapa pilar utama yang perlu dibangun dan diperkuat di Vascomm:\r\n\r\n#### 1. Integrasi Strategi Bisnis & HC\r\n\r\n**Konsep:** Memastikan bahwa setiap inisiatif HC dirancang untuk mendukung dan mempercepat pencapaian tujuan bisnis Vascomm. HC harus duduk di meja yang sama dengan pemimpin bisnis lainnya saat merumuskan strategi perusahaan.\r\n\r\n**Contoh Praktis di Vascomm:**\r\n*   **Perencanaan Tenaga Kerja Strategis:** HC bekerja sama dengan tim Sales & Marketing untuk memproyeksikan kebutuhan *sales representative* baru berdasarkan target ekspansi pasar di tahun depan, termasuk skill bahasa atau regional yang spesifik.\r\n*   **Desain Organisasi:** HC berkolaborasi dengan CTO untuk merancang struktur tim pengembangan produk yang *agile* dan responsif terhadap *feedback* pelanggan.\r\n\r\n#### 2. Pengelolaan Talenta End-to-End\r\n\r\n**Konsep:** Mengelola siklus hidup karyawan secara holistik, mulai dari akuisisi hingga pengembangan dan retensi, dengan fokus pada *value proposition* karyawan dan *employee experience*.\r\n\r\n**Contoh Praktis di Vascomm:**\r\n*   **Employer Branding & Akuisisi:** Mengembangkan narasi Vascomm sebagai tempat kerja inovatif dan berorientasi masa depan untuk menarik talenta teknologi terbaik melalui platform digital dan *event* kampus.\r\n*   **Pengembangan & Pembelajaran:** Menerapkan **program mentoring lintas departemen** untuk karyawan baru atau program *upskilling* dalam *cloud computing* untuk tim IT.\r\n*   **Manajemen Kinerja:** Menerapkan sistem penilaian kinerja berbasis OKR (Objectives and Key Results) yang selaras dengan tujuan bisnis perusahaan, bukan hanya *checklist* rutin.\r\n*   **Retensi & Suksesi:** Mengidentifikasi **talenta kunci** di setiap departemen dan menyusun rencana pengembangan karir individual (*Individual Development Plan*) serta rencana suksesi untuk posisi-posisi kritikal.\r\n\r\n#### 3. Budaya & Engagement yang Berdaya Saing\r\n\r\n**Konsep:** Membangun dan memelihara budaya organisasi yang kuat, positif, dan selaras dengan nilai-nilai Vascomm, yang mendorong keterlibatan, produktivitas, dan inovasi karyawan.\r\n\r\n**Contoh Praktis di Vascomm:**\r\n*   **Nilai-nilai Perusahaan:** Menginternalisasi nilai-nilai Vascomm (misalnya, "Innovation First", "Customer Centric", "Collaboration") melalui komunikasi rutin, program *recognition*, dan dijadikan bagian dari kriteria penilaian kinerja.\r\n*   **Program Kesejahteraan Karyawan:** Menyelenggarakan *webinar* kesehatan mental, sesi *yoga online*, atau *flexi-work arrangement* untuk mendukung *work-life balance* dan mengurangi *burnout*.\r\n*   **Engagement Survey:** Melakukan survei kepuasan karyawan secara berkala dan menindaklanjuti hasilnya dengan rencana aksi konkret yang dikomunikasikan secara transparan.\r\n\r\n#### 4. Analitik HC untuk Pengambilan Keputusan\r\n\r\n**Konsep:** Menggunakan data dan metrik HC untuk mendapatkan *insight* yang dapat ditindaklanjuti, mendukung pengambilan keputusan berbasis bukti, dan menunjukkan ROI (Return on Investment) dari inisiatif HC.\r\n\r\n**Contoh Praktis di Vascomm:**\r\n*   **Analisis Turnover:** Mengidentifikasi pola *turnover* karyawan (misalnya, departemen mana yang memiliki *turnover* tinggi, alasan utama karyawan keluar) untuk merancang strategi retensi yang lebih tepat sasaran.\r\n*   **Efektivitas Pelatihan:** Mengukur dampak program pelatihan terhadap peningkatan kinerja atau pencapaian target bisnis, bukan hanya jumlah peserta atau jam pelatihan.\r\n*   **Diversity & Inclusion Metrics:** Melacak keberagaman dalam rekrutmen dan promosi untuk memastikan lingkungan kerja yang inklusif dan adil.\r\n\r\n### Rencana Aksi: Langkah Konkret untuk Vascomm\r\n\r\nSetelah merefleksikan pentingnya HC strategis dan pilar-pilarnya, langkah selanjutnya adalah merumuskan rencana aksi yang spesifik dan terukur untuk Vascomm.\r\n\r\n#### Identifikasi Area Prioritas\r\n\r\nTim HC Vascomm perlu berdiskusi dengan *stakeholder* bisnis (CEO, CTO, CMO, dll.) untuk mengidentifikasi 2-3 area prioritas utama yang memiliki dampak terbesar pada strategi bisnis perusahaan dalam 6-12 bulan ke depan.\r\n\r\n**Contoh:**\r\n*   **Prioritas 1:** Meningkatkan retensi talenta kunci di tim Teknologi sebesar X% dalam 6 bulan.\r\n*   **Prioritas 2:** Membangun *talent pipeline* untuk posisi *middle management* di departemen Sales dalam 12 bulan.\r\n*   **Prioritas 3:** Mengimplementasikan sistem manajemen kinerja berbasis OKR di seluruh organisasi dalam 9 bulan.\r\n\r\n#### Kerangka Perencanaan Aksi (SMART Goals)\r\n\r\nGunakan kerangka **SMART** (Specific, Measurable, Achievable, Relevant, Time-bound) untuk setiap rencana aksi.\r\n\r\n```\r\n[Nama Rencana Aksi]\r\n\r\n**Tujuan SMART:**\r\n*   **Specific (Spesifik):** Apa yang ingin dicapai secara jelas?\r\n*   **Measurable (Terukur):** Bagaimana kita akan mengukur keberhasilannya?\r\n*   **Achievable (Dapat Dicapai):** Apakah tujuan ini realistis dengan sumber daya yang ada?\r\n*   **Relevant (Relevan):** Apakah ini selaras dengan tujuan bisnis Vascomm?\r\n*   **Time-bound (Berbatas Waktu):** Kapan tujuan ini akan dicapai?\r\n\r\n**Langkah-langkah Aksi:**\r\n1.  [Aktivitas 1]: Deskripsi singkat.\r\n    *   Penanggung Jawab: [Nama/Jabatan]\r\n    *   Target Waktu: [Tanggal]\r\n2.  [Aktivitas 2]: Deskripsi singkat.\r\n    *   Penanggung Jawab: [Nama/Jabatan]\r\n    *   Target Waktu: [Tanggal]\r\n3.  ...\r\n\r\n**Sumber Daya yang Dibutuhkan:**\r\n*   [Contoh: Budget, Tools, Dukungan Eksekutif]\r\n\r\n**Metrik Keberhasilan:**\r\n*   [Contoh: Tingkat retensi, Jumlah kandidat internal yang siap promosi, Tingkat adopsi OKR]\r\n\r\n**Potensi Tantangan & Mitigasi:**\r\n*   [Contoh: Resistensi perubahan, Keterbatasan budget]\r\n```\r\n\r\n#### Contoh Skenario Rencana Aksi\r\n\r\n**Skenario: Meningkatkan Retensi Talenta Kunci di Tim Teknologi**\r\n\r\n*   **Tujuan SMART:** Meningkatkan tingkat retensi talenta kunci di tim Teknologi dari 80% menjadi 90% pada akhir Q4 tahun ini, dengan fokus pada *developer* senior dan *tech lead*.\r\n\r\n*   **Langkah-langkah Aksi:**\r\n    1.  **Analisis Exit Interview & Survei Engagement:** Kumpulkan data dari *exit interview* 6 bulan terakhir dan lakukan survei *engagement* khusus untuk tim Teknologi untuk mengidentifikasi akar masalah *turnover*.\r\n        *   Penanggung Jawab: HC Business Partner (HCBP) Tech\r\n        *   Target Waktu: Akhir bulan depan\r\n    2.  **Kembangkan Program Mentoring & Coaching:** Pasangkan talenta kunci dengan *mentor* eksternal atau internal yang berpengalaman untuk pengembangan karir dan skill.\r\n        *   Penanggung Jawab: HCBP Tech, Lead Developer\r\n        *   Target Waktu: Mulai bulan depan, berjalan 3 bulan\r\n    3.  **Review & Sesuaikan Kompensasi & Benefit:** Lakukan *benchmarking* gaji dan *benefit* untuk posisi teknologi kunci di pasar, dan ajukan penyesuaian jika diperlukan.\r\n        *   Penanggung Jawab: HC Reward & Recognition Specialist, CFO\r\n        *   Target Waktu: Akhir Q3\r\n    4.  **Inisiatif Keseimbangan Kerja-Hidup:** Perkenalkan kebijakan *flexi-time* atau *work-from-home* terbatas untuk tim Teknologi.\r\n        *   Penanggung Jawab: HCBP Tech, CTO\r\n        *   Target Waktu: Mulai bulan depan\r\n\r\n*   **Sumber Daya yang Dibutuhkan:** Budget untuk *benchmarking* data, *software* survei, waktu *mentor*, dukungan dari CTO.\r\n\r\n*   **Metrik Keberhasilan:** Tingkat *turnover* talenta kunci di tim Teknologi, skor *engagement* tim Teknologi, jumlah talenta kunci yang berpartisipasi dalam program mentoring.\r\n\r\n### Ringkasan dan Poin Kunci\r\n\r\n*   **HC Strategis** adalah pondasi pertumbuhan dan keberlanjutan Vascomm di pasar yang kompetitif.\r\n*   Integrasi erat antara **Strategi Bisnis & HC** adalah kunci.\r\n*   Pilar-pilar penting meliputi **Pengelolaan Talenta End-to-End**, **Budaya & Engagement**, dan **Analitik HC**.\r\n*   **Rencana Aksi** harus **SMART** (Specific, Measurable, Achievable, Relevant, Time-bound) dan berfokus pada area prioritas yang paling berdampak pada bisnis Vascomm.\r\n*   Implementasi membutuhkan **kolaborasi lintas fungsi** dan **dukungan kepemimpinan**.\r\n\r\nMari bersama-sama membangun Human Capital yang strategis dan berdaya saing tinggi di Vascomm!	\N	\N	20	4	2026-06-05 01:40:42.297	2026-06-05 01:55:34.094
cmq09wvam000804ihkos15mf1	cmq08teex000104l4cg50y2h0	Workshop: Menyusun Draft Manpower Plan & Analisis Dampak Rekrutmen	DOCUMENT	\N	\N	https://docs.google.com/document/d/19mNjZkpwPVhIhnB66_nL8y7Ba_QHxLcJp-vzZqO4j8o/edit?usp=sharing	240	3	2026-06-05 01:56:40.942	2026-06-08 07:58:35.324
cmq09wuvp000504ih9dwgo91m	cmq08teex000104l4cg50y2h0	Perencanaan Kebutuhan SDM Strategis: Metodologi & Analisis Kesenjangan	TEXT	## Perencanaan Kebutuhan SDM Strategis: Metode & Cari Beda\r\n\r\n### 1. Apa Itu Rencana SDM Strategis?\r\n\r\n*   **SDM Perlu Rencana**: Pastikan orang tepat, tempat tepat, waktu tepat.\r\n*   **Tujuan**: Dukung bisnis tujuan besar. Bisnis maju, SDM ikut maju.\r\n*   **Fokus**: Lihat depan. Bukan cuma sekarang.\r\n\r\n### 2. Cara Kerja Rencana SDM\r\n\r\n*   **Langkah Rencana**:\r\n    1.  **Pahami Bisnis Tujuan**: Bisnis mau ke mana? Apa butuh?\r\n    2.  **Ramal Butuh Orang**: Berapa orang perlu? Skill apa perlu?\r\n    3.  **Ramal Ada Orang**: Berapa orang kita punya? Skill apa mereka punya?\r\n    4.  **Cari Beda (Kesenjangan)**: Bandingkan butuh dengan ada. Lebih? Kurang?\r\n    5.  **Buat Rencana Aksi**: Isi kurang, kelola lebih.\r\n\r\n### 3. Ramal Butuh Orang: Teknik\r\n\r\n*   **Ramal Kualitatif (Pendapat)**:\r\n    *   **Delphi**: Ahli kasih pendapat. Rahasia. Lalu gabung.\r\n    *   **Wawancara Manajer**: Tanya bos. Mereka tahu tim butuh apa.\r\n    *   **Group Nominal**: Kumpul ide, lalu voting.\r\n*   **Ramal Kuantitatif (Angka)**:\r\n    *   **Tren Analisis**: Lihat dulu. Dulu berapa orang? Sekarang berapa? Besok mungkin berapa?\r\n        *   Contoh: Tiap penjualan naik 10%, butuh 2 sales baru.\r\n    *   **Rasio Analisis**: Satu hal banding hal lain.\r\n        *   Contoh: 1 manajer untuk 10 pekerja. Produksi naik, manajer perlu naik.\r\n    *   **Regresi Analisis**: Hubungkan banyak data. Lebih rumit, lebih akurat.\r\n        *   Rumus umum:\r\n            ```\r\n            Y = a + bX\r\n            ```\r\n            `Y`: SDM butuh. `X`: Penjualan, Produksi, lain-lain.\r\n\r\n### 4. Analisis Kesenjangan SDM: Cari Beda\r\n\r\n*   **Apa Itu Beda**: Beda antara SDM **Butuh** dan SDM **Ada**.\r\n*   **Mengapa Penting**: Tahu di mana kurang, di mana lebih. Bisa buat keputusan.\r\n*   **Langkah Cari Beda**:\r\n    1.  **Tentukan Orang Butuh**: Dari ramalan.\r\n    2.  **Tentukan Orang Ada**: Dari data karyawan.\r\n    3.  **Hitung Beda Angka**: Kurang atau lebih?\r\n    4.  **Tentukan Beda Jenis**: Skill beda? Jumlah beda?\r\n*   **Contoh Cari Beda**:\r\n\r\n    | Jabatan       | SDM Butuh (Ramal) | SDM Ada (Sekarang) | Kesenjangan | Aksi Perlu    |\r\n    | :------------ | :---------------- | :----------------- | :---------- | :------------ |\r\n    | Desainer Grafis | 5                 | 3                  | -2          | Rekrut 2      |\r\n    | Akuntan       | 4                 | 5                  | +1          | Transfer/PHK  |\r\n    | Marketing     | 7                 | 7                  | 0           | Tidak ada aksi |\r\n\r\n### 5. Strategi Atasi Beda\r\n\r\n*   **Jika SDM Kurang (Defisit)**:\r\n    *   **Rekrut**: Cari orang baru.\r\n    *   **Pelatihan & Pengembangan**: Ajari orang sekarang skill baru.\r\n    *   **Promosi/Transfer**: Pindah orang dalam.\r\n    *   **Outsourcing**: Minta pihak luar kerja.\r\n    *   **Flextime/Part-time**: Jam kerja beda.\r\n*   **Jika SDM Lebih (Surplus)**:\r\n    *   **Pensiun Dini**: Tawarkan pensiun lebih awal.\r\n    *   **PHK**: Pecat. Sulit, kadang perlu.\r\n    *   **Transfer**: Pindah ke bagian lain butuh.\r\n    *   **Kurangi Jam Kerja**: Kerja sedikit, gaji sedikit.\r\n    *   **Bekukan Rekrutmen**: Jangan rekrut baru.\r\n\r\n### 6. Poin Penting\r\n\r\n*   **Rencana SDM Strategis**: Pastikan SDM tepat dukung tujuan bisnis.\r\n*   **Metode Ramal**: Pakai kualitatif, kuantitatif. Lihat masa depan.\r\n*   **Analisis Kesenjangan**: Bandingkan butuh dengan ada. Cari beda.\r\n*   **Aksi Nyata**: Isi kurang, kelola lebih.	\N	\N	30	0	2026-06-05 01:56:40.405	2026-06-08 07:30:25.994
cmq09wven000904ih4z4y0i43	cmq08teex000104l4cg50y2h0	Simulasi Presentasi Rencana Tenaga Kerja & Rencana Aksi	TEXT	# Simulasi Presentasi Rencana Tenaga Kerja & Rencana Aksi\r\n\r\n## Konsep Penting\r\n\r\n### Rencana Tenaga Kerja\r\nApa? Kebutuhan orang. Kebutuhan skill. Masa depan lihat. Organisasi tujuan capai.\r\nMengapa? Pastikan orang tepat. Skill tepat. Waktu tepat. Bisnis jalan baik.\r\n\r\n### Rencana Aksi\r\nApa? Langkah konkret. Rencana Tenaga Kerja wujud. Rekrut. Latih. Tahan orang.\r\nMengapa? Rencana Tenaga Kerja bukan kertas mati. Hidup jadi.\r\n\r\n### Presentasi Simulasi\r\nApa? Latih bicara. Rencana Tenaga Kerja, Rencana Aksi sampaikan. Audiens beda-beda.\r\nMengapa? Dapat saran. Bicara lebih baik. Yakin diri.\r\n\r\n## Bagian Penting Presentasi\r\n\r\nPresentasi kuat. Bagian ini harus ada.\r\n\r\n### Pendahuluan\r\n*   **Konteks**: Situasi sekarang. Mengapa rencana ini penting.\r\n*   **Tujuan**: Apa presentasi ingin capai. Apa audiens harus tahu/lakukan.\r\n\r\n### Analisis Situasi\r\n*   **Tenaga Kerja Sekarang**: Jumlah. Skill. Demografi.\r\n*   **Kebutuhan Masa Depan**: Bisnis strategi lihat. Perlu orang berapa. Skill apa.\r\n*   **Celah**: Sekarang vs. Masa depan. Apa kurang.\r\n*   **Data Tunjuk**: Angka. Grafik. Mudah lihat.\r\n\r\n### Rencana Tenaga Kerja\r\n*   **Proyeksi Kebutuhan**: Jumlah orang per departemen/fungsi. Skill spesifik.\r\n*   **Timeline**: Kapan orang perlu.\r\n*   **Sumber**: Orang dari mana. Internal? Eksternal?\r\n\r\n### Rencana Aksi\r\n*   **Perekrutan**: Bagaimana tarik talenta. Sumber mana.\r\n*   **Pengembangan Talenta**: Latih. Skill tingkat. Program apa.\r\n*   **Retensi**: Bagaimana orang baik tetap tinggal.\r\n*   **Suksesi**: Siapa ganti posisi kunci. Rencana siap.\r\n*   **Implementasi**: Siapa kerja apa. Kapan selesai.\r\n\r\n### Metrik & Pengukuran\r\n*   **Indikator Kinerja Utama (KPI)**: Bagaimana tahu sukses. Contoh: Waktu isi posisi, Tingkat retensi, Skill gap tutup.\r\n*   **Pelaporan**: Kapan lapor. Kepada siapa.\r\n\r\n### Risiko & Mitigasi\r\n*   **Risiko Identifikasi**: Apa buruk bisa terjadi. Contoh: Sulit cari talenta. Biaya tinggi.\r\n*   **Strategi Mitigasi**: Bagaimana cegah. Bagaimana atasi.\r\n\r\n### Kesimpulan & Rekomendasi\r\n*   **Poin Utama**: Ingat lagi apa penting.\r\n*   **Ajakan Bertindak**: Apa audiens harus lakukan. Keputusan apa perlu.\r\n\r\n## Tips Presentasi Efektif\r\n\r\nBicara baik. Pesan sampai.\r\n\r\n*   **Struktur Logis**: Alur cerita jelas. Dari masalah ke solusi.\r\n*   **Visualisasi Data**: Grafik. Diagram. Bukan teks banyak. Audiens mudah tangkap.\r\n*   **Narasi Kuat**: Cerita mengapa ini penting. Mengapa audiens harus peduli.\r\n*   **Interaksi Audiens**: Tanya. Jawab. Libatkan mereka.\r\n*   **Manajemen Waktu**: Sesuai waktu. Jangan lewat. Jangan terlalu cepat.\r\n*   **Bahasa Tubuh & Vokal**: Tegap. Mata lihat audiens. Bicara jelas. Suara variasi.\r\n\r\n## Skenario Praktis: Presentasi Rencana Tenaga Kerja Startup\r\n\r\n### Situasi\r\nPerusahaan: "Inovasi Maju". Startup teknologi. Tumbuh sangat cepat.\r\nMasalah: Tim kecil. Perlu banyak **insinyur perangkat lunak** (software engineers), **ilmuwan data** (data scientists) baru 12 bulan depan. Skill tim sekarang ada celah. Tidak cukup cepat isi posisi.\r\n\r\n### Tugas\r\nSiapkan presentasi. Sampaikan Rencana Tenaga Kerja & Rencana Aksi 12 bulan ke depan. Untuk **Dewan Direksi** (Board of Directors). Mereka ingin lihat:\r\n1.  Berapa orang perlu. Skill apa.\r\n2.  Bagaimana perusahaan akan dapat orang itu.\r\n3.  Bagaimana tahu rencana ini berhasil.\r\n\r\n### Contoh Struktur Presentasi (Terse)\r\n#### Slide 1: Judul\r\n*   Rencana Tenaga Kerja & Aksi: Inovasi Maju 2024\r\n*   [Nama Anda]\r\n\r\n#### Slide 2: Latar Belakang & Tujuan\r\n*   **Inovasi Maju**: Tumbuh 150% setahun. Produk baru perlu.\r\n*   **Tujuan**: Pastikan talenta cukup. Dukung pertumbuhan.\r\n*   **Audiens**: Dewan Direksi.\r\n\r\n#### Slide 3: Analisis Situasi Sekarang\r\n*   **Tim Sekarang**: 50 insinyur, 10 ilmuwan data.\r\n*   **Skill Gap**: AI/ML, Cloud Native, Cybersecurity. Gap besar.\r\n*   **Data**: Turnover insinyur 15%. Waktu rekrut 90 hari.\r\n\r\n#### Slide 4: Proyeksi Kebutuhan Tenaga Kerja\r\n*   **12 Bulan Depan**: Perlu +70 insinyur (total 120). +20 ilmuwan data (total 30).\r\n*   **Skill Fokus**: 40% AI/ML, 30% Cloud, 30% Lain.\r\n*   **Peta Kebutuhan**: Grafik departemen.\r\n\r\n#### Slide 5: Rencana Aksi: Perekrutan\r\n*   **Sumber**: 60% Eksternal (kampus, job fair, headhunter). 40% Internal (promosi, transfer).\r\n*   **Strategi**: Employer branding kuat. Program referral.\r\n*   **Target**: Isi 10 posisi/bulan.\r\n\r\n#### Slide 6: Rencana Aksi: Pengembangan Talenta\r\n*   **Program**: Pelatihan AI/ML, Cloud. Sertifikasi.\r\n*   **Mentor**: Program mentor senior-junior.\r\n*   **Budget**: Rp 500 juta pelatihan.\r\n\r\n#### Slide 7: Rencana Aksi: Retensi & Suksesi\r\n*   **Retensi**: Gaji kompetitif. Jenjang karir jelas. Budaya kerja baik.\r\n*   **Suksesi**: Identifikasi 5 posisi kunci. Siapkan pengganti.\r\n\r\n#### Slide 8: Metrik Keberhasilan\r\n*   **KPI**: Waktu isi posisi (<60 hari). Tingkat retensi (>90%). Skill gap tutup (80%).\r\n*   **Laporan**: Bulanan ke CEO. Triwulanan ke Dewan.\r\n\r\n#### Slide 9: Risiko & Mitigasi\r\n*   **Risiko**: Sulit cari talenta. Biaya tinggi.\r\n*   **Mitigasi**: Jaringan luas. Fleksibel gaji. Outsourcing parsial.\r\n\r\n#### Slide 10: Kesimpulan & Rekomendasi\r\n*   **Inti**: Rencana ini penting. Dukung pertumbuhan.\r\n*   **Ajakan**: Setuju budget Rp 2 miliar. Dukungan Dewan.\r\n\r\n## Ringkasan Poin Kunci\r\n\r\n*   **Rencana Tenaga Kerja**: Orang perlu, skill perlu. Masa depan lihat.\r\n*   **Rencana Aksi**: Bagaimana dapat orang, bagaimana kembangkan.\r\n*   **Presentasi Simulasi**: Latih bicara, dapat saran.\r\n*   **Isi Penting**: Pendahuluan, Analisis, Rencana Tenaga Kerja, Rencana Aksi, Metrik, Risiko, Kesimpulan.\r\n*   **Tips Bicara**: Struktur baik, visualisasi, cerita kuat, interaksi, waktu, bahasa tubuh.	\N	\N	60	4	2026-06-05 01:56:41.087	2026-06-08 08:01:27.857
cmq09wv7v000704ih9yy6jbvt	cmq08teex000104l4cg50y2h0	Pilihan Strategis: Rekrutmen vs. Pengembangan Internal	TEXT	# Pilihan Strategis: Rekrutmen vs. Pengembangan Internal\r\n\r\n## Konsep\r\n\r\n### Rekrutmen Eksternal\r\n*   **Rekrutmen Eksternal**: Cari talenta dari luar organisasi. Bawa orang baru masuk.\r\n    *   **Baik**: Bawa skill baru, ide segar, perspektif beda. Cepat isi posisi spesialis. Akses pasar talenta lebih besar.\r\n    *   **Buruk**: Mahal biaya (iklan, wawancara, pemeriksaan latar belakang, onboarding). Risiko tidak cocok budaya tinggi. Butuh waktu adaptasi panjang. Moral staf dalam mungkin turun.\r\n\r\n### Pengembangan Internal\r\n*   **Pengembangan Internal**: Latih, naikkan talenta sudah ada dalam organisasi. Gerak orang dalam ke posisi baru.\r\n    *   **Baik**: Kenal budaya organisasi, cepat adaptasi. Biaya rekrutmen lebih rendah. Tingkat retensi karyawan tinggi. Moral staf dalam naik, motivasi kuat. Jalur karir jelas.\r\n    *   **Buruk**: Skill baru terbatas. Kurang ide segar dari luar. Mungkin cipta kekosongan posisi lama. Butuh investasi waktu, sumber daya untuk pelatihan.\r\n\r\n## Faktor Pilih\r\n*   **Ketersediaan Skill**: Skill spesifik tidak ada dalam? Rekrut luar. Skill dasar ada, bisa dilatih? Kembang dalam.\r\n*   **Waktu**: Butuh cepat isi posisi? Rekrut luar (jika talenta tersedia). Pengembangan butuh waktu pelatihan.\r\n*   **Biaya**: Rekrut luar mahal biaya langsung. Kembang dalam lebih hemat jangka panjang, investasi sumber daya internal.\r\n*   **Budaya Organisasi**: Perlu perubahan budaya, perspektif baru? Rekrut luar. Jaga, perkuat budaya lama? Kembang dalam.\r\n*   **Rencana Suksesi**: Ada rencana pengganti jelas? Kembang dalam. Tidak ada penerus? Rekrut luar.\r\n\r\n## Contoh Nyata\r\n\r\n### Pilih Rekrutmen Eksternal\r\n*   **Skenario**: Perusahaan retail besar putuskan masuk pasar e-commerce. Butuh **Kepala Pemasaran Digital** segera. Orang dalam tidak punya pengalaman luas di SEO, SEM, media sosial.\r\n*   **Aksi**: Rekrut luar. Cari individu dengan rekam jejak terbukti di pemasaran digital e-commerce. Ini bawa skill, pengetahuan spesifik tidak ada dalam.\r\n\r\n### Pilih Pengembangan Internal\r\n*   **Skenario**: Pabrik manufaktur butuh **Supervisor Lini Produksi** baru. Ada beberapa operator senior kinerja bagus, kenal proses, kenal tim.\r\n*   **Aksi**: Beri operator senior pelatihan kepemimpinan, manajemen tim, pemecahan masalah. Promosi mereka jadi supervisor. Ini manfaatkan pengetahuan internal, tingkatkan moral karyawan.\r\n\r\n## Poin Kunci\r\n*   **Rekrutmen Eksternal**: Untuk skill baru, perspektif segar. Mahal, risiko adaptasi.\r\n*   **Pengembangan Internal**: Untuk kenal budaya, retensi tinggi. Skill terbatas, butuh waktu.\r\n*   Pilih sesuai **kebutuhan organisasi**, **ketersediaan skill**, **biaya**, **waktu**, **strategi jangka panjang**.	\N	\N	15	2	2026-06-05 01:56:40.843	2026-06-08 07:35:59.318
cmq4xbtk4000504l2vpz7hdd8	cmq08teex000204l4gsf42omn	Refleksi & Pembelajaran Utama Implementasi Kebijakan HC	TEXT	## Refleksi & Pembelajaran Utama Implementasi Kebijakan HC\r\n\r\n### Evaluasi Pasca-Implementasi\r\nKebijakan butuh ukur. Data tunjuk hasil nyata. Banding target vs realita.\r\n*   **Audit Data**: Periksa angka **Turnover**, **Produktivitas**, dan **Biaya**.\r\n*   **Analisis Celah**: Cari beda rencana dan hasil. Temu sebab gagal.\r\n\r\n### Umpan Balik Pemangku Kepentingan\r\nKaryawan rasa dampak. Suara mereka penting. Kebijakan kaku buat macet.\r\n*   **Survei Denyut (Pulse Survey)**: Ambil data cepat. Pantau moral tim.\r\n*   **Wawancara Fokus (FGD)**: Gali masalah dalam. Temu hambatan teknis.\r\n\r\n### Pembelajaran Utama (Key Lessons)\r\n1.  **Komunikasi Inti**: Gagal jelas, kebijakan mati. Info harus sampai akar.\r\n2.  **Fleksibilitas**: Situasi ubah cepat. Aturan kaku hambat gerak.\r\n3.  **Dukungan Pimpinan**: Atasan cuek, staf abai. Komitmen atas kunci sukses.\r\n4.  **Kesiapan Infrastruktur**: Teknologi bantu proses. Sistem manual picu salah.\r\n\r\n### Contoh Praktis: Refleksi Kebijakan Lembur\r\n*   **Masalah**: Biaya lembur bengkak, karyawan stres.\r\n*   **Refleksi**: Alur kerja buruk. Manajer paksa kerja ekstra.\r\n*   **Solusi**: Batasi jam sistem. Perbaiki distribusi beban kerja.\r\n\r\n### Ringkasan Poin Kunci\r\n*   **Ukur berkala**: Pastikan kebijakan tetap relevan.\r\n*   **Dengar pelaksana**: Koreksi aturan berdasar fakta lapangan.\r\n*   **Dokumentasi**: Catat gagal dan sukses untuk panduan masa depan.\r\n*   **Agile**: Berani ubah kebijakan jika tidak efektif.\r\n\r\n[Evaluasi selesai]. [Simpan pembelajaran dalam database HC]. [Siapkan revisi kebijakan].	\N	\N	15	5	2026-06-08 08:03:14.404	2026-06-09 04:40:30.066
cmq4xbtej000304l2mhal1i7f	cmq08teex000204l4gsf42omn	Peer Review: Presentasi & Feedback Kebijakan HC	TEXT	## Peer Review: Presentasi & Feedback Kebijakan HC\r\n\r\n### Konsep Peer Review dalam Pengembangan Kebijakan HC\r\n\r\nPeer review adalah proses evaluasi kolegial di mana rekan sejawat (peer) memberikan umpan balik terhadap rancangan kebijakan HC. Tujuan: memastikan kebijakan efektif, sesuai kebutuhan bisnis, dan minim celah. Proses ini krusial dalam siklus ROFIQ (Review, Optimasi, Finalisasi, Implementasi, Quality Control).\r\n\r\n**Elemen kunci peer review:**\r\n\r\n- **Objektivitas:** Fokus pada konten kebijakan, bukan pada pembuat.\r\n- **Konstruktif:** Feedback membangun, bukan menjatuhkan.\r\n- **Kolaboratif:** Memperkaya perspektif melalui diskusi.\r\n\r\n### Langkah Presentasi Kebijakan HC\r\n\r\nPresentasi efektif memudahkan reviewer memahami konteks dan substansi.\r\n\r\n1. **Buka dengan Latar Belakang**\r\n   - Jelaskan masalah atau gap yang mendorong kebijakan.\r\n   - Contoh: "Produktivitas turun 15% karena tidak ada kebijakan fleksibilitas kerja."\r\n\r\n2. **Sampaikan Tujuan & Ruang Lingkup**\r\n   - Tujuan spesifik: "Meningkatkan retensi talenta melalui skema kerja hibrida."\r\n   - Batasan: "Berlaku untuk karyawan level staff – manajer."\r\n\r\n3. **Paparkan Isi Kebijakan**\r\n   - Gunakan struktur: definisi, prosedur, sanksi/penghargaan.\r\n   - Tabel atau bullet list untuk kejelasan.\r\n\r\n4. **Soroti Dampak & Metrik**\r\n   - Prediksi hasil: "Target retensi naik 20% dalam 6 bulan."\r\n   - Indikator keberhasilan: "Survey kepuasan karyawan >75%."\r\n\r\n5. **Tutup dengan Diskusi Terbuka**\r\n   - Undang pertanyaan dan saran.\r\n\r\n### Cara Memberi Feedback Efektif\r\n\r\nFeedback yang baik adalah senjata untuk perbaikan kebijakan.\r\n\r\n- **Berbasis Data:** Gunakan fakta, contoh kasus, atau benchmark industri.\r\n- **Spesifik:** Hindari pernyataan umum. "Pasal 5 ambigu" lebih baik dari "kurang jelas".\r\n- **Fokus pada Solusi:** Sarankan alternatif.\r\n- **Gunakan Teknik SBI (Situation-Behavior-Impact):**\r\n  - Situation: "Dalam poin tentang overtime..."\r\n  - Behavior: "Definisi waktu lembur tumpang tindih dengan shift malam."\r\n  - Impact: "Ini bisa menimbulkan klaim ganda."\r\n\r\n**Contoh Feedback:**\r\n\r\n- *Buruk:* "Kebijakan ini jelek."\r\n- *Baik:* "Di bagian sanksi, denda 10% belum sesuai dengan aturan ketenagakerjaan. Sarankan merujuk pada PP No. X Tahun Y."\r\n\r\n### Contoh Praktis Skenario Peer Review\r\n\r\n**Kasus:** Divisi HC mengusulkan kebijakan *Remote Work*. Presentasi oleh Tim A.\r\n\r\n**Presentasi (Tim A):**\r\n- Latar: Survei menunjukkan 60% karyawan ingin remote.\r\n- Tujuan: Meningkatkan work-life balance.\r\n- Isi: Jadwal wajib kantor 2 hari/minggu, sisa remote. Prosedur pengajuan via sistem.\r\n- Dampak: Produktivitas diharapkan naik 10%.\r\n\r\n**Feedback dari Peer (Tim B):**\r\n- *Situation:* Pada aturan pengawasan produktivitas.\r\n- *Behavior:* Hanya disebut "monitoring via output", tapi tidak ada mekanisme review.\r\n- *Impact:* Ini risiko penurunan kualitas kerja.\r\n- *Saran:* Tambahkan KPI mingguan dan check-in tim.\r\n\r\n### Ringkasan Poin Kunci\r\n\r\n- Peer review adalah alat validasi kebijakan HC.\r\n- Presentasi harus jelas: latar, tujuan, isi, dampak.\r\n- Feedback konstruktif berbasis data dan solusi.\r\n- Gunakan teknik SBI untuk feedback terstruktur.\r\n- Peer review memperkuat kualitas implementasi kebijakan HC.\r\n\r\n**Langkah akhir:** Catat semua masukan, prioritaskan revisi, dan finalisasi kebijakan.	\N	\N	15	3	2026-06-08 08:03:14.203	2026-06-09 04:40:38.957
cmq4xbt63000004l2ypbt3ypm	cmq08teex000204l4gsf42omn	Dasar Kebijakan HC: Anatomi & Proses Perancangan	TEXT	# Dasar Kebijakan HC: Anatomi & Proses Perancangan\r\n\r\n## Kebijakan HC: Apa Itu?\r\n\r\nKebijakan HC **aturan formal**. Organisasi buat. Arahkan perilaku karyawan, manajer. Pastikan konsistensi, keadilan.\r\n\r\n### Kebijakan HC: Mengapa Penting?\r\n\r\n*   **Arah Jelas**: Karyawan tahu harapan. Manajer tahu batasan.\r\n*   **Keadilan**: Semua sama perlakuan. Diskriminasi kurang.\r\n*   **Kepatuhan Hukum**: Ikuti undang-undang kerja. Hindari masalah.\r\n*   **Efisiensi Operasi**: Proses standar. Kerja cepat.\r\n*   **Budaya Kerja Kuat**: Nilai organisasi dukung. Visi capai.\r\n\r\n## Anatomi Kebijakan HC: Bagian-Bagian\r\n\r\nKebijakan HC punya struktur. Bagian-bagian penting.\r\n\r\n### 1. Judul Kebijakan\r\nNama spesifik. Kebijakan apa bahas.\r\n*Contoh*: Kebijakan Cuti Tahunan.\r\n\r\n### 2. Tujuan Kebijakan\r\nMengapa kebijakan ada. Apa ingin capai.\r\n*Contoh*: Pastikan karyawan dapat istirahat cukup. Jaga keseimbangan kerja-hidup.\r\n\r\n### 3. Ruang Lingkup\r\nSiapa kebijakan berlaku. Kapan berlaku.\r\n*Contoh*: Semua karyawan tetap. Sejak tanggal X.\r\n\r\n### 4. Definisi Istilah Kunci\r\nKata-kata penting jelas arti. Hindari salah paham.\r\n*Contoh*: **Cuti Tahunan** berarti libur berbayar.\r\n\r\n### 5. Prinsip Kebijakan\r\nNilai dasar pandu kebijakan.\r\n*Contoh*: Keadilan, transparansi, fleksibilitas.\r\n\r\n### 6. Prosedur\r\nBagaimana kebijakan jalan. Langkah-langkah jelas.\r\n*Contoh*:\r\n1.  Karyawan ajukan cuti. Form isi.\r\n2.  Manajer setuju. Periksa jadwal tim.\r\n3.  HC rekam. Konfirmasi karyawan.\r\n\r\n### 7. Tanggung Jawab\r\nSiapa lakukan apa. Jelas peran.\r\n*Contoh*:\r\n*   **Karyawan**: Ajukan cuti benar.\r\n*   **Manajer**: Setujui/tolak permintaan.\r\n*   **Departemen HC**: Administrasi, rekam.\r\n\r\n### 8. Pelanggaran & Konsekuensi\r\nApa terjadi jika aturan langgar. Jelas sanksi.\r\n*Contoh*: Cuti tanpa izin: teguran lisan, potong gaji.\r\n\r\n### 9. Tanggal Efektif & Revisi\r\nKapan kebijakan mulai. Kapan terakhir ubah.\r\n*Contoh*: Efektif: 1 Januari 2024. Revisi terakhir: 10 Maret 2024.\r\n\r\n## Proses Perancangan Kebijakan HC: Langkah-Langkah\r\n\r\nKebijakan HC tidak tiba-tiba ada. Butuh proses terstruktur.\r\n\r\n### 1. Analisis Kebutuhan\r\nMasalah apa perlu solusi? Peraturan baru ada? Tujuan bisnis apa dukung?\r\n*   **Contoh**: Karyawan minta kerja fleksibel. Perlu kebijakan *remote work*.\r\n\r\n### 2. Riset & Benchmarking\r\nLihat organisasi lain. Bagaimana mereka tangani masalah sama? Hukum apa relevan?\r\n*   **Contoh**: Cari tahu kebijakan *remote work* perusahaan teknologi lain. Pelajari UU Ketenagakerjaan.\r\n\r\n### 3. Penyusunan Draf\r\nTulis draf awal. Ikuti anatomi kebijakan. Libatkan ahli.\r\n*   **Contoh**: Tim HC, manajer terkait, legal, buat draf.\r\n\r\n### 4. Konsultasi & Umpan Balik\r\nDraf bagi ke pemangku kepentingan. Minta masukan.\r\n*   **Contoh**: Draf *remote work* bagi ke manajer departemen, perwakilan karyawan.\r\n\r\n### 5. Revisi & Finalisasi\r\nDraf perbaiki. Masukan pertimbangkan. Pastikan jelas, adil, patuh hukum.\r\n*   **Contoh**: Sesuaikan draf *remote work* berdasarkan masukan.\r\n\r\n### 6. Persetujuan\r\nDraf final ajukan ke manajemen senior. Dapat persetujuan formal.\r\n*   **Contoh**: Direktur HC, CEO tandatangani kebijakan *remote work*.\r\n\r\n### 7. Komunikasi & Sosialisasi\r\nKebijakan baru sampaikan ke semua karyawan. Pastikan mereka paham.\r\n*   **Contoh**: Email pengumuman. Sesi sosialisasi. Intranet posting.\r\n\r\n### 8. Implementasi\r\nKebijakan mulai berlaku. Ikuti prosedur.\r\n*   **Contoh**: Karyawan mulai ajukan *remote work* sesuai aturan baru.\r\n\r\n### 9. Evaluasi & Review\r\nSecara berkala nilai kebijakan. Apakah efektif? Perlu ubah?\r\n*   **Contoh**: Tiap tahun periksa kebijakan *remote work*. Apakah tujuan tercapai? Ada masalah?\r\n\r\n## Contoh Praktis: Kebijakan Kerja Fleksibel\r\n\r\n### Kebijakan Kerja Fleksibel\r\n\r\n**Tujuan**: Dukung keseimbangan kerja-hidup karyawan. Tingkatkan produktivitas.\r\n\r\n**Ruang Lingkup**: Semua karyawan tetap. Setelah 3 bulan kerja.\r\n\r\n**Prosedur**:\r\n1.  Karyawan ajukan permintaan kerja fleksibel. Isi form online.\r\n2.  Manajer tinjau. Pertimbangkan dampak tim, operasional.\r\n3.  Manajer setuju/tolak. Beri alasan.\r\n4.  HC rekam. Komunikasi keputusan.\r\n\r\n**Tanggung Jawab**:\r\n*   **Karyawan**: Ikuti aturan kerja fleksibel. Jaga produktivitas.\r\n*   **Manajer**: Kelola tim kerja fleksibel. Pastikan tujuan tercapai.\r\n*   **HC**: Administrasi, dukung, monitor.\r\n\r\n**Pelanggaran**: Melanggar aturan kerja fleksibel: tindakan disipliner sesuai kebijakan perusahaan.\r\n\r\n**Tanggal Efektif**: 1 Agustus 2024.\r\n\r\n## Ringkasan: Poin-Poin Kunci\r\n\r\n*   **Kebijakan HC**: Aturan formal. Arahkan perilaku, pastikan keadilan.\r\n*   **Penting**: Jelas, adil, patuh hukum, efisien.\r\n*   **Anatomi**: Judul, tujuan, ruang lingkup, prosedur, tanggung jawab.\r\n*   **Proses**: Analisis, riset, draf, konsultasi, revisi, persetujuan, komunikasi, implementasi, evaluasi.\r\n*   **Ingat**: Kebijakan HC dokumen hidup. Perlu review, adaptasi.	\N	\N	20	0	2026-06-08 08:03:13.899	2026-06-09 02:17:49.611
cmq4xbtbs000204l2d88x6n1m	cmq08teex000204l4gsf42omn	Workshop Perancangan Kebijakan HC (Studi Kasus & Template)	DOCUMENT	\N	\N	https://docs.google.com/document/d/1gGCfDJGF0rMeWpCRw2o21zQHUWWOVv4YhaZ1vnHt_00/edit?usp=sharing	240	2	2026-06-08 08:03:14.104	2026-06-09 04:53:18.013
cmq4xbt90000104l2ab5osypt	cmq08teex000204l4gsf42omn	Kebijakan HC Startup: Penyesuaian & Komunikasi Efektif	TEXT	## Kebijakan HC Startup: Penyesuaian & Komunikasi Efektif\r\n\r\n### Konsep Dasar\r\nStartup tumbuh kilat. Aturan kaku hambat gerak. Kebijakan butuh **Agility** (kelincahan). \r\n\r\n*   **Iterasi**: Ubah aturan tiap fase.\r\n*   **Skala**: Aturan tumbuh bareng jumlah staf.\r\n*   **Budaya**: Fokus hasil, bukan jam kantor.\r\n\r\n### Penyesuaian Strategis\r\nStartup beda dengan korporat tua. Fokus pada:\r\n\r\n1.  **Struktur Organisasi**: Buat datar. Kurangi birokrasi agar putusan cepat.\r\n2.  **Kompensasi**: Gabung gaji dengan **ESOP** (saham). Ikat talenta jangka panjang.\r\n3.  **Jam Kerja**: Fokus **Remote** atau **Hybrid**. Tarik talenta global.\r\n4.  **Evaluasi**: Pakai **OKR** (Objectives and Key Results). Ukur dampak nyata, bukan sekadar rajin.\r\n\r\n### Komunikasi Efektif\r\nGagal lapor, gagal paham. Gunakan cara ini:\r\n\r\n*   **Transparansi**: Buka data kebijakan di buku panduan digital (Notion/Confluence).\r\n*   **Kanal Langsung**: Pakai Slack atau Discord. Info sebar instan.\r\n*   **Townhall**: Pertemuan rutin. Pimpinan jawab tanya staf langsung.\r\n\r\n### Implementasi Kebijakan\r\nIkuti langkah ini untuk ubah aturan tanpa kacau:\r\n\r\n1. Identifikasi masalah atau kebutuhan baru dari feedback karyawan.\r\n2. Buat draf kebijakan singkat yang fokus pada solusi.\r\n3. Uji coba kebijakan pada tim kecil selama satu bulan.\r\n4. Evaluasi dampak kebijakan terhadap produktivitas.\r\n5. Sosialisasi kebijakan ke seluruh perusahaan melalui kanal digital.\r\n\r\n### Contoh Praktis\r\n*   **Masalah**: Karyawan lelah (burnout) karena lembur terus.\r\n*   **Aksi**: Buat kebijakan "Jumat Tanpa Rapat".\r\n*   **Hasil**: Staf fokus selesaikan tugas. Stres turun. Kerja naik.\r\n\r\n### Ringkasan\r\n*   **Lentur**: Aturan jangan kaku. Ubah saat tidak relevan.\r\n*   **Jujur**: Komunikasi terbuka bangun percaya.\r\n*   **Digital**: Pakai alat modern. Hapus kertas.\r\n*   **Cepat**: Implementasi segera. Evaluasi kemudian.	\N	\N	15	1	2026-06-08 08:03:14.004	2026-06-09 04:41:26.128
cmq4xbthb000404l2ro09h8gc	cmq08teex000204l4gsf42omn	Simulasi: Menangani Penolakan Karyawan atas Kebijakan Baru	TEXT	## Konsep Penolakan Perubahan\r\nBaru kebijakan, tolak datang. Karyawan takut zona nyaman hilang. Takut beban naik. Takut rugi materi. HC harus paham psikologi massa.\r\n\r\n### Alasan Utama Penolakan\r\n*   **Buta Info:** Karyawan tidak tahu tujuan.\r\n*   **Takut Gagal:** Ragu bisa pakai sistem baru.\r\n*   **Hilang Kendali:** Rasa otonomi dirampas.\r\n*   **Beban Tambah:** Anggap kebijakan bikin repot.\r\n\r\n## Strategi ROFIQ Atasi Penolakan\r\nGunakan kerangka **ROFIQ** agar kebijakan diterima:\r\n1.  **Relevant:** Pastikan kebijakan jawab masalah nyata di lapangan.\r\n2.  **Objective:** Dasar kebijakan harus data kuat, bukan selera pimpinan.\r\n3.  **Flexible:** Beri ruang penyesuaian saat masa transisi.\r\n4.  **Integrated:** Sambungkan kebijakan dengan sistem lama agar tidak tumpang tindih.\r\n5.  **Quality:** Pastikan hasil akhir kebijakan buat kerja lebih mudah.\r\n\r\n## Simulasi: Kasus Absensi Mobile (GPS)\r\n**Skenario:** Perusahaan wajibkan absen via HP. Karyawan protes. Anggap ini mata-mata.\r\n\r\n### Langkah Penanganan (Tindakan)\r\n1.  **Dengar Aktif:** Kumpul wakil divisi. Biar mereka bicara. Jangan debat dulu.\r\n2.  **Validasi:** Akui kekhawatiran privasi mereka nyata.\r\n3.  **Edukasi:** Tunjukkan sistem hanya lacak saat jam masuk/pulang. Bukan 24 jam.\r\n4.  **Uji Coba:** Terapkan masa *sandbox* 2 minggu. Tanpa potong gaji jika salah klik.\r\n5.  **Evaluasi:** Perbaiki bug yang ditemukan karyawan.\r\n\r\n### Contoh Komunikasi\r\n```text\r\nKaryawan: "Perusahaan mau lacak saya sampai rumah!"\r\nHC: "Paham. Privasi penting. Sistem aktif hanya saat klik 'Masuk' dan 'Pulang'.\r\n     Lokasi tidak terekam di luar jam kerja. Ini data enkripsi server. \r\n     Coba pakai 1 minggu, beri kami masukan."\r\n```\r\n\r\n## Teknik Negosiasi HC\r\nGunakan pola **EAR**:\r\n*   **Empathy:** "Saya mengerti ini sulit."\r\n*   **Address:** "Tujuannya agar lembur terhitung otomatis, bukan manual lagi."\r\n*   **Resolve:** "Kita buat panduan singkat agar tidak bingung."\r\n\r\n## Ringkasan Kunci\r\n*   **Tolak itu wajar:** Jangan anggap musuh.\r\n*   **Data lawan asumsi:** Pakai bukti teknis.\r\n*   **Libatkan karyawan:** Orang jarang tolak apa yang mereka bantu buat.\r\n*   **Transparansi:** Jujur soal untung rugi kebijakan.\r\n\r\n**Evaluasi Kebijakan:** Jika 80% tolak, cek isi kebijakan. Jika 20% tolak, edukasi personal.	\N	\N	30	4	2026-06-08 08:03:14.303	2026-06-09 04:39:51.02
cmq67xn8b000504l4r8qnez5s	cmq08teex000304l4865plfu7	Rencana Aksi dan Refleksi Manajemen Kinerja	TEXT	## Rencana Aksi dan Refleksi Manajemen Kinerja\r\n\r\n### 1. Definisi Rencana Aksi\r\n**Rencana Aksi** jembatan target ke hasil. Strategi tanpa langkah nyata mati. Rencana aksi pecah **Objective and Key Results (OKR)** jadi tugas harian.\r\n\r\n**Unsur Penting:**\r\n*   **Target:** Apa mau capai.\r\n*   **Langkah:** Urutan kerja.\r\n*   **PIC:** Orang tanggung jawab.\r\n*   **Waktu:** Kapan mulai dan selesai.\r\n*   **Metrik:** Cara ukur sukses.\r\n\r\n### 2. Proses Refleksi Kinerja\r\n**Refleksi** lihat belakang untuk maju depan. Tim evaluasi apa jalan dan apa hancur. Refleksi bukan cari salah, tapi cari ilmu.\r\n\r\n**Metode Refleksi (Model 3 Kolom):**\r\n1.  **Stop:** Hentikan aksi tidak hasilkan nilai.\r\n2.  **Start:** Mulai aksi baru perbaiki skor.\r\n3.  **Continue:** Teruskan aksi terbukti sakti.\r\n\r\n### 3. Implementasi OKR ke Aksi\r\nUbah **Key Result (KR)** jadi daftar kerja. \r\n\r\n**Contoh Kasus:**\r\n*   **Objective:** Naikan kepuasan pelanggan.\r\n*   **Key Result:** Skor CSAT capai 90%.\r\n*   **Rencana Aksi:**\r\n    *   Latih staf CS teknik komunikasi (Minggu 1).\r\n    *   Pasang sistem feedback otomatis (Minggu 2).\r\n    *   Review keluhan mingguan (Rutin).\r\n\r\n### 4. Dampak Bisnis\r\nAksi dan refleksi kuat buat organisasi lincah (**Agile**). Bisnis hemat biaya karena buang proses sampah. Kinerja naik karena fokus pada data, bukan asumsi.\r\n\r\n### 5. Contoh Tabel Rencana Aksi\r\n\r\n| Key Result | Aksi Nyata | PIC | Tenggat |\r\n| :--- | :--- | :--- | :--- |\r\n| Kurangi *Bug* 20% | Audit kode tiap Jumat | Tim IT | Des 2023 |\r\n| Naikkan *Lead* 10% | Iklan Google Ads | Marketing | Nov 2023 |\r\n| Efisiensi Biaya 5% | Cari vendor murah | Ops | Jan 2024 |\r\n\r\n### Ringkasan Poin Kunci\r\n*   **Rencana Aksi** ubah rencana jadi gerak.\r\n*   **Refleksi** cegah lubang sama dua kali.\r\n*   **Data** dasar ambil keputusan.\r\n*   **Disiplin** eksekusi kunci menang pasar.\r\n\r\n**Langkah Berikut:**\r\nCek hasil OKR bulan lalu. Buat daftar **Start-Stop-Continue**. Tulis rencana aksi baru. Jalankan segera.	\N	\N	30	5	2026-06-09 05:47:54.971	2026-06-09 05:51:21.812
cmq67xmuh000004l4do5y4u2j	cmq08teex000304l4865plfu7	Urgensi Indikator Kinerja dan Perbandingan OKR vs KPI	TEXT	## Urgensi Indikator Kinerja dan Perbandingan OKR vs KPI\r\n\r\n### Mengapa Bisnis Butuh Indikator?\r\n\r\nBisnis tanpa ukur sama dengan buta. Pemimpin butuh data buat putus jalan. Indikator beri bukti kerja nyata.\r\n\r\n*   **Transparansi**: Semua orang lihat target sama. Tidak ada bingung.\r\n*   **Akuntabilitas**: Orang tanggung jawab atas angka. Kerja punya bukti.\r\n*   **Fokus**: Energi tim habis buat hal penting. Bukan hal sia-sia.\r\n*   **Evaluasi**: Tahu mana sukses, mana gagal. Perbaikan jadi cepat.\r\n\r\n---\r\n\r\n### KPI (Key Performance Indicator)\r\n\r\n**KPI** ukur kesehatan rutin. Fokus pada proses yang sudah jalan. \r\n\r\n*   **Sifat**: Statis, jangka panjang, stabil.\r\n*   **Tujuan**: Jaga performa agar tidak turun.\r\n*   **Contoh**: \r\n    *   Tim CS: Skor kepuasan pelanggan minimal 4.5/5.\r\n    *   Tim Produksi: Tingkat cacat barang di bawah 1%.\r\n    *   Tim Sales: Capai target jual bulanan Rp1 Miliar.\r\n\r\n---\r\n\r\n### OKR (Objectives and Key Results)\r\n\r\n**OKR** dorong perubahan besar. Fokus pada visi ambisius dan inovasi.\r\n\r\n*   **Objective**: Tujuan besar (Kualitatif). Apa yang mau dicapai?\r\n*   **Key Results**: Ukuran sukses (Kuantitatif). Bagaimana tahu sudah sampai?\r\n*   **Sifat**: Agresif, dinamis, jangka pendek (biasanya 3 bulan).\r\n*   **Contoh**:\r\n    *   **Objective**: Jadi pemimpin pasar *e-commerce* di Asia Tenggara.\r\n    *   **Key Result 1**: Naikkan jumlah pengguna aktif 50%.\r\n    *   **Key Result 2**: Kurangi waktu pengiriman barang jadi 1 hari.\r\n\r\n---\r\n\r\n### Tabel Perbandingan: OKR vs KPI\r\n\r\n| Fitur | KPI (Key Performance Indicator) | OKR (Objectives and Key Results) |\r\n| :--- | :--- | :--- |\r\n| **Fokus** | Operasional & Rutinitas | Strategis & Pertumbuhan |\r\n| **Orientasi** | Hasil akhir (Output) | Dampak & Perubahan (Outcome) |\r\n| **Waktu** | Berkelanjutan / Tahunan | Kuartalan (3 Bulanan) |\r\n| **Gaya** | Jaga standar | Kejar mimpi besar |\r\n| **Risiko** | Rendah (Harus tercapai) | Tinggi (Cukup capai 70-80%) |\r\n\r\n---\r\n\r\n### Contoh Praktis Integrasi\r\n\r\nPerusahaan butuh dua-duanya. KPI jaga rumah tetap tegak, OKR bangun lantai baru.\r\n\r\n**Skenario: Tim IT Perusahaan**\r\n1.  **KPI**: Server harus nyala 99.9% (Jaga sistem jangan mati).\r\n2.  **OKR**: Luncurkan aplikasi *mobile* baru dalam 3 bulan (Inovasi baru).\r\n    *   **KR 1**: Selesaikan desain UI/UX bulan pertama.\r\n    *   **KR 2**: Tes Beta ke 1000 pengguna bulan kedua.\r\n    *   **KR 3**: Skor rating aplikasi minimal 4.0 di Playstore.\r\n\r\n---\r\n\r\n### Ringkasan Kunci\r\n\r\n*   **KPI** ukur **apa** yang sedang jalan. Jaga bisnis tetap hidup.\r\n*   **OKR** ukur **ke mana** bisnis mau pergi. Dorong bisnis jadi raksasa.\r\n*   **Dampak Bisnis**: Pakai KPI buat efisiensi. Pakai OKR buat lompatan besar.\r\n*   **Langkah Berikut**: Tentukan target rutin (KPI), lalu pilih satu mimpi besar buat dikejar (OKR).	\N	\N	20	0	2026-06-09 05:47:54.473	2026-06-09 05:48:41.859
cmq67xn2t000304l4kk34x2pv	cmq08teex000304l4865plfu7	Workshop: Praktik Susun OKR HC Strategic	DOCUMENT	\N	\N	https://docs.google.com/document/d/1yGoNqH3A_eoFUvEtLWxZkc_dPgB7hsalb_LB2cS0VA4/edit?usp=sharing	240	3	2026-06-09 05:47:54.773	2026-06-09 05:58:08.695
cmq67xmxd000104l4lc76rhwk	cmq08teex000304l4865plfu7	Siklus Manajemen Kinerja dan Eksekusi Keputusan Strategis	TEXT	## Siklus Manajemen Kinerja\r\n\r\nManajemen kinerja proses berkelanjutan. Hubungkan kerja individu dengan target organisasi. Tujuan: selaras kerja dengan visi.\r\n\r\n### 1. Perencanaan (Planning)\r\n*   **Tetap Sasaran**: Pimpinan dan staf sepakat target. Pakai metode **SMART** (*Specific, Measurable, Achievable, Relevant, Time-bound*).\r\n*   **Susun OKR**: Tentukan **Objective** (tujuan besar) dan **Key Results** (ukuran sukses).\r\n\r\n### 2. Pemantauan (Monitoring)\r\n*   **Cek Rutin**: Pantau progres berkala. Jangan tunggu akhir tahun.\r\n*   **Umpan Balik**: Beri koreksi cepat. Perbaiki arah jika melenceng.\r\n\r\n### 3. Peninjauan (Reviewing)\r\n*   **Evaluasi**: Bandingkan hasil nyata dengan target awal.\r\n*   **Analisis**: Cari sebab sukses atau gagal. Ambil pelajaran.\r\n\r\n### 4. Penghargaan (Rewarding)\r\n*   **Apresiasi**: Beri bonus, promosi, atau pengakuan.\r\n*   **Motivasi**: Dorong staf kerja lebih baik siklus depan.\r\n\r\n---\r\n\r\n## OKR: Alat Eksekusi Strategis\r\n\r\n**OKR (Objectives and Key Results)** dorong pertumbuhan agresif.\r\n\r\n*   **Objective**: Ambisius. Kualitatif. Contoh: "Dominasi pasar retail digital."\r\n*   **Key Results**: Kuantitatif. Terukur. Contoh: "Naikkan trafik web 50%," "Konversi naik 10%."\r\n\r\n### Perbedaan OKR vs KPI\r\n| Fitur | OKR | KPI |\r\n| :--- | :--- | :--- |\r\n| **Fungsi** | Dorong perubahan/inovasi | Ukur kesehatan operasional |\r\n| **Sifat** | Ambisius & menantang | Realistis & stabil |\r\n| **Fokus** | Hasil masa depan | Kinerja saat ini |\r\n\r\n---\r\n\r\n## Eksekusi Keputusan Strategis\r\n\r\nStrategi hebat gagal tanpa eksekusi kuat. Keputusan atas harus jadi aksi bawah.\r\n\r\n### Langkah Eksekusi:\r\n1.  **Komunikasi**: Staf harus paham "Kenapa" keputusan diambil.\r\n2.  **Alokasi**: Beri modal, alat, dan orang tepat pada tugas prioritas.\r\n3.  **Akuntabilitas**: Tunjuk satu orang tanggung jawab tiap satu hasil.\r\n4.  **Disiplin**: Pantau metrik tiap minggu. Tindak tegas hambatan.\r\n\r\n---\r\n\r\n## Contoh Praktis: ROFIQ Framework\r\n\r\n**Skenario**: Perusahaan logistik ingin kurangi komplain pelanggan.\r\n\r\n*   **Keputusan Strategis**: Otomasi sistem pelacakan paket.\r\n*   **Penerapan OKR**:\r\n    *   **Objective**: Beri transparansi pengiriman terbaik.\r\n    *   **Key Result 1**: Integrasi API pelacak selesai dalam 30 hari.\r\n    *   **Key Result 2**: Skor kepuasan pelanggan naik dari 3.5 ke 4.5.\r\n*   **Eksekusi**: Tim IT bangun sistem. Tim CS sosialisasi ke pelanggan. Pimpinan pantau dasbor harian.\r\n\r\n---\r\n\r\n## Ringkasan Kunci\r\n\r\n*   **Siklus Kinerja**: Rencana -> Pantau -> Tinjau -> Hadiah.\r\n*   **OKR**: Fokus pada hasil besar (Outcomes), bukan sekadar sibuk (Output).\r\n*   **Dampak Bisnis**: Kinerja terukur buat keputusan data, bukan asumsi.\r\n*   **Eksekusi**: Kunci sukses bukan ide, tapi aksi nyata dan disiplin pantau hasil.	\N	\N	30	1	2026-06-09 05:47:54.577	2026-06-09 05:49:35.638
cmq692cg3000404lalvd4yxez	cmq08teex000404l4x88vxdpi	Workshop: Executive Summary & Role-play	DOCUMENT	\N	\N	https://docs.google.com/document/d/1ObeW_GfY4Ts2V-KYy06XVKWcFa-b24GUtoyiNPSdHs4/edit?usp=sharing	120	4	2026-06-09 06:19:33.891	2026-06-10 06:59:58.693
cmq692caw000204laig7msjh6	cmq08teex000404l4x88vxdpi	Pemetaan Stakeholder & Komunikasi Asertif	TEXT	# Pemetaan Stakeholder & Komunikasi Asertif\r\n\r\n**Modul:** Komunikasi Kepemimpinan & Pengelolaan Pemangku Kepentingan\r\n**Durasi estimasi:** 45 menit\r\n**Tipe:** Materi Teks\r\n\r\n---\r\n\r\n## 🎯 Tujuan Pembelajaran\r\n\r\nSetelah menyelesaikan pelajaran ini, kamu akan mampu:\r\n\r\n1. Mengidentifikasi siapa saja stakeholder yang relevan dalam pekerjaanmu dan memahami posisi mereka\r\n2. Menggunakan **Matriks Power-Interest** untuk menentukan pendekatan yang tepat bagi setiap kelompok stakeholder\r\n3. Membedakan gaya komunikasi pasif, agresif, dan asertif — serta mengenali kapan tanpa sadar kamu masuk ke salah satu gaya yang salah\r\n4. Menggunakan metode **DESC** untuk menyampaikan pesan yang sulit dengan cara yang tetap profesional dan menjaga hubungan\r\n\r\n---\r\n\r\n## 📌 Pertanyaan Pembuka\r\n\r\n> Bayangkan kamu sedang mengerjakan sebuah inisiatif penting — misalnya, implementasi sistem baru di Vascomm.\r\n> Tiba-tiba, seorang direktur yang selama ini tidak terlalu terlibat menghubungimu dan meminta perubahan besar\r\n> pada rencana yang sudah hampir final.\r\n>\r\n> **Apa yang kamu lakukan?**\r\n> Apakah kamu langsung menyetujui untuk menghindari konflik?\r\n> Apakah kamu menolak karena perubahan itu merusak yang sudah dikerjakan?\r\n> Atau ada cara ketiga yang lebih cerdas?\r\n\r\nPelajaran ini akan membekali kamu dengan dua alat: peta untuk memahami *siapa* yang berhadapan denganmu, dan bahasa untuk merespons dengan cara yang tepat.\r\n\r\n---\r\n\r\n## BAGIAN 1: PEMETAAN STAKEHOLDER\r\n\r\n---\r\n\r\n## 1. Sebuah Cerita: Proyek yang Gagal Bukan Karena Ide yang Buruk\r\n\r\nDua tahun lalu, sebuah startup teknologi bernama Maju Digital meluncurkan program onboarding digital yang menurut tim HC-nya revolusioner. Sistem baru ini akan menggantikan proses manual yang memakan waktu berminggu-minggu.\r\n\r\nTim menghabiskan tiga bulan merancang sistem. Semuanya terasa sempurna dari dalam.\r\n\r\nLalu pada hari peluncuran, masalah datang dari mana-mana secara bersamaan:\r\n\r\n- **Direktur Keuangan** baru menyadari ada biaya lisensi tambahan yang tidak pernah dikomunikasikan padanya — ia memblokir anggaran\r\n- **Lead Engineering** menolak mengintegrasikan sistem baru karena merasa prosesnya akan mengganggu pipeline mereka yang sudah berjalan\r\n- **Karyawan lama** yang paling berpengaruh di lantai produksi menyebarkan komentar negatif karena merasa tidak pernah dilibatkan dalam prosesnya\r\n- **Vendor** terlambat dua minggu karena spesifikasi teknis tidak pernah dikonfirmasi dengan benar\r\n\r\nProyek tertunda enam bulan. Bukan karena sistemnya buruk. Tapi karena **tidak ada yang memetakan siapa yang perlu tahu apa, kapan, dan bagaimana cara mengomunikasikannya.**\r\n\r\n---\r\n\r\nItulah masalah yang diselesaikan oleh **pemetaan stakeholder**: memastikan kamu tidak hanya fokus pada *apa* yang sedang dikerjakan, tapi juga *siapa* yang akan memengaruhi atau dipengaruhi oleh pekerjaan itu.\r\n\r\n---\r\n\r\n## 2. Apa Itu Stakeholder dan Mengapa Perlu Dipetakan?\r\n\r\nDalam konteks pekerjaan HC, **stakeholder** adalah semua pihak yang:\r\n- Memiliki kepentingan dalam hasil pekerjaanmu, *atau*\r\n- Memiliki kemampuan untuk memengaruhi (atau bahkan menghambat) pekerjaan itu\r\n\r\nMereka tidak selalu terlihat jelas. Tidak semua duduk di rapat yang sama denganmu. Dan yang paling berbahaya: **tidak semua yang diam berarti setuju.**\r\n\r\nPemetaan stakeholder membantu kamu menjawab empat pertanyaan sebelum memulai setiap inisiatif penting:\r\n\r\n1. *Siapa saja yang relevan?*\r\n2. *Seberapa besar pengaruh mereka?*\r\n3. *Seberapa besar kepentingan mereka pada topik ini?*\r\n4. *Pendekatan apa yang paling tepat untuk masing-masing?*\r\n\r\n---\r\n\r\n## 3. Matriks Power-Interest: Peta Sederhana yang Sangat Berguna\r\n\r\nAlat paling praktis untuk memetakan stakeholder adalah **Matriks Power-Interest** — sebuah grid dua sumbu yang membagi stakeholder ke dalam empat kuadran berdasarkan dua hal:\r\n\r\n- **Power (Kekuatan):** Seberapa besar kemampuan mereka untuk memengaruhi keputusan atau hasil?\r\n- **Interest (Kepentingan):** Seberapa besar perhatian mereka terhadap apa yang sedang kamu kerjakan?\r\n\r\n```\r\n                    POWER (Kekuatan)\r\n                    Rendah          Tinggi\r\n                 ┌──────────────┬──────────────┐\r\n     Tinggi      │ KEEP         │ MANAGE       │\r\n  INTEREST       │ INFORMED     │ CLOSELY      │\r\n  (Kepentingan)  │              │              │\r\n                 ├──────────────┼──────────────┤\r\n     Rendah      │ MONITOR      │ KEEP         │\r\n                 │              │ SATISFIED    │\r\n                 └──────────────┴──────────────┘\r\n```\r\n\r\nMari kita kenali masing-masing kuadran dengan cerita.\r\n\r\n---\r\n\r\n### Kuadran 1 — Manage Closely *(Power Tinggi, Interest Tinggi)*\r\n\r\n**Siapa mereka:** Direksi, pemilik, investor aktif, sponsor proyek — siapa pun yang peduli dengan hasilnya *dan* punya kekuatan untuk mengubah arahnya.\r\n\r\n**Cerita:** Bayangkan kamu sedang merestrukturisasi sistem kompensasi di Vascomm. CEO sangat tertarik karena ini menyentuh budget dan kultur perusahaan. Ia bisa kapan saja menghentikan, mengubah, atau mempercepat prosesnya.\r\n\r\nJika kamu jarang mengabari CEO dan tiba-tiba mempresentasikan hasil akhir yang tidak sesuai ekspektasinya — proyek bisa dibatalkan di menit terakhir.\r\n\r\n**Pendekatan yang tepat:** Libatkan lebih awal. Update secara reguler — tidak perlu panjang, tapi harus ada. Minta masukan di titik-titik keputusan kritis. Jangan buat mereka mendapat kabar besar dari orang lain sebelum dari kamu.\r\n\r\n---\r\n\r\n### Kuadran 2 — Keep Satisfied *(Power Tinggi, Interest Rendah)*\r\n\r\n**Siapa mereka:** Regulator, tim Legal, Keuangan untuk anggaran tertentu — pihak yang punya kekuatan besar tapi tidak selalu mengikuti detailnya.\r\n\r\n**Cerita:** Kepala Finance di Vascomm tidak selalu terlibat dalam inisiatif HC sehari-hari. Tapi jika tiba-tiba ada pengeluaran besar yang tidak pernah ia ketahui sebelumnya, ia bisa membekukan anggaran dan menghentikan segalanya.\r\n\r\nMereka tidak butuh laporan mingguan dari kamu. Tapi mereka perlu merasa *dihormati* dan *tidak dikejutkan*.\r\n\r\n**Pendekatan yang tepat:** Informasikan di momen-momen penting (awal proyek, perubahan besar, akhir). Buat ringkasan yang singkat dan relevan — jangan banjiri mereka dengan detail. Yang paling penting: jangan pernah membuat mereka terkejut dengan keputusan yang berdampak pada area kewenangan mereka.\r\n\r\n---\r\n\r\n### Kuadran 3 — Keep Informed *(Power Rendah, Interest Tinggi)*\r\n\r\n**Siapa mereka:** Karyawan, komunitas internal, anggota tim yang terdampak langsung — mereka yang peduli dengan hasilnya tapi tidak punya kekuatan formal untuk mengubah keputusan.\r\n\r\n**Cerita:** Saat Vascomm merubah sistem cuti, karyawan tidak punya kuasa untuk menolak kebijakan itu. Tapi jika mereka merasa tidak pernah dilibatkan atau diberi tahu, mereka bisa menciptakan resistensi yang jauh lebih sulit dikelola: ketidakpuasan yang menyebar secara informal, produktivitas yang turun, atau hilangnya kepercayaan terhadap manajemen.\r\n\r\n**Pendekatan yang tepat:** Komunikasi rutin dan transparan. Update progress, jelaskan alasan di balik keputusan, buka ruang tanya jawab. Mereka tidak perlu terlibat dalam setiap keputusan, tapi mereka butuh merasa *didengar* dan *dihargai*.\r\n\r\n---\r\n\r\n### Kuadran 4 — Monitor *(Power Rendah, Interest Rendah)*\r\n\r\n**Siapa mereka:** Vendor kecil untuk proyek tertentu, tim di divisi lain yang tidak terdampak langsung, kontraktor lepas.\r\n\r\n**Cerita:** Vendor percetakan yang mencetak ID card karyawan baru tidak terlalu peduli dengan strategi rekrutmen Vascomm — dan mereka juga tidak punya kekuatan untuk memengaruhinya. Kamu tidak perlu mengirimkan mereka update bulanan tentang perkembangan HC.\r\n\r\n**Pendekatan yang tepat:** Pantau jika ada perubahan situasi yang bisa menggeser posisi mereka. Tidak perlu energi besar — cukup pastikan hubungan tetap baik dan kamu tidak mengabaikan mereka secara total.\r\n\r\n---\r\n\r\n## 4. Bagaimana Cara Menggunakan Matriks Ini dalam Praktik?\r\n\r\nSetiap kali kamu memulai sebuah inisiatif — sekecil apapun — luangkan 15 menit untuk mengisi tabel sederhana ini:\r\n\r\n| Nama / Kelompok | Power (T/R) | Interest (T/R) | Kuadran | Pendekatan |\r\n|---|---|---|---|---|\r\n| CEO Vascomm | Tinggi | Tinggi | Manage Closely | Update mingguan, libatkan di keputusan kritis |\r\n| Tim Finance | Tinggi | Rendah | Keep Satisfied | Brief di awal dan akhir proyek |\r\n| Seluruh Karyawan | Rendah | Tinggi | Keep Informed | Komunikasi transparan, FAQ, town hall |\r\n| Vendor X | Rendah | Rendah | Monitor | Kontak hanya saat dibutuhkan |\r\n\r\nTabel ini tidak perlu sempurna. Tapi dengan membuatnya, kamu memaksa dirimu untuk berpikir: *siapa yang belum aku pertimbangkan?*\r\n\r\n---\r\n\r\n## BAGIAN 2: KOMUNIKASI ASERTIF\r\n\r\n---\r\n\r\n## 5. Cerita Kedua: Tiga Cara Merespons Satu Situasi\r\n\r\nSituasinya sama: kamu baru saja menyelesaikan laporan penting yang membutuhkan waktu dua minggu. Kemudian atasan langsungmu meminta kamu merevisi seluruh formatnya — dua jam sebelum presentasi.\r\n\r\n---\r\n\r\n**Respons pertama — Komunikasi Pasif:**\r\n\r\n> *"Oh... iya Pak. Baik. Saya coba ya..."*\r\n\r\nKamu mematikan layar komputer, lalu mengirim pesan ke temanmu: *"Gila ini orang, dua jam sebelum presentasi minta revisi total. Tapi mau gimana lagi."*\r\n\r\nKamu mengerjakan revisi dengan hati yang panas. Hasilnya tidak optimal. Dan rasa kesalmu tidak hilang — justru menumpuk.\r\n\r\n---\r\n\r\n**Respons kedua — Komunikasi Agresif:**\r\n\r\n> *"Pak, ini tidak masuk akal. Laporan ini sudah saya kerjakan dua minggu. Kalau mau revisi harusnya disampaikan dari dulu!"*\r\n\r\nAtasanmu diam sejenak. Rapat tetap berjalan, tapi suasananya berubah dingin. Kamu mungkin benar — tapi cara menyampaikannya membuat pesanmu tidak terdengar, yang terdengar hanya kemarahanmu.\r\n\r\n---\r\n\r\n**Respons ketiga — Komunikasi Asertif:**\r\n\r\n> *"Pak, saya ingin memastikan kita bisa presentasi dengan baik hari ini. Dua jam mungkin tidak cukup untuk revisi format menyeluruh tanpa risiko error. Bisakah kita bicarakan: bagian mana yang paling krusial untuk diubah dulu? Atau apakah ada kemungkinan kita presentasi dulu dengan format saat ini sambil saya siapkan versi revisi untuk follow-up besok?"*\r\n\r\nAtasanmu berpikir sejenak. *"Oke, yang paling penting ubah bagian executive summary-nya saja. Sisanya bisa besok."*\r\n\r\n---\r\n\r\nTiga situasi yang sama. Tiga hasil yang berbeda.\r\n\r\nKomunikasi asertif bukan soal menang atau kalah — ini soal **menyampaikan kebutuhan dan batasan secara jelas, sambil tetap menghormati pihak lain dan mencari jalan keluar bersama.**\r\n\r\n---\r\n\r\n## 6. Memahami Tiga Gaya Komunikasi\r\n\r\nSebelum masuk ke tekniknya, penting untuk benar-benar memahami perbedaan ketiga gaya ini — karena banyak orang mengira mereka sudah asertif, padahal sebenarnya masih pasif atau sudah mulai agresif.\r\n\r\n---\r\n\r\n### Gaya Pasif\r\n\r\nGaya ini bukan berarti pendiam atau pemalu. Kamu bisa sangat vokal tapi tetap berkomunikasi secara pasif — misalnya dengan selalu menyetujui permintaan yang sebenarnya tidak realistis, atau menghindari konfrontasi sampai masalah menggunung.\r\n\r\n**Ciri-cirinya:**\r\n- Menyetujui sesuatu yang tidak disetujui, lalu mengeluh belakangan\r\n- Menggunakan kalimat ambigu: *"Hmm, mungkin bisa ya..."* padahal maksudnya tidak setuju\r\n- Membiarkan batas dilanggar tanpa menyampaikan keberatan\r\n- Dampaknya: Frustrasi menumpuk, masalah tidak terselesaikan, kepercayaan diri terkikis\r\n\r\n**Kapan tanpa sadar kamu masuk ke gaya ini:**\r\nSaat berhadapan dengan orang yang memiliki otoritas lebih tinggi, atau saat tidak ingin dianggap "sulit" atau "tidak kooperatif."\r\n\r\n---\r\n\r\n### Gaya Agresif\r\n\r\nGaya ini sering terlihat seperti ketegasan — tapi perbedaannya ada di satu hal krusial: komunikasi agresif menempatkan kebutuhan sendiri dengan mengorbankan hak dan perasaan orang lain.\r\n\r\n**Ciri-cirinya:**\r\n- Menyampaikan pendapat dengan cara yang menyerang atau merendahkan\r\n- Menggunakan kata-kata absolut: *"Kamu selalu..."*, *"Tidak pernah bisa diandalkan..."*\r\n- Menginterupsi, memotong pembicaraan, atau meninggikan suara\r\n- Dampaknya: Orang menurut karena takut, bukan karena setuju — dan kepercayaan perlahan hancur\r\n\r\n**Kapan tanpa sadar kamu masuk ke gaya ini:**\r\nSaat sudah frustrasi karena hal yang sama terjadi berulang kali, atau saat merasa tidak didengar dan akhirnya "meledak."\r\n\r\n---\r\n\r\n### Gaya Asertif\r\n\r\nIni bukan titik tengah yang kompromi — ini adalah gaya yang secara bersamaan **menghormati dirimu sendiri dan menghormati orang lain.**\r\n\r\n**Ciri-cirinya:**\r\n- Menyampaikan pendapat dengan jelas, langsung, dan berbasis fakta\r\n- Mengakui perspektif orang lain tanpa harus menyetujuinya\r\n- Menetapkan batasan tanpa perlu meminta maaf atas batasan itu\r\n- Fokus pada solusi, bukan pada kesalahan\r\n- Dampaknya: Hubungan tetap terjaga, masalah diselesaikan, kepercayaan diri meningkat\r\n\r\n---\r\n\r\n## 7. Metode DESC: Bahasa untuk Situasi yang Sulit\r\n\r\nSalah satu tantangan terbesar komunikasi asertif adalah: *tahu bahwa kamu perlu berbicara, tapi tidak tahu harus mulai dari mana.*\r\n\r\nDi sinilah **metode DESC** sangat membantu. Ini adalah kerangka empat langkah yang memberimu "skrip" untuk situasi yang sulit — bukan skrip yang kaku, tapi struktur yang memastikan pesanmu lengkap, jelas, dan tidak menyerang.\r\n\r\n---\r\n\r\n### D — Describe (Gambarkan Fakta)\r\n\r\nMulai dengan mendeskripsikan situasi secara objektif — apa yang terjadi, bukan interpretasimu tentang mengapa itu terjadi atau apa artinya tentang karakter seseorang.\r\n\r\n**Yang dihindari:** *"Kamu selalu telat kirim laporan dan itu sangat tidak profesional."*\r\n\r\n**Yang lebih baik:** *"Laporan minggu ini belum saya terima sampai pukul 17.00, padahal deadline yang kita sepakati adalah pukul 15.00."*\r\n\r\nPerbedaannya halus tapi dampaknya besar. Fakta tidak bisa diperdebatkan. Penilaian karakter langsung memicu defensivitas.\r\n\r\n---\r\n\r\n### E — Express (Ungkapkan Dampak)\r\n\r\nSetelah fakta, sampaikan apa dampaknya — pada pekerjaan, pada tim, atau pada perasaanmu sebagai rekan kerja. Ini bukan tentang curhat — ini tentang membuat pihak lain memahami *mengapa* hal ini penting.\r\n\r\n**Contoh:** *"Karena laporan belum ada, saya tidak bisa menyiapkan bahan presentasi ke manajemen sore ini, dan ini berpotensi mengganggu jadwal seluruh tim."*\r\n\r\nSampaikan dampak yang nyata dan terukur — bukan dramatisasi, bukan ancaman.\r\n\r\n---\r\n\r\n### S — Specify (Sampaikan Permintaan yang Jelas)\r\n\r\nIni adalah bagian yang paling sering dilewati — dan paling penting. Banyak orang menyampaikan masalah tanpa pernah dengan jelas meminta apa yang mereka inginkan.\r\n\r\n**Yang sering terjadi:** *"Ya pokoknya tolong lebih diperhatikan lagi..."*\r\n\r\n**Yang lebih efektif:** *"Saya minta laporan dikirimkan paling lambat pukul 20.00 malam ini sehingga masih bisa saya review sebelum besok."*\r\n\r\nPermintaan yang spesifik memberikan pihak lain sesuatu yang konkret untuk ditindaklanjuti.\r\n\r\n---\r\n\r\n### C — Consequences (Sampaikan Konsekuensi Positif)\r\n\r\nTutup dengan menggambarkan apa yang akan terjadi jika permintaanmu dipenuhi — bukan ancaman, tapi manfaat nyata bagi semua pihak.\r\n\r\n**Contoh:** *"Kalau laporannya ada malam ini, kita masih punya waktu untuk review bersama besok pagi sebelum presentasi, dan hasilnya bisa jauh lebih kuat."*\r\n\r\n---\r\n\r\n### Contoh DESC Lengkap dalam Satu Situasi\r\n\r\n**Situasi:** Anggota tim terus mengirim laporan rekrutmen tanpa menggunakan format yang sudah disepakati.\r\n\r\n> **D:** *"Dalam tiga minggu terakhir, laporan rekrutmen yang saya terima menggunakan format yang berbeda-beda — tidak mengikuti template yang sudah kita buat bersama."*\r\n>\r\n> **E:** *"Ini membuat saya harus mereformat data setiap minggu sebelum bisa dilaporkan ke manajemen, dan waktu yang terbuang cukup signifikan."*\r\n>\r\n> **S:** *"Mulai minggu depan, saya minta laporan dikirim menggunakan template yang sudah ada di folder shared. Kalau ada bagian yang membingungkan, saya terbuka untuk mendiskusikannya sekarang."*\r\n>\r\n> **C:** *"Kalau formatnya konsisten, saya bisa langsung forward ke manajemen tanpa perlu editing lagi — dan kita semua hemat waktu."*\r\n\r\n---\r\n\r\nPerhatikan: tidak ada serangan personal. Tidak ada kata "selalu" atau "tidak pernah." Tidak ada nada defensif atau mengancam. Tapi pesannya sangat jelas — dan memberi ruang bagi pihak lain untuk merespons secara dewasa.\r\n\r\n---\r\n\r\n## 8. Menggabungkan Keduanya: Ketika Stakeholder Penting Meminta Hal yang Sulit\r\n\r\nKembali ke pertanyaan pembuka: seorang direktur tiba-tiba meminta perubahan besar pada rencana yang hampir final.\r\n\r\nSekarang kamu punya dua alat:\r\n\r\n**Dari pemetaan stakeholder:** Direktur ini berada di kuadran *Manage Closely* — High Power, High Interest. Artinya ia punya hak untuk dilibatkan, dan kamu perlu merespons dengan serius, bukan defensif.\r\n\r\n**Dari komunikasi asertif (DESC):**\r\n\r\n> **D:** *"Pak, saya sudah menerima masukan bahwa ada beberapa hal dalam rencana ini yang ingin diubah."*\r\n>\r\n> **E:** *"Beberapa perubahan yang disebutkan akan memengaruhi timeline dan anggaran yang sudah kita sepakati — dampaknya sekitar dua minggu tambahan dan potensi cost tambahan sekitar X."*\r\n>\r\n> **S:** *"Saya ingin meminta 30 menit untuk duduk bersama, memetakan perubahan mana yang paling prioritas, dan melihat apakah ada cara untuk mengakomodasinya tanpa menggeser seluruh jadwal."*\r\n>\r\n> **C:** *"Dengan cara ini kita bisa memastikan perubahan yang paling penting terakomodasi, sambil tetap menjaga momentum proyek yang sudah berjalan."*\r\n\r\nKamu tidak menyetujui mentah-mentah. Kamu tidak menolak. Kamu **membuka dialog berbasis fakta dan mencari jalan tengah yang masuk akal** — itulah inti dari komunikasi asertif dalam konteks stakeholder management.\r\n\r\n---\r\n\r\n## ✅ Ringkasan\r\n\r\n| Konsep | Yang Perlu Diingat |\r\n|---|---|\r\n| **Pemetaan Stakeholder** | Sebelum memulai inisiatif apapun, tanya: siapa yang perlu tahu, siapa yang bisa menghalangi, dan siapa yang perlu dilibatkan? |\r\n| **Manage Closely** | High Power + High Interest — update rutin, libatkan di keputusan kritis |\r\n| **Keep Satisfied** | High Power + Low Interest — jangan dikejutkan dengan keputusan besar |\r\n| **Keep Informed** | Low Power + High Interest — komunikasi transparan agar tidak jadi resistensi diam |\r\n| **Monitor** | Low Power + Low Interest — pantau, tidak perlu energi besar |\r\n| **Komunikasi Pasif** | Menghindari konflik, tapi masalah menumpuk dan kepercayaan diri terkikis |\r\n| **Komunikasi Agresif** | Orang menurut karena takut, bukan karena setuju — kepercayaan hancur perlahan |\r\n| **Komunikasi Asertif** | Jelas, langsung, berbasis fakta, menghormati dua arah |\r\n| **DESC** | Describe fakta → Express dampak → Specify permintaan → Consequences positif |\r\n\r\n---\r\n\r\n## 🔗 Koneksi ke Pelajaran Berikutnya\r\n\r\nPada pelajaran berikutnya — **Conflict Handling & Pengelolaan Ego Lintas Divisi** — kamu akan berhadapan dengan situasi yang lebih intens: ketika stakeholder tidak sekadar meminta perubahan, tapi secara aktif menolak, mengkritik, atau bahkan menyerang. Metode DESC dan pemahaman tentang posisi stakeholder dalam matriks Power-Interest akan menjadi fondasi penting untuk menavigasi situasi-situasi itu.\r\n\r\n---\r\n\r\n## 📝 Cek Pemahaman\r\n\r\nSebelum melanjutkan, jawab pertanyaan berikut:\r\n\r\n1. Pikirkan satu inisiatif HC yang sedang atau pernah kamu kerjakan di Vascomm. Coba petakan minimal empat stakeholder-nya ke dalam Matriks Power-Interest. Apakah ada stakeholder yang selama ini kamu abaikan atau tangani dengan pendekatan yang kurang tepat?\r\n\r\n2. Dari tiga gaya komunikasi — pasif, agresif, dan asertif — gaya mana yang paling sering kamu gunakan saat berhadapan dengan atasan? Saat berhadapan dengan rekan setingkat? Apakah ada perbedaannya, dan mengapa?\r\n\r\n3. Buat satu contoh percakapan menggunakan metode DESC untuk situasi berikut: seorang Lead divisi di Vascomm terus mengirimkan data karyawan yang tidak lengkap kepada tim HC, dan ini menghambat proses payroll setiap bulan.\r\n\r\n4. Dalam cerita tentang Maju Digital di awal pelajaran, kesalahan pemetaan stakeholder mana yang paling berdampak menurutmu? Apa yang seharusnya dilakukan tim HC di sana sejak awal?\r\n\r\n---\r\n\r\n*Pelajaran 3 dari 6  ·  Modul: Komunikasi Kepemimpinan & Pengelolaan Pemangku Kepentingan*\r\n*Program TDP HCM Successorship — PT Vascomm Solusi Teknologi*\r\nENDOFFILE\r\necho "Done"	\N	\N	60	2	2026-06-09 06:19:33.704	2026-06-09 10:44:37.76
cmq67xn02000204l4pq92ok74	cmq08teex000304l4865plfu7	Sinergi Target Bisnis dan Peran HC Fasilitator	TEXT	## Sinergi Target Bisnis dan Peran HC Fasilitator\r\n\r\n### Konsep ROFIQ dalam Manajemen Kinerja\r\n**ROFIQ** kerangka kerja integrasi performa. Fokus: hasil bisnis nyata. HC kelola manusia guna capai target organisasi. Orang gerak tepat, profit naik.\r\n\r\n### Mekanisme OKR (Objectives and Key Results)\r\nTarget butuh alat ukur tajam. **OKR** dorong transparansi dan ambisi.\r\n*   **Objectives (Tujuan)**: Arah besar. Inspiratif. Kualitatif. Contoh: "Jadi raja pasar retail digital".\r\n*   **Key Results (Hasil Kunci)**: Bukti angka. Kuantitatif. Batas waktu. Contoh: "Naikkan transaksi 30% pada Q4".\r\n\r\n**Siklus Kerja OKR:**\r\n1. **Set Target**: Pilih fokus utama (3-5 target).\r\n2. **Alignment**: Pastikan tim bawah dukung visi atas.\r\n3. **Tracking**: Cek progres rutin. Koreksi cepat jika meleset.\r\n\r\n### Peran HC Fasilitator\r\nHC bukan admin pasif. HC bertindak sebagai **Fasilitator**.\r\n*   **Strategic Partner**: Hubungkan kompetensi karyawan dengan kebutuhan pasar.\r\n*   **Coach Performance**: Ajari manajer cara beri umpan balik (feedback) efektif.\r\n*   **Culture Builder**: Ciptakan budaya kerja berbasis data dan performa tinggi.\r\n\r\n### Contoh Praktis Sinergi\r\n**Target Perusahaan**: Ekspansi layanan ke 5 kota baru.\r\n*   **Objective**: Dominasi jangkauan logistik nasional.\r\n*   **Key Result 1**: Rekrut 50 kurir lokal dalam 2 bulan.\r\n*   **Key Result 2**: Bangun 5 gudang distribusi baru dengan efisiensi biaya 10%.\r\n*   **Tindakan HC**: Percepat proses seleksi (Sourcing). Buat modul pelatihan standar operasional cepat (Onboarding).\r\n\r\n### Ringkasan Poin Kunci\r\n*   **Sinergi**: Pastikan semua divisi lari ke arah sama.\r\n*   **OKR**: Fokus pada hasil (outcome), bukan sekadar aktivitas (output).\r\n*   **Fasilitator**: HC bantu hapus hambatan kerja. Pastikan orang tepat di posisi tepat.\r\n\r\n**Langkah Berikut**: Evaluasi KPI individu terhadap capaian OKR departemen. Pastikan selaras.	\N	\N	30	2	2026-06-09 05:47:54.674	2026-06-09 05:50:46.77
cmq67xn5k000404l4e138nv0d	cmq08teex000304l4865plfu7	Simulasi: Penanganan Underperform dan Calibration Meeting	VIDEO	\N	https://www.youtube.com/watch?v=M_yWspRNt88	\N	10	4	2026-06-09 05:47:54.872	2026-06-09 06:17:37.112
cmq692cdh000304laim8zjs1v	cmq08teex000404l4x88vxdpi	Manajemen Konflik & Penyelarasan Divisi	TEXT	# Manajemen Konflik & Penyelarasan Divisi\r\n\r\n**Modul:** Komunikasi Kepemimpinan & Pengelolaan Pemangku Kepentingan\r\n**Durasi estimasi:** 45 menit\r\n**Tipe:** Materi Teks\r\n\r\n---\r\n\r\n## 🎯 Tujuan Pembelajaran\r\n\r\nSetelah menyelesaikan pelajaran ini, kamu akan mampu:\r\n\r\n1. Mengidentifikasi akar penyebab konflik antar divisi — bukan hanya gejalanya\r\n2. Memilih strategi penanganan konflik yang tepat menggunakan **Model Thomas-Kilmann** sesuai situasi\r\n3. Memimpin proses penyelarasan antar divisi yang sedang berjalan di arah berbeda\r\n4. Memfasilitasi resolusi konflik secara sistematis — dari identifikasi masalah hingga kesepakatan tertulis\r\n\r\n---\r\n\r\n## 📌 Pertanyaan Pembuka\r\n\r\n> Pernah tidak kamu berada di tengah-tengah dua divisi yang saling berselisih, dan kamu harus jadi jembatannya?\r\n>\r\n> Atau mungkin kamu sendiri pernah berkonflik dengan divisi lain — masing-masing merasa benar, masing-masing punya alasan yang masuk akal, tapi tidak ada titik temu?\r\n>\r\n> **Apa yang biasanya kamu lakukan dalam situasi seperti itu?**\r\n> Apakah kamu masuk dan mencoba menengahi? Menghindar dan berharap masalahnya selesai sendiri?\r\n> Atau memilih satu pihak karena kamu lebih dekat dengan mereka?\r\n\r\nTidak ada jawaban yang salah untuk pertanyaan itu — tapi setelah pelajaran ini, kamu akan memiliki *pilihan* yang jauh lebih kaya dari sebelumnya.\r\n\r\n---\r\n\r\n## 1. Sebuah Cerita: Ketika Dua Divisi Sama-Sama Merasa Benar\r\n\r\nDi sebuah startup teknologi yang sedang tumbuh cepat, tim HR dan tim Keuangan sudah tiga minggu tidak berbicara satu sama lain kecuali lewat email formal yang penuh kata-kata kaku.\r\n\r\nIni yang terjadi:\r\n\r\nTim HR sedang berada di bawah tekanan besar. Tiga posisi kunci di divisi Engineering kosong selama dua bulan, dan setiap minggu Lead Engineering mengeluh bahwa proyek terlambat karena kekurangan orang. HR sudah menemukan kandidat yang tepat, proses sudah di tahap final — dan kemudian tim Keuangan membekukan seluruh rekrutmen baru karena proyeksi cash flow kuartal berikutnya terlihat ketat.\r\n\r\nDari sudut pandang HR: *"Keuangan tidak mengerti bahwa keterlambatan rekrutmen berdampak langsung pada pendapatan. Mereka hanya melihat angka, tidak melihat dampak operasional."*\r\n\r\nDari sudut pandang Keuangan: *"HR tidak mengerti bahwa jika kita merekrut sekarang, kita bisa kehabisan dana operasional bulan depan. Mereka hanya melihat kebutuhan tim, tidak melihat risiko finansial perusahaan."*\r\n\r\nDua tim. Dua realitas. Keduanya benar dari perspektif masing-masing.\r\n\r\n---\r\n\r\nDan di sinilah masalah sebenarnya muncul: **konflik ini bukan soal siapa yang lebih pintar atau lebih peduli pada perusahaan. Ini soal dua fungsi yang memiliki tujuan berbeda, metrik berbeda, dan tekanan yang berbeda — tapi tidak pernah duduk bersama untuk menemukan jalan keluar yang mempertimbangkan keduanya.**\r\n\r\nTanpa seseorang yang memahami cara mengelola konflik ini, perusahaan akan terus kehilangan waktu, energi, dan hubungan antar tim yang sebenarnya sangat berharga.\r\n\r\n---\r\n\r\n## 2. Mengapa Konflik di Organisasi Itu Tidak Bisa Dihindari\r\n\r\nSebelum membahas cara mengatasinya, ada satu hal penting yang perlu diluruskan: **konflik bukan tanda bahwa ada yang salah dengan organisasimu.** Konflik adalah gejala bahwa organisasimu *hidup* — ada orang-orang yang peduli, yang punya pendapat, dan yang berjuang untuk apa yang mereka yakini benar.\r\n\r\nYang menjadi masalah bukan konfliknya. Yang menjadi masalah adalah ketika konflik dibiarkan tidak terselesaikan, atau diselesaikan dengan cara yang merusak hubungan jangka panjang.\r\n\r\n### Tiga Akar Paling Umum Konflik Antar Divisi\r\n\r\n**① Perebutan Sumber Daya yang Terbatas**\r\n\r\nTidak ada perusahaan — termasuk yang paling sehat finansialnya sekalipun — yang memiliki sumber daya tak terbatas. Anggaran, waktu, tenaga orang, perhatian manajemen — semua terbatas.\r\n\r\nKetika dua divisi sama-sama membutuhkan sumber daya yang sama dalam waktu yang bersamaan, konflik hampir tidak bisa dihindari. Bukan karena orang-orangnya egois, tapi karena masing-masing merasa bahwa kebutuhan divisinya adalah yang paling mendesak — dan dari perspektif mereka, mungkin memang benar.\r\n\r\n**② Tujuan yang Saling Bertentangan**\r\n\r\nIni adalah akar yang paling sering tidak disadari. Setiap divisi diukur dengan metrik yang berbeda, dan terkadang metrik-metrik itu secara alami bergesekan satu sama lain.\r\n\r\nTim Sales diukur dari seberapa cepat mereka menutup deal — jadi mereka mendorong janji-janji fitur ke klien sesegera mungkin. Tim Product diukur dari kualitas dan stabilitas — jadi mereka butuh waktu untuk memastikan fitur benar-benar siap. Kedua tim bekerja keras. Keduanya tidak salah. Tapi tujuan mereka menarik ke arah yang berlawanan.\r\n\r\n**③ Komunikasi yang Rusak atau Tidak Ada**\r\n\r\nTerkadang konflik tidak berawal dari perbedaan kepentingan yang nyata — tapi dari asumsi yang tidak pernah diklarifikasi, informasi yang tidak sampai ke orang yang tepat, atau keputusan yang dibuat tanpa melibatkan pihak yang terdampak.\r\n\r\nIni adalah jenis konflik yang paling "sia-sia" karena sebenarnya bisa dicegah — tapi justru karena terasa sepele, sering dibiarkan sampai membesar.\r\n\r\n---\r\n\r\n## 3. Model Thomas-Kilmann: Lima Cara Merespons Konflik\r\n\r\nKenneth Thomas dan Ralph Kilmann mengembangkan sebuah model yang menggambarkan bahwa ketika menghadapi konflik, seseorang bisa merespons dengan lima cara berbeda — masing-masing dengan tingkat ketegasan (*assertiveness*) dan tingkat kooperasi (*cooperativeness*) yang berbeda.\r\n\r\nTidak ada satu cara yang selalu terbaik. **Yang terbaik adalah yang paling sesuai dengan situasi** — dan pemimpin yang matang adalah yang tahu kapan menggunakan masing-masing.\r\n\r\n---\r\n\r\nMari kita kenali kelima cara ini melalui satu situasi yang sama: **kamu (sebagai HC) dan Lead Engineering tidak sepakat soal timeline rekrutmen posisi kritis.**\r\n\r\n---\r\n\r\n### 1. Competing (Bersaing) — "Saya yang benar, dan saya akan mempertahankan posisi ini"\r\n\r\n*Assertiveness tinggi, Cooperativeness rendah*\r\n\r\nKamu bersikeras pada posisimu. Kamu meyakini bahwa rekrutmen harus dimulai sekarang, dan kamu tidak akan bergerak dari situ.\r\n\r\n**Kapan ini tepat digunakan:**\r\nSituasi darurat yang membutuhkan keputusan cepat dan konsekuensinya serius jika tertunda. Atau saat kamu memegang informasi kritis yang tidak dimiliki pihak lain, dan kamu yakin 100% bahwa ini adalah jalur yang benar.\r\n\r\n**Kapan ini berbahaya:**\r\nJika digunakan terlalu sering, orang akan berhenti membawa pendapat mereka kepadamu — karena mereka tahu pendapatnya tidak akan pernah didengar. Hubungan jangka panjang bisa rusak.\r\n\r\n**Contoh:** *Kebijakan kepatuhan hukum sedang dilanggar dan butuh dihentikan segera, tanpa ruang untuk negosiasi.*\r\n\r\n---\r\n\r\n### 2. Collaborating (Berkolaborasi) — "Mari kita temukan solusi yang benar-benar memuaskan kedua pihak"\r\n\r\n*Assertiveness tinggi, Cooperativeness tinggi*\r\n\r\nKamu dan Lead Engineering sama-sama duduk, membuka semua kartu di atas meja — apa yang masing-masing pihak butuhkan, apa yang bisa difleksibel, apa yang tidak bisa bergerak — dan bersama-sama merancang solusi yang memenuhi kebutuhan inti keduanya.\r\n\r\n**Kapan ini tepat digunakan:**\r\nMasalah yang kompleks dan penting, di mana solusi terbaik membutuhkan input dari kedua belah pihak. Atau ketika hubungan dengan pihak tersebut sangat penting untuk jangka panjang.\r\n\r\n**Kapan ini tidak praktis:**\r\nSaat waktu sangat terbatas, atau saat konfliknya sepele dan tidak worth investasi waktu sebesar itu.\r\n\r\n**Contoh:** *Merancang ulang proses rekrutmen agar lebih sesuai dengan kebutuhan Engineering, tanpa mengorbankan standar HC.*\r\n\r\n---\r\n\r\n### 3. Compromising (Berkompromi) — "Kita masing-masing memberikan sedikit, dan kita masing-masing mendapatkan sedikit"\r\n\r\n*Assertiveness menengah, Cooperativeness menengah*\r\n\r\nKamu dan Lead Engineering setuju untuk bertemu di tengah. Rekrutmen tidak dimulai sekarang, tapi tidak juga ditunda tiga bulan. Mungkin dua posisi dulu, bukan tiga sekaligus.\r\n\r\n**Kapan ini tepat digunakan:**\r\nSaat solusi ideal tidak mungkin dicapai karena keterbatasan waktu atau sumber daya, dan kedua pihak perlu bergerak maju. Atau saat kedua pihak punya kekuatan yang setara dan tidak ada satu pun yang bisa "menang" tanpa biaya yang terlalu besar.\r\n\r\n**Yang perlu diperhatikan:**\r\nKompromi berarti tidak ada yang benar-benar puas — keduanya memberikan sesuatu. Ini bukan solusi terbaik, tapi seringkali solusi yang paling *workable* dalam kondisi yang tidak sempurna.\r\n\r\n**Contoh:** *Rekrut 2 dari 5 posisi yang diminta bulan ini, sisanya akan dievaluasi ulang bulan depan berdasarkan kondisi anggaran.*\r\n\r\n---\r\n\r\n### 4. Avoiding (Menghindar) — "Saya tidak akan membahas ini sekarang"\r\n\r\n*Assertiveness rendah, Cooperativeness rendah*\r\n\r\nKamu memutuskan untuk tidak mengangkat isu ini — setidaknya untuk saat ini.\r\n\r\n**Kapan ini tepat digunakan:**\r\nIsu yang benar-benar sepele dan tidak worth energi untuk diperdebatkan. Atau saat kamu butuh waktu untuk mengumpulkan informasi lebih lengkap sebelum bisa berdiskusi dengan baik. Atau saat emosi sedang terlalu tinggi dan percakapan produktif tidak akan mungkin terjadi saat itu.\r\n\r\n**Kapan ini berbahaya:**\r\nJika digunakan sebagai strategi default untuk semua konflik — masalah tidak hilang, hanya tertunda, dan sering tumbuh menjadi lebih besar.\r\n\r\n**Contoh:** *Di tengah rapat yang sudah tegang, kamu memilih untuk tidak menambahkan poin kontroversial — dan menyimpannya untuk diskusi terpisah yang lebih tenang.*\r\n\r\n---\r\n\r\n### 5. Accommodating (Mengakomodasi) — "Oke, kita ikuti cara kamu"\r\n\r\n*Assertiveness rendah, Cooperativeness tinggi*\r\n\r\nKamu memilih untuk mengalah dan mengikuti keinginan Lead Engineering — mungkin kamu menunda rekrutmen meskipun kamu tidak sepenuhnya setuju.\r\n\r\n**Kapan ini tepat digunakan:**\r\nSaat kamu menyadari bahwa kamu salah dan pihak lain benar. Atau saat isu ini jauh lebih penting bagi mereka daripada bagimu. Atau saat menjaga hubungan lebih penting dari menang dalam perdebatan ini.\r\n\r\n**Kapan ini berbahaya:**\r\nJika kamu selalu mengakomodasi, orang akan berhenti menganggap serius batasanmu — dan kebutuhan timmu tidak akan pernah terpenuhi.\r\n\r\n**Contoh:** *Kamu setuju menunda rekrutmen satu bulan karena kamu menyadari bahwa data cash flow yang baru dibagikan Finance memang menunjukkan risiko yang lebih besar dari yang kamu pahami sebelumnya.*\r\n\r\n---\r\n\r\n### Ringkasan Kapan Menggunakan Masing-Masing\r\n\r\n| Strategi | Gunakan saat... | Hindari saat... |\r\n|---|---|---|\r\n| **Competing** | Keputusan darurat, prinsip tidak bisa dikompromikan | Konflik rutin sehari-hari, butuh kolaborasi jangka panjang |\r\n| **Collaborating** | Masalah kompleks, hubungan jangka panjang penting | Waktu sangat terbatas, isu kecil |\r\n| **Compromising** | Perlu solusi cepat, tidak ada pemenang mutlak | Bisa menemukan solusi yang benar-benar baik jika mau berinvestasi waktu |\r\n| **Avoiding** | Isu sepele, perlu waktu cooling down | Masalah penting yang akan semakin besar jika didiamkan |\r\n| **Accommodating** | Kamu salah, hubungan lebih penting dari isu ini | Selalu — jadi pola default yang melemahkan posisimu |\r\n\r\n---\r\n\r\n## 4. Penyelarasan Divisi: Lebih dari Sekadar Rapat Bersama\r\n\r\nMenyelesaikan konflik yang sudah terjadi itu penting. Tapi lebih penting lagi adalah menciptakan kondisi di mana konflik destruktif jarang terjadi sejak awal — dan ini adalah inti dari **penyelarasan divisi** (*alignment*).\r\n\r\nAlignment bukan berarti semua divisi selalu setuju satu sama lain. Itu tidak realistis dan bahkan tidak sehat. Alignment artinya **semua divisi memahami arah besar yang sama, dan bagaimana kontribusi masing-masing menggerakkan perusahaan ke sana.**\r\n\r\nBayangkan sebuah tim dayung. Setiap pendayung punya peran berbeda, kekuatan berbeda, posisi berbeda di perahu. Tapi semua mendayung ke arah yang sama, dengan ritme yang selaras. Konflik tidak berasal dari perbedaan peran — konflik terjadi ketika ada yang mendayung ke arah yang berlawanan karena tidak tahu (atau tidak setuju dengan) tujuan akhirnya.\r\n\r\n---\r\n\r\n### Tiga Pilar Penyelarasan yang Efektif\r\n\r\n**① Shared Vision — Semua Orang Harus Tahu "Mengapa"**\r\n\r\nKaryawan dan pemimpin divisi yang hanya tahu *apa* yang harus mereka kerjakan, tanpa memahami *mengapa* itu penting dalam konteks perusahaan yang lebih besar, adalah sumber gesekan yang terus-menerus.\r\n\r\nKetika seseorang memahami bahwa penundaan rekrutmen berdampak langsung pada kemampuan perusahaan untuk melayani klien — dan kemampuan melayani klien berdampak pada revenue yang menentukan kelangsungan semua pekerjaan — percakapan soal anggaran rekrutmen menjadi jauh berbeda. Bukan lagi "HR vs Finance", tapi "bagaimana kita bisa sama-sama mencapai tujuan perusahaan?"\r\n\r\n**② Cross-Functional Meeting yang Substansif**\r\n\r\nRapat antar divisi yang efektif bukan rapat status update yang bisa digantikan email. Ini adalah forum di mana perwakilan dari divisi yang berbeda duduk bersama untuk:\r\n- Memahami prioritas dan tekanan yang dihadapi divisi lain\r\n- Mengidentifikasi dependensi: "Apa yang timmu butuhkan dari timku untuk bisa bergerak maju?"\r\n- Menyelesaikan gesekan sebelum menjadi konflik terbuka\r\n- Menemukan peluang kolaborasi yang tidak terlihat ketika bekerja dalam silo\r\n\r\nKuncinya adalah *regularitas* dan *substansi* — rapat yang terjadi setiap bulan tapi tidak pernah menghasilkan keputusan konkret tidak lebih baik dari tidak ada rapat sama sekali.\r\n\r\n**③ KPI yang Saling Mendukung**\r\n\r\nIni adalah aspek yang paling sering diabaikan dan paling kuat dampaknya. Ketika KPI antar divisi tidak selaras — atau lebih buruk, ketika KPI satu divisi bisa dicapai dengan cara yang merugikan divisi lain — konflik struktural hampir tidak bisa dihindari.\r\n\r\nSebagai HC Strategic, salah satu kontribusi terbesarmu adalah membantu memastikan bahwa sistem pengukuran kinerja mendorong kolaborasi, bukan kompetisi antar divisi. Misalnya: jika tim Sales dan tim Product sama-sama memiliki metrik yang berkaitan dengan kepuasan klien, keduanya punya insentif untuk bekerja sama — bukan saling menyalahkan saat ada masalah.\r\n\r\n---\r\n\r\n## 5. Lima Langkah Memfasilitasi Resolusi Konflik Antar Divisi\r\n\r\nKetika konflik sudah terjadi dan perlu diselesaikan, berikut adalah proses yang terstruktur untuk memfasilitasinya — terutama relevan untuk Rofiq yang akan semakin sering diminta menjadi jembatan antar fungsi:\r\n\r\n---\r\n\r\n**Langkah 1 — Identifikasi Inti Perselisihan, Bukan Posisi**\r\n\r\nIni adalah langkah yang paling sering terlewati. Orang cenderung datang ke meja perundingan dengan *posisi* mereka ("saya mau rekrut 10 orang") — tapi di balik setiap posisi, ada *kepentingan* yang lebih dalam yang sebenarnya mendorong posisi itu ("saya butuh proyek tidak terlambat lagi").\r\n\r\nSebelum mencari solusi, pastikan kamu benar-benar memahami kepentingan di balik posisi masing-masing pihak. Tanyakan: *"Apa yang sebenarnya paling penting bagimu dalam situasi ini?"* — dan dengarkan jawabannya dengan sungguh-sungguh.\r\n\r\n---\r\n\r\n**Langkah 2 — Kumpulkan Perwakilan, Bukan Seluruh Tim**\r\n\r\nRapat resolusi konflik yang efektif adalah rapat kecil — idealnya dua hingga tiga orang dari masing-masing pihak, dipilih karena mereka memiliki wewenang untuk membuat komitmen dan kemampuan untuk mendiskusikan isu secara konstruktif.\r\n\r\nHindari mengundang seluruh tim — ini akan membuat situasi menjadi terlalu politis, di mana orang merasa perlu "perform" di depan rekan-rekannya alih-alih benar-benar mencari solusi.\r\n\r\nPilih tempat yang netral — bukan di ruang salah satu pihak.\r\n\r\n---\r\n\r\n**Langkah 3 — Peta Dampak pada Tujuan Perusahaan**\r\n\r\nSebelum masuk ke solusi, buat semua orang yang hadir memahami satu hal: *apa dampak dari konflik ini pada tujuan yang lebih besar?*\r\n\r\nKetika diskusi berpusat pada "siapa yang benar" atau "siapa yang harus mengalah," energi terbuang pada ego. Ketika diskusi berpusat pada "apa yang terjadi pada perusahaan jika ini tidak diselesaikan," energi berpindah ke arah yang produktif.\r\n\r\nSampaikan data: berapa biaya posisi yang kosong? Berapa risiko jika anggaran habis di tengah kuartal? Buat konsekuensi menjadi nyata dan terukur.\r\n\r\n---\r\n\r\n**Langkah 4 — Brainstorm Solusi yang Memenuhi Kebutuhan Inti**\r\n\r\nSetelah semua pihak memahami kepentingan masing-masing dan dampak konflik pada perusahaan, saatnya mencari solusi. Mulai dengan brainstorm terbuka — tidak ada penghakiman dulu, semua opsi diletakkan di atas meja.\r\n\r\nKemudian evaluasi bersama: solusi mana yang paling memenuhi kebutuhan inti masing-masing pihak? Tidak harus sempurna untuk semua orang — tapi harus bisa diterima oleh semua orang.\r\n\r\n---\r\n\r\n**Langkah 5 — Dokumentasikan dan Tetapkan Tanggal Tindak Lanjut**\r\n\r\nKesepakatan lisan yang tidak didokumentasikan adalah undangan untuk konflik berikutnya. Setelah solusi ditemukan, tulis:\r\n- Apa yang disepakati\r\n- Siapa yang bertanggung jawab atas apa\r\n- Kapan masing-masing komitmen akan dipenuhi\r\n- Kapan kita akan bertemu lagi untuk mengevaluasi apakah solusinya berjalan\r\n\r\nLangkah terakhir ini — tanggal tindak lanjut — sering dilewati, padahal justru ini yang memastikan komitmen benar-benar dijalankan, bukan hanya tertulis di atas kertas.\r\n\r\n---\r\n\r\n## 6. Kembali ke Cerita Awal: HR vs Keuangan\r\n\r\nIngat dua divisi yang tidak berbicara satu sama lain di awal pelajaran ini?\r\n\r\nSetelah tiga minggu, HC Manager akhirnya memutuskan untuk memfasilitasi pertemuan resolusi. Ini yang terjadi:\r\n\r\nDalam pertemuan itu, terungkap bahwa ketakutan utama tim Keuangan bukan soal tidak ingin merekrut — tapi soal ketidakpastian: mereka tidak tahu persis berapa total biaya yang akan timbul jika 10 posisi direkrut sekaligus, dan dalam kondisi cash flow yang ketat, ketidakpastian itu terasa terlalu berisiko.\r\n\r\nSementara tim HR, ketika ditanya lebih dalam, mengakui bahwa dari 10 posisi itu, sebenarnya hanya 3 yang benar-benar kritis untuk proyek yang sedang berjalan. Tujuh lainnya penting, tapi bisa ditunda dua hingga tiga bulan tanpa dampak langsung pada deliverable.\r\n\r\nDengan informasi yang lebih lengkap itu, solusinya muncul sendiri: rekrut 3 posisi kritis sekarang dengan anggaran yang sudah pasti, buat proposal tertulis untuk 7 posisi lainnya yang bisa dikaji ulang di awal kuartal berikutnya.\r\n\r\nTidak ada yang "menang". Tidak ada yang "kalah". Keduanya mendapatkan apa yang sebenarnya mereka butuhkan — bukan apa yang awalnya mereka minta.\r\n\r\n---\r\n\r\n> **Konflik yang diselesaikan dengan baik tidak menghasilkan pemenang dan pecundang. Ia menghasilkan pemahaman yang lebih dalam tentang kebutuhan satu sama lain — dan hubungan yang justru lebih kuat dari sebelum konflik terjadi.**\r\n\r\n---\r\n\r\n## ✅ Ringkasan\r\n\r\n| Konsep | Yang Perlu Diingat |\r\n|---|---|\r\n| **Akar Konflik** | Sumber daya terbatas, tujuan berbeda, komunikasi yang rusak — semuanya normal, semuanya bisa dikelola |\r\n| **Competing** | Tepat saat darurat atau prinsip tidak bisa dikompromikan — berbahaya jika jadi kebiasaan |\r\n| **Collaborating** | Solusi terbaik untuk masalah kompleks dan hubungan jangka panjang — butuh waktu dan kepercayaan |\r\n| **Compromising** | Solusi praktis saat tidak ada pemenang mutlak — keduanya memberi dan mendapat sedikit |\r\n| **Avoiding** | Berguna untuk cooling down atau isu sepele — berbahaya jika digunakan untuk semua konflik |\r\n| **Accommodating** | Tepat saat kamu salah atau hubungan lebih penting — berbahaya jika selalu jadi pilihan default |\r\n| **Alignment** | Bukan soal selalu setuju — tapi semua bergerak ke arah yang sama |\r\n| **5 Langkah Resolusi** | Identifikasi kepentingan → kumpulkan perwakilan → peta dampak → brainstorm → dokumentasikan |\r\n\r\n---\r\n\r\n## 🔗 Koneksi ke Pelajaran Berikutnya\r\n\r\nPada pelajaran berikutnya — **Framework Piramida & Update Manajemen** — kamu akan mempelajari bagaimana menyusun dan menyampaikan informasi kepada manajemen dengan struktur yang memudahkan mereka mengambil keputusan. Kemampuan menavigasi konflik antar divisi yang baru kamu pelajari akan sangat relevan di sana — karena seringkali, update ke manajemen justru terjadi *di tengah* konflik yang belum selesai, dan cara kamu menyampaikannya akan menentukan apakah manajemen mendukungmu atau tidak.\r\n\r\n---\r\n\r\n## 📝 Cek Pemahaman\r\n\r\nSebelum melanjutkan, jawab pertanyaan berikut:\r\n\r\n1. Dari lima strategi Thomas-Kilmann, strategi mana yang paling sering kamu gunakan secara default — bahkan tanpa kamu sadari? Apa konsekuensinya selama ini?\r\n\r\n2. Pikirkan satu konflik antar divisi yang pernah kamu saksikan atau alami di Vascomm. Akar masalahnya masuk ke kategori yang mana — sumber daya, tujuan berbeda, atau komunikasi yang rusak? Apakah penyelesaiannya sudah menyentuh akar itu?\r\n\r\n3. Dalam cerita HR vs Keuangan di akhir pelajaran, apa yang berubah ketika keduanya akhirnya duduk bersama? Apa yang sebelumnya tidak mereka ketahui tentang satu sama lain?\r\n\r\n4. Jika kamu diminta memfasilitasi sesi resolusi konflik antara dua divisi di Vascomm minggu depan — divisi mana yang paling mungkin terlibat, dan langkah pertama apa yang akan kamu lakukan?\r\n\r\n---\r\n\r\n*Pelajaran 2 dari 6  ·  Modul: Komunikasi Kepemimpinan & Pengelolaan Pemangku Kepentingan*\r\n*Program TDP HCM Successorship — PT Vascomm Solusi Teknologi*	\N	\N	45	3	2026-06-09 06:19:33.797	2026-06-10 06:40:15.73
cmq82szmf000404kwympddvqe	cmq08teex000504l48tgf5ixm	Penyelarasan Wewenang & Batas Eksekusi	VIDEO	\N	https://www.youtube.com/watch?v=dyoOIIaACcE	\N	6	4	2026-06-10 12:59:52.023	2026-06-12 01:20:18.872
cmqa8qikv000104jso3fyin67	cmq08teey000604l4pxptoagn	Ownership Mentality: Perbedaan Executor vs Owner	VIDEO	\N	\N	\N	\N	1	2026-06-12 01:21:26.671	2026-06-12 01:21:26.671
cmq692c8b000104la9oo5dtve	cmq08teex000404l4x88vxdpi	Framework Piramida & Update Manajemen	TEXT	# Framework Piramida & Update Manajemen\r\n \r\n**Modul:** ROFIQ – Komunikasi Kepemimpinan & Pengelolaan Pemangku Kepentingan\r\n**Durasi estimasi:** 45 menit\r\n**Tipe:** Materi Teks\r\n \r\n---\r\n \r\n## 🎬 Sebelum Mulai: Sebuah Cerita Nyata\r\n \r\nBayangkan situasi ini.\r\n \r\nHari Senin pagi. Direktur kamu baru selesai rapat panjang dan membuka WhatsApp. Ada pesan darimu — update progres rekrutmen yang sudah kamu tulis dengan sangat teliti semalam.\r\n \r\nPesannya panjang. Sangat panjang.\r\n \r\nKamu mulai dengan menjelaskan konteks proyek rekrutmen sejak tiga bulan lalu. Lalu proses screening yang sudah dilakukan. Lalu tantangan yang muncul. Lalu hasil wawancara tahap pertama. Lalu koordinasi dengan user. Baru di paragraf keenam — kamu menyebut bahwa dari 8 kandidat, hanya 2 yang lolos ke tahap final.\r\n \r\nDirekturmu membaca sampai paragraf ketiga. Lalu menutup WhatsApp.\r\n \r\nPesanmu tidak pernah dibalas.\r\n \r\n---\r\n \r\n**Apa yang sebenarnya terjadi?**\r\n \r\nBukan karena direkturmu tidak peduli. Bukan karena pesanmu tidak penting.\r\n \r\nTapi karena **otak manusia — termasuk otak para pemimpin sibuk — tidak dirancang untuk mencari jarum di tumpukan jerami.** Ketika informasi penting terkubur di tengah atau akhir pesan, pembaca sering tidak sampai ke sana.\r\n \r\nInilah masalah yang dipecahkan oleh **Framework Piramida Minto** — sebuah prinsip komunikasi yang sudah digunakan konsultan McKinsey, eksekutif Fortune 500, dan kini akan menjadi senjata utamamu sebagai HC Strategic.\r\n \r\n---\r\n \r\n## 1. Apa Itu Framework Piramida Minto?\r\n \r\nDi tahun 1970-an, Barbara Minto — seorang konsultan McKinsey — menyadari satu masalah besar: laporan bisnis yang bagus secara isi sering kali gagal menggerakkan pembaca untuk mengambil keputusan.\r\n \r\nPenyebabnya bukan kontennya. Tapi **urutannya**.\r\n \r\nKebanyakan orang berkomunikasi seperti detektif yang sedang bercerita: *"Pertama kami menemukan ini, lalu kami analisis itu, lalu kami menemukan masalah, dan akhirnya... kesimpulannya adalah..."*\r\n \r\nPadahal audiens — terutama manajemen — berpikir seperti hakim, bukan penonton film misteri. Mereka ingin tahu **vonisnya dulu**, baru minta penjelasan kalau diperlukan.\r\n \r\n**Prinsip Piramida Minto membalik urutan itu.**\r\n \r\n> 💡 **Inti prinsipnya sederhana:** Sampaikan kesimpulan di awal. Baru dukung dengan argumen. Baru dukung argumen dengan data.\r\n \r\nVisualnya seperti ini:\r\n \r\n```\r\n          ▲\r\n         /|\\\r\n        / | \\\r\n       /  |  \\\r\n      / PUNCAK \\        ← KESIMPULAN atau REKOMENDASI UTAMA\r\n     /___________\\\r\n    /             \\\r\n   /    TENGAH     \\    ← 2–3 ARGUMEN PENDUKUNG\r\n  /_________________\\\r\n /                   \\\r\n/       DASAR         \\  ← FAKTA, ANGKA, BUKTI TEKNIS\r\n/_____________________ \\\r\n```\r\n \r\n---\r\n \r\n## 2. Tiga Lapisan Piramida — dan Cara Membangunnya\r\n \r\n### 🔺 Puncak: *The Answer* — Jawab Dulu, Jelaskan Kemudian\r\n \r\nLapisan puncak adalah **satu kalimat yang menjawab pertanyaan terbesar di kepala audiens.**\r\n \r\nPertanyaan itu selalu sama: *"Jadi, apa kesimpulannya? Apa yang kamu rekomendasikan? Apa yang perlu aku putuskan?"*\r\n \r\nPuncak piramida harus bisa berdiri sendiri. Kalau audiens hanya membaca satu kalimat pertamamu dan langsung menutup dokumen, mereka tetap mendapat informasi terpenting.\r\n \r\n**Contoh puncak yang lemah:**\r\n> *"Dalam rangka menindaklanjuti proses rekrutmen yang telah berlangsung selama tiga bulan terakhir, berikut ini kami sampaikan update perkembangan..."*\r\n \r\n**Contoh puncak yang kuat:**\r\n> *"Dari 8 kandidat, 2 siap untuk tahap final interview minggu ini dan kami rekomendasikan untuk segera dijadwalkan."*\r\n \r\nPerhatikan perbedaannya. Yang pertama memaksa pembaca menunggu. Yang kedua langsung memberi nilai.\r\n \r\n---\r\n \r\n### 🔷 Tengah: *Supporting Arguments* — Tiga Pilar yang Menopang\r\n \r\nSetelah kesimpulan disampaikan, audiens yang penasaran akan bertanya: *"Mengapa kamu sampai pada kesimpulan itu?"*\r\n \r\nDi sinilah **argumen pendukung** berperan. Ini adalah kelompok-kelompok ide yang secara logis menopang kesimpulan di puncak.\r\n \r\nAda satu aturan emas di sini: **kelompokkan maksimal tiga argumen utama.**\r\n \r\nBukan karena tiga itu angka ajaib. Tapi karena riset kognitif menunjukkan otak manusia hanya bisa memproses tiga hingga empat "chunk" informasi sekaligus dalam memori kerja. Lebih dari itu, informasi mulai tumpang tindih dan audiens kehilangan benang merahnya.\r\n \r\n**Cara mengelompokkan argumen:**\r\n- **Berdasarkan kategori** — misalnya: aspek teknis, aspek biaya, aspek SDM\r\n- **Berdasarkan waktu** — apa yang sudah terjadi, sedang terjadi, akan terjadi\r\n- **Berdasarkan masalah–solusi** — apa masalahnya, apa akar penyebabnya, apa rekomendasinya\r\n---\r\n \r\n### 🔹 Dasar: *Supporting Data* — Fakta yang Tidak Bisa Dibantah\r\n \r\nLapisan dasar adalah **bukti yang membuat argumenmu tidak bisa digoyahkan.**\r\n \r\nIni adalah tempat untuk angka, data, hasil survei, kutipan vendor, catatan meeting, log sistem, atau apapun yang bersifat faktual dan verifiable.\r\n \r\nTapi ada jebakan yang sering terjadi di sini: **menaruh terlalu banyak data di lapisan ini sampai mengaburkan argumen.**\r\n \r\nData yang baik bukan data yang banyak — tapi data yang **tepat sasaran**. Satu angka yang relevan lebih kuat dari sepuluh tabel yang membingungkan.\r\n \r\n> ⚠️ **Ingat:** Data adalah pelayan argumen, bukan bintang utamanya. Pilih data yang paling langsung membuktikan argumenmu, bukan semua data yang kamu punya.\r\n \r\n---\r\n \r\n## 3. Tiga Logika Penyusunan — Pilih yang Tepat untuk Situasimu\r\n \r\nPiramida bukan template kaku. Ada tiga cara menyusun ide di dalamnya, dan pilihan tergantung pada konteks komunikasimu.\r\n \r\n### Logika 1 — Top-Down: Untuk Audiens yang Sibuk\r\n \r\nKamu mulai dari jawaban, lalu turun ke argumen, lalu ke data. Ini adalah urutan yang paling sering digunakan dalam konteks bisnis modern karena **efisien dan menghormati waktu audiens.**\r\n \r\nKapan digunakan: *Saat audiens sudah familiar dengan konteks, butuh keputusan cepat, atau komunikasinya lewat tulisan (email, memo, laporan).*\r\n \r\n### Logika 2 — Grouping: Untuk Pesan yang Kompleks\r\n \r\nSebelum membangun piramida, kamu kumpulkan semua ide yang berserak, lalu kelompokkan berdasarkan kesamaan atau relevansi. Dari pengelompokan itulah argumen utama terbentuk.\r\n \r\nIni sangat berguna saat kamu punya banyak informasi tapi belum yakin apa kesimpulannya. Proses grouping memaksamu menemukan pola — dan pola itulah yang menjadi argumenmu.\r\n \r\n### Logika 3 — Logical Ordering: Untuk Narasi yang Mengalir\r\n \r\nKetika urutan penyampaian penting (misalnya menjelaskan proses, kronologi, atau prioritas), kamu perlu memastikan setiap argumen tersusun dalam urutan yang masuk akal.\r\n \r\nAda tiga jenis urutan yang sah:\r\n- **Kronologis** — berdasarkan waktu kejadian\r\n- **Struktural** — berdasarkan bagian-bagian dari suatu sistem (divisi, tahapan, dll.)\r\n- **Tingkat kepentingan** — dari yang paling kritis ke yang paling ringan\r\n---\r\n \r\n## 4. Mengapa HC Strategic Harus Menguasai Ini?\r\n \r\nKamu mungkin bertanya: *"Ini kan teknik komunikasi umum — apa hubungannya khusus dengan HC?"*\r\n \r\nJawabannya ada di posisi HC dalam organisasi.\r\n \r\nHC adalah fungsi yang **selalu berada di persimpangan**. Di satu sisi, HC mengelola hal-hal yang bersifat manusiawi dan nuansanya tinggi: konflik antarkaryawan, keputusan gaji, keluhan, pengembangan individu. Di sisi lain, HC harus mengkomunikasikan semua hal itu kepada manajemen yang berpikir dalam bahasa angka, efisiensi, dan risiko bisnis.\r\n \r\nTanpa kemampuan mengemas komunikasi dengan baik, HC mudah dipandang sebagai fungsi administratif yang "hanya laporan masalah tanpa solusi."\r\n \r\nDengan Framework Piramida, kamu bisa membalikkan persepsi itu. Setiap update yang kamu berikan menjadi sinyal bahwa HC tidak hanya tahu masalah — **tapi juga tahu ke mana bisnis harus bergerak.**\r\n \r\n---\r\n \r\n## 5. Framework ROFIQ — Lima Standar Pesan yang Tajam\r\n \r\nSelain struktur piramida, ada lima standar kualitas yang perlu kamu periksa sebelum mengirimkan update apapun kepada manajemen. Standar ini disingkat **ROFIQ** — menariknya, ini juga namamu, yang berarti setiap pesan yang kamu kirim harus benar-benar mencerminkan standar ini.\r\n \r\n### R — Relevant (Relevan)\r\nSetiap informasi yang kamu sertakan harus menjawab satu pertanyaan: *"Apakah ini penting bagi orang yang membacanya?"*\r\n \r\nUpdate tentang absensi karyawan tidak relevan untuk Direktur Teknis. Update tentang sistem rekrutmen relevan untuk CEO yang sedang merencanakan ekspansi tim. Mengenali perbedaan ini adalah kunci.\r\n \r\n### O — Objective (Berbasis Fakta)\r\nPesan yang kuat berdiri di atas fakta, bukan asumsi atau perasaan. *"Sepertinya karyawan kurang engaged"* berbeda jauh dengan *"Skor eNPS turun dari 45 ke 32 dalam dua bulan terakhir."*\r\n \r\nYang pertama mengundang debat. Yang kedua mengundang tindakan.\r\n \r\n### F — Focus (Terfokus)\r\nSetiap update punya satu tujuan utama. Kalau kamu mencoba menyampaikan terlalu banyak hal sekaligus, tidak ada yang benar-benar tersampaikan.\r\n \r\nTanya dirimu sebelum menulis: *"Satu hal paling penting yang ingin audiens ini ketahui setelah membaca pesanku adalah... apa?"* Jadikan itu puncak piramidamu.\r\n \r\n### I — Intuitive (Mudah Dicerna)\r\nFormat adalah bagian dari pesan. Teks panjang tanpa jeda visual memaksa otak bekerja lebih keras. Poin-poin yang terstruktur, tabel perbandingan, atau satu angka yang diberi highlight membantu audiens memproses informasi lebih cepat.\r\n \r\nBukan berarti semua harus penuh grafik — tapi pastikan **mata audiens tahu harus melihat ke mana** saat pertama kali membaca.\r\n \r\n### Q — Quality (Berkualitas Tinggi)\r\nSatu kesalahan angka dalam laporan HC bisa menghancurkan kepercayaan yang dibangun berbulan-bulan. Periksa fakta dua kali. Pastikan angka konsisten di seluruh dokumen. Hindari typo di nama atau jabatan — terutama ketika menyebut nama atasan atau stakeholder.\r\n \r\n---\r\n \r\n## 6. Lima Langkah Update Manajemen — dari Persiapan hingga Eksekusi\r\n \r\nSekarang kita gabungkan piramida dan standar ROFIQ ke dalam langkah konkret yang bisa kamu ikuti setiap kali perlu melaporkan sesuatu ke manajemen.\r\n \r\n### Langkah 1 — Kenali Profilnya Sebelum Menulis Satu Kata\r\n \r\nSebelum membuka laptop, jawab tiga pertanyaan ini:\r\n- *Siapa yang membaca ini, dan apa yang paling mereka pedulikan?*\r\n- *Apa keputusan yang mereka perlu ambil berdasarkan informasi ini?*\r\n- *Seberapa dalam mereka sudah mengetahui konteks situasinya?*\r\nSeorang CEO yang baru mendengar tentang masalah ini membutuhkan lebih banyak konteks. Seorang HC Manager yang sudah terlibat sehari-hari membutuhkan update singkat dan rekomendasi langsung.\r\n \r\n**Profiling audiens menentukan seberapa tinggi kamu bisa memulai piramida.**\r\n \r\n### Langkah 2 — Pilih Saluran yang Tepat\r\n \r\nTidak semua pesan cocok untuk semua saluran. Memilih saluran yang salah bisa membuat pesanmu terasa terlalu formal, terlalu santai, atau tidak terbaca sama sekali.\r\n \r\n| Jenis Pesan | Saluran yang Tepat |\r\n|---|---|\r\n| Update rutin progres | Pesan singkat (WhatsApp/Slack) dengan format poin |\r\n| Laporan insiden atau masalah serius | Email formal dengan subject line yang jelas |\r\n| Permintaan keputusan penting | Meeting langsung atau video call |\r\n| Informasi yang butuh dokumentasi | Email dengan lampiran dokumen |\r\n| Update cepat yang tidak mendesak | Pesan singkat, tidak perlu dibalas segera |\r\n \r\n### Langkah 3 — Susun Pesanmu dengan Struktur Piramida\r\n \r\nIni adalah inti dari langkah eksekusi. Sebelum mulai menulis, tuliskan dulu:\r\n \r\n1. **Kesimpulan/rekomendasiku adalah:** _(satu kalimat)_\r\n2. **Tiga alasan/argumen pendukungnya adalah:** _(tiga poin singkat)_\r\n3. **Data atau fakta yang mendukung argumen itu adalah:** _(spesifik dan terverifikasi)_\r\nBaru setelah outline ini jelas, tulis pesannya.\r\n \r\n### Langkah 4 — Sertakan Analisis Risiko Jika Ada Kendala\r\n \r\nUpdate yang jujur adalah update yang juga menyebut risiko. Jangan hanya melaporkan yang bagus-bagus. Tapi juga jangan hanya mengeluhkan masalah tanpa arah.\r\n \r\nFormula yang efektif: **Situasi → Risiko → Mitigasi yang sudah atau akan dilakukan.**\r\n \r\n*"Rekrutmen untuk posisi Lead Engineer berpotensi mundur 2 minggu karena kandidat terbaik sedang dalam notice period. Kami sudah menjadwalkan negosiasi awal pekan depan untuk mempercepat proses."*\r\n \r\n### Langkah 5 — Akhiri dengan Tindakan atau Keputusan yang Jelas\r\n \r\nIni adalah kesalahan paling umum dalam update manajemen: **melaporkan tanpa meminta apapun.**\r\n \r\nManajemen yang baik menunggu sinyal dari HC tentang apa yang dibutuhkan. Apakah ini sekadar informasi? Apakah butuh persetujuan? Apakah butuh eskalasi ke pihak lain?\r\n \r\nJadikan kalimat terakhirmu sebagai **call to action** yang spesifik:\r\n- *"Dimohon persetujuan untuk melanjutkan ke tahap offer."*\r\n- *"Tidak ada tindakan yang diperlukan saat ini — kami akan update kembali Jumat depan."*\r\n- *"Kami membutuhkan keputusan sebelum Rabu agar proses tidak terlambat lebih jauh."*\r\n---\r\n \r\n## 7. Piramida dalam Aksi — Studi Kasus HC Vascomm\r\n \r\nSekarang mari kita lihat bagaimana semua ini bekerja dalam situasi nyata yang mungkin kamu hadapi.\r\n \r\n**Situasinya:**\r\nSistem absensi baru yang seharusnya diluncurkan tanggal 8 Oktober harus ditunda. Kamu perlu mengabari Direktur.\r\n \r\n---\r\n \r\n**Versi Lama — Tanpa Piramida:**\r\n \r\n*"Halo Pak/Bu Direktur, ingin melaporkan perkembangan implementasi sistem absensi baru. Proses ini sudah kami mulai sejak awal September. Kami telah berkoordinasi dengan vendor PT Absenku selama tiga minggu terakhir untuk memastikan integrasi sistem berjalan baik. Dalam proses uji coba yang kami lakukan minggu lalu, kami menemukan beberapa kendala teknis. Tim IT melaporkan ada masalah pada integrasi API. Selain itu saat uji coba dengan karyawan, ditemukan bug pada modul pencatatan cuti. Vendor kemudian kami hubungi dan mereka menyampaikan membutuhkan waktu tambahan. Log error kami menunjukkan ada 15% kegagalan login saat uji coba. Dengan kondisi ini, kemungkinan besar tanggal peluncuran perlu diundur..."*\r\n \r\nPembaca harus sabar menunggu sampai kalimat terakhir baru tahu inti masalahnya.\r\n \r\n---\r\n \r\n**Versi Baru — Dengan Piramida:**\r\n \r\n> **🔺 Puncak:** Peluncuran sistem absensi diundur ke 15 Oktober (mundur 1 minggu) karena dua kendala teknis yang sudah dalam proses penyelesaian.\r\n \r\n> **🔷 Argumen 1:** Integrasi API vendor membutuhkan waktu tambahan — tim IT sedang dalam koordinasi intensif dengan PT Absenku.\r\n> **🔷 Argumen 2:** Uji coba internal menemukan bug pada modul pencatatan cuti yang berpotensi memengaruhi akurasi data.\r\n \r\n> **🔹 Data:** Log error menunjukkan 15% kegagalan login. Vendor telah mengkonfirmasi butuh 3 hari kerja tambahan untuk perbaikan. Uji coba ulang dijadwalkan 12 Oktober.\r\n \r\n> **📌 Tindakan yang dibutuhkan:** Tidak ada keputusan yang diperlukan saat ini. Update berikutnya akan dikirimkan 12 Oktober setelah uji coba ulang selesai.\r\n \r\n---\r\n \r\n**Apa yang berbeda?**\r\n \r\nDirekturmu membaca kalimat pertama dan langsung tahu: ada penundaan, seberapa lama, dan sudah ada penanganan. Jika mereka hanya punya 10 detik, mereka tetap mendapat informasi yang relevan. Jika mereka ingin tahu lebih dalam, argumen dan data sudah tersedia.\r\n \r\nItulah kekuatan piramida.\r\n \r\n---\r\n \r\n## 8. Kesalahan Paling Umum — dan Cara Menghindarinya\r\n \r\nSebelum kamu mulai menerapkan framework ini, waspadai empat jebakan yang sering terjadi:\r\n \r\n**Jebakan 1 — Piramida Terbalik:** Menyimpan kesimpulan di akhir karena takut "terkesan terburu-buru" atau ingin membangun cerita dulu. Di konteks bisnis, ini justru membuang waktu audiens.\r\n \r\n**Jebakan 2 — Terlalu Banyak Puncak:** Satu pesan punya dua atau tiga kesimpulan yang sama pentingnya. Pilih satu. Yang lain bisa menjadi argumen atau pesan terpisah.\r\n \r\n**Jebakan 3 — Data Tanpa Konteks:** Menyebut angka tanpa menjelaskan artinya. *"15% kegagalan login"* harus selalu diikuti dengan *"artinya 1 dari 7 karyawan tidak bisa login pada hari pertama"* — agar audiens langsung paham dampaknya.\r\n \r\n**Jebakan 4 — Lupa Call to Action:** Update tanpa penutup yang jelas membuat audiens bingung apakah mereka perlu melakukan sesuatu atau tidak. Selalu akhiri dengan satu kalimat yang memperjelas ekspektasi.\r\n \r\n---\r\n \r\n## ✅ Ringkasan Kunci\r\n \r\n- **Piramida Minto** membalik cara berkomunikasi: kesimpulan di awal, argumen di tengah, data di bawah — bukan sebaliknya\r\n- **Audiens manajemen** berpikir seperti hakim, bukan penonton film — mereka ingin vonisnya dulu\r\n- **Standar ROFIQ** memastikan setiap pesanmu relevan, berbasis fakta, terfokus, mudah dicerna, dan berkualitas tinggi\r\n- **Lima langkah update** — kenali audiens → pilih saluran → susun piramida → sertakan risiko → tutup dengan tindakan\r\n- **Call to action** di akhir pesan bukan opsional — ini yang membedakan HC yang melaporkan dari HC yang memimpin\r\n---\r\n \r\n## 🔗 Koneksi ke Pelajaran Berikutnya\r\n \r\nPada pelajaran berikutnya kamu akan mempraktikkan framework ini secara langsung: **menulis executive summary satu halaman untuk isu HC aktual dan menyampaikannya dalam presentasi 5 menit tanpa persiapan panjang.** Kamu akan merasakan perbedaan antara tahu teorinya dan benar-benar bisa menggunakannya di bawah tekanan.\r\n \r\n---\r\n \r\n## 📝 Cek Pemahaman\r\n \r\nSebelum lanjut, jawab pertanyaan-pertanyaan ini:\r\n \r\n1. Bayangkan kamu perlu mengabari HC Manager bahwa proses rekrutmen posisi Senior Developer sudah selesai dan ada 1 kandidat yang direkomendasikan. Tulis puncak piramida kamu dalam satu kalimat.\r\n2. Dari standar ROFIQ, mana yang menurutmu paling sering dilanggar dalam update HC sehari-hari di Vascomm? Mengapa?\r\n3. Apa perbedaan antara argumen (tengah piramida) dan data (dasar piramida)? Berikan satu contoh masing-masing dari konteks HR.\r\n4. Seseorang memberikan update seperti ini: *"Survei kepuasan sudah dibagikan ke 50 karyawan, 38 sudah mengisi, dan hasilnya menunjukkan banyak yang tidak puas dengan fasilitas kantor."* Identifikasi masalahnya dan tulis ulang menggunakan struktur piramida.\r\n---\r\n \r\n*Bagian dari Modul: Komunikasi Kepemimpinan & Pengelolaan Pemangku Kepentingan*\r\n*Program TDP HCM Successorship — PT Vascomm Solusi Teknologi*\r\n 	\N	\N	60	1	2026-06-09 06:19:33.611	2026-06-09 09:48:48.668
cmqa8qis5000304jsxcrji7d7	cmq08teey000604l4pxptoagn	Personal Branding & Simulasi Alignment Meeting	DOCUMENT	\N	\N	\N	\N	3	2026-06-12 01:21:26.933	2026-06-12 01:21:26.933
cmq692c5o000004lalpwzewps	cmq08teex000404l4x88vxdpi	Refleksi: Evaluasi Kegagalan Komunikasi	TEXT	# Refleksi: Evaluasi Kegagalan Komunikasi\r\n\r\n**Modul:** Komunikasi Kepemimpinan & Pengelolaan Pemangku Kepentingan\r\n**Pelajaran:** Terakhir dari modul ini\r\n**Durasi estimasi:** 40 menit\r\n**Tipe:** Materi Teks\r\n\r\n---\r\n\r\n## 🎯 Tujuan Pembelajaran\r\n\r\nSetelah menyelesaikan pelajaran ini, kamu akan mampu:\r\n\r\n1. Mengidentifikasi pola kegagalan komunikasi yang paling umum terjadi di lingkungan kerja\r\n2. Menggunakan metode **5 Whys** untuk menemukan akar masalah komunikasi — bukan hanya gejalanya\r\n3. Membedakan antara *menyalahkan situasi* dan *mengambil pelajaran dari situasi*\r\n4. Menyusun rencana perbaikan komunikasi yang konkret dan bisa langsung diterapkan\r\n\r\n---\r\n\r\n## 📌 Pertanyaan Pembuka\r\n\r\n> Coba ingat satu momen dalam tiga bulan terakhir di mana komunikasimu tidak berjalan seperti yang kamu harapkan.\r\n> Mungkin pesanmu disalahpahami. Mungkin instruksimu dieksekusi dengan cara yang salah.\r\n> Mungkin kamu merasa sudah menjelaskan dengan baik, tapi hasilnya berbicara lain.\r\n>\r\n> **Apa yang pertama kali kamu pikirkan waktu itu terjadi?**\r\n> Apakah kamu berpikir *"Mereka tidak paham"* — atau *"Aku tidak cukup jelas"*?\r\n\r\nJawaban atas pertanyaan itu akan sangat menentukan seberapa cepat kamu berkembang sebagai pemimpin.\r\n\r\n---\r\n\r\n## 1. Sebuah Cerita: Rapat yang Berakhir dengan Kebingungan\r\n\r\nReza baru saja dipromosikan menjadi Team Lead di sebuah perusahaan teknologi. Ini adalah rapat koordinasi pertamanya memimpin tim.\r\n\r\nDengan penuh semangat, Reza membuka rapat dan langsung masuk ke agenda:\r\n\r\n> *"Oke, jadi mulai bulan ini kita mau tingkatkan standar kerja. Semua harus lebih proaktif, laporan harus lebih komprehensif, dan koordinasi antar anggota harus lebih baik. Paham semua?"*\r\n\r\nSemua anggota tim mengangguk.\r\n\r\nReza merasa rapat berjalan baik. Ia menutup sesi dengan percaya diri.\r\n\r\n---\r\n\r\nDua minggu kemudian, Reza frustrasi. Laporan masih sama seperti sebelumnya. "Lebih proaktif" diartikan berbeda-beda oleh setiap orang — ada yang rajin mengirim update tidak penting, ada yang tidak melakukan apa-apa sambil berkata *"saya sudah proaktif kok, saya selalu standby."*\r\n\r\nReza akhirnya menyimpulkan: *"Tim saya memang sulit diatur."*\r\n\r\nTapi benarkah demikian?\r\n\r\n---\r\n\r\nKalau Reza mau jujur pada dirinya sendiri, ada pertanyaan penting yang belum ia jawab pada hari rapat itu:\r\n\r\n- *Apa yang dimaksud dengan "lebih proaktif" secara konkret?*\r\n- *Laporan seperti apa yang disebut "komprehensif"?*\r\n- *Bagaimana cara mengukur bahwa koordinasi sudah "lebih baik"?*\r\n- *Apakah ia benar-benar yakin semua orang yang mengangguk itu paham — atau hanya tidak ingin terlihat tidak paham?*\r\n\r\n**Kegagalan komunikasi Reza bukan karena tim yang sulit. Ini karena pesan yang tidak punya bentuk.**\r\n\r\nDan inilah yang membuat refleksi menjadi sangat penting — bukan untuk menyalahkan diri sendiri, tapi untuk melihat dengan jelas: *di mana persisnya komunikasi itu bocor?*\r\n\r\n---\r\n\r\n## 2. Mengapa Pemimpin Enggan Berefleksi atas Kegagalan Komunikasi\r\n\r\nSebelum membahas cara mengevaluasi kegagalan, ada satu hal yang perlu diakui terlebih dahulu: **refleksi atas kegagalan terasa tidak nyaman — dan itu wajar.**\r\n\r\nMengakui bahwa pesanmu tidak dipahami artinya mengakui ada yang kurang dalam caramu menyampaikan sesuatu. Bagi banyak orang, terutama yang baru naik jabatan, ini terasa seperti mengakui kelemahan.\r\n\r\nPadahal, logikanya sebenarnya terbalik.\r\n\r\n> **Pemimpin yang enggan mengevaluasi kegagalan komunikasinya adalah pemimpin yang terus mengulang kesalahan yang sama — hanya dengan situasi dan orang yang berbeda.**\r\n\r\nSementara pemimpin yang mau duduk sejenak dan bertanya *"Di mana komunikasi ini gagal, dan apa yang bisa aku lakukan berbeda?"* — mereka yang berkembang jauh lebih cepat.\r\n\r\nGagal komunikasi bukan aib. Itu **data**. Dan data bisa diolah menjadi perbaikan.\r\n\r\n---\r\n\r\n## 3. Empat Penyebab Paling Umum Kegagalan Komunikasi\r\n\r\nSelama bertahun-tahun penelitian dan praktik kepemimpinan, pola yang sama terus muncul. Berikut empat penyebab utama — beserta cerita pendek untuk masing-masing.\r\n\r\n---\r\n\r\n### ① Hambatan Psikologis: Emosi yang Menghalangi Pesan\r\n\r\nSaat Dina, seorang manajer HC, menerima kabar bahwa ada karyawan yang mengajukan keberatan atas kebijakan baru, ia langsung masuk ke mode defensif. Dalam rapat, ia menjawab keberatan itu dengan nada yang lebih tinggi dari biasanya. Pesan yang ingin ia sampaikan — bahwa kebijakan ini sudah dipikirkan matang — tenggelam di balik *cara* ia menyampaikannya.\r\n\r\nKaryawan yang hadir tidak mengingat argumennya. Mereka mengingat nadanya.\r\n\r\n**Emosi yang tidak dikelola — baik ketakutan, kemarahan, maupun ego — adalah noise yang paling keras dalam komunikasi.** Pesan bisa sempurna secara isi, tapi jika disampaikan dengan emosi yang salah, yang diterima oleh pendengar adalah emosinya, bukan isinya.\r\n\r\n---\r\n\r\n### ② Asumsi yang Tidak Diverifikasi: "Pasti Sudah Paham"\r\n\r\nIni adalah penyebab paling diam-diam dan paling berbahaya.\r\n\r\nKetika kamu menjelaskan sesuatu yang sudah sangat familiar bagimu, otak secara otomatis mengisi celah-celah penjelasan dengan informasi yang "sudah jelas." Tapi pendengarmu tidak punya latar belakang yang sama.\r\n\r\nContoh klasik: seorang manajer berpengalaman memberikan instruksi singkat yang bagi dirinya sudah sangat jelas, tapi bagi anggota tim baru, instruksi itu menyisakan sepuluh pertanyaan yang tidak berani mereka tanyakan.\r\n\r\n> *"Buatkan laporan rekap minggu ini ya, standar seperti biasa."*\r\n\r\nStandar seperti biasa — menurut siapa? Versi kamu atau versi mereka?\r\n\r\n---\r\n\r\n### ③ Pilihan Medium yang Tidak Tepat\r\n\r\nSetiap jenis pesan punya "kendaraan" yang paling cocok. Memilih kendaraan yang salah adalah seperti mengirim surat penting lewat botol yang dilempar ke laut — pesannya mungkin sampai, mungkin tidak, dan kamu tidak tahu kapan.\r\n\r\n| Situasi | Medium yang KURANG tepat | Medium yang LEBIH tepat |\r\n|---|---|---|\r\n| Konflik interpersonal antara dua karyawan | WhatsApp group | Pertemuan tatap muka, empat mata |\r\n| Pengumuman perubahan kebijakan besar | Email satu paragraf | Town hall + dokumen resmi + sesi tanya jawab |\r\n| Feedback kinerja negatif | Komentar di laporan tertulis | 1-on-1 langsung |\r\n| Klarifikasi cepat yang tidak mendesak | Menelepon di luar jam kerja | Pesan singkat di jam kerja |\r\n| Keputusan yang membutuhkan diskusi | Email monolog | Rapat dengan agenda yang jelas |\r\n\r\n---\r\n\r\n### ④ Komunikasi Satu Arah: Bicara Tanpa Mendengar\r\n\r\nBayangkan seorang pelatih sepak bola yang terus meneriakkan instruksi dari pinggir lapangan tapi tidak pernah bertanya kepada pemainnya: *"Apa yang kalian butuhkan dari saya?"*\r\n\r\nKomunikasi yang efektif bukan monolog yang disampaikan dengan baik. Ini adalah proses dua arah — kamu menyampaikan, mereka menerima, dan kamu *memverifikasi* bahwa yang mereka terima sesuai dengan yang kamu maksudkan.\r\n\r\nTanpa loop umpan balik ini, kamu hanya bisa berharap pesanmu sampai dengan utuh.\r\n\r\n---\r\n\r\n## 4. Teknik Bedah Masalah: Metode 5 Whys\r\n\r\nKetika sebuah kegagalan komunikasi terjadi, reaksi pertama yang paling umum adalah: *"Siapa yang salah?"*\r\n\r\nTapi pertanyaan yang jauh lebih berguna adalah: *"Apa yang sebenarnya menyebabkan ini terjadi?"*\r\n\r\nDi sinilah **metode 5 Whys** menjadi alat yang sangat praktis. Teknik ini dikembangkan oleh Sakichi Toyoda dan dipopulerkan oleh sistem produksi Toyota — tapi prinsipnya universal: **terus tanya "mengapa" sampai kamu menemukan akar masalah, bukan hanya gejalanya.**\r\n\r\n---\r\n\r\n### Cara Kerja 5 Whys\r\n\r\nPrinsipnya sederhana: dari satu masalah yang terlihat di permukaan, kamu terus bertanya *"mengapa ini terjadi?"* hingga lima kali — atau sampai kamu menemukan titik di mana, jika masalah itu diselesaikan, masalah-masalah di atasnya tidak akan terjadi lagi.\r\n\r\n---\r\n\r\n### Contoh Nyata: Laporan yang Selalu Salah Format\r\n\r\nSituasi: Tim HC terus mengirimkan laporan rekrutmen dengan format yang berbeda-beda setiap minggunya, padahal sudah ada template yang tersedia.\r\n\r\n```\r\nMASALAH: Laporan rekrutmen tidak konsisten formatnya\r\n\r\nWHY #1: Mengapa laporan tidak konsisten?\r\n→ Tim tidak menggunakan template yang tersedia.\r\n\r\nWHY #2: Mengapa mereka tidak menggunakan template?\r\n→ Mereka tidak tahu di mana menyimpan template tersebut.\r\n\r\nWHY #3: Mengapa mereka tidak tahu?\r\n→ Template dibagikan lewat email enam bulan lalu dan tidak pernah diingatkan lagi.\r\n\r\nWHY #4: Mengapa tidak ada pengingat?\r\n→ Tidak ada sistem onboarding yang memastikan setiap anggota tim baru mendapat informasi ini.\r\n\r\nWHY #5: Mengapa tidak ada sistem seperti itu?\r\n→ Tidak ada yang bertanggung jawab secara spesifik untuk memastikan knowledge transfer berjalan.\r\n\r\nAKAR MASALAH: Tidak ada sistem knowledge management dan onboarding yang jelas untuk tim HC.\r\n```\r\n\r\n---\r\n\r\n**Perhatikan perbedaannya:**\r\n\r\nJika kamu berhenti di WHY #1, solusinya adalah: *"Suruh tim pakai template."* — dan masalah yang sama akan terulang dua bulan kemudian.\r\n\r\nJika kamu sampai ke WHY #5, solusinya adalah: *"Buat sistem onboarding dan knowledge management yang memastikan tidak ada informasi penting yang jatuh di celah."* — ini menyelesaikan masalah dari akarnya.\r\n\r\n---\r\n\r\n### Panduan Menggunakan 5 Whys\r\n\r\nBeberapa hal yang perlu diperhatikan saat menggunakan teknik ini:\r\n\r\n- **Fokus pada proses, bukan orang.** Tujuannya bukan mencari siapa yang salah, tapi menemukan celah dalam sistem atau cara kerja.\r\n- **Satu jawaban per "mengapa."** Jika ada lebih dari satu jawaban, kamu perlu menelusuri masing-masing jalur secara terpisah.\r\n- **Hentikan ketika kamu menemukan sesuatu yang bisa diubah.** Jika kamu sudah tiba di titik *"karena begitulah manusia"* atau *"karena memang sudah dari dulu begini"* — itu bukan akar masalah, itu kebiasaan yang perlu ditantang.\r\n\r\n---\r\n\r\n## 5. Studi Kasus: Instruksi yang Tidak Punya Bentuk\r\n\r\nIni adalah kasus yang lebih sering terjadi daripada yang kita sadari — dan kemungkinan besar kamu pernah berada di salah satu sisi cerita ini.\r\n\r\n---\r\n\r\n**Situasinya:**\r\n\r\nDirektur Operasional sebuah perusahaan teknologi memanggil seluruh tim leader dan menyampaikan satu arahan:\r\n\r\n> *"Mulai kuartal ini, kita harus tingkatkan performa tim secara keseluruhan."*\r\n\r\nRapat selesai. Semua orang pergi dengan anggukan.\r\n\r\n---\r\n\r\n**Yang terjadi selanjutnya:**\r\n\r\nSetiap team lead menginterpretasikan arahan itu dengan caranya sendiri.\r\n\r\n- Lead Engineering fokus pada kecepatan deployment\r\n- Lead Product fokus pada jumlah fitur yang dirilis\r\n- Lead HC fokus pada skor kepuasan karyawan\r\n- Lead Finance fokus pada efisiensi pengeluaran\r\n\r\nTiga bulan kemudian, review kuartal diadakan. Direktur kecewa — bukan karena tim tidak bekerja keras, tapi karena semua orang berlari ke arah yang berbeda.\r\n\r\n---\r\n\r\n**Evaluasi dengan 5 Whys:**\r\n\r\n```\r\nMASALAH: Peningkatan performa tidak sesuai harapan Direktur\r\n\r\nWHY #1: Setiap tim mendefinisikan "performa" secara berbeda.\r\nWHY #2: Tidak ada definisi atau metrik yang disepakati bersama.\r\nWHY #3: Instruksi yang diberikan tidak spesifik dan tidak terukur.\r\nWHY #4: Direktur mengasumsikan semua orang punya pemahaman yang sama tentang prioritas perusahaan.\r\nWHY #5: Tidak ada mekanisme verifikasi pemahaman setelah arahan diberikan.\r\n\r\nAKAR MASALAH: Arahan strategis disampaikan tanpa konteks, tanpa metrik, dan tanpa konfirmasi bahwa semua penerima memahaminya dengan cara yang sama.\r\n```\r\n\r\n---\r\n\r\n**Perbaikan konkret:**\r\n\r\nSeharusnya arahan itu berbunyi:\r\n\r\n> *"Mulai kuartal ini, kita fokus pada satu hal: mengurangi waktu rata-rata penyelesaian tiket layanan pelanggan dari 48 jam menjadi 24 jam. Ini prioritas utama semua divisi, dan kita akan review angkanya setiap dua minggu."*\r\n\r\nDengan satu kalimat yang lebih spesifik, semua orang tahu:\r\n- Apa yang diukur (waktu penyelesaian tiket)\r\n- Dari mana ke mana (48 jam → 24 jam)\r\n- Kapan dievaluasi (setiap dua minggu)\r\n- Siapa yang terlibat (semua divisi)\r\n\r\n**Tidak ada ruang untuk interpretasi yang berbeda-beda.**\r\n\r\n---\r\n\r\n## 6. Empat Langkah Perbaikan Komunikasi\r\n\r\nSetelah kamu mengidentifikasi di mana kegagalan terjadi dan menemukan akar masalahnya — apa yang dilakukan selanjutnya?\r\n\r\n---\r\n\r\n### Langkah 1 — Akui Kegagalan Tanpa Mencari Kambing Hitam\r\n\r\nIni adalah langkah yang terdengar mudah tapi paling sulit dilakukan dalam praktik.\r\n\r\nKetika komunikasi gagal, insting pertama banyak orang adalah membingkai ulang situasi: *"Mereka yang tidak mau dengar,"* atau *"Saya sudah jelas, mereka yang tidak fokus."*\r\n\r\nMungkin ada benarnya. Tapi jika kamu memulai refleksi dari posisi itu, kamu sudah menutup diri dari kemungkinan belajar.\r\n\r\nCoba mulai dari posisi yang berbeda: *"Apa yang bisa aku lakukan berbeda agar pesan ini lebih mudah diterima?"*\r\n\r\nIni bukan tentang menyalahkan diri sendiri. Ini tentang **mengambil kontrol atas hal-hal yang ada dalam kendalimu.**\r\n\r\n---\r\n\r\n### Langkah 2 — Dengarkan Secara Aktif, Bukan Defensif\r\n\r\nSetelah kamu siap menerima bahwa ada yang perlu diperbaiki, langkah berikutnya adalah *mendengarkan* — dan ini bukan sekadar diam saat orang lain bicara.\r\n\r\n**Mendengar aktif** artinya:\r\n- Memberikan perhatian penuh tanpa menyiapkan argumen balasan\r\n- Mengajukan pertanyaan klarifikasi: *"Bisakah kamu ceritakan lebih detail bagian mana yang membingungkan?"*\r\n- Menahan diri dari komentar defensif seperti *"Ya tapi sebenarnya maksud saya..."*\r\n- Memparafrasekan apa yang didengar: *"Jadi yang kamu rasakan adalah kamu tidak tahu harus melakukan apa setelah menerima instruksi itu — apakah aku menangkap dengan benar?"*\r\n\r\n---\r\n\r\n### Langkah 3 — Ubah Metode, Bukan Hanya Volume\r\n\r\nKetika komunikasi tidak berhasil, godaan terbesar adalah mengulang hal yang sama dengan lebih keras atau lebih sering.\r\n\r\nTapi jika metodenya yang tidak pas, mengulangnya seratus kali tidak akan membantu.\r\n\r\nJika teks gagal → coba visual atau tatap muka\r\nJika rapat besar tidak efektif → coba diskusi kecil per kelompok\r\nJika instruksi lisan tidak diingat → coba tuliskan dan bagikan setelah rapat\r\nJika penjelasan panjang membingungkan → coba satu contoh konkret\r\n\r\n**Fleksibilitas metode adalah tanda kematangan komunikasi.**\r\n\r\n---\r\n\r\n### Langkah 4 — Verifikasi Pemahaman Sebelum Melanjutkan\r\n\r\nIni adalah kebiasaan sederhana yang dampaknya sangat besar.\r\n\r\nSetelah menyampaikan sesuatu yang penting, jangan tutup sesi dengan *"Paham semua?"* — karena hampir tidak ada orang yang menjawab *"tidak"* di depan umum, bahkan ketika mereka benar-benar tidak paham.\r\n\r\nSebagai gantinya, coba teknik ini:\r\n\r\n> *"Sebelum kita tutup, bisakah salah satu dari kalian merangkum apa yang akan dilakukan setelah rapat ini berdasarkan diskusi tadi?"*\r\n\r\nAtau:\r\n\r\n> *"Kalau ada satu hal yang paling penting dari yang kita bahas tadi, apa yang kamu ingat?"*\r\n\r\nJawaban mereka akan memberi tahu kamu apakah pesanmu benar-benar sampai — atau hanya terdengar oleh telingamu sendiri.\r\n\r\n---\r\n\r\n## 7. Satu Cerita Penutup: Pemimpin yang Mau Bertanya\r\n\r\nAmir adalah seorang HC Manager yang baru menjabat di sebuah startup. Ia orang yang cerdas dan penuh inisiatif — tapi di bulan pertamanya, ia sering merasa frustrasi karena eksekusi tim tidak sesuai harapan.\r\n\r\nSuatu hari, seorang mentor bertanya padanya: *"Dari semua instruksi yang kamu berikan bulan ini, berapa persen yang kamu verifikasi pemahamannya sebelum tim mulai bekerja?"*\r\n\r\nAmir terdiam.\r\n\r\nIa tidak tahu jawabannya. Dan ketidaktahuannya itu sendiri sudah menjadi jawaban.\r\n\r\n---\r\n\r\nSejak saat itu, Amir menambahkan satu kebiasaan kecil di akhir setiap penugasan: ia selalu bertanya kepada satu anggota tim, *"Kalau aku tidak ada dan kamu harus jelaskan ke orang lain apa yang harus dilakukan — kamu akan bilang apa?"*\r\n\r\nKebiasaan itu mengubah banyak hal. Bukan karena Amir tiba-tiba menjadi komunikator yang sempurna — tapi karena ia menciptakan sistem kecil yang menangkap kesalahpahaman sebelum berubah menjadi masalah besar.\r\n\r\n---\r\n\r\n> **Pemimpin yang baik bukan yang tidak pernah gagal berkomunikasi. Pemimpin yang baik adalah yang memiliki sistem untuk mendeteksi kegagalan lebih awal — dan keberanian untuk mengakuinya.**\r\n\r\n---\r\n\r\n## ✅ Ringkasan\r\n\r\n| Konsep | Yang Perlu Diingat |\r\n|---|---|\r\n| **Kegagalan = Data** | Gagal komunikasi bukan aib — itu sinyal yang bisa diolah menjadi perbaikan |\r\n| **4 Penyebab Utama** | Hambatan psikologis, asumsi yang tidak diverifikasi, medium yang salah, komunikasi satu arah |\r\n| **5 Whys** | Terus tanya "mengapa" hingga menemukan akar masalah — bukan hanya gejalanya |\r\n| **Akui tanpa menyalahkan** | Ambil kontrol atas hal yang ada dalam kendalimu |\r\n| **Dengar aktif** | Bukan diam — tapi benar-benar menyerap, mengklarifikasi, dan memparafrasekan |\r\n| **Ubah metode** | Jika teks gagal, coba visual. Jika rapat besar gagal, coba diskusi kecil |\r\n| **Verifikasi pemahaman** | Jangan tutup sesi penting dengan "Paham semua?" — minta mereka merangkum |\r\n\r\n---\r\n\r\n## 🔭 Refleksi Akhir Modul\r\n\r\nIni adalah pelajaran terakhir dari modul **Komunikasi Kepemimpinan & Pengelolaan Pemangku Kepentingan**. Luangkan waktu untuk menjawab pertanyaan-pertanyaan ini secara jujur — bukan untuk dinilai, tapi untuk dirimu sendiri:\r\n\r\n1. **Dari semua materi di modul ini** — Framework Piramida, Update Manajemen, Conflict Handling, dan Refleksi Kegagalan — area mana yang paling relevan dengan tantangan komunikasimu saat ini? Mengapa?\r\n\r\n2. **Ingat kembali cerita Reza di awal pelajaran ini.** Apakah ada situasi serupa yang pernah terjadi padamu — sebagai pihak yang memberikan instruksi yang tidak jelas, atau sebagai pihak yang menerima instruksi seperti itu? Apa yang kamu pelajari dari situasi itu?\r\n\r\n3. **Pilih satu kegagalan komunikasi** yang terjadi dalam tiga bulan terakhir. Gunakan metode 5 Whys untuk menelusurinya. Apa akar masalah yang kamu temukan?\r\n\r\n4. **Satu komitmen konkret:** Apa satu kebiasaan komunikasi baru yang akan kamu mulai terapkan mulai minggu depan — sekecil apapun itu?\r\n\r\n---\r\n\r\n*Pelajaran Terakhir  ·  Modul: Komunikasi Kepemimpinan & Pengelolaan Pemangku Kepentingan*\r\n*Program TDP HCM Successorship — PT Vascomm Solusi Teknologi*	\N	\N	60	0	2026-06-09 06:19:33.516	2026-06-09 09:56:45.023
cmqa8qivz000404jstejq88bu	cmq08teey000604l4pxptoagn	Feedback 360 & Personal Development Commitment	DOCUMENT	\N	\N	\N	\N	4	2026-06-12 01:21:27.071	2026-06-12 01:21:27.071
cmq82szbi000004kwplsm8rdj	cmq08teex000504l48tgf5ixm	Tantangan Mandiri: Keputusan Tanpa Atasan	TEXT	# Tantangan Mandiri: Keputusan Tanpa Atasan\r\n\r\n**Modul:** Tata Kelola Operasional HC & Pengambilan Keputusan Strategis\r\n**Durasi estimasi:** 40 menit\r\n**Tipe:** Materi Teks\r\n\r\n---\r\n\r\n## 🎯 Tujuan Pembelajaran\r\n\r\nSetelah menyelesaikan pelajaran ini, kamu akan mampu:\r\n\r\n1. Mengenali situasi mana yang bisa — dan harus — kamu putuskan sendiri tanpa menunggu atasan\r\n2. Menggunakan **Matriks Delegasi** untuk mengklasifikasikan sebuah keputusan berdasarkan tingkat risiko dan dampaknya\r\n3. Menjalankan proses pengambilan keputusan mandiri secara terstruktur dan terdokumentasi\r\n4. Membedakan antara *keberanian mengambil keputusan* dan *sembrono mengabaikan batas wewenang*\r\n\r\n---\r\n\r\n## 📌 Pertanyaan Pembuka\r\n\r\n> Bayangkan ini: hari Jumat siang, jam 14.30. HC Manager sedang dalam penerbangan menuju luar kota untuk rapat klien selama dua hari — tidak bisa dihubungi sampai Minggu malam.\r\n>\r\n> Tiba-tiba kamu mendapat kabar: kandidat terbaik untuk posisi yang sudah kosong dua bulan meminta jawaban hari ini juga. Ia sudah dapat offer lain dan butuh kepastian sebelum jam 5 sore.\r\n>\r\n> **Apa yang kamu lakukan?**\r\n>\r\n> Apakah kamu menunggu sampai HC Manager bisa dihubungi — dan risiko kehilangan kandidat itu? Atau kamu mengambil keputusan sendiri — dan risiko melampaui wewenangmu? Atau ada pilihan ketiga yang lebih cerdas?\r\n\r\nPelajaran ini dirancang untuk menjawab pertanyaan itu — bukan hanya dengan teori, tapi dengan kerangka berpikir yang bisa langsung kamu pakai saat situasi itu benar-benar terjadi.\r\n\r\n---\r\n\r\n## 1. Sebuah Cerita: Dua Orang HC, Satu Situasi yang Sama\r\n\r\nDua HC Officer di dua perusahaan berbeda menghadapi situasi yang hampir identik pada hari yang sama.\r\n\r\n---\r\n\r\n**Cerita pertama — Bram:**\r\n\r\nSenin pagi, atasan Bram mendadak harus menangani krisis keluarga dan tidak masuk selama tiga hari. Bram memegang semua pekerjaan HC sendirian.\r\n\r\nPada hari pertama, seorang karyawan datang dengan surat dokter dan meminta izin sakit dua hari. Bram panik. *"Aku harus tanda tangan persetujuan izin ini, tapi aku tidak punya wewenang resmi. Lebih baik tunggu atasan balik dulu."*\r\n\r\nKaryawan itu pulang tanpa kepastian. Esok harinya, ia tetap masuk meskipun sakit — karena tidak tahu status izinnya. Dua rekan kerjanya kemudian ikut sakit.\r\n\r\nPada hari kedua, vendor payroll mengirim email mendesak: ada perbedaan data karyawan yang harus dikonfirmasi sebelum jam 12 siang atau proses gajian bulan ini akan tertunda. Bram kembali ragu. *"Ini menyangkut data sensitif. Aku harus tunggu atasan."* Email tidak dibalas. Gajian tertunda tiga hari. Seluruh kantor ribut.\r\n\r\nBram tidak melakukan kesalahan besar — ia hanya tidak berani membuat keputusan yang sebenarnya bisa dan seharusnya ia buat.\r\n\r\n---\r\n\r\n**Cerita kedua — Sinta:**\r\n\r\nDi hari yang sama, Sinta menghadapi situasi serupa. Atasannya juga tidak ada.\r\n\r\nKetika surat izin sakit karyawan datang, Sinta langsung buka SOP ketenagakerjaan perusahaan. Di sana tertulis: *"Izin sakit dengan surat dokter yang valid disetujui langsung oleh tim HC tanpa memerlukan persetujuan manajer."* Sinta tanda tangan, karyawan pulang istirahat dengan tenang.\r\n\r\nKetika email vendor payroll masuk, Sinta mengecek: apakah konfirmasi data ini masuk dalam daftar tugasnya? Ya. Apakah ada SOP untuk ini? Ada — dan prosesnya sudah jelas. Apakah ada risiko finansial atau hukum yang signifikan? Tidak, ini hanya konfirmasi data yang sudah ada. Sinta membalas email, proses berjalan, gajian tepat waktu.\r\n\r\nMalam harinya, Sinta mengirim ringkasan singkat ke atasannya: *"Hari ini ada dua hal yang saya tangani langsung: izin sakit [nama] dan konfirmasi data payroll. Keduanya sudah selesai, tidak ada eskalasi yang diperlukan."*\r\n\r\n---\r\n\r\nBram dan Sinta sama-sama orang yang jujur dan bertanggung jawab. Perbedaannya bukan soal karakter — tapi soal **kerangka berpikir**. Sinta tahu persis pertanyaan apa yang harus dijawab sebelum mengambil keputusan. Bram tidak.\r\n\r\n---\r\n\r\n## 2. Mengapa Otonomi Operasional Itu Penting — dan Mengapa Banyak Orang Menghindarinya\r\n\r\nAda alasan yang sangat manusiawi mengapa orang seperti Bram memilih untuk tidak memutuskan: **keputusan berarti tanggung jawab, dan tanggung jawab berarti risiko.**\r\n\r\nJika kamu tidak membuat keputusan, kamu tidak bisa disalahkan atas keputusan yang salah. Secara psikologis, ini terasa aman.\r\n\r\nTapi dalam konteks organisasi, *tidak memutuskan juga adalah sebuah keputusan* — dengan konsekuensi nyata yang seringkali lebih besar dari keputusan yang salah sekalipun.\r\n\r\nKetika tim HC tidak memiliki otonomi operasional yang jelas, beberapa hal terjadi secara bersamaan:\r\n- Setiap keputusan kecil menunggu persetujuan → alur kerja tersendat\r\n- Atasan dibanjiri pertanyaan yang sebenarnya bisa ditangani sendiri → mereka tidak bisa fokus pada hal yang benar-benar strategis\r\n- Tim HC tidak berkembang → selalu menunggu arahan, tidak pernah belajar memimpin diri sendiri\r\n- Kepercayaan tidak tumbuh → karena kepercayaan dibangun lewat track record mengambil keputusan yang baik, bukan lewat kepatuhan pasif\r\n\r\n> **Otonomi operasional bukan tentang melakukan apa yang kamu mau. Ini tentang memiliki kejelasan — apa yang boleh kamu putuskan, apa yang harus dikonsultasikan, dan apa yang harus dieskalasi — sehingga kamu bisa bergerak dengan cepat dan tepat tanpa menunggu instruksi untuk setiap langkah.**\r\n\r\n---\r\n\r\n## 3. Matriks Delegasi: Peta untuk Menavigasi Keputusan\r\n\r\nAlat paling praktis untuk menentukan apakah sebuah keputusan bisa diambil sendiri adalah **Matriks Delegasi** — sebuah cara mengklasifikasikan situasi berdasarkan dua dimensi: **tingkat risiko** dan **urgensi**.\r\n\r\nTapi sebelum masuk ke matriks, ada satu pertanyaan yang selalu harus dijawab terlebih dahulu:\r\n\r\n> **"Apakah ada SOP atau kebijakan yang mengatur situasi ini?"**\r\n\r\nJika ya — ikuti SOP. Kamu tidak perlu *membuat* keputusan, kamu hanya perlu *menerapkan* keputusan yang sudah dibuat sebelumnya.\r\n\r\nJika tidak ada SOP yang relevan, barulah matriks ini menjadi panduan.\r\n\r\n---\r\n\r\n### Zona Hijau — Putuskan Langsung\r\n\r\n**Ciri situasinya:**\r\n- Dampak finansial kecil atau tidak ada\r\n- Tidak ada implikasi hukum yang signifikan\r\n- Bisa diperbaiki jika ternyata keputusannya kurang tepat\r\n- Menunggu justru menciptakan masalah baru\r\n\r\n**Contoh situasi nyata di HC:**\r\n- Menyetujui izin sakit karyawan dengan surat dokter yang valid\r\n- Mengkonfirmasi jadwal wawancara dengan kandidat\r\n- Memperpanjang akses sistem karyawan yang sedang probasi sesuai SOP\r\n- Memesan alat tulis atau perlengkapan kerja dalam batas anggaran yang sudah disetujui\r\n- Membalas pertanyaan karyawan tentang kebijakan yang sudah tertulis\r\n\r\n**Yang dilakukan:** Putuskan, eksekusi, dokumentasikan, laporkan ke atasan pada kesempatan pertama.\r\n\r\n---\r\n\r\n### Zona Kuning — Konsultasi Dulu, Baru Putuskan\r\n\r\n**Ciri situasinya:**\r\n- Ada dampak finansial yang cukup signifikan tapi masih dalam batas tertentu\r\n- Melibatkan lebih dari satu divisi\r\n- Keputusannya tidak mudah dibalik jika salah\r\n- Ada ketidakpastian yang cukup besar — kamu tidak 100% yakin mana yang benar\r\n\r\n**Contoh situasi nyata di HC:**\r\n- Merekrut karyawan kontrak untuk kebutuhan mendesak\r\n- Menyetujui lembur dengan biaya di atas threshold tertentu\r\n- Merespons karyawan yang menyampaikan keluhan formal\r\n- Mengubah jadwal onboarding yang sudah direncanakan\r\n\r\n**Yang dilakukan:** Hubungi rekan senior atau pejabat yang relevan — bukan untuk meminta mereka yang memutuskan, tapi untuk mengkonfirmasi bahwa perspektifmu sudah mempertimbangkan angle yang tepat. Dokumentasikan konsultasi itu, lalu ambil keputusan berdasarkan inputnya.\r\n\r\n---\r\n\r\n### Zona Merah — Eskalasi, Jangan Ambil Sendiri\r\n\r\n**Ciri situasinya:**\r\n- Dampak finansial besar atau tidak terprediksi\r\n- Ada risiko hukum yang signifikan\r\n- Tidak bisa dibalik jika ternyata salah\r\n- Memengaruhi banyak orang sekaligus atau kebijakan jangka panjang\r\n\r\n**Contoh situasi nyata di HC:**\r\n- Pemutusan hubungan kerja — apalagi dalam jumlah besar\r\n- Mengubah struktur gaji atau benefit secara fundamental\r\n- Merespons ancaman hukum dari karyawan\r\n- Keputusan yang memengaruhi kontrak dengan nilai signifikan\r\n- Perubahan kebijakan yang berdampak pada seluruh organisasi\r\n\r\n**Yang dilakukan:** Jangan ambil keputusan ini sendirian, bahkan jika situasinya terasa mendesak. Hubungi atasan atau pejabat yang berwenang — cari tahu kapan mereka bisa dihubungi, dan jika benar-benar tidak bisa, eskalasi ke pejabat setingkat lebih tinggi. Dokumentasikan bahwa kamu sudah mencoba eskalasi.\r\n\r\n---\r\n\r\n### Ringkasan Visual Matriks\r\n\r\n| Zona | Tingkat Risiko | Yang Dilakukan | Waktu Lapor ke Atasan |\r\n|---|---|---|---|\r\n| 🟢 Hijau | Rendah | Putuskan dan eksekusi sendiri | Laporan rutin berikutnya |\r\n| 🟡 Kuning | Menengah | Konsultasi → Putuskan | Segera setelah keputusan diambil |\r\n| 🔴 Merah | Tinggi | Eskalasi — jangan ambil sendiri | Sebelum keputusan diambil |\r\n\r\n---\r\n\r\n## 4. Lima Langkah Mengambil Keputusan Mandiri\r\n\r\nMengetahui bahwa situasi ini berada di zona hijau belum cukup — kamu masih perlu proses yang terstruktur agar keputusanmu bisa dipertanggungjawabkan.\r\n\r\n---\r\n\r\n### Langkah 1 — Identifikasi Urgensi dan Dampak dengan Kepala Dingin\r\n\r\nSebelum apapun, tanya dua pertanyaan ini:\r\n\r\n*Seberapa mendesak ini harus diputuskan?* — Apakah keputusan yang tertunda 2 jam akan menciptakan masalah nyata? Atau sebenarnya bisa menunggu sampai besok?\r\n\r\n*Seberapa besar dampaknya jika keputusan ini salah?* — Bisa diperbaiki? Berapa biaya untuk memperbaikinya?\r\n\r\nBanyak situasi yang terasa sangat mendesak pada momen pertama, tapi setelah dianalisis 5 menit, ternyata bisa ditunda beberapa jam tanpa konsekuensi nyata. Jangan biarkan rasa panik mendorong kamu ke keputusan yang tergesa-gesa.\r\n\r\n---\r\n\r\n### Langkah 2 — Periksa SOP dan Kebijakan yang Ada\r\n\r\nIni langkah yang paling sering dilewati karena terasa membuang waktu — padahal justru ini yang paling menghemat waktu.\r\n\r\nSebelum berpikir apa yang harus dilakukan, cari tahu: apakah sudah ada aturan yang mengatur situasi ini? Apakah ada preseden — pernah ada situasi serupa yang ditangani sebelumnya, dan hasilnya bagaimana?\r\n\r\nSOP bukan hambatan birokrasi. SOP adalah akumulasi kebijaksanaan dari keputusan-keputusan yang sudah pernah dipikirkan matang-matang sebelumnya. Mengikutinya bukan tanda kurang inisiatif — ini tanda kamu menghormati sistem yang sudah dibangun.\r\n\r\n---\r\n\r\n### Langkah 3 — Analisis Data dan Hitung Risiko\r\n\r\nKeputusan yang baik berbasis fakta, bukan intuisi semata. Sebelum memutuskan, pastikan kamu sudah memeriksa:\r\n\r\n- **Angka yang relevan** — apakah ada budget yang tersisa? Berapa biaya jika tidak diputuskan sekarang? Berapa biaya jika diputuskan dan ternyata salah?\r\n- **Preseden dan kebijakan** — keputusan serupa pernah diambil seperti apa sebelumnya?\r\n- **Dampak pada pihak lain** — siapa lagi yang akan terdampak oleh keputusan ini?\r\n\r\nTidak perlu analisis yang sempurna — tapi perlu analisis yang *cukup* untuk bisa mempertanggungjawabkan keputusanmu jika ditanya.\r\n\r\n---\r\n\r\n### Langkah 4 — Putuskan dengan Arah yang Paling Selaras dengan Tujuan Organisasi\r\n\r\nJika sudah melewati tiga langkah sebelumnya dan kamu masih di zona hijau atau kuning — putuskan.\r\n\r\nSatu pertanyaan yang bisa membantu di titik ini: *"Jika atasan saya mengetahui semua informasi yang saya ketahui sekarang, apa yang kemungkinan besar ia putuskan?"*\r\n\r\nIni bukan tentang menebak-nebak. Ini tentang memahami nilai dan prioritas organisasi dengan cukup baik sehingga kamu bisa memproyeksikan keputusan yang konsisten dengan arahnya — bahkan tanpa kehadiran atasanmu secara fisik.\r\n\r\n---\r\n\r\n### Langkah 5 — Dokumentasikan dan Laporkan\r\n\r\nIni adalah langkah yang membedakan keputusan mandiri yang profesional dari keputusan yang sembrono.\r\n\r\nSetiap keputusan yang kamu ambil sendiri — sekecil apapun — perlu didokumentasikan:\r\n- Apa situasinya\r\n- Informasi apa yang kamu miliki saat itu\r\n- Mengapa kamu memilih keputusan itu (bukan yang lain)\r\n- Apa hasilnya\r\n\r\nLaporkan ke atasan pada kesempatan pertama yang tersedia — bukan untuk meminta "validasi retroaktif", tapi sebagai bentuk transparansi dan membangun kepercayaan. Atasan yang menerima laporan ringkas *"hari ini saya tangani ini, hasilnya ini"* akan jauh lebih mudah memberikan kepercayaan yang lebih besar di masa depan.\r\n\r\n---\r\n\r\n## 5. Kembali ke Situasi di Awal: Kandidat yang Butuh Jawaban Hari Ini\r\n\r\nDengan kerangka yang sudah kamu miliki sekarang, mari kita urai situasi di pertanyaan pembuka tadi.\r\n\r\n**Situasinya:** HC Manager tidak bisa dihubungi. Kandidat terbaik untuk posisi yang kosong dua bulan meminta jawaban sebelum jam 5 sore. Ia sudah ada offer lain.\r\n\r\n---\r\n\r\n**Langkah 1 — Urgensi dan Dampak:**\r\n\r\nUrgensi tinggi — ada deadline jam 5. Dampak jika tidak diputuskan: kehilangan kandidat, posisi kosong berlanjut, proyek terganggu. Dampak jika keputusan salah: menyetujui angka yang melebihi budget, yang bisa diperbaiki tapi perlu eskalasi.\r\n\r\nIni bukan zona merah (bukan PHK massal, bukan perubahan kebijakan besar). Tapi juga bukan zona hijau murni karena melibatkan angka gaji. Ini **zona kuning** — perlu analisis lebih dalam sebelum memutuskan.\r\n\r\n---\r\n\r\n**Langkah 2 — Periksa SOP dan Kebijakan:**\r\n\r\nApakah ada range gaji yang sudah disetujui untuk posisi ini? Hampir pasti ada, karena rekrutmen sudah berjalan dua bulan. Buka dokumen itu.\r\n\r\nApakah ada kebijakan tentang siapa yang bisa menyetujui offering letter jika HC Manager tidak ada? Periksa.\r\n\r\n---\r\n\r\n**Langkah 3 — Analisis Data:**\r\n\r\n- Apakah angka yang diminta kandidat masuk dalam range yang sudah disetujui? Jika ya → keputusan ini masuk zona hijau, karena tidak melampaui batas yang sudah diotorisasi.\r\n- Jika angkanya sedikit di atas range tapi masih dalam toleransi wajar → zona kuning, cari satu orang yang bisa dikonsultasikan dalam 30 menit.\r\n- Jika angkanya jauh di atas range → zona merah, eskalasi, dan komunikasikan ke kandidat bahwa kamu butuh konfirmasi satu tingkat lebih tinggi.\r\n\r\n---\r\n\r\n**Langkah 4 — Putuskan:**\r\n\r\nJika angkanya dalam range yang disetujui: setujui, kirim offering letter, tandatangani sesuai kewenangan yang ada. Ini bukan keputusan yang melampaui wewenang — ini eksekusi dari keputusan yang sudah dibuat sebelumnya (range gaji yang sudah disetujui).\r\n\r\nJika angkanya di luar range: komunikasikan ke kandidat dengan jujur — *"Saya sedang mengkonfirmasi angka ini dengan pimpinan. Bisakah kamu memberikan waktu hingga pagi besok?"* Lalu cari cara eskalasi yang paling cepat.\r\n\r\n---\r\n\r\n**Langkah 5 — Dokumentasikan:**\r\n\r\nApapun yang terjadi, kirim pesan singkat ke HC Manager: *"Hari ini ada situasi dengan kandidat [nama] yang perlu keputusan cepat. Angka yang diminta masuk dalam range yang disetujui, jadi saya lanjutkan dengan offering letter. Detail lengkap akan saya sampaikan besok."*\r\n\r\n---\r\n\r\n> **Kamu tidak melampaui wewenang. Kamu menjalankan wewenang yang memang sudah ada — dengan data, dengan proses, dan dengan transparansi. Itulah yang membedakan HC yang bisa dipercaya dari HC yang perlu terus diawasi.**\r\n\r\n---\r\n\r\n## 6. Parameter Evaluasi: Tiga Pertanyaan Sebelum Eksekusi\r\n\r\nSebelum mengeksekusi keputusan apapun yang kamu ambil sendiri, jalankan tiga pertanyaan ini secara cepat:\r\n\r\n| Pertanyaan | Jawaban | Tindakan |\r\n|---|---|---|\r\n| **Apakah ini sesuai SOP atau kebijakan yang ada?** | Ya | Lanjutkan |\r\n| | Tidak ada SOP yang relevan | Gunakan Matriks Delegasi |\r\n| | Bertentangan dengan SOP | Berhenti — eskalasi |\r\n| **Apakah ada anggaran atau otorisasi yang mencukupi?** | Ya, dalam batas yang disetujui | Lanjutkan |\r\n| | Tidak ada atau tidak jelas | Eskalasi sebelum memutuskan |\r\n| **Apakah ada dampak hukum atau kepatuhan yang signifikan?** | Tidak ada atau sangat kecil | Lanjutkan |\r\n| | Ada — bahkan jika kecil | Konsultasi Legal atau atasan |\r\n\r\nTiga pertanyaan ini bisa dijawab dalam waktu kurang dari dua menit. Jika ketiganya hijau → putuskan. Jika satu atau lebih kuning → konsultasi. Jika satu merah → eskalasi.\r\n\r\n---\r\n\r\n## 7. Satu Cerita Penutup: Tentang Kepercayaan yang Dibangun Satu Keputusan pada Satu Waktu\r\n\r\nEnam bulan setelah kejadian di awal pelajaran ini, Bram dan Sinta menghadapi evaluasi kinerja.\r\n\r\nHC Manager Sinta berkata: *"Kamu adalah orang yang paling saya percaya untuk menangani hal-hal operasional tanpa perlu saya awasi terus. Kamu tidak pernah melampaui batas, tapi juga tidak pernah membekukan pekerjaan karena menunggu saya."*\r\n\r\nHC Manager Bram berkata dengan nada yang lebih hati-hati: *"Kamu orangnya teliti dan hati-hati. Tapi aku perlu kamu untuk lebih percaya diri mengambil keputusan sendiri. Sekarang aku tidak bisa pergi dua hari tanpa khawatir ada yang macet."*\r\n\r\n---\r\n\r\nSinta tidak lebih pintar dari Bram. Ia hanya memiliki sesuatu yang sederhana tapi sangat berharga: **kerangka berpikir yang jelas tentang kapan ia bisa bergerak sendiri dan kapan harus berhenti**.\r\n\r\nKerangka itu tidak datang dari satu kali belajar teori. Ia datang dari kebiasaan kecil: setiap kali menghadapi situasi yang tidak jelas, Sinta tidak langsung panik atau langsung bertindak — ia berhenti sebentar, menjawab tiga pertanyaan, dan bergerak dengan arah yang jelas.\r\n\r\nSatu keputusan pada satu waktu. Itulah cara kepercayaan dibangun.\r\n\r\n---\r\n\r\n## ✅ Ringkasan\r\n\r\n| Konsep | Yang Perlu Diingat |\r\n|---|---|\r\n| **Otonomi operasional** | Bukan melakukan apa yang kamu mau — tapi memiliki kejelasan kapan bisa bergerak sendiri |\r\n| **Zona Hijau** | Risiko rendah, bisa diperbaiki → putuskan dan eksekusi langsung |\r\n| **Zona Kuning** | Ada ketidakpastian signifikan → konsultasi dulu, baru putuskan |\r\n| **Zona Merah** | Dampak besar, tidak bisa dibalik → eskalasi, jangan ambil sendiri |\r\n| **5 Langkah** | Identifikasi urgensi → cek SOP → analisis data → putuskan → dokumentasikan dan laporkan |\r\n| **3 Pertanyaan Cepat** | Sesuai SOP? Ada anggaran/otorisasi? Ada dampak hukum? |\r\n| **Dokumentasi** | Bukan formalitas — ini cara membangun kepercayaan dan melindungi dirimu sendiri |\r\n| **Tidak memutuskan juga keputusan** | Dan seringkali konsekuensinya lebih besar dari keputusan yang salah sekalipun |\r\n\r\n---\r\n\r\n## 🔗 Koneksi ke Pelajaran Berikutnya\r\n\r\nPada pelajaran berikutnya — **Simulasi Krisis: HC Manager Tidak Ada** — kamu akan menghadapi rangkaian situasi yang lebih kompleks dan berlapis: bukan hanya satu keputusan, tapi serangkaian keputusan yang saling terkait dalam satu hari kerja tanpa atasan. Kerangka berpikir dari pelajaran ini akan menjadi pondasinya.\r\n\r\n---\r\n\r\n## 📝 Cek Pemahaman\r\n\r\nSebelum melanjutkan, jawab pertanyaan berikut:\r\n\r\n1. Pikirkan tiga keputusan yang dalam sebulan terakhir kamu tunda menunggu atasan. Dengan Matriks Delegasi yang baru kamu pelajari — masuk zona mana masing-masing? Apakah ada yang sebenarnya bisa dan seharusnya kamu ambil sendiri?\r\n\r\n2. Apa perbedaan antara *mengambil keputusan yang melampaui wewenang* dan *mengeksekusi keputusan yang sudah diotorisasi sebelumnya*? Berikan satu contoh konkret dari masing-masing.\r\n\r\n3. Dalam cerita kandidat yang butuh jawaban hari ini: misalkan angka yang diminta kandidat 12% di atas batas atas range yang disetujui. Apa yang akan kamu lakukan secara step-by-step?\r\n\r\n4. Mengapa dokumentasi dan pelaporan ke atasan setelah mengambil keputusan mandiri itu penting — bahkan untuk keputusan kecil yang hasilnya baik? Apa yang hilang jika langkah ini dilewati?\r\n\r\n---\r\n\r\n*Pelajaran dalam Modul: Tata Kelola Operasional HC & Pengambilan Keputusan Strategis*\r\n*Program TDP HCM Successorship — PT Vascomm Solusi Teknologi*	\N	\N	40	0	2026-06-10 12:59:51.63	2026-06-11 08:56:48.82
cmqa8qino000204js5qgohp5k	cmq08teey000604l4pxptoagn	Kematangan Kepemimpinan: Checklist Kesiapan Suksesi	TEXT	## Kematangan Kepemimpinan HC\n\nKematangan bukan soal umur atau lama kerja. Kematangan pimpin adalah kemampuan kontrol emosi, ambil putus sulit, dan tanggung jawab penuh. Dalam **Human Capital (HC)**, pimpin matang ciptakan sistem kuat, bukan ketergantungan personil.\n\n### Pilar Utama Kematangan\n1.  **Kecerdasan Emosi**: Tetap tenang saat krisis. Tidak cari kambing hitam.\n2.  **Pikir Strategis**: Hubungkan aksi HC dengan profit bisnis.\n3.  **Ownership**: Anggap perusahaan milik sendiri. Jaga aset, kembangkan orang.\n\n---\n\n## Checklist Kesiapan Suksesi\n\nGunakan daftar ini ukur calon pimpin baru. Jika poin belum centang, beri pelatihan tambahan.\n\n### 1. Kesiapan Mental & Karakter\n- [ ] **Integritas**: Satunya kata dan perbuatan.\n- [ ] **Resiliensi**: Bangkit cepat setelah gagal proyek.\n- [ ] **Kerendahan Hati**: Mau dengar masukan staf junior.\n\n### 2. Kompetensi Strategis\n- [ ] **Analisis Data**: Bisa baca tren *turnover* dan beri solusi.\n- [ ] **Navigasi Politik**: Paham dinamika organisasi tanpa memihak.\n- [ ] **Visi Masa Depan**: Tahu butuh talenta apa 3 tahun lagi.\n\n### 3. Pengembangan Orang (People Development)\n- [ ] **Mentoring**: Punya jadwal rutin latih bawahan.\n- [ ] **Delegasi**: Berani lepas tugas penting ke tim.\n- [ ] **Identifikasi Bakat**: Tahu siapa bintang di tim dia.\n\n---\n\n## Contoh Praktis: Skenario Suksesi\n\n**Situasi**: Manager HC (Andi) akan promosi jadi Head of HC.\n**Aksi Kematangan**:\n- Andi tunjuk satu Supervisor (Budi) sebagai calon ganti.\n- Andi beri Budi proyek **Organization Design** yang rumit.\n- Andi tidak ambil kredit saat proyek sukses; dia puji Budi depan Direksi.\n- Andi buat dokumen SOP lengkap agar operasional tidak macet saat dia pindah.\n\n**Hasil**: Suksesi mulus. Organisasi tidak guncang. Budi siap karena sudah dilatih.\n\n---\n\n## Ringkasan Kunci\n\n- **Kematangan** = Emosi stabil + Pikir jauh + Aksi nyata.\n- **Suksesi Gagal** karena pimpin takut diganti atau tidak latih tim.\n- **Checklist** adalah alat ukur objektif, bukan perasaan.\n- Pimpin hebat bukan yang paling pintar, tapi yang cetak pimpin baru lebih pintar.\n\n**Langkah Lanjut**:\n1. Ambil satu staf potensial.\n2. Cocokkan dengan **Checklist Kesiapan**.\n3. Buat jadwal mentoring mingguan.	\N	\N	\N	2	2026-06-12 01:21:26.772	2026-06-12 01:22:00.894
cmq82szh5000204kwy5e2twte	cmq08teex000504l48tgf5ixm	Workshop: Matriks Keputusan & Eskalasi	DOCUMENT	\N	\N	https://docs.google.com/document/d/1q8OdMlATG4sxcklPfalRsE_qp7d9EP8u4ywC0CKk7Ro/edit?usp=sharing	120	2	2026-06-10 12:59:51.833	2026-06-11 09:40:26.617
cmqa8qj0f000504js80x3m2pa	cmq08teey000604l4pxptoagn	Closing: Pengakuan Perkembangan Kepemimpinan	TEXT	## Esensi Pengakuan Perkembangan\nAkui tumbuh tanda pimpin matang. Tanpa aku, **Ownership** mati. HC bukan urus orang saja, tapi bangun jiwa. Puji tim buat tim rasa milik. Kerja bukan paksa, tapi mau.\n\n### Pilar Kematangan Kepemimpinan HC\n*   **Self-Awareness**: Tahu kurang diri. Perbaiki diri terus.\n*   **Resilience**: Tahan banting saat sulit. Tetap tenang.\n*   **Empowerment**: Beri kuasa ke tim. Percaya orang bisa.\n*   **Accountability**: Gagal pikul sendiri. Sukses bagi tim.\n\n### Langkah Praktis: Ritual Apresiasi\nPuji jangan asal. Gunakan cara **S-B-I**:\n1.  **Situation** (Situasi): Sebut kapan terjadi.\n    *   *Contoh*: "Saat krisis rekrutmen bulan lalu."\n2.  **Behavior** (Perilaku): Sebut aksi pasti.\n    *   *Contoh*: "Kamu ambil kendali dan tenang."\n3.  **Impact** (Dampak): Sebut hasil bagus.\n    *   *Contoh*: "Target capai tepat waktu."\n\n### Contoh Pengakuan Ownership\n```text\n"Budi, kamu ambil tanggung jawab saat sistem error. \nItu bukti Ownership nyata. Kamu tidak lempar salah. \nTim jadi tenang. Kamu pimpin matang."\n```\n\n### Strategi Jangka Panjang\n*   **Feedback Rutin**: Jangan tunggu tahun depan. Ngobrol tiap minggu.\n*   **Rayakan Gagal**: Gagal itu belajar. Akui usaha walau hasil belum ada.\n*   **Promosi Internal**: Beri posisi baru bagi yang tumbuh.\n\n### Ringkasan Poin Kunci\n*   **Ownership** tumbuh saat orang rasa hargai.\n*   Pimpin matang akui proses, bukan cuma hasil.\n*   HC kuat kalau pimpin rendah hati dan mau puji.\n\nEvaluasi diri. Puji tim sekarang. Selesai.	\N	\N	\N	5	2026-06-12 01:21:27.231	2026-06-12 01:22:15.958
cmq82szp1000504kw76ol71y5	cmq08teex000504l48tgf5ixm	Refleksi Diri & Jurnal Keputusan	TEXT	\r\n# Refleksi Diri & Jurnal Keputusan\r\n\r\n**Modul:** Tata Kelola Operasional HC & Pengambilan Keputusan Strategis\r\n**Pelajaran:** 6 dari 6 — Penutup Modul\r\n**Durasi estimasi:** 40 menit\r\n**Tipe:** Materi Teks\r\n\r\n---\r\n\r\n## 🎯 Tujuan Pembelajaran\r\n\r\nSetelah menyelesaikan pelajaran ini, kamu akan mampu:\r\n\r\n1. Menjelaskan mengapa refleksi diri adalah komponen yang tidak bisa dipisahkan dari pengambilan keputusan yang baik\r\n2. Memahami bagaimana **bias hindsight** dan **bias konfirmasi** bekerja diam-diam dalam setiap keputusan yang kamu buat\r\n3. Membangun dan menjalankan **Jurnal Keputusan** sebagai alat belajar yang berkelanjutan\r\n4. Mengidentifikasi pola dalam cara kamu mengambil keputusan — kekuatan yang perlu diperkuat dan kelemahan yang perlu diperbaiki\r\n\r\n---\r\n\r\n## 📌 Pertanyaan Pembuka\r\n\r\n> Pikirkan satu keputusan penting yang kamu buat dalam enam bulan terakhir — dalam pekerjaan, tentang rekrutmen, tentang kebijakan, atau tentang cara menangani situasi sulit.\r\n>\r\n> Sekarang tanyakan pada dirimu sendiri: **Apakah kamu masih ingat dengan tepat mengapa kamu memilih keputusan itu?** Bukan hasil akhirnya — tapi *alasan* yang ada di kepalamu saat kamu memutuskan?\r\n>\r\n> Apakah kamu ingat informasi apa yang kamu miliki saat itu? Apakah kamu ingat opsi lain yang kamu pertimbangkan tapi akhirnya tidak dipilih? Apakah kamu ingat kondisi apa yang sedang kamu rasakan — apakah kamu sedang lelah, terburu-buru, atau justru sangat yakin?\r\n\r\nKemungkinan besar, sebagian besar detailnya sudah kabur. Dan itulah persis masalah yang dibahas di pelajaran terakhir modul ini.\r\n\r\n---\r\n\r\n## 1. Sebuah Cerita: Pemimpin yang Selalu Merasa Sudah Tahu\r\n\r\nHendra adalah HC Manager di sebuah perusahaan manufaktur. Ia sudah menjabat selama tujuh tahun dan memiliki reputasi sebagai orang yang "berpengalaman" — ia selalu punya jawaban cepat untuk setiap situasi.\r\n\r\nSuatu hari, perusahaannya menghadapi tingkat turnover yang melonjak drastis — dari 12% menjadi 28% dalam satu tahun. Manajemen meminta Hendra menganalisis penyebabnya.\r\n\r\nHendra menyimpulkan dengan cepat: *"Masalahnya ada di kompensasi. Kompetitor menawarkan gaji lebih tinggi."* Ia merekomendasikan kenaikan gaji massal 15%.\r\n\r\nRekomendasi disetujui. Dilaksanakan. Dan enam bulan kemudian, turnover masih di angka 26%.\r\n\r\n---\r\n\r\nKetika akhirnya dilakukan survei mendalam, penyebab utama yang terungkap bukan kompensasi — melainkan hubungan dengan atasan langsung yang dianggap tidak memberikan feedback, dan ketidakjelasan jenjang karier.\r\n\r\nHendra terkejut. Dalam benaknya, ia sudah yakin bahwa kompensasi adalah masalahnya — karena *itu yang selalu jadi masalah* di pengalaman-pengalamannya sebelumnya.\r\n\r\nIa tidak salah karena kurang pengalaman. Ia salah karena **pengalamannya justru membuatnya terlalu cepat menyimpulkan** — tanpa memeriksa apakah asumsinya kali ini masih relevan.\r\n\r\n---\r\n\r\nInilah yang disebut **bias konfirmasi**: kecenderungan untuk mencari dan mempercayai informasi yang mengonfirmasi apa yang sudah kita yakini, dan mengabaikan informasi yang bertentangan. Dan semakin berpengalaman seseorang, semakin halus dan berbahaya bias ini bekerja — karena ia tersembunyi di balik label "intuisi" atau "pengalaman."\r\n\r\nRefleksi diri adalah cara paling efektif untuk mendeteksi dan menginterupsi bias semacam ini.\r\n\r\n---\r\n\r\n## 2. Mengapa Refleksi Bukan Kemewahan, Tapi Keharusan\r\n\r\nAda anggapan yang sangat umum di lingkungan kerja yang bergerak cepat: *"Refleksi itu bagus, tapi kita tidak punya waktu untuk itu. Kita harus terus bergerak."*\r\n\r\nAnggapan ini terdengar masuk akal. Tapi ia mengandung asumsi yang salah — bahwa refleksi dan bergerak cepat adalah dua hal yang berlawanan.\r\n\r\nKenyataannya, pemimpin yang tidak pernah berefleksi memang bergerak cepat. Tapi mereka sering bergerak cepat ke arah yang salah — dan tidak pernah menyadarinya sampai sudah jauh. Sedangkan pemimpin yang meluangkan waktu untuk berefleksi, bahkan hanya 15–20 menit seminggu, bergerak sedikit lebih lambat tapi jauh lebih jarang harus membuang waktu mengulang kesalahan yang sama.\r\n\r\n> **Refleksi bukan tentang berhenti. Refleksi adalah tentang memastikan kamu sedang berlari ke arah yang benar sebelum berlari lebih jauh.**\r\n\r\nAda tiga hal spesifik yang tidak bisa tumbuh tanpa refleksi yang disengaja:\r\n\r\n**Pertama, kemampuan mengenali bias diri sendiri.** Bias tidak terasa seperti bias. Bias terasa seperti "akal sehat" atau "sudah jelas". Satu-satunya cara untuk mendeteksinya adalah dengan sengaja memeriksa: *"Apa yang membuat saya sangat yakin dengan ini? Apakah ada kemungkinan bahwa keyakinan ini ternyata salah?"*\r\n\r\n**Kedua, kualitas intuisi.** Intuisi yang baik bukan sesuatu yang datang tiba-tiba — ia adalah akumulasi dari banyak pola yang dipelajari secara sadar. Pemimpin yang tidak pernah merefleksikan keputusan-keputusannya tidak pernah mengekstrak pelajaran dari pengalamannya, sehingga pengalaman selama sepuluh tahun pun bisa bernilai sama dengan pengalaman dua tahun yang direfleksikan dengan baik.\r\n\r\n**Ketiga, kemampuan mengambil keputusan di bawah tekanan emosional.** Tekanan, kelelahan, frustrasi, dan euforia semuanya memengaruhi kualitas keputusan — kadang secara dramatis. Tanpa kebiasaan memeriksa kondisi diri sendiri, kamu tidak akan pernah tahu seberapa besar emosimu memengaruhi pilihan-pilihanmu.\r\n\r\n---\r\n\r\n## 3. Bias yang Paling Berbahaya: Hindsight Bias\r\n\r\nSelain bias konfirmasi yang sudah dibahas lewat cerita Hendra, ada satu bias lagi yang sangat relevan untuk siapapun yang mengambil keputusan — dan ini yang paling sulit dideteksi karena ia muncul *setelah* keputusan diambil.\r\n\r\n**Hindsight bias** adalah kecenderungan, setelah sebuah kejadian terjadi, untuk merasa bahwa kita "sudah tahu" hasilnya dari awal — padahal kenyataannya tidak.\r\n\r\nContoh yang sangat familiar: setelah rekrutmen yang kamu lakukan ternyata gagal, kamu berkata *"Sebenarnya dari awal saya sudah curiga dengan kandidat itu."* Atau setelah rekrutmen berhasil, kamu berkata *"Dari pertama wawancara saya sudah merasa ini orangnya."*\r\n\r\nMasalahnya, ini hampir tidak pernah akurat. Memori kita secara aktif menulis ulang masa lalu berdasarkan apa yang terjadi — sehingga kita merasa lebih konsisten dan lebih "tahu" dari yang sebenarnya.\r\n\r\nMengapa ini berbahaya? Karena jika kamu selalu merasa sudah tahu hasilnya dari awal, kamu tidak pernah benar-benar belajar dari kesalahan. Kamu tidak mengekstrak pelajaran yang tepat — karena kamu sudah merevisi ceritanya sehingga tidak ada kesalahan yang perlu dipelajari.\r\n\r\n**Jurnal Keputusan adalah alat paling efektif untuk melawan hindsight bias** — karena ia memaksa kamu untuk mencatat *apa yang kamu pikir saat itu*, bukan *apa yang terasa benar setelah kamu tahu hasilnya*.\r\n\r\n---\r\n\r\n## 4. Jurnal Keputusan: Lebih dari Sekadar Catatan\r\n\r\nBanyak orang yang mendengar "jurnal keputusan" langsung membayangkan pekerjaan administratif tambahan yang membosankan. Tapi Jurnal Keputusan yang baik bukan buku harian, bukan laporan, dan bukan dokumentasi formal.\r\n\r\nJurnal Keputusan adalah **peta logika berpikirmu** — catatan tentang bagaimana kamu berpikir pada satu momen tertentu, yang bisa kamu baca kembali tiga bulan kemudian untuk belajar dari perbedaan antara apa yang kamu prediksi dan apa yang benar-benar terjadi.\r\n\r\n---\r\n\r\n### Apa yang Dicatat dan Mengapa\r\n\r\n**① Situasi / Masalah**\r\n\r\nDeskripsi singkat tentang apa yang terjadi — bukan analisis panjang, cukup cukup detail sehingga kamu bisa memahami konteksnya ketika membacanya tiga bulan kemudian.\r\n\r\n*Mengapa ini penting:* Memori kita sangat tidak akurat dalam hal detail konteks. Tanpa catatan, kamu tidak akan ingat bahwa keputusan itu diambil di tengah tekanan deadline, atau bahwa ada faktor eksternal yang memengaruhi pilihanmu.\r\n\r\n**② Variabel yang Memengaruhi**\r\n\r\nFaktor-faktor apa yang paling memengaruhi keputusanmu? Anggaran? Waktu? Kondisi tim? Tekanan dari manajemen? Keterbatasan informasi?\r\n\r\n*Mengapa ini penting:* Ini memaksamu berpikir eksplisit tentang apa yang kamu pertimbangkan — dan dengan demikian juga tentang apa yang *tidak* kamu pertimbangkan.\r\n\r\n**③ Prediksi Hasil**\r\n\r\nApa yang kamu harapkan akan terjadi setelah keputusan ini diambil? Jadikan ini sekonkret mungkin — bukan *"semoga lebih baik"*, tapi *"dalam 3 bulan, skor kepuasan karyawan akan naik dari 65% ke 75%."*\r\n\r\n*Mengapa ini penting:* Inilah pertahanan utama terhadap hindsight bias. Dengan menuliskan prediksi secara eksplisit, kamu tidak bisa menulis ulang sejarah nanti.\r\n\r\n**④ Logika Keputusan**\r\n\r\nMengapa kamu memilih opsi ini dan bukan yang lain? Opsi apa yang kamu pertimbangkan tapi akhirnya tidak dipilih, dan mengapa?\r\n\r\n*Mengapa ini penting:* Ini adalah bagian yang paling bernilai untuk belajar. Ketika kamu melihat kembali sebuah keputusan yang ternyata salah, ini adalah tempat di mana kamu bisa menemukan di mana logikamu meleset.\r\n\r\n**⑤ Kondisi Diri Saat Memutuskan**\r\n\r\nApakah kamu sedang lelah? Sedang dalam tekanan yang tinggi? Sedang merasa sangat yakin karena baru saja ada kejadian positif? Sedang kurang tidur?\r\n\r\n*Mengapa ini penting:* Kondisi fisik dan emosional terbukti memengaruhi kualitas keputusan secara signifikan. Dengan mencatatnya, kamu bisa melihat pola: apakah keputusanmu cenderung lebih buruk ketika dibuat dalam kondisi tertentu?\r\n\r\n---\r\n\r\n### Contoh Jurnal yang Konkret\r\n\r\nBerikut adalah contoh dua entri jurnal yang menggambarkan cara penggunaannya:\r\n\r\n---\r\n\r\n**Entri 1 — Saat Ditulis (1 November 2024)**\r\n\r\n> **Situasi:** Turnover tim Customer Success meningkat dari 8% ke 19% dalam 6 bulan. Lead CS meminta kenaikan gaji rata-rata 20% untuk seluruh tim.\r\n>\r\n> **Variabel:** Anggaran terbatas (hanya tersedia untuk kenaikan rata-rata 10%), data survei keterlibatan belum selesai, kompetitor memang menawarkan lebih tinggi.\r\n>\r\n> **Logika:** Saya memutuskan untuk memberikan kenaikan selektif (15–20%) hanya untuk dua orang dengan risiko resign tertinggi berdasarkan sinyal yang terlihat, sambil menunggu hasil survei keterlibatan sebelum memutuskan untuk seluruh tim. Opsi yang tidak dipilih: kenaikan merata 10% untuk semua (terasa tidak signifikan), atau tidak ada kenaikan sama sekali (terlalu berisiko).\r\n>\r\n> **Prediksi:** Dalam 3 bulan, turnover di tim CS akan kembali ke bawah 12%. Dua orang yang mendapat kenaikan akan tetap.\r\n>\r\n> **Kondisi diri:** Cukup lelah — minggu ini ada tiga rapat besar. Tapi keputusan ini sudah dipikirkan sejak minggu lalu, bukan terburu-buru.\r\n\r\n---\r\n\r\n**Evaluasi — 3 Bulan Kemudian (1 Februari 2025)**\r\n\r\n> **Hasil aktual:** Turnover turun ke 14% — lebih baik, tapi tidak mencapai target di bawah 12%. Dua orang yang mendapat kenaikan memang bertahan. Tapi ada satu orang lain yang kemudian resign — dan ternyata alasan utamanya bukan gaji, tapi merasa tidak ada jalur karier yang jelas.\r\n>\r\n> **Pelajaran:** Keputusan selektif sudah tepat. Tapi prediksi saya terlalu optimis dan mengabaikan dimensi karier. Data survei yang akhirnya keluar menunjukkan bahwa "kejelasan karier" adalah faktor ketiga terbesar — tapi saya tidak memasukkan ini dalam pertimbangannya karena survei belum selesai saat memutuskan. Ke depan: jika ada keputusan retensi penting dan survei sedang berjalan, pertimbangkan untuk menunda keputusan atau setidaknya menambahkan hipotesis tentang faktor non-kompensasi.\r\n\r\n---\r\n\r\nPerhatikan kekuatan dari format ini. Kamu tidak hanya mencatat "keputusan apa" — kamu mencatat "mengapa" dengan cukup detail sehingga evaluasi tiga bulan kemudian bisa bermakna. Dan ketika hasilnya tidak sesuai prediksi, kamu bisa melihat dengan jelas di mana asumsimu meleset.\r\n\r\n---\r\n\r\n## 5. Cara Membangun Kebiasaan yang Bertahan\r\n\r\nJurnal Keputusan yang paling baik adalah yang benar-benar kamu gunakan — bukan yang paling rapi atau paling lengkap. Berikut cara membuatnya berkelanjutan:\r\n\r\n---\r\n\r\n**Mulai kecil, bukan sempurna**\r\n\r\nKamu tidak perlu mencatat setiap keputusan. Mulailah dengan satu keputusan penting per minggu — bisa dari pekerjaan, bisa dari kehidupan pribadi yang relevan. Lima menit per entri sudah cukup di awal. Yang penting adalah konsistensinya, bukan panjangnya.\r\n\r\n**Tulis dalam 2 jam setelah memutuskan, bukan keesokan harinya**\r\n\r\nIni adalah aturan yang tidak boleh dikompromi. Memori terdegradasi dengan cepat — bukan hanya detailnya, tapi juga *nuansa emosional* dari keputusan itu. Setelah 24 jam, otak sudah mulai merevisi ceritanya. Tulis saat masih segar.\r\n\r\n**Jadwalkan review bulanan sebagai acara yang tidak bisa dibatalkan**\r\n\r\nReview Jurnal Keputusan bukan tentang mengevaluasi apakah keputusanmu benar atau salah — itu terlalu sederhana. Ini tentang mencari *pola*:\r\n\r\n- Apakah kamu cenderung terlalu optimis dalam memprediksi hasil?\r\n- Apakah keputusan yang dibuat di bawah tekanan waktu cenderung lebih buruk?\r\n- Apakah ada jenis situasi tertentu di mana pertimbanganmu selalu meleset?\r\n- Apakah ada bias yang terus-menerus muncul?\r\n\r\n**Bedakan antara "keputusan yang salah" dan "proses yang salah"**\r\n\r\nIni adalah perbedaan yang sangat penting dan sering diabaikan. Sebuah keputusan bisa salah meskipun prosesnya sudah benar — karena informasi yang tersedia saat itu tidak lengkap, atau karena ada faktor yang tidak bisa diprediksi. Yang perlu dievaluasi bukan hanya apakah hasilnya baik, tapi apakah *cara kamu sampai ke keputusan itu* sudah solid.\r\n\r\n---\r\n\r\n## 6. Satu Cerita Penutup: Dua Versi Rofiq, Tiga Tahun ke Depan\r\n\r\nBayangkan dua versi dari diri kamu — Rofiq A dan Rofiq B — tiga tahun dari sekarang.\r\n\r\n---\r\n\r\n**Rofiq A** menyelesaikan modul ini, merasa tercerahkan, dan kembali ke ritme kerja seperti biasa. Ia sesekali merefleksikan hal-hal yang berjalan buruk — tapi hanya ketika dipaksa oleh evaluasi formal atau ketika ada masalah yang tidak bisa diabaikan.\r\n\r\nTiga tahun kemudian, ia masih membuat keputusan dengan cara yang sama seperti sekarang. Ia tidak membuat banyak kesalahan besar, tapi ia juga tidak berkembang secara dramatis. Ketika ditanya tentang keputusan yang ia ambil dua tahun lalu, ia tidak ingat mengapa ia memilih opsi itu — *"Sepertinya sudah benar pada saat itu."*\r\n\r\n---\r\n\r\n**Rofiq B** memutuskan untuk mencoba satu hal yang sangat sederhana: setiap Jumat sore, ia meluangkan 15 menit untuk menulis satu keputusan penting yang ia ambil minggu itu, beserta alasannya. Setiap akhir bulan, ia membaca ulang catatan sebulan terakhir.\r\n\r\nSelama bulan pertama, tidak ada yang terasa dramatis. Bulan kedua, ia mulai melihat sesuatu: ia menyadari bahwa hampir semua keputusan yang terasa "paling yakin" ternyata adalah keputusan yang paling sedikit ia verifikasi datanya. Sebaliknya, keputusan yang ia pertimbangkan lebih lama dan lebih banyak mengumpulkan perspektif memiliki hasil yang lebih konsisten.\r\n\r\nTiga tahun kemudian, Rofiq B memiliki lebih dari 150 entri jurnal keputusan. Ia tahu dengan tepat di situasi apa ia cenderung terlalu optimis. Ia tahu kapan kondisi fisiknya memengaruhi pertimbangannya. Ia bisa menjelaskan kepada tim juniornya *mengapa* sebuah keputusan dibuat — bukan hanya *apa* yang diputuskan.\r\n\r\nDan ketika ada situasi baru yang kompleks, ia tidak hanya mengandalkan "instinct" — ia punya ratusan data poin dari perjalanannya sendiri.\r\n\r\n---\r\n\r\nPerbedaan antara Rofiq A dan Rofiq B bukan bakat. Bukan akses ke pelatihan yang lebih baik. Bukan koneksi atau keberuntungan.\r\n\r\n**Perbedaannya adalah 15 menit setiap Jumat sore.**\r\n\r\n---\r\n\r\n> **Pemimpin yang baik bukan yang tidak pernah membuat keputusan yang salah. Pemimpin yang baik adalah yang terus menjadi lebih baik dalam mengambil keputusan — karena ia memiliki sistem untuk belajar dari setiap keputusan yang pernah ia buat.**\r\n\r\n---\r\n\r\n## ✅ Ringkasan\r\n\r\n| Konsep | Yang Perlu Diingat |\r\n|---|---|\r\n| **Bias Konfirmasi** | Semakin berpengalaman, semakin halus — selalu tanya: "Apa yang bisa membuat saya salah?" |\r\n| **Hindsight Bias** | Menulis prediksi sebelum hasilnya diketahui adalah satu-satunya cara melawannya |\r\n| **Refleksi** | Bukan kemewahan — ini cara memastikan kamu belajar dari pengalaman, bukan hanya mengulangnya |\r\n| **5 Komponen Jurnal** | Situasi → Variabel → Prediksi → Logika → Kondisi diri |\r\n| **Tulis dalam 2 jam** | Aturan yang tidak boleh dikompromikan — memori sudah mulai merevisi dirinya sendiri setelah itu |\r\n| **Review bulanan** | Bukan untuk menilai benar-salah, tapi untuk mencari pola berulang dalam cara berpikirmu |\r\n| **Proses vs Hasil** | Keputusan bisa salah meski prosesnya sudah benar — evaluasi keduanya secara terpisah |\r\n\r\n---\r\n\r\n## 🔭 Refleksi Penutup Modul\r\n\r\nIni adalah pelajaran terakhir dari modul **Tata Kelola Operasional HC & Pengambilan Keputusan Strategis**. Sebelum melanjutkan, luangkan waktu untuk menjawab pertanyaan-pertanyaan ini dengan jujur:\r\n\r\n1. **Dari semua pelajaran di modul ini** — Keputusan Tanpa Atasan, Matriks Keputusan, Simulasi Krisis, Penyelarasan Wewenang, hingga Refleksi Diri — konsep mana yang paling mengubah cara berpikirmu tentang peranmu sebagai HC di Vascomm?\r\n\r\n2. **Buka kembali cerita Hendra** di awal pelajaran ini. Apakah ada keputusan yang pernah kamu buat dengan pola pikir yang mirip — terlalu cepat menyimpulkan berdasarkan pengalaman sebelumnya? Apa yang bisa kamu lakukan berbeda jika situasi itu terjadi lagi?\r\n\r\n3. **Mulai Jurnal Keputusan-mu hari ini.** Tulis satu keputusan penting yang kamu ambil minggu ini. Gunakan format lima komponen yang sudah dipelajari. Tandai tanggal kapan kamu akan membaca ulang untuk evaluasi.\r\n\r\n4. **Satu komitmen konkret:** Apa satu kebiasaan refleksi yang akan kamu mulai — sekecil apapun — mulai minggu depan?\r\n\r\n---\r\n\r\n*Pelajaran 6 dari 6  ·  Modul: Tata Kelola Operasional HC & Pengambilan Keputusan Strategis*\r\n*Program TDP HCM Successorship — PT Vascomm Solusi Teknologi*	\N	\N	40	5	2026-06-10 12:59:52.117	2026-06-11 09:59:16.28
cmq82szjr000304kw2777bj8z	cmq08teex000504l48tgf5ixm	Simulasi Krisis: Penanganan Resign Mendadak	TEXT	# Simulasi Krisis: Penanganan Resign Mendadak\r\n\r\n**Modul:** Tata Kelola Operasional HC & Pengambilan Keputusan Strategis\r\n**Pelajaran:** 4 dari 6\r\n**Durasi estimasi:** 45 menit\r\n**Tipe:** Materi Teks\r\n\r\n---\r\n\r\n## 🎯 Tujuan Pembelajaran\r\n\r\nSetelah menyelesaikan pelajaran ini, kamu akan mampu:\r\n\r\n1. Merespons situasi resign mendadak dengan langkah yang terstruktur — bukan reaktif dan panik\r\n2. Menerapkan **OODA Loop** (John Boyd) untuk mengambil keputusan cepat dalam kondisi ketidakpastian\r\n3. Menggunakan pendekatan **Business Continuity Planning (ISO 22301 / SHRM)** untuk memastikan tidak ada aspek operasional yang terlewat\r\n4. Menentukan prioritas tindakan dalam 24 jam pertama saat karyawan kunci tiba-tiba mengundurkan diri\r\n5. Membangun sistem pencegahan agar Vascomm tidak masuk mode krisis setiap kali ada resign\r\n\r\n---\r\n\r\n## 📌 Pertanyaan Pembuka\r\n\r\n> Bayangkan ini: Senin pagi, jam 8.15. Kamu baru tiba di kantor. HP kamu sudah berdering sejak di jalan — ada 4 pesan dari Lead Engineering, 2 dari Direktur Operasional, dan 1 dari HC Manager.\r\n>\r\n> Isi pesannya? **Reza, Senior Developer yang memegang arsitektur seluruh sistem backend Vascomm, baru saja mengirim surat resign efektif hari ini. Ia tidak mau masuk lagi.**\r\n>\r\n> Reza memegang akses ke semua server produksi. Ia satu-satunya yang tahu cara menjalankan proses deployment. Tidak ada dokumentasi tertulis tentang sistem yang ia bangun. Dan klien enterprise terbesar Vascomm dijadwalkan demo produk pada Rabu lusa.\r\n>\r\n> **Kamu punya waktu 15 menit sebelum meeting darurat dengan Direktur. Apa yang pertama kali kamu lakukan?**\r\n\r\nPelajaran ini dirancang untuk memberimu jawaban yang terstruktur — bukan hanya untuk situasi hipotetis ini, tapi untuk semua varian resign mendadak yang mungkin kamu hadapi.\r\n\r\n---\r\n\r\n## 1. Sebuah Cerita: Dua Cara Merespons Krisis yang Sama\r\n\r\nDi dua perusahaan berbeda, situasi yang hampir identik terjadi pada minggu yang sama.\r\n\r\n---\r\n\r\n**Perusahaan pertama — sebut saja Nexar:**\r\n\r\nLead Finance perusahaan ini mengajukan resign mendadak via email Senin pagi. HC Manager Nexar panik. Dalam dua jam pertama, ia menghabiskan waktu bolak-balik antara: mencoba membujuk si karyawan untuk kembali, menelpon CEO yang tidak ada di kantor, dan mengirimkan email marah-marah ke Lead yang bersangkutan menanyakan "mengapa tidak melalui prosedur yang benar."\r\n\r\nTidak ada yang memeriksa apakah akses sistem keuangan sudah dicabut. Tidak ada yang mengidentifikasi pekerjaan apa yang sedang berjalan. Tidak ada yang menghubungi Finance team untuk memberitahu kondisi ini.\r\n\r\nTiga hari kemudian, terungkap bahwa si karyawan sudah login ke sistem akuntansi dari rumahnya dan mengunduh sejumlah dokumen. Tidak ada yang bisa memastikan apa yang diambil.\r\n\r\n---\r\n\r\n**Perusahaan kedua — sebut saja Vertex:**\r\n\r\nHC Officer Vertex menghadapi situasi serupa: Developer senior mengundurkan diri mendadak. Dalam 15 menit pertama setelah kabar diterima, ia melakukan tiga hal:\r\n\r\nPertama, ia menghubungi IT dan meminta akses sistem developer tersebut dibekukan sementara — bukan dicabut permanen, tapi dibekukan sampai ada proses offboarding yang terstruktur.\r\n\r\nKedua, ia mengirim pesan singkat ke Lead Engineering: *"Saya butuh 30 menit bersamamu hari ini untuk mapping tugas yang sedang berjalan dan memastikan tidak ada yang jatuh."*\r\n\r\nKetiga, ia membuat draft ringkasan situasi untuk Direktur — tiga kalimat: apa yang terjadi, apa yang sudah dilakukan, apa yang akan dilakukan dalam 48 jam ke depan.\r\n\r\nBaru setelah tiga hal itu selesai, ia mencoba menghubungi si karyawan untuk diskusi offboarding yang terhormat.\r\n\r\n---\r\n\r\nHasilnya? Nexar butuh empat minggu untuk sepenuhnya pulih dari situasi itu, dengan potensi risiko keamanan data yang tidak pernah bisa dipastikan sepenuhnya. Vertex menyelesaikan transisi dalam delapan hari kerja, dengan dampak minimal ke operasional.\r\n\r\nPerbedaannya bukan soal keberuntungan. Bukan soal karyawan yang lebih baik. **Perbedaannya ada pada satu hal: apakah ada kerangka berpikir yang jelas tentang apa yang harus dilakukan dalam 24 jam pertama.**\r\n\r\n---\r\n\r\n## 2. Mengapa Resign Mendadak Terasa Seperti Bencana (Padahal Tidak Harus)\r\n\r\nSebelum masuk ke langkah penanganannya, ada satu hal penting yang perlu diluruskan terlebih dahulu.\r\n\r\nResign mendadak terasa seperti bencana karena ia menyentuh tiga ketakutan sekaligus:\r\n\r\n**Ketakutan pertama — Operasional akan lumpuh.** *"Siapa yang akan mengerjakan pekerjaannya? Kita tidak bisa berjalan tanpa dia."*\r\n\r\n**Ketakutan kedua — Reputasi akan rusak.** *"Apa yang akan dipikirkan tim lain? Klien? Manajemen? Apakah ini pertanda bahwa ada yang salah dengan cara kita mengelola tim?"*\r\n\r\n**Ketakutan ketiga — Kita tidak tahu apa yang tidak kita tahu.** *"Seberapa banyak yang dia pegang sendirian di kepalanya? Informasi apa yang akan hilang bersamanya?"*\r\n\r\nKetiga ketakutan ini valid. Tapi jika kamu bereaksi berdasarkan ketakutan, kamu akan menghabiskan energi di tempat yang salah — mencoba membujuk orang kembali, mencari kambing hitam, atau membekukan seluruh operasional sambil menunggu jawaban.\r\n\r\n> **Kerangka berpikir yang baik mengubah krisis menjadi proyek dengan timeline yang jelas.**\r\n\r\n---\r\n\r\n## 3. Dua Puluh Empat Jam Pertama: Empat Tindakan yang Tidak Boleh Ditunda\r\n\r\nBegitu informasi resign mendadak diterima, ada empat tindakan yang harus selesai dalam 24 jam pertama — dalam urutan berikut:\r\n\r\n---\r\n\r\n### Tindakan 1 — Amankan Akses dan Aset (Jam 0–2)\r\n\r\nIni adalah langkah yang paling sering ditunda karena terasa tidak "manusiawi" — seolah-olah kamu tidak mempercayai orang yang sedang kamu ajak bicara.\r\n\r\nTapi ini bukan soal kepercayaan. Ini soal **prosedur standar yang melindungi semua pihak** — termasuk si karyawan yang resign.\r\n\r\nYang perlu dilakukan:\r\n\r\n- Koordinasi dengan IT untuk menonaktifkan atau membekukan akses sistem (email, cloud storage, aplikasi internal, server)\r\n- Daftar semua aset fisik yang perlu dikembalikan: laptop, kartu akses, kunci, ID card, dokumen fisik\r\n- Identifikasi akun atau kredensial yang dipegang si karyawan yang perlu segera dipindahtangankan (misalnya akun vendor, akun media sosial perusahaan, password sistem kritis)\r\n\r\n> **Penting:** Ini dilakukan secara paralel dengan, bukan sebagai pengganti dari, komunikasi yang terhormat dengan si karyawan. Kamu bisa mengatakan dengan jujur: *"Ini adalah prosedur standar offboarding yang kita lakukan untuk semua karyawan yang resign — bukan karena kami tidak mempercayaimu."*\r\n\r\n---\r\n\r\n### Tindakan 2 — Audit Tugas yang Sedang Berjalan (Jam 2–6)\r\n\r\nDuduk bersama Lead atau atasan langsung si karyawan dan buat pemetaan lengkap:\r\n\r\n- Proyek atau tugas apa yang sedang berjalan dan belum selesai?\r\n- Dari semua yang berjalan, mana yang paling kritis (ada deadline, ada klien yang terdampak, ada dependensi ke tim lain)?\r\n- Informasi atau pengetahuan apa yang hanya ada di kepalanya dan belum pernah didokumentasikan?\r\n- Akses atau credential apa yang hanya dia yang tahu?\r\n\r\nHasil dari audit ini akan menentukan dua hal: seberapa mendesak kamu perlu melakukan knowledge transfer, dan di mana kamu harus memusatkan tenaga untuk sisa waktu yang tersedia.\r\n\r\n---\r\n\r\n### Tindakan 3 — Komunikasi Internal yang Terkendali (Jam 6–12)\r\n\r\nKekosongan informasi adalah musuh terbesar dalam situasi krisis. Ketika orang tidak tahu apa yang terjadi, mereka mengisi kekosongan itu dengan spekulasi — dan spekulasi hampir selalu lebih buruk dari kenyataan.\r\n\r\nKomunikasi internal yang efektif dalam situasi ini memiliki tiga karakteristik:\r\n\r\n**Jujur tapi tidak dramatis.** Sampaikan fakta yang perlu diketahui oleh masing-masing pihak, tanpa sensasi, tanpa menghakimi karyawan yang resign.\r\n\r\n**Berbeda untuk audiens yang berbeda.** Tim yang terdampak langsung perlu detail operasional. Manajemen perlu ringkasan dampak dan rencana mitigasi. Karyawan lain yang tidak terdampak hanya perlu tahu bahwa situasi sedang ditangani.\r\n\r\n**Memberikan kepastian, bukan janji.** *"Kita sedang dalam proses transisi. Saya akan update semua pihak yang terdampak dalam [waktu spesifik]."*\r\n\r\n---\r\n\r\n### Tindakan 4 — Distribusi Beban Kerja Sementara (Jam 12–24)\r\n\r\n- Apakah ada orang di tim yang bisa mengambil alih sebagian tugas tanpa terlalu membebani mereka?\r\n- Apakah ada kontraktor atau freelancer yang bisa masuk dengan cepat untuk tugas-tugas spesifik?\r\n- Apakah ada tugas yang bisa ditunda tanpa dampak besar?\r\n- Apakah perlu ada komunikasi ke klien atau stakeholder eksternal tentang potensi perubahan timeline?\r\n\r\nYang paling penting: distribusi beban kerja sementara harus *sementara*. Jangan biarkan kondisi darurat menjadi kondisi permanen yang tanpa sadar membebani tim yang tersisa selama berminggu-minggu.\r\n\r\n---\r\n\r\n## 4. Framework OODA Loop: Keputusan Cepat di Tengah Ketidakpastian\r\n\r\nEmpat tindakan di atas memberimu urutan yang jelas. Tapi bagaimana cara *berpikir* saat situasinya masih kabur dan informasinya belum lengkap?\r\n\r\nDi sinilah **OODA Loop** sangat berguna.\r\n\r\nOODA Loop dikembangkan oleh **John Boyd**, seorang kolonel dan ahli strategi militer AS yang terkenal dengan karyanya tentang pengambilan keputusan dalam kondisi bertekanan tinggi. Awalnya dirancang untuk pilot tempur, prinsipnya terbukti berlaku universal — dari militer, bisnis, hingga crisis management di HR.\r\n\r\nOODA adalah singkatan dari empat tahap yang berulang secara cepat:\r\n\r\n---\r\n\r\n### O — Observe (Amati)\r\n\r\n**Kumpulkan informasi yang tersedia saat ini — bahkan jika belum lengkap.**\r\n\r\nDalam konteks resign mendadak Reza, ini berarti: apa yang kamu ketahui sekarang? Reza resign efektif hari ini. Ia memegang akses server produksi. Ada demo Rabu lusa. Belum ada dokumentasi sistem.\r\n\r\nJangan tunggu informasi sempurna sebelum bergerak — itu tidak akan pernah datang. Identifikasi apa yang kamu ketahui, apa yang tidak kamu ketahui, dan apa yang paling mendesak untuk diketahui.\r\n\r\n---\r\n\r\n### O — Orient (Orientasi)\r\n\r\n**Proses informasi yang ada melalui lensa konteks — apa artinya ini bagi Vascomm?**\r\n\r\nIni adalah tahap paling kritis sekaligus paling sering dilewati. Boyd menekankan bahwa orientasi bukan hanya memproses fakta — tapi juga mempertimbangkan: pengalaman sebelumnya, pola yang dikenali, bias yang mungkin memengaruhi penilaian, dan nilai-nilai yang membimbing keputusan.\r\n\r\nDalam situasi ini: apa yang paling penting bagi Vascomm sekarang? Hubungan klien? Keamanan data? Kelangsungan operasional? Morale tim? Jawaban atas pertanyaan ini menentukan ke mana energimu diarahkan.\r\n\r\n---\r\n\r\n### D — Decide (Putuskan)\r\n\r\n**Ambil keputusan terbaik yang bisa kamu buat dengan informasi yang ada sekarang — bukan dengan informasi ideal yang belum tersedia.**\r\n\r\nIni bukan tentang keputusan yang sempurna. Ini tentang keputusan yang *cukup baik dan cukup cepat*. Boyd menekankan bahwa dalam kondisi krisis, keputusan yang terlambat sering lebih buruk dari keputusan yang tidak sempurna tapi tepat waktu.\r\n\r\nKeputusan konkret yang perlu dibuat dalam 15 menit pertama: bekukan akses Reza sekarang, atau tunda sampai ada konfirmasi? Hubungi Direktur sekarang, atau buat ringkasan dulu?\r\n\r\n---\r\n\r\n### A — Act (Bertindak)\r\n\r\n**Eksekusi keputusan dengan cepat dan pantau hasilnya.**\r\n\r\nYang membuat OODA Loop berbeda dari model keputusan lain adalah bagian "Loop"-nya. Setelah bertindak, kamu segera kembali ke tahap Observe — mengumpulkan informasi baru berdasarkan apa yang terjadi setelah tindakanmu. Lalu orientasi ulang. Putuskan lagi. Bertindak lagi.\r\n\r\nDalam resign mendadak, loop ini bisa berjalan beberapa kali dalam satu hari: bertindak untuk membekukan akses → observe bahwa Lead Engineering butuh akses spesifik untuk backup → orient: akses penuh terlalu berisiko, akses terbatas cukup → decide: beri akses read-only untuk backup → act.\r\n\r\n---\r\n\r\n> **Inti dari OODA Loop dalam konteks krisis HC adalah ini: jangan tunggu gambaran sempurna sebelum bergerak. Gerak, pelajari, sesuaikan — lebih cepat dari situasinya berkembang.**\r\n\r\n---\r\n\r\n## 5. Framework BCP: Memastikan Tidak Ada yang Terlewat\r\n\r\nOODA Loop membantumu bergerak cepat. Tapi setelah badai 24 jam pertama mereda, kamu perlu memastikan tidak ada sudut yang terlewat.\r\n\r\nDi sinilah **Business Continuity Planning (BCP)** framework yang distandardisasi oleh **ISO 22301** dan diadaptasi untuk konteks HR oleh **SHRM (Society for Human Resource Management)** menjadi panduan yang sistematis.\r\n\r\nBCP dalam konteks resign mendadak memiliki empat domain yang harus diperiksa:\r\n\r\n---\r\n\r\n### Domain 1 — People Continuity (Kelangsungan SDM)\r\n\r\n**Pertanyaan inti:** *Siapa yang mengerjakan apa, mulai besok pagi?*\r\n\r\nIni adalah domain yang paling terlihat dan paling mendesak. Tapi SHRM mengingatkan bahwa "people continuity" bukan hanya tentang mengisi kekosongan secara teknis — tapi juga tentang memastikan orang-orang yang mengambil alih beban tambahan tidak kelelahan dan tidak kemudian resign juga.\r\n\r\nYang perlu diperiksa:\r\n- Siapa yang bisa mengambil alih tugas-tugas kritis?\r\n- Apakah beban tambahan ini reasonable untuk periode transisi?\r\n- Apakah ada kompensasi, pengakuan, atau dukungan yang diberikan kepada mereka yang mengambil beban lebih?\r\n\r\n---\r\n\r\n### Domain 2 — Knowledge Continuity (Kelangsungan Pengetahuan)\r\n\r\n**Pertanyaan inti:** *Pengetahuan apa yang ada di kepala si karyawan yang akan hilang bersamanya?*\r\n\r\nIni adalah domain yang paling sering diabaikan saat kepanikan terjadi — karena tidak terlihat secara fisik. Berbeda dari laptop yang bisa dilihat dan dikembalikan, pengetahuan yang tidak terdokumentasi tidak ada yang menyadari hilangnya sampai ada masalah yang membutuhkan pengetahuan itu.\r\n\r\nISO 22301 menekankan pentingnya "knowledge mapping" sebagai bagian dari business continuity. Dalam konteks HR, ini berarti: sebelum (atau segera setelah) karyawan pergi, identifikasi dan dokumentasikan:\r\n- Proses yang hanya mereka yang tahu cara menjalankannya\r\n- Relasi dengan vendor atau klien yang bersifat personal\r\n- Konteks historis tentang keputusan yang pernah diambil\r\n- Akses atau credential yang perlu dipindahtangankan\r\n\r\n---\r\n\r\n### Domain 3 — Operational Continuity (Kelangsungan Operasional)\r\n\r\n**Pertanyaan inti:** *Bagaimana alur kerja harian bisa tetap berjalan — tidak harus sempurna, tapi cukup fungsional — selama periode transisi?*\r\n\r\nSHRM merekomendasikan pendekatan triage dalam domain ini: bagi seluruh pekerjaan yang terdampak ke dalam tiga kategori:\r\n\r\n- **Must continue** — pekerjaan yang jika tidak dilakukan akan menciptakan masalah serius dalam 48 jam (misalnya: payroll yang sedang diproses, klien yang sedang menunggu deliverable)\r\n- **Should continue** — pekerjaan yang penting tapi bisa ditunda 1–2 minggu tanpa konsekuensi besar\r\n- **Can pause** — pekerjaan yang bisa dihentikan sementara tanpa dampak signifikan\r\n\r\nDengan kategorisasi ini, kamu bisa memusatkan sumber daya yang terbatas pada hal yang paling kritis — alih-alih mencoba melakukan segalanya sekaligus dengan hasil yang tidak memuaskan di semua front.\r\n\r\n---\r\n\r\n### Domain 4 — Stakeholder Continuity (Kelangsungan Hubungan Pemangku Kepentingan)\r\n\r\n**Pertanyaan inti:** *Siapa di luar tim yang akan terdampak, dan bagaimana mereka dikelola?*\r\n\r\nISO 22301 secara eksplisit memasukkan stakeholder management sebagai bagian dari business continuity. Dalam konteks resign mendadak, ini berarti:\r\n\r\n- Klien yang sedang ditangani oleh karyawan yang resign — perlu dihubungi sebelum mereka bertanya-tanya mengapa ada perubahan tim mendadak\r\n- Vendor yang memiliki hubungan personal dengan si karyawan — perlu diperkenalkan dengan kontak baru\r\n- Tim internal dari divisi lain yang memiliki dependensi pada pekerjaan si karyawan — perlu diinformasikan tentang timeline dan siapa yang bisa dihubungi\r\n\r\nKekosongan komunikasi dengan stakeholder eksternal sering menciptakan kerusakan reputasi yang jauh lebih mahal dari biaya transisi itu sendiri.\r\n\r\n---\r\n\r\n## 6. Menggabungkan OODA dan BCP: Dari Panik ke Terstruktur\r\n\r\nDua framework ini tidak bertentangan — mereka bekerja di lapisan yang berbeda:\r\n\r\n**OODA Loop** adalah cara berpikirmu di menit-menit pertama — cepat, adaptif, berbasis informasi yang tersedia sekarang.\r\n\r\n**BCP Framework** adalah checklist komprehensifmu setelah situasi sedikit lebih terkendali — memastikan tidak ada domain yang terlewat dalam proses pemulihan.\r\n\r\n---\r\n\r\nMari kita kembali ke situasi Reza dan lihat bagaimana keduanya bekerja bersama:\r\n\r\n**Menit 0–15 (OODA — Observe):** Kamu menerima kabar. Informasi yang tersedia: Reza resign efektif hari ini, memegang akses server produksi, demo Rabu lusa. Yang belum diketahui: mengapa ia resign, apakah ia bersedia melakukan transisi, apakah ada yang sudah dipersiapkan.\r\n\r\n**Menit 15–30 (OODA — Orient):** Apa yang paling penting bagi Vascomm saat ini? Demo Rabu dengan klien enterprise adalah prioritas tertinggi. Keamanan data adalah risiko yang harus segera ditutup. Morale tim adalah risiko jangka menengah.\r\n\r\n**Menit 30–45 (OODA — Decide + Act):** Tiga keputusan pertama — bekukan akses, hubungi Lead Engineering untuk mapping, buat ringkasan untuk Direktur. Eksekusi segera.\r\n\r\n**Jam 2–6 (BCP — Knowledge Continuity):** Duduk bersama Lead Engineering. Peta semua pengetahuan kritis yang ada di kepala Reza. Siapa yang bisa mendokumentasikan ini sebelum Reza benar-benar pergi?\r\n\r\n**Jam 6–12 (BCP — Operational Continuity + Stakeholder):** Triage pekerjaan Reza. Hubungi tim Sales untuk mengelola ekspektasi klien terkait demo. Komunikasi internal ke tim Engineering tentang situasi dan rencana.\r\n\r\n**Hari 2–7 (BCP — People Continuity):** Tentukan solusi jangka menengah. Apakah redistribusi internal? Kontraktor sementara? Rekrutmen eksternal? Pastikan siapapun yang mengambil beban tambahan mendapat dukungan yang sesuai.\r\n\r\n---\r\n\r\n## 7. Simulasi Singkat: Tiga Skenario, Satu Kerangka\r\n\r\n---\r\n\r\n### Skenario A — Developer Senior (Sistem Kritis)\r\n\r\nSudah dibahas di atas melalui kasus Reza. **Titik kritis:** keamanan data dan knowledge continuity tentang sistem yang tidak terdokumentasi.\r\n\r\n---\r\n\r\n### Skenario B — Admin Operasional (Pengetahuan Relasional)\r\n\r\nSeorang Admin Operasional yang mengurus vendor, purchase order, dan logistik kantor mengajukan resign mendadak. Ia memegang hubungan dengan lebih dari 20 vendor aktif.\r\n\r\n**Domain BCP yang paling kritis:** Knowledge Continuity — tapi bukan pengetahuan teknis, melainkan *pengetahuan relasional*: siapa kontak person di tiap vendor, bagaimana negosiasi yang biasa dilakukan, vendor mana yang perlu pendekatan khusus.\r\n\r\n**Tindakan kunci:** Dalam 24 jam pertama, duduk bersamanya (jika ia bersedia) dan rekam semua informasi vendor dalam format yang bisa digunakan siapapun. Dua hingga tiga jam yang terstruktur dengan baik bisa menyelamatkan berminggu-minggu masalah operasional.\r\n\r\n---\r\n\r\n### Skenario C — Karyawan yang Resign Tanpa Memberikan Alasan\r\n\r\nIni adalah skenario yang paling psikologis sulit — ketidakjelasan alasan sering menciptakan spekulasi yang meracuni suasana tim.\r\n\r\n**Pendekatan OODA:** Di tahap Orient, akui ketidakpastian ini secara eksplisit. Jangan biarkan ketidakjelasan alasan mengalihkan fokusmu dari tindakan yang tetap harus dilakukan: amankan akses, audit tugas, komunikasi terkendali.\r\n\r\n**Setelah situasi stabil:** Lakukan exit interview yang tulus — bukan untuk membujuk, tapi untuk belajar. Jika ada pola (ini adalah resign kedua dari tim yang sama dalam tiga bulan), itu sinyal sistemis yang perlu ditangani sebagai isu organisasi, bukan insiden individual.\r\n\r\n---\r\n\r\n## 8. Tiga Opsi Penggantian: Kapan Memilih Mana\r\n\r\nSetelah 48 jam pertama terlewati, pertanyaan selanjutnya adalah bagaimana posisi ini diisi.\r\n\r\n**Promosi atau Redistribusi Internal** — tepat ketika ada orang yang siap dan beban tambahannya reasonable. Tapi jangan redistribusi tanpa kompensasi atau pengakuan yang sesuai — ini cara tercepat mendorong resign berikutnya.\r\n\r\n**Rekrutmen Eksternal** — tepat ketika keahlian yang dibutuhkan tidak ada di tim. Ingat: rata-rata 4–8 minggu untuk posisi non-spesialis. Rekrutmen bukan solusi instan.\r\n\r\n**Kontraktor atau Freelancer Sementara** — tepat untuk keahlian spesifik jangka pendek. Hitung waktu onboarding dalam kalkulasimu — mereka tidak langsung produktif di hari pertama.\r\n\r\n---\r\n\r\n## 9. Yang Paling Penting: Bangun Sistem Sebelum Krisis Datang\r\n\r\nSHRM dalam panduannya tentang *Workforce Continuity* menekankan satu hal yang sering diabaikan: **business continuity planning untuk SDM harus dilakukan jauh sebelum ada karyawan yang resign.**\r\n\r\nTiga langkah pencegahan yang bisa kamu mulai sekarang:\r\n\r\n**Pertama, buat Role Criticality Assessment.** Untuk setiap posisi, jawab: jika orang ini resign hari ini, seberapa besar dampaknya dalam 7 hari ke depan? Posisi dengan dampak tinggi adalah posisi yang butuh perhatian khusus dalam hal dokumentasi dan knowledge sharing.\r\n\r\n**Kedua, eliminasi single point of failure.** Jika ada proses penting yang hanya satu orang yang tahu cara menjalankannya, itu adalah risiko yang sudah ada hari ini — resign hanya membuatnya terlihat. Cross-training dan dokumentasi rutin adalah investasi murah yang nilainya luar biasa saat krisis terjadi.\r\n\r\n**Ketiga, normalisasi knowledge documentation sebagai budaya.** Bukan sebagai beban tambahan, tapi sebagai standar profesionalisme: *"Cara kerja kita harus bisa dijalankan oleh siapapun, bukan hanya oleh kita."*\r\n\r\n---\r\n\r\n> **Resign mendadak yang ditangani dengan buruk adalah krisis. Resign mendadak yang ditangani dengan baik — menggunakan kerangka berpikir yang tepat — adalah bukti bahwa sistemmu kuat, bahkan ketika orang-orangnya berubah.**\r\n\r\n---\r\n\r\n## ✅ Ringkasan\r\n\r\n| Konsep | Yang Perlu Diingat |\r\n|---|---|\r\n| **24 Jam Pertama** | Amankan akses → audit tugas → komunikasi terkendali → distribusi beban |\r\n| **OODA Loop (Boyd)** | Observe → Orient → Decide → Act → ulangi. Bergerak lebih cepat dari situasinya berkembang |\r\n| **Observe** | Kumpulkan informasi yang ada sekarang — jangan tunggu sempurna |\r\n| **Orient** | Proses melalui lensa konteks: apa yang paling penting bagi Vascomm saat ini? |\r\n| **Decide + Act** | Keputusan tepat waktu yang tidak sempurna lebih baik dari keputusan sempurna yang terlambat |\r\n| **BCP — People** | Siapa yang mengisi kekosongan — dan apakah bebannya reasonable? |\r\n| **BCP — Knowledge** | Pengetahuan di kepala yang tidak terdokumentasi adalah risiko yang tidak terlihat |\r\n| **BCP — Operational** | Triage pekerjaan: must continue, should continue, can pause |\r\n| **BCP — Stakeholder** | Klien dan vendor yang tidak diinformasikan bisa menjadi kerusakan reputasi yang mahal |\r\n| **Pencegahan (SHRM)** | Role Criticality Assessment + eliminasi single point of failure + budaya dokumentasi |\r\n\r\n---\r\n\r\n## 🔗 Koneksi ke Pelajaran Berikutnya\r\n\r\nPelajaran 5 — **Penyelarasan Wewenang & Batas Eksekusi** — akan membawa kamu ke level berikutnya: bukan hanya bagaimana merespons krisis, tapi bagaimana memastikan wewenang setiap orang sudah terdefinisi dengan cukup jelas sehingga krisis seperti resign mendadak tidak menciptakan kebingungan tambahan tentang "siapa yang berwenang memutuskan apa." OODA Loop dan BCP yang sudah kamu pelajari di sini akan menjadi konteks yang relevan di pelajaran itu.\r\n\r\n---\r\n\r\n## 📝 Cek Pemahaman\r\n\r\nSebelum melanjutkan, jawab pertanyaan berikut:\r\n\r\n1. Kembali ke situasi Reza di pertanyaan pembuka. Jalankan OODA Loop-mu secara eksplisit: apa yang kamu *Observe* di menit pertama? Bagaimana kamu *Orient* — apa yang paling penting bagi Vascomm saat ini? Keputusan apa yang kamu *Decide* dan *Act* dalam 15 menit pertama sebelum meeting dengan Direktur?\r\n\r\n2. Dari empat domain BCP (People, Knowledge, Operational, Stakeholder Continuity), domain mana yang menurut kamu paling sering diabaikan di lingkungan startup seperti Vascomm? Mengapa, dan apa konsekuensinya?\r\n\r\n3. Dari tiga opsi penggantian (promosi internal, rekrutmen eksternal, kontraktor), pilih satu untuk skenario Reza. Jelaskan alasanmu — termasuk apa risikonya dan apa yang perlu dilakukan untuk memitigasi risiko itu.\r\n\r\n4. Jika kamu harus melakukan *Role Criticality Assessment* di Vascomm minggu ini, posisi mana yang akan masuk kategori risiko tertinggi jika orangnya resign mendadak? Apa langkah konkret yang akan kamu rekomendasikan untuk posisi itu?\r\n\r\n---\r\n\r\n*Pelajaran 4 dari 6  ·  Modul: Tata Kelola Operasional HC & Pengambilan Keputusan Strategis*\r\n*Program TDP HCM Successorship — PT Vascomm Solusi Teknologi*	\N	\N	45	3	2026-06-10 12:59:51.927	2026-06-12 01:12:09.591
cmq82szei000104kwdlra5udt	cmq08teex000504l48tgf5ixm	Peta Operasional & Kerangka Keputusan HC Strategis	VIDEO	\N	https://www.youtube.com/watch?v=UfY4qt6jLio	\N	7	1	2026-06-10 12:59:51.738	2026-06-12 01:18:05.193
cmqa8qih2000004jsddy7ukqz	cmq08teey000604l4pxptoagn	Refleksi Transformasi: Perjalanan Menuju Strategic HC	TEXT	# Refleksi Transformasi: Perjalanan Menuju Strategic HC\r\n\r\n**Modul:** Membangun Ownership & Kematangan Kepemimpinan HC\r\n**Pelajaran:** 1 dari 6 — Pembuka Modul\r\n**Durasi estimasi:** 45 menit\r\n**Tipe:** Materi Teks\r\n\r\n---\r\n\r\n## 🎯 Tujuan Pembelajaran\r\n\r\nSetelah menyelesaikan pelajaran ini, kamu akan mampu:\r\n\r\n1. Menjelaskan perbedaan mendasar antara peran HC sebagai *administrator* dan sebagai *strategic partner* — bukan hanya secara definisi, tapi dalam cara berpikir, berbicara, dan bertindak sehari-hari\r\n2. Mengidentifikasi di mana posisimu saat ini dalam perjalanan transformasi dari executor menuju strategic HC\r\n3. Memahami kerangka **Dave Ulrich HR Business Partner Model** dan menggunakannya sebagai peta untuk melihat peranmu secara lebih utuh\r\n4. Merefleksikan satu momen konkret dalam pekerjaanmu yang mencerminkan perpindahan dari pola lama ke pola baru\r\n\r\n---\r\n\r\n## 📌 Pertanyaan Pembuka\r\n\r\n> Coba ingat satu momen dalam enam bulan terakhir di mana kamu *menunggu diberitahu apa yang harus dilakukan* — alih-alih mengidentifikasi masalah sendiri dan mengambil tindakan.\r\n>\r\n> Sekarang coba ingat satu momen di mana kamu melakukan sebaliknya: kamu melihat sesuatu yang perlu diperbaiki, dan kamu bergerak sebelum ada yang memintamu.\r\n>\r\n> **Mana yang lebih sering terjadi?**\r\n\r\nJawaban jujur atas pertanyaan itu adalah titik awal dari pelajaran ini — dan dari seluruh modul penutup program TDP ini.\r\n\r\n---\r\n\r\n## 1. Sebuah Cerita: Dua HC, Satu Perusahaan, Dua Realitas\r\n\r\nDua tahun lalu, sebuah startup teknologi bernama Praxis mengangkat dua orang HC Officer secara bersamaan. Sebut saja mereka Dina dan Fajar. Keduanya punya latar belakang yang hampir identik: pengalaman dua tahun di HR generalis, lulus dari universitas yang setara, dan melewati proses seleksi yang sama.\r\n\r\nDua tahun kemudian, nasib keduanya sangat berbeda.\r\n\r\n---\r\n\r\n**Dina** dikenal sebagai orang yang sangat andal. Setiap permintaan rekrutmen diproses tepat waktu. Setiap dokumen selalu rapi. Setiap pertanyaan karyawan tentang kebijakan selalu dijawab dengan cepat dan akurat. Manajer menyukainya karena tidak pernah ada masalah administratif yang lolos dari tangannya.\r\n\r\nTapi ketika ada diskusi tentang strategi pertumbuhan tim di kuartal berikutnya, Dina tidak hadir — bukan karena tidak diundang, tapi karena ia merasa itu bukan wilayahnya. *"Itu urusan manajemen. Tugasku menyiapkan orang-orangnya kalau sudah diputuskan."*\r\n\r\n---\r\n\r\n**Fajar** juga mengerjakan semua hal administratif yang sama. Tapi ia melakukan satu hal lebih: ia secara aktif mencari tahu *mengapa* permintaan rekrutmen itu muncul.\r\n\r\nKetika divisi Engineering meminta dua Senior Developer baru, Fajar tidak langsung membuka job posting. Ia bertanya dulu ke Lead Engineering: *"Apa yang sebenarnya sedang kamu coba capai dalam enam bulan ke depan?"* Dari percakapan itu, ia menemukan bahwa masalah sebenarnya bukan kekurangan orang — tapi ada dua developer yang sudah ada yang tidak punya skill untuk teknologi baru yang akan digunakan. Merekrut dua orang baru tapi tidak upskilling yang lama hanya akan menciptakan bottleneck baru.\r\n\r\nFajar membawa insight itu ke manajemen bersama opsi: rekrut satu orang dan training dua developer yang sudah ada, atau rekrut dua tapi siapkan program transisi teknologi yang terstruktur. Manajemen memilih opsi pertama. Biaya lebih rendah 40%. Hasilnya lebih baik.\r\n\r\n---\r\n\r\nEnam bulan kemudian, Fajar diundang ke rapat perencanaan strategi tahunan. Dina tidak.\r\n\r\nBukan karena Dina tidak kompeten. Tapi karena **Dina belum membuat lompatan yang membedakan HC administrator dari HC strategic partner** — bukan lompatan skill teknis, tapi lompatan cara berpikir.\r\n\r\n---\r\n\r\n## 2. Apa yang Sebenarnya Berubah: Evolusi Peran HC\r\n\r\nTransformasi peran HC dari administratif ke strategis bukan fenomena baru. Dave Ulrich, profesor dari University of Michigan yang sering disebut sebagai "bapak modern HR," sudah menggambarkannya sejak tahun 1997 dalam bukunya *Human Resource Champions*. Dan dalam empat dekade sejak itu, ia terus menyempurnakan modelnya.\r\n\r\n### Dave Ulrich HR Business Partner Model\r\n\r\nUlrich mendeskripsikan empat peran yang harus bisa dimainkan oleh HR yang efektif — bukan sebagai tahapan yang meninggalkan yang sebelumnya, tapi sebagai dimensi yang berjalan bersamaan:\r\n\r\n---\r\n\r\n**① Strategic Partner — Mitra Strategi Bisnis**\r\n\r\nPeran ini berfokus pada menerjemahkan strategi bisnis ke dalam agenda HC. Bukan menunggu manajemen memutuskan apa yang dibutuhkan, lalu menyiapkannya — tapi duduk di meja yang sama dan berkontribusi pada keputusan tentang ke mana bisnis akan pergi.\r\n\r\n*Pertanyaan yang selalu ada di benak Strategic Partner:* "Apa yang sedang bisnis coba capai, dan bagaimana HC bisa mempercepat atau memungkinkan itu?"\r\n\r\n---\r\n\r\n**② Change Agent — Agen Perubahan**\r\n\r\nHC yang efektif tidak hanya mengelola orang hari ini — ia juga membantu organisasi bertransisi dari kondisi saat ini ke kondisi yang dibutuhkan di masa depan. Ini mencakup: memfasilitasi perubahan budaya, membangun kapabilitas baru, dan memastikan orang-orang siap untuk apa yang akan datang.\r\n\r\n*Pertanyaan yang selalu ada di benak Change Agent:* "Apa yang perlu berubah di dalam organisasi — dan bagaimana aku bisa membantu perubahan itu terjadi dengan cara yang berkelanjutan?"\r\n\r\n---\r\n\r\n**③ Administrative Expert — Ahli Administratif**\r\n\r\nIni adalah peran yang paling tradisional — dan masih sangat penting. Proses yang efisien, data yang akurat, kebijakan yang diterapkan dengan konsisten. Tanpa fondasi ini, HC tidak bisa dipercaya untuk peran yang lebih strategis.\r\n\r\n*Pertanyaan yang ada di benak Administrative Expert:* "Bagaimana proses HC bisa dijalankan dengan lebih efisien, akurat, dan konsisten?"\r\n\r\n---\r\n\r\n**④ Employee Champion — Pembela Karyawan**\r\n\r\nHC juga bertindak sebagai suara karyawan di hadapan manajemen — memastikan kepentingan dan kebutuhan orang-orang di organisasi dipertimbangkan dalam setiap keputusan. Ini bukan tentang membela setiap keluhan, tapi tentang memastikan organisasi memperlakukan manusianya dengan cara yang memungkinkan mereka memberikan yang terbaik.\r\n\r\n*Pertanyaan yang ada di benak Employee Champion:* "Apa yang dibutuhkan karyawan untuk bisa bekerja dengan baik — dan apakah organisasi menyediakan itu?"\r\n\r\n---\r\n\r\n### Di Mana Kebanyakan HC Terjebak\r\n\r\nUlrich dan rekan-rekannya dalam penelitian lanjutan menemukan satu pola yang sangat konsisten: kebanyakan praktisi HC menghabiskan 70–80% waktunya di kuadran Administrative Expert, dan hampir tidak ada waktu untuk tiga peran lainnya.\r\n\r\nIni bukan karena mereka tidak ingin berkontribusi secara strategis. Ini karena:\r\n\r\n- Pekerjaan administratif selalu mendesak dan terlihat jelas jika tidak dikerjakan\r\n- Pekerjaan strategis jarang mendesak dan sering tidak ada yang meminta secara eksplisit\r\n- Transisi ke peran strategis membutuhkan keberanian untuk berbicara di ruangan yang terasa "bukan milikku"\r\n\r\n---\r\n\r\n## 3. Perbedaan yang Sesungguhnya: Bukan Judul, Tapi Cara Berpikir\r\n\r\nKesalahpahaman terbesar tentang "Strategic HC" adalah menganggapnya sebagai jabatan atau level. Banyak orang yang secara formal disebut "HC Business Partner" tapi masih berpikir dan bertindak seperti administrator. Dan sebaliknya, ada staf junior yang sudah berpikir dan bertindak seperti mitra strategis — hanya belum punya panggung untuk menunjukkannya.\r\n\r\nPerbedaan yang sesungguhnya ada di tiga hal:\r\n\r\n---\r\n\r\n### Cara Bertanya\r\n\r\n| HC Administrator | HC Strategic Partner |\r\n|---|---|\r\n| "Berapa orang yang perlu direkrut?" | "Apa masalah bisnis yang sedang coba diselesaikan dengan rekrutmen ini?" |\r\n| "Kapan deadline-nya?" | "Apa yang terjadi jika ini tidak selesai tepat waktu?" |\r\n| "Apa kebijakan yang berlaku?" | "Apakah kebijakan ini masih relevan dengan kondisi bisnis saat ini?" |\r\n| "Siapa yang bertanggung jawab?" | "Apa yang bisa aku lakukan untuk memastikan ini berhasil?" |\r\n\r\n---\r\n\r\n### Cara Mengukur Keberhasilan\r\n\r\nAdministrator HC mengukur *aktivitas*: berapa banyak rekrutmen selesai, berapa banyak training dilaksanakan, berapa cepat proses payroll berjalan.\r\n\r\nStrategic HC mengukur *dampak*: apakah rekrutmen ini menghasilkan orang yang benar-benar berkontribusi? Apakah training ini menutup gap skill yang memengaruhi performa bisnis? Apakah HC secara keseluruhan membantu perusahaan tumbuh lebih cepat atau lebih efisien?\r\n\r\n---\r\n\r\n### Cara Berbicara\r\n\r\nAdministrator HC berbicara dalam bahasa HR: turnover rate, headcount, compliance, SOP.\r\n\r\nStrategic HC juga bicara bahasa bisnis: revenue per employee, cost of vacancy, productivity index, time-to-performance untuk karyawan baru.\r\n\r\nIni bukan soal mengesankan manajemen dengan istilah keuangan. Ini soal membuktikan bahwa HC memahami apa yang benar-benar penting bagi bisnis — dan bisa berkontribusi di level itu.\r\n\r\n---\r\n\r\n## 4. Ownership: Bukan Slogan, Tapi Pola Pikir yang Bisa Dilatih\r\n\r\nSalah satu kata yang paling sering digunakan dalam konteks kepemimpinan tapi paling jarang didefinisikan secara konkret adalah **ownership**.\r\n\r\nDalam penelitian tentang high-performing teams, **Amy Edmondson dari Harvard Business School** menemukan bahwa perbedaan antara tim yang biasa dan tim yang luar biasa bukan pada kecerdasan atau pengalaman anggotanya — tapi pada sejauh mana setiap anggota merasa *bertanggung jawab atas keberhasilan tim secara keseluruhan*, bukan hanya atas tugasnya sendiri.\r\n\r\nItulah ownership: **perasaan dan tindakan bertanggung jawab atas hasil — bahkan untuk hal-hal yang secara teknis bukan tugasmu.**\r\n\r\n---\r\n\r\n### Tiga Manifestasi Ownership dalam Pekerjaan HC Sehari-hari\r\n\r\n**① Inisiatif Proaktif**\r\n\r\nKaryawan dengan ownership tidak menunggu ada masalah sebelum bergerak. Mereka melihat tanda-tanda awal dan bertindak sebelum masalah menjadi krisis.\r\n\r\n*Contoh konkret:* Ketika data absensi menunjukkan satu divisi mulai memiliki tingkat keterlambatan yang meningkat tiga minggu berturut-turut, HC dengan ownership tidak menunggu manajer melaporkan masalah morale — ia datang ke manajer dengan data dan bertanya: *"Aku melihat pola ini. Apa yang sedang terjadi, dan bagaimana aku bisa membantu?"*\r\n\r\n**② Akuntabilitas atas Hasil, Bukan Hanya Proses**\r\n\r\nHC dengan ownership tidak berhenti di "saya sudah melakukan apa yang diminta." Mereka peduli pada apakah hasilnya benar-benar terjadi — dan jika tidak, mereka mencari tahu mengapa dan apa yang bisa dilakukan.\r\n\r\n*Contoh konkret:* Setelah program onboarding baru dijalankan, HC dengan ownership tidak hanya mencatat bahwa program sudah berjalan. Ia menghubungi karyawan baru tiga bulan kemudian: *"Apakah onboarding kemarin membantu kamu di bulan pertama? Apa yang kurang dan perlu diperbaiki?"*\r\n\r\n**③ Melampaui Batas Jabatan**\r\n\r\nHC dengan ownership tidak membatasi kepeduliannya hanya pada deskripsi pekerjaannya. Ketika melihat sesuatu yang bisa diperbaiki, ia berbicara — meskipun itu bukan "urusannya."\r\n\r\n*Ini bukan tentang mencampuri urusan orang lain.* Ini tentang memahami bahwa keberhasilan perusahaan adalah tanggung jawab semua orang — dan HC yang strategis punya posisi unik untuk melihat pola lintas divisi yang sering tidak terlihat dari dalam satu divisi.\r\n\r\n---\r\n\r\n## 5. Kematangan Kepemimpinan: Apa Artinya Sebenarnya\r\n\r\n"Kematangan kepemimpinan" sering terdengar seperti konsep yang kabur dan sulit diukur. Tapi **Daniel Goleman**, dalam penelitiannya yang dipublikasikan dalam *Harvard Business Review* (1998) dan kemudian dikembangkan dalam buku *Primal Leadership*, menemukan bahwa pemimpin yang paling efektif memiliki satu kesamaan yang melampaui IQ atau keahlian teknis: **kecerdasan emosional yang tinggi**.\r\n\r\nGoleman mendefinisikan kecerdasan emosional sebagai kombinasi dari lima komponen yang semuanya bisa dipelajari dan dikembangkan:\r\n\r\n---\r\n\r\n### Self-Awareness (Kesadaran Diri)\r\n\r\nKemampuan mengenali emosi, kekuatan, kelemahan, nilai-nilai, dan dampak dirimu terhadap orang lain — secara akurat dan jujur.\r\n\r\nIni bukan tentang selalu merasa percaya diri. Ini tentang tahu persis kapan kamu sedang dalam kondisi terbaik, kapan kamu sedang dalam kondisi yang bisa merusak keputusan, dan kapan kamu perlu meminta perspektif orang lain karena blind spot-mu mungkin sedang aktif.\r\n\r\n*Pertanda self-awareness yang baik:* Kamu bisa menjelaskan mengapa sebuah keputusanmu tidak berhasil — bukan dengan menyalahkan situasi atau orang lain, tapi dengan mengidentifikasi apa yang ada dalam kendalimu yang bisa dilakukan berbeda.\r\n\r\n---\r\n\r\n### Self-Regulation (Regulasi Diri)\r\n\r\nKemampuan mengelola emosi — bukan menekannya, tapi mengarahkannya secara konstruktif.\r\n\r\nPemimpin yang lemah dalam self-regulation bereaksi. Pemimpin yang kuat merespons. Perbedaannya: reaksi adalah otomatis dan sering tidak produktif; respons adalah sadar dan diarahkan pada tujuan.\r\n\r\n*Dalam konteks HC:* Ketika ada karyawan yang mengkritik kebijakan yang kamu buat dengan nada yang tidak menyenangkan, apakah kamu bereaksi defensif — atau merespons dengan mencari tahu apa yang valid dari kritik itu?\r\n\r\n---\r\n\r\n### Motivation (Motivasi Intrinsik)\r\n\r\nDorongan untuk mencapai sesuatu yang lebih dari sekadar reward eksternal — gaji, jabatan, pengakuan. Pemimpin yang matang termotivasi oleh pertumbuhan, kontribusi, dan standar yang mereka tetapkan untuk diri sendiri.\r\n\r\n*Dalam konteks HC:* Apakah kamu melakukan pekerjaanmu dengan baik karena takut dievaluasi buruk — atau karena kamu benar-benar peduli dengan dampaknya pada orang-orang di perusahaan?\r\n\r\n---\r\n\r\n### Empathy (Empati)\r\n\r\nKemampuan memahami perspektif dan perasaan orang lain — terutama saat membuat keputusan yang memengaruhi mereka.\r\n\r\nEmpati bukan berarti selalu menyetujui apa yang orang inginkan. Empati berarti kamu mempertimbangkan dampak keputusanmu pada orang-orang yang terkena dampaknya — dan kamu bisa mengkomunikasikan keputusan yang sulit dengan cara yang tetap menghormati mereka sebagai manusia.\r\n\r\n---\r\n\r\n### Social Skills (Keterampilan Sosial)\r\n\r\nKemampuan membangun relasi, mempengaruhi tanpa paksaan, dan berkolaborasi secara efektif — bahkan dengan orang yang tidak secara langsung melapor kepadamu.\r\n\r\nIni adalah dimensi yang paling terlihat dari kecerdasan emosional — dan sering paling dinilai dalam konteks kepemimpinan HC, karena HC selalu bekerja lintas divisi dan lintas level.\r\n\r\n---\r\n\r\n## 6. Perjalananmu Sejauh Ini: Sebuah Cermin\r\n\r\nKamu berada di awal modul terakhir dari program TDP ini. Sebelum melanjutkan ke pelajaran-pelajaran berikutnya, ada nilai yang sangat besar dalam berhenti sejenak untuk melihat ke belakang.\r\n\r\nBukan untuk mengevaluasi apakah kamu sudah cukup baik. Tapi untuk mendapatkan gambaran yang jelas tentang di mana kamu berada — sehingga langkah-langkah berikutnya bisa lebih terarah.\r\n\r\n---\r\n\r\n### Refleksi: Dari Mana ke Mana\r\n\r\nPikirkan dirimu ketika pertama kali memulai program TDP ini. Sekarang pikirkan dirimu hari ini.\r\n\r\nBeberapa pertanyaan untuk memandu refleksimu:\r\n\r\n**Tentang cara berpikir:**\r\nApakah ada perubahan dalam cara kamu membingkai masalah HC? Apakah kamu lebih sering sekarang mulai dari pertanyaan "apa dampaknya pada bisnis?" sebelum mengerjakan solusi?\r\n\r\n**Tentang keberanian:**\r\nApakah ada situasi dalam beberapa bulan terakhir di mana kamu berbicara atau mengambil tindakan yang sebelumnya tidak akan kamu lakukan? Apa yang memungkinkan itu terjadi?\r\n\r\n**Tentang hubungan dengan manajemen:**\r\nApakah cara manajemen melihat dan melibatkan kamu dalam diskusi sudah berubah? Jika ya, apa yang berbeda? Jika belum, apa yang masih menghalangi?\r\n\r\n**Tentang ownership:**\r\nSeberapa sering kamu sekarang mengidentifikasi masalah dan mengambil tindakan tanpa diminta, dibandingkan enam bulan lalu?\r\n\r\n---\r\n\r\n### Matriks Posisi Saat Ini\r\n\r\nGunakan matriks sederhana ini untuk memetakan dirimu:\r\n\r\n| Dimensi | Masih Berkembang | Sudah Kompeten | Sudah Natural |\r\n|---|---|---|---|\r\n| Berpikir dalam bahasa bisnis | | | |\r\n| Mengidentifikasi masalah sebelum diminta | | | |\r\n| Mengambil keputusan mandiri dengan percaya diri | | | |\r\n| Berkomunikasi ke manajemen secara strategis | | | |\r\n| Membangun kepercayaan lintas divisi | | | |\r\n| Mengambil ownership atas hasil, bukan hanya proses | | | |\r\n| Merespons tekanan dengan tenang dan logis | | | |\r\n\r\nTandai dengan jujur. Tidak ada nilai yang benar atau salah di sini — hanya potret yang akurat yang berguna untuk perjalanan ke depan.\r\n\r\n---\r\n\r\n## 7. Satu Cerita Penutup: Tentang Lompatan yang Tidak Terasa Dramatis\r\n\r\nTiga bulan setelah program TDP berakhir, Fajar — HC Officer dari Praxis yang kita temui di awal pelajaran ini — diminta untuk memimpin inisiatif restrukturisasi tim yang melibatkan lima divisi.\r\n\r\nBukan karena ia tiba-tiba menjadi orang yang berbeda. Bukan karena ia mendapatkan gelar baru atau jabatan baru. Tapi karena selama dua tahun terakhir, setiap kali ada keputusan yang memengaruhi orang-orang di perusahaan, Fajar selalu hadir dengan pertanyaan yang tepat dan data yang relevan.\r\n\r\nKepercayaan itu tidak dibangun dalam satu momen besar. Ia dibangun satu percakapan kecil pada satu waktu — satu pertanyaan yang lebih baik, satu insight yang datang sebelum diminta, satu situasi yang ia tangani dengan ketenangan ketika orang lain panik.\r\n\r\nItulah yang dimaksud dengan transformasi menuju Strategic HC. Bukan perubahan yang dramatis dan bisa ditunjuk momennya. Tapi akumulasi dari cara berpikir dan cara bertindak yang sedikit berbeda, setiap hari — sampai tiba-tiba, orang-orang di sekitarmu melihatmu dengan cara yang berbeda.\r\n\r\n---\r\n\r\n> **Kamu tidak perlu menunggu jabatan "Strategic HC" untuk mulai berpikir dan bertindak seperti strategic HC. Transformasi itu dimulai dari pertanyaan berikutnya yang kamu ajukan.**\r\n\r\n---\r\n\r\n## ✅ Ringkasan\r\n\r\n| Konsep | Yang Perlu Diingat |\r\n|---|---|\r\n| **Model Ulrich** | Empat peran HC: Strategic Partner, Change Agent, Administrative Expert, Employee Champion — semua perlu berjalan bersamaan |\r\n| **Lompatan Utama** | Dari mengerjakan yang diminta → mengidentifikasi apa yang dibutuhkan bisnis |\r\n| **Cara Bertanya** | "Apa masalah bisnis yang sedang diselesaikan?" bukan "Apa yang harus dikerjakan?" |\r\n| **Cara Mengukur** | Dampak pada bisnis, bukan aktivitas HC |\r\n| **Ownership (Edmondson)** | Bertanggung jawab atas hasil — bahkan untuk hal yang bukan tugas formalmu |\r\n| **Kecerdasan Emosional (Goleman)** | Self-awareness, self-regulation, motivasi intrinsik, empati, keterampilan sosial |\r\n| **Transformasi** | Bukan satu momen besar — tapi akumulasi cara berpikir dan bertindak yang berbeda setiap hari |\r\n\r\n---\r\n\r\n## 🔗 Koneksi ke Pelajaran Berikutnya\r\n\r\nPelajaran 2 — **Ownership Mentality: Perbedaan Executor vs Owner** (Video) — akan mengeksplorasi lebih dalam perbedaan antara dua pola pikir ini dengan contoh-contoh konkret dan situasi yang akan langsung kamu kenali dari pekerjaanmu sehari-hari. Refleksi yang kamu lakukan di pelajaran ini — terutama matriks posisi saat ini — akan menjadi titik referensi yang berguna saat menonton video tersebut.\r\n\r\n---\r\n\r\n## 📝 Cek Pemahaman\r\n\r\nSebelum melanjutkan, jawab pertanyaan berikut:\r\n\r\n1. Dari empat peran dalam model Ulrich (Strategic Partner, Change Agent, Administrative Expert, Employee Champion), di peran mana kamu menghabiskan paling banyak waktu saat ini? Di peran mana kamu ingin menghabiskan lebih banyak waktu? Apa yang menghalanginya?\r\n\r\n2. Pikirkan satu keputusan HC yang dibuat di Vascomm dalam tiga bulan terakhir — oleh kamu atau oleh tim. Apakah keputusan itu dibingkai sebagai "ini yang diminta" atau "ini yang dibutuhkan bisnis"? Apa bedanya jika dibingkai ulang dengan cara yang kedua?\r\n\r\n3. Dari lima komponen kecerdasan emosional Goleman, mana yang menurutmu paling kuat dalam dirimu saat ini? Mana yang paling perlu dikembangkan? Berikan satu contoh konkret untuk masing-masing.\r\n\r\n4. Isi matriks "Posisi Saat Ini" di Bagian 6 dengan jujur. Dari tujuh dimensi yang ada, pilih satu yang ingin paling kamu kembangkan dalam modul terakhir ini. Tuliskan apa yang akan terlihat berbeda jika dimensi itu sudah berada di kolom "Sudah Natural."\r\n\r\n---\r\n\r\n*Pelajaran 1 dari 6  ·  Modul: Membangun Ownership & Kematangan Kepemimpinan HC*\r\n*Program TDP HCM Successorship — PT Vascomm Solusi Teknologi*	\N	\N	45	0	2026-06-12 01:21:26.534	2026-06-12 04:21:16.958
cmqanwxc3000304jplu8x7ade	cmqaniinj000004kzvz1rnb53	Kepatuhan Pajak: PPh 21, 23, 4 ayat 2, PPN, dan SPT Tahunan	DOCUMENT	\N	\N	\N	\N	1	2026-06-12 08:26:19.971	2026-06-12 08:26:19.971
cmqanwxeu000404jpov21seac	cmqaniinj000004kzvz1rnb53	Manajemen Arus Kas dan Forecasting	TEXT	\N	\N	\N	\N	2	2026-06-12 08:26:20.07	2026-06-12 08:26:20.07
cmqanwxhl000504jpyuiqef0t	cmqaniinj000004kzvz1rnb53	Budgeting dan Analisis Varians	TEXT	\N	\N	\N	\N	3	2026-06-12 08:26:20.169	2026-06-12 08:26:20.169
cmqanwxn7000704jpnr2lgqmg	cmqaniinj000004kzvz1rnb53	Operasional Perbankan dan Kesiapan Audit	TEXT	\N	\N	\N	\N	5	2026-06-12 08:26:20.371	2026-06-12 08:26:20.371
cmqanzlhe000004ieg126g2kt	cmqanjpwq000104kzdbeajjv1	Prinsip Zero-Error dan Ketelitian Angka	TEXT	\N	\N	\N	\N	0	2026-06-12 08:28:24.578	2026-06-12 08:28:24.578
cmqanzlk6000104ie9bkjehjv	cmqanjpwq000104kzdbeajjv1	Teknik Rekonsiliasi Bank dan Akun Penyeimbang	VIDEO	\N	\N	\N	\N	1	2026-06-12 08:28:24.678	2026-06-12 08:28:24.678
cmqanzlmu000204ieuei3vs7x	cmqanjpwq000104kzdbeajjv1	Prosedur Three-Way Matching: PO, Receiving, Invoice	DOCUMENT	\N	\N	\N	\N	2	2026-06-12 08:28:24.774	2026-06-12 08:28:24.774
cmqanzlpg000304ie2d6wo09x	cmqanjpwq000104kzdbeajjv1	Pengendalian Internal dan Pencegahan Fraud	VIDEO	\N	\N	\N	\N	3	2026-06-12 08:28:24.868	2026-06-12 08:28:24.868
cmqanzls6000404iej6cavgd5	cmqanjpwq000104kzdbeajjv1	Analisis Dampak Biaya Sebelum Pengeluaran	TEXT	\N	\N	\N	\N	4	2026-06-12 08:28:24.966	2026-06-12 08:28:24.966
cmqanzlut000504ie7dx3l9b2	cmqanjpwq000104kzdbeajjv1	Akurasi Input Jurnal Akuntansi	TEXT	\N	\N	\N	\N	5	2026-06-12 08:28:25.061	2026-06-12 08:28:25.061
cmqao0fw8000604ie6x4qt3hv	cmqanl6od000204kzhs03sjnq	Prosedur Klaim, Reimbursement, dan Pengadaan	TEXT	\N	\N	\N	\N	0	2026-06-12 08:29:03.992	2026-06-12 08:29:03.992
cmqao0fz2000704iebbbjfp30	cmqanl6od000204kzhs03sjnq	Kepatuhan Standar Akuntansi PSAK Terbaru	TEXT	\N	\N	\N	\N	1	2026-06-12 08:29:04.094	2026-06-12 08:29:04.094
cmqao0g1t000804iehvfxovp9	cmqanl6od000204kzhs03sjnq	Manajemen Dokumentasi dan Pengarsipan Keuangan	DOCUMENT	\N	\N	\N	\N	2	2026-06-12 08:29:04.193	2026-06-12 08:29:04.193
cmqao0g4m000904ieiqhuocwn	cmqanl6od000204kzhs03sjnq	Pengelolaan dan Penyusutan Aset Tetap	TEXT	\N	\N	\N	\N	3	2026-06-12 08:29:04.294	2026-06-12 08:29:04.294
cmqao0g77000a04ievt851g6x	cmqanl6od000204kzhs03sjnq	Kebijakan Batas Otorisasi dan Matriks Persetujuan	TEXT	\N	\N	\N	\N	4	2026-06-12 08:29:04.387	2026-06-12 08:29:04.387
cmqanwx8t000204jp2faaauvy	cmqaniinj000004kzvz1rnb53	Analisis Laporan Keuangan: Neraca, Laba Rugi, dan Arus Kas	VIDEO	\N	https://www.youtube.com/watch?v=017QCTKnyL0	\N	8	0	2026-06-12 08:26:19.853	2026-06-12 08:38:28.867
\.


--
-- TOC entry 3743 (class 0 OID 25685)
-- Dependencies: 221
-- Data for Name: modules; Type: TABLE DATA; Schema: public; Owner: postgres_lms
--

COPY public.modules (id, "courseId", title, "order", "createdAt", "updatedAt") FROM stdin;
cmq08teex000104l4cg50y2h0	cmpwfacbn000004jowtmvf46s	ROFIQ: Perencanaan Sumber Daya Manusia & Strategi Pengembangan Talenta	1	2026-06-05 01:25:59.382	2026-06-05 01:26:04.584
cmq08teex000204l4gsf42omn	cmpwfacbn000004jowtmvf46s	ROFIQ: Pengembangan & Implementasi Kebijakan HC yang Efektif	2	2026-06-05 01:25:59.382	2026-06-05 01:26:04.696
cmq08teex000304l4865plfu7	cmpwfacbn000004jowtmvf46s	ROFIQ: Manajemen Kinerja, OKR, dan Dampaknya pada Bisnis	3	2026-06-05 01:25:59.382	2026-06-05 01:26:05.198
cmq08teex000404l4x88vxdpi	cmpwfacbn000004jowtmvf46s	ROFIQ: Komunikasi Kepemimpinan & Pengelolaan Pemangku Kepentingan	4	2026-06-05 01:25:59.382	2026-06-05 01:26:05.433
cmq08teey000704l4u49zjwac	cmpwfacbn000004jowtmvf46s	SUKMA: Memahami Konteks Bisnis & Operasional Dasar HC di Vascomm (Joint Session)	7	2026-06-05 01:25:59.382	2026-06-05 01:26:05.914
cmq08teey000804l43qvlpugd	cmpwfacbn000004jowtmvf46s	SUKMA: Manajemen Data HC, Akurasi, dan Kepatuhan Administratif	8	2026-06-05 01:25:59.382	2026-06-05 01:26:06.481
cmp6i34b5000604l4gma5s67e	cmp6i2wxu000504l4y25ozxel	Section 5.1	0	2026-05-15 05:52:24.209	2026-05-15 05:54:05.8
cmp6i439f000604l40vd96ltg	cmp6i2wxu000504l4y25ozxel	Section 5.2	1	2026-05-15 05:53:09.507	2026-05-15 05:54:05.897
cmp6i58l4000304l47vti0lxm	cmp6i2wxu000504l4y25ozxel	Section 5.3	2	2026-05-15 05:54:03.064	2026-05-15 05:54:15.262
cmp6hjvp8000504jsghjqcd1j	cmp6hjoca000404jsoue7f5uq	Section 2.1	0	2026-05-15 05:37:26.588	2026-05-15 05:39:18.562
cmp6hl5dn000204kzp2g6v90y	cmp6hjoca000404jsoue7f5uq	Section 2.2	1	2026-05-15 05:38:25.787	2026-05-15 05:39:18.66
cmp6hm80f000204jokn7bh0us	cmp6hjoca000404jsoue7f5uq	Section 2.3	2	2026-05-15 05:39:15.855	2026-05-15 05:39:37.782
cmp6hosv8000504kzeplo6okd	cmp6hooc6000404kz4q7ups1p	Section 3.1	0	2026-05-15 05:41:16.196	2026-05-15 05:42:45.094
cmp6hpkyg000604jogh665e28	cmp6hooc6000404kz4q7ups1p	Section 3.2	1	2026-05-15 05:41:52.6	2026-05-15 05:42:45.188
cmq08teex000504l48tgf5ixm	cmpwfacbn000004jowtmvf46s	ROFIQ: Tata Kelola Operasional HC & Pengambilan Keputusan Strategis	5	2026-06-05 01:25:59.382	2026-06-12 01:20:32.448
cmp6hqnle000004jp0nyagy4q	cmp6hooc6000404kz4q7ups1p	Section 3.3	2	2026-05-15 05:42:42.674	2026-05-15 05:42:54.197
cmq08teey000604l4pxptoagn	cmpwfacbn000004jowtmvf46s	Membangun Ownership & Kematangan Kepemimpinan HC	6	2026-06-05 01:25:59.382	2026-06-12 01:20:38.5
cmq08teey000904l4vkb13m94	cmpwfacbn000004jowtmvf46s	SUKMA: Eksekusi Konsisten Proses Inti HC (Rekrutmen, Onboarding, Payroll)	9	2026-06-05 01:25:59.382	2026-06-05 01:26:06.652
cmp6ht9tc000304l4a0z37b5e	cmp6ht3jr000204l46dmtac0x	Section 4.1	0	2026-05-15 05:44:44.784	2026-06-03 06:26:53.968
cmp6hu3td000204l4q05ul13t	cmp6ht3jr000204l46dmtac0x	Section 4.2	1	2026-05-15 05:45:23.665	2026-06-03 06:26:54.069
cmq08teey000a04l4veb6nw1g	cmpwfacbn000004jowtmvf46s	SUKMA: Kualitas Pelaporan HC & Analisis Data Dasar	10	2026-06-05 01:25:59.382	2026-06-05 01:26:06.792
cmq08teey000b04l4dr9dvx2w	cmpwfacbn000004jowtmvf46s	SUKMA: Komunikasi Efektif & Layanan Karyawan Prima	11	2026-06-05 01:25:59.382	2026-06-05 01:26:06.929
cmp6hv8vy000304jp3htr3hjj	cmp6ht3jr000204l46dmtac0x	Section 4.3	2	2026-05-15 05:46:16.894	2026-06-03 06:26:54.167
cmp6hwdyh000504l4lus8b20u	cmp6ht3jr000204l46dmtac0x	Section 4.4	3	2026-05-15 05:47:10.121	2026-06-03 06:26:54.264
cmp6hxbgh000404l4env80e40	cmp6ht3jr000204l46dmtac0x	Section 4.5	4	2026-05-15 05:47:53.537	2026-06-03 06:26:54.361
cmq08teex000004l4c8t836tt	cmpwfacbn000004jowtmvf46s	ROFIQ: Memahami Konteks Bisnis & Peran Strategis HC di Vascomm (Joint Session)	0	2026-06-05 01:25:59.382	2026-06-05 01:26:04.422
cmq08teey000c04l4js7m8qj2	cmpwfacbn000004jowtmvf46s	SUKMA: Peningkatan Proses & Otomatisasi Sederhana dalam Operasional HC	12	2026-06-05 01:25:59.382	2026-06-05 01:26:07.361
cmq08teey000d04l4amzcn3fu	cmpwfacbn000004jowtmvf46s	SUKMA: Menjadi Tulang Punggung Operasional HC yang Mandiri & Proaktif	13	2026-06-05 01:25:59.382	2026-06-05 01:26:07.691
cmpc7yktd000004l2lme7jpjp	cmp6h8i5g000004jsg0sqon65	Pembuka dan Pengerjaan Pre-Test	0	2026-05-19 05:55:33.217	2026-06-08 06:18:31.74
cmp6h8oqa000004l1hmaixi2w	cmp6h8i5g000004jsg0sqon65	Section 1.1	2	2026-05-15 05:28:44.338	2026-06-08 06:18:31.837
cmp6hdgan000204js93o19rn2	cmp6h8i5g000004jsg0sqon65	Section 1.2	3	2026-05-15 05:32:26.687	2026-06-08 06:18:31.93
cmp6hevy5000104kzsx85zc6f	cmp6h8i5g000004jsg0sqon65	Section 1.3	4	2026-05-15 05:33:33.629	2026-06-08 06:18:32.022
cmqanmaoc000104jp33ef9hi6	cmqang6v9000004jp7qrrgjgr	Financial Capital & Resource Optimization	3	2026-06-12 08:18:04.043	2026-06-12 08:24:15.328
cmqanmtjl000304kz5agab3df	cmqang6v9000004jp7qrrgjgr	Corporate Performance & Strategic Finance	4	2026-06-12 08:18:28.497	2026-06-12 08:24:15.427
cmqann17z000404kzzqrl8gna	cmqang6v9000004jp7qrrgjgr	Ownership Mentality	5	2026-06-12 08:18:38.447	2026-06-12 08:24:15.526
cmqanqyth000504kz9r3gakcz	cmqang6v9000004jp7qrrgjgr	Confidence & Decision Making	6	2026-06-12 08:21:41.957	2026-06-12 08:24:15.622
cmqaniinj000004kzvz1rnb53	cmqang6v9000004jp7qrrgjgr	Financial & Tax Management	0	2026-06-12 08:15:07.759	2026-06-12 08:24:15.035
cmqanjpwq000104kzdbeajjv1	cmqang6v9000004jp7qrrgjgr	Accuracy & Fraud Prevention (Numerical Awareness)	1	2026-06-12 08:16:03.818	2026-06-12 08:24:15.135
cmqanl6od000204kzhs03sjnq	cmqang6v9000004jp7qrrgjgr	FA Operational Governance & Compliance	2	2026-06-12 08:17:12.205	2026-06-12 08:24:15.232
\.


--
-- TOC entry 3758 (class 0 OID 26011)
-- Dependencies: 236
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres_lms
--

COPY public.notifications (id, "userId", type, title, message, "isRead", "actionUrl", "createdAt") FROM stdin;
cmpdhm0o6000204jumpyrzt6p	cmpcf8423000104le1xk4s30x	INFO	Pendaftaran Learning Path Berhasil	Anda telah terdaftar di learning path "Pelatihan AI Level Beginner".	f	/portal/learning-paths/cmp6eetva000004l5ibt5lfdn	2026-05-20 03:13:29.574
cmpdhm7c2000204joti7prnvz	cmpbzh465000004kzf90zix9b	INFO	Pendaftaran Learning Path Berhasil	Anda telah terdaftar di learning path "Pelatihan AI Level Beginner".	f	/portal/learning-paths/cmp6eetva000004l5ibt5lfdn	2026-05-20 03:13:38.21
cmpet1wco000204ji8die16lz	cmpavzuvp000204ictsqhg7iy	INFO	Pendaftaran Learning Path Berhasil	Anda telah terdaftar di learning path "Pelatihan AI Level Beginner".	f	/portal/learning-paths/cmp6eetva000004l5ibt5lfdn	2026-05-21 01:21:32.424
cmpetm4rr000204jlydjea1cg	cmpavwml8000104icnr5fi1j5	INFO	Pendaftaran Learning Path Berhasil	Anda telah terdaftar di learning path "Pelatihan AI Level Beginner".	f	/portal/learning-paths/cmp6eetva000004l5ibt5lfdn	2026-05-21 01:37:16.455
cmpeu5wrf000104l7wrctnl8u	cmpeu0z8h000004jxdbm3yh50	INFO	Pendaftaran Berhasil	Anda telah berhasil terdaftar di kursus "Modul 1: Mengenal Kecerdasan Buatan (AI)". Selamat belajar!	f	/portal/my-courses/cmp6h8i5g000004jsg0sqon65	2026-05-21 01:52:39.195
cmpeu8lxw000404ksbzeukahj	cmpcco602000004jszi4gyji2	INFO	Pendaftaran Learning Path Berhasil	Anda telah terdaftar di learning path "Pelatihan AI Level Beginner".	f	/portal/learning-paths/cmp6eetva000004l5ibt5lfdn	2026-05-21 01:54:45.14
cmpevi5a3000604jplbotqtl7	cmpav8yfu000704l7kdsi9nkj	INFO	Pendaftaran Learning Path Berhasil	Anda telah terdaftar di learning path "Pelatihan AI Level Beginner".	f	/portal/learning-paths/cmp6eetva000004l5ibt5lfdn	2026-05-21 02:30:09.723
cmpevi6l8000304jrxrkyhcxu	cmpc092ja000104jpqz6ee86a	INFO	Pendaftaran Learning Path Berhasil	Anda telah terdaftar di learning path "Pelatihan AI Level Beginner".	f	/portal/learning-paths/cmp6eetva000004l5ibt5lfdn	2026-05-21 02:30:11.42
cmpevi8rw000c04jr5gszpchk	cmpawzous000004kwfacrrpdf	INFO	Pendaftaran Learning Path Berhasil	Anda telah terdaftar di learning path "Pelatihan AI Level Beginner".	f	/portal/learning-paths/cmp6eetva000004l5ibt5lfdn	2026-05-21 02:30:14.252
cmpevibgd000204l2c5251k8u	cmpchuyb6000004l8ak22lana	INFO	Pendaftaran Learning Path Berhasil	Anda telah terdaftar di learning path "Pelatihan AI Level Beginner".	f	/portal/learning-paths/cmp6eetva000004l5ibt5lfdn	2026-05-21 02:30:17.725
cmpevidbu000904jplmaq8t6j	cmpaw9hap000604ic7noel0hz	INFO	Pendaftaran Learning Path Berhasil	Anda telah terdaftar di learning path "Pelatihan AI Level Beginner".	f	/portal/learning-paths/cmp6eetva000004l5ibt5lfdn	2026-05-21 02:30:20.154
cmpevihha000f04jrwfmlkorq	cmpdcpawm000004ji1xv7g6ra	INFO	Pendaftaran Learning Path Berhasil	Anda telah terdaftar di learning path "Pelatihan AI Level Beginner".	f	/portal/learning-paths/cmp6eetva000004l5ibt5lfdn	2026-05-21 02:30:25.534
cmpeviina000c04jpdqdw1346	cmpcfpyx4000504l2ub2vc5ae	INFO	Pendaftaran Learning Path Berhasil	Anda telah terdaftar di learning path "Pelatihan AI Level Beginner".	f	/portal/learning-paths/cmp6eetva000004l5ibt5lfdn	2026-05-21 02:30:27.045
cmpex239s000304jsqmdd06r4	cmpdjyd2m000004l8a618xllh	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 1: Mengenal Kecerdasan Buatan (AI)".	f	/portal/certificates	2026-05-21 03:13:39.856
cmpex23ql000504js3vmn4qz4	cmpdjyd2m000004l8a618xllh	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 1: Mengenal Kecerdasan Buatan (AI). Total poin Anda sekarang: 100.	f	/portal/dashboard	2026-05-21 03:13:40.461
cmpdjzhrm000204jsnsxka6d1	cmpdjyd2m000004l8a618xllh	INFO	Pendaftaran Learning Path Berhasil	Anda telah terdaftar di learning path "Pelatihan AI Level Beginner".	t	/portal/learning-paths/cmp6eetva000004l5ibt5lfdn	2026-05-20 04:19:57.49
cmpevi8aa000804jrfej4ips3	cmpauwy88000504l7brbkrk7a	INFO	Pendaftaran Learning Path Berhasil	Anda telah terdaftar di learning path "Pelatihan AI Level Beginner".	t	/portal/learning-paths/cmp6eetva000004l5ibt5lfdn	2026-05-21 02:30:13.618
cmpexh0pg000304l1j21blc4e	cmpauwy88000504l7brbkrk7a	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 1: Mengenal Kecerdasan Buatan (AI)".	t	/portal/certificates	2026-05-21 03:25:16.371
cmpexh190000504l1hn0g5yd5	cmpauwy88000504l7brbkrk7a	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 1: Mengenal Kecerdasan Buatan (AI). Total poin Anda sekarang: 100.	t	/portal/dashboard	2026-05-21 03:25:17.076
cmpexsycc000904l4883rv8mt	cmpauwy88000504l7brbkrk7a	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 2: Etika dan Keamanan Penggunaan AI".	t	/portal/certificates	2026-05-21 03:34:33.18
cmpexsyta000b04l4nctrahvd	cmpauwy88000504l7brbkrk7a	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 2: Etika dan Keamanan Penggunaan AI. Total poin Anda sekarang: 200.	t	/portal/dashboard	2026-05-21 03:34:33.79
cmpexzifz000g04l4r7fmr5is	cmpavwml8000104icnr5fi1j5	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 1: Mengenal Kecerdasan Buatan (AI)".	f	/portal/certificates	2026-05-21 03:39:39.167
cmpexziwn000i04l4r0wsho6q	cmpavwml8000104icnr5fi1j5	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 1: Mengenal Kecerdasan Buatan (AI). Total poin Anda sekarang: 100.	f	/portal/dashboard	2026-05-21 03:39:39.767
cmpeyu11i000304ldhq5rn1rt	cmpavzuvp000204ictsqhg7iy	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 1: Mengenal Kecerdasan Buatan (AI)".	f	/portal/certificates	2026-05-21 04:03:22.95
cmpeyu1jb000504ldzoblhfgm	cmpavzuvp000204ictsqhg7iy	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 1: Mengenal Kecerdasan Buatan (AI). Total poin Anda sekarang: 100.	f	/portal/dashboard	2026-05-21 04:03:23.591
cmpeyx6t6000p04l45cmacerm	cmpeu0z8h000004jxdbm3yh50	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 1: Mengenal Kecerdasan Buatan (AI)".	f	/portal/certificates	2026-05-21 04:05:50.394
cmpeyx78x000r04l4oer7hjs9	cmpeu0z8h000004jxdbm3yh50	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 1: Mengenal Kecerdasan Buatan (AI). Total poin Anda sekarang: 100.	f	/portal/dashboard	2026-05-21 04:05:50.961
cmpeyy1nz000b04ld0u5eqeq9	cmpdjyd2m000004l8a618xllh	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 2: Etika dan Keamanan Penggunaan AI".	f	/portal/certificates	2026-05-21 04:06:30.383
cmpeyy24b000e04ldh99rfr32	cmpdjyd2m000004l8a618xllh	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 2: Etika dan Keamanan Penggunaan AI. Total poin Anda sekarang: 200.	f	/portal/dashboard	2026-05-21 04:06:30.971
cmpeyy3qa000h04ldrgylj34c	cmpavzuvp000204ictsqhg7iy	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 2: Etika dan Keamanan Penggunaan AI".	f	/portal/certificates	2026-05-21 04:06:33.058
cmpeyy47h000j04ld2pk41ecb	cmpavzuvp000204ictsqhg7iy	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 2: Etika dan Keamanan Penggunaan AI. Total poin Anda sekarang: 200.	f	/portal/dashboard	2026-05-21 04:06:33.677
cmpeyyctb000804kypa3lu446	cmpeu0z8h000004jxdbm3yh50	INFO	Pendaftaran Berhasil	Anda telah berhasil terdaftar di kursus "Modul 2: Etika dan Keamanan Penggunaan AI". Selamat belajar!	f	/portal/my-courses/cmp6hjoca000404jsoue7f5uq	2026-05-21 04:06:44.83
cmpeyyu40000n04ld0oe3kqu7	cmpeu0z8h000004jxdbm3yh50	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 2: Etika dan Keamanan Penggunaan AI".	f	/portal/certificates	2026-05-21 04:07:07.247
cmpeyyuqp000p04ld6aon8pc2	cmpeu0z8h000004jxdbm3yh50	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 2: Etika dan Keamanan Penggunaan AI. Total poin Anda sekarang: 200.	f	/portal/dashboard	2026-05-21 04:07:08.065
cmpeyz1ph000d04kyhxfbf446	cmpeu0z8h000004jxdbm3yh50	INFO	Pendaftaran Berhasil	Anda telah berhasil terdaftar di kursus "Modul 3: Dasar-Dasar Prompting". Selamat belajar!	f	/portal/my-courses/cmp6hooc6000404kz4q7ups1p	2026-05-21 04:07:17.093
cmpf38box000304kvtuffvaif	cmpavzuvp000204ictsqhg7iy	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 3: Dasar-Dasar Prompting".	f	/portal/certificates	2026-05-21 06:06:28.401
cmpf38c58000504kvqf231y8z	cmpavzuvp000204ictsqhg7iy	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 3: Dasar-Dasar Prompting. Total poin Anda sekarang: 300.	f	/portal/dashboard	2026-05-21 06:06:28.987
cmpf3osgo000504jlidcz4sux	cmpc2e7ss000004jmotm0s6l6	INFO	Pendaftaran Learning Path Berhasil	Anda telah terdaftar di learning path "Pelatihan AI Level Beginner".	f	/portal/learning-paths/cmp6eetva000004l5ibt5lfdn	2026-05-21 06:19:16.632
cmpf3s81i000a04jlb73vjejw	cmpc2e7ss000004jmotm0s6l6	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 1: Mengenal Kecerdasan Buatan (AI)".	f	/portal/certificates	2026-05-21 06:21:56.79
cmpf3s8ic000c04jla52kqtxv	cmpc2e7ss000004jmotm0s6l6	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 1: Mengenal Kecerdasan Buatan (AI). Total poin Anda sekarang: 100.	f	/portal/dashboard	2026-05-21 06:21:57.396
cmpf3vtkx000g04jltgrp1hzr	cmpavwml8000104icnr5fi1j5	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 2: Etika dan Keamanan Penggunaan AI".	f	/portal/certificates	2026-05-21 06:24:44.673
cmpf3vu1r000i04jlnlpj555u	cmpavwml8000104icnr5fi1j5	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 2: Etika dan Keamanan Penggunaan AI. Total poin Anda sekarang: 200.	f	/portal/dashboard	2026-05-21 06:24:45.279
cmpf40yn8000c04kvlkm8hrba	cmpc2e7ss000004jmotm0s6l6	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 2: Etika dan Keamanan Penggunaan AI".	f	/portal/certificates	2026-05-21 06:28:44.516
cmpf40z41000e04kvtjmyesjg	cmpc2e7ss000004jmotm0s6l6	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 2: Etika dan Keamanan Penggunaan AI. Total poin Anda sekarang: 200.	f	/portal/dashboard	2026-05-21 06:28:45.121
cmpf4q3lk000804jonynrwa4x	cmpc2e7ss000004jmotm0s6l6	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 3: Dasar-Dasar Prompting".	f	/portal/certificates	2026-05-21 06:48:17.336
cmpf4q438000a04joora6fuh1	cmpc2e7ss000004jmotm0s6l6	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 3: Dasar-Dasar Prompting. Total poin Anda sekarang: 300.	f	/portal/dashboard	2026-05-21 06:48:17.972
cmpf4qerk001304jlvt29kt1w	cmpdjyd2m000004l8a618xllh	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 3: Dasar-Dasar Prompting".	f	/portal/certificates	2026-05-21 06:48:31.808
cmpf4qfad001504jlu05xskkz	cmpdjyd2m000004l8a618xllh	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 3: Dasar-Dasar Prompting. Total poin Anda sekarang: 300.	f	/portal/dashboard	2026-05-21 06:48:32.485
cmpf4qgnu001a04jlmjtyeoxr	cmpby3n1h000404jmxq5up352	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 1: Mengenal Kecerdasan Buatan (AI). Total poin Anda sekarang: 100.	f	/portal/dashboard	2026-05-21 06:48:34.266
cmpevi8ot000b04jrmyvlxew5	cmpby3n1h000404jmxq5up352	INFO	Pendaftaran Learning Path Berhasil	Anda telah terdaftar di learning path "Pelatihan AI Level Beginner".	t	/portal/learning-paths/cmp6eetva000004l5ibt5lfdn	2026-05-21 02:30:14.141
cmpf4riug001f04jlrts6ph6c	cmpby3n1h000404jmxq5up352	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 2: Etika dan Keamanan Penggunaan AI".	f	/portal/certificates	2026-05-21 06:49:23.752
cmpf4rjbe001h04jlzpvd2e26	cmpby3n1h000404jmxq5up352	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 2: Etika dan Keamanan Penggunaan AI. Total poin Anda sekarang: 200.	f	/portal/dashboard	2026-05-21 06:49:24.362
cmpf4szme001k04jl5xem6ztv	cmpc00slt000204ldi8ru8xiz	INFO	Pendaftaran Learning Path Berhasil	Anda telah terdaftar di learning path "Pelatihan AI Level Beginner".	f	/portal/learning-paths/cmp6eetva000004l5ibt5lfdn	2026-05-21 06:50:32.15
cmpf4qg6j001804jlg39bu056	cmpby3n1h000404jmxq5up352	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 1: Mengenal Kecerdasan Buatan (AI)".	t	/portal/certificates	2026-05-21 06:48:33.643
cmpf4w7yt000504l1ie1bf40r	cmpc00slt000204ldi8ru8xiz	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 1: Mengenal Kecerdasan Buatan (AI)".	f	/portal/certificates	2026-05-21 06:53:02.933
cmpf4w8ge000704l1k0f3d771	cmpc00slt000204ldi8ru8xiz	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 1: Mengenal Kecerdasan Buatan (AI). Total poin Anda sekarang: 100.	f	/portal/dashboard	2026-05-21 06:53:03.566
cmpf5i4a8000q04joh49gv1xt	cmpcco602000004jszi4gyji2	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 1: Mengenal Kecerdasan Buatan (AI)".	f	/portal/certificates	2026-05-21 07:10:04.592
cmpf5i51b000s04jo9e0mvgiw	cmpcco602000004jszi4gyji2	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 1: Mengenal Kecerdasan Buatan (AI). Total poin Anda sekarang: 100.	f	/portal/dashboard	2026-05-21 07:10:05.567
cmpf5iywc000504jvbsv9hh8o	cmpcco602000004jszi4gyji2	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 2: Etika dan Keamanan Penggunaan AI".	f	/portal/certificates	2026-05-21 07:10:44.268
cmpf5izdi000704jvayb16zlj	cmpcco602000004jszi4gyji2	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 2: Etika dan Keamanan Penggunaan AI. Total poin Anda sekarang: 200.	f	/portal/dashboard	2026-05-21 07:10:44.886
cmpf4cmcz000p04jl0i9xifr2	cmpauwy88000504l7brbkrk7a	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 3: Dasar-Dasar Prompting".	t	/portal/certificates	2026-05-21 06:37:48.467
cmpf5w3pm000b04l6sbh1jmkc	cmpavwml8000104icnr5fi1j5	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 3: Dasar-Dasar Prompting".	f	/portal/certificates	2026-05-21 07:20:57.034
cmpf5w46a000d04l6yaws7ezq	cmpavwml8000104icnr5fi1j5	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 3: Dasar-Dasar Prompting. Total poin Anda sekarang: 300.	f	/portal/dashboard	2026-05-21 07:20:57.634
cmpf62954000n04l6hfg0vld9	cmpbzh465000004kzf90zix9b	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 1: Mengenal Kecerdasan Buatan (AI)".	f	/portal/certificates	2026-05-21 07:25:44.008
cmpf629mi000p04l690pl0kup	cmpbzh465000004kzf90zix9b	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 1: Mengenal Kecerdasan Buatan (AI). Total poin Anda sekarang: 100.	f	/portal/dashboard	2026-05-21 07:25:44.634
cmpf635w0000v04l6sjgbgzik	cmpbzh465000004kzf90zix9b	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 2: Etika dan Keamanan Penggunaan AI".	f	/portal/certificates	2026-05-21 07:26:26.448
cmpf636d4000x04l6ocmrhb1e	cmpbzh465000004kzf90zix9b	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 2: Etika dan Keamanan Penggunaan AI. Total poin Anda sekarang: 200.	f	/portal/dashboard	2026-05-21 07:26:27.064
cmpf64unp000w05kwx0i2zjwz	cmpbzh465000004kzf90zix9b	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 3: Dasar-Dasar Prompting".	f	/portal/certificates	2026-05-21 07:27:45.205
cmpf64v48000y05kw0a84lw5d	cmpbzh465000004kzf90zix9b	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 3: Dasar-Dasar Prompting. Total poin Anda sekarang: 300.	f	/portal/dashboard	2026-05-21 07:27:45.8
cmpf5rpyz000j04jvs2pede4l	cmpf5rfbl000004i8ujcbh2hd	INFO	Pendaftaran Learning Path Berhasil	Anda telah terdaftar di learning path "Pelatihan AI Level Beginner".	t	/portal/learning-paths/cmp6eetva000004l5ibt5lfdn	2026-05-21 07:17:32.603
cmpf5tlk9000704jubi1ut60j	cmpf5rfbl000004i8ujcbh2hd	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 1: Mengenal Kecerdasan Buatan (AI)".	t	/portal/certificates	2026-05-21 07:19:00.201
cmpf5tm3j000904ju432lt06e	cmpf5rfbl000004i8ujcbh2hd	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 1: Mengenal Kecerdasan Buatan (AI). Total poin Anda sekarang: 100.	t	/portal/dashboard	2026-05-21 07:19:00.895
cmpf5udli000u04jvsv28c7is	cmpf5rfbl000004i8ujcbh2hd	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 2: Etika dan Keamanan Penggunaan AI".	t	/portal/certificates	2026-05-21 07:19:36.534
cmpf5ue34000w04jvmros2ky6	cmpf5rfbl000004i8ujcbh2hd	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 2: Etika dan Keamanan Penggunaan AI. Total poin Anda sekarang: 200.	t	/portal/dashboard	2026-05-21 07:19:37.167
cmpf5ymkp001004jvvkq72ohw	cmpf5rfbl000004i8ujcbh2hd	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 3: Dasar-Dasar Prompting".	t	/portal/certificates	2026-05-21 07:22:54.793
cmpf5yn2f001204jvdb92utlg	cmpf5rfbl000004i8ujcbh2hd	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 3: Dasar-Dasar Prompting. Total poin Anda sekarang: 300.	t	/portal/dashboard	2026-05-21 07:22:55.431
cmpf5zxcj000b05kwgw5612va	cmpf5rfbl000004i8ujcbh2hd	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 4: The 4D Prompt Optimization Methodology".	t	/portal/certificates	2026-05-21 07:23:55.411
cmpf5zxtv000d05kw2mfkiqjc	cmpf5rfbl000004i8ujcbh2hd	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 4: The 4D Prompt Optimization Methodology. Total poin Anda sekarang: 400.	t	/portal/dashboard	2026-05-21 07:23:56.035
cmpf60pd5000j05kwsqgtzqvl	cmpf5rfbl000004i8ujcbh2hd	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 5: Aplikasi Praktis AI dalam Pekerjaan Sehari-Hari".	t	/portal/certificates	2026-05-21 07:24:31.721
cmpf60pt0000l05kwb4mj969g	cmpf5rfbl000004i8ujcbh2hd	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 5: Aplikasi Praktis AI dalam Pekerjaan Sehari-Hari. Total poin Anda sekarang: 500.	t	/portal/dashboard	2026-05-21 07:24:32.292
cmpf69eoo000q04jup69eiu9q	cmpcco602000004jszi4gyji2	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 3: Dasar-Dasar Prompting".	f	/portal/certificates	2026-05-21 07:31:17.784
cmpf69f48000s04juc2ge1fsf	cmpcco602000004jszi4gyji2	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 3: Dasar-Dasar Prompting. Total poin Anda sekarang: 300.	f	/portal/dashboard	2026-05-21 07:31:18.344
cmpf6axhc001404l69gzyzqn2	cmpcco602000004jszi4gyji2	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 4: The 4D Prompt Optimization Methodology".	f	/portal/certificates	2026-05-21 07:32:28.8
cmpf6axy3001604l6pm8ykmon	cmpcco602000004jszi4gyji2	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 4: The 4D Prompt Optimization Methodology. Total poin Anda sekarang: 400.	f	/portal/dashboard	2026-05-21 07:32:29.403
cmpf6cmyj000y04ju4c7t15uq	cmpcco602000004jszi4gyji2	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 5: Aplikasi Praktis AI dalam Pekerjaan Sehari-Hari".	f	/portal/certificates	2026-05-21 07:33:48.475
cmpf6cnf9001004jugjqms53o	cmpcco602000004jszi4gyji2	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 5: Aplikasi Praktis AI dalam Pekerjaan Sehari-Hari. Total poin Anda sekarang: 500.	f	/portal/dashboard	2026-05-21 07:33:49.077
cmpf71rm7001d04l6ho2t5wa7	cmpavwml8000104icnr5fi1j5	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 4: The 4D Prompt Optimization Methodology".	f	/portal/certificates	2026-05-21 07:53:20.911
cmpf71s2o001f04l6eukt7821	cmpavwml8000104icnr5fi1j5	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 4: The 4D Prompt Optimization Methodology. Total poin Anda sekarang: 400.	f	/portal/dashboard	2026-05-21 07:53:21.504
cmpfa2kw9000304kztw6oawva	cmpdjyd2m000004l8a618xllh	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 4: The 4D Prompt Optimization Methodology".	f	/portal/certificates	2026-05-21 09:17:57.705
cmpf86exq000304kwrww66vev	cmpauwy88000504l7brbkrk7a	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 4: The 4D Prompt Optimization Methodology".	t	/portal/certificates	2026-05-21 08:24:57.374
cmpfa2lct000504kzaak0m21o	cmpdjyd2m000004l8a618xllh	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 4: The 4D Prompt Optimization Methodology. Total poin Anda sekarang: 400.	t	/portal/dashboard	2026-05-21 09:17:58.301
cmpfacyqo000904l4g2mxbx2p	cmpb17ttx000004l2le1aa3f4	INFO	Pendaftaran Learning Path Berhasil	Anda telah terdaftar di learning path "Pelatihan AI Level Beginner".	f	/portal/learning-paths/cmp6eetva000004l5ibt5lfdn	2026-05-21 09:26:02.208
cmpfb20hz000204jxtbstwy8u	cmpcfkuz6000204l2xll6kbnf	INFO	Pendaftaran Learning Path Berhasil	Anda telah terdaftar di learning path "Pelatihan AI Level Beginner".	f	/portal/learning-paths/cmp6eetva000004l5ibt5lfdn	2026-05-21 09:45:30.887
cmpfb7o0o000204jx5mx769fk	cmpby32ba000304jm517sn0i2	INFO	Pendaftaran Learning Path Berhasil	Anda telah terdaftar di learning path "Pelatihan AI Level Beginner".	f	/portal/learning-paths/cmp6eetva000004l5ibt5lfdn	2026-05-21 09:49:54.648
cmpf4cmtm000r04jllpi5t51h	cmpauwy88000504l7brbkrk7a	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 3: Dasar-Dasar Prompting. Total poin Anda sekarang: 300.	t	/portal/dashboard	2026-05-21 06:37:49.066
cmpf86ffa000504kw31n8qmcz	cmpauwy88000504l7brbkrk7a	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 4: The 4D Prompt Optimization Methodology. Total poin Anda sekarang: 400.	t	/portal/dashboard	2026-05-21 08:24:58.006
cmpfb80ki000204icone7r2x8	cmpauwy88000504l7brbkrk7a	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 5: Aplikasi Praktis AI dalam Pekerjaan Sehari-Hari".	t	/portal/certificates	2026-05-21 09:50:10.914
cmpfb811i000404icw5abeerr	cmpauwy88000504l7brbkrk7a	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 5: Aplikasi Praktis AI dalam Pekerjaan Sehari-Hari. Total poin Anda sekarang: 500.	t	/portal/dashboard	2026-05-21 09:50:11.526
cmpfb9s7w000404i57c08kqeb	cmpdjyd2m000004l8a618xllh	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Pelatihan AI Level Beginner".	f	/portal/certificates	2026-05-21 09:51:33.404
cmpfb9t16000604i5kdinak7g	cmpdjyd2m000004l8a618xllh	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 5: Aplikasi Praktis AI dalam Pekerjaan Sehari-Hari".	f	/portal/certificates	2026-05-21 09:51:34.458
cmpfb9thj000804i5ypc8gn95	cmpdjyd2m000004l8a618xllh	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 5: Aplikasi Praktis AI dalam Pekerjaan Sehari-Hari. Total poin Anda sekarang: 500.	f	/portal/dashboard	2026-05-21 09:51:35.047
cmpfbakfy000b04i55tpwspoj	cmpcj94wh000004l2n1xb9l80	INFO	Pendaftaran Learning Path Berhasil	Anda telah terdaftar di learning path "Pelatihan AI Level Beginner".	f	/portal/learning-paths/cmp6eetva000004l5ibt5lfdn	2026-05-21 09:52:09.982
cmpfbalyo000e04i54hxamkqw	cmpazdrk1000004i6qmdd98yv	INFO	Pendaftaran Learning Path Berhasil	Anda telah terdaftar di learning path "Pelatihan AI Level Beginner".	f	/portal/learning-paths/cmp6eetva000004l5ibt5lfdn	2026-05-21 09:52:11.952
cmpfbax5h000604jx6rthwqaq	cmpcc089w000004ldyubgbcht	INFO	Pendaftaran Learning Path Berhasil	Anda telah terdaftar di learning path "Pelatihan AI Level Beginner".	f	/portal/learning-paths/cmp6eetva000004l5ibt5lfdn	2026-05-21 09:52:26.452
cmpfbchi5000504jxzd1bbogx	cmpbzwne4000004icd9d3mj9g	INFO	Pendaftaran Learning Path Berhasil	Anda telah terdaftar di learning path "Pelatihan AI Level Beginner".	f	/portal/learning-paths/cmp6eetva000004l5ibt5lfdn	2026-05-21 09:53:39.485
cmpfbd7z6000304jpuwekrw9o	cmpcf5vqi000004le2dq5l7sn	INFO	Pendaftaran Learning Path Berhasil	Anda telah terdaftar di learning path "Pelatihan AI Level Beginner".	f	/portal/learning-paths/cmp6eetva000004l5ibt5lfdn	2026-05-21 09:54:13.794
cmpflr38d000504l1ysp6eu2v	cmpcj94wh000004l2n1xb9l80	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 1: Mengenal Kecerdasan Buatan (AI)".	f	/portal/certificates	2026-05-21 14:44:56.989
cmpflr3ot000704l1vijse4yz	cmpcj94wh000004l2n1xb9l80	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 1: Mengenal Kecerdasan Buatan (AI). Total poin Anda sekarang: 100.	f	/portal/dashboard	2026-05-21 14:44:57.581
cmpfm9wgl000504jp3hb7oo47	cmpcj94wh000004l2n1xb9l80	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 2: Etika dan Keamanan Penggunaan AI. Total poin Anda sekarang: 200.	f	/portal/dashboard	2026-05-21 14:59:34.677
cmpfm9vzb000304jpmqviyvvf	cmpcj94wh000004l2n1xb9l80	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 2: Etika dan Keamanan Penggunaan AI".	t	/portal/certificates	2026-05-21 14:59:34.055
cmpfobzgb000204lbh99uip27	cmpby2ke1000204jmtuusb6y5	INFO	Pendaftaran Learning Path Berhasil	Anda telah terdaftar di learning path "Pelatihan AI Level Beginner".	f	/portal/learning-paths/cmp6eetva000004l5ibt5lfdn	2026-05-21 15:57:11.099
cmpg5ndh4000204l87e1s31ef	cmpavuniy000004ic2scwt305	INFO	Pendaftaran Learning Path Berhasil	Anda telah terdaftar di learning path "Pelatihan AI Level Beginner".	f	/portal/learning-paths/cmp6eetva000004l5ibt5lfdn	2026-05-22 00:01:55.96
cmpg66fjo000604icphryqkie	cmpavuniy000004ic2scwt305	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 1: Mengenal Kecerdasan Buatan (AI). Total poin Anda sekarang: 100.	f	/portal/dashboard	2026-05-22 00:16:45.108
cmpg6e2bt000504kz2122nopg	cmpavuniy000004ic2scwt305	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 2: Etika dan Keamanan Penggunaan AI".	f	/portal/certificates	2026-05-22 00:22:41.225
cmpg6e2u2000704kzmbcxsr4t	cmpavuniy000004ic2scwt305	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 2: Etika dan Keamanan Penggunaan AI. Total poin Anda sekarang: 200.	f	/portal/dashboard	2026-05-22 00:22:41.882
cmpg66f3d000404icaopt8vv8	cmpavuniy000004ic2scwt305	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 1: Mengenal Kecerdasan Buatan (AI)".	t	/portal/certificates	2026-05-22 00:16:44.521
cmpg6hn62000304l5yewbakeg	cmpavuniy000004ic2scwt305	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 3: Dasar-Dasar Prompting".	f	/portal/certificates	2026-05-22 00:25:28.202
cmpg6hnmt000504l51af5rfb5	cmpavuniy000004ic2scwt305	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 3: Dasar-Dasar Prompting. Total poin Anda sekarang: 300.	f	/portal/dashboard	2026-05-22 00:25:28.805
cmpg6inoc000b04l52g2auihl	cmpavuniy000004ic2scwt305	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 4: The 4D Prompt Optimization Methodology".	f	/portal/certificates	2026-05-22 00:26:15.516
cmpg6io48000d04l5wxmgjdhq	cmpavuniy000004ic2scwt305	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 4: The 4D Prompt Optimization Methodology. Total poin Anda sekarang: 400.	f	/portal/dashboard	2026-05-22 00:26:16.088
cmpg6pe0f000h04l56w7lyi36	cmpavuniy000004ic2scwt305	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 5: Aplikasi Praktis AI dalam Pekerjaan Sehari-Hari".	f	/portal/certificates	2026-05-22 00:31:29.583
cmpg6pegm000j04l5y6rzt45e	cmpavuniy000004ic2scwt305	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 5: Aplikasi Praktis AI dalam Pekerjaan Sehari-Hari. Total poin Anda sekarang: 500.	f	/portal/dashboard	2026-05-22 00:31:30.166
cmpg74dje000604jpgvpqqsm4	cmpby3n1h000404jmxq5up352	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 3: Dasar-Dasar Prompting".	f	/portal/certificates	2026-05-22 00:43:08.81
cmpg74e0l000804jp4i5d7sg3	cmpby3n1h000404jmxq5up352	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 3: Dasar-Dasar Prompting. Total poin Anda sekarang: 300.	f	/portal/dashboard	2026-05-22 00:43:09.429
cmpg75nyc000604jpevkf4qz9	cmpby3n1h000404jmxq5up352	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 4: The 4D Prompt Optimization Methodology".	f	/portal/certificates	2026-05-22 00:44:08.964
cmpg75of0000804jptf0l7nsn	cmpby3n1h000404jmxq5up352	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 4: The 4D Prompt Optimization Methodology. Total poin Anda sekarang: 400.	f	/portal/dashboard	2026-05-22 00:44:09.564
cmpg76ifi000d04jpoiqblmpa	cmpby3n1h000404jmxq5up352	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Pelatihan AI Level Beginner".	f	/portal/certificates	2026-05-22 00:44:48.462
cmpg76j72000f04jpwx97m6ry	cmpby3n1h000404jmxq5up352	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 5: Aplikasi Praktis AI dalam Pekerjaan Sehari-Hari".	f	/portal/certificates	2026-05-22 00:44:49.454
cmpg76jnd000h04jp3aiazz29	cmpby3n1h000404jmxq5up352	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 5: Aplikasi Praktis AI dalam Pekerjaan Sehari-Hari. Total poin Anda sekarang: 500.	f	/portal/dashboard	2026-05-22 00:44:50.041
cmpg80qx4000504l8i0ziw5di	cmpby32ba000304jm517sn0i2	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 1: Mengenal Kecerdasan Buatan (AI)".	f	/portal/certificates	2026-05-22 01:08:19.144
cmpg80rfc000704l8yidfh6rx	cmpby32ba000304jm517sn0i2	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 1: Mengenal Kecerdasan Buatan (AI). Total poin Anda sekarang: 100.	f	/portal/dashboard	2026-05-22 01:08:19.8
cmpg81kks000604la4fdnjqs2	cmpby32ba000304jm517sn0i2	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 2: Etika dan Keamanan Penggunaan AI".	f	/portal/certificates	2026-05-22 01:08:57.58
cmpg81l1b000804laysr7z11f	cmpby32ba000304jm517sn0i2	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 2: Etika dan Keamanan Penggunaan AI. Total poin Anda sekarang: 200.	f	/portal/dashboard	2026-05-22 01:08:58.175
cmpg82gtq000904jp89g7fktd	cmpby32ba000304jm517sn0i2	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 3: Dasar-Dasar Prompting".	f	/portal/certificates	2026-05-22 01:09:39.374
cmpg82hbl000b04jp7rs00u07	cmpby32ba000304jm517sn0i2	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 3: Dasar-Dasar Prompting. Total poin Anda sekarang: 300.	f	/portal/dashboard	2026-05-22 01:09:40.017
cmpg8fgzv000404l7r1ido6ds	cmpbzwne4000004icd9d3mj9g	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 1: Mengenal Kecerdasan Buatan (AI)".	f	/portal/certificates	2026-05-22 01:19:46.123
cmpg8fhgo000604l7lsw5s7fm	cmpbzwne4000004icd9d3mj9g	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 1: Mengenal Kecerdasan Buatan (AI). Total poin Anda sekarang: 100.	f	/portal/dashboard	2026-05-22 01:19:46.728
cmpg8gj2c000j04jpcjyvf8ww	cmpbzwne4000004icd9d3mj9g	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 2: Etika dan Keamanan Penggunaan AI".	f	/portal/certificates	2026-05-22 01:20:35.46
cmpg8gjij000l04jp6vh4dhnj	cmpbzwne4000004icd9d3mj9g	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 2: Etika dan Keamanan Penggunaan AI. Total poin Anda sekarang: 200.	f	/portal/dashboard	2026-05-22 01:20:36.043
cmpg8h94e000904l296su7kvg	cmpbzwne4000004icd9d3mj9g	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 3: Dasar-Dasar Prompting".	f	/portal/certificates	2026-05-22 01:21:09.23
cmpg8h9le000b04l25a2k7yov	cmpbzwne4000004icd9d3mj9g	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 3: Dasar-Dasar Prompting. Total poin Anda sekarang: 300.	f	/portal/dashboard	2026-05-22 01:21:09.842
cmpg8i8ef000e04l7vpoj7gxw	cmpbzwne4000004icd9d3mj9g	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 4: The 4D Prompt Optimization Methodology".	f	/portal/certificates	2026-05-22 01:21:54.951
cmpg8i8v6000g04l78fzy1h0q	cmpbzwne4000004icd9d3mj9g	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 4: The 4D Prompt Optimization Methodology. Total poin Anda sekarang: 400.	f	/portal/dashboard	2026-05-22 01:21:55.554
cmpg8iyz1000f04l8h1vh48vg	cmpbzwne4000004icd9d3mj9g	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Pelatihan AI Level Beginner".	f	/portal/certificates	2026-05-22 01:22:29.389
cmpg8izq0000h04l8kkcbdgnc	cmpbzwne4000004icd9d3mj9g	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 5: Aplikasi Praktis AI dalam Pekerjaan Sehari-Hari".	f	/portal/certificates	2026-05-22 01:22:30.36
cmpg8j06a000j04l8nsua7700	cmpbzwne4000004icd9d3mj9g	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 5: Aplikasi Praktis AI dalam Pekerjaan Sehari-Hari. Total poin Anda sekarang: 500.	f	/portal/dashboard	2026-05-22 01:22:30.946
cmpgffrpu000504jse6hoigt5	cmpb17ttx000004l2le1aa3f4	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 1: Mengenal Kecerdasan Buatan (AI)".	f	/portal/certificates	2026-05-22 04:35:57.33
cmpgffs7e000704jsccexojgk	cmpb17ttx000004l2le1aa3f4	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 1: Mengenal Kecerdasan Buatan (AI). Total poin Anda sekarang: 100.	f	/portal/dashboard	2026-05-22 04:35:57.961
cmpgfgqfz000804lb5i5yxixq	cmpb17ttx000004l2le1aa3f4	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 2: Etika dan Keamanan Penggunaan AI".	f	/portal/certificates	2026-05-22 04:36:42.335
cmpgfgr1w000a04lbg10no6nt	cmpb17ttx000004l2le1aa3f4	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 2: Etika dan Keamanan Penggunaan AI. Total poin Anda sekarang: 200.	f	/portal/dashboard	2026-05-22 04:36:43.124
cmpgfhekh000904kzd1bpdfwo	cmpb17ttx000004l2le1aa3f4	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 3: Dasar-Dasar Prompting. Total poin Anda sekarang: 300.	f	/portal/dashboard	2026-05-22 04:37:13.601
cmpgfj2j0000e04js19izx0sl	cmpb17ttx000004l2le1aa3f4	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 4: The 4D Prompt Optimization Methodology".	f	/portal/certificates	2026-05-22 04:38:31.308
cmpgfj2z0000g04jsmxb34oci	cmpb17ttx000004l2le1aa3f4	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 4: The 4D Prompt Optimization Methodology. Total poin Anda sekarang: 400.	f	/portal/dashboard	2026-05-22 04:38:31.884
cmpgfjs9h000h04kzgyvmlpr2	cmpb17ttx000004l2le1aa3f4	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Pelatihan AI Level Beginner".	f	/portal/certificates	2026-05-22 04:39:04.661
cmpgfjt2u000j04kzulwsee9s	cmpb17ttx000004l2le1aa3f4	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 5: Aplikasi Praktis AI dalam Pekerjaan Sehari-Hari".	f	/portal/certificates	2026-05-22 04:39:05.718
cmpgfjtk1000l04kzfha90hvn	cmpb17ttx000004l2le1aa3f4	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 5: Aplikasi Praktis AI dalam Pekerjaan Sehari-Hari. Total poin Anda sekarang: 500.	f	/portal/dashboard	2026-05-22 04:39:06.337
cmpgfhe2i000704kzymp1x88v	cmpb17ttx000004l2le1aa3f4	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 3: Dasar-Dasar Prompting".	t	/portal/certificates	2026-05-22 04:37:12.954
cmq60j7lv000404jvhnzh8lb6	cmpcfpyx4000504l2ub2vc5ae	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 1: Mengenal Kecerdasan Buatan (AI)".	f	/portal/certificates	2026-06-09 02:20:44.227
cmq60j82u000604jvhzeza30n	cmpcfpyx4000504l2ub2vc5ae	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 1: Mengenal Kecerdasan Buatan (AI). Total poin Anda sekarang: 100.	f	/portal/dashboard	2026-06-09 02:20:44.838
cmq6d5pja000304jvtqefeudd	cmpcfpyx4000504l2ub2vc5ae	ACHIEVEMENT	Sertifikat Baru!	Selamat! Anda telah mendapatkan sertifikat kelulusan untuk "Modul 2: Etika dan Keamanan Penggunaan AI".	f	/portal/certificates	2026-06-09 08:14:09.286
cmq6d5q1k000504jvwvu4d4be	cmpcfpyx4000504l2ub2vc5ae	ACHIEVEMENT	Poin Ditambahkan! 🌟	Selamat! Anda mendapatkan 100 poin dari: Menyelesaikan kursus: Modul 2: Etika dan Keamanan Penggunaan AI. Total poin Anda sekarang: 200.	f	/portal/dashboard	2026-06-09 08:14:09.944
\.


--
-- TOC entry 3763 (class 0 OID 27030)
-- Dependencies: 241
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres_lms
--

COPY public.orders (id, "userId", "itemType", "itemId", "itemTitle", price, "originalPrice", status, "paidAt", notes, "xenditInvoiceId", "xenditInvoiceUrl", "paymentMethod", "paymentGateway", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 3755 (class 0 OID 25934)
-- Dependencies: 233
-- Data for Name: path_courses; Type: TABLE DATA; Schema: public; Owner: postgres_lms
--

COPY public.path_courses (id, "pathId", "courseId", "order", "createdAt", "updatedAt") FROM stdin;
cmpf5nikg000a04jvu3s6cl0t	cmp6eetva000004l5ibt5lfdn	cmp6h8i5g000004jsg0sqon65	0	2026-05-21 07:14:16.384	2026-05-21 07:14:16.384
cmpf5nikh000b04jv0exre59y	cmp6eetva000004l5ibt5lfdn	cmp6hjoca000404jsoue7f5uq	1	2026-05-21 07:14:16.384	2026-05-21 07:14:16.384
cmpf5nikh000c04jv0dx21273	cmp6eetva000004l5ibt5lfdn	cmp6hooc6000404kz4q7ups1p	2	2026-05-21 07:14:16.384	2026-05-21 07:14:16.384
cmpf5nikh000d04jv0kefydhg	cmp6eetva000004l5ibt5lfdn	cmp6ht3jr000204l46dmtac0x	3	2026-05-21 07:14:16.384	2026-05-21 07:14:16.384
cmpf5nikh000e04jv7vpeo15q	cmp6eetva000004l5ibt5lfdn	cmp6i2wxu000504l4y25ozxel	4	2026-05-21 07:14:16.384	2026-05-21 07:14:16.384
\.


--
-- TOC entry 3756 (class 0 OID 25943)
-- Dependencies: 234
-- Data for Name: path_enrollments; Type: TABLE DATA; Schema: public; Owner: postgres_lms
--

COPY public.path_enrollments (id, "userId", "pathId", "enrolledAt", "completedAt", "updatedAt", "dueDate", "isMandatory", "startDate") FROM stdin;
cmpdhm07x000004jupt0gffbd	cmpcf8423000104le1xk4s30x	cmp6eetva000004l5ibt5lfdn	2026-05-20 03:13:28.893	\N	2026-05-20 03:13:28.893	\N	f	\N
cmpdhm6we000004jou7hfcjsn	cmpbzh465000004kzf90zix9b	cmp6eetva000004l5ibt5lfdn	2026-05-20 03:13:37.553	\N	2026-05-20 03:13:37.553	\N	f	\N
cmpet1vwb000004ji50v0txse	cmpavzuvp000204ictsqhg7iy	cmp6eetva000004l5ibt5lfdn	2026-05-21 01:21:31.739	\N	2026-05-21 01:21:31.739	\N	f	\N
cmpetm4ak000004jldsmuzjro	cmpavwml8000104icnr5fi1j5	cmp6eetva000004l5ibt5lfdn	2026-05-21 01:37:15.735	\N	2026-05-21 01:37:15.735	\N	f	\N
cmpeu8lho000204ks126yb52m	cmpcco602000004jszi4gyji2	cmp6eetva000004l5ibt5lfdn	2026-05-21 01:54:44.46	\N	2026-05-21 01:54:44.46	\N	f	\N
cmpevi4sk000404jpb5wnf1xy	cmpav8yfu000704l7kdsi9nkj	cmp6eetva000004l5ibt5lfdn	2026-05-21 02:30:08.984	\N	2026-05-21 02:30:08.984	\N	f	\N
cmpevi64i000104jros1eu6t8	cmpc092ja000104jpqz6ee86a	cmp6eetva000004l5ibt5lfdn	2026-05-21 02:30:10.707	\N	2026-05-21 02:30:10.707	\N	f	\N
cmpevi7rz000404jrfuqs6e71	cmpauwy88000504l7brbkrk7a	cmp6eetva000004l5ibt5lfdn	2026-05-21 02:30:12.85	\N	2026-05-21 02:30:12.85	\N	f	\N
cmpevi862000704jrhwc0xbwa	cmpawzous000004kwfacrrpdf	cmp6eetva000004l5ibt5lfdn	2026-05-21 02:30:13.334	\N	2026-05-21 02:30:13.334	\N	f	\N
cmpevib0y000004l2en3fj7ue	cmpchuyb6000004l8ak22lana	cmp6eetva000004l5ibt5lfdn	2026-05-21 02:30:17.077	\N	2026-05-21 02:30:17.077	\N	f	\N
cmpevicvj000704jppnwf0zqj	cmpaw9hap000604ic7noel0hz	cmp6eetva000004l5ibt5lfdn	2026-05-21 02:30:19.47	\N	2026-05-21 02:30:19.47	\N	f	\N
cmpevih0y000d04jr9fad6133	cmpdcpawm000004ji1xv7g6ra	cmp6eetva000004l5ibt5lfdn	2026-05-21 02:30:24.85	\N	2026-05-21 02:30:24.85	\N	f	\N
cmpevii6u000a04jptj38r7vd	cmpcfpyx4000504l2ub2vc5ae	cmp6eetva000004l5ibt5lfdn	2026-05-21 02:30:26.359	\N	2026-05-21 02:30:26.359	\N	f	\N
cmpf3orzd000304jlckui0cgg	cmpc2e7ss000004jmotm0s6l6	cmp6eetva000004l5ibt5lfdn	2026-05-21 06:19:15.912	\N	2026-05-21 06:19:15.912	\N	f	\N
cmpf4sz5i001i04jlp7qvz9jg	cmpc00slt000204ldi8ru8xiz	cmp6eetva000004l5ibt5lfdn	2026-05-21 06:50:31.442	\N	2026-05-21 06:50:31.442	\N	f	\N
cmpf5rphf000h04jv9amyp67c	cmpf5rfbl000004i8ujcbh2hd	cmp6eetva000004l5ibt5lfdn	2026-05-21 07:17:31.87	\N	2026-05-21 07:17:31.87	\N	f	\N
cmpfb201w000004jxurz4t5pr	cmpcfkuz6000204l2xll6kbnf	cmp6eetva000004l5ibt5lfdn	2026-05-21 09:45:30.213	\N	2026-05-21 09:45:30.213	\N	f	\N
cmpfb7nku000004jx6w3o01k2	cmpby32ba000304jm517sn0i2	cmp6eetva000004l5ibt5lfdn	2026-05-21 09:49:53.985	\N	2026-05-21 09:49:53.985	\N	f	\N
cmpdjzhbb000004jsqk9rm6vo	cmpdjyd2m000004l8a618xllh	cmp6eetva000004l5ibt5lfdn	2026-05-20 04:19:56.807	2026-05-21 09:51:32.548	2026-05-21 09:51:32.549	\N	f	\N
cmpfbak0k000904i506d7zs6o	cmpcj94wh000004l2n1xb9l80	cmp6eetva000004l5ibt5lfdn	2026-05-21 09:52:09.336	\N	2026-05-21 09:52:09.336	\N	f	\N
cmpfbalit000c04i5hf27gufc	cmpazdrk1000004i6qmdd98yv	cmp6eetva000004l5ibt5lfdn	2026-05-21 09:52:11.28	\N	2026-05-21 09:52:11.28	\N	f	\N
cmpfbawp8000404jx2f2n7k1e	cmpcc089w000004ldyubgbcht	cmp6eetva000004l5ibt5lfdn	2026-05-21 09:52:25.772	\N	2026-05-21 09:52:25.772	\N	f	\N
cmpfbd7it000104jpmwzp2qoi	cmpcf5vqi000004le2dq5l7sn	cmp6eetva000004l5ibt5lfdn	2026-05-21 09:54:13.109	\N	2026-05-21 09:54:13.109	\N	f	\N
cmpfobyzy000004lb3vecn4zl	cmpby2ke1000204jmtuusb6y5	cmp6eetva000004l5ibt5lfdn	2026-05-21 15:57:10.414	\N	2026-05-21 15:57:10.414	\N	f	\N
cmpg5nd0d000004l8fz0djc6v	cmpavuniy000004ic2scwt305	cmp6eetva000004l5ibt5lfdn	2026-05-22 00:01:55.261	\N	2026-05-22 00:01:55.261	\N	f	\N
cmpevi81x000604jr509qms90	cmpby3n1h000404jmxq5up352	cmp6eetva000004l5ibt5lfdn	2026-05-21 02:30:13.219	2026-05-22 00:44:47.583	2026-05-22 00:44:47.584	\N	f	\N
cmpfbch1h000304jxzdqixr8q	cmpbzwne4000004icd9d3mj9g	cmp6eetva000004l5ibt5lfdn	2026-05-21 09:53:38.785	2026-05-22 01:22:28.5	2026-05-22 01:22:28.501	\N	f	\N
cmpfacyax000704l4uqd9ffqv	cmpb17ttx000004l2le1aa3f4	cmp6eetva000004l5ibt5lfdn	2026-05-21 09:26:01.547	2026-05-22 04:39:03.691	2026-05-22 04:39:03.692	\N	f	\N
\.


--
-- TOC entry 3760 (class 0 OID 26035)
-- Dependencies: 238
-- Data for Name: point_histories; Type: TABLE DATA; Schema: public; Owner: postgres_lms
--

COPY public.point_histories (id, "userId", amount, reason, "createdAt") FROM stdin;
cmpex23ic000404jsayj7tqte	cmpdjyd2m000004l8a618xllh	100	Menyelesaikan kursus: Modul 1: Mengenal Kecerdasan Buatan (AI)	2026-05-21 03:13:40.164
cmpexh10s000404l1b36hca4s	cmpauwy88000504l7brbkrk7a	100	Menyelesaikan kursus: Modul 1: Mengenal Kecerdasan Buatan (AI)	2026-05-21 03:25:16.78
cmpexsyl1000a04l4npe4wgbj	cmpauwy88000504l7brbkrk7a	100	Menyelesaikan kursus: Modul 2: Etika dan Keamanan Penggunaan AI	2026-05-21 03:34:33.492
cmpexzioe000h04l4pj504mmg	cmpavwml8000104icnr5fi1j5	100	Menyelesaikan kursus: Modul 1: Mengenal Kecerdasan Buatan (AI)	2026-05-21 03:39:39.47
cmpeyu1at000404ldqgwq6ni7	cmpavzuvp000204ictsqhg7iy	100	Menyelesaikan kursus: Modul 1: Mengenal Kecerdasan Buatan (AI)	2026-05-21 04:03:23.285
cmpeyx716000q04l4i8141a1l	cmpeu0z8h000004jxdbm3yh50	100	Menyelesaikan kursus: Modul 1: Mengenal Kecerdasan Buatan (AI)	2026-05-21 04:05:50.682
cmpeyy1w7000c04ldk8gvsndu	cmpdjyd2m000004l8a618xllh	100	Menyelesaikan kursus: Modul 2: Etika dan Keamanan Penggunaan AI	2026-05-21 04:06:30.679
cmpeyy3z6000i04ldauzv4lg4	cmpavzuvp000204ictsqhg7iy	100	Menyelesaikan kursus: Modul 2: Etika dan Keamanan Penggunaan AI	2026-05-21 04:06:33.378
cmpeyyue7000o04ldpwsggybe	cmpeu0z8h000004jxdbm3yh50	100	Menyelesaikan kursus: Modul 2: Etika dan Keamanan Penggunaan AI	2026-05-21 04:07:07.615
cmpf38bxb000404kvcueybsu4	cmpavzuvp000204ictsqhg7iy	100	Menyelesaikan kursus: Modul 3: Dasar-Dasar Prompting	2026-05-21 06:06:28.703
cmpf3s8a4000b04jl09c3piwd	cmpc2e7ss000004jmotm0s6l6	100	Menyelesaikan kursus: Modul 1: Mengenal Kecerdasan Buatan (AI)	2026-05-21 06:21:57.1
cmpf3vttb000h04jlvlq7a033	cmpavwml8000104icnr5fi1j5	100	Menyelesaikan kursus: Modul 2: Etika dan Keamanan Penggunaan AI	2026-05-21 06:24:44.975
cmpf40yvv000d04kva4w1x52c	cmpc2e7ss000004jmotm0s6l6	100	Menyelesaikan kursus: Modul 2: Etika dan Keamanan Penggunaan AI	2026-05-21 06:28:44.827
cmpf4cmlc000q04jlxar315to	cmpauwy88000504l7brbkrk7a	100	Menyelesaikan kursus: Modul 3: Dasar-Dasar Prompting	2026-05-21 06:37:48.768
cmpf4q3up000904jomb11d82r	cmpc2e7ss000004jmotm0s6l6	100	Menyelesaikan kursus: Modul 3: Dasar-Dasar Prompting	2026-05-21 06:48:17.665
cmpf4qf05001404jlrzw9ofww	cmpdjyd2m000004l8a618xllh	100	Menyelesaikan kursus: Modul 3: Dasar-Dasar Prompting	2026-05-21 06:48:32.117
cmpf4qgex001904jlcvdp7zqf	cmpby3n1h000404jmxq5up352	100	Menyelesaikan kursus: Modul 1: Mengenal Kecerdasan Buatan (AI)	2026-05-21 06:48:33.945
cmpf4rj31001g04jlof5mxrqw	cmpby3n1h000404jmxq5up352	100	Menyelesaikan kursus: Modul 2: Etika dan Keamanan Penggunaan AI	2026-05-21 06:49:24.061
cmpf4w87z000604l1x3y6vj5k	cmpc00slt000204ldi8ru8xiz	100	Menyelesaikan kursus: Modul 1: Mengenal Kecerdasan Buatan (AI)	2026-05-21 06:53:03.263
cmpf5i4sm000r04jo864i8pyh	cmpcco602000004jszi4gyji2	100	Menyelesaikan kursus: Modul 1: Mengenal Kecerdasan Buatan (AI)	2026-05-21 07:10:05.254
cmpf5iz55000604jvsogcwv5o	cmpcco602000004jszi4gyji2	100	Menyelesaikan kursus: Modul 2: Etika dan Keamanan Penggunaan AI	2026-05-21 07:10:44.585
cmpf5tlv0000804juu3a4s7p5	cmpf5rfbl000004i8ujcbh2hd	100	Menyelesaikan kursus: Modul 1: Mengenal Kecerdasan Buatan (AI)	2026-05-21 07:19:00.588
cmpf5udu8000v04jvi5xiwkia	cmpf5rfbl000004i8ujcbh2hd	100	Menyelesaikan kursus: Modul 2: Etika dan Keamanan Penggunaan AI	2026-05-21 07:19:36.848
cmpf5w3y7000c04l6qw7zzxol	cmpavwml8000104icnr5fi1j5	100	Menyelesaikan kursus: Modul 3: Dasar-Dasar Prompting	2026-05-21 07:20:57.343
cmpf5ymto001104jvf2itbxfk	cmpf5rfbl000004i8ujcbh2hd	100	Menyelesaikan kursus: Modul 3: Dasar-Dasar Prompting	2026-05-21 07:22:55.116
cmpf5zxlp000c05kwjdy0tyum	cmpf5rfbl000004i8ujcbh2hd	100	Menyelesaikan kursus: Modul 4: The 4D Prompt Optimization Methodology	2026-05-21 07:23:55.741
cmpf60pl8000k05kwv7aaujzc	cmpf5rfbl000004i8ujcbh2hd	100	Menyelesaikan kursus: Modul 5: Aplikasi Praktis AI dalam Pekerjaan Sehari-Hari	2026-05-21 07:24:32.012
cmpf629dt000o04l6tzh9p9ck	cmpbzh465000004kzf90zix9b	100	Menyelesaikan kursus: Modul 1: Mengenal Kecerdasan Buatan (AI)	2026-05-21 07:25:44.321
cmpf6364o000w04l6clpu1ous	cmpbzh465000004kzf90zix9b	100	Menyelesaikan kursus: Modul 2: Etika dan Keamanan Penggunaan AI	2026-05-21 07:26:26.76
cmpf64uw3000x05kwokcepurn	cmpbzh465000004kzf90zix9b	100	Menyelesaikan kursus: Modul 3: Dasar-Dasar Prompting	2026-05-21 07:27:45.507
cmpf69ewo000r04jueieu0tgb	cmpcco602000004jszi4gyji2	100	Menyelesaikan kursus: Modul 3: Dasar-Dasar Prompting	2026-05-21 07:31:18.072
cmpf6axpq001504l6t9cje50l	cmpcco602000004jszi4gyji2	100	Menyelesaikan kursus: Modul 4: The 4D Prompt Optimization Methodology	2026-05-21 07:32:29.102
cmpf6cn6x000z04ju6kcwu7sn	cmpcco602000004jszi4gyji2	100	Menyelesaikan kursus: Modul 5: Aplikasi Praktis AI dalam Pekerjaan Sehari-Hari	2026-05-21 07:33:48.777
cmpf71rui001e04l6y1vp2onw	cmpavwml8000104icnr5fi1j5	100	Menyelesaikan kursus: Modul 4: The 4D Prompt Optimization Methodology	2026-05-21 07:53:21.21
cmpf86f70000404kwd7czns9m	cmpauwy88000504l7brbkrk7a	100	Menyelesaikan kursus: Modul 4: The 4D Prompt Optimization Methodology	2026-05-21 08:24:57.708
cmpfa2l4t000404kzfc4ska0n	cmpdjyd2m000004l8a618xllh	100	Menyelesaikan kursus: Modul 4: The 4D Prompt Optimization Methodology	2026-05-21 09:17:58.013
cmpfb80ta000304icp98x6401	cmpauwy88000504l7brbkrk7a	100	Menyelesaikan kursus: Modul 5: Aplikasi Praktis AI dalam Pekerjaan Sehari-Hari	2026-05-21 09:50:11.23
cmpfb9t9g000704i5w4qp0c0h	cmpdjyd2m000004l8a618xllh	100	Menyelesaikan kursus: Modul 5: Aplikasi Praktis AI dalam Pekerjaan Sehari-Hari	2026-05-21 09:51:34.756
cmpflr3gs000604l123m8h6qw	cmpcj94wh000004l2n1xb9l80	100	Menyelesaikan kursus: Modul 1: Mengenal Kecerdasan Buatan (AI)	2026-05-21 14:44:57.292
cmpfm9w84000404jpnoqk5hl3	cmpcj94wh000004l2n1xb9l80	100	Menyelesaikan kursus: Modul 2: Etika dan Keamanan Penggunaan AI	2026-05-21 14:59:34.372
cmpg66fbp000504icdr3l2x7w	cmpavuniy000004ic2scwt305	100	Menyelesaikan kursus: Modul 1: Mengenal Kecerdasan Buatan (AI)	2026-05-22 00:16:44.821
cmpg6e2l8000604kz3olw6nay	cmpavuniy000004ic2scwt305	100	Menyelesaikan kursus: Modul 2: Etika dan Keamanan Penggunaan AI	2026-05-22 00:22:41.564
cmpg6hneo000404l5heuy8agd	cmpavuniy000004ic2scwt305	100	Menyelesaikan kursus: Modul 3: Dasar-Dasar Prompting	2026-05-22 00:25:28.512
cmpg6inwa000c04l59elyhnwu	cmpavuniy000004ic2scwt305	100	Menyelesaikan kursus: Modul 4: The 4D Prompt Optimization Methodology	2026-05-22 00:26:15.802
cmpg6pe8t000i04l5gnuk506o	cmpavuniy000004ic2scwt305	100	Menyelesaikan kursus: Modul 5: Aplikasi Praktis AI dalam Pekerjaan Sehari-Hari	2026-05-22 00:31:29.885
cmpg74ds6000704jp39onwj3k	cmpby3n1h000404jmxq5up352	100	Menyelesaikan kursus: Modul 3: Dasar-Dasar Prompting	2026-05-22 00:43:09.126
cmpg75o6s000704jpdatl4fk6	cmpby3n1h000404jmxq5up352	100	Menyelesaikan kursus: Modul 4: The 4D Prompt Optimization Methodology	2026-05-22 00:44:09.268
cmpg76jf9000g04jpi312c0v0	cmpby3n1h000404jmxq5up352	100	Menyelesaikan kursus: Modul 5: Aplikasi Praktis AI dalam Pekerjaan Sehari-Hari	2026-05-22 00:44:49.749
cmpg80r6g000604l83p500imk	cmpby32ba000304jm517sn0i2	100	Menyelesaikan kursus: Modul 1: Mengenal Kecerdasan Buatan (AI)	2026-05-22 01:08:19.48
cmpg81kta000704lauh617bzi	cmpby32ba000304jm517sn0i2	100	Menyelesaikan kursus: Modul 2: Etika dan Keamanan Penggunaan AI	2026-05-22 01:08:57.886
cmpg82h33000a04jpy3aizt8g	cmpby32ba000304jm517sn0i2	100	Menyelesaikan kursus: Modul 3: Dasar-Dasar Prompting	2026-05-22 01:09:39.711
cmpg8fh8i000504l7a6mpgkwa	cmpbzwne4000004icd9d3mj9g	100	Menyelesaikan kursus: Modul 1: Mengenal Kecerdasan Buatan (AI)	2026-05-22 01:19:46.434
cmpg8gjag000k04jph3wmvd6g	cmpbzwne4000004icd9d3mj9g	100	Menyelesaikan kursus: Modul 2: Etika dan Keamanan Penggunaan AI	2026-05-22 01:20:35.752
cmpg8h9da000a04l2age8bvqc	cmpbzwne4000004icd9d3mj9g	100	Menyelesaikan kursus: Modul 3: Dasar-Dasar Prompting	2026-05-22 01:21:09.55
cmpg8i8n1000f04l7p310mqhm	cmpbzwne4000004icd9d3mj9g	100	Menyelesaikan kursus: Modul 4: The 4D Prompt Optimization Methodology	2026-05-22 01:21:55.261
cmpg8izy4000i04l8uoz9he11	cmpbzwne4000004icd9d3mj9g	100	Menyelesaikan kursus: Modul 5: Aplikasi Praktis AI dalam Pekerjaan Sehari-Hari	2026-05-22 01:22:30.652
cmpgffrys000604jslhqw9i8g	cmpb17ttx000004l2le1aa3f4	100	Menyelesaikan kursus: Modul 1: Mengenal Kecerdasan Buatan (AI)	2026-05-22 04:35:57.652
cmpgfgqsu000904lblfygbfar	cmpb17ttx000004l2le1aa3f4	100	Menyelesaikan kursus: Modul 2: Etika dan Keamanan Penggunaan AI	2026-05-22 04:36:42.798
cmpgfhebz000804kzi9zl4ink	cmpb17ttx000004l2le1aa3f4	100	Menyelesaikan kursus: Modul 3: Dasar-Dasar Prompting	2026-05-22 04:37:13.295
cmpgfj2r3000f04jsa6mzrye3	cmpb17ttx000004l2le1aa3f4	100	Menyelesaikan kursus: Modul 4: The 4D Prompt Optimization Methodology	2026-05-22 04:38:31.599
cmpgfjtbh000k04kzjgi2j9z7	cmpb17ttx000004l2le1aa3f4	100	Menyelesaikan kursus: Modul 5: Aplikasi Praktis AI dalam Pekerjaan Sehari-Hari	2026-05-22 04:39:06.029
cmq60j7um000504jvgoqvqy1i	cmpcfpyx4000504l2ub2vc5ae	100	Menyelesaikan kursus: Modul 1: Mengenal Kecerdasan Buatan (AI)	2026-06-09 02:20:44.542
cmq6d5prl000404jvhb9noxqf	cmpcfpyx4000504l2ub2vc5ae	100	Menyelesaikan kursus: Modul 2: Etika dan Keamanan Penggunaan AI	2026-06-09 08:14:09.585
\.


--
-- TOC entry 3751 (class 0 OID 25859)
-- Dependencies: 229
-- Data for Name: question_options; Type: TABLE DATA; Schema: public; Owner: postgres_lms
--

COPY public.question_options (id, "questionId", text, "isCorrect", "order") FROM stdin;
cmq4tmykc000204ilyzwprjtu	cmq4tmyhl000104ilywhv9t0s	ChatGPT standar	f	0
cmq4tmykc000304il4y03jni1	cmq4tmyhl000104ilywhv9t0s	Claude standar	f	1
cmq4tmykc000404ilxtfsc8bz	cmq4tmyhl000104ilywhv9t0s	Perplexity AI	t	2
cmq4tmykc000504il5zkbx8zr	cmq4tmyhl000104ilywhv9t0s	DALL-E	f	3
\.


--
-- TOC entry 3750 (class 0 OID 25849)
-- Dependencies: 228
-- Data for Name: questions; Type: TABLE DATA; Schema: public; Owner: postgres_lms
--

COPY public.questions (id, "quizId", type, text, points, "order", "createdAt", "updatedAt", "allowedFileTypes", "maxFileCount", "maxFileSizeMB", "uploadInstructions") FROM stdin;
cmq4tlxqw000004ilosj7t1xk	cmq4tl14q000004lixd6rkudg	ESSAY	Sebutkan 3 kategori AI tools berdasarkan fungsinya dan berikan 1 contoh tool untuk masing-masing kategori	1	0	2026-06-08 06:19:07.928	2026-06-08 06:19:07.928	\N	1	\N	\N
cmq4tmyhl000104ilywhv9t0s	cmq4tl14q000004lixd6rkudg	MULTIPLE_CHOICE	Tool mana yang paling cocok untuk pencarian fakta dengan referensi yang bisa diverifikasi?	1	1	2026-06-08 06:19:55.449	2026-06-08 06:19:55.449	\N	1	\N	\N
\.


--
-- TOC entry 3752 (class 0 OID 25868)
-- Dependencies: 230
-- Data for Name: quiz_attempts; Type: TABLE DATA; Schema: public; Owner: postgres_lms
--

COPY public.quiz_attempts (id, "quizId", "enrollmentId", score, passed, "startedAt", "submittedAt") FROM stdin;
\.


--
-- TOC entry 3749 (class 0 OID 25837)
-- Dependencies: 227
-- Data for Name: quizzes; Type: TABLE DATA; Schema: public; Owner: postgres_lms
--

COPY public.quizzes (id, "courseId", title, description, "passingScore", duration, "maxAttempts", "shuffleQuestions", "showResult", "createdAt", "updatedAt", "order") FROM stdin;
cmq4tl14q000004lixd6rkudg	cmp6h8i5g000004jsg0sqon65	Kuis Akhir Section 1	\N	75	\N	1	f	t	2026-06-08 06:18:25.658	2026-06-08 06:18:32.117	1
\.


--
-- TOC entry 3740 (class 0 OID 25624)
-- Dependencies: 218
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres_lms
--

COPY public.sessions (id, "sessionToken", "userId", expires) FROM stdin;
\.


--
-- TOC entry 3759 (class 0 OID 26026)
-- Dependencies: 237
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: postgres_lms
--

COPY public.settings (id, key, value, description, "updatedAt") FROM stdin;
\.


--
-- TOC entry 3761 (class 0 OID 27012)
-- Dependencies: 239
-- Data for Name: training_courses; Type: TABLE DATA; Schema: public; Owner: postgres_lms
--

COPY public.training_courses (id, "trainingId", "courseId", "accessDurationInDays", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 3747 (class 0 OID 25788)
-- Dependencies: 225
-- Data for Name: training_registrations; Type: TABLE DATA; Schema: public; Owner: postgres_lms
--

COPY public.training_registrations (id, "userId", "trainingId", status, "registeredAt", "updatedAt", "dueDate", "isMandatory", "startDate") FROM stdin;
\.


--
-- TOC entry 3746 (class 0 OID 25779)
-- Dependencies: 224
-- Data for Name: trainings; Type: TABLE DATA; Schema: public; Owner: postgres_lms
--

COPY public.trainings (id, title, description, type, status, "startDate", "endDate", location, "onlineUrl", capacity, cover, "creatorId", "createdAt", "updatedAt", price, "promoPrice", visibility) FROM stdin;
\.


--
-- TOC entry 3738 (class 0 OID 25607)
-- Dependencies: 216
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres_lms
--

COPY public.users (id, name, email, password, role, department, "position", avatar, "isActive", "emailVerified", "createdAt", "updatedAt", points, "joinYear", nik) FROM stdin;
admin_4b0bb3106fe9207a83a7	Super Admin	admin@lms.com	$2b$10$CUvMMytFCN83t7h3bmtI2en8s6RZD/Uo27TaXCPLWl8hF/533PPwO	SUPER_ADMIN	\N	\N	\N	t	\N	2026-05-14 06:28:19.751	2026-05-14 06:32:54.026	0	\N	\N
cmp6e3upk000004l79aodzzpi	Muhammad Firmansyah	muhammad.firmansyah@vascomm.co.id	$2b$12$ZYLoH76rpErPizh5b1kXdO1XtvsO4fEetq9EfZXDchSM1a9CxyV5G	MENTOR	\N	\N	\N	t	\N	2026-05-15 04:00:59.96	2026-05-15 04:07:47.904	0	\N	\N
cmpaumhrq000004l7av3fbec8	RENALDY GATAN PRAMANA	renaldygatan@gmail.com	$2b$12$Z7NpwSiXwiyTOt4DhWPP7uzqBA6B6u7Jxzf4OTy1g4zfHbJCQJlFK	CUSTOMER	\N	\N	\N	t	\N	2026-05-18 06:54:28.214	2026-05-18 06:54:28.214	0	\N	\N
cmpausi7q000104l7v1hv1aw4	Adlian Ramadhan	adlianariluthfi12@gmail.com	$2b$12$QHT6b3oMeg.MoH.WeSrVR.ZjMdnBwgqKlkYY8WzNJt2TvIKBiM9Im	CUSTOMER	\N	\N	\N	t	\N	2026-05-18 06:59:08.726	2026-05-18 06:59:08.726	0	\N	\N
cmpaut6x0000204l7sl1hryal	Pramudia Angga Prahasta	sanggaangga77@gmail.com	$2b$12$WnmuSo0lLWTZR1aYSNwDFutT3rct.6JfzVpe/qq9NG3QRMIEUjlii	CUSTOMER	\N	\N	\N	t	\N	2026-05-18 06:59:40.74	2026-05-18 06:59:40.74	0	\N	\N
cmpauvj0t000304l7mqp87iu8	Sukma Puspaning Maharupi	sukmahmaharupi@gmail.com	$2b$12$.jx714H2TnPBXB33XNKtnetJWNsxuPGyRKIF8bN2qmZgxFyeMsQ42	CUSTOMER	\N	\N	\N	t	\N	2026-05-18 07:01:29.741	2026-05-18 07:01:29.741	0	\N	\N
cmpauvmu7000404l71nuwe5ds	Muh Aunu Rofiq	aunu.rofiq08@gmail.com	$2b$12$HPCfnlci5wSU.480/J5hpeKKAWqj4E5angvRAle67LoNgnPc2LP5W	CUSTOMER	\N	\N	\N	t	\N	2026-05-18 07:01:34.687	2026-05-18 07:01:34.687	0	\N	\N
cmpav59hf000604l7c81tcazm	Qorni Tauziri	qornitauziri1@gmail.com	$2b$12$Sf54Z3fPaPm9fpfbINlvceItmWOL1XyBUue7cpCvJzhxnaXI0eh82	CUSTOMER	\N	\N	\N	t	\N	2026-05-18 07:09:03.939	2026-05-18 07:09:03.939	0	\N	\N
cmpav8yfu000704l7kdsi9nkj	Aminatuz Zuhriyah	aminatuz@vascomm.co.id	$2b$12$AmhvyJMm9oxNyo.1Pq81AuV988e36sKjbGFEaEasbW9SxLeRZnqsy	CUSTOMER	\N	\N	\N	t	\N	2026-05-18 07:11:56.25	2026-05-18 07:11:56.25	0	\N	\N
cmpaw5vkt000304icggu9yyla	Muhamamd Tesyar Ramadhan	mtesyar98@gmail.com	$2b$12$DK1LQISCVkA0D1zto9/02uCLYhin2LQus1mvw9ErK.xWPhNwRmt0G	CUSTOMER	\N	\N	\N	t	\N	2026-05-18 07:37:32.189	2026-05-18 07:37:32.189	0	\N	\N
cmpaw8e6v000504ic6cnmv2nx	Pramudia Angga Prahasta	pramudia@vascomm.co.id	$2b$12$T77W5uaD6tsDnRaR/hkXqOhiv5ZtZbzvqHVFeJBd4G1KIwKRPXekG	CUSTOMER	\N	\N	\N	t	\N	2026-05-18 07:39:29.623	2026-05-18 07:39:29.623	0	\N	\N
cmpaw9hap000604ic7noel0hz	Muhammad Afifudin	m.afifudin@vascomm.co.id	$2b$12$G4UqW5AIEi9VsyzPKPGW8OJ7ezdkzsYUBr8z612h9fA4in/H.uGve	CUSTOMER	\N	\N	\N	t	\N	2026-05-18 07:40:20.305	2026-05-18 07:40:20.305	0	\N	\N
cmpawzous000004kwfacrrpdf	Renaldy Gatan	renaldy.gatan.p@vascomm.co.id	$2b$12$0ST5pPVKY/GUW8qZQq1f3OzlUMovB.bDIE8pomLxR5QM2VkyHFe6.	CUSTOMER	\N	\N	\N	t	\N	2026-05-18 08:00:43.156	2026-05-18 08:00:43.156	0	\N	\N
cmpazdrk1000004i6qmdd98yv	Sarah Muyassaroh	sarahmuyassaroh@vascomm.co.id	$2b$12$A95tvesAAofVJ49CkaUXPuIryEnLksUJ4ZXGpoYOXz29utCmw6bS.	CUSTOMER	\N	\N	\N	t	\N	2026-05-18 09:07:39.073	2026-05-18 09:07:39.073	0	\N	\N
cmpb0s9mt000004kzo9hiiosn	Ary Sulistiyo Rini	vascommpayrolltax@gmail.com	$2b$12$2qqfx3fUMZ2/jOeD1WpTrej5ekIfFNmbFpeAuDm17jomQxcPA.6L2	CUSTOMER	\N	\N	\N	t	\N	2026-05-18 09:46:55.301	2026-05-18 09:46:55.301	0	\N	\N
cmpb1vq75000004l26tew64mn	Alif Nur Rahman	alief.nurrahman94@gmail.com	$2b$12$5J5o3bQeZpYwXdeJ9Yqxi.eHdPbcGCYejSifRBgCIyYR.s2zGtlJ6	CUSTOMER	\N	\N	\N	t	\N	2026-05-18 10:17:36.353	2026-05-18 10:17:36.353	0	\N	\N
cmpb1zznj000004jikc41dljj	Alif Nur Rahman	alif@vascomm.co.id	$2b$12$xkkdqQe8nhXvWuQb1YIDOeW365q.rqKeX22keqbjb7GD/C8tsm/hC	CUSTOMER	\N	\N	\N	t	\N	2026-05-18 10:20:55.231	2026-05-18 10:20:55.231	0	\N	\N
cmpbxkas5000004kwyi3amld2	KURNIAWAN RAMADHAN JAYA PURNOMO	ramadhanjpp@gmail.com	$2b$12$8ACl0Hqiz/beQpfGpOzzQuAdrf4zKt3PxfDlBfwCGNb3TyERyv/6y	CUSTOMER	\N	\N	\N	t	\N	2026-05-19 01:04:30.869	2026-05-19 01:04:30.869	0	\N	\N
cmpbxn05j000104kw8ux2fto2	KURNIAWAN RAMADHAN JAYA PURNOMO	rama@vascomm.co.id	$2b$12$pNnhGYWD04fgixbNEFbUQuWOagahOnm34mugO0ksptVu5U5N542H6	CUSTOMER	\N	\N	\N	t	\N	2026-05-19 01:06:37.062	2026-05-19 01:06:37.062	0	\N	\N
cmpbxymjb000004jm1rsc3tzu	Amalia	amalia21198@gmail.com	$2b$12$WRGT1MccSPUCwT2Y9UXg8efAeizGZSBbxLGe9LTnTGDMTv28MWDF6	CUSTOMER	\N	\N	\N	t	\N	2026-05-19 01:15:39.287	2026-05-19 01:15:39.287	0	\N	\N
cmpby05g3000104jmog03u0qd	Ian Ahmad P	ianahmad@vascomm.co.id	$2b$12$rnGzQoKEnHIwZjPmHRV2Ze7R44USTLaPVUn8leIFHzYDkD8R/EW42	CUSTOMER	\N	\N	\N	t	\N	2026-05-19 01:16:50.451	2026-05-19 01:16:50.451	0	\N	\N
cmpby2ke1000204jmtuusb6y5	Muhammad Anang Ma'ruf	anang.maruf@vascomm.co.id	$2b$12$vWtxfbZ0xyKrcrRi1c5xBOk18U7o3EJcUrxpNwaFYdJay9QA69X3S	CUSTOMER	\N	\N	\N	t	\N	2026-05-19 01:18:43.129	2026-05-19 01:18:43.129	0	\N	\N
cmpbzy5wr000004ldlmccfnm6	Mohammad Wahyu Kurniawan	wahyu.kurniawan@vascomm.co.id	$2b$12$ugBzTxJvfeQjau/zc.6QbOgVUSnRVq6vodlO6xSpbgEEVUCtK3pnG	CUSTOMER	\N	\N	\N	t	\N	2026-05-19 02:11:16.971	2026-05-19 02:11:16.971	0	\N	\N
cmpbzzm36000104ldwywwtgcm	Afif musyayyidin	musyayyidin.afif@vascomm.co.id	$2b$12$zQJTT9JqMD06D56xVvKOxOaEOWXf4uVQQRrGjbFVTDI78OkSanuu6	CUSTOMER	\N	\N	\N	t	\N	2026-05-19 02:12:24.594	2026-05-19 02:12:24.594	0	\N	\N
cmpc083os000004jp9uez3ly5	Alvian Ardhiansyah	alvian.ardhiansyah@gmail.com	$2b$12$XeiLU7NnA0IcI7FfzCNSY.Jg0CIY.xisuuj8RU2JwNtuQtgmx4QPS	CUSTOMER	\N	\N	\N	t	\N	2026-05-19 02:19:00.652	2026-05-19 02:19:00.652	0	\N	\N
cmpc092ja000104jpqz6ee86a	Alvian Ardhiansyah	alvian@vascomm.co.id	$2b$12$V6UpePlUIQv/vzb4ve1lcemLKw6RDhfnVwHF5bRpKwj6sqq0FgwX.	CUSTOMER	\N	\N	\N	t	\N	2026-05-19 02:19:45.814	2026-05-19 02:19:45.814	0	\N	\N
cmpc2v5o1000004i6pp23zoka	Farrel agung dewanto	fdfarrel23@gmail.com	$2b$12$rE5xyjp1Mq1KiZ5JnB5SL.EEF5prvYcVpZZaXnsWAGMWs5xet1iKu	CUSTOMER	\N	\N	\N	t	\N	2026-05-19 03:32:55.537	2026-05-19 03:32:55.537	0	\N	\N
cmpc2w7fb000004l2d0xi8bsc	Farrel agung dewanto	farrel@vascomm.co.id	$2b$12$JY0LTaJoqCadksvSWhxCq.m/pOdNUBgvwKYG2WRFcvegphviNE3Cq	CUSTOMER	\N	\N	\N	t	\N	2026-05-19 03:33:44.471	2026-05-19 03:33:44.471	0	\N	\N
cmpc00slt000204ldi8ru8xiz	Yusril Bagas	yusril.bp@vascomm.co.id	$2b$12$l7retTr9tb83KogLiyimJOvZWpMBxbbJNGDNoiEm3rEcLhV/nshyi	CUSTOMER	\N	\N	\N	t	\N	2026-05-19 02:13:19.697	2026-05-21 06:53:03.367	100	\N	\N
cmpc2e7ss000004jmotm0s6l6	Jalu Bamara Harlambang	jalu.bamara@vascomm.co.id	$2b$12$pavajcVx3C4kFyoHG16bKO2fRwrDWxZmZ3UcQ9FuAPV1JSuX3wOhS	CUSTOMER	\N	\N	\N	t	\N	2026-05-19 03:19:45.148	2026-05-21 06:48:17.767	300	\N	\N
cmpavzuvp000204ictsqhg7iy	Andri Setya Hermawan	andri.setya@vascomm.co.id	$2b$12$7/Pugou68JZFs.itr97qk.2vyf1HiA/hkhTvFBfISgbAtEANB61W2	CUSTOMER	\N	\N	\N	t	\N	2026-05-18 07:32:51.349	2026-05-21 06:06:28.8	300	\N	\N
cmpauwy88000504l7brbkrk7a	Alif Setyakurniawan	alif.sa@vascomm.co.id	$2b$12$XjNJk.Oz06j4QbJ45f1AA.CY3dWf9DSjqUwQRgXIYoPNZF6bP.752	CUSTOMER	\N	\N	\N	t	\N	2026-05-18 07:02:36.104	2026-05-21 09:50:11.331	500	\N	\N
cmpbzh465000004kzf90zix9b	Randyka Rusniantoro	randyka@vascomm.co.id	$2b$12$Mi//8YiK93f/edMFGYiGbuRhDdkB5zVLEloD/4QcCulo.D/TAHEJy	CUSTOMER	\N	\N	\N	t	\N	2026-05-19 01:58:01.565	2026-05-21 07:27:45.605	300	\N	\N
cmpby32ba000304jm517sn0i2	Qolbu Dzikru	qolbu.dr@vascomm.co.id	$2b$12$Ak1yfrIVr67zZU9RHO5eZeuzlItry94Jx7xf5aIWHOCZjE0wSBeae	CUSTOMER	\N	\N	\N	t	\N	2026-05-19 01:19:06.358	2026-05-22 01:09:39.814	300	\N	\N
cmpavuniy000004ic2scwt305	Adlian Ramadhan	adlian@vascomm.co.id	$2b$12$nIsMD9nniR4GJZqolPkY/.Ducigj1mU35mZwHtCkD2rr4C.Um6cX6	CUSTOMER	\N	\N	\N	t	\N	2026-05-18 07:28:48.538	2026-05-22 00:31:29.978	500	\N	\N
cmpavwml8000104icnr5fi1j5	Sukma Puspaning Maharupi	sukma@vascomm.co.id	$2b$12$TFoiwknPGfhHiwWSIEGQAuh0QH8VJOaS29P9aVQz3cwI9OqH/flwy	CUSTOMER	\N	\N	\N	t	\N	2026-05-18 07:30:20.636	2026-05-21 07:53:21.309	400	\N	\N
cmpby3n1h000404jmxq5up352	Amalia	amalia@vascomm.co.id	$2b$12$S8Fs8xjAEE6VpJDKPDwHy.Qz1l65lQQyBOPm.s3TpiiDS88zUj38S	CUSTOMER	\N	\N	\N	t	\N	2026-05-19 01:19:33.221	2026-05-22 00:44:49.847	500	\N	\N
cmpbzwne4000004icd9d3mj9g	Ginanjar Tegar Sanjaya	anjar@vascomm.co.id	$2b$12$vDNAI6vCsLhlJGmR1kpiLOfin3RVOMgEi4bNFTld0CUetEqkwn4iK	CUSTOMER	\N	\N	\N	t	\N	2026-05-19 02:10:06.315	2026-05-22 01:22:30.749	500	\N	\N
cmpb17ttx000004l2le1aa3f4	QORNI TAUZIRI	qornitzr@vascomm.co.id	$2b$12$7GNQyPhugidlwtMMZnCBRevG5NFJCliZpnQ0XhlqBqxQpZrN5ksUe	CUSTOMER	\N	\N	\N	t	\N	2026-05-18 09:59:01.317	2026-05-22 04:39:06.132	500	\N	\N
cmpc4onl7000004l8ie1pimyv	Abdul Hafizh	abdulhafizh140701@gmail.com	$2b$12$/ypZg8ZEf8tLFaVjoFMZROGHcp2Xk9vvXwqTlmBSj6Gl5SW91FqbW	CUSTOMER	\N	\N	\N	t	\N	2026-05-19 04:23:51.403	2026-05-19 04:23:51.403	0	\N	\N
cmpc9anh7000004legzhel7oa	Bagus Baskoro	bagusbg@vascomm.co.id	$2b$12$gQVXCFYYtVsmQ8OW/0hFIuuCsskmFXLDVZJy1WNB5XPnJ0jc8Dv7i	CUSTOMER	\N	\N	\N	t	\N	2026-05-19 06:32:56.154	2026-05-19 06:32:56.154	0	\N	\N
cmpcc089w000004ldyubgbcht	Nanda Yudha Kawira	nandayudha@vascomm.co.id	$2b$12$YylMRxex3Sv1HVJMMcaOs.1tM3QAKTJn4dcMAg8/z/IAGbAnf0a2.	CUSTOMER	\N	\N	\N	t	\N	2026-05-19 07:48:48.74	2026-05-19 07:48:48.74	0	\N	\N
cmpcc8kjf000004jlowe59g6l	NOVITA SARI	ovi@vascomm.co.id	$2b$12$wgmIE.cUUfOjk4zQdznkzOyMaXHMYXGNx8puZz3N4iMy8bI9gOUfC	CUSTOMER	\N	\N	\N	t	\N	2026-05-19 07:55:17.883	2026-05-19 07:55:17.883	0	\N	\N
cmpcd2iqj000004ie0trkdkek	Alifia Rizkiana	alfia@vascomm.co.id	$2b$12$r88a3t/uKz8cTXnD1G9Sf.znqj01HI7P3pc60kERgKA50Pn.4akmO	CUSTOMER	\N	\N	\N	t	\N	2026-05-19 08:18:35.227	2026-05-19 08:18:35.227	0	\N	\N
cmpcf4e5z000004l76b1audhb	Anjumi Kholifatu Rahmatika	gamibyy@gmail.com	$2b$12$YFsELb1XKuw9CImqVuyqwecZRniie3i5Iw9zsVsyRWAnOx9bQgFMi	CUSTOMER	\N	\N	\N	t	\N	2026-05-19 09:16:01.847	2026-05-19 09:16:01.847	0	\N	\N
cmpcf5vqi000004le2dq5l7sn	Anjumi Kholifatu Rahmatika	anjumi.k@vascomm.co.id	$2b$12$ldfefElzo2sBjCjOpQuEA.zYrqnIWK49IehJ3g1okEU6Li1ApszEe	CUSTOMER	\N	\N	\N	t	\N	2026-05-19 09:17:11.274	2026-05-19 09:17:11.274	0	\N	\N
cmpcf8423000104le1xk4s30x	Fathurrachman Saputro Wiratama	putrawitama@vascomm.co.id	$2b$12$c9g2Qhf3Cmcx8xv7TlUeYOzFrjBGXyaHFDmtCSbQbaT9cPnVXYb62	CUSTOMER	\N	\N	\N	t	\N	2026-05-19 09:18:55.371	2026-05-19 09:18:55.371	0	\N	\N
cmpcfgbz6000004kzulxdvrrv	Muhammad Rifqy Pratama	muhammad.rifqy.a@vascomm.co.id	$2b$12$ag0VXoBoXoz1BRHMcAn5k.AoNcp24BVgnBFEfMTmVYrVvPK9bkWGe	CUSTOMER	\N	\N	\N	t	\N	2026-05-19 09:25:18.882	2026-05-19 09:25:18.882	0	\N	\N
cmpcfh17m000004l2z499gfhl	Hendrik Reinhard	hendrik@vascomm.co.id	$2b$12$0dUQNYwDIvGv6rhJnjfOs.nfRI.pXTyCfTk1y23CvIqwlIkszUisa	CUSTOMER	\N	\N	\N	t	\N	2026-05-19 09:25:51.586	2026-05-19 09:25:51.586	0	\N	\N
cmpcfjwci000104l2fi3dlihn	Bella Norma Audina	bella.norma@vascomm.co.id	$2b$12$JTaBwt5UCuT/v8.UK6LgaudCaFdhs/gGbjRW.Q8RRun6.TFDEoqDe	CUSTOMER	\N	\N	\N	t	\N	2026-05-19 09:28:05.25	2026-05-19 09:28:05.25	0	\N	\N
cmpcfkuz6000204l2xll6kbnf	Ratnayu Damayanti	ratnayu.damayanti@gmail.com	$2b$12$T06RutZukUw9pWyoPW2OkODIhprMCNpnrmocM7wwuBJh97qc0f8EK	CUSTOMER	\N	\N	\N	t	\N	2026-05-19 09:28:50.13	2026-05-19 09:28:50.13	0	\N	\N
cmpcfn5p2000304l2wldzy5n7	Yosi Ekayanti Tanjung	yosiekayantitanjung@gmail.com	$2b$12$EF8UCHxlB/X113s3YPdxx.vtbVFwnGZvKDGvG6qN6.sOTlMe7JHRy	CUSTOMER	\N	\N	\N	t	\N	2026-05-19 09:30:37.334	2026-05-19 09:30:37.334	0	\N	\N
cmpcfoq9i000404l2u8oqhn9n	Khoirul Anwar	irul.anwar69@gmail.com	$2b$12$kRdyAWAwp833PbBrT25txOWliDDgi0heheW3IekofhXk9sA9OrMAm	CUSTOMER	\N	\N	\N	t	\N	2026-05-19 09:31:50.646	2026-05-19 09:31:50.646	0	\N	\N
cmpcfqtnb000604l2mfb3vvi8	Yosi Ekayanti Tanjung	yosi.tanjung@vascomm.co.id	$2b$12$j2Y.SahH6EeazoTArDPIp.A95anTcCYuMzm2.Nahvjb1c66Fph/he	CUSTOMER	\N	\N	\N	t	\N	2026-05-19 09:33:28.343	2026-05-19 09:33:28.343	0	\N	\N
cmpcfs29g000704l28568cgph	Muhammad Areqson Hertin	areqson@vascomm.co.id	$2b$12$/TLsgTYATswzoVJgh6oLK.11EAXS2Z6nQwWtckJeieihs/oFYv8Vq	CUSTOMER	\N	\N	\N	t	\N	2026-05-19 09:34:26.164	2026-05-19 09:34:26.164	0	\N	\N
cmpcfyntx000004jrisq3kyxy	Khoirul Anwar	khoirul@vascomm.co.id	$2b$12$EA8FNyvYJvNtZjyqcdLOUu1AlCsVPDyPx1QUEvw3dbVErWuDd3PA.	CUSTOMER	\N	\N	\N	t	\N	2026-05-19 09:39:34.053	2026-05-19 09:39:34.053	0	\N	\N
cmpcgiks0000004jybht743ng	Ary Sulistiyo Rini	ary.sulistiyo.rini@gmail.com	$2b$12$SllyDnrRHnkR.PlAddd.5eGvZOhXM3mksILrc958ny66jBvpQEY4e	CUSTOMER	\N	\N	\N	t	\N	2026-05-19 09:55:03.216	2026-05-19 09:55:03.216	0	\N	\N
cmpchuyb6000004l8ak22lana	RIZKY JR	rizky-jelang@vascomm.co.id	$2b$12$a2p.SbMtXbf2DwafodVGzuUzJspJtHpPSNw5/rK/vgELOYSTOR2aC	CUSTOMER	\N	\N	\N	t	\N	2026-05-19 10:32:40.241	2026-05-19 10:32:40.241	0	\N	\N
cmpcrji99000004l43nephxpi	Nyamin	sbynyamin@gmail.com	$2b$12$a8K4be5v9uRjV0ubK55NLu0/usdVWRWw9wwqpHIwPUM3oCMO8PJDq	CUSTOMER	\N	\N	\N	t	\N	2026-05-19 15:03:42.381	2026-05-19 15:03:42.381	0	\N	\N
cmpdcpawm000004ji1xv7g6ra	Langlang Prameswara	langlangg29prameswara@gmail.com	$2b$12$0.m7jMsmowcHXg9Kh/1gIeIkg8Z5BazQ/Fk57vvub.k8YQDqQ.76.	CUSTOMER	\N	\N	\N	t	\N	2026-05-20 00:56:04.726	2026-05-20 00:56:04.726	0	\N	\N
cmpdqqcky000004jvj4z49avf	Deni Alfino	denialfino12@gmail.com	$2b$12$xFhGVNY2SUSOhUpnT4sLWuQYLFLQoSYY7DPnTntol6oFj4VnKFLDi	CUSTOMER	\N	\N	\N	t	\N	2026-05-20 07:28:48.178	2026-05-20 07:28:48.178	0	\N	\N
cmpe38rzd000004jmp8p3vwj4	hairul anwar	hairul@vascomm.co.id	$2b$12$xRDNrD3Nl0EcuV2Rg2yph.tXTF2pISOJDm/qT2BXr2BRhW.YragoO	CUSTOMER	\N	\N	\N	t	\N	2026-05-20 13:19:03.337	2026-05-20 13:19:03.337	0	\N	\N
cmpermxlm000004ldmp0f0v6n	Rio Pradana Aji	rio@vascomm.co.id	$2b$12$ZHNOJLEkQwHuvqXEPGNST.opVx4xbqegjIvkK3Z6qkwZuvpTzP/Sm	CUSTOMER	\N	\N	\N	t	\N	2026-05-21 00:41:54.586	2026-05-21 00:41:54.586	0	\N	\N
cmpeshydc000004jj3zig8ga3	INTAN APRILIA	intan.a@vascomm.co.id	$2b$12$JHVfFyg7KbxbcXzHkyX5wO76OP9Stn5YjeAOa9b8oHmIsIr7YaCJO	CUSTOMER	\N	\N	\N	t	\N	2026-05-21 01:06:01.92	2026-05-21 01:06:01.92	0	\N	\N
cmpaw7pwi000404icfecj0pjh	Muhammad Tesyar Ramadhan	muhammad.tesyar.ramadhan@vascomm.co.id	$2b$12$ePegpzGunrU3YgfddnN3vePAEUk9m.x/.y8osA9TQLsDfsdeT/SLu	CUSTOMER	\N	\N	\N	t	\N	2026-05-18 07:38:58.146	2026-05-21 01:12:20.173	0	\N	\N
cmpeu2fps000104jxson6l3nl	yukran widiarto	yukran.widiarto@vascomm.co.id	$2b$12$N9oiCgjOtFj9pjp5WMZnAunje72wpC3iGhhQqKUCnSHy5iRNgPvs6	CUSTOMER	\N	\N	\N	t	\N	2026-05-21 01:49:57.136	2026-05-21 01:49:57.136	0	\N	\N
cmpeu0z8h000004jxdbm3yh50	Bagus Fibrianto	bagus.f@vascomm.co.id	$2b$12$5P3BcY6LzFD/5Mu5kNPtaulAlh7yEal7cymLzsI0jn1g1XCHiNlWm	EMPLOYEE	IT Solution	CTO	\N	t	\N	2026-05-21 01:48:49.121	2026-05-21 04:07:07.771	200	\N	\N
cmpf5rfbl000004i8ujcbh2hd	Firmansyah	firmansyahskripsi@gmail.com	$2b$12$bvv.DFxK6nlIzQtBq8vb3.Snjr038CABNM6.5Jo38.pqVpVVTnfV6	CUSTOMER	\N	\N	\N	t	\N	2026-05-21 07:17:18.801	2026-05-21 07:24:32.106	500	\N	\N
cmpcfpyx4000504l2ub2vc5ae	Mochammad Nizar Normansyah	nizar@vascomm.co.id	$2b$12$QhvjhEzDLQpMrEdACAUqJux5zJAHC7ZEtNdx.3aBbnFEsHDqMHn1S	CUSTOMER	\N	\N	\N	t	\N	2026-05-19 09:32:48.52	2026-06-09 08:14:09.683	200	\N	\N
cmpdjyd2m000004l8a618xllh	subarkah	barkah@vascomm.co.id	$2b$12$tiARK0TT6DNrjEDSpAbojuICkCJngQtCRuAhCfeCsJIeD82IQwD0a	CUSTOMER	\N	\N	\N	t	\N	2026-05-20 04:19:04.75	2026-05-21 09:51:34.853	500	\N	\N
cmpcj94wh000004l2n1xb9l80	Rosalia Herlina (Nina) Vascomm	nina.waluyo@gmail.com	$2b$12$YDy1f.ASZ73WJx.14BHm0u2Nw7KtjD6FwYnCzoz6dHNJaGuAE/2aG	CUSTOMER	\N	\N	\N	t	\N	2026-05-19 11:11:41.585	2026-05-21 14:59:34.475	200	\N	\N
cmpcco602000004jszi4gyji2	Ivada Pustakasari	hrd@vascomm.co.id	$2b$12$f/TQDSK.wtcn5N1hBvz5Y.m7l0J1jEfwYj2TCT6GopkE5a.wHYWHq	CUSTOMER	\N	\N	\N	t	\N	2026-05-19 08:07:25.538	2026-05-21 07:33:48.874	500	\N	\N
\.


--
-- TOC entry 3741 (class 0 OID 25631)
-- Dependencies: 219
-- Data for Name: verification_tokens; Type: TABLE DATA; Schema: public; Owner: postgres_lms
--

COPY public.verification_tokens (identifier, token, expires) FROM stdin;
\.


--
-- TOC entry 3488 (class 2606 OID 25593)
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 3494 (class 2606 OID 25623)
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- TOC entry 3550 (class 2606 OID 27029)
-- Name: ai_providers ai_providers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.ai_providers
    ADD CONSTRAINT ai_providers_pkey PRIMARY KEY (id);


--
-- TOC entry 3558 (class 2606 OID 27057)
-- Name: assignment_targets assignment_targets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.assignment_targets
    ADD CONSTRAINT assignment_targets_pkey PRIMARY KEY (id);


--
-- TOC entry 3555 (class 2606 OID 27048)
-- Name: assignments assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT assignments_pkey PRIMARY KEY (id);


--
-- TOC entry 3528 (class 2606 OID 25882)
-- Name: attempt_answers attempt_answers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.attempt_answers
    ADD CONSTRAINT attempt_answers_pkey PRIMARY KEY (id);


--
-- TOC entry 3538 (class 2606 OID 25986)
-- Name: certificates certificates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_pkey PRIMARY KEY (id);


--
-- TOC entry 3502 (class 2606 OID 25684)
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- TOC entry 3508 (class 2606 OID 25738)
-- Name: enrollments enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_pkey PRIMARY KEY (id);


--
-- TOC entry 3530 (class 2606 OID 25933)
-- Name: learning_paths learning_paths_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.learning_paths
    ADD CONSTRAINT learning_paths_pkey PRIMARY KEY (id);


--
-- TOC entry 3517 (class 2606 OID 25820)
-- Name: lesson_completions lesson_completions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.lesson_completions
    ADD CONSTRAINT lesson_completions_pkey PRIMARY KEY (id);


--
-- TOC entry 3506 (class 2606 OID 25703)
-- Name: lessons lessons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_pkey PRIMARY KEY (id);


--
-- TOC entry 3504 (class 2606 OID 25693)
-- Name: modules modules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT modules_pkey PRIMARY KEY (id);


--
-- TOC entry 3540 (class 2606 OID 26020)
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- TOC entry 3553 (class 2606 OID 27039)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- TOC entry 3533 (class 2606 OID 25942)
-- Name: path_courses path_courses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.path_courses
    ADD CONSTRAINT path_courses_pkey PRIMARY KEY (id);


--
-- TOC entry 3535 (class 2606 OID 25950)
-- Name: path_enrollments path_enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.path_enrollments
    ADD CONSTRAINT path_enrollments_pkey PRIMARY KEY (id);


--
-- TOC entry 3545 (class 2606 OID 26042)
-- Name: point_histories point_histories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.point_histories
    ADD CONSTRAINT point_histories_pkey PRIMARY KEY (id);


--
-- TOC entry 3523 (class 2606 OID 25867)
-- Name: question_options question_options_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.question_options
    ADD CONSTRAINT question_options_pkey PRIMARY KEY (id);


--
-- TOC entry 3521 (class 2606 OID 25858)
-- Name: questions questions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (id);


--
-- TOC entry 3525 (class 2606 OID 25875)
-- Name: quiz_attempts quiz_attempts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.quiz_attempts
    ADD CONSTRAINT quiz_attempts_pkey PRIMARY KEY (id);


--
-- TOC entry 3519 (class 2606 OID 25848)
-- Name: quizzes quizzes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.quizzes
    ADD CONSTRAINT quizzes_pkey PRIMARY KEY (id);


--
-- TOC entry 3497 (class 2606 OID 25630)
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- TOC entry 3543 (class 2606 OID 26032)
-- Name: settings settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (id);


--
-- TOC entry 3547 (class 2606 OID 27020)
-- Name: training_courses training_courses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.training_courses
    ADD CONSTRAINT training_courses_pkey PRIMARY KEY (id);


--
-- TOC entry 3513 (class 2606 OID 25796)
-- Name: training_registrations training_registrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.training_registrations
    ADD CONSTRAINT training_registrations_pkey PRIMARY KEY (id);


--
-- TOC entry 3511 (class 2606 OID 25787)
-- Name: trainings trainings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.trainings
    ADD CONSTRAINT trainings_pkey PRIMARY KEY (id);


--
-- TOC entry 3492 (class 2606 OID 25616)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3495 (class 1259 OID 25637)
-- Name: accounts_provider_providerAccountId_key; Type: INDEX; Schema: public; Owner: postgres_lms
--

CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON public.accounts USING btree (provider, "providerAccountId");


--
-- TOC entry 3551 (class 1259 OID 27059)
-- Name: ai_providers_provider_key; Type: INDEX; Schema: public; Owner: postgres_lms
--

CREATE UNIQUE INDEX ai_providers_provider_key ON public.ai_providers USING btree (provider);


--
-- TOC entry 3556 (class 1259 OID 27060)
-- Name: assignment_targets_assignmentId_userId_key; Type: INDEX; Schema: public; Owner: postgres_lms
--

CREATE UNIQUE INDEX "assignment_targets_assignmentId_userId_key" ON public.assignment_targets USING btree ("assignmentId", "userId");


--
-- TOC entry 3526 (class 1259 OID 27092)
-- Name: attempt_answers_attemptId_questionId_key; Type: INDEX; Schema: public; Owner: postgres_lms
--

CREATE UNIQUE INDEX "attempt_answers_attemptId_questionId_key" ON public.attempt_answers USING btree ("attemptId", "questionId");


--
-- TOC entry 3509 (class 1259 OID 25739)
-- Name: enrollments_userId_courseId_key; Type: INDEX; Schema: public; Owner: postgres_lms
--

CREATE UNIQUE INDEX "enrollments_userId_courseId_key" ON public.enrollments USING btree ("userId", "courseId");


--
-- TOC entry 3515 (class 1259 OID 25821)
-- Name: lesson_completions_enrollmentId_lessonId_key; Type: INDEX; Schema: public; Owner: postgres_lms
--

CREATE UNIQUE INDEX "lesson_completions_enrollmentId_lessonId_key" ON public.lesson_completions USING btree ("enrollmentId", "lessonId");


--
-- TOC entry 3531 (class 1259 OID 25951)
-- Name: path_courses_pathId_courseId_key; Type: INDEX; Schema: public; Owner: postgres_lms
--

CREATE UNIQUE INDEX "path_courses_pathId_courseId_key" ON public.path_courses USING btree ("pathId", "courseId");


--
-- TOC entry 3536 (class 1259 OID 25952)
-- Name: path_enrollments_userId_pathId_key; Type: INDEX; Schema: public; Owner: postgres_lms
--

CREATE UNIQUE INDEX "path_enrollments_userId_pathId_key" ON public.path_enrollments USING btree ("userId", "pathId");


--
-- TOC entry 3498 (class 1259 OID 25638)
-- Name: sessions_sessionToken_key; Type: INDEX; Schema: public; Owner: postgres_lms
--

CREATE UNIQUE INDEX "sessions_sessionToken_key" ON public.sessions USING btree ("sessionToken");


--
-- TOC entry 3541 (class 1259 OID 26033)
-- Name: settings_key_key; Type: INDEX; Schema: public; Owner: postgres_lms
--

CREATE UNIQUE INDEX settings_key_key ON public.settings USING btree (key);


--
-- TOC entry 3548 (class 1259 OID 27058)
-- Name: training_courses_trainingId_courseId_key; Type: INDEX; Schema: public; Owner: postgres_lms
--

CREATE UNIQUE INDEX "training_courses_trainingId_courseId_key" ON public.training_courses USING btree ("trainingId", "courseId");


--
-- TOC entry 3514 (class 1259 OID 25797)
-- Name: training_registrations_userId_trainingId_key; Type: INDEX; Schema: public; Owner: postgres_lms
--

CREATE UNIQUE INDEX "training_registrations_userId_trainingId_key" ON public.training_registrations USING btree ("userId", "trainingId");


--
-- TOC entry 3489 (class 1259 OID 25636)
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres_lms
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- TOC entry 3490 (class 1259 OID 27061)
-- Name: users_nik_key; Type: INDEX; Schema: public; Owner: postgres_lms
--

CREATE UNIQUE INDEX users_nik_key ON public.users USING btree (nik);


--
-- TOC entry 3499 (class 1259 OID 25640)
-- Name: verification_tokens_identifier_token_key; Type: INDEX; Schema: public; Owner: postgres_lms
--

CREATE UNIQUE INDEX verification_tokens_identifier_token_key ON public.verification_tokens USING btree (identifier, token);


--
-- TOC entry 3500 (class 1259 OID 25639)
-- Name: verification_tokens_token_key; Type: INDEX; Schema: public; Owner: postgres_lms
--

CREATE UNIQUE INDEX verification_tokens_token_key ON public.verification_tokens USING btree (token);


--
-- TOC entry 3559 (class 2606 OID 25641)
-- Name: accounts accounts_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3592 (class 2606 OID 27082)
-- Name: assignment_targets assignment_targets_assignmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.assignment_targets
    ADD CONSTRAINT "assignment_targets_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES public.assignments(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3593 (class 2606 OID 27087)
-- Name: assignment_targets assignment_targets_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.assignment_targets
    ADD CONSTRAINT "assignment_targets_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3591 (class 2606 OID 27077)
-- Name: assignments assignments_assignedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT "assignments_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3576 (class 2606 OID 25908)
-- Name: attempt_answers attempt_answers_attemptId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.attempt_answers
    ADD CONSTRAINT "attempt_answers_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES public.quiz_attempts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3577 (class 2606 OID 25913)
-- Name: attempt_answers attempt_answers_questionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.attempt_answers
    ADD CONSTRAINT "attempt_answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES public.questions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3583 (class 2606 OID 25992)
-- Name: certificates certificates_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT "certificates_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3584 (class 2606 OID 25997)
-- Name: certificates certificates_pathId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT "certificates_pathId_fkey" FOREIGN KEY ("pathId") REFERENCES public.learning_paths(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3585 (class 2606 OID 25987)
-- Name: certificates certificates_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT "certificates_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3561 (class 2606 OID 25704)
-- Name: courses courses_creatorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT "courses_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3564 (class 2606 OID 25745)
-- Name: enrollments enrollments_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT "enrollments_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3565 (class 2606 OID 25740)
-- Name: enrollments enrollments_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT "enrollments_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3578 (class 2606 OID 25953)
-- Name: learning_paths learning_paths_creatorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.learning_paths
    ADD CONSTRAINT "learning_paths_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3569 (class 2606 OID 25822)
-- Name: lesson_completions lesson_completions_enrollmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.lesson_completions
    ADD CONSTRAINT "lesson_completions_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES public.enrollments(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3570 (class 2606 OID 25827)
-- Name: lesson_completions lesson_completions_lessonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.lesson_completions
    ADD CONSTRAINT "lesson_completions_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES public.lessons(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3563 (class 2606 OID 25714)
-- Name: lessons lessons_moduleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT "lessons_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES public.modules(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3562 (class 2606 OID 25709)
-- Name: modules modules_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT "modules_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3586 (class 2606 OID 26021)
-- Name: notifications notifications_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3590 (class 2606 OID 27072)
-- Name: orders orders_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3579 (class 2606 OID 25963)
-- Name: path_courses path_courses_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.path_courses
    ADD CONSTRAINT "path_courses_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3580 (class 2606 OID 25958)
-- Name: path_courses path_courses_pathId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.path_courses
    ADD CONSTRAINT "path_courses_pathId_fkey" FOREIGN KEY ("pathId") REFERENCES public.learning_paths(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3581 (class 2606 OID 25973)
-- Name: path_enrollments path_enrollments_pathId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.path_enrollments
    ADD CONSTRAINT "path_enrollments_pathId_fkey" FOREIGN KEY ("pathId") REFERENCES public.learning_paths(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3582 (class 2606 OID 25968)
-- Name: path_enrollments path_enrollments_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.path_enrollments
    ADD CONSTRAINT "path_enrollments_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3587 (class 2606 OID 26043)
-- Name: point_histories point_histories_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.point_histories
    ADD CONSTRAINT "point_histories_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3573 (class 2606 OID 25893)
-- Name: question_options question_options_questionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.question_options
    ADD CONSTRAINT "question_options_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES public.questions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3572 (class 2606 OID 25888)
-- Name: questions questions_quizId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT "questions_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES public.quizzes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3574 (class 2606 OID 25903)
-- Name: quiz_attempts quiz_attempts_enrollmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.quiz_attempts
    ADD CONSTRAINT "quiz_attempts_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES public.enrollments(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3575 (class 2606 OID 25898)
-- Name: quiz_attempts quiz_attempts_quizId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.quiz_attempts
    ADD CONSTRAINT "quiz_attempts_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES public.quizzes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3571 (class 2606 OID 25883)
-- Name: quizzes quizzes_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.quizzes
    ADD CONSTRAINT "quizzes_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3560 (class 2606 OID 25646)
-- Name: sessions sessions_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3588 (class 2606 OID 27067)
-- Name: training_courses training_courses_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.training_courses
    ADD CONSTRAINT "training_courses_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3589 (class 2606 OID 27062)
-- Name: training_courses training_courses_trainingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.training_courses
    ADD CONSTRAINT "training_courses_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES public.trainings(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3567 (class 2606 OID 25808)
-- Name: training_registrations training_registrations_trainingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.training_registrations
    ADD CONSTRAINT "training_registrations_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES public.trainings(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3568 (class 2606 OID 25803)
-- Name: training_registrations training_registrations_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.training_registrations
    ADD CONSTRAINT "training_registrations_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3566 (class 2606 OID 25798)
-- Name: trainings trainings_creatorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres_lms
--

ALTER TABLE ONLY public.trainings
    ADD CONSTRAINT "trainings_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3772 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres_lms
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


-- Completed on 2026-06-14 13:57:33 WIB

--
-- PostgreSQL database dump complete
--

\unrestrict ctGagbNBuRwLp1s28YrYgXp04qPyYVkAY5NAQg6iRlMOAwUauSNCkOTlB1FaNaP

