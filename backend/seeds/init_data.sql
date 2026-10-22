-- Datos de ejemplo para desarrollo local. El esquema lo crea Alembic.

INSERT INTO users (id, username, email, password_hash)
VALUES (
	1,
	'demo-user',
	'demo@example.invalid',
	'$argon2id$v=19$m=65536,t=3,p=4$KSUkBKBUyhmjtFZKaY0xRg$WtcxGGgR5Iy0npKLD3jcLFULxf+2/3QHaO813SY3BGU'
);

INSERT INTO boards (id, name, description, user_id, is_inbox)
VALUES
	(1, 'Inbox', 'Bandeja de entrada personal.', 1, TRUE),
	(2, 'Desarrollo del producto', 'Seguimiento de tareas de desarrollo y mantenimiento.', 1, FALSE);

INSERT INTO lists (id, name, board_id, position)
VALUES
	(1, 'Incoming', 1, 1),
	(2, 'Por hacer', 2, 1),
	(3, 'En curso', 2, 2),
	(4, 'Completado', 2, 3);

INSERT INTO tags (id, name, color, board_id)
VALUES
	(1, 'API', '#d62828', 2),
	(2, 'Prioridad alta', '#00b4d8', 2),
	(3, 'Mantenimiento', '#a7c957', 2);

INSERT INTO cards (id, name, text, is_done, list_id, position, due_date)
VALUES
	(1, 'Revisar comentarios recientes del equipo', 'Consolidar las observaciones compartidas para su seguimiento.', FALSE, 1, 1, NULL),
	(2, 'Refactorizar el editor de texto', 'Simplificar el componente de edición reutilizable.', FALSE, 2, 1, NULL),
	(3, 'Implementar reordenación de listas', 'Permitir cambiar el orden de las listas del tablero.', FALSE, 3, 1, NULL),
	(4, 'Ordenar listas por posición', 'Mostrar las listas según el orden guardado.', TRUE, 4, 1, NULL);

INSERT INTO card_tags (card_id, tag_id)
VALUES
	(3, 1),
	(3, 2),
	(2, 3);

-- Mantener las secuencias por encima de los identificadores insertados.
SELECT setval(pg_get_serial_sequence('users', 'id'), (SELECT MAX(id) FROM users));
SELECT setval(pg_get_serial_sequence('boards', 'id'), (SELECT MAX(id) FROM boards));
SELECT setval(pg_get_serial_sequence('lists', 'id'), (SELECT MAX(id) FROM lists));
SELECT setval(pg_get_serial_sequence('tags', 'id'), (SELECT MAX(id) FROM tags));
SELECT setval(pg_get_serial_sequence('cards', 'id'), (SELECT MAX(id) FROM cards));
