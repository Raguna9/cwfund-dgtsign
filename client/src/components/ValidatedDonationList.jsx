import React from 'react';
import Identicons from 'react-identicons';
import { Link } from 'react-router-dom';
import { FaEthereum } from 'react-icons/fa';

// ValidatedDonationList component handling layout
const ValidatedDonationList = () => {
  return (
    <div className="flex flex-col px-6 mb-7">
      <div className="flex justify-center items-center flex-wrap">
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
        {/* Add more ProjectCard components as needed */}
      </div>
      <div className="flex justify-center items-center my-5">
        <button
          type="button"
          className="inline-block px-6 py-2.5 bg-blue-600
            text-white font-medium text-xs leading-tight uppercase
            rounded-full shadow-md hover:bg-blue-700"
        >
          Load More
        </button>
      </div>
    </div>
  );
};

// ProjectCard component for displaying project details
const ProjectCard = () => {
  return (
    <div className="rounded-lg shadow-lg bg-white w-64 m-4">
      <Link to="/projects/1">
        <img
          src="https://placekitten.com/200/300" // Placeholder image
          alt="Project Title"
          className="rounded-xl h-64 w-full object-cover"
        />
        <div className="p-4">
          <h5>Project Title</h5>
          <div className="flex flex-col">
            <div className="flex justify-start space-x-2 items-center mb-3">
              <Identicons
                className="rounded-full shadow-md"
                string="owner"
                size={15}
              />
              <small className="text-gray-700">Owner</small>
            </div>
            <small className="text-gray-500">Days Remaining</small>
          </div>
          <div className="w-full bg-gray-300 overflow-hidden">
            <div
              className="bg-green-600 text-xs font-medium
              text-green-100 text-center p-0.5 leading-none
              rounded-l-full"
              style={{ width: '50%' }} // Placeholder value
            ></div>
          </div>
          <div
            className="flex justify-between items-center
            font-bold mt-1 mb-2 text-gray-700"
          >
            <small>ETH Raised</small>
            <small className="flex justify-start items-center">
              <FaEthereum />
              <span>ETH Goal</span>
            </small>
          </div>
          <div
            className="flex justify-between items-center flex-wrap
            mt-4 mb-2 text-gray-500 font-bold"
          >
            <small>Backers</small>
            <div>
              <small className="text-gray-500">Status</small>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ValidatedDonationList;
