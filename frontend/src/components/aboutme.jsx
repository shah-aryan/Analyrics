import React from 'react';

const AboutMeModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open rounded-3xl">
      <div className="modal-box p-4">
        <h2 className="text-lg">Hello!</h2>
        <p className="py-4 font-light">
          My name is Aryan. I am a full-stack developer, and a Computer Science + BBA student at the University of Michigan. I built this project using React, Express, and MongoDB to show people the beautiful insights in analyzing music.
        </p>
        <p className="py-4 font-light">
          I am currently seeking a software engineering internship for Summer 2025, and I would love to connect with you! Feel free to reach out to me at <a href="mailto:shahary@umich.edu" className="text-accent">shahary@umich.edu</a>.
        </p>
        <p className="py-4 font-light">
          If you have recommendations or would like your music featured, please contact me at <a href="mailto:analyrics.contact@gmail.com" className="text-accent">analyrics.contact@gmail.com</a>
        </p>
        <p className="pt-4 font-light">
          I maintain a large database of over 1M songs, artists, and albums for Analyrics. If you would like to support this project and keep it running and growing, please buy me a coffee at <a href="https://buymeacoffee.com/shahary" className="text-accent" target="_blank" rel="noopener noreferrer">buymeacoffee.com/shahary</a>
        </p>

        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutMeModal;
