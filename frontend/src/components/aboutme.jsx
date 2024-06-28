import React from 'react';

const AboutMeModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box p-4 max-w-96">
        <h2 className="text-lg">Hello!</h2>
        <p className="py-4 font-light">
          My name is Aryan, and I am a full-stack developer, and a Computer Science + BBA student at the University of Michigan. I built this project using React, Express, and MongoDB to show people the beautiful insights in analyzing music.
        </p>
        <p className="py-4 font-light">
          I am passionate about software development, and I am always looking for new opportunities to learn and grow. I am currently seeking a software engineering internship for Summer 2025, and I would love to connect with you! Feel free to reach out to me at <a href="mailto:shahary@umich.edu" className="text-accent">shahary@umich.edu</a>.
        </p>
        <p className="py-4 font-light">
          For those who would like their music featured on this website, please contact me at <a href="mailto:analyrics.contact@gmail.com" className="text-accent">analyrics.contact@gmail.com</a>
        </p>
        <p className="py-4 font-light">
          If you would like to support this project, its growth, and more like it, please buy me a coffee at <a href="https://buymeacoffee.com/shahary" className="text-accent" target="_blank" rel="noopener noreferrer">buymeacoffee.com/shahary</a>
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
