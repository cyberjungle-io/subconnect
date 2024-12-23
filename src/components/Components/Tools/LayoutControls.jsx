import React from "react";

const LayoutControls = ({ style, onStyleChange }) => {
  const handlePropChange = (name, value) => {
    // For direction, update flexDirection directly
    if (name === "flexDirection") {
      console.log("LayoutControls: Updating flexDirection", {
        oldValue: value,
        newProps: { flexDirection: value },
      });
      onStyleChange({
        props: {
          flexDirection: value,
        },
      });
      return;
    }

    // For other layout properties, update props directly
    if (
      ["flexWrap", "alignItems", "justifyContent", "alignContent"].includes(
        name
      )
    ) {
      console.log("LayoutControls: Updating layout prop", {
        name,
        value,
        newProps: { [name.charAt(0).toLowerCase() + name.slice(1)]: value },
      });
      onStyleChange({
        props: {
          [name.charAt(0).toLowerCase() + name.slice(1)]: value,
        },
      });
      return;
    }

    // For any other properties, update style
    console.log("LayoutControls: Updating style", {
      name,
      value,
      newStyle: { [name]: value },
    });
    onStyleChange({ style: { [name]: value } });
  };

  const buttonClass =
    "px-3 py-1 text-sm rounded-full transition-colors duration-200 border flex-grow text-center";
  const activeButtonClass = `${buttonClass} bg-[#cce7ff] text-blue-700 border-blue-300`;
  const inactiveButtonClass = `${buttonClass} bg-white text-blue-600 border-blue-200 hover:bg-[#e6f3ff]`;

  const renderButtonControl = (label, name, options, customLayout = false) => (
    <div className="mb-4">
      <h4 className="text-sm font-medium text-gray-700 mb-2">{label}</h4>
      {customLayout ? (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            {options.slice(0, 3).map((option) => (
              <button
                key={option.value}
                onClick={() => handlePropChange(name, option.value)}
                className={`${
                  style[name] === option.value
                    ? activeButtonClass
                    : inactiveButtonClass
                } flex-1`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {options.slice(3).map((option) => (
              <button
                key={option.value}
                onClick={() => handlePropChange(name, option.value)}
                className={`${
                  style[name] === option.value
                    ? activeButtonClass
                    : inactiveButtonClass
                } flex-1`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handlePropChange(name, option.value)}
              className={
                style[name] === option.value
                  ? activeButtonClass
                  : inactiveButtonClass
              }
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="control-section">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        Layout Controls
      </h3>
      <div className="control-section-content">
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Direction</h4>
          <div className="flex gap-2">
            {[
              { value: "row", label: "Row" },
              { value: "column", label: "Column" },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => handlePropChange("flexDirection", value)}
                className={`${
                  style.flexDirection === value
                    ? activeButtonClass
                    : inactiveButtonClass
                } flex-1`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Wrap</h4>
          <div className="flex gap-2">
            {["nowrap", "wrap", "wrap-reverse"].map((value) => (
              <button
                key={value}
                onClick={() => handlePropChange("flexWrap", value)}
                className={`${
                  style.flexWrap === value
                    ? activeButtonClass
                    : inactiveButtonClass
                } flex-1`}
              >
                {value === "nowrap"
                  ? "No Wrap"
                  : value.charAt(0).toUpperCase() + value.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Justify Content
          </h4>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              {["flex-start", "center", "flex-end"].map((value) => (
                <button
                  key={value}
                  onClick={() => handlePropChange("justifyContent", value)}
                  className={`${
                    style.justifyContent === value
                      ? activeButtonClass
                      : inactiveButtonClass
                  } flex-1`}
                >
                  {value === "flex-start"
                    ? "Start"
                    : value === "flex-end"
                    ? "End"
                    : "Center"}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {["space-between", "space-around", "space-evenly"].map(
                (value) => (
                  <button
                    key={value}
                    onClick={() => handlePropChange("justifyContent", value)}
                    className={`${
                      style.justifyContent === value
                        ? activeButtonClass
                        : inactiveButtonClass
                    } flex-1`}
                  >
                    {value.split("-")[1].charAt(0).toUpperCase() +
                      value.split("-")[1].slice(1)}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {renderButtonControl(
          "Align Items",
          "alignItems",
          [
            { value: "flex-start", label: "Start" },
            { value: "center", label: "Center" },
            { value: "flex-end", label: "End" },
            { value: "stretch", label: "Stretch" },
            { value: "baseline", label: "Baseline" },
          ],
          true
        )}

        {renderButtonControl(
          "Align Content",
          "alignContent",
          [
            { value: "flex-start", label: "Start" },
            { value: "center", label: "Center" },
            { value: "flex-end", label: "End" },
            { value: "stretch", label: "Stretch" },
            { value: "space-between", label: "Between" },
            { value: "space-around", label: "Around" },
          ],
          true
        )}
      </div>
    </div>
  );
};

export default LayoutControls;
