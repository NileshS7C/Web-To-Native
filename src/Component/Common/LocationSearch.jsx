import { useEffect, useRef, useState } from "react";
import useGoogle from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import { useDispatch, useSelector } from "react-redux";
import { ImSearch } from "react-icons/im";
import { setLocation } from "../../redux/Venue/addVenue";
import debounce from "../../Services/debounce";
import getPlaceDetailsByPlaceId from "../../Services/getPlaceIds";
import { setGlobalLocation } from "../../redux/Location/locationSlice";

const LocationSearchInput = ({ id, name }) => {
  const { location } = useSelector((state) => state.Venue);
  const dispatch = useDispatch();
  const { placePredictions, getPlacePredictions, isPlacePredictionsLoading } =
    useGoogle({ apiKey: `${import.meta.env.VITE_GOOGLE_MAPS_KEY}` });
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const debouncedGetPredictions = debounce((value, getPlacePredictions) => {
    if (value.trim()) {
      getPlacePredictions({ input: value });
    }
  }, 800);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim()) {
      debouncedGetPredictions(value, getPlacePredictions);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleSuggestionClick = async (suggestion) => {
    setQuery(suggestion.description);
    setIsOpen(false);
    const coordinates = await getPlaceDetailsByPlaceId(suggestion.place_id);
    dispatch(
      setLocation({
        formatted_address: coordinates.formatted_address,
        lat: coordinates.lat,
        lng: coordinates.lng,
        name: coordinates.name,
        place_id: coordinates.place_id,
        address_line1: coordinates.address_line1,
        address_line2: coordinates.address_line2,
        city: coordinates.city,
        state: coordinates.state,
        pin_code: coordinates.pin_code,
        country: coordinates.country,
      })
    );
    dispatch(
      setGlobalLocation({
        formatted_address: coordinates.formatted_address,
        lat: coordinates.lat,
        lng: coordinates.lng,
        name: coordinates.name,
        place_id: coordinates.place_id,
        address_line1: coordinates.address_line1,
        address_line2: coordinates.address_line2,
        city: coordinates.city,
        state: coordinates.state,
        pin_code: coordinates.pin_code,
        country: coordinates.country,
      })
    );
  };

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      <div className="relative">
        <input
          className="w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          value={query}
          placeholder={`Search... ${location?.name || ""}`}
          onChange={(e) => {
            handleInputChange(e);
          }}
          id={id}
          name={name}
          
        />
        <ImSearch className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      {/* Suggestions dropdown */}
      {isOpen && (
        <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {isPlacePredictionsLoading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : placePredictions.length > 0 ? (
            <ul className="py-2">
              {placePredictions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {" "}
                  {suggestion.description}{" "}
                </li>
              ))}
            </ul>
          ) : (
            query && (
              <div className="p-4 text-center text-gray-500">
                No results found
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default LocationSearchInput;
