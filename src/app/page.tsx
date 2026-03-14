
'use client';

import React, { useState } from 'react';
import { PresellForm, PresellFormValues } from '@/components/PresellForm';
import { PresellPreview } from '@/components/PresellPreview';
import { generatePresellContent } from '@/ai/flows/generate-presell-content';
import { PresellData } from '@/lib/presell-template';
import { Zap, ShieldCheck, Rocket, Layout, Github, Twitter, Layers } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generatePresellHTML } from '@/lib/presell-template';

export default function PresellGeniusApp() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState<PresellData | null>(null);
  const { toast } = useToast();

  const handleGenerate = async (values: PresellFormValues) => {
    setIsGenerating(true);
    try {
      const keyPoints = values.keySellingPoints.split(',').map(s => s.trim()).filter(Boolean);
      
      const result = await generatePresellContent({
        salesPageDescription: values.salesPageDescription,
        keySellingPoints: keyPoints,
      });

      setGeneratedData({
        headline: result.headline,
        bodyCopy: result.bodyCopy,
        callToAction: result.callToAction,
        buttonColor: values.buttonColor,
        targetUrl: values.targetUrl,
      });

      toast({
        title: "Content Generated!",
        description: "Your high-converting presell page is ready for review.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "There was an error generating your content. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedData) return;

    const html = generatePresellHTML(generatedData);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'presell-page.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Presell page downloaded successfully.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-accent/30 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg shadow-inner">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-primary">
              Presell <span className="text-accent">Genius</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Templates</a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-4">
            <button className="text-sm font-semibold text-primary hover:underline">Log In</button>
            <button className="bg-primary text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg hover:shadow-xl hover:translate-y-[-1px] transition-all">
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 px-4 py-1.5 rounded-full text-accent font-bold text-xs uppercase tracking-wider mb-6 animate-fade-in">
            <Rocket className="h-3.5 w-3.5" />
            New: Gemini 1.5 Flash Integration
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-6">
            Generate High-Converting <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Presell Pages in Seconds
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Stop losing traffic. Our AI crafts persuasive headlines and body copy that warms up your audience before they hit your sales page.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm font-semibold text-slate-500 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" /> Professional SEO
            </div>
            <div className="flex items-center justify-center gap-2">
              <Layout className="h-4 w-4 text-primary" /> Clean HTML
            </div>
            <div className="flex items-center justify-center gap-2 hidden md:flex">
              <Layers className="h-4 w-4 text-primary" /> Responsive UI
            </div>
          </div>
        </div>
      </section>

      {/* Main App Section */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Configuration Form */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-24">
            <PresellForm onSubmit={handleGenerate} isGenerating={isGenerating} />
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-7 xl:col-span-8">
            <PresellPreview data={generatedData} onDownload={handleDownload} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <Zap className="h-6 w-6 text-primary" />
                <span className="text-xl font-black tracking-tight text-primary">Presell Genius</span>
              </div>
              <p className="text-slate-500 max-w-sm leading-relaxed mb-6">
                Empowering digital marketers and entrepreneurs to maximize their conversions with AI-driven content generation and professional web tools.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="p-2 bg-slate-100 rounded-full hover:bg-primary hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="p-2 bg-slate-100 rounded-full hover:bg-primary hover:text-white transition-colors">
                  <Github className="h-5 w-5" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6">Product</h4>
              <ul className="space-y-4 text-slate-500 text-sm">
                <li><a href="#" className="hover:text-primary">AI Copywriter</a></li>
                <li><a href="#" className="hover:text-primary">Presell Templates</a></li>
                <li><a href="#" className="hover:text-primary">HTML Exports</a></li>
                <li><a href="#" className="hover:text-primary">Integration Guide</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6">Company</h4>
              <ul className="space-y-4 text-slate-500 text-sm">
                <li><a href="#" className="hover:text-primary">About Us</a></li>
                <li><a href="#" className="hover:text-primary">Contact</a></li>
                <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-slate-400">
            <p>&copy; {new Date().getFullYear()} Presell Genius. Built with speed and precision.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
