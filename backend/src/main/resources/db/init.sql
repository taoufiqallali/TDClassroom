-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS tdclassroom;

CREATE TABLE tdclassroom.personne (
    personne_id INT PRIMARY KEY AUTO_INCREMENT,
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
    responsabilite ENUM('administrateur', 'chef dep', 'adjoint chef dep', 'directeur lab'),
    nom_banque VARCHAR(100) NOT NULL,
    SOM VARCHAR(100) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    id_unite INT NOT NULL
);
CREATE TABLE tdclassroom.role (
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    role_nom VARCHAR(50) NOT NULL
);


CREATE TABLE tdclassroom.personne_role (
    role_id INT,
    personne_id INT,
    FOREIGN KEY (role_id) REFERENCES role(role_id),
    FOREIGN KEY (personne_id) REFERENCES personne(personne_id),
    PRIMARY KEY (role_id, personne_id)
);

CREATE TABLE tdclassroom.unite_organisation (
    id_unite INT PRIMARY KEY AUTO_INCREMENT,
    type VARCHAR(50) NOT NULL,
    nom VARCHAR(100) NOT NULL UNIQUE,
    id_chef INT,
    id_adjoint INT,
    FOREIGN KEY (id_chef) REFERENCES personne(personne_id),
    FOREIGN KEY (id_adjoint) REFERENCES personne(personne_id)
);

CREATE TABLE tdclassroom.local(
    id_local INT PRIMARY KEY AUTO_INCREMENT,
    id_unite INT,
    nom VARCHAR(100) NOT NULL,
    capacite INT NOT NULL,
    accessibilite_pmr BOOLEAN NOT NULL,
    FOREIGN KEY (id_unite) REFERENCES unite_organisation(id_unite)
);

CREATE TABLE tdclassroom.equipement (
    id_equipement INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE tdclassroom.local_equipement (
    id_local INT,
    id_equipement INT,
    FOREIGN KEY (id_local) REFERENCES local(id_local),
    FOREIGN KEY (id_equipement) REFERENCES equipement(id_equipement),
    PRIMARY KEY (id_local, id_equipement)
);

CREATE TABLE tdclassroom.reservation (
    id_reservation INT PRIMARY KEY AUTO_INCREMENT,
    id_utilisateur INT,
    id_local INT,
    date_reservation DATE NOT NULL,
    heure_reservation TIME NOT NULL,
    duree INT NOT NULL,
    status ENUM('pending', 'declined', 'accepted', 'cancelled') DEFAULT 'pending',
    FOREIGN KEY (id_utilisateur) REFERENCES personne(personne_id),
    FOREIGN KEY (id_local) REFERENCES local(id_local)
);

CREATE TABLE tdclassroom.notification (
    id_notification INT PRIMARY KEY AUTO_INCREMENT,
    id_personne INT,
    id_reservation INT,
    type ENUM('pending', 'declined', 'accepted', 'cancelled') NOT NULL,
    message TEXT NOT NULL,
    status ENUM('unread', 'read') DEFAULT 'unread',
    temps_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_personne) REFERENCES personne(personne_id),
    FOREIGN KEY (id_reservation) REFERENCES reservation(id_reservation)
);
