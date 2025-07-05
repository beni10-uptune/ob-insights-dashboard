export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-4xl mx-auto text-center p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Obesity Insights Dashboard
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Advanced analytics dashboard for ueber-gewicht.de
        </p>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            🎉 Success! Your app is running
          </h2>
          <p className="text-gray-600 mb-6">
            The Obesity Insights dashboard is now ready for development.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">✅ Setup Complete</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Next.js 14 with TypeScript</li>
                <li>• Tailwind CSS configured</li>
                <li>• Supabase database ready</li>
                <li>• Environment variables set</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">🚀 Next Steps</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Build authentication system</li>
                <li>• Create dashboard components</li>
                <li>• Integrate external APIs</li>
                <li>• Deploy to production</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
