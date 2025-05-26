import PropTypes from "prop-types";

export const UserProfile = ({ onwerDetails }) => {
  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Personal Information
            </h3>
            <div className="grid gap-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <span className="font-medium">Name:</span>
                <span>{onwerDetails?.name}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <span className="font-medium">Email:</span>
                <span>{onwerDetails?.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <span className="font-medium">Phone:</span>
                <span>{onwerDetails?.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-600">Role:</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {onwerDetails?.roleNames}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {onwerDetails?.owner?.map((owner, index) => (
              <div key={index}>
                {/* Brand Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">
                    Brand Information
                  </h3>
                  <div className="grid gap-4">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <span className="font-medium">Brand Name:</span>
                      <span>{owner?.brandName}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <span className="font-medium">Brand Email:</span>
                      <span>{owner?.brandEmail}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <span className="font-medium">Brand Phone:</span>
                      <span>{owner?.brandPhone}</span>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">
                    Address
                  </h3>
                  <div className="text-gray-600">
                    <p>{owner?.address?.line1}</p>
                    <p>{owner?.address?.line2}</p>
                    <p>
                      {owner?.address?.city}, {owner?.address?.state}{" "}
                      {owner?.address?.postalCode}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

UserProfile.propTypes = {
  onwerDetails: PropTypes.object,
};
