import React from 'react'
import Backface from '../Layouts/Backface'
import Carousel from '../Layouts/Carousel'
import img1 from '../../image-gallery.jpg';
import img2 from '../../Beach_Lifestyle.jpg'
import DragDropAvailable from '../Layouts/DragDropAvailable';
const images = [
    img1, img2, img1, img2, img1, img2
]
const HomePage = () => {
  return (
    <div style={{paddingBottom:"30px"}}>
        <Backface />
        <Carousel images={images} />
        <DragDropAvailable />
    </div>
  )
}

export default HomePage