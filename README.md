# Sistema Demo - Taller Automotriz

Proyecto front-end estático (HTML, CSS y JavaScript) para una demo de gestión de taller automotriz con:

- Inicio de sesión.
- Dashboard con menú lateral y control de tipo de vista.
- Módulos de Órdenes, Inventario, Usuarios y Reportes.
- Formularios rápidos (nuevo usuario, vehículo, ingreso y salida).
- Persistencia demo con `localStorage`.

🔗 **[Ver Demo](https://pep-example.vercel.app)**

## Estructura del proyecto

```text
pep/
├── css/
│   ├── styles.css
│   └── dashboard.css
├── js/
│   ├── main.js
│   └── dashboard.js
├── index.html
├── dashboard.html
├── ordenes.html
├── inventario.html
├── usuarios.html
├── reportes.html
├── nuevo-usuario.html
├── registrar-vehiculo.html
├── nuevo-ingreso.html
└── registrar-salida.html
```

## Cómo ejecutar

Como es un sitio estático, puedes abrir `index.html` directamente o usar un servidor local.

Ejemplo con VS Code + Live Server:

1. Abrir la carpeta del proyecto.
2. Click derecho en `index.html`.
3. Seleccionar **Open with Live Server**.

## Flujo de uso demo

1. Entrar desde `index.html`.
2. En el panel lateral, usar **Tipo de vista** para cambiar entre:
   - Administrador
   - Supervisor
   - Operador (Mecánico)
3. La navegación y acciones visibles cambian según el rol.

## Nota

Los datos de usuarios demo se guardan en el navegador mediante `localStorage`. No hay backend real.
