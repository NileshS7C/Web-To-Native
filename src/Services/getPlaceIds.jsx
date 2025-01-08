const getPlaceDetailsByPlaceId = async (placeId) => {
  try {
    // Initialize the Places service using the existing map or create a new one
    const service = new google.maps.places.PlacesService(
      document.createElement("div")
    );

    // Create a promise wrapper around the getDetails method
    const getDetailsPromise = () => {
      return new Promise((resolve, reject) => {
        service.getDetails(
          {
            placeId: placeId,
            fields: [
              "name",
              "formatted_address",
              "geometry",
              "address_components",
              "geometry",
            ],
          },
          (result, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              resolve(result);
            } else {
              reject(new Error(`Place details request failed: ${status}`));
            }
          }
        );
      });
    };

    const result = await getDetailsPromise();
    const addressComponents = {};
    result.address_components.forEach((component) => {
      const type = component.types[0];
      switch (type) {
        case "street_number":
          addressComponents.streetNumber = component.long_name;
          break;
        case "route":
          addressComponents.street = component.long_name;
          break;
        case "sublocality_level_1":
          addressComponents.sublocality = component.long_name;
          break;
        case "locality":
          addressComponents.city = component.long_name;
          break;
        case "administrative_area_level_1":
          addressComponents.state = component.long_name;
          break;
        case "postal_code":
          addressComponents.pinCode = component.long_name;
          break;
        case "country":
          addressComponents.country = component.long_name;
          break;
      }
    });

    // Format address lines
    const addressLine1 = [
      addressComponents.streetNumber,
      addressComponents.street,
    ]
      .filter(Boolean)
      .join(" ");

    const addressLine2 = addressComponents.sublocality;

    // Transform the response into the expected format
    return {
      formatted_address: result.formatted_address,
      lat: result.geometry.location.lat(),
      lng: result.geometry.location.lng(),
      name: result.name,
      place_id: result.place_id,
      address_line1: addressLine1,
      address_line2: addressLine2,
      city: addressComponents.city,
      state: addressComponents.state,
      pin_code: addressComponents.pinCode,
      country: addressComponents.country,
    };
  } catch (error) {
    console.error("Error fetching place details:", error);
    throw error;
  }
};

export default getPlaceDetailsByPlaceId;
