-- Insert Admin User
INSERT INTO "User" (id, email, password, name, role, "createdAt", "updatedAt") VALUES ('891d99a8-d844-4cd5-874e-b305a10b9c1f', 'admin@abdurblog.com', '$2b$10$aWjxaSM.bvDlfd6Zmi4BJeJiKXEE1Ud2vILNgtFubbQUQVsZ.M302', 'Admin User', 'ADMIN', NOW(), NOW());

-- Insert Regular User
INSERT INTO "User" (id, email, password, name, role, "createdAt", "updatedAt") VALUES ('3f69e505-53d7-43c2-851b-ff6dd11fa8b9', 'user@abdurblog.com', '$2b$10$Q2bKgzT..4KU6UMVPXjhDuT2YEtXmfaHXQBVUUBzJv1NUbzl1qtD6', 'Regular User', 'USER', NOW(), NOW());
