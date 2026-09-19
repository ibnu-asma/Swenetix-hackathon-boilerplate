import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import Category from "../models/Catagory";
import Book from "../models/Book";
import Borrowing from "../models/Borrowing";

dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI ?? "mongodb://localhost:27017/library_db";
    console.log("🔌 Connecting to MongoDB:", mongoUri);
    await mongoose.connect(mongoUri);
    console.log("🌱 Connected to MongoDB successfully.");

    // 1. CLEAR EXISTING DATA ACROSS ALL MODELS
    console.log("🧹 Clearing existing database records...");
    await Promise.all([
      Borrowing.deleteMany({}),
      Book.deleteMany({}),
      Category.deleteMany({}),
      User.deleteMany({}),
    ]);
    console.log("✅ All collections cleared (Borrowings, Books, Categories, Users).");

    // 2. SEED USERS
    console.log("👤 Seeding users...");
    const hashedPassword = await bcrypt.hash("LibraryPass123!", 10);

    const usersToSeed = [
      // Librarians / Admins
      {
        firstName: "Chief",
        lastName: "Librarian",
        email: "librarian@library.com",
        password: hashedPassword,
        role: "librarian",
        profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
      },
      {
        firstName: "Eleanor",
        lastName: "Vance",
        email: "admin@library.com",
        password: hashedPassword,
        role: "librarian",
        profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
      },
      // Members / Students
      {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: hashedPassword,
        role: "member",
        profileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400",
      },
      {
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        password: hashedPassword,
        role: "member",
        profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
      },
      {
        firstName: "Michael",
        lastName: "Johnson",
        email: "michael.j@example.com",
        password: hashedPassword,
        role: "member",
        profileImage: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=400",
      },
      {
        firstName: "Emily",
        lastName: "Davis",
        email: "emily.d@example.com",
        password: hashedPassword,
        role: "member",
        profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400",
      },
      {
        firstName: "David",
        lastName: "Brown",
        email: "david.b@example.com",
        password: hashedPassword,
        role: "member",
        profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
      },
      {
        firstName: "Sarah",
        lastName: "Miller",
        email: "sarah.m@example.com",
        password: hashedPassword,
        role: "member",
        profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
      },
      {
        firstName: "James",
        lastName: "Wilson",
        email: "james.w@example.com",
        password: hashedPassword,
        role: "member",
        profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
      },
      {
        firstName: "Jessica",
        lastName: "Moore",
        email: "jessica.m@example.com",
        password: hashedPassword,
        role: "member",
        profileImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400",
      },
      {
        firstName: "Robert",
        lastName: "Taylor",
        email: "robert.t@example.com",
        password: hashedPassword,
        role: "member",
        profileImage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400",
      },
      {
        firstName: "Amanda",
        lastName: "Anderson",
        email: "amanda.a@example.com",
        password: hashedPassword,
        role: "member",
        profileImage: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400",
      },
    ];

    const createdUsers = await User.insertMany(usersToSeed);
    console.log(`✅ Seeded ${createdUsers.length} users.`);

    // 3. SEED CATEGORIES
    console.log("🏷️  Seeding categories...");
    const categoryNames = [
      "Computer Science & IT",
      "Software Engineering",
      "Data Science & AI",
      "Cybersecurity & Networks",
      "Mathematics & Statistics",
      "Physics & Natural Sciences",
      "Business & Leadership",
      "Philosophy & Ethics",
      "Literature & Classics",
      "Design & UX",
    ];

    const createdCategories = await Category.insertMany(
      categoryNames.map((name) => ({ name }))
    );
    console.log(`✅ Seeded ${createdCategories.length} categories.`);

    // Helper map for quick category lookup by name
    const catMap = new Map(createdCategories.map((c) => [c.name, c._id]));

    // 4. SEED BOOKS
    console.log("📚 Seeding books...");
    const booksToSeed = [
      {
        title: "Clean Architecture: A Craftsman's Guide to Software Structure",
        author: "Robert C. Martin",
        isbn: "978-0134494166",
        categoryId: catMap.get("Software Engineering"),
        quantity: 5,
        coverImage: "https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&q=80&w=800",
        description: "Practical software architecture rules and principles for programmers, software architects, and systems analysts.",
      },
      {
        title: "Designing Data-Intensive Applications",
        author: "Martin Kleppmann",
        isbn: "978-1449373320",
        categoryId: catMap.get("Computer Science & IT"),
        quantity: 4,
        coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800",
        description: "The big ideas behind reliable, scalable, and maintainable systems in modern cloud architectures.",
      },
      {
        title: "Introduction to Algorithms (CLRS), Fourth Edition",
        author: "Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein",
        isbn: "978-0262046305",
        categoryId: catMap.get("Computer Science & IT"),
        quantity: 6,
        coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800",
        description: "A comprehensive update of the leading algorithms textbook, with new chapters on bipartite matching, online algorithms, and machine learning.",
      },
      {
        title: "Deep Learning",
        author: "Ian Goodfellow, Yoshua Bengio, Aaron Courville",
        isbn: "978-0262035613",
        categoryId: catMap.get("Data Science & AI"),
        quantity: 3,
        coverImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800",
        description: "An introduction to a broad range of topics in deep learning, covering mathematical and conceptual background, deep generative models, and research perspectives.",
      },
      {
        title: "Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow",
        author: "Aurélien Géron",
        isbn: "978-1098125974",
        categoryId: catMap.get("Data Science & AI"),
        quantity: 5,
        coverImage: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=800",
        description: "Through concrete examples, minimal theory, and production-ready Python frameworks, explore building intelligent systems.",
      },
      {
        title: "The Pragmatic Programmer: 20th Anniversary Edition",
        author: "David Thomas, Andrew Hunt",
        isbn: "978-0135957059",
        categoryId: catMap.get("Software Engineering"),
        quantity: 7,
        coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
        description: "One of the most significant books on software craftsmanship, illustrating timeless wisdom from career development to architectural choices.",
      },
      {
        title: "Refactoring: Improving the Design of Existing Code",
        author: "Martin Fowler",
        isbn: "978-0134757599",
        categoryId: catMap.get("Software Engineering"),
        quantity: 4,
        coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800",
        description: "Fully updated for JavaScript/modern paradigms, explains principles of refactoring, code smells, and solid testing foundations.",
      },
      {
        title: "The Web Application Hacker's Handbook: Finding and Exploiting Security Flaws",
        author: "Dafydd Stuttard, Marcus Pinto",
        isbn: "978-1118026472",
        categoryId: catMap.get("Cybersecurity & Networks"),
        quantity: 2,
        coverImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800",
        description: "The definitive guide to web security, vulnerabilities, penetration testing techniques, and defense strategies.",
      },
      {
        title: "Computer Networking: A Top-Down Approach",
        author: "James Kurose, Keith Ross",
        isbn: "978-0136681557",
        categoryId: catMap.get("Cybersecurity & Networks"),
        quantity: 6,
        coverImage: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800",
        description: "A top-down approach focusing on the Internet and fundamental networking protocols from application layer to physical layer.",
      },
      {
        title: "Linear Algebra and Its Applications",
        author: "Gilbert Strang",
        isbn: "978-0030105678",
        categoryId: catMap.get("Mathematics & Statistics"),
        quantity: 4,
        coverImage: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=800",
        description: "Renowned exposition of linear algebra theory, vector spaces, eigenvalues, and computational methods.",
      },
      {
        title: "The Art of Statistics: How to Learn from Data",
        author: "David Spiegelhalter",
        isbn: "978-1541618510",
        categoryId: catMap.get("Mathematics & Statistics"),
        quantity: 5,
        coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
        description: "A masterclass in how to evaluate mathematical and statistical arguments, avoid bias, and draw insights from empirical evidence.",
      },
      {
        title: "University Physics with Modern Physics",
        author: "Hugh D. Young, Roger A. Freedman",
        isbn: "978-0135159552",
        categoryId: catMap.get("Physics & Natural Sciences"),
        quantity: 3,
        coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
        description: "Comprehensive calculus-based physics text covering mechanics, electromagnetism, optics, thermodynamics, and quantum phenomena.",
      },
      {
        title: "Zero to One: Notes on Startups, or How to Build the Future",
        author: "Peter Thiel, Blake Masters",
        isbn: "978-0804139298",
        categoryId: catMap.get("Business & Leadership"),
        quantity: 8,
        coverImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800",
        description: "How to build companies that create new things, think for yourself, and discover value in unexpected places.",
      },
      {
        title: "The Lean Startup: How Today's Entrepreneurs Use Continuous Innovation",
        author: "Eric Ries",
        isbn: "978-0307887894",
        categoryId: catMap.get("Business & Leadership"),
        quantity: 6,
        coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
        description: "A revolutionary approach to launching companies and managing continuous rapid iteration under uncertainty.",
      },
      {
        title: "Justice: What's the Right Thing to Do?",
        author: "Michael J. Sandel",
        isbn: "978-0374532505",
        categoryId: catMap.get("Philosophy & Ethics"),
        quantity: 5,
        coverImage: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800",
        description: "An invigorating examination of moral reasoning, political philosophy, and fairness in contemporary society.",
      },
      {
        title: "The Design of Everyday Things: Revised and Expanded Edition",
        author: "Don Norman",
        isbn: "978-0465050659",
        categoryId: catMap.get("Design & UX"),
        quantity: 4,
        coverImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800",
        description: "A foundational work on cognitive ergonomics, usability engineering, and human-centered design principles.",
      },
      {
        title: "1984",
        author: "George Orwell",
        isbn: "978-0451524935",
        categoryId: catMap.get("Literature & Classics"),
        quantity: 8,
        coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=800",
        description: "The dystopian masterpiece exploring totalitarianism, surveillance states, truth distortion, and individual resilience.",
      },
      {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        isbn: "978-0060935467",
        categoryId: catMap.get("Literature & Classics"),
        quantity: 6,
        coverImage: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&q=80&w=800",
        description: "Pulitzer Prize-winning classic novel on race, empathy, honor, and courage in the American South.",
      },
    ];

    const createdBooks = await Book.insertMany(booksToSeed);
    console.log(`✅ Seeded ${createdBooks.length} books.`);

    // 5. SEED BORROWINGS
    console.log("📖 Seeding borrowings...");
    const members = createdUsers.filter((u) => u.role === "member");
    
    // Create diverse borrowing history: active, overdue, and returned records
    const now = new Date();
    
    const borrowingsToSeed = [
      // 1. Active borrowing (due in 10 days) - John Doe
      {
        userId: members[0]._id,
        bookId: createdBooks[0]._id, // Clean Architecture
        borrowedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
        dueDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
        returnDate: null,
        status: "BORROWED" as const,
      },
      // 2. Active borrowing (due in 6 days) - Jane Smith
      {
        userId: members[1]._id,
        bookId: createdBooks[1]._id, // Designing Data-Intensive Applications
        borrowedAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
        dueDate: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000),
        returnDate: null,
        status: "BORROWED" as const,
      },
      // 3. Active borrowing (due in 12 days) - Michael Johnson
      {
        userId: members[2]._id,
        bookId: createdBooks[3]._id, // Deep Learning
        borrowedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        dueDate: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000),
        returnDate: null,
        status: "BORROWED" as const,
      },
      // 4. Overdue borrowing (due 5 days ago) - Emily Davis
      {
        userId: members[3]._id,
        bookId: createdBooks[7]._id, // Web Application Hacker's Handbook
        borrowedAt: new Date(now.getTime() - 19 * 24 * 60 * 60 * 1000),
        dueDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        returnDate: null,
        status: "OVERDUE" as const,
      },
      // 5. Overdue borrowing (due 2 days ago) - David Brown
      {
        userId: members[4]._id,
        bookId: createdBooks[9]._id, // Linear Algebra
        borrowedAt: new Date(now.getTime() - 16 * 24 * 60 * 60 * 1000),
        dueDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        returnDate: null,
        status: "OVERDUE" as const,
      },
      // 6. Returned borrowing - Sarah Miller
      {
        userId: members[5]._id,
        bookId: createdBooks[5]._id, // The Pragmatic Programmer
        borrowedAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        dueDate: new Date(now.getTime() - 16 * 24 * 60 * 60 * 1000),
        returnDate: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000),
        status: "RETURNED" as const,
      },
      // 7. Returned borrowing - James Wilson
      {
        userId: members[6]._id,
        bookId: createdBooks[12]._id, // Zero to One
        borrowedAt: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
        dueDate: new Date(now.getTime() - 11 * 24 * 60 * 60 * 1000),
        returnDate: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000),
        status: "RETURNED" as const,
      },
      // 8. Returned borrowing - John Doe
      {
        userId: members[0]._id,
        bookId: createdBooks[16]._id, // 1984
        borrowedAt: new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000),
        dueDate: new Date(now.getTime() - 26 * 24 * 60 * 60 * 1000),
        returnDate: new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000),
        status: "RETURNED" as const,
      },
      // 9. Returned borrowing - Jane Smith
      {
        userId: members[1]._id,
        bookId: createdBooks[15]._id, // Design of Everyday Things
        borrowedAt: new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000),
        dueDate: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000),
        returnDate: new Date(now.getTime() - 22 * 24 * 60 * 60 * 1000),
        status: "RETURNED" as const,
      },
    ];

    const createdBorrowings = await Borrowing.insertMany(borrowingsToSeed);
    console.log(`✅ Seeded ${createdBorrowings.length} borrowing records.`);

    // 6. SUMMARY TABLE
    console.log("\n==================================================");
    console.log("🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!");
    console.log("==================================================");
    console.log(`👥 Users:       ${createdUsers.length} (2 Librarians/Admins, 10 Members)`);
    console.log(`🏷️  Categories:  ${createdCategories.length}`);
    console.log(`📚 Books:       ${createdBooks.length}`);
    console.log(`📖 Borrowings:  ${createdBorrowings.length} (3 Active, 2 Overdue, 4 Returned)`);
    console.log("--------------------------------------------------");
    console.log("🔑 Default Credentials:");
    console.log("   Admin:    librarian@library.com | admin@library.com");
    console.log("   Member:   john.doe@example.com  | jane.smith@example.com");
    console.log("   Password: LibraryPass123!");
    console.log("==================================================\n");

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();
