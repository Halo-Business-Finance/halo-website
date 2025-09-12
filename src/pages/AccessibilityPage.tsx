import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Ear, MousePointer, Keyboard } from "lucide-react";
import accessibilityHeader from "@/assets/accessibility-header.jpg";
import inclusiveWorkplace from "@/assets/inclusive-workplace.jpg";

const AccessibilityPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="relative py-20 overflow-hidden">
        <img 
          src={accessibilityHeader} 
          alt="Accessibility and inclusive technology in professional business environment"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 text-white"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-left text-white">
            <Badge className="bg-white text-primary mb-4">WCAG 2.1 AA Compliant</Badge>
            <h1 className="text-2xl md:text-3xl font-bold mb-6">Accessibility Statement</h1>
            <p className="text-lg md:text-xl mb-8 opacity-90 max-w-3xl">
              We are committed to ensuring our website is accessible to all users, regardless of their abilities or the technology they use.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-8 mb-16">
            <Card className="text-left p-6">
              <CardContent className="p-0">
                <Eye className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Visual</h3>
                <p className="text-muted-foreground">High contrast and screen reader support</p>
              </CardContent>
            </Card>
            <Card className="text-left p-6">
              <CardContent className="p-0">
                <Ear className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Auditory</h3>
                <p className="text-muted-foreground">Alternative text and captions</p>
              </CardContent>
            </Card>
            <Card className="text-left p-6">
              <CardContent className="p-0">
                <MousePointer className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Motor</h3>
                <p className="text-muted-foreground">Keyboard navigation support</p>
              </CardContent>
            </Card>
            <Card className="text-left p-6">
              <CardContent className="p-0">
                <Keyboard className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Cognitive</h3>
                <p className="text-muted-foreground">Clear navigation and content</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Inclusive by Design</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Our commitment to accessibility extends beyond compliance. We design with inclusion at the forefront, 
                ensuring that every user can access our financial services with dignity and independence.
              </p>
              <p className="text-muted-foreground">
                We work with accessibility experts and users with disabilities to continuously improve our platform 
                and ensure it meets the diverse needs of our business community.
              </p>
            </div>
            <div className="relative rounded-lg overflow-hidden shadow-lg">
              <img 
                src={inclusiveWorkplace} 
                alt="Diverse team using assistive technology in an inclusive workplace environment"
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Our Commitment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Halo Business Finance is committed to providing an inclusive digital experience for all users. We strive to meet or exceed the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.
                </p>
                <p>
                  We believe that everyone should have equal access to financial services and information, regardless of their physical or cognitive abilities.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Accessibility Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Visual Accessibility</h4>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>High contrast color schemes for better readability</li>
                    <li>Scalable text that can be enlarged up to 200% without loss of functionality</li>
                    <li>Alternative text for all images and graphics</li>
                    <li>Consistent navigation and layout structure</li>
                    <li>Focus indicators for keyboard navigation</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-3">Keyboard Navigation</h4>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Full keyboard accessibility for all interactive elements</li>
                    <li>Logical tab order throughout the website</li>
                    <li>Skip navigation links for efficient browsing</li>
                    <li>Keyboard shortcuts for common actions</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-3">Screen Reader Compatibility</h4>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Semantic HTML markup for proper content structure</li>
                    <li>ARIA labels and descriptions for complex elements</li>
                    <li>Descriptive headings and page titles</li>
                    <li>Form labels and error message announcements</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-3">Content and Design</h4>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Clear and simple language throughout the site</li>
                    <li>Consistent navigation and page layout</li>
                    <li>Adequate white space and visual hierarchy</li>
                    <li>No auto-playing audio or video content</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Assistive Technology Compatibility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>Our website has been tested with the following assistive technologies:</p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Screen Readers</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>JAWS (Windows)</li>
                      <li>NVDA (Windows)</li>
                      <li>VoiceOver (macOS/iOS)</li>
                      <li>TalkBack (Android)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Browsers</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Chrome</li>
                      <li>Firefox</li>
                      <li>Safari</li>
                      <li>Edge</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Third-Party Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  While we strive to ensure that all content on our website is accessible, some third-party content or embedded widgets may not fully conform to accessibility standards. We work with our partners to improve accessibility across all platforms.
                </p>
                <p>
                  If you encounter accessibility barriers with third-party content, please contact us and we will work to provide alternative access methods.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ongoing Improvements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>Accessibility is an ongoing effort, and we continuously work to improve our website:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Regular accessibility audits and testing</li>
                  <li>Staff training on accessibility best practices</li>
                  <li>User feedback integration for improvements</li>
                  <li>Keeping up with evolving accessibility standards</li>
                  <li>Testing with real users who rely on assistive technologies</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Feedback and Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  We welcome your feedback on the accessibility of our website. If you encounter any accessibility barriers or have suggestions for improvement, please contact us:
                </p>
                <div className="mt-4 space-y-2">
                  <p><strong>Email:</strong> accessibility@halobusinessfinance.com</p>
                  <p><strong>Phone:</strong> (800) 730-8461</p>
                  <p><strong>Mail:</strong> Halo Business Finance<br />
                  Accessibility Team<br />
                  Irvine, CA</p>
                </div>
                <p className="mt-4">
                  We aim to respond to accessibility feedback within 2 business days and will work with you to resolve any issues.
                </p>
              </CardContent>
            </Card>

            <div className="bg-muted p-6 rounded-lg">
              <h3 className="font-semibold mb-3">Alternative Access</h3>
              <p className="text-muted-foreground">
                If you are unable to access any content or functionality on our website, we are committed to providing alternative access methods. Please contact our accessibility team, and we will work with you to ensure you can access the information and services you need.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AccessibilityPage;