import SEO from "@/components/SEO";

const Index = () => {
  console.log("Index component rendering");
  
  return (
    <>
      <SEO 
        title="Halo Business Finance | SBA Loans, Commercial Financing & Bridge Loans"
        description="Get SBA loans, conventional commercial financing, bridge loans, and equipment financing. Fast approval, competitive rates. Trusted by 2,500+ businesses nationwide."
      />
      <div style={{ padding: '20px', backgroundColor: 'blue', color: 'white', minHeight: '100vh' }}>
        <h1>REACT IS WORKING! INDEX PAGE LOADED!</h1>
        <p>SEO component added - checking if this works.</p>
      </div>
    </>
  );
};

export default Index;
