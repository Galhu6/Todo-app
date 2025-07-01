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
-- Name: lists; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lists (
    id integer NOT NULL,
    user_id integer,
    created_at timestamp without time zone DEFAULT now(),
    name character varying(100) NOT NULL,
    isdeleted boolean DEFAULT false
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
-- Name: lists id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lists ALTER COLUMN id SET DEFAULT nextval('public.lists_id_seq'::regclass);


--
-- Name: tasks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks ALTER COLUMN id SET DEFAULT nextval('public.tasks_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);

--
-- Name: chat_contexts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_contexts ALTER COLUMN id SET DEFAULT nextval('public.chat_contexts_id_seq'::regclass);

--
-- Data for Name: lists; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lists (id, user_id, created_at, name, isdeleted) FROM stdin;
2	10	2025-06-25 10:48:26.653874	my tasks	f
1	10	2025-06-25 10:47:10.010096	Tasks	t
3	1	2025-06-25 11:52:31.091876	my tasks	t
4	1	2025-06-25 12:07:49.713701	tasks	t
5	1	2025-06-25 12:09:30.439398	tht	t
6	1	2025-06-25 13:44:06.423522	tasd	f
7	3	2025-06-25 13:52:49.566264	tasks	t
8	3	2025-06-25 13:53:03.065129	tasks 2	f
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
6	6	duplicate	2025-06-25 15:36:00	pending	2025-06-25 14:36:22.14802	f
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
-- Name: lists_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lists_id_seq', 8, true);


--
-- Name: tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tasks_id_seq', 7, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 10, true);


--
-- Name: lists lists_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lists
    ADD CONSTRAINT lists_pkey PRIMARY KEY (id);


--
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);

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
-- Name: lists lists_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lists
    ADD CONSTRAINT lists_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: tasks tasks_list_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_list_id_fkey FOREIGN KEY (list_id) REFERENCES public.lists(id);

--
-- Name: chat_contexts chat_contexts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_contexts
    ADD CONSTRAINT chat_contexts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);

--
-- PostgreSQL database dump complete
--

