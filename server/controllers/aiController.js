import User from '../models/User.js';
import Activity from '../models/Activity.js';

// Helper to check limits and increment
const checkAndIncrementUsage = async (userId, user, actionName) => {
  if (user.aiUsageCount >= user.aiUsageLimit) {
    throw new Error('AI Monthly usage limit reached. Please upgrade your plan.');
  }
  
  const updatedCount = user.aiUsageCount + 1;
  await User.findByIdAndUpdate(userId, { aiUsageCount: updatedCount });
  
  await Activity.create({
    userId,
    userName: user.name,
    action: 'AI Feature Used',
    details: `Used ${actionName} (Usage: ${updatedCount}/${user.aiUsageLimit})`
  });
};

export const reviewResume = async (req, res) => {
  const { resumeText, targetRole } = req.body;
  const userId = req.user.id || req.user._id;

  try {
    await checkAndIncrementUsage(userId, req.user, 'AI Resume Reviewer');

    // Simulate structured, beautiful, realistic review
    const score = Math.floor(Math.random() * 20) + 75; // 75 - 95 score
    const response = `
### 📊 Resume Analysis Score: **${score}/100**

#### Target Role: **${targetRole || 'Software Engineer'}**

---

### 👍 Key Strengths
1. **Action-Oriented Language**: Your experience bullets start with strong action verbs (e.g. *designed*, *implemented*, *scaffolded*).
2. **Modern Stack Relevance**: Good representation of core full-stack technologies like React, Node.js, and database design.

### ⚠️ Areas for Improvement
- **Quantification of Impact**: Many bullet points state *what* you did, but not the *result*. (e.g., instead of "Optimized database queries", use "Optimized query efficiency, reducing dashboard latency by 35%").
- **ATS Friendly Structure**: Ensure that headers are standard (e.g., "Work Experience" rather than "Where I've Been").

### 💡 Core Recommendations
- Add a dedicated **Projects** section showcasing complex full-stack apps (like this AI Workspace!).
- Integrate a brief **Profile Summary** at the top emphasizing your passion for Machine Learning integrations.
`;

    res.json({ result: response, score });
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

export const explainCode = async (req, res) => {
  const { codeSnippet, language } = req.body;
  const userId = req.user.id || req.user._id;

  try {
    await checkAndIncrementUsage(userId, req.user, 'AI Code Explainer');

    const response = `
### 📝 Code Explanation (${language || 'JavaScript'})

Here is the step-by-step breakdown of your snippet:

1. **Initialization**: The code starts by declaring variables or imports necessary for state initialization.
2. **Processing Flow**:
   - It performs an asynchronous check (or execution flow) to fetch data from the server or evaluate input parameters.
   - Standard conditions are used to catch edges cases (e.g. checks for null, undefined, or empty values).
3. **Execution Block**: 
   - The logic handles state modifications, updating the user interface or database objects depending on environment mode.
4. **Return/Export**: It outputs the processed result or updates the component hooks with standard handlers.

#### 💡 Optimization Tip
Ensure any side effects inside this snippet are properly cleaned up (e.g., in React, clear timeouts/intervals inside a \`useEffect\` cleanup function) to avoid memory leaks.
`;

    res.json({ result: response });
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

export const summarizeText = async (req, res) => {
  const { textToSummarize, length } = req.body; // length: short, medium, long
  const userId = req.user.id || req.user._id;

  try {
    await checkAndIncrementUsage(userId, req.user, 'AI Text Summarizer');

    let summaryPoints = [];
    if (length === 'short') {
      summaryPoints = [
        "**Core Concept**: The text outlines a strategic initiative to optimize workflow performance through modern stack implementation.",
        "**Key Action**: Implement robust local database fallbacks alongside secure JWT routing to minimize cold start latencies."
      ];
    } else {
      summaryPoints = [
        "**Core Concept**: The text details the setup of a high-performance MERN architecture for modern SaaS dashboards.",
        "**User Session Management**: Explains the critical role of JSON Web Tokens, state management via Context providers, and bcrypt password salting.",
        "**Database Strategy**: Introduces an efficient dual-mode schema fallback using in-memory JSON logs when remote database instances are unavailable.",
        "**Actionable Next Steps**: Recommends immediately spinning up automated builds, styling dashboards with dark mode utilities, and deploying to Vercel/Railway."
      ];
    }

    const response = `
### 📌 Document Summary

${summaryPoints.map(point => `- ${point}`).join('\n')}

---
*Generated using AI Workspace Summarizer Engine (v1.0)*
`;

    res.json({ result: response });
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

export const generateEmail = async (req, res) => {
  const { recipient, purpose, tone } = req.body;
  const userId = req.user.id || req.user._id;

  try {
    await checkAndIncrementUsage(userId, req.user, 'AI Email Generator');

    const subject = purpose === 'follow_up' 
      ? 'Following up on our recent conversation' 
      : 'Collaboration Opportunity - Full-Stack Developer Portfolio';

    const body = tone === 'formal' ? `
Dear ${recipient || 'Hiring Team'},

I am writing to express my strong interest in the Full-Stack Developer position at your organization. Having recently built and deployed a production-grade AI Workspace SaaS Dashboard featuring modern state management, real-time charts, and dual-mode database layers, I am confident in my technical abilities.

I have attached my details and links to the live project repositories. I would appreciate the opportunity to discuss how my skill set aligns with your engineering goals.

Thank you for your time and consideration.

Sincerely,
[Your Name]
` : `
Hi ${recipient || 'there'},

Hope you're having a great week! 

I wanted to shoot over a quick message about the Developer openings on your team. I just finished building **AI Workspace**—a SaaS dashboard with full CRUD, Recharts analytics, dark mode, and an Express/JSON hybrid database backend. 

I'd love to chat briefly and show you what I've been working on if you have a few minutes this week!

Best,
[Your Name]
`;

    const response = `
### ✉️ Generated Email

**Subject:** ${subject}

---
${body}
`;

    res.json({ result: response });
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

export const interviewPractice = async (req, res) => {
  const { messages, targetRole } = req.body; // messages is an array of { role: 'user'|'assistant', content: string }
  const userId = req.user.id || req.user._id;

  try {
    await checkAndIncrementUsage(userId, req.user, 'AI Interview Simulator');

    const userMessage = messages[messages.length - 1]?.content || "";

    let assistantResponse = "";
    if (messages.length <= 1) {
      assistantResponse = `Hi there! I am your AI Interviewer. I see you're interviewing for the **${targetRole || 'Full-Stack React Developer'}** role. Let's start with a classic: Can you tell me about a challenging technical problem you solved, and how you arrived at the solution?`;
    } else {
      assistantResponse = `That's an interesting approach! Handling that kind of challenge shows good problem-solving. 

For my next question: How do you handle state management in a large-scale React application? When would you choose React Context over a library like Redux or Zustand, and how do you prevent unnecessary re-renders in your implementation?`;
    }

    res.json({ result: assistantResponse });
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};
