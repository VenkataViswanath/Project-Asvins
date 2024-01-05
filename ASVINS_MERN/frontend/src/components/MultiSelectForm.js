import React, { useState } from 'react';
import Select from 'react-select';

function MultiSelectForm({options}) {

  const transformedOptions = options.map((option) => ({
    label: option,
    value: option,
  }));

  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleOptionChange = (selectedValues) => {
    setSelectedOptions(selectedValues);
  };

  return (
    <div>
      <Select
        isMulti
        options={transformedOptions}
        className="basic-multi-select"
        classNamePrefix="select"
        value={selectedOptions}
        onChange={handleOptionChange}
      />
    </div>
  );
}

export default MultiSelectForm;
