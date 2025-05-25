// server/services/AIService.js
const OpenAI = require('openai'); // or your preferred AI service

class AIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  
  async analyzeContribution(contribution) {
    try {
      const prompt = `
        Analyze this contribution for quality and impact:
        Type: ${contribution.type}
        Description: ${contribution.description}
        Evidence: ${JSON.stringify(contribution.evidence)}
        
        Rate from 1-10:
        1. Technical quality
        2. Innovation level
        3. Impact on project
        4. Documentation quality
        
        Return JSON: {"quality": 8, "innovation": 7, "impact": 9, "docs": 6, "multiplier": 1.2}
      `;
      
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3
      });
      
      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('AI analysis failed:', error);
      return { multiplier: 1.0 }; // Fallback
    }
  }
  
  async analyzeUserProgress(userProgress) {
    // Analyze user's contribution history for insights
    const contributions = await Contribution.find({ userId: userProgress.userId });
    
    const prompt = `
      Analyze this user's contribution history:
      ${contributions.map(c => `${c.type}: ${c.description}`).join('\n')}
      
      Identify:
      1. Top 3 strengths
      2. Areas for improvement
      3. Recommended roles
      4. Skill progression trends
      
      Return JSON format.
    `;
    
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5
      });
      
      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('User analysis failed:', error);
      return null;
    }
  }
}

module.exports = new AIService();