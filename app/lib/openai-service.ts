import OpenAI from 'openai';

// Initialize the OpenAI client
// You'll need to provide your API key in an environment variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
});

// Function to evaluate the veracity of a topic
export async function evaluateVeracity(topic: string): Promise<number> {
  try {
    const prompt = `
      Evaluate the veracity of the following AI-related topic:
      "${topic}"
      
      Output a single number between 0 and 1, where:
      - 1 means the topic is well-established in the AI literature with wide consensus
      - 0.8-0.9 means the topic is legitimate but may have some contested elements
      - 0.5-0.7 means the topic is speculative but reasonable
      - 0.1-0.4 means the topic is highly speculative or has limited evidence
      - 0 means the topic is completely made up or nonexistent in AI research
      
      Just output the number without any explanation.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that evaluates the veracity of AI topics.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 5
    });

    const score = parseFloat(response.choices[0].message.content?.trim() || '0.5');
    return isNaN(score) ? 0.5 : Math.max(0, Math.min(1, score));
  } catch (error) {
    console.error('Error evaluating veracity:', error);
    return 0.5; // Return a neutral score on error
  }
}

// Function to get related AI topics for a given topic
export async function getRelatedAITopics(topic: string, layer: number = 1, maxTopics: number = 4): Promise<any[]> {
  try {
    const prompt = `
      Generate ${maxTopics} related AI topics or concepts for the following topic:
      "${topic}"
      
      This is for layer ${layer} of a knowledge graph, so make these topics ${layer > 1 ? 'more specific than' : 'directly related to'} the main topic.
      
      For each topic, provide:
      1. The name of the topic (a short phrase)
      2. A brief description (1-2 sentences)
      
      Format your response as a JSON array with objects containing 'name' and 'description' fields.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that generates related AI topics in JSON format.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0].message.content;
    if (!content) return getDefaultTopics();
    
    try {
      const parsedContent = JSON.parse(content);
      
      // Handle different possible formats of the returned JSON
      let topics = [];
      
      if (Array.isArray(parsedContent)) {
        topics = parsedContent;
      } else if (parsedContent.topics && Array.isArray(parsedContent.topics)) {
        topics = parsedContent.topics;
      } else if (parsedContent.related_topics && Array.isArray(parsedContent.related_topics)) {
        topics = parsedContent.related_topics;
      } else if (typeof parsedContent === 'object') {
        // Extract any array property that might contain topics
        const possibleArrays = Object.values(parsedContent).filter(val => Array.isArray(val));
        if (possibleArrays.length > 0) {
          // Use the first array that contains objects with name and description
          for (const arr of possibleArrays) {
            if (arr.length > 0 && arr[0].name && arr[0].description) {
              topics = arr;
              break;
            }
          }
        }
        
        // If no arrays found or as a last resort, check if it's just a single topic object
        if (topics.length === 0) {
          const hasTopic = parsedContent.name && parsedContent.description;
          if (hasTopic) {
            topics = [parsedContent];
          }
        }
      }
      
      if (!Array.isArray(topics) || topics.length === 0) {
        console.error('Invalid response format from OpenAI:', content);
        return getDefaultTopics();
      }
      
      // Evaluate veracity for each topic
      const topicsWithVeracity = await Promise.all(
        topics.map(async (topic: any) => ({
          ...topic,
          source: 'openai',
          veracity_score: await evaluateVeracity(topic.name)
        }))
      );
      
      return topicsWithVeracity;
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      return getDefaultTopics();
    }
  } catch (error) {
    console.error('Error getting related AI topics:', error);
    return getDefaultTopics();
  }
}

// Helper function to return default topics
function getDefaultTopics() {
  return [
    { name: 'Machine Learning', description: 'A field of AI that enables computers to learn without explicit programming', source: 'default', veracity_score: 0.9 },
    { name: 'Neural Networks', description: 'Computing systems inspired by biological neural networks', source: 'default', veracity_score: 0.9 },
    { name: 'Deep Learning', description: 'A subset of machine learning using neural networks with many layers', source: 'default', veracity_score: 0.9 },
    { name: 'Natural Language Processing', description: 'AI techniques for understanding and generating human language', source: 'default', veracity_score: 0.9 },
  ];
}

// Function to get AI tools related to a topic
export async function getRelatedAITools(topic: string, maxTools: number = 4): Promise<any[]> {
  try {
    const prompt = `
      Generate ${maxTools} AI tools or platforms related to the following topic:
      "${topic}"
      
      For each tool, provide:
      1. The name of the tool
      2. A brief description of what it does (1-2 sentences)
      3. The category of the tool (e.g., "Machine Learning Framework", "NLP Tool", "Computer Vision Library")
      4. A URL for the tool (if you're not certain, provide a plausible URL)
      
      Format your response as a JSON array with objects containing 'name', 'description', 'category', and 'url' fields.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that generates information about AI tools in JSON format.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0].message.content;
    if (!content) return getDefaultTools();
    
    try {
      const parsedContent = JSON.parse(content);
      
      // Handle different possible formats of the returned JSON
      let tools = [];
      
      if (Array.isArray(parsedContent)) {
        tools = parsedContent;
      } else if (parsedContent.tools && Array.isArray(parsedContent.tools)) {
        tools = parsedContent.tools;
      } else if (parsedContent.AI_Tools && Array.isArray(parsedContent.AI_Tools)) {
        tools = parsedContent.AI_Tools;
      } else if (typeof parsedContent === 'object') {
        // Extract any array property that might contain tools
        const possibleArrays = Object.values(parsedContent).filter(val => Array.isArray(val));
        if (possibleArrays.length > 0) {
          // Use the first array that contains objects with name and description
          for (const arr of possibleArrays) {
            if (arr.length > 0 && arr[0].name && arr[0].description) {
              tools = arr;
              break;
            }
          }
        }
        
        // If no arrays found or as a last resort, check if it's just a single tool object
        if (tools.length === 0) {
          const hasTool = parsedContent.name && parsedContent.description;
          if (hasTool) {
            tools = [parsedContent];
          }
        }
      }
      
      if (!Array.isArray(tools) || tools.length === 0) {
        console.error('Invalid response format from OpenAI:', content);
        return getDefaultTools();
      }
      
      // Evaluate veracity for each tool
      const toolsWithVeracity = await Promise.all(
        tools.map(async (tool: any) => ({
          ...tool,
          veracity_score: await evaluateVeracity(tool.name)
        }))
      );
      
      return toolsWithVeracity;
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      return getDefaultTools();
    }
  } catch (error) {
    console.error('Error getting related AI tools:', error);
    return getDefaultTools();
  }
}

// Helper function to return default tools
function getDefaultTools() {
  return [
    { 
      name: 'TensorFlow', 
      description: 'An open-source machine learning framework developed by Google', 
      category: 'Machine Learning Framework',
      url: 'https://www.tensorflow.org/',
      veracity_score: 0.95
    },
    { 
      name: 'PyTorch', 
      description: 'An open-source machine learning library developed by Facebook', 
      category: 'Machine Learning Framework',
      url: 'https://pytorch.org/',
      veracity_score: 0.95
    },
    { 
      name: 'Hugging Face', 
      description: 'A platform for building, training and deploying NLP models', 
      category: 'NLP Framework',
      url: 'https://huggingface.co/',
      veracity_score: 0.9
    },
    { 
      name: 'OpenCV', 
      description: 'An open-source computer vision and machine learning library', 
      category: 'Computer Vision Library',
      url: 'https://opencv.org/',
      veracity_score: 0.95
    },
  ];
}

// Function to get more information about a specific topic
export async function getAdditionalInfo(topic: string): Promise<string> {
  try {
    const prompt = `
      Provide detailed information about the following AI-related topic:
      "${topic}"
      
      Include:
      - Definition and key concepts
      - Historical development
      - Current applications
      - Future directions or challenges
      
      Make your response informative but concise (around 250 words).
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that provides accurate information about AI topics.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.5,
      max_tokens: 500
    });

    return response.choices[0].message.content || 'No information available.';
  } catch (error) {
    console.error('Error getting additional info:', error);
    return 'Error retrieving information.';
  }
} 