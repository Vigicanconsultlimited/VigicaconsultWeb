import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

// Flight Booking Modal Component
const FlightBookingModal = ({ isOpen, onClose, travelers }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [passengerCount, setPassengerCount] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });
  const [passengerDetails, setPassengerDetails] = useState([]);
  const [showTerms, setShowTerms] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Initialize passenger details when modal opens
  useEffect(() => {
    if (isOpen) {
      const totalPassengers =
        passengerCount.adults +
        passengerCount.children +
        passengerCount.infants;
      const details = Array(totalPassengers)
        .fill()
        .map(() => ({
          title: "",
          lastName: "",
          firstName: "",
          middleName: "",
          dateOfBirth: "",
          nationality: "",
          mobileNumber: "",
          email: "",
          gender: "",
        }));
      setPassengerDetails(details);
    }
  }, [isOpen, passengerCount]);

  const handlePassengerCountChange = (type, value) => {
    setPassengerCount((prev) => ({
      ...prev,
      [type]: Math.max(0, Math.min(9, value)),
    }));
  };

  const handleInputChange = (index, field, value) => {
    const updatedDetails = [...passengerDetails];
    updatedDetails[index][field] = value;
    setPassengerDetails(updatedDetails);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Passenger details:", passengerDetails);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-900">Flight Booking</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentStep === 1 ? (
            <>
              <h3 className="text-lg font-semibold mb-4">Passenger Details</h3>

              {/* Passenger Count Selection */}
              <div className="mb-6 p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="font-medium">Adults (12y+)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        handlePassengerCountChange(
                          "adults",
                          passengerCount.adults - 1
                        )
                      }
                      disabled={passengerCount.adults <= 1}
                      className="w-8 h-8 rounded-full border flex items-center justify-center disabled:opacity-50"
                    >
                      -
                    </button>
                    <span>{passengerCount.adults}</span>
                    <button
                      onClick={() =>
                        handlePassengerCountChange(
                          "adults",
                          passengerCount.adults + 1
                        )
                      }
                      disabled={passengerCount.adults >= 9}
                      className="w-8 h-8 rounded-full border flex items-center justify-center disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="font-medium">Children (2y-11y)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        handlePassengerCountChange(
                          "children",
                          passengerCount.children - 1
                        )
                      }
                      disabled={passengerCount.children <= 0}
                      className="w-8 h-8 rounded-full border flex items-center justify-center disabled:opacity-50"
                    >
                      -
                    </button>
                    <span>{passengerCount.children}</span>
                    <button
                      onClick={() =>
                        handlePassengerCountChange(
                          "children",
                          passengerCount.children + 1
                        )
                      }
                      disabled={passengerCount.children >= 9}
                      className="w-8 h-8 rounded-full border flex items-center justify-center disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">Infants (below 2y)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        handlePassengerCountChange(
                          "infants",
                          passengerCount.infants - 1
                        )
                      }
                      disabled={passengerCount.infants <= 0}
                      className="w-8 h-8 rounded-full border flex items-center justify-center disabled:opacity-50"
                    >
                      -
                    </button>
                    <span>{passengerCount.infants}</span>
                    <button
                      onClick={() =>
                        handlePassengerCountChange(
                          "infants",
                          passengerCount.infants + 1
                        )
                      }
                      disabled={passengerCount.infants >= 9}
                      className="w-8 h-8 rounded-full border flex items-center justify-center disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Passenger Details Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setCurrentStep(2);
                }}
              >
                {passengerDetails.map((passenger, index) => (
                  <div key={index} className="mb-6 p-4 border rounded-lg">
                    <h4 className="font-medium mb-4">Passenger {index + 1}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Title
                        </label>
                        <select
                          value={passenger.title}
                          onChange={(e) =>
                            handleInputChange(index, "title", e.target.value)
                          }
                          className="w-full p-2 border rounded-md"
                          required
                        >
                          <option value="">Select Title</option>
                          <option value="Mr">Mr</option>
                          <option value="Mrs">Mrs</option>
                          <option value="Ms">Ms</option>
                          <option value="Dr">Dr</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={passenger.lastName}
                          onChange={(e) =>
                            handleInputChange(index, "lastName", e.target.value)
                          }
                          className="w-full p-2 border rounded-md"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={passenger.firstName}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "firstName",
                              e.target.value
                            )
                          }
                          className="w-full p-2 border rounded-md"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Middle Name
                        </label>
                        <input
                          type="text"
                          value={passenger.middleName}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "middleName",
                              e.target.value
                            )
                          }
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          value={passenger.dateOfBirth}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "dateOfBirth",
                              e.target.value
                            )
                          }
                          className="w-full p-2 border rounded-md"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nationality
                        </label>
                        <input
                          type="text"
                          value={passenger.nationality}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "nationality",
                              e.target.value
                            )
                          }
                          className="w-full p-2 border rounded-md"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mobile Number
                        </label>
                        <input
                          type="tel"
                          value={passenger.mobileNumber}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "mobileNumber",
                              e.target.value
                            )
                          }
                          className="w-full p-2 border rounded-md"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={passenger.email}
                          onChange={(e) =>
                            handleInputChange(index, "email", e.target.value)
                          }
                          className="w-full p-2 border rounded-md"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Gender
                        </label>
                        <select
                          value={passenger.gender}
                          onChange={(e) =>
                            handleInputChange(index, "gender", e.target.value)
                          }
                          className="w-full p-2 border rounded-md"
                          required
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex items-center mb-6">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="mr-2"
                    required
                  />
                  <label htmlFor="terms" className="text-sm text-gray-700">
                    I agree to the{" "}
                    <button
                      type="button"
                      onClick={() => setShowTerms(true)}
                      className="text-blue-600 hover:underline"
                    >
                      Terms and Conditions
                    </button>
                  </label>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Continue to Payment
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Review Your Booking
              </h3>
              {/* Add review content here */}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Terms and Conditions Modal */}
      {showTerms && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900">
                Terms and Conditions
              </h2>
              <button
                onClick={() => setShowTerms(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 text-sm">
              <p className="mb-4">
                All bookings/reservations made on vigicaconsult.com are subject
                to third-party operating airline rules and terms of carriage.
              </p>
              <p className="mb-4">
                VIGICA merely acts as a travel agent of third party operating
                Airlines and SHALL have NO responsibility, whatsoever, for any
                additional cost (directly or indirectly) incurred by any
                passenger due to any delay, loss, cancellation, change,
                inaccurate/insufficient information arising whether during
                booking reservation or after ticket issuance.
              </p>
              <p className="mb-4">
                All the flight bookings/reservations are subject to airline
                availability and are valid for 1 (one) hour from the time of
                booking to payment confirmation and ticket issuance.
              </p>
              <p className="mb-4">
                All flights quoted on www.vigicaconsult.com are subject to
                availability and to change at any time by the third party
                airline operators.
              </p>
              <p className="mb-4">
                Passengers are liable for all travel details, compliance and
                adequacy of visa requirements, travel itinerary and names (as
                appear on passport) provided for bookings.
              </p>
              <p className="mb-4">
                Ticket issuance SHALL BE subject to payment confirmation by
                VIGICA Consult.
              </p>
              <p className="mb-4">
                Please ensure that your international passport has at least 6
                (six) months validity prior to its expiration date as VIGICA
                Consult shall not be liable for any default.
              </p>
              <p className="mb-4">
                For all non-card transactions, please contact us at 09014456659,
                08035378450 to confirm booking details, travel dates, and travel
                requirements before proceeding to payment.
              </p>
              <p className="mb-4">
                Refund, cancellation, and change requests, where applicable, are
                subject to third-party operating airline's policy, plus a
                service charge of $50.
              </p>
              <p className="mb-4">
                Refund settlement shall be pursuant to fund remittance by the
                operating airline.
              </p>
              <p className="mb-4">
                Passengers are advised to arrive at the airport at least 4-5
                hours prior to flight departure.
              </p>
              <p className="mb-4">
                First-time travellers are advised to have a return flight
                ticket, confirmed hotel/accommodation, and a minimum of $1000
                for Personal Travel Allowance (PTA) or Business Travel Allowance
                (BTA).
              </p>
              <p className="mb-4">
                An original child's birth certificate and consent letter from
                parent(s) must be presented before the check-in counter at the
                airport.
              </p>
              <p className="mb-4">
                All tickets are non-transferable at any time. Some tickets may
                be non-refundable or non-changeable.
              </p>
              <p className="mb-4">
                Some airlines may require additional Medical Report/Documents in
                the case of pregnant passenger(s).
              </p>
              <p className="mb-4">
                The passenger hereby confirms to have read and understood this
                booking information notice and has agreed to waive all rights,
                by law, and to hold harmless and absolve VIGICA Consult Ltd of
                all liabilities that may arise thereof.
              </p>
            </div>
            <div className="p-6 border-t flex justify-end">
              <button
                onClick={() => setShowTerms(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightBookingModal;
