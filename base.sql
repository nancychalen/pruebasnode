CREATE TABLE public.usuarios (
    id SERIAL PRIMARY KEY,
    nombre character varying(100),
    usuario character varying(50),
    pass character varying(255)
);



CREATE TABLE public.alumnos (
    id SERIAL PRIMARY KEY,
    nombre character varying(100),
    avatar character varying(255),
    puntaje integer not null
);

CREATE TABLE public.excursiones (
    id SERIAL PRIMARY KEY,
    titulo character varying(100),
    descripcion character varying(255),
    creditos character varying(255),
    portada character varying(255),
    idusuario integer not null
);

CREATE TABLE public.pasos (
    id SERIAL PRIMARY KEY,
    video character varying(255),
    pregunta character varying(255),
    respuesta integer not null,
    opciona character varying(255),
    opcionb character varying(255),
    opcionc character varying(255),
    idexcursion integer not null
);


ALTER TABLE ONLY public.excursiones
    ADD CONSTRAINT fk_excursion_usuario FOREIGN KEY (idusuario) REFERENCES public.usuarios(id);
    
ALTER TABLE ONLY public.pasos
    ADD CONSTRAINT fk_pasos_excursion FOREIGN KEY (idexcursion) REFERENCES public.excursiones(id);
    
INSERT INTO usuarios (nombre,usuario,pass) VALUES ('jessica','jesangai','bryan'),('nancy','nchalen','jhoncito');

INSERT INTO alumnos (nombre,avatar,puntaje) VALUES ('bryancito','..\/excursiones\/cocodrilo.jpg',0),('jhoncito','..\/excursiones\/cocodrilo.jpg',0);

INSERT INTO excursiones (titulo,descripcion,creditos,portada,idusuario) VALUES ('Cocodrilo','El cocodrilo bonito','Jessi','..\/excursiones\/cocodrilo.jpg',1),('Chanchito','El chanchito bonito','Nancy','..\/excursiones\/cocodrilo.jpg',2);