import React from "react";
import "./FlightBookingSection.css";
import flightImage from "../../assets/images/airplane.png";
import happyCustomers from "../../assets/images/happy-customers.png";

const FlightBookingSection = () => (
  <section className="flight-booking-section">
    <div className="container">
      <h2 className="flight-booking-title">WHERE TO FLY?</h2>
      <p className="flight-booking-description">
        We Assist You To Find Countless Flights Options & Deals To Various
        Destinations Around The World
      </p>
      <div className="row align-items-center">
        <div className="col-md-5">
          <img
            src={happyCustomers}
            alt="Happy Customers"
            className="flight-booking-image border border-white border-5"
          />
        </div>
        <div className="col-md-7">
          <img
            src={flightImage}
            alt="Airplane"
            className="flight-booking-airplane flip-horizontal flip-image"
          />
        </div>
      </div>
      <h3 className="flight-booking-start">Start Booking Your Flight Now</h3>
      <div className="flight-booking-form">
        {/* Top row with flight type options and search button */}
        <div className="form-top-row">
          <div className="flight-type-options">
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="flightType"
                id="oneWay"
                value="oneWay"
                defaultChecked
              />
              <label className="form-check-label active" htmlFor="oneWay">
                One Way
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="flightType"
                id="roundTrip"
                value="roundTrip"
              />
              <label className="form-check-label" htmlFor="roundTrip">
                Round Trip
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="flightType"
                id="multiCity"
                value="multiCity"
              />
              <label className="form-check-label" htmlFor="multiCity">
                Multi-City
              </label>
            </div>
            <div className="coach-dropdown">
              <select className="form-select coach-select">
                <option defaultValue>Economy</option>
                <option value="1">First Class</option>
                <option value="2">Business</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary flight-search-btn d-none d-md-inline-block"
          >
            Click to Continue
          </button>
        </div>

        {/* Main form row */}
        <div className="form-main-row">
          <div className="form-field from-field component-bg">
            <label className="field-label">From</label>
            <input
              type="text"
              className="form-control field-input"
              placeholder="Origin"
            />
          </div>

          <div className="swap-button d-flex justify-content-center">
            <button
              type="button"
              className="btn-swap d-flex justify-content-center align-items-center align-self-center p-2"
              style={{ width: "50px", height: "50px" }}
            >
              {/* Desktop Icon */}
              <i className="bi bi-arrow-left-right d-none d-lg-inline thick-icon"></i>

              {/* Mobile Icon */}
              <i className="bi bi-arrow-down-up d-lg-none thick-icon"></i>
            </button>
          </div>

          <div className="form-field to-field component-bg">
            <label className="field-label">To</label>
            <input
              type="text"
              className="form-control field-input"
              placeholder="Destination"
            />
          </div>

          <div className="form-field date-field component-bg">
            <label className="field-label">Departure Date</label>
            <div className="date-input-wrapper">
              {/* <i className="fas fa-calendar-alt date-icon"></i> */}
              <input type="date" className="form-control field-input" />
            </div>
          </div>

          <div className="form-field date-field component-bg">
            <label className="field-label">Return Date</label>
            <div className="date-input-wrapper">
              {/* <i className="fas fa-calendar-alt date-icon"></i> */}
              <input type="date" className="form-control field-input" />
            </div>
          </div>

          <div className="form-field traveler-field component-bg">
            <label className="field-label">Traveler</label>
            <div className="traveler-input-wrapper">
              <i className="fas fa-user traveler-icon mx-2"></i>
              <select className="form-control field-input">
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </select>
            </div>
          </div>

          <div className="search-button-wrapper">
            <button type="button" className="btn btn-primary search-btn">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>

        {/* Bottom row with fare options */}
        <div className="flight-fare-options">
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="fareType"
              id="regularFare"
              value="regularFare"
              defaultChecked
            />
            <label className="form-check-label" htmlFor="regularFare">
              Regular Fare
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="fareType"
              id="studentFare"
              value="studentFare"
            />
            <label className="form-check-label" htmlFor="studentFare">
              Student Fare
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary flight-search-btn d-block d-md-none"
        >
          Click to Continue
        </button>
      </div>
    </div>
  </section>
);

export default FlightBookingSection;
