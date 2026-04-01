import { Request, Response } from 'express';
import { supabase } from './supabase.js';

// Mock function for expertise calculation
const calculateExpertise = (responseData: any) => {
  // Simple mock logic
  return Math.floor(Math.random() * 100);
};

// Mock function for share card generation
const generateDynamicShareCard = async (data: any) => {
  // Simple mock logic
  return `https://miidle.app/share-card/${data.title.replace(/\s+/g, '-').toLowerCase()}.png`;
};

export const handleNetworkCapture = async (req: Request, res: Response) => {
  try {
    const { templateId, responseData, email, source } = req.body;

    // 1. Calculate "Expertise Score"
    const expertiseScore = calculateExpertise(responseData);

    // 2. Generate Networking "Proof of Skill" Image
    const shareCard = await generateDynamicShareCard({
      title: "Logic Mastery: Top 5%",
      score: expertiseScore,
      industry: "SaaS Operations"
    });

    // 3. Store Lead for the Creator
    if (supabase) {
      await supabase.from('interaction_network_leads').insert({
        template_id: templateId,
        respondent_email: email,
        network_source: source,
        benchmarked_rank: expertiseScore
      });
    }

    res.json({ 
      shareLink: `https://miidle.app/share/${templateId}`,
      shareCard 
    });
  } catch (error: any) {
    console.error('Network Capture Error:', error);
    res.status(500).json({ error: error.message || 'Failed to capture network lead' });
  }
};
