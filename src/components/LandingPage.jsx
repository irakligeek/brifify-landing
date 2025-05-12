"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "react-oidc-context";
import axios from "axios";
import {
  Check,
  Sparkles,
  FileText,
  Users,
  Zap,
  ChevronDown,
  ChevronUp,
  Rocket,
  Brain,
  Share2,
  UserCircle,
  Lock,
  MessageSquare,
  Code,
  FileQuestion,
  Download,
} from "lucide-react";

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(null);
  // Replace single isLoading state with a map for individual button loading states
  const [loadingStates, setLoadingStates] = useState({
    basic: false,
    professional: false
  });
  const auth = useAuth();
  const isAuthenticated = auth.isAuthenticated;

  const tryItRef = useRef(null);
  const howItWorksRef = useRef(null);
  const useCasesRef = useRef(null);
  const pricingRef = useRef(null);
  const faqRef = useRef(null);

  const scrollToSection = (ref) => {
    // Add offset for navbar height (adjust the 80 value based on your navbar height)
    const offset = 80; 
    const elementPosition = ref.current.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  };

  // Handle anchor links for smooth scrolling when clicking from navbar
  useEffect(() => {
    const handleAnchorClick = (e) => {
      const href = e.target.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          // Add offset for navbar height
          const offset = 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
      }
    };
    
    // Add click event listeners to all anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', handleAnchorClick);
    });
    
    // Clean up
    return () => {
      links.forEach(link => {
        link.removeEventListener('click', handleAnchorClick);
      });
    };
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Handle purchase for tokens
  const handlePurchaseTokens = async (productId, planName) => {
    try {
      // Set loading state for specific button
      setLoadingStates(prev => ({
        ...prev,
        [planName.toLowerCase()]: true
      }));

      // Call the Stripe checkout Lambda function using axios
      const response = await axios.post(
        "https://8dza2tz7cd.execute-api.us-east-1.amazonaws.com/dev/stripe-checkout",
        {
          productId,
          userId: isAuthenticated ? auth.user?.profile?.sub : null,
          email: isAuthenticated ? auth.user?.profile?.email : null,
        }
      );

      const { data } = response;
      // Parse body if it's a string
      const body = typeof data.body === "string" ? JSON.parse(data.body) : data.body;

      if (body?.url) {
        // Redirect to Stripe Checkout page
        window.location.href = body.url;
      } else {
        console.error("Failed to create checkout session");
      }
    } catch (error) {
      console.error(
        "Error creating checkout session:",
        error.response?.data || error.message
      );
    } finally {
      // Reset loading state for specific button
      setLoadingStates(prev => ({
        ...prev,
        [planName.toLowerCase()]: false
      }));
    }
  };

  // Handle button clicks based on pricing plan
  const handlePricingButtonClick = (plan) => {
    if (plan === "Free") {
      // Redirect to app for free plan
      window.location.href = "https://app.brifify.com";
    } else if (plan === "Basic") {
      // Handle purchase for Basic plan (20 tokens)
      handlePurchaseTokens("20_tokens", "Basic");
    } else if (plan === "Professional") {
      // Handle purchase for Professional plan (100 tokens)
      handlePurchaseTokens("100_tokens", "Professional");
    }
  };

  const faqItems = [
    {
      question: "What is Brifify?",
      answer:
        "Brifify is an AI-powered tool that helps non-technical users generate detailed project briefs by asking contextual follow-up questions. It bridges the communication gap between creators and developers.",
    },
    {
      question: "Do I need to know how to code?",
      answer:
        "Not at all. Brifify is built for entrepreneurs, designers, marketers, and others who want to define and communicate their ideas without diving into technical jargon.",
    },
    {
      question: "What does a Brifify brief include?",
      answer:
        "Your brief will typically include project goals, features, platform requirements, suggested tech stack, and any unique constraints or notes customized to your specific project type.",
    },
    {
      question: "Can I use Brifify without signing up?",
      answer:
        "Yes, you can generate a few briefs anonymously. When you're ready to save or access your history, you'll be prompted to log in or create an account.",
    },
    {
      question: "How does Brifify save me time?",
      answer:
        "Instead of going back and forth with a developer to clarify your vision, Brifify helps you articulate everything upfront potentially saving you hours of emails, meetings, and miscommunications.",
    },
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "No payment required",
      features: ["Generate 2 briefs", "Export to PDF"],
      cta: "Get Started",
      popular: false,
      accountNeeded: false,
      safePayment: false,
    },
    {
      name: "Professional",
      price: "$14.99",
      period: "One Time Payment",
      features: [
        "Create 100 briefs",
        "Export to multiple formats",
        "Edit briefs",
        "Save briefs",
        "Share briefs via link",
      ],
      cta: "Buy Now",
      popular: true,
      accountNeeded: true,
      safePayment: true,
    },
    {
      name: "Basic",
      price: "$4.99",
      period: "One Time Payment",
      features: [
        "Create 20 briefs",
        "Export to multiple formats",
        "Edit briefs",
        "Save briefs",
        "Share briefs via link",
      ],
      cta: "Buy Now",
      popular: false,
      accountNeeded: true,
      safePayment: true,
    },
  ];

  // Add features data for cards
  const featureCards = [
    {
      title: "AI Questioning",
      description: "Smart follow-up questions that uncover all project details",
      icon: <MessageSquare className="w-5 h-5 text-white" />,
      color: "from-[#ff3366] to-[#ff6b6b]",
      animation: "animate-float",
      delay: 0,
    },
    {
      title: "Tech Stack Recommendations",
      description: "Get suggested technologies best suited for your project",
      icon: <Code className="w-5 h-5 text-white" />,
      color: "from-[#7209b7] to-[#5c33f6]",
      animation: "animate-float-slow",
      delay: 1,
    },
    {
      title: "Clear Documentation",
      description: "Structured briefs that developers can easily understand",
      icon: <FileQuestion className="w-5 h-5 text-white" />,
      color: "from-[#4361ee] to-[#3a0ca3]",
      animation: "animate-float",
      delay: 0.5,
    },
    {
      title: "Export & Share",
      description: "Download as PDF or share via link with your team",
      icon: <Download className="w-5 h-5 text-white" />,
      color: "from-[#ff00ac] to-[#e100ff]",
      animation: "animate-float-slow",
      delay: 1.5,
    },
  ];

  return (
    <div className="w-full mx-auto font-inter bg-gradient-to-br from-white to-gray-50 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiNlMmUyZTIiLz48L3N2Zz4=')]">
      {/* Hero Section - Gradient background */}
      <div className="max-w-6xl mx-auto px-4 md:px-12" id="try-it">
        <section className="py-16">
          <div className="grid md:grid-cols-2 gap-18 items-center mb-32 justify-center md:justify-around">
            <div className="text-left max-w-md">
              <h1 className="text-3xl md:text-4xl lg:text-4xl font-bold font-poppins mb-6 leading-snug">
                <span className="text-gray-800">Create Technical Briefs</span>{" "}
                <br />
                <span className="bg-clip-text text-transparent bg-[#ff00ac]">
                  That Developers Understand
                </span>
              </h1>
              <p className="text-lg md:text-lg text-gray-400 mb-8 max-w-xl">
                Brifify uses AI to generate comprehensive project briefs, saving
                you hours of planning and documentation, and endless
                back-and-forth with developers.
              </p>
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={() => scrollToSection(tryItRef)}
                  className="w-full px-8 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-[#ff3366] to-[#7209b7] hover:opacity-90 transition-all shadow-lg hover:shadow-xl cursor-pointer"
                >
                  Create Brief
                </button>
                <span className="text-gray-400 font-medium flex items-center justify-center gap-1">
                  No account creation needed
                </span>
              </div>
            </div>
            
            {/* Feature Preview Cards */}
            <div className="relative h-[400px] hidden md:block">
              {/* Feature cards */}
              {featureCards.map((card, index) => (
                <div 
                  key={index}
                  className={`absolute bg-white rounded-lg shadow-lg border border-gray-100 p-4 w-60 animate-pulse-glow ${card.animation}`}
                  style={{
                    top: `${(index % 4) * 24}%`,
                    left: index % 2 === 0 ? '0%' : '52%',
                    zIndex: 10,
                    animationDelay: `${card.delay}s`,
                  }}
                >
                  <div className={`absolute -top-3 -left-3 w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r ${card.color} shadow-md`}>
                    {card.icon}
                  </div>
                  <div className="ml-2 mt-3">
                    <h3 className="font-semibold text-gray-800 mb-1">{card.title}</h3>
                    <p className="text-sm text-gray-500">{card.description}</p>
                  </div>
                </div>
              ))}
              
            </div>
          </div>
        </section>
      </div>

      {/* Why brifify */}
      <div className="bg-white w-full" id="why-brifify">
        <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold font-poppins mb-4 text-gray-700">
              Why Use Brifify?
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Brifify simplifies the process of creating comprehensive project
              briefs with no technical knowledge or understanding.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="p-6 rounded-lg bg-white shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Zap className="w-6 h-6 text-[#4361ee]" />
              </div>
              <h3 className="text-lg font-semibold mb-2 font-poppins">
                Save Hours of Back and Forth
              </h3>
              <p className="text-gray-500 text-sm">
                Brifify cuts through the noise by asking the right questions
                upfront. Instead of endless meetings or confusing email threads,
                you get a developer-ready brief fast.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-white shadow-md">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FileText className="w-6 h-6 text-[#7209b7]" />
              </div>
              <h3 className="text-lg font-semibold mb-2 font-poppins">
                No Technical Knowledge Required
              </h3>
              <p className="text-gray-500 text-sm">
                You don't need to speak "developer." Brifify guides you
                step-by-step, asking tailored, non-technical questions to
                understand your idea.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-white shadow-md">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Rocket className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 font-poppins">
                Start Your Projects Faster
              </h3>
              <p className="text-gray-500 text-sm">
                Well-scoped projects start smoother and finish faster. Brifify
                helps you align with developers from day one avoiding delays and
                miscommunication.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-white shadow-md">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Brain className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 font-poppins">
                AI-Powered Precision
              </h3>
              <p className="text-gray-500 text-sm">
                Brifify's smart AI assistant asks follow-up questions based on
                your responses. You get a clear, complete brief that covers
                everything a developer would ask.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-white shadow-md">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Share2 className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 font-poppins">
                Flexible Export & Sharing
              </h3>
              <p className="text-gray-500 text-sm">
                Once your brief is ready, export it as a PDF, DOCX or share it
                via a link. You can also edit and customize the brief to fit
                your needs.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-white shadow-md">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <UserCircle className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 font-poppins">
                Built for Non-Tech Creators
              </h3>
              <p className="text-gray-500 text-sm">
                Whether you're an entrepreneur, designer, or marketer, Brifify
                helps you define and communicate your project, no tech knowledge
                needed.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* How It Works Section - Gradient background */}
      <div className="mx-auto px-4 md:px-8 w-full bg-indigo-50" id="how-it-works">
        <section ref={howItWorksRef} className="py-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold font-poppins mb-4 text-gray-700">
                How It Works
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Brifify uses an interactive, contextual wizard that asks the
                right follow-up questions based on your responses
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="relative">
                <div className="absolute top-0 left-0 w-12 h-12 rounded-full bg-[#4361ee] text-white flex items-center justify-center font-bold text-xl">
                  1
                </div>
                <div className="pt-16 pb-8 px-6 bg-white rounded-lg shadow-md h-full">
                  <h3 className="text-lg font-semibold mb-3 font-poppins text-gray-700">
                    Describe Your Idea
                  </h3>
                  <p className="text-gray-500">
                    Start by telling Brifify what you're building in plain
                    English. No technical terms needed.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute top-0 left-0 w-12 h-12 rounded-full bg-[#4361ee] text-white flex items-center justify-center font-bold text-xl">
                  2
                </div>
                <div className="pt-16 pb-8 px-6 bg-white rounded-lg shadow-md h-full">
                  <h3 className="text-lg font-semibold mb-3 font-poppins text-gray-700">
                    Answer Smart Questions
                  </h3>
                  <p className="text-gray-500">
                    Brifify asks tailored follow-up questions to uncover key
                    details, based on your answers and context.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute top-0 left-0 w-12 h-12 rounded-full bg-[#4361ee] text-white flex items-center justify-center font-bold text-xl">
                  3
                </div>
                <div className="pt-16 pb-8 px-6 bg-white rounded-lg shadow-md h-full">
                  <h3 className="text-lg font-semibold mb-3 font-poppins text-gray-700">
                    Get Your Brief
                  </h3>
                  <p className="text-gray-500">
                    Receive a complete, structured project brief you can share
                    or download, ready for developers to start building.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-16 max-w-5xl mx-auto bg-white rounded-xl overflow-hidden shadow-lg">
              <div className="p-6 md:p-10">
                <h3 className="text-xl font-semibold mb-4 font-poppins text-gray-700">
                  What's Included in Your Brief
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                  <div className="flex items-start">
                    <Check className="w-5 h-5 text-[#4361ee] mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-500 text-left">
                      A clear summary of what the project is and what it’s meant
                      to do.
                    </p>
                  </div>
                  <div className="flex items-start">
                    <Check className="w-5 h-5 text-[#4361ee] mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-500 text-left">
                      A list of key features tailored to your idea.
                    </p>
                  </div>
                  <div className="flex items-start">
                    <Check className="w-5 h-5 text-[#4361ee] mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-500 text-left">
                      Suggested platforms like web, iOS, or Android based on
                      your goals.
                    </p>
                  </div>

                  <div className="flex items-start">
                    <Check className="w-5 h-5 text-[#4361ee] mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-500 text-left">
                      Recommended tech stack developers can use to build it.
                    </p>
                  </div>
                  <div className="flex items-start">
                    <Check className="w-5 h-5 text-[#4361ee] mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-500 text-left">
                      Defined user roles and what each type of user can access
                      or do.
                    </p>
                  </div>
                  <div className="flex items-start">
                    <Check className="w-5 h-5 text-[#4361ee] mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-500 text-left">
                      Additional notes or action items to move your project
                      forward.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Try It Section - White background that extends full width */}
      {/* <div className="w-full bg-white">
        <section ref={tryItRef} className="py-16 px-4 md:px-8 max-w-6xl mx-auto">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold font-poppins mb-4 text-gray-700">
                Try Brifify Now
              </h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                Experience how easy it is to create a comprehensive project
                brief
              </p>
            </div>

            <div className="bg-white p-6 md:p-10 rounded-xl shadow-lg max-w-4xl mx-auto border border-gray-100">
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  placeholder="E.g., Website Redesign for XYZ Company"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4361ee]"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Project Type
                </label>
                <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4361ee]">
                  <option>Website Development</option>
                  <option>Marketing Campaign</option>
                  <option>Product Launch</option>
                  <option>Branding Project</option>
                  <option>Content Creation</option>
                </select>
              </div>

              <div className="mb-8">
                <label className="block text-gray-700 font-medium mb-2">
                  Brief Description
                </label>
                <textarea
                  placeholder="Briefly describe what you want to achieve with this project..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4361ee] min-h-[120px]"
                ></textarea>
              </div>

              <button className="w-full py-3 rounded-lg font-medium text-white bg-gradient-to-r from-[#ff3366] to-[#7209b7] hover:opacity-90 transition-all flex items-center justify-center">
                Generate Brief <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        </section>
      </div> */}

      {/* Use Cases Section - White background that extends full width */}
      <div className="w-full bg-white" id="use-cases">
        <section
          ref={useCasesRef}
          className="py-16 px-4 md:px-8 max-w-6xl mx-auto"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold font-poppins mb-4 text-gray-700">
                Use Cases
              </h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                Brifify helps professionals across various industries create
                better project briefs
              </p>
            </div>

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-start mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <Sparkles className="w-6 h-6 text-[#4361ee]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 font-poppins text-gray-700 text-left">
                      Entrepreneurs
                    </h3>
                    <p className="text-gray-500 text-left">
                      Quickly generate a spec you can share with developers or
                      pitch to investors. No technical background needed.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-start mb-4">
                  <div className="bg-purple-100 p-3 rounded-lg mr-4">
                    <FileText className="w-6 h-6 text-[#7209b7]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 font-poppins text-gray-700 text-left">
                      Product Managers
                    </h3>
                    <p className="text-gray-500 text-left">
                      Document product requirements and specifications with all
                      necessary details.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-start mb-4">
                  <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                    <Users className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 font-poppins text-gray-700 text-left">
                      Marketers
                    </h3>
                    <p className="text-gray-500 text-left">
                      Define requirements clearly without getting lost in the
                      tech. Focus on outcomes, not code.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-start mb-4">
                  <div className="bg-green-100 p-3 rounded-lg mr-4">
                    <Zap className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 font-poppins text-gray-700 text-left">
                      Designers
                    </h3>
                    <p className="text-gray-500 text-left">
                      Turn your vision into a structured brief so developers
                      know exactly what to build.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Pricing Section - Gradient background */}
      <div className="mx-auto px-4 md:px-8 w-full bg-indigo-50" id="pricing">
        <section ref={pricingRef} className="py-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold font-poppins mb-4 text-gray-700">
                Simple, Transparent Pricing
              </h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                One-time payment. No hidden fees. No subscriptions ever.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <div
                  key={index}
                  className={`rounded-xl overflow-hidden shadow-lg bg-white ${
                    plan.popular ? "ring-2 ring-[#4361ee] relative" : "ring-1 ring-gray-300"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-[#4361ee] text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
                      Best Value
                    </div>
                  )}
                  <div className="bg-white p-8 flex flex-col justify-between h-full">
                    <div>
                      <h3 className="text-xl font-semibold mb-2 font-poppins text-gray-700">
                        {plan.name}
                      </h3>
                      <div className="flex items-end mb-8">
                        <span className="text-3xl font-bold text-gray-700">
                          {plan.price}
                        </span>
                        <span className="text-gray-500 ml-1">
                          /{plan.period}
                        </span>
                      </div>
                      <ul className="space-y-3 mb-8">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start">
                            <Check className="w-5 h-5 text-[#4361ee] mt-1 mr-3 flex-shrink-0" />
                            <p className="text-gray-500">{feature}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <button
                        className={`w-full py-3 rounded-lg font-medium transition-all cursor-pointer ${
                          plan.popular
                            ? "bg-gradient-to-r from-[#ff3366] to-[#7209b7] text-white hover:opacity-90"
                            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                        onClick={() => handlePricingButtonClick(plan.name)}
                      >
                        {plan.name === "Professional" && loadingStates.professional ? (
                          <svg
                            className="animate-spin h-5 w-5 text-white mx-auto"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        ) : plan.name === "Basic" && loadingStates.basic ? (
                          <svg
                            className="animate-spin h-5 w-5 text-gray-700 mx-auto"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        ) : (
                          plan.cta
                        )}
                      </button>
                      {!plan.accountNeeded && (
                        <span className="block mt-2 text-xs text-gray-500 font-poppins">
                          No Account necessary
                        </span>
                      )}
                      {plan.safePayment && (
                        <span className="mt-2 text-xs text-gray-500 font-poppins flex justify-center items-center">
                          <Lock className="inline w-3 h-3 mr-1" />
                          Secure payment
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* FAQ Section - White background that extends full width */}
      <div id="faq" className="w-full">
        <section ref={faqRef} className="py-16 px-4 md:px-8 max-w-6xl mx-auto">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold font-poppins mb-4 text-gray-700">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                Find answers to common questions about Brifify
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              {faqItems.map((item, index) => (
                <div
                  key={index}
                  className="mb-4 bg-white rounded-lg shadow-md overflow-hidden border border-gray-100"
                >
                  <button
                    className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                    onClick={() => toggleFaq(index)}
                  >
                    <span className="font-medium text-base font-poppins text-gray-800">
                      {item.question}
                    </span>
                    {openFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-500 text-left">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* <div className="mt-16 text-center">
              <p className="text-gray-500 mb-4">Still have questions?</p>
              <button className="px-8 py-3 rounded-lg font-medium text-white bg-[#4361ee] hover:bg-[#3a56d4] transition-all">
                Contact Support
              </button>
            </div> */}
          </div>
        </section>
      </div>

      {/* CTA Section - Gradient background that extends full width */}
      <div className="w-full bg-gradient-to-r bg-[#4361ee] mb-12 max-w-5xl mx-auto rounded-2xl *:overflow-hidden">
        <section className="py-16 md:px-8 max-w-6xl mx-auto text-white">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold font-poppins mb-6">
              Ready to Transform Your Project Planning?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Turn your ideas into actionable project briefs with Brifify. Start
              creating today!
            </p>
            <button
              className="cursor-pointer px-8 py-3 rounded-lg font-medium bg-white text-[#4361ee] hover:bg-gray-100 transition-all shadow-lg"
              onClick={() => (window.location.href = "https://app.brifify.com")}
            >
              Get Started for Free
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
