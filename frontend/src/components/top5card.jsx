import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMusic, FaUser, FaCircleInfo } from 'react-icons/fa6';

const TopFiveCard = ({ title, items, type="artist", label = "", shownum = false, info = "This is an example description" }) => {
  const navigate = useNavigate();

  const handleClick = (id) => {
    navigate(`/${type}/${id}`);
  };

  const getTypeIcon = () => {
    return <FaUser />;
  };

  return (
    <div className="bg-base-200 rounded-3xl outline outline-1 outline-base-300 h-full w-full p-4 flex flex-col">
      <div className="flex flex-col items-center text-center text-l text-info pt-4 h-24" style={{ minHeight: '4em', justifyContent: 'center' }}>
        <div className="flex items-center text-accent">
          <div className="tooltip tooltip-error" data-tip={info}>
            <FaCircleInfo className="text-accent cursor-pointer" />
          </div>
          <span className="ml-2 text-info capitalize"></span>
        </div>
        <div className="text-xl mt-2 flex items-center justify-center">
          <span
            className="block truncate text-white h-16 text-xl"
            style={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden', whiteSpace: 'normal' }}
          >
            {title}
          </span>
        </div>
      </div>
      <ol className="list-decimal list-inside">
        {items.map((item, index) => (
          <React.Fragment key={item.id}>
            <li
              className="text-xl mt-2 cursor-pointer flex justify-between items-center group"
              onClick={() => handleClick(item.document.artistId)}
            >
              <span
                className="block truncate text-white group-hover:text-accent group-hover:underline text-md"
                style={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden', whiteSpace: 'normal' }}
              >
                {item.document.name}
              </span>
              <span className="ml-2 text-info text-lg group-hover:text-accent">
                {shownum ? `#${index + 1}` : `${item.score} ${label}`}
              </span>
            </li>
            <hr className="border-t-1 border-neutral-content m-3" />
          </React.Fragment>
        ))}
      </ol>
    </div>
  );
};

export default TopFiveCard;
