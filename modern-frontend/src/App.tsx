import React, { useState, useEffect } from 'react';
import './App.css';

interface Postcard {
	id: number;
	city: string;
	imageUrl: string;
	prompt: string;
	imageKey: string;
}

function App() {
	const [city, setCity] = useState('');
	const [bearerToken, setBearerToken] = useState('secure-token');
	const [isGenerating, setIsGenerating] = useState(false);
	const [generatedPrompt, setGeneratedPrompt] = useState('');
	const [currentPostcard, setCurrentPostcard] = useState<Postcard | null>(null);
	const [gallery, setGallery] = useState<Postcard[]>([]);
	const [activeTab, setActiveTab] = useState<'generator' | 'gallery'>('generator');

	const API_BASE = '/api';

	useEffect(() => {
		fetchGallery();
	}, []);

	const fetchGallery = async () => {
		try {
			const response = await fetch(`${API_BASE}/gallery`);
			if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
				const postcards = await response.json();
				setGallery(postcards);
			} else {
				// API not available, use empty gallery
				console.log('Gallery no available');
				setGallery([]);
			}
		} catch (error) {
			console.log('Gallery not available');
			setGallery([]);
		}
	};

	const generatePrompt = async () => {
		if (!city.trim()) return;

		setIsGenerating(true);
		setGeneratedPrompt('');
		setCurrentPostcard(null);

		try {
			const response = await fetch(`${API_BASE}/generate/prompt`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${bearerToken}`,
				},
				body: JSON.stringify({ city: city.trim() }),
			});

			if (response.ok) {
				const data = await response.json();
				setGeneratedPrompt(data.prompt);

				if (data.id) {
					await generateImage(data.id);
				}
			} else {
				console.error('Error generating prompt:', response.statusText);
			}
		} catch (error) {
			console.error('Error generating prompt:', error);
		} finally {
			setIsGenerating(false);
		}
	};

	const generateImage = async (id: number) => {
		try {
			const response = await fetch(`${API_BASE}/generate/image/${id}`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${bearerToken}`,
				},
			});

			if (response.ok) {
				const postcard: Postcard = {
					id,
					city,
					imageUrl: `${API_BASE}/image/${id}`,
					prompt: generatedPrompt,
					imageKey: `${city}-${Date.now()}.png`,
				};
				setCurrentPostcard(postcard);
				fetchGallery();
			}
		} catch (error) {
			console.error('Error generating image:', error);
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		generatePrompt();
	};

	return (
		<div className="app">
			<header className="app-header">
				<h1>🌍 World Postcards</h1>
				<p>Generate AI-powered postcards from any city in the world</p>
			</header>

			<nav className="tab-nav">
				<button className={activeTab === 'generator' ? 'active' : ''} onClick={() => setActiveTab('generator')}>
					Generate Postcard
				</button>
				<button className={activeTab === 'gallery' ? 'active' : ''} onClick={() => setActiveTab('gallery')}>
					Gallery ({gallery.length})
				</button>
			</nav>

			{activeTab === 'generator' && (
				<div className="generator-section">
					<div className="token-form">
						<label htmlFor="bearer-token">Bearer Token:</label>
						<input
							id="bearer-token"
							type="text"
							value={bearerToken}
							onChange={(e) => setBearerToken(e.target.value)}
							placeholder="Enter your bearer token"
							disabled={isGenerating}
						/>
					</div>
					<form onSubmit={handleSubmit} className="city-form">
						<div className="input-group">
							<input
								type="text"
								value={city}
								onChange={(e) => setCity(e.target.value)}
								placeholder="Enter a city name (e.g., Paris, Tokyo, New York)"
								disabled={isGenerating}
								required
							/>
							<button type="submit" disabled={isGenerating || !city.trim() || !bearerToken.trim()}>
								{isGenerating ? 'Generating...' : 'Generate Postcard'}
							</button>
						</div>
					</form>

					{generatedPrompt && (
						<div className="prompt-display">
							<h3>Generated Prompt:</h3>
							<p>{generatedPrompt}</p>
						</div>
					)}

					{currentPostcard && (
						<div className="postcard-preview">
							<h3>Your New Postcard:</h3>
							<div className="postcard">
								<img src={currentPostcard.imageUrl} alt={`Postcard of ${currentPostcard.city}`} />
								<div className="postcard-info">
									<h4>{currentPostcard.city}</h4>
									<p className="postcard-prompt">{currentPostcard.prompt}</p>
								</div>
							</div>
						</div>
					)}

					{isGenerating && (
						<div className="loading">
							<div className="spinner"></div>
							<p>Generating your postcard...</p>
						</div>
					)}
				</div>
			)}

			{activeTab === 'gallery' && (
				<div className="gallery-section">
					<h2>Postcard Gallery</h2>
					{gallery.length === 0 ? (
						<p className="empty-gallery">No postcards yet. Generate your first one!</p>
					) : (
						<div className="gallery-grid">
							{gallery.map((postcard) => (
								<div key={postcard.id} className="gallery-item">
									<img src={postcard.imageUrl} alt={`Postcard of ${postcard.city}`} loading="lazy" />
									<div className="gallery-info">
										<h4>{postcard.city}</h4>
										<p>{postcard.prompt}</p>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
}

export default App;
