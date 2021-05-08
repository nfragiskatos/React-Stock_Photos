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
	const [ page, setPage ] = useState(1);
	const [ searchTerm, setSearchTerm ] = useState('');
	const [ currentQuery, setCurrentQuery ] = useState('');

	const fetchImages = async () => {
		setLoading(true);
		let url;
		const urlPage = `&page=${page}`;
		const urlQuery = `&query=${currentQuery}`;
		if (currentQuery) {
			url = `${searchUrl}${clientID}${urlPage}${urlQuery}`;
		} else {
			url = `${mainUrl}${clientID}${urlPage}`;
		}

		try {
			const response = await fetch(url);
			const data = await response.json();
			setPhotos((oldPhotos) => {
				if (currentQuery) {
					return page === 1 ? data.results : [ ...oldPhotos, ...data.results ];
				}
				return page === 1 ? data : [ ...oldPhotos, ...data ];
			});
			setLoading(false);
		} catch (error) {
			setLoading(false);
			console.log(error);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setCurrentQuery(searchTerm);
	};

	useEffect(
		() => {
			fetchImages();
		},
		[ page ]
	);

	useEffect(
		() => {
			if (page === 1) {
				fetchImages();
			} else {
				setPage(1);
			}
		},
		[ currentQuery ]
	);

	useEffect(() => {
		const event = window.addEventListener('scroll', () => {
			if (!loading && window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
				setPage((oldPage) => oldPage + 1);
			}
		});
		return () => window.removeEventListener('scroll', event);
	}, []);

	return (
		<main>
			<section className='search'>
				<form className='search-form'>
					<input
						type='text'
						placeholder='search'
						className='form-input'
						value={searchTerm}
						onChange={(e) => {
							setSearchTerm(e.target.value.trim());
						}}
					/>
					<button type='submit' className='submit-btn' onClick={handleSubmit}>
						<FaSearch />
					</button>
				</form>
			</section>
			<section className='photos'>
				<div className='photos-center'>
					{photos.map((photo) => {
						return <Photo key={photo.id} {...photo} />;
					})}
				</div>
				{loading && <h2 className='loading'>Loading...</h2>}
			</section>
		</main>
	);
}

export default App;
