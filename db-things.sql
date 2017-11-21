CREATE TABLE public.people
(
    name character varying COLLATE pg_catalog."default" NOT NULL,
    id integer NOT NULL DEFAULT nextval('people_id_seq'::regclass),
    CONSTRAINT people_id PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.people
    OWNER to dxwu55;

CREATE TABLE public.phone_nums
(
    id integer NOT NULL DEFAULT nextval('phone_nums_id_seq'::regclass),
    people_id integer,
    "number" character varying COLLATE pg_catalog."default",
    phone_types_id integer,
    CONSTRAINT phone_nums_id PRIMARY KEY (id),
    CONSTRAINT people_id FOREIGN KEY (people_id)
        REFERENCES public.people (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT phone_types_id FOREIGN KEY (phone_types_id)
        REFERENCES public.phone_types (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.phone_nums
    OWNER to dxwu55;

-- Index: fki_people_id

-- DROP INDEX public.fki_people_id;

CREATE INDEX fki_people_id
    ON public.phone_nums USING btree
    (people_id)
    TABLESPACE pg_default;

-- Index: fki_phone_types_id

-- DROP INDEX public.fki_phone_types_id;

CREATE INDEX fki_phone_types_id
    ON public.phone_nums USING btree
    (phone_types_id)
    TABLESPACE pg_default;

CREATE TABLE public.phone_types
(
    id integer NOT NULL DEFAULT nextval('phone_types_id_seq'::regclass),
    type character varying(10) COLLATE pg_catalog."default",
    CONSTRAINT phone_types_id PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.phone_types
    OWNER to dxwu55;

