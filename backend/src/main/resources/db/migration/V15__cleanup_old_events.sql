-- Limpiar eventos antiguos que no tienen created_by_id asignado
-- Estos eventos fueron creados antes de agregar la columna created_by_id
-- y pueden causar problemas de serialización

-- Opción 1: Eliminar eventos sin creador (recomendado para desarrollo/testing)
DELETE FROM events WHERE created_by_id IS NULL;

-- Opción 2: Si prefieres mantener los eventos y asignarles un usuario admin por defecto:
-- Descomenta las siguientes líneas y comenta la línea DELETE de arriba
-- UPDATE events 
-- SET created_by_id = (SELECT id FROM users WHERE role = 'ADMIN' ORDER BY id LIMIT 1)
-- WHERE created_by_id IS NULL;

