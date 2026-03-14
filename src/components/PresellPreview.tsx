
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Eye, Code, ExternalLink } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generatePresellHTML, PresellData } from '@/lib/presell-template';

interface PresellPreviewProps {
  data: PresellData | null;
  onDownload: () => void;
}

export function PresellPreview({ data, onDownload }: PresellPreviewProps) {
  if (!data) {
    return (
      <Card className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-8 bg-white/50 border-dashed border-2">
        <div className="bg-muted p-4 rounded-full mb-4">
          <Eye className="h-8 w-8 text-muted-foreground" />
        </div>
        <CardTitle className="text-xl mb-2">Live Preview Area</CardTitle>
        <CardDescription className="max-w-[280px]">
          Configure your product details and click generate to see the magic happen here.
        </CardDescription>
      </Card>
    );
  }

  const html = generatePresellHTML(data);

  return (
    <Card className="h-full flex flex-col shadow-lg border-none overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 bg-white border-b">
        <div>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Eye className="h-5 w-5 text-accent" />
            Page Preview
          </CardTitle>
          <CardDescription>Visual output of your presell page</CardDescription>
        </div>
        <Button onClick={onDownload} size="sm" className="gap-2 bg-accent hover:bg-accent/90">
          <Download className="h-4 w-4" />
          Download HTML
        </Button>
      </CardHeader>
      
      <Tabs defaultValue="preview" className="flex-1 flex flex-col">
        <div className="px-6 py-2 bg-muted/30 border-b flex justify-center">
          <TabsList className="grid grid-cols-2 w-[200px]">
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-3 w-3" /> Preview
            </TabsTrigger>
            <TabsTrigger value="code" className="flex items-center gap-2">
              <Code className="h-3 w-3" /> Code
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="preview" className="flex-1 m-0 p-0 overflow-hidden min-h-[600px]">
          <iframe
            srcDoc={html}
            title="Presell Preview"
            className="w-full h-full border-none"
            sandbox="allow-scripts"
          />
        </TabsContent>
        
        <TabsContent value="code" className="flex-1 m-0 p-6 overflow-auto bg-slate-900 text-slate-100 font-mono text-sm min-h-[600px]">
          <pre className="whitespace-pre-wrap">
            {html}
          </pre>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
