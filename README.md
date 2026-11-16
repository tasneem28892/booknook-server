# 📚 BookNook – Backend Server

BookNook is an online library management system. This repository contains the backend server that handles book management, borrowing operations, returning books, database operations, and user authentication.

## ✨ Features

- Get all available books
- Get book details by ID
- Add new books
- Update book information
- Delete books
- Borrow books
- View borrowed books
- Return borrowed books
- JWT-based authentication
- Protected API routes
- User-specific borrowing records
- Secure access to borrowing operations

## 🛠️ Technologies Used

- Node.js
- Express.js
- TypeScript
- MongoDB
- Better Auth JWT
- Jose
- CORS
- dotenv

## 📂 Project Structure

```text
booknook-server/
├── src/
│   ├── config/
│   │   └── db.ts
│   ├── controllers/
│   │   ├── addBook.controller.ts
│   │   ├── books.controller.ts
│   │   ├── borrow.controller.ts
│   │   └── manageBook.controller.ts
│   ├── middleware/
│   │   └── auth.middleware.ts
│   ├── routes/
│   │   ├── books.routes.ts
│   │   └── borrows.routes.ts
│   └── server.ts
├── .gitignore
├── package.json
└── tsconfig.json
```

## ⚙️ Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/tasneem28892/booknook-server.git
```

### 2. Navigate to the project folder

```bash
cd booknook-server
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the root directory and add your credentials:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

### 5. Run the development server

```bash
npm run dev
```

The backend server will run at:

`http://localhost:5000`

## 🔗 API Endpoints

### Books

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/books` | Get all books |
| GET | `/api/books/:id` | Get a book by ID |
| POST | `/api/books` | Add a new book |
| PATCH | `/api/books/:id` | Update a book |
| DELETE | `/api/books/:id` | Delete a book |

### Borrowing

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/borrows` | Get current user's borrows |
| GET | `/api/borrows/user` | Get current user's borrowed books |
| POST | `/api/borrows` | Borrow a book |
| DELETE | `/api/borrows/:id` | Return a borrowed book |

**Note:** Protected endpoints require a valid JWT token in the Authorization header.

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

## 🔗 Frontend Repository

[BookNook Client](https://github.com/tasneem28892/booknook)

## 👩‍💻 Developer

**Tasneem Rezwana**

GitHub: [@tasneem28892](https://github.com/tasneem28892)

---

Made with ❤️ for BookNook.
