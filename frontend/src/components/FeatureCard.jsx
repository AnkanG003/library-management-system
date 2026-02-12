export default function FeatureCard({ title, description }) {
  return (
    <div className="relative p-6 rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-lg group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-blue-200"></div>
      
      <div className="relative z-10">
        <h4 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          {title}
        </h4>
        <p className="mt-3 text-gray-600">
          {description}
        </p>
        
      
        <div className="mt-4 flex items-center text-blue-600 font-medium opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          Learn more <span>&rarr;</span>
        </div>
      </div>
    </div>
  );
}
