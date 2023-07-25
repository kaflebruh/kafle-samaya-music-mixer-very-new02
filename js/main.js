(() => {
	// Get DOM elements
	let images = document.querySelectorAll('.image'),
	  dropZones = document.querySelectorAll('.dropZone'),
	  audio = document.querySelectorAll('.audio'),
	  pauseButton = document.querySelector('#pauseButton'),
	  rewindButton = document.querySelector('#rewindButton'),
	  droparea = document.querySelector('#enviro'),
	  song = document.querySelector('.songs'),
	  title = document.querySelector('.titleOverlayText'),
	  titleOverlay = document.querySelector('.titleOverlay'),
	  activeVector = [],
	  dropped = [],
	  activeSong = [],
	  vectorCon = document.querySelector('#vectors'),
	  unwantedAud = 0;
  
	// starting drasg and drop functionality
	initDrag();
  
	function initDrag() {
	  images.forEach(image => {
		// added 'dragstar' event lsisteners for all images
		image.addEventListener('dragstart', function (e) {
		  e.dataTransfer.effectAllowed = 'copy';
		  e.dataTransfer.setData('text/plain', this.id);
		  titleOverlay.classList.add('overlay'); // Changed 'gameOverlay' to 'titleOverlay'
		});
		
		// added 'dragend' event lsisteners for  images
		image.addEventListener('dragend', function (e) {
		  titleOverlay.classList.remove('overlay'); // Changed 'gameOverlay' to 'titleOverlay'
		});
	  });
	}
  
	// Handle drag over and drop
	dropZones.forEach(zone => {
	  zone.addEventListener('dragover', function (e) {
		e.preventDefault();
	  });
  
	  zone.addEventListener('drop', function (e) {
		if (zone.firstChild === null) {
		  e.preventDefault();
		  e.dataTransfer.dropEffect = 'copy';
		  let img = e.dataTransfer.getData('text/plain');
  
		  // Append the dragged image to the drop zone
		  e.target.appendChild(document.querySelector(`#${img}`));
		  let droppedImg = document.querySelector(`#${img}`);
		  dropped.push(droppedImg);
  
		  // Play audio associated with the dropped image
		  let track = document.querySelector(`audio[data-audioref="${img}"]`);
		  activeVector.push(track);
		  song.currentTime = 0;
		  activeVector.forEach(sound => {
			sound.currentTime = 0;
			sound.play();
		  });
		} else {
		  return;
		}
	  });
	});
  
	// Pause and play functionality start

	function pause() {
	  pauseButton.style.width = '25px';
  
	  // this is tp check if all the audio are paused or not
	  let allPaused = activeVector.every(sound => sound.paused);
	  let songPaused = song.paused;
  
	  if (allPaused && songPaused) {
		pauseButton.innerHTML = '&#xf04c;';
		activeVector.forEach(sound => sound.play());
		if (activeSong[0]) {
		  activeSong[0].play(); //this willl play any active song
		}
	  } else {
		pauseButton.innerHTML = '&#xf04b;';
		activeVector.forEach(sound => sound.pause());
		if (activeSong[0]) {
		  activeSong[0].pause(); //this willl pause any active song
		}
	  }
	}
  
	// Reset the drag and drop area
	function reset() {
	  images.forEach(image => vectorCon.appendChild(image));
	  activeVector.forEach(sound => sound.pause());
	  if (activeSong[0]) {
		activeSong[0].pause();
	  }
	  activeVector = [];
	  activeSong = [];
	}
  
	// Remove an icon from the drop zone
	function removeIcon() {
	  if (this.firstChild) {
		let unwanted = this.firstChild;
		vectorCon.appendChild(unwanted);
		let unwantedID = unwanted.id;
		let unwantedAud = document.querySelector(`audio[data-audioref="${unwantedID}"]`);
		unwantedAud.pause();
  
		let unwantedIndex = activeVector.findIndex(sound => sound === unwantedAud);
		activeVector.splice(unwantedIndex, 1);
	  }
	}
  
	// Event listeners
	//call the given function when clicked
	pauseButton.addEventListener('click', pause);
	rewindButton.addEventListener('click', reset);
	dropZones.forEach(zone => {
	  zone.addEventListener('click', removeIcon);
	});
  
  })();
  