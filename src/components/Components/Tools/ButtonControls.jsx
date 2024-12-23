import React, { useState } from 'react';
import ColorPicker from '../../common/ColorPicker';
import { useSelector } from 'react-redux';

const CURSOR_OPTIONS = [
  { value: 'pointer', label: 'Pointer' },
  { value: 'default', label: 'Default' },
  { value: 'move', label: 'Move' },
  { value: 'grab', label: 'Grab' },
  { value: 'grabbing', label: 'Grabbing' },
  { value: 'not-allowed', label: 'Not Allowed' },
  { value: 'wait', label: 'Wait' },
  { value: 'progress', label: 'Progress' },
  { value: 'help', label: 'Help' },
  { value: 'crosshair', label: 'Crosshair' },
  { value: 'text', label: 'Text' },
  { value: 'copy', label: 'Copy' },
  { value: 'cell', label: 'Cell' },
];

const HTTP_METHODS = [
  { value: 'GET', label: 'GET' },
  { value: 'POST', label: 'POST' },
  { value: 'PUT', label: 'PUT' },
  { value: 'DELETE', label: 'DELETE' },
];

const AUTH_TYPES = [
  { value: 'none', label: 'None' },
  { value: 'bearer', label: 'Bearer Token' },
  { value: 'api-key', label: 'API Key' },
];

const ButtonControls = ({ style = {}, onStyleChange }) => {
  const [showHoverEffects, setShowHoverEffects] = useState(false);
  const [showWebService, setShowWebService] = useState(false);
  const currentProject = useSelector((state) => state.w3s.currentProject?.data);

  const handleChange = (changes) => {
    onStyleChange({ ...style, ...changes });
  };

  const toggleHoverEffects = () => {
    setShowHoverEffects(!showHoverEffects);
  };

  const toggleWebService = () => {
    setShowWebService(!showWebService);
  };

  const renderInput = (value, onChange, min, max, step = 1) => (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      min={min}
      max={max}
      step={step}
      className="w-full p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
    />
  );

  // Add these button classes
  const activeButtonClass = "px-3 py-1 text-sm rounded-full transition-colors duration-200 border bg-[#cce7ff] text-blue-700 border-blue-300";
  const inactiveButtonClass = "px-3 py-1 text-sm rounded-full transition-colors duration-200 border bg-white text-blue-600 border-blue-200 hover:bg-[#e6f3ff]";

  return (
    <div className="space-y-4">
      {/* Control buttons at the top */}
      <div className="flex w-full space-x-2">
        <button
          onClick={() => {
            handleChange({ enablePageNavigation: !style.enablePageNavigation });
          }}
          className={style.enablePageNavigation ? activeButtonClass : inactiveButtonClass}
        >
          Page Navigation
        </button>
        <button
          onClick={toggleHoverEffects}
          className={showHoverEffects ? activeButtonClass : inactiveButtonClass}
        >
          Hover Effects
        </button>
        <button
          onClick={toggleWebService}
          className={showWebService ? activeButtonClass : inactiveButtonClass}
        >
          Web Service
        </button>
      </div>

      {/* Page Navigation Section */}
      {style.enablePageNavigation && currentProject?.pages && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Page
          </label>
          <select
            value={style.targetPageId || ''}
            onChange={(e) => handleChange({ targetPageId: e.target.value })}
            className="w-full p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select a page</option>
            {currentProject.pages.map((page, index) => (
              <option key={page._id || index} value={page._id}>
                {page.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Web Service Section */}
      {showWebService && (
        <div className="pt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Type
            </label>
            <select
              value={style.serviceType || 'data'}
              onChange={(e) => handleChange({ 
                serviceType: e.target.value,
                serviceConfig: {
                  ...style.serviceConfig,
                  type: e.target.value
                }
              })}
              className="w-full p-2 text-sm border border-gray-300 rounded-md"
            >
              <option value="data">Data Service</option>
              <option value="action">Action Service</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              HTTP Method
            </label>
            <select
              value={style.serviceConfig?.method || 'GET'}
              onChange={(e) => handleChange({
                serviceConfig: {
                  ...style.serviceConfig,
                  method: e.target.value
                }
              })}
              className="w-full p-2 text-sm border border-gray-300 rounded-md"
            >
              {HTTP_METHODS.map(method => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Endpoint URL
            </label>
            <input
              type="text"
              value={style.serviceConfig?.endpoint || ''}
              onChange={(e) => handleChange({
                serviceConfig: {
                  ...style.serviceConfig,
                  endpoint: e.target.value
                }
              })}
              className="w-full p-2 text-sm border border-gray-300 rounded-md"
              placeholder="https://api.example.com/data"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Authentication
            </label>
            <select
              value={style.serviceConfig?.authentication?.type || 'none'}
              onChange={(e) => handleChange({
                serviceConfig: {
                  ...style.serviceConfig,
                  authentication: {
                    type: e.target.value,
                    credentials: {}
                  }
                }
              })}
              className="w-full p-2 text-sm border border-gray-300 rounded-md"
            >
              {AUTH_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {style.serviceConfig?.authentication?.type === 'bearer' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bearer Token
              </label>
              <input
                type="text"
                value={style.serviceConfig?.authentication?.credentials?.token || ''}
                onChange={(e) => handleChange({
                  serviceConfig: {
                    ...style.serviceConfig,
                    authentication: {
                      ...style.serviceConfig.authentication,
                      credentials: {
                        token: e.target.value
                      }
                    }
                  }
                })}
                className="w-full p-2 text-sm border border-gray-300 rounded-md"
                placeholder="Enter bearer token"
              />
            </div>
          )}

          {style.serviceConfig?.authentication?.type === 'api-key' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key Header
                </label>
                <input
                  type="text"
                  value={style.serviceConfig?.authentication?.credentials?.header || ''}
                  onChange={(e) => handleChange({
                    serviceConfig: {
                      ...style.serviceConfig,
                      authentication: {
                        ...style.serviceConfig.authentication,
                        credentials: {
                          ...style.serviceConfig.authentication.credentials,
                          header: e.target.value
                        }
                      }
                    }
                  })}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md"
                  placeholder="X-API-Key"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key
                </label>
                <input
                  type="text"
                  value={style.serviceConfig?.authentication?.credentials?.key || ''}
                  onChange={(e) => handleChange({
                    serviceConfig: {
                      ...style.serviceConfig,
                      authentication: {
                        ...style.serviceConfig.authentication,
                        credentials: {
                          ...style.serviceConfig.authentication.credentials,
                          key: e.target.value
                        }
                      }
                    }
                  })}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md"
                  placeholder="Enter API key"
                />
              </div>
            </>
          )}

          {style.serviceType === 'data' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Response Path
              </label>
              <input
                type="text"
                value={style.serviceConfig?.responseMapping?.path || ''}
                onChange={(e) => handleChange({
                  serviceConfig: {
                    ...style.serviceConfig,
                    responseMapping: {
                      ...style.serviceConfig?.responseMapping,
                      path: e.target.value
                    }
                  }
                })}
                className="w-full p-2 text-sm border border-gray-300 rounded-md"
                placeholder="data.results"
              />
            </div>
          )}

          {style.serviceType === 'action' && (
            <>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={style.serviceConfig?.actionConfig?.confirmationRequired || false}
                  onChange={(e) => handleChange({
                    serviceConfig: {
                      ...style.serviceConfig,
                      actionConfig: {
                        ...style.serviceConfig?.actionConfig,
                        confirmationRequired: e.target.checked
                      }
                    }
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Require Confirmation
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Success Message
                </label>
                <input
                  type="text"
                  value={style.serviceConfig?.actionConfig?.successMessage || ''}
                  onChange={(e) => handleChange({
                    serviceConfig: {
                      ...style.serviceConfig,
                      actionConfig: {
                        ...style.serviceConfig?.actionConfig,
                        successMessage: e.target.value
                      }
                    }
                  })}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md"
                  placeholder="Action completed successfully"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Error Message
                </label>
                <input
                  type="text"
                  value={style.serviceConfig?.actionConfig?.errorMessage || ''}
                  onChange={(e) => handleChange({
                    serviceConfig: {
                      ...style.serviceConfig,
                      actionConfig: {
                        ...style.serviceConfig?.actionConfig,
                        errorMessage: e.target.value
                      }
                    }
                  })}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md"
                  placeholder="Action failed"
                />
              </div>
            </>
          )}
        </div>
      )}

      {/* Hover Effects Section */}
      {showHoverEffects && (
        <div className="pt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hover Color
            </label>
            <ColorPicker
              color={style.hoverBackgroundColor || '#e6e6e6'}
              onChange={(color) => handleChange({ hoverBackgroundColor: color })}
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hover Text Color
            </label>
            <ColorPicker
              color={style.hoverColor || '#000000'}
              onChange={(color) => handleChange({ hoverColor: color })}
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hover Scale
            </label>
            {renderInput(
              style.hoverScale || 1,
              (value) => handleChange({ hoverScale: value }),
              0.8,
              1.2,
              0.01
            )}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cursor Style
            </label>
            <select
              value={style.cursor || 'pointer'}
              onChange={(e) => handleChange({ cursor: e.target.value })}
              className="w-full p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              {CURSOR_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transition Duration (ms)
            </label>
            {renderInput(
              parseInt(style.transitionDuration) || 200,
              (value) => handleChange({ 
                transitionDuration: value,
                transition: `all ${value}ms ease-in-out`
              }),
              0,
              1000,
              50
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ButtonControls;
