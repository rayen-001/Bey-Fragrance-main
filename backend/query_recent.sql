SELECT * FROM orders WHERE created_at > now() - interval '10 minutes';
