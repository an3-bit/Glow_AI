import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-4 px-8 bg-gray-100 text-center text-gray-500 text-sm mt-8 border-t">
      © {new Date().getFullYear()} FaceToGlow. All rights reserved.
    </footer>
  );
};

export default Footer;
