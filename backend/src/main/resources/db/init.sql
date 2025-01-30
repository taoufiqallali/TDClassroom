-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS tdclassroom;

CREATE TABLE tdclassroom.personne (
    personne_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    date_naissance DATE NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    CIN VARCHAR(20) NOT NULL UNIQUE,
    tel VARCHAR(20) NOT NULL UNIQUE,
    grade ENUM('professeur', 'ingenieur', 'technicien') NOT NULL,
    address VARCHAR(255) NOT NULL,
    ville VARCHAR(100) NOT NULL,
    code_postale VARCHAR(20),
    responsabilite ENUM('administrateur', 'chef', 'adjoint', 'directeur'),
    nom_banque VARCHAR(100) NOT NULL,
    SOM VARCHAR(100) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    id_unite INT NOT NULL
);
CREATE TABLE tdclassroom.role (
    role_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    role_nom VARCHAR(50) NOT NULL

);


CREATE TABLE tdclassroom.personne_role (
    role_id BIGINT,
    personne_id BIGINT,
    FOREIGN KEY (role_id) REFERENCES role(role_id),
    FOREIGN KEY (personne_id) REFERENCES personne(personne_id),
    PRIMARY KEY (role_id, personne_id)
);

insert into personne(nom, prenom, date_naissance, email, CIN, tel, grade, address, ville, code_postale, responsabilite, nom_banque, SOM, mot_de_passe, id_unite) values ('admin', 'admin', '1999-01-01', 'admin@gmail.com', 'ffrr1234', '999999999', 'professeur', '123 oujda', 'oujda', '600000', 'administrateur', 'bank', '1234', '$2a$12$HyxhcWJiRGDewfrVrpFCJOAktoIxZ6ZhVXwA6pmelJrCu0qBN8zym', 1);
--password: admin
insert into personne(nom, prenom, date_naissance, email, CIN, tel, grade, address, ville, code_postale, responsabilite, nom_banque, SOM, mot_de_passe, id_unite) values ('personne', 'personne', '1999-01-01', 'personne@gmail.com', 'ffrr12345', '88888888', 'professeur', '1234 oujda', 'nador', '600001', 'administrateur', 'bank B', '1235', '$2a$12$HyxhcWJiRGDewfrVrpFCJOAktoIxZ6ZhVXwA6pmelJrCu0qBN8zym', 2);

INSERT INTO tdclassroom.role (role_nom) VALUES ('ADMIN'), ('PERSONNE');

INSERT INTO tdclassroom.personne_role (personne_id, role_id)
VALUES (1, 1);



CREATE TABLE tdclassroom.unite_organisation (
    id_unite BIGINT PRIMARY KEY AUTO_INCREMENT,
    type VARCHAR(50) NOT NULL,
    nom VARCHAR(100) NOT NULL UNIQUE,
    id_chef BIGINT,
    id_adjoint BIGINT,
    FOREIGN KEY (id_chef) REFERENCES personne(personne_id),
    FOREIGN KEY (id_adjoint) REFERENCES personne(personne_id)
);

insert into tdclassroom.unite_organisation(type, nom, id_chef, id_adjoint) values ('administration', 'fso', 1, 2);
insert into tdclassroom.unite_organisation(type, nom, id_chef, id_adjoint) values ('departement', 'informatique', 1, 2);
insert into tdclassroom.unite_organisation(type, nom, id_chef, id_adjoint) values ('departement', 'physique', 1, 2);
insert into tdclassroom.unite_organisation(type, nom, id_chef, id_adjoint) values ('departement', 'biologie', 1, 2);
insert into tdclassroom.unite_organisation(type, nom, id_chef, id_adjoint) values ('departement', 'chimie', 1, 2);
insert into tdclassroom.unite_organisation(type, nom, id_chef, id_adjoint) values ('departement', 'geologie', 1, 2);
insert into tdclassroom.unite_organisation(type, nom, id_chef, id_adjoint) values ('departement', 'mathematique', 1, 2);


CREATE TABLE tdclassroom.local(
    id_local BIGINT PRIMARY KEY AUTO_INCREMENT,
    id_unite BIGINT,
    nom VARCHAR(100) NOT NULL,
    capacite INT NOT NULL,
    accessibilite_pmr BOOLEAN NOT NULL,
    FOREIGN KEY (id_unite) REFERENCES unite_organisation(id_unite)
);

CREATE TABLE tdclassroom.equipement (
    id_equipement BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE tdclassroom.local_equipement (
    id_local BIGINT,
    id_equipement BIGINT,
    FOREIGN KEY (id_local) REFERENCES local(id_local),
    FOREIGN KEY (id_equipement) REFERENCES equipement(id_equipement),
    PRIMARY KEY (id_local, id_equipement)
);

CREATE TABLE tdclassroom.reservation (
    id_reservation BIGINT PRIMARY KEY AUTO_INCREMENT,
    id_utilisateur BIGINT,
    id_local BIGINT,
    date_reservation DATE NOT NULL,
    heure_reservation TIME NOT NULL,
    duree INT NOT NULL,
    status ENUM('pending', 'declined', 'accepted', 'cancelled') DEFAULT 'pending',
    FOREIGN KEY (id_utilisateur) REFERENCES personne(personne_id),
    FOREIGN KEY (id_local) REFERENCES local(id_local)
);

CREATE TABLE tdclassroom.notification (
    id_notification BIGINT PRIMARY KEY AUTO_INCREMENT,
    id_personne BIGINT,
    id_reservation BIGINT,
    type ENUM('pending', 'declined', 'accepted', 'cancelled') NOT NULL,
    message TEXT NOT NULL,
    status ENUM('unread', 'read') DEFAULT 'unread',
    temps_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_personne) REFERENCES personne(personne_id),
    FOREIGN KEY (id_reservation) REFERENCES reservation(id_reservation)
);
