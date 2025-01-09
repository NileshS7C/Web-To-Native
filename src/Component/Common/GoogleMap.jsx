import React, { useEffect, useState, useRef } from "react";
import { Button } from "@headlessui/react";

export default function SearchComponent() {
  const [searchInput, setSearchInput] = useState("");
  const [searchError, setSearchError] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [cityName, setCityName] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [coachImages, setCoachImages] = useState({});

  const modalRef = useRef(null);

  const handleSearch = () => {
    if (searchInput.length < 3 && !location.lat && !location.lng) {
      setSearchError(true);
      return;
    }

    setSearchError(false);
    setShowDropdown(false);

    // Navigate using the search parameters
    const searchParams = new URLSearchParams();
    searchParams.append("q", searchInput);
    if (location.lat && location.lng) {
      searchParams.append("lat", location.lat);
      searchParams.append("long", location.lng);
    }

    window.location.href = `/categories/search?${searchParams.toString()}`;
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });

        try {
          // Using the browser's Geolocation API to get city name
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_SEARCH}`
          );
          const data = await response.json();

          const cityResult = data.results.find((result) =>
            result.types.includes("locality")
          );

          if (cityResult) {
            setCityName(cityResult.formatted_address);
          }
        } catch (error) {
          console.error("Error fetching location details:", error);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  };

  const fetchSearchResults = async () => {
    if (searchInput.length < 3) return;

    try {
      const params = new URLSearchParams();
      params.append("q", searchInput);
      if (location.lat && location.lng) {
        params.append("lat", location.lat);
        params.append("long", location.lng);
      }

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BASE_URL
        }/api/course/filter?${params.toString()}`
      );
      const data = await response.json();
      setSearchResults(data);

      // Fetch coach images
      const images = {};
      for (const result of data) {
        if (!images[result.coach_id]) {
          const coachResponse = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/coach/player/${result.coach_id}`
          );
          const coachData = await coachResponse.json();
          images[result.coach_id] = coachData?.profileImg;
        }
      }
      setCoachImages(images);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput.length >= 3) {
        fetchSearchResults();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-4" ref={modalRef}>
      <div className="flex-1">
        <input
          placeholder="Enter City Name"
          className="w-full"
          value={cityName}
          onChange={(e) => {
            setCityName(e.target.value);
            if (!e.target.value) {
              setLocation({ lat: null, lng: null });
            }
          }}
        />
      </div>

      <div className="flex-1 relative">
        <input
          type="text"
          placeholder="Course/Coach/Sports"
          className={`w-full ${searchError ? "border-red-500" : ""}`}
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            setSearchError(false);
            setShowDropdown(e.target.value.length >= 3);
          }}
        />

        {showDropdown && (
          <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg">
            <div className="p-4 max-h-96 overflow-auto">
              {searchResults.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Courses
                    </h3>
                    {searchResults.map((result, index) => (
                      <a
                        key={`course-${index}`}
                        href={`/courses/${result._id}`}
                        className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md"
                        onClick={() => setShowDropdown(false)}
                      >
                        <img
                          src={
                            result?.images?.[0]?.url || "/placeholder-image.jpg"
                          }
                          alt={result.courseName}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div>
                          <p className="font-medium text-sm">
                            {result.courseName}
                          </p>
                          <p className="text-sky-500 text-sm">
                            ₹{result.fees?.feesCourse || result.fees?.fees}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Coaches
                    </h3>
                    {searchResults
                      .filter(
                        (result, index, self) =>
                          index ===
                          self.findIndex((t) => t.coach_id === result.coach_id)
                      )
                      .map((result, index) => (
                        <a
                          key={`coach-${index}`}
                          href={`/coaches/${result.coach_id}`}
                          className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md"
                          onClick={() => setShowDropdown(false)}
                        >
                          <img
                            src={
                              coachImages[result.coach_id] ||
                              "/placeholder-image.jpg"
                            }
                            alt={result.coachName}
                            className="w-12 h-12 rounded object-cover"
                          />
                          <p className="font-medium text-sm">
                            {result.coachName}
                          </p>
                        </a>
                      ))}
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500">No results found</p>
              )}
            </div>
          </div>
        )}
      </div>

      <Button onClick={handleSearch} className="md:w-auto w-full">
        Search
      </Button>
    </div>
  );
}
