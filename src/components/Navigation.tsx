import React from "react";
import { Link } from "react-router-dom";

const Navigation: React.FC = () => {
  return (
    <nav className="w-full flex items-center justify-between py-4 px-8 bg-white shadow-md">
      <div className="text-xl font-bold text-gray-800">
        <Link to="/">FaceToGlow</Link>
      </div>
      <ul className="flex space-x-6 text-gray-700 font-medium">
        <li><Link to="/products">Products</Link></li>
        <li><Link to="/questionnaire">Questionnaire</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/subscription">Subscription</Link></li>
      </ul>
    </nav>
  );
};

export default Navigation;
