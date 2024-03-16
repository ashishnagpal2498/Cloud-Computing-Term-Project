import React, { useState } from 'react';
import '../../Stylesheets/directory.css'; // Import your CSS file for styling
import DirectoryListItem from '../Layouts/Directory/DirectoryListItem';
import img1 from '../../Beach_Lifestyle.jpg'
import ImageGallery from '../Layouts/Image-Gallery/ImageGallery';

// Sample directory structure data
const directoryData = [
    {
        name: 'Goa Trip',
        type: 'directory',
        children: [
            {
                name: "Project", type: "directory", children: [
                    { name: "file1.png", type: "file", url:img1 }
                ]
            },
            {
                name: 'Images',
                type: 'directory',
                children: [
                    { name: 'Image1.jpg', type: 'file', url: img1 },
                    { name: 'Image2.png', type: 'file', url: img1 },
                ],
            }
        ],
    },
    {
        name: 'Rahul Wedding',
        type: 'directory',
        children: [
            {
                name: "Project", type: "directory", children: [
                    { name: "file1.png", type: "file", url:img1 }
                ]
            },
            {
                name: 'Images',
                type: 'directory',
                children: [
                    { name: 'Image1.jpg', type: 'file', url: img1 },
                    { name: 'Image2.png', type: 'file', url: img1 },
                    // Add more files or subdirectories as needed
                ],
            }
        ],
    }
];

const Directory = () => {
    const [selectedDirectory, setSelectedDirectory] = useState(directoryData[0]);

    const handleDirectoryClick = (directory) => {
        setSelectedDirectory(directory);
        console.log(directory);
    };

    return (
        <div className="directory-container">
            <div className='container-heading'>
                <div className='heading-left'>
                    My files
                </div>
                <div className='heading-right'>
                    {/* Selected Directory --> */}
                    {selectedDirectory.name}
                </div>
            </div>
            <div className='container-content'>
                <ul className='directory-list'>
                    {directoryData.map((item, index) => (
                        <DirectoryListItem key={index}
                            item={item}
                            handleDirectoryClick={handleDirectoryClick}
                            isSelected={selectedDirectory}
                        />
                    ))}
                </ul>
                <ul className="file-list">
                    {selectedDirectory.children.map((item, index) => (
                        <li key={index} className="file-item" onClick={item.type === 'directory' ? () => handleDirectoryClick(item) : null}>
                            {item.type === 'directory' ?
                            <div className='file-item-directory'>
                                <div className='file-directory-icon'>
                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 48 48">
                                        <linearGradient id="xGIh33lbYX9pWIYWeZsuka_zRCxfHhAkOiL_gr1" x1="24" x2="24" y1="6.955" y2="23.167" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#eba600"></stop><stop offset="1" stop-color="#c28200"></stop></linearGradient><path fill="url(#xGIh33lbYX9pWIYWeZsuka_zRCxfHhAkOiL_gr1)" d="M24.414,10.414l-2.536-2.536C21.316,7.316,20.553,7,19.757,7H5C3.895,7,3,7.895,3,9v30	c0,1.105,0.895,2,2,2h38c1.105,0,2-0.895,2-2V13c0-1.105-0.895-2-2-2H25.828C25.298,11,24.789,10.789,24.414,10.414z"></path><linearGradient id="xGIh33lbYX9pWIYWeZsukb_zRCxfHhAkOiL_gr2" x1="24.066" x2="24.066" y1="19.228" y2="33.821" gradientTransform="matrix(-1 0 0 1 48 0)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ffd869"></stop><stop offset="1" stop-color="#fec52b"></stop></linearGradient><path fill="url(#xGIh33lbYX9pWIYWeZsukb_zRCxfHhAkOiL_gr2)" d="M24,23l3.854-3.854C27.947,19.053,28.074,19,28.207,19H44.81c1.176,0,2.098,1.01,1.992,2.181	l-1.636,18C45.072,40.211,44.208,41,43.174,41H4.79c-1.019,0-1.875-0.766-1.988-1.779L1.062,23.555C1.029,23.259,1.261,23,1.559,23	H24z"></path>
                                    </svg>
                                </div>
                                <p>{item.name}</p>
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 30 30">
                                    <path d="M 5 4 C 3.895 4 3 4.895 3 6 L 3 9 L 3 11 L 22 11 L 27 11 L 27 8 C 27 6.895 26.105 6 25 6 L 12.199219 6 L 11.582031 4.9707031 C 11.221031 4.3687031 10.570187 4 9.8671875 4 L 5 4 z M 2.5019531 13 C 1.4929531 13 0.77040625 13.977406 1.0664062 14.941406 L 4.0351562 24.587891 C 4.2941563 25.426891 5.0692656 26 5.9472656 26 L 15 26 L 24.052734 26 C 24.930734 26 25.705844 25.426891 25.964844 24.587891 L 28.933594 14.941406 C 29.229594 13.977406 28.507047 13 27.498047 13 L 15 13 L 2.5019531 13 z"></path>
                                </svg>
                            </div>
                            : <ImageGallery image={item}/>
                            }
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Directory;
