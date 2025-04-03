# AI Knowledge Indexer

An interactive knowledge graph visualization tool for exploring AI-related topics, ArXiv papers, and AI tools.

## Features

- **Interactive Knowledge Graph**: Visualize relationships between AI topics, papers, and tools
- **ArXiv Integration**: Explore the latest AI research papers from ArXiv
- **AI Tools Discovery**: Find relevant AI tools and platforms related to specific topics
- **Topic Exploration**: Discover AI topics with veracity scoring to evaluate reliability
- **OpenAI-Powered Insights**: Get detailed information about any node in the graph
- **Expandable Graph**: Click on nodes to expand and discover more related entities

## Technology Stack

- **Next.js**: React framework for building the web application
- **React Flow**: Library for interactive node-based graphs and charts
- **SQLite**: Local database for storing graph data
- **Tailwind CSS**: Utility-first CSS framework for styling
- **OpenAI API**: For generating AI-related content and veracity checking
- **ArXiv API**: For retrieving research paper information

## Getting Started

### Prerequisites

- Node.js 16.8.0 or later
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-indexer.git
   cd ai-indexer
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Add your OpenAI API key to the `.env.local` file

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

- **Home Page**: Overview of the application with links to different sections
- **ArXiv Papers**: Explore AI research papers from ArXiv
- **AI Tools**: Discover AI tools and platforms
- **AI Topics**: Browse AI topics and concepts

### Graph Interaction

- **Pan and Zoom**: Navigate the graph by dragging and using the scroll wheel
- **Expand Nodes**: Click the + button on a node to expand and see related entities
- **Get Info**: Click the ? button to get detailed AI-generated information about any node
- **External Links**: Click the link icon to open papers or tools in a new tab

## Project Structure

```
/app
  /api              # API routes for data fetching
  /components       # React components
  /hooks            # Custom React hooks
  /lib              # Utility functions and services
  /types            # TypeScript type definitions
/public             # Static assets
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
