import React, { useState } from 'react';
import styles from './InsertItem.module.css';

const InsertItem = () => {
  const [selectedItem, setSelectedItem] = useState('');
  const [value, setValue] = useState<string>('Source Type');

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedItem(event.target.value);
  };

  const fetchUrl = async (url: string) => {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
  };

  return (
    <div className={styles.row}>
      <label className="flex-rowform-control max-w-s">
        <div className="label">
          <span className="label-text">Select your input source</span>
        </div>
        <select
          className="select select-bordered w-full pr-7"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        >
          <option disabled>Source Type</option>
          <option>URL</option>
          <option>File Upload</option>
        </select>
      </label>
      <div className="">
        {value === 'URL' ? (
          <input
            type="text"
            placeholder="Enter URL"
            className="input w-full max-w-xs ml-3"
            // onChange={(e) => fetchUrl(e.target.value)}
          />
        ) : (
          <input
            type="file"
            className="file-input file-input-bordered w-full max-w-xs ml-3"
          />
        )}
      </div>

      {/* <div className="relative right-11 mt-9 w-80">
        
      </div> */}
    </div>
  );
};

export default InsertItem;
