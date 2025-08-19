import Header from "@/components/Header";
import Footer from "@/components/Footer";

const LoanCalculatorPageTest = () => {
  console.log("Test page is loading...");
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center">Loan Calculator Test Page</h1>
        <p className="text-center mt-4">This is a test page to check if routing works.</p>
      </div>
      <Footer />
    </div>
  );
};

export default LoanCalculatorPageTest;