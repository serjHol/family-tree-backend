CREATE TABLE gender (
    id bigserial primary key not null,
    gender_value varchar(255)
);

CREATE TABLE people (
    id bigserial primary key not null,
    first_name varchar(255),
    last_name varchar(255),
    gender_id bigint references gender (id),
    age INT
);

CREATE TABLE relation_type (
    id bigserial primary key not null,
    type varchar(255) UNIQUE,
);



CREATE TABLE relation (
    id bigserial primary key not null,
    id_1 bigint references people (id),
    id_2 bigint references people (id),
    type_id bigint references relation_type (id)
);


INSERT INTO relation_type (
    type
) values
('parentship'),
('marriage'),
('brothership');

INSERT INTO gender (gender_value) values ('Male'), ('Female');


INSERT INTO people 
(id, first_name, last_name, gender_id, age)
 values (1, 'Test', 'Adam', 1, 30), (2, 'Test', 'Eve', 2, 35);
INSERT INTO people (first_name, last_name, gender_id, age) values ('Child', 'AA', 1, 8);
INSERT INTO relation (id_1, id_2, type_id) values (1, 5, 1), (2, 5, 1), (1, 2, 2);

