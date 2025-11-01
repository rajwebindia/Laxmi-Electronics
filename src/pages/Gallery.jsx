const Gallery = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Gallery</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder gallery items */}
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="bg-gray-200 rounded-lg h-64 flex items-center justify-center"
          >
            <span className="text-gray-400">Gallery Image {item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;

