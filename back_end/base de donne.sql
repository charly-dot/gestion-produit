--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-08-17 19:59:12

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
-- TOC entry 223 (class 1259 OID 73764)
-- Name: failed_jobs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.failed_jobs (
    id bigint NOT NULL,
    uuid character varying(255) NOT NULL,
    connection text NOT NULL,
    queue text NOT NULL,
    payload text NOT NULL,
    exception text NOT NULL,
    failed_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.failed_jobs OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 73763)
-- Name: failed_jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.failed_jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.failed_jobs_id_seq OWNER TO postgres;

--
-- TOC entry 4860 (class 0 OID 0)
-- Dependencies: 222
-- Name: failed_jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.failed_jobs_id_seq OWNED BY public.failed_jobs.id;


--
-- TOC entry 218 (class 1259 OID 73739)
-- Name: migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    migration character varying(255) NOT NULL,
    batch integer NOT NULL
);


ALTER TABLE public.migrations OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 73738)
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.migrations_id_seq OWNER TO postgres;

--
-- TOC entry 4861 (class 0 OID 0)
-- Dependencies: 217
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- TOC entry 221 (class 1259 OID 73756)
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.password_reset_tokens (
    email character varying(255) NOT NULL,
    token character varying(255) NOT NULL,
    created_at timestamp(0) without time zone
);


ALTER TABLE public.password_reset_tokens OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 73776)
-- Name: personal_access_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.personal_access_tokens (
    id bigint NOT NULL,
    tokenable_type character varying(255) NOT NULL,
    tokenable_id bigint NOT NULL,
    name character varying(255) NOT NULL,
    token character varying(64) NOT NULL,
    abilities text,
    last_used_at timestamp(0) without time zone,
    expires_at timestamp(0) without time zone,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.personal_access_tokens OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 73775)
-- Name: personal_access_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.personal_access_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.personal_access_tokens_id_seq OWNER TO postgres;

--
-- TOC entry 4862 (class 0 OID 0)
-- Dependencies: 224
-- Name: personal_access_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.personal_access_tokens_id_seq OWNED BY public.personal_access_tokens.id;


--
-- TOC entry 220 (class 1259 OID 73746)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    email_verified_at timestamp(0) without time zone,
    password character varying(255) NOT NULL,
    remember_token character varying(100),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 73745)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 4863 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 227 (class 1259 OID 73788)
-- Name: utilisateurs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.utilisateurs (
    id bigint NOT NULL,
    nom character varying(255) NOT NULL,
    prenom character varying(255) NOT NULL,
    sexe character varying(255) NOT NULL,
    "motDePasse" character varying(255) NOT NULL,
    groupe character varying(255) NOT NULL,
    contact character varying(255),
    profil character varying(255),
    email character varying(255) NOT NULL,
    lecture boolean DEFAULT false NOT NULL,
    suppression boolean DEFAULT false NOT NULL,
    modification boolean DEFAULT false NOT NULL,
    creation boolean DEFAULT false NOT NULL,
    activation boolean DEFAULT false NOT NULL,
    colone boolean DEFAULT false NOT NULL,
    colonee boolean DEFAULT false NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.utilisateurs OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 73787)
-- Name: utilisateurs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.utilisateurs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.utilisateurs_id_seq OWNER TO postgres;

--
-- TOC entry 4864 (class 0 OID 0)
-- Dependencies: 226
-- Name: utilisateurs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.utilisateurs_id_seq OWNED BY public.utilisateurs.id;


--
-- TOC entry 4667 (class 2604 OID 73767)
-- Name: failed_jobs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.failed_jobs ALTER COLUMN id SET DEFAULT nextval('public.failed_jobs_id_seq'::regclass);


--
-- TOC entry 4665 (class 2604 OID 73742)
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- TOC entry 4669 (class 2604 OID 73779)
-- Name: personal_access_tokens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personal_access_tokens ALTER COLUMN id SET DEFAULT nextval('public.personal_access_tokens_id_seq'::regclass);


--
-- TOC entry 4666 (class 2604 OID 73749)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4670 (class 2604 OID 73791)
-- Name: utilisateurs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateurs ALTER COLUMN id SET DEFAULT nextval('public.utilisateurs_id_seq'::regclass);


--
-- TOC entry 4850 (class 0 OID 73764)
-- Dependencies: 223
-- Data for Name: failed_jobs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.failed_jobs (id, uuid, connection, queue, payload, exception, failed_at) FROM stdin;
\.


--
-- TOC entry 4845 (class 0 OID 73739)
-- Dependencies: 218
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.migrations (id, migration, batch) FROM stdin;
1	2014_10_12_000000_create_users_tablefafana	1
2	2014_10_12_100000_create_password_reset_tokens_table	1
3	2019_08_19_000000_create_failed_jobs_table	1
4	2019_12_14_000001_create_personal_access_tokens_table	1
5	2025_08_15_090857_create_utilisateur_table	2
\.


--
-- TOC entry 4848 (class 0 OID 73756)
-- Dependencies: 221
-- Data for Name: password_reset_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.password_reset_tokens (email, token, created_at) FROM stdin;
\.


--
-- TOC entry 4852 (class 0 OID 73776)
-- Dependencies: 225
-- Data for Name: personal_access_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.personal_access_tokens (id, tokenable_type, tokenable_id, name, token, abilities, last_used_at, expires_at, created_at, updated_at) FROM stdin;
1	App\\Models\\Utilisateur	45	authToken	e6f786cb1de20733b7df3f4ccc3bcc0083defbab445d47e935698f449bc808ab	["*"]	\N	\N	2025-08-17 17:20:40	2025-08-17 17:20:40
2	App\\Models\\Utilisateur	45	authToken	d0f584484ac6dda5f277360d7ee0b3d2a0d696b3ec8f30d3d98ae5a7d45c5a4e	["*"]	\N	\N	2025-08-17 17:20:46	2025-08-17 17:20:46
3	App\\Models\\Utilisateur	45	authToken	9a9d656b42f24b81b4f639606a82a7c315b298a80aab8aa197d7464e52b756fe	["*"]	\N	\N	2025-08-17 17:20:52	2025-08-17 17:20:52
4	App\\Models\\Utilisateur	45	authToken	4f1e78eb712f9635b2776bceaa0bf2bc69db3c45060ae5c59299095c4c08fd57	["*"]	\N	\N	2025-08-17 17:21:16	2025-08-17 17:21:16
5	App\\Models\\Utilisateur	45	authToken	eb5498821a4b01e019dd8281c091999324029375ffb3ca504728db74f2d9e03b	["*"]	\N	\N	2025-08-17 17:21:35	2025-08-17 17:21:35
6	App\\Models\\Utilisateur	45	authToken	64d1a0c8386d9c78479dd517647709ad31bca01ababb1dff7d30b9c5e6e8430f	["*"]	\N	\N	2025-08-17 17:21:39	2025-08-17 17:21:39
\.


--
-- TOC entry 4847 (class 0 OID 73746)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, email_verified_at, password, remember_token, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4854 (class 0 OID 73788)
-- Dependencies: 227
-- Data for Name: utilisateurs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.utilisateurs (id, nom, prenom, sexe, "motDePasse", groupe, contact, profil, email, lecture, suppression, modification, creation, activation, colone, colonee, created_at, updated_at) FROM stdin;
1	kjhk	lj	kj	kj	G2	kljnkj	profils/BSEgMpQV1eu87g3ZHva4ejAwjFHTO4bzX1sgmdcb.png	lkjkl	f	f	f	f	f	f	f	2025-08-15 09:36:05	2025-08-15 09:36:05
2	lbkjb	kjkjb	kjbkj	kjkj	G1	kjkj	profils/ZZLSeOLi1jmFGrpSPAztwP89XTj1ZsJoPY6OBCwQ.png	kjkj	f	f	f	f	f	f	f	2025-08-15 09:46:16	2025-08-15 09:46:16
6	kj	khkjh	ikgiu	igig	G1	kgjk	profils/ZFbmOK2OL4fJhe8aDbB21hcOd8WMiaMD78HVN9pG.png	kgik	f	f	f	f	f	f	f	2025-08-15 10:33:15	2025-08-15 10:33:15
13	h	khjh	jhjh	jhvjh	G1	jhjh	profils/tjBo3myCqdOKBoiF19QGJcWYT9vN0Lha8XvYkg3H.png	jh	f	f	f	f	f	f	f	2025-08-15 10:33:42	2025-08-15 10:33:42
14	J.B	LJ	KJ	KJH	G1	KJH	profils/GwVxVJoN6KtqGqWkurUqemaUdnZIZZiIBFKaV7V9.png	KJH	f	f	f	f	f	f	f	2025-08-15 11:03:35	2025-08-15 11:03:35
15	qkfj	lfl	jldqfjjk	sjk	G1	qfjkqjh	profils/fkVZaFp8kCaCACzzFhmAtH31jXy2RT6CObhbiFBB.png	sqfj	f	f	f	f	f	f	f	2025-08-15 11:09:38	2025-08-15 11:09:38
16	uuu	uuuuuu	uuuuuu	uuuuuuu	G2	uuuuu	profils/kFg41ixGXlX2pAcojmQKTKNZykH5958xLLLZipPx.png	uuuuuu@gmail.Com	f	f	f	f	f	f	f	2025-08-15 12:40:34	2025-08-15 12:40:34
45	charly	lantotiana	homme	0000	G2	09769698976	profils/7S1IoxFLGthX93CWcyNE4QieB8Fp1M5AIpZZhjmn.jpg	charly@gmail.com	f	f	f	f	f	f	f	2025-08-16 19:42:41	2025-08-16 19:42:41
17	LJH	LKH	LJH	LJH	G2	LJH	profils/mRNDTs6ERepkoK18KpNQ9zvKZaTP07okm2Z7JW0B.png	LJH	f	f	f	f	f	f	f	2025-08-15 17:09:32	2025-08-15 17:09:32
19	hhhhhh	hhhhhhh	hhhhh	hhhhhh	G2	hhhh	profils/IhptAUbZjgOfYTvexEwvPNS6K9C3PkpIJRW0AB3g.jpg	hhhh	f	f	f	f	f	f	f	2025-08-16 05:55:37	2025-08-16 05:55:37
3	hhhhhhhhh	k	kjkj	kjhkjh	G2	kjhkjh	profils/t1p4l7d8a5IOhwgXkTskUOtcoqeW1HvPrsswWDat.png	kjhkjh@gmail.com	f	f	f	f	t	f	f	2025-08-15 09:56:03	2025-08-16 06:08:14
28	h	h	h	h	G1	h	profils/4v2uf1bEFLhQjTSzxwWQrP7MNBGaK3hwxhVM9zy3.jpg	h@gm	f	f	f	f	f	f	f	2025-08-16 18:41:50	2025-08-16 18:41:50
29	jlljjj	lklklklk	lkjlklk	lklklkj	G1	lkjlkj	profils/FbCjNFGiK6aQ4xdsPlrUphUVKfGUpAQiFljxHuy2.jpg	lkllklkj	f	f	f	f	f	f	f	2025-08-16 18:45:23	2025-08-16 18:45:23
\.


--
-- TOC entry 4865 (class 0 OID 0)
-- Dependencies: 222
-- Name: failed_jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.failed_jobs_id_seq', 1, false);


--
-- TOC entry 4866 (class 0 OID 0)
-- Dependencies: 217
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.migrations_id_seq', 5, true);


--
-- TOC entry 4867 (class 0 OID 0)
-- Dependencies: 224
-- Name: personal_access_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.personal_access_tokens_id_seq', 6, true);


--
-- TOC entry 4868 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- TOC entry 4869 (class 0 OID 0)
-- Dependencies: 226
-- Name: utilisateurs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.utilisateurs_id_seq', 45, true);


--
-- TOC entry 4687 (class 2606 OID 73772)
-- Name: failed_jobs failed_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_pkey PRIMARY KEY (id);


--
-- TOC entry 4689 (class 2606 OID 73774)
-- Name: failed_jobs failed_jobs_uuid_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_uuid_unique UNIQUE (uuid);


--
-- TOC entry 4679 (class 2606 OID 73744)
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 4685 (class 2606 OID 73762)
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (email);


--
-- TOC entry 4691 (class 2606 OID 73783)
-- Name: personal_access_tokens personal_access_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personal_access_tokens
    ADD CONSTRAINT personal_access_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 4693 (class 2606 OID 73786)
-- Name: personal_access_tokens personal_access_tokens_token_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personal_access_tokens
    ADD CONSTRAINT personal_access_tokens_token_unique UNIQUE (token);


--
-- TOC entry 4681 (class 2606 OID 73755)
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- TOC entry 4683 (class 2606 OID 73753)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4696 (class 2606 OID 73804)
-- Name: utilisateurs utilisateurs_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateurs
    ADD CONSTRAINT utilisateurs_email_unique UNIQUE (email);


--
-- TOC entry 4698 (class 2606 OID 73802)
-- Name: utilisateurs utilisateurs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateurs
    ADD CONSTRAINT utilisateurs_pkey PRIMARY KEY (id);


--
-- TOC entry 4694 (class 1259 OID 73784)
-- Name: personal_access_tokens_tokenable_type_tokenable_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX personal_access_tokens_tokenable_type_tokenable_id_index ON public.personal_access_tokens USING btree (tokenable_type, tokenable_id);


-- Completed on 2025-08-17 19:59:14

--
-- PostgreSQL database dump complete
--

