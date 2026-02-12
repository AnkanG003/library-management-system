import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="flex  justify-between items-center px-8 py-4 bg-white shadow-sm ">
            <h1 className="text-xl font-bold text-blue-600">
                Library Management System
            </h1>

            <div className="space-x-4">
                <Link to="/login" className="text-grey hover:text-blue-600">
                    Login
                </Link>

                <Link
                    to="/register"
                    className="text-white bg-gradient-to-br from-green-400 to-blue-600
             hover:bg-gradient-to-bl
             transform transition-transform duration-200
             hover:scale-105
             focus:ring-4 focus:outline-none
             focus:ring-green-200 dark:focus:ring-green-800
             font-medium text-sm px-4 py-2.5 text-center
             leading-5 rounded-2xl">
                    Register
                </Link>



            </div>
        </nav>
    );
}
