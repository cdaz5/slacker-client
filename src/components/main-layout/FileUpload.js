import React from 'react';
import Dropzone from 'react-dropzone';

const Uploader = ({ children, disableClick }) => (
  <Dropzone disableClick={disableClick} className="none" onDrop={file => console.log(file)}>
    {children}
  </Dropzone>
);

export default Uploader;
