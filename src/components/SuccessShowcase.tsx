import sbaLoanHandshake from "@/assets/sba-loan-handshake.jpg";
import businessFinancingMeeting from "@/assets/business-financing-meeting.jpg";
import businessConsultationProfessional from "@/assets/business-consultation-professional.jpg";

const SuccessShowcase = () => {
  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        {/* Success Showcase - Enhanced */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <p className="text-slate-700 text-lg font-medium mb-2">Join successful businesses nationwide</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="relative h-28 rounded-xl overflow-hidden shadow-[var(--shadow-card)]">
              <img 
                src={sbaLoanHandshake} 
                alt="Successful SBA loan approval"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <div className="text-sm font-bold">SBA Loans</div>
                <div className="text-xs text-white/80">Up to $5M</div>
              </div>
            </div>
            <div className="relative h-28 rounded-xl overflow-hidden shadow-[var(--shadow-card)]">
              <img 
                src={businessFinancingMeeting} 
                alt="Business financing consultation"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <div className="text-sm font-bold">Expert Guidance</div>
                <div className="text-xs text-white/80">Personalized service</div>
              </div>
            </div>
            <div className="relative h-28 rounded-xl overflow-hidden shadow-[var(--shadow-card)]">
              <img 
                src={businessConsultationProfessional} 
                alt="Professional business consultation"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <div className="text-sm font-bold">Fast Approval</div>
                <div className="text-xs text-white/80">Same-day decisions</div>
              </div>
            </div>
            <div className="relative h-28 rounded-xl overflow-hidden bg-slate-100 backdrop-blur-sm flex items-center justify-center border border-slate-200">
              <div className="text-slate-700 text-center">
                <div className="text-2xl font-bold">2500+</div>
                <div className="text-xs text-slate-500">Happy Clients</div>
                <div className="flex justify-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-500 text-xs">★</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessShowcase;