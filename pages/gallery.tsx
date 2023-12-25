// app/gallery.tsx
import React, { useEffect, useState } from 'react';
import Layout from '../app/layout';
import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';
import galleryStyles from './gallery.module.css'; // This assumes that gallery.module.css is in the same directory as gallery.tsx
import 'bootstrap/dist/css/bootstrap.min.css';

// interface Photo {
//     id: number;
//     title: string;
//     url: string;
// }

const Gallery: React.FC = () => {
    const [photos, setPhotos] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showAbout, setShowAbout] = useState(false);

    useEffect(() => {
        fetch('/api/images')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(photos => {
                setPhotos(photos);
                setIsLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (photos.length === 0) {
        return <div>No photos found.</div>;
    }

    return (
        <Layout>
            <div className='position-relative'>
                <div className='hero-gradient'
                    style={{
                        backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1)), url("https://lisa-eaton-photo.nyc3.cdn.digitaloceanspaces.com/temp/tulips.jpg")`,
                        backgroundSize: 'cover',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: -1
                    }}></div>

                <div className="container"
                    style={{
                        backgroundColor: 'transparent'
                    }}>
                    <div className='pt-5'>
                        <div className="row justify-content-center">
                            <div className="col-auto">
                                <div className="profile-picture d-flex justify-content-center">
                                    <img src="https://lisa-eaton-photo.nyc3.cdn.digitaloceanspaces.com/temp/lighthouse_profile_photo.jpg"
                                        alt="Profile"
                                        className="rounded-circle border border-5 border-dark"
                                        style={{ width: '20%'}}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-auto text-center mt-2">
                                <h1 className="profile-name">Lisa Eaton Photo</h1>
                                <button style={{background: 'none', border: 'none'}} 
                                        onClick={() => setShowAbout(!showAbout)}>
                                    About 
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="h-5" style={{ opacity: showAbout ? '1' : '0', transition: 'opacity 0.5s ease-in-out' }}><polyline points="18 15 12 9 6 15"></polyline></svg>
                                </button>
                                <div style={{
                                    transition: 'max-height 0.5s ease-in-out, opacity 0.5s ease-in-out',
                                    maxHeight: showAbout ? '500px' : '0',
                                    opacity: showAbout ? '1' : '0',
                                    overflow: 'hidden'
                                }}>
                                    <p>Lisa is a Michigan native, living in New England since a young age. One of her most obvious and endearing qualities is how much she loves.
This website is dedicated to sharing how Lisa sees the world and how she chooses to focus on the subjects that she loves.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container container-no-padding mt-4">
                <div className="row">
                    {photos.map((photo, index) => (
                        <div key={index} className="col-6 col-md-4 col-lg-3 mb-4">
                            <img src={photo} alt={`Photo ${index + 1}`} className='card-img-top' />
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default Gallery;
