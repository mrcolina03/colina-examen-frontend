# Sistema de Gestión de Órdenes de Compra (Purchase Order System)

## Descripción
Este proyecto implementa una arquitectura de microservicios contenerizada para la gestión de órdenes de compra. El sistema está compuesto por tres servicios orquestados:

1.  **Frontend:** Aplicación React (Vite) servida por Nginx en modo Proxy Inverso.
2.  **Backend:** Microservicio Spring Boot (Java 17) con API REST.
3.  **Base de Datos:** MySQL 8.0 para persistencia de datos.

## Prerrequisitos
* **Docker** y **Docker Compose** instalados y ejecutándose.
* Puertos libres en tu máquina: **3000** (Frontend), **8080** (Backend), **3307** (MySQL).

## Instrucciones de Despliegue Rápido

Gracias a la orquestación con Docker Compose, no es necesario ejecutar comandos manuales para cada servicio.

### 1. Descargar y Arrancar el Sistema
Ubícate en la carpeta donde se encuentra el archivo `docker-compose.yml` y ejecuta:

```bash
docker-compose up -d
```
Este comando descargará automáticamente las imágenes necesarias desde Docker Hub (mrcolina/mrcolina_leccion2 y mrcolina/colina_examen_frontend), creará la red colina-network y levantará los servicios en el orden correcto.

## Acceso al sistema
Accede desde tu navegador para gestionar las órdenes: http://localhost:3000

Si deseas realizar pruebas directas a la API: http://localhost:8080/api/v1/purchase-orders

En este repositorio se incluye el archivo coleccion-postman.json.

Impórtalo en Postman.

Ejecuta las peticiones de la carpeta "Creación" para poblar la base de datos.

Verifica los datos reflejados en el Frontend inmediatamente.