# VisuTask API (Kanban-like)

Backend robusto y escalable para una aplicación de gestión de tareas estilo Kanban. Construido con FastAPI, SQLAlchemy y PostgreSQL, priorizando la integridad de datos, la seguridad y el rendimiento.

## Sobre el Proyecto

VisuTask API no es solo un CRUD. Es una implementación de los desafíos reales que presenta un sistema Kanban. Desde algoritmos de reordenamiento eficientes hasta transacciones atómicas para la integridad de los datos del usuario.

El proyecto sigue una arquitectura modular, separando responsabilidades entre Routers, Esquemas con Pydantic, Modelos con SQLAlchemy y utilidades de seguridad.

## Stack Tecnológico

- **Core**: Python 3.11, FastAPI

- **Base de Datos**: PostgreSQL, SQLAlchemy para el ORM y Alembic para las Migraciones.

- **Validación y Esquemas**: Pydantic V2

- **Seguridad**: JWT (Access Token), Argon2 (Hashing de contraseñas).

- **Infraestructura**: Docker y Docker Compose

- **Testing**: Pytest, HTTPX (TestClient), SQLite in-memory para tests rápidos.

## Features y Decisiones de Diseño

Este proyecto ha evolucionado a través de varias iteraciones técnicas (`features`).

### 1. Autenticación

Implementación de un sistema de registro robusto.

- **Transacciones Atómicas:** Al registrarse, no solo se crea el usuario. Se crea una transacción única que genera el Usuario, un Tablero "Inbox" y una lista "Incoming". Si algo fallara durante el proceso, se ejecuta un rollback y así evitamos que hubieran usuarios "zombies".

- **Seguridad:** Migración de `bcrypt` a **`Argon2`** para un hashing más seguro y resistente a ataques por GPU.

### 2. Arquitectura de Inbox

Implementación del recurso Inbox como un board especial.

- **Recurso Aislado:** El Inbox se maneja como un recurso separado (`/inbox`) aunque técnicamente es un tablero.

- **Inmutabilidad:** Se implementaron capas de seguridad para impeidr que el usuario pueda renombrar o eliminar su Inbox, o crear listas adicionales dentro de él.

- **Filtrado Eficiente:** La ruta de proyectos `/boards` filtra el Inbox a nivel de base de datos para no mezclar conceptos. En su lugar, si quieres obtener el Inbox (tablero), deberás usar `/inbox`.

### 3. Algoritmo de Reordenamiento

Uno de los retos más complejos: mover tarjetas sin reescribir toda la base de datos.

- **Drag & Drop Backend:** Implementación de una lógica de "shift".

- **Bulk Updates:** Uso de `db.execute(update(...))` para mover bloques de tarjetas de una sola operación SQL, evitando el problema N+1 de traer objetos a memoria.

- **Integridad:** Manejo de casos especiales (mover dentro de la misma lista vs mover a otra lista o tablero).

### 4. Sistema de Etiquetas

Esta implementación permite asignar etiquetas a las tarjetas con un color y un nombre opcional.

- **Relación Many-to-Many:** Implementación completa con tabla de asociación `card_tags`.

- **Validación Cruzada:** La API impide asignar una etiqueta del "Proyecto A" a una tarjeta del "Proyecto B", garantizando la coherencia de los datos.

- **Etiquetas Default:** Por defecto, cada vez que creamos un nuevo tablero, tenemos disponibles 5 etiquetas aisladas para ese tablero con colores predeterminados.

- **Inbox:** El inbox, no permite la creación ni asignación de etiquetas en las cards que estén dentro.

### 5. Recordatorios y Patching Inteligente

Implementación de un campo opcional de 'fecha de vencimiento' para las tarjetas que permite establecer una fecha límite a la tarea.

- **Manejo de Nulos:** Implementación precisa de `exclude_unset=True` en Pydantic. Esto permite diferenciar entre "no quiero actualizar la fecha" (omitir campo) y "quiero eliminar la fecha" (enviar null), algo crítico para una buena experiencia de usuario.

### 6. Testing de Integración

La aplicación cuenta con una suite completa de tests que cubren desde la autenticación hasta los casos especiales del movimiento de tarjetas, etc.

## Instalación y Despliegue

La forma más sencilla de ejecutar el proyecto es utilizando Docker Compose.

1. **Clonar el repositorio:**

```
git clone [https://github.com/minvdev/visu-task.git](https://github.com/minvdev/visu-task.git)
cd visu-task
```

2. **Variables de Entorno:** El proyecto ya incluye una configuración segura
   por defecto para desarrollo en `docker-compose.yml`, pero puedes crear un archivo .env en `backend/` si necesitas sobreescribir secretos.

3. **Levantar servicios:**

```
docker compose up --build
```

4. **Acceder a la Documentación:** Una vez levantado, la documentación interactiva de Swagger UI está disponible en: `http://localhost:8080/docs`

## Ejecutar Tests

Para ejecutar la suite de tests, la cual usa una base de datos en memoria para maximizar la velocidad:

```
# Entrar al contenedor
docker compose exec api pytest

# O en caso de que tengas el entorno local configurado:
pytest
```

## Estructura del Proyecto

```
visutask/
├── alembic/                # Migraciones de Base de Datos
├── backend/
│   └── app/
│       ├── core/           # Configuración (Pydantic Settings)
│       ├── db/             # Sesión de DB y clase Base
│       ├── models/         # Modelos SQLAlchemy (User, Board, List, Card, Tag)
│       ├── routers/        # Endpoints de la API (separados por recurso)
│       ├── schemas/        # Esquemas Pydantic (Validación y Serialización)
│       ├── security.py     # Lógica de JWT y Hashing
│       ├── tests/          # Tests de integración (conftest + test files)
│       └── main.py         # Punto de entrada
└── docker-compose.yml      # Orquestación
```

Autor: **minvdev** Licencia: MIT
