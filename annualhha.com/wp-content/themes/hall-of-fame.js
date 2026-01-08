// ============================================
// DIGITAL HALL OF FAME - HONOREES & GALLERY
// Scroll Reveal Animations & Enhanced Lightbox
// ============================================

(function() {
	'use strict';
	
	// ============================================
	// 1. GOLDEN PARTICLE CANVAS BACKGROUND - OPTIMIZED
	// ============================================
	
	function initParticleCanvas() {
		// Check if canvas already exists
		let canvas = document.getElementById('golden-particles-canvas');
		if (!canvas) {
			canvas = document.createElement('canvas');
			canvas.id = 'golden-particles-canvas';
			canvas.className = 'golden-particles-canvas';
			// GPU acceleration hints
			canvas.style.willChange = 'transform';
			canvas.style.transform = 'translateZ(0)';
			canvas.style.position = 'fixed';
			canvas.style.top = '0';
			canvas.style.left = '0';
			canvas.style.width = '100%';
			canvas.style.height = '100%';
			canvas.style.pointerEvents = 'none';
			canvas.style.zIndex = '1';
			canvas.style.display = 'block';
			canvas.style.visibility = 'visible';
			canvas.style.opacity = '1';
			
			// Ensure body exists before appending
			if (document.body) {
				document.body.appendChild(canvas);
			} else {
				document.addEventListener('DOMContentLoaded', () => {
					document.body.appendChild(canvas);
				});
			}
		}
		
		const ctx = canvas.getContext('2d', { alpha: true });
		let particles = [];
		// Restored particle count - beautiful animation with performance optimizations
		const particleCount = 60;
		let animationId = null;
		let isVisible = !document.hidden;
		let lastFrameTime = 0;
		const targetFPS = 50; // Smooth animation with good performance
		const frameInterval = 1000 / targetFPS;
		
		// Get DPR for particle initialization
		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		
		function resizeCanvas() {
			// Use window dimensions directly for fixed canvas
			const width = window.innerWidth || 1920;
			const height = window.innerHeight || 1080;
			
			if (width && height && canvas) {
				canvas.width = width * dpr;
				canvas.height = height * dpr;
				ctx.scale(dpr, dpr);
				canvas.style.width = width + 'px';
				canvas.style.height = height + 'px';
			}
		}
		
		// Debounced resize handler
		let resizeTimeout;
		function handleResize() {
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(() => {
				resizeCanvas();
				// Reset particles on resize
				if (particles && particles.length > 0) {
					particles.forEach(particle => particle.reset());
				}
			}, 150);
		}
		
		// Initial resize - ensure canvas is ready
		// Wait for canvas to be in DOM
		const initCanvasSize = () => {
			if (canvas && canvas.parentElement) {
				resizeCanvas();
			} else {
				// Retry if canvas not in DOM yet
				setTimeout(initCanvasSize, 50);
			}
		};
		
		// Start size initialization
		if (document.body) {
			initCanvasSize();
		} else {
			document.addEventListener('DOMContentLoaded', initCanvasSize);
		}
		
		// Also resize on next frame to ensure correct size
		requestAnimationFrame(() => {
			resizeCanvas();
		});
		
		window.addEventListener('resize', handleResize, { passive: true });
		
		// Page visibility API - pause when tab is hidden
		document.addEventListener('visibilitychange', () => {
			isVisible = !document.hidden;
			if (isVisible && !animationId) {
				lastFrameTime = performance.now();
				animate(lastFrameTime);
			} else if (!isVisible && animationId) {
				cancelAnimationFrame(animationId);
				animationId = null;
			}
		});
		
		class Particle {
			constructor() {
				this.reset();
				// Initialize with random position on screen
				const height = window.innerHeight || 800;
				this.y = Math.random() * height;
			}
			
			reset() {
				const width = window.innerWidth || 1920;
				const height = window.innerHeight || 1080;
				this.x = Math.random() * width;
				this.y = height + Math.random() * 100;
				this.size = Math.random() * 3 + 1; // Original size range
				this.speed = Math.random() * 1.5 + 0.3; // Original speed range
				this.opacity = Math.random() * 0.4 + 0.2; // Original opacity range
				this.glow = Math.random() * 8 + 4; // Original glow range
			}
			
			update() {
				this.y -= this.speed;
				this.x += Math.sin(this.y * 0.01) * 0.3; // Original movement pattern
				
				const height = window.innerHeight || 1080;
				if (this.y < -this.size || this.y > height + 100) {
					this.reset();
				}
			}
			
			draw() {
				if (!ctx || !canvas) return;
				
				// Optimized: Gradient with subtle glow - performance optimized but visually rich
				ctx.save();
				ctx.globalAlpha = this.opacity;
				
				// Main gradient
				const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.glow);
				gradient.addColorStop(0, `rgba(197, 160, 89, ${this.opacity})`);
				gradient.addColorStop(0.5, `rgba(233, 211, 162, ${this.opacity * 0.4})`);
				gradient.addColorStop(1, `rgba(197, 160, 89, 0)`);
				
				ctx.fillStyle = gradient;
				ctx.beginPath();
				ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
				ctx.fill();
				
				// Subtle glow effect - optimized (single draw with lower blur)
				if (this.opacity > 0.25) {
					ctx.globalAlpha = this.opacity * 0.3;
					ctx.shadowBlur = 8; // Reduced from 12 for performance
					ctx.shadowColor = 'rgba(197, 160, 89, 0.5)'; // Reduced opacity
					ctx.fill();
					ctx.shadowBlur = 0;
				}
				
				ctx.restore();
			}
		}
		
		// Initialize particles after canvas is ready
		const createParticles = () => {
			particles = [];
			for (let i = 0; i < particleCount; i++) {
				particles.push(new Particle());
			}
		};
		
		function animate(currentTime) {
			if (!isVisible || !canvas || !canvas.parentElement || !particles || particles.length === 0) {
				animationId = null;
				return;
			}
			
			// Throttle to target FPS
			if (lastFrameTime === 0) {
				lastFrameTime = currentTime;
			}
			const elapsed = currentTime - lastFrameTime;
			if (elapsed < frameInterval) {
				animationId = requestAnimationFrame(animate);
				return;
			}
			lastFrameTime = currentTime - (elapsed % frameInterval);
			
			// Clear with optimization
			if (canvas.width > 0 && canvas.height > 0) {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				
				// Batch updates
				particles.forEach(particle => {
					particle.update();
					particle.draw();
				});
			}
			
			animationId = requestAnimationFrame(animate);
		}
		
		// Ensure canvas is in DOM before starting animation
		const ensureCanvasReady = () => {
			if (!canvas.parentElement && document.body) {
				document.body.appendChild(canvas);
			}
			return canvas && canvas.parentElement && canvas.width > 0 && canvas.height > 0;
		};
		
		// Start animation - ensure canvas and particles are ready
		if (isVisible) {
			// Wait for canvas to be in DOM, then create particles and start animation
			const startAnimation = () => {
				if (ensureCanvasReady()) {
					// Ensure canvas is visible
					canvas.style.display = 'block';
					canvas.style.visibility = 'visible';
					canvas.style.opacity = '1';
					
					// Create particles if not already created
					if (!particles || particles.length === 0) {
						createParticles();
					}
					
					// Start animation
					lastFrameTime = 0;
					const startTime = performance.now();
					animate(startTime);
				} else {
					// Retry after a short delay
					setTimeout(startAnimation, 50);
				}
			};
			
			// Start with delay to ensure everything is ready
			setTimeout(startAnimation, 250);
		}
		
		// Cleanup function
		return function cleanup() {
			if (animationId) {
				cancelAnimationFrame(animationId);
				animationId = null;
			}
			window.removeEventListener('resize', handleResize, { passive: true });
		};
	}
	
	// ============================================
	// 2. SCROLL REVEAL ANIMATIONS
	// ============================================
	
	function initScrollReveal() {
		const imageCards = document.querySelectorAll('.honorees-page .et_pb_image, .gallery-page .et_pb_image');
		
		if (!imageCards.length) return;
		
		const observerOptions = {
			root: null,
			rootMargin: '0px',
			threshold: 0.1
		};
		
		const observer = new IntersectionObserver(function(entries) {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					entry.target.classList.add('revealed');
					// Unobserve after revealing for performance
					observer.unobserve(entry.target);
				}
			});
		}, observerOptions);
		
		imageCards.forEach((card, index) => {
			// Stagger animation delays
			card.style.transitionDelay = `${(index % 12) * 0.1}s`;
			observer.observe(card);
		});
	}
	
	// ============================================
	// 3. ENHANCED LIGHTBOX FOR GALLERY
	// ============================================
	
	function initEnhancedLightbox() {
		const lightboxImages = document.querySelectorAll('.gallery-page .et_pb_lightbox_image');
		
		if (!lightboxImages.length) return;
		
		lightboxImages.forEach(link => {
			link.addEventListener('click', function(e) {
				e.preventDefault();
				
				const img = this.querySelector('img');
				if (!img) return;
				
				const imgSrc = this.getAttribute('href') || img.src;
				const imgTitle = this.getAttribute('title') || img.getAttribute('alt') || '';
				
				// Create lightbox overlay
				const overlay = document.createElement('div');
				overlay.className = 'lightbox-overlay active';
				overlay.style.cssText = `
					position: fixed;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					background: rgba(0, 0, 0, 0.95);
					backdrop-filter: blur(20px);
					-webkit-backdrop-filter: blur(20px);
					z-index: 9999;
					display: flex;
					align-items: center;
					justify-content: center;
					opacity: 0;
					transition: opacity 0.3s ease;
					cursor: pointer;
				`;
				
				// Create image container
				const imgContainer = document.createElement('div');
				imgContainer.className = 'lightbox-content';
				
				// Create image
				const lightboxImg = document.createElement('img');
				lightboxImg.src = imgSrc;
				lightboxImg.alt = imgTitle;
				
				// Create close button
				const closeBtn = document.createElement('span');
				closeBtn.className = 'lightbox-close';
				closeBtn.innerHTML = '×';
				
				// Assemble
				imgContainer.appendChild(lightboxImg);
				overlay.appendChild(closeBtn);
				overlay.appendChild(imgContainer);
				document.body.appendChild(overlay);
				
				// Trigger animation
				requestAnimationFrame(() => {
					overlay.style.opacity = '1';
				});
				
				// Close handlers
				function closeLightbox() {
					overlay.style.opacity = '0';
					setTimeout(() => {
						if (overlay.parentNode) {
							overlay.parentNode.removeChild(overlay);
						}
					}, 300);
				}
				
				overlay.addEventListener('click', function(e) {
					if (e.target === overlay || e.target === closeBtn) {
						closeLightbox();
					}
				});
				
				// Keyboard support
				function handleKeyPress(e) {
					if (e.key === 'Escape') {
						closeLightbox();
						document.removeEventListener('keydown', handleKeyPress);
					}
				}
				document.addEventListener('keydown', handleKeyPress);
			});
		});
	}
	
	// ============================================
	// 4. PAGE TYPE DETECTION
	// ============================================
	
	function setPageTypeClass() {
		const path = window.location.pathname || window.location.href;
		const body = document.body;
		
		// Check for honorees pages
		if (path.includes('/ahha-honorees/') || 
		    path.includes('/honorees/') ||
		    path.includes('honorees') ||
		    path.match(/\d{4}-honorees/)) {
			body.classList.add('honorees-page');
			body.classList.remove('gallery-page');
		} 
		// Check for gallery pages
		else if (path.includes('/gallery/') || 
		         path.includes('gallery') ||
		         path.match(/\d{4}-.*gallery/)) {
			body.classList.add('gallery-page');
			body.classList.remove('honorees-page');
		} 
		// Check for sponsors page - add particles animation
		else if (path.includes('/our-sponsors/') || 
		         path.includes('/sponsors/') ||
		         path.includes('sponsors')) {
			body.classList.add('sponsors-page');
			body.classList.remove('honorees-page', 'gallery-page');
		}
		// Default: try to detect by content
		else {
			const hasHonoreesContent = document.querySelector('.et_pb_section_1 .et_pb_toggle');
			const hasGalleryContent = document.querySelector('.et_pb_section_1 .et_pb_lightbox_image');
			
			if (hasGalleryContent) {
				body.classList.add('gallery-page');
				body.classList.remove('honorees-page');
			} else if (hasHonoreesContent) {
				body.classList.add('honorees-page');
				body.classList.remove('gallery-page');
			} else {
				body.classList.remove('honorees-page', 'gallery-page', 'sponsors-page');
			}
		}
	}
	
	// ============================================
	// 5. REPLACE TITLE IMAGE WITH PREMIUM TITLE
	// ============================================
	
	function replaceTitleImage() {
		// Find the title image
		const titleImage = document.querySelector('.et_pb_section_0 img[src*="honoreesTitle"], .et_pb_section_0 .et_pb_image img');
		
		if (titleImage) {
			const imageContainer = titleImage.closest('.et_pb_image, .et_pb_image_wrap');
			const rowContainer = titleImage.closest('.et_pb_row_0, .et_pb_column_0');
			
			// Create simple premium header block
			const luxuryBlock = document.createElement('div');
			luxuryBlock.className = 'luxury-header-block';
			
			// Main Title - Simple h1
			const mainTitle = document.createElement('h1');
			mainTitle.className = 'luxury-title';
			mainTitle.textContent = 'HOUSTON HUMANITARIAN HONOREES';
			
			// Assemble - Just the title
			luxuryBlock.appendChild(mainTitle);
			
			// Replace image with premium title block
			if (imageContainer) {
				imageContainer.innerHTML = '';
				imageContainer.appendChild(luxuryBlock);
				imageContainer.style.display = 'block';
			} else if (titleImage.parentElement) {
				titleImage.replaceWith(luxuryBlock);
			} else if (rowContainer) {
				const column = rowContainer.querySelector('.et_pb_column_0');
				if (column) {
					column.innerHTML = '';
					column.appendChild(luxuryBlock);
				}
			}
		}
	}
	
	// ============================================
	// 6. ADD PLAY BUTTON TO VIDEO
	// ============================================
	
	function addPlayButtonToVideo() {
		const videoBox = document.querySelector('.et_pb_section_1 .et_pb_video_box');
		const video = document.querySelector('.et_pb_section_1 .et_pb_video_box video');
		
		if (videoBox && video && !videoBox.querySelector('.luxury-play-button')) {
			// Create play button
			const playButton = document.createElement('div');
			playButton.className = 'luxury-play-button';
			playButton.setAttribute('aria-label', 'Play video');
			
			// Add click handler
			playButton.addEventListener('click', function(e) {
				e.preventDefault();
				if (video.paused) {
					video.play();
					videoBox.classList.add('playing');
				} else {
					video.pause();
					videoBox.classList.remove('playing');
				}
			});
			
			// Also click on video box
			videoBox.style.cursor = 'pointer';
			videoBox.addEventListener('click', function(e) {
				if (e.target === videoBox || e.target === video) {
					if (video.paused) {
						video.play();
						videoBox.classList.add('playing');
					} else {
						video.pause();
						videoBox.classList.remove('playing');
					}
				}
			});
			
			// Handle video events
			video.addEventListener('play', function() {
				videoBox.classList.add('playing');
			});
			
			video.addEventListener('pause', function() {
				videoBox.classList.remove('playing');
			});
			
			// Insert play button
			videoBox.style.position = 'relative';
			videoBox.appendChild(playButton);
		}
	}
	
	// ============================================
	// 5. INITIALIZATION - OPTIMIZED
	// ============================================
	
	let cleanupParticles = null;
	
		function init() {
		setPageTypeClass();
		
		// Initialize luxury header and video play button
		replaceTitleImage();
		addPlayButtonToVideo();
		
		const isHonoreesPage = document.body.classList.contains('honorees-page');
		const isGalleryPage = document.body.classList.contains('gallery-page');
		const isSponsorsPage = document.body.classList.contains('sponsors-page');
		
		if (isHonoreesPage || isGalleryPage || isSponsorsPage) {
			// Initialize particle canvas - restored with minimal delay
			// Small delay to prioritize content rendering and ensure DOM is ready
			setTimeout(() => {
				try {
					cleanupParticles = initParticleCanvas();
				} catch (error) {
					console.warn('Particle canvas initialization error:', error);
				}
			}, 200);
			
			// Initialize scroll reveal with intersection observer optimization
			if (document.readyState === 'loading') {
				document.addEventListener('DOMContentLoaded', () => {
					// Small delay to ensure DOM is fully ready
					setTimeout(initScrollReveal, 100);
				});
			} else {
				setTimeout(initScrollReveal, 100);
			}
			
			// Initialize enhanced lightbox (only for gallery)
			if (isGalleryPage) {
				if (document.readyState === 'loading') {
					document.addEventListener('DOMContentLoaded', initEnhancedLightbox);
				} else {
					initEnhancedLightbox();
				}
			}
		}
	}
	
	// Optimized initialization - wait for DOM ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init, { once: true });
	} else {
		// If already loaded, use setTimeout to avoid blocking
		setTimeout(init, 0);
	}
	
	// Cleanup on page unload
	window.addEventListener('beforeunload', () => {
		if (cleanupParticles) {
			cleanupParticles();
		}
	});
	
	// Re-run on pushState/popState for SPA-like navigation (if applicable)
	window.addEventListener('popstate', () => {
		setPageTypeClass();
		replaceTitleImage();
		addPlayButtonToVideo();
		init();
	});
	
})();
