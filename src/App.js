import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import Photo from './Photo';
//
const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`;
const mainUrl = `https://api.unsplash.com/photos/`;
const searchUrl = `https://api.unsplash.com/search/photos/`;

function App () {
	const [ loading, setLoading ] = useState(false);
	const [ photos, setPhotos ] = useState([]);

	const fetchImages = async () => {
		setLoading(true);
		let url;
		url = `${mainUrl}${clientID}`;
		try {
			const response = await fetch(url);
			const data = await response.json();
			console.log(data);
			setPhotos(data);
		} catch (error) {
			setLoading(false);
			console.log(error);
		}
	};

	useEffect(() => {
		fetchImages();
	}, []);

	return (
		<section className='section'>
			<article className='photos photos-center'>
				{photos.map((photo) => {
					return (
						<div key={photo.id} className='photo'>
							<img src={photo.urls.small} alt={photo.alt_description} />
						</div>
					);
				})}
			</article>
		</section>
	);
}

export default App;
