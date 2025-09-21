import React from "react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navigation />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">Welcome to FaceToGlow</h1>
          <p className="text-xl text-muted-foreground">Start building your amazing project here!</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
