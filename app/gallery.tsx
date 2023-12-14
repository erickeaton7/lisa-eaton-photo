// app/gallery.tsx

import React, { useEffect, useState } from 'react';
import Layout from './layout';

interface Photo {
    id: number;
    title: string;
    url: string;
}

const Gallery: React.FC = () => {
    const [photos, setPhotos] = useState<Photo[]>([]);

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/photos')
            .then(response => response.json())
            .then(photos => setPhotos(photos));
    }, []);
    
    return (
        <Layout>
            <h1 className="text-center my-4">Gallery</h1>
            <div className="row">
                {photos.map(photo => (
                    <div key={photo.id} className="col-sm-6 col-md-4 col-lg-3">
                        <div className="card">
                            <img src={photo.url} alt={photo.title} className="card-img-top" />
                            <div className="card-body">
                                <h5 className="card-title">{photo.title}</h5>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Layout>
    );
};

export default Gallery;