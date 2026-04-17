import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ActiveLoans from "../components/ActiveLoans";
import api from "../services/api";


export default function Dashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Form fields
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [category, setCategory] = useState("");
  const [totalCopies, setTotalCopies] = useState("");
  const [editingBookId, setEditingBookId] = useState(null);
  const [myLoans, setMyLoans] = useState([]);

  const fetchMyLoans = async () => {
    try {
      const response = await api.get("/borrow/my-loans");
      setMyLoans(response.data);
    } catch (error) {
      console.error("Failed to fetch personal loans", error);
    }
  };


  useEffect(() => {
  fetchBooks();
  const role = localStorage.getItem("role");
  if (role === "MEMBER") {
    fetchMyLoans();
  }
}, []);


  // Function to delete a book
  const handleDelete = async (bookId) => {
    const password = window.prompt("Enter Admin Password to deactivate this book:");
    if (!password) return;

    try {
      const response = await api.post(`/books/${bookId}/delete`, {
        password: password
      });

      alert(response.data);
      fetchBooks();
    } catch (error) {
      const message = error.response?.data || "Authorization failed";
      alert(message);
    }
  };

  // Function to populate the form with existing book data
  const openEditForm = (book) => {
    setEditingBookId(book.id);
    setTitle(book.title);
    setAuthor(book.author);
    setIsbn(book.isbn);
    setCategory(book.category);
    setTotalCopies(book.totalCopies.toString());
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Function to clear form and exit edit mode
  const resetForm = () => {
    setTitle("");
    setAuthor("");
    setIsbn("");
    setCategory("");
    setTotalCopies("");
    setEditingBookId(null);
    setShowForm(false);
  };


  const fetchBooks = async () => {
    try {
      const response = await api.get("/books");
      setBooks(response.data);
    } catch (error) {
      console.error("Failed to fetch books", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async (bookId) => {
    try {
      const response = await api.post(`/borrow/${bookId}`);


      alert(response.data || "Book borrowed successfully!");
      await Promise.all([fetchBooks(), fetchMyLoans()]);

    } catch (error) {
      console.error("Borrowing failed:", error)
      const errorMessage = error.response?.data || "An unexpected error occurred while borrowing.";
      alert(errorMessage);
    }
  };

  const handleReturn = async (bookId) => {
    try {
      const response = await api.post(`/borrow/return/${bookId}`);
      alert(response.data);
      await Promise.all([
        fetchBooks(),
        fetchMyLoans()
      ]);
    } catch (error) {
      alert(error.response?.data || "Failed to return book");
    }
  };


  const handleAddBook = async (e) => {
    e.preventDefault();
    const parsedCopies = Number(totalCopies);
    if (isNaN(parsedCopies) || parsedCopies < 0) {
      alert("Please enter a valid number for Total Copies (0 or more).");
      return;
    }

    const bookData = {
      title,
      author,
      isbn,
      category,
      totalCopies: parsedCopies,
    };

    try {
      if (editingBookId) {
        await api.put(`/books/${editingBookId}`, bookData);
        alert("Book updated successfully!");
      } else {
        await api.post("/books", bookData);
        alert("Book added successfully!");
      }

      resetForm();
      fetchBooks();
    } catch (error) {
      console.error("Failed to save book", error);
      const errorMsg = error.response?.data || "Operation failed. Ensure you are ADMIN.";
      alert(errorMsg);
    }
  };
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const filteredBooks = useMemo(() => {
    return books.filter((book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [books, searchTerm]);

  // Stats Configuration
  const stats = [
    {
      label: "Total Books",
      value: books.length,
      color: "text-blue-600",
      bg: "bg-blue-50",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      label: "Categories",
      value: [...new Set(books.map(b => b.category))].length,
      color: "text-purple-600",
      bg: "bg-purple-50",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      )
    },
    {
      label: "Total Copies",
      value: books.reduce((acc, curr) => acc + curr.totalCopies, 0),
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-8 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Library Catalog</h1>
            <p className="text-slate-500 mt-1">
              Welcome back, <span className="font-medium text-slate-700">{username || "User"}</span>
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative w-full md:w-64 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Admin Add Button  */}
            {role === "ADMIN" && (
              <button
                onClick={() => (showForm ? resetForm() : setShowForm(true))}
                className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
              >
                {showForm ? "Cancel" : "Add Book"}
                <svg className={`w-4 h-4 transition-transform ${showForm ? "rotate-45" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            )}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-red-600 hover:bg-red-50 hover:border-red-100 px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm"
            >
              Logout
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {loading ? "..." : stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ADMIN FORM */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-blue-100 shadow-xl p-6 md:p-8 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">
                {editingBookId ? "Update Book Details" : "Add New Book"}
              </h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleAddBook} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Title</label>
                <input required placeholder="Enter book title" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Author</label>
                <input required placeholder="Enter author name" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" value={author} onChange={(e) => setAuthor(e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">ISBN</label>
                <input required placeholder="ISBN Number" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" value={isbn} onChange={(e) => setIsbn(e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Category</label>
                <input required placeholder="e.g. Fiction, Science" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" value={category} onChange={(e) => setCategory(e.target.value)} />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Total Copies</label>
                <input
                  required type="text" inputMode="numeric" placeholder="How many copies?"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  value={totalCopies}
                  onChange={(e) => setTotalCopies(e.target.value.replace(/\D/g, ""))}
                />
              </div>

              <div className="md:col-span-2 flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition shadow-sm hover:shadow">
                  {editingBookId ? "Update Changes" : "Save Book"}
                </button>
                <button type="button" onClick={resetForm} className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ACTIVE LOANS (USER CART) COMPONENT */}
        {role === "MEMBER" && myLoans.length > 0 && (
          <ActiveLoans
            loans={myLoans}
            onReturn={handleReturn}
          />
        )}

        {/* Content Area */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">
              {searchTerm ? `Results for "${searchTerm}"` : "All Books"}
            </h2>
            <span className="text-xs font-semibold text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
              {filteredBooks.length} items
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, n) => <BookSkeleton key={n} />)}
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-200">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 mb-3">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-slate-900">No books found</h3>
              <p className="text-sm text-gray-500 mt-1">Try adjusting your search terms.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onBorrow={() => handleBorrow(book.id)}
                  onReturn={() => handleReturn(book.id)}
                  onEdit={() => openEditForm(book)}
                  onDelete={() => handleDelete(book.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );


  // --- Sub-components  ---
  function BookCard({ book, onBorrow, onReturn, onEdit, onDelete }) {
    const role = localStorage.getItem("role");
    const availabilityPct = (book.availableCopies / book.totalCopies) * 100;
    const isLowStock = book.availableCopies < 3;

    const isInactive = book.active === false;

    return (
      <div className={`group rounded-2xl border p-6 shadow-sm transition-all duration-300 relative overflow-hidden ${isInactive
          ? 'bg-gray-50 border-gray-200 opacity-80 grayscale-[0.8]'
          : 'bg-white border-gray-100 hover:shadow-xl hover:-translate-y-1'
        }`}>

        {/* Visual background decoration */}
        <div className={`absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full blur-xl opacity-70 transition-transform duration-500 group-hover:scale-150 ${isInactive ? 'bg-gray-200' : 'bg-gradient-to-br from-blue-50 to-blue-100/50'
          }`} />

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold tracking-wide uppercase ${isInactive ? 'bg-gray-200 text-gray-500' : 'bg-slate-100 text-slate-600'
              }`}>
              {book.category}
            </span>

            {/* ARCHIVED BADGE */}
            {isInactive && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-black bg-gray-600 text-white tracking-tighter uppercase animate-pulse">
                Archived
              </span>
            )}
          </div>

          <h3 className={`text-xl font-bold mb-1 line-clamp-1 transition-colors ${isInactive ? 'text-gray-500' : 'text-slate-900 group-hover:text-blue-600'
            }`}>
            {book.title}
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            by <span className={`font-medium ${isInactive ? 'text-gray-400' : 'text-slate-700'}`}>{book.author}</span>
          </p>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Availability</span>
              <span className={`font-bold ${isInactive ? 'text-gray-400' : isLowStock ? 'text-rose-600' : 'text-emerald-600'}`}>
                {book.availableCopies} <span className="text-gray-400 font-normal">/ {book.totalCopies}</span>
              </span>
            </div>

            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${isInactive ? 'bg-gray-300' : isLowStock ? 'bg-rose-500' : 'bg-emerald-500'
                  }`}
                style={{ width: `${availabilityPct}%` }}
              />
            </div>

            {/* Action Buttons for Members */}
            {role === "MEMBER" && (
              <div className="flex gap-2 pt-4">
                <button
                  onClick={onBorrow}
                  disabled={book.availableCopies === 0 || isInactive}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-semibold transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isInactive ? "Unavailable" : "Borrow"}
                </button>
                {!isInactive && (
                  <button
                    onClick={onReturn}
                    className="flex-1 border border-blue-600 text-blue-600 hover:bg-blue-50 py-2 rounded-lg text-sm font-semibold transition"
                  >
                    Return
                  </button>
                )}
              </div>
            )}

            {/* Action Buttons for Admins */}
            {role === "ADMIN" && (
              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => onEdit(book)}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg text-sm font-semibold transition shadow-sm"
                >
                  Edit
                </button>

                {/* Only show Deactivate button if the book is still active */}
                {!isInactive ? (
                  <button
                    onClick={() => onDelete(book.id)}
                    className="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-2 rounded-lg text-sm font-semibold transition shadow-sm"
                  >
                    Deactivate
                  </button>
                ) : (
                  <button
                    disabled
                    className="flex-1 bg-gray-400 text-white py-2 rounded-lg text-sm font-semibold cursor-not-allowed shadow-sm"
                  >
                    Inactive
                  </button>
                )}
              </div>
            )}

            {isLowStock && !isInactive && book.availableCopies !== 0 && (
              <div className="flex items-center gap-2 text-xs text-rose-600 font-bold mt-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Low Stock Warning
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  function BookSkeleton() {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm animate-pulse">
        {/* Category tag skeleton */}
        <div className="w-16 h-5 bg-gray-100 rounded-md mb-4"></div>

        {/* Title skeleton */}
        <div className="h-7 w-3/4 bg-gray-200 rounded-lg mb-2"></div>

        {/* Author skeleton */}
        <div className="h-4 w-1/2 bg-gray-100 rounded mb-8"></div>

        {/* Availability text skeleton */}
        <div className="flex justify-between mb-2">
          <div className="h-4 w-20 bg-gray-100 rounded"></div>
          <div className="h-4 w-10 bg-gray-200 rounded"></div>
        </div>

        {/* Progress bar skeleton */}
        <div className="h-2 w-full bg-gray-100 rounded-full mb-6"></div>

        {/* Button group skeleton */}
        <div className="flex gap-2">
          <div className="h-9 flex-1 bg-gray-100 rounded-lg"></div>
          <div className="h-9 flex-1 bg-gray-100 rounded-lg"></div>
        </div>
      </div>
    );
  }
}