import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../models/Catagory";
import Book from "../models/Book";

dotenv.config();

const seedData = [
  {
    category: "Fiction",
    books: [
      {
        title: "The Midnight Library",
        author: "Matt Haig",
        isbn: "978-0525559474",
        quantity: 5,
        coverImage: "https://images-na.ssl-images-amazon.com/images/P/0525559477.01.LZZZZZZZ.jpg",
        description: "Between life and death there is a library, and within that library, the shelves go on forever."
      },
      {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        isbn: "978-0743273565",
        quantity: 6,
        coverImage: "https://images-na.ssl-images-amazon.com/images/P/0743273567.01.LZZZZZZZ.jpg",
        description: "A portrait of the Jazz Age exploring obsession, decadence, idealism, and social upheaval."
      },
      {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        isbn: "978-0060935467",
        quantity: 8,
        coverImage: "https://images-na.ssl-images-amazon.com/images/P/0060935464.01.LZZZZZZZ.jpg",
        description: "A gripping tale of racial injustice and the destruction of innocence in the American Deep South."
      },
      {
        title: "1984",
        author: "George Orwell",
        isbn: "978-0451524935",
        quantity: 10,
        coverImage: "https://images-na.ssl-images-amazon.com/images/P/0451524934.01.LZZZZZZZ.jpg",
        description: "A dystopian masterpiece examining totalitarian surveillance, thoughtcrime, and totalitarian control."
      },
      {
        title: "Pride and Prejudice",
        author: "Jane Austen",
        isbn: "978-0141439518",
        quantity: 4,
        coverImage: "https://images-na.ssl-images-amazon.com/images/P/0141439513.01.LZZZZZZZ.jpg",
        description: "A classic romance exploring manners, marriage, and misunderstandings in 19th-century England."
      }
    ]
  },
  {
    category: "History",
    books: [
      {
        title: "Sapiens: A Brief History of Humankind",
        author: "Yuval Noah Harari",
        isbn: "978-0062316097",
        quantity: 9,
        coverImage: "https://images-na.ssl-images-amazon.com/images/P/0062316095.01.LZZZZZZZ.jpg",
        description: "A sweeping narrative exploring 100,000 years of human evolution, cognitive revolutions, and societal structures."
      },
      {
        title: "Guns, Germs, and Steel",
        author: "Jared Diamond",
        isbn: "978-0393354324",
        quantity: 5,
        coverImage: "https://images-na.ssl-images-amazon.com/images/P/0393354326.01.LZZZZZZZ.jpg",
        description: "An examination of geographic and environmental factors that shaped the fate of human societies."
      },
      {
        title: "The Silk Roads",
        author: "Peter Frankopan",
        isbn: "978-1101912379",
        quantity: 6,
        coverImage: "https://images-na.ssl-images-amazon.com/images/P/1101912375.01.LZZZZZZZ.jpg",
        description: "A major reassessment of world history centering on the crucial networks connecting East and West."
      },
      {
        title: "A People's History of the United States",
        author: "Howard Zinn",
        isbn: "978-0062397348",
        quantity: 4,
        coverImage: "https://images-na.ssl-images-amazon.com/images/P/0062397346.01.LZZZZZZZ.jpg",
        description: "American history told through the grassroots perspectives of workers, minorities, and marginalized groups."
      },
      {
        title: "SPQR: A History of Ancient Rome",
        author: "Mary Beard",
        isbn: "978-1631492228",
        quantity: 5,
        coverImage: "https://images-na.ssl-images-amazon.com/images/P/1631492225.01.LZZZZZZZ.jpg",
        description: "A fresh look at the Roman Empire from one of the world's foremost classicists."
      }
    ]
  },
  {
    category: "Science",
    books: [
      {
        title: "A Brief History of Time",
        author: "Stephen Hawking",
        isbn: "978-0553380163",
        quantity: 7,
        coverImage: "https://images-na.ssl-images-amazon.com/images/P/0553380168.01.LZZZZZZZ.jpg",
        description: "An accessible introduction to black holes, general relativity, quantum gravity, and the universe's fate."
      },
      {
        title: "Cosmos",
        author: "Carl Sagan",
        isbn: "978-0345539434",
        quantity: 8,
        coverImage: "https://images-na.ssl-images-amazon.com/images/P/0345539435.01.LZZZZZZZ.jpg",
        description: "A poetic journey through 15 billion years of cosmic evolution and scientific discovery."
      },
      {
        title: "The Selfish Gene",
        author: "Richard Dawkins",
        isbn: "978-0198788607",
        quantity: 5,
        coverImage: "https://images-na.ssl-images-amazon.com/images/P/0198788606.01.LZZZZZZZ.jpg",
        description: "A foundational text on the gene-centric view of evolution and the origin of altruism."
      },
      {
        title: "The Gene: An Intimate History",
        author: "Siddhartha Mukherjee",
        isbn: "978-1476733524",
        quantity: 6,
        coverImage: "https://images-na.ssl-images-amazon.com/images/P/1476733523.01.LZZZZZZZ.jpg",
        description: "The story of heredity and human genetics, balancing cutting-edge science with moral questions."
      },
      {
        title: "The Structure of Scientific Revolutions",
        author: "Thomas S. Kuhn",
        isbn: "978-0226458120",
        quantity: 3,
        coverImage: "https://images-na.ssl-images-amazon.com/images/P/0226458121.01.LZZZZZZZ.jpg",
        description: "The landmark work that coined the term 'paradigm shift' and reshaped our view of scientific progress."
      }
    ]
  },
  {
    category: "Biography",
    books: [
      {
        title: "Steve Jobs",
        author: "Walter Isaacson",
        isbn: "978-1451648539",
        quantity: 8,
        coverImage: "https://images-na.ssl-images-amazon.com/images/P/1451648537.01.LZZZZZZZ.jpg",
        description: "The bestselling biography chronicling the intense life and creative genius of Apple's co-founder."
      },
      {
        title: "Educated",
        author: "Tara Westover",
        isbn: "978-0399590504",
        quantity: 9,
        coverImage: "https://images-na.ssl-images-amazon.com/images/P/0399590501.01.LZZZZZZZ.jpg",
        description: "A memoir about growing up isolated in rural Idaho and striving for knowledge through self-education."
      },
      {
        title: "Becoming",
        author: "Michelle Obama",
        isbn: "978-1524763138",
        quantity: 11,
        coverImage: "https://images-na.ssl-images-amazon.com/images/P/1524763136.01.LZZZZZZZ.jpg",
        description: "An intimate and inspiring memoir by the former First Lady of the United States."
      },
      {
        title: "Long Walk to Freedom",
        author: "Nelson Mandela",
        isbn: "978-0316548182",
        quantity: 5,
        coverImage: "https://images-na.ssl-images-amazon.com/images/P/0316548189.01.LZZZZZZZ.jpg",
        description: "The autobiography of the anti-apartheid leader, political prisoner, and president of South Africa."
      },
      {
        title: "The Diary of a Young Girl",
        author: "Anne Frank",
        isbn: "978-0553296983",
        quantity: 7,
        coverImage: "https://images-na.ssl-images-amazon.com/images/P/0553296981.01.LZZZZZZZ.jpg",
        description: "The moving personal reflections of a young Jewish girl in hiding during the Nazi occupation of Amsterdam."
      }
    ]
  },
  {
    category: "Fantasy",
    books: [
      {
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        isbn: "978-0345339683",
        quantity: 8,
        coverImage: "https://images-na.ssl-images-amazon.com/images/P/0345339681.01.LZZZZZZZ.jpg",
        description: "The unforgettable journey of Bilbo Baggins as he seeks to reclaim a lost treasure from a dragon."
      },
      {
        title: "A Game of Thrones",
        author: "George R.R. Martin",
        isbn: "978-0553593716",
        quantity: 6,
        coverImage: "https://images-na.ssl-images-amazon.com/images/P/0553593714.01.LZZZZZZZ.jpg",
        description: "The epic fantasy opener chronicling betrayal, power struggles, and winter descending on Westeros."
      },
      {
        title: "The Name of the Wind",
        author: "Patrick Rothfuss",
        isbn: "978-0756404741",
        quantity: 7,
        coverImage: "https://images-na.ssl-images-amazon.com/images/P/0756404746.01.LZZZZZZZ.jpg",
        description: "The tale of Kvothe, an orphan who grows to become a legendary wizard, musician, and rogue."
      },
      {
        title: "The Way of Kings",
        author: "Brandon Sanderson",
        isbn: "978-0765365279",
        quantity: 5,
        coverImage: "https://images-na.ssl-images-amazon.com/images/P/0765365278.01.LZZZZZZZ.jpg",
        description: "The sprawling opening volume of the Stormlight Archive set on the highstorm-ravaged world of Roshar."
      },
      {
        title: "Mistborn: The Final Empire",
        author: "Brandon Sanderson",
        isbn: "978-0765350381",
        quantity: 6,
        coverImage: "https://images-na.ssl-images-amazon.com/images/P/0765350386.01.LZZZZZZZ.jpg",
        description: "A crew of allomantic thieves plots an impossible heist to overthrow an immortal tyrant."
      }
    ]
  },
  {
    category: "Science Fiction",
    books: [
      {
        title: "Dune",
        author: "Frank Herbert",
        isbn: "978-0441172719",
        quantity: 9,
        coverImage: "https://images-na.ssl-images-amazon.com/images/P/0441172717.01.LZZZZZZZ.jpg",
        description: "Set on the desert planet Arrakis, Paul Atreides navigates political intrigue, religion, and giant sandworms."
      },
      {
        title: "Neuromancer",
        author: "William Gibson",
        isbn: "978-0441569595",
        quantity: 4,
        coverImage: "https://images-na.ssl-images-amazon.com/images/P/0441569595.01.LZZZZZZZ.jpg",
        description: "The foundational cyberpunk novel about a washed-up computer hacker hired for a final run."
      },
      {
        title: "The Three-Body Problem",
        author: "Cixin Liu",
        isbn: "978-0765382030",
        quantity: 7,
        coverImage: "https://images-na.ssl-images-amazon.com/images/P/0765382032.01.LZZZZZZZ.jpg",
        description: "A military project sends signals into space, leading to contact with an alien civilization on the brink."
      },
      {
        title: "Foundation",
        author: "Isaac Asimov",
        isbn: "978-0553293357",
        quantity: 6,
        coverImage: "https://images-na.ssl-images-amazon.com/images/P/0553293354.01.LZZZZZZZ.jpg",
        description: "Hari Seldon invents psychohistory to preserve human knowledge across thousands of years of dark age."
      },
      {
        title: "Hyperion",
        author: "Dan Simmons",
        isbn: "978-0553283686",
        quantity: 5,
        coverImage: "https://images-na.ssl-images-amazon.com/images/P/0553283685.01.LZZZZZZZ.jpg",
        description: "Seven pilgrims travel to the Time Tombs on Hyperion to petition the terrifying creature known as the Shrike."
      }
    ]
  },
  {
    category: "Philosophy",
    books: [
      {
        title: "Meditations",
        author: "Marcus Aurelius",
        isbn: "978-0812968255",
        quantity: 12,
        coverImage: "https://images-na.ssl-images-amazon.com/images/P/0812968255.01.LZZZZZZZ.jpg",
        description: "Personal journals of the Roman Emperor presenting enduring Stoic wisdom on duty, resilience, and mortality."
      },
      {
        title: "Beyond Good and Evil",
        author: "Friedrich Nietzsche",
        isbn: "978-0140449235",
        quantity: 6,
        coverImage: "https://images-na.ssl-images-amazon.com/images/P/0140449232.01.LZZZZZZZ.jpg",
        description: "A critique of traditional Western philosophy, dogmatism, and the nature of morality."
      },
      {
        title: "Critique of Pure Reason",
        author: "Immanuel Kant",
        isbn: "978-0521657297",
        quantity: 3,
        coverImage: "https://images-na.ssl-images-amazon.com/images/P/0521657296.01.LZZZZZZZ.jpg",
        description: "A foundational work investigating the boundaries, scope, and synthetic nature of human understanding."
      },
      {
        title: "The Republic",
        author: "Plato",
        isbn: "978-0140455113",
        quantity: 8,
        coverImage: "https://images-na.ssl-images-amazon.com/images/P/0140455116.01.LZZZZZZZ.jpg",
        description: "Socratic dialogues examining justice, governance, the philosopher-king, and the allegory of the cave."
      },
      {
        title: "Being and Time",
        author: "Martin Heidegger",
        isbn: "978-0061575594",
        quantity: 4,
        coverImage: "https://images-na.ssl-images-amazon.com/images/P/0061575593.01.LZZZZZZZ.jpg",
        description: "A rigorous existential exploration into what it fundamentally means to exist as a conscious being."
      }
    ]
  },
  {
    category: "Technology",
    books: [
      {
        title: "Clean Code",
        author: "Robert C. Martin",
        isbn: "978-0132350884",
        quantity: 10,
        coverImage: "https://images-na.ssl-images-amazon.com/images/P/0132350882.01.LZZZZZZZ.jpg",
        description: "A practical guide to software craftsmanship, principles, refactoring patterns, and maintainable systems."
      },
      {
        title: "The Pragmatic Programmer",
        author: "David Thomas, Andrew Hunt",
        isbn: "978-0135957059",
        quantity: 8,
        coverImage: "https://images-na.ssl-images-amazon.com/images/P/0135957052.01.LZZZZZZZ.jpg",
        description: "Essential career and technical advice for software developers building robust, resilient architectures."
      },
      {
        title: "Design Patterns",
        author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
        isbn: "978-0201633610",
        quantity: 6,
        coverImage: "https://images-na.ssl-images-amazon.com/images/P/0201633612.01.LZZZZZZZ.jpg",
        description: "The Gang of Four's definitive catalog of reusable object-oriented architectural patterns."
      },
      {
        title: "Designing Data-Intensive Applications",
        author: "Martin Kleppmann",
        isbn: "978-1449373320",
        quantity: 9,
        coverImage: "https://images-na.ssl-images-amazon.com/images/P/1449373321.01.LZZZZZZZ.jpg",
        description: "The industry standard guide to reliability, scalability, and maintainability in distributed systems."
      },
      {
        title: "Structure and Interpretation of Computer Programs",
        author: "Harold Abelson, Gerald Jay Sussman",
        isbn: "978-0262510875",
        quantity: 4,
        coverImage: "https://images-na.ssl-images-amazon.com/images/P/0262510871.01.LZZZZZZZ.jpg",
        description: "The legendary MIT text introducing core concepts of programming abstraction, interpreters, and state."
      }
    ]
  },
  {
    category: "Psychology",
    books: [
      {
        title: "Thinking, Fast and Slow",
        author: "Daniel Kahneman",
        isbn: "978-0374533557",
        quantity: 8,
        coverImage: "https://images-na.ssl-images-amazon.com/images/P/0374533555.01.LZZZZZZZ.jpg",
        description: "The Nobel laureate details the two modes of thought that drive human judgment, intuition, and bias."
      },
      {
        title: "Man's Search for Meaning",
        author: "Viktor E. Frankl",
        isbn: "978-0807014295",
        quantity: 7,
        coverImage: "https://images-na.ssl-images-amazon.com/images/P/080701429X.01.LZZZZZZZ.jpg",
        description: "A psychiatrist reflects on surviving concentration camps and developing logotherapy centered on human purpose."
      },
      {
        title: "Atomic Habits",
        author: "James Clear",
        isbn: "978-0735211292",
        quantity: 15,
        coverImage: "https://images-na.ssl-images-amazon.com/images/P/0735211299.01.LZZZZZZZ.jpg",
        description: "A framework for making microscopic daily adjustments that yield compound self-improvement over time."
      },
      {
        title: "Influence: The Psychology of Persuasion",
        author: "Robert B. Cialdini",
        isbn: "978-0061241895",
        quantity: 6,
        coverImage: "https://images-na.ssl-images-amazon.com/images/P/006124189X.01.LZZZZZZZ.jpg",
        description: "An examination of the six universal principles of human influence and compliance."
      },
      {
        title: "The Body Keeps the Score",
        author: "Bessel van der Kolk",
        isbn: "978-0143127741",
        quantity: 9,
        coverImage: "https://images-na.ssl-images-amazon.com/images/P/0143127748.01.LZZZZZZZ.jpg",
        description: "How psychological trauma reshapes body and brain, with innovative pathways to emotional recovery."
      }
    ]
  },
  {
    category: "Business",
    books: [
      {
        title: "Zero to One",
        author: "Peter Thiel, Blake Masters",
        isbn: "978-0804139298",
        quantity: 8,
        coverImage: "https://images-na.ssl-images-amazon.com/images/P/0804139296.01.LZZZZZZZ.jpg",
        description: "Notes on startups and strategies for building companies that create entirely new markets."
      },
      {
        title: "The Lean Startup",
        author: "Eric Ries",
        isbn: "978-0307887894",
        quantity: 7,
        coverImage: "https://images-na.ssl-images-amazon.com/images/P/0307887898.01.LZZZZZZZ.jpg",
        description: "A continuous-innovation framework for building businesses using minimum viable products and agile testing."
      },
      {
        title: "Good to Great",
        author: "Jim Collins",
        isbn: "978-0066620992",
        quantity: 6,
        coverImage: "https://images-na.ssl-images-amazon.com/images/P/0066620996.01.LZZZZZZZ.jpg",
        description: "A management study uncovering the defining factors that separate enduring corporate giants from mediocre peers."
      },
      {
        title: "Principles: Life and Work",
        author: "Ray Dalio",
        isbn: "978-1501124020",
        quantity: 5,
        coverImage: "https://images-na.ssl-images-amazon.com/images/P/1501124021.01.LZZZZZZZ.jpg",
        description: "Bridgewater founder's unconventional rules for radical truth, transparent culture, and decision-making."
      },
      {
        title: "The Hard Thing About Hard Things",
        author: "Ben Horowitz",
        isbn: "978-0062273208",
        quantity: 6,
        coverImage: "https://images-na.ssl-images-amazon.com/images/P/0062273205.01.LZZZZZZZ.jpg",
        description: "Unvarnished insights on managing startups through crises, layoffs, executive disputes, and market collapse."
      }
    ]
  }
];

const seedLibraryCatalog = async () => {
  try {
    const mongoUri = process.env.MONGO_URI ?? "mongodb://localhost:27017/library_db";
    await mongoose.connect(mongoUri);
    console.log("🌱 Connected to MongoDB. Preparing library inventory seed...");

    // 1. Clear existing collections
    await Book.deleteMany({});
    await Category.deleteMany({});
    console.log("🧹 Wiped existing Book and Category collections clean.");

    let totalBooksCount = 0;

    // 2. Loop and map records through local data blocks
    for (const genreBlock of seedData) {
      const dbCategory = await Category.create({ name: genreBlock.category });
      console.log(`📂 Created Category: ${dbCategory.name} (ID: ${dbCategory._id})`);

      const booksToInsert = genreBlock.books.map((bookItem) => ({
        title: bookItem.title,
        author: bookItem.author,
        isbn: bookItem.isbn,
        quantity: bookItem.quantity,
        coverImage: bookItem.coverImage,
        description: bookItem.description,
        categoryId: dbCategory._id
      }));

      await Book.insertMany(booksToInsert);
      totalBooksCount += booksToInsert.length;
      console.log(`✅ Seeded ${booksToInsert.length} books into "${dbCategory.name}"`);
    }

    console.log(`\n🎉 Inventory Provision Complete! ${seedData.length} categories and ${totalBooksCount} books are completely loaded into MongoDB.`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error: any) {
    console.error("❌ Inventory catalog seeding crashed:", error.message);
    process.exit(1);
  }
};

seedLibraryCatalog();