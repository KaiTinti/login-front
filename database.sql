CREATE TABLE users (
    id INT PRIMARY KEY IDENTITY(1,1),
    username VARCHAR(50) NOT NULL,     
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),                
    created_at DATETIME DEFAULT GETDATE()  
);
