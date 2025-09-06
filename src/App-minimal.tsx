import { BrowserRouter, Routes, Route } from "react-router-dom";

const MinimalIndex = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <h1 className="text-4xl font-bold text-center pt-20">
        Halo Business Finance - Loading Test
      </h1>
      <p className="text-center mt-4">
        If you can see this, the basic app is working.
      </p>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MinimalIndex />} />
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;