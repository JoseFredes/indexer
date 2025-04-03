import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

const ARXIV_API_URL = 'http://export.arxiv.org/api/query';

// Function to search ArXiv for AI-related papers
export async function searchArxiv(query: string, maxResults: number = 10, start: number = 0) {
  try {
    const response = await axios.get(ARXIV_API_URL, {
      params: {
        search_query: `all:${query}`,
        start,
        max_results: maxResults,
        sortBy: 'submittedDate',
        sortOrder: 'descending'
      }
    });

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "_",
      isArray: (name) => ['entry'].includes(name)
    });
    
    const result = parser.parse(response.data);
    
    if (!result.feed || !result.feed.entry) {
      return [];
    }
    
    // Transform the response to a more usable format
    return result.feed.entry.map((entry: any) => ({
      arxiv_id: entry.id.split('/').pop().split('v')[0],
      title: entry.title.replace(/\n/g, ' ').trim(),
      authors: entry.author ? 
        (Array.isArray(entry.author) ? 
          entry.author.map((a: any) => a.name).join(', ') : 
          entry.author.name) 
        : '',
      summary: entry.summary.replace(/\n/g, ' ').trim(),
      published_date: entry.published,
      url: entry.id,
      categories: entry.category ? 
        (Array.isArray(entry.category) ? 
          entry.category.map((c: any) => c._term) : 
          [entry.category._term]) 
        : []
    }));
  } catch (error) {
    console.error('Error searching ArXiv:', error);
    return [];
  }
}

// Function to get related AI topics from a paper
export async function getRelatedTopics(paperTitle: string, paperSummary: string) {
  // This function would typically use the OpenAI API to extract related topics
  // For now, return a placeholder
  return [
    { name: 'Machine Learning', veracity_score: 0.95 },
    { name: 'Neural Networks', veracity_score: 0.92 },
    { name: 'Deep Learning', veracity_score: 0.90 }
  ];
} 