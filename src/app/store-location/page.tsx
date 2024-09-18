import { MapPin } from "lucide-react";

const StoreLocations = () => {
  return (
    <div className="min-h-[50vh] bg-gray-100 flex flex-col items-center justify-center py-12 px-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        Our Store Locations
      </h1>

      <div className="grid md:grid-cols-2 gap-8 w-full max-w-7xl">
        {/* Dhanmondi Outlet */}
        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
          <div className="text-center mb-4">
            <MapPin className="w-8 h-8 text-gray-800 mx-auto mb-2" />
            <h2 className="text-2xl font-semibold text-gray-900">
              Dhanmondi Outlet
            </h2>
            <p className="text-gray-600">
              Shop 134, Genetic Plaza, Dhanmondi-27, Dhaka
            </p>
          </div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.7721996343375!2d90.37059247606526!3d23.755501488579057!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755bf536d1cf7bb%3A0x9ba1b02f4265d430!2sGenetic%20Plaza!5e0!3m2!1sen!2sbd!4v1726519259387!5m2!1sen!2sbd"
            width="100%"
            height="300"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
          ></iframe>
        </div>

        {/* Wari Outlet */}
        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
          <div className="text-center mb-4">
            <MapPin className="w-8 h-8 text-gray-800 mx-auto mb-2" />
            <h2 className="text-2xl font-semibold text-gray-900">
              Wari Outlet
            </h2>
            <p className="text-gray-600">
              Shop 05, Rankin Street, Rankin Square, Dhaka
            </p>
          </div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.8236552795356!2d90.41450112606451!3d23.717990640018392!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b964a8c43d71%3A0x90f8c7941135171f!2sEhsan%20Plaza%20Shopping%20Complex%20~%20Wari!5e0!3m2!1sen!2sbd!4v1726577938328!5m2!1sen!2sbd"
            width="100%"
            height="300"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default StoreLocations;
