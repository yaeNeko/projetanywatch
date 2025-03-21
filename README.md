# AnyWatch : API REST

## Prérequis

-   [Node.js](https://nodejs.org/) installé

## Installation

1. **Cloner le repository**

    ```bash
    git clone https://gitlab.com/julesbsz/anywatch.git
    cd anywatch
    ```

2. **Installer les dépendances**

    ```bash
    npm install
    ```

3. **Créer un fichier .env dans la racine**

    ```bash
    # Authentication
    JWT_SECRET="m8%_87m35akdhwAakd!%3H@45!ShjqwktzJhx"

    # Database
    DB_HOST=
    DB_PORT=
    DB_USER=
    DB_PASSWORD=
    DB_NAME=
    ```

4. **Démarrer l'API**

    ```bash
    npm run dev
    ```

5. **Lancer les tests (Jest)**

    ```bash
    npm test
    ```