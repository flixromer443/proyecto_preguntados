# 🎮 Proyecto Preguntados

Aplicación web tipo “Preguntados” desarrollada como proyecto full-stack, con sistema de usuarios, partidas, estadísticas y un módulo de administración.

El sistema está completamente **dockerizado**, permitiendo levantar el entorno completo (frontend, backend y base de datos) con un solo comando.

---

## 🚀 Tecnologías utilizadas

### Frontend
- Angular
- TypeScript
- HTML5 / SCSS
- Reactive Forms
- PrimeNG

### Backend
- PHP (API REST)
- PDO
- JWT (autenticación)
- Arquitectura MVC

### Base de datos
- MySQL / MariaDB

### DevOps
- Docker
- Docker Compose

---

## 🐳 Arquitectura con Docker

El proyecto está containerizado y se compone de los siguientes servicios:

- **frontend** → Aplicación Angular
- **backend** → API en PHP
- **db** → Base de datos MySQL
- **phpmyadmin** (opcional) → Administración visual de BD

### ⚙️ Orquestación

Todo el entorno se levanta mediante `docker-compose`, el cual:

- Construye automáticamente las imágenes (`build`)
- Configura redes internas entre servicios
- Expone puertos necesarios
- Inicializa la base de datos
- Permite entornos replicables

---

## 📦 Levantar el proyecto

### 🔧 Requisitos
- Docker
- Docker Compose

---

### ▶️ Ejecución del entorno completo

```bash
docker-compose up --build