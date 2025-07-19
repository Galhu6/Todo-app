--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: chat_contexts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chat_contexts (
    id integer NOT NULL,
    user_id integer,
    context text,
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.chat_contexts OWNER TO postgres;

--
-- Name: chat_contexts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.chat_contexts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.chat_contexts_id_seq OWNER TO postgres;

--
-- Name: chat_contexts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.chat_contexts_id_seq OWNED BY public.chat_contexts.id;


--
-- Name: lists; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lists (
    id integer NOT NULL,
    user_id integer,
    created_at timestamp without time zone DEFAULT now(),
    name character varying(100) NOT NULL,
    isdeleted boolean DEFAULT false,
    overall_goal text
);


ALTER TABLE public.lists OWNER TO postgres;

--
-- Name: lists_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lists_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lists_id_seq OWNER TO postgres;

--
-- Name: lists_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lists_id_seq OWNED BY public.lists.id;


--
-- Name: micro_tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.micro_tasks (
    id integer NOT NULL,
    task_id integer NOT NULL,
    description text NOT NULL,
    completed boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.micro_tasks OWNER TO postgres;

--
-- Name: micro_tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.micro_tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.micro_tasks_id_seq OWNER TO postgres;

--
-- Name: micro_tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.micro_tasks_id_seq OWNED BY public.micro_tasks.id;


--
-- Name: tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tasks (
    id integer NOT NULL,
    list_id integer,
    description character varying(250) NOT NULL,
    due_date timestamp without time zone NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT now(),
    isdeleted boolean DEFAULT false,
    CONSTRAINT tasks_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'overdue'::character varying, 'completed'::character varying])::text[])))
);


ALTER TABLE public.tasks OWNER TO postgres;

--
-- Name: tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tasks_id_seq OWNER TO postgres;

--
-- Name: tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tasks_id_seq OWNED BY public.tasks.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(250) NOT NULL,
    name character varying(100) NOT NULL,
    password_hash character varying(256) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    isdeleted boolean DEFAULT false
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: chat_contexts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_contexts ALTER COLUMN id SET DEFAULT nextval('public.chat_contexts_id_seq'::regclass);


--
-- Name: lists id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lists ALTER COLUMN id SET DEFAULT nextval('public.lists_id_seq'::regclass);


--
-- Name: micro_tasks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.micro_tasks ALTER COLUMN id SET DEFAULT nextval('public.micro_tasks_id_seq'::regclass);


--
-- Name: tasks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks ALTER COLUMN id SET DEFAULT nextval('public.tasks_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: chat_contexts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chat_contexts (id, user_id, context, updated_at) FROM stdin;
1	1	\nUser: tell me about my tasks\nAI: Here are your current tasks categorized by their respective lists:\n\n**List: tasks 2 (ID: 10)**\n1. **Task:** new 2\n   - **Due Date:** July 1, 2025\n   - **Status:** Pending\n2. **Task:** new 3\n   - **Due Date:** July 2, 2025\n   - **Status:** Pending\n3. **Task:** new 1\n   - **Due Date:** June 30, 2025\n   - **Status:** Pending\n4. **Task:** new 1\n   - **Due Date:** June 30, 2025\n   - **Status:** Pending\n5. **Task:** new 2\n   - **Due Date:** July 1, 2025\n   - **Status:** Completed\n\n**List: cooking (ID: 12)**\n1. **Task:** baking\n   - **Due Date:** July 1, 2025\n   - **Status:** Pending\n2. **Task:** cooling\n   - **Due Date:** July 1, 2025\n   - **Status:** Pending\n3. **Task:** eat!\n   - **Due Date:** July 1, 2025\n   - **Status:** Pending\n4. **Task:** mixing\n   - **Due Date:** July 2, 2025\n   - **Status:** Pending\n\nThere are no tasks in the list "tasks" (ID: 11).\n\nIf you need any specific information or actions related to these tasks, feel free to ask!\nUser: create a new task in tasks 2 list i need to do laundry\nAI: \nUser: create a new task "feed the dog" in tasks 2\nAI: \nUser: craete a new task for sportslist\nAI: Created task "new task for sportslist" in list undefined\nUser: create a new task "excersise" int the Sport list\nAI: Created task "exercise" in list undefined\nUser: craete a new task called arm wrestel in sports list\nAI: Created task "arm wrestel" in list undefined\nUser: create a new task "delete old tasks in sports list\nAI: Created task "delete old tasks in sports list" in list undefined\nUser: add a new list called "dates"\nAI: created list "dates".\nUser: create a new task "buy flowers" in dates list\nAI: Created task "buy flowers" in list undefined\nUser: create a new list with a funny name\nAI: created list "Funny Business".\nUser: create a new task in funny buisness list called something funny\nAI: Created task "something funny" in list undefined	2025-07-02 13:49:49.696693
\.


--
-- Data for Name: lists; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lists (id, user_id, created_at, name, isdeleted, overall_goal) FROM stdin;
2	10	2025-06-25 10:48:26.653874	my tasks	f	\N
1	10	2025-06-25 10:47:10.010096	Tasks	t	\N
3	1	2025-06-25 11:52:31.091876	my tasks	t	\N
4	1	2025-06-25 12:07:49.713701	tasks	t	\N
5	1	2025-06-25 12:09:30.439398	tht	t	\N
7	3	2025-06-25 13:52:49.566264	tasks	t	\N
8	3	2025-06-25 13:53:03.065129	tasks 2	f	\N
6	1	2025-06-25 13:44:06.423522	tasd	t	\N
9	1	2025-06-25 15:33:53.447415	tasas	t	\N
10	1	2025-06-27 11:01:51.856049	tasks 2	f	\N
11	1	2025-06-30 20:58:10.482895	tasks	f	\N
12	1	2025-07-01 23:06:11.46307	cooking	f	\N
13	1	2025-07-02 12:32:55.80688	sports	f	being healthy
14	1	2025-07-02 13:23:58.775638	dates	f	\N
16	1	2025-07-08 21:53:01.812541	Funny Buisness	f	have fun
15	1	2025-07-02 13:49:11.759055	Funny Business	t	\N
\.


--
-- Data for Name: micro_tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.micro_tasks (id, task_id, description, completed, created_at) FROM stdin;
\.


--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tasks (id, list_id, description, due_date, status, created_at, isdeleted) FROM stdin;
2	2	eat spaghetti	2025-06-25 10:50:00	completed	2025-06-25 10:50:36.877465	t
1	1	check the sign in	2025-06-25 15:45:00	completed	2025-06-25 10:47:48.066307	f
3	1	make it rain	2025-06-25 07:51:00	completed	2025-06-25 10:51:26.733752	t
4	4	fox	2025-06-25 13:08:00	completed	2025-06-25 12:08:26.124771	t
5	6	fix	2025-06-25 15:45:00	completed	2025-06-25 13:45:37.818357	t
6	6	duplicate	2025-06-25 15:36:00	pending	2025-06-25 14:36:22.14802	t
8	6	duplicate	2025-06-25 15:36:00	completed	2025-06-25 15:32:55.435748	t
9	10	new name	2025-06-29 00:00:00	completed	2025-06-27 11:02:19.08074	t
10	10	new new name	2025-06-27 08:45:34.693	pending	2025-06-27 11:42:29.142067	t
11	10	another task	2025-06-28 08:57:00	pending	2025-06-27 11:57:15.674076	t
12	10	new task	2025-07-03 09:03:00	pending	2025-06-27 12:03:11.692433	t
13	10	newwwer	2025-06-28 09:03:00	pending	2025-06-27 12:03:28.95038	t
14	10	new	2025-06-28 09:18:00	completed	2025-06-27 12:18:13.640531	t
16	10	new	2025-07-01 16:34:00	completed	2025-06-30 19:54:59.749487	t
15	10	new	2025-07-01 16:34:00	completed	2025-06-30 19:35:00.861621	t
18	10	new 2	2025-07-01 17:58:00	pending	2025-06-30 20:58:40.898281	f
19	10	new 3	2025-07-02 17:58:00	pending	2025-06-30 20:58:52.101747	f
17	10	new 1	2025-06-30 17:57:55.953	pending	2025-06-30 20:58:29.639577	f
20	10	new 1	2025-06-30 17:57:55.953	pending	2025-06-30 21:05:46.762664	f
21	10	new 2	2025-07-01 17:58:00	completed	2025-06-30 21:06:07.601381	f
23	12	baking	2025-07-01 22:06:00	pending	2025-07-01 23:06:43.710247	f
24	12	cooling	2025-07-01 23:06:00	pending	2025-07-01 23:07:00.411875	f
25	12	eat!	2025-07-01 23:30:00	pending	2025-07-01 23:07:21.551492	f
22	12	mixing	2025-07-02 00:00:00	pending	2025-07-01 23:06:27.198514	f
26	13	new task for sportslist	2025-07-03 00:00:00	pending	2025-07-02 12:33:20.74758	f
27	13	exercise	2025-07-03 00:00:00	pending	2025-07-02 12:34:02.913428	f
28	13	arm wrestel	2025-07-03 00:00:00	pending	2025-07-02 12:35:35.445956	f
29	13	delete old tasks in sports list	2025-07-03 00:00:00	pending	2025-07-02 12:36:19.421156	f
30	14	buy flowers	2025-07-10 00:00:00	pending	2025-07-02 13:24:35.745227	f
31	15	something funny	2025-07-10 00:00:00	pending	2025-07-02 13:49:49.678555	f
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, name, password_hash, created_at, isdeleted) FROM stdin;
1	gal@gal.com	Gal	$2b$10$RMIfrOYlOeMAM3/kGIwmCOOuymWjH8x4o0yYdEMbdtEQ8JUyvKpo2	2025-06-25 10:02:24.974535	f
3	gal1@gal.com	Gal	$2b$10$Dvs0rwfqhafmoTr/U0gFQuW5NeZswZ35menJFQhvcE4v1kGLb/Q7y	2025-06-25 10:05:10.757066	f
5	gal2@gal.com	Gal	$2b$10$NL8JJ3S8kBfsSKOp92OpNOHEr0teeSBJTE6.H5aAI6VQfamBXVFUm	2025-06-25 10:09:56.592409	f
6	gal3@gal.com	Gal	$2b$10$ilu56e1RpqL/4r0xZKRrkeWxe3Sk5xTECvfyyN6WF.N/fHIUy9h4C	2025-06-25 10:10:51.957899	f
7	gal4@gal.com	Gal	$2b$10$LYy4rzEe5zZF7Jik76ay2OW197zc1r5Iu5nri2DFZIbtNvVsz9xna	2025-06-25 10:38:52.830682	f
8	gal5@gal.com	Gal	$2b$10$hQo74dTiFwBnB383sYOZ8uKP9nYS.UL0FAeT8SHvgmJyr858F66P.	2025-06-25 10:40:12.115016	f
9	gal6@gal.com	Gal	$2b$10$7nKVWAY2qsI2g.ScF/mw6Oxpt5UvPs1GtvFRe9XsRNOBozhnGQHRC	2025-06-25 10:44:57.947175	f
10	gal7@gmail.com	Gal	$2b$10$NEtXIxeZ2LszgtDwBbP9aOrhtoDyDzprE/RPbjJ53irbCsGB5tC1i	2025-06-25 10:46:37.226554	f
\.


--
-- Name: chat_contexts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.chat_contexts_id_seq', 11, true);


--
-- Name: lists_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lists_id_seq', 8, true);


--
-- Name: micro_tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.micro_tasks_id_seq', 1, false);


--
-- Name: tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tasks_id_seq', 7, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 10, true);


--
-- Name: chat_contexts chat_contexts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_contexts
    ADD CONSTRAINT chat_contexts_pkey PRIMARY KEY (id);


--
-- Name: chat_contexts chat_contexts_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_contexts
    ADD CONSTRAINT chat_contexts_user_id_key UNIQUE (user_id);


--
-- Name: lists lists_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lists
    ADD CONSTRAINT lists_pkey PRIMARY KEY (id);


--
-- Name: micro_tasks micro_tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.micro_tasks
    ADD CONSTRAINT micro_tasks_pkey PRIMARY KEY (id);


--
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: chat_contexts chat_contexts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_contexts
    ADD CONSTRAINT chat_contexts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: lists lists_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lists
    ADD CONSTRAINT lists_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: micro_tasks micro_tasks_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.micro_tasks
    ADD CONSTRAINT micro_tasks_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE CASCADE;


--
-- Name: tasks tasks_list_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_list_id_fkey FOREIGN KEY (list_id) REFERENCES public.lists(id);


--
-- PostgreSQL database dump complete
--

