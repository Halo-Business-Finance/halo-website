import { useEffect } from "react";


const App = () => {
  console.log('App function called...');
  
  // Simple useEffect to test if React hooks work
  useEffect(() => {
    console.log('useEffect fired - React is working!');
  }, []);

  console.log('App component starting to render...');
  
  return (
    <div className="min-h-screen bg-background">
      <h1 className="text-2xl font-bold p-4">Testing Basic Render</h1>
      <p className="p-4">If you can see this, React is working.</p>
    </div>
  );
};

export default App;
