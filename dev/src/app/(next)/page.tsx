'use client'

import React from 'react'

// Simple query to fetch cached examples
export default function Home() {
  const [examples, setExamples] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchExamples = async () => {
      try {
        // Fetches examples from Payload
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/examples`);
        if (!response.ok) {
          throw new Error('Failed to fetch examples');
        }
        const data = await response.json();
        setExamples(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExamples();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <main className='flex-1'>
    <h1>Hello NextJS + Payloadv3 + Redis</h1>
    <ul>
      {(examples.docs ?? []).map(example => (
        <li key={example.id}>{example.someField}</li>
      ))}
    </ul>
  </main>
}
