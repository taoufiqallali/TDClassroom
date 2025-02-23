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

insert into personne(nom, prenom, date_naissance, email, CIN, tel, grade, address, ville, code_postale, responsabilite, nom_banque, SOM, mot_de_passe, id_unite) values ('admin', 'admin', '1999-01-01', 'admin@gmail.com', 'ffrr1234', '999999999', 'professeur', '123 oujda', 'oujda', '600000', 'administrateur', 'bank', '1234', '$2a$12$fa4uPFwDnbc2G8pR0a9z4.KqFNbldGFY7U68F8hynFEjQr7FlktIK', 1);

INSERT INTO personne (nom, prenom, date_naissance, email, CIN, tel, grade, address, ville, code_postale, responsabilite, nom_banque, SOM, mot_de_passe, id_unite)
VALUES
  ('Dupont', 'Jean', '1985-03-15', 'jean.dupont@example.com', 'AA123456', '0612345678', 'professeur', '12 Rue de la Paix', 'Paris', '75001', 'administrateur', 'BNP Paribas', 'SOM123', '$2a$12$HyxhcWJiRGDewfrVrpFCJOAktoIxZ6ZhVXwA6pmelJrCu0qBN8zym', 1),
  ('Martin', 'Sophie', '1992-07-22', 'sophie.martin@example.com', 'BB789012', '0698765432', 'ingenieur', '5 Avenue des Champs-Élysées', 'Lyon', '69001', 'chef', 'Crédit Agricole', 'SOM456', '$2a$12$HyxhcWJiRGDewfrVrpFCJOAktoIxZ6ZhVXwA6pmelJrCu0qBN8zym', 1),
  ('Garcia', 'David', '1978-11-08', 'david.garcia@example.com', 'CC345678', '0711223344', 'technicien', '25 Boulevard Victor Hugo', 'Marseille', '13001', 'adjoint', 'Société Générale', 'SOM789', '$2a$12$HyxhcWJiRGDewfrVrpFCJOAktoIxZ6ZhVXwA6pmelJrCu0qBN8zym', 1),
  ('Leroy', 'Isabelle', '1995-05-03', 'isabelle.leroy@example.com', 'DD901234', '0755667788', 'professeur', '8 Rue du Château', 'Toulouse', '31000', 'directeur', 'LCL', 'SOM012', '$2a$12$HyxhcWJiRGDewfrVrpFCJOAktoIxZ6ZhVXwA6pmelJrCu0qBN8zym', 1),
  ('Petit', 'Thomas', '1989-09-18', 'thomas.petit@example.com', 'EE567890', '0612121212', 'ingenieur', '10 Place de la République', 'Nice', '06000', 'administrateur', 'Banque Populaire', 'SOM345', '$2a$12$HyxhcWJiRGDewfrVrpFCJOAktoIxZ6ZhVXwA6pmelJrCu0qBN8zym', 1),
  ('Richard', 'Claire', '1982-02-28', 'claire.richard@example.com', 'FF234567', '0632323232', 'technicien', '15 Rue de la Liberté', 'Nantes', '44000', 'chef', 'CIC', 'SOM678', '$2a$12$HyxhcWJiRGDewfrVrpFCJOAktoIxZ6ZhVXwA6pmelJrCu0qBN8zym', 1),
  ('Durand', 'Antoine', '1998-12-10', 'antoine.durand@example.com', 'GG890123', '0743434343', 'professeur', '20 Rue des Fleurs', 'Strasbourg', '67000', 'adjoint', 'Boursorama', 'SOM901', '$2a$12$HyxhcWJiRGDewfrVrpFCJOAktoIxZ6ZhVXwA6pmelJrCu0qBN8zym', 1),
  ('Moreau', 'Élodie', '1975-06-05', 'elodie.moreau@example.com', 'HH456789', '0764646464', 'ingenieur', '30 Avenue de la Gare', 'Bordeaux', '33000', 'directeur', 'Hello bank!', 'SOM234', '$2a$12$HyxhcWJiRGDewfrVrpFCJOAktoIxZ6ZhVXwA6pmelJrCu0qBN8zym', 1),
  ('Simon', 'Sébastien', '1991-01-25', 'sebastien.simon@example.com', 'II101010', '0675757575', 'technicien', '40 Rue du Port', 'Lille', '59000', 'administrateur', 'Fortuneo', 'SOM567', '$2a$12$HyxhcWJiRGDewfrVrpFCJOAktoIxZ6ZhVXwA6pmelJrCu0qBN8zym', 1),
  ('Laurent', 'Camille', '1987-08-01', 'camille.laurent@example.com', 'JJ121212', '0786868686', 'professeur', '50 Rue de la Montagne', 'Grenoble', '38000', 'chef', 'ING', 'SOM890', '$2a$12$HyxhcWJiRGDewfrVrpFCJOAktoIxZ6ZhVXwA6pmelJrCu0qBN8zym', 1);


INSERT INTO tdclassroom.role (role_nom) VALUES ('ADMIN'), ('PERSONNE');

INSERT INTO tdclassroom.personne_role (personne_id, role_id)
VALUES (1, 1);

INSERT INTO tdclassroom.personne_role (personne_id, role_id)
VALUES
    (2, 2),
    (3, 2),
    (4, 2),
    (5, 2),
    (6, 2),
    (7, 2),
    (8, 2),
    (9, 2),
    (10, 2),
    (11, 2);



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


CREATE TABLE tdclassroom.local (
    id_local BIGINT PRIMARY KEY AUTO_INCREMENT,
    id_unite BIGINT,
    nom VARCHAR(100) NOT NULL,
    capacite INT NOT NULL,
    accessibilite_pmr BOOLEAN NOT NULL,
    datashow BOOLEAN DEFAULT FALSE,
    ecrantactille BOOLEAN DEFAULT NULL,
    FOREIGN KEY (id_unite) REFERENCES unite_organisation(id_unite) ON DELETE CASCADE
);

INSERT INTO tdclassroom.local (id_unite, nom, capacite, accessibilite_pmr, datashow, ecrantactille) VALUES (1, 'A1', 35, 1, 0, 1);
INSERT INTO tdclassroom.local (id_unite, nom, capacite, accessibilite_pmr, datashow, ecrantactille) VALUES (1, 'A2', 18, 0, 1, 0);
INSERT INTO tdclassroom.local (id_unite, nom, capacite, accessibilite_pmr, datashow, ecrantactille) VALUES (1, 'A3', 52, 1, 1, 1);
INSERT INTO tdclassroom.local (id_unite, nom, capacite, accessibilite_pmr, datashow, ecrantactille) VALUES (1, 'B1', 29, 0, 0, 1);
INSERT INTO tdclassroom.local (id_unite, nom, capacite, accessibilite_pmr, datashow, ecrantactille) VALUES (1, 'B2', 41, 1, 0, 0);
INSERT INTO tdclassroom.local (id_unite, nom, capacite, accessibilite_pmr, datashow, ecrantactille) VALUES (1, 'B3', 12, 0, 1, 1);
INSERT INTO tdclassroom.local (id_unite, nom, capacite, accessibilite_pmr, datashow, ecrantactille) VALUES (1, 'C1', 58, 1, 1, 0);
INSERT INTO tdclassroom.local (id_unite, nom, capacite, accessibilite_pmr, datashow, ecrantactille) VALUES (1, 'C2', 23, 0, 0, 0);



CREATE TABLE reservation (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_local BIGINT NOT NULL,
    personne_id BIGINT NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'FIXED') DEFAULT 'PENDING',
    FOREIGN KEY (id_local) REFERENCES local(id_local) ON DELETE CASCADE,
    FOREIGN KEY (personne_id) REFERENCES personne(personne_id) ON DELETE CASCADE
);


INSERT INTO reservation (id_local, personne_id, date, start_time, end_time, status) VALUES
(1, 2, CURDATE(), '08:00:00', '10:00:00', 'APPROVED'),
(2, 3, CURDATE(), '10:30:00', '12:30:00', 'PENDING'),
(3, 4, CURDATE(), '13:00:00', '15:00:00', 'FIXED'),
(4, 5, CURDATE(), '15:30:00', '17:30:00', 'REJECTED'),
(5, 6, CURDATE(), '09:00:00', '11:00:00', 'APPROVED'),
(6, 7, CURDATE(), '11:30:00', '13:30:00', 'PENDING'),
(7, 8, CURDATE(), '14:00:00', '16:00:00', 'FIXED'),
(8, 9, CURDATE(), '16:30:00', '18:00:00', 'REJECTED'),
(1, 10, CURDATE() + INTERVAL 1 DAY, '10:00:00', '12:00:00', 'APPROVED'),
(2, 11, CURDATE() + INTERVAL 1 DAY, '12:30:00', '14:30:00', 'PENDING'),
(3, 2, CURDATE() + INTERVAL 1 DAY, '15:00:00', '17:00:00', 'FIXED'),
(4, 3, CURDATE() + INTERVAL 1 DAY, '08:30:00', '10:30:00', 'REJECTED'),
(5, 4, CURDATE() + INTERVAL 1 DAY, '11:00:00', '13:00:00', 'APPROVED'),
(6, 5, CURDATE() + INTERVAL 1 DAY, '13:30:00', '15:30:00', 'PENDING'),
(7, 6, CURDATE() + INTERVAL 1 DAY, '16:00:00', '18:00:00', 'FIXED'),
(8, 7, CURDATE() + INTERVAL 1 DAY, '09:30:00', '11:30:00', 'REJECTED'),
(1, 8, CURDATE() + INTERVAL 2 DAY, '12:00:00', '14:00:00', 'APPROVED'),
(2, 9, CURDATE() + INTERVAL 2 DAY, '14:30:00', '16:30:00', 'PENDING'),
(3, 10, CURDATE() + INTERVAL 2 DAY, '17:00:00', '18:00:00', 'FIXED'),
(4, 11, CURDATE() + INTERVAL 2 DAY, '10:30:00', '12:30:00', 'REJECTED'),
(5, 2, CURDATE() + INTERVAL 2 DAY, '13:00:00', '15:00:00', 'APPROVED'),
(6, 3, CURDATE() + INTERVAL 2 DAY, '15:30:00', '17:30:00', 'PENDING'),
(7, 4, CURDATE() + INTERVAL 2 DAY, '08:00:00', '10:00:00', 'FIXED'),
(8, 5, CURDATE() + INTERVAL 2 DAY, '11:30:00', '13:30:00', 'REJECTED'),
(1, 6, CURDATE() + INTERVAL 3 DAY, '14:00:00', '16:00:00', 'APPROVED'),
(2, 7, CURDATE() + INTERVAL 3 DAY, '16:30:00', '18:00:00', 'PENDING'),
(3, 8, CURDATE() + INTERVAL 3 DAY, '09:00:00', '11:00:00', 'FIXED'),
(4, 9, CURDATE() + INTERVAL 3 DAY, '12:30:00', '14:30:00', 'REJECTED'),
(5, 10, CURDATE() + INTERVAL 3 DAY, '15:00:00', '17:00:00', 'APPROVED'),
(6, 11, CURDATE() + INTERVAL 3 DAY, '08:30:00', '10:30:00', 'PENDING'),
(7, 2, CURDATE() + INTERVAL 3 DAY, '11:00:00', '13:00:00', 'FIXED'),
(8, 3, CURDATE() + INTERVAL 3 DAY, '13:30:00', '15:30:00', 'REJECTED'),
(1, 4, CURDATE() + INTERVAL 4 DAY, '16:00:00', '18:00:00', 'APPROVED'),
(2, 5, CURDATE() + INTERVAL 4 DAY, '09:30:00', '11:30:00', 'PENDING'),
(3, 6, CURDATE() + INTERVAL 4 DAY, '12:00:00', '14:00:00', 'FIXED'),
(4, 7, CURDATE() + INTERVAL 4 DAY, '14:30:00', '16:30:00', 'REJECTED'),
(5, 8, CURDATE() + INTERVAL 4 DAY, '17:00:00', '18:00:00', 'APPROVED'),
(6, 9, CURDATE() + INTERVAL 4 DAY, '10:30:00', '12:30:00', 'PENDING'),
(7, 10, CURDATE() + INTERVAL 4 DAY, '13:00:00', '15:00:00', 'FIXED'),
(8, 11, CURDATE() + INTERVAL 4 DAY, '15:30:00', '17:30:00', 'REJECTED');


